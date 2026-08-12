import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { CartItem } from '../App';
import { usePayPal, paypalEnv } from '../hooks/usePayPal';

interface PayPalCheckoutProps {
  items: CartItem[];
  shippingMethod: 'standard' | 'express';
  /** Just the string. The server decides what it is worth. */
  discountCode?: string;
  shipping: {
    firstName: string;
    lastName: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  email: string;
  userId: string | null;
  onSuccess: (orderId: string) => void;
}

/**
 * PayPal Standard Checkout.
 *
 * Note what is deliberately absent: this component sends no prices. It sends
 * product ids, sizes and quantities, and the server recomputes every figure
 * from the database. PayPal's own guidance is not to pass the item total up
 * from the browser, because a determined buyer can change it.
 */
export function PayPalCheckout({
  items,
  shippingMethod,
  discountCode,
  shipping,
  email,
  userId,
  onSuccess,
}: PayPalCheckoutProps) {
  const { sdk, eligible, loading, error } = usePayPal(items.length > 0);
  const [busy, setBusy] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const boundRef = useRef(false);

  // Kept in a ref so the click handler always reads current values rather
  // than whatever they were when the button was first wired up.
  const latest = useRef({ items, shippingMethod, shipping, email, userId });
  latest.current = { items, shippingMethod, shipping, email, userId };

  useEffect(() => {
    if (!sdk || boundRef.current || !containerRef.current) return;
    if (!eligible.includes('paypal')) return;

    boundRef.current = true;

    const createOrder = async () => {
      const { items: currentItems, shippingMethod: method } = latest.current;

      const response = await fetch('/api/paypal/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          shippingMethod: method,
          shipping: latest.current.shipping,
          items: currentItems.map((item) => ({
            product_id: item.product.id,
            quantity: item.quantity,
            size: item.size ?? null,
            sizes: item.sizes ?? null,
            color: item.color ?? null,
            notes: item.notes ?? null,
            measurements: item.measurements ?? null,
          })),
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Could not start the payment');

      // v6 requires this exact shape. A bare string silently does nothing.
      return { orderId: data.id };
    };

    const sessionOptions = {
      async onApprove(data: any) {
        setBusy(true);
        try {
          const current = latest.current;
          const response = await fetch('/api/paypal/capture-order', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              orderId: data.orderId,
              shippingMethod: current.shippingMethod,
              shipping: current.shipping,
              email: current.email,
              userId: current.userId,
              items: current.items.map((item) => ({
                product_id: item.product.id,
                quantity: item.quantity,
                size: item.size ?? null,
                sizes: item.sizes ?? null,
                color: item.color ?? null,
                notes: item.notes ?? null,
                measurements: item.measurements ?? null,
              })),
            }),
          });

          const result = await response.json();

          if (!response.ok) {
            toast.error(result.error || 'Payment could not be completed');
            return;
          }

          onSuccess(result.orderId);
        } catch (err) {
          console.error('Capture error:', err);
          toast.error('Payment could not be completed. Please contact us before trying again.');
        } finally {
          setBusy(false);
        }
      },

      onCancel() {
        toast('Payment cancelled. Your bag is still here.');
      },

      onError(err: any) {
        console.error('PayPal error:', err);
        toast.error('Something went wrong with the payment');
      },
    };

    const session = sdk.createPayPalOneTimePaymentSession(sessionOptions);
    const button = containerRef.current.querySelector('paypal-button');
    if (!button) return;

    button.removeAttribute('hidden');
    button.addEventListener('click', async () => {
      try {
        await session.start({ presentationMode: 'auto' }, createOrder());
      } catch (err) {
        console.error('PayPal start error:', err);
        toast.error('Could not open the payment window');
      }
    });
  }, [sdk, eligible, onSuccess]);

  if (error) {
    return (
      <div className="border border-gray-300 p-4 text-sm text-gray-700">
        {error}. Please contact us and we will take your order directly.
      </div>
    );
  }

  return (
    <div>
      {paypalEnv() === 'sandbox' && (
        <div className="mb-4 border border-amber-300 bg-amber-50 px-4 py-3 text-xs text-amber-900">
          Sandbox mode. No real money moves. Set VITE_PAYPAL_ENV to live when you are ready.
        </div>
      )}

      {loading && <p className="text-sm text-gray-600 mb-4">Loading payment options</p>}
      {busy && <p className="text-sm text-gray-600 mb-4">Completing your order, do not close this window</p>}

      <div ref={containerRef}>
        {/* v6 renders into its own web component */}
        <paypal-button hidden style={{ display: 'block' }}></paypal-button>
      </div>

      {/*
        Required by PayPal when card payments are presented. Do not remove:
        it is a condition of using their card processing.
      */}
      <p className="text-xs text-gray-600 leading-relaxed mt-6">
        By paying with your card, you acknowledge that your data will be processed by PayPal
        subject to the PayPal Privacy Statement available at{' '}
        <a
          href="https://www.paypal.com/us/legalhub/privacy-full"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-black"
        >
          PayPal.com
        </a>
        .
      </p>
    </div>
  );
}
