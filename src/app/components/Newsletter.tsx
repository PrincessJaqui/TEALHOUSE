import { useState } from 'react';
import { toast } from 'sonner';
import { supabase } from '../lib/supabase';

export function Newsletter() {
  const [email, setEmail] = useState('');

  const [saving, setSaving] = useState(false);

  // This used to thank the customer and save the address nowhere at all.
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setSaving(true);
    try {
      const { error } = await supabase
        .from('newsletter_subscribers')
        .insert({ email: email.trim(), source: 'newsletter' });

      // A duplicate is not a failure from the customer's point of view.
      if (error && error.code !== '23505') {
        console.error('Newsletter signup error:', error);
        toast.error('Could not sign you up. Please try again.');
        return;
      }

      toast.success('Thank you for subscribing');
      setEmail('');
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="bg-white py-16 border-t border-gray-200">
      <div className="max-w-[1200px] mx-auto px-5">
        {/* TEALHOUSE Logo */}
        <div className="text-center mb-8">
          <h3 className="tracking-[0.4em] text-sm">TEALHOUSE</h3>
        </div>

        {/* Newsletter Form */}
        <div className="max-w-md mx-auto text-center mb-12">
          <h3 className="uppercase tracking-wider mb-6">Subscribe for a more luxurious inbox</h3>
          <form onSubmit={handleSubmit} className="flex gap-3">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="* E-mail"
              className="flex-1 px-4 py-3 border border-black text-sm focus:outline-none focus:ring-2 focus:ring-black"
              required
            />
            <button
              type="submit"
              className="bg-[#2c2c2c] text-white px-8 py-3 uppercase text-sm tracking-wider hover:bg-black transition-colors"
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}