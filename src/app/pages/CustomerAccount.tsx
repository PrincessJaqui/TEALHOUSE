import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Package, MapPin, CreditCard, LogOut, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useSupabaseAuth } from '../hooks/useSupabaseAuth';
import { toast } from 'sonner';

interface Order {
  id: string;
  created_at: string;
  total: number;
  status: string;
  items: any[];
}

export function CustomerAccount() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'orders' | 'account'>('orders');
  const [user, setUser] = useState<any>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [authMode, setAuthMode] = useState<'login' | 'create'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [busy, setBusy] = useState(false);
  const { signIn, signUp, resetPassword } = useSupabaseAuth();

  useEffect(() => {
    checkUser();
    loadOrders();
  }, []);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    // A guest gets an anonymous session for their cart, which is not the same
    // as being signed in. Treat anonymous as signed out here.
    setUser(user && !user.is_anonymous && user.email ? user : null);
    setLoading(false);
  };

  const loadOrders = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (!error && data) {
        setOrders(data);
      }
    } catch (error) {
      console.error('Error loading orders:', error);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success('Logged out successfully');
    navigate('/');
  };

  const handleSubmit = async () => {
    if (!email.trim() || !password) {
      toast.error('Enter your email and password');
      return;
    }
    setBusy(true);
    try {
      if (authMode === 'login') {
        const result = await signIn(email.trim(), password);
        if (!result.ok) {
          toast.error(result.error || 'Could not sign you in');
          return;
        }
      } else {
        if (password.length < 8) {
          toast.error('Password must be at least 8 characters');
          return;
        }
        const result = await signUp(email.trim(), password, fullName.trim() || undefined);
        if (!result.ok) {
          toast.error(result.error || 'Could not create your account');
          return;
        }
        if (result.needsEmailConfirmation) {
          toast.success('Account created. Check your email to confirm it.');
          return;
        }
      }
      await checkUser();
      await loadOrders();
    } finally {
      setBusy(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email.trim()) {
      toast.error('Enter your email first');
      return;
    }
    const result = await resetPassword(email.trim());
    toast[result.ok ? 'success' : 'error'](
      result.ok ? 'Password reset link sent' : result.error || 'Could not send reset link'
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Signed out. This used to render null, which showed a blank white page,
  // and before that it redirected to /account, a route that does not exist.
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-[1400px] mx-auto px-5 py-6">
            <h1 className="font-['Tinos']">My Account</h1>
          </div>
        </div>

        <div className="max-w-[480px] mx-auto px-5 py-16">
          <div className="bg-white border border-gray-200 p-8">
            <div className="flex gap-6 mb-8 border-b border-gray-200">
              <button
                onClick={() => setAuthMode('login')}
                className={`pb-3 text-sm uppercase tracking-wider transition-colors ${
                  authMode === 'login'
                    ? 'border-b-2 border-black text-black'
                    : 'text-gray-500 hover:text-black'
                }`}
              >
                Sign in
              </button>
              <button
                onClick={() => setAuthMode('create')}
                className={`pb-3 text-sm uppercase tracking-wider transition-colors ${
                  authMode === 'create'
                    ? 'border-b-2 border-black text-black'
                    : 'text-gray-500 hover:text-black'
                }`}
              >
                Create account
              </button>
            </div>

            {authMode === 'create' && (
              <div className="mb-5">
                <label htmlFor="account-name" className="block text-sm mb-2">
                  Full name
                </label>
                <input
                  id="account-name"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:border-black transition-colors"
                />
              </div>
            )}

            <div className="mb-5">
              <label htmlFor="account-email" className="block text-sm mb-2">
                Email
              </label>
              <input
                id="account-email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:border-black transition-colors"
              />
            </div>

            <div className="mb-6">
              <label htmlFor="account-password" className="block text-sm mb-2">
                Password
              </label>
              <input
                id="account-password"
                type="password"
                autoComplete={authMode === 'login' ? 'current-password' : 'new-password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSubmit();
                }}
                className="w-full border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:border-black transition-colors"
              />
              {authMode === 'create' && (
                <p className="text-xs text-gray-500 mt-2">At least 8 characters</p>
              )}
            </div>

            <button
              onClick={handleSubmit}
              disabled={busy}
              className="w-full bg-black text-white py-4 text-sm uppercase tracking-wider hover:bg-gray-900 transition-colors disabled:opacity-50"
            >
              {busy ? 'Please wait' : authMode === 'login' ? 'Sign in' : 'Create account'}
            </button>

            {authMode === 'login' && (
              <button
                onClick={handleForgotPassword}
                className="w-full text-center text-sm text-gray-600 hover:text-black mt-4 transition-colors"
              >
                Forgot your password
              </button>
            )}
          </div>

          <button
            onClick={() => navigate('/')}
            className="w-full text-center text-sm text-gray-600 hover:text-black mt-6 transition-colors"
          >
            Continue shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-[1400px] mx-auto px-5 py-6">
          <h1 className="font-['Tinos']">My Account</h1>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-5 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white border border-gray-200 p-6">
              <div className="mb-6">
                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-3">
                  <User className="w-8 h-8 text-gray-500" />
                </div>
                <h3 className="font-medium">{user.email}</h3>
              </div>

              <nav className="space-y-1">
                <button
                  onClick={() => setActiveTab('orders')}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-sm transition-colors ${
                    activeTab === 'orders'
                      ? 'bg-black text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Package className="w-4 h-4" />
                  <span>Order History</span>
                </button>

                <button
                  onClick={() => setActiveTab('account')}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-sm transition-colors ${
                    activeTab === 'account'
                      ? 'bg-black text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <User className="w-4 h-4" />
                  <span>Account Details</span>
                </button>

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 transition-colors border-t border-gray-200 mt-2 pt-3"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Order History Tab */}
            {activeTab === 'orders' && (
              <div>
                <h2 className="font-['Tinos'] mb-6">Order History</h2>
                
                {orders.length > 0 ? (
                  <div className="space-y-6">
                    {orders.map((order) => (
                      <div key={order.id} className="bg-white border border-gray-200 p-6">
                        <div className="flex items-start justify-between mb-4 pb-4 border-b border-gray-200">
                          <div>
                            <p className="text-sm text-gray-600 mb-1">Order Number</p>
                            <p className="font-medium">{order.id}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-gray-600 mb-1">Order Date</p>
                            <p className="font-medium">
                              {new Date(order.created_at).toLocaleDateString('en-US', {
                                month: 'long',
                                day: 'numeric',
                                year: 'numeric'
                              })}
                            </p>
                          </div>
                        </div>

                        <div className="mb-4">
                          <div className="flex items-center gap-2 mb-2">
                            <span className={`inline-block px-3 py-1 text-xs font-medium ${
                              order.status === 'Delivered'
                                ? 'bg-green-100 text-green-800'
                                : order.status === 'Shipped'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {order.status}
                            </span>
                          </div>
                        </div>

                        {order.items && order.items.length > 0 ? (
                          <div className="space-y-3 mb-4">
                            {order.items.map((item: any, index: number) => (
                              <div key={index} className="flex gap-4">
                                <div className="flex-1">
                                  <p className="font-medium text-sm">{item.name}</p>
                                  <p className="text-xs text-gray-600">Size: {item.size}</p>
                                  <p className="text-xs text-gray-600">Qty: {item.quantity}</p>
                                </div>
                                <p className="font-medium">${item.price.toLocaleString()}</p>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-sm text-gray-500 mb-4">No items available</p>
                        )}

                        <div className="pt-4 border-t border-gray-200 flex items-center justify-between">
                          <p className="font-medium">Total</p>
                          <p className="font-['Tinos'] text-lg">${order.total.toLocaleString()}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-white border border-gray-200 p-12 text-center">
                    <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="font-['Tinos'] text-lg mb-2">No Orders Yet</h3>
                    <p className="text-sm text-gray-600 mb-6">
                      Start shopping to see your order history here
                    </p>
                    <button
                      onClick={() => navigate('/shop')}
                      className="bg-black text-white px-6 py-3 hover:bg-gray-800 transition-colors"
                    >
                      Shop Now
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Account Details Tab */}
            {activeTab === 'account' && (
              <div>
                <h2 className="font-['Tinos'] mb-6">Account Details</h2>

                <div className="bg-white border border-gray-200 p-6 space-y-6">
                  <div>
                    <label className="block text-sm text-gray-600 mb-2">Email</label>
                    <p className="font-medium">{user.email}</p>
                  </div>

                  <div>
                    <label className="block text-sm text-gray-600 mb-2">Account Created</label>
                    <p className="font-medium">
                      {new Date(user.created_at).toLocaleDateString('en-US', {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </p>
                  </div>

                  <div className="pt-6 border-t border-gray-200">
                    <button className="text-sm text-gray-600 hover:text-black transition-colors">
                      Change Password
                    </button>
                  </div>
                </div>

                <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-blue-900 font-medium mb-1">Profile Features Coming Soon</p>
                    <p className="text-xs text-blue-800">
                      Full profile editing, saved addresses, and payment methods will be available after database setup.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
