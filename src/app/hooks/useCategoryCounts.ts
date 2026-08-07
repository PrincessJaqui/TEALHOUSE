import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

/**
 * Which categories actually have something to sell.
 *
 * A navigation link to an empty page is worse than no link: a customer
 * clicks through, finds nothing, and reads the brand as unfinished. Links
 * appear once their category has at least one published product.
 *
 * One small query on load, counting nothing but the category arrays.
 */
export function useCategoryCounts() {
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    (async () => {
      const { data, error } = await supabase
        .from('products')
        .select('categories')
        .eq('is_published', true);

      if (!active) return;

      if (error) {
        console.error('Error counting categories:', error);
        setLoading(false);
        return;
      }

      const tally: Record<string, number> = {};
      for (const row of data ?? []) {
        for (const category of row.categories ?? []) {
          const key = String(category).toLowerCase();
          tally[key] = (tally[key] ?? 0) + 1;
        }
      }

      setCounts(tally);
      setLoading(false);
    })();

    return () => {
      active = false;
    };
  }, []);

  /**
   * True once the category has something in it.
   *
   * While the count is still loading this returns false, so a link never
   * flashes in and then disappears.
   */
  const hasProducts = (category: string): boolean =>
    (counts[category.toLowerCase()] ?? 0) > 0;

  return { counts, loading, hasProducts };
}
