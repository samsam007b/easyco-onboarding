'use client';

import { useState, useCallback, memo, useRef, useEffect } from 'react';
import { motion, useMotionValue, useTransform, PanInfo, useAnimation, AnimatePresence } from 'framer-motion';
import {
  MapPin,
  Briefcase,
  Sparkles,
  ChevronDown,
  Euro,
  Clock,
  Moon,
  Sun,
  Users,
  Home,
  Cigarette,
  Dog,
  Music,
  Utensils,
  Heart,
  AlertTriangle,
  XCircle,
  Globe,
  MessageCircle,
  HelpCircle,
  UserCog,
  X
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { UserProfile, getCompatibilityQuality, CompatibilityResult } from '@/lib/services/user-matching-service';
import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/lib/i18n/use-language';

interface SwipeCardProps {
  user: UserProfile & {
    compatibility_score?: number;
    compatibility_result?: CompatibilityResult;
  };
  onSwipe: (direction: 'left' | 'right') => void;
  onCardClick?: () => void;
  swipeAction?: 'like' | 'pass' | null;
  likePilePosition?: { x: number; y: number };
  passPilePosition?: { x: number; y: number };
  isExpanded?: boolean;
  onExpandChange?: (expanded: boolean) => void;
}

export const SwipeCard = memo(function SwipeCard({
  user,
  onSwipe,
  onCardClick,
  swipeAction,
  likePilePosition,
  passPilePosition,
  isExpanded: controlledExpanded,
  onExpandChange
}: SwipeCardProps) {
  const { getSection } = useLanguage();
  const matching = getSection('matching');
  const [internalExpanded, setInternalExpanded] = useState(false);
  const [showIncompleteDropdown, setShowIncompleteDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const isExpanded = controlledExpanded !== undefined ? controlledExpanded : internalExpanded;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowIncompleteDropdown(false);
      }
    };
    if (showIncompleteDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showIncompleteDropdown]);

  const handleExpandToggle = () => {
    const newValue = !isExpanded;
    if (onExpandChange) {
      onExpandChange(newValue);
    } else {
      setInternalExpanded(newValue);
    }
  };
  const [isLeaving, setIsLeaving] = useState(false);
  const controls = useAnimation();

  // Check if score is reliable based on profile completeness
  const isScoreReliable = user.compatibility_result?.isScoreReliable ?? true;
  const otherUserCompleteness = user.compatibility_result?.profileCompleteness?.user2;

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotate = useTransform(x, [-300, 0, 300], [-25, 0, 25]);
  const likeOpacity = useTransform(x, [0, 100, 150], [0, 0.5, 1]);
  const passOpacity = useTransform(x, [-150, -100, 0], [1, 0.5, 0]);

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

  // Helper functions for display
  const getWakeTimeLabel = (time?: string) => {
    if (!time) return null;
    const labels: Record<string, string> = {
      'early': matching.profile?.wakeTime?.early || 'Lève-tôt',
      'moderate': matching.profile?.wakeTime?.moderate || 'Normal',
      'late': matching.profile?.wakeTime?.late || 'Lève-tard'
    };
    return labels[time] || time;
  };

  const getSleepTimeLabel = (time?: string) => {
    if (!time) return null;
    const labels: Record<string, string> = {
      'early': matching.profile?.sleepTime?.early || 'Couche tôt',
      'before_23h': matching.profile?.sleepTime?.before_23h || 'Avant 23h',
      'moderate': matching.profile?.sleepTime?.moderate || 'Normal',
      '23h_01h': matching.profile?.sleepTime?.['23h_01h'] || '23h-1h',
      'late': matching.profile?.sleepTime?.late || 'Couche tard',
      'after_01h': matching.profile?.sleepTime?.after_01h || 'Après 1h'
    };
    return labels[time] || time;
  };

  const getCleanlinessLabel = (level?: number) => {
    if (!level) return null;
    if (level >= 8) return matching.profile?.cleanliness?.veryTidy || 'Très ordonné';
    if (level >= 6) return matching.profile?.cleanliness?.tidy || 'Ordonné';
    if (level >= 4) return matching.profile?.cleanliness?.flexible || 'Flexible';
    return matching.profile?.cleanliness?.relaxed || 'Décontracté';
  };

  const getSocialLabel = (level?: number) => {
    if (!level) return null;
    if (level >= 8) return matching.profile?.social?.verySociable || 'Très sociable';
    if (level >= 6) return matching.profile?.social?.sociable || 'Sociable';
    if (level >= 4) return matching.profile?.social?.balanced || 'Équilibré';
    return matching.profile?.social?.calm || 'Calme';
  };

  const handleDragEnd = useCallback(async (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const threshold = 100;
    const velocity = info.velocity.x;
    const offset = info.offset.x;

    if (offset > threshold || velocity > 500) {
      setIsLeaving(true);
      const targetX = likePilePosition?.x ?? window.innerWidth + 200;
      const targetY = likePilePosition?.y ?? 0;
      await controls.start({
        x: targetX, y: targetY, rotate: 15, scale: 0.3, opacity: 0,
        transition: { duration: 0.5, ease: [0.32, 0.72, 0, 1] }
      });
      onSwipe('right');
    } else if (offset < -threshold || velocity < -500) {
      setIsLeaving(true);
      const targetX = passPilePosition?.x ?? -window.innerWidth - 200;
      const targetY = passPilePosition?.y ?? 0;
      await controls.start({
        x: targetX, y: targetY, rotate: -15, scale: 0.3, opacity: 0,
        transition: { duration: 0.5, ease: [0.32, 0.72, 0, 1] }
      });
      onSwipe('left');
    } else {
      controls.start({
        x: 0, y: 0, rotate: 0,
        transition: { type: 'spring' as const, stiffness: 500, damping: 30 }
      });
    }
  }, [onSwipe, controls, likePilePosition, passPilePosition]);

  return (
    <motion.div
      className={cn(
        "w-full cursor-grab active:cursor-grabbing",
        isExpanded ? "relative" : "absolute h-full"
      )}
      style={{ x, y, rotate, zIndex: isLeaving ? 0 : 1 }}
      drag={!isLeaving && !isExpanded}
      dragElastic={0.9}
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      onDragEnd={handleDragEnd}
      animate={controls}
      whileDrag={{ scale: 1.02 }}
    >
      <motion.div
        className="relative w-full bg-white superellipse-3xl shadow-2xl overflow-hidden"
        animate={{ height: isExpanded ? 'auto' : '480px' }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      >
        {/* Profile Image */}
        <div className={cn("relative overflow-hidden", isExpanded ? 'h-[220px]' : 'h-[260px]')}>
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
            <div className="w-full h-full bg-gradient-to-br from-resident-200 via-resident-100 to-resident-50 flex items-center justify-center">
              <div className="text-7xl font-bold text-resident-600 opacity-30">
                {user.first_name.charAt(0)}{user.last_name.charAt(0)}
              </div>
            </div>
          )}

          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/70" />

          {/* Compatibility Badge - Show N/A if profile incomplete */}
          <div className="absolute top-4 right-4 z-10" ref={dropdownRef}>
            {isScoreReliable ? (
              // Normal score badge
              <div
                className="px-4 py-2.5 superellipse-2xl shadow-xl backdrop-blur-md border-2 border-white/50 bg-gradient-to-br from-searcher-500 to-searcher-400"
              >
                <div className="flex items-center gap-2">
                  <Sparkles
                    className="w-4 h-4 text-white"
                    strokeWidth={2.5}
                    fill={(user.compatibility_score ?? 0) >= 80 ? '#fff' : 'none'}
                  />
                  <div className="text-center">
                    <p className="text-2xl font-black text-white leading-none">
                      {typeof user.compatibility_score === 'number' && !isNaN(user.compatibility_score)
                        ? user.compatibility_score
                        : '—'}%
                    </p>
                    <p className="text-[10px] font-bold text-white/90 uppercase tracking-wide">Match</p>
                  </div>
                </div>
              </div>
            ) : (
              // N/A badge with dropdown for incomplete profile
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowIncompleteDropdown(!showIncompleteDropdown);
                  }}
                  className="px-4 py-2.5 superellipse-2xl shadow-xl backdrop-blur-md border-2 border-white/50 cursor-pointer hover:scale-105 transition-transform"
                  style={{
                    background: `linear-gradient(135deg, #9CA3AF 0%, #6B7280 100%)`
                  }}
                >
                  <div className="flex items-center gap-2">
                    <HelpCircle className="w-4 h-4 text-white" strokeWidth={2.5} />
                    <div className="text-center">
                      <p className="text-xl font-black text-white leading-none">N/A</p>
                      <p className="text-[10px] font-bold text-white/90 uppercase tracking-wide">Match</p>
                    </div>
                  </div>
                </button>

                {/* Dropdown Panel */}
                <AnimatePresence>
                  {showIncompleteDropdown && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-full right-0 mt-2 w-72 bg-white superellipse-2xl shadow-2xl border border-gray-200 overflow-hidden z-50"
                    >
                      {/* Header */}
                      <div className="bg-gradient-to-r from-gray-100 to-gray-50 px-4 py-3 border-b border-gray-200">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <AlertTriangle className="w-4 h-4 text-amber-500" />
                            <span className="font-semibold text-gray-900 text-sm">{matching.profile?.scoreNotAvailable || 'Score non disponible'}</span>
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setShowIncompleteDropdown(false);
                            }}
                            className="p-1 hover:bg-gray-200 rounded-full transition-colors"
                          >
                            <X className="w-4 h-4 text-gray-500" />
                          </button>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-4 space-y-3">
                        <p className="text-sm text-gray-600">
                          {otherUserCompleteness && otherUserCompleteness.percentage < 40 ? (
                            <>
                              <span className="font-medium text-gray-900">{user.first_name}</span> {matching.profile?.profileIncomplete || "n'a pas assez complété son profil pour que l'algorithme de compatibilité fonctionne."}
                            </>
                          ) : (
                            <>{matching.profile?.yourProfileIncomplete || "Ton profil n'est pas assez complété pour que l'algorithme puisse calculer un score de compatibilité fiable."}</>
                          )}
                        </p>

                        {/* Missing categories */}
                        {otherUserCompleteness && otherUserCompleteness.missingCategories.length > 0 && (
                          <div className="bg-amber-50 superellipse-xl p-3">
                            <p className="text-xs font-medium text-amber-800 mb-2">{matching.profile?.missingInfo || 'Informations manquantes :'}</p>
                            <div className="flex flex-wrap gap-1">
                              {otherUserCompleteness.missingCategories.map((cat, idx) => (
                                <span key={idx} className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">
                                  {cat}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* CTA Button */}
                        <Link href="/profile/enhance" onClick={(e) => e.stopPropagation()}>
                          <Button
                            className="w-full bg-searcher-600 hover:bg-searcher-700 text-white font-semibold shadow-lg"
                          >
                            <UserCog className="w-4 h-4 mr-2" />
                            {matching.profile?.enhanceProfile || 'Enrichir mon profil'}
                          </Button>
                        </Link>

                        <p className="text-[10px] text-gray-400 text-center">
                          {matching.profile?.completeProfileTip || 'Un profil complet = des matchs plus précis !'}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </>
            )}
          </div>

          {/* Name & Basic Info */}
          <div className="absolute bottom-4 left-4 right-4">
            <h2 className="text-2xl font-bold text-white mb-1">
              {user.first_name} {user.last_name}
              {age && <span className="text-xl font-normal ml-2 text-white/90">{age} {matching.profile?.yearsOld || 'ans'}</span>}
            </h2>
            <div className="flex items-center gap-3 text-white/90 text-sm">
              {user.occupation_status && (
                <div className="flex items-center gap-1.5">
                  <Briefcase className="w-3.5 h-3.5" />
                  <span className="capitalize">{user.occupation_status.replace('_', ' ')}</span>
                </div>
              )}
              {user.nationality && (
                <div className="flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5" />
                  <span>{user.nationality}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Summary - Always visible */}
        <div
          className="p-5 cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            handleExpandToggle();
          }}
        >
          {/* Key Stats Grid - V1 Flat */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            {/* Budget */}
            {(user.min_budget || user.max_budget) && (
              <div className="flex items-center gap-2 bg-gray-50 superellipse-xl px-3 py-2 border border-gray-100">
                <Euro className="w-4 h-4 text-gray-500" />
                <div>
                  <p className="text-[10px] text-gray-500 uppercase font-medium">{matching.card?.budget || 'Budget'}</p>
                  <p className="text-sm font-bold text-gray-900">
                    {user.min_budget && user.max_budget
                      ? `${user.min_budget}-${user.max_budget}€`
                      : user.max_budget
                        ? `Max ${user.max_budget}€`
                        : `Min ${user.min_budget}€`
                    }
                  </p>
                </div>
              </div>
            )}

            {/* Cleanliness */}
            {user.cleanliness_level && (
              <div className="flex items-center gap-2 bg-gray-50 superellipse-xl px-3 py-2 border border-gray-100">
                <Home className="w-4 h-4 text-gray-500" />
                <div>
                  <p className="text-[10px] text-gray-500 uppercase font-medium">{matching.profile?.cleanliness?.label || 'Propreté'}</p>
                  <p className="text-sm font-bold text-gray-900">{getCleanlinessLabel(user.cleanliness_level)}</p>
                </div>
              </div>
            )}

            {/* Social */}
            {user.social_energy && (
              <div className="flex items-center gap-2 bg-gray-50 superellipse-xl px-3 py-2 border border-gray-100">
                <Users className="w-4 h-4 text-gray-500" />
                <div>
                  <p className="text-[10px] text-gray-500 uppercase font-medium">{matching.profile?.social?.label || 'Social'}</p>
                  <p className="text-sm font-bold text-gray-900">{getSocialLabel(user.social_energy)}</p>
                </div>
              </div>
            )}

            {/* Schedule */}
            {(user.wake_up_time || user.sleep_time) && (
              <div className="flex items-center gap-2 bg-gray-50 superellipse-xl px-3 py-2 border border-gray-100">
                <Clock className="w-4 h-4 text-gray-500" />
                <div>
                  <p className="text-[10px] text-gray-500 uppercase font-medium">{matching.profile?.rhythm || 'Rythme'}</p>
                  <p className="text-sm font-bold text-gray-900">
                    {getWakeTimeLabel(user.wake_up_time) || getSleepTimeLabel(user.sleep_time)}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Quick Tags */}
          <div className="flex flex-wrap gap-1.5 mb-3">
            {user.smoking && (
              <Badge variant="default" size="sm" className="bg-red-50 border-red-200 text-red-700">
                <Cigarette className="w-3 h-3 mr-1" /> {matching.profile?.smoker || 'Fumeur'}
              </Badge>
            )}
            {user.smoking === false && (
              <Badge variant="default" size="sm" className="bg-green-50 border-green-200 text-green-700">
                <XCircle className="w-3 h-3 mr-1" /> {matching.profile?.nonSmoker || 'Non-fumeur'}
              </Badge>
            )}
            {user.pets && (
              <Badge variant="default" size="sm" className="bg-amber-50 border-amber-200 text-amber-700">
                <Dog className="w-3 h-3 mr-1" /> {matching.profile?.hasPet || 'A un animal'}
              </Badge>
            )}
            {user.cooking_frequency && ['often', 'daily'].includes(user.cooking_frequency) && (
              <Badge variant="default" size="sm" className="bg-amber-50 border-amber-200 text-amber-700">
                <Utensils className="w-3 h-3 mr-1" /> {matching.profile?.cooksOften || 'Cuisine souvent'}
              </Badge>
            )}
            {user.shared_meals_interest && (
              <Badge variant="default" size="sm" className="bg-resident-50 border-resident-200 text-resident-700">
                <Heart className="w-3 h-3 mr-1" /> {matching.profile?.sharedMeals || 'Repas partagés'}
              </Badge>
            )}
            {user.music_at_home && (
              <Badge variant="default" size="sm" className="bg-indigo-50 border-indigo-200 text-indigo-700">
                <Music className="w-3 h-3 mr-1" /> {matching.profile?.musicAtHome || 'Musique'}
              </Badge>
            )}
          </div>

          {/* Bio Preview */}
          {user.bio && !isExpanded && (
            <p className="text-gray-600 text-sm line-clamp-2 mb-3">{user.bio}</p>
          )}

          {/* Expand Indicator */}
          <div className="flex items-center justify-center gap-2 text-resident-500 font-medium text-sm">
            <span>{isExpanded ? (matching.profile?.seeLess || 'Voir moins') : (matching.profile?.seeMore || 'Voir plus de détails')}</span>
            <motion.div
              animate={{ rotate: isExpanded ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <ChevronDown className="w-5 h-5" />
            </motion.div>
          </div>

          {/* Expanded Content */}
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-4 pt-4 border-t border-gray-200 space-y-5 max-h-[400px] overflow-y-auto"
            >
              {/* Bio Full */}
              {user.bio && (
                <div>
                  <p className="text-sm font-bold text-gray-900 mb-2 flex items-center gap-2">
                    <MessageCircle className="w-4 h-4 text-gray-500" />
                    {matching.profile?.about || 'À propos'}
                  </p>
                  <p className="text-gray-700 text-sm leading-relaxed">{user.bio}</p>
                </div>
              )}

              {/* Languages */}
              {user.languages && user.languages.length > 0 && (
                <div>
                  <p className="text-sm font-bold text-gray-900 mb-2 flex items-center gap-2">
                    <Globe className="w-4 h-4 text-gray-500" />
                    {matching.profile?.languages || 'Langues'}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {user.languages.map((lang, idx) => (
                      <Badge key={idx} variant="secondary" size="sm">{lang}</Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Core Values */}
              {user.core_values && user.core_values.length > 0 && (
                <div>
                  <p className="text-sm font-bold text-gray-900 mb-2 flex items-center gap-2">
                    <Heart className="w-4 h-4 text-gray-500" />
                    {matching.profile?.values || 'Valeurs'}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {user.core_values.map((value, idx) => (
                      <Badge key={idx} variant="default" size="sm" className="capitalize bg-resident-100 text-resident-700 border-resident-200">
                        {value}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Hobbies */}
              {user.hobbies && user.hobbies.length > 0 && (
                <div>
                  <p className="text-sm font-bold text-gray-900 mb-2 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-gray-500" />
                    {matching.profile?.hobbies || 'Hobbies'}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {user.hobbies.map((hobby, idx) => (
                      <Badge key={idx} variant="secondary" size="sm">{hobby}</Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Deal Breakers */}
              {user.deal_breakers && user.deal_breakers.length > 0 && (
                <div>
                  <p className="text-sm font-bold text-gray-900 mb-2 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-red-500" />
                    {matching.profile?.dealBreakers || 'Deal breakers'}
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

              {/* Lifestyle Details */}
              <div>
                <p className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <Home className="w-4 h-4 text-gray-500" />
                  {matching.profile?.lifestyleTitle || 'Mode de vie'}
                </p>
                <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
                  {user.wake_up_time && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">{matching.profile?.wakeUp || 'Réveil'}</span>
                      <span className="font-medium text-gray-900">{getWakeTimeLabel(user.wake_up_time)}</span>
                    </div>
                  )}
                  {user.sleep_time && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">{matching.profile?.bedtime || 'Coucher'}</span>
                      <span className="font-medium text-gray-900">{getSleepTimeLabel(user.sleep_time)}</span>
                    </div>
                  )}
                  {user.guest_frequency && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">{matching.profile?.guests || 'Invités'}</span>
                      <span className="font-medium text-gray-900 capitalize">{user.guest_frequency.replace('_', ' ')}</span>
                    </div>
                  )}
                  {user.work_schedule && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">{matching.profile?.work || 'Travail'}</span>
                      <span className="font-medium text-gray-900 capitalize">{user.work_schedule}</span>
                    </div>
                  )}
                  {user.diet_type && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">{matching.profile?.diet || 'Régime'}</span>
                      <span className="font-medium text-gray-900 capitalize">{user.diet_type}</span>
                    </div>
                  )}
                  {user.music_habits && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">{matching.profile?.musicLabel || 'Musique'}</span>
                      <span className="font-medium text-gray-900 capitalize">{user.music_habits.replace(/_/g, ' ')}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Coliving Preferences */}
              <div>
                <p className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <Users className="w-4 h-4 text-gray-500" />
                  {matching.profile?.colivingPrefs || 'Préférences coliving'}
                </p>
                <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
                  {user.preferred_coliving_size && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">{matching.profile?.sizeLabel || 'Taille'}</span>
                      <span className="font-medium text-gray-900 capitalize">{user.preferred_coliving_size.replace('_', ' ')}</span>
                    </div>
                  )}
                  {user.preferred_gender_mix && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">{matching.profile?.genderMix || 'Mixité'}</span>
                      <span className="font-medium text-gray-900 capitalize">{user.preferred_gender_mix.replace('_', ' ')}</span>
                    </div>
                  )}
                  {user.communication_style && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">{matching.profile?.communication || 'Communication'}</span>
                      <span className="font-medium text-gray-900 capitalize">{user.communication_style}</span>
                    </div>
                  )}
                  {user.cultural_openness && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">{matching.profile?.openness || 'Ouverture'}</span>
                      <span className="font-medium text-gray-900 capitalize">{user.cultural_openness.replace('_', ' ')}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Tolerances */}
              <div className="grid grid-cols-2 gap-3">
                <div className={cn(
                  "flex items-center gap-2 p-2 superellipse-lg text-xs",
                  user.smoking_tolerance ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
                )}>
                  <Cigarette className="w-4 h-4" />
                  <span>{user.smoking_tolerance ? (matching.profile?.toleratesSmokers || 'Tolère fumeurs') : (matching.profile?.noSmokers || 'Ne tolère pas fumeurs')}</span>
                </div>
                <div className={cn(
                  "flex items-center gap-2 p-2 superellipse-lg text-xs",
                  user.pets_tolerance ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
                )}>
                  <Dog className="w-4 h-4" />
                  <span>{user.pets_tolerance ? (matching.profile?.toleratesPets || 'Tolère animaux') : (matching.profile?.noPets || 'Ne tolère pas animaux')}</span>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Swipe Indicators */}
        <motion.div
          className="absolute top-1/4 left-6 px-6 py-3 border-4 border-green-500 superellipse-lg pointer-events-none"
          style={{ opacity: likeOpacity, rotate: -20 }}
        >
          <span className="text-4xl font-black text-green-500 tracking-wider">LIKE</span>
        </motion.div>

        <motion.div
          className="absolute top-1/4 right-6 px-6 py-3 border-4 border-red-500 superellipse-lg pointer-events-none"
          style={{ opacity: passOpacity, rotate: 20 }}
        >
          <span className="text-4xl font-black text-red-500 tracking-wider">NOPE</span>
        </motion.div>
      </motion.div>
    </motion.div>
  );
});
