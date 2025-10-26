'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Sparkles, Users, Music, PawPrint, ChefHat } from 'lucide-react';
import { safeLocalStorage } from '@/lib/browser';
import { Slider } from '@/components/ui/slider';
import { useLanguage } from '@/lib/i18n/use-language';
import LanguageSwitcher from '@/components/LanguageSwitcher';

export default function HomeLifestylePage() {
  const { t } = useLanguage();
  const router = useRouter();
  const [cleanliness, setCleanliness] = useState(5); // Changed to number for slider
  const [guestFrequency, setGuestFrequency] = useState('');
  const [musicHabits, setMusicHabits] = useState('');
  const [hasPets, setHasPets] = useState(false);
  const [petType, setPetType] = useState('');
  const [cookingFrequency, setCookingFrequency] = useState('');

  const handleContinue = () => {
    // Save to localStorage
    safeLocalStorage.set('homeLifestyle', {
      cleanliness,
      guestFrequency,
      musicHabits,
      hasPets,
      petType: hasPets ? petType : null,
      cookingFrequency,
    });

    // Navigate to next step
    router.push('/onboarding/searcher/social-vibe');
  };

  const canContinue = guestFrequency && musicHabits && cookingFrequency && (!hasPets || petType);

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
            <div className="h-full bg-[color:var(--easy-purple)] w-3/6 transition-all" />
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
            {t('onboarding.homeLifestyle.title')}
          </h1>
          <p className="text-gray-600">
            {t('onboarding.homeLifestyle.subtitle')}
          </p>
        </div>

        {/* Form */}
        <div className="space-y-6">

          {/* Cleanliness preference */}
          <div className="p-4 rounded-xl bg-purple-50 border border-purple-200">
            <label className="block text-sm font-medium text-gray-700 mb-4 flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-purple-600" />
              </div>
              {t('onboarding.homeLifestyle.cleanliness')}
            </label>
            <Slider
              value={cleanliness}
              onChange={setCleanliness}
              min={1}
              max={10}
              leftLabel={t('onboarding.homeLifestyle.relaxed')}
              rightLabel={t('onboarding.homeLifestyle.spotless')}
              showValue={true}
            />
          </div>

          {/* Guest frequency */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                <Users className="w-4 h-4 text-blue-600" />
              </div>
              {t('onboarding.homeLifestyle.guestFrequency')}
            </label>
            <select
              value={guestFrequency}
              onChange={(e) => setGuestFrequency(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white focus:border-[color:var(--easy-purple)] focus:ring-2 focus:ring-purple-100 outline-none transition"
            >
              <option value="">{t('onboarding.dailyHabits.select')}</option>
              <option value="never">{t('onboarding.homeLifestyle.never')}</option>
              <option value="rarely">{t('onboarding.dailyHabits.rarely')}</option>
              <option value="sometimes">{t('onboarding.homeLifestyle.sometimes')}</option>
              <option value="often">{t('onboarding.homeLifestyle.often')}</option>
            </select>
          </div>

          {/* Music habits */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-pink-100 flex items-center justify-center">
                <Music className="w-4 h-4 text-pink-600" />
              </div>
              {t('onboarding.homeLifestyle.musicHabits')}
            </label>
            <select
              value={musicHabits}
              onChange={(e) => setMusicHabits(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white focus:border-[color:var(--easy-purple)] focus:ring-2 focus:ring-purple-100 outline-none transition"
            >
              <option value="">{t('onboarding.dailyHabits.select')}</option>
              <option value="quiet">{t('onboarding.homeLifestyle.quietEnvironment')}</option>
              <option value="low-volume">{t('onboarding.homeLifestyle.lowVolume')}</option>
              <option value="moderate">{t('onboarding.homeLifestyle.moderateVolume')}</option>
              <option value="loud">{t('onboarding.homeLifestyle.loudSometimes')}</option>
            </select>
          </div>

          {/* Pets toggle */}
          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 rounded-xl bg-white border border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center">
                  <PawPrint className="w-4 h-4 text-orange-600" />
                </div>
                <span className="font-medium text-gray-700">{t('onboarding.homeLifestyle.iHavePets')}</span>
              </div>
              <button
                onClick={() => setHasPets(!hasPets)}
                className={`relative w-14 h-8 rounded-full transition ${
                  hasPets ? 'bg-[color:var(--easy-purple)]' : 'bg-gray-300'
                }`}
              >
                <div
                  className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow transition ${
                    hasPets ? 'right-1' : 'left-1'
                  }`}
                />
              </button>
            </div>

            {hasPets && (
              <input
                type="text"
                value={petType}
                onChange={(e) => setPetType(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-[color:var(--easy-purple)] focus:ring-2 focus:ring-purple-100 outline-none transition"
                placeholder={t('onboarding.homeLifestyle.petTypePlaceholder')}
              />
            )}
          </div>

          {/* Cooking frequency */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center">
                <ChefHat className="w-4 h-4 text-yellow-600" />
              </div>
              {t('onboarding.homeLifestyle.cookingFrequency')}
            </label>
            <select
              value={cookingFrequency}
              onChange={(e) => setCookingFrequency(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white focus:border-[color:var(--easy-purple)] focus:ring-2 focus:ring-purple-100 outline-none transition"
            >
              <option value="">{t('onboarding.dailyHabits.select')}</option>
              <option value="never">{t('onboarding.homeLifestyle.neverRarely')}</option>
              <option value="once-week">{t('onboarding.dailyHabits.onceWeek')}</option>
              <option value="few-times">{t('onboarding.homeLifestyle.fewTimesAWeek')}</option>
              <option value="daily">{t('onboarding.dailyHabits.daily')}</option>
            </select>
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
