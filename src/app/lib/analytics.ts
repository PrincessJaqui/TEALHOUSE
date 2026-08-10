import { supabase } from './supabase';

/**
 * Event tracking.
 *
 * Writes to her own database, so the numbers live beside the orders they
 * relate to and no third party sees a customer's browsing.
 *
 * Deliberately quiet: a failure here must never interrupt someone shopping,
 * so nothing is awaited and nothing is thrown.
 */

export type AnalyticsEvent =
  | 'page_view'
  | 'product_view'
  | 'add_to_cart'
  | 'begin_checkout'
  | 'purchase';

const SESSION_KEY = 'th_session';

/**
 * A session id, so repeat views by one person can be told apart from ten
 * different people. Held in sessionStorage rather than a cookie: it dies
 * with the tab, identifies nobody, and needs no consent banner.
 */
function sessionId(): string {
  if (typeof window === 'undefined') return '';

  try {
    let id = window.sessionStorage.getItem(SESSION_KEY);
    if (!id) {
      id = Math.random().toString(36).slice(2) + Date.now().toString(36);
      window.sessionStorage.setItem(SESSION_KEY, id);
    }
    return id;
  } catch {
    // Private browsing can refuse storage. Not a reason to stop.
    return '';
  }
}

/** Only our own referrers are noise; an external one is the useful part. */
function referrer(): string | null {
  if (typeof document === 'undefined') return null;
  const value = document.referrer;
  if (!value) return null;

  try {
    if (new URL(value).hostname === window.location.hostname) return null;
  } catch {
    return null;
  }
  return value.slice(0, 500);
}

export function track(
  event: AnalyticsEvent,
  options: {
    productId?: number | null;
    metadata?: Record<string, unknown>;
  } = {}
): void {
  if (typeof window === 'undefined') return;

  // Never block the page on a metric.
  void supabase
    .from('analytics_events')
    .insert({
      event,
      product_id: options.productId ?? null,
      path: window.location.pathname.slice(0, 500),
      referrer: referrer(),
      session_id: sessionId(),
      metadata: options.metadata ?? {},
    })
    .then(({ error }) => {
      if (error) console.debug('Analytics not recorded:', error.message);
    });
}
