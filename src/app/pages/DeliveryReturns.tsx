export function DeliveryReturns() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-[900px] mx-auto px-5 py-16">
        <h1 className="text-center mb-12 uppercase tracking-wider">Delivery & Returns</h1>
        
        <div className="space-y-8">
          <section>
            <h2 className="mb-4">Shipping Information</h2>
            
            <div className="mb-6">
              <h3 className="mb-3">Delivery Times</h3>
              <div className="space-y-3 text-gray-700">
                <p><strong>United States:</strong> 2-3 business days (Standard), 1-2 business days (Express)</p>
                <p><strong>Canada:</strong> 4-6 business days</p>
                <p><strong>Europe:</strong> 3-5 business days</p>
                <p><strong>Rest of World:</strong> 5-10 business days</p>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="mb-3">Shipping Costs</h3>
              <div className="space-y-3 text-gray-700">
                <p><strong>United States:</strong> $15 (Standard), $25 (Express)</p>
                <p><strong>International:</strong> $35 (Standard), $60 (Express)</p>
                <p><strong>Free shipping and free returns on orders over $500</strong></p>
              </div>
            </div>

            <div>
              <h3 className="mb-3">Order Processing</h3>
              <p className="text-gray-700 leading-relaxed">
                Orders are processed within 1-2 business days. You will receive a confirmation email with tracking information 
                once your order ships. All packages are fully insured and require a signature upon delivery.
              </p>
            </div>
          </section>

          <section>
            <h2 className="mb-4">Sustainable Shipping</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              All TEALHOUSE shipments are carbon-neutral. We partner with shipping providers committed to sustainable practices 
              and offset 100% of delivery emissions through verified environmental projects.
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>100% recyclable packaging materials</li>
              <li>No plastic—biodegradable protective materials only</li>
              <li>Minimalist packaging to reduce waste</li>
              <li>Reusable organic cotton shoe bags</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-4">Returns & Exchanges</h2>
            
            <div className="mb-6">
              <h3 className="mb-3">Return Policy</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                We want you to be completely satisfied with your purchase. If for any reason you're not happy with your shoes, \n                we offer complimentary returns and exchanges within 14 days of delivery.
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                <li>14-day return window from delivery date</li>
                <li>Shoes must be unworn and in original condition</li>
                <li>All original packaging must be included</li>
                <li>Free return shipping on orders over $500</li>
              </ul>
            </div>

            <div className="mb-6">
              <h3 className="mb-3">How to Return</h3>
              <ol className="list-decimal list-inside space-y-2 text-gray-700 ml-4">
                <li>Contact us at returns@tealhouse.com or through your account</li>
                <li>We'll send you a prepaid return label (US customers)</li>
                <li>Pack items securely in original packaging</li>
                <li>Drop off at any authorized shipping location</li>
                <li>Refund processed within 5-7 business days of receipt</li>
              </ol>
            </div>

            <div>
              <h3 className="mb-3">Exchanges</h3>
              <p className="text-gray-700 leading-relaxed">
                Need a different size or color? We offer free exchanges. Contact our client services team and we'll send your 
                new pair right away, before we receive the return. This ensures you get your perfect fit as quickly as possible.
              </p>
            </div>
          </section>

          <section>
            <h2 className="mb-4">International Returns</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              International customers can return items within 14 days. Return shipping costs are the responsibility of the customer. \n              We recommend using a tracked service. Refunds are issued in the original payment currency, minus original shipping costs.\n            </p>
          </section>

          <section>
            <h2 className="mb-4">Final Sale Items</h2>
            <p className="text-gray-700 leading-relaxed">
              Items marked as final sale cannot be returned or exchanged. This includes custom orders and special sale items. 
              All final sale items are clearly marked on the product page.
            </p>
          </section>

          <section>
            <h2 className="mb-4">Damaged or Defective Items</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              While rare, if you receive a damaged or defective item, please contact us immediately at clientservices@tealhouse.com. 
              We will arrange for a free replacement or full refund, including shipping costs.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Please include photos of the damage and your order number. We'll resolve the issue within 24 hours.
            </p>
          </section>

          <section>
            <h2 className="mb-4">Questions?</h2>
            <p className="text-gray-700 leading-relaxed">
              Our client services team is here to help with any questions about shipping, returns, or exchanges.<br />
              Email: clientservices@tealhouse.com<br />
              Phone: +1 (888) 832-5468
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}