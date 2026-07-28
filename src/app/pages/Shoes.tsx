import { ProductGrid } from '../components/ProductGrid';
import { Product } from '../App';

interface ShoesProps {
  onProductClick: (product: Product) => void;
  onAddToWishlist: (product: Product) => void;
  isInWishlist: (productId: number) => boolean;
}

export function Shoes({ onProductClick, onAddToWishlist, isInWishlist }: ShoesProps) {
  return (
    <div className="min-h-screen bg-white pt-20">
      {/* Hero Section */}
      <div className="bg-[#008080] text-white py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl mb-6">Our Footwear Collection</h1>
          <p className="text-xl max-w-2xl mx-auto opacity-90">
            Luxury shoes crafted from plants. Handmade in Italy with our signature teal soles.
            Experience the future of sustainable luxury footwear.
          </p>
        </div>
      </div>

      {/* Products Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <ProductGrid 
          filter="shoes"
          onProductClick={onProductClick}
          onAddToWishlist={onAddToWishlist}
          isInWishlist={isInWishlist}
        />
      </div>

      {/* Info Section */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <h3 className="text-xl font-semibold mb-3">Plant-Based Materials</h3>
              <p className="text-gray-600">
                Crafted from cactus leather and natural rubbers, with zero animal products.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-3">Italian Craftsmanship</h3>
              <p className="text-gray-600">
                Each pair handmade in our Italian workshop by master artisans.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-3">Signature Teal Sole</h3>
              <p className="text-gray-600">
                Every TEALHOUSE shoe features our iconic teal sole, a mark of sustainable luxury.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
