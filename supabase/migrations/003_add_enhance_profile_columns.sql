-- Migration: Add Enhanced Profile Columns
-- Date: 2025-10-26
-- Description: Add missing columns for enhanced profile feature

-- Add enhanced profile columns to user_profiles table
ALTER TABLE public.user_profiles
  ADD COLUMN IF NOT EXISTS about_me TEXT,
  ADD COLUMN IF NOT EXISTS looking_for TEXT,
  ADD COLUMN IF NOT EXISTS core_values TEXT[],
  ADD COLUMN IF NOT EXISTS important_qualities TEXT[],
  ADD COLUMN IF NOT EXISTS deal_breakers TEXT[];

-- Add comments for documentation
COMMENT ON COLUMN public.user_profiles.about_me IS 'Detailed description about the user (optional, max 500 chars)';
COMMENT ON COLUMN public.user_profiles.looking_for IS 'What the user is looking for in a coliving situation (optional, max 300 chars)';
COMMENT ON COLUMN public.user_profiles.core_values IS 'Array of core values selected by user (max 5)';
COMMENT ON COLUMN public.user_profiles.important_qualities IS 'Array of important qualities in a roommate';
COMMENT ON COLUMN public.user_profiles.deal_breakers IS 'Array of unacceptable behaviors/situations';

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_user_profiles_core_values ON public.user_profiles USING GIN (core_values);
CREATE INDEX IF NOT EXISTS idx_user_profiles_important_qualities ON public.user_profiles USING GIN (important_qualities);
CREATE INDEX IF NOT EXISTS idx_user_profiles_deal_breakers ON public.user_profiles USING GIN (deal_breakers);
