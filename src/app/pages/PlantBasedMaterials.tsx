import { Seo } from '../components/Seo';
import { CARE } from '../config/store';

interface Material {
  name: string;
  body: string;
}

const FOOTWEAR: Material[] = [
  {
    name: 'Apple Leather',
    body: 'Created from apple pomace sourced from northern Italian juice production. Delivers a smooth, supple finish that contours seamlessly with age.',
  },
  {
    name: 'Cactus Leather (Desserto\u00ae)',
    body: 'Harvested from organic cacti requiring zero irrigation. Remarkably soft, durable, and breathable with deep, lasting color retention.',
  },
  {
    name: 'Pineapple Leather (Pi\u00f1atex\u00ae)',
    body: 'Repurposed from agricultural pineapple leaf fibers. Naturally flexible, lightweight, and textured with an elevated grain.',
  },
  {
    name: 'Grape Leather',
    body: 'Sourced from grape marc and skins generated during Italian wine production. Rich, structured, and inherently circular.',
  },
  {
    name: 'Mushroom Leather (Mylo\u2122)',
    body: 'Grown from mycelium in controlled environments. Exceptionally soft with subtle natural variations that make each pair distinct.',
  },
  {
    name: 'Signature Teal Sole',
    body: 'Crafted from a natural rubber and cork compound to provide exceptional cushioning and longevity. Finished in our signature teal tone using plant-based dyes.',
  },
];

const SWIMWEAR: Material[] = [
  {
    name: 'Recycled Performance Polyester',
    body: 'Premium post-consumer recycled fibers engineered for high chlorine resistance, structural shape retention, and a smooth, second-skin fit.',
  },
  {
    name: 'Recycled Lycra\u00ae',
    body: 'Ultra-stretchy, resilient elastane woven from recycled materials to provide firm silhouette contouring, crisp recovery, and long-lasting wear.',
  },
];

function MaterialList({ heading, items }: { heading: string; items: Material[] }) {
  return (
    <section>
      <h3 className="mb-5 uppercase tracking-wider text-sm text-gray-500">
        {heading}
      </h3>
      <div className="space-y-5">
        {items.map((material) => (
          <div key={material.name}>
            <p className="mb-1">{material.name}</p>
            <p className="text-gray-700 leading-relaxed text-sm">{material.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export function PlantBasedMaterials() {
  return (
    <div className="min-h-screen bg-white">
      <Seo
        title="Materials"
        description="TEALHOUSE is crafted from high-performance plant-based leathers and premium recycled synthetics. 100% vegan and cruelty-free."
        path="/plant-based-materials"
      />

      <div className="max-w-[900px] mx-auto px-5 py-16">
        <h1 className="text-center mb-3 uppercase tracking-wider">Materials</h1>
        <p className="text-center text-sm text-gray-500 mb-14 uppercase tracking-wider">
          100% Vegan &amp; Cruelty-Free
        </p>

        <div className="space-y-12">
          <section>
            <h2 className="mb-4">Innovation in Sustainable Luxury</h2>
            <p className="text-gray-700 leading-relaxed">
              TEALHOUSE pieces are crafted exclusively from high-performance
              plant-based leathers and premium recycled synthetics that surpass
              traditional materials in quality, durability, and elevated
              aesthetic. From our Italian-made footwear to our tailored
              swimwear, every silhouette relies on cutting-edge material science
              to deliver 100% vegan, cruelty-free luxury without compromise.
            </p>
          </section>

          <section>
            <h2 className="mb-8">Our Materials</h2>
            <div className="space-y-10">
              <MaterialList heading="Footwear Architecture" items={FOOTWEAR} />
              <div>
                <MaterialList heading="Swimwear Engineering" items={SWIMWEAR} />
                <p className="text-gray-700 leading-relaxed text-sm mt-5 pt-5 border-t border-gray-200">
                  <strong>Care.</strong> {CARE.swimwear}
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
