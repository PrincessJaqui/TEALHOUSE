import { Hero } from '../components/Hero';
import { ProductGrid } from '../components/ProductGrid';
import { ServiceFeatures } from '../components/ServiceFeatures';
import { Product } from '../App';

interface HomeProps {
  onProductClick: (product: Product) => void;
  onAddToWishlist: (product: Product) => void;
  isInWishlist: (productId: number) => boolean;
}

export function Home({ onProductClick, onAddToWishlist, isInWishlist }: HomeProps) {
  return (
    <>
      <Hero />
      <ProductGrid onProductClick={onProductClick} onAddToWishlist={onAddToWishlist} isInWishlist={isInWishlist} />
      <ServiceFeatures />
      {/* TEALHOUSE Logo Section */}
      <section className="bg-white py-16 border-t border-gray-200">
        <div className="max-w-[1200px] mx-auto px-5 text-center">
          <h3 className="tracking-[0.4em] text-sm">TEALHOUSE</h3>
        </div>
      </section>
    </>
  );
}