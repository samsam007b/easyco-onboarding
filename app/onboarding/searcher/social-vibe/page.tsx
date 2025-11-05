'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Smile, Share2, MessageCircle, Globe } from 'lucide-react';
import { safeLocalStorage } from '@/lib/browser';
import { useLanguage } from '@/lib/i18n/use-language';
import LanguageSwitcher from '@/components/LanguageSwitcher';

export default function SocialVibePage() {
  const { t } = useLanguage();
  const router = useRouter();
  const [socialEnergy, setSocialEnergy] = useState('');
  const [opennessToSharing, setOpennessToSharing] = useState('');
  const [communicationStyle, setCommunicationStyle] = useState('');
  const [culturalOpenness, setCulturalOpenness] = useState('');

  const handleContinue = () => {
    // Save to localStorage
    safeLocalStorage.set('socialVibe', {
      socialEnergy,
      opennessToSharing,
      communicationStyle,
      culturalOpenness,
    });

    // Navigate to next step
    router.push('/onboarding/searcher/ideal-coliving');
  };

  const canContinue = socialEnergy && opennessToSharing && communicationStyle && culturalOpenness;

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
            <div className="h-full bg-orange-600 w-4/6 transition-all" />
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
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-orange-600 mb-2">
            {t('onboarding.socialVibe.title')}
          </h1>
          <p className="text-gray-600">
            {t('onboarding.socialVibe.subtitle')}
          </p>
        </div>

        {/* Form */}
        <div className="space-y-6">

          {/* Social energy */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center">
                <Smile className="w-4 h-4 text-orange-600" />
              </div>
              {t('onboarding.socialVibe.socialEnergy')}
            </label>
            <select
              value={socialEnergy}
              onChange={(e) => setSocialEnergy(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white focus:border-orange-500 focus:ring-2 focus:ring-orange-100 outline-none transition"
            >
              <option value="">{t('onboarding.dailyHabits.select')}</option>
              <option value="introvert">{t('onboarding.socialVibe.introvert')}</option>
              <option value="moderate">{t('onboarding.socialVibe.moderate')}</option>
              <option value="extrovert">{t('onboarding.socialVibe.extrovert')}</option>
            </select>
            <p className="text-sm text-gray-500 mt-1">{t('onboarding.socialVibe.socialEnergyHelp')}</p>
          </div>

          {/* Openness to sharing */}
          <div className="p-4 rounded-xl bg-yellow-50 border border-yellow-200">
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center">
                <Share2 className="w-4 h-4 text-yellow-600" />
              </div>
              {t('onboarding.socialVibe.opennessToSharing')}
            </label>
            <select
              value={opennessToSharing}
              onChange={(e) => setOpennessToSharing(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white focus:border-orange-500 focus:ring-2 focus:ring-orange-100 outline-none transition"
            >
              <option value="">{t('onboarding.dailyHabits.select')}</option>
              <option value="private">{t('onboarding.socialVibe.private')}</option>
              <option value="moderate">{t('onboarding.socialVibe.moderate')}</option>
              <option value="very-open">{t('onboarding.socialVibe.veryOpen')}</option>
            </select>
            <p className="text-sm text-gray-500 mt-2">{t('onboarding.socialVibe.opennessHelp')}</p>
          </div>

          {/* Communication style */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                <MessageCircle className="w-4 h-4 text-blue-600" />
              </div>
              {t('onboarding.socialVibe.communicationStyle')}
            </label>
            <select
              value={communicationStyle}
              onChange={(e) => setCommunicationStyle(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white focus:border-orange-500 focus:ring-2 focus:ring-orange-100 outline-none transition"
            >
              <option value="">{t('onboarding.dailyHabits.select')}</option>
              <option value="direct">{t('onboarding.socialVibe.directStraightforward')}</option>
              <option value="diplomatic">{t('onboarding.socialVibe.diplomaticTactful')}</option>
              <option value="casual">{t('onboarding.socialVibe.casualFriendly')}</option>
              <option value="formal">{t('onboarding.socialVibe.formalProfessional')}</option>
            </select>
          </div>

          {/* Cultural openness */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                <Globe className="w-4 h-4 text-blue-600" />
              </div>
              {t('onboarding.socialVibe.culturalOpenness')}
            </label>
            <select
              value={culturalOpenness}
              onChange={(e) => setCulturalOpenness(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white focus:border-orange-500 focus:ring-2 focus:ring-orange-100 outline-none transition"
            >
              <option value="">{t('onboarding.dailyHabits.select')}</option>
              <option value="prefer-similar">{t('onboarding.socialVibe.preferSimilar')}</option>
              <option value="moderate">{t('onboarding.socialVibe.moderate')}</option>
              <option value="love-diversity">{t('onboarding.socialVibe.loveDiversity')}</option>
            </select>
            <p className="text-sm text-gray-500 mt-1">{t('onboarding.socialVibe.culturalOpennessHelp')}</p>
          </div>
        </div>

        {/* Continue button */}
        <button
          onClick={handleContinue}
          disabled={!canContinue}
          className={`w-full mt-12 py-4 rounded-full font-semibold text-lg transition shadow-md ${
            canContinue
              ? 'bg-gradient-to-r from-[#FFA040] to-[#FFB85C] text-white hover:from-[#FF8C30] hover:to-[#FFA548] hover:shadow-lg'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          {t('common.continue')}
        </button>
      </div>
    </main>
  );
}
