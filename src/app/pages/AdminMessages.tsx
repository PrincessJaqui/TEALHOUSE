import { useState, useEffect } from 'react';
import { AdminLayout, StatTile } from '../components/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Alert, AlertDescription } from '../components/ui/alert';
import { toast } from 'sonner';
import { supabase } from '../lib/supabase';
import { exportCsv } from '../lib/csv';
import { Mail, Search, XCircle, CheckCircle, Inbox, Users, Download } from 'lucide-react';

interface ContactMessage {
  id: string;
  name: string | null;
  email: string;
  subject: string | null;
  message: string;
  handled: boolean;
  created_at: string;
}

interface Subscriber {
  id: string;
  email: string;
  source: string | null;
  unsubscribed: boolean;
  created_at: string;
}

/**
 * Everything the two public forms capture.
 *
 * Before this existed, the Contact Us form had no submit handler and threw
 * every message away, and the newsletter signup thanked the customer and
 * saved nothing. Both now write to real tables, and this is where they land.
 */
export function AdminMessages() {
  const [tab, setTab] = useState<'messages' | 'subscribers'>('messages');
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [dbError, setDbError] = useState<string | null>(null);

  useEffect(() => {
    loadAll();
  }, []);

  const loadAll = async () => {
    try {
      setLoading(true);
      setDbError(null);

      const [messageResult, subscriberResult] = await Promise.all([
        supabase
          .from('contact_messages')
          .select('*')
          .order('created_at', { ascending: false }),
        supabase
          .from('newsletter_subscribers')
          .select('*')
          .order('created_at', { ascending: false }),
      ]);

      if (messageResult.error) throw messageResult.error;
      if (subscriberResult.error) throw subscriberResult.error;

      setMessages((messageResult.data as ContactMessage[]) ?? []);
      setSubscribers((subscriberResult.data as Subscriber[]) ?? []);
    } catch (error: any) {
      console.error('Error loading messages:', error);
      setDbError(error.message || 'Failed to load messages');
      toast.error('Failed to load messages');
    } finally {
      setLoading(false);
    }
  };

  const setHandled = async (id: string, handled: boolean) => {
    try {
      const { error } = await supabase
        .from('contact_messages')
        .update({ handled })
        .eq('id', id);

      if (error) throw error;

      setMessages((current) =>
        current.map((m) => (m.id === id ? { ...m, handled } : m))
      );
    } catch (error: any) {
      console.error('Error updating message:', error);
      toast.error('Could not update the message');
    }
  };

  const exportSubscribers = () => {
    exportCsv('newsletter-subscribers', subscribers, [
      { header: 'Email', value: (s) => s.email },
      { header: 'Source', value: (s) => s.source ?? '' },
      { header: 'Status', value: (s) => (s.unsubscribed ? 'Unsubscribed' : 'Active') },
      { header: 'Signed up', value: (s) => new Date(s.created_at).toISOString() },
    ]);
    toast.success('Subscribers exported');
  };

  const exportMessages = () => {
    exportCsv('contact-messages', messages, [
      { header: 'Date', value: (m) => new Date(m.created_at).toISOString() },
      { header: 'Name', value: (m) => m.name ?? '' },
      { header: 'Email', value: (m) => m.email },
      { header: 'Subject', value: (m) => m.subject ?? '' },
      { header: 'Message', value: (m) => m.message },
      { header: 'Handled', value: (m) => (m.handled ? 'Yes' : 'No') },
    ]);
    toast.success('Messages exported');
  };

  const query = searchQuery.toLowerCase();

  const filteredMessages = messages.filter(
    (m) =>
      (m.email ?? '').toLowerCase().includes(query) ||
      (m.name ?? '').toLowerCase().includes(query) ||
      (m.subject ?? '').toLowerCase().includes(query) ||
      (m.message ?? '').toLowerCase().includes(query)
  );

  const filteredSubscribers = subscribers.filter((s) =>
    (s.email ?? '').toLowerCase().includes(query)
  );

  const unhandledCount = messages.filter((m) => !m.handled).length;
  const activeSubscribers = subscribers.filter((s) => !s.unsubscribed).length;

  return (
    <AdminLayout
      title="Messages"
      description="Enquiries from Contact Us and newsletter signups"
      actions={
        <Button
          variant="outline"
          onClick={tab === 'messages' ? exportMessages : exportSubscribers}
          disabled={tab === 'messages' ? messages.length === 0 : subscribers.length === 0}
        >
          <Download className="w-4 h-4 mr-2" />
          Export CSV
        </Button>
      }
    >
      {dbError && (
        <div className="border border-red-200 bg-red-50 px-4 py-3 mb-8 text-sm text-red-800">
          {dbError}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatTile label="Unread" value={unhandledCount} />
        <StatTile label="Total messages" value={messages.length} />
        <StatTile label="Subscribers" value={activeSubscribers} />
      </div>

      <div className="bg-white border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200 flex flex-wrap items-center justify-between gap-4">
          <div className="flex gap-1">
            <button
              onClick={() => setTab('messages')}
              className={`px-3 py-1.5 text-xs uppercase tracking-wider transition-colors ${
 tab === 'messages'
                  ? 'bg-[#008080] text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Enquiries
            </button>
            <button
              onClick={() => setTab('subscribers')}
              className={`px-3 py-1.5 text-xs uppercase tracking-wider transition-colors ${
 tab === 'subscribers'
                  ? 'bg-[#008080] text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Newsletter
            </button>
          </div>

          <div className="relative w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {loading ? (
          <div className="px-6 py-16 text-center text-sm text-gray-600">Loading</div>
        ) : tab === 'messages' ? (
          filteredMessages.length === 0 ? (
            <div className="px-6 py-16 text-center">
              <Inbox className="w-10 h-10 mx-auto mb-3 text-gray-300" />
              <p className="text-sm text-gray-600">No messages yet</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {filteredMessages.map((m) => (
                <div key={m.id} className={`px-6 py-5 ${m.handled ? 'bg-gray-50' : ''}`}>
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div>
                      <p className="text-sm">{m.name || 'No name given'}</p>
                      <a
                        href={`mailto:${m.email}`}
                        className="text-xs text-gray-500 hover:text-[#008080]"
                      >
                        {m.email}
                      </a>
                      {m.subject && (
                        <p className="text-xs uppercase tracking-wider text-gray-500 mt-1">
                          {m.subject}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <span className="text-xs text-gray-500">
                        {new Date(m.created_at).toLocaleDateString()}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setHandled(m.id, !m.handled)}
                      >
                        {m.handled ? 'Mark unread' : 'Mark handled'}
                      </Button>
                    </div>
                  </div>
                  <p className="text-sm text-gray-700 whitespace-pre-wrap">{m.message}</p>
                </div>
              ))}
            </div>
          )
        ) : filteredSubscribers.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <Users className="w-10 h-10 mx-auto mb-3 text-gray-300" />
            <p className="text-sm text-gray-600">No subscribers yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left px-6 py-3 text-xs uppercase tracking-wider text-gray-500">
                    Email
                  </th>
                  <th className="text-left px-6 py-3 text-xs uppercase tracking-wider text-gray-500">
                    Source
                  </th>
                  <th className="text-left px-6 py-3 text-xs uppercase tracking-wider text-gray-500">
                    Signed up
                  </th>
                  <th className="text-left px-6 py-3 text-xs uppercase tracking-wider text-gray-500">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredSubscribers.map((s) => (
                  <tr key={s.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm">{s.email}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{s.source || 'unknown'}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(s.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-xs uppercase tracking-wider text-gray-600">
                      {s.unsubscribed ? 'Unsubscribed' : 'Active'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
