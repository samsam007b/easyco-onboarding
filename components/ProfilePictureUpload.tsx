'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { Camera, Upload, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useImageUpload } from '@/lib/hooks/use-image-upload';
import { toast } from 'sonner';
import { useLanguage } from '@/lib/i18n/use-language';

const t = {
  toasts: {
    selectImage: {
      fr: 'Veuillez sélectionner un fichier image',
      en: 'Please select an image file',
      nl: 'Selecteer een afbeelding',
      de: 'Bitte wählen Sie eine Bilddatei',
    },
    imageTooLarge: {
      fr: 'L\'image doit faire moins de 5 Mo',
      en: 'Image must be smaller than 5MB',
      nl: 'Afbeelding moet kleiner zijn dan 5MB',
      de: 'Bild muss kleiner als 5MB sein',
    },
    uploadSuccess: {
      fr: 'Photo de profil mise à jour !',
      en: 'Profile picture updated successfully!',
      nl: 'Profielfoto succesvol bijgewerkt!',
      de: 'Profilbild erfolgreich aktualisiert!',
    },
    uploadFailed: {
      fr: 'Échec du téléchargement de la photo',
      en: 'Failed to upload profile picture',
      nl: 'Uploaden van profielfoto mislukt',
      de: 'Profilbild hochladen fehlgeschlagen',
    },
    removeSuccess: {
      fr: 'Photo de profil supprimée',
      en: 'Profile picture removed',
      nl: 'Profielfoto verwijderd',
      de: 'Profilbild entfernt',
    },
    removeFailed: {
      fr: 'Échec de la suppression de la photo',
      en: 'Failed to remove profile picture',
      nl: 'Verwijderen van profielfoto mislukt',
      de: 'Profilbild entfernen fehlgeschlagen',
    },
  },
  ui: {
    changeProfile: {
      fr: 'Changer la photo de profil',
      en: 'Change profile picture',
      nl: 'Profielfoto wijzigen',
      de: 'Profilbild ändern',
    },
    removeProfile: {
      fr: 'Supprimer la photo',
      en: 'Remove picture',
      nl: 'Foto verwijderen',
      de: 'Bild entfernen',
    },
    uploading: {
      fr: 'Téléchargement...',
      en: 'Uploading...',
      nl: 'Uploaden...',
      de: 'Hochladen...',
    },
    changePicture: {
      fr: 'Changer la photo',
      en: 'Change Picture',
      nl: 'Foto wijzigen',
      de: 'Bild ändern',
    },
    uploadPicture: {
      fr: 'Télécharger une photo',
      en: 'Upload Picture',
      nl: 'Foto uploaden',
      de: 'Bild hochladen',
    },
    fileTypes: {
      fr: 'JPG, PNG ou GIF. Max 5 Mo.',
      en: 'JPG, PNG or GIF. Max 5MB.',
      nl: 'JPG, PNG of GIF. Max 5MB.',
      de: 'JPG, PNG oder GIF. Max 5MB.',
    },
  },
};

type Language = 'fr' | 'en' | 'nl' | 'de';

interface ProfilePictureUploadProps {
  userId: string;
  currentAvatarUrl?: string;
  onUploadSuccess?: (url: string) => void;
  compact?: boolean; // New prop for compact mode (just icon button)
}

export default function ProfilePictureUpload({
  userId,
  currentAvatarUrl,
  onUploadSuccess,
  compact = false,
}: ProfilePictureUploadProps) {
  const { language } = useLanguage();
  const lang = language as Language;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(currentAvatarUrl || null);
  const [avatarPath, setAvatarPath] = useState<string | null>(null);
  const { uploadImage, updateUserAvatar, deleteImage, uploadProgress, isUploading } = useImageUpload();

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error(t.toasts.selectImage[lang]);
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error(t.toasts.imageTooLarge[lang]);
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

      // Store the path for deletion later
      setAvatarPath(result.path);

      // Then, update the user's avatar URL
      const success = await updateUserAvatar(userId, result.url);
      if (success) {
        toast.success(t.toasts.uploadSuccess[lang]);
        onUploadSuccess?.(result.url);
      } else {
        throw new Error('Failed to update profile');
      }
    } catch (error: any) {
      toast.error(error.message || t.toasts.uploadFailed[lang]);
      // Revert preview on error
      setPreview(currentAvatarUrl || null);
    }
  };

  const handleRemove = async () => {
    try {
      // Remove avatar from database
      const success = await updateUserAvatar(userId, '');

      if (success) {
        // If we have the path, delete from storage
        if (avatarPath) {
          await deleteImage('avatars', avatarPath);
        }

        setPreview(null);
        setAvatarPath(null);
        toast.success(t.toasts.removeSuccess[lang]);
        onUploadSuccess?.('');
      } else {
        throw new Error('Failed to remove avatar');
      }
    } catch (error: any) {
      toast.error(error.message || t.toasts.removeFailed[lang]);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  // Compact mode: just a small camera button
  if (compact) {
    return (
      <>
        <button
          onClick={handleClick}
          disabled={isUploading}
          className="p-3 bg-white hover:bg-gray-50 rounded-full shadow-lg border-2 border-gray-200 hover:border-gray-300 transition-all disabled:opacity-50"
          title={t.ui.changeProfile[lang]}
        >
          {isUploading ? (
            <Loader2 className="w-5 h-5 text-gray-600 animate-spin" />
          ) : (
            <Camera className="w-5 h-5 text-gray-600" />
          )}
        </button>

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />
      </>
    );
  }

  // Full mode with avatar preview
  return (
    <div className="flex flex-col items-center gap-4">
      {/* Avatar Preview */}
      <div className="relative group">
        <div className="relative w-32 h-32 rounded-full overflow-hidden bg-gradient-to-br from-purple-100 to-yellow-100 flex items-center justify-center border-4 border-white shadow-lg">
          {preview ? (
            <Image
              src={preview}
              alt="Profile"
              width={128}
              height={128}
              className="object-cover"
              priority
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
            title={t.ui.removeProfile[lang]}
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
              {t.ui.uploading[lang]}
            </>
          ) : (
            <>
              <Upload className="w-4 h-4 mr-2" />
              {preview ? t.ui.changePicture[lang] : t.ui.uploadPicture[lang]}
            </>
          )}
        </Button>

        <p className="text-xs text-gray-500 mt-2">
          {t.ui.fileTypes[lang]}
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
