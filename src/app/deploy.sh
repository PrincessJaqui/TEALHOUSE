#!/bin/bash

# TEALHOUSE Supabase Deployment Script
# This script helps you deploy the customer management backend to Supabase

set -e  # Exit on error

echo "🏠 TEALHOUSE Supabase Deployment Script"
echo "========================================"
echo ""

PROJECT_REF="ymnqgfpnfzrlinbdbkel"
SUPABASE_URL="https://ymnqgfpnfzrlinbdbkel.supabase.co"

# Check if Supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    echo "❌ Supabase CLI not found."
    echo ""
    echo "Please install it first:"
    echo "  npm install -g supabase"
    echo ""
    echo "Or use npx (no installation needed):"
    echo "  npx supabase login"
    echo ""
    exit 1
fi

echo "✅ Supabase CLI found"
echo ""

# Step 1: Login
echo "📝 Step 1: Login to Supabase"
echo "----------------------------"
echo "Running: supabase login"
echo ""
supabase login
echo ""

# Step 2: Link project
echo "🔗 Step 2: Link to your Supabase project"
echo "----------------------------------------"
echo "Running: supabase link --project-ref $PROJECT_REF"
echo ""
supabase link --project-ref $PROJECT_REF
echo ""

# Step 3: Set secrets
echo "🔐 Step 3: Set environment variables"
echo "------------------------------------"
echo ""
echo "First, let's set SUPABASE_URL..."
supabase secrets set SUPABASE_URL=$SUPABASE_URL
echo ""

echo "Now, you need to set your SUPABASE_SERVICE_ROLE_KEY"
echo ""
echo "🔍 Where to find it:"
echo "   1. Go to: https://supabase.com/dashboard/project/$PROJECT_REF/settings/api"
echo "   2. Find the 'service_role' secret key"
echo "   3. Copy it (it starts with 'eyJ...')"
echo ""
read -p "📋 Paste your Service Role Key here: " SERVICE_ROLE_KEY
echo ""

if [ -z "$SERVICE_ROLE_KEY" ]; then
    echo "❌ Service Role Key cannot be empty"
    exit 1
fi

echo "Setting SUPABASE_SERVICE_ROLE_KEY..."
supabase secrets set SUPABASE_SERVICE_ROLE_KEY=$SERVICE_ROLE_KEY
echo ""

# Step 4: Deploy function
echo "🚀 Step 4: Deploy Edge Function"
echo "-------------------------------"
echo "Running: supabase functions deploy server"
echo ""
supabase functions deploy server
echo ""

# Step 5: Verify
echo "✅ Deployment Complete!"
echo "======================"
echo ""
echo "🎉 Your customer management backend is now live!"
echo ""
echo "📍 Function URL:"
echo "   $SUPABASE_URL/functions/v1/make-server-d1960f17"
echo ""
echo "🧪 Next Steps:"
echo "   1. Go to: /admin/customers in your TEALHOUSE app"
echo "   2. Click 'Test Connection' button"
echo "   3. You should see green checkmarks ✅"
echo ""
echo "📊 View logs:"
echo "   https://supabase.com/dashboard/project/$PROJECT_REF/functions/server/logs"
echo ""
echo "🔍 Debug if needed:"
echo "   supabase functions logs server"
echo ""
