import { CONTACT } from '../config/contact';

export function EthicsCompliance() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-[900px] mx-auto px-5 py-16">
        <h1 className="text-center mb-12 uppercase tracking-wider">Ethics & Compliance</h1>
        
        <div className="space-y-8">
          <section>
            <h2 className="mb-4">Our Commitment</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              At TEALHOUSE, ethics are not an afterthought—they are the foundation of everything we do. We are committed to 
              the highest standards of business conduct, ensuring that our pursuit of luxury never comes at the expense of 
              people, animals, or the planet.
            </p>
          </section>

          <section>
            <h2 className="mb-4">Labor Standards</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              We maintain strict labor standards throughout our supply chain:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>Fair wages above legal minimums for all workers</li>
              <li>Safe working conditions with regular third-party audits</li>
              <li>No child labor or forced labor of any kind</li>
              <li>Freedom of association and collective bargaining rights</li>
              <li>Regular working hours with paid overtime</li>
              <li>Comprehensive health and safety training</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-4">Animal Welfare</h2>
            <p className="text-gray-700 leading-relaxed">
              TEALHOUSE is 100% vegan and cruelty-free. We use no animal-derived materials of any kind and do not test on animals. 
              We are certified by PETA and the Vegan Society, and we actively support animal welfare organizations worldwide.
            </p>
          </section>

          <section>
            <h2 className="mb-4">Environmental Responsibility</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              We are committed to minimizing our environmental impact:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>Carbon-neutral production and shipping</li>
              <li>100% renewable energy in our facilities</li>
              <li>Zero-waste manufacturing processes</li>
              <li>Recyclable and biodegradable packaging</li>
              <li>Water conservation and pollution prevention</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-4">Supply Chain Transparency</h2>
            <p className="text-gray-700 leading-relaxed">
              We maintain complete transparency in our supply chain. Every material is traceable to its source, and we conduct 
              regular audits of all partners and suppliers. Our annual Transparency Report details our suppliers, certifications, 
              and continuous improvement initiatives.
            </p>
          </section>

          <section>
            <h2 className="mb-4">Certifications</h2>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>PETA-Approved Vegan</li>
              <li>Vegan Society Certified</li>
              <li>B Corporation Certified</li>
              <li>Fair Trade Certified™</li>
              <li>Climate Neutral Certified</li>
              <li>GOTS (Global Organic Textile Standard)</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-4">Reporting Concerns</h2>
            <p className="text-gray-700 leading-relaxed">
              We encourage anyone who observes or suspects unethical conduct in our operations or supply chain to report it. 
              All reports are treated confidentially and investigated thoroughly. Contact: {CONTACT.ethics}
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
