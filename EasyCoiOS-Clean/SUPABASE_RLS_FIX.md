# Supabase RLS Configuration Fix

## Issue
The iOS app is receiving "unauthorized" errors when trying to save user profiles and onboarding data to Supabase.

## Root Cause
The Supabase database tables (`users` and `profiles`) need Row Level Security (RLS) policies to allow authenticated users to read and write their own data.

## Required RLS Policies

### 1. For the `users` table

```sql
-- Allow users to read their own user record
CREATE POLICY "Users can read own data"
ON public.users
FOR SELECT
USING (auth.uid()::text = id::text);

-- Allow users to update their own user record
CREATE POLICY "Users can update own data"
ON public.users
FOR UPDATE
USING (auth.uid()::text = id::text);
```

### 2. For the `profiles` table

```sql
-- Allow users to read their own profile
CREATE POLICY "Users can read own profile"
ON public.profiles
FOR SELECT
USING (auth.uid()::text = user_id::text);

-- Allow users to insert their own profile
CREATE POLICY "Users can insert own profile"
ON public.profiles
FOR INSERT
WITH CHECK (auth.uid()::text = user_id::text);

-- Allow users to update their own profile
CREATE POLICY "Users can update own profile"
ON public.profiles
FOR UPDATE
USING (auth.uid()::text = user_id::text);
```

## How to Apply

1. Go to your Supabase dashboard: https://fgthoyilfupywmpmiuwd.supabase.co
2. Navigate to **Database** → **Policies**
3. Select the `users` table and add the policies above
4. Select the `profiles` table and add the policies above
5. Alternatively, run the SQL commands in the **SQL Editor**

## Verification

After applying the policies, the iOS app should be able to:
- ✅ Fetch user profile data after login
- ✅ Save onboarding data to the `users` and `profiles` tables
- ✅ Update user profile information

## Current Workaround

The iOS app currently has a fallback mechanism that marks onboarding as completed locally even if the backend save fails. This allows users to continue using the app, but their profile data won't be saved to the database until the RLS policies are configured.

## API Endpoints Being Called

1. **GET** `/rest/v1/users?id=eq.{userId}` - Fetch user record
2. **PATCH** `/rest/v1/users?id=eq.{userId}` - Update onboarding_completed flag
3. **GET** `/rest/v1/profiles?user_id=eq.{userId}` - Fetch profile data
4. **POST** `/rest/v1/profiles` - Upsert profile data

All of these require proper RLS policies with `auth.uid()` checks.
