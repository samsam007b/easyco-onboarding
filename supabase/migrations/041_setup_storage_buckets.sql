-- Create storage buckets for EasyCo platform

-- Application documents bucket (private - only accessible to owner and applicant)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'application-documents',
  'application-documents',
  false,
  10485760, -- 10MB
  ARRAY['application/pdf', 'image/jpeg', 'image/jpg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;

-- Property images bucket (public)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'property-images',
  'property-images',
  true,
  5242880, -- 5MB
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;

-- Profile photos bucket (public)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'profile-photos',
  'profile-photos',
  true,
  2097152, -- 2MB
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for application-documents bucket

-- Users can upload their own documents
CREATE POLICY "Users can upload own application documents"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'application-documents' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Users can view their own documents
CREATE POLICY "Users can view own application documents"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'application-documents' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Property owners can view documents from their applicants
CREATE POLICY "Owners can view applicant documents"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'application-documents' AND
  EXISTS (
    SELECT 1
    FROM public.applications a
    JOIN public.properties p ON p.id = a.property_id
    WHERE p.owner_id = auth.uid()
    AND a.applicant_id::text = (storage.foldername(name))[1]
  )
);

-- Users can update their own documents
CREATE POLICY "Users can update own application documents"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'application-documents' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Users can delete their own documents
CREATE POLICY "Users can delete own application documents"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'application-documents' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Storage policies for property-images bucket

-- Property owners can upload images for their properties
CREATE POLICY "Owners can upload property images"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'property-images' AND
  EXISTS (
    SELECT 1
    FROM public.properties
    WHERE id::text = (storage.foldername(name))[1]
    AND owner_id = auth.uid()
  )
);

-- Anyone can view property images (public bucket)
CREATE POLICY "Anyone can view property images"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'property-images');

-- Property owners can update their property images
CREATE POLICY "Owners can update property images"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'property-images' AND
  EXISTS (
    SELECT 1
    FROM public.properties
    WHERE id::text = (storage.foldername(name))[1]
    AND owner_id = auth.uid()
  )
);

-- Property owners can delete their property images
CREATE POLICY "Owners can delete property images"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'property-images' AND
  EXISTS (
    SELECT 1
    FROM public.properties
    WHERE id::text = (storage.foldername(name))[1]
    AND owner_id = auth.uid()
  )
);

-- Storage policies for profile-photos bucket

-- Users can upload their own profile photo
CREATE POLICY "Users can upload own profile photo"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'profile-photos' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Anyone can view profile photos (public bucket)
CREATE POLICY "Anyone can view profile photos"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'profile-photos');

-- Users can update their own profile photo
CREATE POLICY "Users can update own profile photo"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'profile-photos' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Users can delete their own profile photo
CREATE POLICY "Users can delete own profile photo"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'profile-photos' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Comments
COMMENT ON POLICY "Users can upload own application documents" ON storage.objects IS 'Users can upload documents for their own applications';
COMMENT ON POLICY "Owners can view applicant documents" ON storage.objects IS 'Property owners can view documents from applicants to their properties';
COMMENT ON POLICY "Owners can upload property images" ON storage.objects IS 'Property owners can upload images for their own properties';
COMMENT ON POLICY "Users can upload own profile photo" ON storage.objects IS 'Users can upload their own profile photo';
