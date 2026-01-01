'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/auth/supabase-client';
import { SwipeCard } from '@/components/matching/SwipeCard';
import { CardPile } from '@/components/matching/CardPile';
import { useUserMatching, type SwipeContext, type UserWithCompatibility } from '@/lib/hooks/use-user-matching';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Heart, X, Info, Users, RotateCcw, Sparkles, CheckCircle2, AlertTriangle, Lock, UserCircle, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import LoadingHouse from '@/components/ui/LoadingHouse';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/lib/i18n/use-language';

interface SwipedCard {
  user: UserWithCompatibility;
  action: 'like' | 'pass';
  index: number;
}

export default function SwipePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();
  const { getSection } = useLanguage();
  const matching = getSection('matching');
  const [user, setUser] = useState<any>(null);

  // Read context from URL params, default to 'searcher_matching'
  const urlContext = searchParams.get('context') as SwipeContext | null;
  const [context, setContext] = useState<SwipeContext>(
    urlContext === 'resident_matching' ? 'resident_matching' : 'searcher_matching'
  );
  const [currentIndex, setCurrentIndex] = useState(0);
  const [swipeHistory, setSwipeHistory] = useState<SwipedCard[]>([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isCardExpanded, setIsCardExpanded] = useState(false);

  const {
    currentUserProfile,
    potentialMatches,
    isLoading,
    hasMore,
    recordSwipe,
    loadPotentialMatches,
    matchingGateStatus,
    isMatchingUnlocked,
  } = useUserMatching(user?.id || '', context);

  // Load swipe history from database
  const loadSwipeHistory = useCallback(async () => {
    if (!user?.id) return;

    try {
      // Get recent swipes with user profiles
      const { data: swipes, error } = await supabase
        .from('user_swipes')
        .select('swiped_id, action, created_at')
        .eq('swiper_id', user.id)
        .eq('context', context)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;

      if (swipes && swipes.length > 0) {
        // Get profiles for these users
        const userIds = swipes.map(s => s.swiped_id);
        const { data: profiles, error: profilesError } = await supabase
          .from('user_profiles')
          .select('*')
          .in('user_id', userIds);

        if (profilesError) throw profilesError;

        // Map to swipe history format
        const history: SwipedCard[] = swipes.map((swipe, idx) => {
          const profile = profiles?.find(p => p.user_id === swipe.swiped_id);
          return {
            user: {
              user_id: swipe.swiped_id,
              first_name: profile?.first_name || 'Unknown',
              last_name: profile?.last_name || '',
              profile_photo_url: profile?.profile_photo_url,
            } as UserWithCompatibility,
            action: swipe.action as 'like' | 'pass',
            index: idx
          };
        }).reverse(); // Reverse to have oldest first

        setSwipeHistory(history);
      }
    } catch (error) {
      console.error('Failed to load swipe history:', error);
    }
  }, [user?.id, context, supabase]);

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

  // Load swipe history when user and context are ready
  useEffect(() => {
    if (user?.id) {
      loadSwipeHistory();
    }
  }, [user?.id, context, loadSwipeHistory]);

  // Sync context state with URL params when they change
  useEffect(() => {
    const newContext = urlContext === 'resident_matching' ? 'resident_matching' : 'searcher_matching';
    if (newContext !== context) {
      setContext(newContext);
      setCurrentIndex(0);
    }
  }, [urlContext]);

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
        toast.success(matching.swipe?.toasts?.profileLiked || 'Profile liked! 💚', {
          description: matching.swipe?.toasts?.matchDescription || "If they like you back, it's a match!",
        });
      }

      // Wait for animation to complete
      setTimeout(() => {
        setCurrentIndex((prev) => prev + 1);
        setIsAnimating(false);
      }, 600);
    } else {
      toast.error(matching.swipe?.toasts?.swipeError || 'Failed to record swipe. Please try again.');
      setIsAnimating(false);
      // Remove from history on failure
      setSwipeHistory(prev => prev.slice(0, -1));
    }
  };

  const handleLike = () => handleSwipe('right');
  const handlePass = () => handleSwipe('left');

  const handleUndo = async () => {
    if (swipeHistory.length === 0 || isAnimating) return;

    setIsAnimating(true);
    const lastSwipe = swipeHistory[swipeHistory.length - 1];

    try {
      // Delete the swipe from the database
      const { error } = await supabase
        .from('user_swipes')
        .delete()
        .eq('swiper_id', user.id)
        .eq('swiped_id', lastSwipe.user.user_id)
        .eq('context', context);

      if (error) {
        console.error('Failed to delete swipe:', error);
        toast.error(matching.swipe?.toasts?.undoError || "Impossible d'annuler le swipe");
        setIsAnimating(false);
        return;
      }

      // Remove from history
      setSwipeHistory(prev => prev.slice(0, -1));

      // Add the user back to potentialMatches at the beginning
      // This ensures the card reappears in the center
      loadPotentialMatches();

      setTimeout(() => {
        setCurrentIndex(0);
        setIsAnimating(false);
        toast.info(matching.swipe?.toasts?.undoSuccess || 'Swipe annulé !');
      }, 600);
    } catch (error) {
      console.error('Undo failed:', error);
      toast.error(matching.swipe?.toasts?.undoErrorGeneric || "Erreur lors de l'annulation");
      setIsAnimating(false);
    }
  };

  // Change context and update URL to keep them in sync
  const handleContextChange = (newContext: SwipeContext) => {
    if (newContext === context) return;
    setContext(newContext);
    setCurrentIndex(0);
    // Update URL without full navigation
    router.push(`/matching/swipe?context=${newContext}`, { scroll: false });
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
        toast.success(matching.swipe?.toasts?.profilesReloaded || 'Profils rechargés !');
      }, 100);
    }, 400);
  };

  const currentCard = potentialMatches[currentIndex];
  const cardsRemaining = potentialMatches.length - currentIndex;

  // Get recent liked and passed cards for piles (extract user objects)
  const likedUsers = swipeHistory
    .filter(s => s.action === 'like')
    .slice(-5)
    .map(s => s.user);
  const passedUsers = swipeHistory
    .filter(s => s.action === 'pass')
    .slice(-5)
    .map(s => s.user);

  if (!user || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50/30 via-white to-orange-50/30">
        <div className="text-center">
          <LoadingHouse size={80} />
          <p className="text-gray-600 font-medium mt-4">{matching.common?.loading || 'Chargement des profils...'}</p>
        </div>
      </div>
    );
  }

  // Profile completion gate - block matching if profile is not complete enough
  if (matchingGateStatus && !isMatchingUnlocked) {
    const { profileCompletion } = matchingGateStatus;
    const incompleteCategories = profileCompletion.missingCategories.filter(c => !c.isComplete);

    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50/30 via-white to-orange-50/30 p-4 md:p-8">
        <div className="max-w-md mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.back()}
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Gate Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="p-8 text-center bg-white rounded-3xl shadow-2xl border-0">
              {/* Lock Icon */}
              <div className="w-24 h-24 bg-gradient-to-br from-orange-100 to-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Lock className="w-12 h-12 text-orange-500" />
              </div>

              <h1 className="text-2xl font-bold text-gray-900 mb-3">
                {matching.gate?.title || 'Complète ton profil pour matcher'}
              </h1>

              <p className="text-gray-600 mb-6">
                {matching.gate?.description || 'Pour trouver les meilleurs colocataires, nous avons besoin de mieux te connaître.'}{' '}
                {matching.gate?.requirement || 'Complète ton profil à au moins'} <span className="font-bold text-orange-600">70%</span> {matching.gate?.toUnlock || 'pour débloquer le matching'}.
              </p>

              {/* Progress Bar */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">{matching.gate?.progress || 'Progression'}</span>
                  <span className="text-sm font-bold text-orange-600">{profileCompletion.percentage}%</span>
                </div>
                <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${profileCompletion.percentage}%` }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="h-full bg-gradient-to-r from-orange-400 to-yellow-400 rounded-full"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {profileCompletion.filledFields}/{profileCompletion.totalFields} {matching.gate?.fieldsFilled || 'champs remplis'}
                </p>
              </div>

              {/* Missing Categories */}
              {incompleteCategories.length > 0 && (
                <div className="mb-6 text-left">
                  <p className="text-sm font-semibold text-gray-700 mb-3">{matching.gate?.sectionsToComplete || 'Sections à compléter'} :</p>
                  <div className="space-y-2">
                    {incompleteCategories.map((cat, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between bg-orange-50 rounded-lg px-4 py-2.5"
                      >
                        <span className="text-sm text-gray-700">{cat.label}</span>
                        <span className="text-xs font-medium text-orange-600">
                          {cat.filled}/{cat.total}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* CTA Button */}
              <Button
                onClick={() => router.push('/profile/edit')}
                className="w-full bg-gradient-to-r from-[#FFA040] to-[#FFB85C] hover:from-[#FF8C30] hover:to-[#FFA548] text-white font-semibold py-6 rounded-xl text-lg"
              >
                <UserCircle className="w-5 h-5 mr-2" />
                {matching.gate?.completeProfile || 'Compléter mon profil'}
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>

              {/* Secondary link */}
              <button
                onClick={() => router.push('/dashboard/searcher')}
                className="mt-4 text-sm text-gray-500 hover:text-gray-700 underline"
              >
                {matching.gate?.backToDashboard || 'Retour au dashboard'}
              </button>
            </Card>
          </motion.div>

          {/* Info */}
          <p className="text-center text-xs text-gray-400 mt-6 px-4">
            {matching.gate?.info || 'Un profil complet permet des matchs plus précis et augmente tes chances de trouver le colocataire idéal.'}
          </p>
        </div>
      </div>
    );
  }

  // Reset expansion when card changes
  const handleSwipeComplete = () => {
    setIsCardExpanded(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8 overflow-auto pb-32">
      {/* Header */}
      <div className="max-w-md mx-auto mb-6 relative z-50">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <Users className="w-8 h-8 text-orange-600" />
              {matching.swipe?.title || 'Trouve ton match'}
            </h1>
            <p className="text-gray-600">
              {context === 'searcher_matching'
                ? (matching.swipe?.searcherContext || 'Trouve des colocataires pour chercher ensemble')
                : (matching.swipe?.residentContext || 'Trouve de nouveaux colocataires')}
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
            onClick={() => handleContextChange('searcher_matching')}
            className={`flex-1 ${context === 'searcher_matching' ? 'bg-gradient-to-r from-[#FFA040] to-[#FFB85C] hover:from-[#FF8C30] hover:to-[#FFA548]' : ''}`}
          >
            <Users className="w-4 h-4 mr-2" />
            {matching.swipe?.searchers || 'Chercheurs'}
          </Button>
          <Button
            variant={context === 'resident_matching' ? 'default' : 'outline'}
            onClick={() => handleContextChange('resident_matching')}
            className={`flex-1 ${context === 'resident_matching' ? 'bg-gradient-to-r from-[#FFA040] to-[#FFB85C] hover:from-[#FF8C30] hover:to-[#FFA548]' : ''}`}
          >
            <Heart className="w-4 h-4 mr-2" />
            {matching.swipe?.roommates || 'Colocataires'}
          </Button>
        </div>

        {/* Cards Remaining */}
        <div className="flex items-center justify-between px-4 py-2 bg-white rounded-full shadow-sm">
          <span className="text-sm text-gray-600">{matching.swipe?.profilesRemaining || 'Profils restants'}</span>
          <span className="text-sm font-bold text-orange-600">{cardsRemaining}</span>
        </div>
      </div>

      {/* Card Stack with Piles */}
      <div className="max-w-7xl mx-auto relative px-4">
        <div className="relative h-[500px] md:h-[550px] mb-6">
          {/* Left Pile - Disliked */}
          <div className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-20">
            <CardPile
              type="pass"
              cards={passedUsers}
              onUndo={swipeHistory.length > 0 && swipeHistory[swipeHistory.length - 1]?.action === 'pass' ? handleUndo : undefined}
            />
          </div>

          {/* Center - Current Card Stack */}
          <div className="absolute left-1/2 -translate-x-1/2 top-0 w-full max-w-md h-full">
            {!currentCard ? (
              <Card className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center bg-white rounded-3xl shadow-2xl">
                <div className="w-24 h-24 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center mb-6">
                  <Users className="w-12 h-12 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {matching.swipe?.allSeen?.title || 'Tu as tout vu !'} 🎉
                </h3>
                <p className="text-gray-600 mb-6">
                  {matching.swipe?.allSeen?.description || 'Reviens plus tard pour voir de nouveaux profils ou ajuste tes préférences.'}
                </p>
                <div className="flex gap-3">
                  <Button
                    onClick={handleReload}
                    disabled={isAnimating}
                    className="bg-gradient-to-r from-[#FFA040] to-[#FFB85C] text-white hover:from-[#FF8C30] hover:to-[#FFA548] disabled:opacity-50"
                  >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    {matching.swipe?.reload || 'Recharger'}
                  </Button>
                  <Button
                    onClick={() => router.push('/dashboard/searcher/groups')}
                    variant="outline"
                  >
                    <Heart className="w-4 h-4 mr-2" />
                    {matching.swipe?.viewMatches || 'Voir mes matchs'}
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
                      onSwipe={(direction) => {
                        handleSwipe(direction);
                        handleSwipeComplete();
                      }}
                      onCardClick={() => {
                        toast.info(matching.swipe?.toasts?.fullProfileComingSoon || 'Full profile view coming soon!');
                      }}
                      isExpanded={isCardExpanded}
                      onExpandChange={setIsCardExpanded}
                    />
                  </motion.div>
                </AnimatePresence>
              </>
            )}
          </div>

          {/* Right Pile - Liked */}
          <div className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-20">
            <CardPile
              type="like"
              cards={likedUsers}
              onUndo={swipeHistory.length > 0 && swipeHistory[swipeHistory.length - 1]?.action === 'like' ? handleUndo : undefined}
            />
          </div>
        </div>

      </div>

      {/* Why This Match Section - Outside the card stack */}
      <AnimatePresence>
        {isCardExpanded && currentCard?.compatibility_result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="max-w-md mx-auto mt-6 px-4"
          >
            <div className="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-2xl p-5 shadow-lg border border-orange-100">
              <p className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-orange-500" />
                {matching.swipe?.whyMatch || 'Pourquoi ce match ?'}
              </p>

              {/* Score Breakdown */}
              <div className="grid grid-cols-5 gap-3 mb-4">
                {[
                  { label: matching.swipe?.breakdown?.lifestyle || 'Style de vie', score: currentCard.compatibility_result.breakdown.lifestyle, max: 30 },
                  { label: matching.swipe?.breakdown?.social || 'Social', score: currentCard.compatibility_result.breakdown.social, max: 25 },
                  { label: matching.swipe?.breakdown?.practical || 'Pratique', score: currentCard.compatibility_result.breakdown.practical, max: 20 },
                  { label: matching.swipe?.breakdown?.values || 'Valeurs', score: currentCard.compatibility_result.breakdown.values, max: 15 },
                  { label: matching.swipe?.breakdown?.preferences || 'Préfs', score: currentCard.compatibility_result.breakdown.preferences, max: 10 },
                ].map((item, idx) => (
                  <div key={idx} className="text-center">
                    <div className="relative w-full h-2 bg-gray-200 rounded-full overflow-hidden mb-1.5">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(item.score / item.max) * 100}%` }}
                        transition={{ duration: 0.5, delay: idx * 0.1 }}
                        className="absolute inset-y-0 left-0 bg-gradient-to-r from-orange-400 to-yellow-400 rounded-full"
                      />
                    </div>
                    <p className="text-[10px] text-gray-600 font-medium">{item.label}</p>
                    <p className="text-xs font-bold text-orange-600">{Math.round((item.score / item.max) * 100)}%</p>
                  </div>
                ))}
              </div>

              {/* Strengths */}
              {currentCard.compatibility_result.strengths.length > 0 && (
                <div className="space-y-2 mb-3">
                  <p className="text-xs font-semibold text-gray-700 uppercase tracking-wide">{matching.swipe?.strengths || 'Points forts'}</p>
                  {currentCard.compatibility_result.strengths.slice(0, 3).map((strength, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-sm text-green-700 bg-green-50 rounded-lg px-3 py-2">
                      <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      <span>{strength}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Considerations */}
              {currentCard.compatibility_result.considerations.length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-gray-700 uppercase tracking-wide">{matching.swipe?.considerations || 'À considérer'}</p>
                  {currentCard.compatibility_result.considerations.slice(0, 2).map((consideration, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-sm text-amber-700 bg-amber-50 rounded-lg px-3 py-2">
                      <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      <span>{consideration}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Action Buttons - Below the card and "Why this match" section */}
      {currentCard && (
        <motion.div
          layout
          className={cn(
            "flex items-center justify-center gap-6 relative z-50",
            isCardExpanded ? "mt-8 mb-8" : "mt-6"
          )}
        >
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

          {/* Info Button - Show/Hide compatibility */}
          <button
            onClick={() => setIsCardExpanded(!isCardExpanded)}
            disabled={isAnimating}
            className={cn(
              "w-12 h-12 rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition-all active:scale-95 disabled:opacity-50",
              isCardExpanded
                ? "bg-orange-500 text-white"
                : "bg-white text-orange-600"
            )}
            aria-label="Info"
          >
            <Info className="w-5 h-5" />
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
        </motion.div>
      )}

      {/* Bottom Navigation */}
      <div className="max-w-md mx-auto mt-8 relative z-50">
        <div className="flex items-center justify-around py-4">
          <Button
            variant="ghost"
            onClick={() => router.push('/dashboard/searcher')}
          >
            {matching.swipe?.dashboard || 'Dashboard'}
          </Button>
          <Button
            variant="ghost"
            onClick={() => router.push('/dashboard/searcher/groups')}
            className="relative"
          >
            <Heart className="w-5 h-5 mr-2" />
            {matching.swipe?.matchesAndGroups || 'Matchs & Groupes'}
          </Button>
        </div>
      </div>
    </div>
  );
}
