/**
 * Supabase project identifiers, read from environment variables.
 *
 * This file used to hardcode the project ref and anon key. That meant the app
 * could never be pointed at a staging project, and a missing env var failed
 * silently by falling through to production. Both values now come from the
 * environment and the app refuses to start without them.
 *
 * Set these in .env.local for development and in Vercel for deployment.
 * The anon key is safe in the browser. A service role key never is.
 */

const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!url || !anonKey) {
  throw new Error(
    'Missing Supabase environment variables. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY. See .env.example.'
  );
}

export const supabaseUrl: string = url;
export const publicAnonKey: string = anonKey;

// Derived from the URL rather than stored separately, so the two can never drift.
export const projectId: string = new URL(url).hostname.split('.')[0];
