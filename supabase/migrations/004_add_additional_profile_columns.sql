-- Migration: Add Additional Searcher Profile Columns
-- Date: 2025-10-26
-- Description: Add missing columns for Financial Info and Community Events pages

-- Add financial and community columns to user_profiles table
ALTER TABLE public.user_profiles
  -- Financial Info (alternative to monthly_income_bracket for more granular data)
  ADD COLUMN IF NOT EXISTS income_range TEXT
    CHECK (income_range IN ('under-1000', '1000-1500', '1500-2000', '2000-3000', '3000-5000', 'over-5000')),

  -- Community Events preferences
  ADD COLUMN IF NOT EXISTS event_interest TEXT
    CHECK (event_interest IN ('low', 'medium', 'high')),
  ADD COLUMN IF NOT EXISTS open_to_meetups BOOLEAN DEFAULT FALSE;

-- Add comments for documentation
COMMENT ON COLUMN public.user_profiles.income_range IS 'Monthly income range selected during additional profile (alternative to monthly_income_bracket)';
COMMENT ON COLUMN public.user_profiles.event_interest IS 'Interest level in community events and social gatherings';
COMMENT ON COLUMN public.user_profiles.open_to_meetups IS 'Willingness to participate in flatmate meetups and hangouts';

-- Note:
-- - guarantor_available already exists (not has_guarantor)
-- - shared_meals_interest already exists (not enjoy_shared_meals)
-- - employment_type already exists
