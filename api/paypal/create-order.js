import { paypalFetch, paypalConfigError, money } from '../_lib/paypal.js';
import { priceCart } from '../_lib/cart.js';

/**
 * Creates a PayPal order.
 *
 * The browser sends product ids, sizes and quantities. Nothing else is
 * trusted. Prices, shipping, tax and the grand total are all recomputed
 * from the products table, and stock is checked before PayPal is told
 * anything about the amount.
 */
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const configError = paypalConfigError();
  if (configError) {
    console.error('PayPal config:', configError);
    return res.status(500).json({ error: 'Payments are not configured' });
  }

  try {
    const { items, shippingMethod, region } = req.body ?? {};
    const priced = await priceCart({ items, shippingMethod, region });

    const { ok, status, body } = await paypalFetch('/v2/checkout/orders', {
      method: 'POST',
      body: JSON.stringify({
        intent: 'CAPTURE',
        purchase_units: [
          {
            amount: {
              currency_code: 'USD',
              value: money(priced.total),
              breakdown: {
                item_total: { currency_code: 'USD', value: money(priced.subtotal) },
                shipping: { currency_code: 'USD', value: money(priced.shippingCost) },
                tax_total: { currency_code: 'USD', value: money(priced.tax) },
              },
            },
            items: priced.lines.map((line) => ({
              name: String(line.name).slice(0, 127),
              quantity: String(line.quantity),
              unit_amount: { currency_code: 'USD', value: money(line.price) },
              category: 'PHYSICAL_GOODS',
              ...(line.size ? { description: `Size ${line.size}`.slice(0, 127) } : {}),
            })),
          },
        ],
        application_context: {
          brand_name: 'TEALHOUSE',
          shipping_preference: 'NO_SHIPPING',
          user_action: 'PAY_NOW',
        },
      }),
    });

    if (!ok) {
      console.error('PayPal create order failed:', status, JSON.stringify(body));
      return res.status(502).json({ error: 'Could not start the payment' });
    }

    return res.status(200).json({ id: body.id });
  } catch (error) {
    console.error('create-order error:', error);
    return res.status(400).json({ error: error.message || 'Could not start the payment' });
  }
}
