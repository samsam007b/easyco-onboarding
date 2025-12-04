'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, Sparkles, Dog, Cigarette, Trash2 } from 'lucide-react';
import { createClient } from '@/lib/auth/supabase-client';
import { toast } from 'sonner';
import { safeLocalStorage } from '@/lib/browser';
import {
  OnboardingLayout,
  OnboardingHeading,
  OnboardingButton,
  OnboardingLabel,
} from '@/components/onboarding';

export default function QuickLifestylePage() {
  const router = useRouter();
  const supabase = createClient();
  const [isLoading, setIsLoading] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(true);

  const [isSmoker, setIsSmoker] = useState(false);
  const [hasPets, setHasPets] = useState(false);
  const [cleanlinessLevel, setCleanlinessLevel] = useState<number>(3);

  useEffect(() => {
    loadExistingData();
  }, []);

  const loadExistingData = async () => {
    try {
      const saved = safeLocalStorage.get('quickLifestyle', {}) as any;
      if (saved.isSmoker !== undefined) setIsSmoker(saved.isSmoker);
      if (saved.hasPets !== undefined) setHasPets(saved.hasPets);
      if (saved.cleanlinessLevel) setCleanlinessLevel(saved.cleanlinessLevel);

      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (profile) {
          // Support both old and new field names
          const isSmokerValue = profile.smoking ?? profile.is_smoker;
          const hasPetsValue = profile.pets ?? profile.has_pets;

          if (isSmokerValue !== null && isSmokerValue !== undefined) setIsSmoker(isSmokerValue);
          if (hasPetsValue !== null && hasPetsValue !== undefined) setHasPets(hasPetsValue);
          if (profile.cleanliness_level) setCleanlinessLevel(profile.cleanliness_level);
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
      isSmoker,
      hasPets,
      cleanlinessLevel,
    };
    safeLocalStorage.set('quickLifestyle', saveData);
  }, [isSmoker, hasPets, cleanlinessLevel]);

  const handleNext = async () => {
    setIsLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        const { error } = await supabase
          .from('user_profiles')
          .upsert(
            {
              user_id: user.id,
              smoking: isSmoker,
              is_smoker: isSmoker, // Alias for compatibility
              pets: hasPets,
              has_pets: hasPets, // Alias for compatibility
              cleanliness_level: cleanlinessLevel,
              updated_at: new Date().toISOString(),
            },
            { onConflict: 'user_id' }
          );

        if (error) throw error;
      }

      router.push('/onboarding/searcher/quick/availability');
    } catch (error: any) {
      console.error('Error saving:', error);
      toast.error(error.message || 'Erreur lors de la sauvegarde');
    } finally {
      setIsLoading(false);
    }
  };

  const cleanlinessLabels = [
    { value: 1, label: 'Décontracté', emoji: '😊' },
    { value: 2, label: 'Souple', emoji: '🙂' },
    { value: 3, label: 'Normal', emoji: '😐' },
    { value: 4, label: 'Ordonné', emoji: '🧹' },
    { value: 5, label: 'Très propre', emoji: '✨' },
  ];

  return (
    <OnboardingLayout
      role="searcher"
      backUrl="/onboarding/searcher/quick/budget-location"
      backLabel="Retour"
      progress={{
        current: 3,
        total: 5,
        label: 'Étape 3 sur 5',
        stepName: 'Style de Vie',
      }}
      isLoading={isPageLoading}
      loadingText="Chargement..."
    >
      {/* Header */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Sparkles className="w-8 h-8 text-orange-600" />
        </div>
        <OnboardingHeading
          role="searcher"
          title="Ton Style de Vie"
          description="Ces infos nous aident à trouver des colocataires compatibles"
        />
      </div>

      <div className="space-y-6">
        {/* Smoking */}
        <div className="p-4 rounded-xl bg-white border border-gray-200">
          <label className="flex items-center justify-between cursor-pointer group">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gray-100 group-hover:bg-orange-50 rounded-xl flex items-center justify-center transition">
                <Cigarette className="w-6 h-6 text-gray-600 group-hover:text-orange-600 transition" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">Je fume</p>
                <p className="text-sm text-gray-500">Tabac ou cigarette électronique</p>
              </div>
            </div>
            <div className="relative">
              <input
                type="checkbox"
                checked={isSmoker}
                onChange={(e) => setIsSmoker(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-14 h-8 bg-gray-200 rounded-full peer-checked:bg-orange-500 transition-all">
                <div className={`w-6 h-6 bg-white rounded-full shadow-md transition-all duration-300 ${isSmoker ? 'translate-x-7 mt-1 ml-1' : 'translate-x-1 mt-1'}`} />
              </div>
            </div>
          </label>
        </div>

        {/* Pets */}
        <div className="p-4 rounded-xl bg-white border border-gray-200">
          <label className="flex items-center justify-between cursor-pointer group">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gray-100 group-hover:bg-orange-50 rounded-xl flex items-center justify-center transition">
                <Dog className="w-6 h-6 text-gray-600 group-hover:text-orange-600 transition" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">J'ai des animaux</p>
                <p className="text-sm text-gray-500">Chien, chat ou autre animal de compagnie</p>
              </div>
            </div>
            <div className="relative">
              <input
                type="checkbox"
                checked={hasPets}
                onChange={(e) => setHasPets(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-14 h-8 bg-gray-200 rounded-full peer-checked:bg-orange-500 transition-all">
                <div className={`w-6 h-6 bg-white rounded-full shadow-md transition-all duration-300 ${hasPets ? 'translate-x-7 mt-1 ml-1' : 'translate-x-1 mt-1'}`} />
              </div>
            </div>
          </label>
        </div>

        {/* Cleanliness Level */}
        <div className="p-5 rounded-xl bg-white border border-gray-200">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
              <Trash2 className="w-6 h-6 text-gray-600" />
            </div>
            <div>
              <p className="font-semibold text-gray-900">Niveau de propreté</p>
              <p className="text-sm text-gray-500">Comment décris-tu ton niveau de propreté?</p>
            </div>
          </div>

          {/* Cleanliness Options */}
          <div className="grid grid-cols-5 gap-2">
            {cleanlinessLabels.map((item) => (
              <button
                key={item.value}
                onClick={() => setCleanlinessLevel(item.value)}
                className={`
                  flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all
                  ${cleanlinessLevel === item.value
                    ? 'border-orange-500 bg-orange-50 shadow-md scale-105'
                    : 'border-gray-200 hover:border-orange-300 hover:bg-orange-50/50'
                  }
                `}
              >
                <span className="text-2xl">{item.emoji}</span>
                <span className="text-xs font-medium text-center text-gray-700">
                  {item.label}
                </span>
              </button>
            ))}
          </div>

          {/* Selected Level Display */}
          <div className="mt-4 text-center bg-orange-50 rounded-lg p-3">
            <p className="text-sm text-gray-600">
              Ton niveau: <span className="font-bold text-orange-600">{cleanlinessLabels[cleanlinessLevel - 1].label}</span>
            </p>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <OnboardingButton
          role="searcher"
          onClick={handleNext}
          disabled={isLoading}
        >
          {isLoading ? (
            'Chargement...'
          ) : (
            <span className="flex items-center justify-center gap-2">
              Continuer
              <ArrowRight className="w-5 h-5" />
            </span>
          )}
        </OnboardingButton>
      </div>

      <p className="text-center text-sm text-gray-500 mt-6">
        Tes préférences sont sauvegardées automatiquement
      </p>
    </OnboardingLayout>
  );
}
