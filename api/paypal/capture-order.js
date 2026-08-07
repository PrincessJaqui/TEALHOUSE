import { paypalFetch, paypalConfigError, money } from '../_lib/paypal.js';
import { priceCart, adminClient } from '../_lib/cart.js';

/**
 * Captures a PayPal order and records it.
 *
 * Order of operations matters. The basket is repriced from the database
 * first, so a manipulated client cannot change what gets charged. Payment
 * is captured second. The order row is written last, and the insert trigger
 * from migration 0003 is the final authority on stock.
 *
 * If that trigger refuses, the last unit sold between pricing and capture.
 * We have the customer's money and nothing to ship, so we refund
 * immediately rather than leave them out of pocket.
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

  const { orderId, items, shippingMethod, region, shipping, email, userId } = req.body ?? {};

  if (!orderId) {
    return res.status(400).json({ error: 'Missing PayPal order id' });
  }

  let priced;
  try {
    priced = await priceCart({ items, shippingMethod, region, state: shipping?.state });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }

  // 1. Capture
  const capture = await paypalFetch(`/v2/checkout/orders/${orderId}/capture`, {
    method: 'POST',
  });

  if (!capture.ok) {
    const issue = capture.body?.details?.[0]?.issue;
    console.error('PayPal capture failed:', capture.status, JSON.stringify(capture.body));

    if (issue === 'INSTRUMENT_DECLINED') {
      return res.status(402).json({ error: 'That payment method was declined', retry: true });
    }
    return res.status(502).json({ error: 'Payment could not be completed' });
  }

  const unit = capture.body?.purchase_units?.[0];
  const captureRecord = unit?.payments?.captures?.[0];
  const captureId = captureRecord?.id ?? null;
  const paidAmount = Number(captureRecord?.amount?.value ?? 0);
  const payer = capture.body?.payer ?? {};

  // 2. Sanity check what PayPal actually took against what we priced
  if (Math.abs(paidAmount - Number(money(priced.total))) > 0.01) {
    console.error('Amount mismatch', { paidAmount, expected: priced.total, orderId });
  }

  const customerEmail = email || payer?.email_address || null;
  if (!customerEmail) {
    console.error('No email available for order', orderId);
  }

  // 3. Record it
  const supabase = adminClient();
  const { data: order, error } = await supabase
    .from('orders')
    .insert({
      user_id: userId || null,
      customer_email: customerEmail,
      customer_name:
        [shipping?.firstName, shipping?.lastName].filter(Boolean).join(' ') ||
        [payer?.name?.given_name, payer?.name?.surname].filter(Boolean).join(' ') ||
        null,
      shipping_address_line1: shipping?.address || null,
      shipping_city: shipping?.city || null,
      shipping_state: shipping?.state || null,
      shipping_postal_code: shipping?.zipCode || null,
      shipping_country: shipping?.country || 'United States',
      status: 'processing',
      payment_status: 'paid',
      payment_method: 'paypal',
      paypal_order_id: orderId,
      paypal_capture_id: captureId,
      subtotal: priced.subtotal,
      shipping_cost: priced.shippingCost,
      tax: priced.tax,
      total: priced.total,
      items_count: priced.lines.reduce((n, l) => n + l.quantity, 0),
      items: priced.lines,
      has_bespoke: priced.hasBespoke,
    })
    .select('id')
    .single();

  if (error) {
    // Almost always the stock trigger refusing. We are holding money for
    // something we cannot ship, so give it straight back.
    console.error('Order insert failed after capture, refunding:', error.message);

    if (captureId) {
      const refund = await paypalFetch(`/v2/payments/captures/${captureId}/refund`, {
        method: 'POST',
        body: JSON.stringify({
          amount: { currency_code: 'USD', value: money(paidAmount) },
          note_to_payer: 'An item sold out while your payment was processing.',
        }),
      });

      if (!refund.ok) {
        console.error('REFUND FAILED, manual action required:', captureId, JSON.stringify(refund.body));
        return res.status(500).json({
          error:
            'Your payment went through but the item sold out, and the automatic refund failed. Please contact us and we will refund you immediately.',
          captureId,
        });
      }
    }

    return res.status(409).json({
      error: 'An item sold out while your payment was processing. You have been refunded in full.',
    });
  }

  return res.status(200).json({ orderId: order.id, paypalOrderId: orderId });
}
