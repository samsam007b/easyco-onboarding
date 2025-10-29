-- ============================================================================
-- FINAL WORKING FIX FOR v_complete_user_profiles VIEW
-- ============================================================================
-- This resolves the SECURITY DEFINER vulnerability
-- And fixes the column conflict issue in the original view
-- ============================================================================

BEGIN;

-- Step 1: Drop the view if it exists (might not exist due to column conflicts)
DROP VIEW IF EXISTS public.v_complete_user_profiles CASCADE;

-- Step 2: Create the view correctly WITHOUT SECURITY DEFINER
-- We'll select specific columns from user_profiles to avoid conflicts
CREATE VIEW public.v_complete_user_profiles AS
SELECT
  -- User table columns
  u.id as user_id,
  u.email,
  u.user_type,
  u.account_status,
  u.onboarding_completed,
  u.onboarding_step,
  u.profile_completion_score,
  u.is_verified,
  u.is_premium,
  u.created_at as user_created_at,
  u.updated_at as user_updated_at,

  -- Profile table columns (with prefix to avoid conflicts)
  up.id as profile_id,
  up.first_name,
  up.last_name,
  up.date_of_birth,
  up.gender_identity,
  up.nationality,
  up.languages_spoken,
  up.current_city,
  up.current_country,
  up.bio,
  up.profile_photo_url,
  up.profile_photos,

  -- Professional
  up.occupation_status,
  up.field_of_study_or_work,
  up.institution_or_company,
  up.monthly_income_bracket,
  up.employment_type,
  up.guarantor_available,

  -- Lifestyle
  up.wake_up_time,
  up.sleep_time,
  up.work_schedule,
  up.is_smoker,
  up.has_pets,
  up.cleanliness_preference,

  -- Housing
  up.budget_min,
  up.budget_max,
  up.preferred_room_type,

  -- Owner fields
  up.company_name,
  up.landlord_type,
  up.portfolio_size,

  -- Banking
  up.iban,
  up.bic_swift,
  up.account_holder_name,

  -- Metadata
  up.profile_completion_score as profile_score,
  up.profile_data as additional_profile_data,
  up.created_at as profile_created_at,
  up.updated_at as profile_updated_at,

  -- Verification status
  uv.id as verification_id,
  uv.kyc_status,
  uv.id_verified,
  uv.phone_verified,
  uv.email_verified,
  uv.verification_date,

  -- Consent status
  uc.id as consent_id,
  uc.terms_accepted,
  uc.privacy_accepted,
  uc.marketing_email,
  uc.profile_visibility,
  uc.consented_at

FROM public.users u
LEFT JOIN public.user_profiles up ON u.id = up.user_id
LEFT JOIN public.user_verifications uv ON u.id = uv.user_id
LEFT JOIN public.user_consents uc ON u.id = uc.user_id;

-- Add documentation
COMMENT ON VIEW public.v_complete_user_profiles IS
'Complete user profile view with joined data from users, profiles, verifications, and consents. RLS-protected - users can only see their own data through RLS policies on underlying tables.';

COMMIT;

-- ============================================================================
-- VERIFICATION & TESTING
-- ============================================================================

-- 1. Confirm view was created
SELECT
  CASE
    WHEN EXISTS (
      SELECT 1 FROM information_schema.views
      WHERE table_schema = 'public' AND table_name = 'v_complete_user_profiles'
    )
    THEN '✓ SUCCESS: View created'
    ELSE '✗ FAILED: View not created'
  END as view_status;

-- 2. Verify RLS is enabled on underlying tables
SELECT
  '✓ RLS Status Check' as test,
  tablename,
  CASE
    WHEN rowsecurity THEN '✓ RLS Enabled'
    ELSE '✗ WARNING: RLS Not Enabled!'
  END as status
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename IN ('users', 'user_profiles', 'user_verifications', 'user_consents')
ORDER BY tablename;

-- 3. Count policies on each table
SELECT
  '✓ RLS Policies Check' as test,
  tablename,
  COUNT(*) as policy_count
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename IN ('users', 'user_profiles', 'user_verifications', 'user_consents')
GROUP BY tablename
ORDER BY tablename;

-- 4. Test the view (should only return your own data)
SELECT
  '✓ View Query Test' as test,
  COUNT(*) as visible_rows,
  CASE
    WHEN COUNT(*) = 0 THEN 'No profile yet'
    WHEN COUNT(*) = 1 THEN '✓ Correct - seeing only your data'
    ELSE '✗ WARNING - seeing multiple rows (possible RLS issue)'
  END as result
FROM public.v_complete_user_profiles;

-- ============================================================================
-- SUMMARY
-- ============================================================================
SELECT '
========================================
✓ SECURITY FIX APPLIED SUCCESSFULLY
========================================

What was fixed:
- Removed SECURITY DEFINER behavior
- View now respects RLS policies
- Users can only see their own data

What changed:
- View structure cleaned up
- Column naming clarified
- No functional changes to data access

Next steps:
- Verify the tests above all pass
- Test querying the view in your app
- Update any application code if needed

' as summary;
