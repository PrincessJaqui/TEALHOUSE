/**
 * PayPal REST helpers, server side only.
 *
 * PAYPAL_CLIENT_SECRET must never reach the browser. These functions run in
 * Vercel serverless functions, which is the only place in this codebase that
 * touches it.
 */

const LIVE = 'https://api-m.paypal.com';
const SANDBOX = 'https://api-m.sandbox.paypal.com';

export function paypalBase() {
  return process.env.PAYPAL_ENV === 'live' ? LIVE : SANDBOX;
}

export function paypalConfigError() {
  if (!process.env.PAYPAL_CLIENT_ID) return 'PAYPAL_CLIENT_ID is not set';
  if (!process.env.PAYPAL_CLIENT_SECRET) return 'PAYPAL_CLIENT_SECRET is not set';
  return null;
}

let cachedToken = null;

export async function getAccessToken() {
  // Tokens last hours. Reuse within the warm lifetime of the function.
  if (cachedToken && cachedToken.expiresAt > Date.now() + 60_000) {
    return cachedToken.value;
  }

  const credentials = Buffer.from(
    `${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`
  ).toString('base64');

  const response = await fetch(`${paypalBase()}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${credentials}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(`PayPal auth failed: ${data.error_description || response.status}`);
  }

  cachedToken = {
    value: data.access_token,
    expiresAt: Date.now() + Number(data.expires_in ?? 0) * 1000,
  };

  return cachedToken.value;
}

export async function paypalFetch(path, options = {}) {
  const token = await getAccessToken();

  const response = await fetch(`${paypalBase()}${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  });

  const text = await response.text();
  let body;
  try {
    body = text ? JSON.parse(text) : {};
  } catch {
    body = { raw: text };
  }

  return { ok: response.ok, status: response.status, body };
}

/** Money must be a string with exactly two decimals or PayPal rejects it. */
export function money(value) {
  return (Math.round(Number(value) * 100) / 100).toFixed(2);
}
