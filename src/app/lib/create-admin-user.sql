-- Create Admin User for TEALHOUSE
-- Email: Hello@TEALHOUSE.us
-- Password: TealHouse2026istheYear$$

-- This SQL script will create the admin user in Supabase
-- You need to run this in the Supabase SQL Editor

-- Note: You cannot create users directly via SQL in Supabase
-- Instead, follow these steps:

-- STEP 1: Go to Supabase Dashboard → Authentication → Users
-- URL: https://app.supabase.com/project/ymnqgfpnfzrlinbdbkel/auth/users

-- STEP 2: Click "Add user" → "Create new user"

-- STEP 3: Fill in the form:
--   Email: Hello@TEALHOUSE.us
--   Password: TealHouse2026istheYear$$
--   Auto Confirm User: YES (toggle ON)
--   Email Confirm: YES (toggle ON)

-- STEP 4: Click "Create user"

-- That's it! The admin can now login at:
-- https://www.tealhouse.us/company-login

-- ============================================
-- ALTERNATIVE: Create via Supabase Auth API
-- ============================================
-- If you prefer to use the API, run this in your terminal:
-- (Make sure you have your Service Role Key, NOT the publishable key)

/*
curl -X POST 'https://ymnqgfpnfzrlinbdbkel.supabase.co/auth/v1/admin/users' \
-H "apikey: YOUR_SERVICE_ROLE_KEY_HERE" \
-H "Authorization: Bearer YOUR_SERVICE_ROLE_KEY_HERE" \
-H "Content-Type: application/json" \
-d '{
  "email": "Hello@TEALHOUSE.us",
  "password": "TealHouse2026istheYear$$",
  "email_confirm": true,
  "user_metadata": {
    "role": "admin",
    "full_name": "TEALHOUSE Admin"
  }
}'
*/

-- ============================================
-- OPTIONAL: Create Admin Role Table
-- ============================================
-- This creates a table to track admin users
-- (This is optional - you can just use the email check in your app)

CREATE TABLE IF NOT EXISTS public.admin_users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  role TEXT DEFAULT 'admin',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Policy: Only admins can view admin_users table
CREATE POLICY "Only admins can view admin users"
  ON public.admin_users
  FOR SELECT
  USING (
    auth.uid() IN (SELECT id FROM public.admin_users)
  );

-- Policy: Only admins can insert into admin_users
CREATE POLICY "Only admins can create admin users"
  ON public.admin_users
  FOR INSERT
  WITH CHECK (
    auth.uid() IN (SELECT id FROM public.admin_users)
  );

-- ============================================
-- Add Admin User to admin_users Table
-- ============================================
-- After creating the user in Step 1-4, run this to add them to admin_users table:
-- (Replace 'USER_ID_HERE' with the actual UUID from the auth.users table)

-- INSERT INTO public.admin_users (id, email, role)
-- VALUES (
--   'USER_ID_HERE',  -- Get this from auth.users after creating the user
--   'Hello@TEALHOUSE.us',
--   'admin'
-- );

-- OR, if you already know the user exists, use this query:
INSERT INTO public.admin_users (id, email, role)
SELECT id, email, 'admin'
FROM auth.users
WHERE email = 'Hello@TEALHOUSE.us'
ON CONFLICT (email) DO NOTHING;

-- ============================================
-- VERIFICATION
-- ============================================
-- After setup, verify the admin user exists:

SELECT id, email, created_at, email_confirmed_at
FROM auth.users
WHERE email = 'Hello@TEALHOUSE.us';

-- ============================================
-- NOTES
-- ============================================
-- 1. The admin can login at: https://www.tealhouse.us/company-login
-- 2. Email: Hello@TEALHOUSE.us
-- 3. Password: TealHouse2026istheYear$$
-- 4. Sessions are persistent (uses Supabase auth)
-- 5. No timeout - admin stays logged in
