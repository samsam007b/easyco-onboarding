-- Migration: Create Design Screenshots Storage Bucket
-- Description: Storage bucket and policies for admin design history screenshots
-- Date: 2025-12-30

-- ============================================
-- CREATE STORAGE BUCKET FOR DESIGN SCREENSHOTS
-- ============================================

-- Insert bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'design-screenshots',
  'design-screenshots',
  true, -- Public bucket for design screenshots (read-only for public)
  10485760, -- 10MB file size limit
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp']::text[]
)
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- ============================================
-- STORAGE POLICIES FOR DESIGN SCREENSHOTS
-- ============================================

-- Policy: Anyone can view design screenshots (public bucket)
DROP POLICY IF EXISTS "Public access to design screenshots" ON storage.objects;
CREATE POLICY "Public access to design screenshots"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'design-screenshots');

-- Policy: Only admins can upload design screenshots
DROP POLICY IF EXISTS "Admins can upload design screenshots" ON storage.objects;
CREATE POLICY "Admins can upload design screenshots"
  ON storage.objects
  FOR INSERT
  WITH CHECK (
    bucket_id = 'design-screenshots'
    AND auth.role() = 'authenticated'
    AND EXISTS (
      SELECT 1 FROM public.admins
      WHERE email = auth.jwt()->>'email'
    )
  );

-- Policy: Only admins can update design screenshots
DROP POLICY IF EXISTS "Admins can update design screenshots" ON storage.objects;
CREATE POLICY "Admins can update design screenshots"
  ON storage.objects
  FOR UPDATE
  USING (
    bucket_id = 'design-screenshots'
    AND auth.role() = 'authenticated'
    AND EXISTS (
      SELECT 1 FROM public.admins
      WHERE email = auth.jwt()->>'email'
    )
  )
  WITH CHECK (
    bucket_id = 'design-screenshots'
    AND auth.role() = 'authenticated'
    AND EXISTS (
      SELECT 1 FROM public.admins
      WHERE email = auth.jwt()->>'email'
    )
  );

-- Policy: Only admins can delete design screenshots
DROP POLICY IF EXISTS "Admins can delete design screenshots" ON storage.objects;
CREATE POLICY "Admins can delete design screenshots"
  ON storage.objects
  FOR DELETE
  USING (
    bucket_id = 'design-screenshots'
    AND auth.role() = 'authenticated'
    AND EXISTS (
      SELECT 1 FROM public.admins
      WHERE email = auth.jwt()->>'email'
    )
  );

-- ============================================
-- VERIFICATION
-- ============================================

DO $$
BEGIN
  IF EXISTS (SELECT FROM storage.buckets WHERE id = 'design-screenshots') THEN
    RAISE NOTICE '✓ Design screenshots storage bucket created successfully';
  ELSE
    RAISE EXCEPTION '✗ Design screenshots storage bucket creation failed';
  END IF;
END $$;

-- ============================================
-- DOCUMENTATION
-- ============================================

-- Note: Design screenshots use the following path pattern: {version-id}/{timestamp}-{name}-{random}.{ext}
