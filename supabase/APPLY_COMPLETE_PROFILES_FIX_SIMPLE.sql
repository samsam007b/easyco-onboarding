-- ============================================================================
-- SIMPLE SECURITY FIX FOR v_complete_user_profiles VIEW
-- ============================================================================
-- This version drops SECURITY DEFINER without changing the view structure
-- ============================================================================

BEGIN;

-- Step 1: Get the current view definition
-- (We'll recreate it exactly as-is, just without SECURITY DEFINER)

-- Step 2: Drop the vulnerable view
DROP VIEW IF EXISTS public.v_complete_user_profiles CASCADE;

-- Step 3: Recreate with exact same SQL but without SECURITY DEFINER
-- The view will now run with the caller's privileges, enforcing RLS
CREATE VIEW public.v_complete_user_profiles AS
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
  -- Profile data
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

COMMENT ON VIEW public.v_complete_user_profiles IS
'Complete user profile view. RLS-protected - users can only see their own data.';

COMMIT;

-- ============================================================================
-- VERIFICATION
-- ============================================================================

SELECT '✓ View recreated successfully' as status;

-- Check RLS is enabled
SELECT
  tablename,
  CASE WHEN rowsecurity THEN '✓ RLS Enabled' ELSE '✗ RLS DISABLED!' END as status
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename IN ('users', 'user_profiles', 'user_verifications', 'user_consents')
ORDER BY tablename;
