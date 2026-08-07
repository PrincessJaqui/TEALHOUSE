import { ProductGrid } from './ProductGrid';
import { Seo } from './Seo';
import { Product } from '../App';
import type { FilterKey } from '../config/taxonomy';

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
  return (
    <div className="min-h-screen bg-white pt-20">
      <Seo title={title} description={metaDescription} path={path} />

      <div className="bg-[#008080] text-white py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl mb-6">{title}</h1>
          <p className="text-xl max-w-2xl mx-auto opacity-90">{intro}</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
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
