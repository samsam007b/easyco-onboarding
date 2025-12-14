'use client';

import { motion } from 'framer-motion';
import { Sparkles, MapPin, Briefcase } from 'lucide-react';
import { useState } from 'react';
import Image from 'next/image';

const RESIDENT_GRADIENT = 'linear-gradient(135deg, #d9574f 0%, #ff5b21 50%, #ff8017 100%)';
const RESIDENT_PRIMARY = '#ee5736';

// Mock profiles data
const MOCK_PROFILES = [
  {
    name: 'Marie L.',
    age: 24,
    score: 92,
    city: 'Paris 11ème',
    occupation: 'Designer',
    image: null, // Will use gradient fallback
    initials: 'ML',
  },
  {
    name: 'Thomas B.',
    age: 26,
    score: 87,
    city: 'Paris 10ème',
    occupation: 'Développeur',
    image: null,
    initials: 'TB',
  },
  {
    name: 'Sophie M.',
    age: 23,
    score: 81,
    city: 'Paris 9ème',
    occupation: 'Étudiante',
    image: null,
    initials: 'SM',
  },
];

export default function MockCardStack() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="relative h-[400px] flex items-center justify-center"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Stack of 3 cards */}
      {MOCK_PROFILES.map((profile, index) => {
        // Calculate positions for stack and fan effect
        const stackOffset = index * 8;
        const fanRotation = isHovered ? (index - 1) * 8 : 0;
        const fanTranslateX = isHovered ? (index - 1) * 40 : 0;
        const zIndex = 3 - index;

        return (
          <motion.div
            key={index}
            className="absolute w-[280px] rounded-3xl shadow-2xl overflow-hidden bg-white cursor-pointer"
            style={{ zIndex }}
            initial={{ y: stackOffset, rotate: 0, x: 0 }}
            animate={{
              y: stackOffset,
              rotate: fanRotation,
              x: fanTranslateX,
              scale: isHovered && index === 0 ? 1.05 : 1,
            }}
            transition={{
              type: 'spring',
              stiffness: 300,
              damping: 30,
            }}
          >
            {/* Card Content */}
            <div className="relative">
              {/* Profile Image / Gradient */}
              <div className="relative h-[200px] overflow-hidden">
                {profile.image ? (
                  <Image
                    src={profile.image}
                    alt={profile.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div
                    className="w-full h-full flex items-center justify-center"
                    style={{ background: RESIDENT_GRADIENT }}
                  >
                    <div className="text-7xl font-bold text-white opacity-30">
                      {profile.initials}
                    </div>
                  </div>
                )}

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/70" />

                {/* Compatibility Badge */}
                <div className="absolute top-4 right-4 z-10">
                  <div
                    className="px-4 py-2.5 rounded-2xl shadow-xl backdrop-blur-md border-2 border-white/50"
                    style={{ background: RESIDENT_GRADIENT }}
                  >
                    <div className="flex items-center gap-2">
                      <Sparkles
                        className="w-4 h-4 text-white"
                        strokeWidth={2.5}
                        fill={profile.score >= 80 ? '#fff' : 'none'}
                      />
                      <div className="text-center">
                        <p className="text-2xl font-black text-white leading-none">
                          {profile.score}%
                        </p>
                        <p className="text-[10px] font-bold text-white/90 uppercase tracking-wide">
                          Match
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Name & Basic Info */}
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-xl font-bold text-white mb-1">
                    {profile.name}
                    <span className="text-lg font-normal ml-2 text-white/90">
                      {profile.age} ans
                    </span>
                  </h3>
                  <div className="flex items-center gap-3 text-white/90 text-sm">
                    <div className="flex items-center gap-1.5">
                      <Briefcase className="w-3.5 h-3.5" />
                      <span>{profile.occupation}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5" />
                      <span>{profile.city}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Info */}
              <div className="p-4 bg-white">
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-gray-50 rounded-lg px-3 py-2 border border-gray-100">
                    <p className="text-xs text-gray-500 font-medium">Budget</p>
                    <p className="text-sm font-bold text-gray-900">600-800€</p>
                  </div>
                  <div className="flex-1 bg-gray-50 rounded-lg px-3 py-2 border border-gray-100">
                    <p className="text-xs text-gray-500 font-medium">Propreté</p>
                    <p className="text-sm font-bold text-gray-900">Ordonné</p>
                  </div>
                </div>
              </div>

              {/* Blur Overlay for stacked cards */}
              {index > 0 && (
                <motion.div
                  className="absolute inset-0 backdrop-blur-sm bg-white/10 flex items-center justify-center"
                  animate={{ opacity: isHovered ? 0 : 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="bg-white/90 backdrop-blur-md px-6 py-3 rounded-full shadow-lg">
                    <p className="text-sm font-bold" style={{ color: RESIDENT_PRIMARY }}>
                      +{MOCK_PROFILES.length - index - 1} profils à découvrir
                    </p>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        );
      })}

      {/* Call to Action overlay on first card */}
      <motion.div
        className="absolute inset-0 flex items-end justify-center pb-8 pointer-events-none z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered ? 0 : 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="bg-white/95 backdrop-blur-md px-6 py-3 rounded-full shadow-xl border-2" style={{ borderColor: RESIDENT_PRIMARY }}>
          <p className="text-sm font-bold flex items-center gap-2" style={{ color: RESIDENT_PRIMARY }}>
            <span>Swipe pour découvrir</span>
            <span className="text-lg">→</span>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
