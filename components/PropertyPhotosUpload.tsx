'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { Upload, X, Loader2, ImagePlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useImageUpload } from '@/lib/hooks/use-image-upload';
import { toast } from 'sonner';

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
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [photos, setPhotos] = useState<string[]>(initialPhotos);
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);
  const { uploadImage, uploadProgress, isUploading } = useImageUpload();

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (!files.length) return;

    // Check if adding these files would exceed the limit
    if (photos.length + files.length > maxPhotos) {
      toast.error(`You can upload a maximum of ${maxPhotos} photos`);
      return;
    }

    // Process each file
    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error(`${file.name} is not an image file`);
        continue;
      }

      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast.error(`${file.name} must be smaller than 10MB`);
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

        toast.success(`Photo ${i + 1} uploaded successfully!`);
      } catch (error: any) {
        toast.error(error.message || `Failed to upload ${file.name}`);
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
    toast.success('Photo removed');
  };

  const handleClick = () => {
    if (photos.length >= maxPhotos) {
      toast.error(`Maximum of ${maxPhotos} photos allowed`);
      return;
    }
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-4">
      {/* Upload button */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-medium text-gray-700">Property Photos</h3>
          <p className="text-xs text-gray-500 mt-1">
            Upload up to {maxPhotos} photos (JPG, PNG or GIF. Max 10MB each)
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
              Uploading...
            </>
          ) : (
            <>
              <ImagePlus className="w-4 h-4 mr-2" />
              Add Photos
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
                title="Remove photo"
              >
                <X className="w-4 h-4" />
              </button>
            )}

            {/* Primary badge for first photo */}
            {index === 0 && (
              <div className="absolute bottom-2 left-2 px-2 py-1 bg-[color:var(--easy-purple)] text-white text-xs font-semibold rounded">
                Primary
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
                Upload
              </span>
            </div>
          </button>
        )}
      </div>

      {/* Photo count */}
      <div className="text-center text-sm text-gray-500">
        {photos.length} / {maxPhotos} photos uploaded
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
