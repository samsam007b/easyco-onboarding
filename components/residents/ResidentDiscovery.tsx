'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/auth/supabase-client';
import { logger } from '@/lib/utils/logger';
import { motion, useMotionValue, useTransform, AnimatePresence } from 'framer-motion';
import {
  Heart,
  X,
  MapPin,
  Briefcase,
  Calendar,
  Star,
  Info,
  ChevronRight,
  Sparkles,
  Users,
  Coffee,
  Moon,
  Volume2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface Searcher {
  id: string;
  full_name: string;
  avatar_url?: string;
  age?: number;
  occupation?: string;
  bio?: string;
  onboarding_data?: {
    personality?: {
      lifestyle?: string;
      cleanliness?: number;
      noise_tolerance?: number;
      social_level?: number;
      sleep_schedule?: string;
    };
    interests?: string[];
    looking_for?: string;
    move_in_date?: string;
  };
  location?: string;
}

interface ResidentDiscoveryProps {
  propertyId: string;
}

export default function ResidentDiscovery({ propertyId }: ResidentDiscoveryProps) {
  const supabase = createClient();
  const [searchers, setSearchers] = useState<Searcher[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [showDetails, setShowDetails] = useState(false);
  const [likedProfiles, setLikedProfiles] = useState<string[]>([]);
  const [passedProfiles, setPassedProfiles] = useState<string[]>([]);

  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-25, 25]);
  const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0, 1, 1, 1, 0]);

  useEffect(() => {
    loadSearchers();
  }, [propertyId]);

  const loadSearchers = async () => {
    try {
      // Get all searchers who are actively looking for accommodation
      const { data: searchersData } = await supabase
        .from('users')
        .select('id, onboarding_data, user_type')
        .eq('user_type', 'searcher')
        .limit(20);

      if (!searchersData) {
        setIsLoading(false);
        return;
      }

      const userIds = searchersData.map(s => s.id);

      const { data: profilesData } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, avatar_url, age, occupation, bio')
        .in('id', userIds);

      const searchersList: Searcher[] = profilesData?.map(profile => {
        const userData = searchersData.find(u => u.id === profile.id);
        return {
          id: profile.id,
          full_name: `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || 'Candidat',
          avatar_url: profile.avatar_url,
          age: profile.age,
          occupation: profile.occupation,
          bio: profile.bio,
          onboarding_data: userData?.onboarding_data || {}
        };
      }) || [];

      setSearchers(searchersList);
    } catch (error) {
      logger.error('Error loading searchers', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDragEnd = (event: any, info: any) => {
    const swipeThreshold = 100;

    if (Math.abs(info.offset.x) > swipeThreshold) {
      if (info.offset.x > 0) {
        handleLike();
      } else {
        handlePass();
      }
    }
  };

  const handleLike = async () => {
    const currentSearcher = searchers[currentIndex];
    if (!currentSearcher) return;

    setLikedProfiles([...likedProfiles, currentSearcher.id]);

    // Save to database
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase.from('resident_interests').insert({
          property_id: propertyId,
          resident_id: user.id,
          searcher_id: currentSearcher.id,
          interested: true,
          created_at: new Date().toISOString()
        });
      }
    } catch (error) {
      logger.error('Error saving like', error);
    }

    // Move to next
    setTimeout(() => {
      setCurrentIndex(currentIndex + 1);
      x.set(0);
    }, 300);
  };

  const handlePass = () => {
    const currentSearcher = searchers[currentIndex];
    if (currentSearcher) {
      setPassedProfiles([...passedProfiles, currentSearcher.id]);
    }

    setTimeout(() => {
      setCurrentIndex(currentIndex + 1);
      x.set(0);
    }, 300);
  };

  const currentSearcher = searchers[currentIndex];

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <Sparkles className="w-8 h-8 text-gray-400 mx-auto mb-2 animate-pulse" />
        <p className="text-gray-600">Recherche de candidats...</p>
      </div>
    );
  }

  if (searchers.length === 0 || currentIndex >= searchers.length) {
    return (
      <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-12 border border-gray-200 text-center">
        <div className="max-w-md mx-auto">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-orange-100 to-pink-100 flex items-center justify-center mx-auto mb-4">
            <Users className="w-10 h-10 text-gray-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            {likedProfiles.length > 0 ? 'Vous avez tout vu !' : 'Aucun candidat disponible'}
          </h3>
          <p className="text-gray-600 mb-6">
            {likedProfiles.length > 0
              ? `Vous avez manifesté votre intérêt pour ${likedProfiles.length} candidat${likedProfiles.length > 1 ? 's' : ''}. Revenez plus tard pour en découvrir d'autres !`
              : 'Il n\'y a actuellement aucun candidat à la recherche d\'une colocation.'}
          </p>
          {likedProfiles.length > 0 && (
            <Button
              onClick={() => {
                setCurrentIndex(0);
                setLikedProfiles([]);
                setPassedProfiles([]);
              }}
              className="rounded-full bg-gradient-to-r from-orange-200/70 to-pink-200/70 text-gray-900"
            >
              Recommencer
            </Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Heart className="w-6 h-6 text-pink-500" />
            Nouveau Résident Discovery
          </h2>
          <p className="text-gray-600">
            Trouvez le colocataire parfait pour votre résidence
          </p>
        </div>
        <Badge className="bg-gradient-to-r from-orange-100 to-pink-100 text-gray-800 border-orange-200">
          {currentIndex + 1} / {searchers.length}
        </Badge>
      </div>

      {/* Card Stack */}
      <div className="relative h-[600px] flex items-center justify-center">
        <AnimatePresence>
          {currentSearcher && (
            <motion.div
              key={currentSearcher.id}
              style={{ x, rotate, opacity }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              onDragEnd={handleDragEnd}
              className="absolute w-full max-w-md cursor-grab active:cursor-grabbing"
            >
              <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border-2 border-gray-200">
                {/* Image/Avatar Section */}
                <div className="relative h-80 bg-gradient-to-br from-orange-200 to-pink-200">
                  {currentSearcher.avatar_url ? (
                    <img
                      src={currentSearcher.avatar_url}
                      alt={currentSearcher.full_name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-8xl font-bold text-white">
                        {currentSearcher.full_name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}

                  {/* Quick Info Overlay */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
                    <h3 className="text-3xl font-bold text-white mb-1">
                      {currentSearcher.full_name}
                      {currentSearcher.age && (
                        <span className="text-2xl font-normal">, {currentSearcher.age}</span>
                      )}
                    </h3>
                    {currentSearcher.occupation && (
                      <div className="flex items-center gap-2 text-white/90 mb-2">
                        <Briefcase className="w-4 h-4" />
                        <span>{currentSearcher.occupation}</span>
                      </div>
                    )}
                  </div>

                  {/* Info Button */}
                  <button
                    onClick={() => setShowDetails(!showDetails)}
                    className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-lg hover:bg-white transition-colors"
                  >
                    <Info className="w-5 h-5 text-gray-700" />
                  </button>
                </div>

                {/* Details Section */}
                <div className={cn(
                  "transition-all duration-300",
                  showDetails ? "max-h-[400px] opacity-100" : "max-h-0 opacity-0 overflow-hidden"
                )}>
                  <div className="p-6 space-y-4 border-t border-gray-200">
                    {/* Bio */}
                    {currentSearcher.bio && (
                      <div>
                        <p className="text-gray-700">{currentSearcher.bio}</p>
                      </div>
                    )}

                    {/* Personality */}
                    {currentSearcher.onboarding_data?.personality && (
                      <div className="space-y-2">
                        <p className="text-sm font-semibold text-gray-900">Personnalité :</p>
                        <div className="grid grid-cols-2 gap-3">
                          {currentSearcher.onboarding_data.personality.cleanliness && (
                            <div className="flex items-center gap-2 text-sm">
                              <Sparkles className="w-4 h-4 text-blue-600" />
                              <span className="text-gray-600">Propreté:</span>
                              <span className="font-semibold text-gray-900">
                                {currentSearcher.onboarding_data.personality.cleanliness}/10
                              </span>
                            </div>
                          )}
                          {currentSearcher.onboarding_data.personality.social_level && (
                            <div className="flex items-center gap-2 text-sm">
                              <Users className="w-4 h-4 text-orange-600" />
                              <span className="text-gray-600">Social:</span>
                              <span className="font-semibold text-gray-900">
                                {currentSearcher.onboarding_data.personality.social_level}/10
                              </span>
                            </div>
                          )}
                          {currentSearcher.onboarding_data.personality.noise_tolerance && (
                            <div className="flex items-center gap-2 text-sm">
                              <Volume2 className="w-4 h-4 text-purple-600" />
                              <span className="text-gray-600">Bruit:</span>
                              <span className="font-semibold text-gray-900">
                                {currentSearcher.onboarding_data.personality.noise_tolerance}/10
                              </span>
                            </div>
                          )}
                          {currentSearcher.onboarding_data.personality.sleep_schedule && (
                            <div className="flex items-center gap-2 text-sm">
                              <Moon className="w-4 h-4 text-indigo-600" />
                              <span className="text-gray-600">Sommeil:</span>
                              <span className="font-semibold text-gray-900">
                                {currentSearcher.onboarding_data.personality.sleep_schedule}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Interests */}
                    {currentSearcher.onboarding_data?.interests && currentSearcher.onboarding_data.interests.length > 0 && (
                      <div>
                        <p className="text-sm font-semibold text-gray-900 mb-2">Centres d'intérêt :</p>
                        <div className="flex flex-wrap gap-2">
                          {currentSearcher.onboarding_data.interests.map((interest, i) => (
                            <Badge
                              key={i}
                              className="bg-gradient-to-r from-orange-100 to-pink-100 text-gray-800 border-orange-200"
                            >
                              {interest}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Move-in Date */}
                    {currentSearcher.onboarding_data?.move_in_date && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="w-4 h-4" />
                        <span>
                          Disponible à partir du{' '}
                          {new Date(currentSearcher.onboarding_data.move_in_date).toLocaleDateString('fr-FR')}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Basic Info (always visible) */}
                {!showDetails && currentSearcher.bio && (
                  <div className="p-6 border-t border-gray-200">
                    <p className="text-gray-700 line-clamp-2">{currentSearcher.bio}</p>
                    <button
                      onClick={() => setShowDetails(true)}
                      className="text-sm text-orange-600 font-semibold mt-2 flex items-center gap-1 hover:gap-2 transition-all"
                    >
                      Voir plus
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Swipe Indicators */}
        <motion.div
          className="absolute left-20 top-1/2 -translate-y-1/2 pointer-events-none"
          style={{ opacity: useTransform(x, [0, -100], [0, 1]) }}
        >
          <div className="w-20 h-20 rounded-full bg-red-500 flex items-center justify-center rotate-12 border-4 border-white shadow-2xl">
            <X className="w-10 h-10 text-white" />
          </div>
        </motion.div>

        <motion.div
          className="absolute right-20 top-1/2 -translate-y-1/2 pointer-events-none"
          style={{ opacity: useTransform(x, [0, 100], [0, 1]) }}
        >
          <div className="w-20 h-20 rounded-full bg-green-500 flex items-center justify-center -rotate-12 border-4 border-white shadow-2xl">
            <Heart className="w-10 h-10 text-white fill-current" />
          </div>
        </motion.div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-center gap-6">
        <Button
          onClick={handlePass}
          size="lg"
          variant="outline"
          className="w-16 h-16 rounded-full border-2 border-red-300 hover:border-red-500 hover:bg-red-50 transition-all"
        >
          <X className="w-7 h-7 text-red-500" />
        </Button>

        <Button
          onClick={handleLike}
          size="lg"
          className="w-20 h-20 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 shadow-lg hover:shadow-xl transition-all"
        >
          <Heart className="w-9 h-9 text-white fill-current" />
        </Button>
      </div>

      {/* Help Text */}
      <p className="text-center text-sm text-gray-500">
        Glissez à droite pour manifester votre intérêt • Glissez à gauche pour passer
      </p>
    </div>
  );
}
