-- Migration 009: Add Resident Profile Columns
-- This migration adds all columns needed for the Resident role onboarding

ALTER TABLE public.user_profiles
  -- Lifestyle columns (for Resident role)
  ADD COLUMN IF NOT EXISTS wake_up_time TEXT CHECK (wake_up_time IN ('early', 'average', 'late')),
  ADD COLUMN IF NOT EXISTS sleep_time TEXT CHECK (sleep_time IN ('before_23h', '23h_01h', 'after_01h')),
  ADD COLUMN IF NOT EXISTS smoker BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS cleanliness_preference INTEGER CHECK (cleanliness_preference >= 1 AND cleanliness_preference <= 10),

  -- Personality columns (for Resident role)
  ADD COLUMN IF NOT EXISTS introvert_extrovert_scale INTEGER CHECK (introvert_extrovert_scale >= 1 AND introvert_extrovert_scale <= 5),
  ADD COLUMN IF NOT EXISTS sociability_level TEXT CHECK (sociability_level IN ('low', 'medium', 'high')),
  ADD COLUMN IF NOT EXISTS preferred_interaction_type TEXT CHECK (preferred_interaction_type IN ('cozy_evenings', 'independent_living', 'community_events')),
  ADD COLUMN IF NOT EXISTS home_activity_level TEXT CHECK (home_activity_level IN ('quiet', 'social', 'very_active')),

  -- Living situation columns (for Resident role)
  ADD COLUMN IF NOT EXISTS move_in_date DATE;

-- Add comments for documentation
COMMENT ON COLUMN public.user_profiles.wake_up_time IS 'Preferred wake-up time (early/average/late)';
COMMENT ON COLUMN public.user_profiles.sleep_time IS 'Typical sleep time (before_23h/23h_01h/after_01h)';
COMMENT ON COLUMN public.user_profiles.smoker IS 'Whether the user smokes';
COMMENT ON COLUMN public.user_profiles.cleanliness_preference IS 'Cleanliness preference on scale 1-10';
COMMENT ON COLUMN public.user_profiles.introvert_extrovert_scale IS 'Introvert to extrovert scale 1-5 (1=introvert, 5=extrovert)';
COMMENT ON COLUMN public.user_profiles.sociability_level IS 'Social activity level (low/medium/high)';
COMMENT ON COLUMN public.user_profiles.preferred_interaction_type IS 'Preferred living style with roommates';
COMMENT ON COLUMN public.user_profiles.home_activity_level IS 'How active the user is at home (quiet/social/very_active)';
COMMENT ON COLUMN public.user_profiles.move_in_date IS 'Date when the resident moved into their current coliving space';

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_user_profiles_wake_up_time ON public.user_profiles(wake_up_time) WHERE wake_up_time IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_user_profiles_sleep_time ON public.user_profiles(sleep_time) WHERE sleep_time IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_user_profiles_smoker ON public.user_profiles(smoker) WHERE smoker IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_user_profiles_cleanliness_preference ON public.user_profiles(cleanliness_preference) WHERE cleanliness_preference IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_user_profiles_introvert_extrovert_scale ON public.user_profiles(introvert_extrovert_scale) WHERE introvert_extrovert_scale IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_user_profiles_sociability_level ON public.user_profiles(sociability_level) WHERE sociability_level IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_user_profiles_move_in_date ON public.user_profiles(move_in_date) WHERE move_in_date IS NOT NULL;
