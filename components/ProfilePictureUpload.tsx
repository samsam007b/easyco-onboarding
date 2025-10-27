'use client';

import { useState, useRef } from 'react';
import { Camera, Upload, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useImageUpload } from '@/lib/hooks/use-image-upload';
import { toast } from 'sonner';

interface ProfilePictureUploadProps {
  userId: string;
  currentAvatarUrl?: string;
  onUploadSuccess?: (url: string) => void;
}

export default function ProfilePictureUpload({
  userId,
  currentAvatarUrl,
  onUploadSuccess,
}: ProfilePictureUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(currentAvatarUrl || null);
  const { uploadImage, updateUserAvatar, uploadProgress, isUploading } = useImageUpload();

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be smaller than 5MB');
      return;
    }

    // Show preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Upload to Supabase
    try {
      // First, upload the image
      const result = await uploadImage(file, {
        bucket: 'avatars',
        folder: `users/${userId}`,
        maxSizeMB: 5,
        maxWidthOrHeight: 500,
        compress: true,
      });

      if (!result) {
        throw new Error('Failed to upload image');
      }

      // Then, update the user's avatar URL
      const success = await updateUserAvatar(userId, result.url);
      if (success) {
        toast.success('Profile picture updated successfully!');
        onUploadSuccess?.(result.url);
      } else {
        throw new Error('Failed to update profile');
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to upload profile picture');
      // Revert preview on error
      setPreview(currentAvatarUrl || null);
    }
  };

  const handleRemove = async () => {
    // TODO: Implement avatar removal
    setPreview(null);
    toast.success('Profile picture removed');
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Avatar Preview */}
      <div className="relative group">
        <div className="w-32 h-32 rounded-full overflow-hidden bg-gradient-to-br from-purple-100 to-yellow-100 flex items-center justify-center border-4 border-white shadow-lg">
          {preview ? (
            <img
              src={preview}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          ) : (
            <Camera className="w-12 h-12 text-gray-400" />
          )}
        </div>

        {/* Overlay on hover */}
        {!isUploading && (
          <div
            className="absolute inset-0 rounded-full bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
            onClick={handleClick}
          >
            <Upload className="w-8 h-8 text-white" />
          </div>
        )}

        {/* Loading overlay */}
        {isUploading && (
          <div className="absolute inset-0 rounded-full bg-black/60 flex flex-col items-center justify-center">
            <Loader2 className="w-8 h-8 text-white animate-spin mb-2" />
            {uploadProgress !== null && (
              <span className="text-white text-sm font-medium">
                {uploadProgress}%
              </span>
            )}
          </div>
        )}

        {/* Remove button */}
        {preview && !isUploading && (
          <button
            onClick={handleRemove}
            className="absolute top-0 right-0 p-1.5 bg-red-500 hover:bg-red-600 rounded-full text-white shadow-lg transition-colors"
            title="Remove picture"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Upload button */}
      <div className="text-center">
        <Button
          onClick={handleClick}
          disabled={isUploading}
          variant="outline"
          size="sm"
        >
          {isUploading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Uploading...
            </>
          ) : (
            <>
              <Upload className="w-4 h-4 mr-2" />
              {preview ? 'Change Picture' : 'Upload Picture'}
            </>
          )}
        </Button>

        <p className="text-xs text-gray-500 mt-2">
          JPG, PNG or GIF. Max 5MB.
        </p>
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  );
}
