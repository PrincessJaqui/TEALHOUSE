import { useState } from 'react';
import { toast } from 'sonner';
import { CONTACT, SHOWROOMS } from '../config/contact';
import { supabase } from '../lib/supabase';

export function ContactUs() {
  // This form had no submit handler at all. Every message a customer typed
  // was discarded when they pressed Send.
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim() || !message.trim()) {
      toast.error('Please add your email and a message');
      return;
    }

    setSending(true);
    try {
      const { error } = await supabase.from('contact_messages').insert({
        name: [firstName, lastName].filter(Boolean).join(' ') || null,
        email: email.trim(),
        subject: subject || null,
        message: message.trim(),
      });

      if (error) {
        console.error('Error sending message:', error);
        toast.error('Could not send your message. Please try again.');
        return;
      }

      toast.success('Message sent. We will get back to you shortly.');
      setFirstName('');
      setLastName('');
      setEmail('');
      setSubject('');
      setMessage('');
    } finally {
      setSending(false);
    }
  };

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
                  <p>Email: {CONTACT.clientServices}</p>
                  {CONTACT.phone && <p>Phone: {CONTACT.phone}</p>}
                  <p>Monday - Friday, 9 AM - 6 PM EST</p>
                </div>
              </div>

              <div>
                <h3 className="mb-3">Press & Media</h3>
                <div className="space-y-2 text-gray-700">
                  <p>Email: {CONTACT.press}</p>
                  <p>For press kits and media inquiries</p>
                </div>
              </div>

              <div>
                <h3 className="mb-3">Wholesale & Partnerships</h3>
                <div className="space-y-2 text-gray-700">
                  <p>Email: {CONTACT.wholesale}</p>
                  <p>For retail and collaboration opportunities</p>
                </div>
              </div>

              <div>
                <h3 className="mb-3">Careers</h3>
                <div className="space-y-2 text-gray-700">
                  <p>Email: {CONTACT.careers}</p>
                  <p>Join our team</p>
                </div>
              </div>
            </div>
          </section>

          <section className="pt-8 border-t border-gray-200">
            <h2 className="mb-4">Send Us a Message</h2>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="block text-sm mb-2">First Name *</label>
                  <input
                    type="text"
                    id="firstName"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                    className="w-full px-4 py-2 border border-gray-300 focus:border-black focus:outline-none"
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm mb-2">Last Name *</label>
                  <input
                    type="text"
                    id="lastName"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
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
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-2 border border-gray-300 focus:border-black focus:outline-none"
                />
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm mb-2">Subject *</label>
                <select
                  id="subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
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
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                  rows={6}
                  className="w-full px-4 py-2 border border-gray-300 focus:border-black focus:outline-none resize-none"
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={sending}
                className="w-full bg-black text-white py-3 hover:bg-gray-800 transition-colors uppercase tracking-wider text-sm disabled:opacity-50"
              >
                {sending ? 'Sending' : 'Send Message'}
              </button>
            </form>
          </section>

          {SHOWROOMS.length > 0 && (
            <section className="pt-8 border-t border-gray-200">
              <h2 className="mb-4">Our Showrooms</h2>
              <div className="grid md:grid-cols-3 gap-8">
                {SHOWROOMS.map((showroom) => (
                  <div key={showroom.city}>
                    <h3 className="mb-3">{showroom.city}</h3>
                    <p className="text-gray-700 text-sm leading-relaxed">
                      {showroom.lines.map((line, i) => (
                        <span key={i}>
                          {line}
                          <br />
                        </span>
                      ))}
                      {showroom.phone}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}