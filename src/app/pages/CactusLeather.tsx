import { ProductGrid } from '../components/ProductGrid';
import { Product } from '../App';

interface CactusLeatherProps {
  onProductClick: (product: Product) => void;
  onAddToWishlist: (product: Product) => void;
  isInWishlist: (productId: number) => boolean;
}

export function CactusLeather({ onProductClick, onAddToWishlist, isInWishlist }: CactusLeatherProps) {
  return (
    <div className="min-h-screen bg-white pt-20">
      {/* Hero Section */}
      <div className="bg-[#008080] text-white py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl mb-6">Cactus Leather Collection</h1>
          <p className="text-xl max-w-2xl mx-auto opacity-90">
            Discover our signature cactus leather pieces. Sustainable, durable, and luxuriously soft.
            Nature's innovation meets Italian craftsmanship.
          </p>
        </div>
      </div>

      {/* Info Section */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="prose prose-lg max-w-none">
          <h2 className="text-3xl mb-6">What is Cactus Leather?</h2>
          <p className="text-gray-700 mb-4">
            Cactus leather is a revolutionary plant-based material made from Nopal cactus. This sustainable alternative
            to animal leather requires minimal water, no harmful chemicals, and regenerates naturally.
          </p>
          <p className="text-gray-700 mb-8">
            Our cactus leather is sourced from organic farms and processed using eco-friendly methods, resulting in
            a material that is soft, durable, and breathable—perfect for luxury footwear.
          </p>

          <div className="grid md:grid-cols-3 gap-8 my-12">
            <div className="text-center">
              <div className="text-4xl mb-3">🌵</div>
              <h3 className="text-xl font-semibold mb-2">Sustainable</h3>
              <p className="text-gray-600">Requires 98% less water than leather</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-3">💪</div>
              <h3 className="text-xl font-semibold mb-2">Durable</h3>
              <p className="text-gray-600">Lasts for years with proper care</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-3">🌿</div>
              <h3 className="text-xl font-semibold mb-2">Biodegradable</h3>
              <p className="text-gray-600">Returns to earth naturally</p>
            </div>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl text-center mb-12">Shop Cactus Leather</h2>
          <ProductGrid 
            filter="cactus-leather"
            onProductClick={onProductClick}
            onAddToWishlist={onAddToWishlist}
            isInWishlist={isInWishlist}
          />
        </div>
      </div>
    </div>
  );
}
