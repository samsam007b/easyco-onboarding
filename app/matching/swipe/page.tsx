'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/auth/supabase-client';
import { SwipeCard } from '@/components/matching/SwipeCard';
import { useUserMatching, type SwipeContext, type UserWithCompatibility } from '@/lib/hooks/use-user-matching';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Heart, X, Info, Users, RotateCcw } from 'lucide-react';
import { toast } from 'sonner';
import LoadingHouse from '@/components/ui/LoadingHouse';
import { motion, AnimatePresence } from 'framer-motion';

interface SwipedCard {
  user: UserWithCompatibility;
  action: 'like' | 'pass';
  index: number;
}

export default function SwipePage() {
  const router = useRouter();
  const supabase = createClient();
  const [user, setUser] = useState<any>(null);
  const [context, setContext] = useState<SwipeContext>('searcher_matching');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [swipeHistory, setSwipeHistory] = useState<SwipedCard[]>([]);
  const [isAnimating, setIsAnimating] = useState(false);

  const {
    currentUserProfile,
    potentialMatches,
    isLoading,
    hasMore,
    recordSwipe,
    loadPotentialMatches,
  } = useUserMatching(user?.id || '', context);

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }
      setUser(user);
    };

    getUser();
  }, [supabase, router]);

  const handleSwipe = async (direction: 'left' | 'right') => {
    const currentUser = potentialMatches[currentIndex];
    if (!currentUser || isAnimating) return;

    setIsAnimating(true);
    const action = direction === 'right' ? 'like' : 'pass';

    // Add to history
    setSwipeHistory(prev => [...prev, {
      user: currentUser,
      action,
      index: currentIndex
    }]);

    const success = await recordSwipe(currentUser.user_id, action);

    if (success) {
      if (action === 'like') {
        toast.success('Profile liked! 💚', {
          description: "If they like you back, it's a match!",
        });
      }

      // Wait for animation to complete
      setTimeout(() => {
        setCurrentIndex((prev) => prev + 1);
        setIsAnimating(false);
      }, 600);
    } else {
      toast.error('Failed to record swipe. Please try again.');
      setIsAnimating(false);
      // Remove from history on failure
      setSwipeHistory(prev => prev.slice(0, -1));
    }
  };

  const handleLike = () => handleSwipe('right');
  const handlePass = () => handleSwipe('left');

  const handleUndo = () => {
    if (swipeHistory.length === 0 || isAnimating) return;

    setIsAnimating(true);
    const lastSwipe = swipeHistory[swipeHistory.length - 1];

    // Remove from history
    setSwipeHistory(prev => prev.slice(0, -1));

    // Go back to previous card
    setTimeout(() => {
      setCurrentIndex(lastSwipe.index);
      setIsAnimating(false);
      toast.info('Undo successful');
    }, 600);
  };

  const handleReload = async () => {
    setIsAnimating(true);

    // Animate cards sliding down
    setCurrentIndex(-1); // Trigger exit animation

    // Reset local state after animation
    setTimeout(async () => {
      setSwipeHistory([]);

      // Reload potential matches
      await loadPotentialMatches();

      // Show new cards with entrance animation
      setTimeout(() => {
        setCurrentIndex(0);
        setIsAnimating(false);
        toast.success('Profils rechargés !');
      }, 100);
    }, 400);
  };

  const currentCard = potentialMatches[currentIndex];
  const cardsRemaining = potentialMatches.length - currentIndex;

  // Get recent liked and passed cards for piles
  const likedCards = swipeHistory.filter(s => s.action === 'like').slice(-5);
  const passedCards = swipeHistory.filter(s => s.action === 'pass').slice(-5);

  if (!user || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50/30 via-white to-orange-50/30">
        <div className="text-center">
          <LoadingHouse size={80} />
          <p className="text-gray-600 font-medium mt-4">Chargement des profils...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8 overflow-hidden">
      {/* Header */}
      <div className="max-w-md mx-auto mb-6 relative z-50">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <Users className="w-8 h-8 text-orange-600" />
              Trouve ton match
            </h1>
            <p className="text-gray-600">
              {context === 'searcher_matching'
                ? 'Trouve des colocataires pour chercher ensemble'
                : 'Trouve de nouveaux colocataires'}
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Context Switcher */}
        <div className="flex gap-2 mb-4">
          <Button
            variant={context === 'searcher_matching' ? 'default' : 'outline'}
            onClick={() => setContext('searcher_matching')}
            className={`flex-1 ${context === 'searcher_matching' ? 'bg-gradient-to-r from-[#FFA040] to-[#FFB85C] hover:from-[#FF8C30] hover:to-[#FFA548]' : ''}`}
          >
            <Users className="w-4 h-4 mr-2" />
            Chercheurs
          </Button>
          <Button
            variant={context === 'resident_matching' ? 'default' : 'outline'}
            onClick={() => setContext('resident_matching')}
            className={`flex-1 ${context === 'resident_matching' ? 'bg-gradient-to-r from-[#FFA040] to-[#FFB85C] hover:from-[#FF8C30] hover:to-[#FFA548]' : ''}`}
          >
            <Heart className="w-4 h-4 mr-2" />
            Colocataires
          </Button>
        </div>

        {/* Cards Remaining */}
        <div className="flex items-center justify-between px-4 py-2 bg-white rounded-full shadow-sm">
          <span className="text-sm text-gray-600">Profils restants</span>
          <span className="text-sm font-bold text-orange-600">{cardsRemaining}</span>
        </div>
      </div>

      {/* Card Stack with Piles */}
      <div className="max-w-7xl mx-auto relative px-4">
        <div className="relative h-[600px] mb-6">
          {/* Left Pile - Disliked (showing backs) */}
          <div className="absolute -left-4 md:left-0 top-0 h-full w-[200px] md:w-[280px] pointer-events-none overflow-hidden">
            <AnimatePresence>
              {passedCards.map((swipedCard, index) => (
                <motion.div
                  key={`passed-${swipedCard.index}`}
                  className="absolute top-1/2 -translate-y-1/2 w-[180px] md:w-[240px]"
                  initial={{ x: '250%', rotate: 0, scale: 1, rotateY: 180 }}
                  animate={{
                    x: `${-20 + index * 8}%`,
                    rotate: -15 + index * 3,
                    scale: 0.75 - index * 0.05,
                    rotateY: 180,
                    zIndex: index
                  }}
                  exit={{ x: '250%', rotate: 0, opacity: 0 }}
                  transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                >
                  {/* Card Back */}
                  <div className="w-full h-[500px] md:h-[600px] bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl shadow-2xl flex items-center justify-center">
                    <X className="w-20 h-20 md:w-32 md:h-32 text-gray-400 opacity-30" />
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            {/* White fade effect */}
            <div className="absolute right-0 top-0 h-full w-32 bg-gradient-to-r from-transparent to-gray-50 pointer-events-none z-10" />
          </div>

          {/* Center - Current Card Stack */}
          <div className="absolute left-1/2 -translate-x-1/2 top-0 w-full max-w-md h-full">
            {!currentCard ? (
              <Card className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center bg-white rounded-3xl shadow-2xl">
                <div className="w-24 h-24 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center mb-6">
                  <Users className="w-12 h-12 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Tu as tout vu ! 🎉
                </h3>
                <p className="text-gray-600 mb-6">
                  Reviens plus tard pour voir de nouveaux profils ou ajuste tes préférences.
                </p>
                <div className="flex gap-3">
                  <Button
                    onClick={handleReload}
                    disabled={isAnimating}
                    className="bg-gradient-to-r from-[#FFA040] to-[#FFB85C] text-white hover:from-[#FF8C30] hover:to-[#FFA548] disabled:opacity-50"
                  >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Recharger
                  </Button>
                  <Button
                    onClick={() => router.push('/matching/matches')}
                    variant="outline"
                  >
                    <Heart className="w-4 h-4 mr-2" />
                    Voir mes matchs
                  </Button>
                </div>
              </Card>
            ) : (
              <>
                {/* Card Stack - Show 3 cards behind */}
                <AnimatePresence mode="popLayout">
                  {[3, 2, 1].map((offset) => {
                    const cardIndex = currentIndex + offset;
                    const card = potentialMatches[cardIndex];
                    if (!card) return null;

                    return (
                      <motion.div
                        key={`preview-${cardIndex}`}
                        className="absolute inset-0 bg-white rounded-3xl shadow-lg pointer-events-none overflow-hidden"
                        initial={{ scale: 0.9, y: -100, opacity: 0, rotate: Math.random() * 10 - 5 }}
                        animate={{
                          scale: 1 - offset * 0.03,
                          y: -offset * 8,
                          opacity: 1 - offset * 0.2,
                          rotate: 0,
                          zIndex: -offset
                        }}
                        exit={{ scale: 0.8, y: 100, opacity: 0, rotate: Math.random() * 20 - 10 }}
                        transition={{
                          type: 'spring',
                          stiffness: 300,
                          damping: 30,
                          delay: (3 - offset) * 0.05
                        }}
                      >
                        {/* Preview of next cards */}
                        <div className="relative w-full h-[360px]">
                          {card.profile_photo_url ? (
                            <img
                              src={card.profile_photo_url}
                              alt={`${card.first_name}`}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-orange-200 via-orange-100 to-yellow-100 flex items-center justify-center">
                              <div className="text-6xl font-bold text-orange-600 opacity-30">
                                {card.first_name.charAt(0)}
                                {card.last_name.charAt(0)}
                              </div>
                            </div>
                          )}
                          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/40" />
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>

                {/* Current card */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`current-${currentIndex}`}
                    className="relative z-10"
                    initial={{ scale: 0.95, y: -80, opacity: 0, rotate: -3 }}
                    animate={{ scale: 1, y: 0, opacity: 1, rotate: 0 }}
                    exit={{ scale: 0.85, opacity: 0 }}
                    transition={{
                      type: 'spring',
                      stiffness: 400,
                      damping: 35,
                      delay: 0.1
                    }}
                  >
                    <SwipeCard
                      user={currentCard}
                      onSwipe={handleSwipe}
                      onCardClick={() => {
                        toast.info('Full profile view coming soon!');
                      }}
                    />
                  </motion.div>
                </AnimatePresence>
              </>
            )}
          </div>

          {/* Right Pile - Liked (showing faces) */}
          <div className="absolute -right-4 md:right-0 top-0 h-full w-[200px] md:w-[280px] pointer-events-none overflow-hidden">
            <AnimatePresence>
              {likedCards.map((swipedCard, index) => (
                <motion.div
                  key={`liked-${swipedCard.index}`}
                  className="absolute top-1/2 -translate-y-1/2 w-[180px] md:w-[240px]"
                  initial={{ x: '-250%', rotate: 0, scale: 1 }}
                  animate={{
                    x: `${20 - index * 8}%`,
                    rotate: 15 - index * 3,
                    scale: 0.75 - index * 0.05,
                    zIndex: index
                  }}
                  exit={{ x: '-250%', rotate: 0, opacity: 0 }}
                  transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                >
                  {/* Simplified card preview */}
                  <div className="w-full h-[500px] md:h-[600px] bg-white rounded-3xl shadow-2xl overflow-hidden">
                    {swipedCard.user.profile_photo_url ? (
                      <img
                        src={swipedCard.user.profile_photo_url}
                        alt={`${swipedCard.user.first_name}`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-orange-200 to-yellow-100 flex items-center justify-center">
                        <Heart className="w-20 h-20 md:w-32 md:h-32 text-orange-400 opacity-30" />
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            {/* White fade effect */}
            <div className="absolute left-0 top-0 h-full w-32 bg-gradient-to-l from-transparent to-gray-50 pointer-events-none z-10" />
          </div>
        </div>

        {/* Action Buttons */}
        {currentCard && (
          <div className="flex items-center justify-center gap-6 relative z-50">
            {/* Pass Button */}
            <button
              onClick={handlePass}
              disabled={isAnimating}
              className="w-16 h-16 rounded-full bg-white shadow-xl flex items-center justify-center hover:scale-110 transition-transform active:scale-95 disabled:opacity-50"
              aria-label="Pass"
            >
              <X className="w-8 h-8 text-red-500" />
            </button>

            {/* Undo Button */}
            <button
              onClick={handleUndo}
              disabled={swipeHistory.length === 0 || isAnimating}
              className="w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center hover:scale-110 transition-transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Undo"
            >
              <RotateCcw className="w-5 h-5 text-gray-600" />
            </button>

            {/* Info Button */}
            <button
              onClick={() => {
                toast.info('Détails de compatibilité bientôt disponibles !');
              }}
              disabled={isAnimating}
              className="w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center hover:scale-110 transition-transform active:scale-95 disabled:opacity-50"
              aria-label="Info"
            >
              <Info className="w-5 h-5 text-orange-600" />
            </button>

            {/* Like Button */}
            <button
              onClick={handleLike}
              disabled={isAnimating}
              className="w-16 h-16 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 shadow-xl flex items-center justify-center hover:scale-110 transition-transform active:scale-95 disabled:opacity-50"
              aria-label="Like"
            >
              <Heart className="w-8 h-8 text-white fill-current" />
            </button>
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <div className="max-w-md mx-auto mt-8 relative z-50">
        <div className="flex items-center justify-around py-4">
          <Button
            variant="ghost"
            onClick={() => router.push('/dashboard/searcher')}
          >
            Dashboard
          </Button>
          <Button
            variant="ghost"
            onClick={() => router.push('/matching/matches')}
            className="relative"
          >
            <Heart className="w-5 h-5 mr-2" />
            Matches
          </Button>
        </div>
      </div>
    </div>
  );
}
