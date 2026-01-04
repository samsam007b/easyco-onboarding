'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';
import Image from 'next/image';
import { useLanguage } from '@/lib/i18n/use-language';

// Liste des images de propriétés
const PROPERTY_IMAGES = Array.from({ length: 28 }, (_, i) => {
  const num = String(i + 1).padStart(2, '0');
  return {
    src: `/images/properties/property-${num}.png`,
    alt: `Propriété ${i + 1}`,
  };
});

interface PropertyCarouselProps {
  autoPlayInterval?: number;
  showControls?: boolean;
  showIndicators?: boolean;
  className?: string;
}

export function PropertyCarousel({
  autoPlayInterval = 4000,
  showControls = true,
  showIndicators = true,
  className = '',
}: PropertyCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [direction, setDirection] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const { language, getSection } = useLanguage();
  const ariaLabels = getSection('ariaLabels');

  const goToNext = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % PROPERTY_IMAGES.length);
  };

  const goToPrev = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + PROPERTY_IMAGES.length) % PROPERTY_IMAGES.length);
  };

  const goToSlide = (index: number) => {
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  // Auto-play functionality
  useEffect(() => {
    if (!isPlaying) {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      return;
    }

    timerRef.current = setInterval(goToNext, autoPlayInterval);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isPlaying, currentIndex, autoPlayInterval]);

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.8,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.8,
    }),
  };

  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset: number, velocity: number) => {
    return Math.abs(offset) * velocity;
  };

  return (
    <div className={`relative w-full h-full overflow-hidden superellipse-2xl bg-gray-100 ${className}`}>
      {/* Main Carousel */}
      <div className="relative w-full h-full">
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: 'spring', stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 },
              scale: { duration: 0.3 },
            }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={1}
            onDragEnd={(e, { offset, velocity }) => {
              const swipe = swipePower(offset.x, velocity.x);

              if (swipe < -swipeConfidenceThreshold) {
                goToNext();
              } else if (swipe > swipeConfidenceThreshold) {
                goToPrev();
              }
            }}
            className="absolute inset-0 w-full h-full"
          >
            <div className="relative w-full h-full">
              <Image
                src={PROPERTY_IMAGES[currentIndex].src}
                alt={PROPERTY_IMAGES[currentIndex].alt}
                fill
                className="object-cover"
                priority={currentIndex === 0}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
              />
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation Controls */}
      {showControls && (
        <>
          {/* Previous Button */}
          <button
            onClick={goToPrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-white/90 hover:bg-white shadow-lg transition-all hover:scale-110"
            aria-label={ariaLabels?.previousImage?.[language] || 'Image précédente'}
          >
            <ChevronLeft className="w-6 h-6 text-gray-800" />
          </button>

          {/* Next Button */}
          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-white/90 hover:bg-white shadow-lg transition-all hover:scale-110"
            aria-label={ariaLabels?.nextImage?.[language] || 'Image suivante'}
          >
            <ChevronRight className="w-6 h-6 text-gray-800" />
          </button>

          {/* Play/Pause Button */}
          <button
            onClick={togglePlay}
            className="absolute bottom-4 right-4 z-10 p-3 rounded-full bg-white/90 hover:bg-white shadow-lg transition-all hover:scale-110"
            aria-label={isPlaying ? (ariaLabels?.pause?.[language] || 'Mettre en pause') : (ariaLabels?.autoPlay?.[language] || 'Lecture automatique')}
          >
            {isPlaying ? (
              <Pause className="w-5 h-5 text-gray-800" />
            ) : (
              <Play className="w-5 h-5 text-gray-800" />
            )}
          </button>
        </>
      )}

      {/* Indicators */}
      {showIndicators && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex gap-2">
          {PROPERTY_IMAGES.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`h-2 rounded-full transition-all ${
                index === currentIndex
                  ? 'w-8 bg-white'
                  : 'w-2 bg-white/50 hover:bg-white/75'
              }`}
              aria-label={`${ariaLabels?.goToImage?.[language] || "Aller à l'image"} ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Image Counter */}
      <div className="absolute top-4 left-4 z-10 px-3 py-1.5 rounded-full bg-black/50 backdrop-blur-sm">
        <span className="text-white text-sm font-medium">
          {currentIndex + 1} / {PROPERTY_IMAGES.length}
        </span>
      </div>
    </div>
  );
}
