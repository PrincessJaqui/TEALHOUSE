# 🚀 Quick Deployment Guide for TEALHOUSE

## What We Just Fixed

✅ Added `package.json` with all dependencies (including @vitejs/plugin-react)
✅ Configured environment variables for Supabase
✅ Added `.gitignore` to protect sensitive files
✅ Created TypeScript configuration
✅ Made Supabase connection use environment variables

## 3 Steps to Deploy

### Step 1: Push to GitHub (5 minutes)

You need to push the new files we just created to GitHub.

**Using Terminal:**
```bash
git add .
git commit -m "Add deployment configuration files"
git push origin main
```

**Using GitHub Desktop (No Terminal Required):**
1. Open GitHub Desktop
2. You'll see all the changed files listed on the left
3. Write commit message: "Add deployment configuration files"
4. Click "Commit to main" (blue button)
5. Click "Push origin" (blue button at top)

### Step 2: Deploy on Vercel (5 minutes)

1. **Go to Vercel:** https://vercel.com/new

2. **Switch to Personal Account:**
   - Look at top-left dropdown
   - **IMPORTANT:** Make sure you're in your personal account, NOT a team workspace
   - This fixes the "team permission" error you were getting

3. **Import Repository:**
   - Click "Import Git Repository"
   - Search for: `TEALHOUSETECHNOLOGIES/Website`
   - Click "Import"

4. **Configure Project:**
   - Project Name: `tealhouse` (or whatever you prefer)
   - Framework: Vite (should auto-detect)
   - Leave everything else as default
   - Click "Deploy" but wait! Do Step 3 first!

### Step 3: Add Environment Variables (2 minutes)

**BEFORE clicking Deploy,** expand the "Environment Variables" section and add:

**Variable 1:**
- Name: `VITE_SUPABASE_URL`
- Value: `https://ymnqgfpnfzrlinbdbkel.supabase.co`

**Variable 2:**
- Name: `VITE_SUPABASE_ANON_KEY`
- Value: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InltbnFnZnBuZnpybGluYmRia2VsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU1MTM5NjQsImV4cCI6MjA4MTA4OTk2NH0.6Fhs2vVS-GLgY3irphbtRBXGqgBDvY3D3A_o6pXpMto`

Now click **Deploy**!

## After Deployment

### Update Supabase Auth URLs

Once deployed, you'll get a URL like `https://tealhouse-xyz.vercel.app`

1. Go to Supabase: https://app.supabase.com/project/ymnqgfpnfzrlinbdbkel/auth/url-configuration
2. Update these settings:
   - **Site URL:** Your Vercel URL (e.g., `https://tealhouse-xyz.vercel.app`)
   - **Redirect URLs:** Add your Vercel URL with `/**` at the end

Example:
```
Site URL: https://tealhouse-abc123.vercel.app
Redirect URLs:
  https://tealhouse-abc123.vercel.app/**
  http://localhost:5173/**
```

### Test Your Site

1. Visit your Vercel URL
2. Check that products load (from Supabase, not mock data)
3. Test adding to cart
4. Test admin login at `/company-login`
5. Try placing a test order

## Common Issues & Fixes

### "Team Permission Denied"
❌ **Problem:** Trying to deploy to a team workspace
✅ **Fix:** Deploy to your personal Vercel account (see Step 2 above)

### Build fails with missing dependencies
❌ **Problem:** package.json not in GitHub
✅ **Fix:** Complete Step 1 to push package.json to GitHub

### Site loads but no products
❌ **Problem:** Missing environment variables
✅ **Fix:** Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in Vercel

### Can't login as admin
❌ **Problem:** Supabase redirect URLs not configured
✅ **Fix:** Add your Vercel URL to Supabase auth settings (see above)

### 404 on page refresh
✅ **Already fixed:** vercel.json has proper rewrites configured

## Custom Domain Setup (Optional)

To use `www.tealhouse.us`:

1. In Vercel project → Settings → Domains
2. Add `tealhouse.us` and `www.tealhouse.us`
3. Vercel will show DNS records to add
4. Add those records in your domain registrar
5. Update Supabase redirect URLs to include your custom domain

## That's It!

Your TEALHOUSE website should now be live! 🎉

The deployment will:
- ✅ Build automatically whenever you push to GitHub
- ✅ Serve over HTTPS (SSL included free)
- ✅ Have global CDN for fast loading worldwide
- ✅ Support client-side routing (no 404s)
- ✅ Connect to your Supabase database

---

**Questions or Issues?**
Check `/VERCEL_DEPLOYMENT_GUIDE.md` for detailed troubleshooting.
