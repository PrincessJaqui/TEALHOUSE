import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { AdminLayout, StatTile } from '../components/AdminLayout';
import { formatPrice } from '../config/store';

interface DashboardStats {
  totalOrders: number;
  totalRevenue: number;
  totalProducts: number;
  totalCustomers: number;
  pendingOrders: number;
  outOfStock: number;
  unreadMessages: number;
  recentOrders: any[];
}

export function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats>({
    totalOrders: 0,
    totalRevenue: 0,
    totalProducts: 0,
    totalCustomers: 0,
    pendingOrders: 0,
    outOfStock: 0,
    unreadMessages: 0,
    recentOrders: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [ordersResult, productsResult, customersResult, messagesResult] =
        await Promise.all([
          supabase.from('orders').select('*').order('created_at', { ascending: false }),
          supabase.from('products').select('id, stock'),
          supabase.from('customers').select('id', { count: 'exact', head: true }),
          supabase
            .from('contact_messages')
            .select('id', { count: 'exact', head: true })
            .eq('handled', false),
        ]);

      const orders = ordersResult.data ?? [];
      const products = productsResult.data ?? [];

      // Only count money that actually arrived. Counting unpaid orders as
      // revenue is how a dashboard starts lying to you.
      const totalRevenue = orders
        .filter((o) => o.payment_status === 'paid')
        .reduce((sum, o) => sum + Number(o.total ?? 0), 0);

      const outOfStock = products.filter((p) => {
        const values = Object.values((p.stock ?? {}) as Record<string, number>);
        return values.reduce((n, v) => n + Number(v ?? 0), 0) <= 0;
      }).length;

      setStats({
        totalOrders: orders.length,
        totalRevenue,
        totalProducts: products.length,
        totalCustomers: customersResult.count ?? 0,
        pendingOrders: orders.filter((o) => o.status === 'pending').length,
        outOfStock,
        unreadMessages: messagesResult.count ?? 0,
        recentOrders: orders.slice(0, 5),
      });
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout title="Dashboard">
        <p className="text-sm text-gray-600">Loading</p>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout
      title="Dashboard"
      description="Everything happening with TEALHOUSE right now"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatTile
          label="Revenue"
          value={formatPrice(stats.totalRevenue)}
          note="Paid orders only"
        />
        <StatTile label="Orders" value={stats.totalOrders} />
        <StatTile label="Products" value={stats.totalProducts} />
        <StatTile label="Customers" value={stats.totalCustomers} />
      </div>

      {(stats.pendingOrders > 0 || stats.outOfStock > 0 || stats.unreadMessages > 0) && (
        <div className="bg-white border border-gray-200 p-6 mb-8">
          <h2 className="font-['Tinos'] text-xl mb-4">Needs attention</h2>
          <div className="space-y-3 text-sm">
            {stats.pendingOrders > 0 && (
              <button
                onClick={() => navigate('/admin/orders')}
                className="w-full flex items-center justify-between py-2 border-b border-gray-100 hover:text-[#008080] transition-colors text-left"
              >
                <span>
                  {stats.pendingOrders} {stats.pendingOrders === 1 ? 'order' : 'orders'} awaiting
                  processing
                </span>
                <span className="text-gray-400">View</span>
              </button>
            )}
            {stats.unreadMessages > 0 && (
              <button
                onClick={() => navigate('/admin/messages')}
                className="w-full flex items-center justify-between py-2 border-b border-gray-100 hover:text-[#008080] transition-colors text-left"
              >
                <span>
                  {stats.unreadMessages} unread{' '}
                  {stats.unreadMessages === 1 ? 'enquiry' : 'enquiries'}
                </span>
                <span className="text-gray-400">View</span>
              </button>
            )}
            {stats.outOfStock > 0 && (
              <button
                onClick={() => navigate('/admin/products')}
                className="w-full flex items-center justify-between py-2 hover:text-[#008080] transition-colors text-left"
              >
                <span>
                  {stats.outOfStock} {stats.outOfStock === 1 ? 'product' : 'products'} with no
                  stock in any size
                </span>
                <span className="text-gray-400">View</span>
              </button>
            )}
          </div>
        </div>
      )}

      <div className="bg-white border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="font-['Tinos'] text-xl">Recent orders</h2>
        </div>

        {stats.recentOrders.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <p className="text-sm text-gray-600">No orders yet</p>
            <p className="text-xs text-gray-500 mt-1">
              Orders appear here as customers buy
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left px-6 py-3 text-xs uppercase tracking-wider text-gray-500">
                    Customer
                  </th>
                  <th className="text-left px-6 py-3 text-xs uppercase tracking-wider text-gray-500">
                    Total
                  </th>
                  <th className="text-left px-6 py-3 text-xs uppercase tracking-wider text-gray-500">
                    Status
                  </th>
                  <th className="text-left px-6 py-3 text-xs uppercase tracking-wider text-gray-500">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody>
                {stats.recentOrders.map((order) => (
                  <tr
                    key={order.id}
                    className="border-b border-gray-100 last:border-0 hover:bg-gray-50 cursor-pointer"
                    onClick={() => navigate('/admin/orders')}
                  >
                    <td className="px-6 py-4 text-sm">
                      {order.customer_name || order.customer_email || 'Guest'}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {formatPrice(Number(order.total ?? 0))}
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs uppercase tracking-wider text-gray-600">
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {order.created_at
                        ? new Date(order.created_at).toLocaleDateString()
                        : ''}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
