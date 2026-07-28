import { useState } from 'react';
import { ChevronLeft, Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { CartItem } from '../App';
import imgLogo from "figma:asset/3f298acd9128513aa329c386495f656e449305d1.png";
import { toast } from 'sonner';
import { supabase } from '../lib/supabase';
import { useSupabaseAuth } from '../hooks/useSupabaseAuth';

interface CheckoutProps {
  items: CartItem[];
}

type CheckoutMode = 'login' | 'create' | 'guest';
type CheckoutStep = 'authentication' | 'shipping' | 'payment';

interface ShippingInfo {
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export function Checkout({ items }: CheckoutProps) {
  const navigate = useNavigate();
  const [step, setStep] = useState<CheckoutStep>('authentication');
  const [mode, setMode] = useState<CheckoutMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [title, setTitle] = useState('Mr');
  const [acceptMarketing, setAcceptMarketing] = useState(false);
  const [shippingMethod, setShippingMethod] = useState<'express' | 'standard'>('standard');
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [shippingInfo, setShippingInfo] = useState<ShippingInfo>({
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States'
  });

  const subtotal = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const shippingCost = shippingMethod === 'express' ? 25 : 0;
  const total = subtotal + shippingCost;

  const handleAuthentication = () => {
    if (mode === 'create') {
      // In create mode, show shipping immediately
      setStep('shipping');
    } else {
      // For login or guest, proceed to shipping
      setStep('shipping');
    }
  };

  const handleProceedToPayment = () => {
    // Validate shipping address
    if (!shippingInfo.firstName || !shippingInfo.lastName || !shippingInfo.address || 
        !shippingInfo.city || !shippingInfo.state || !shippingInfo.zipCode) {
      toast.error('Please complete your shipping address');
      setIsEditingAddress(true);
      return;
    }
    setStep('payment');
  };

  const handlePlaceOrder = async () => {
    try {
      // Create order object
      const orderId = `ORDER-${Date.now()}`;
      const orderData = {
        orderId,
        email,
        shippingInfo,
        items: items.map(item => ({
          productId: item.product.id,
          productName: item.product.name,
          price: item.product.price,
          quantity: item.quantity,
          size: item.size
        })),
        subtotal,
        shippingCost,
        shippingMethod,
        total,
        status: 'pending',
        createdAt: new Date().toISOString()
      };

      // Save order to Supabase using the products table (since we have it)
      // In production, this would go to an orders table
      const { error } = await supabase
        .from('kv_store_d1960f17')
        .insert({
          key: orderId,
          value: orderData
        });

      if (error) {
        console.error('Error saving order:', error);
        toast.error('Failed to place order. Please try again.');
        return;
      }

      // Success - clear cart and redirect
      toast.success('Order placed successfully!');
      
      // Wait a moment for the toast to show
      setTimeout(() => {
        navigate('/');
        // Optionally trigger cart clear here
      }, 1500);
      
    } catch (error) {
      console.error('Unexpected error placing order:', error);
      toast.error('Failed to place order. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="">
        <div className="max-w-[1400px] mx-auto px-5 py-6">
          <div className="flex items-center justify-center">
            <button 
              onClick={() => {
                if (step === 'payment') setStep('shipping');
                else if (step === 'shipping') setStep('authentication');
                else navigate('/');
              }}
              className="absolute left-5 flex items-center gap-2 text-sm hover:text-gray-600 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Continue Shopping</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-[1400px] mx-auto px-5 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          
          {/* Left Column - Checkout Forms */}
          <div className="lg:pr-12">
            <div className="max-w-[580px]">
              
              {/* AUTHENTICATION STEP */}
              {step === 'authentication' && (
                <>
                  <div className="mb-12">
                    <h1 className="font-['Tinos'] text-4xl mb-3">Log in</h1>
                    <p className="text-gray-600">Log in or continue as a guest</p>
                  </div>

                  {/* Login Options */}
                  <div className="space-y-4">
                    
                    {/* Log in Option */}
                    <div 
                      className={`border ${mode === 'login' ? 'border-black' : 'border-gray-200'} p-6 cursor-pointer transition-all hover:border-gray-400`}
                      onClick={() => setMode('login')}
                    >
                      <div className="flex items-start gap-4">
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mt-1 flex-shrink-0 ${mode === 'login' ? 'border-black' : 'border-gray-300'}`}>
                          {mode === 'login' && <div className="w-2.5 h-2.5 rounded-full bg-black" />}
                        </div>
                        <div className="flex-1">
                          <h3 className="mb-1">Log in</h3>
                          <p className="text-sm text-gray-600">Enter your credentials</p>
                          
                          {mode === 'login' && (
                            <div className="mt-6 space-y-4">
                              <div>
                                <input
                                  type="email"
                                  placeholder="* Email address"
                                  value={email}
                                  onChange={(e) => setEmail(e.target.value)}
                                  className="w-full border-b border-gray-300 pb-3 text-sm focus:outline-none focus:border-black transition-colors"
                                />
                              </div>
                              <div className="relative">
                                <input
                                  type={showPassword ? 'text' : 'password'}
                                  placeholder="* Password"
                                  value={password}
                                  onChange={(e) => setPassword(e.target.value)}
                                  className="w-full border-b border-gray-300 pb-3 text-sm focus:outline-none focus:border-black transition-colors pr-10"
                                />
                                <button
                                  type="button"
                                  onClick={() => setShowPassword(!showPassword)}
                                  className="absolute right-0 bottom-3 text-gray-400 hover:text-black"
                                >
                                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                              </div>
                              <button 
                                onClick={handleAuthentication}
                                className="w-full bg-black text-white py-3 text-sm uppercase tracking-wider hover:bg-gray-800 transition-colors"
                              >
                                Log in and continue
                              </button>
                              <button className="text-sm text-gray-600 hover:text-black transition-colors">
                                Forgot your password?
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Create Account Option */}
                    <div 
                      className={`border ${mode === 'create' ? 'border-black' : 'border-gray-200'} p-6 cursor-pointer transition-all hover:border-gray-400`}
                      onClick={() => setMode('create')}
                    >
                      <div className="flex items-start gap-4">
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mt-1 flex-shrink-0 ${mode === 'create' ? 'border-black' : 'border-gray-300'}`}>
                          {mode === 'create' && <div className="w-2.5 h-2.5 rounded-full bg-black" />}
                        </div>
                        <div className="flex-1">
                          <h3 className="mb-1">Create an account</h3>
                          <p className="text-sm text-gray-600">Don't have an account yet?</p>
                          
                          {mode === 'create' && (
                            <div className="mt-6 space-y-4">
                              <div>
                                <select
                                  value={title}
                                  onChange={(e) => setTitle(e.target.value)}
                                  className="w-full border-b border-gray-300 pb-3 text-sm focus:outline-none focus:border-black transition-colors bg-white"
                                >
                                  <option value="Ms">Ms</option>
                                  <option value="Mr">Mr</option>
                                  <option value="Mrs">Mrs</option>
                                  <option value="Mx">Mx</option>
                                </select>
                              </div>
                              <div>
                                <input
                                  type="text"
                                  placeholder="* First name"
                                  value={shippingInfo.firstName}
                                  onChange={(e) => setShippingInfo({ ...shippingInfo, firstName: e.target.value })}
                                  className="w-full border-b border-gray-300 pb-3 text-sm focus:outline-none focus:border-black transition-colors"
                                />
                              </div>
                              <div>
                                <input
                                  type="text"
                                  placeholder="* Last name"
                                  value={shippingInfo.lastName}
                                  onChange={(e) => setShippingInfo({ ...shippingInfo, lastName: e.target.value })}
                                  className="w-full border-b border-gray-300 pb-3 text-sm focus:outline-none focus:border-black transition-colors"
                                />
                              </div>
                              <div>
                                <input
                                  type="email"
                                  placeholder="* Email address"
                                  value={email}
                                  onChange={(e) => setEmail(e.target.value)}
                                  className="w-full border-b border-gray-300 pb-3 text-sm focus:outline-none focus:border-black transition-colors"
                                />
                              </div>
                              <div className="relative">
                                <input
                                  type={showPassword ? 'text' : 'password'}
                                  placeholder="* Password"
                                  value={password}
                                  onChange={(e) => setPassword(e.target.value)}
                                  className="w-full border-b border-gray-300 pb-3 text-sm focus:outline-none focus:border-black transition-colors pr-10"
                                />
                                <button
                                  type="button"
                                  onClick={() => setShowPassword(!showPassword)}
                                  className="absolute right-0 bottom-3 text-gray-400 hover:text-black"
                                >
                                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                                <p className="text-xs text-gray-500 mt-2">
                                  At least 8 characters | 1 lower case letter | 1 upper case letter | 1 digit | 1 special character (!@#$%^&*?+-/)
                                </p>
                              </div>
                              <div className="flex items-start gap-2">
                                <input
                                  type="checkbox"
                                  id="marketing"
                                  checked={acceptMarketing}
                                  onChange={(e) => setAcceptMarketing(e.target.checked)}
                                  className="mt-1"
                                />
                                <label htmlFor="marketing" className="text-xs text-gray-600 leading-relaxed">
                                  I accept for my purchasing preferences to be shared with the LVMH group to improve the 
                                  relevance of the offers and recommendations I receive (<button className="underline">See more</button>)
                                </label>
                              </div>
                              <button 
                                onClick={handleAuthentication}
                                className="w-full bg-black text-white py-3 text-sm uppercase tracking-wider hover:bg-gray-800 transition-colors"
                              >
                                Create an account and continue
                              </button>
                              <p className="text-xs text-gray-600 leading-relaxed">
                                By clicking on "Create an account" you confirm you have read the Privacy Policy and consent 
                                to the processing of your Personal Data for the management of your Account, including 
                                direct marketing. Please see our Terms & Conditions.
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Guest Checkout Option */}
                    <div 
                      className={`border ${mode === 'guest' ? 'border-black' : 'border-gray-200'} p-6 cursor-pointer transition-all hover:border-gray-400`}
                      onClick={() => setMode('guest')}
                    >
                      <div className="flex items-start gap-4">
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mt-1 flex-shrink-0 ${mode === 'guest' ? 'border-black' : 'border-gray-300'}`}>
                          {mode === 'guest' && <div className="w-2.5 h-2.5 rounded-full bg-black" />}
                        </div>
                        <div className="flex-1">
                          <h3 className="mb-1">Continue as a guest</h3>
                          <p className="text-sm text-gray-600">Place your order with your email address</p>
                          
                          {mode === 'guest' && (
                            <div className="mt-6 space-y-4">
                              <div>
                                <input
                                  type="email"
                                  placeholder="* Email address"
                                  value={email}
                                  onChange={(e) => setEmail(e.target.value)}
                                  className="w-full border-b border-gray-300 pb-3 text-sm focus:outline-none focus:border-black transition-colors"
                                />
                              </div>
                              <button 
                                onClick={handleAuthentication}
                                className="w-full bg-black text-white py-3 text-sm uppercase tracking-wider hover:bg-gray-800 transition-colors"
                              >
                                Continue as guest
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                  </div>

                  {/* Footer Links */}
                  <div className="mt-12 flex items-center justify-center gap-8 text-sm text-gray-600">
                    <button className="hover:text-black transition-colors">Personal Data</button>
                    <button className="hover:text-black transition-colors">Legal Terms and Conditions</button>
                  </div>
                </>
              )}

              {/* SHIPPING STEP */}
              {step === 'shipping' && (
                <>
                  {/* Address Edit Form */}
                  {isEditingAddress ? (
                    <div className="mb-8">
                      <div className="flex items-center justify-between mb-6">
                        <h2 className="font-['Tinos'] text-2xl">Edit Shipping Address</h2>
                        <button 
                          onClick={() => setIsEditingAddress(false)}
                          className="text-sm text-gray-600 hover:text-black transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                      
                      <div className="space-y-4 mb-6">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <input
                              type="text"
                              placeholder="* First name"
                              value={shippingInfo.firstName}
                              onChange={(e) => setShippingInfo({ ...shippingInfo, firstName: e.target.value })}
                              className="w-full border-b border-gray-300 pb-3 text-sm focus:outline-none focus:border-black transition-colors"
                            />
                          </div>
                          <div>
                            <input
                              type="text"
                              placeholder="* Last name"
                              value={shippingInfo.lastName}
                              onChange={(e) => setShippingInfo({ ...shippingInfo, lastName: e.target.value })}
                              className="w-full border-b border-gray-300 pb-3 text-sm focus:outline-none focus:border-black transition-colors"
                            />
                          </div>
                        </div>
                        
                        <div>
                          <input
                            type="text"
                            placeholder="* Address"
                            value={shippingInfo.address}
                            onChange={(e) => setShippingInfo({ ...shippingInfo, address: e.target.value })}
                            className="w-full border-b border-gray-300 pb-3 text-sm focus:outline-none focus:border-black transition-colors"
                          />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <input
                              type="text"
                              placeholder="* City"
                              value={shippingInfo.city}
                              onChange={(e) => setShippingInfo({ ...shippingInfo, city: e.target.value })}
                              className="w-full border-b border-gray-300 pb-3 text-sm focus:outline-none focus:border-black transition-colors"
                            />
                          </div>
                          <div>
                            <input
                              type="text"
                              placeholder="* State"
                              value={shippingInfo.state}
                              onChange={(e) => setShippingInfo({ ...shippingInfo, state: e.target.value })}
                              className="w-full border-b border-gray-300 pb-3 text-sm focus:outline-none focus:border-black transition-colors"
                            />
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <input
                              type="text"
                              placeholder="* ZIP Code"
                              value={shippingInfo.zipCode}
                              onChange={(e) => setShippingInfo({ ...shippingInfo, zipCode: e.target.value })}
                              className="w-full border-b border-gray-300 pb-3 text-sm focus:outline-none focus:border-black transition-colors"
                            />
                          </div>
                          <div>
                            <select
                              value={shippingInfo.country}
                              onChange={(e) => setShippingInfo({ ...shippingInfo, country: e.target.value })}
                              className="w-full border-b border-gray-300 pb-3 text-sm focus:outline-none focus:border-black transition-colors bg-white"
                            >
                              <option value="United States">United States</option>
                              <option value="Canada">Canada</option>
                              <option value="United Kingdom">United Kingdom</option>
                              <option value="Australia">Australia</option>
                            </select>
                          </div>
                        </div>
                        
                        <button 
                          onClick={() => setIsEditingAddress(false)}
                          className="w-full bg-black text-white py-3 text-sm uppercase tracking-wider hover:bg-gray-800 transition-colors mt-6"
                        >
                          Save Address
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="mb-8">
                      <div className="flex items-center justify-between mb-2">
                        <h2 className="font-['Tinos'] text-2xl">1. Shipping address</h2>
                        <button 
                          onClick={() => setIsEditingAddress(true)}
                          className="text-sm text-gray-600 hover:text-black transition-colors"
                        >
                          Edit
                        </button>
                      </div>
                      <p className="text-sm text-gray-600">
                        {shippingInfo.firstName || shippingInfo.lastName ? 
                          `${shippingInfo.firstName} ${shippingInfo.lastName}${shippingInfo.address ? `, ${shippingInfo.address}` : ''}${shippingInfo.city ? `, ${shippingInfo.city}` : ''}${shippingInfo.state ? `, ${shippingInfo.state}` : ''}${shippingInfo.zipCode ? ` ${shippingInfo.zipCode}` : ''}` :
                          'Please add your shipping address'
                        }
                      </p>
                    </div>
                  )}
                  
                  <div className="mb-12">
                    <h2 className="font-['Tinos'] text-2xl mb-6">2. Shipping method</h2>
                    <p className="text-sm text-gray-600 mb-6">Choose a shipping method for your delivery</p>

                    <div className="space-y-4">
                      {/* Express Delivery */}
                      <div 
                        onClick={() => setShippingMethod('express')}
                        className={`border ${shippingMethod === 'express' ? 'border-black' : 'border-gray-200'} p-5 cursor-pointer transition-all hover:border-gray-400`}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-start gap-4 flex-1">
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mt-0.5 flex-shrink-0 ${shippingMethod === 'express' ? 'border-black' : 'border-gray-300'}`}>
                              {shippingMethod === 'express' && <div className="w-2.5 h-2.5 rounded-full bg-black" />}
                            </div>
                            <div>
                              <h4 className="mb-1">Express delivery</h4>
                              <p className="text-sm text-gray-600">Estimated delivery date: December 12</p>
                            </div>
                          </div>
                          <span className="">$25.00</span>
                        </div>
                      </div>

                      {/* Free Standard Shipping */}
                      <div 
                        onClick={() => setShippingMethod('standard')}
                        className={`border ${shippingMethod === 'standard' ? 'border-black' : 'border-gray-200'} p-5 cursor-pointer transition-all hover:border-gray-400`}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-start gap-4 flex-1">
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mt-0.5 flex-shrink-0 ${shippingMethod === 'standard' ? 'border-black' : 'border-gray-300'}`}>
                              {shippingMethod === 'standard' && <div className="w-2.5 h-2.5 rounded-full bg-black" />}
                            </div>
                            <div>
                              <h4 className="mb-1">Free standard shipping</h4>
                              <p className="text-sm text-gray-600">Estimated delivery date: December 17</p>
                            </div>
                          </div>
                          <span className="">Free</span>
                        </div>
                      </div>
                    </div>

                    <p className="text-xs text-gray-600 mt-6">
                      Note: Client presence, signature and/or ID required for delivery.
                    </p>
                  </div>

                  <button 
                    onClick={handleProceedToPayment}
                    className="w-full bg-[#D8D8D8] text-black py-4 text-sm uppercase tracking-wider hover:bg-gray-300 transition-colors mb-6"
                  >
                    Proceed to payment
                  </button>

                  <div className="text-center">
                    <h3 className="font-['Tinos'] text-2xl mb-4">3. Billing & Payment</h3>
                  </div>
                </>
              )}

              {/* PAYMENT STEP */}
              {step === 'payment' && (
                <>
                  <div className="mb-8">
                    <div className="flex items-center justify-between mb-2">
                      <h2 className="font-['Tinos'] text-2xl">1. Shipping address</h2>
                      <button 
                        onClick={() => setStep('shipping')}
                        className="text-sm text-gray-600 hover:text-black transition-colors"
                      >
                        Edit
                      </button>
                    </div>
                    <p className="text-sm text-gray-600">
                      {[
                        [shippingInfo.firstName, shippingInfo.lastName].filter(Boolean).join(' '),
                        shippingInfo.address,
                        [shippingInfo.city, shippingInfo.state, shippingInfo.zipCode]
                          .filter(Boolean)
                          .join(', '),
                        shippingInfo.country,
                      ]
                        .filter(Boolean)
                        .join(' | ') || 'No shipping address entered yet'}
                    </p>
                  </div>

                  <div className="mb-8">
                    <div className="flex items-center justify-between mb-2">
                      <h2 className="font-['Tinos'] text-2xl">2. Shipping method</h2>
                      <button 
                        onClick={() => setStep('shipping')}
                        className="text-sm text-gray-600 hover:text-black transition-colors"
                      >
                        Edit
                      </button>
                    </div>
                    <p className="text-sm text-gray-600">
                      {shippingMethod === 'express' ? 'Express delivery - $25.00' : 'Free standard shipping'}
                    </p>
                  </div>

                  <div className="mb-12">
                    <h2 className="font-['Tinos'] text-2xl mb-6">3. Billing & Payment</h2>
                    
                    <div className="space-y-4 mb-6">
                      <div>
                        <input
                          type="text"
                          placeholder="* Card number"
                          className="w-full border-b border-gray-300 pb-3 text-sm focus:outline-none focus:border-black transition-colors"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <input
                          type="text"
                          placeholder="* MM/YY"
                          className="w-full border-b border-gray-300 pb-3 text-sm focus:outline-none focus:border-black transition-colors"
                        />
                        <input
                          type="text"
                          placeholder="* CVV"
                          className="w-full border-b border-gray-300 pb-3 text-sm focus:outline-none focus:border-black transition-colors"
                        />
                      </div>
                      <div>
                        <input
                          type="text"
                          placeholder="* Cardholder name"
                          className="w-full border-b border-gray-300 pb-3 text-sm focus:outline-none focus:border-black transition-colors"
                        />
                      </div>
                    </div>

                    <div className="bg-gray-50 p-4 mb-6">
                      <p className="text-xs text-gray-600 leading-relaxed">
                        Your payment details are securely processed. TEALHOUSE does not store your credit card information.
                      </p>
                    </div>

                    <button 
                      onClick={handlePlaceOrder}
                      className="w-full bg-black text-white py-4 text-sm uppercase tracking-wider hover:bg-gray-800 transition-colors"
                    >
                      Place order
                    </button>

                    <p className="text-xs text-gray-600 mt-6 text-center">
                      By placing your order, you agree to our Terms & Conditions and Privacy Policy
                    </p>
                  </div>
                </>
              )}

            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:border-l lg:border-gray-200 lg:pl-12">
            <div className="sticky top-8">
              <div className="mb-8">
                <div className="flex items-baseline justify-between mb-6">
                  <h2 className="font-['Tinos'] text-3xl">Order Summary</h2>
                  <span className="text-sm text-gray-600">{items.length} {items.length === 1 ? 'item' : 'items'}</span>
                </div>

                {/* Order Items */}
                <div className="space-y-6 mb-8">
                  {items.map((item, index) => (
                    <div key={`${item.product.id}-${item.size}-${index}`} className="flex gap-4">
                      <div className="w-24 h-24 bg-gray-100 flex-shrink-0">
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <p className="mb-1">{item.product.name}</p>
                        <p className="text-sm text-gray-600 mb-1">Qty: {item.quantity}</p>
                        {item.size && (
                          <p className="text-sm text-gray-600">Size: {item.size}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Packaging */}
                <div className="border-t border-gray-200 pt-6 mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-['Tinos'] text-xl">Packaging & Gifting</h3>
                    <button className="text-sm text-gray-600 hover:text-black transition-colors">Edit</button>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <div className="w-4 h-4 rounded-full border border-gray-400 flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-black" />
                    </div>
                    <span>Signature Packaging</span>
                  </div>
                </div>

                {/* Total */}
                <div className="border-t border-gray-200 pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-['Tinos'] text-xl">Total</h3>
                    <button className="text-sm text-gray-600 hover:text-black transition-colors flex items-center gap-1">
                      View details
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-baseline justify-between">
                      <span className="text-sm text-gray-600">Subtotal</span>
                      <span className="">${subtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex items-baseline justify-between">
                      <span className="text-sm text-gray-600">Delivery</span>
                      <span className="text-sm">{shippingMethod === 'express' ? '$25.00' : 'Free'}</span>
                    </div>
                    <div className="flex items-baseline justify-between pt-4 border-t border-gray-200">
                      <span className="">Total</span>
                      <span className="text-2xl">${total.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}