import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Seo } from '../components/Seo';
import { formatPrice } from '../config/store';
import { describeSelection } from '../config/taxonomy';
import { BESPOKE_COPY, formatShipEstimate } from '../config/fulfillment';

/**
 * Order confirmation.
 *
 * The site had none. After paying, a customer was sent to their account
 * page, or to the homepage if they checked out as a guest, with the order id
 * passed in router state that nothing read. A guest paid and landed on the
 * homepage with no confirmation at all.
 */
export function OrderConfirmation() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    (async () => {
      if (!id) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (!active) return;

      if (error) console.error('Could not load order:', error);
      setOrder(data ?? null);
      setLoading(false);
    })();

    return () => {
      active = false;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white pt-20">
        <div className="max-w-[800px] mx-auto px-5 py-16">
          <p className="text-sm text-gray-600">Loading your order</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-white pt-20">
        <Seo title="Order" noIndex />
        <div className="max-w-[800px] mx-auto px-5 py-16 text-center">
          <h1 className="font-['Tinos'] text-3xl mb-4">We could not find that order</h1>
          <p className="text-sm text-gray-600 mb-8">
            If you have just paid, your payment went through. Please contact us and
            we will confirm the details.
          </p>
          <button
            onClick={() => navigate('/')}
            className="bg-black text-white px-8 py-4 text-sm uppercase tracking-wider hover:bg-gray-900 transition-colors"
          >
            Continue shopping
          </button>
        </div>
      </div>
    );
  }

  const items: any[] = order.items ?? [];
  const bespokeItems = items.filter((item) => item.is_retainer);
  const preOrderItems = items.filter((item) => item.fulfillment_type === 'pre_order');

  return (
    <div className="min-h-screen bg-white pt-20">
      <Seo title="Order confirmed" noIndex />

      <div className="max-w-[800px] mx-auto px-5 py-16">
        <div className="text-center mb-12">
          <p className="text-xs uppercase tracking-wider text-gray-500 mb-3">
            Thank you
          </p>
          <h1 className="font-['Tinos'] text-4xl mb-4">Your order is confirmed</h1>
          <p className="text-sm text-gray-600">
            A confirmation is on its way to {order.customer_email}
          </p>
          <p className="text-xs text-gray-500 mt-4">
            Order reference {String(order.id).slice(0, 8).toUpperCase()}
          </p>
        </div>

        {/* The bespoke message, shown only when the order contains one. */}
        {bespokeItems.length > 0 && (
          <div className="border border-[#008080] p-6 mb-10">
            <p className="text-xs uppercase tracking-wider text-[#008080] mb-3">
              Your bespoke request
            </p>
            <p className="text-sm text-gray-700 leading-relaxed">
              {BESPOKE_COPY.afterCheckout}
            </p>
          </div>
        )}

        {preOrderItems.length > 0 && (
          <div className="border border-gray-200 bg-gray-50 p-6 mb-10">
            <p className="text-xs uppercase tracking-wider text-gray-500 mb-3">
              Pre-order
            </p>
            <p className="text-sm text-gray-700 leading-relaxed">
              Your pre-ordered pieces will be made and dispatched as soon as they are
              ready. We will keep you informed if any estimated date moves.
            </p>
          </div>
        )}

        <div className="border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="font-['Tinos'] text-xl">Your order</h2>
          </div>

          <div className="divide-y divide-gray-100">
            {items.map((item, index) => (
              <div key={index} className="px-6 py-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm">{item.name}</p>
                    {item.sizes ? (
                      <p className="text-xs text-gray-600 mt-1">
                        {describeSelection(item.sizes)}
                      </p>
                    ) : item.size ? (
                      <p className="text-xs text-gray-600 mt-1">Size {item.size}</p>
                    ) : null}
                    <p className="text-xs text-gray-500 mt-1">
                      Quantity {item.quantity}
                    </p>
                    {item.is_retainer && (
                      <p className="text-xs text-[#008080] uppercase tracking-wider mt-2">
                        Retainer, credited toward your final price
                      </p>
                    )}
                    {item.notes && (
                      <p className="text-xs text-gray-600 mt-3 whitespace-pre-wrap">
                        {item.notes}
                      </p>
                    )}
                  </div>
                  <p className="text-sm shrink-0">
                    {formatPrice(Number(item.price) * Number(item.quantity))}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="px-6 py-5 border-t border-gray-200 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Subtotal</span>
              <span>{formatPrice(Number(order.subtotal ?? 0))}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Shipping</span>
              <span>
                {Number(order.shipping_cost ?? 0) === 0
                  ? 'Free'
                  : formatPrice(Number(order.shipping_cost))}
              </span>
            </div>
            {Number(order.tax ?? 0) > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Tax</span>
                <span>{formatPrice(Number(order.tax))}</span>
              </div>
            )}
            <div className="flex justify-between pt-3 border-t border-gray-200">
              <span>Paid today</span>
              <span>{formatPrice(Number(order.total ?? 0))}</span>
            </div>
          </div>
        </div>

        <div className="flex gap-4 mt-10">
          <button
            onClick={() => navigate('/')}
            className="flex-1 bg-black text-white py-4 text-sm uppercase tracking-wider hover:bg-gray-900 transition-colors"
          >
            Continue shopping
          </button>
          <Link
            to="/customer-account"
            className="flex-1 border border-gray-300 py-4 text-sm uppercase tracking-wider text-center hover:border-black transition-colors"
          >
            View my orders
          </Link>
        </div>
      </div>
    </div>
  );
}
