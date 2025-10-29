'use client';

import { useState } from 'react';
import { motion, useMotionValue, useTransform, PanInfo } from 'framer-motion';
import { Heart, X, MapPin, Briefcase, Calendar, Sparkles } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { UserProfile, getCompatibilityQuality } from '@/lib/services/user-matching-service';
import Image from 'next/image';

interface SwipeCardProps {
  user: UserProfile & { compatibility_score?: number };
  onSwipe: (direction: 'left' | 'right') => void;
  onCardClick?: () => void;
}

export function SwipeCard({ user, onSwipe, onCardClick }: SwipeCardProps) {
  const [exitX, setExitX] = useState(0);
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-30, 30]);
  const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0, 1, 1, 1, 0]);

  const calculateAge = (dateOfBirth?: string): number | null => {
    if (!dateOfBirth) return null;
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const age = calculateAge(user.date_of_birth);
  const compatibilityQuality = user.compatibility_score
    ? getCompatibilityQuality(user.compatibility_score)
    : null;

  const handleDragEnd = (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const threshold = 100;

    if (info.offset.x > threshold) {
      // Swiped right (like)
      setExitX(1000);
      onSwipe('right');
    } else if (info.offset.x < -threshold) {
      // Swiped left (pass)
      setExitX(-1000);
      onSwipe('left');
    }
  };

  return (
    <motion.div
      className="absolute w-full h-full cursor-grab active:cursor-grabbing"
      style={{
        x,
        rotate,
        opacity,
      }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={handleDragEnd}
      animate={{ x: exitX }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      <div
        className="relative w-full h-full bg-white rounded-3xl shadow-2xl overflow-hidden"
        onClick={onCardClick}
      >
        {/* Profile Image - OPTIMIZED with Next.js Image */}
        <div className="relative h-[60%] overflow-hidden">
          {user.profile_photo_url ? (
            <Image
              src={user.profile_photo_url}
              alt={`${user.first_name} ${user.last_name}`}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
              priority={false}
              loading="lazy"
              quality={85}
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-purple-200 via-purple-100 to-yellow-100 flex items-center justify-center">
              <div className="text-6xl font-bold text-[#4A148C] opacity-30">
                {user.first_name.charAt(0)}
                {user.last_name.charAt(0)}
              </div>
            </div>
          )}

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/60" />

          {/* Compatibility Badge */}
          {compatibilityQuality && (
            <div className="absolute top-4 right-4 px-4 py-2 bg-white/95 backdrop-blur-sm rounded-full shadow-lg">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{compatibilityQuality.emoji}</span>
                <div>
                  <p className="text-xs font-semibold text-gray-600">Match Score</p>
                  <p className="text-lg font-bold text-[#4A148C]">{user.compatibility_score}%</p>
                </div>
              </div>
            </div>
          )}

          {/* Name & Age */}
          <div className="absolute bottom-4 left-4 right-4">
            <h2 className="text-3xl font-bold text-white mb-1">
              {user.first_name} {user.last_name}
              {age && <span className="text-2xl font-normal ml-2">{age}</span>}
            </h2>
            {user.occupation_status && (
              <div className="flex items-center gap-2 text-white/90">
                <Briefcase className="w-4 h-4" />
                <span className="capitalize">{user.occupation_status.replace('_', ' ')}</span>
              </div>
            )}
          </div>
        </div>

        {/* Profile Details */}
        <div className="h-[40%] p-6 overflow-y-auto">
          {/* Location & Languages */}
          <div className="flex items-center gap-4 mb-4">
            {user.nationality && (
              <Badge variant="default" className="px-3 py-1">
                <MapPin className="w-3 h-3 mr-1" />
                {user.nationality}
              </Badge>
            )}
            {user.languages && user.languages.length > 0 && (
              <div className="flex gap-2">
                {user.languages.slice(0, 3).map((lang, idx) => (
                  <Badge key={idx} variant="secondary" size="sm">
                    {lang}
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Bio */}
          {user.bio && (
            <p className="text-gray-700 text-sm mb-4 line-clamp-3">{user.bio}</p>
          )}

          {/* Lifestyle Info */}
          <div className="space-y-3">
            {/* Core Values */}
            {user.core_values && user.core_values.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-gray-600 mb-2 flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  Core Values
                </p>
                <div className="flex flex-wrap gap-2">
                  {user.core_values.slice(0, 5).map((value, idx) => (
                    <Badge key={idx} variant="default" size="sm" className="capitalize">
                      {value}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Lifestyle Tags */}
            <div className="flex flex-wrap gap-2">
              {user.cleanliness_level && user.cleanliness_level >= 8 && (
                <Badge variant="default" size="sm">
                  ✨ Very Clean
                </Badge>
              )}
              {user.social_energy && user.social_energy >= 7 && (
                <Badge variant="default" size="sm">
                  🎉 Extrovert
                </Badge>
              )}
              {user.social_energy && user.social_energy <= 4 && (
                <Badge variant="default" size="sm">
                  📚 Introvert
                </Badge>
              )}
              {user.cooking_frequency && ['often', 'daily'].includes(user.cooking_frequency) && (
                <Badge variant="default" size="sm">
                  👨‍🍳 Cooks Often
                </Badge>
              )}
              {user.pets && (
                <Badge variant="default" size="sm">
                  🐾 Has Pets
                </Badge>
              )}
              {user.shared_meals_interest && (
                <Badge variant="default" size="sm">
                  🍽️ Shared Meals
                </Badge>
              )}
            </div>
          </div>

          {/* Budget Range */}
          {user.min_budget && user.max_budget && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <p className="text-xs font-semibold text-gray-600 mb-1">Budget Range</p>
              <p className="text-sm font-semibold text-[#4A148C]">
                €{user.min_budget} - €{user.max_budget}/month
              </p>
            </div>
          )}
        </div>

        {/* Swipe Indicators */}
        <motion.div
          className="absolute top-1/4 left-8 text-6xl font-bold text-green-500 opacity-0 rotate-[-20deg] pointer-events-none"
          style={{
            opacity: useTransform(x, [0, 100], [0, 1]),
          }}
        >
          LIKE
        </motion.div>
        <motion.div
          className="absolute top-1/4 right-8 text-6xl font-bold text-red-500 opacity-0 rotate-[20deg] pointer-events-none"
          style={{
            opacity: useTransform(x, [-100, 0], [1, 0]),
          }}
        >
          PASS
        </motion.div>
      </div>
    </motion.div>
  );
}
