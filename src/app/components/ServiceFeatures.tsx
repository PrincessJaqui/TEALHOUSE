import { ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { supabase } from '../lib/supabase';

export function ServiceFeatures() {
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
        .insert({ email: email.trim(), source: 'service-features' });

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

  const features = [
    {
      title: 'Schedule Appointment - Zoom',
      description: 'Discover the possibilities of a personalized consultation'
    },
    {
      title: 'TEALHOUSE Packaging Sustainability',
      description: "An example and emblem of the House's commitment to the environment"
    }
  ];

  return (
    <section className="bg-white py-12 border-t border-gray-200">
      <div className="max-w-[1200px] mx-auto px-5">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="group cursor-pointer flex items-start justify-between gap-4 hover:opacity-70 transition-opacity"
            >
              <div className="flex-1">
                <h4 className="uppercase tracking-wider mb-2">{feature.title}</h4>
                <p className="text-sm text-[#666666] leading-relaxed">{feature.description}</p>
              </div>
              <ChevronRight className="w-5 h-5 text-[#99A1AF] mt-1 flex-shrink-0" />
            </div>
          ))}
          
          {/* Newsletter Subscription */}
          <div className="flex flex-col justify-center">
            <h4 className="uppercase tracking-wider mb-4">Subscribe for a more luxurious inbox</h4>
            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="* E-mail"
                className="px-4 py-3 border border-black text-sm focus:outline-none focus:ring-2 focus:ring-black"
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
      </div>
    </section>
  );
}