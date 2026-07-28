import { SHIPPING, formatPrice } from '../config/store';

export function FAQ() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-[900px] mx-auto px-5 py-16">
        <h1 className="text-center mb-12 uppercase tracking-wider">Frequently Asked Questions</h1>
        
        <div className="space-y-8">
          <section>
            <h2 className="mb-4">About TEALHOUSE</h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="mb-2">What makes TEALHOUSE different?</h3>
                <p className="text-gray-700 leading-relaxed">
                  TEALHOUSE combines Italian luxury craftsmanship with 100% plant-based materials. Every shoe is handmade in Italy 
                  using innovative vegan materials that rival traditional leather in quality and beauty, all while maintaining our 
                  commitment to sustainability and ethics.
                </p>
              </div>

              <div>
                <h3 className="mb-2">Are your shoes really vegan?</h3>
                <p className="text-gray-700 leading-relaxed">
                  Yes, absolutely. We use zero animal-derived materials. Our shoes are made from plant-based materials like pineapple 
                  leather, apple leather, mushroom leather, cactus leather, and grape leather. We're certified by PETA and the Vegan Society.
                </p>
              </div>

              <div>
                <h3 className="mb-2">Where are TEALHOUSE shoes made?</h3>
                <p className="text-gray-700 leading-relaxed">
                  All our shoes are handcrafted in Italy by skilled artisans in Tuscany. We work with family-owned workshops that 
                  have been making luxury footwear for generations.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="mb-4">Sizing & Fit</h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="mb-2">How do TEALHOUSE shoes fit?</h3>
                <p className="text-gray-700 leading-relaxed">
                  Our shoes are true to size and follow European sizing. We recommend ordering your usual size. If you're between 
                  sizes or have wider feet, we suggest sizing up. See our Size Guide for detailed measurements.
                </p>
              </div>

              <div>
                <h3 className="mb-2">Do you offer half sizes?</h3>
                <p className="text-gray-700 leading-relaxed">
                  Most styles are available in whole European sizes (36-41). Some styles offer extended sizing up to 42. 
                  For custom sizing options, contact our client services team.
                </p>
              </div>

              <div>
                <h3 className="mb-2">Can I get help choosing the right size?</h3>
                <p className="text-gray-700 leading-relaxed">
                  Absolutely! Our personal shopping team can help you find your perfect fit. Email shopping@tealhouse.com or 
                  call +1 (888) 832-5468 for assistance.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="mb-4">Orders & Shipping</h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="mb-2">How long will my order take to arrive?</h3>
                <p className="text-gray-700 leading-relaxed">
                  US orders typically arrive in 2-3 business days (Standard) or 1-2 days (Express). International orders take 
                  3-10 business days depending on location. See our Delivery & Returns page for details.
                </p>
              </div>

              <div>
                <h3 className="mb-2">Do you ship internationally?</h3>
                <p className="text-gray-700 leading-relaxed">
                  Yes, we ship worldwide. International shipping costs {formatPrice(SHIPPING.international.standard)} (Standard) or {formatPrice(SHIPPING.international.express)} (Express), with free shipping and free returns on
                  orders over {formatPrice(SHIPPING.freeThreshold)}.
                </p>
              </div>

              <div>
                <h3 className="mb-2">Can I track my order?</h3>
                <p className="text-gray-700 leading-relaxed">
                  Yes! You'll receive a confirmation email with tracking information as soon as your order ships. You can also 
                  track orders through your account.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="mb-4">Returns & Exchanges</h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="mb-2">What is your return policy?</h3>
                <p className="text-gray-700 leading-relaxed">
                  We offer complimentary returns within 14 days of delivery. Shoes must be unworn and in original condition 
                  with all packaging. Free return shipping on orders over {formatPrice(SHIPPING.freeThreshold)}.
                </p>
              </div>

              <div>
                <h3 className="mb-2">How do exchanges work?</h3>
                <p className="text-gray-700 leading-relaxed">
                  Contact us to request an exchange. We'll send your new pair right away before receiving the return, so you 
                  get your perfect fit as quickly as possible. Exchanges are free within the US.
                </p>
              </div>

              <div>
                <h3 className="mb-2">How long do refunds take?</h3>
                <p className="text-gray-700 leading-relaxed">
                  Refunds are processed within 5-7 business days of receiving your return. You'll receive an email confirmation 
                  when the refund is issued.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="mb-4">Care & Maintenance</h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="mb-2">How do I care for my TEALHOUSE shoes?</h3>
                <p className="text-gray-700 leading-relaxed">
                  Wipe gently with a soft, damp cloth. For deeper cleaning, use our plant-based shoe cleaner. Avoid soaking 
                  or machine washing. Store in the provided dust bag away from direct sunlight and heat.
                </p>
              </div>

              <div>
                <h3 className="mb-2">Are plant-based materials durable?</h3>
                <p className="text-gray-700 leading-relaxed">
                  Yes! Our materials are chosen for their durability and often outlast traditional leather. With proper care, 
                  your TEALHOUSE shoes will last for years. We also offer lifetime repair services.
                </p>
              </div>

              <div>
                <h3 className="mb-2">Do you offer repair services?</h3>
                <p className="text-gray-700 leading-relaxed">
                  Yes, we offer lifetime repair services including sole replacement, heel repair, and restoration. Contact 
                  care@tealhouse.com for details.
                </p>
              </div>

              <div>
                <h3 className="mb-2">Are TEALHOUSE shoes waterproof?</h3>
                <p className="text-gray-700 leading-relaxed">
                  Our materials are water-resistant but not fully waterproof. Avoid prolonged exposure to water. If shoes get wet, 
                  stuff with paper and air dry away from direct heat.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="mb-4">Sustainability</h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="mb-2">How sustainable are TEALHOUSE shoes?</h3>
                <p className="text-gray-700 leading-relaxed">
                  Very! We're carbon-neutral, use only plant-based materials, maintain zero-waste production, and offer lifetime 
                  repairs and recycling. See our Sustainability page for full details.
                </p>
              </div>

              <div>
                <h3 className="mb-2">What happens to shoes I return for recycling?</h3>
                <p className="text-gray-700 leading-relaxed">
                  Returned shoes are assessed for repair and donation. If beyond repair, materials are separated and recycled 
                  or composted. Our fully biodegradable materials can safely return to nature.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="mb-4">Still Have Questions?</h2>
            <p className="text-gray-700 leading-relaxed">
              Our client services team is happy to help!<br />
              Email: clientservices@tealhouse.com<br />
              Phone: +1 (888) 832-5468<br />
              Monday - Friday, 9 AM - 6 PM EST
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}