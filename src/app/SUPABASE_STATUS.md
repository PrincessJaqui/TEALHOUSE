# 🔌 TEALHOUSE Supabase Connection Status

## ✅ API Key Updated Successfully!

Your new publishable API key has been configured:

```
Key: sb_publishable_rNNEthQDBxAiKJgMZIWvZQ_S-jNGsQ9
Project: ymnqgfpnfzrlinbdbkel
URL: https://ymnqgfpnfzrlinbdbkel.supabase.co
```

---

## 🧪 Test Your Connection

Visit this URL to run automated connection tests:

```
http://localhost:5173/supabase-test
```

This will verify:
- ✅ API key format is correct
- ✅ Connection to Supabase
- ✅ Database tables exist
- ✅ Anonymous authentication is enabled
- ✅ Cart & wishlist functionality

---

## 📋 Setup Checklist

### Step 1: Run Database Schema ⚡ **REQUIRED**

1. Open Supabase SQL Editor: https://app.supabase.com/project/ymnqgfpnfzrlinbdbkel/sql/new
2. Copy the entire contents of `/lib/supabase-schema.sql`
3. Paste into the SQL editor
4. Click **RUN**

This creates:
- `products` table - Store your shoe products
- `cart` table - Persistent shopping cart
- `wishlist` table - Customer wishlists
- `orders` table - Order management
- All security policies (RLS)

### Step 2: Enable Anonymous Authentication ⚡ **REQUIRED**

1. Go to: https://app.supabase.com/project/ymnqgfpnfzrlinbdbkel/auth/providers
2. Scroll to **Anonymous sign-ins**
3. Toggle it **ON** ✅
4. Click **Save**

This allows guests to shop without creating an account. Their cart/wishlist will persist!

### Step 3: Add Sample Products (Optional)

To test with sample products:

1. Copy contents of `/lib/seed-products-final.sql`
2. Run in SQL Editor
3. Adds 4 sample TEALHOUSE products

---

## 🎯 What Works Now

### ✅ Frontend (No Setup Required)
- 40+ fully functional pages
- Product browsing and filtering
- Shopping cart (localStorage fallback)
- Wishlist (localStorage fallback)
- Admin dashboard
- Checkout flow

### ⏳ Backend (Setup Required)
After completing Steps 1-2 above:
- ✅ Persistent cart across devices
- ✅ Persistent wishlist
- ✅ Guest user sessions
- ✅ Real-time sync
- ✅ Order management
- ✅ Secure data with RLS

---

## 🔧 Files Updated

### Configuration Files
- `/lib/supabase.ts` - Supabase client (✅ updated with new key)
- `/utils/supabase/info.tsx` - Project info (✅ updated)

### Database Schema
- `/lib/supabase-schema.sql` - Complete database setup
- `/lib/seed-products-final.sql` - Sample products

### React Hooks (Already Built)
- `/hooks/useSupabaseAuth.ts` - Authentication
- `/hooks/useSupabaseCart.ts` - Cart management
- `/hooks/useSupabaseWishlist.ts` - Wishlist management
- `/hooks/useSupabaseProducts.ts` - Product loading

---

## 🚨 Common Issues & Solutions

### Issue: "relation 'public.products' does not exist"
**Solution:** Run `/lib/supabase-schema.sql` in SQL Editor

### Issue: "Anonymous sign-ins are disabled"
**Solution:** Enable in Auth → Providers → Anonymous sign-ins

### Issue: "Invalid API key"
**Solution:** Already fixed! ✅ We updated to the new publishable key

### Issue: Products not loading
**Solution:** 
1. Verify database tables exist (run schema)
2. Add sample products (run seed-products-final.sql)
3. Or add products via Admin Dashboard

---

## 📊 Database Tables

### `products` Table
Stores all TEALHOUSE products ($995-$2,995)

```sql
- id (bigserial)
- name (text)
- price (decimal)
- image (text)
- images (text[])
- video (text)
- categories (text[])
- audience (text[])
- description (text)
- materials (text[])
- sizes (integer[])
- created_at (timestamp)
```

### `cart` Table
User shopping carts with quantities and sizes

```sql
- id (bigserial)
- user_id (uuid) - Links to auth.users
- product_id (integer)
- quantity (integer)
- size (integer)
- created_at (timestamp)
- updated_at (timestamp)
```

### `wishlist` Table
Saved items for later

```sql
- id (bigserial)
- user_id (uuid)
- product_id (integer)
- created_at (timestamp)
```

### `orders` Table
Completed purchases

```sql
- id (bigserial)
- user_id (uuid)
- items (jsonb) - Full cart snapshot
- total (decimal)
- shipping_info (jsonb)
- payment_info (jsonb)
- status (text)
- created_at (timestamp)
```

---

## 🔐 Admin Setup

Admin login is at: https://www.tealhouse.us/company-login

**Your Admin Email:** jaquimccarthy@gmail.com

To set up admin access:
1. Complete Steps 1-2 above
2. Sign in with your email
3. Permanent sessions (no timeout)

---

## 🚀 Next Steps After Setup

### Immediate (Test Everything)
1. Visit `/supabase-test` to verify connection ✅
2. Test adding items to cart
3. Test adding items to wishlist
4. Open in 2 browser tabs - verify sync works
5. Test admin login

### Production Ready
1. Add real product data (via Admin or SQL)
2. Upload product images to Supabase Storage
3. Configure payment processing (Stripe)
4. Set up email notifications
5. Deploy to Vercel/Netlify

### Optional Enhancements
1. User accounts (upgrade from anonymous)
2. Order tracking
3. Email marketing integration
4. Analytics
5. Product reviews

---

## 📞 Quick Links

| Resource | URL |
|----------|-----|
| **Test Connection** | http://localhost:5173/supabase-test |
| **Supabase Dashboard** | https://app.supabase.com/project/ymnqgfpnfzrlinbdbkel |
| **SQL Editor** | https://app.supabase.com/project/ymnqgfpnfzrlinbdbkel/sql/new |
| **Table Editor** | https://app.supabase.com/project/ymnqgfpnfzrlinbdbkel/editor |
| **Auth Settings** | https://app.supabase.com/project/ymnqgfpnfzrlinbdbkel/auth/providers |
| **API Settings** | https://app.supabase.com/project/ymnqgfpnfzrlinbdbkel/settings/api |

---

## 🎉 Status Summary

✅ **API Key Updated** - New publishable key configured  
⏳ **Database Setup** - Requires running SQL schema (5 minutes)  
⏳ **Anonymous Auth** - Requires enabling in dashboard (1 minute)  
✅ **Frontend Complete** - All 40+ pages built and working  
✅ **Hooks Built** - Cart, wishlist, auth all ready  
✅ **Admin Panel** - Dashboard, orders, products, customers  

**Total Setup Time:** ~10 minutes to be fully operational! 🚀

---

Last Updated: February 26, 2026  
API Key Format: ✅ New publishable key (sb_publishable_...)
