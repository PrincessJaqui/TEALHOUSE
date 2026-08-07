import { CollectionPage } from '../components/CollectionPage';
import { Product } from '../App';

interface AccessoriesProps {
  onProductClick: (product: Product) => void;
  onAddToWishlist: (product: Product) => void;
  isInWishlist: (productId: number) => boolean;
}

export function Accessories(props: AccessoriesProps) {
  return (
    <CollectionPage
      title="Accents"
      intro="Considered pieces to finish a look, made with the same craftsmanship as our footwear."
      filter="accessories"
      path="/accessories"
      metaDescription="Plant-based accents and accessories from TEALHOUSE."
      highlights={[
        {
          title: 'Plant-Based Materials',
          body: 'Crafted from cactus leather and natural rubbers, with zero animal products.',
        },
        {
          title: 'Italian Craftsmanship',
          body: 'Handmade in our Italian workshop by master artisans.',
        },
        {
          title: 'Entirely Vegan',
          body: 'No animal products anywhere, and no animal testing at any stage.',
        },
      ]}
      {...props}
    />
  );
}
