'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { Button } from './ui/button';
import { toast } from 'sonner';

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
      toast.error('Please drop image files only');
      return;
    }

    if (images.length + files.length > maxImages) {
      toast.error(`Maximum ${maxImages} images allowed`);
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
      toast.error('Please select image files only');
      return;
    }

    if (images.length + files.length > maxImages) {
      toast.error(`Maximum ${maxImages} images allowed`);
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
          relative border-2 border-dashed rounded-2xl p-8 text-center transition-all
          ${dragActive ? 'border-[#4A148C] bg-purple-50' : 'border-gray-300'}
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:border-[#4A148C]'}
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
            <Upload className="w-8 h-8 text-[#4A148C]" />
          </div>
          <div>
            <p className="text-lg font-semibold text-gray-700">
              {dragActive ? 'Drop images here' : 'Upload Property Images'}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Drag and drop or click to browse
            </p>
            <p className="text-xs text-gray-400 mt-2">
              Maximum {maxImages} images, up to 5MB each
            </p>
          </div>
          {!disabled && (
            <Button type="button" variant="outline" onClick={(e) => {
              e.stopPropagation();
              fileInputRef.current?.click();
            }}>
              Choose Files
            </Button>
          )}
        </div>
      </div>

      {/* Image Preview Grid */}
      {images.length > 0 && (
        <div>
          <p className="text-sm font-medium text-gray-700 mb-3">
            {images.length} {images.length === 1 ? 'image' : 'images'} uploaded
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {images.map((url, index) => (
              <div
                key={index}
                className="relative aspect-square rounded-xl overflow-hidden bg-gray-100 group"
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
                    title="Remove image"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
                {index === 0 && (
                  <div className="absolute bottom-2 left-2 px-2 py-1 bg-[#4A148C] text-white text-xs font-medium rounded">
                    Main Image
                  </div>
                )}
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-500 mt-3">
            The first image will be used as the main property image
          </p>
        </div>
      )}

      {images.length === 0 && (
        <div className="text-center py-8 text-gray-400">
          <ImageIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
          <p className="text-sm">No images uploaded yet</p>
        </div>
      )}
    </div>
  );
}
