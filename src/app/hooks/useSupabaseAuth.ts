import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Session, User } from '@supabase/supabase-js';

/**
 * Auth for the storefront.
 *
 * This hook previously exposed only signInAnonymously, which is why the
 * checkout's "Sign in" and "Create account" options did nothing: there was no
 * signUp anywhere in the codebase and no password reset. Every customer was a
 * guest, and because orders carried no user id, the account page had nothing
 * to show even after signing in.
 */

export interface AuthResult {
  ok: boolean;
  error?: string;
  needsEmailConfirmation?: boolean;
}

export function useSupabaseAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    supabase.auth.getSession().then(({ data }) => {
      if (!active) return;
      setSession(data.session);
      setUser(data.session?.user ?? null);
      setLoading(false);
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      setUser(newSession?.user ?? null);
      setLoading(false);
    });

    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  /**
   * A real, named account. The customers row is created by a database
   * trigger on auth.users, so nothing needs inserting from here.
   */
  const signUp = async (
    email: string,
    password: string,
    fullName?: string
  ): Promise<AuthResult> => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: fullName ? { full_name: fullName } : undefined,
        emailRedirectTo: `${window.location.origin}/customer-account`,
      },
    });

    if (error) return { ok: false, error: error.message };

    // With email confirmation switched on, Supabase returns a user but no
    // session. The caller needs to know so it can say "check your email"
    // rather than silently behaving as though the person is signed in.
    return { ok: true, needsEmailConfirmation: !data.session };
  };

  const signIn = async (email: string, password: string): Promise<AuthResult> => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return error ? { ok: false, error: error.message } : { ok: true };
  };

  const signOut = async (): Promise<AuthResult> => {
    const { error } = await supabase.auth.signOut();
    return error ? { ok: false, error: error.message } : { ok: true };
  };

  const resetPassword = async (email: string): Promise<AuthResult> => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/customer-account`,
    });
    return error ? { ok: false, error: error.message } : { ok: true };
  };

  /**
   * Used to give a guest a cart and wishlist that survive a refresh.
   * An anonymous user has no email, and the customers table records that,
   * so the admin can tell guests apart from registered customers.
   */
  const signInAnonymously = async (): Promise<AuthResult> => {
    const { error } = await supabase.auth.signInAnonymously();
    return error ? { ok: false, error: error.message } : { ok: true };
  };

  /** True for a real account, false for a guest session or nobody. */
  const isRegistered = Boolean(user && !user.is_anonymous && user.email);

  return {
    user,
    session,
    loading,
    isRegistered,
    signUp,
    signIn,
    signOut,
    resetPassword,
    signInAnonymously,
  };
}
