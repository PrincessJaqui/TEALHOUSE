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
 * Sales tax. Zero until you have decided where you have nexus and wired up a
 * tax provider. Do not guess at a rate: collecting the wrong amount is a
 * liability you carry, not the customer.
 */
export const TAX = {
  enabled: false,
  rate: 0,
} as const;

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
