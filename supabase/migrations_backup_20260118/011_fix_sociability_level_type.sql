-- Migration to fix sociability_level column type
-- Problem: Column was created as INTEGER in migration 002, but code expects TEXT
-- This migration changes it from INTEGER to TEXT with proper constraints

-- First, drop the column if it exists as INTEGER
ALTER TABLE user_profiles
DROP COLUMN IF EXISTS sociability_level;

-- Recreate as TEXT with proper CHECK constraint
ALTER TABLE user_profiles
ADD COLUMN sociability_level TEXT CHECK (sociability_level IN ('low', 'medium', 'high'));

-- Do the same for dependent_profiles table
ALTER TABLE dependent_profiles
DROP COLUMN IF EXISTS sociability_level;

ALTER TABLE dependent_profiles
ADD COLUMN sociability_level TEXT CHECK (sociability_level IN ('low', 'medium', 'high'));

-- Add comment explaining the column
COMMENT ON COLUMN user_profiles.sociability_level IS 'Social energy level: low (introvert), medium (moderate), high (extrovert)';
COMMENT ON COLUMN dependent_profiles.sociability_level IS 'Social energy level: low (introvert), medium (moderate), high (extrovert)';
