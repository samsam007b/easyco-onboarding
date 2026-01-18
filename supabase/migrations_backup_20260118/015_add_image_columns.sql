-- Add image columns to properties table
ALTER TABLE public.properties
  ADD COLUMN IF NOT EXISTS images TEXT[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS main_image TEXT;

-- Add avatar/profile image to user_profiles
ALTER TABLE public.user_profiles
  ADD COLUMN IF NOT EXISTS avatar_url TEXT;

-- Update users table avatar_url if not exists
ALTER TABLE public.users
  ADD COLUMN IF NOT EXISTS avatar_url TEXT;

-- Create storage buckets (these should be created via Supabase Dashboard or API)
-- But we'll document the required buckets here:

-- REQUIRED STORAGE BUCKETS (create via Supabase Dashboard):
-- 1. 'property-images' - For property photos
--    - Public bucket
--    - Max file size: 5MB
--    - Allowed types: image/jpeg, image/png, image/webp
--
-- 2. 'avatars' - For user profile pictures
--    - Public bucket
--    - Max file size: 2MB
--    - Allowed types: image/jpeg, image/png, image/webp

-- Add indexes for image columns
CREATE INDEX IF NOT EXISTS idx_properties_main_image ON public.properties(main_image);
CREATE INDEX IF NOT EXISTS idx_user_profiles_avatar_url ON public.user_profiles(avatar_url);
CREATE INDEX IF NOT EXISTS idx_users_avatar_url ON public.users(avatar_url);

-- Function to delete old images from storage when property is deleted
CREATE OR REPLACE FUNCTION delete_property_images()
RETURNS TRIGGER AS $$
BEGIN
  -- Note: This function documents the intent to delete images
  -- Actual deletion from storage should be handled by the application
  -- or via Supabase Storage RLS policies with cascade delete
  RETURN OLD;
END;
$$ LANGUAGE plpgsql;

-- Trigger for property deletion (for documentation purposes)
DROP TRIGGER IF EXISTS trigger_delete_property_images ON public.properties;
CREATE TRIGGER trigger_delete_property_images
  BEFORE DELETE ON public.properties
  FOR EACH ROW
  EXECUTE FUNCTION delete_property_images();

-- Comments
COMMENT ON COLUMN public.properties.images IS 'Array of image URLs stored in Supabase Storage';
COMMENT ON COLUMN public.properties.main_image IS 'Main/featured image URL for the property';
COMMENT ON COLUMN public.user_profiles.avatar_url IS 'User profile picture URL stored in Supabase Storage';
COMMENT ON COLUMN public.users.avatar_url IS 'User avatar URL (legacy, prefer user_profiles.avatar_url)';

-- Storage bucket policies should be configured as follows:
--
-- For 'property-images' bucket:
-- - SELECT: Public (anyone can view)
-- - INSERT: Authenticated users only
-- - UPDATE: Owner of the property only
-- - DELETE: Owner of the property only
--
-- For 'avatars' bucket:
-- - SELECT: Public (anyone can view)
-- - INSERT: Authenticated users only
-- - UPDATE: User can only update their own avatar
-- - DELETE: User can only delete their own avatar
