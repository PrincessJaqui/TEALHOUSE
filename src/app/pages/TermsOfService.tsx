import { CONTACT } from '../config/contact';

export function TermsOfService() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-[900px] mx-auto px-5 py-16">
        <h1 className="text-center mb-12 uppercase tracking-wider">Terms of Service</h1>
        
        <div className="space-y-8 text-gray-700">
          <section>
            <p className="text-sm mb-4"><em>Last updated: December 12, 2025</em></p>
            <p className="leading-relaxed">
              Welcome to TEALHOUSE. These Terms of Service ("Terms") govern your use of our website and the purchase of our products. 
              By accessing our website or making a purchase, you agree to these Terms. Please read them carefully.
            </p>
          </section>

          <section>
            <h2 className="mb-4">1. General Terms</h2>
            <p className="leading-relaxed mb-3">
              By using this website, you represent that you are at least 18 years old and have the legal capacity to enter into 
              a binding contract. You agree to provide accurate and complete information when making a purchase.
            </p>
          </section>

          <section>
            <h2 className="mb-4">2. Products and Pricing</h2>
            <div className="space-y-3">
              <p className="leading-relaxed">
                All products are subject to availability. We reserve the right to limit quantities and discontinue products at any time. 
                Prices are listed in USD and may change without notice. We make every effort to display accurate colors and images, 
                but we cannot guarantee that your screen's display will be accurate.
              </p>
              <p className="leading-relaxed">
                In the event of a pricing error, we reserve the right to cancel or refuse orders placed at the incorrect price.
              </p>
            </div>
          </section>

          <section>
            <h2 className="mb-4">3. Orders and Payment</h2>
            <div className="space-y-3">
              <p className="leading-relaxed">
                By placing an order, you make an offer to purchase products. We reserve the right to accept or decline your order 
                for any reason. Payment must be received before orders are processed.
              </p>
              <p className="leading-relaxed">
                We accept major credit cards, PayPal, and other payment methods as displayed at checkout. All transactions are 
                processed securely through our payment partners.
              </p>
              <p className="leading-relaxed">
                You are responsible for any customs duties, taxes, or additional fees imposed by your country.
              </p>
            </div>
          </section>

          <section>
            <h2 className="mb-4">4. Shipping and Delivery</h2>
            <p className="leading-relaxed">
              Shipping times are estimates and not guarantees. TEALHOUSE is not responsible for delays caused by shipping carriers, 
              customs, or circumstances beyond our control. Risk of loss and title pass to you upon delivery to the carrier. 
              See our Delivery & Returns page for detailed shipping information.
            </p>
          </section>

          <section>
            <h2 className="mb-4">5. Returns and Refunds</h2>
            <div className="space-y-3">
              <p className="leading-relaxed">
                We accept returns within 14 days of delivery for unworn items in original condition with all packaging. 
                See our Delivery & Returns page for complete return policy.
              </p>
              <p className="leading-relaxed">
                Refunds are issued to the original payment method within 5-7 business days of receiving the return. 
                Original shipping costs are non-refundable unless the return is due to our error.
              </p>
              <p className="leading-relaxed">
                Custom orders and final sale items cannot be returned or exchanged.
              </p>
            </div>
          </section>

          <section>
            <h2 className="mb-4">6. Intellectual Property</h2>
            <p className="leading-relaxed">
              All content on this website, including text, images, logos, and designs, is the property of TEALHOUSE and protected 
              by copyright, trademark, and other intellectual property laws. You may not reproduce, distribute, or create derivative 
              works without our written permission.
            </p>
          </section>

          <section>
            <h2 className="mb-4">7. User Accounts</h2>
            <div className="space-y-3">
              <p className="leading-relaxed">
                If you create an account, you are responsible for maintaining the confidentiality of your password and account information. 
                You are responsible for all activities that occur under your account.
              </p>
              <p className="leading-relaxed">
                We reserve the right to suspend or terminate accounts that violate these Terms or engage in fraudulent activity.
              </p>
            </div>
          </section>

          <section>
            <h2 className="mb-4">8. Prohibited Uses</h2>
            <p className="leading-relaxed mb-3">You agree not to:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Use the website for any unlawful purpose</li>
              <li>Attempt to gain unauthorized access to our systems</li>
              <li>Interfere with the proper functioning of the website</li>
              <li>Upload viruses or malicious code</li>
              <li>Collect user information without consent</li>
              <li>Impersonate another person or entity</li>
              <li>Engage in any form of harassment or abuse</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-4">9. Warranty Disclaimer</h2>
            <p className="leading-relaxed">
              Our products are sold "as is" without warranties of any kind, either express or implied, except as required by law. 
              We do not warrant that products will meet your specific requirements or that they will be error-free or uninterrupted. 
              We stand behind the quality of our products and offer repair services, but we cannot guarantee specific outcomes.
            </p>
          </section>

          <section>
            <h2 className="mb-4">10. Limitation of Liability</h2>
            <p className="leading-relaxed">
              To the fullest extent permitted by law, TEALHOUSE shall not be liable for any indirect, incidental, special, 
              consequential, or punitive damages, or any loss of profits or revenues. Our total liability shall not exceed 
              the amount paid for the product giving rise to the claim.
            </p>
          </section>

          <section>
            <h2 className="mb-4">11. Indemnification</h2>
            <p className="leading-relaxed">
              You agree to indemnify and hold TEALHOUSE harmless from any claims, damages, losses, liabilities, and expenses 
              arising from your use of the website or violation of these Terms.
            </p>
          </section>

          <section>
            <h2 className="mb-4">12. Governing Law</h2>
            <p className="leading-relaxed">
              These Terms are governed by the laws of the State of Missouri, United States, without regard to conflict of law provisions. 
              Any disputes shall be resolved in the courts of Jackson County, Missouri.
            </p>
          </section>

          <section>
            <h2 className="mb-4">13. Dispute Resolution</h2>
            <p className="leading-relaxed">
              Most concerns can be resolved quickly by contacting our customer service team. If a dispute cannot be resolved informally, 
              you agree to attempt mediation before pursuing litigation. Any arbitration shall be conducted in accordance with the 
              rules of the American Arbitration Association.
            </p>
          </section>

          <section>
            <h2 className="mb-4">14. Changes to Terms</h2>
            <p className="leading-relaxed">
              We reserve the right to update these Terms at any time. Changes will be posted on this page with an updated "Last updated" 
              date. Your continued use of the website after changes constitutes acceptance of the new Terms.
            </p>
          </section>

          <section>
            <h2 className="mb-4">15. Severability</h2>
            <p className="leading-relaxed">
              If any provision of these Terms is found to be invalid or unenforceable, the remaining provisions shall remain in full 
              force and effect.
            </p>
          </section>

          <section>
            <h2 className="mb-4">16. Contact Information</h2>
            <p className="leading-relaxed mb-3">
              For questions about these Terms, please contact us:
            </p>
            <div className="space-y-1">
              <p>Email: {CONTACT.legal}</p>
              {CONTACT.phone && <p>Phone: {CONTACT.phone}</p>}
              {CONTACT.mailingAddress && <p>Mail: TEALHOUSE Legal Department, {CONTACT.mailingAddress}</p>}
            </div>
          </section>

          <section className="bg-gray-50 p-6 border border-gray-200">
            <h2 className="mb-3">Acceptance of Terms</h2>
            <p className="leading-relaxed">
              By using our website or making a purchase, you acknowledge that you have read, understood, and agree to be bound by 
              these Terms of Service and our Privacy Policy.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}