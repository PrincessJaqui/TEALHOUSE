-- ============================================
-- TEALHOUSE Admin Users Setup
-- ============================================
-- This script sets up multiple admin users for TEALHOUSE

-- ADMIN USERS:
-- 1. Hello@TEALHOUSE.us (Primary Admin)
-- 2. jaqui@TealHouseInc.com (Jaqui)
-- 3. bobby@TealHouseInc.com (Bobby)

-- ============================================
-- STEP 1: Create Admin Users in Supabase
-- ============================================
-- You must create each user via the Supabase Dashboard
-- Go to: https://app.supabase.com/project/ymnqgfpnfzrlinbdbkel/auth/users

-- For EACH admin user:
-- 1. Click "Add user" → "Create new user"
-- 2. Enter the email and a secure password
-- 3. Toggle ON: "Auto Confirm User" 
-- 4. Toggle ON: "Email Confirm"
-- 5. Click "Create user"

-- ADMIN 1: Primary Admin
--   Email: Hello@TEALHOUSE.us
--   Password: TealHouse2026istheYear$$

-- ADMIN 2: Jaqui
--   Email: jaqui@TealHouseInc.com
--   Password: (Choose a secure password)

-- ADMIN 3: Bobby
--   Email: bobby@TealHouseInc.com
--   Password: (Choose a secure password)

-- ============================================
-- STEP 2: Create Admin Users Table (Optional)
-- ============================================
-- This creates a table to track and manage admin users
-- Run this in the Supabase SQL Editor

CREATE TABLE IF NOT EXISTS public.admin_users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  role TEXT DEFAULT 'admin',
  full_name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add updated_at trigger
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER admin_users_updated_at
  BEFORE UPDATE ON public.admin_users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Enable Row Level Security
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Policy: Only admins can view admin_users table
DROP POLICY IF EXISTS "Only admins can view admin users" ON public.admin_users;
CREATE POLICY "Only admins can view admin users"
  ON public.admin_users
  FOR SELECT
  USING (
    auth.uid() IN (SELECT id FROM public.admin_users)
  );

-- Policy: Only admins can insert into admin_users
DROP POLICY IF EXISTS "Only admins can create admin users" ON public.admin_users;
CREATE POLICY "Only admins can create admin users"
  ON public.admin_users
  FOR INSERT
  WITH CHECK (
    auth.uid() IN (SELECT id FROM public.admin_users)
  );

-- Policy: Only admins can update admin_users
DROP POLICY IF EXISTS "Only admins can update admin users" ON public.admin_users;
CREATE POLICY "Only admins can update admin users"
  ON public.admin_users
  FOR UPDATE
  USING (
    auth.uid() IN (SELECT id FROM public.admin_users)
  );

-- ============================================
-- STEP 3: Add All Admins to admin_users Table
-- ============================================
-- After creating users in Step 1, run this to add them to the admin_users table

-- Add Primary Admin
INSERT INTO public.admin_users (id, email, role, full_name)
SELECT id, email, 'admin', 'TEALHOUSE Admin'
FROM auth.users
WHERE email = 'Hello@TEALHOUSE.us'
ON CONFLICT (email) DO NOTHING;

-- Add Jaqui
INSERT INTO public.admin_users (id, email, role, full_name)
SELECT id, email, 'admin', 'Jaqui'
FROM auth.users
WHERE email = 'jaqui@TealHouseInc.com'
ON CONFLICT (email) DO NOTHING;

-- Add Bobby
INSERT INTO public.admin_users (id, email, role, full_name)
SELECT id, email, 'admin', 'Bobby'
FROM auth.users
WHERE email = 'bobby@TealHouseInc.com'
ON CONFLICT (email) DO NOTHING;

-- ============================================
-- VERIFICATION: Check All Admin Users
-- ============================================
-- Run this to verify all admins are set up correctly

SELECT 
  au.email,
  au.full_name,
  au.role,
  au.created_at,
  u.email_confirmed_at,
  u.last_sign_in_at
FROM public.admin_users au
JOIN auth.users u ON au.id = u.id
ORDER BY au.created_at;

-- ============================================
-- HELPER: Check if user exists in auth.users
-- ============================================
-- Use this to verify users were created in Supabase

SELECT id, email, created_at, email_confirmed_at, last_sign_in_at
FROM auth.users
WHERE email IN (
  'Hello@TEALHOUSE.us',
  'jaqui@TealHouseInc.com',
  'bobby@TealHouseInc.com'
)
ORDER BY email;

-- ============================================
-- HELPER: View all admin users
-- ============================================
SELECT * FROM public.admin_users ORDER BY created_at;

-- ============================================
-- HELPER: Remove admin access (if needed)
-- ============================================
-- To remove admin access from a user:
-- DELETE FROM public.admin_users WHERE email = 'user@example.com';

-- ============================================
-- NOTES
-- ============================================
-- 1. All admins login at: https://www.tealhouse.us/company-login
-- 2. Each admin uses their own email and password
-- 3. Sessions are persistent (uses Supabase auth)
-- 4. All admins have equal access to the dashboard
-- 5. To add more admins in the future:
--    a) Create user in Supabase Dashboard
--    b) Run the INSERT INTO admin_users query above with new email

-- ============================================
-- SECURITY RECOMMENDATIONS
-- ============================================
-- 1. Use strong, unique passwords for each admin
-- 2. Enable 2FA if available in Supabase
-- 3. Regularly review admin access
-- 4. Remove admin access when team members leave
-- 5. Monitor admin activity via Supabase logs
-- 6. Consider adding role-based permissions (owner, editor, viewer)
