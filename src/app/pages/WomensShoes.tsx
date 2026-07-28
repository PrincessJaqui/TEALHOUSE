import { ProductGrid } from '../components/ProductGrid';
import { Product } from '../App';

interface WomensShoesProps {
  onProductClick: (product: Product) => void;
  onAddToWishlist: (product: Product) => void;
  isInWishlist: (productId: number) => boolean;
}

export function WomensShoes({ onProductClick, onAddToWishlist, isInWishlist }: WomensShoesProps) {
  return (
    <div className="min-h-screen bg-white pt-20">
      {/* Hero Section */}
      <div className="bg-[#008080] text-white py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl mb-6">Women's Collection</h1>
          <p className="text-xl max-w-2xl mx-auto opacity-90">
            Elegant vegan footwear for the discerning woman.
            Where Italian craftsmanship meets sustainable luxury.
          </p>
        </div>
      </div>

      {/* Products Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <ProductGrid 
          filter="womens"
          onProductClick={onProductClick}
          onAddToWishlist={onAddToWishlist}
          isInWishlist={isInWishlist}
        />
      </div>
    </div>
  );
}
