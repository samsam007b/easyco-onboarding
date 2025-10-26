'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Home, Users } from 'lucide-react';
import { safeLocalStorage } from '@/lib/browser';
import { useLanguage } from '@/lib/i18n/use-language';
import LanguageSwitcher from '@/components/LanguageSwitcher';

export default function IdealColivingPage() {
  const { t } = useLanguage();
  const router = useRouter();
  const [colivingSize, setColivingSize] = useState('');
  const [genderMix, setGenderMix] = useState('');
  const [minAge, setMinAge] = useState(18);
  const [maxAge, setMaxAge] = useState(35);
  const [sharedSpaceImportance, setSharedSpaceImportance] = useState(5);

  const handleContinue = () => {
    // Save to localStorage
    safeLocalStorage.set('idealColiving', {
      colivingSize,
      genderMix,
      minAge,
      maxAge,
      sharedSpaceImportance,
    });

    // Navigate to next step
    router.push('/onboarding/searcher/preferences');
  };

  const canContinue = colivingSize && genderMix;

  const colivingSizes = [
    { value: 'small', label: t('onboarding.idealColiving.twoPeople'), emoji: '👥', description: t('onboarding.idealColiving.intimateQuiet') },
    { value: 'medium', label: t('onboarding.idealColiving.fourPeople'), emoji: '👨‍👩‍👧‍👦', description: t('onboarding.idealColiving.perfectBalance') },
    { value: 'large', label: t('onboarding.idealColiving.sevenPeople'), emoji: '👥', description: t('onboarding.idealColiving.vibrantCommunity') },
    { value: 'xlarge', label: t('onboarding.idealColiving.tenPlusPeople'), emoji: '🏢', description: t('onboarding.idealColiving.largeCommunity') },
  ];

  const genderMixOptions = [
    { value: 'male-only', label: t('onboarding.idealColiving.maleOnly') },
    { value: 'female-only', label: t('onboarding.idealColiving.femaleOnly') },
    { value: 'mixed', label: t('onboarding.idealColiving.mixed') },
    { value: 'no-preference', label: t('onboarding.idealColiving.noPreference') },
  ];

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
            <div className="h-full bg-[color:var(--easy-purple)] w-5/6 transition-all" />
          </div>
        </div>

        {/* Back button */}
        <button
          onClick={() => router.back()}
          className="mb-6 text-[color:var(--easy-purple)] hover:opacity-70 transition"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-[color:var(--easy-purple)] mb-2">
            {t('onboarding.idealColiving.title')}
          </h1>
          <p className="text-gray-600">
            {t('onboarding.idealColiving.subtitle')}
          </p>
        </div>

        {/* Form */}
        <div className="space-y-8">

          {/* Preferred coliving size */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                <Home className="w-4 h-4 text-purple-600" />
              </div>
              {t('onboarding.idealColiving.preferredColivingSize')}
            </label>
            <div className="grid grid-cols-2 gap-3">
              {colivingSizes.map((size) => (
                <button
                  key={size.value}
                  onClick={() => setColivingSize(size.value)}
                  className={`p-4 rounded-xl border-2 transition-all text-center ${
                    colivingSize === size.value
                      ? 'border-[color:var(--easy-purple)] bg-purple-50'
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`}
                >
                  <div className="text-2xl mb-2">{size.emoji}</div>
                  <div className={`font-semibold text-sm mb-1 ${
                    colivingSize === size.value ? 'text-[color:var(--easy-purple)]' : 'text-gray-900'
                  }`}>
                    {size.label}
                  </div>
                  <div className="text-xs text-gray-500">{size.description}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Gender mix preference */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                <Users className="w-4 h-4 text-blue-600" />
              </div>
              {t('onboarding.idealColiving.genderMixPreference')}
            </label>
            <select
              value={genderMix}
              onChange={(e) => setGenderMix(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white focus:border-[color:var(--easy-purple)] focus:ring-2 focus:ring-purple-100 outline-none transition"
            >
              <option value="">{t('onboarding.dailyHabits.select')}</option>
              {genderMixOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Roommate age range */}
          <div className="p-5 rounded-xl bg-yellow-50 border border-yellow-200">
            <label className="block text-sm font-medium text-gray-700 mb-4">
              🗓️ {t('onboarding.idealColiving.roommateAgeRange')}
            </label>

            {/* Min age */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">{t('onboarding.idealColiving.minAge')}</span>
                <span className="text-lg font-bold text-[color:var(--easy-purple)]">{minAge}</span>
              </div>
              <input
                type="range"
                min="18"
                max="65"
                value={minAge}
                onChange={(e) => setMinAge(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[color:var(--easy-purple)]"
              />
            </div>

            {/* Max age */}
            <div className="mb-2">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">{t('onboarding.idealColiving.maxAge')}</span>
                <span className="text-lg font-bold text-[color:var(--easy-purple)]">{maxAge}</span>
              </div>
              <input
                type="range"
                min="18"
                max="65"
                value={maxAge}
                onChange={(e) => setMaxAge(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[color:var(--easy-purple)]"
              />
            </div>

            <p className="text-sm text-gray-600 mt-3">
              {t('onboarding.idealColiving.lookingForRoommates')} {minAge}-{maxAge}
            </p>
          </div>

          {/* Shared space importance */}
          <div className="p-5 rounded-xl bg-blue-50 border border-blue-200">
            <label className="block text-sm font-medium text-gray-700 mb-4">
              💡 {t('onboarding.idealColiving.sharedSpaceImportance')}
            </label>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">{t('onboarding.idealColiving.needPrivacy')}</span>
              <span className="text-lg font-bold text-[color:var(--easy-purple)]">{sharedSpaceImportance}/10</span>
              <span className="text-sm text-gray-600">{t('onboarding.idealColiving.loveCommunal')}</span>
            </div>
            <input
              type="range"
              min="1"
              max="10"
              value={sharedSpaceImportance}
              onChange={(e) => setSharedSpaceImportance(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[color:var(--easy-purple)]"
            />
            <p className="text-sm text-gray-500 mt-3">
              {t('onboarding.idealColiving.sharedSpaceHelp')}
            </p>
          </div>

        </div>

        {/* Continue button */}
        <button
          onClick={handleContinue}
          disabled={!canContinue}
          className={`w-full mt-12 py-4 rounded-full font-semibold text-lg transition shadow-md ${
            canContinue
              ? 'bg-[color:var(--easy-yellow)] text-black hover:opacity-90 hover:shadow-lg'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          {t('common.continue')}
        </button>
      </div>
    </main>
  );
}
