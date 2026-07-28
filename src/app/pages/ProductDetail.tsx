import { useState, useEffect } from 'react';
import { SHIPPING, RETURNS, formatPrice } from '../config/store';
import { stockForSize, isSoldOut } from '../config/taxonomy';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Heart, ShoppingCart, Info } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Product } from '../App';
import { useSupabaseProducts } from '../hooks/useSupabaseProducts';
import { toast } from 'sonner';

interface ProductDetailProps {
  onAddToCart: (product: Product, size?: number) => void;
  onAddToWishlist: (product: Product) => void;
  isInWishlist: (productId: number) => boolean;
}

export function ProductDetail({ onAddToCart, onAddToWishlist, isInWishlist }: ProductDetailProps) {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { products, loading } = useSupabaseProducts();
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedSize, setSelectedSize] = useState<number | undefined>();
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    if (products.length > 0 && id) {
      const found = products.find(p => p.id === parseInt(id));
      if (found) {
        setProduct(found);
        if (found.sizes && found.sizes.length > 0) {
          setSelectedSize(found.sizes[0]);
        }
      }
    }
  }, [products, id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#008080] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading product...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-white pt-20 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl mb-4">Product Not Found</h2>
          <Button onClick={() => navigate('/')}>Return Home</Button>
        </div>
      </div>
    );
  }

  const images = product.images || [product.image];
  const inWishlist = isInWishlist(product.id);

  const handleAddToCart = () => {
    if (product.sizes && product.sizes.length > 0 && !selectedSize) {
      toast.error('Please select a size');
      return;
    }
    if (stockForSize(product, selectedSize) <= 0) {
      toast.error('That size is sold out');
      return;
    }

    onAddToCart(product, selectedSize);
    toast.success('Added to cart');
  };

  const handleAddToWishlist = () => {
    if (!inWishlist) {
      onAddToWishlist(product);
      toast.success('Added to wishlist');
    }
  };

  return (
    <div className="min-h-screen bg-white pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-8 -ml-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Images */}
          <div>
            {/* Main Image */}
            <div className="aspect-square bg-gray-100 rounded-lg mb-4 overflow-hidden">
              <img
                src={images[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Image Thumbnails */}
            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`aspect-square bg-gray-100 rounded-lg overflow-hidden border-2 ${
                      selectedImage === idx ? 'border-[#008080]' : 'border-transparent'
                    }`}
                  >
                    <img src={img} alt={`${product.name} ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Video */}
            {product.video && (
              <div className="mt-4 aspect-video bg-gray-100 rounded-lg overflow-hidden">
                <video
                  src={product.video}
                  controls
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </div>

          {/* Product Info */}
          <div>
            <h1 className="text-4xl mb-4">{product.name}</h1>
            <p className="text-3xl mb-6">${product.price.toLocaleString()}</p>

            <p className="text-gray-700 mb-8 leading-relaxed">{product.description}</p>

            {/* Size Selection */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="mb-8">
                <div className="flex items-center justify-between mb-3">
                  <label className="block font-medium">Size (EU)</label>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate('/size-guide')}
                    className="text-[#008080] hover:text-[#006666]"
                  >
                    <Info className="h-4 w-4 mr-1" />
                    Size Guide
                  </Button>
                </div>
                <div className="grid grid-cols-6 gap-2">
                  {product.sizes.map((size) => {
                    const remaining = stockForSize(product, size);
                    const unavailable = remaining <= 0;
                    return (
                      <button
                        key={size}
                        onClick={() => !unavailable && setSelectedSize(size)}
                        disabled={unavailable}
                        title={unavailable ? 'Sold out' : `${remaining} available`}
                        className={`py-3 border rounded-lg text-center transition-all ${
                          unavailable
                            ? 'border-gray-200 text-gray-300 line-through cursor-not-allowed'
                            : selectedSize === size
                              ? 'border-[#008080] bg-[#008080] text-white'
                              : 'border-gray-300 hover:border-[#008080]'
                        }`}
                      >
                        {size}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-4 mb-8">
              <Button
                onClick={handleAddToCart}
                disabled={isSoldOut(product)}
                className="flex-1 bg-[#008080] hover:bg-[#006666] text-white h-14 text-lg disabled:opacity-50"
              >
                <ShoppingCart className="h-5 w-5 mr-2" />
                {isSoldOut(product) ? 'Sold Out' : 'Add to Cart'}
              </Button>
              <Button
                variant="outline"
                onClick={handleAddToWishlist}
                className={`h-14 px-6 ${inWishlist ? 'bg-red-50 border-red-500' : ''}`}
              >
                <Heart className={`h-5 w-5 ${inWishlist ? 'fill-red-500 text-red-500' : ''}`} />
              </Button>
            </div>

            {/* Materials */}
            <div className="border-t pt-6 mb-6">
              <h3 className="font-semibold mb-3">Materials</h3>
              <div className="flex flex-wrap gap-2">
                {product.materials.map((material) => (
                  <span
                    key={material}
                    className="px-3 py-1 bg-gray-100 rounded-full text-sm"
                  >
                    {material}
                  </span>
                ))}
              </div>
            </div>

            {/* Features */}
            <div className="border-t pt-6 space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-[#008080] rounded-full mt-2"></div>
                <div>
                  <h4 className="font-medium mb-1">Handmade in Italy</h4>
                  <p className="text-gray-600 text-sm">Crafted by master artisans in our Italian workshop</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-[#008080] rounded-full mt-2"></div>
                <div>
                  <h4 className="font-medium mb-1">100% Vegan</h4>
                  <p className="text-gray-600 text-sm">Made entirely from plant-based materials</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-[#008080] rounded-full mt-2"></div>
                <div>
                  <h4 className="font-medium mb-1">Signature Teal Sole</h4>
                  <p className="text-gray-600 text-sm">Our iconic teal sole made from natural rubber</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-[#008080] rounded-full mt-2"></div>
                <div>
                  <h4 className="font-medium mb-1">Free Shipping & Returns</h4>
                  <p className="text-gray-600 text-sm">On orders over {formatPrice(SHIPPING.freeThreshold)} with {RETURNS.windowDays}-day return policy</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
