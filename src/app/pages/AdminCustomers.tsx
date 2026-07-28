import { useState, useEffect } from 'react';
import { AdminNav } from '../components/AdminNav';
import { SupabaseConnectionTest } from '../components/SupabaseConnectionTest';
import { DeploymentChecklist } from '../components/DeploymentChecklist';
import { projectId, publicAnonKey } from '../utils/supabase/info';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Alert, AlertDescription } from '../components/ui/alert';
import { toast } from 'sonner';
import { 
  Users, 
  Mail, 
  Search, 
  Ban, 
  XCircle, 
  CheckCircle, 
  Calendar, 
  UserCheck 
} from 'lucide-react';

const API_BASE_URL = `https://${projectId}.supabase.co/functions/v1/make-server-d1960f17`;

interface Customer {
  id: string;
  email: string;
  created_at: string;
  last_sign_in_at: string | null;
  is_anonymous: boolean;
  user_metadata: {
    name?: string;
    phone?: string;
  };
  banned_until: string | null;
}

interface AdminCustomersProps {
  hideNav?: boolean;
}

export function AdminCustomers({ hideNav = false }: AdminCustomersProps) {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [dbError, setDbError] = useState<string | null>(null);

  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    try {
      setLoading(true);
      setDbError(null);
      
      // Call server endpoint to get all users
      const response = await fetch(`${API_BASE_URL}/customers`, {
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch customers');
      }

      const { users } = await response.json();

      if (users) {
        const formattedCustomers: Customer[] = users.map((user: any) => ({
          id: user.id,
          email: user.email || 'Anonymous User',
          created_at: user.created_at,
          last_sign_in_at: user.last_sign_in_at,
          is_anonymous: user.is_anonymous || false,
          user_metadata: user.user_metadata || {},
          banned_until: user.banned_until
        }));
        
        setCustomers(formattedCustomers);
      }
    } catch (error: any) {
      console.error('Error loading customers:', error);
      toast.error('Failed to load customers');
      setDbError(error.message || 'Failed to load customers');
    } finally {
      setLoading(false);
    }
  };

  const handleBanUser = async (userId: string, email: string) => {
    if (!confirm(`Are you sure you want to ban ${email}?`)) {
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/customers/${userId}/ban`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to ban user');
      }

      toast.success('User banned successfully');
      loadCustomers();
    } catch (error: any) {
      console.error('Error banning user:', error);
      toast.error('Failed to ban user: ' + error.message);
    }
  };

  const handleUnbanUser = async (userId: string, email: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/customers/${userId}/unban`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to unban user');
      }

      toast.success('User unbanned successfully');
      loadCustomers();
    } catch (error: any) {
      console.error('Error unbanning user:', error);
      toast.error('Failed to unban user: ' + error.message);
    }
  };

  const handleDeleteUser = async (userId: string, email: string) => {
    if (!confirm(`Are you sure you want to permanently delete ${email}? This action cannot be undone.`)) {
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/customers/${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete user');
      }

      toast.success('User deleted successfully');
      loadCustomers();
    } catch (error: any) {
      console.error('Error deleting user:', error);
      toast.error('Failed to delete user: ' + error.message);
    }
  };

  const filteredCustomers = customers.filter(customer => {
    const query = searchQuery.toLowerCase();
    return (
      customer.email.toLowerCase().includes(query) ||
      customer.user_metadata?.name?.toLowerCase().includes(query) ||
      customer.id.toLowerCase().includes(query)
    );
  });

  const totalCustomers = customers.length;
  const registeredCustomers = customers.filter(c => !c.is_anonymous).length;
  const anonymousCustomers = customers.filter(c => c.is_anonymous).length;
  const bannedCustomers = customers.filter(c => c.banned_until).length;

  return (
    <>
      {!hideNav && <AdminNav />}
      <div className="container mx-auto px-4 py-12 max-w-7xl">
        <div className="mb-8">
          <h1 className="mb-2">Customer Management</h1>
          <p className="text-neutral-600">View and manage TEALHOUSE customers</p>
        </div>

        {/* Connection Test */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <SupabaseConnectionTest />
          <DeploymentChecklist />
        </div>

        {dbError && (
          <Alert className="mb-8 bg-red-50 border-red-200">
            <XCircle className="h-4 w-4 text-red-800" />
            <AlertDescription className="text-red-800">
              <strong>Error:</strong> {dbError}
            </AlertDescription>
          </Alert>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-neutral-600 mb-1">Total Customers</p>
                  <p className="text-3xl">{totalCustomers}</p>
                </div>
                <Users className="w-8 h-8 text-neutral-400" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-neutral-600 mb-1">Registered</p>
                  <p className="text-3xl">{registeredCustomers}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-neutral-600 mb-1">Guest Users</p>
                  <p className="text-3xl">{anonymousCustomers}</p>
                </div>
                <UserCheck className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-neutral-600 mb-1">Banned</p>
                  <p className="text-3xl">{bannedCustomers}</p>
                </div>
                <Ban className="w-8 h-8 text-red-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Customer List */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Customer List</CardTitle>
                <CardDescription>All registered and guest customers</CardDescription>
              </div>
              <div className="relative w-80">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-400" />
                <Input
                  type="text"
                  placeholder="Search customers..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-12 text-neutral-500">Loading customers...</div>
            ) : filteredCustomers.length === 0 ? (
              <div className="text-center py-12 text-neutral-500">
                <Users className="w-16 h-16 mx-auto mb-4 text-neutral-300" />
                <p>No customers found</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 text-sm">Customer</th>
                      <th className="text-left py-3 px-4 text-sm">Email</th>
                      <th className="text-left py-3 px-4 text-sm">Type</th>
                      <th className="text-left py-3 px-4 text-sm">Created</th>
                      <th className="text-left py-3 px-4 text-sm">Last Sign In</th>
                      <th className="text-left py-3 px-4 text-sm">Status</th>
                      <th className="text-right py-3 px-4 text-sm">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCustomers.map((customer) => (
                      <tr key={customer.id} className="border-b hover:bg-neutral-50">
                        <td className="py-4 px-4">
                          <div>
                            <p className="font-medium">
                              {customer.user_metadata?.name || 'N/A'}
                            </p>
                            <p className="text-xs text-neutral-500">{customer.id.substring(0, 8)}...</p>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2">
                            <Mail className="w-4 h-4 text-neutral-400" />
                            <span className="text-sm">{customer.email}</span>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs ${
                            customer.is_anonymous 
                              ? 'bg-blue-50 text-blue-700'
                              : 'bg-green-50 text-green-700'
                          }`}>
                            {customer.is_anonymous ? 'Guest' : 'Registered'}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2 text-sm text-neutral-600">
                            <Calendar className="w-4 h-4" />
                            {new Date(customer.created_at).toLocaleDateString()}
                          </div>
                        </td>
                        <td className="py-4 px-4 text-sm text-neutral-600">
                          {customer.last_sign_in_at 
                            ? new Date(customer.last_sign_in_at).toLocaleDateString()
                            : 'Never'
                          }
                        </td>
                        <td className="py-4 px-4">
                          {customer.banned_until ? (
                            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-red-50 text-red-700">
                              <Ban className="w-3 h-3" />
                              Banned
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-green-50 text-green-700">
                              <CheckCircle className="w-3 h-3" />
                              Active
                            </span>
                          )}
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center justify-end gap-2">
                            {customer.banned_until ? (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleUnbanUser(customer.id, customer.email)}
                                className="text-green-600 hover:text-green-700 hover:border-green-300"
                              >
                                <CheckCircle className="w-4 h-4 mr-1" />
                                Unban
                              </Button>
                            ) : (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleBanUser(customer.id, customer.email)}
                                className="text-orange-600 hover:text-orange-700 hover:border-orange-300"
                              >
                                <Ban className="w-4 h-4 mr-1" />
                                Ban
                              </Button>
                            )}
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteUser(customer.id, customer.email)}
                              className="text-red-600 hover:text-red-700 hover:border-red-300"
                            >
                              <XCircle className="w-4 h-4 mr-1" />
                              Delete
                            </Button>
                          </div>
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