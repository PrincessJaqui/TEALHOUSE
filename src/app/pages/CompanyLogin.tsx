import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '../lib/supabase';

/**
 * Admin sign in.
 *
 * This file used to be 478 lines and contained an entire second admin
 * interface: a sidebar, a dashboard, and inline copies of the products and
 * customers pages rendered inside the login page. That is why there were two
 * different-looking admin areas, why one of them had no Messages section, and
 * why opening a page through it showed two navigations at once.
 *
 * It now does one thing. The admin area lives at /admin/* behind
 * ProtectedAdminRoute and shares a single layout.
 */
export function CompanyLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Already signed in as an admin, skip the form.
  useEffect(() => {
    let active = true;
    (async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session?.user || !active) return;

      const { data: isAdmin } = await supabase.rpc('is_admin');
      if (active && isAdmin === true) navigate('/admin/dashboard', { replace: true });
    })();
    return () => {
      active = false;
    };
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim() || !password) {
      toast.error('Enter your email and password');
      return;
    }

    setIsLoggingIn(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        toast.error(error.message);
        return;
      }

      if (!data.user) {
        toast.error('Could not sign you in');
        return;
      }

      // Signing in is not the same as being an admin. The database decides,
      // via the admin_users table.
      const { data: isAdmin, error: adminError } = await supabase.rpc('is_admin');

      if (adminError || isAdmin !== true) {
        await supabase.auth.signOut();
        toast.error('That account does not have admin access');
        return;
      }

      toast.success('Signed in');
      navigate('/admin/dashboard');
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-[440px] mx-auto px-5 py-20">
        <div className="text-center mb-10">
          <h1 className="font-['Tinos'] text-3xl mb-2">TEALHOUSE</h1>
          <p className="text-sm text-gray-600 uppercase tracking-wider">Admin Access</p>
        </div>

        <form onSubmit={handleLogin} className="bg-white border border-gray-200 p-8">
          <div className="mb-5">
            <label htmlFor="admin-email" className="block text-sm mb-2">
              Email
            </label>
            <input
              id="admin-email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoggingIn}
              className="w-full border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:border-[#008080] transition-colors"
              required
            />
          </div>

          <div className="mb-6">
            <label htmlFor="admin-password" className="block text-sm mb-2">
              Password
            </label>
            <div className="relative">
              <input
                id="admin-password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoggingIn}
                className="w-full border border-gray-300 px-4 py-3 pr-11 text-sm focus:outline-none focus:border-[#008080] transition-colors"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-black transition-colors"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoggingIn}
            className="w-full bg-black text-white py-4 text-sm uppercase tracking-wider hover:bg-gray-900 transition-colors disabled:opacity-50"
          >
            {isLoggingIn ? 'Signing in' : 'Sign in'}
          </button>
        </form>

        <button
          onClick={() => navigate('/')}
          className="w-full text-center text-sm text-gray-600 hover:text-black mt-6 transition-colors"
        >
          Back to store
        </button>
      </div>
    </div>
  );
}
