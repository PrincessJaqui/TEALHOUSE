import { CONTACT } from '../config/contact';
import { Seo } from '../components/Seo';

/**
 * Ethics & Conscious Design.
 *
 * Jaqui's own wording. The Sustainability page was removed and its ground is
 * covered here, so there is one statement of position rather than two that
 * could drift apart.
 */
export function EthicsCompliance() {
  return (
    <div className="min-h-screen bg-white">
      <Seo
        title="Ethics & Conscious Design"
        description="TEALHOUSE is 100% vegan across every creation, with no animal components and an absolute ban on animal testing."
        path="/ethics-compliance"
      />

      <div className="max-w-[900px] mx-auto px-5 py-16">
        <h1 className="text-center mb-12 uppercase tracking-wider">
          Ethics &amp; Conscious Design
        </h1>

        <div className="space-y-10">
          <section>
            <h2 className="mb-4">Our Philosophy</h2>
            <p className="text-gray-700 leading-relaxed">
              TEALHOUSE rests on a clear conviction: true luxury is a practice of
              care toward our planet and its cohabitants. Every piece is defined
              by clean lines, masterful technique, and complete compassion. By
              eliminating animal-derived materials entirely, we prove that
              unyielding elegance requires no sacrifice.
            </p>
          </section>

          <section>
            <h2 className="mb-4">Uncompromisingly Cruelty-Free</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              TEALHOUSE remains 100% vegan across every creation and collection.
              We use zero animal components and enforce an absolute ban on animal
              testing throughout every phase of development.
            </p>

            <div className="space-y-4">
              <p className="text-gray-700 leading-relaxed">
                <strong>Footwear Architecture.</strong> Engineered with advanced,
                non-animal leather alternatives to deliver exceptional structural
                integrity, refined grain finishes, and enduring wear.
              </p>
              <p className="text-gray-700 leading-relaxed">
                <strong>Swimwear Engineering.</strong> Crafted from premier
                synthetic textiles chosen for maximum recovery, element
                resistance, and precise contouring. We intentionally exclude
                plant-based fibers from our swimwear to guarantee flawless fit,
                longevity, and shape retention in the water.
              </p>
            </div>
          </section>

          <section>
            <h2 className="mb-4">Integrity &amp; Confidential Reporting</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              We maintain an exacting standard of accountability across our
              corporate culture and global supply chain. We invite our patrons,
              artisans, and partners to share any observations regarding
              operational conduct or ethical standards.
            </p>
            <p className="text-gray-700">
              Confidential Inquiries &amp; Compliance:{' '}
              <a
                href={`mailto:${CONTACT.ethics}`}
                className="underline hover:text-black"
              >
                {CONTACT.ethics}
              </a>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
