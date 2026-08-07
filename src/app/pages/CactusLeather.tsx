import { CollectionPage } from '../components/CollectionPage';
import { Product } from '../App';

interface CactusLeatherProps {
  onProductClick: (product: Product) => void;
  onAddToWishlist: (product: Product) => void;
  isInWishlist: (productId: number) => boolean;
}

export function CactusLeather(props: CactusLeatherProps) {
  return (
    <CollectionPage
      title="Cactus Leather"
      intro="Supple, durable and entirely plant-based."
      filter="cactus-leather"
      path="/cactus-leather"
      metaDescription="TEALHOUSE pieces made from cactus leather."
      {...props}
    />
  );
}
