import { Seo } from '../components/Seo';
import { CONTACT } from '../config/contact';
import { useCatalogLists } from '../hooks/useCatalogLists';

/**
 * Size guide.
 *
 * The charts were hardcoded here. They come from the size_scales table now,
 * which is the same source the product form and the size buttons use, so a
 * scale cannot say one thing on a product page and another here.
 */
export function SizeGuide() {
  const { scales, loading } = useCatalogLists();

  const charts = scales.filter(
    (scale) => (scale.conversions ?? []).length > 0
  );

  return (
    <div className="min-h-screen bg-white">
      <Seo
        title="Size Guide"
        description="US, European, Italian and UK sizing for TEALHOUSE clothing and footwear."
        path="/size-guide"
      />

      <div className="max-w-[900px] mx-auto px-5 py-16">
        <h1 className="text-center mb-4 uppercase tracking-wider">Size Guide</h1>
        <p className="text-center text-sm text-gray-600 mb-12">
          Measurements are a guide. If you are between sizes or unsure, write to
          us and we will help you choose.
        </p>

        {loading && <p className="text-sm text-gray-600">Loading</p>}

        {!loading && charts.length === 0 && (
          <p className="text-sm text-gray-600">
            Sizing information is being prepared.
          </p>
        )}

        <div className="space-y-14">
          {charts.map((scale) => {
            const rows = scale.conversions ?? [];
            const columns = Object.keys(rows[0] ?? {});

            return (
              <section key={scale.id}>
                <h2 className="mb-2">{scale.label}</h2>
                {scale.note && (
                  <p className="text-sm text-gray-600 mb-4">{scale.note}</p>
                )}

                <div className="overflow-x-auto border border-gray-200">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200 bg-gray-50">
                        {columns.map((column) => (
                          <th
                            key={column}
                            className="text-left px-4 py-3 text-xs uppercase tracking-wider text-gray-600 whitespace-nowrap"
                          >
                            {column}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {rows.map((row, index) => (
                        <tr
                          key={index}
                          className="border-b border-gray-100 last:border-0"
                        >
                          {columns.map((column) => (
                            <td
                              key={column}
                              className="px-4 py-3 text-sm whitespace-nowrap"
                            >
                              {row[column] ?? ''}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            );
          })}
        </div>

        <section className="mt-16 pt-8 border-t border-gray-200">
          <h2 className="mb-4">How to measure</h2>
          <div className="text-sm text-gray-700 space-y-3 leading-relaxed">
            <p>
              <strong>Bust.</strong> Around the fullest part, keeping the tape
              level and comfortably loose.
            </p>
            <p>
              <strong>Waist.</strong> Around the narrowest part of the natural
              waist, above the hip bone.
            </p>
            <p>
              <strong>Hips.</strong> Around the fullest part, roughly eight
              inches below the waist.
            </p>
            <p>
              <strong>Chest.</strong> Under the arms and across the fullest part,
              with arms relaxed.
            </p>
            <p>
              <strong>Foot length.</strong> Stand on paper, mark heel to longest
              toe, and measure the distance. Measure both feet late in the day
              and use the longer one.
            </p>
          </div>
        </section>

        <section className="mt-12 pt-8 border-t border-gray-200">
          <h2 className="mb-4">Still unsure</h2>
          <p className="text-sm text-gray-700">
            Write to{' '}
            <a
              href={`mailto:${CONTACT.clientServices}`}
              className="underline hover:text-black"
            >
              {CONTACT.clientServices}
            </a>{' '}
            with your measurements and the piece you are considering.
          </p>
        </section>
      </div>
    </div>
  );
}
