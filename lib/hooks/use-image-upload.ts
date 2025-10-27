'use client';

import { useState, useCallback } from 'react';
import { createClient } from '@/lib/auth/supabase-client';
import { toast } from 'sonner';

interface UploadOptions {
  bucket: 'property-images' | 'avatars';
  folder: string;
  maxSizeMB?: number;
  maxWidthOrHeight?: number;
  compress?: boolean;
}

interface UploadResult {
  url: string;
  path: string;
  error?: string;
}

export function useImageUpload() {
  const supabase = createClient();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Compress image using canvas
  const compressImage = useCallback(
    async (file: File, maxWidthOrHeight: number = 1920): Promise<File> => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);

        reader.onload = (event) => {
          const img = new Image();
          img.src = event.target?.result as string;

          img.onload = () => {
            const canvas = document.createElement('canvas');
            let width = img.width;
            let height = img.height;

            // Calculate new dimensions
            if (width > height) {
              if (width > maxWidthOrHeight) {
                height = (height * maxWidthOrHeight) / width;
                width = maxWidthOrHeight;
              }
            } else {
              if (height > maxWidthOrHeight) {
                width = (width * maxWidthOrHeight) / height;
                height = maxWidthOrHeight;
              }
            }

            canvas.width = width;
            canvas.height = height;

            const ctx = canvas.getContext('2d');
            if (!ctx) {
              reject(new Error('Could not get canvas context'));
              return;
            }

            ctx.drawImage(img, 0, 0, width, height);

            canvas.toBlob(
              (blob) => {
                if (!blob) {
                  reject(new Error('Could not create blob'));
                  return;
                }

                const compressedFile = new File([blob], file.name, {
                  type: 'image/jpeg',
                  lastModified: Date.now(),
                });

                resolve(compressedFile);
              },
              'image/jpeg',
              0.85 // Quality (0-1)
            );
          };

          img.onerror = () => {
            reject(new Error('Could not load image'));
          };
        };

        reader.onerror = () => {
          reject(new Error('Could not read file'));
        };
      });
    },
    []
  );

  // Validate file
  const validateFile = useCallback((file: File, maxSizeMB: number = 5): boolean => {
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];

    if (!validTypes.includes(file.type)) {
      toast.error('Please upload an image file (JPEG, PNG, or WebP)');
      return false;
    }

    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      toast.error(`File size must be less than ${maxSizeMB}MB`);
      return false;
    }

    return true;
  }, []);

  // Upload single image
  const uploadImage = useCallback(
    async (
      file: File,
      options: UploadOptions
    ): Promise<UploadResult | null> => {
      const {
        bucket,
        folder,
        maxSizeMB = 5,
        maxWidthOrHeight = 1920,
        compress = true,
      } = options;

      // Validate file
      if (!validateFile(file, maxSizeMB)) {
        return null;
      }

      setIsUploading(true);
      setUploadProgress(0);

      try {
        // Compress image if needed
        let fileToUpload = file;
        if (compress) {
          setUploadProgress(20);
          fileToUpload = await compressImage(file, maxWidthOrHeight);
        }

        setUploadProgress(40);

        // Generate unique filename
        const timestamp = Date.now();
        const randomString = Math.random().toString(36).substring(2, 15);
        const extension = fileToUpload.name.split('.').pop() || 'jpg';
        const fileName = `${timestamp}-${randomString}.${extension}`;
        const filePath = `${folder}/${fileName}`;

        setUploadProgress(60);

        // Upload to Supabase Storage
        const { data, error } = await supabase.storage
          .from(bucket)
          .upload(filePath, fileToUpload, {
            cacheControl: '3600',
            upsert: false,
          });

        if (error) {
          throw error;
        }

        setUploadProgress(80);

        // Get public URL
        const { data: urlData } = supabase.storage
          .from(bucket)
          .getPublicUrl(filePath);

        setUploadProgress(100);

        return {
          url: urlData.publicUrl,
          path: filePath,
        };
      } catch (error: any) {
        console.error('Error uploading image:', error);
        toast.error(error.message || 'Failed to upload image');
        return {
          url: '',
          path: '',
          error: error.message,
        };
      } finally {
        setIsUploading(false);
        setTimeout(() => setUploadProgress(0), 500);
      }
    },
    [supabase, validateFile, compressImage]
  );

  // Upload multiple images
  const uploadMultipleImages = useCallback(
    async (
      files: File[],
      options: UploadOptions
    ): Promise<UploadResult[]> => {
      const results: UploadResult[] = [];

      for (let i = 0; i < files.length; i++) {
        const result = await uploadImage(files[i], options);
        if (result) {
          results.push(result);
        }
      }

      return results;
    },
    [uploadImage]
  );

  // Delete image
  const deleteImage = useCallback(
    async (bucket: string, path: string): Promise<boolean> => {
      try {
        const { error } = await supabase.storage.from(bucket).remove([path]);

        if (error) {
          throw error;
        }

        toast.success('Image deleted');
        return true;
      } catch (error: any) {
        console.error('Error deleting image:', error);
        toast.error(error.message || 'Failed to delete image');
        return false;
      }
    },
    [supabase]
  );

  // Update avatar in user_profiles
  const updateUserAvatar = useCallback(
    async (userId: string, avatarUrl: string): Promise<boolean> => {
      try {
        const { error: profileError } = await supabase
          .from('user_profiles')
          .upsert({
            user_id: userId,
            avatar_url: avatarUrl,
          });

        const { error: userError } = await supabase
          .from('users')
          .update({ avatar_url: avatarUrl })
          .eq('id', userId);

        if (profileError || userError) {
          throw profileError || userError;
        }

        return true;
      } catch (error: any) {
        console.error('Error updating avatar:', error);
        return false;
      }
    },
    [supabase]
  );

  // Update property images
  const updatePropertyImages = useCallback(
    async (
      propertyId: string,
      images: string[],
      mainImage?: string
    ): Promise<boolean> => {
      try {
        const updateData: any = { images };
        if (mainImage) {
          updateData.main_image = mainImage;
        }

        const { error } = await supabase
          .from('properties')
          .update(updateData)
          .eq('id', propertyId);

        if (error) {
          throw error;
        }

        return true;
      } catch (error: any) {
        console.error('Error updating property images:', error);
        toast.error('Failed to update property images');
        return false;
      }
    },
    [supabase]
  );

  return {
    uploadImage,
    uploadMultipleImages,
    deleteImage,
    updateUserAvatar,
    updatePropertyImages,
    isUploading,
    uploadProgress,
  };
}
