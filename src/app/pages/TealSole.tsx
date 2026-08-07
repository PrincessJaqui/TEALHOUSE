import { CollectionPage } from '../components/CollectionPage';
import { Product } from '../App';

interface TealSoleProps {
  onProductClick: (product: Product) => void;
  onAddToWishlist: (product: Product) => void;
  isInWishlist: (productId: number) => boolean;
}

export function TealSole(props: TealSoleProps) {
  return (
    <CollectionPage
      title="Signature Teal Sole"
      intro="The mark of a TEALHOUSE piece."
      filter="all"
      path="/teal-sole"
      metaDescription="The TEALHOUSE signature teal sole."
      {...props}
    />
  );
}
