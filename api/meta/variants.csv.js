import { adminClient } from '../_lib/cart.js';

/**
 * Meta variant feed.
 *
 * Different from the catalogue feed. That one lists a row per colour, which
 * is the right granularity for tagging a piece in a post. This one lists
 * every purchasable combination on the site, which is what Meta compares
 * against the catalogue when it asks to validate variants.
 *
 * Point Commerce Manager at:
 *   https://www.tealhouse.us/api/meta/variants.csv
 *
 * A multi-part piece such as a bikini has a size per part, so a variant is
 * the whole set of choices: colour plus a size for every part. Those are
 * emitted as separate columns so Meta can see the real structure rather than
 * one opaque string.
 */

const SITE = 'https://www.tealhouse.us';
const BRAND = 'TEALHOUSE';

const CATEGORY_SEGMENT = {
  shoes: 'footwear',
  accessories: 'accents',
  'resort-wear': 'resort-wear',
  apparel: 'apparel',
};

/** Guard against a runaway feed if a product is ever configured oddly. */
const MAX_ROWS_PER_PRODUCT = 400;

function productUrl(product) {
  const category = (product.categories ?? [])[0];
  const segment = CATEGORY_SEGMENT[String(category).toLowerCase()] ?? 'products';
  return `${SITE}/products/${segment}/${product.slug ?? product.id}`;
}

function cell(value) {
  const text = value === null || value === undefined ? '' : String(value);
  const guarded = /^[=+\-@]/.test(text) ? `'${text}` : text;
  return /[",\n\r]/.test(guarded) ? `"${guarded.replace(/"/g, '""')}"` : guarded;
}

/**
 * Every combination of choices a customer can actually make.
 *
 * Built as a cross product across the parts, so a bikini with five top sizes
 * and five bottom sizes produces twenty-five rows, which is what a variant
 * feed is supposed to contain.
 */
function combinations(groups) {
  if (groups.length === 0) return [{}];

  let rows = [{}];
  for (const group of groups) {
    const next = [];
    for (const row of rows) {
      for (const size of group.sizes ?? []) {
        next.push({ ...row, [group.label]: size });
        if (next.length > MAX_ROWS_PER_PRODUCT) return next;
      }
    }
    rows = next;
  }
  return rows;
}

function stockKey(color, group, size) {
  const base = group ? `${group}:${size}` : size;
  return color ? `${color}|${base}` : base;
}

function availabilityFor(product, color, selection) {
  const type = product.fulfillment_type || 'in_stock';

  if (type === 'pre_order') return 'preorder';
  // Built to order after the sale, so orderable rather than shelved.
  if (type === 'made_to_measure' || type === 'made_to_order') {
    return 'available for order';
  }

  const stock = product.stock ?? {};
  const entries = Object.entries(selection);

  if (entries.length === 0) {
    const key = stockKey(color, null, 'default');
    const single = Object.keys(stock).some((k) => k === key);
    return Number(stock[key] ?? (single ? 0 : 0)) > 0
      ? 'in stock'
      : 'out of stock';
  }

  // Every part must be available for the combination to be buyable.
  const buyable = entries.every(
    ([label, size]) => Number(stock[stockKey(color, label, size)] ?? 0) > 0
  );
  return buyable ? 'in stock' : 'out of stock';
}

const COLUMNS = [
  'id',
  'item_group_id',
  'title',
  'description',
  'availability',
  'condition',
  'price',
  'link',
  'image_link',
  'brand',
  'color',
  'size',
  'product_type',
  'material',
  'age_group',
  'gender',
];

function rowsFor(product) {
  const images = (product.images ?? []).filter(Boolean);
  const primary = images[0] || product.image;
  if (!primary) return [];

  const description = (product.description || product.name || '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 5000);

  const audience = (product.audience ?? []).map((v) => String(v).toLowerCase());
  const gender = audience.includes('women')
    ? 'female'
    : audience.includes('men')
      ? 'male'
      : 'unisex';

  const groups = Array.isArray(product.size_groups) ? product.size_groups : [];

  // A multi-part piece varies by part; a plain one varies by its size list.
  const selections =
    groups.length > 0
      ? combinations(groups)
      : (product.sizes ?? []).length > 0
        ? (product.sizes ?? []).map((size) => ({ Size: String(size) }))
        : [{}];

  const colors = (product.colors ?? []).filter(Boolean);
  const colorOptions = colors.length > 0 ? colors : [null];

  const rows = [];

  for (const color of colorOptions) {
    for (const selection of selections) {
      const parts = Object.entries(selection);

      // For a plain product the label is synthetic, so the stock key must
      // not carry it.
      const stockSelection =
        groups.length > 0
          ? selection
          : parts.length > 0
            ? { [' ']: parts[0][1] }
            : {};

      const availability =
        groups.length > 0
          ? availabilityFor(product, color, selection)
          : parts.length > 0
            ? Number(
                (product.stock ?? {})[stockKey(color, null, parts[0][1])] ?? 0
              ) > 0 ||
              (product.fulfillment_type || 'in_stock') !== 'in_stock'
              ? (product.fulfillment_type === 'pre_order'
                  ? 'preorder'
                  : (product.fulfillment_type || 'in_stock') === 'in_stock'
                    ? 'in stock'
                    : 'available for order')
              : 'out of stock'
            : availabilityFor(product, color, {});

      const sizeLabel = parts.map(([label, size]) =>
        groups.length > 0 ? `${label} ${size}` : size
      ).join(' / ');

      const idParts = [
        String(product.id),
        color ? color.toLowerCase().replace(/\s+/g, '-') : null,
        sizeLabel ? sizeLabel.toLowerCase().replace(/[^a-z0-9]+/g, '-') : null,
      ].filter(Boolean);

      rows.push({
        id: idParts.join('-'),
        item_group_id: String(product.id),
        title: [product.name, color, sizeLabel].filter(Boolean).join(' - '),
        description,
        availability,
        condition: 'new',
        price: `${Number(product.price).toFixed(2)} USD`,
        link: productUrl(product),
        image_link: primary,
        brand: BRAND,
        color: color ?? '',
        size: sizeLabel,
        product_type: (product.categories ?? []).join(' > '),
        material: (product.materials ?? [])[0] ?? '',
        age_group: 'adult',
        gender,
      });
    }
  }

  return rows;
}

export default async function handler(request, response) {
  if (request.method !== 'GET' && request.method !== 'HEAD') {
    response.setHeader('Allow', 'GET, HEAD');
    return response.status(405).send('Method not allowed');
  }

  try {
    const supabase = adminClient();

    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('is_published', true)
      .order('sort_order', { ascending: true });

    if (error) throw error;

    const products = (data ?? []).filter((product) => {
      // Bespoke stays out for the same reason as the catalogue feed: Meta
      // requires the landing page price to match, and a bespoke page shows
      // a retainer rather than a settled price.
      if (product.fulfillment_type === 'made_to_order') return false;
      return Number(product.price) > 0;
    });

    const rows = products.flatMap(rowsFor);

    const csv = [
      COLUMNS.join(','),
      ...rows.map((row) => COLUMNS.map((c) => cell(row[c])).join(',')),
    ].join('\n');

    response.setHeader('Content-Type', 'text/csv; charset=utf-8');
    response.setHeader('Cache-Control', 'public, max-age=900');
    return response.status(200).send(csv);
  } catch (error) {
    console.error('Meta variant feed failed:', error);
    return response.status(500).send('Could not build the feed');
  }
}
