-- Migration: Create Property Images Storage Bucket
-- Description: Storage bucket and policies for property images
-- Date: 2025-10-28

-- ============================================
-- CREATE STORAGE BUCKET FOR PROPERTY IMAGES
-- ============================================

-- Insert bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'property-images',
  'property-images',
  true, -- Public bucket for property images
  10485760, -- 10MB file size limit
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']::text[]
)
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- ============================================
-- STORAGE POLICIES FOR PROPERTY IMAGES
-- ============================================

-- Policy: Anyone can view property images (public bucket)
DROP POLICY IF EXISTS "Public access to property images" ON storage.objects;
CREATE POLICY "Public access to property images"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'property-images');

-- Policy: Authenticated users can upload property images
DROP POLICY IF EXISTS "Authenticated users can upload property images" ON storage.objects;
CREATE POLICY "Authenticated users can upload property images"
  ON storage.objects
  FOR INSERT
  WITH CHECK (
    bucket_id = 'property-images'
    AND auth.role() = 'authenticated'
  );

-- Policy: Property owners can update their property images
DROP POLICY IF EXISTS "Property owners can update their images" ON storage.objects;
CREATE POLICY "Property owners can update their images"
  ON storage.objects
  FOR UPDATE
  USING (
    bucket_id = 'property-images'
    AND auth.role() = 'authenticated'
  )
  WITH CHECK (
    bucket_id = 'property-images'
    AND auth.role() = 'authenticated'
  );

-- Policy: Property owners can delete their property images
DROP POLICY IF EXISTS "Property owners can delete their images" ON storage.objects;
CREATE POLICY "Property owners can delete their images"
  ON storage.objects
  FOR DELETE
  USING (
    bucket_id = 'property-images'
    AND auth.role() = 'authenticated'
  );

-- ============================================
-- HELPER FUNCTION FOR IMAGE UPLOAD
-- ============================================

-- Function to generate a unique image path
CREATE OR REPLACE FUNCTION generate_property_image_path(
  property_id UUID,
  file_extension TEXT
)
RETURNS TEXT AS $$
DECLARE
  random_string TEXT;
  timestamp_string TEXT;
BEGIN
  -- Generate random string
  random_string := encode(gen_random_bytes(8), 'hex');

  -- Get timestamp
  timestamp_string := to_char(NOW(), 'YYYYMMDD_HH24MISS');

  -- Return path: {property_id}/{timestamp}_{random}.{ext}
  RETURN property_id::text || '/' || timestamp_string || '_' || random_string || '.' || file_extension;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- VERIFICATION
-- ============================================

DO $$
BEGIN
  IF EXISTS (SELECT FROM storage.buckets WHERE id = 'property-images') THEN
    RAISE NOTICE '✓ Property images storage bucket created successfully';
  ELSE
    RAISE EXCEPTION '✗ Property images storage bucket creation failed';
  END IF;
END $$;

-- ============================================
-- DOCUMENTATION
-- ============================================

COMMENT ON FUNCTION generate_property_image_path IS 'Generates a unique file path for property images: {property_id}/{timestamp}_{random}.{ext}';
