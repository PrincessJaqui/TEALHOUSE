import { paypalFetch, paypalBase } from '../_lib/paypal.js';
import { adminClient } from '../_lib/cart.js';

/**
 * PayPal webhook.
 *
 * The capture endpoint already records the order on the happy path. This is
 * the safety net for everything else: a refund issued from the PayPal
 * dashboard, a reversed capture, a dispute. Without it your admin screen
 * would still show an order as paid after you refunded it by hand.
 *
 * Every event is verified with PayPal before it is acted on. An unverified
 * webhook body is just a stranger posting JSON at your server.
 */
export const config = {
  api: { bodyParser: false },
};

async function readRawBody(req) {
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  return Buffer.concat(chunks).toString('utf8');
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const webhookId = process.env.PAYPAL_WEBHOOK_ID;
  if (!webhookId) {
    console.error('PAYPAL_WEBHOOK_ID is not set, refusing to trust this webhook');
    return res.status(500).json({ error: 'Webhook not configured' });
  }

  let raw;
  try {
    raw = await readRawBody(req);
  } catch {
    return res.status(400).json({ error: 'Could not read body' });
  }

  let event;
  try {
    event = JSON.parse(raw);
  } catch {
    return res.status(400).json({ error: 'Invalid JSON' });
  }

  // Verify with PayPal before acting
  const verification = await paypalFetch('/v1/notifications/verify-webhook-signature', {
    method: 'POST',
    body: JSON.stringify({
      auth_algo: req.headers['paypal-auth-algo'],
      cert_url: req.headers['paypal-cert-url'],
      transmission_id: req.headers['paypal-transmission-id'],
      transmission_sig: req.headers['paypal-transmission-sig'],
      transmission_time: req.headers['paypal-transmission-time'],
      webhook_id: webhookId,
      webhook_event: event,
    }),
  });

  if (!verification.ok || verification.body?.verification_status !== 'SUCCESS') {
    console.error('Webhook verification failed', verification.status, verification.body);
    return res.status(401).json({ error: 'Signature verification failed' });
  }

  const supabase = adminClient();
  const captureId = event?.resource?.id ?? null;
  const eventType = event?.event_type;

  try {
    switch (eventType) {
      case 'PAYMENT.CAPTURE.COMPLETED': {
        if (captureId) {
          await supabase
            .from('orders')
            .update({ payment_status: 'paid' })
            .eq('paypal_capture_id', captureId);
        }
        break;
      }

      case 'PAYMENT.CAPTURE.REFUNDED':
      case 'PAYMENT.CAPTURE.REVERSED': {
        // On a refund the capture id arrives on the related links, not as
        // the resource id, which is the refund's own id.
        const relatedCapture =
          event?.resource?.links?.find((l) => l.rel === 'up')?.href?.split('/').pop() ?? null;

        if (relatedCapture) {
          await supabase
            .from('orders')
            .update({ payment_status: 'refunded', status: 'cancelled' })
            .eq('paypal_capture_id', relatedCapture);
        }
        break;
      }

      case 'PAYMENT.CAPTURE.DENIED': {
        if (captureId) {
          await supabase
            .from('orders')
            .update({ payment_status: 'failed' })
            .eq('paypal_capture_id', captureId);
        }
        break;
      }

      default:
        // Acknowledged and ignored. PayPal retries anything we do not 200.
        break;
    }
  } catch (error) {
    console.error('Webhook handling error:', error);
    return res.status(500).json({ error: 'Handler failed' });
  }

  return res.status(200).json({ received: true });
}
