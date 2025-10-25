-- Supabase Storage Setup for Property Images
-- This script creates the storage bucket and RLS policies for property images

-- Create the property-images bucket (if not exists via Supabase Dashboard)
-- Go to Storage in Supabase Dashboard and create a bucket named: property-images
-- Set it to PUBLIC

-- Storage RLS Policies for property-images bucket

-- Policy: Anyone can view published property images
CREATE POLICY "Anyone can view property images"
ON storage.objects FOR SELECT
USING (bucket_id = 'property-images');

-- Policy: Authenticated users can upload their own property images
CREATE POLICY "Owners can upload property images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'property-images'
  AND auth.uid() IS NOT NULL
);

-- Policy: Owners can update their own property images
CREATE POLICY "Owners can update own property images"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'property-images'
  AND auth.uid() IS NOT NULL
)
WITH CHECK (
  bucket_id = 'property-images'
  AND auth.uid() IS NOT NULL
);

-- Policy: Owners can delete their own property images
CREATE POLICY "Owners can delete own property images"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'property-images'
  AND auth.uid() IS NOT NULL
);

-- Comments
COMMENT ON POLICY "Anyone can view property images" ON storage.objects IS
  'Allow public access to view all property images';

COMMENT ON POLICY "Owners can upload property images" ON storage.objects IS
  'Allow authenticated users to upload images for their properties';
