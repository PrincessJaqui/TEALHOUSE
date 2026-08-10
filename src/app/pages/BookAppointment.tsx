import { useState } from 'react';
import { toast } from 'sonner';
import { supabase } from '../lib/supabase';
import { Seo } from '../components/Seo';
import { CONTACT } from '../config/contact';

/**
 * Appointment request.
 *
 * The Zoom option on the landing page used to be a div that did nothing.
 * This is where it goes until a scheduling page exists: the request lands in
 * Messages beside the enquiries, and Jaqui replies with a link.
 *
 * Set CONTACT.appointmentUrl to a Calendly or Cal.com page and the landing
 * page skips this entirely, going straight there.
 */

const TIMES = [
  'Morning, before noon',
  'Afternoon',
  'Evening, after 5',
  'I am flexible',
];

export function BookAppointment() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [preferred, setPreferred] = useState('');
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);
  const [sent, setSent] = useState(false);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!name.trim() || !email.trim()) {
      toast.error('Please give your name and email');
      return;
    }

    setSaving(true);

    try {
      // Stored as a message so it appears where every other enquiry does,
      // rather than in a separate place she has to remember to check.
      const { error } = await supabase.from('contact_messages').insert({
        name: name.trim(),
        email: email.trim(),
        subject: 'Appointment request',
        message: [
          `Preferred time: ${preferred || 'not stated'}`,
          '',
          notes.trim() || 'No further detail given.',
        ].join('\n'),
      });

      if (error) throw error;
      setSent(true);
    } catch (error) {
      console.error('Appointment request failed:', error);
      toast.error('Could not send that. Please email us instead.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Seo
        title="Schedule an Appointment"
        description="Arrange a personal consultation with TEALHOUSE over Zoom."
        path="/book-appointment"
      />

      <div className="max-w-[640px] mx-auto px-5 py-16">
        <h1 className="text-center mb-3 uppercase tracking-wider">
          Schedule an Appointment
        </h1>
        <p className="text-center text-sm text-gray-600 mb-12">
          A personal consultation over Zoom, at a time that suits you.
        </p>

        {sent ? (
          <div className="border border-[#008080] p-8 text-center">
            <p className="mb-3">Thank you.</p>
            <p className="text-sm text-gray-700 leading-relaxed">
              We have your request and will write to you at {email} with a time
              and a link. If anything changes in the meantime, reply to that
              message and we will rearrange.
            </p>
          </div>
        ) : (
          <form onSubmit={submit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm mb-2">
                Your name
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:border-black transition-colors"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:border-black transition-colors"
              />
            </div>

            <div>
              <label htmlFor="preferred" className="block text-sm mb-2">
                When suits you
              </label>
              <select
                id="preferred"
                value={preferred}
                onChange={(e) => setPreferred(e.target.value)}
                className="w-full border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:border-black transition-colors"
              >
                <option value="">Select a time</option>
                {TIMES.map((time) => (
                  <option key={time} value={time}>
                    {time}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="notes" className="block text-sm mb-2">
                What would you like to discuss
              </label>
              <textarea
                id="notes"
                rows={4}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="A bespoke commission, sizing, or something else entirely."
                className="w-full border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:border-black transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-full bg-black text-white py-4 text-sm uppercase tracking-wider hover:bg-gray-900 transition-colors disabled:opacity-50"
            >
              {saving ? 'Sending' : 'Request an appointment'}
            </button>

            <p className="text-xs text-gray-500 text-center">
              Prefer to write? {CONTACT.appointments}
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
