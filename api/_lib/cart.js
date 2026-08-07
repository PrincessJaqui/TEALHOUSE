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
    .select('id, name, price, stock, sizes, size_groups, colors, is_published, image, images, fulfillment_type, retainer_amount')
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
    const stock = product.stock ?? {};
    const fulfillment = product.fulfillment_type || 'in_stock';
    const bespoke = fulfillment === 'made_to_order';

    // A bespoke piece is charged at its retainer, not its price, because the
    // final price is not known until the specification is agreed. The
    // retainer is read from the product, never from the browser.
    const selection =
      item.sizes && typeof item.sizes === 'object' && Object.keys(item.sizes).length > 0
        ? item.sizes
        : null;

    const groups = Array.isArray(product.size_groups) ? product.size_groups : [];
    const chosenParts = selection ? Object.keys(selection) : [];

    // Selecting every part charges the product price, which is the set
    // price. A subset charges the sum of just those parts, so a bikini top
    // bought alone costs what that part costs. Prices come from the
    // product, never from the browser.
    let listPrice = Number(product.price);
    if (groups.length > 0 && chosenParts.length > 0) {
      const everyPart =
        chosenParts.length >= groups.length &&
        groups.every((g) => chosenParts.includes(g.label));

      if (!everyPart) {
        listPrice = groups
          .filter((g) => chosenParts.includes(g.label))
          .reduce((sum, g) => sum + Number(g.price ?? 0), 0);

        if (listPrice <= 0) {
          throw new Error(
            `${product.name} cannot be bought as separate pieces yet`
          );
        }
      }
    }

    // A colour carries its own stock, so it prefixes the stock key.
    const color =
      typeof item.color === 'string' && item.color.trim() ? item.color.trim() : null;

    if (color && Array.isArray(product.colors) && product.colors.length > 0) {
      if (!product.colors.includes(color)) {
        throw new Error(`${product.name} is not available in ${color}`);
      }
    }

    const prefix = color ? `${color}|` : '';

    const unitPrice = bespoke ? Number(product.retainer_amount ?? 0) : listPrice;

    if (bespoke && unitPrice <= 0) {
      throw new Error(`${product.name} has no retainer set and cannot be ordered`);
    }

    // A multi-part product, a bikini for example, holds stock per piece, so
    // every part is checked separately against its own count.
    const stockKeys = selection
      ? Object.entries(selection).map(([label, value]) => `${prefix}${label}:${value}`)
      : [
          prefix +
            (item.size === undefined || item.size === null || item.size === ''
              ? 'default'
              : String(item.size)),
        ];

    // Pre-order sells past zero, and a bespoke piece has no stock at all.
    if (fulfillment === 'in_stock') {
      for (const key of stockKeys) {
        const available = Number(stock[key] ?? 0);
        if (available < quantity) {
          throw new Error(
            key === 'default'
              ? `${product.name} is sold out`
              : `${product.name} (${key.replace('|', ' ').replace(':', ' ')}) has only ${available} left`
          );
        }
      }
    }

    subtotal += unitPrice * quantity;

    lines.push({
      product_id: Number(product.id),
      name: product.name,
      price: unitPrice,
      quantity,
      size: selection ? null : item.size ?? null,
      sizes: selection,
      color,
      image: product.image || product.images?.[0] || null,
      fulfillment_type: fulfillment,
      is_retainer: bespoke,
      list_price: bespoke ? Number(product.price) : null,
      notes: typeof item.notes === 'string' ? item.notes.slice(0, 2000) : null,
    });
  }

  const method = shippingMethod === 'express' ? 'express' : 'standard';
  const shippingCost =
    subtotal >= SHIPPING.freeThreshold ? 0 : SHIPPING[region][method];
  const tax = taxFor(subtotal, state);
  const total = subtotal + shippingCost + tax;

  const hasBespoke = lines.some((line) => line.is_retainer);

  return {
    lines,
    subtotal,
    shippingCost,
    tax,
    total,
    shippingMethod: method,
    hasBespoke,
  };
}
