'use client';

import React from 'react';
import Image from 'next/image';

interface PropertyMarkerCardProps {
  imageUrl: string;
  price: number;
  isSelected: boolean;
  isHovered: boolean;
  onClick: () => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

export default function PropertyMarkerCard({
  imageUrl,
  price,
  isSelected,
  isHovered,
  onClick,
  onMouseEnter,
  onMouseLeave,
}: PropertyMarkerCardProps) {
  const scale = isSelected || isHovered ? 'scale-110' : 'scale-100';
  const zIndex = isSelected || isHovered ? 'z-50' : 'z-10';

  return (
    <div
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className={`
        cursor-pointer transition-all duration-200 ${scale} ${zIndex}
        ${isSelected ? 'ring-2 ring-amber-500 ring-offset-2' : ''}
      `}
      style={{ position: 'relative' }}
    >
      {/* Card Container */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
        {/* Property Image */}
        <div className="relative w-[120px] h-[90px]">
          <Image
            src={imageUrl || '/placeholder-property.jpg'}
            alt="Property"
            fill
            className="object-cover"
            sizes="120px"
          />
        </div>

        {/* Price Badge - with glassmorphism */}
        <div className="relative px-2 py-1.5 overflow-hidden">
          {/* Animated background lights - Slow right to left */}
          <div className="absolute inset-0 bg-gradient-to-br from-orange-50 via-purple-50 to-yellow-50">
            <div className="absolute top-0 left-1/4 w-16 h-16 bg-orange-300/60 rounded-full blur-xl"
                 style={{ animation: 'float 20s ease-in-out infinite' }} />
            <div className="absolute bottom-0 right-1/4 w-20 h-20 bg-purple-300/50 rounded-full blur-xl"
                 style={{ animation: 'float 25s ease-in-out infinite 5s' }} />
          </div>

          {/* Glassmorphism layer */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/70 via-white/60 to-white/50 backdrop-blur-2xl backdrop-saturate-150 z-10"
               style={{
                 WebkitBackdropFilter: 'blur(40px) saturate(150%)',
                 backdropFilter: 'blur(40px) saturate(150%)'
               }}
          />
          <div className="absolute inset-0 border-t border-white/30 shadow-lg z-10" />

          <div className="relative z-20 text-sm font-bold text-gray-900 text-center">
            {price}€
          </div>
        </div>
      </div>

      {/* Bottom Pointer Triangle */}
      <div className="absolute left-1/2 -bottom-2 -translate-x-1/2">
        <div className="w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[8px] border-t-white filter drop-shadow-md"></div>
      </div>
    </div>
  );
}
