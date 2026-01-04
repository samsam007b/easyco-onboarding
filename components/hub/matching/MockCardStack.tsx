'use client';

import { motion } from 'framer-motion';
import { Sparkles, MapPin, Briefcase, Star, Heart, X } from 'lucide-react';
import { useState } from 'react';
import Image from 'next/image';

// V3 Option C - Official Resident Palette
const RESIDENT_GRADIENT = 'linear-gradient(135deg, #e05747 0%, #ff651e 50%, #ff9014 100%)';
const RESIDENT_PRIMARY = '#ff651e';
const CARD_BG_GRADIENT = 'linear-gradient(135deg, #FFF5F0 0%, #FFEDE5 100%)';
const ACCENT_SHADOW = 'rgba(255, 101, 30, 0.25)';

// Mock profiles data
const MOCK_PROFILES = [
  {
    name: 'Marie L.',
    age: 24,
    score: 92,
    city: 'Paris 11ème',
    occupation: 'Designer',
    image: null,
    initials: 'ML',
    trait: '🎨 Créative',
  },
  {
    name: 'Thomas B.',
    age: 26,
    score: 87,
    city: 'Paris 10ème',
    occupation: 'Développeur',
    image: null,
    initials: 'TB',
    trait: '💻 Tech-savvy',
  },
  {
    name: 'Sophie M.',
    age: 23,
    score: 81,
    city: 'Paris 9ème',
    occupation: 'Étudiante',
    image: null,
    initials: 'SM',
    trait: '📚 Studieuse',
  },
];

export default function MockCardStack() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="relative h-[380px] flex items-center justify-center"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Stack of 3 cards */}
      {MOCK_PROFILES.map((profile, index) => {
        // Calculate positions for stack and fan effect
        const stackOffset = index * 10;
        const fanRotation = isHovered ? (index - 1) * 10 : (index - 1) * 2;
        const fanTranslateX = isHovered ? (index - 1) * 50 : 0;
        const zIndex = 3 - index;

        return (
          <motion.div
            key={index}
            className="absolute w-[260px] superellipse-3xl overflow-hidden bg-white cursor-pointer"
            style={{
              zIndex,
              boxShadow: index === 0 ? `0 20px 50px ${ACCENT_SHADOW}` : '0 8px 24px rgba(0,0,0,0.1)',
            }}
            initial={{ y: stackOffset, rotate: fanRotation, x: 0 }}
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
              <div className="relative h-[180px] overflow-hidden">
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
                    <motion.div
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ duration: 3, repeat: Infinity }}
                      className="text-6xl font-black text-white opacity-40"
                    >
                      {profile.initials}
                    </motion.div>
                  </div>
                )}

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/80" />

                {/* Compatibility Badge */}
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className="absolute top-3 right-3 z-10"
                >
                  <div
                    className="px-3 py-2 superellipse-2xl shadow-xl backdrop-blur-md border-2 border-white/40"
                    style={{ background: 'rgba(255,255,255,0.95)' }}
                  >
                    <div className="flex items-center gap-1.5">
                      <Star
                        className="w-4 h-4"
                        style={{ color: RESIDENT_PRIMARY }}
                        fill={profile.score >= 80 ? RESIDENT_PRIMARY : 'none'}
                      />
                      <div className="text-center">
                        <p
                          className="text-xl font-black leading-none"
                          style={{ color: RESIDENT_PRIMARY }}
                        >
                          {profile.score}%
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Name & Basic Info */}
                <div className="absolute bottom-3 left-3 right-3">
                  <h3 className="text-lg font-bold text-white mb-0.5">
                    {profile.name}
                    <span className="text-base font-medium ml-1.5 text-white/90">
                      {profile.age}
                    </span>
                  </h3>
                  <div className="flex items-center gap-2 text-white/90 text-xs">
                    <div className="flex items-center gap-1">
                      <Briefcase className="w-3 h-3" />
                      <span>{profile.occupation}</span>
                    </div>
                    <span>•</span>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      <span>{profile.city}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Info */}
              <div className="p-4 bg-white">
                <div className="flex items-center gap-2 mb-3">
                  <div
                    className="flex-1 superellipse-xl px-3 py-2"
                    style={{ background: CARD_BG_GRADIENT }}
                  >
                    <p className="text-[10px] text-gray-500 font-medium uppercase tracking-wide">Budget</p>
                    <p className="text-sm font-bold text-gray-900">600-800€</p>
                  </div>
                  <div
                    className="flex-1 superellipse-xl px-3 py-2"
                    style={{ background: 'rgba(59, 130, 246, 0.08)' }}
                  >
                    <p className="text-[10px] text-gray-500 font-medium uppercase tracking-wide">Style</p>
                    <p className="text-sm font-bold text-gray-900">Ordonné</p>
                  </div>
                </div>

                {/* Trait Badge */}
                <div
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold"
                  style={{
                    background: CARD_BG_GRADIENT,
                    color: RESIDENT_PRIMARY,
                  }}
                >
                  <Sparkles className="w-3 h-3" />
                  {profile.trait}
                </div>
              </div>

              {/* Blur Overlay for stacked cards */}
              {index > 0 && (
                <motion.div
                  className="absolute inset-0 backdrop-blur-sm bg-white/20 flex items-center justify-center"
                  animate={{ opacity: isHovered ? 0 : 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <div
                    className="px-5 py-2.5 rounded-full shadow-xl"
                    style={{
                      background: 'white',
                      boxShadow: `0 8px 24px ${ACCENT_SHADOW}`,
                    }}
                  >
                    <p className="text-sm font-bold" style={{ color: RESIDENT_PRIMARY }}>
                      +{MOCK_PROFILES.length - 1} profils
                    </p>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        );
      })}

      {/* Action buttons overlay */}
      <motion.div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 flex items-center gap-4 z-20"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 20 }}
        transition={{ duration: 0.3 }}
      >
        {/* Reject Button */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-xl"
          style={{ boxShadow: '0 8px 24px rgba(239, 68, 68, 0.2)' }}
        >
          <X className="w-6 h-6 text-red-500" />
        </motion.button>

        {/* Like Button */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="w-14 h-14 rounded-full flex items-center justify-center shadow-xl"
          style={{
            background: RESIDENT_GRADIENT,
            boxShadow: `0 8px 24px ${ACCENT_SHADOW}`,
          }}
        >
          <Heart className="w-7 h-7 text-white" fill="white" />
        </motion.button>
      </motion.div>

      {/* Swipe hint */}
      <motion.div
        className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10"
        initial={{ opacity: 1 }}
        animate={{ opacity: isHovered ? 0 : 1 }}
        transition={{ duration: 0.3 }}
      >
        <div
          className="px-5 py-2.5 rounded-full shadow-xl bg-white"
          style={{ boxShadow: `0 8px 24px ${ACCENT_SHADOW}` }}
        >
          <p className="text-sm font-bold flex items-center gap-2" style={{ color: RESIDENT_PRIMARY }}>
            <span>Swipe pour découvrir</span>
            <motion.span
              animate={{ x: [0, 5, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              →
            </motion.span>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
