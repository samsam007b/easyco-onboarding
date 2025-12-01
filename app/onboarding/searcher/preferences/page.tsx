'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { DollarSign, MapPin, PawPrint, Cigarette, Settings } from 'lucide-react';
import { safeLocalStorage } from '@/lib/browser';
import { useLanguage } from '@/lib/i18n/use-language';
import {
  OnboardingLayout,
  OnboardingHeading,
  OnboardingButton,
  OnboardingSelectionCard,
  OnboardingLabel,
  OnboardingGrid,
  OnboardingInput,
} from '@/components/onboarding';

export default function PreferencesPage() {
  const { t } = useLanguage();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [budgetMin, setBudgetMin] = useState('');
  const [budgetMax, setBudgetMax] = useState('');
  const [preferredDistrict, setPreferredDistrict] = useState('');
  const [openToLivingWithPets, setOpenToLivingWithPets] = useState(false);
  const [acceptSmokersInHouse, setAcceptSmokersInHouse] = useState(false);

  useEffect(() => {
    loadExistingData();
  }, []);

  const loadExistingData = () => {
    try {
      const saved = safeLocalStorage.get('preferences', {}) as any;
      if (saved.budgetMin) setBudgetMin(saved.budgetMin.toString());
      if (saved.budgetMax) setBudgetMax(saved.budgetMax.toString());
      if (saved.preferredDistrict) setPreferredDistrict(saved.preferredDistrict);
      if (saved.openToLivingWithPets !== undefined) setOpenToLivingWithPets(saved.openToLivingWithPets);
      if (saved.acceptSmokersInHouse !== undefined) setAcceptSmokersInHouse(saved.acceptSmokersInHouse);
    } finally {
      setIsLoading(false);
    }
  };

  const handleContinue = () => {
    safeLocalStorage.set('preferences', {
      budgetMin: budgetMin ? parseInt(budgetMin) : null,
      budgetMax: budgetMax ? parseInt(budgetMax) : null,
      preferredDistrict,
      openToLivingWithPets,
      acceptSmokersInHouse,
    });
    router.push('/onboarding/searcher/privacy');
  };

  const canContinue = budgetMin && budgetMax;

  return (
    <OnboardingLayout
      role="searcher"
      backUrl="/onboarding/searcher/ideal-coliving"
      backLabel={t('common.back')}
      progress={{
        current: 6,
        total: 6,
        label: 'Étape 6 sur 6',
        stepName: t('onboarding.preferences.title'),
      }}
      isLoading={isLoading}
      loadingText={t('common.loading')}
    >
      <div className="flex items-start gap-3 mb-6">
        <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
          <Settings className="w-6 h-6 text-blue-600" />
        </div>
        <OnboardingHeading
          role="searcher"
          title={t('onboarding.preferences.title')}
          description={t('onboarding.preferences.subtitle')}
        />
      </div>

      <div className="space-y-6">
        {/* Monthly budget */}
        <div className="p-5 rounded-xl bg-green-50 border border-green-200">
          <OnboardingLabel required>
            <div className="flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-green-600" />
              {t('onboarding.preferences.monthlyBudget')}
            </div>
          </OnboardingLabel>
          <div className="grid grid-cols-2 gap-4 mt-3">
            <div>
              <label className="text-sm text-gray-600 mb-1 block">{t('onboarding.preferences.minimum')}</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">€</span>
                <input
                  type="number"
                  value={budgetMin}
                  onChange={(e) => setBudgetMin(e.target.value)}
                  className="w-full pl-8 pr-4 py-3 rounded-lg border border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-100 outline-none transition"
                  placeholder="300"
                  min="0"
                />
              </div>
            </div>
            <div>
              <label className="text-sm text-gray-600 mb-1 block">{t('onboarding.preferences.maximum')}</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">€</span>
                <input
                  type="number"
                  value={budgetMax}
                  onChange={(e) => setBudgetMax(e.target.value)}
                  className="w-full pl-8 pr-4 py-3 rounded-lg border border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-100 outline-none transition"
                  placeholder="1200"
                  min="0"
                />
              </div>
            </div>
          </div>
          {budgetMin && budgetMax && (
            <p className="text-sm text-gray-600 mt-3">
              {t('onboarding.preferences.budgetRange').replace('{min}', budgetMin).replace('{max}', budgetMax)}
            </p>
          )}
        </div>

        {/* Preferred district */}
        <div>
          <OnboardingLabel>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-red-600" />
              {t('onboarding.preferences.preferredDistrict')}
            </div>
          </OnboardingLabel>
          <OnboardingInput
            role="searcher"
            label=""
            value={preferredDistrict}
            onChange={(e) => setPreferredDistrict(e.target.value)}
            placeholder={t('onboarding.preferences.districtPlaceholder')}
          />
          <p className="text-sm text-gray-500 mt-1">
            {t('onboarding.preferences.districtHelp')}
          </p>
        </div>

        {/* Tolerance preferences */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-gray-700">{t('onboarding.preferences.tolerancePreferences')}</h3>

          {/* Open to pets */}
          <div>
            <OnboardingLabel>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center">
                  <PawPrint className="w-4 h-4 text-orange-600" />
                </div>
                {t('onboarding.preferences.openToLivingWithPets')}
              </div>
            </OnboardingLabel>
            <OnboardingGrid columns={2}>
              <OnboardingSelectionCard
                role="searcher"
                selected={!openToLivingWithPets}
                onClick={() => setOpenToLivingWithPets(false)}
              >
                <div className="text-center font-medium text-sm">Non</div>
              </OnboardingSelectionCard>
              <OnboardingSelectionCard
                role="searcher"
                selected={openToLivingWithPets}
                onClick={() => setOpenToLivingWithPets(true)}
              >
                <div className="text-center font-medium text-sm">Oui</div>
              </OnboardingSelectionCard>
            </OnboardingGrid>
          </div>

          {/* Accept smokers */}
          <div>
            <OnboardingLabel>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
                  <Cigarette className="w-4 h-4 text-red-600" />
                </div>
                {t('onboarding.preferences.acceptSmokersInHouse')}
              </div>
            </OnboardingLabel>
            <OnboardingGrid columns={2}>
              <OnboardingSelectionCard
                role="searcher"
                selected={!acceptSmokersInHouse}
                onClick={() => setAcceptSmokersInHouse(false)}
              >
                <div className="text-center font-medium text-sm">Non</div>
              </OnboardingSelectionCard>
              <OnboardingSelectionCard
                role="searcher"
                selected={acceptSmokersInHouse}
                onClick={() => setAcceptSmokersInHouse(true)}
              >
                <div className="text-center font-medium text-sm">Oui</div>
              </OnboardingSelectionCard>
            </OnboardingGrid>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <OnboardingButton
          role="searcher"
          onClick={handleContinue}
          disabled={!canContinue}
        >
          {t('onboarding.preferences.continueToPrivacy')}
        </OnboardingButton>
      </div>
    </OnboardingLayout>
  );
}
