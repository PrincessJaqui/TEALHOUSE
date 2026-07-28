import { ProductGrid } from '../components/ProductGrid';
import { Product } from '../App';

interface BestSellersProps {
  onProductClick: (product: Product) => void;
  onAddToWishlist: (product: Product) => void;
  isInWishlist: (productId: number) => boolean;
}

export function BestSellers({ onProductClick, onAddToWishlist, isInWishlist }: BestSellersProps) {
  return (
    <div className="min-h-screen bg-white pt-20">
      {/* Hero Section */}
      <div className="bg-[#008080] text-white py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl mb-6">Best Sellers</h1>
          <p className="text-xl max-w-2xl mx-auto opacity-90">
            Our most coveted designs. These customer favorites showcase
            why TEALHOUSE is redefining luxury footwear.
          </p>
        </div>
      </div>

      {/* Products Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <ProductGrid 
          filter="bestseller"
          onProductClick={onProductClick}
          onAddToWishlist={onAddToWishlist}
          isInWishlist={isInWishlist}
        />
      </div>
    </div>
  );
}
