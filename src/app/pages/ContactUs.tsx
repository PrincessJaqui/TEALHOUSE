export function ContactUs() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-[900px] mx-auto px-5 py-16">
        <h1 className="text-center mb-12 uppercase tracking-wider">Contact Us</h1>
        
        <div className="space-y-8">
          <section>
            <p className="text-gray-700 leading-relaxed text-center mb-8">
              We'd love to hear from you. Whether you have a question about our products, need assistance with an order, 
              or just want to share your feedback, our team is here to help.
            </p>
          </section>

          <section>
            <h2 className="mb-4">Get in Touch</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="mb-3">Customer Service</h3>
                <div className="space-y-2 text-gray-700">
                  <p>Email: clientservices@tealhouse.com</p>
                  <p>Phone: +1 (888) 832-5468</p>
                  <p>Monday - Friday, 9 AM - 6 PM EST</p>
                </div>
              </div>

              <div>
                <h3 className="mb-3">Press & Media</h3>
                <div className="space-y-2 text-gray-700">
                  <p>Email: press@tealhouse.com</p>
                  <p>For press kits and media inquiries</p>
                </div>
              </div>

              <div>
                <h3 className="mb-3">Wholesale & Partnerships</h3>
                <div className="space-y-2 text-gray-700">
                  <p>Email: wholesale@tealhouse.com</p>
                  <p>For retail and collaboration opportunities</p>
                </div>
              </div>

              <div>
                <h3 className="mb-3">Careers</h3>
                <div className="space-y-2 text-gray-700">
                  <p>Email: careers@tealhouse.com</p>
                  <p>Join our team</p>
                </div>
              </div>
            </div>
          </section>

          <section className="pt-8 border-t border-gray-200">
            <h2 className="mb-4">Send Us a Message</h2>
            <form className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="block text-sm mb-2">First Name *</label>
                  <input
                    type="text"
                    id="firstName"
                    required
                    className="w-full px-4 py-2 border border-gray-300 focus:border-black focus:outline-none"
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm mb-2">Last Name *</label>
                  <input
                    type="text"
                    id="lastName"
                    required
                    className="w-full px-4 py-2 border border-gray-300 focus:border-black focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm mb-2">Email *</label>
                <input
                  type="email"
                  id="email"
                  required
                  className="w-full px-4 py-2 border border-gray-300 focus:border-black focus:outline-none"
                />
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm mb-2">Subject *</label>
                <select
                  id="subject"
                  required
                  className="w-full px-4 py-2 border border-gray-300 focus:border-black focus:outline-none"
                >
                  <option value="">Please select...</option>
                  <option value="order">Order Inquiry</option>
                  <option value="product">Product Question</option>
                  <option value="return">Return/Exchange</option>
                  <option value="repair">Repair Service</option>
                  <option value="custom">Custom Order</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm mb-2">Message *</label>
                <textarea
                  id="message"
                  required
                  rows={6}
                  className="w-full px-4 py-2 border border-gray-300 focus:border-black focus:outline-none resize-none"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full bg-black text-white py-3 hover:bg-gray-800 transition-colors uppercase tracking-wider text-sm"
              >
                Send Message
              </button>
            </form>
          </section>

          <section className="pt-8 border-t border-gray-200">
            <h2 className="mb-4">Our Showrooms</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div>
                <h3 className="mb-3">Milan</h3>
                <p className="text-gray-700 text-sm leading-relaxed">
                  Via Monte Napoleone, 12<br />
                  20121 Milano, Italy<br />
                  +39 02 7600 1234
                </p>
              </div>

              <div>
                <h3 className="mb-3">New York</h3>
                <p className="text-gray-700 text-sm leading-relaxed">
                  100 Greene Street<br />
                  New York, NY 10012<br />
                  +1 (212) 555-8324
                </p>
              </div>

              <div>
                <h3 className="mb-3">Los Angeles</h3>
                <p className="text-gray-700 text-sm leading-relaxed">
                  8500 Melrose Avenue<br />
                  Los Angeles, CA 90069<br />
                  +1 (310) 555-7325
                </p>
              </div>

              <div>
                <h3 className="mb-3">Kansas City</h3>
                <p className="text-gray-700 text-sm leading-relaxed">
                  1200 Main Street<br />
                  Kansas City, MO 64105<br />
                  +1 (816) 555-8324
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}