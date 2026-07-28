import { useState, useEffect } from 'react';
import { AdminNav } from '../components/AdminNav';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Alert, AlertDescription } from '../components/ui/alert';
import { toast } from 'sonner';
import { supabase } from '../lib/supabase';
import { Mail, Search, XCircle, CheckCircle, Inbox, Users } from 'lucide-react';

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
    <>
      <AdminNav />
      <div className="container mx-auto px-4 py-12 max-w-7xl">
        <div className="mb-8">
          <h1 className="mb-2">Messages</h1>
          <p className="text-neutral-600">Enquiries from Contact Us and newsletter signups</p>
        </div>

        {dbError && (
          <Alert className="mb-8 bg-red-50 border-red-200">
            <XCircle className="h-4 w-4 text-red-800" />
            <AlertDescription className="text-red-800">
              <strong>Error:</strong> {dbError}
            </AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-neutral-600 mb-1">Unread Messages</p>
                  <p className="text-3xl">{unhandledCount}</p>
                </div>
                <Inbox className="w-8 h-8 text-neutral-400" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-neutral-600 mb-1">Total Messages</p>
                  <p className="text-3xl">{messages.length}</p>
                </div>
                <Mail className="w-8 h-8 text-neutral-400" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-neutral-600 mb-1">Subscribers</p>
                  <p className="text-3xl">{activeSubscribers}</p>
                </div>
                <Users className="w-8 h-8 text-neutral-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <div className="flex gap-6 mb-2">
                  <button
                    onClick={() => setTab('messages')}
                    className={`pb-1 text-sm transition-colors ${
                      tab === 'messages'
                        ? 'border-b-2 border-black text-black'
                        : 'text-neutral-500 hover:text-black'
                    }`}
                  >
                    Enquiries
                  </button>
                  <button
                    onClick={() => setTab('subscribers')}
                    className={`pb-1 text-sm transition-colors ${
                      tab === 'subscribers'
                        ? 'border-b-2 border-black text-black'
                        : 'text-neutral-500 hover:text-black'
                    }`}
                  >
                    Newsletter
                  </button>
                </div>
                <CardTitle>{tab === 'messages' ? 'Customer Enquiries' : 'Newsletter Subscribers'}</CardTitle>
                <CardDescription>
                  {tab === 'messages'
                    ? 'Messages sent through the Contact Us form'
                    : 'Addresses captured from the signup forms'}
                </CardDescription>
              </div>
              <div className="relative w-80">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-400" />
                <Input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </CardHeader>

          <CardContent>
            {loading ? (
              <div className="text-center py-12 text-neutral-500">Loading...</div>
            ) : tab === 'messages' ? (
              filteredMessages.length === 0 ? (
                <div className="text-center py-12 text-neutral-500">
                  <Inbox className="w-16 h-16 mx-auto mb-4 text-neutral-300" />
                  <p>No messages yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredMessages.map((m) => (
                    <div
                      key={m.id}
                      className={`border rounded-lg p-4 ${
                        m.handled ? 'bg-neutral-50 border-neutral-200' : 'bg-white border-neutral-300'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <div>
                          <p className="font-medium">{m.name || 'No name given'}</p>
                          <a
                            href={`mailto:${m.email}`}
                            className="text-sm text-neutral-600 hover:text-black"
                          >
                            {m.email}
                          </a>
                          {m.subject && (
                            <p className="text-xs text-neutral-500 mt-1 capitalize">{m.subject}</p>
                          )}
                        </div>
                        <div className="flex items-center gap-3 shrink-0">
                          <span className="text-xs text-neutral-500">
                            {new Date(m.created_at).toLocaleDateString()}
                          </span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setHandled(m.id, !m.handled)}
                          >
                            {m.handled ? 'Mark unread' : (
                              <>
                                <CheckCircle className="w-4 h-4 mr-1" />
                                Mark handled
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                      <p className="text-sm text-neutral-700 whitespace-pre-wrap">{m.message}</p>
                    </div>
                  ))}
                </div>
              )
            ) : filteredSubscribers.length === 0 ? (
              <div className="text-center py-12 text-neutral-500">
                <Users className="w-16 h-16 mx-auto mb-4 text-neutral-300" />
                <p>No subscribers yet</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 text-sm">Email</th>
                      <th className="text-left py-3 px-4 text-sm">Source</th>
                      <th className="text-left py-3 px-4 text-sm">Signed up</th>
                      <th className="text-left py-3 px-4 text-sm">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredSubscribers.map((s) => (
                      <tr key={s.id} className="border-b hover:bg-neutral-50">
                        <td className="py-4 px-4 text-sm">{s.email}</td>
                        <td className="py-4 px-4 text-sm text-neutral-600">{s.source || 'unknown'}</td>
                        <td className="py-4 px-4 text-sm text-neutral-600">
                          {new Date(s.created_at).toLocaleDateString()}
                        </td>
                        <td className="py-4 px-4">
                          {s.unsubscribed ? (
                            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-neutral-100 text-neutral-600">
                              Unsubscribed
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-green-50 text-green-700">
                              <CheckCircle className="w-3 h-3" />
                              Active
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
