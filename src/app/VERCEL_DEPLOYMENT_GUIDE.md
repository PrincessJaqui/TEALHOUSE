# TEALHOUSE Vercel Deployment Guide

This guide will help you deploy your TEALHOUSE ecommerce website to Vercel.

## Prerequisites

✅ Code pushed to GitHub repository: https://github.com/TEALHOUSETECHNOLOGIES/Website.git
✅ Supabase project configured (jaquimccarthy@gmail.com)
✅ All required files now in place (package.json, environment variables, etc.)

## Step 1: Push Latest Changes to GitHub

Since we've added critical files (package.json, .env.example, .gitignore), you need to push these to GitHub:

```bash
git add .
git commit -m "Add package.json and environment configuration for Vercel deployment"
git push origin main
```

**Alternative (No Terminal):** Use GitHub Desktop:
1. Open GitHub Desktop
2. You'll see all the new files listed
3. Add a commit message: "Add package.json and environment configuration"
4. Click "Commit to main"
5. Click "Push origin"

## Step 2: Fix Vercel Team Permission Issues

The team permission error you're seeing happens when you try to deploy to a team workspace without permission. Here's how to fix it:

### Option A: Deploy to Your Personal Account (Recommended)
1. Go to https://vercel.com/new
2. Make sure you're in your **personal account** (not a team workspace)
   - Look at the top-left dropdown - select your personal account
3. Click "Import Project"
4. Connect to GitHub if you haven't already
5. Select the repository: `TEALHOUSETECHNOLOGIES/Website`

### Option B: Get Team Access
If you need to deploy to a specific team workspace:
1. Contact the team owner to add you as a member with deployment permissions
2. Once added, you'll be able to deploy to that team

## Step 3: Configure Vercel Project

After importing the repository:

1. **Project Name:** `tealhouse` (or your preferred name)
2. **Framework Preset:** Vite (should be auto-detected)
3. **Root Directory:** Leave as `./`
4. **Build Command:** `npm run build` (auto-detected from vercel.json)
5. **Output Directory:** `dist` (auto-detected from vercel.json)
6. **Install Command:** `npm install` (auto-detected)

## Step 4: Add Environment Variables

This is CRITICAL - your site won't work without these!

In the Vercel project settings, add these environment variables:

```
VITE_SUPABASE_URL=https://ymnqgfpnfzrlinbdbkel.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InltbnFnZnBuZnpybGluYmRia2VsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU1MTM5NjQsImV4cCI6MjA4MTA4OTk2NH0.6Fhs2vVS-GLgY3irphbtRBXGqgBDvY3D3A_o6pXpMto
```

**How to add them:**
1. In your Vercel project dashboard
2. Go to "Settings" tab
3. Click "Environment Variables" in the left sidebar
4. Add each variable:
   - Name: `VITE_SUPABASE_URL`
   - Value: `https://ymnqgfpnfzrlinbdbkel.supabase.co`
   - Environment: Production, Preview, Development (check all)
5. Click "Add" for each variable

## Step 5: Deploy

1. Click "Deploy" button
2. Wait for the build to complete (usually 2-3 minutes)
3. You'll get a live URL like: `https://tealhouse.vercel.app` or your custom domain

## Step 6: Custom Domain (Optional)

To use `www.tealhouse.us`:

1. In Vercel project settings, go to "Domains"
2. Add `tealhouse.us` and `www.tealhouse.us`
3. Vercel will give you DNS records to add:
   - A record pointing to Vercel's IP
   - CNAME record for www
4. Add these records in your domain registrar (where you bought tealhouse.us)
5. Wait for DNS propagation (can take up to 48 hours, usually much faster)

## Step 7: Configure Supabase Authentication URLs

Important for admin login to work properly:

1. Go to your Supabase project: https://app.supabase.com/project/ymnqgfpnfzrlinbdbkel
2. Go to "Authentication" → "URL Configuration"
3. Add these URLs:
   - **Site URL:** `https://tealhouse.vercel.app` (or your custom domain)
   - **Redirect URLs:** 
     - `https://tealhouse.vercel.app/**`
     - `https://www.tealhouse.us/**` (if using custom domain)
     - `http://localhost:5173/**` (for local development)

## Troubleshooting

### Build Fails with "Missing @vitejs/plugin-react"
✅ **Fixed!** - We added package.json with all dependencies

### "Team Permission Denied" Error
✅ Deploy to your personal Vercel account instead of a team workspace

### Site Loads but No Products/Can't Login
❌ Missing environment variables - follow Step 4 above

### 404 Errors on Page Refresh
✅ **Fixed!** - vercel.json has rewrites configured for client-side routing

### Images Not Loading
- Check that Supabase Storage policies are correctly set up
- Verify images are uploaded to the `product-images` bucket
- Check browser console for CORS or permission errors

## Post-Deployment Checklist

After successful deployment:

- [ ] Visit your site and verify it loads
- [ ] Test product browsing works
- [ ] Test adding items to cart
- [ ] Test admin login at `/company-login`
- [ ] Verify products load from Supabase (not mock data)
- [ ] Test checkout process creates real orders
- [ ] Check that all images load correctly
- [ ] Test on mobile devices for responsiveness

## Testing the Deployment

1. **Homepage:** Should load with hero section and products
2. **Product Grid:** Products should load from Supabase
3. **Cart:** Should work with persistent storage
4. **Admin Login:** Go to `/company-login` and login with jaquimccarthy@gmail.com
5. **Create Order:** Complete a test checkout to verify order creation

## Maintenance

### To Update the Site:
1. Make changes to your code locally
2. Push to GitHub (main branch)
3. Vercel automatically deploys the changes
4. Check deployment status at https://vercel.com/dashboard

### To Rollback:
1. Go to Vercel project dashboard
2. Click "Deployments" tab
3. Find a previous successful deployment
4. Click "..." menu → "Promote to Production"

## Need Help?

- **Vercel Documentation:** https://vercel.com/docs
- **Supabase Documentation:** https://supabase.com/docs
- **Check deployment logs** in Vercel dashboard for specific error messages

---

## Quick Reference - Files Added

We created these files to enable deployment:

- ✅ `/package.json` - Defines all dependencies and build scripts
- ✅ `/.env.example` - Template for environment variables
- ✅ `/.env.local` - Local development environment variables
- ✅ `/.gitignore` - Prevents committing sensitive files
- ✅ `/VERCEL_DEPLOYMENT_GUIDE.md` - This guide

## Next Steps After Deployment

1. **Set up monitoring** - Use Vercel Analytics to track performance
2. **Add error tracking** - Consider Sentry for production error monitoring
3. **Performance optimization** - Use Vercel's built-in performance insights
4. **SEO setup** - Add meta tags, sitemap, robots.txt
5. **SSL/HTTPS** - Automatically provided by Vercel
6. **Backups** - Supabase handles database backups automatically

Your TEALHOUSE site is now ready for production! 🎉
