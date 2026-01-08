'use client';

import { motion, useMotionValue, useTransform, PanInfo } from 'framer-motion';
import Image from 'next/image';
import { MapPin, Euro, Bed, Bath, Heart, X } from 'lucide-react';
import { useState } from 'react';

interface Property {
  id: string;
  title: string;
  city: string;
  neighborhood?: string;
  monthly_rent: number;
  bedrooms: number;
  bathrooms: number;
  main_image?: string;
  images?: string[];
  description?: string;
  compatibilityScore?: number;
}

interface SwipeCardProps {
  property: Property;
  onSwipe: (direction: 'left' | 'right', propertyId: string) => void;
  onSuperLike?: (propertyId: string) => void;
}

export default function SwipeCard({ property, onSwipe, onSuperLike }: SwipeCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-25, 25]);
  const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0, 1, 1, 1, 0]);

  const images = property.images && property.images.length > 0
    ? property.images
    : property.main_image
      ? [property.main_image]
      : [`https://api.dicebear.com/7.x/shapes/svg?seed=${property.id}&backgroundColor=6E56CF,FFD249,FF6F3C`];

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const threshold = 100;

    if (Math.abs(info.offset.x) > threshold) {
      const direction = info.offset.x > 0 ? 'right' : 'left';
      onSwipe(direction, property.id);
    }
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  // Generate placeholder image
  const getPlaceholderImage = () => {
    return `https://api.dicebear.com/7.x/shapes/svg?seed=${property.id}&backgroundColor=6E56CF,FFD249,FF6F3C`;
  };

  const imageUrl = images[currentImageIndex] || getPlaceholderImage();

  return (
    <motion.div
      className="absolute w-full h-full"
      style={{
        x,
        rotate,
        opacity,
        cursor: 'grab',
      }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={handleDragEnd}
      whileTap={{ cursor: 'grabbing' }}
    >
      <div className="relative w-full h-full bg-white superellipse-3xl shadow-2xl overflow-hidden">
        {/* Image Section */}
        <div className="relative h-[70%] bg-gray-200">
          <Image
            src={imageUrl}
            alt={property.title}
            fill
            className="object-cover"
            priority
          />

          {/* Image Navigation */}
          {images.length > 1 && (
            <>
              <div className="absolute top-4 left-1/2 transform -translate-x-1/2 flex gap-1">
                {images.map((_, index) => (
                  <div
                    key={index}
                    className={`h-1 rounded-full transition-all ${
                      index === currentImageIndex
                        ? 'w-8 bg-white'
                        : 'w-1 bg-white/50'
                    }`}
                  />
                ))}
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  prevImage();
                }}
                className="absolute left-2 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-black/30 hover:bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center transition"
              >
                <span className="text-white text-xl">‹</span>
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  nextImage();
                }}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-black/30 hover:bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center transition"
              >
                <span className="text-white text-xl">›</span>
              </button>
            </>
          )}

          {/* Compatibility Score Badge */}
          {property.compatibilityScore && (
            <div className="absolute top-4 right-4 bg-gradient-to-r from-searcher-400 to-searcher-500 text-white px-4 py-2 rounded-full shadow-lg">
              <span className="font-bold text-lg">{property.compatibilityScore}%</span>
              <span className="text-sm ml-1">Match</span>
            </div>
          )}

          {/* Swipe Indicators */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
            style={{
              opacity: useTransform(x, [-200, -50, 0], [1, 0.3, 0]),
            }}
          >
            <div className="w-32 h-32 border-8 border-red-500 rounded-full flex items-center justify-center bg-white/90 shadow-xl rotate-[-20deg]">
              <X className="w-16 h-16 text-red-500" />
            </div>
          </motion.div>

          <motion.div
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
            style={{
              opacity: useTransform(x, [0, 50, 200], [0, 0.3, 1]),
            }}
          >
            <div className="w-32 h-32 border-8 border-green-500 rounded-full flex items-center justify-center bg-white/90 shadow-xl rotate-[20deg]">
              <Heart className="w-16 h-16 text-green-500 fill-green-500" />
            </div>
          </motion.div>
        </div>

        {/* Info Section */}
        <div className="h-[30%] p-6 bg-white">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900 mb-1 line-clamp-1">
                {property.title}
              </h2>
              <div className="flex items-center text-gray-600 text-sm mb-2">
                <MapPin className="w-4 h-4 mr-1" />
                <span>
                  {property.neighborhood ? `${property.neighborhood}, ` : ''}{property.city}
                </span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold text-searcher-600">
                €{property.monthly_rent}
              </p>
              <p className="text-xs text-gray-500">par mois</p>
            </div>
          </div>

          <div className="flex items-center gap-4 mb-3">
            <div className="flex items-center text-gray-700">
              <Bed className="w-5 h-5 mr-1 text-searcher-600" />
              <span className="font-medium">{property.bedrooms} ch.</span>
            </div>
            <div className="flex items-center text-gray-700">
              <Bath className="w-5 h-5 mr-1 text-searcher-600" />
              <span className="font-medium">{property.bathrooms} sdb.</span>
            </div>
          </div>

          {property.description && (
            <p className="text-sm text-gray-600 line-clamp-2">
              {property.description}
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
}
