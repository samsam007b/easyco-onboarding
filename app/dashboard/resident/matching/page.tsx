'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/auth/supabase-client';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import LoadingHouse from '@/components/ui/LoadingHouse';
import {
  Heart,
  X,
  Star,
  MapPin,
  Briefcase,
  Users,
  Home,
  Sparkles,
  Settings,
  ChevronLeft,
  Clock,
  Cigarette,
  CigaretteOff,
  Moon,
  Sun
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

interface Match {
  matched_user_id: string;
  compatibility_score: number;
  match_details: {
    full_name: string;
    age: number;
    occupation: string;
    city: string;
    sociability: 'low' | 'medium' | 'high';
    cleanliness: number;
    smoker: boolean;
    languages: string[];
    avatar_url?: string;
    bio?: string;
  };
}

export default function ResidentMatchingPage() {
  const router = useRouter();
  const supabase = createClient();
  const [matches, setMatches] = useState<Match[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [direction, setDirection] = useState<'left' | 'right' | null>(null);

  useEffect(() => {
    loadMatches();
  }, []);

  const loadMatches = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }

      // Call the generate_matches_for_user function
      const { data, error } = await supabase
        .rpc('generate_matches_for_user', {
          target_user_id: user.id,
          limit_count: 50
        });

      if (error) throw error;

      setMatches(data || []);
    } catch (error) {
      console.error('Error loading matches:', error);
      toast.error('Impossible de charger les matchs');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSwipe = async (direction: 'left' | 'right', matchId: string) => {
    setDirection(direction);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const status = direction === 'right' ? 'liked' : 'passed';

      // Save the swipe decision
      const currentMatch = matches[currentIndex];
      await supabase
        .from('resident_matches')
        .upsert({
          user_id: user.id,
          matched_user_id: matchId,
          compatibility_score: currentMatch.compatibility_score,
          match_details: currentMatch.match_details,
          status: status,
          viewed_at: new Date().toISOString()
        });

      // Check if it's a mutual match
      if (direction === 'right') {
        const { data: mutualMatch } = await supabase
          .from('resident_matches')
          .select('*')
          .eq('user_id', matchId)
          .eq('matched_user_id', user.id)
          .eq('status', 'liked')
          .single();

        if (mutualMatch) {
          // It's a match!
          await supabase
            .from('resident_matches')
            .update({ status: 'matched' })
            .eq('user_id', user.id)
            .eq('matched_user_id', matchId);

          await supabase
            .from('resident_matches')
            .update({ status: 'matched' })
            .eq('user_id', matchId)
            .eq('matched_user_id', user.id);

          toast.success(`C'est un match ! 🎉`, {
            description: `Vous et ${currentMatch.match_details.full_name} êtes compatibles!`
          });
        }
      }

      // Move to next card
      setTimeout(() => {
        setCurrentIndex((prev) => prev + 1);
        setDirection(null);
      }, 300);
    } catch (error) {
      console.error('Error saving swipe:', error);
      toast.error('Erreur lors de l\'enregistrement');
    }
  };

  const handleDragEnd = (_: any, info: PanInfo) => {
    const swipeThreshold = 100;

    if (Math.abs(info.offset.x) > swipeThreshold) {
      const direction = info.offset.x > 0 ? 'right' : 'left';
      handleSwipe(direction, matches[currentIndex].matched_user_id);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 flex items-center justify-center">
        <div className="text-center">
          <LoadingHouse size={80} />
          <p className="text-gray-600 font-medium">Recherche de colocataires compatibles...</p>
        </div>
      </div>
    );
  }

  if (currentIndex >= matches.length) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md"
        >
          <div className="bg-white rounded-3xl shadow-xl p-8">
            <Sparkles className="w-16 h-16 text-orange-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold bg-gradient-to-r from-[#D97B6F] via-[#E8865D] to-[#FF8C4B] bg-clip-text text-transparent mb-4">
              Plus de profils pour le moment
            </h2>
            <p className="text-gray-600 mb-6">
              Vous avez vu tous les profils disponibles ! Revenez plus tard pour découvrir de nouveaux colocataires potentiels.
            </p>
            <div className="flex gap-3">
              <Button
                onClick={() => router.push('/dashboard/resident')}
                variant="outline"
                className="flex-1 rounded-full"
              >
                <ChevronLeft className="w-4 h-4 mr-2" />
                Retour
              </Button>
              <Button
                onClick={() => router.push('/dashboard/resident/matching/preferences')}
                className="flex-1 rounded-full bg-gradient-to-r from-[#D97B6F] via-[#E8865D] to-[#FF8C4B]"
              >
                <Settings className="w-4 h-4 mr-2" />
                Préférences
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  const currentMatch = matches[currentIndex];
  const { match_details } = currentMatch;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 p-4 md:p-6">
      {/* Header */}
      <div className="max-w-lg mx-auto mb-6">
        <div className="flex items-center justify-between">
          <Button
            onClick={() => router.push('/dashboard/resident')}
            variant="ghost"
            size="sm"
            className="rounded-full"
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-bold bg-gradient-to-r from-[#D97B6F] via-[#E8865D] to-[#FF8C4B] bg-clip-text text-transparent">
            Trouve ton coloc
          </h1>
          <Button
            onClick={() => router.push('/dashboard/resident/matching/preferences')}
            variant="ghost"
            size="sm"
            className="rounded-full"
          >
            <Settings className="w-5 h-5" />
          </Button>
        </div>

        {/* Progress */}
        <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
          <span>{currentIndex + 1} / {matches.length}</span>
          <span className="flex items-center gap-1">
            <Star className="w-4 h-4 text-orange-600" />
            {currentMatch.compatibility_score}% compatible
          </span>
        </div>
      </div>

      {/* Card Stack */}
      <div className="max-w-lg mx-auto relative h-[600px]">
        <AnimatePresence>
          {matches.slice(currentIndex, currentIndex + 2).map((match, index) => {
            const isTop = index === 0;

            return (
              <motion.div
                key={match.matched_user_id}
                drag={isTop ? 'x' : false}
                dragConstraints={{ left: 0, right: 0 }}
                onDragEnd={isTop ? handleDragEnd : undefined}
                initial={{ scale: 1 - index * 0.05, opacity: 1 - index * 0.3 }}
                animate={{
                  scale: 1 - index * 0.05,
                  y: index * 10,
                  opacity: 1 - index * 0.3,
                  rotate: direction === 'left' ? -20 : direction === 'right' ? 20 : 0,
                  x: direction === 'left' ? -300 : direction === 'right' ? 300 : 0
                }}
                exit={{
                  x: direction === 'left' ? -300 : 300,
                  opacity: 0,
                  transition: { duration: 0.3 }
                }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                className="absolute inset-0 cursor-grab active:cursor-grabbing"
                style={{ zIndex: matches.length - index }}
              >
                <div className="bg-white rounded-3xl shadow-2xl h-full overflow-hidden">
                  {/* Profile Image */}
                  <div className="relative h-72 bg-gradient-to-br from-orange-400 to-orange-600">
                    {match.match_details.avatar_url ? (
                      <img
                        src={match.match_details.avatar_url}
                        alt={match.match_details.full_name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Users className="w-24 h-24 text-white opacity-50" />
                      </div>
                    )}

                    {/* Compatibility Badge */}
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-4 py-2 flex items-center gap-2">
                      <Star className="w-5 h-5 text-orange-600" />
                      <span className="font-bold bg-gradient-to-r from-[#D97B6F] via-[#E8865D] to-[#FF8C4B] bg-clip-text text-transparent">
                        {match.compatibility_score}%
                      </span>
                    </div>
                  </div>

                  {/* Profile Info */}
                  <div className="p-6 space-y-4 overflow-y-auto" style={{ height: 'calc(100% - 18rem)' }}>
                    {/* Name & Age */}
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">
                        {match.match_details.full_name}, {match.match_details.age}
                      </h2>
                    </div>

                    {/* Quick Info Grid */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Briefcase className="w-4 h-4" />
                        <span className="text-sm capitalize">{match.match_details.occupation}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <MapPin className="w-4 h-4" />
                        <span className="text-sm">{match.match_details.city}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        {match.match_details.smoker ? (
                          <><Cigarette className="w-4 h-4" /><span className="text-sm">Fumeur</span></>
                        ) : (
                          <><CigaretteOff className="w-4 h-4" /><span className="text-sm">Non-fumeur</span></>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Home className="w-4 h-4" />
                        <span className="text-sm">Propreté {match.match_details.cleanliness}/10</span>
                      </div>
                    </div>

                    {/* Sociability Badge */}
                    <div className="flex gap-2">
                      <Badge
                        variant="secondary"
                        className={`${
                          match.match_details.sociability === 'high'
                            ? 'bg-orange-100 text-orange-700'
                            : match.match_details.sociability === 'medium'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-blue-100 text-blue-700'
                        }`}
                      >
                        <Users className="w-3 h-3 mr-1" />
                        {match.match_details.sociability === 'high'
                          ? 'Très social'
                          : match.match_details.sociability === 'medium'
                          ? 'Équilibré'
                          : 'Calme'}
                      </Badge>
                    </div>

                    {/* Languages */}
                    {match.match_details.languages && match.match_details.languages.length > 0 && (
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Langues</p>
                        <div className="flex flex-wrap gap-1">
                          {match.match_details.languages.slice(0, 3).map((lang, i) => (
                            <Badge key={i} variant="secondary" className="text-xs">
                              {typeof lang === 'string' ? lang : (lang as any).display || ''}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Bio */}
                    {match.match_details.bio && (
                      <div>
                        <p className="text-sm text-gray-600 leading-relaxed">
                          {match.match_details.bio}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Action Buttons */}
      <div className="max-w-lg mx-auto mt-6 flex items-center justify-center gap-6">
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => handleSwipe('left', currentMatch.matched_user_id)}
          className="w-16 h-16 rounded-full bg-white shadow-lg flex items-center justify-center hover:bg-red-50 transition-colors"
        >
          <X className="w-8 h-8 text-red-500" />
        </motion.button>

        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => handleSwipe('right', currentMatch.matched_user_id)}
          className="w-20 h-20 rounded-full bg-gradient-to-r from-[#D97B6F] via-[#E8865D] to-[#FF8C4B] shadow-xl flex items-center justify-center hover:opacity-90 transition-opacity"
        >
          <Heart className="w-10 h-10 text-white" />
        </motion.button>
      </div>

      {/* Swipe Hint */}
      {currentIndex === 0 && (
        <motion.div
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          transition={{ delay: 3, duration: 1 }}
          className="text-center mt-4 text-sm text-gray-500"
        >
          ← Glisse pour passer | Glisse pour liker →
        </motion.div>
      )}
    </div>
  );
}
