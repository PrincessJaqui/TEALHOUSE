# 🚀 Quick Deployment Guide

Deploy your TEALHOUSE customer management backend in 5 minutes!

## Option 1: Automated Script (Easiest)

### Mac/Linux:
```bash
chmod +x deploy.sh
./deploy.sh
```

### Windows:
```bash
deploy.bat
```

The script will guide you through each step automatically.

## Option 2: Manual Steps

```bash
# 1. Install Supabase CLI
npm install -g supabase

# 2. Login
supabase login

# 3. Link your project
supabase link --project-ref ymnqgfpnfzrlinbdbkel

# 4. Set environment variables
supabase secrets set SUPABASE_URL=https://ymnqgfpnfzrlinbdbkel.supabase.co
supabase secrets set SUPABASE_SERVICE_ROLE_KEY=<your-service-role-key>

# 5. Deploy
supabase functions deploy server
```

## Where to Get Your Service Role Key

1. Go to: https://supabase.com/dashboard/project/ymnqgfpnfzrlinbdbkel/settings/api
2. Find the **"service_role" secret** key
3. Copy it (starts with "eyJ...")

⚠️ **Important**: Keep this key secret! Never commit it to git.

## Test Your Deployment

1. Go to `/admin/customers` in your TEALHOUSE app
2. Click **"Test Connection"** button
3. You should see ✅ green checkmarks

## Troubleshooting

### Function not found?
- Make sure you deployed with: `supabase functions deploy server`
- Check your dashboard: https://supabase.com/dashboard/project/ymnqgfpnfzrlinbdbkel/functions

### Authorization errors?
- Verify your Service Role Key is set correctly
- Run: `supabase secrets list` to check

### View logs:
```bash
supabase functions logs server
```

## Need Help?

- 📖 Full documentation: See [SUPABASE_DEPLOYMENT.md](./SUPABASE_DEPLOYMENT.md)
- 💬 Supabase Discord: https://discord.supabase.com
- 📚 Supabase Docs: https://supabase.com/docs/guides/functions
