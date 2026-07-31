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

/** US womens footwear sizing. */
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
export function availableSizes(product: Product): number[] {
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
