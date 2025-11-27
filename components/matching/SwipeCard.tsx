'use client';

import { useState, useCallback, memo } from 'react';
import { motion, useMotionValue, useTransform, PanInfo, useAnimation } from 'framer-motion';
import { Heart, X, MapPin, Briefcase, Calendar, Sparkles } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { UserProfile, getCompatibilityQuality } from '@/lib/services/user-matching-service';
import Image from 'next/image';

interface SwipeCardProps {
  user: UserProfile & { compatibility_score?: number };
  onSwipe: (direction: 'left' | 'right') => void;
  onCardClick?: () => void;
  swipeAction?: 'like' | 'pass' | null;
  // Target positions for pile animations
  likePilePosition?: { x: number; y: number };
  passPilePosition?: { x: number; y: number };
}

export const SwipeCard = memo(function SwipeCard({
  user,
  onSwipe,
  onCardClick,
  swipeAction,
  likePilePosition,
  passPilePosition
}: SwipeCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);
  const controls = useAnimation();

  // Motion values for drag tracking
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Rotate based on x position (Tinder-style rotation)
  const rotate = useTransform(x, [-300, 0, 300], [-25, 0, 25]);

  // Opacity for LIKE/PASS indicators
  const likeOpacity = useTransform(x, [0, 100, 150], [0, 0.5, 1]);
  const passOpacity = useTransform(x, [-150, -100, 0], [1, 0.5, 0]);

  // Scale down as card approaches pile
  const scale = useTransform(
    x,
    [-300, -150, 0, 150, 300],
    [0.6, 0.8, 1, 0.8, 0.6]
  );

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

  const age = user.date_of_birth ? calculateAge(user.date_of_birth) : null;
  const compatibilityQuality = user.compatibility_score
    ? getCompatibilityQuality(user.compatibility_score)
    : null;

  const handleDragEnd = useCallback(async (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const threshold = 100;
    const velocity = info.velocity.x;
    const offset = info.offset.x;

    // Check if swipe is strong enough (by distance or velocity)
    if (offset > threshold || velocity > 500) {
      // Swiped right (like) - fly to the like pile
      setIsLeaving(true);

      // Animate to pile position or default right exit
      const targetX = likePilePosition?.x ?? window.innerWidth + 200;
      const targetY = likePilePosition?.y ?? 0;

      await controls.start({
        x: targetX,
        y: targetY,
        rotate: 15,
        scale: 0.3,
        opacity: 0,
        transition: {
          duration: 0.5,
          ease: [0.32, 0.72, 0, 1], // Custom easing for natural arc
        }
      });
      onSwipe('right');
    } else if (offset < -threshold || velocity < -500) {
      // Swiped left (pass) - fly to the pass pile
      setIsLeaving(true);

      // Animate to pile position or default left exit
      const targetX = passPilePosition?.x ?? -window.innerWidth - 200;
      const targetY = passPilePosition?.y ?? 0;

      await controls.start({
        x: targetX,
        y: targetY,
        rotate: -15,
        scale: 0.3,
        opacity: 0,
        transition: {
          duration: 0.5,
          ease: [0.32, 0.72, 0, 1],
        }
      });
      onSwipe('left');
    } else {
      // Return to center with spring animation
      controls.start({
        x: 0,
        y: 0,
        rotate: 0,
        transition: { type: 'spring', stiffness: 500, damping: 30 }
      });
    }
  }, [onSwipe, controls, likePilePosition, passPilePosition]);

  return (
    <motion.div
      className="absolute w-full h-full cursor-grab active:cursor-grabbing"
      style={{
        x,
        y,
        rotate,
        zIndex: isLeaving ? 0 : 1,
      }}
      drag={!isLeaving}
      dragElastic={0.9}
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      onDragEnd={handleDragEnd}
      animate={controls}
      whileDrag={{ scale: 1.02 }}
    >
      <motion.div
        className="relative w-full bg-white rounded-3xl shadow-2xl overflow-hidden"
        animate={{ height: isExpanded ? 'auto' : '600px' }}
        transition={{ type: 'spring', stiffness: 260, damping: 20 }}
      >
        {/* Card Content */}
        <div>
        {/* Profile Image - OPTIMIZED with Next.js Image */}
        <div className={`relative overflow-hidden ${isExpanded ? 'h-[360px]' : 'h-[360px]'}`}>
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
        <div
          className={`p-6 cursor-pointer ${isExpanded ? 'overflow-y-auto max-h-[400px]' : 'h-[240px] overflow-y-auto'}`}
          onClick={(e) => {
            e.stopPropagation();
            setIsExpanded(!isExpanded);
          }}
        >
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

          {/* Extended Details - Only shown when expanded */}
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-6 pt-6 border-t-2 border-gray-200 space-y-6"
            >
              {/* Languages Spoken */}
              {user.languages_spoken && user.languages_spoken.length > 0 && (
                <div>
                  <p className="text-sm font-bold text-gray-900 mb-2 flex items-center gap-2">
                    🌍 Langues parlées
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {user.languages_spoken.map((lang, idx) => (
                      <Badge key={idx} variant="secondary" size="sm">
                        {lang}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Hobbies */}
              {user.hobbies && user.hobbies.length > 0 && (
                <div>
                  <p className="text-sm font-bold text-gray-900 mb-2 flex items-center gap-2">
                    🎨 Hobbies
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {user.hobbies.map((hobby, idx) => (
                      <Badge key={idx} variant="secondary" size="sm">
                        {hobby}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Important Qualities */}
              {user.important_qualities && user.important_qualities.length > 0 && (
                <div>
                  <p className="text-sm font-bold text-gray-900 mb-2 flex items-center gap-2">
                    ⭐ Qualités importantes
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {user.important_qualities.map((quality, idx) => (
                      <Badge key={idx} variant="default" size="sm" className="bg-orange-100 text-orange-700">
                        {quality}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Deal Breakers */}
              {user.deal_breakers && user.deal_breakers.length > 0 && (
                <div>
                  <p className="text-sm font-bold text-gray-900 mb-2 flex items-center gap-2">
                    ⚠️ Deal breakers
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {user.deal_breakers.map((breaker, idx) => (
                      <Badge key={idx} variant="error" size="sm">
                        {breaker}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Lifestyle Preferences */}
              <div>
                <p className="text-sm font-bold text-gray-900 mb-3">Mode de vie</p>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  {user.guest_frequency && (
                    <div className="flex items-center gap-2">
                      <span className="text-gray-600">Invités:</span>
                      <span className="font-medium capitalize">{user.guest_frequency.replace('_', ' ')}</span>
                    </div>
                  )}
                  {user.sports_frequency && (
                    <div className="flex items-center gap-2">
                      <span className="text-gray-600">Sport:</span>
                      <span className="font-medium capitalize">{user.sports_frequency}</span>
                    </div>
                  )}
                  {user.diet_type && (
                    <div className="flex items-center gap-2">
                      <span className="text-gray-600">Régime:</span>
                      <span className="font-medium capitalize">{user.diet_type}</span>
                    </div>
                  )}
                  {user.music_habits && (
                    <div className="flex items-center gap-2">
                      <span className="text-gray-600">Musique:</span>
                      <span className="font-medium capitalize">{user.music_habits.replace('_', ' ')}</span>
                    </div>
                  )}
                  {user.work_schedule && (
                    <div className="flex items-center gap-2">
                      <span className="text-gray-600">Travail:</span>
                      <span className="font-medium capitalize">{user.work_schedule}</span>
                    </div>
                  )}
                  {user.introvert_extrovert_scale !== undefined && (
                    <div className="flex items-center gap-2">
                      <span className="text-gray-600">Social:</span>
                      <span className="font-medium">{user.introvert_extrovert_scale}/5</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Additional Preferences */}
              <div>
                <p className="text-sm font-bold text-gray-900 mb-3">Préférences</p>
                <div className="space-y-2 text-xs">
                  {user.shared_meals_interest !== undefined && (
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Repas partagés</span>
                      <span className={`font-medium ${user.shared_meals_interest ? 'text-green-600' : 'text-gray-400'}`}>
                        {user.shared_meals_interest ? '✓ Oui' : '✗ Non'}
                      </span>
                    </div>
                  )}
                  {user.coworking_space_needed !== undefined && (
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Espace coworking</span>
                      <span className={`font-medium ${user.coworking_space_needed ? 'text-green-600' : 'text-gray-400'}`}>
                        {user.coworking_space_needed ? '✓ Oui' : '✗ Non'}
                      </span>
                    </div>
                  )}
                  {user.gym_access_needed !== undefined && (
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Accès salle de sport</span>
                      <span className={`font-medium ${user.gym_access_needed ? 'text-green-600' : 'text-gray-400'}`}>
                        {user.gym_access_needed ? '✓ Oui' : '✗ Non'}
                      </span>
                    </div>
                  )}
                  {user.quiet_hours_preference !== undefined && (
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Heures calmes</span>
                      <span className={`font-medium ${user.quiet_hours_preference ? 'text-green-600' : 'text-gray-400'}`}>
                        {user.quiet_hours_preference ? '✓ Oui' : '✗ Non'}
                      </span>
                    </div>
                  )}
                  {user.open_to_meetups !== undefined && (
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Ouvert aux rencontres</span>
                      <span className={`font-medium ${user.open_to_meetups ? 'text-green-600' : 'text-gray-400'}`}>
                        {user.open_to_meetups ? '✓ Oui' : '✗ Non'}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Coliving Preferences */}
              <div>
                <p className="text-sm font-bold text-gray-900 mb-3">Préférences de coliving</p>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  {user.preferred_coliving_size && (
                    <div className="flex items-center gap-2">
                      <span className="text-gray-600">Taille:</span>
                      <span className="font-medium capitalize">{user.preferred_coliving_size.replace('_', ' ')}</span>
                    </div>
                  )}
                  {user.preferred_gender_mix && (
                    <div className="flex items-center gap-2">
                      <span className="text-gray-600">Mixité:</span>
                      <span className="font-medium capitalize">{user.preferred_gender_mix.replace('_', ' ')}</span>
                    </div>
                  )}
                  {user.communication_style && (
                    <div className="flex items-center gap-2">
                      <span className="text-gray-600">Communication:</span>
                      <span className="font-medium capitalize">{user.communication_style}</span>
                    </div>
                  )}
                  {user.cultural_openness && (
                    <div className="flex items-center gap-2">
                      <span className="text-gray-600">Ouverture culturelle:</span>
                      <span className="font-medium capitalize">{user.cultural_openness.replace('_', ' ')}</span>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Swipe Indicators - LIKE (green, left side) */}
        <motion.div
          className="absolute top-1/4 left-6 px-6 py-3 border-4 border-green-500 rounded-lg pointer-events-none"
          style={{
            opacity: likeOpacity,
            rotate: -20,
          }}
        >
          <span className="text-4xl font-black text-green-500 tracking-wider">LIKE</span>
        </motion.div>

        {/* Swipe Indicators - NOPE (red, right side) */}
        <motion.div
          className="absolute top-1/4 right-6 px-6 py-3 border-4 border-red-500 rounded-lg pointer-events-none"
          style={{
            opacity: passOpacity,
            rotate: 20,
          }}
        >
          <span className="text-4xl font-black text-red-500 tracking-wider">NOPE</span>
        </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
});
