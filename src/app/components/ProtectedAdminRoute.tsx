import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

interface ProtectedAdminRouteProps {
  children: React.ReactNode;
}

/**
 * Client-side admin gate.
 *
 * IMPORTANT: this is a convenience redirect, not a security boundary. Anyone
 * can bypass it by calling the Supabase API directly with the anon key, which
 * ships in the bundle by design. The real enforcement lives in row level
 * security via the public.is_admin() function. This component only decides
 * what to render; the database decides what data anyone can reach.
 *
 * The admin identity used to be a hardcoded email constant here, which
 * disagreed with the accounts documented elsewhere in the repo. It now asks
 * the database, so there is exactly one source of truth: the admin_users table.
 */
export function ProtectedAdminRoute({ children }: ProtectedAdminRouteProps) {
  const navigate = useNavigate();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const checkAuth = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.user) {
        if (active) navigate('/company-login', { replace: true });
        return;
      }

      // Ask the database, not a hardcoded list.
      const { data, error } = await supabase.rpc('is_admin');

      if (!active) return;

      if (error || data !== true) {
        navigate('/company-login', { replace: true });
        return;
      }

      setIsAuthorized(true);
      setIsLoading(false);
    };

    checkAuth();

    return () => {
      active = false;
    };
  }, [navigate]);

  if (isLoading || !isAuthorized) {
    return null;
  }

  return <>{children}</>;
}
