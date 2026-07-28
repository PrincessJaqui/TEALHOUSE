import { useState } from 'react';
import { toast } from 'sonner';

export function Newsletter() {
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      toast.success('Thank you for subscribing!');
      setEmail('');
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