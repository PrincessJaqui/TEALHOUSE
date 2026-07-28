# ⚡ TEALHOUSE Supabase Quick Start

## ✅ Step 1: API Key (DONE!)

Your new publishable API key is already configured:
```
sb_publishable_rNNEthQDBxAiKJgMZIWvZQ_S-jNGsQ9
```

---

## 🧪 Step 2: Test Connection (1 minute)

1. Start your development server (if not running):
   ```bash
   npm run dev
   ```

2. Open in browser:
   ```
   http://localhost:5173/supabase-test
   ```

3. Click **"Run Tests"** button

This will show you exactly what needs to be set up.

---

## 📊 Step 3: Create Database Tables (5 minutes)

### Option A: Using Supabase Dashboard (Recommended)

1. **Open SQL Editor:**
   - Go to: https://app.supabase.com/project/ymnqgfpnfzrlinbdbkel/sql/new

2. **Copy Schema File:**
   - Open `/lib/supabase-schema.sql` in your code editor
   - Copy the ENTIRE file (all the SQL code)

3. **Run in Supabase:**
   - Paste into the SQL Editor
   - Click the green **"RUN"** button (bottom right)
   - You should see: "Success. No rows returned"

4. **Verify Tables Created:**
   - Go to: https://app.supabase.com/project/ymnqgfpnfzrlinbdbkel/editor
   - You should see: `products`, `cart`, `wishlist`, `orders` tables

### What This Creates:
- ✅ `products` - Your TEALHOUSE shoe catalog
- ✅ `cart` - Shopping cart with persistence
- ✅ `wishlist` - Customer saved items
- ✅ `orders` - Order management
- ✅ Row Level Security (RLS) policies

---

## 🔓 Step 4: Enable Anonymous Login (1 minute)

1. **Go to Authentication Settings:**
   - Open: https://app.supabase.com/project/ymnqgfpnfzrlinbdbkel/auth/providers

2. **Find Anonymous Sign-ins:**
   - Scroll down the page
   - Look for "Anonymous sign-ins" section

3. **Enable It:**
   - Toggle the switch to **ON** (green)
   - Click **"Save"** button

### Why This Matters:
Allows guests to shop without creating an account. Their cart and wishlist will still persist across sessions!

---

## 🎨 Step 5: Add Sample Products (Optional - 2 minutes)

To test your site with sample TEALHOUSE products:

1. **Open SQL Editor:**
   - https://app.supabase.com/project/ymnqgfpnfzrlinbdbkel/sql/new

2. **Copy Seed File:**
   - Open `/lib/seed-products-final.sql`
   - Copy entire file

3. **Run It:**
   - Paste into SQL Editor
   - Click **"RUN"**

4. **Verify:**
   - Go to Table Editor: https://app.supabase.com/project/ymnqgfpnfzrlinbdbkel/editor
   - Click `products` table
   - You should see 4 sample products

### Sample Products Include:
- The Novara Boot ($1,495) - Men's
- The Florence Loafer ($995) - Women's
- The Milano Sneaker ($1,295) - Unisex
- The Venezia Oxford ($1,395) - Men's

---

## ✅ Step 6: Verify Everything Works

1. **Re-run Connection Test:**
   - Go to: http://localhost:5173/supabase-test
   - Click **"Re-run Tests"**
   - All 6 tests should show ✅ green checkmarks

2. **Test Shopping:**
   - Go to homepage: http://localhost:5173
   - Browse products
   - Add to cart
   - Add to wishlist
   - Open in another browser tab - verify sync!

3. **Test Admin:**
   - Go to: http://localhost:5173/company-login
   - Sign in with: jaquimccarthy@gmail.com
   - Explore admin dashboard

---

## 🎯 Expected Results

After completing all steps, you should see:

### Connection Test Page (/supabase-test)
```
✅ 1. API Key Format - Using new publishable key format
✅ 2. Supabase Connection - Connected to Supabase successfully
✅ 3. Products Table - Products table exists with data
✅ 4. Anonymous Authentication - Anonymous sign-in successful
✅ 5. Cart Table - Cart table ready
✅ 6. Wishlist Table - Wishlist table ready

✅ All Tests Passed!
```

### Your Website
- Products loading from database ✅
- Cart persisting across tabs ✅
- Wishlist saving items ✅
- Admin dashboard accessible ✅

---

## 🚨 Troubleshooting

### "relation 'public.products' does not exist"
→ Run Step 3 (create database tables)

### "Anonymous sign-ins are disabled"
→ Run Step 4 (enable anonymous auth)

### "No products found"
→ Run Step 5 (add sample products) OR add products via Admin Dashboard

### "Invalid API key"
→ Already fixed! We updated the key for you ✅

---

## 📞 Need Help?

1. **Check Test Page:** http://localhost:5173/supabase-test
   - Shows exactly what's working and what's not

2. **Check Documentation:**
   - Full Setup: `/SUPABASE_SETUP.md`
   - Status Overview: `/SUPABASE_STATUS.md`

3. **Check Supabase Logs:**
   - https://app.supabase.com/project/ymnqgfpnfzrlinbdbkel/logs/explorer

---

## 🎉 That's It!

Total time: **~10 minutes**

Your TEALHOUSE luxury ecommerce site will have:
- ✅ Persistent shopping cart
- ✅ Persistent wishlist
- ✅ Guest user support
- ✅ Admin dashboard
- ✅ 40+ fully functional pages
- ✅ Real-time data sync

Ready to sell $995-$2,995 vegan luxury footwear! 🌱👟

---

**Next:** Deploy to production (Vercel/Netlify) - see `/DEPLOYMENT_QUICKSTART.md`
