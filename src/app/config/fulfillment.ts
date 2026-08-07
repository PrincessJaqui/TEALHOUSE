/**
 * How a product is sold, and the wording the customer sees.
 *
 * The copy lives here rather than inside components so it reads identically
 * on the product page, at checkout, and on the confirmation, and so it can
 * be changed in one place.
 */

export type FulfillmentType =
  | 'in_stock'
  | 'pre_order'
  | 'made_to_measure'
  | 'made_to_order';

export const FULFILLMENT_LABELS: Record<FulfillmentType, string> = {
  in_stock: 'In stock',
  pre_order: 'Pre-order',
  made_to_measure: 'Made to measure',
  made_to_order: 'Made to order',
};

/** Default estimate when a pre-order product is created. Editable per product. */
export const DEFAULT_PREORDER_MONTHS = 6;

export const BESPOKE_COPY = {
  /**
   * Shown on the product page and again at checkout, before payment.
   * Jaqui's wording, used exactly as written.
   */
  beforeCheckout:
    'To initiate your custom creation, a preliminary retainer is requested at ' +
    'checkout. Upon receipt, our team will thoughtfully review your ' +
    'specifications, finalize pricing, and share an invoice for your formal ' +
    'authorization. Should your request be unable to be fulfilled, or should ' +
    'you choose not to move forward, a complete refund will be returned to you.',

  /**
   * Shown on the order confirmation.
   *
   * The original read "We look forward to rece thoughtfully reviewing", which
   * was a typo. Corrected to "receiving and thoughtfully reviewing".
   */
  afterCheckout:
    'We look forward to receiving and thoughtfully reviewing your bespoke ' +
    'request. If a price adjustment is needed, an invoice will be shared for ' +
    'your personal authorization. Should you choose not to move forward, a ' +
    'complete refund will be returned to you.',

  notesLabel: 'Your specifications',

  notesHelp:
    'Tell us about the piece you have in mind: materials, colours, ' +
    'measurements, occasion, and anything else we should know.',
} as const;

export const PREORDER_COPY = {
  disclaimer:
    'This is an estimate. We will keep you informed if the date moves.',
} as const;

/** "March 2027", the level of precision an estimate deserves. */
export function formatShipEstimate(value: string | null | undefined): string | null {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
}

/** The default estimate offered when pre-order is first selected. */
export function defaultShipEstimate(): string {
  const date = new Date();
  date.setMonth(date.getMonth() + DEFAULT_PREORDER_MONTHS);
  return date.toISOString().slice(0, 10);
}

/**
 * What PayPal charges for one unit.
 *
 * A bespoke piece is charged at its retainer, not its price, because the
 * final price is not known until the specification is agreed. The retainer
 * counts toward that final price.
 */
export function unitChargeFor(product: {
  price: number;
  fulfillment_type?: string;
  retainer_amount?: number | null;
}): number {
  if (product.fulfillment_type === 'made_to_order') {
    return Number(product.retainer_amount ?? 0);
  }
  return Number(product.price);
}

export function isBespoke(product: { fulfillment_type?: string }): boolean {
  return product.fulfillment_type === 'made_to_order';
}

export function isPreOrder(product: { fulfillment_type?: string }): boolean {
  return product.fulfillment_type === 'pre_order';
}

export function isMadeToMeasure(product: { fulfillment_type?: string }): boolean {
  return product.fulfillment_type === 'made_to_measure';
}

/* ------------------------------------------------------------------ */
/* Made to measure                                                     */
/* ------------------------------------------------------------------ */

/**
 * The measurements a product can ask for.
 *
 * These are not sizes and carry no stock. They are what the customer tells
 * you about their own body, so the piece can be cut to them. The Ali
 * swimsuit asks for Chest, Waist and Hips.
 */
export const MEASUREMENT_TYPES = [
  'Bust',
  'Chest',
  'Waist',
  'Hips',
  'Inseam',
  'Sleeve',
] as const;

const MEASURE_MIN_INCHES = 18;
const MEASURE_MAX_INCHES = 100;

/**
 * Dropdown values, in half-inch steps with both units on every option.
 *
 * Half inches because a garment cut to a whole inch is not made to measure.
 * Both units because a customer should never have to convert anything.
 */
export function measurementOptions(): string[] {
  const options: string[] = [];
  for (let i = MEASURE_MIN_INCHES * 2; i <= MEASURE_MAX_INCHES * 2; i += 1) {
    const inches = i / 2;
    const cm = Math.round(inches * 2.54);
    const inchLabel = Number.isInteger(inches) ? `${inches}` : `${inches}`;
    options.push(`${inchLabel}" / ${cm}cm`);
  }
  return options;
}

export const MADE_TO_MEASURE_COPY = {
  intro:
    'Cut to your measurements. Choose the closest value for each; our ' +
    'atelier works to these figures, so measure carefully.',
  leadTime: (weeks?: number | null) =>
    weeks && weeks > 0
      ? `Made to measure, so please allow about ${weeks} ` +
        `${weeks === 1 ? 'week' : 'weeks'} before dispatch.`
      : 'Made to measure, so this takes longer than a stocked piece.',
  /** Cut to a person, so it cannot go back on the shelf. */
  returns:
    'Because each piece is cut to your own measurements, made to measure ' +
    'orders cannot be returned or exchanged unless the piece is faulty.',
} as const;

/** Stock only governs products actually sold from stock. */
export function tracksStock(product: { fulfillment_type?: string }): boolean {
  return (product.fulfillment_type ?? 'in_stock') === 'in_stock';
}

/** True when the customer must supply measurements before adding to bag. */
export function needsMeasurements(product: {
  fulfillment_type?: string;
  measurement_fields?: string[];
}): boolean {
  return (
    product.fulfillment_type === 'made_to_measure' &&
    (product.measurement_fields ?? []).length > 0
  );
}
