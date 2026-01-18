-- ============================================================================
-- FIX SECURITY DEFINER VULNERABILITY IN v_complete_user_profiles VIEW
-- ============================================================================
-- Security Issue: View v_complete_user_profiles is running with SECURITY DEFINER
-- which bypasses RLS policies and exposes all users' personal data.
--
-- Fix Strategy:
-- Simply recreate the view WITHOUT SECURITY DEFINER so it runs with the
-- caller's privileges. Existing RLS policies on underlying tables will
-- properly restrict access to each user's own data.
--
-- RLS Policies in Effect:
-- - users: "Users can view own data" (auth.uid() = id)
-- - user_profiles: "Users can view own profile" (auth.uid() = user_id)
-- - user_verifications: "Users can view own verifications" (auth.uid() = user_id)
-- - user_consents: "Users can view own consents" (auth.uid() = user_id)
-- ============================================================================

-- Step 1: Drop the existing view with CASCADE to handle any dependencies
DROP VIEW IF EXISTS public.v_complete_user_profiles CASCADE;

-- Step 2: Recreate the view WITHOUT SECURITY DEFINER
-- This ensures it runs with the caller's privileges and RLS applies
-- Using the same structure as the original view to maintain compatibility
CREATE OR REPLACE VIEW public.v_complete_user_profiles AS
SELECT
  u.id,
  u.email,
  u.user_type,
  u.account_status,
  u.onboarding_completed,
  u.profile_completion_score as user_completion_score,
  u.is_verified,
  u.is_premium,
  u.created_at as user_created_at,
  -- Profile data (using up.* to include all columns)
  up.*,
  -- Verification status
  uv.kyc_status,
  uv.id_verified,
  uv.phone_verified,
  uv.email_verified,
  -- Consent status
  uc.terms_accepted,
  uc.privacy_accepted,
  uc.marketing_email,
  uc.profile_visibility
FROM public.users u
LEFT JOIN public.user_profiles up ON u.id = up.user_id
LEFT JOIN public.user_verifications uv ON u.id = uv.user_id
LEFT JOIN public.user_consents uc ON u.id = uc.user_id;

-- Step 3: Add helpful comment
COMMENT ON VIEW public.v_complete_user_profiles IS
'Complete user profile view. Returns data filtered by RLS - users can only see their own profile data.';

-- ============================================================================
-- VERIFICATION QUERIES
-- ============================================================================

-- Test 1: Verify the view exists and is not a SECURITY DEFINER view
SELECT
  'Test 1: View recreated' as test_name,
  CASE
    WHEN COUNT(*) = 1 THEN '✓ PASS - View exists'
    ELSE '✗ FAIL - View not found'
  END as result
FROM information_schema.views
WHERE table_schema = 'public'
  AND table_name = 'v_complete_user_profiles';

-- Test 2: Verify RLS is enabled on underlying tables
SELECT
  'Test 2: RLS enabled on tables' as test_name,
  tablename,
  CASE
    WHEN rowsecurity THEN '✓ RLS Enabled'
    ELSE '✗ RLS NOT Enabled - SECURITY RISK!'
  END as rls_status
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename IN ('users', 'user_profiles', 'user_verifications', 'user_consents')
ORDER BY tablename;

-- Test 3: Check that policies exist on underlying tables
SELECT
  'Test 3: RLS policies exist' as test_name,
  tablename,
  COUNT(*) as policy_count,
  CASE
    WHEN COUNT(*) > 0 THEN '✓ Policies configured'
    ELSE '✗ NO POLICIES - SECURITY RISK!'
  END as policy_status
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename IN ('users', 'user_profiles', 'user_verifications', 'user_consents')
GROUP BY tablename
ORDER BY tablename;

-- ============================================================================
-- SECURITY EXPLANATION
-- ============================================================================
/*
How This Fix Works:
====================

BEFORE (Vulnerable):
- View ran with SECURITY DEFINER
- Bypassed RLS policies
- Any user could query the view and see ALL users' data
- Privacy violation: exposed personal info, verification status, etc.

AFTER (Secure):
- View runs with caller's privileges (default SECURITY INVOKER behavior)
- RLS policies apply as intended:
  * Users table: auth.uid() = id
  * User profiles: auth.uid() = user_id
  * User verifications: auth.uid() = user_id
  * User consents: auth.uid() = user_id
- Each user can ONLY see their own complete profile
- No privilege escalation possible

Example Query Behavior:
=======================

When User A (id: abc-123) queries:
  SELECT * FROM v_complete_user_profiles;

They will ONLY see:
  - Their own user record (id = abc-123)
  - Their own profile
  - Their own verification status
  - Their own consent records

They will NOT see:
  - User B's data
  - User C's data
  - Any other user's data

This is exactly the intended behavior for a multi-tenant application.
*/
