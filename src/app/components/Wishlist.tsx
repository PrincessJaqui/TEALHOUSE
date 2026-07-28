import { X, Heart, ShoppingBag, Share2 } from 'lucide-react';
import { useEffect } from 'react';
import { Product } from '../App';
import { toast } from 'sonner';

interface WishlistProps {
  isOpen: boolean;
  onClose: () => void;
  items: Product[];
  onRemoveItem: (productId: number) => void;
  onMoveToCart: (product: Product) => void;
  onProductClick: (product: Product) => void;
}

export function Wishlist({ isOpen, onClose, items, onRemoveItem, onMoveToCart, onProductClick }: WishlistProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleShareWishlist = () => {
    const productIds = items.map(item => item.id).join(',');
    const shareUrl = `${window.location.origin}/?wishlist=${productIds}`;
    
    navigator.clipboard.writeText(shareUrl).then(() => {
      toast.success('Link copied to clipboard');
    }).catch(() => {
      toast.error('Failed to copy link');
    });
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity z-[150] ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Wishlist Panel */}
      <div
        className={`fixed right-0 top-0 h-full w-full sm:w-[500px] bg-white shadow-2xl transition-transform duration-300 ease-in-out z-[151] ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <Heart className="w-5 h-5" />
              <h2 className="uppercase tracking-wider">Private Selections ({items.length})</h2>
            </div>
            <div className="flex items-center gap-2">
              {items.length > 0 && (
                <button
                  onClick={handleShareWishlist}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  aria-label="Share wishlist"
                >
                  <Share2 className="w-5 h-5" />
                </button>
              )}
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Close wishlist"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Wishlist Items */}
          <div className="flex-1 overflow-y-auto">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full px-6 text-center">
                <Heart className="w-16 h-16 text-gray-300 mb-4" />
                <h3 className="mb-2">Your Wishlist is Empty</h3>
                <p className="text-sm text-gray-600 mb-6">
                  Save your favorite items to your wishlist
                </p>
                <button
                  onClick={onClose}
                  className="px-6 py-3 bg-black text-white hover:bg-gray-800 transition-colors uppercase tracking-wider text-sm"
                >
                  Continue Shopping
                </button>
              </div>
            ) : (
              <div className="p-6">
                <div className="space-y-6">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-4">
                      <div 
                        className="w-24 h-32 bg-gray-100 flex-shrink-0 cursor-pointer"
                        onClick={() => {
                          onProductClick(item);
                          onClose();
                        }}
                      >
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 flex flex-col">
                        <h3 
                          className="mb-1 cursor-pointer hover:text-gray-600 transition-colors"
                          onClick={() => {
                            onProductClick(item);
                            onClose();
                          }}
                        >
                          {item.name}
                        </h3>
                        <p className="text-sm text-gray-600 mb-2">${item.price}</p>
                        <p className="text-xs text-gray-500 mb-3 line-clamp-2">{item.description}</p>
                        
                        <div className="mt-auto flex gap-2">
                          <button
                            onClick={() => {
                              onMoveToCart(item);
                              onRemoveItem(item.id);
                            }}
                            className="flex-1 px-3 py-2 bg-black text-white hover:bg-gray-800 transition-colors text-xs uppercase tracking-wider flex items-center justify-center gap-2"
                          >
                            <ShoppingBag className="w-3 h-3" />
                            Add to Bag
                          </button>
                          <button
                            onClick={() => onRemoveItem(item.id)}
                            className="px-3 py-2 border border-gray-300 hover:border-black transition-colors text-xs uppercase tracking-wider"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          {items.length > 0 && (
            <div className="border-t border-gray-200 p-6">
              <button
                onClick={() => {
                  items.forEach(item => onMoveToCart(item));
                  onClose();
                }}
                className="w-full py-3 bg-black text-white hover:bg-gray-800 transition-colors uppercase tracking-wider text-sm"
              >
                Add All to Bag
              </button>
              <button
                onClick={handleShareWishlist}
                className="w-full py-3 bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors uppercase tracking-wider text-sm mt-2"
              >
                Share Wishlist
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}