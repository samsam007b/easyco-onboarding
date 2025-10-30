-- ============================================================================
-- CREATE STORAGE BUCKET FOR MESSAGE IMAGES
-- Run this in Supabase dashboard SQL editor
-- ============================================================================

-- Create storage bucket for message images
INSERT INTO storage.buckets (id, name, public)
VALUES ('message-images', 'message-images', true)
ON CONFLICT (id) DO NOTHING;

-- Enable RLS on storage.objects
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Policy: Users can upload their own images
CREATE POLICY "Users can upload message images"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'message-images'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- Policy: Anyone can view images (public bucket)
CREATE POLICY "Anyone can view message images"
  ON storage.objects
  FOR SELECT
  TO public
  USING (bucket_id = 'message-images');

-- Policy: Users can delete their own images
CREATE POLICY "Users can delete own message images"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'message-images'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

SELECT 'Message images storage bucket created successfully!' AS status;
