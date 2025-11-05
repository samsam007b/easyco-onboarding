'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, DollarSign, MapPin, PawPrint, Cigarette, Settings } from 'lucide-react';
import { safeLocalStorage } from '@/lib/browser';
import { useLanguage } from '@/lib/i18n/use-language';
import LanguageSwitcher from '@/components/LanguageSwitcher';

export default function PreferencesPage() {
  const { t } = useLanguage();
  const router = useRouter();
  const [budgetMin, setBudgetMin] = useState('');
  const [budgetMax, setBudgetMax] = useState('');
  const [preferredDistrict, setPreferredDistrict] = useState('');
  const [openToLivingWithPets, setOpenToLivingWithPets] = useState(false);
  const [acceptSmokersInHouse, setAcceptSmokersInHouse] = useState(false);

  const handleContinue = () => {
    // Save to localStorage
    safeLocalStorage.set('preferences', {
      budgetMin: budgetMin ? parseInt(budgetMin) : null,
      budgetMax: budgetMax ? parseInt(budgetMax) : null,
      preferredDistrict,
      openToLivingWithPets,
      acceptSmokersInHouse,
    });

    // Navigate to privacy for GDPR consent
    router.push('/onboarding/searcher/privacy');
  };

  const canContinue = budgetMin && budgetMax;

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-md mx-auto">

        {/* Language Switcher */}
        <div className="absolute top-6 right-6 z-50">
          <LanguageSwitcher />
        </div>

        {/* Progress bar */}
        <div className="mb-6">
          <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-orange-600 w-full transition-all" />
          </div>
        </div>

        {/* Back button */}
        <button
          onClick={() => router.back()}
          className="mb-6 text-orange-600 hover:opacity-70 transition"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>

        {/* Header */}
        <div className="flex items-start gap-3 mb-8">
          <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
            <Settings className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-orange-600 mb-1">
              {t('onboarding.preferences.title')}
            </h1>
            <p className="text-gray-600">
              {t('onboarding.preferences.subtitle')}
            </p>
          </div>
        </div>

        {/* Form */}
        <div className="space-y-6">

          {/* Monthly budget */}
          <div className="p-5 rounded-xl bg-green-50 border border-green-200">
            <label className="block text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-green-600" />
              {t('onboarding.preferences.monthlyBudget')}
            </label>
            <div className="space-y-3">
              <div>
                <label className="text-sm text-gray-600 mb-1 block">{t('onboarding.preferences.minimum')}</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">€</span>
                  <input
                    type="number"
                    value={budgetMin}
                    onChange={(e) => setBudgetMin(e.target.value)}
                    className="w-full pl-8 pr-4 py-3 rounded-xl border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-100 outline-none transition"
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
                    className="w-full pl-8 pr-4 py-3 rounded-xl border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-100 outline-none transition"
                    placeholder="1200"
                    min="0"
                  />
                </div>
              </div>
              {budgetMin && budgetMax && (
                <p className="text-sm text-gray-600 mt-2">
                  {t('onboarding.preferences.budgetRange').replace('{min}', budgetMin).replace('{max}', budgetMax)}
                </p>
              )}
            </div>
          </div>

          {/* Preferred district */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-red-600" />
              {t('onboarding.preferences.preferredDistrict')}
            </label>
            <input
              type="text"
              value={preferredDistrict}
              onChange={(e) => setPreferredDistrict(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-100 outline-none transition"
              placeholder={t('onboarding.preferences.districtPlaceholder')}
            />
            <p className="text-sm text-gray-500 mt-1">
              {t('onboarding.preferences.districtHelp')}
            </p>
          </div>

          {/* Tolerance preferences */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-gray-700">{t('onboarding.preferences.tolerancePreferences')}</h3>

            {/* Open to pets */}
            <div className="flex items-center justify-between p-4 rounded-xl bg-white border border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center">
                  <PawPrint className="w-4 h-4 text-orange-600" />
                </div>
                <span className="font-medium text-gray-700">{t('onboarding.preferences.openToLivingWithPets')}</span>
              </div>
              <button
                onClick={() => setOpenToLivingWithPets(!openToLivingWithPets)}
                className={`relative w-14 h-8 rounded-full transition ${
                  openToLivingWithPets ? 'bg-orange-600' : 'bg-gray-300'
                }`}
              >
                <div
                  className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow transition ${
                    openToLivingWithPets ? 'right-1' : 'left-1'
                  }`}
                />
              </button>
            </div>

            {/* Accept smokers */}
            <div className="flex items-center justify-between p-4 rounded-xl bg-white border border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
                  <Cigarette className="w-4 h-4 text-red-600" />
                </div>
                <span className="font-medium text-gray-700">{t('onboarding.preferences.acceptSmokersInHouse')}</span>
              </div>
              <button
                onClick={() => setAcceptSmokersInHouse(!acceptSmokersInHouse)}
                className={`relative w-14 h-8 rounded-full transition ${
                  acceptSmokersInHouse ? 'bg-orange-600' : 'bg-gray-300'
                }`}
              >
                <div
                  className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow transition ${
                    acceptSmokersInHouse ? 'right-1' : 'left-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Continue button */}
        <button
          onClick={handleContinue}
          disabled={!canContinue}
          className={`w-full mt-12 py-4 rounded-full font-semibold text-lg transition shadow-md ${
            canContinue
              ? 'bg-gradient-to-r from-[#FFA040] to-[#FFB85C] text-white hover:from-orange-600 hover:to-orange-500 hover:shadow-lg'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          {t('onboarding.preferences.continueToPrivacy')}
        </button>
      </div>
    </main>
  );
}
