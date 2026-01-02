'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, MapPin, Euro } from 'lucide-react';
import { createClient } from '@/lib/auth/supabase-client';
import { toast } from 'sonner';
import { safeLocalStorage } from '@/lib/browser';
import { useLanguage } from '@/lib/i18n/use-language';
import SafeGooglePlacesAutocomplete from '@/components/ui/SafeGooglePlacesAutocomplete';
import {
  OnboardingLayout,
  OnboardingHeading,
  OnboardingButton,
  OnboardingLabel,
} from '@/components/onboarding';

export default function QuickBudgetLocationPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const supabase = createClient();
  const [isLoading, setIsLoading] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(true);

  const [minBudget, setMinBudget] = useState<number>(300);
  const [maxBudget, setMaxBudget] = useState<number>(1200);
  const [preferredCity, setPreferredCity] = useState('');
  const [tempCityInput, setTempCityInput] = useState('');

  useEffect(() => {
    loadExistingData();
  }, []);

  const loadExistingData = async () => {
    try {
      const saved = safeLocalStorage.get('quickBudgetLocation', {}) as any;
      if (saved.minBudget) setMinBudget(saved.minBudget);
      if (saved.maxBudget) setMaxBudget(saved.maxBudget);
      if (saved.preferredCity) {
        setPreferredCity(saved.preferredCity);
        setTempCityInput(saved.preferredCity);
      }

      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (profile) {
          // Support both old and new field names
          const minBudgetValue = profile.min_budget || profile.budget_min;
          const maxBudgetValue = profile.max_budget || profile.budget_max;
          const cityValue = profile.preferred_cities?.[0] || profile.current_city;

          if (minBudgetValue) setMinBudget(minBudgetValue);
          if (maxBudgetValue) setMaxBudget(maxBudgetValue);
          if (cityValue) {
            setPreferredCity(cityValue);
            setTempCityInput(cityValue);
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
    if (minBudget < 0) {
      toast.error(t('quickOnboarding.budgetLocation.errors.minBudgetPositive'));
      return;
    }

    if (maxBudget <= minBudget) {
      toast.error(t('quickOnboarding.budgetLocation.errors.maxBudgetGreater'));
      return;
    }

    if (!preferredCity.trim()) {
      toast.error(t('quickOnboarding.budgetLocation.errors.cityRequired'));
      return;
    }

    setIsLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        const { error } = await supabase
          .from('user_profiles')
          .upsert(
            {
              user_id: user.id,
              min_budget: minBudget,
              max_budget: maxBudget,
              budget_min: minBudget, // Alias for compatibility
              budget_max: maxBudget, // Alias for compatibility
              preferred_cities: [preferredCity.trim()],
              current_city: preferredCity.trim(), // Alias for compatibility
              updated_at: new Date().toISOString(),
            },
            { onConflict: 'user_id' }
          );

        if (error) throw error;
      }

      router.push('/onboarding/searcher/quick/lifestyle');
    } catch (error: any) {
      console.error('Error saving:', error);
      toast.error(error.message || t('quickOnboarding.common.saveError'));
    } finally {
      setIsLoading(false);
    }
  };

  const canContinue = minBudget > 0 && maxBudget > minBudget && preferredCity.trim();

  return (
    <OnboardingLayout
      role="searcher"
      backUrl="/onboarding/searcher/quick/basic-info"
      backLabel={t('quickOnboarding.common.back')}
      progress={{
        current: 2,
        total: 5,
        label: 'Étape 2 sur 5',
        stepName: t('quickOnboarding.budgetLocation.stepName'),
      }}
      isLoading={isPageLoading}
      loadingText={t('quickOnboarding.common.loading')}
    >
      {/* Header */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Euro className="w-8 h-8 text-orange-600" />
        </div>
        <OnboardingHeading
          role="searcher"
          title={t('quickOnboarding.budgetLocation.title')}
          description={t('quickOnboarding.budgetLocation.description')}
        />
      </div>

      <div className="space-y-6">
        {/* Budget Range */}
        <div className="p-5 rounded-xl bg-green-50 border border-green-200">
          <OnboardingLabel required>{t('quickOnboarding.budgetLocation.monthlyBudget')}</OnboardingLabel>

          {/* Min Budget */}
          <div className="mb-4">
            <label htmlFor="minBudget" className="block text-xs text-gray-600 mb-2">
              {t('quickOnboarding.budgetLocation.minBudget')}
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
              {t('quickOnboarding.budgetLocation.maxBudget')}
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
          <div className="bg-white rounded-lg p-4 text-center border border-green-200">
            <p className="text-sm text-gray-600 mb-1">{t('quickOnboarding.budgetLocation.yourBudget')}</p>
            <p className="text-2xl font-bold text-orange-600">
              €{minBudget} - €{maxBudget}
            </p>
          </div>
        </div>

        {/* Preferred City */}
        <div>
          <OnboardingLabel required>{t('quickOnboarding.budgetLocation.preferredCity')}</OnboardingLabel>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none z-10" />
            <SafeGooglePlacesAutocomplete
              onPlaceSelect={handlePlaceSelect}
              placeholder={t('quickOnboarding.budgetLocation.cityPlaceholder')}
              inputClassName="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
            />
          </div>
          {preferredCity && (
            <p className="text-xs text-green-600 mt-2 flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              {t('quickOnboarding.budgetLocation.selectedCity')}: {preferredCity}
            </p>
          )}
        </div>
      </div>

      <div className="mt-8">
        <OnboardingButton
          role="searcher"
          onClick={handleNext}
          disabled={!canContinue || isLoading}
        >
          {isLoading ? (
            t('quickOnboarding.common.loading')
          ) : (
            <span className="flex items-center justify-center gap-2">
              {t('quickOnboarding.common.continue')}
              <ArrowRight className="w-5 h-5" />
            </span>
          )}
        </OnboardingButton>
      </div>

      <p className="text-center text-sm text-gray-500 mt-6">
        {t('quickOnboarding.common.autoSave')}
      </p>
    </OnboardingLayout>
  );
}
