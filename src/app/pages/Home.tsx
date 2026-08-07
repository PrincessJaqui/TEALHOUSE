import { Seo } from '../components/Seo';
import { ServiceFeatures } from '../components/ServiceFeatures';
import { Product } from '../App';
import { useInterfaceStudio } from '../hooks/useInterfaceStudio';
import { useSupabaseProducts } from '../hooks/useSupabaseProducts';
import {
  StudioHero,
  StudioEditorial,
  StudioSplit,
  StudioCarousel,
  StudioSpotlight,
} from '../components/StudioSections';

interface HomeProps {
  onProductClick: (product: Product) => void;
  onAddToWishlist: (product: Product) => void;
  isInWishlist: (productId: number) => boolean;
}

/**
 * The landing page is composed from Studio, so its imagery, film
 * and wording are edited in the admin rather than in this file.
 *
 * Products come from whatever is ticked as featured. Every section hides
 * itself when it has nothing, so a studio filled in over several sittings
 * always produces a coherent page.
 */
export function Home(_props: HomeProps) {
  const { get, isActive } = useInterfaceStudio();
  const { products } = useSupabaseProducts();

  const featured = products.filter(
    (product) => product.is_featured && product.is_published !== false
  );

  return (
    <>
      <Seo
        title="TEALHOUSE"
        description="Luxury vegan shoes, resort wear and accents made from plants, with our signature teal sole."
        path="/"
      />

      {isActive('hero') && <StudioHero content={get('hero')} />}
      {isActive('editorial') && <StudioEditorial content={get('editorial')} />}
      {isActive('split_one') && <StudioSplit content={get('split_one')} />}
      {isActive('carousel') && (
        <StudioCarousel content={get('carousel')} products={featured} />
      )}
      {isActive('split_two') && <StudioSplit content={get('split_two')} />}
      {isActive('spotlight') && (
        <StudioSpotlight content={get('spotlight')} products={featured} />
      )}

      <ServiceFeatures />

      <section className="bg-white py-16 border-t border-gray-200">
        <div className="max-w-[1200px] mx-auto px-5 text-center">
          <h3 className="tracking-[0.4em] text-sm">TEALHOUSE</h3>
        </div>
      </section>
    </>
  );
}
