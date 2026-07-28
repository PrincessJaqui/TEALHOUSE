import { ProductGrid } from '../components/ProductGrid';
import { Product } from '../App';

interface MensShoesProps {
  onProductClick: (product: Product) => void;
  onAddToWishlist: (product: Product) => void;
  isInWishlist: (productId: number) => boolean;
}

export function MensShoes({ onProductClick, onAddToWishlist, isInWishlist }: MensShoesProps) {
  return (
    <div className="min-h-screen bg-white pt-20">
      {/* Hero Section */}
      <div className="bg-[#008080] text-white py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl mb-6">Men's Collection</h1>
          <p className="text-xl max-w-2xl mx-auto opacity-90">
            Sophisticated vegan footwear designed for the modern gentleman.
            Luxury craftsmanship meets plant-based innovation.
          </p>
        </div>
      </div>

      {/* Products Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <ProductGrid 
          filter="mens"
          onProductClick={onProductClick}
          onAddToWishlist={onAddToWishlist}
          isInWishlist={isInWishlist}
        />
      </div>
    </div>
  );
}
