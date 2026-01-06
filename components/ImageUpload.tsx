'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { Button } from './ui/button';
import { toast } from 'sonner';
import { useLanguage } from '@/lib/i18n/use-language';

const t = {
  toasts: {
    dropImagesOnly: {
      fr: 'Veuillez déposer uniquement des fichiers image',
      en: 'Please drop image files only',
      nl: 'Alleen afbeeldingsbestanden toegestaan',
      de: 'Bitte nur Bilddateien ablegen',
    },
    selectImagesOnly: {
      fr: 'Veuillez sélectionner uniquement des fichiers image',
      en: 'Please select image files only',
      nl: 'Selecteer alleen afbeeldingsbestanden',
      de: 'Bitte nur Bilddateien auswählen',
    },
    maxImages: {
      fr: (max: number) => `Maximum ${max} images autorisées`,
      en: (max: number) => `Maximum ${max} images allowed`,
      nl: (max: number) => `Maximaal ${max} afbeeldingen toegestaan`,
      de: (max: number) => `Maximal ${max} Bilder erlaubt`,
    },
  },
  ui: {
    dropHere: {
      fr: 'Déposez les images ici',
      en: 'Drop images here',
      nl: 'Zet afbeeldingen hier neer',
      de: 'Bilder hier ablegen',
    },
    uploadImages: {
      fr: 'Télécharger des photos',
      en: 'Upload Property Images',
      nl: 'Upload afbeeldingen',
      de: 'Bilder hochladen',
    },
    dragOrClick: {
      fr: 'Glissez-déposez ou cliquez pour parcourir',
      en: 'Drag and drop or click to browse',
      nl: 'Sleep of klik om te bladeren',
      de: 'Ziehen und ablegen oder klicken zum Durchsuchen',
    },
    maxSize: {
      fr: (max: number) => `Maximum ${max} images, jusqu'à 5 Mo chacune`,
      en: (max: number) => `Maximum ${max} images, up to 5MB each`,
      nl: (max: number) => `Maximaal ${max} afbeeldingen, tot 5MB per stuk`,
      de: (max: number) => `Maximal ${max} Bilder, bis zu 5MB pro Bild`,
    },
    chooseFiles: {
      fr: 'Choisir des fichiers',
      en: 'Choose Files',
      nl: 'Bestanden kiezen',
      de: 'Dateien auswählen',
    },
    imagesUploaded: {
      fr: (count: number) => `${count} image${count > 1 ? 's' : ''} téléchargée${count > 1 ? 's' : ''}`,
      en: (count: number) => `${count} ${count === 1 ? 'image' : 'images'} uploaded`,
      nl: (count: number) => `${count} ${count === 1 ? 'afbeelding' : 'afbeeldingen'} geüpload`,
      de: (count: number) => `${count} ${count === 1 ? 'Bild' : 'Bilder'} hochgeladen`,
    },
    removeImage: {
      fr: 'Supprimer l\'image',
      en: 'Remove image',
      nl: 'Afbeelding verwijderen',
      de: 'Bild entfernen',
    },
    mainImage: {
      fr: 'Image principale',
      en: 'Main Image',
      nl: 'Hoofdafbeelding',
      de: 'Hauptbild',
    },
    mainImageHint: {
      fr: 'La première image sera utilisée comme image principale',
      en: 'The first image will be used as the main property image',
      nl: 'De eerste afbeelding wordt gebruikt als hoofdafbeelding',
      de: 'Das erste Bild wird als Hauptbild verwendet',
    },
    noImages: {
      fr: 'Aucune image téléchargée',
      en: 'No images uploaded yet',
      nl: 'Nog geen afbeeldingen geüpload',
      de: 'Noch keine Bilder hochgeladen',
    },
  },
};

type Language = 'fr' | 'en' | 'nl' | 'de';

interface ImageUploadProps {
  /**
   * Current image URLs
   */
  images: string[];

  /**
   * Callback when images are added
   */
  onImagesAdd: (files: File[]) => void;

  /**
   * Callback when an image is removed
   */
  onImageRemove: (index: number) => void;

  /**
   * Maximum number of images allowed
   */
  maxImages?: number;

  /**
   * Whether upload is disabled
   */
  disabled?: boolean;
}

export function ImageUpload({
  images,
  onImagesAdd,
  onImageRemove,
  maxImages = 10,
  disabled = false
}: ImageUploadProps) {
  const { language } = useLanguage();
  const lang = language as Language;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (disabled) return;

    const files = Array.from(e.dataTransfer.files).filter(file =>
      file.type.startsWith('image/')
    );

    if (files.length === 0) {
      toast.error(t.toasts.dropImagesOnly[lang]);
      return;
    }

    if (images.length + files.length > maxImages) {
      toast.error(t.toasts.maxImages[lang](maxImages));
      return;
    }

    onImagesAdd(files);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled) return;

    const files = Array.from(e.target.files || []).filter(file =>
      file.type.startsWith('image/')
    );

    if (files.length === 0) {
      toast.error(t.toasts.selectImagesOnly[lang]);
      return;
    }

    if (images.length + files.length > maxImages) {
      toast.error(t.toasts.maxImages[lang](maxImages));
      return;
    }

    onImagesAdd(files);

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemove = (index: number) => {
    if (disabled) return;
    onImageRemove(index);
  };

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <div
        className={`
          relative border-2 border-dashed superellipse-2xl p-8 text-center transition-all
          ${dragActive ? 'border-[#9c5698] bg-purple-50' : 'border-gray-300'}
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:border-[#9c5698]'}
        `}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => !disabled && fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileInput}
          className="hidden"
          disabled={disabled}
        />

        <div className="flex flex-col items-center gap-3">
          <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center">
            <Upload className="w-8 h-8 text-[#9c5698]" />
          </div>
          <div>
            <p className="text-lg font-semibold text-gray-700">
              {dragActive ? t.ui.dropHere[lang] : t.ui.uploadImages[lang]}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              {t.ui.dragOrClick[lang]}
            </p>
            <p className="text-xs text-gray-400 mt-2">
              {t.ui.maxSize[lang](maxImages)}
            </p>
          </div>
          {!disabled && (
            <Button type="button" variant="outline" onClick={(e) => {
              e.stopPropagation();
              fileInputRef.current?.click();
            }}>
              {t.ui.chooseFiles[lang]}
            </Button>
          )}
        </div>
      </div>

      {/* Image Preview Grid */}
      {images.length > 0 && (
        <div>
          <p className="text-sm font-medium text-gray-700 mb-3">
            {t.ui.imagesUploaded[lang](images.length)}
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {images.map((url, index) => (
              <div
                key={index}
                className="relative aspect-square superellipse-xl overflow-hidden bg-gray-100 group"
              >
                <Image
                  src={url}
                  alt={`Property image ${index + 1}`}
                  fill
                  sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                  className="object-cover"
                />
                {!disabled && (
                  <button
                    type="button"
                    onClick={() => handleRemove(index)}
                    className="absolute top-2 right-2 p-1.5 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-700"
                    title={t.ui.removeImage[lang]}
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
                {index === 0 && (
                  <div className="absolute bottom-2 left-2 px-2 py-1 bg-[#9c5698] text-white text-xs font-medium rounded">
                    {t.ui.mainImage[lang]}
                  </div>
                )}
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-500 mt-3">
            {t.ui.mainImageHint[lang]}
          </p>
        </div>
      )}

      {images.length === 0 && (
        <div className="text-center py-8 text-gray-400">
          <ImageIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
          <p className="text-sm">{t.ui.noImages[lang]}</p>
        </div>
      )}
    </div>
  );
}
