import { useState, useEffect } from 'react';
import { AdminLayout } from '../components/AdminLayout';
import { supabase } from '../lib/supabase';
import { exportCsv } from '../lib/csv';
import { Download } from 'lucide-react';

/**
 * Analytics.
 *
 * Reads the event log directly, so the numbers are hers and match her orders
 * rather than approximating them from a third party.
 *
 * Deliberately a small set of figures that change a decision. A wall of
 * charts nobody reads is worse than five numbers that mean something.
 */

interface EventRow {
  event: string;
  product_id: number | null;
  path: string | null;
  referrer: string | null;
  session_id: string | null;
  metadata: Record<string, any>;
  created_at: string;
}

const RANGES = [
  { label: 'Last 7 days', days: 7 },
  { label: 'Last 30 days', days: 30 },
  { label: 'Last 90 days', days: 90 },
];

function Stat({
  label,
  value,
  note,
}: {
  label: string;
  value: string | number;
  note?: string;
}) {
  return (
    <div className="border border-neutral-200 bg-white p-5">
      <p className="text-xs uppercase tracking-wider text-[#008080] mb-2">{label}</p>
      <p className="text-3xl">{value}</p>
      {note && <p className="text-xs text-neutral-500 mt-2">{note}</p>}
    </div>
  );
}

export function AdminAnalytics() {
  const [days, setDays] = useState(30);
  const [events, setEvents] = useState<EventRow[]>([]);
  const [names, setNames] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    setLoading(true);

    (async () => {
      const since = new Date();
      since.setDate(since.getDate() - days);

      const [eventsResult, productsResult] = await Promise.all([
        supabase
          .from('analytics_events')
          .select('*')
          .gte('created_at', since.toISOString())
          .order('created_at', { ascending: false }),
        supabase.from('products').select('id, name'),
      ]);

      if (!active) return;

      if (eventsResult.error) {
        setError(eventsResult.error.message);
        setLoading(false);
        return;
      }

      setError(null);
      setEvents((eventsResult.data ?? []) as EventRow[]);

      const lookup: Record<number, string> = {};
      for (const product of productsResult.data ?? []) {
        lookup[product.id] = product.name;
      }
      setNames(lookup);
      setLoading(false);
    })();

    return () => {
      active = false;
    };
  }, [days]);

  const of = (event: string) => events.filter((row) => row.event === event);

  // A visit is one browsing session, not one page opened.
  const visits = new Set(
    events.filter((e) => e.session_id).map((e) => e.session_id)
  ).size;

  const pageViews = of('page_view').length;
  const productViews = of('product_view');
  const addToCarts = of('add_to_cart');
  const checkouts = of('begin_checkout');
  const purchases = of('purchase');

  const rate = (top: number, bottom: number) =>
    bottom > 0 ? `${((top / bottom) * 100).toFixed(1)}%` : '0%';

  /** Which pieces draw attention, and which of those get wanted. */
  const byProduct = (() => {
    const tally: Record<number, { views: number; carts: number }> = {};

    for (const row of productViews) {
      if (!row.product_id) continue;
      tally[row.product_id] ??= { views: 0, carts: 0 };
      tally[row.product_id].views += 1;
    }
    for (const row of addToCarts) {
      if (!row.product_id) continue;
      tally[row.product_id] ??= { views: 0, carts: 0 };
      tally[row.product_id].carts += 1;
    }

    return Object.entries(tally)
      .map(([id, counts]) => ({
        id: Number(id),
        name: names[Number(id)] ?? `Product ${id}`,
        ...counts,
      }))
      .sort((a, b) => b.views - a.views);
  })();

  /** Where people arrive from. Direct is anyone with no external referrer. */
  const sources = (() => {
    const tally: Record<string, number> = {};
    const seen = new Set<string>();

    for (const row of events) {
      if (!row.session_id || seen.has(row.session_id)) continue;
      seen.add(row.session_id);

      let source = 'Direct';
      if (row.referrer) {
        try {
          source = new URL(row.referrer).hostname.replace(/^www\./, '');
        } catch {
          source = 'Other';
        }
      }
      tally[source] = (tally[source] ?? 0) + 1;
    }

    return Object.entries(tally).sort((a, b) => b[1] - a[1]);
  })();

  return (
    <AdminLayout
      title="Analytics"
      description="Traffic, interest and what turns into an order"
      actions={
        <div className="flex items-center gap-3">
          <select
            value={days}
            onChange={(e) => setDays(Number(e.target.value))}
            className="px-3 py-2 border border-neutral-200 text-sm"
          >
            {RANGES.map((range) => (
              <option key={range.days} value={range.days}>
                {range.label}
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={() =>
              exportCsv('analytics', byProduct, [
                { header: 'Product', value: (row) => row.name },
                { header: 'Views', value: (row) => row.views },
                { header: 'Added to bag', value: (row) => row.carts },
                { header: 'Bag rate', value: (row) => rate(row.carts, row.views) },
              ])
            }
            className="inline-flex items-center gap-2 px-4 py-2 border border-neutral-200 text-xs uppercase tracking-wider hover:border-black transition-colors"
          >
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      }
    >
      {loading && <p className="text-sm text-neutral-600">Loading</p>}

      {error && (
        <div className="border border-amber-300 bg-amber-50 p-4 mb-6">
          <p className="text-sm text-amber-900">{error}</p>
          <p className="text-xs text-amber-800 mt-1">
            If this mentions a missing table, the analytics migration has not
            been run yet.
          </p>
        </div>
      )}

      {!loading && !error && (
        <div className="space-y-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <Stat label="Visits" value={visits} note="Separate browsing sessions" />
            <Stat label="Pages viewed" value={pageViews} />
            <Stat
              label="Added to bag"
              value={addToCarts.length}
              note={`${rate(addToCarts.length, productViews.length)} of product views`}
            />
            <Stat
              label="Orders"
              value={purchases.length}
              note={`${rate(purchases.length, visits)} of visits`}
            />
          </div>

          {/* Where people fall away. The gap between two rows is the thing
              worth acting on. */}
          <section className="border border-neutral-200 bg-white">
            <div className="px-5 py-4 border-b border-neutral-200">
              <h2 className="font-['Tinos'] text-xl">Where people stop</h2>
            </div>
            <div className="divide-y divide-neutral-100">
              {[
                ['Viewed a product', productViews.length, visits],
                ['Added to bag', addToCarts.length, productViews.length],
                ['Started checkout', checkouts.length, addToCarts.length],
                ['Placed an order', purchases.length, checkouts.length],
              ].map(([label, value, base]) => (
                <div
                  key={String(label)}
                  className="flex items-center justify-between px-5 py-3"
                >
                  <span className="text-sm">{label}</span>
                  <span className="text-sm">
                    {value as number}
                    <span className="text-neutral-500 ml-3">
                      {rate(value as number, base as number)} of the step before
                    </span>
                  </span>
                </div>
              ))}
            </div>
          </section>

          <section className="border border-neutral-200 bg-white">
            <div className="px-5 py-4 border-b border-neutral-200">
              <h2 className="font-['Tinos'] text-xl">Pieces by interest</h2>
            </div>

            {byProduct.length === 0 ? (
              <p className="px-5 py-6 text-sm text-neutral-600">
                Nothing recorded yet in this period.
              </p>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="border-b border-neutral-200 text-left">
                    <th className="px-5 py-3 text-xs uppercase tracking-wider text-neutral-500">
                      Piece
                    </th>
                    <th className="px-5 py-3 text-xs uppercase tracking-wider text-neutral-500">
                      Views
                    </th>
                    <th className="px-5 py-3 text-xs uppercase tracking-wider text-neutral-500">
                      Added to bag
                    </th>
                    <th className="px-5 py-3 text-xs uppercase tracking-wider text-neutral-500">
                      Rate
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {byProduct.map((row) => (
                    <tr key={row.id}>
                      <td className="px-5 py-3 text-sm">{row.name}</td>
                      <td className="px-5 py-3 text-sm">{row.views}</td>
                      <td className="px-5 py-3 text-sm">{row.carts}</td>
                      <td className="px-5 py-3 text-sm text-neutral-600">
                        {rate(row.carts, row.views)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </section>

          <section className="border border-neutral-200 bg-white">
            <div className="px-5 py-4 border-b border-neutral-200">
              <h2 className="font-['Tinos'] text-xl">How they found you</h2>
            </div>
            {sources.length === 0 ? (
              <p className="px-5 py-6 text-sm text-neutral-600">
                Nothing recorded yet in this period.
              </p>
            ) : (
              <div className="divide-y divide-neutral-100">
                {sources.map(([source, count]) => (
                  <div
                    key={source}
                    className="flex items-center justify-between px-5 py-3"
                  >
                    <span className="text-sm">{source}</span>
                    <span className="text-sm text-neutral-600">{count}</span>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      )}
    </AdminLayout>
  );
}
