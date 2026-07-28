# TEALHOUSE Supabase Integration Setup

## ⚠️ CRITICAL FIRST STEP: Enable Anonymous Authentication

**Before anything else**, you must enable anonymous authentication in Supabase:

1. Go to your Supabase Dashboard: https://app.supabase.com
2. Select your project: **ymnqgfpnfzrlinbdbkel**
3. Navigate to **Authentication** → **Providers** (in the left sidebar)
4. Scroll down to find **Anonymous sign-ins**
5. **Toggle it ON** ✅
6. Click **Save**

Without this step, you'll see errors like: `Anonymous sign-ins are disabled`

---

## ✅ What's Been Implemented

Your TEALHOUSE ecommerce site now has full Supabase backend integration with:

- **Persistent Cart** - Cart items are saved to the database and persist across sessions
- **Persistent Wishlist** - Wishlist items are saved and synced across devices
- **Guest User Authentication** - Automatic anonymous sign-in for seamless shopping
- **Real-time Sync** - Optimistic updates with automatic rollback on errors
- **Row Level Security (RLS)** - Users can only access their own data

## 🚀 Setup Instructions

### Step 1: Run the Database Schema

1. Go to your Supabase project dashboard: https://ymnqgfpnfzrlinbdbkel.supabase.co
2. Navigate to the **SQL Editor** in the left sidebar
3. Click **New Query**
4. Copy the entire contents of `/lib/supabase-schema.sql` 
5. Paste it into the SQL editor
6. Click **Run** to execute

This will create:
- `wishlist` table - Stores user wishlist items
- `cart` table - Stores shopping cart items with quantities and sizes
- `orders` table - Stores completed orders (ready for checkout integration)
- All necessary indexes for performance
- Row Level Security policies to protect user data

### Step 2: Enable Anonymous Authentication

**IMPORTANT**: You must enable anonymous authentication in Supabase:

1. Go to **Authentication** → **Providers** in your Supabase dashboard
2. Scroll down and find **Anonymous sign-ins**
3. **Toggle it ON** ✅
4. Save changes

This allows guests to shop without creating accounts. Their cart and wishlist will still persist!

### Step 3: Test the Integration

Your site should now automatically:

1. **Auto sign-in**: When a user first visits, they're automatically signed in as a guest
2. **Persist cart**: Adding items to cart saves to Supabase
3. **Persist wishlist**: Adding items to wishlist saves to Supabase
4. **Sync across tabs**: Open your site in two browser tabs - cart/wishlist sync in real-time!

## 🎯 How It Works

### Anonymous Guest Users

Every visitor gets an automatic anonymous account with a unique ID like:
```
guest_1734123456789_abc123@tealhouse.local
```

This allows:
- Cart and wishlist persistence without requiring login
- Seamless shopping experience
- Future upgrade path to full user accounts

### Data Flow

1. **Cart/Wishlist Actions** → Frontend React hooks
2. **Optimistic Update** → UI updates immediately 
3. **Supabase API Call** → Data synced to database
4. **On Error** → Automatic rollback to previous state

### Security

- **Row Level Security (RLS)** ensures users can only see their own data
- **API Key** is the public anon key - safe to use in browser
- **Policies** enforce user_id matching for all operations

## 📊 Database Tables

### `wishlist` Table
```sql
- id (bigserial, primary key)
- user_id (uuid) - Links to auth.users
- product_id (integer) - Product from your catalog
- created_at (timestamp)
```

### `cart` Table
```sql
- id (bigserial, primary key)
- user_id (uuid) - Links to auth.users
- product_id (integer) - Product from your catalog
- quantity (integer) - Number of items
- size (integer, optional) - Selected shoe size
- created_at (timestamp)
- updated_at (timestamp)
```

### `orders` Table
```sql
- id (bigserial, primary key)
- user_id (uuid) - Links to auth.users
- items (jsonb) - Full cart snapshot
- total (decimal) - Order total
- shipping_info (jsonb) - Shipping address
- payment_info (jsonb) - Payment details
- status (varchar) - pending/confirmed/shipped/delivered
- created_at (timestamp)
- updated_at (timestamp)
```

## 🔧 Environment Variables (Optional)

For production, you may want to use environment variables instead of hardcoded keys:

```env
VITE_SUPABASE_URL=https://ymnqgfpnfzrlinbdbkel.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

Then update `/lib/supabase.ts`:
```typescript
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
```

## 🎨 Files Created/Modified

### New Files
- `/lib/supabase.ts` - Supabase client configuration
- `/lib/supabase-schema.sql` - Database schema
- `/hooks/useSupabaseAuth.ts` - Authentication hook
- `/hooks/useSupabaseCart.ts` - Cart management hook
- `/hooks/useSupabaseWishlist.ts` - Wishlist management hook
- `/data/products.ts` - Centralized product data
- `/SUPABASE_SETUP.md` - This file

### Modified Files
- `/App.tsx` - Integrated Supabase hooks
- `/components/ProductGrid.tsx` - Uses centralized product data
- `/components/Search.tsx` - Uses centralized product data

## 🚀 Next Steps

### Checkout Integration
The `orders` table is ready. You can extend `/pages/Checkout.tsx` to:
1. Create order records when checkout completes
2. Clear cart after successful order
3. Send order confirmation emails (via Supabase Edge Functions)

### User Accounts
Upgrade from anonymous to full user accounts:
1. Add email/password sign-up form
2. Link existing cart/wishlist to new account
3. Add order history page
4. Profile management

### Admin Dashboard
Create an admin interface to:
1. View all orders
2. Update order status
3. Manage inventory
4. View analytics

## 📞 Support

If you encounter any issues:

1. **Check Supabase Logs**: Dashboard → Logs
2. **Verify RLS Policies**: Dashboard → Authentication → Policies
3. **Test Connection**: Open browser console and check for errors

## 🔒 Security Notes

⚠️ **Important**: As mentioned by Figma, this setup is for demonstration/development purposes. For production:

- Do NOT collect PII (Personally Identifiable Information) without proper compliance
- Do NOT store sensitive payment information (use Stripe/PayPal instead)
- Review and audit all RLS policies
- Set up proper monitoring and alerts
- Use environment variables for API keys
- Implement rate limiting
- Add proper error handling and logging

---

Your TEALHOUSE site now has enterprise-grade backend functionality! 🎉