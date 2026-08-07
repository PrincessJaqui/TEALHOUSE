import { CollectionPage } from '../components/CollectionPage';
import { Product } from '../App';

interface ShoesProps {
  onProductClick: (product: Product) => void;
  onAddToWishlist: (product: Product) => void;
  isInWishlist: (productId: number) => boolean;
}

export function Shoes(props: ShoesProps) {
  return (
    <CollectionPage
      title="Footwear"
      intro="Designed in Kansas City. Made in Italy."
      filter="shoes"
      path="/shoes"
      metaDescription="Vegan luxury footwear in cactus leather, handmade in Italy."
      highlights={[
        {
          title: 'Plant-Based Materials',
          body: 'Crafted from cactus leather and natural rubbers, with zero animal products.',
        },
        {
          title: 'Italian Craftsmanship',
          body: 'Each pair handmade in our Italian workshop by master artisans.',
        },
        {
          title: 'Signature Teal Sole',
          body: 'Every TEALHOUSE shoe features our iconic teal sole, a mark of sustainable luxury.',
        },
      ]}
      {...props}
    />
  );
}
