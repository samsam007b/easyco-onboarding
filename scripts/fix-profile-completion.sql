-- ============================================================================
-- FIX: Create missing calculate_profile_completion function
-- ============================================================================
-- Run this in Supabase SQL Editor or locally
-- ============================================================================

-- Drop existing versions if any
DROP FUNCTION IF EXISTS public.calculate_profile_completion(UUID);
DROP FUNCTION IF EXISTS public.calculate_profile_completion(profile_id UUID);
DROP TRIGGER IF EXISTS update_profile_completion_trigger ON user_profiles;
DROP FUNCTION IF EXISTS public.update_profile_completion();

-- Create the calculate_profile_completion function
CREATE OR REPLACE FUNCTION public.calculate_profile_completion(user_id_param UUID)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  completion_score INTEGER := 0;
  total_fields INTEGER := 20;
  filled_fields INTEGER := 0;
  profile_record RECORD;
BEGIN
  -- Get the user profile
  SELECT * INTO profile_record
  FROM user_profiles
  WHERE user_id = user_id_param;

  IF NOT FOUND THEN
    RETURN 0;
  END IF;

  -- Count filled basic fields
  IF profile_record.first_name IS NOT NULL AND profile_record.first_name != '' THEN filled_fields := filled_fields + 1; END IF;
  IF profile_record.last_name IS NOT NULL AND profile_record.last_name != '' THEN filled_fields := filled_fields + 1; END IF;
  IF profile_record.phone_number IS NOT NULL AND profile_record.phone_number != '' THEN filled_fields := filled_fields + 1; END IF;
  IF profile_record.date_of_birth IS NOT NULL THEN filled_fields := filled_fields + 1; END IF;
  IF profile_record.gender_identity IS NOT NULL AND profile_record.gender_identity != '' THEN filled_fields := filled_fields + 1; END IF;
  IF profile_record.nationality IS NOT NULL AND profile_record.nationality != '' THEN filled_fields := filled_fields + 1; END IF;
  IF profile_record.current_city IS NOT NULL AND profile_record.current_city != '' THEN filled_fields := filled_fields + 1; END IF;
  IF profile_record.languages_spoken IS NOT NULL AND array_length(profile_record.languages_spoken, 1) > 0 THEN filled_fields := filled_fields + 1; END IF;
  IF profile_record.profile_photo_url IS NOT NULL AND profile_record.profile_photo_url != '' THEN filled_fields := filled_fields + 1; END IF;
  IF profile_record.bio IS NOT NULL AND profile_record.bio != '' THEN filled_fields := filled_fields + 1; END IF;

  -- Count professional fields (for residents/searchers)
  IF profile_record.user_type IN ('resident', 'searcher') THEN
    IF profile_record.occupation_status IS NOT NULL AND profile_record.occupation_status != '' THEN filled_fields := filled_fields + 1; END IF;
    IF profile_record.field_of_study_or_work IS NOT NULL AND profile_record.field_of_study_or_work != '' THEN filled_fields := filled_fields + 1; END IF;
    IF profile_record.institution_or_company IS NOT NULL AND profile_record.institution_or_company != '' THEN filled_fields := filled_fields + 1; END IF;
    IF profile_record.monthly_income_bracket IS NOT NULL AND profile_record.monthly_income_bracket != '' THEN filled_fields := filled_fields + 1; END IF;
  END IF;

  -- Count owner-specific fields
  IF profile_record.user_type = 'owner' THEN
    IF profile_record.company_name IS NOT NULL AND profile_record.company_name != '' THEN filled_fields := filled_fields + 1; END IF;
    IF profile_record.landlord_type IS NOT NULL AND profile_record.landlord_type != '' THEN filled_fields := filled_fields + 1; END IF;
    IF profile_record.portfolio_size IS NOT NULL THEN filled_fields := filled_fields + 1; END IF;
    IF profile_record.management_type IS NOT NULL AND profile_record.management_type != '' THEN filled_fields := filled_fields + 1; END IF;
    IF profile_record.iban IS NOT NULL AND profile_record.iban != '' THEN filled_fields := filled_fields + 1; END IF;
    IF profile_record.bic_swift IS NOT NULL AND profile_record.bic_swift != '' THEN filled_fields := filled_fields + 1; END IF;
  END IF;

  -- Calculate percentage
  completion_score := (filled_fields * 100) / total_fields;

  RETURN completion_score;
END;
$$;

-- Create the trigger function
CREATE OR REPLACE FUNCTION public.update_profile_completion()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.profile_completion_score := public.calculate_profile_completion(NEW.user_id);
  RETURN NEW;
END;
$$;

-- Create the trigger
CREATE TRIGGER update_profile_completion_trigger
  BEFORE INSERT OR UPDATE ON user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_profile_completion();

-- Verification
SELECT 'calculate_profile_completion function created!' AS status;
