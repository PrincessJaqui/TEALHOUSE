import { useState, useEffect } from 'react';
import { supabase, DbOrder } from '../lib/supabase';
import { AdminLayout } from '../components/AdminLayout';
import { exportCsv } from '../lib/csv';
import { toast } from 'sonner';
import { Package, Calendar, DollarSign, User, Eye, Download } from 'lucide-react';
import { Button } from '../components/ui/button';

export function AdminOrders() {
  const [orders, setOrders] = useState<DbOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<DbOrder | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (error) {
      console.error('Error loading orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: newStatus })
        .eq('id', orderId);

      if (error) throw error;
      
      // Reload orders
      await loadOrders();
      
      // Update selected order if it's the one being updated
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder({ ...selectedOrder, status: newStatus });
      }
    } catch (error) {
      console.error('Error updating order:', error);
    }
  };

  const filteredOrders = filterStatus === 'all' 
    ? orders 
    : orders.filter(order => order.status === filterStatus);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'shipped': return 'bg-purple-100 text-purple-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <AdminLayout title="Orders">
        <p className="text-sm text-gray-600">Loading</p>
      </AdminLayout>
    );
  }

  /**
   * One row per order. This is the bookkeeping file.
   */
  const exportOrders = () => {
    exportCsv('orders', filteredOrders, [
      { header: 'Order ID', value: (o) => o.id ?? '' },
      { header: 'Date', value: (o) => (o.created_at ? new Date(o.created_at).toISOString() : '') },
      { header: 'Status', value: (o) => o.status },
      { header: 'Payment', value: (o) => o.payment_status ?? '' },
      { header: 'Method', value: (o) => o.payment_method ?? '' },
      { header: 'Customer', value: (o) => o.customer_name ?? '' },
      { header: 'Email', value: (o) => o.customer_email ?? '' },
      { header: 'Phone', value: (o) => o.customer_phone ?? '' },
      { header: 'Address', value: (o) => o.shipping_address_line1 ?? '' },
      { header: 'City', value: (o) => o.shipping_city ?? '' },
      { header: 'State', value: (o) => o.shipping_state ?? '' },
      { header: 'Postcode', value: (o) => o.shipping_postal_code ?? '' },
      { header: 'Country', value: (o) => o.shipping_country ?? '' },
      { header: 'Items', value: (o) => o.items_count ?? (o.items ?? []).length },
      { header: 'Subtotal', value: (o) => Number(o.subtotal ?? 0).toFixed(2) },
      { header: 'Shipping', value: (o) => Number(o.shipping_cost ?? 0).toFixed(2) },
      { header: 'Tax', value: (o) => Number(o.tax ?? 0).toFixed(2) },
      { header: 'Total', value: (o) => Number(o.total ?? 0).toFixed(2) },
      { header: 'Tracking', value: (o) => o.tracking_number ?? '' },
    ]);
    toast.success('Orders exported');
  };

  /**
   * One row per item across all orders. This is the file you pick and pack
   * from, because an order-level export hides which sizes to pull.
   */
  const exportOrderItems = () => {
    const rows: Array<{ order: DbOrder; item: any }> = [];
    for (const order of filteredOrders) {
      for (const item of order.items ?? []) {
        rows.push({ order, item });
      }
    }

    if (rows.length === 0) {
      toast.error('No order items to export');
      return;
    }

    exportCsv('order-items', rows, [
      { header: 'Order ID', value: (r) => r.order.id ?? '' },
      {
        header: 'Date',
        value: (r) => (r.order.created_at ? new Date(r.order.created_at).toISOString() : ''),
      },
      { header: 'Status', value: (r) => r.order.status },
      { header: 'Customer', value: (r) => r.order.customer_name ?? '' },
      { header: 'Email', value: (r) => r.order.customer_email ?? '' },
      { header: 'Product ID', value: (r) => r.item?.product_id ?? '' },
      { header: 'Product', value: (r) => r.item?.name ?? '' },
      { header: 'Colour', value: (r) => r.item?.color ?? '' },
      {
        header: 'Size',
        value: (r) =>
          r.item?.sizes
            ? Object.entries(r.item.sizes)
                .map(([k, v]) => `${k} ${v}`)
                .join(' / ')
            : (r.item?.size ?? 'One size'),
      },
      { header: 'Quantity', value: (r) => r.item?.quantity ?? 0 },
      { header: 'Unit price', value: (r) => Number(r.item?.price ?? 0).toFixed(2) },
      {
        header: 'Line total',
        value: (r) => (Number(r.item?.price ?? 0) * Number(r.item?.quantity ?? 0)).toFixed(2),
      },
    ]);
    toast.success('Order items exported');
  };

  return (
    <AdminLayout
      title="Orders"
      description={`${orders.length} total`}
      actions={
        <>
          <Button variant="outline" size="sm" onClick={exportOrders} disabled={filteredOrders.length === 0}>
            <Download className="w-4 h-4 mr-2" />
            Orders CSV
          </Button>
          <Button variant="outline" size="sm" onClick={exportOrderItems} disabled={filteredOrders.length === 0}>
            <Download className="w-4 h-4 mr-2" />
            Pick list CSV
          </Button>
        </>
      }
    >
      <div>
        <div className="mb-6">
          <div className="flex flex-wrap gap-2">
            <Button
              variant={filterStatus === 'all' ? 'default' : 'outline'}
              onClick={() => setFilterStatus('all')}
              size="sm"
            >
              All
            </Button>
            <Button
              variant={filterStatus === 'pending' ? 'default' : 'outline'}
              onClick={() => setFilterStatus('pending')}
              size="sm"
            >
              Pending
            </Button>
            <Button
              variant={filterStatus === 'processing' ? 'default' : 'outline'}
              onClick={() => setFilterStatus('processing')}
              size="sm"
            >
              Processing
            </Button>
            <Button
              variant={filterStatus === 'shipped' ? 'default' : 'outline'}
              onClick={() => setFilterStatus('shipped')}
              size="sm"
            >
              Shipped
            </Button>
            <Button
              variant={filterStatus === 'delivered' ? 'default' : 'outline'}
              onClick={() => setFilterStatus('delivered')}
              size="sm"
            >
              Delivered
            </Button>
          </div>
        </div>

        {filteredOrders.length === 0 ? (
          <div className="bg-white p-12 text-center">
            <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No orders found</p>
          </div>
        ) : (
          <div className="bg-white overflow-hidden shadow">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">#{order.id}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {order.customer_name || `${order.shipping_info?.firstName || ''} ${order.shipping_info?.lastName || ''}`.trim() || 'N/A'}
                      </div>
                      <div className="text-sm text-gray-500">{order.customer_email || order.shipping_info?.email || 'N/A'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {new Date(order.created_at!).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        ${order.total.toLocaleString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedOrder(order)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl mb-2">Order #{selectedOrder.id}</h2>
                  <p className="text-gray-600">
                    {new Date(selectedOrder.created_at!).toLocaleString()}
                  </p>
                </div>
                <Button variant="ghost" onClick={() => setSelectedOrder(null)}>
                  ✕
                </Button>
              </div>

              {/* Customer Info */}
              <div className="mb-6">
                <h3 className="font-semibold mb-3">Customer Information</h3>
                <div className="bg-gray-50 p-4 ">
                  <p><strong>Name:</strong> {selectedOrder.customer_name || `${selectedOrder.shipping_info?.firstName || ''} ${selectedOrder.shipping_info?.lastName || ''}`.trim() || 'N/A'}</p>
                  <p><strong>Email:</strong> {selectedOrder.customer_email || selectedOrder.shipping_info?.email || 'N/A'}</p>
                  <p><strong>Phone:</strong> {selectedOrder.customer_phone || selectedOrder.shipping_info?.phone || 'N/A'}</p>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="mb-6">
                <h3 className="font-semibold mb-3">Shipping Address</h3>
                <div className="bg-gray-50 p-4 ">
                  <p>{selectedOrder.shipping_address_line1 || selectedOrder.shipping_info?.address || 'N/A'}</p>
                  {(selectedOrder.shipping_address_line2 || selectedOrder.shipping_info?.address2) && (
                    <p>{selectedOrder.shipping_address_line2 || selectedOrder.shipping_info?.address2}</p>
                  )}
                  <p>
                    {selectedOrder.shipping_city || selectedOrder.shipping_info?.city || ''}, {selectedOrder.shipping_state || selectedOrder.shipping_info?.state || ''} {selectedOrder.shipping_postal_code || selectedOrder.shipping_info?.zipCode || ''}
                  </p>
                  <p>{selectedOrder.shipping_country || selectedOrder.shipping_info?.country || 'US'}</p>
                </div>
              </div>

              {/* Order Items */}
              <div className="mb-6">
                <h3 className="font-semibold mb-3">Order Items</h3>
                <div className="space-y-2">
                  {selectedOrder.items?.map((item: any, idx: number) => (
                    <div key={idx} className="flex justify-between bg-gray-50 p-3 ">
                      <div>
                        <p className="font-medium">{item.product.name}</p>
                        <p className="text-sm text-gray-600">
                          Quantity: {item.quantity} {item.size && `• Size: ${item.size}`}
                        </p>
                      </div>
                      <p className="font-medium">${(item.product.price * item.quantity).toLocaleString()}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Total */}
              <div className="mb-6 border-t pt-4">
                <div className="flex justify-between text-xl font-semibold">
                  <span>Total</span>
                  <span>${selectedOrder.total.toLocaleString()}</span>
                </div>
              </div>

              {/* Status Update */}
              <div>
                <h3 className="font-semibold mb-3">Update Status</h3>
                <div className="flex gap-2 flex-wrap">
                  {['pending', 'processing', 'shipped', 'delivered', 'cancelled'].map((status) => (
                    <Button
                      key={status}
                      variant={selectedOrder.status === status ? 'default' : 'outline'}
                      onClick={() => updateOrderStatus(selectedOrder.id!, status)}
                      size="sm"
                      className="capitalize"
                    >
                      {status}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
