# Supabase Edge Function Deployment Guide

This guide will help you deploy the TEALHOUSE customer management backend to Supabase.

## Prerequisites

- A Supabase account and project
- Node.js and npm installed on your computer
- Terminal/Command Line access

## Step 1: Install Supabase CLI

Open your terminal and run:

```bash
npm install -g supabase
```

Or if you prefer using npx (no installation needed):

```bash
npx supabase login
```

## Step 2: Login to Supabase

```bash
supabase login
```

This will open your browser for authentication. Follow the prompts to login.

## Step 3: Link Your Project

Link your local project to your Supabase project:

```bash
supabase link --project-ref ymnqgfpnfzrlinbdbkel
```

When prompted, enter your database password (you can find this in your Supabase dashboard under Settings → Database).

## Step 4: Get Your Service Role Key

1. Go to: https://supabase.com/dashboard/project/ymnqgfpnfzrlinbdbkel/settings/api
2. Find the **"service_role" secret** key (NOT the anon public key)
3. Copy it - you'll need it in the next step

⚠️ **IMPORTANT**: Keep this key secret! Never commit it to git or share it publicly.

## Step 5: Set Environment Variables

Set the required environment variables for your edge function:

```bash
supabase secrets set SUPABASE_URL=https://ymnqgfpnfzrlinbdbkel.supabase.co
supabase secrets set SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

Replace `your_service_role_key_here` with the actual service role key you copied in Step 4.

## Step 6: Deploy the Edge Function

Deploy the function to Supabase:

```bash
supabase functions deploy server
```

This will deploy the function located in `/supabase/functions/server/index.tsx`.

## Step 7: Verify Deployment

After deployment, you should see output like:

```
Deployed Function server with version xxx
```

## Step 8: Test the Deployment

1. Go to your TEALHOUSE admin page: `/admin/customers`
2. Click the **"Test Connection"** button
3. You should see green checkmarks for both endpoints

If you see any errors:
- Check the Supabase function logs: https://supabase.com/dashboard/project/ymnqgfpnfzrlinbdbkel/functions/server/logs
- Make sure the secrets are set correctly: `supabase secrets list`

## Troubleshooting

### Error: "Failed to fetch customers"

- Verify your Service Role Key is set correctly
- Check function logs for detailed error messages
- Ensure you're using the correct project ref

### Error: "Not authenticated" or "Unauthorized"

- Make sure you ran `supabase login` and are logged in
- Verify you have admin access to the Supabase project

### Error: Function not found

- Make sure you deployed with the correct function name: `server`
- Check that the function exists in your Supabase dashboard

## Additional Commands

View function logs:
```bash
supabase functions logs server
```

List all secrets:
```bash
supabase secrets list
```

Undeploy a function:
```bash
supabase functions delete server
```

## Need Help?

- Supabase Docs: https://supabase.com/docs/guides/functions
- Supabase Discord: https://discord.supabase.com
