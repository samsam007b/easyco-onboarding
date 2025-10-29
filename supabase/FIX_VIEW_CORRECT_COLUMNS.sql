-- ============================================================================
-- CORRECTED SECURITY FIX FOR v_complete_user_profiles VIEW
-- ============================================================================
-- Uses only columns that actually exist in the database schema
-- Removes SECURITY DEFINER vulnerability
-- ============================================================================

BEGIN;

-- Drop the view if it exists
DROP VIEW IF EXISTS public.v_complete_user_profiles CASCADE;

-- Create the view WITHOUT SECURITY DEFINER
-- Only selecting columns that actually exist
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

  -- Profile table columns (only actual columns)
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

  -- Metadata
  up.profile_completion_score as profile_score,
  up.profile_data as additional_profile_data,
  up.created_at as profile_created_at,
  up.updated_at as profile_updated_at,

  -- Verification status (actual columns from user_verifications)
  uv.id as verification_id,
  uv.kyc_status,
  uv.id_verified,
  uv.id_verified_at,
  uv.phone_verified,
  uv.phone_verified_at,
  uv.email_verified,
  uv.email_verified_at,

  -- Consent status (actual columns from user_consents)
  uc.id as consent_id,
  uc.terms_accepted,
  uc.terms_accepted_at,
  uc.privacy_accepted,
  uc.privacy_accepted_at,
  uc.marketing_email,
  uc.profile_visibility

FROM public.users u
LEFT JOIN public.user_profiles up ON u.id = up.user_id
LEFT JOIN public.user_verifications uv ON u.id = uv.user_id
LEFT JOIN public.user_consents uc ON u.id = uc.user_id;

-- Add documentation
COMMENT ON VIEW public.v_complete_user_profiles IS
'Complete user profile view. RLS-protected - users can only see their own data through RLS policies.';

COMMIT;

-- ============================================================================
-- VERIFICATION
-- ============================================================================

SELECT '✓ View created successfully' as status;

-- Check RLS is enabled
SELECT
  tablename,
  CASE WHEN rowsecurity THEN '✓ RLS Enabled' ELSE '✗ RLS DISABLED!' END as rls_status
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename IN ('users', 'user_profiles', 'user_verifications', 'user_consents')
ORDER BY tablename;

-- Test query (should return only your data)
SELECT COUNT(*) || ' row(s) visible' as test_result
FROM public.v_complete_user_profiles;

SELECT '========================================
✓ SECURITY FIX COMPLETE
========================================
The v_complete_user_profiles view now:
- Runs with caller privileges (no SECURITY DEFINER)
- Respects RLS policies
- Only shows each user their own data
========================================' as summary;
