'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, ArrowLeft, Sparkles, Dog, Cigarette, Trash2 } from 'lucide-react';
import { createClient } from '@/lib/auth/supabase-client';
import { toast } from 'sonner';
import { safeLocalStorage } from '@/lib/browser';
import ProgressBar, { generateStepsArray } from '@/components/onboarding/ProgressBar';
import LoadingHouse from '@/components/ui/LoadingHouse';

export default function QuickLifestylePage() {
  const router = useRouter();
  const supabase = createClient();
  const [isLoading, setIsLoading] = useState(false);

  const [isSmoker, setIsSmoker] = useState(false);
  const [hasPets, setHasPets] = useState(false);
  const [cleanlinessLevel, setCleanlinessLevel] = useState<number>(3); // 1-5

  useEffect(() => {
    loadExistingData();
  }, []);

  const loadExistingData = async () => {
    try {
      // Load from localStorage
      const saved = safeLocalStorage.get('quickLifestyle', {}) as any;
      if (saved.isSmoker !== undefined) setIsSmoker(saved.isSmoker);
      if (saved.hasPets !== undefined) setHasPets(saved.hasPets);
      if (saved.cleanlinessLevel) setCleanlinessLevel(saved.cleanlinessLevel);

      // Load from database
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: matchingProfile } = await supabase
          .from('user_matching_profiles')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (matchingProfile) {
          if (matchingProfile.is_smoker !== null) setIsSmoker(matchingProfile.is_smoker);
          if (matchingProfile.has_pets !== null) setHasPets(matchingProfile.has_pets);
          if (matchingProfile.cleanliness_level) setCleanlinessLevel(matchingProfile.cleanliness_level);
        }
      }
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  // Auto-save
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
          .from('user_matching_profiles')
          .upsert(
            {
              user_id: user.id,
              is_smoker: isSmoker,
              has_pets: hasPets,
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

  const handleBack = () => {
    router.push('/onboarding/searcher/quick/budget-location');
  };

  const steps = generateStepsArray('quick', 2);

  const cleanlinessLabels = [
    { value: 1, label: 'Décontracté', emoji: '😊' },
    { value: 2, label: 'Souple', emoji: '🙂' },
    { value: 3, label: 'Normal', emoji: '😐' },
    { value: 4, label: 'Ordonné', emoji: '🧹' },
    { value: 5, label: 'Très propre', emoji: '✨' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white">
      <ProgressBar steps={steps} currentStep={2} mode="quick" />

      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-8 h-8 text-orange-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Ton Style de Vie
          </h1>
          <p className="text-gray-600">
            Ces infos nous aident à trouver des colocataires compatibles
          </p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-lg p-8 space-y-8">
          {/* Smoking */}
          <div>
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
          <div>
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
          <div>
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
                  <span>Continuer</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </div>
        </div>

        {/* Footer Note */}
        <p className="text-center text-sm text-gray-500 mt-6">
          ✅ Tes préférences sont sauvegardées automatiquement
        </p>
      </div>
    </div>
  );
}
