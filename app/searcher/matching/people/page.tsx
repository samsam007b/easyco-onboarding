'use client';

import { useState, useEffect, memo, useCallback } from 'react';
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
  ArrowLeft,
  Sparkles,
  MessageCircle,
  ChevronRight,
  Music,
  Coffee,
  Moon,
  Sun,
  Dog,
  Cigarette,
  Search,
  Bookmark,
  TrendingUp,
  Eye,
  UserCheck,
  Building2,
} from 'lucide-react';

// V3-FUN Matching People Palette - Searcher Dark Gradient (intense for matching energy)

// Semantic Colors

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 400, damping: 25 } }
};

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

// Stats component
const StatsBar = memo(function StatsBar({
  profilesCount,
  matchesCount,
  viewedCount
}: {
  profilesCount: number;
  matchesCount: number;
  viewedCount: number;
}) {
  return (
    <div className="flex items-center gap-6 text-sm">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 superellipse-xl bg-white/80 backdrop-blur-sm flex items-center justify-center shadow-sm">
          <Eye className="w-4 h-4" style={{ color: 'var(--searcher-500)' }} />
        </div>
        <div>
          <p className="font-bold text-gray-900">{profilesCount}</p>
          <p className="text-xs text-gray-500">Profils</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 superellipse-xl bg-white/80 backdrop-blur-sm flex items-center justify-center shadow-sm">
          <Heart className="w-4 h-4" style={{ color: 'var(--searcher-500)' }} />
        </div>
        <div>
          <p className="font-bold text-gray-900">{matchesCount}</p>
          <p className="text-xs text-gray-500">Matchs</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 superellipse-xl bg-white/80 backdrop-blur-sm flex items-center justify-center shadow-sm">
          <UserCheck className="w-4 h-4" style={{ color: '#10B981' }} />
        </div>
        <div>
          <p className="font-bold text-gray-900">{viewedCount}</p>
          <p className="text-xs text-gray-500">Vus</p>
        </div>
      </div>
    </div>
  );
});

// Mobile bottom nav
const MobileBottomNav = memo(function MobileBottomNav({ unreadMessages }: { unreadMessages: number }) {
  return (
    <motion.div
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-t border-gray-100 px-4 py-2 md:hidden z-50 safe-area-pb"
    >
      <div className="flex items-center justify-around max-w-md mx-auto">
        <Link href="/searcher" className="flex flex-col items-center gap-1 px-4 py-2">
          <Home className="w-5 h-5 text-gray-400" />
          <span className="text-xs text-gray-500">Hub</span>
        </Link>
        <Link href="/searcher/explore" className="flex flex-col items-center gap-1 px-4 py-2">
          <Search className="w-5 h-5 text-gray-400" />
          <span className="text-xs text-gray-500">Explorer</span>
        </Link>
        <Link href="/searcher/matching" className="flex flex-col items-center gap-1 px-4 py-2">
          <div className="w-10 h-10 superellipse-2xl flex items-center justify-center shadow-lg" style={{ background: 'var(--gradient-searcher)' }}>
            <Heart className="w-5 h-5 text-white" />
          </div>
        </Link>
        <Link href="/searcher/favorites" className="flex flex-col items-center gap-1 px-4 py-2">
          <Bookmark className="w-5 h-5 text-gray-400" />
          <span className="text-xs text-gray-500">Favoris</span>
        </Link>
        <Link href="/messages" className="flex flex-col items-center gap-1 px-4 py-2 relative">
          <MessageCircle className="w-5 h-5 text-gray-400" />
          <span className="text-xs text-gray-500">Messages</span>
          {unreadMessages > 0 && (
            <span className="absolute -top-1 right-2 w-5 h-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center font-bold">
              {unreadMessages > 9 ? '9+' : unreadMessages}
            </span>
          )}
        </Link>
      </div>
    </motion.div>
  );
});

// Profile card component
const ProfileCard = memo(function ProfileCard({
  profile,
  direction
}: {
  profile: RoommateProfile;
  direction: 'left' | 'right' | null;
}) {
  return (
    <motion.div
      key={profile.id}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{
        scale: 1,
        opacity: 1,
        x: direction === 'left' ? -300 : direction === 'right' ? 300 : 0,
        rotate: direction === 'left' ? -15 : direction === 'right' ? 15 : 0
      }}
      exit={{ scale: 0.8, opacity: 0 }}
      transition={{ duration: 0.3, type: 'spring', stiffness: 300, damping: 25 }}
      className="absolute w-full max-w-md"
    >
      <Card className="overflow-hidden superellipse-3xl shadow-2xl border-0 bg-white/95 backdrop-blur-xl">
        {/* Profile Image */}
        <div className="relative h-72 sm:h-80" style={{ background: 'var(--gradient-searcher-subtle)' }}>
          {profile.avatar_url ? (
            <Image
              src={profile.avatar_url}
              alt={profile.full_name}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Users className="w-20 h-20 text-gray-300" />
            </div>
          )}
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

          {/* Score Badge */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className="absolute top-4 right-4 px-4 py-2 superellipse-2xl text-white font-bold shadow-lg flex items-center gap-2 backdrop-blur-sm"
            style={{ background: `${'var(--searcher-500)'}ee` }}
          >
            <Sparkles className="w-4 h-4" />
            {profile.compatibility_score}%
          </motion.div>

          {/* Name & Info */}
          <div className="absolute bottom-4 left-4 right-4">
            <h2 className="text-2xl font-bold text-white drop-shadow-lg">
              {profile.full_name}{profile.age && `, ${profile.age}`}
            </h2>
            <div className="flex items-center gap-3 text-white/90 text-sm mt-2">
              {profile.occupation && (
                <div className="flex items-center gap-1.5">
                  <Briefcase className="w-4 h-4" />
                  <span>{profile.occupation}</span>
                </div>
              )}
              {profile.city && (
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4" />
                  <span>{profile.city}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <CardContent className="p-5">
          {/* Bio */}
          {profile.bio && (
            <p className="text-gray-600 mb-4 line-clamp-2">{profile.bio}</p>
          )}

          {/* Interests */}
          {profile.interests && profile.interests.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {profile.interests.map((interest, i) => (
                <Badge
                  key={i}
                  className="superellipse-xl border-0 text-xs font-medium"
                  style={{
                    backgroundColor: `${'var(--searcher-500)'}15`,
                    color: 'var(--searcher-500)'
                  }}
                >
                  {interest}
                </Badge>
              ))}
            </div>
          )}

          {/* Lifestyle Icons */}
          <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
            {profile.lifestyle.sleepSchedule === 'early' ? (
              <div
                className="flex items-center gap-1 px-2.5 py-1.5 superellipse-xl text-xs font-medium"
                style={{ backgroundColor: '#FEF3C7', color: '#D97706' }}
                title="Lève-tôt"
              >
                <Sun className="w-4 h-4" />
                <span className="hidden sm:inline">Matinal</span>
              </div>
            ) : (
              <div
                className="flex items-center gap-1 px-2.5 py-1.5 superellipse-xl text-xs font-medium"
                style={{ backgroundColor: '#E0E7FF', color: '#4F46E5' }}
                title="Couche-tard"
              >
                <Moon className="w-4 h-4" />
                <span className="hidden sm:inline">Noctambule</span>
              </div>
            )}
            {profile.lifestyle.noise === 'quiet' && (
              <div
                className="flex items-center gap-1 px-2.5 py-1.5 superellipse-xl text-xs font-medium"
                style={{ backgroundColor: '#D1FAE5', color: '#059669' }}
                title="Calme"
              >
                <Coffee className="w-4 h-4" />
                <span className="hidden sm:inline">Calme</span>
              </div>
            )}
            {profile.lifestyle.noise === 'lively' && (
              <div
                className="flex items-center gap-1 px-2.5 py-1.5 superellipse-xl text-xs font-medium"
                style={{ backgroundColor: '#F3E8FF', color: '#7C3AED' }}
                title="Festif"
              >
                <Music className="w-4 h-4" />
                <span className="hidden sm:inline">Festif</span>
              </div>
            )}
            {profile.lifestyle.pets && (
              <div
                className="flex items-center gap-1 px-2.5 py-1.5 superellipse-xl text-xs font-medium"
                style={{ backgroundColor: '#FFEDD5', color: '#EA580C' }}
                title="A un animal"
              >
                <Dog className="w-4 h-4" />
              </div>
            )}
            {profile.lifestyle.smoking && (
              <div
                className="flex items-center gap-1 px-2.5 py-1.5 superellipse-xl text-xs font-medium"
                style={{ backgroundColor: '#F3F4F6', color: '#6B7280' }}
                title="Fumeur"
              >
                <Cigarette className="w-4 h-4" />
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
});

// Empty state component
const EmptyState = memo(function EmptyState({ router }: { router: ReturnType<typeof useRouter> }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center p-8 bg-white/80 backdrop-blur-xl superellipse-3xl shadow-lg"
    >
      <motion.div
        animate={{ rotate: [0, 10, -10, 0] }}
        transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
        className="w-24 h-24 superellipse-3xl flex items-center justify-center mx-auto mb-6 shadow-xl"
        style={{ background: 'var(--gradient-searcher)' }}
      >
        <Sparkles className="w-12 h-12 text-white" />
      </motion.div>
      <h3 className="text-2xl font-bold text-gray-900 mb-2">
        Plus de profils pour l'instant
      </h3>
      <p className="text-gray-600 mb-6 max-w-xs mx-auto">
        Revenez plus tard pour découvrir de nouveaux colocataires potentiels
      </p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Button
          onClick={() => router.push('/searcher/matching')}
          className="superellipse-xl text-white shadow-lg"
          style={{ background: 'var(--gradient-searcher)' }}
        >
          <Building2 className="w-4 h-4 mr-2" />
          Voir les propriétés
        </Button>
        <Button
          onClick={() => router.push('/searcher/explore')}
          variant="outline"
          className="superellipse-xl border-gray-200"
        >
          <Search className="w-4 h-4 mr-2" />
          Explorer
        </Button>
      </div>
    </motion.div>
  );
});

const SearcherMatchingPeoplePage = memo(function SearcherMatchingPeoplePage() {
  const router = useRouter();
  const supabase = createClient();
  const { language } = useLanguage();

  const [loading, setLoading] = useState(true);
  const [profiles, setProfiles] = useState<RoommateProfile[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState<'left' | 'right' | null>(null);
  const [matches, setMatches] = useState<string[]>([]);
  const [viewedCount, setViewedCount] = useState(0);
  const [unreadMessages, setUnreadMessages] = useState(0);

  useEffect(() => {
    const loadProfiles = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push('/login'); return; }

      // Load unread messages count
      const { count: messagesCount } = await supabase
        .from('messages')
        .select('*', { count: 'exact', head: true })
        .eq('receiver_id', user.id)
        .eq('is_read', false);

      setUnreadMessages(messagesCount || 0);

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
          bio: 'Créative et organisée, je cherche une colocation calme et inspirante pour mon nouveau chapitre.',
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
        },
        {
          id: '4',
          user_id: 'u4',
          full_name: 'Lucas Petit',
          avatar_url: 'https://randomuser.me/api/portraits/men/22.jpg',
          age: 27,
          occupation: 'Photographe',
          city: 'Schaerbeek',
          bio: 'Artiste freelance avec un studio à la maison. Amateur de bons cafés et de discussions.',
          lifestyle: { sleepSchedule: 'late', noise: 'moderate', cleanliness: 'relaxed', guests: 'often', smoking: false, pets: true },
          interests: ['Photo', 'Café', 'Voyages'],
          compatibility_score: 78
        }
      ];

      setProfiles(mockProfiles);
      setLoading(false);
    };
    loadProfiles();
  }, [supabase, router]);

  const handleSwipe = useCallback(async (liked: boolean) => {
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

    setViewedCount(prev => prev + 1);
    setDirection(null);
    setCurrentIndex(prev => prev + 1);
  }, [currentIndex, profiles]);

  const currentProfile = profiles[currentIndex];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--gradient-searcher-subtle)' }}>
        <LoadingHouse size={80} />
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden pb-24 md:pb-8">
      {/* Glassmorphism Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, #FFFBF0 0%, #FFF4E0 30%, #FFE5C0 60%, #FFFBF0 100%)' }} />
        {/* Animated blobs */}
        <div className="absolute top-20 -left-32 w-96 h-96 rounded-full opacity-40 blur-3xl animate-blob" style={{ background: 'var(--searcher-500)' }} />
        <div className="absolute top-40 -right-32 w-80 h-80 rounded-full opacity-30 blur-3xl animate-blob animation-delay-2000" style={{ background: 'var(--searcher-600)' }} />
        <div className="absolute -bottom-32 left-1/2 w-96 h-96 rounded-full opacity-25 blur-3xl animate-blob animation-delay-4000" style={{ background: 'var(--searcher-300)' }} />
      </div>

      {/* Sticky Header - Level 1: Main Nav */}
      <div className="sticky top-0 z-40">
        <div className="bg-white/80 backdrop-blur-xl border-b border-white/50">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Link href="/searcher/matching">
                  <Button variant="ghost" size="icon" className="superellipse-xl hover:bg-searcher-50">
                    <ArrowLeft className="w-5 h-5" />
                  </Button>
                </Link>
                <div>
                  <h1 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <Users className="w-5 h-5" style={{ color: 'var(--searcher-500)' }} />
                    Colocataires
                  </h1>
                  <p className="text-xs text-gray-500">Trouvez votre match idéal</p>
                </div>
              </div>

              {/* Tab Switcher */}
              <div className="flex gap-2">
                <Link href="/searcher/matching">
                  <Button
                    variant="outline"
                    size="sm"
                    className="superellipse-xl border-gray-200 text-gray-600 hover:bg-gray-50"
                  >
                    <Home className="w-4 h-4 mr-1.5" />
                    <span className="hidden sm:inline">Propriétés</span>
                  </Button>
                </Link>
                <Button
                  size="sm"
                  className="superellipse-xl text-white shadow-lg border-0"
                  style={{ background: 'var(--gradient-searcher)' }}
                >
                  <Users className="w-4 h-4 mr-1.5" />
                  <span className="hidden sm:inline">Colocataires</span>
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Level 2: Stats Bar */}
        <div className="bg-white/60 backdrop-blur-lg border-b border-white/30">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 py-2.5">
            <StatsBar
              profilesCount={profiles.length}
              matchesCount={matches.length}
              viewedCount={viewedCount}
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-2xl mx-auto px-4 sm:px-6 py-6"
      >
        {/* Swipe Card Area */}
        <motion.div variants={itemVariants} className="relative min-h-[520px] sm:min-h-[580px] flex items-center justify-center">
          <AnimatePresence mode="wait">
            {currentProfile ? (
              <ProfileCard profile={currentProfile} direction={direction} />
            ) : (
              <EmptyState router={router} />
            )}
          </AnimatePresence>
        </motion.div>

        {/* Action Buttons */}
        {currentProfile && (
          <motion.div
            variants={itemVariants}
            className="flex items-center justify-center gap-6 mt-6"
          >
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => handleSwipe(false)}
              className="w-16 h-16 rounded-full bg-white shadow-lg flex items-center justify-center border-2 border-red-100 hover:border-red-300 transition-all hover:shadow-xl"
            >
              <X className="w-7 h-7 text-red-500" />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => handleSwipe(true)}
              className="w-20 h-20 rounded-full shadow-xl flex items-center justify-center text-white transition-all hover:shadow-2xl"
              style={{ background: 'var(--gradient-searcher)' }}
            >
              <Heart className="w-9 h-9" />
            </motion.button>
          </motion.div>
        )}

        {/* Tip Card */}
        {currentProfile && (
          <motion.div
            variants={itemVariants}
            className="mt-8 bg-white/60 backdrop-blur-xl superellipse-2xl p-4 border border-white/50"
          >
            <div className="flex items-start gap-3">
              <div
                className="w-10 h-10 superellipse-xl flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: `${'var(--searcher-500)'}15` }}
              >
                <TrendingUp className="w-5 h-5" style={{ color: 'var(--searcher-500)' }} />
              </div>
              <div>
                <p className="font-medium text-gray-900 text-sm">Score de compatibilité</p>
                <p className="text-xs text-gray-500 mt-0.5">
                  Basé sur vos préférences de vie, budget et localisation souhaitée
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* Match Notification */}
      <AnimatePresence>
        {matches.length > 0 && matches[matches.length - 1] === profiles[currentIndex - 1]?.id && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            className="fixed bottom-28 md:bottom-8 left-4 right-4 max-w-md mx-auto bg-white superellipse-2xl shadow-2xl p-4 flex items-center gap-4 border border-searcher-100 z-50"
          >
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 0.5, repeat: 2 }}
              className="w-14 h-14 superellipse-2xl flex items-center justify-center shadow-lg"
              style={{ background: 'var(--gradient-searcher)' }}
            >
              <Heart className="w-7 h-7 text-white" />
            </motion.div>
            <div className="flex-1">
              <p className="font-bold text-gray-900 text-lg">C'est un Match !</p>
              <p className="text-sm text-gray-600">Vous pouvez maintenant discuter</p>
            </div>
            <Button
              size="sm"
              className="superellipse-xl text-white shadow-lg"
              style={{ background: 'var(--gradient-searcher)' }}
            >
              <MessageCircle className="w-4 h-4 mr-1.5" />
              Chat
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Bottom Nav */}
      <MobileBottomNav unreadMessages={unreadMessages} />
    </div>
  );
});

export default SearcherMatchingPeoplePage;
