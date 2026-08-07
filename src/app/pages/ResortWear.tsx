import { ProductGrid } from '../components/ProductGrid';
import { Seo } from '../components/Seo';
import { Product } from '../App';

interface ResortWearProps {
  onProductClick: (product: Product) => void;
  onAddToWishlist: (product: Product) => void;
  isInWishlist: (productId: number) => boolean;
}

/**
 * Resort Wear. Copies the Footwear page pattern rather than inventing a new
 * one, so the two collections read as one shop.
 */
export function ResortWear({
  onProductClick,
  onAddToWishlist,
  isInWishlist,
}: ResortWearProps) {
  return (
    <div className="min-h-screen bg-white pt-20">
      <Seo
        title="Resort Wear"
        description="Plant-based resort wear from TEALHOUSE, made for warm weather and long days."
        path="/resort-wear"
      />

      <div className="bg-[#008080] text-white py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl mb-6">Resort Wear</h1>
          <p className="text-xl max-w-2xl mx-auto opacity-90">
            Pieces made for warm weather and long days, in the same plant-based
            materials as everything we make.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <ProductGrid
          filter="resort-wear"
          onProductClick={onProductClick}
          onAddToWishlist={onAddToWishlist}
          isInWishlist={isInWishlist}
        />
      </div>
    </div>
  );
}
