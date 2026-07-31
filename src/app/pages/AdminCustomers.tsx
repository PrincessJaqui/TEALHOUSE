import { useState, useEffect } from 'react';
import { AdminLayout, StatTile } from '../components/AdminLayout';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { toast } from 'sonner';
import { supabase } from '../lib/supabase';
import { exportCsv } from '../lib/csv';
import { Search, Download, Ban, RotateCcw, Users } from 'lucide-react';

interface Customer {
  id: string;
  email: string | null;
  full_name: string | null;
  phone: string | null;
  is_anonymous: boolean;
  banned: boolean;
  created_at: string;
  last_sign_in_at: string | null;
}

export function AdminCustomers() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'registered' | 'guest' | 'banned'>('all');
  const [dbError, setDbError] = useState<string | null>(null);

  useEffect(() => {
    loadCustomers();
  }, []);

  /**
   * Reads the customers table directly. This used to call a Supabase edge
   * function that was never deployed, so the page failed on load.
   */
  const loadCustomers = async () => {
    try {
      setLoading(true);
      setDbError(null);

      const { data, error } = await supabase
        .from('customers')
        .select('id, email, full_name, phone, is_anonymous, banned, created_at, last_sign_in_at')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCustomers((data as Customer[]) ?? []);
    } catch (error: any) {
      console.error('Error loading customers:', error);
      setDbError(error.message || 'Failed to load customers');
      toast.error('Failed to load customers');
    } finally {
      setLoading(false);
    }
  };

  const setBanned = async (customer: Customer, banned: boolean) => {
    if (banned && !confirm(`Ban ${customer.email || 'this guest'}?`)) return;

    try {
      const { error } = await supabase
        .from('customers')
        .update({ banned })
        .eq('id', customer.id);

      if (error) throw error;

      setCustomers((current) =>
        current.map((c) => (c.id === customer.id ? { ...c, banned } : c))
      );
      toast.success(banned ? 'Customer banned' : 'Customer unbanned');
    } catch (error: any) {
      console.error('Error updating customer:', error);
      toast.error('Could not update customer');
    }
  };

  const exportCustomers = () => {
    exportCsv('customers', filtered, [
      { header: 'Name', value: (c) => c.full_name ?? '' },
      { header: 'Email', value: (c) => c.email ?? '' },
      { header: 'Phone', value: (c) => c.phone ?? '' },
      { header: 'Type', value: (c) => (c.is_anonymous ? 'Guest' : 'Registered') },
      { header: 'Status', value: (c) => (c.banned ? 'Banned' : 'Active') },
      { header: 'Joined', value: (c) => new Date(c.created_at).toISOString() },
      {
        header: 'Last seen',
        value: (c) => (c.last_sign_in_at ? new Date(c.last_sign_in_at).toISOString() : ''),
      },
    ]);
    toast.success('Customers exported');
  };

  const query = searchQuery.toLowerCase();
  const filtered = customers
    .filter((c) => {
      if (filter === 'registered') return !c.is_anonymous;
      if (filter === 'guest') return c.is_anonymous;
      if (filter === 'banned') return c.banned;
      return true;
    })
    .filter(
      (c) =>
        !query ||
        (c.email ?? '').toLowerCase().includes(query) ||
        (c.full_name ?? '').toLowerCase().includes(query)
    );

  const registered = customers.filter((c) => !c.is_anonymous).length;
  const guests = customers.filter((c) => c.is_anonymous).length;
  const banned = customers.filter((c) => c.banned).length;

  const FILTERS: Array<{ key: typeof filter; label: string }> = [
    { key: 'all', label: 'All' },
    { key: 'registered', label: 'Registered' },
    { key: 'guest', label: 'Guests' },
    { key: 'banned', label: 'Banned' },
  ];

  return (
    <AdminLayout
      title="Customers"
      description="Everyone who has created an account or checked out as a guest"
      actions={
        <Button variant="outline" onClick={exportCustomers} disabled={filtered.length === 0}>
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

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <StatTile label="Total" value={customers.length} />
        <StatTile label="Registered" value={registered} />
        <StatTile label="Guests" value={guests} />
        <StatTile label="Banned" value={banned} />
      </div>

      <div className="bg-white border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200 flex flex-wrap items-center justify-between gap-4">
          <div className="flex gap-1">
            {FILTERS.map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setFilter(key)}
                className={`px-3 py-1.5 text-xs uppercase tracking-wider transition-colors ${
                  filter === key
                    ? 'bg-[#008080] text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="relative w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search name or email"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {loading ? (
          <div className="px-6 py-16 text-center text-sm text-gray-600">Loading</div>
        ) : filtered.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <Users className="w-10 h-10 mx-auto mb-3 text-gray-300" />
            <p className="text-sm text-gray-600">
              {customers.length === 0 ? 'No customers yet' : 'Nothing matches that'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left px-6 py-3 text-xs uppercase tracking-wider text-gray-500">
                    Customer
                  </th>
                  <th className="text-left px-6 py-3 text-xs uppercase tracking-wider text-gray-500">
                    Type
                  </th>
                  <th className="text-left px-6 py-3 text-xs uppercase tracking-wider text-gray-500">
                    Joined
                  </th>
                  <th className="text-left px-6 py-3 text-xs uppercase tracking-wider text-gray-500">
                    Last seen
                  </th>
                  <th className="text-right px-6 py-3 text-xs uppercase tracking-wider text-gray-500">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((customer) => (
                  <tr
                    key={customer.id}
                    className="border-b border-gray-100 last:border-0 hover:bg-gray-50"
                  >
                    <td className="px-6 py-4">
                      <p className="text-sm">
                        {customer.full_name ||
                          (customer.is_anonymous ? 'Guest' : 'No name given')}
                      </p>
                      {customer.email && (
                        <a
                          href={`mailto:${customer.email}`}
                          className="text-xs text-gray-500 hover:text-[#008080]"
                        >
                          {customer.email}
                        </a>
                      )}
                      {customer.banned && (
                        <span className="block text-xs uppercase tracking-wider text-red-600 mt-1">
                          Banned
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {customer.is_anonymous ? 'Guest' : 'Registered'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(customer.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {customer.last_sign_in_at
                        ? new Date(customer.last_sign_in_at).toLocaleDateString()
                        : 'Never'}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setBanned(customer, !customer.banned)}
                      >
                        {customer.banned ? (
                          <>
                            <RotateCcw className="w-4 h-4 mr-1" />
                            Unban
                          </>
                        ) : (
                          <>
                            <Ban className="w-4 h-4 mr-1" />
                            Ban
                          </>
                        )}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <p className="text-xs text-gray-500 mt-4">
        Deleting an account permanently requires the Supabase dashboard, under
        Authentication, Users. Banning is the safe equivalent and is reversible.
      </p>
    </AdminLayout>
  );
}
