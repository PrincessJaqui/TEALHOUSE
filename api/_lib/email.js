/**
 * Order email.
 *
 * Until now a customer paid and heard nothing at all, and neither did Jaqui.
 * This sends two messages from the same event: a confirmation to the buyer,
 * and a short alert to whoever is watching the shop.
 *
 * Sent through Resend over plain fetch, so there is no SDK to keep current.
 *
 * Nothing here may ever fail an order. The money has already moved by the
 * time this runs, so every path swallows its errors and logs instead.
 */

const RESEND_ENDPOINT = 'https://api.resend.com/emails';
const SITE = 'https://www.tealhouse.us';

function money(value) {
  return `$${Number(value || 0).toFixed(2)}`;
}

function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/** "Chest 34D · Waist 27" / 69cm", or "Size 38". */
function describeItem(item) {
  const parts = [];
  if (item.color) parts.push(item.color);

  if (item.sizes && typeof item.sizes === 'object') {
    for (const [label, value] of Object.entries(item.sizes)) {
      parts.push(`${label} ${value}`);
    }
  } else if (item.size) {
    parts.push(`Size ${item.size}`);
  }

  return parts.join('  ·  ');
}

async function send({ to, subject, html, text }) {
  const key = process.env.RESEND_API_KEY;
  const from = process.env.ORDER_FROM_EMAIL;

  if (!key || !from) {
    console.warn('Email not sent: RESEND_API_KEY or ORDER_FROM_EMAIL missing');
    return false;
  }

  const recipients = (Array.isArray(to) ? to : [to])
    .map((address) => String(address).trim())
    .filter(Boolean);

  if (recipients.length === 0) return false;

  try {
    const response = await fetch(RESEND_ENDPOINT, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${key}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ from, to: recipients, subject, html, text }),
    });

    if (!response.ok) {
      console.error('Resend refused:', response.status, await response.text());
      return false;
    }
    return true;
  } catch (error) {
    console.error('Could not reach Resend:', error);
    return false;
  }
}

/**
 * The customer's confirmation.
 *
 * Restrained on purpose: a receipt at this price point should read like a
 * note from the house, not a shipping notification.
 */
export async function sendOrderConfirmation(order) {
  const items = order.items ?? [];
  const reference = String(order.id).slice(0, 8).toUpperCase();

  const hasBespoke = items.some((item) => item.is_retainer);
  const hasMadeToMeasure = items.some(
    (item) => item.fulfillment_type === 'made_to_measure'
  );

  const rows = items
    .map((item) => {
      const detail = describeItem(item);
      return `
        <tr>
          <td style="padding:14px 0;border-bottom:1px solid #eee;">
            <div>${escapeHtml(item.name)}</div>
            ${detail ? `<div style="color:#666;font-size:13px;margin-top:4px;">${escapeHtml(detail)}</div>` : ''}
            <div style="color:#888;font-size:13px;margin-top:4px;">Quantity ${Number(item.quantity)}</div>
            ${
              item.is_retainer
                ? '<div style="color:#008080;font-size:12px;text-transform:uppercase;letter-spacing:1px;margin-top:6px;">Retainer, credited toward your final price</div>'
                : ''
            }
          </td>
          <td style="padding:14px 0;border-bottom:1px solid #eee;text-align:right;vertical-align:top;">
            ${money(Number(item.price) * Number(item.quantity))}
          </td>
        </tr>`;
    })
    .join('');

  const notes = [];
  if (hasBespoke) {
    notes.push(
      'We look forward to receiving and thoughtfully reviewing your bespoke ' +
        'request. If a price adjustment is needed, an invoice will be shared ' +
        'for your personal authorization. Should you choose not to move ' +
        'forward, a complete refund will be returned to you.'
    );
  }
  if (hasMadeToMeasure) {
    notes.push(
      'Your made to measure pieces are individually tailored to your ' +
        'measurements. As each is cut to your personal proportions, made to ' +
        'measure orders are non-returnable and non-exchangeable unless a ' +
        'defect is identified upon delivery.'
    );
  }

  const html = `
<div style="font-family:Georgia,serif;max-width:600px;margin:0 auto;padding:40px 24px;color:#111;">
  <div style="text-align:center;margin-bottom:40px;">
    <div style="letter-spacing:6px;font-size:15px;">TEALHOUSE</div>
  </div>

  <p style="font-size:18px;margin-bottom:8px;">Thank you.</p>
  <p style="color:#555;line-height:1.6;">
    Your order is confirmed. Reference ${reference}.
  </p>

  <table style="width:100%;border-collapse:collapse;margin:32px 0;">
    ${rows}
  </table>

  <table style="width:100%;border-collapse:collapse;">
    <tr><td style="color:#666;padding:4px 0;">Subtotal</td>
        <td style="text-align:right;padding:4px 0;">${money(order.subtotal)}</td></tr>
    <tr><td style="color:#666;padding:4px 0;">Shipping</td>
        <td style="text-align:right;padding:4px 0;">${
          Number(order.shipping_cost || 0) === 0 ? 'Complimentary' : money(order.shipping_cost)
        }</td></tr>
    ${
      Number(order.tax || 0) > 0
        ? `<tr><td style="color:#666;padding:4px 0;">Tax</td><td style="text-align:right;padding:4px 0;">${money(order.tax)}</td></tr>`
        : ''
    }
    <tr><td style="padding:12px 0 0;border-top:1px solid #eee;">Paid</td>
        <td style="text-align:right;padding:12px 0 0;border-top:1px solid #eee;">${money(order.total)}</td></tr>
  </table>

  ${notes
    .map(
      (note) =>
        `<div style="border:1px solid #008080;padding:18px;margin-top:28px;color:#333;line-height:1.6;font-size:14px;">${escapeHtml(note)}</div>`
    )
    .join('')}

  <p style="margin-top:36px;color:#666;font-size:13px;line-height:1.6;">
    Questions about this order? Reply to this message and we will help.
  </p>

  <div style="margin-top:40px;padding-top:24px;border-top:1px solid #eee;text-align:center;color:#999;font-size:12px;">
    <a href="${SITE}" style="color:#008080;text-decoration:none;">tealhouse.us</a>
  </div>
</div>`.trim();

  const text = [
    'TEALHOUSE',
    '',
    'Thank you. Your order is confirmed.',
    `Reference ${reference}`,
    '',
    ...items.map((item) => {
      const detail = describeItem(item);
      return `${item.name}${detail ? ` (${detail})` : ''} x${item.quantity}  ${money(
        Number(item.price) * Number(item.quantity)
      )}`;
    }),
    '',
    `Paid ${money(order.total)}`,
    ...(notes.length ? ['', ...notes] : []),
  ].join('\n');

  return send({
    to: order.customer_email,
    subject: `Your TEALHOUSE order ${reference}`,
    html,
    text,
  });
}

/**
 * The alert to the house.
 *
 * Short on purpose. It goes to an ordinary inbox, but it may also be pointed
 * at a carrier email-to-SMS gateway, and those truncate hard. Everything
 * that matters is in the first line.
 */
export async function sendOrderAlert(order) {
  const to = (process.env.ORDER_ALERT_TO || '')
    .split(',')
    .map((address) => address.trim())
    .filter(Boolean);

  if (to.length === 0) return false;

  const items = order.items ?? [];
  const reference = String(order.id).slice(0, 8).toUpperCase();
  const count = items.reduce((sum, item) => sum + Number(item.quantity || 0), 0);

  const lines = [
    `TEALHOUSE order ${money(order.total)}`,
    `${count} item${count === 1 ? '' : 's'}, ref ${reference}`,
    ...items.map((item) => {
      const detail = describeItem(item);
      return `${item.quantity}x ${item.name}${detail ? ` (${detail})` : ''}`;
    }),
    order.customer_email || '',
  ].filter(Boolean);

  const text = lines.join('\n');

  return send({
    to,
    subject: `New order ${money(order.total)} ref ${reference}`,
    html: `<pre style="font-family:inherit;white-space:pre-wrap;">${escapeHtml(text)}</pre>`,
    text,
  });
}

/**
 * Both messages, neither able to break the order.
 *
 * Payment has already been captured by the time this runs. An email problem
 * is an inconvenience; throwing here would tell a paying customer their
 * order failed when it did not.
 */
export async function sendOrderEmails(order) {
  const results = await Promise.allSettled([
    sendOrderConfirmation(order),
    sendOrderAlert(order),
  ]);

  for (const result of results) {
    if (result.status === 'rejected') {
      console.error('Order email failed:', result.reason);
    }
  }
}
