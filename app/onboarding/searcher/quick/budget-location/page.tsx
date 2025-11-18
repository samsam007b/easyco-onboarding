'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, ArrowLeft, MapPin, Euro } from 'lucide-react';
import { createClient } from '@/lib/auth/supabase-client';
import { toast } from 'sonner';
import { safeLocalStorage } from '@/lib/browser';
import ProgressBar, { generateStepsArray } from '@/components/onboarding/ProgressBar';
import SafeGooglePlacesAutocomplete from '@/components/ui/SafeGooglePlacesAutocomplete';
import LoadingHouse from '@/components/ui/LoadingHouse';

export default function QuickBudgetLocationPage() {
  const router = useRouter();
  const supabase = createClient();
  const [isLoading, setIsLoading] = useState(false);

  const [minBudget, setMinBudget] = useState<number>(300);
  const [maxBudget, setMaxBudget] = useState<number>(1200);
  const [preferredCity, setPreferredCity] = useState('');
  const [tempCityInput, setTempCityInput] = useState('');

  useEffect(() => {
    loadExistingData();
  }, []);

  const loadExistingData = async () => {
    try {
      // Load from localStorage
      const saved = safeLocalStorage.get('quickBudgetLocation', {}) as any;
      if (saved.minBudget) setMinBudget(saved.minBudget);
      if (saved.maxBudget) setMaxBudget(saved.maxBudget);
      if (saved.preferredCity) {
        setPreferredCity(saved.preferredCity);
        setTempCityInput(saved.preferredCity);
      }

      // Load from database if exists
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: matchingProfile } = await supabase
          .from('user_matching_profiles')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (matchingProfile) {
          if (matchingProfile.min_budget) setMinBudget(matchingProfile.min_budget);
          if (matchingProfile.max_budget) setMaxBudget(matchingProfile.max_budget);
          if (matchingProfile.preferred_city) {
            setPreferredCity(matchingProfile.preferred_city);
            setTempCityInput(matchingProfile.preferred_city);
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
      minBudget,
      maxBudget,
      preferredCity,
    };
    safeLocalStorage.set('quickBudgetLocation', saveData);
  }, [minBudget, maxBudget, preferredCity]);

  const handlePlaceSelect = (place: google.maps.places.PlaceResult) => {
    if (place.formatted_address) {
      setPreferredCity(place.formatted_address);
      setTempCityInput(place.formatted_address);
    } else if (place.name) {
      setPreferredCity(place.name);
      setTempCityInput(place.name);
    }
  };

  const handleNext = async () => {
    // Validation
    if (minBudget < 0) {
      toast.error('Le budget minimum doit être positif');
      return;
    }

    if (maxBudget <= minBudget) {
      toast.error('Le budget maximum doit être supérieur au minimum');
      return;
    }

    if (!preferredCity.trim()) {
      toast.error('La ville préférée est requise');
      return;
    }

    setIsLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        // Upsert to user_matching_profiles
        const { error } = await supabase
          .from('user_matching_profiles')
          .upsert(
            {
              user_id: user.id,
              min_budget: minBudget,
              max_budget: maxBudget,
              preferred_city: preferredCity.trim(),
              updated_at: new Date().toISOString(),
            },
            { onConflict: 'user_id' }
          );

        if (error) throw error;
      }

      router.push('/onboarding/searcher/quick/lifestyle');
    } catch (error: any) {
      console.error('Error saving:', error);
      toast.error(error.message || 'Erreur lors de la sauvegarde');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    router.push('/onboarding/searcher/quick/basic-info');
  };

  const steps = generateStepsArray('quick', 1);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white">
      <ProgressBar steps={steps} currentStep={1} mode="quick" />

      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Euro className="w-8 h-8 text-orange-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Budget et Localisation
          </h1>
          <p className="text-gray-600">
            Aide-nous à trouver des options dans ton budget et ta zone préférée
          </p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-lg p-8 space-y-6">
          {/* Budget Range */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-4">
              Budget mensuel <span className="text-red-500">*</span>
            </label>

            {/* Min Budget */}
            <div className="mb-4">
              <label htmlFor="minBudget" className="block text-xs text-gray-600 mb-2">
                Budget minimum (€/mois)
              </label>
              <input
                id="minBudget"
                type="number"
                value={minBudget}
                onChange={(e) => setMinBudget(parseInt(e.target.value) || 0)}
                min="0"
                step="50"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
              />
            </div>

            {/* Max Budget */}
            <div className="mb-4">
              <label htmlFor="maxBudget" className="block text-xs text-gray-600 mb-2">
                Budget maximum (€/mois)
              </label>
              <input
                id="maxBudget"
                type="number"
                value={maxBudget}
                onChange={(e) => setMaxBudget(parseInt(e.target.value) || 0)}
                min="0"
                step="50"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
              />
            </div>

            {/* Visual Range Display */}
            <div className="bg-orange-50 rounded-lg p-4 text-center">
              <p className="text-sm text-gray-600 mb-1">Ton budget mensuel</p>
              <p className="text-2xl font-bold text-orange-600">
                €{minBudget} - €{maxBudget}
              </p>
            </div>
          </div>

          {/* Preferred City */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Ville préférée <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none z-10" />
              <SafeGooglePlacesAutocomplete
                onPlaceSelect={handlePlaceSelect}
                placeholder="Ex: Bruxelles, Liège, Gand..."
                inputClassName="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
              />
            </div>
            {preferredCity && (
              <p className="text-xs text-green-600 mt-2 flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                Ville sélectionnée: {preferredCity}
              </p>
            )}
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
