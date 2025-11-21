'use client';

import { useState, useCallback, memo } from 'react';
import { motion, useMotionValue, useTransform, PanInfo } from 'framer-motion';
import { Heart, X, MapPin, Briefcase, Calendar, Sparkles } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { UserProfile, getCompatibilityQuality } from '@/lib/services/user-matching-service';
import Image from 'next/image';

interface SwipeCardProps {
  user: UserProfile & { compatibility_score?: number };
  onSwipe: (direction: 'left' | 'right') => void;
  onCardClick?: () => void;
  swipeAction?: 'like' | 'pass' | null;
}

export const SwipeCard = memo(function SwipeCard({ user, onSwipe, onCardClick, swipeAction }: SwipeCardProps) {
  const [exitX, setExitX] = useState(0);
  const [exitRotate, setExitRotate] = useState(0);
  const [rotateY, setRotateY] = useState(0);
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

  const handleDragEnd = useCallback((_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const threshold = 100;

    if (info.offset.x > threshold) {
      // Swiped right (like)
      setExitX(1000);
      setExitRotate(25);
      onSwipe('right');
    } else if (info.offset.x < -threshold) {
      // Swiped left (pass) - flip the card
      setRotateY(180);
      setTimeout(() => {
        setExitX(-1000);
        setExitRotate(-25);
      }, 300);
      setTimeout(() => onSwipe('left'), 600);
    }
  }, [onSwipe]);

  return (
    <motion.div
      className="absolute w-full h-full cursor-grab active:cursor-grabbing"
      style={{
        x,
        rotate,
        opacity,
        rotateY,
        transformStyle: 'preserve-3d',
      }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={handleDragEnd}
      animate={{ x: exitX, rotate: exitRotate, rotateY }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      <div
        className="relative w-full h-full bg-white rounded-3xl shadow-2xl overflow-hidden"
        onClick={onCardClick}
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Card Front */}
        <div style={{ backfaceVisibility: 'hidden' }}>
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
            <div className="w-full h-full bg-gradient-to-br from-orange-200 via-orange-100 to-yellow-100 flex items-center justify-center">
              <div className="text-6xl font-bold text-orange-600 opacity-30">
                {user.first_name.charAt(0)}
                {user.last_name.charAt(0)}
              </div>
            </div>
          )}

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/60" />

          {/* Compatibility Badge */}
          {user.compatibility_score && (
            <div
              className="absolute top-4 right-4 px-5 py-3 rounded-full shadow-xl backdrop-blur-md border-2 border-white/50"
              style={{
                background: `linear-gradient(135deg,
                  rgba(255, 160, 64, ${user.compatibility_score / 100 * 0.95}) 0%,
                  rgba(255, 184, 92, ${user.compatibility_score / 100 * 0.85}) 50%,
                  rgba(255, 206, 126, ${user.compatibility_score / 100 * 0.75}) 100%)`
              }}
            >
              <div className="flex items-center gap-2">
                <Sparkles
                  className="w-5 h-5"
                  style={{
                    color: user.compatibility_score >= 80 ? '#fff' :
                           user.compatibility_score >= 60 ? '#fffbeb' :
                           '#fef3c7'
                  }}
                  strokeWidth={2.5}
                  fill={user.compatibility_score >= 80 ? '#fff' : 'none'}
                />
                <div>
                  <p
                    className="text-xs font-bold tracking-wide uppercase"
                    style={{
                      color: user.compatibility_score >= 70 ? '#fff' : '#78350f'
                    }}
                  >
                    Match
                  </p>
                  <p
                    className="text-2xl font-black leading-none"
                    style={{
                      color: user.compatibility_score >= 70 ? '#fff' : '#92400e'
                    }}
                  >
                    {user.compatibility_score}%
                  </p>
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
              <p className="text-sm font-semibold text-orange-600">
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

        {/* Card Back - shown when flipped (dislike) */}
        <div
          className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl flex items-center justify-center"
          style={{
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
          }}
        >
          <div className="text-center">
            <X className="w-48 h-48 text-gray-400 opacity-30 mx-auto mb-4" />
            <p className="text-2xl font-bold text-gray-500">Pas pour moi</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
});
