import { createClient } from '@supabase/supabase-js';
import { supabaseUrl, publicAnonKey } from '../utils/supabase/info';

/**
 * The single Supabase client for the whole app.
 *
 * There used to be a second client created inside ProtectedAdminRoute, which
 * meant two independent session stores. Import this one everywhere instead.
 *
 * Credentials come from the environment. The hardcoded URL and key fallbacks
 * that used to live here were removed: they made a misconfigured deploy point
 * silently at production.
 */
export const supabase = createClient(supabaseUrl, publicAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

// Database product type
export interface DbProduct {
  id?: number;
  name: string;
  price: number;
  image: string;
  images?: string[];
  video?: string;
  categories: string[];
  audience: string[];
  description: string;
  materials: string[];
  sizes?: number[];
  stock?: Record<string, number>;
  is_bestseller?: boolean;
  is_published?: boolean;
  created_at?: string;
}

// Database order type
export interface DbOrder {
  id?: string;
  user_id?: string;
  customer_name?: string;
  customer_email: string;
  customer_phone?: string;
  shipping_address_line1?: string;
  shipping_address_line2?: string;
  shipping_city?: string;
  shipping_state?: string;
  shipping_postal_code?: string;
  shipping_country?: string;
  status: string;
  total: number;
  subtotal?: number;
  tax?: number;
  shipping_cost?: number;
  items?: any[];
  items_count?: number;
  payment_status?: string;
  payment_method?: string;
  tracking_number?: string;
  notes?: string;
  created_at?: string;
  updated_at?: string;
  shipped_at?: string;
  delivered_at?: string;
  // Legacy fields for backward compatibility
  shipping_info?: {
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
    address?: string;
    address2?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  };
}

export interface DbCustomer {
  id: string;
  email: string | null;
  full_name: string | null;
  phone: string | null;
  is_anonymous: boolean;
  banned: boolean;
  marketing_opt_in: boolean;
  created_at: string;
  last_sign_in_at: string | null;
}
