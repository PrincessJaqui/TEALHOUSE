import { adminClient } from '../_lib/cart.js';
import { sendOrderConfirmation, sendOrderAlert } from '../_lib/email.js';

/**
 * Sends the two order emails against a made-up order, so the whole path can
 * be proved before a real customer buys something.
 *
 * Without this the first test of order email is a live sale, which is a poor
 * moment to discover a missing API key.
 *
 * Nothing is written to the orders table and no payment is involved. Admin
 * only, verified against the database rather than trusted from the browser.
 */

export default async function handler(request, response) {
  if (request.method !== 'POST') {
    response.setHeader('Allow', 'POST');
    return response.status(405).json({ error: 'Method not allowed' });
  }

  const token = (request.headers.authorization || '').replace(/^Bearer /, '');
  if (!token) {
    return response.status(401).json({ error: 'Not signed in' });
  }

  try {
    const supabase = adminClient();

    // Who is asking, and are they actually an admin? Checked against
    // admin_users, not taken on trust from the request.
    const { data: userData, error: userError } = await supabase.auth.getUser(token);
    if (userError || !userData?.user?.email) {
      return response.status(401).json({ error: 'Could not verify that session' });
    }

    const { data: admin } = await supabase
      .from('admin_users')
      .select('email')
      .ilike('email', userData.user.email)
      .maybeSingle();

    if (!admin) {
      return response.status(403).json({ error: 'Admins only' });
    }

    const to = String(request.body?.email || userData.user.email).trim();
    if (!to) {
      return response.status(400).json({ error: 'No address to send to' });
    }

    // Shaped exactly like a real order, including a made to measure line and
    // a bespoke retainer, so the conditional notices are exercised too.
    const order = {
      id: 'test-0000-0000',
      customer_email: to,
      items: [
        {
          name: 'Ali One-Piece Swimsuit',
          quantity: 1,
          price: 795,
          color: 'Jet Black',
          sizes: { Bust: '34D', Waist: '27" / 69cm', Hip: 'S' },
          fulfillment_type: 'made_to_measure',
        },
        {
          name: 'Faith High-Waisted Bikini',
          quantity: 1,
          price: 595,
          color: 'Signature Teal',
          sizes: { Top: 'S', Bottom: 'M' },
          fulfillment_type: 'in_stock',
        },
      ],
      subtotal: 1390,
      shipping_cost: 0,
      tax: 0,
      total: 1390,
    };

    const [confirmation, alert] = await Promise.all([
      sendOrderConfirmation(order),
      sendOrderAlert(order),
    ]);

    return response.status(200).json({
      confirmation,
      alert,
      sentTo: to,
      alertTo: process.env.ORDER_ALERT_TO || null,
      // Named so a missing one is obvious rather than guessed at.
      configured: {
        RESEND_API_KEY: Boolean(process.env.RESEND_API_KEY),
        ORDER_FROM_EMAIL: Boolean(process.env.ORDER_FROM_EMAIL),
        ORDER_ALERT_TO: Boolean(process.env.ORDER_ALERT_TO),
      },
    });
  } catch (error) {
    console.error('Test email failed:', error);
    return response.status(500).json({ error: String(error?.message || error) });
  }
}
