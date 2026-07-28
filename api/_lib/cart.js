import { createClient } from '@supabase/supabase-js';

/**
 * The service role client. This bypasses row level security and must only
 * ever run inside a serverless function. It is the reason orders can be
 * written after payment without giving the browser insert permission.
 */
export function adminClient() {
  const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url) throw new Error('SUPABASE_URL is not set');
  if (!key) throw new Error('SUPABASE_SERVICE_ROLE_KEY is not set');

  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

/* Shipping and tax must match src/app/config/store.ts. */
const SHIPPING = {
  freeThreshold: 500,
  domestic: { standard: 15, express: 25 },
  international: { standard: 35, express: 60 },
};
// Must match src/app/config/store.ts. Off until registered to collect.
const TAX = { enabled: false, ratesByState: {} };

function taxFor(subtotal, state) {
  if (!TAX.enabled) return 0;
  const code = String(state ?? '').trim().toUpperCase();
  if (code.length !== 2) return 0;
  const rate = TAX.ratesByState[code];
  if (!rate) return 0;
  return Math.round(subtotal * rate * 100) / 100;
}

/**
 * Recomputes the whole basket from the products table.
 *
 * PayPal's own guidance is explicit about this: never take the item total
 * from the browser, because it can be manipulated. The client sends product
 * ids, sizes and quantities only. Every price, every total, and the stock
 * check come from the database.
 */
export async function priceCart({ items, shippingMethod = 'standard', region = 'domestic', state = null }) {
  if (!Array.isArray(items) || items.length === 0) {
    throw new Error('Your bag is empty');
  }

  const supabase = adminClient();
  const ids = [...new Set(items.map((i) => Number(i.product_id)).filter(Boolean))];

  if (ids.length === 0) throw new Error('No valid products in the bag');

  const { data: products, error } = await supabase
    .from('products')
    .select('id, name, price, stock, sizes, is_published, image, images')
    .in('id', ids);

  if (error) throw new Error(`Could not load products: ${error.message}`);

  const byId = new Map((products ?? []).map((p) => [Number(p.id), p]));
  const lines = [];
  let subtotal = 0;

  for (const item of items) {
    const product = byId.get(Number(item.product_id));
    if (!product) throw new Error('A product in your bag is no longer available');
    if (product.is_published === false) throw new Error(`${product.name} is no longer available`);

    const quantity = Math.max(1, Math.floor(Number(item.quantity) || 1));
    const sizeKey = item.size === undefined || item.size === null || item.size === ''
      ? 'default'
      : String(item.size);

    const available = Number((product.stock ?? {})[sizeKey] ?? 0);
    if (available < quantity) {
      throw new Error(
        sizeKey === 'default'
          ? `${product.name} is sold out`
          : `${product.name} in size ${sizeKey} has only ${available} left`
      );
    }

    const unitPrice = Number(product.price);
    subtotal += unitPrice * quantity;

    lines.push({
      product_id: Number(product.id),
      name: product.name,
      price: unitPrice,
      quantity,
      size: sizeKey === 'default' ? null : item.size,
      image: product.image || product.images?.[0] || null,
    });
  }

  const method = shippingMethod === 'express' ? 'express' : 'standard';
  const shippingCost =
    subtotal >= SHIPPING.freeThreshold ? 0 : SHIPPING[region][method];
  const tax = taxFor(subtotal, state);
  const total = subtotal + shippingCost + tax;

  return { lines, subtotal, shippingCost, tax, total, shippingMethod: method };
}
