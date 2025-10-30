-- Fix function conflicts before applying main migrations
-- This should run first

-- Drop conflicting functions if they exist
DROP FUNCTION IF EXISTS public.calculate_profile_completion(UUID);
DROP FUNCTION IF EXISTS public.calculate_profile_completion(profile_id UUID);
