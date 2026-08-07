import { CollectionPage } from '../components/CollectionPage';
import { Product } from '../App';

interface BestSellersProps {
  onProductClick: (product: Product) => void;
  onAddToWishlist: (product: Product) => void;
  isInWishlist: (productId: number) => boolean;
}

export function BestSellers(props: BestSellersProps) {
  return (
    <CollectionPage
      title="Best Sellers"
      intro="The pieces our clients return to."
      filter="bestseller"
      path="/best-sellers"
      metaDescription="The most loved TEALHOUSE pieces."
      {...props}
    />
  );
}
