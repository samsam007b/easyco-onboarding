'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, Calendar, Clock } from 'lucide-react';
import { createClient } from '@/lib/auth/supabase-client';
import { toast } from 'sonner';
import { safeLocalStorage } from '@/lib/browser';
import { handleSupabaseError, handleValidationError, ErrorCode } from '@/lib/utils/error-handler';
import {
  OnboardingLayout,
  OnboardingHeading,
  OnboardingButton,
  OnboardingLabel,
  OnboardingSelectionCard,
  OnboardingGrid,
} from '@/components/onboarding';

type MoveInFlexibility = 'asap' | 'exact' | 'flexible';

export default function QuickAvailabilityPage() {
  const router = useRouter();
  const supabase = createClient();
  const [isLoading, setIsLoading] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(true);

  const [moveInDate, setMoveInDate] = useState('');
  const [moveInFlexibility, setMoveInFlexibility] = useState<MoveInFlexibility>('flexible');

  useEffect(() => {
    loadExistingData();
  }, []);

  const loadExistingData = async () => {
    try {
      const saved = safeLocalStorage.get('quickAvailability', {}) as any;
      if (saved.moveInDate) setMoveInDate(saved.moveInDate);
      if (saved.moveInFlexibility) {
        setMoveInFlexibility(saved.moveInFlexibility as MoveInFlexibility);
      }

      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: matchingProfile } = await supabase
          .from('user_matching_profiles')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (matchingProfile) {
          if (matchingProfile.desired_move_in_date) {
            setMoveInDate(matchingProfile.desired_move_in_date);
          }
        }
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setIsPageLoading(false);
    }
  };

  useEffect(() => {
    const saveData = {
      moveInDate,
      moveInFlexibility,
    };
    safeLocalStorage.set('quickAvailability', saveData);
  }, [moveInDate, moveInFlexibility]);

  const handleNext = async () => {
    if (!moveInDate && moveInFlexibility !== 'asap') {
      handleValidationError('moveInDate', ErrorCode.VALIDATION_REQUIRED_FIELD);
      return;
    }

    if (moveInDate) {
      const selectedDate = new Date(moveInDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (selectedDate < today) {
        handleValidationError('moveInDate', ErrorCode.VALIDATION_INVALID_DATE, {
          reason: 'Date in the past',
          selectedDate: moveInDate,
        });
        return;
      }
    }

    setIsLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        handleSupabaseError(
          new Error('No authenticated user'),
          ErrorCode.AUTH_NO_USER
        );
        return;
      }

      const { error: matchingError } = await supabase
        .from('user_matching_profiles')
        .upsert(
          {
            user_id: user.id,
            desired_move_in_date: moveInFlexibility === 'asap' ? new Date().toISOString().split('T')[0] : moveInDate,
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'user_id' }
        );

      if (matchingError) {
        handleSupabaseError(matchingError, ErrorCode.SAVE_PROFILE_FAILED, {
          table: 'user_matching_profiles',
          userId: user.id,
        });
        return;
      }

      const { error: profileError } = await supabase
        .from('user_profiles')
        .update({
          onboarding_completed: true,
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', user.id);

      if (profileError) {
        handleSupabaseError(profileError, ErrorCode.UPDATE_FAILED, {
          table: 'user_profiles',
          userId: user.id,
        });
        return;
      }

      router.push('/onboarding/searcher/quick/complete');
    } catch (error: any) {
      handleSupabaseError(error, ErrorCode.SAVE_FAILED, {
        step: 'quick-availability',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const flexibilityOptions: Array<{
    id: MoveInFlexibility;
    label: string;
    description: string;
    icon: string;
  }> = [
    {
      id: 'asap',
      label: 'Dès que possible',
      description: 'Je cherche à emménager maintenant',
      icon: '🏃',
    },
    {
      id: 'exact',
      label: 'Date précise',
      description: 'J\'ai une date d\'emménagement fixe',
      icon: '📅',
    },
    {
      id: 'flexible',
      label: 'Flexible',
      description: 'Je peux m\'adapter de quelques semaines',
      icon: '🤝',
    },
  ];

  const canContinue = moveInFlexibility === 'asap' || moveInDate;

  return (
    <OnboardingLayout
      role="searcher"
      backUrl="/onboarding/searcher/quick/lifestyle"
      backLabel="Retour"
      progress={{
        current: 4,
        total: 5,
        label: 'Étape 4 sur 5',
        stepName: 'Disponibilité',
      }}
      isLoading={isPageLoading}
      loadingText="Chargement..."
    >
      {/* Header */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Calendar className="w-8 h-8 text-orange-600" />
        </div>
        <OnboardingHeading
          role="searcher"
          title="Quand veux-tu emménager ?"
          description="Cela nous aide à te montrer des logements disponibles"
        />
      </div>

      <div className="space-y-6">
        {/* Flexibility Options */}
        <div>
          <OnboardingLabel required>Ma flexibilité</OnboardingLabel>
          <OnboardingGrid columns={3}>
            {flexibilityOptions.map((option) => (
              <OnboardingSelectionCard
                key={option.id}
                role="searcher"
                selected={moveInFlexibility === option.id}
                onClick={() => setMoveInFlexibility(option.id)}
              >
                <div className="text-center">
                  <div className="text-3xl mb-2">{option.icon}</div>
                  <p className="font-semibold text-gray-900 mb-1 text-sm">{option.label}</p>
                  <p className="text-xs text-gray-600">{option.description}</p>
                </div>
              </OnboardingSelectionCard>
            ))}
          </OnboardingGrid>
        </div>

        {/* Date Picker (shown if not ASAP) */}
        {moveInFlexibility !== 'asap' && (
          <div>
            <OnboardingLabel required>Date d'emménagement souhaitée</OnboardingLabel>
            <div className="relative">
              <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              <input
                id="moveInDate"
                type="date"
                value={moveInDate}
                onChange={(e) => setMoveInDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
                required
              />
            </div>
            {moveInDate && (
              <p className="text-xs text-green-600 mt-2">
                Date sélectionnée: {new Date(moveInDate).toLocaleDateString('fr-FR', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            )}
          </div>
        )}

        {/* ASAP Message */}
        {moveInFlexibility === 'asap' && (
          <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4">
            <p className="text-sm text-green-800 font-medium">
              Super! Nous te montrerons les logements disponibles immédiatement.
            </p>
          </div>
        )}

        {/* Info Box */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <p className="text-sm text-blue-800">
            <span className="font-semibold">Astuce:</span> Plus tu es flexible, plus tu auras d'options disponibles!
          </p>
        </div>
      </div>

      <div className="mt-8">
        <OnboardingButton
          role="searcher"
          onClick={handleNext}
          disabled={!canContinue || isLoading}
        >
          {isLoading ? (
            'Chargement...'
          ) : (
            <span className="flex items-center justify-center gap-2">
              Terminer
              <ArrowRight className="w-5 h-5" />
            </span>
          )}
        </OnboardingButton>
      </div>

      <p className="text-center text-sm text-gray-500 mt-6">
        Dernière étape! Ton profil sera prêt après celle-ci
      </p>
    </OnboardingLayout>
  );
}
