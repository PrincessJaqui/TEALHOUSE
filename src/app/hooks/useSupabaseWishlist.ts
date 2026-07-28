import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Product } from '../App';
import { products } from '../data/products';

const WISHLIST_STORAGE_KEY = 'tealhouse_wishlist';

export function useSupabaseWishlist(userId: string | undefined) {
  const [wishlistItems, setWishlistItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Load wishlist from Supabase or localStorage
  useEffect(() => {
    if (userId) {
      loadWishlist();
    } else {
      // Load from localStorage when no user
      loadFromLocalStorage();
    }
  }, [userId]);

  // Save to localStorage whenever wishlist changes (if no userId)
  useEffect(() => {
    if (!userId && !loading) {
      saveToLocalStorage();
    }
  }, [wishlistItems, userId, loading]);

  const loadFromLocalStorage = () => {
    try {
      const stored = localStorage.getItem(WISHLIST_STORAGE_KEY);
      if (stored) {
        const productIds = JSON.parse(stored);
        // Validate that products still exist
        const validProducts = productIds
          .map((id: number) => products.find(p => p.id === id))
          .filter(Boolean) as Product[];
        setWishlistItems(validProducts);
      }
    } catch (error) {
      console.error('Error loading wishlist from localStorage:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveToLocalStorage = () => {
    try {
      const productIds = wishlistItems.map(item => item.id);
      localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(productIds));
    } catch (error) {
      console.error('Error saving wishlist to localStorage:', error);
    }
  };

  const loadWishlist = async () => {
    if (!userId) return;

    try {
      const { data, error } = await supabase
        .from('wishlist')
        .select('product_id')
        .eq('user_id', userId);

      if (error) throw error;

      if (data) {
        const productIds = data.map(item => item.product_id);
        const wishlistProducts = products.filter(p => productIds.includes(p.id));
        setWishlistItems(wishlistProducts);
      }
    } catch (error) {
      console.error('Error loading wishlist:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToWishlist = async (product: Product) => {
    // Check if already in wishlist
    if (wishlistItems.some(item => item.id === product.id)) {
      return true;
    }

    // Optimistic update
    setWishlistItems(prev => [...prev, product]);

    // If no user, localStorage save happens automatically
    if (!userId) return true;

    // With user, save to Supabase
    try {
      const { error } = await supabase
        .from('wishlist')
        .insert({
          user_id: userId,
          product_id: product.id
        });

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      // Rollback on error
      setWishlistItems(prev => prev.filter(item => item.id !== product.id));
      return false;
    }
  };

  const removeFromWishlist = async (productId: number) => {
    // Optimistic update
    const previousItems = wishlistItems;
    setWishlistItems(prev => prev.filter(item => item.id !== productId));

    // If no user, localStorage save happens automatically
    if (!userId) return true;

    // With user, remove from Supabase
    try {
      const { error } = await supabase
        .from('wishlist')
        .delete()
        .eq('user_id', userId)
        .eq('product_id', productId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      // Rollback on error
      setWishlistItems(previousItems);
      return false;
    }
  };

  const isInWishlist = (productId: number) => {
    return wishlistItems.some(item => item.id === productId);
  };

  return {
    wishlistItems,
    loading,
    addToWishlist,
    removeFromWishlist,
    isInWishlist
  };
}
