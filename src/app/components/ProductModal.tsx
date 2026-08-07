import { useState, useEffect } from 'react';
import { X, Heart, ShoppingCart } from 'lucide-react';
import { Product } from '../App';
import { getPrimaryProductImage } from '../lib/default-image';
import { toast } from 'sonner';

interface ProductModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (
    product: Product,
    size?: string,
    sizes?: Record<string, string>,
    notes?: string
  ) => void;
  onAddToWishlist: (product: Product) => void;
  isInWishlist: (productId: number) => boolean;
}

// Convert European size to US size
const convertEUtoUS = (euSize: number): number => {
  // Women's conversion (approximate)
  return euSize - 30;
};

export function ProductModal({ product, isOpen, onClose, onAddToCart, onAddToWishlist, isInWishlist }: ProductModalProps) {
  const [selectedSize, setSelectedSize] = useState<number | null>(null);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      // Store the original overflow value
      const originalOverflow = document.body.style.overflow;
      const originalPosition = document.body.style.position;
      
      // Prevent scrolling on the body
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'relative';
      
      return () => {
        // Restore original values
        document.body.style.overflow = originalOverflow;
        document.body.style.position = originalPosition;
      };
    }
  }, [isOpen]);

  if (!isOpen || !product) return null;

  const handleAddToCart = () => {
    if (product.sizes && !selectedSize) {
      toast.error('Please select a size');
      return;
    }
    
    onAddToCart(product, selectedSize ? String(selectedSize) : undefined);
    toast.success('Added to cart');
    onClose();
    setSelectedSize(null);
  };

  const handleWishlist = () => {
    onAddToWishlist(product);
    toast.success(isInWishlist(product.id) ? 'Already in wishlist' : 'Added to wishlist');
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/70 z-50 transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="min-h-full flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-4xl shadow-2xl relative" onClick={(e) => e.stopPropagation()}>
            {/* Close Button */}
            <button 
              onClick={onClose}
              className="absolute top-4 right-4 p-2 hover:bg-gray-100 transition-colors z-10"
              aria-label="Close"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6 md:p-8">
              {/* Product Image */}
              <div className="aspect-[4/5] bg-gray-100">
                <img
                  src={getPrimaryProductImage(product)}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Product Details */}
              <div className="flex flex-col">
                <div className="flex-1">
                  <div className="mb-4">
                    <div className="inline-block mb-3 px-3 py-1 bg-teal-50 border border-teal-200 ">
                      <span className="text-xs tracking-wider text-teal-700">PLANT-BASED</span>
                    </div>
                    <h2 className="font-['Tinos'] text-2xl mb-2">{product.name}</h2>
                    <p className="text-xl text-[#666666] mb-6">${product.price.toLocaleString()}</p>
                  </div>

                  <div className="mb-6">
                    <p className="text-[#666666] leading-relaxed mb-4">{product.description}</p>
                    
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-3 h-3 rounded-full bg-teal-600" />
                      <span className="text-sm text-[#666666]">Features signature teal sole</span>
                    </div>
                  </div>

                  {/* Materials */}
                  <div className="mb-6">
                    <h4 className="uppercase tracking-wider text-sm mb-3">Sustainable Materials</h4>
                    <div className="flex flex-wrap gap-2">
                      {product.materials.map((material, index) => (
                        <span 
                          key={index}
                          className="px-3 py-1 bg-gray-100 text-sm text-[#666666] "
                        >
                          {material}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Size Selection */}
                  {product.sizes && (
                    <div className="mb-8">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="uppercase tracking-wider text-sm">Select Size</h4>
                        <a href="#" className="text-sm text-[#666666] underline hover:text-black">Size Guide</a>
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        {product.sizes.map((size) => (
                          <button
                            key={size}
                            onClick={() => setSelectedSize(size)}
                            className={`
 py-3 px-2 border-2 transition-all text-sm
                              ${selectedSize === size 
                                ? 'border-black bg-black text-white' 
                                : 'border-gray-300 hover:border-black'
                              }
                            `}
                          >
                            <div className="flex flex-col">
                              <span>EU {size}</span>
                              <span className="text-xs opacity-75">US {convertEUtoUS(size)}</span>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Add to Cart Button */}
                <div className="space-y-3">
                  <button
                    onClick={handleAddToCart}
                    className="w-full bg-[#2c2c2c] text-white py-4 uppercase tracking-wider hover:bg-black transition-colors flex items-center justify-center gap-2"
                  >
                    <ShoppingCart className="w-5 h-5" />
                    Add to Shopping Bag
                  </button>

                  {/* Add to Wishlist Button */}
                  <button
                    onClick={handleWishlist}
                    className={`flex-1 py-3 px-6 border transition-colors flex items-center justify-center gap-2 ${
 isInWishlist(product.id) 
                        ? 'border-teal-600 bg-teal-50 text-teal-700' 
                        : 'border-gray-300 hover:border-gray-500'
                    }`}
                  >
                    <Heart className={`w-5 h-5 ${isInWishlist(product.id) ? 'fill-current' : ''}`} />
                    {isInWishlist(product.id) ? 'In Wishlist' : 'Add to Wishlist'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}