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
      'early': '🌅 Lève-tôt',
      'moderate': '☀️ Normal',
      'late': '🌙 Lève-tard'
    };
    return labels[time] || time;
  };

  const getSleepTimeLabel = (time?: string) => {
    if (!time) return null;
    const labels: Record<string, string> = {
      'early': '😴 Couche tôt',
      'before_23h': '😴 Avant 23h',
      'moderate': '🌙 Normal',
      '23h_01h': '🌙 23h-1h',
      'late': '🦉 Couche tard',
      'after_01h': '🦉 Après 1h'
    };
    return labels[time] || time;
  };

  const getCleanlinessLabel = (level?: number) => {
    if (!level) return null;
    if (level >= 8) return '✨ Très ordonné';
    if (level >= 6) return '🧹 Ordonné';
    if (level >= 4) return '😊 Flexible';
    return '🎨 Décontracté';
  };

  const getSocialLabel = (level?: number) => {
    if (!level) return null;
    if (level >= 8) return '🎉 Très sociable';
    if (level >= 6) return '😊 Sociable';
    if (level >= 4) return '🤝 Équilibré';
    return '📚 Calme';
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
        transition: { type: 'spring', stiffness: 500, damping: 30 }
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
        className="relative w-full bg-white rounded-3xl shadow-2xl overflow-hidden"
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
            <div className="w-full h-full bg-gradient-to-br from-orange-200 via-orange-100 to-yellow-100 flex items-center justify-center">
              <div className="text-7xl font-bold text-orange-600 opacity-30">
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
                className="px-4 py-2.5 rounded-2xl shadow-xl backdrop-blur-md border-2 border-white/50"
                style={{
                  background: `linear-gradient(135deg, #FFA040 0%, #FFB85C 50%, #FFCE7E 100%)`
                }}
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
                  className="px-4 py-2.5 rounded-2xl shadow-xl backdrop-blur-md border-2 border-white/50 cursor-pointer hover:scale-105 transition-transform"
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
                      className="absolute top-full right-0 mt-2 w-72 bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden z-50"
                    >
                      {/* Header */}
                      <div className="bg-gradient-to-r from-gray-100 to-gray-50 px-4 py-3 border-b border-gray-200">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <AlertTriangle className="w-4 h-4 text-amber-500" />
                            <span className="font-semibold text-gray-900 text-sm">Score non disponible</span>
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
                              <span className="font-medium text-gray-900">{user.first_name}</span> n'a pas assez complété son profil pour que l'algorithme de compatibilité fonctionne.
                            </>
                          ) : (
                            <>Ton profil n'est pas assez complété pour que l'algorithme puisse calculer un score de compatibilité fiable.</>
                          )}
                        </p>

                        {/* Missing categories */}
                        {otherUserCompleteness && otherUserCompleteness.missingCategories.length > 0 && (
                          <div className="bg-amber-50 rounded-xl p-3">
                            <p className="text-xs font-medium text-amber-800 mb-2">Informations manquantes :</p>
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
                            className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-semibold shadow-lg"
                          >
                            <UserCog className="w-4 h-4 mr-2" />
                            Enrichir mon profil
                          </Button>
                        </Link>

                        <p className="text-[10px] text-gray-400 text-center">
                          Un profil complet = des matchs plus précis !
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
              {age && <span className="text-xl font-normal ml-2 text-white/90">{age} ans</span>}
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
          {/* Key Stats Grid */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            {/* Budget */}
            {(user.min_budget || user.max_budget) && (
              <div className="flex items-center gap-2 bg-orange-50 rounded-xl px-3 py-2">
                <Euro className="w-4 h-4 text-orange-500" />
                <div>
                  <p className="text-[10px] text-gray-500 uppercase font-medium">Budget</p>
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
              <div className="flex items-center gap-2 bg-blue-50 rounded-xl px-3 py-2">
                <Home className="w-4 h-4 text-blue-500" />
                <div>
                  <p className="text-[10px] text-gray-500 uppercase font-medium">Propreté</p>
                  <p className="text-sm font-bold text-gray-900">{getCleanlinessLabel(user.cleanliness_level)}</p>
                </div>
              </div>
            )}

            {/* Social */}
            {user.social_energy && (
              <div className="flex items-center gap-2 bg-purple-50 rounded-xl px-3 py-2">
                <Users className="w-4 h-4 text-purple-500" />
                <div>
                  <p className="text-[10px] text-gray-500 uppercase font-medium">Social</p>
                  <p className="text-sm font-bold text-gray-900">{getSocialLabel(user.social_energy)}</p>
                </div>
              </div>
            )}

            {/* Schedule */}
            {(user.wake_up_time || user.sleep_time) && (
              <div className="flex items-center gap-2 bg-yellow-50 rounded-xl px-3 py-2">
                <Clock className="w-4 h-4 text-yellow-600" />
                <div>
                  <p className="text-[10px] text-gray-500 uppercase font-medium">Rythme</p>
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
                <Cigarette className="w-3 h-3 mr-1" /> Fumeur
              </Badge>
            )}
            {user.smoking === false && (
              <Badge variant="default" size="sm" className="bg-green-50 border-green-200 text-green-700">
                <XCircle className="w-3 h-3 mr-1" /> Non-fumeur
              </Badge>
            )}
            {user.pets && (
              <Badge variant="default" size="sm" className="bg-amber-50 border-amber-200 text-amber-700">
                <Dog className="w-3 h-3 mr-1" /> A un animal
              </Badge>
            )}
            {user.cooking_frequency && ['often', 'daily'].includes(user.cooking_frequency) && (
              <Badge variant="default" size="sm" className="bg-orange-50 border-orange-200 text-orange-700">
                <Utensils className="w-3 h-3 mr-1" /> Cuisine souvent
              </Badge>
            )}
            {user.shared_meals_interest && (
              <Badge variant="default" size="sm" className="bg-pink-50 border-pink-200 text-pink-700">
                <Heart className="w-3 h-3 mr-1" /> Repas partagés
              </Badge>
            )}
            {user.music_at_home && (
              <Badge variant="default" size="sm" className="bg-indigo-50 border-indigo-200 text-indigo-700">
                <Music className="w-3 h-3 mr-1" /> Musique
              </Badge>
            )}
          </div>

          {/* Bio Preview */}
          {user.bio && !isExpanded && (
            <p className="text-gray-600 text-sm line-clamp-2 mb-3">{user.bio}</p>
          )}

          {/* Expand Indicator */}
          <div className="flex items-center justify-center gap-2 text-orange-500 font-medium text-sm">
            <span>{isExpanded ? 'Voir moins' : 'Voir plus de détails'}</span>
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
                    À propos
                  </p>
                  <p className="text-gray-700 text-sm leading-relaxed">{user.bio}</p>
                </div>
              )}

              {/* Languages */}
              {user.languages && user.languages.length > 0 && (
                <div>
                  <p className="text-sm font-bold text-gray-900 mb-2 flex items-center gap-2">
                    <Globe className="w-4 h-4 text-gray-500" />
                    Langues
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
                    Valeurs
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {user.core_values.map((value, idx) => (
                      <Badge key={idx} variant="default" size="sm" className="capitalize bg-orange-100 text-orange-700 border-orange-200">
                        {value}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Hobbies */}
              {user.hobbies && user.hobbies.length > 0 && (
                <div>
                  <p className="text-sm font-bold text-gray-900 mb-2">🎨 Hobbies</p>
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
                    Deal breakers
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
                <p className="text-sm font-bold text-gray-900 mb-3">🏠 Mode de vie</p>
                <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
                  {user.wake_up_time && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">Réveil</span>
                      <span className="font-medium text-gray-900">{getWakeTimeLabel(user.wake_up_time)}</span>
                    </div>
                  )}
                  {user.sleep_time && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">Coucher</span>
                      <span className="font-medium text-gray-900">{getSleepTimeLabel(user.sleep_time)}</span>
                    </div>
                  )}
                  {user.guest_frequency && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">Invités</span>
                      <span className="font-medium text-gray-900 capitalize">{user.guest_frequency.replace('_', ' ')}</span>
                    </div>
                  )}
                  {user.work_schedule && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">Travail</span>
                      <span className="font-medium text-gray-900 capitalize">{user.work_schedule}</span>
                    </div>
                  )}
                  {user.diet_type && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">Régime</span>
                      <span className="font-medium text-gray-900 capitalize">{user.diet_type}</span>
                    </div>
                  )}
                  {user.music_habits && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">Musique</span>
                      <span className="font-medium text-gray-900 capitalize">{user.music_habits.replace(/_/g, ' ')}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Coliving Preferences */}
              <div>
                <p className="text-sm font-bold text-gray-900 mb-3">🏡 Préférences coliving</p>
                <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
                  {user.preferred_coliving_size && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">Taille</span>
                      <span className="font-medium text-gray-900 capitalize">{user.preferred_coliving_size.replace('_', ' ')}</span>
                    </div>
                  )}
                  {user.preferred_gender_mix && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">Mixité</span>
                      <span className="font-medium text-gray-900 capitalize">{user.preferred_gender_mix.replace('_', ' ')}</span>
                    </div>
                  )}
                  {user.communication_style && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">Communication</span>
                      <span className="font-medium text-gray-900 capitalize">{user.communication_style}</span>
                    </div>
                  )}
                  {user.cultural_openness && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">Ouverture</span>
                      <span className="font-medium text-gray-900 capitalize">{user.cultural_openness.replace('_', ' ')}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Tolerances */}
              <div className="grid grid-cols-2 gap-3">
                <div className={cn(
                  "flex items-center gap-2 p-2 rounded-lg text-xs",
                  user.smoking_tolerance ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
                )}>
                  <Cigarette className="w-4 h-4" />
                  <span>{user.smoking_tolerance ? 'Tolère fumeurs' : 'Ne tolère pas fumeurs'}</span>
                </div>
                <div className={cn(
                  "flex items-center gap-2 p-2 rounded-lg text-xs",
                  user.pets_tolerance ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
                )}>
                  <Dog className="w-4 h-4" />
                  <span>{user.pets_tolerance ? 'Tolère animaux' : 'Ne tolère pas animaux'}</span>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Swipe Indicators */}
        <motion.div
          className="absolute top-1/4 left-6 px-6 py-3 border-4 border-green-500 rounded-lg pointer-events-none"
          style={{ opacity: likeOpacity, rotate: -20 }}
        >
          <span className="text-4xl font-black text-green-500 tracking-wider">LIKE</span>
        </motion.div>

        <motion.div
          className="absolute top-1/4 right-6 px-6 py-3 border-4 border-red-500 rounded-lg pointer-events-none"
          style={{ opacity: passOpacity, rotate: 20 }}
        >
          <span className="text-4xl font-black text-red-500 tracking-wider">NOPE</span>
        </motion.div>
      </motion.div>
    </motion.div>
  );
});
