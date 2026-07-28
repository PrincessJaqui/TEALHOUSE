import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  Edit, 
  Users, 
  ShoppingCart, 
  FileText, 
  LogOut, 
  TrendingUp, 
  Eye, 
  Search, 
  Filter, 
  Send, 
  Plus,
  AlertCircle
} from 'lucide-react';
import imgLogo from "figma:asset/3f298acd9128513aa329c386495f656e449305d1.png";
import { AdminProducts } from './AdminProducts';
import { AdminCustomers } from './AdminCustomers';
import { supabase } from '../lib/supabase';
import { toast } from 'sonner';
import { useSupabaseAuth } from '../hooks/useSupabaseAuth';

// Types for real data
interface Order {
  id: string;
  customer_email: string;
  customer_name: string;
  created_at: string;
  total: number;
  status: string;
  items_count: number;
}

interface BlogPost {
  id: string;
  title: string;
  created_at: string;
  status: string;
  views: number;
}

interface Analytics {
  totalOrders: number;
  totalRevenue: number;
  avgOrderValue: number;
}

export function CompanyLogin() {
  const navigate = useNavigate();
  const { user, loading } = useSupabaseAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'orders' | 'products' | 'customers' | 'abandoned' | 'blog'>('dashboard');
  
  // Real data state
  const [orders, setOrders] = useState<Order[]>([]);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [analytics, setAnalytics] = useState<Analytics>({
    totalOrders: 0,
    totalRevenue: 0,
    avgOrderValue: 0
  });
  const [dataLoading, setDataLoading] = useState(false);

  // Load real data when authenticated
  useEffect(() => {
    if (user) {
      loadDashboardData();
    }
  }, [user]);

  const loadDashboardData = async () => {
    setDataLoading(true);
    try {
      // Load orders
      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      if (!ordersError && ordersData) {
        setOrders(ordersData);
        
        // Calculate analytics from orders
        const totalOrders = ordersData.length;
        const totalRevenue = ordersData.reduce((sum, order) => sum + (order.total || 0), 0);
        const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
        
        setAnalytics({
          totalOrders,
          totalRevenue,
          avgOrderValue
        });
      }

      // Load blog posts
      const { data: postsData, error: postsError } = await supabase
        .from('blog_posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (!postsError && postsData) {
        setBlogPosts(postsData);
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setDataLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast.error('Invalid email or password');
        console.error('Login error:', error);
        return;
      }

      if (data.user) {
        toast.success('Successfully logged in!');
      }
    } catch (error) {
      console.error('Unexpected login error:', error);
      toast.error('Login failed. Please try again.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast.success('Logged out successfully');
      navigate('/company-login');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Failed to logout');
    }
  };

  // Show loading state while checking authentication
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

  // Show login form if not authenticated
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full bg-white shadow-sm border border-gray-200 p-8">
          <div className="text-center mb-8">
            <img src={imgLogo} alt="TEALHOUSE" className="h-8 mx-auto mb-4" />
            <h1 className="font-['Tinos'] mb-2">Company Login</h1>
            <p className="text-sm text-gray-600">Admin Dashboard Access</p>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label htmlFor="admin-email" className="block text-sm mb-2">
                Admin Email
              </label>
              <input
                type="email"
                id="admin-email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:border-black transition-colors"
                required
                disabled={isLoggingIn}
              />
            </div>

            <div>
              <label htmlFor="admin-password" className="block text-sm mb-2">
                Password
              </label>
              <input
                type="password"
                id="admin-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:border-black transition-colors"
                required
                disabled={isLoggingIn}
              />
            </div>

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full bg-black text-white py-3 hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoggingIn ? 'Signing in...' : 'Sign In to Dashboard'}
            </button>
          </form>
          
          <div className="mt-6 text-center">
            <button 
              onClick={() => navigate('/')}
              className="text-sm text-gray-600 hover:text-black transition-colors"
            >
              ← Back to site
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="border-b border-gray-200 bg-white sticky top-0 z-50">
        
      </div>

      <div className="max-w-[1400px] mx-auto px-5 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <nav className="bg-white border border-gray-200 p-4 space-y-1">
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`w-full flex items-center gap-3 px-4 py-3 text-sm transition-colors ${
                  activeTab === 'dashboard'
                    ? 'bg-[#40E0D0] text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Dashboard</span>
              </button>
              <button
                onClick={() => setActiveTab('orders')}
                className={`w-full flex items-center gap-3 px-4 py-3 text-sm transition-colors ${
                  activeTab === 'orders'
                    ? 'bg-[#40E0D0] text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Package className="w-4 h-4" />
                <span>Orders</span>
              </button>
              <button
                onClick={() => setActiveTab('products')}
                className={`w-full flex items-center gap-3 px-4 py-3 text-sm transition-colors ${
                  activeTab === 'products'
                    ? 'bg-[#40E0D0] text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Edit className="w-4 h-4" />
                <span>Products</span>
              </button>
              <button
                onClick={() => setActiveTab('customers')}
                className={`w-full flex items-center gap-3 px-4 py-3 text-sm transition-colors ${
                  activeTab === 'customers'
                    ? 'bg-[#40E0D0] text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Users className="w-4 h-4" />
                <span>Customers</span>
              </button>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm transition-colors text-gray-700 hover:bg-gray-100 border-t border-gray-200 mt-2 pt-3"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </nav>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-4">
            {/* Dashboard */}
            {activeTab === 'dashboard' && (
              <div>
                <h2 className="font-['Tinos'] mb-6">Analytics Dashboard</h2>
                
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="bg-white border border-gray-200 p-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">Total Orders</span>
                      <Package className="w-4 h-4 text-gray-400" />
                    </div>
                    <p className="font-['Tinos'] text-2xl">{analytics.totalOrders.toLocaleString()}</p>
                    <p className="text-xs text-gray-500 mt-1">From orders table</p>
                  </div>
                  
                  <div className="bg-white border border-gray-200 p-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">Total Revenue</span>
                      <TrendingUp className="w-4 h-4 text-gray-400" />
                    </div>
                    <p className="font-['Tinos'] text-2xl">${analytics.totalRevenue.toLocaleString()}</p>
                    <p className="text-xs text-gray-500 mt-1">From completed orders</p>
                  </div>
                  
                  <div className="bg-white border border-gray-200 p-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">Avg Order Value</span>
                      <TrendingUp className="w-4 h-4 text-gray-400" />
                    </div>
                    <p className="font-['Tinos'] text-2xl">${analytics.avgOrderValue.toFixed(0)}</p>
                    <p className="text-xs text-gray-500 mt-1">Calculated from orders</p>
                  </div>
                </div>

                {/* Recent Orders */}
                <div className="bg-white border border-gray-200 p-6">
                  <h3 className="font-['Tinos'] mb-4">Recent Orders</h3>
                  {dataLoading ? (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black mx-auto mb-2"></div>
                      <p className="text-sm text-gray-600">Loading orders...</p>
                    </div>
                  ) : orders.length > 0 ? (
                    <div className="space-y-3">
                      {orders.slice(0, 5).map((order) => (
                        <div key={order.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                          <div>
                            <p className="text-sm font-medium">{order.id}</p>
                            <p className="text-xs text-gray-600">{order.customer_name || order.customer_email}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium">${order.total.toLocaleString()}</p>
                            <span className="text-xs text-gray-600">{order.status}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-sm text-gray-600 mb-1">No orders yet</p>
                      <p className="text-xs text-gray-500">Orders will appear here when customers make purchases</p>
                    </div>
                  )}
                </div>

                {/* Setup Notice */}
                <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-blue-900 font-medium mb-1">Database Setup Required</p>
                    <p className="text-xs text-blue-800">
                      To track orders and analytics, create the <code className="bg-blue-100 px-1 py-0.5 rounded">orders</code> and <code className="bg-blue-100 px-1 py-0.5 rounded">blog_posts</code> tables in your Supabase database. See <code className="bg-blue-100 px-1 py-0.5 rounded">/SUPABASE_SETUP.md</code> for instructions.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Orders */}
            {activeTab === 'orders' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-['Tinos']\">Orders Management</h2>
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search orders..."
                        className="pl-10 pr-4 py-2 border border-gray-300 focus:outline-none focus:border-black transition-colors text-sm"
                      />
                    </div>
                  </div>
                </div>

                {dataLoading ? (
                  <div className="bg-white border border-gray-200 p-12 text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading orders...</p>
                  </div>
                ) : orders.length > 0 ? (
                  <div className="bg-white border border-gray-200">
                    <table className="w-full">
                      <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs uppercase text-gray-600">Order ID</th>
                          <th className="px-6 py-3 text-left text-xs uppercase text-gray-600">Customer</th>
                          <th className="px-6 py-3 text-left text-xs uppercase text-gray-600">Date</th>
                          <th className="px-6 py-3 text-left text-xs uppercase text-gray-600">Total</th>
                          <th className="px-6 py-3 text-left text-xs uppercase text-gray-600">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {orders.map((order) => (
                          <tr key={order.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 text-sm">{order.id}</td>
                            <td className="px-6 py-4">
                              <p className="text-sm">{order.customer_name || 'Anonymous'}</p>
                              <p className="text-xs text-gray-600">{order.customer_email}</p>
                            </td>
                            <td className="px-6 py-4 text-sm">
                              {new Date(order.created_at).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 text-sm">${order.total.toLocaleString()}</td>
                            <td className="px-6 py-4 text-sm">{order.status}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="bg-white border border-gray-200 p-12 text-center">
                    <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="font-['Tinos'] text-lg mb-2">No Orders Yet</h3>
                    <p className="text-sm text-gray-600 mb-4">Orders from customers will appear here</p>
                    <p className="text-xs text-gray-500">Create the <code className="bg-gray-100 px-2 py-1 rounded">orders</code> table in Supabase to start tracking orders</p>
                  </div>
                )}
              </div>
            )}

            {/* Products */}
            {activeTab === 'products' && (
              <AdminProducts />
            )}

            {/* Customers */}
            {activeTab === 'customers' && (
              <AdminCustomers hideNav={true} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
