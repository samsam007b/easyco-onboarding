'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/auth/supabase-client';
import { SwipeCard } from '@/components/matching/SwipeCard';
import { useUserMatching, type SwipeContext } from '@/lib/hooks/use-user-matching';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Heart, X, Info, Users, RotateCcw, Settings } from 'lucide-react';
import { toast } from 'sonner';

export default function SwipePage() {
  const router = useRouter();
  const supabase = createClient();
  const [user, setUser] = useState<any>(null);
  const [context, setContext] = useState<SwipeContext>('searcher_matching');
  const [currentIndex, setCurrentIndex] = useState(0);

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
    if (!currentUser) return;

    const action = direction === 'right' ? 'like' : 'pass';
    const success = await recordSwipe(currentUser.user_id, action);

    if (success) {
      if (action === 'like') {
        toast.success('Profile liked! 💚', {
          description: "If they like you back, it's a match!",
        });
      }

      // Move to next card
      setCurrentIndex((prev) => prev + 1);
    } else {
      toast.error('Failed to record swipe. Please try again.');
    }
  };

  const handleLike = () => handleSwipe('right');
  const handlePass = () => handleSwipe('left');

  const handleUndo = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
      toast.info('Undo successful');
    }
  };

  const currentCard = potentialMatches[currentIndex];
  const cardsRemaining = potentialMatches.length - currentIndex;

  if (!user || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-orange-100">
        <LoadingHouse size={48} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      {/* Header */}
      <div className="max-w-md mx-auto mb-6">
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

      {/* Card Stack */}
      <div className="max-w-md mx-auto relative">
        <div className="relative h-[600px] mb-6">
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
                  onClick={() => loadPotentialMatches()}
                  className="bg-gradient-to-r from-[#FFA040] to-[#FFB85C] text-white hover:from-[#FF8C30] hover:to-[#FFA548]"
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
              {/* Next card preview (behind) */}
              {potentialMatches[currentIndex + 1] && (
                <div className="absolute inset-0 bg-white rounded-3xl shadow-lg scale-95 opacity-50"></div>
              )}

              {/* Current card */}
              <SwipeCard
                user={currentCard}
                onSwipe={handleSwipe}
                onCardClick={() => {
                  // TODO: Open full profile modal
                  toast.info('Full profile view coming soon!');
                }}
              />
            </>
          )}
        </div>

        {/* Action Buttons */}
        {currentCard && (
          <div className="flex items-center justify-center gap-6">
            {/* Pass Button */}
            <button
              onClick={handlePass}
              className="w-16 h-16 rounded-full bg-white shadow-xl flex items-center justify-center hover:scale-110 transition-transform active:scale-95"
              aria-label="Pass"
            >
              <X className="w-8 h-8 text-red-500" />
            </button>

            {/* Undo Button */}
            <button
              onClick={handleUndo}
              disabled={currentIndex === 0}
              className="w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center hover:scale-110 transition-transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Undo"
            >
              <RotateCcw className="w-5 h-5 text-gray-600" />
            </button>

            {/* Info Button */}
            <button
              onClick={() => {
                // TODO: Show compatibility details
                toast.info('Détails de compatibilité bientôt disponibles !');
              }}
              className="w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center hover:scale-110 transition-transform active:scale-95"
              aria-label="Info"
            >
              <Info className="w-5 h-5 text-orange-600" />
            </button>

            {/* Like Button */}
            <button
              onClick={handleLike}
              className="w-16 h-16 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 shadow-xl flex items-center justify-center hover:scale-110 transition-transform active:scale-95"
              aria-label="Like"
            >
              <Heart className="w-8 h-8 text-white fill-current" />
            </button>
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <div className="max-w-md mx-auto mt-8">
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
