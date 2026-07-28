import { ProductGrid } from '../components/ProductGrid';
import { Product } from '../App';

interface TealSoleProps {
  onProductClick: (product: Product) => void;
  onAddToWishlist: (product: Product) => void;
  isInWishlist: (productId: number) => boolean;
}

export function TealSole({ onProductClick, onAddToWishlist, isInWishlist }: TealSoleProps) {
  return (
    <div className="min-h-screen bg-white pt-20">
      {/* Hero Section */}
      <div className="bg-[#008080] text-white py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl mb-6">Signature Teal Sole</h1>
          <p className="text-xl max-w-2xl mx-auto opacity-90">
            Our iconic teal sole. A symbol of sustainable luxury that defines every TEALHOUSE creation.
            Made from natural rubber, designed to last.
          </p>
        </div>
      </div>

      {/* Story Section */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="prose prose-lg max-w-none">
          <h2 className="text-3xl mb-6">The Story Behind the Teal</h2>
          <p className="text-gray-700 mb-4">
            Every TEALHOUSE shoe and accessory bears our signature teal sole—a distinctive mark that represents
            our commitment to sustainable luxury. This isn't just a design choice; it's a statement.
          </p>
          <p className="text-gray-700 mb-4">
            The teal color was chosen to symbolize the balance between earth and ocean, representing our dedication
            to protecting both. Our soles are crafted from natural rubber sourced from sustainable plantations,
            processed without harmful chemicals.
          </p>
          <p className="text-gray-700 mb-8">
            When you see the teal sole, you know you're wearing a piece of TEALHOUSE history—handmade in Italy,
            designed in Kansas City, and created with respect for our planet.
          </p>

          <div className="grid md:grid-cols-3 gap-8 my-12">
            <div className="text-center">
              <div className="text-4xl mb-3">🌱</div>
              <h3 className="text-xl font-semibold mb-2">Natural Rubber</h3>
              <p className="text-gray-600">Sustainably sourced, biodegradable</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-3">🎨</div>
              <h3 className="text-xl font-semibold mb-2">Iconic Design</h3>
              <p className="text-gray-600">Instantly recognizable worldwide</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-3">♻️</div>
              <h3 className="text-xl font-semibold mb-2">Eco-Friendly</h3>
              <p className="text-gray-600">Zero toxic chemicals used</p>
            </div>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl text-center mb-12">Shop the Collection</h2>
          <ProductGrid 
            filter="all"
            onProductClick={onProductClick}
            onAddToWishlist={onAddToWishlist}
            isInWishlist={isInWishlist}
          />
        </div>
      </div>

      {/* Care Section */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl mb-6">Caring for Your Teal Sole</h2>
        <div className="space-y-4">
          <div className="flex gap-4">
            <div className="w-2 h-2 bg-[#008080] rounded-full mt-2 flex-shrink-0"></div>
            <p className="text-gray-700">Clean with a damp cloth and mild soap</p>
          </div>
          <div className="flex gap-4">
            <div className="w-2 h-2 bg-[#008080] rounded-full mt-2 flex-shrink-0"></div>
            <p className="text-gray-700">Avoid harsh chemicals or abrasive materials</p>
          </div>
          <div className="flex gap-4">
            <div className="w-2 h-2 bg-[#008080] rounded-full mt-2 flex-shrink-0"></div>
            <p className="text-gray-700">Store in a cool, dry place away from direct sunlight</p>
          </div>
          <div className="flex gap-4">
            <div className="w-2 h-2 bg-[#008080] rounded-full mt-2 flex-shrink-0"></div>
            <p className="text-gray-700">The natural rubber will develop a beautiful patina over time</p>
          </div>
        </div>
      </div>
    </div>
  );
}
