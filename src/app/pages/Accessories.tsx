import { CONTACT } from '../config/contact';
import { Seo } from '../components/Seo';

export function Accessories() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <Seo title="Accents" description="Vegan luxury accessories and accents from TEALHOUSE." path="/accessories" />
      <div className="max-w-2xl mx-auto px-5 py-24 text-center">
        <h1 className="uppercase tracking-wider mb-8">Accents</h1>
        <div className="space-y-6">
          <p className="text-2xl tracking-wide">Coming Soon</p>
          <p className="text-gray-600 leading-relaxed max-w-lg mx-auto">
            We're crafting a collection of plant-based accessories to complement your TEALHOUSE footwear. 
            Stay tuned for sustainable luxury pieces made with the same thoughtful craftsmanship.
          </p>
          <div className="pt-8">
            <a 
              href={`mailto:${CONTACT.clientServices}`} 
              className="inline-block bg-black text-white px-8 py-3 uppercase text-sm tracking-wider hover:bg-gray-800 transition-colors"
            >
              Get Notified
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
