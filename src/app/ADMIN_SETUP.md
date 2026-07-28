# Admin Account Setup

## Creating Your Admin Account

Since your admin pages are now secured with Supabase authentication, you need to create an admin user account.

### Option 1: Using Supabase Dashboard (Recommended)

1. Go to your Supabase project dashboard
2. Navigate to **Authentication** → **Users**
3. Click **Add User**
4. Enter:
   - Email: `jaquimccarthy@gmail.com` (or your preferred admin email)
   - Password: Your secure password
   - Auto Confirm User: **Checked** ✓
5. Click **Create User**

### Option 2: Using SQL

Run this SQL in your Supabase SQL Editor:

```sql
-- Create admin user
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'jaquimccarthy@gmail.com',
  crypt('YOUR_PASSWORD_HERE', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW(),
  '',
  '',
  '',
  ''
);
```

Replace `YOUR_PASSWORD_HERE` with your desired password.

## Accessing Admin Dashboard

1. Go to: `https://www.tealhouse.us/company-login`
2. Enter your admin email and password
3. You'll remain logged in until you manually sign out

## Security Features Now Active

✅ **Real authentication** - Uses Supabase Auth, not fake login
✅ **Session persistence** - Stays logged in until manual logout
✅ **Protected routes** - Only authenticated users can access admin panel
✅ **Secure logout** - Properly signs out and redirects to login

## Important Notes

- The admin dashboard is now **completely secured**
- Anonymous users cannot access `/company-login` admin features
- Your session persists across page refreshes
- Logout button properly clears your session
