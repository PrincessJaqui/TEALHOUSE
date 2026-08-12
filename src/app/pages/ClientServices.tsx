import { CONTACT } from '../config/contact';
import { CARE } from '../config/store';

export function ClientServices() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-[900px] mx-auto px-5 py-16">
        <h1 className="text-center mb-12 uppercase tracking-wider">Client Services</h1>
        
        <div className="space-y-8">
          <section>
            <h2 className="mb-4">Dedicated to Your Satisfaction</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              At TEALHOUSE, we are committed to providing exceptional service throughout your entire experience with us. 
              Our client services team is here to assist you with any questions, concerns, or special requests.
            </p>
          </section>

          <section>
            <h2 className="mb-4">Contact Our Team</h2>
            <div className="space-y-3 text-gray-700">
              <p><strong>Email:</strong> {CONTACT.clientServices}</p>
              {CONTACT.phone && <p><strong>Phone:</strong> {CONTACT.phone}</p>}
              <p><strong>Hours:</strong> Monday - Friday, 9:00 AM - 6:00 PM EST</p>
              <p><strong>Response Time:</strong> Within 24 hours</p>
            </div>
          </section>

          <section>
            <h2 className="mb-4">Personal Shopping Service</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Our personal shoppers are available to help you find the perfect pair, whether you're seeking a specific style, 
              color, or fit. Schedule a complimentary virtual or in-person consultation.
            </p>
            <p className="text-gray-700 leading-relaxed">
              <strong>Book a consultation:</strong> {CONTACT.shopping}
            </p>
          </section>

          <section>
            <h2 className="mb-4">Custom Orders</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              For special occasions or unique preferences, we offer custom order services including:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>Custom sizing and width options</li>
              <li>Exclusive color combinations</li>
              <li>Personalized details and monogramming</li>
              <li>Made-to-order styles</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-4">
              Custom orders typically require 6-8 weeks. Contact us for pricing and availability.
            </p>
          </section>

          <section>
            <h2 className="mb-4">Repair & Care Services</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              We offer lifetime repair services for all TEALHOUSE shoes:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>Free sole replacement (materials cost only)</li>
              <li>Complimentary cleaning and conditioning</li>
              <li>Heel and strap repairs</li>
              <li>Professional restoration services</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-4 mb-6">
              <strong>Repair inquiries:</strong> {CONTACT.care}
            </p>

            <h3 className="mb-3">Swimwear Care</h3>
            <p className="text-gray-700 leading-relaxed">{CARE.swimwear}</p>
          </section>

          <section>
            <h2 className="mb-4">VIP Program</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Join our VIP program for exclusive benefits:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>Early access to new collections</li>
              <li>Invitations to private events</li>
              <li>Complimentary express shipping</li>
              <li>Priority customer service</li>
              <li>Special birthday gift</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-4">International Support</h2>
            <p className="text-gray-700 leading-relaxed">
              We ship worldwide and offer multilingual support. Our team can assist you in English, Italian, French, Spanish, 
              German, and Mandarin.
            </p>
          </section>

          <section>
            <h2 className="mb-4">Showroom Appointments</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Contact us to arrange a personalized shopping experience. 
              Private appointments available by request.
            </p>
            <p className="text-gray-700 leading-relaxed">
              <strong>Schedule a visit:</strong> {CONTACT.appointments}
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
