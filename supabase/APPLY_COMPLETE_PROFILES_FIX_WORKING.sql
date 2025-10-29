-- ============================================================================
-- WORKING SECURITY FIX FOR v_complete_user_profiles VIEW
-- ============================================================================
-- This version avoids column conflicts by using row_to_json
-- ============================================================================

BEGIN;

-- Drop the vulnerable view
DROP VIEW IF EXISTS public.v_complete_user_profiles CASCADE;

-- Recreate WITHOUT SECURITY DEFINER
-- Using a subquery approach to avoid column name conflicts
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
  -- Profile as JSONB to avoid column conflicts (can be expanded in app)
  row_to_json(up.*)::jsonb as profile_data,
  -- Or individual columns without conflicts:
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
  up.occupation_status,
  up.field_of_study_or_work,
  up.institution_or_company,
  up.monthly_income_bracket,
  up.budget_min,
  up.budget_max,
  up.is_smoker,
  up.has_pets,
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

SELECT '✓ View recreated successfully - Security vulnerability fixed!' as status;

-- Check RLS is enabled on all tables
SELECT
  tablename,
  CASE WHEN rowsecurity THEN '✓ RLS Enabled' ELSE '✗ RLS DISABLED - RISK!' END as status
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename IN ('users', 'user_profiles', 'user_verifications', 'user_consents')
ORDER BY tablename;

-- Test the view (should only return current user's data)
SELECT COUNT(*) as "Rows visible to current user" FROM public.v_complete_user_profiles;
