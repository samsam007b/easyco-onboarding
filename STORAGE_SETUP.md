# Supabase Storage Setup Guide

This guide explains how to set up the required storage buckets for image uploads in EasyCo.

## Required Storage Buckets

### 1. Property Images Bucket

**Bucket Name:** `property-images`

**Configuration:**
- **Public:** Yes (images should be viewable by everyone)
- **File Size Limit:** 5 MB
- **Allowed MIME Types:** `image/jpeg`, `image/png`, `image/webp`

**RLS Policies:**

```sql
-- Anyone can view property images
CREATE POLICY "Public property images are viewable by everyone"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'property-images');

-- Authenticated users can upload property images
CREATE POLICY "Authenticated users can upload property images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'property-images');

-- Users can update their own property images
CREATE POLICY "Users can update own property images"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'property-images' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Users can delete their own property images
CREATE POLICY "Users can delete own property images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'property-images' AND auth.uid()::text = (storage.foldername(name))[1]);
```

**Folder Structure:**
```
property-images/
  ├── {user_id}/
  │   ├── {property_id}/
  │   │   ├── main.jpg
  │   │   ├── image-1.jpg
  │   │   ├── image-2.jpg
  │   │   └── ...
```

### 2. Avatars Bucket

**Bucket Name:** `avatars`

**Configuration:**
- **Public:** Yes (avatars should be viewable by everyone)
- **File Size Limit:** 2 MB
- **Allowed MIME Types:** `image/jpeg`, `image/png`, `image/webp`

**RLS Policies:**

```sql
-- Anyone can view avatars
CREATE POLICY "Avatars are viewable by everyone"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'avatars');

-- Authenticated users can upload their avatar
CREATE POLICY "Users can upload own avatar"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Users can update their own avatar
CREATE POLICY "Users can update own avatar"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Users can delete their own avatar
CREATE POLICY "Users can delete own avatar"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);
```

**Folder Structure:**
```
avatars/
  ├── {user_id}/
  │   └── avatar.jpg
```

## Setup Steps

### Via Supabase Dashboard

1. **Go to Storage in Supabase Dashboard**
   - Navigate to: `https://app.supabase.com/project/{your-project-id}/storage/buckets`

2. **Create Property Images Bucket**
   - Click "New bucket"
   - Name: `property-images`
   - Public: ✅ Yes
   - File size limit: 5242880 (5 MB in bytes)
   - Allowed MIME types: `image/jpeg,image/png,image/webp`
   - Click "Create bucket"

3. **Create Avatars Bucket**
   - Click "New bucket"
   - Name: `avatars`
   - Public: ✅ Yes
   - File size limit: 2097152 (2 MB in bytes)
   - Allowed MIME types: `image/jpeg,image/png,image/webp`
   - Click "Create bucket"

4. **Configure RLS Policies**
   - Go to "Policies" tab for each bucket
   - Add the policies listed above
   - Or use the SQL Editor to run the policy creation scripts

### Via Supabase CLI

```bash
# Create property-images bucket
supabase storage create-bucket property-images --public

# Create avatars bucket
supabase storage create-bucket avatars --public

# Apply RLS policies (run the SQL scripts above)
supabase db execute -f storage-policies.sql
```

### Via Supabase API

```typescript
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

// Create property-images bucket
await supabase.storage.createBucket('property-images', {
  public: true,
  fileSizeLimit: 5242880,
  allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp']
});

// Create avatars bucket
await supabase.storage.createBucket('avatars', {
  public: true,
  fileSizeLimit: 2097152,
  allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp']
});
```

## Testing Storage Setup

```typescript
// Test upload to property-images
const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
const { data, error } = await supabase.storage
  .from('property-images')
  .upload(`${userId}/test-property/test.jpg`, file);

console.log('Upload result:', { data, error });

// Test public URL access
const { data: urlData } = supabase.storage
  .from('property-images')
  .getPublicUrl(`${userId}/test-property/test.jpg`);

console.log('Public URL:', urlData.publicUrl);
```

## Environment Variables

No additional environment variables are needed. The storage buckets use the same Supabase credentials as the database:

```env
NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

## Image Optimization Best Practices

1. **Client-side compression** before upload (use browser-image-compression library)
2. **Resize large images** to max 1920px width
3. **Convert to WebP** format for better compression
4. **Generate thumbnails** for list views
5. **Lazy load images** on property browse pages

## Security Notes

- ✅ RLS policies ensure users can only modify their own images
- ✅ Public buckets allow anyone to view images (required for property listings)
- ✅ File size limits prevent abuse
- ✅ MIME type restrictions prevent non-image uploads
- ⚠️ Consider adding rate limiting for uploads
- ⚠️ Monitor storage usage and set up alerts

## Troubleshooting

### Images not uploading
- Check bucket exists: `supabase storage list-buckets`
- Verify RLS policies are applied
- Check file size doesn't exceed limit
- Verify MIME type is allowed

### Images not displaying
- Check bucket is public
- Verify URL is correct: `{supabase_url}/storage/v1/object/public/{bucket}/{path}`
- Check CORS settings if loading from different domain

### Permission errors
- Verify user is authenticated
- Check RLS policies match folder structure
- Ensure `auth.uid()` matches folder name in path
