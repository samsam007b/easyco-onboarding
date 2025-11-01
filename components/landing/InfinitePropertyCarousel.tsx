'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';

// Array of 5 hero images from Pexel
const CAROUSEL_IMAGES = [
  '/images/hero/pexels-charlotte-may-5824520.jpg',
  '/images/hero/pexels-jonathanborba-5570226.jpg',
  '/images/hero/pexels-kseniachernaya-4740485.jpg',
  '/images/hero/pexels-polina-zimmerman-3747425.jpg',
  '/images/hero/pexels-solliefoto-298842.jpg',
];

interface InfinitePropertyCarouselProps {
  speed?: number; // Duration in seconds for one complete cycle
  opacity?: number; // Background opacity (0-1)
  blur?: number; // Blur amount in pixels
}

export default function InfinitePropertyCarousel({
  speed = 40, // 40 seconds for a slow, smooth scroll (adjusted for 5 images)
  opacity = 0.15,
  blur = 4,
}: InfinitePropertyCarouselProps) {
  const carouselRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // No animation setup needed - handled by CSS
    return () => {};
  }, []);

  // Duplicate the images array to create seamless loop
  const duplicatedImages = [...CAROUSEL_IMAGES, ...CAROUSEL_IMAGES];

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Gradient overlays for smooth edges */}
      <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-gray-50 to-transparent z-10" />
      <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-gray-50 to-transparent z-10" />

      {/* Scrolling container */}
      <div
        ref={carouselRef}
        className="flex gap-6 h-full items-center"
        style={{
          animation: `scroll-left ${speed}s linear infinite`,
          opacity,
          filter: `blur(${blur}px)`,
        }}
      >
        {duplicatedImages.map((imageSrc, index) => (
          <div
            key={index}
            className="relative flex-shrink-0 h-[400px] w-[600px] rounded-2xl overflow-hidden shadow-xl"
          >
            <Image
              src={imageSrc}
              alt={`Property ${(index % CAROUSEL_IMAGES.length) + 1}`}
              fill
              className="object-cover"
              priority={index < 4} // Priority load first few images
              sizes="600px"
            />
          </div>
        ))}
      </div>

      {/* Global keyframes animation */}
      <style jsx global>{`
        @keyframes scroll-left {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(calc(-600px * ${CAROUSEL_IMAGES.length} - 1.5rem * ${CAROUSEL_IMAGES.length}));
          }
        }
      `}</style>
    </div>
  );
}
