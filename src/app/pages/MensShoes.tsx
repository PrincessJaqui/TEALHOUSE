import { CollectionPage } from '../components/CollectionPage';
import { Product } from '../App';

interface MensShoesProps {
  onProductClick: (product: Product) => void;
  onAddToWishlist: (product: Product) => void;
  isInWishlist: (productId: number) => boolean;
}

export function MensShoes(props: MensShoesProps) {
  return (
    <CollectionPage
      title="Men\u2019s Collection"
      intro="Considered vegan footwear, built on Italian craftsmanship."
      filter="mens"
      path="/mens-shoes"
      metaDescription="Vegan luxury footwear for men, handmade in Italy."
      {...props}
    />
  );
}
