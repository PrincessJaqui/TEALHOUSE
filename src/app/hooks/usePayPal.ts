import { useEffect, useRef, useState } from 'react';

/**
 * Loads the PayPal JavaScript SDK v6 and creates an SDK instance.
 *
 * v6 differs from earlier versions in a way that matters: createOrder must
 * resolve to an object shaped { orderId }, not a bare id string. Getting that
 * wrong fails silently with a button that does nothing.
 *
 * The client id is public by design and ships in the bundle. The secret lives
 * only in the Vercel functions under /api.
 */

declare global {
  interface Window {
    paypal?: any;
  }
}

const SDK_ID = 'paypal-web-sdk-v6';

export type PayPalEnv = 'sandbox' | 'live';

export function paypalEnv(): PayPalEnv {
  return import.meta.env.VITE_PAYPAL_ENV === 'live' ? 'live' : 'sandbox';
}

function sdkUrl(env: PayPalEnv) {
  return env === 'live'
    ? 'https://www.paypal.com/web-sdk/v6/core'
    : 'https://www.sandbox.paypal.com/web-sdk/v6/core';
}

function loadScript(env: PayPalEnv): Promise<void> {
  return new Promise((resolve, reject) => {
    const existing = document.getElementById(SDK_ID) as HTMLScriptElement | null;
    if (existing) {
      if (window.paypal) resolve();
      else {
        existing.addEventListener('load', () => resolve());
        existing.addEventListener('error', () => reject(new Error('PayPal SDK failed to load')));
      }
      return;
    }

    const script = document.createElement('script');
    script.id = SDK_ID;
    script.src = sdkUrl(env);
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('PayPal SDK failed to load'));
    document.head.appendChild(script);
  });
}

interface UsePayPalResult {
  sdk: any | null;
  eligible: string[];
  loading: boolean;
  error: string | null;
}

export function usePayPal(enabled: boolean): UsePayPalResult {
  const [sdk, setSdk] = useState<any | null>(null);
  const [eligible, setEligible] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const startedRef = useRef(false);

  useEffect(() => {
    if (!enabled || startedRef.current) return;

    const clientId = import.meta.env.VITE_PAYPAL_CLIENT_ID;
    if (!clientId) {
      setError('Payments are not configured');
      return;
    }

    startedRef.current = true;
    setLoading(true);

    let cancelled = false;

    (async () => {
      try {
        await loadScript(paypalEnv());
        if (cancelled) return;

        const instance = await window.paypal.createInstance({
          clientId,
          components: ['paypal-payments'],
          pageType: 'checkout',
        });
        if (cancelled) return;

        // Always check eligibility before showing a button, otherwise you
        // render a payment option the buyer's region or device cannot use.
        const methods = await instance.findEligibleMethods({ currencyCode: 'USD' });
        if (cancelled) return;

        const available: string[] = [];
        for (const method of ['paypal', 'paylater', 'credit']) {
          try {
            if (methods.isEligible(method)) available.push(method);
          } catch {
            // an unsupported method name is not an error worth surfacing
          }
        }

        setSdk(instance);
        setEligible(available);
      } catch (err) {
        console.error('PayPal SDK error:', err);
        if (!cancelled) setError('Could not load the payment options');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [enabled]);

  return { sdk, eligible, loading, error };
}
