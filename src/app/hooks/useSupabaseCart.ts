import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Product, CartItem } from '../App';
import type { SizeSelection } from '../config/taxonomy';
import { products } from '../data/products';

const CART_STORAGE_KEY = 'tealhouse_cart';

export function useSupabaseCart(userId: string | undefined) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Load cart from Supabase or localStorage
  useEffect(() => {
    if (userId) {
      loadCart();
    } else {
      // Load from localStorage when no user
      loadFromLocalStorage();
    }
  }, [userId]);

  // Save to localStorage whenever cart changes (if no userId)
  useEffect(() => {
    if (!userId && !loading) {
      saveToLocalStorage();
    }
  }, [cartItems, userId, loading]);

  const loadFromLocalStorage = () => {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      if (stored) {
        const data = JSON.parse(stored);
        // Validate that products still exist
        const validCartItems = data
          .map((item: any) => {
            const product = products.find(p => p.id === item.productId);
            if (!product) return null;
            return {
              product,
              quantity: item.quantity,
              size: item.size
            };
          })
          .filter(Boolean) as CartItem[];
        setCartItems(validCartItems);
      }
    } catch (error) {
      console.error('Error loading cart from localStorage:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveToLocalStorage = () => {
    try {
      const data = cartItems.map(item => ({
        productId: item.product.id,
        quantity: item.quantity,
        size: item.size
      }));
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error('Error saving cart to localStorage:', error);
    }
  };

  const loadCart = async () => {
    if (!userId) return;

    try {
      const { data, error } = await supabase
        .from('cart')
        .select('*')
        .eq('user_id', userId);

      if (error) throw error;

      if (data) {
        const cartProducts: CartItem[] = data.map(item => {
          const product = products.find(p => p.id === item.product_id);
          if (!product) return null;
          
          return {
            product,
            quantity: item.quantity,
            size: item.size || undefined,
            notes: item.notes || undefined
          };
        }).filter(Boolean) as CartItem[];
        
        setCartItems(cartProducts);
      }
    } catch (error) {
      console.error('Error loading cart:', error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * A cart line is identified by the product plus everything the customer
   * chose. For a bikini that is two sizes, so Top S with Bottom M is a
   * different line from Top S with Bottom L.
   */
  const lineKey = (
    productId: number,
    size?: string,
    sizes?: SizeSelection,
    notes?: string
  ) => {
    const selection = sizes
      ? Object.keys(sizes)
          .sort()
          .map((k) => `${k}=${sizes[k]}`)
          .join('|')
      : '';
    return `${productId}::${size ?? ''}::${selection}::${notes ?? ''}`;
  };

  const matches = (
    item: CartItem,
    productId: number,
    size?: string,
    sizes?: SizeSelection,
    notes?: string
  ) =>
    lineKey(item.product.id, item.size, item.sizes, item.notes) ===
    lineKey(productId, size, sizes, notes);

  const addToCart = async (
    product: Product,
    size?: string,
    sizes?: SizeSelection,
    notes?: string
  ) => {
    const existingItem = cartItems.find((item) =>
      matches(item, product.id, size, sizes, notes)
    );

    if (existingItem) {
      return updateQuantity(product.id, existingItem.quantity + 1, size, sizes, notes);
    }

    const newItem: CartItem = { product, quantity: 1, size, sizes, notes };
    setCartItems((prev) => [...prev, newItem]);

    if (!userId) return true;

    try {
      const { error } = await supabase.from('cart').insert({
        user_id: userId,
        product_id: product.id,
        quantity: 1,
        size: size || null,
        sizes: sizes ?? null,
        notes: notes || null,
      });

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error adding to cart:', error);
      setCartItems((prev) =>
        prev.filter((item) => !matches(item, product.id, size, sizes, notes))
      );
      return false;
    }
  };

  const removeFromCart = async (
    productId: number,
    size?: string,
    sizes?: SizeSelection,
    notes?: string
  ) => {
    const previousItems = cartItems;
    setCartItems((prev) =>
      prev.filter((item) => !matches(item, productId, size, sizes, notes))
    );

    if (!userId) return true;

    try {
      let query = supabase
        .from('cart')
        .delete()
        .eq('user_id', userId)
        .eq('product_id', productId);

      query = size ? query.eq('size', size) : query.is('size', null);
      if (sizes) query = query.eq('sizes', sizes as any);

      const { error } = await query;

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error removing from cart:', error);
      setCartItems(previousItems);
      return false;
    }
  };

  const updateQuantity = async (
    productId: number,
    quantity: number,
    size?: string,
    sizes?: SizeSelection,
    notes?: string
  ) => {
    if (quantity === 0) {
      return removeFromCart(productId, size, sizes, notes);
    }

    const previousItems = cartItems;
    setCartItems((prev) =>
      prev.map((item) =>
        matches(item, productId, size, sizes, notes) ? { ...item, quantity } : item
      )
    );

    if (!userId) return true;

    try {
      let query = supabase
        .from('cart')
        .update({ quantity })
        .eq('user_id', userId)
        .eq('product_id', productId);

      query = size ? query.eq('size', size) : query.is('size', null);
      if (sizes) query = query.eq('sizes', sizes as any);

      const { error } = await query;

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error updating quantity:', error);
      setCartItems(previousItems);
      return false;
    }
  };

  const clearCart = async () => {
    // Optimistic update
    const previousItems = cartItems;
    setCartItems([]);

    // If no user, localStorage save happens automatically
    if (!userId) return true;

    // With user, clear from Supabase
    try {
      const { error } = await supabase
        .from('cart')
        .delete()
        .eq('user_id', userId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error clearing cart:', error);
      // Rollback on error
      setCartItems(previousItems);
      return false;
    }
  };

  return {
    cartItems,
    loading,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart
  };
}
