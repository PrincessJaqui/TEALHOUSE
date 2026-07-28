@echo off
REM TEALHOUSE Supabase Deployment Script (Windows)
REM This script helps you deploy the customer management backend to Supabase

echo.
echo ========================================
echo TEALHOUSE Supabase Deployment Script
echo ========================================
echo.

set PROJECT_REF=ymnqgfpnfzrlinbdbkel
set SUPABASE_URL=https://ymnqgfpnfzrlinbdbkel.supabase.co

REM Check if Supabase CLI is installed
where supabase >nul 2>nul
if %errorlevel% neq 0 (
    echo ERROR: Supabase CLI not found.
    echo.
    echo Please install it first:
    echo   npm install -g supabase
    echo.
    echo Or use npx no installation needed:
    echo   npx supabase login
    echo.
    pause
    exit /b 1
)

echo [OK] Supabase CLI found
echo.

REM Step 1: Login
echo ====================================
echo Step 1: Login to Supabase
echo ====================================
echo.
echo Running: supabase login
echo.
call supabase login
if %errorlevel% neq 0 exit /b %errorlevel%
echo.

REM Step 2: Link project
echo ====================================
echo Step 2: Link to your Supabase project
echo ====================================
echo.
echo Running: supabase link --project-ref %PROJECT_REF%
echo.
call supabase link --project-ref %PROJECT_REF%
if %errorlevel% neq 0 exit /b %errorlevel%
echo.

REM Step 3: Set secrets
echo ====================================
echo Step 3: Set environment variables
echo ====================================
echo.
echo First, let's set SUPABASE_URL...
call supabase secrets set SUPABASE_URL=%SUPABASE_URL%
if %errorlevel% neq 0 exit /b %errorlevel%
echo.

echo Now, you need to set your SUPABASE_SERVICE_ROLE_KEY
echo.
echo Where to find it:
echo   1. Go to: https://supabase.com/dashboard/project/%PROJECT_REF%/settings/api
echo   2. Find the 'service_role' secret key
echo   3. Copy it it starts with 'eyJ...'
echo.
set /p SERVICE_ROLE_KEY="Paste your Service Role Key here: "
echo.

if "%SERVICE_ROLE_KEY%"=="" (
    echo ERROR: Service Role Key cannot be empty
    pause
    exit /b 1
)

echo Setting SUPABASE_SERVICE_ROLE_KEY...
call supabase secrets set SUPABASE_SERVICE_ROLE_KEY=%SERVICE_ROLE_KEY%
if %errorlevel% neq 0 exit /b %errorlevel%
echo.

REM Step 4: Deploy function
echo ====================================
echo Step 4: Deploy Edge Function
echo ====================================
echo.
echo Running: supabase functions deploy server
echo.
call supabase functions deploy server
if %errorlevel% neq 0 exit /b %errorlevel%
echo.

REM Step 5: Verify
echo ====================================
echo Deployment Complete!
echo ====================================
echo.
echo [SUCCESS] Your customer management backend is now live!
echo.
echo Function URL:
echo   %SUPABASE_URL%/functions/v1/make-server-d1960f17
echo.
echo Next Steps:
echo   1. Go to: /admin/customers in your TEALHOUSE app
echo   2. Click 'Test Connection' button
echo   3. You should see green checkmarks
echo.
echo View logs:
echo   https://supabase.com/dashboard/project/%PROJECT_REF%/functions/server/logs
echo.
echo Debug if needed:
echo   supabase functions logs server
echo.
pause
