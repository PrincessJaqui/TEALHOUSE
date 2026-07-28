# 🚀 Easy Deployment (No Terminal Required!)

Don't want to use the terminal? No problem! Here's how to deploy using only your web browser.

---

## 📋 **Step 1: Get Your Project Files Ready**

You need to copy the server code from your project. The file you need is:
- **Location:** `/supabase/functions/server/index.tsx`

Open this file and copy ALL the code (Ctrl+A, then Ctrl+C).

---

## 🌐 **Step 2: Open Supabase Dashboard**

1. Go to: **https://supabase.com/dashboard**
2. Login to your account
3. Click on your **TEALHOUSE** project (or the project with ID: `ymnqgfpnfzrlinbdbkel`)

---

## 🔧 **Step 3: Create the Edge Function**

### 3a. Navigate to Functions
1. In the left sidebar, find and click **"Edge Functions"**
2. Click the **"Create a new function"** button

### 3b. Set Up the Function
1. **Function name:** Type `server`
2. Choose the template: **"Blank function"** or skip template
3. Click **"Create function"**

### 3c. Paste Your Code
1. You'll see a code editor
2. **Delete** any example code that's there
3. **Paste** the code from `/supabase/functions/server/index.tsx`
4. Click **"Deploy"** button

---

## 🔐 **Step 4: Set Up Secrets (Environment Variables)**

### 4a. Navigate to Secrets
1. In the left sidebar, click **"Edge Functions"**
2. Click on the **"Manage secrets"** or **"Secrets"** tab
3. You should see a list of environment variables

### 4b. Add Required Secrets

Add these two secrets by clicking **"Add secret"** button:

**Secret 1:**
- **Name:** `SUPABASE_URL`
- **Value:** `https://ymnqgfpnfzrlinbdbkel.supabase.co`
- Click **"Add"** or **"Save"**

**Secret 2:**
- **Name:** `SUPABASE_SERVICE_ROLE_KEY`
- **Value:** [See Step 5 below to find this]
- Click **"Add"** or **"Save"**

---

## 🔑 **Step 5: Get Your Service Role Key**

### 5a. Navigate to API Settings
1. In the left sidebar, click **"Settings"** (gear icon at bottom)
2. Click **"API"**
3. Scroll down to find **"Project API keys"**

### 5b. Copy the Service Role Key
1. Find the key labeled **"service_role"** (NOT "anon public")
2. Click the **"Copy"** button or **"Reveal"** then copy it
3. It starts with `eyJ...` and is very long
4. ⚠️ **Important:** Keep this secret! Never share it publicly

### 5c. Add It to Secrets
1. Go back to **Edge Functions** → **Secrets**
2. Add `SUPABASE_SERVICE_ROLE_KEY` with the value you just copied
3. Save it

---

## ✅ **Step 6: Verify the Deployment**

### 6a. Check Function Status
1. Go to **Edge Functions** in the sidebar
2. You should see your **"server"** function listed
3. Status should show as **"Deployed"** or **"Active"**

### 6b. Test the Connection
1. Go to your TEALHOUSE website
2. Navigate to: `/admin/customers`
3. Click the **"Test Connection"** button
4. You should see ✅ **green checkmarks**!

---

## 🎉 **You're Done!**

If you see the green checkmarks, your customer management backend is now live!

You can now:
- ✅ View all customers
- ✅ Ban/unban users
- ✅ Delete users
- ✅ Search customers

---

## 🐛 **Troubleshooting**

### ❌ Test Connection Fails?

**Check these:**

1. **Is the function deployed?**
   - Go to Edge Functions → should see "server" with green status

2. **Are secrets set correctly?**
   - Go to Edge Functions → Secrets
   - Should have both `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`

3. **Check function logs:**
   - Click on your **"server"** function
   - Click **"Logs"** tab
   - Look for any error messages

4. **Correct Service Role Key?**
   - Settings → API → Copy the **service_role** key (not anon)
   - Make sure you copied the entire key

### 📧 Still Need Help?

- Check the function logs in Supabase Dashboard
- Make sure you're using the correct project
- Verify all secrets are saved

---

## 📸 **Visual Guide Summary**

1. **Supabase Dashboard** → **Edge Functions** → **Create Function**
2. Name it: `server`
3. Paste code from `/supabase/functions/server/index.tsx`
4. Deploy
5. **Settings** → **API** → Copy **service_role** key
6. **Edge Functions** → **Secrets** → Add both secrets
7. Test at `/admin/customers`

That's it! No terminal needed! 🎊
