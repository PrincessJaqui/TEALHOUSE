import { ProductGrid } from './ProductGrid';
import { Seo } from './Seo';
import { Product } from '../App';
import { productMatchesFilter, type FilterKey } from '../config/taxonomy';
import { useSupabaseProducts } from '../hooks/useSupabaseProducts';
import { getPrimaryProductImage } from '../lib/default-image';

/**
 * One layout for every collection page.
 *
 * Footwear, Accents and Resort Wear were three copies of the same markup,
 * which is how they drifted apart. They share this now, so a change to one
 * is a change to all three and they cannot diverge again.
 */

export interface CollectionHighlight {
  title: string;
  body: string;
}

interface CollectionPageProps {
  title: string;
  intro: string;
  /** Which products belong here. */
  filter: FilterKey;
  path: string;
  metaDescription: string;
  /** The three panels beneath the grid. Omit for none. */
  highlights?: CollectionHighlight[];
  onProductClick: (product: Product) => void;
  onAddToWishlist: (product: Product) => void;
  isInWishlist: (productId: number) => boolean;
}

export function CollectionPage({
  title,
  intro,
  filter,
  path,
  metaDescription,
  highlights,
  onProductClick,
  onAddToWishlist,
  isInWishlist,
}: CollectionPageProps) {
  // Sharing a collection should show what is in it. The first product in
  // the order she arranged is the one that represents it.
  const { products } = useSupabaseProducts();
  const first = products.find(
    (product) =>
      product.is_published !== false &&
      productMatchesFilter(product, filter)
  );
  const shareImage = first ? getPrimaryProductImage(first) : undefined;

  return (
    <div className="min-h-screen bg-white">
      <Seo
        title={title}
        description={metaDescription}
        path={path}
        image={shareImage}
      />

      {/* No banner. The heading matches the rest of the site rather than
          sitting in a coloured block. */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-[4.5rem]">
        <h1 className="uppercase tracking-wider mb-3">{title}</h1>
        <p className="text-sm text-gray-600 max-w-2xl mx-auto">{intro}</p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 pt-0">
        <ProductGrid
          filter={filter}
          onProductClick={onProductClick}
          onAddToWishlist={onAddToWishlist}
          isInWishlist={isInWishlist}
        />
      </div>

      {highlights && highlights.length > 0 && (
        <div className="bg-gray-50 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-3 gap-8 text-center">
              {highlights.map((highlight) => (
                <div key={highlight.title}>
                  <h3 className="text-xl font-semibold mb-3">{highlight.title}</h3>
                  <p className="text-gray-600">{highlight.body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
