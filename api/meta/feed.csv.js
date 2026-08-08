import { adminClient } from '../_lib/cart.js';

/**
 * Meta catalog feed.
 *
 * Instagram product tagging runs off a catalog in Meta Commerce Manager, and
 * a catalog can be fed from a URL that Meta fetches on a schedule. This is
 * that URL, so the catalog follows the database with no plugin, no Shopify,
 * and nothing to remember to re-upload.
 *
 * Point Commerce Manager at:
 *   https://www.tealhouse.us/api/meta-feed.csv
 *
 * Meta requires the price and product on the landing page to match the feed,
 * so anything without a settled price is deliberately left out. See below.
 */

const SITE = 'https://www.tealhouse.us';
const BRAND = 'TEALHOUSE';

const CATEGORY_SEGMENT = {
  shoes: 'footwear',
  accessories: 'accents',
  'resort-wear': 'resort-wear',
  apparel: 'apparel',
};

/** Meta's own availability vocabulary. */
function availabilityFor(product, color) {
  const type = product.fulfillment_type || 'in_stock';

  if (type === 'pre_order') return 'preorder';
  // Built after the sale, so it is orderable rather than on a shelf.
  if (type === 'made_to_measure') return 'available for order';

  const stock = product.stock ?? {};
  const prefix = color ? `${color}|` : '';

  const total = Object.entries(stock).reduce((sum, [key, value]) => {
    if (color && !key.startsWith(prefix)) return sum;
    if (!color && key.includes('|')) return sum;
    return sum + Number(value || 0);
  }, 0);

  return total > 0 ? 'in stock' : 'out of stock';
}

function productUrl(product) {
  const category = (product.categories ?? [])[0];
  const segment = CATEGORY_SEGMENT[String(category).toLowerCase()] ?? 'products';
  return `${SITE}/products/${segment}/${product.slug ?? product.id}`;
}

/** CSV escaping, and a guard against a leading character Excel reads as a formula. */
function cell(value) {
  const text = value === null || value === undefined ? '' : String(value);
  const guarded = /^[=+\-@]/.test(text) ? `'${text}` : text;
  return /[",\n\r]/.test(guarded) ? `"${guarded.replace(/"/g, '""')}"` : guarded;
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
  'additional_image_link',
  'brand',
  'product_type',
  'color',
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

  const audience = (product.audience ?? []).map((value) =>
    String(value).toLowerCase()
  );
  const gender = audience.includes('women')
    ? 'female'
    : audience.includes('men')
      ? 'male'
      : 'unisex';

  const colors = (product.colors ?? []).filter(Boolean);
  // One row per colour so a tagged post shows the right one, grouped under
  // the product by item_group_id. Sizes are not split out: it would multiply
  // the feed many times over for no gain in tagging.
  const variants = colors.length > 0 ? colors : [null];

  return variants.map((color) => ({
    id: color ? `${product.id}-${color.toLowerCase().replace(/\s+/g, '-')}` : String(product.id),
    item_group_id: String(product.id),
    title: color ? `${product.name} in ${color}` : product.name,
    description,
    availability: availabilityFor(product, color),
    condition: 'new',
    price: `${Number(product.price).toFixed(2)} USD`,
    link: productUrl(product),
    image_link: primary,
    additional_image_link: images.slice(1, 11).join(','),
    brand: BRAND,
    product_type: (product.categories ?? []).join(' > '),
    color: color ?? '',
    material: (product.materials ?? [])[0] ?? '',
    age_group: 'adult',
    gender,
  }));
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
      // Bespoke is left out on purpose. Meta requires the landing page price
      // to match the feed, and a bespoke page shows a retainer rather than a
      // settled price, so listing it invites a catalog rejection.
      if (product.fulfillment_type === 'made_to_order') return false;
      return Number(product.price) > 0;
    });

    const rows = products.flatMap(rowsFor);

    const csv = [
      COLUMNS.join(','),
      ...rows.map((row) => COLUMNS.map((column) => cell(row[column])).join(',')),
    ].join('\n');

    response.setHeader('Content-Type', 'text/csv; charset=utf-8');
    // Meta fetches on a schedule, so a short cache is plenty and keeps the
    // feed close to the database.
    response.setHeader('Cache-Control', 'public, max-age=900');
    return response.status(200).send(csv);
  } catch (error) {
    console.error('Meta feed failed:', error);
    return response.status(500).send('Could not build the feed');
  }
}
