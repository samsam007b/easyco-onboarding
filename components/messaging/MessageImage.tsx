'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MessageImageProps {
  imageUrl: string;
  alt?: string;
  width?: number;
  height?: number;
}

export function MessageImage({ imageUrl, alt = 'Image', width, height }: MessageImageProps) {
  const [showFullscreen, setShowFullscreen] = useState(false);

  // Calculate display dimensions (max 300px width while maintaining aspect ratio)
  const maxWidth = 300;
  let displayWidth = width || maxWidth;
  let displayHeight = height;

  if (width && width > maxWidth) {
    const ratio = maxWidth / width;
    displayWidth = maxWidth;
    displayHeight = height ? height * ratio : undefined;
  }

  return (
    <>
      {/* Thumbnail */}
      <div className="mt-2">
        <img
          src={imageUrl}
          alt={alt}
          width={displayWidth}
          height={displayHeight}
          className="rounded-lg cursor-pointer hover:opacity-90 transition-opacity max-w-full"
          onClick={() => setShowFullscreen(true)}
          loading="lazy"
        />
      </div>

      {/* Fullscreen modal */}
      {showFullscreen && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setShowFullscreen(false)}
        >
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 text-white hover:bg-white/20 rounded-full"
            onClick={(e) => {
              e.stopPropagation();
              setShowFullscreen(false);
            }}
          >
            <X className="h-6 w-6" />
          </Button>

          <img
            src={imageUrl}
            alt={alt}
            className="max-w-full max-h-full object-contain rounded-lg"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  );
}
