-- ============================================================================
-- DIAGNOSTIC SCRIPT - Verify user_profiles Schema
-- ============================================================================
-- Run this in Supabase SQL Editor to see which columns exist in user_profiles
-- ============================================================================

-- List ALL columns in user_profiles table
SELECT
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'user_profiles'
ORDER BY ordinal_position;

-- ============================================================================
-- Check which OWNER columns are MISSING
-- ============================================================================

WITH required_owner_columns AS (
  SELECT unnest(ARRAY[
    'phone_number',
    'owner_type',
    'primary_location',
    'hosting_experience',
    'has_property',
    'property_city',
    'property_type',
    'iban',
    'swift_bic',
    'experience_years',
    'management_type',
    'primary_motivation',
    'owner_bio',
    'pets_allowed_policy',
    'smoking_allowed',
    'minimum_lease_duration_months',
    'deposit_amount_months',
    'notice_period_days',
    'amenities',
    'included_services'
  ]) AS column_name
),
existing_columns AS (
  SELECT column_name
  FROM information_schema.columns
  WHERE table_schema = 'public'
    AND table_name = 'user_profiles'
)
SELECT
  r.column_name,
  CASE
    WHEN e.column_name IS NOT NULL THEN '✅ EXISTS'
    ELSE '❌ MISSING'
  END AS status
FROM required_owner_columns r
LEFT JOIN existing_columns e ON r.column_name = e.column_name
ORDER BY status DESC, r.column_name;
