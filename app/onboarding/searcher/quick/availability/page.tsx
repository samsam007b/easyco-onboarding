'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, ArrowLeft, Calendar, Clock } from 'lucide-react';
import { createClient } from '@/lib/auth/supabase-client';
import { toast } from 'sonner';
import { safeLocalStorage } from '@/lib/browser';
import ProgressBar, { generateStepsArray } from '@/components/onboarding/ProgressBar';
import { handleSupabaseError, handleValidationError, ErrorCode } from '@/lib/utils/error-handler';
import LoadingHouse from '@/components/ui/LoadingHouse';

// Define type for move-in flexibility
type MoveInFlexibility = 'asap' | 'exact' | 'flexible';

export default function QuickAvailabilityPage() {
  const router = useRouter();
  const supabase = createClient();
  const [isLoading, setIsLoading] = useState(false);

  const [moveInDate, setMoveInDate] = useState('');
  const [moveInFlexibility, setMoveInFlexibility] = useState<MoveInFlexibility>('flexible');

  useEffect(() => {
    loadExistingData();
  }, []);

  const loadExistingData = async () => {
    try {
      // Load from localStorage
      const saved = safeLocalStorage.get('quickAvailability', {}) as any;
      if (saved.moveInDate) setMoveInDate(saved.moveInDate);
      if (saved.moveInFlexibility) {
        setMoveInFlexibility(saved.moveInFlexibility as MoveInFlexibility);
      }

      // Load from database
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
    }
  };

  // Auto-save
  useEffect(() => {
    const saveData = {
      moveInDate,
      moveInFlexibility,
    };
    safeLocalStorage.set('quickAvailability', saveData);
  }, [moveInDate, moveInFlexibility]);

  const handleNext = async () => {
    // Validation
    if (!moveInDate && (moveInFlexibility as MoveInFlexibility) !== 'asap') {
      handleValidationError('moveInDate', ErrorCode.VALIDATION_REQUIRED_FIELD);
      return;
    }

    // Check date is not in the past
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

      // Save to matching profile
      const { error: matchingError } = await supabase
        .from('user_matching_profiles')
        .upsert(
          {
            user_id: user.id,
            desired_move_in_date: (moveInFlexibility as MoveInFlexibility) === 'asap' ? new Date().toISOString().split('T')[0] : moveInDate,
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

      // Mark Quick Start as completed
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

      // Navigate to completion page
      router.push('/onboarding/searcher/quick/complete');
    } catch (error: any) {
      handleSupabaseError(error, ErrorCode.SAVE_FAILED, {
        step: 'quick-availability',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    router.push('/onboarding/searcher/quick/lifestyle');
  };

  const steps = generateStepsArray('quick', 3);

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white">
      <ProgressBar steps={steps} currentStep={3} mode="quick" />

      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Calendar className="w-8 h-8 text-orange-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Quand veux-tu emménager ?
          </h1>
          <p className="text-gray-600">
            Cela nous aide à te montrer des logements disponibles
          </p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-lg p-8 space-y-6">
          {/* Flexibility Options */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-4">
              Ma flexibilité <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {flexibilityOptions.map((option) => (
                <button
                  key={option.id}
                  onClick={() => setMoveInFlexibility(option.id)}
                  className={`
                    p-4 rounded-xl border-2 transition-all text-left
                    ${moveInFlexibility === option.id
                      ? 'border-orange-500 bg-orange-50 shadow-md scale-105'
                      : 'border-gray-200 hover:border-orange-300 hover:bg-orange-50/50'
                    }
                  `}
                >
                  <div className="text-3xl mb-2">{option.icon}</div>
                  <p className="font-semibold text-gray-900 mb-1">{option.label}</p>
                  <p className="text-xs text-gray-600">{option.description}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Date Picker (shown if not ASAP) */}
          {(moveInFlexibility as MoveInFlexibility) !== 'asap' && (
            <div>
              <label htmlFor="moveInDate" className="block text-sm font-semibold text-gray-700 mb-2">
                Date d'emménagement souhaitée <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                <input
                  id="moveInDate"
                  type="date"
                  value={moveInDate}
                  onChange={(e) => setMoveInDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
                  required={(moveInFlexibility as MoveInFlexibility) !== 'asap'}
                />
              </div>
              {moveInDate && (
                <p className="text-xs text-green-600 mt-2">
                  ✓ Date sélectionnée: {new Date(moveInDate).toLocaleDateString('fr-FR', {
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
          {(moveInFlexibility as MoveInFlexibility) === 'asap' && (
            <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4">
              <p className="text-sm text-green-800 font-medium">
                🏃 Super! Nous te montrerons les logements disponibles immédiatement.
              </p>
            </div>
          )}

          {/* Info Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <p className="text-sm text-blue-800">
              💡 <span className="font-semibold">Astuce:</span> Plus tu es flexible, plus tu auras d'options disponibles!
            </p>
          </div>

          {/* Buttons */}
          <div className="flex gap-4 pt-4">
            <button
              onClick={handleBack}
              className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-4 px-6 rounded-xl flex items-center justify-center gap-2 transition-all"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Retour</span>
            </button>

            <button
              onClick={handleNext}
              disabled={isLoading}
              className="flex-1 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold py-4 px-6 rounded-xl flex items-center justify-center gap-2 transition-all hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <LoadingHouse size={20} />
              ) : (
                <>
                  <span>Terminer</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </div>
        </div>

        {/* Footer Note */}
        <p className="text-center text-sm text-gray-500 mt-6">
          ✅ Dernière étape! Ton profil sera prêt après celle-ci
        </p>
      </div>
    </div>
  );
}
