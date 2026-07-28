import { useState, useEffect } from 'react';
import { supabase, DbProduct } from '../lib/supabase';
import { Product } from '../App';

export function useSupabaseProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchError) {
        console.error('Error loading products from Supabase:', fetchError);
        setError(fetchError.message);
        setProducts([]);
        return;
      }

      if (data && data.length > 0) {
        // Format products from database
        const formattedProducts: Product[] = data.map((p: DbProduct) => ({
          id: p.id!,
          name: p.name,
          price: p.price,
          image: p.image || (p.images && p.images[0]) || '',
          images: p.images,
          video: p.video,
          categories: p.categories,
          audience: p.audience,
          description: p.description,
          materials: p.materials,
          sizes: p.sizes
        }));
        setProducts(formattedProducts);
      } else {
        // No products in database
        setProducts([]);
      }
    } catch (err) {
      console.error('Unexpected error loading products:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  return {
    products,
    loading,
    error,
    refresh: loadProducts
  };
}