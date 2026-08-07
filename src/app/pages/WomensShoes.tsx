import { CollectionPage } from '../components/CollectionPage';
import { Product } from '../App';

interface WomensShoesProps {
  onProductClick: (product: Product) => void;
  onAddToWishlist: (product: Product) => void;
  isInWishlist: (productId: number) => boolean;
}

export function WomensShoes(props: WomensShoesProps) {
  return (
    <CollectionPage
      title="Women\u2019s Collection"
      intro="Elegant vegan footwear, where Italian craftsmanship meets conscious luxury."
      filter="womens"
      path="/womens-shoes"
      metaDescription="Vegan luxury footwear for women, handmade in Italy."
      {...props}
    />
  );
}
