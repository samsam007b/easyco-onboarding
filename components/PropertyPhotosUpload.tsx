'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { Upload, X, Loader2, ImagePlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useImageUpload } from '@/lib/hooks/use-image-upload';
import { toast } from 'sonner';
import { useLanguage } from '@/lib/i18n/use-language';

const t = {
  toasts: {
    maxPhotos: {
      fr: (max: number) => `Vous pouvez télécharger maximum ${max} photos`,
      en: (max: number) => `You can upload a maximum of ${max} photos`,
      nl: (max: number) => `U kunt maximaal ${max} foto's uploaden`,
      de: (max: number) => `Sie können maximal ${max} Fotos hochladen`,
    },
    notAnImage: {
      fr: (name: string) => `${name} n'est pas un fichier image`,
      en: (name: string) => `${name} is not an image file`,
      nl: (name: string) => `${name} is geen afbeeldingsbestand`,
      de: (name: string) => `${name} ist keine Bilddatei`,
    },
    fileTooLarge: {
      fr: (name: string) => `${name} doit faire moins de 10 Mo`,
      en: (name: string) => `${name} must be smaller than 10MB`,
      nl: (name: string) => `${name} moet kleiner zijn dan 10MB`,
      de: (name: string) => `${name} muss kleiner als 10MB sein`,
    },
    uploadSuccess: {
      fr: (num: number) => `Photo ${num} téléchargée !`,
      en: (num: number) => `Photo ${num} uploaded successfully!`,
      nl: (num: number) => `Foto ${num} succesvol geüpload!`,
      de: (num: number) => `Foto ${num} erfolgreich hochgeladen!`,
    },
    uploadFailed: {
      fr: (name: string) => `Échec du téléchargement de ${name}`,
      en: (name: string) => `Failed to upload ${name}`,
      nl: (name: string) => `Uploaden van ${name} mislukt`,
      de: (name: string) => `Hochladen von ${name} fehlgeschlagen`,
    },
    removed: {
      fr: 'Photo supprimée',
      en: 'Photo removed',
      nl: 'Foto verwijderd',
      de: 'Foto entfernt',
    },
    maxAllowed: {
      fr: (max: number) => `Maximum ${max} photos autorisées`,
      en: (max: number) => `Maximum of ${max} photos allowed`,
      nl: (max: number) => `Maximaal ${max} foto's toegestaan`,
      de: (max: number) => `Maximal ${max} Fotos erlaubt`,
    },
  },
  ui: {
    title: {
      fr: 'Photos du bien',
      en: 'Property Photos',
      nl: 'Foto\'s van het pand',
      de: 'Immobilienfotos',
    },
    subtitle: {
      fr: (max: number) => `Téléchargez jusqu'à ${max} photos (JPG, PNG ou GIF. Max 10 Mo chacune)`,
      en: (max: number) => `Upload up to ${max} photos (JPG, PNG or GIF. Max 10MB each)`,
      nl: (max: number) => `Upload tot ${max} foto's (JPG, PNG of GIF. Max 10MB per stuk)`,
      de: (max: number) => `Laden Sie bis zu ${max} Fotos hoch (JPG, PNG oder GIF. Max 10MB pro Bild)`,
    },
    uploading: {
      fr: 'Téléchargement...',
      en: 'Uploading...',
      nl: 'Uploaden...',
      de: 'Hochladen...',
    },
    addPhotos: {
      fr: 'Ajouter des photos',
      en: 'Add Photos',
      nl: 'Foto\'s toevoegen',
      de: 'Fotos hinzufügen',
    },
    removePhoto: {
      fr: 'Supprimer la photo',
      en: 'Remove photo',
      nl: 'Foto verwijderen',
      de: 'Foto entfernen',
    },
    primary: {
      fr: 'Principale',
      en: 'Primary',
      nl: 'Hoofd',
      de: 'Haupt',
    },
    upload: {
      fr: 'Télécharger',
      en: 'Upload',
      nl: 'Uploaden',
      de: 'Hochladen',
    },
    photosCount: {
      fr: (current: number, max: number) => `${current} / ${max} photos téléchargées`,
      en: (current: number, max: number) => `${current} / ${max} photos uploaded`,
      nl: (current: number, max: number) => `${current} / ${max} foto's geüpload`,
      de: (current: number, max: number) => `${current} / ${max} Fotos hochgeladen`,
    },
  },
};

type Language = 'fr' | 'en' | 'nl' | 'de';

interface PropertyPhotosUploadProps {
  propertyId?: string;
  maxPhotos?: number;
  onPhotosChange?: (urls: string[]) => void;
  initialPhotos?: string[];
}

export default function PropertyPhotosUpload({
  propertyId,
  maxPhotos = 10,
  onPhotosChange,
  initialPhotos = [],
}: PropertyPhotosUploadProps) {
  const { language } = useLanguage();
  const lang = language as Language;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [photos, setPhotos] = useState<string[]>(initialPhotos);
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);
  const { uploadImage, uploadProgress, isUploading } = useImageUpload();

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (!files.length) return;

    // Check if adding these files would exceed the limit
    if (photos.length + files.length > maxPhotos) {
      toast.error(t.toasts.maxPhotos[lang](maxPhotos));
      return;
    }

    // Process each file
    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error(t.toasts.notAnImage[lang](file.name));
        continue;
      }

      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast.error(t.toasts.fileTooLarge[lang](file.name));
        continue;
      }

      // Upload to Supabase
      try {
        setUploadingIndex(photos.length + i);

        const result = await uploadImage(file, {
          bucket: 'property-images',
          folder: propertyId ? `properties/${propertyId}` : 'temp',
          maxSizeMB: 10,
          maxWidthOrHeight: 1920,
          compress: true,
        });

        if (!result) {
          throw new Error('Failed to upload image');
        }

        // Add photo to the list
        const newPhotos = [...photos, result.url];
        setPhotos(newPhotos);
        onPhotosChange?.(newPhotos);

        toast.success(t.toasts.uploadSuccess[lang](i + 1));
      } catch (error: any) {
        toast.error(error.message || t.toasts.uploadFailed[lang](file.name));
      } finally {
        setUploadingIndex(null);
      }
    }

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemove = (index: number) => {
    const newPhotos = photos.filter((_, i) => i !== index);
    setPhotos(newPhotos);
    onPhotosChange?.(newPhotos);
    toast.success(t.toasts.removed[lang]);
  };

  const handleClick = () => {
    if (photos.length >= maxPhotos) {
      toast.error(t.toasts.maxAllowed[lang](maxPhotos));
      return;
    }
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-4">
      {/* Upload button */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-medium text-gray-700">{t.ui.title[lang]}</h3>
          <p className="text-xs text-gray-500 mt-1">
            {t.ui.subtitle[lang](maxPhotos)}
          </p>
        </div>
        <Button
          onClick={handleClick}
          disabled={isUploading || photos.length >= maxPhotos}
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
              <ImagePlus className="w-4 h-4 mr-2" />
              {t.ui.addPhotos[lang]}
            </>
          )}
        </Button>
      </div>

      {/* Photos Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {photos.map((photo, index) => (
          <div key={index} className="relative group aspect-square">
            <div className="relative w-full h-full rounded-lg overflow-hidden bg-gray-100 border-2 border-gray-200">
              <Image
                src={photo}
                alt={`Property photo ${index + 1}`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
              />
            </div>

            {/* Remove button */}
            {!isUploading && (
              <button
                onClick={() => handleRemove(index)}
                className="absolute top-2 right-2 p-1.5 bg-red-500 hover:bg-red-600 rounded-full text-white shadow-lg transition-colors opacity-0 group-hover:opacity-100"
                title={t.ui.removePhoto[lang]}
              >
                <X className="w-4 h-4" />
              </button>
            )}

            {/* Primary badge for first photo */}
            {index === 0 && (
              <div className="absolute bottom-2 left-2 px-2 py-1 bg-[color:var(--easy-purple)] text-white text-xs font-semibold rounded">
                {t.ui.primary[lang]}
              </div>
            )}
          </div>
        ))}

        {/* Uploading placeholder */}
        {isUploading && uploadingIndex !== null && (
          <div className="relative group aspect-square">
            <div className="relative w-full h-full rounded-lg overflow-hidden bg-gray-100 border-2 border-gray-200 flex items-center justify-center">
              <div className="text-center">
                <Loader2 className="w-8 h-8 text-[color:var(--easy-purple)] animate-spin mx-auto mb-2" />
                {uploadProgress !== null && (
                  <span className="text-sm font-medium text-gray-600">
                    {uploadProgress}%
                  </span>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Upload placeholder (only show if less than maxPhotos) */}
        {!isUploading && photos.length < maxPhotos && (
          <button
            onClick={handleClick}
            className="relative group aspect-square w-full h-full rounded-lg overflow-hidden bg-gray-50 border-2 border-dashed border-gray-300 hover:border-[color:var(--easy-purple)] hover:bg-purple-50 transition-all flex items-center justify-center"
          >
            <div className="text-center">
              <Upload className="w-8 h-8 text-gray-400 group-hover:text-[color:var(--easy-purple)] mx-auto mb-2 transition-colors" />
              <span className="text-sm text-gray-500 group-hover:text-[color:var(--easy-purple)] font-medium transition-colors">
                {t.ui.upload[lang]}
              </span>
            </div>
          </button>
        )}
      </div>

      {/* Photo count */}
      <div className="text-center text-sm text-gray-500">
        {t.ui.photosCount[lang](photos.length, maxPhotos)}
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  );
}
