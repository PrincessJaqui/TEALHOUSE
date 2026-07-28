/**
 * Store money settings, in one place.
 *
 * These numbers used to be typed directly into four different files and they
 * disagreed with each other. Checkout offered free standard shipping to
 * everyone while Delivery and Returns said standard was 15 and only free over
 * 500, and the FAQ repeated the 500 threshold. A customer comparing their
 * basket total against the policy page would have caught it.
 *
 * The values below are the ones from your Delivery and Returns page, since
 * that was the most complete statement of the policy already in the codebase.
 * Confirm they are right. Changing them here changes them everywhere.
 *
 * When you want to edit these without a deploy, they move into a
 * store_settings table and this file reads from it. Not needed yet.
 */

export const SHIPPING = {
  /** Orders at or above this subtotal ship free and return free. */
  freeThreshold: 500,

  domestic: {
    standard: 15,
    express: 25,
  },

  international: {
    standard: 35,
    express: 60,
  },
} as const;

export const RETURNS = {
  windowDays: 14,
} as const;

/**
 * Sales tax.
 *
 * OFF by default, and it should stay off until you are registered to collect
 * in a state. Collecting sales tax somewhere you are not registered is
 * illegal in most states, and the money is not yours to hold either way.
 *
 * PayPal will not do this for you. Its built-in tax calculator only works
 * with the old PayPal Payments Standard buttons, not the Orders v2 API this
 * site uses, so the tax amount has to be calculated here and passed to
 * PayPal. It also allows only one rate per state, which is wrong in the many
 * states that tax by destination city and county.
 *
 * When you register somewhere, add the state and its rate below and flip
 * enabled to true. For more than a couple of states, move to TaxJar or
 * Avalara rather than maintaining rates by hand.
 */
export const TAX = {
  enabled: false,

  /**
   * Rates by two-letter state code, as decimals. 0.0975 means 9.75 percent.
   * A state that is absent is not taxed, which is the correct behaviour for
   * a state where you have no nexus.
   *
   * Example once you register in Kansas:
   *   KS: 0.0975,
   */
  ratesByState: {} as Record<string, number>,
} as const;

/** Two-letter code for a state, or null if it cannot be determined. */
export function normalizeState(state: string | null | undefined): string | null {
  if (!state) return null;
  const trimmed = state.trim().toUpperCase();
  return trimmed.length === 2 ? trimmed : STATE_CODES[trimmed] ?? null;
}

const STATE_CODES: Record<string, string> = {
  ALABAMA: 'AL', ALASKA: 'AK', ARIZONA: 'AZ', ARKANSAS: 'AR', CALIFORNIA: 'CA',
  COLORADO: 'CO', CONNECTICUT: 'CT', DELAWARE: 'DE', FLORIDA: 'FL', GEORGIA: 'GA',
  HAWAII: 'HI', IDAHO: 'ID', ILLINOIS: 'IL', INDIANA: 'IN', IOWA: 'IA',
  KANSAS: 'KS', KENTUCKY: 'KY', LOUISIANA: 'LA', MAINE: 'ME', MARYLAND: 'MD',
  MASSACHUSETTS: 'MA', MICHIGAN: 'MI', MINNESOTA: 'MN', MISSISSIPPI: 'MS',
  MISSOURI: 'MO', MONTANA: 'MT', NEBRASKA: 'NE', NEVADA: 'NV',
  'NEW HAMPSHIRE': 'NH', 'NEW JERSEY': 'NJ', 'NEW MEXICO': 'NM', 'NEW YORK': 'NY',
  'NORTH CAROLINA': 'NC', 'NORTH DAKOTA': 'ND', OHIO: 'OH', OKLAHOMA: 'OK',
  OREGON: 'OR', PENNSYLVANIA: 'PA', 'RHODE ISLAND': 'RI', 'SOUTH CAROLINA': 'SC',
  'SOUTH DAKOTA': 'SD', TENNESSEE: 'TN', TEXAS: 'TX', UTAH: 'UT', VERMONT: 'VT',
  VIRGINIA: 'VA', WASHINGTON: 'WA', 'WEST VIRGINIA': 'WV', WISCONSIN: 'WI',
  WYOMING: 'WY', 'DISTRICT OF COLUMBIA': 'DC',
};

/** Tax owed on a subtotal for a given shipping state. */
export function taxFor(subtotal: number, state: string | null | undefined): number {
  if (!TAX.enabled) return 0;
  const code = normalizeState(state);
  if (!code) return 0;
  const rate = TAX.ratesByState[code];
  if (!rate) return 0;
  return Math.round(subtotal * rate * 100) / 100;
}

export type ShippingMethod = 'standard' | 'express';

/** Shipping cost for a given subtotal and method. */
export function shippingCostFor(
  subtotal: number,
  method: ShippingMethod,
  region: 'domestic' | 'international' = 'domestic'
): number {
  if (subtotal >= SHIPPING.freeThreshold) return 0;
  return SHIPPING[region][method];
}

/** "$1,250.00" */
export function formatPrice(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(Number.isFinite(value) ? value : 0);
}
