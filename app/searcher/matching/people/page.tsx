'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { createClient } from '@/lib/auth/supabase-client';
import { useLanguage } from '@/lib/i18n/use-language';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import LoadingHouse from '@/components/ui/LoadingHouse';
import {
  Heart,
  X,
  Home,
  Users,
  MapPin,
  Briefcase,
  Star,
  ArrowLeft,
  Sparkles,
  MessageCircle,
  ChevronRight,
  Info,
  Music,
  Coffee,
  Moon,
  Sun,
  Dog,
  Cigarette,
} from 'lucide-react';

// V3-FUN Palette
const MATCH_GRADIENT = 'linear-gradient(135deg, #EC4899 0%, #F472B6 50%, #F9A8D4 100%)';
const LIKE_COLOR = '#10B981';
const PASS_COLOR = '#EF4444';

interface RoommateProfile {
  id: string;
  user_id: string;
  full_name: string;
  avatar_url?: string;
  age?: number;
  occupation?: string;
  city?: string;
  bio?: string;
  lifestyle: {
    sleepSchedule?: 'early' | 'late';
    noise?: 'quiet' | 'moderate' | 'lively';
    cleanliness?: 'relaxed' | 'tidy' | 'spotless';
    guests?: 'rarely' | 'sometimes' | 'often';
    smoking?: boolean;
    pets?: boolean;
  };
  interests?: string[];
  compatibility_score: number;
}

export default function SearcherMatchingPeoplePage() {
  const router = useRouter();
  const supabase = createClient();
  const { language } = useLanguage();

  const [loading, setLoading] = useState(true);
  const [profiles, setProfiles] = useState<RoommateProfile[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState<'left' | 'right' | null>(null);
  const [matches, setMatches] = useState<string[]>([]);

  useEffect(() => {
    const loadProfiles = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push('/login'); return; }

      // Load potential roommate profiles
      // For demo, create mock profiles
      const mockProfiles: RoommateProfile[] = [
        {
          id: '1',
          user_id: 'u1',
          full_name: 'Marie Dubois',
          avatar_url: 'https://randomuser.me/api/portraits/women/32.jpg',
          age: 26,
          occupation: 'Designer UX',
          city: 'Bruxelles',
          bio: 'Créative et organisée, je cherche une colocation calme et inspirante.',
          lifestyle: { sleepSchedule: 'late', noise: 'moderate', cleanliness: 'tidy', guests: 'sometimes', smoking: false, pets: false },
          interests: ['Art', 'Yoga', 'Cuisine'],
          compatibility_score: 92
        },
        {
          id: '2',
          user_id: 'u2',
          full_name: 'Thomas Laurent',
          avatar_url: 'https://randomuser.me/api/portraits/men/45.jpg',
          age: 29,
          occupation: 'Développeur',
          city: 'Ixelles',
          bio: 'Passionné de tech et de musique. Je travaille de la maison quelques jours par semaine.',
          lifestyle: { sleepSchedule: 'late', noise: 'quiet', cleanliness: 'tidy', guests: 'rarely', smoking: false, pets: false },
          interests: ['Tech', 'Musique', 'Jeux vidéo'],
          compatibility_score: 87
        },
        {
          id: '3',
          user_id: 'u3',
          full_name: 'Sophie Martin',
          avatar_url: 'https://randomuser.me/api/portraits/women/68.jpg',
          age: 24,
          occupation: 'Étudiante médecine',
          city: 'Saint-Gilles',
          bio: 'En dernière année de médecine. Calme et studieuse, mais j\'adore cuisiner le weekend!',
          lifestyle: { sleepSchedule: 'early', noise: 'quiet', cleanliness: 'spotless', guests: 'sometimes', smoking: false, pets: false },
          interests: ['Lecture', 'Cuisine', 'Running'],
          compatibility_score: 85
        }
      ];

      setProfiles(mockProfiles);
      setLoading(false);
    };
    loadProfiles();
  }, [supabase, router]);

  const handleSwipe = async (liked: boolean) => {
    if (currentIndex >= profiles.length) return;

    const profile = profiles[currentIndex];
    setDirection(liked ? 'right' : 'left');

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 300));

    if (liked) {
      // Check if mutual match
      const isMutual = Math.random() > 0.5;
      if (isMutual) {
        setMatches(prev => [...prev, profile.id]);
      }
    }

    setDirection(null);
    setCurrentIndex(prev => prev + 1);
  };

  const currentProfile = profiles[currentIndex];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingHouse size={80} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50/30">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-3">
              <Link href="/searcher/matching">
                <Button variant="ghost" size="icon" className="rounded-xl">
                  <ArrowLeft className="w-5 h-5" />
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  <Users className="w-6 h-6" style={{ color: '#EC4899' }} />
                  Colocataires
                </h1>
                <p className="text-gray-600 text-sm">
                  Swipe pour matcher
                </p>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-2">
              <Link href="/searcher/matching">
                <Button variant="outline" className="rounded-xl" size="sm">
                  <Home className="w-4 h-4 mr-2" />
                  Propriétés
                </Button>
              </Link>
              <Button
                variant="default"
                className="rounded-xl text-white shadow-lg"
                style={{ background: MATCH_GRADIENT }}
                size="sm"
              >
                <Users className="w-4 h-4 mr-2" />
                Colocataires
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Swipe Card */}
        <div className="relative h-[600px] flex items-center justify-center">
          <AnimatePresence mode="wait">
            {currentProfile ? (
              <motion.div
                key={currentProfile.id}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{
                  scale: 1,
                  opacity: 1,
                  x: direction === 'left' ? -300 : direction === 'right' ? 300 : 0,
                  rotate: direction === 'left' ? -15 : direction === 'right' ? 15 : 0
                }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="absolute w-full max-w-md"
              >
                <Card className="overflow-hidden rounded-3xl shadow-2xl border-0">
                  {/* Profile Image */}
                  <div className="relative h-80 bg-gradient-to-br from-pink-100 to-purple-100">
                    {currentProfile.avatar_url ? (
                      <Image
                        src={currentProfile.avatar_url}
                        alt={currentProfile.full_name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Users className="w-20 h-20 text-gray-300" />
                      </div>
                    )}
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    {/* Score Badge */}
                    <div
                      className="absolute top-4 right-4 px-4 py-2 rounded-full text-white font-bold shadow-lg flex items-center gap-2"
                      style={{ background: MATCH_GRADIENT }}
                    >
                      <Heart className="w-4 h-4" />
                      {currentProfile.compatibility_score}%
                    </div>
                    {/* Name & Age */}
                    <div className="absolute bottom-4 left-4 right-4">
                      <h2 className="text-2xl font-bold text-white">
                        {currentProfile.full_name}, {currentProfile.age}
                      </h2>
                      <div className="flex items-center gap-2 text-white/90 text-sm mt-1">
                        <Briefcase className="w-4 h-4" />
                        <span>{currentProfile.occupation}</span>
                        <span>•</span>
                        <MapPin className="w-4 h-4" />
                        <span>{currentProfile.city}</span>
                      </div>
                    </div>
                  </div>

                  <CardContent className="p-6">
                    {/* Bio */}
                    <p className="text-gray-600 mb-4">{currentProfile.bio}</p>

                    {/* Interests */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {currentProfile.interests?.map((interest, i) => (
                        <Badge
                          key={i}
                          variant="secondary"
                          className="rounded-full bg-pink-50 text-pink-700 border-0"
                        >
                          {interest}
                        </Badge>
                      ))}
                    </div>

                    {/* Lifestyle Icons */}
                    <div className="flex items-center gap-4 pt-4 border-t border-gray-100">
                      {currentProfile.lifestyle.sleepSchedule === 'early' ? (
                        <div className="flex items-center gap-1 text-amber-600" title="Lève-tôt">
                          <Sun className="w-5 h-5" />
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 text-indigo-600" title="Couche-tard">
                          <Moon className="w-5 h-5" />
                        </div>
                      )}
                      {currentProfile.lifestyle.noise === 'quiet' && (
                        <div className="flex items-center gap-1 text-green-600" title="Calme">
                          <Coffee className="w-5 h-5" />
                        </div>
                      )}
                      {currentProfile.lifestyle.noise === 'lively' && (
                        <div className="flex items-center gap-1 text-purple-600" title="Festif">
                          <Music className="w-5 h-5" />
                        </div>
                      )}
                      {currentProfile.lifestyle.pets && (
                        <div className="flex items-center gap-1 text-orange-600" title="A un animal">
                          <Dog className="w-5 h-5" />
                        </div>
                      )}
                      {currentProfile.lifestyle.smoking && (
                        <div className="flex items-center gap-1 text-gray-600" title="Fumeur">
                          <Cigarette className="w-5 h-5" />
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center p-8"
              >
                <div
                  className="w-24 h-24 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl"
                  style={{ background: MATCH_GRADIENT }}
                >
                  <Sparkles className="w-12 h-12 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Plus de profils pour l'instant
                </h3>
                <p className="text-gray-600 mb-6">
                  Revenez plus tard pour découvrir de nouveaux colocataires
                </p>
                <Button
                  onClick={() => router.push('/searcher/matching')}
                  variant="outline"
                  className="rounded-xl"
                >
                  Voir les propriétés
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Action Buttons */}
        {currentProfile && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center gap-6 mt-4"
          >
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => handleSwipe(false)}
              className="w-16 h-16 rounded-full bg-white shadow-lg flex items-center justify-center border-2 border-red-200 hover:border-red-400 transition-colors"
            >
              <X className="w-8 h-8 text-red-500" />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => handleSwipe(true)}
              className="w-20 h-20 rounded-full shadow-lg flex items-center justify-center text-white"
              style={{ background: MATCH_GRADIENT }}
            >
              <Heart className="w-10 h-10" />
            </motion.button>
          </motion.div>
        )}

        {/* Match Notification */}
        <AnimatePresence>
          {matches.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-white rounded-2xl shadow-2xl p-4 flex items-center gap-4 border border-pink-200"
            >
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center"
                style={{ background: MATCH_GRADIENT }}
              >
                <Heart className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="font-bold text-gray-900">C'est un Match !</p>
                <p className="text-sm text-gray-600">Vous pouvez maintenant discuter</p>
              </div>
              <Button size="sm" className="rounded-xl text-white" style={{ background: MATCH_GRADIENT }}>
                <MessageCircle className="w-4 h-4 mr-1" />
                Chat
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
