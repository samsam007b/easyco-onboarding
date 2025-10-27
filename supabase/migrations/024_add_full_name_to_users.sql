-- Migration: Add full_name column to users table
-- This fixes critical bug #2: Notifications functions reference full_name but column doesn't exist
-- Created: 2025-10-27

-- Add full_name column to users table
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS full_name TEXT;

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_users_full_name ON public.users(full_name);

-- Populate full_name from existing user_profiles data
UPDATE public.users u
SET full_name = COALESCE(
  (SELECT TRIM(CONCAT_WS(' ', up.first_name, up.last_name))
   FROM user_profiles up
   WHERE up.user_id = u.id
   AND (up.first_name IS NOT NULL OR up.last_name IS NOT NULL)),
  SPLIT_PART(u.email, '@', 1) -- Fallback to email username
);

-- Create trigger to keep full_name in sync with user_profiles
CREATE OR REPLACE FUNCTION sync_user_full_name()
RETURNS TRIGGER AS $$
BEGIN
  -- Update users.full_name when user_profiles.first_name or last_name changes
  UPDATE public.users
  SET full_name = TRIM(CONCAT_WS(' ', NEW.first_name, NEW.last_name))
  WHERE id = NEW.user_id
  AND (NEW.first_name IS NOT NULL OR NEW.last_name IS NOT NULL);

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop trigger if exists and recreate
DROP TRIGGER IF EXISTS trigger_sync_user_full_name ON user_profiles;

CREATE TRIGGER trigger_sync_user_full_name
  AFTER INSERT OR UPDATE OF first_name, last_name
  ON user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION sync_user_full_name();

-- Add comment for documentation
COMMENT ON COLUMN public.users.full_name IS 'Full name of user, synced from user_profiles.first_name and last_name via trigger';
