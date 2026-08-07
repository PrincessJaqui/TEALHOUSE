import { CollectionPage } from '../components/CollectionPage';
import { Product } from '../App';

interface NewArrivalsProps {
  onProductClick: (product: Product) => void;
  onAddToWishlist: (product: Product) => void;
  isInWishlist: (productId: number) => boolean;
}

export function NewArrivals(props: NewArrivalsProps) {
  return (
    <CollectionPage
      title="New Arrivals"
      intro="The most recent additions to the house."
      filter="new"
      path="/new-arrivals"
      metaDescription="The newest TEALHOUSE pieces."
      {...props}
    />
  );
}
