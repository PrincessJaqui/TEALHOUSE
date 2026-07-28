import { ShoppingCart, X, Minus, Plus } from 'lucide-react';
import { CartItem } from '../App';
import { Button } from './ui/button';
import { getPrimaryProductImage } from '../lib/default-image';
import { useNavigate } from 'react-router-dom';

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (productId: number, quantity: number, size?: number) => void;
  onRemoveItem: (productId: number, size?: number) => void;
}

export function Cart({ isOpen, onClose, items, onUpdateQuantity, onRemoveItem }: CartProps) {
  const navigate = useNavigate();
  
  if (!isOpen) return null;

  const subtotal = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 z-50 transition-opacity"
        onClick={onClose}
      />
      
      {/* Cart Panel */}
      <div className="fixed top-0 right-0 h-full w-full max-w-md bg-white z-50 shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="uppercase tracking-wider">Shopping Bag ({items.length})</h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Close cart"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-6">
          {items.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-[#666666] mb-4">Your shopping bag is empty</p>
              <button 
                onClick={onClose}
                className="text-sm uppercase tracking-wider underline hover:no-underline"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {items.map((item, index) => (
                <div key={`${item.product.id}-${item.size}-${index}`} className="flex gap-4">
                  <div className="w-24 h-28 bg-gray-100 flex-shrink-0">
                    <img
                      src={getPrimaryProductImage(item.product)}
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  <div className="flex-1 flex flex-col">
                    <div className="flex justify-between mb-2">
                      <div>
                        <h4 className="font-['Tinos'] mb-1">{item.product.name}</h4>
                        {item.size && (
                          <p className="text-sm text-[#666666]">Size: {item.size}</p>
                        )}
                      </div>
                      <button
                        onClick={() => onRemoveItem(item.product.id, item.size)}
                        className="text-[#666666] hover:text-black"
                        aria-label="Remove item"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    
                    <div className="mt-auto flex items-center justify-between">
                      <div className="flex items-center gap-3 border border-gray-300 rounded">
                        <button
                          onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1, item.size)}
                          className="p-2 hover:bg-gray-100 transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-sm w-8 text-center">{item.quantity}</span>
                        <button
                          onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1, item.size)}
                          className="p-2 hover:bg-gray-100 transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                      <p className="text-[#666666]">${(item.product.price * item.quantity).toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-gray-200 p-6 space-y-4">
            <div className="flex justify-between items-center">
              <span className="uppercase tracking-wider">Subtotal</span>
              <span className="text-xl">${subtotal.toLocaleString()}</span>
            </div>
            <p className="text-sm text-[#666666]">Shipping and taxes calculated at checkout</p>
            <button 
              onClick={() => {
                onClose();
                navigate('/checkout');
              }}
              className="w-full bg-[#2c2c2c] text-white py-4 uppercase tracking-wider hover:bg-black transition-colors"
            >
              Proceed to Checkout
            </button>
          </div>
        )}
      </div>
    </>
  );
}