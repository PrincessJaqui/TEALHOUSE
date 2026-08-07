import type { Product } from '../App';

/**
 * The single vocabulary for tagging and filtering products.
 *
 * The admin screen and the storefront each used to keep their own list, and
 * they disagreed. The storefront asked for "mens", "womens", "new",
 * "bestseller" and "cactus-leather"; the admin could only apply "men",
 * "women" and a material called "Cactus Leather", and offered no way to mark
 * anything new or a bestseller. Five category pages could never show a single
 * product as a result.
 *
 * Both sides now import from here, so they cannot drift again.
 */

export const CATEGORIES = [
  'shoes',
  'accessories',
  'resort-wear',
  'apparel',
  'jewelry',
  'gifts',
  'home',
  'beauty',
] as const;

export const AUDIENCES = [
  'women',
  'men',
  'unisex',
  'boys',
  'girls',
  'kids',
  'toddlers',
  'infants',
] as const;

export const MATERIALS = [
  'Cactus Leather',
  'Natural Rubber',
  'Bamboo',
  'Flax',
] as const;

/**
 * Kept only so anything still importing it compiles. Sizes come from the
 * size_scales table now, which is what makes Resort Wear offer Alpha rather
 * than EU shoe sizes.
 */
export const SHOE_SIZES = [35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45] as const;

/** How many days a product counts as a new arrival. */
export const NEW_ARRIVAL_DAYS = 60;

/**
 * The filter keys the storefront pages pass to ProductGrid. Keeping them in
 * one union means a typo on a page is a compile error rather than a silently
 * empty grid.
 */
export type FilterKey =
  | 'all'
  | 'shoes'
  | 'accessories'
  | 'resort-wear'
  | 'apparel'
  | 'jewelry'
  | 'mens'
  | 'womens'
  | 'new'
  | 'bestseller'
  | 'cactus-leather';

const eq = (a: string | undefined | null, b: string) =>
  (a ?? '').trim().toLowerCase() === b.trim().toLowerCase();

const has = (values: string[] | undefined | null, target: string) =>
  (values ?? []).some((value) => eq(value, target));

/**
 * Decides whether a product belongs on a given page.
 *
 * Note the deliberate translations: the "mens" and "womens" pages match the
 * "men" and "women" audience tags, and "cactus-leather" matches the material
 * rather than a category, because that is how the products are actually
 * tagged.
 */
export function productMatchesFilter(product: Product, filter: FilterKey): boolean {
  switch (filter) {
    case 'all':
      return true;

    case 'mens':
      return has(product.audience, 'men') || has(product.audience, 'unisex');

    case 'womens':
      return has(product.audience, 'women') || has(product.audience, 'unisex');

    case 'cactus-leather':
      return has(product.materials, 'Cactus Leather');

    case 'new':
      return isNewArrival(product);

    case 'bestseller':
      return Boolean(product.is_bestseller);

    default:
      // plain category pages: shoes, accessories, apparel, jewelry
      return has(product.categories, filter);
  }
}

export function isNewArrival(product: Product): boolean {
  if (!product.created_at) return false;
  const created = new Date(product.created_at).getTime();
  if (Number.isNaN(created)) return false;
  return Date.now() - created <= NEW_ARRIVAL_DAYS * 24 * 60 * 60 * 1000;
}

/* ------------------------------------------------------------------ */
/* Stock                                                               */
/* ------------------------------------------------------------------ */

/**
 * Stock is held per size, as a map of size to quantity. Products without
 * sizes, accessories for example, use the single DEFAULT_STOCK_KEY.
 */
export const DEFAULT_STOCK_KEY = 'default';

export type StockMap = Record<string, number>;

export function stockForSize(product: Product, size?: number | string | null): number {
  const stock = product.stock ?? {};
  if (size === undefined || size === null || size === '') {
    // no size chosen: report everything available
    return totalStock(product);
  }
  return Number(stock[String(size)] ?? 0);
}

export function totalStock(product: Product): number {
  const stock = product.stock ?? {};
  return Object.values(stock).reduce<number>((sum, n) => sum + Number(n ?? 0), 0);
}

export function isSoldOut(product: Product): boolean {
  return totalStock(product) <= 0;
}

/** Sizes with at least one unit left. */
export function availableSizes(product: Product): string[] {
  return (product.sizes ?? []).filter((size) => stockForSize(product, size) > 0);
}


/* ------------------------------------------------------------------ */
/* URLs                                                                */
/* ------------------------------------------------------------------ */

/**
 * The category segment that appears in a product URL.
 *
 * These are the customer-facing names, so /products/footwear/lexi rather
 * than /products/shoes/lexi. The database keeps its own values, which is
 * why this map exists rather than using the category directly.
 */
export const CATEGORY_URL_SEGMENT: Record<string, string> = {
  shoes: 'footwear',
  accessories: 'accents',
  'resort-wear': 'resort-wear',
  apparel: 'apparel',
  jewelry: 'jewelry',
  gifts: 'gifts',
  home: 'home',
  beauty: 'beauty',
};

export function slugify(value: string): string {
  return (value ?? '')
    // Strip accents rather than dropping the letter, so "Eclair" survives
    // instead of becoming "clair".
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/-{2,}/g, '-')
    .replace(/^-|-$/g, '');
}

/** The URL segment for a product, based on its first category. */
export function categorySegment(product: Product): string {
  const first = (product.categories ?? [])[0];
  if (!first) return 'products';
  return CATEGORY_URL_SEGMENT[first.toLowerCase()] ?? slugify(first);
}

/**
 * Canonical path for a product, for example /products/footwear/lexi.
 *
 * Falls back to the id when a slug is missing, so a product saved before
 * the slug column existed is still reachable rather than 404ing.
 */
export function productPath(product: Product): string {
  const slug = product.slug || slugify(product.name) || String(product.id);
  return `/products/${categorySegment(product)}/${slug}`;
}


/* ------------------------------------------------------------------ */
/* Size scales                                                         */
/* ------------------------------------------------------------------ */

/**
 * Named size scales.
 *
 * The old system stored sizes as integers, which could hold 38 but not XS,
 * 00 or 34DD. Sizes are text now, and a product picks the scale that suits
 * it. Anything missing can be typed in per product without touching this.
 */
export interface SizeScale {
  key: string;
  label: string;
  sizes: string[];
}

function braSizes(): string[] {
  const bands = [30, 32, 34, 36, 38, 40, 42];
  const cups = ['A', 'B', 'C', 'D', 'DD', 'DDD'];
  const out: string[] = [];
  for (const band of bands) {
    for (const cup of cups) out.push(`${band}${cup}`);
  }
  return out;
}

export const SIZE_SCALES: SizeScale[] = [
  {
    key: 'alpha',
    label: 'Alpha (XS to XXL)',
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
  },
  {
    key: 'us-womens',
    label: 'US Womens (00 to 24)',
    sizes: ['00', '0', '2', '4', '6', '8', '10', '12', '14', '16', '18', '20', '22', '24'],
  },
  {
    key: 'bra',
    label: 'Bra (30A to 42DDD)',
    sizes: braSizes(),
  },
  {
    key: 'footwear-eu',
    label: 'Footwear EU (35 to 45)',
    sizes: ['35', '36', '37', '38', '39', '40', '41', '42', '43', '44', '45'],
  },
  {
    key: 'footwear-us-womens',
    label: 'Footwear US Womens (5 to 12)',
    sizes: ['5', '5.5', '6', '6.5', '7', '7.5', '8', '8.5', '9', '9.5', '10', '11', '12'],
  },
  {
    key: 'us-mens',
    label: 'US Mens waist (28 to 44)',
    sizes: ['28', '30', '32', '34', '36', '38', '40', '42', '44'],
  },
  {
    key: 'one-size',
    label: 'One size',
    sizes: ['One Size'],
  },
];

export function sizeScale(key: string | undefined | null): SizeScale | undefined {
  return SIZE_SCALES.find((scale) => scale.key === key);
}

/* ------------------------------------------------------------------ */
/* Multi-part sizing                                                   */
/* ------------------------------------------------------------------ */

/**
 * One sizeable part of a product. A bikini has two: Top and Bottom, each
 * with its own scale and its own stock.
 */
export interface SizeGroup {
  label: string;
  scale?: string;
  sizes: string[];
  /**
   * False lets the customer buy this part on its own, so a bikini top from
   * one set can be bought without its bottom. Defaults to true.
   */
  required?: boolean;
  /**
   * What this part costs alone. Selecting every part charges the product
   * price instead, which is how a set can be priced below the sum.
   */
  price?: number | null;
}

/** What the customer picked, for example { Top: "S", Bottom: "M" }. */
export type SizeSelection = Record<string, string>;

export function hasSizeGroups(product: Product): boolean {
  return Array.isArray(product.size_groups) && product.size_groups.length > 0;
}

/**
 * The stock key for one piece. Stock is held per piece, so a bikini has
 * separate counts under "Top:S" and "Bottom:M" rather than one count for
 * the pairing. Six tops in S and two bottoms in M are two numbers.
 */
export function groupStockKey(groupLabel: string, size: string): string {
  return `${groupLabel}:${size}`;
}

export function groupStock(product: Product, groupLabel: string, size: string): number {
  return Number((product.stock ?? {})[groupStockKey(groupLabel, size)] ?? 0);
}

/** Sizes still available within one part. */
export function availableGroupSizes(product: Product, group: SizeGroup): string[] {
  return group.sizes.filter((size) => groupStock(product, group.label, size) > 0);
}

/**
 * A multi-part product is sold out only when a whole part has nothing left,
 * because you cannot ship a bikini with no bottoms whatever the tops say.
 */
export function isGroupedSoldOut(product: Product): boolean {
  const groups = product.size_groups ?? [];
  if (groups.length === 0) return false;
  return groups.some((group) => availableGroupSizes(product, group).length === 0);
}

/** How a selection reads in the cart, on the order, and in the pick list. */
export function describeSelection(selection: SizeSelection | undefined): string {
  if (!selection) return '';
  return Object.entries(selection)
    .map(([label, value]) => `${label} ${value}`)
    .join(' / ');
}


/* ------------------------------------------------------------------ */
/* Colour                                                              */
/* ------------------------------------------------------------------ */

/**
 * Stock key.
 *
 * Colour carries its own stock, so a teal top in S and a black top in S are
 * separate counts. The colour is a prefix, which keeps every key written
 * before colours existed valid and readable.
 *
 *   "38"          single size, no colour
 *   "Top:S"       one part, no colour
 *   "Teal|38"     single size in a colour
 *   "Teal|Top:S"  one part in a colour
 *   "default"     no size at all
 */
export function stockKey(
  options: { color?: string | null; group?: string | null; size?: string | null }
): string {
  const base = options.group
    ? `${options.group}:${options.size ?? ''}`
    : options.size || DEFAULT_STOCK_KEY;
  return options.color ? `${options.color}|${base}` : base;
}

export function stockFor(
  product: Product,
  options: { color?: string | null; group?: string | null; size?: string | null }
): number {
  return Number((product.stock ?? {})[stockKey(options)] ?? 0);
}

export function productColors(product: Product): string[] {
  return product.colors ?? [];
}

/** Sizes still available in one part, for the colour being viewed. */
export function availableSizesFor(
  product: Product,
  group: SizeGroup,
  color?: string | null
): string[] {
  return group.sizes.filter(
    (size) => stockFor(product, { color, group: group.label, size }) > 0
  );
}

export function isPartRequired(group: SizeGroup): boolean {
  return group.required !== false;
}

/**
 * What a line costs.
 *
 * Selecting every part charges the product price, which is the set price.
 * Selecting some of them charges the sum of just those parts, so a set can
 * be priced below the sum of its pieces and a single piece still has a
 * price of its own.
 */
export function priceForSelection(
  product: Product,
  chosenParts: string[]
): number {
  const groups = product.size_groups ?? [];
  if (groups.length === 0) return Number(product.price);

  const everyPart =
    chosenParts.length >= groups.length &&
    groups.every((group) => chosenParts.includes(group.label));

  if (everyPart) return Number(product.price);

  return groups
    .filter((group) => chosenParts.includes(group.label))
    .reduce((sum, group) => sum + Number(group.price ?? 0), 0);
}


/** "Chest 34" / 86cm  ·  Waist 27" / 69cm" */
export function describeMeasurements(
  measurements: Record<string, string> | undefined
): string {
  if (!measurements) return '';
  return Object.entries(measurements)
    .map(([label, value]) => `${label} ${value}`)
    .join('  ·  ');
}


/* ------------------------------------------------------------------ */
/* Part options                                                        */
/* ------------------------------------------------------------------ */

export interface ScaleLike {
  key: string;
  sizes: string[];
  components?: {
    join: string;
    parts: Array<{ label: string; values: string[] }>;
  } | null;
}

/**
 * The values a part offers.
 *
 * A stocked part offers only the sizes ticked in the admin, because each
 * one needs a stock count. A made to measure part offers the whole scale,
 * since nothing is being counted and the customer simply states their size.
 */
export function partOptions(
  group: SizeGroup,
  scales: ScaleLike[],
  offerWholeScale = false
): string[] {
  const scale = scales.find((s) => s.key === (group.scale ?? ''));
  if (offerWholeScale) return scale?.sizes ?? group.sizes ?? [];
  return group.sizes ?? [];
}

/** The dropdowns a part needs. Bra returns two, everything else returns one. */
export function partComponents(
  group: SizeGroup,
  scales: ScaleLike[]
): Array<{ label: string; values: string[] }> | null {
  const scale = scales.find((s) => s.key === (group.scale ?? ''));
  const components = scale?.components;
  if (!components || !Array.isArray(components.parts) || components.parts.length < 2) {
    return null;
  }
  return components.parts;
}

/** Band 34 plus cup D becomes 34D. */
export function joinComponents(
  values: string[],
  scales: ScaleLike[],
  group: SizeGroup
): string {
  const scale = scales.find((s) => s.key === (group.scale ?? ''));
  const separator = scale?.components?.join ?? '';
  return values.join(separator);
}
