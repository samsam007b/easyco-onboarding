'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

interface BackgroundCarouselProps {
  images: string[];
  speed?: number; // Duration in seconds for one complete cycle
  opacity?: number; // Opacity of the carousel (0-1)
}

export default function BackgroundCarousel({
  images,
  speed = 60,
  opacity = 0.15,
}: BackgroundCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (images.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, speed * 1000);

    return () => clearInterval(interval);
  }, [images.length, speed]);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-purple-50/95 via-white/90 to-gray-50/95 z-10" />

      {/* Scrolling Background Images */}
      <div className="relative w-full h-full">
        {images.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-2000 ease-in-out ${
              index === currentIndex ? 'opacity-100' : 'opacity-0'
            }`}
            style={{
              opacity: index === currentIndex ? opacity : 0,
            }}
          >
            {/* Infinite Scroll Effect */}
            <div
              className="flex animate-scroll-slow"
              style={{
                width: '200%',
                height: '100%',
                animationDuration: `${speed}s`,
              }}
            >
              {/* First Instance */}
              <div className="relative w-1/2 h-full flex-shrink-0">
                <Image
                  src={image}
                  alt={`Background ${index + 1}`}
                  fill
                  className="object-cover"
                  priority={index === 0}
                  sizes="100vw"
                  quality={85}
                />
              </div>

              {/* Second Instance (for seamless loop) */}
              <div className="relative w-1/2 h-full flex-shrink-0">
                <Image
                  src={image}
                  alt={`Background ${index + 1} duplicate`}
                  fill
                  className="object-cover"
                  priority={index === 0}
                  sizes="100vw"
                  quality={85}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Additional Vignette Effect */}
      <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-purple-50/80 z-10" />
    </div>
  );
}
