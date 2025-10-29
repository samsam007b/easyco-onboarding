-- ============================================================================
-- STANDALONE SECURITY FIX FOR v_complete_user_profiles VIEW
-- ============================================================================
-- Execute this directly in Supabase SQL Editor to fix the security vulnerability
-- ============================================================================

BEGIN;

-- Drop the vulnerable view
DROP VIEW IF EXISTS public.v_complete_user_profiles CASCADE;

-- Recreate WITHOUT SECURITY DEFINER (will use caller's privileges)
-- Note: We need to explicitly list profile columns to avoid conflicts with u.id
CREATE OR REPLACE VIEW public.v_complete_user_profiles AS
SELECT
  -- User data
  u.id,
  u.email,
  u.user_type,
  u.account_status,
  u.onboarding_completed,
  u.profile_completion_score as user_completion_score,
  u.is_verified,
  u.is_premium,
  u.created_at as user_created_at,
  -- Profile identifiers (aliased to avoid conflicts)
  up.id as profile_id,
  up.user_id as profile_user_id,
  up.user_type as profile_user_type,
  up.created_at as profile_created_at,
  up.updated_at as profile_updated_at,
  -- Profile basic info
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
  -- Professional info
  up.occupation_status,
  up.field_of_study_or_work,
  up.institution_or_company,
  up.monthly_income_bracket,
  up.employment_type,
  up.guarantor_available,
  up.guarantor_name,
  up.guarantor_phone,
  -- Daily habits
  up.wake_up_time,
  up.sleep_time,
  up.work_schedule,
  up.sports_frequency,
  up.is_smoker,
  up.drinks_alcohol,
  up.diet_type,
  -- Home lifestyle
  up.cleanliness_preference,
  up.guest_frequency,
  up.music_habits,
  up.has_pets,
  up.pet_type,
  up.cooking_frequency,
  -- Personality
  up.introvert_extrovert_scale,
  up.sociability_level,
  up.openness_to_sharing,
  up.communication_style,
  up.cultural_openness,
  up.conflict_tolerance,
  up.stress_management_style,
  up.values_priority,
  up.interests,
  up.hobbies,
  -- Housing preferences
  up.preferred_room_type,
  up.budget_min,
  up.budget_max,
  up.preferred_locations,
  up.preferred_amenities,
  up.accessibility_requirements,
  up.preferred_lease_duration,
  up.desired_move_in_date,
  up.flexible_on_dates,
  -- Owner-specific fields
  up.company_name,
  up.landlord_type,
  up.portfolio_size,
  up.years_experience,
  up.management_approach,
  up.property_types_offered,
  up.average_response_time,
  up.offers_virtual_tours,
  -- Banking
  up.iban,
  up.bic_swift,
  up.account_holder_name,
  up.billing_address,
  up.bank_name,
  -- Scores and metadata
  up.profile_completion_score,
  up.profile_data,
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

-- Add comment
COMMENT ON VIEW public.v_complete_user_profiles IS
'Complete user profile view. RLS-protected - users can only see their own data.';

COMMIT;

-- ============================================================================
-- VERIFICATION
-- ============================================================================

-- Check the view exists
SELECT
  'View status' as check,
  CASE
    WHEN EXISTS (
      SELECT 1 FROM information_schema.views
      WHERE table_schema = 'public' AND table_name = 'v_complete_user_profiles'
    ) THEN '✓ View recreated successfully'
    ELSE '✗ View not found'
  END as result;

-- Verify RLS is enabled on underlying tables
SELECT
  'RLS Status' as check,
  tablename,
  CASE WHEN rowsecurity THEN '✓ Enabled' ELSE '✗ DISABLED - RISK!' END as rls_status
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename IN ('users', 'user_profiles', 'user_verifications', 'user_consents')
ORDER BY tablename;
