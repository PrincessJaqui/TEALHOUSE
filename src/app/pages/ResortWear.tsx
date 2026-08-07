import { CollectionPage } from '../components/CollectionPage';
import { Product } from '../App';

interface ResortWearProps {
  onProductClick: (product: Product) => void;
  onAddToWishlist: (product: Product) => void;
  isInWishlist: (productId: number) => boolean;
}

export function ResortWear(props: ResortWearProps) {
  return (
    <CollectionPage
      title="Resort Wear"
      intro="Pieces made for warm weather and long days, in the same plant-based materials as everything we make."
      filter="resort-wear"
      path="/resort-wear"
      metaDescription="Plant-based resort wear and swimwear from TEALHOUSE, made for warm weather and long days."
      highlights={[
        {
          title: 'Premium Textiles',
          body: 'High-grade synthetics chosen for recovery, element resistance and shape retention.',
        },
        {
          title: 'Made to Measure',
          body: 'Selected pieces are cut to your own measurements rather than a standard size.',
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
