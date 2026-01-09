'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Music, ChefHat, Apple, MessageCircle, Lightbulb } from 'lucide-react';
import { safeLocalStorage } from '@/lib/browser';
import { createClient } from '@/lib/auth/supabase-client';
import { getOnboardingData } from '@/lib/onboarding-helpers';
import { useLanguage } from '@/lib/i18n/use-language';
import {
  EnhanceProfileLayout,
  EnhanceProfileHeading,
  EnhanceProfileButton,
  EnhanceProfileSelectionCard,
  EnhanceProfileSection,
  EnhanceProfileInfoBox,
} from '@/components/enhance-profile';

export default function OnboardingLifestyleDetailsPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const [isLoading, setIsLoading] = useState(true);
  const [musicHabits, setMusicHabits] = useState('');
  const [cookingFrequency, setCookingFrequency] = useState('');
  const [dietType, setDietType] = useState('');
  const [communicationStyle, setCommunicationStyle] = useState('');

  useEffect(() => {
    const loadData = async () => {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
          router.push('/login');
          return;
        }

        // Load from localStorage first
        const savedData = safeLocalStorage.get('lifestyleDetails', {}) as any;
        if (savedData.musicHabits) setMusicHabits(savedData.musicHabits);
        if (savedData.cookingFrequency) setCookingFrequency(savedData.cookingFrequency);
        if (savedData.dietType) setDietType(savedData.dietType);
        if (savedData.communicationStyle) setCommunicationStyle(savedData.communicationStyle);

        // If nothing in localStorage, load from database
        if (!savedData.musicHabits) {
          const { data: profileData } = await getOnboardingData(user.id);
          if (profileData) {
            setMusicHabits(profileData.musicHabits || '');
            setCookingFrequency(profileData.cookingFrequency || '');
            setDietType(profileData.dietType || '');
            setCommunicationStyle(profileData.communicationStyle || '');
          }
        }
      } catch (error) {
        // FIXME: Use logger.error('Error loading data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [router]);

  const handleSave = () => {
    safeLocalStorage.set('lifestyleDetails', {
      musicHabits,
      cookingFrequency,
      dietType,
      communicationStyle,
    });
    router.push('/onboarding/searcher/enhance');
  };

  const handleSkip = () => {
    router.push('/onboarding/searcher/enhance');
  };

  const musicOptions = [
    { value: 'none', labelKey: 'silence', descKey: 'silenceDesc' },
    { value: 'headphones_only', labelKey: 'headphonesOnly', descKey: 'headphonesOnlyDesc' },
    { value: 'headphones_mostly', labelKey: 'headphonesMostly', descKey: 'headphonesMostlyDesc' },
    { value: 'quiet_background', labelKey: 'quietBackground', descKey: 'quietBackgroundDesc' },
    { value: 'social_listening', labelKey: 'socialListening', descKey: 'socialListeningDesc' },
  ];

  const cookingOptions = [
    { value: 'never', labelKey: 'never', descKey: 'neverDesc' },
    { value: 'rarely', labelKey: 'rarely', descKey: 'rarelyDesc' },
    { value: 'sometimes', labelKey: 'sometimes', descKey: 'sometimesDesc' },
    { value: 'often', labelKey: 'often', descKey: 'oftenDesc' },
    { value: 'daily', labelKey: 'daily', descKey: 'dailyDesc' },
  ];

  const dietOptions = [
    { value: 'omnivore', labelKey: 'omnivore', descKey: 'omnivoreDesc' },
    { value: 'vegetarian', labelKey: 'vegetarian', descKey: 'vegetarianDesc' },
    { value: 'vegan', labelKey: 'vegan', descKey: 'veganDesc' },
    { value: 'pescatarian', labelKey: 'pescatarian', descKey: 'pescatarianDesc' },
    { value: 'flexitarian', labelKey: 'flexitarian', descKey: 'flexitarianDesc' },
  ];

  const communicationOptions = [
    { value: 'direct', labelKey: 'direct', descKey: 'directDesc' },
    { value: 'diplomatic', labelKey: 'diplomatic', descKey: 'diplomaticDesc' },
    { value: 'casual', labelKey: 'casual', descKey: 'casualDesc' },
    { value: 'formal', labelKey: 'formal', descKey: 'formalDesc' },
  ];

  return (
    <EnhanceProfileLayout
      role="searcher"
      backUrl="/onboarding/searcher/enhance"
      backLabel={t('enhanceSearcher.common.backToMenu')}
      progress={undefined}
      isLoading={isLoading}
      loadingText={t('enhanceSearcher.common.loading')}
    >
      <EnhanceProfileHeading
        role="searcher"
        title={t('enhanceSearcher.lifestyleDetails.title')}
        description={t('enhanceSearcher.lifestyleDetails.description')}
        icon={<Music className="w-8 h-8 text-orange-600" />}
      />

      <div className="space-y-6">
        {/* Music Habits */}
        <EnhanceProfileSection>
          <div className="flex items-center gap-2 mb-3">
            <Music className="w-5 h-5 text-orange-600" />
            <h2 className="text-lg font-semibold text-gray-800">{t('enhanceSearcher.lifestyleDetails.music.title')}</h2>
          </div>
          <p className="text-sm text-gray-600 mb-4">{t('enhanceSearcher.lifestyleDetails.music.subtitle')}</p>
          <div className="space-y-2">
            {musicOptions.map((option) => (
              <EnhanceProfileSelectionCard
                key={option.value}
                role="searcher"
                selected={musicHabits === option.value}
                onClick={() => setMusicHabits(option.value)}
              >
                <div className="flex flex-col">
                  <span className="font-medium">{t(`enhanceSearcher.lifestyleDetails.music.${option.labelKey}`)}</span>
                  <span className="text-xs text-gray-500 mt-1">{t(`enhanceSearcher.lifestyleDetails.music.${option.descKey}`)}</span>
                </div>
              </EnhanceProfileSelectionCard>
            ))}
          </div>
        </EnhanceProfileSection>

        {/* Cooking Frequency */}
        <EnhanceProfileSection>
          <div className="flex items-center gap-2 mb-3">
            <ChefHat className="w-5 h-5 text-orange-600" />
            <h2 className="text-lg font-semibold text-gray-800">{t('enhanceSearcher.lifestyleDetails.cooking.title')}</h2>
          </div>
          <p className="text-sm text-gray-600 mb-4">{t('enhanceSearcher.lifestyleDetails.cooking.subtitle')}</p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {cookingOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setCookingFrequency(option.value)}
                className={`p-4 superellipse-xl border-2 transition-all text-center ${
                  cookingFrequency === option.value
                    ? 'border-orange-500 bg-orange-50'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <div className="font-medium text-sm">{t(`enhanceSearcher.lifestyleDetails.cooking.${option.labelKey}`)}</div>
                <div className="text-xs text-gray-500 mt-1">{t(`enhanceSearcher.lifestyleDetails.cooking.${option.descKey}`)}</div>
              </button>
            ))}
          </div>
        </EnhanceProfileSection>

        {/* Diet Type */}
        <EnhanceProfileSection>
          <div className="flex items-center gap-2 mb-3">
            <Apple className="w-5 h-5 text-orange-600" />
            <h2 className="text-lg font-semibold text-gray-800">{t('enhanceSearcher.lifestyleDetails.diet.title')}</h2>
          </div>
          <p className="text-sm text-gray-600 mb-4">{t('enhanceSearcher.lifestyleDetails.diet.subtitle')}</p>
          <div className="space-y-2">
            {dietOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setDietType(option.value)}
                className={`w-full p-4 superellipse-xl border-2 transition-all text-left ${
                  dietType === option.value
                    ? 'border-orange-500 bg-orange-50'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <div className="font-medium">{t(`enhanceSearcher.lifestyleDetails.diet.${option.labelKey}`)}</div>
                <div className="text-xs text-gray-500 mt-1">{t(`enhanceSearcher.lifestyleDetails.diet.${option.descKey}`)}</div>
              </button>
            ))}
          </div>
        </EnhanceProfileSection>

        {/* Communication Style */}
        <EnhanceProfileSection>
          <div className="flex items-center gap-2 mb-3">
            <MessageCircle className="w-5 h-5 text-orange-600" />
            <h2 className="text-lg font-semibold text-gray-800">{t('enhanceSearcher.lifestyleDetails.communication.title')}</h2>
          </div>
          <p className="text-sm text-gray-600 mb-4">{t('enhanceSearcher.lifestyleDetails.communication.subtitle')}</p>
          <div className="space-y-2">
            {communicationOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setCommunicationStyle(option.value)}
                className={`w-full p-4 superellipse-xl border-2 transition-all text-left ${
                  communicationStyle === option.value
                    ? 'border-orange-500 bg-orange-50'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <div className="font-medium">{t(`enhanceSearcher.lifestyleDetails.communication.${option.labelKey}`)}</div>
                <div className="text-xs text-gray-500 mt-1">{t(`enhanceSearcher.lifestyleDetails.communication.${option.descKey}`)}</div>
              </button>
            ))}
          </div>
        </EnhanceProfileSection>

        {/* Info box */}
        <EnhanceProfileInfoBox role="searcher">
          <p className="text-sm text-gray-600 flex items-start gap-2">
            <Lightbulb className="w-4 h-4 flex-shrink-0 mt-0.5 text-orange-500" />
            <span>{t('enhanceSearcher.lifestyleDetails.infoBox')}</span>
          </p>
        </EnhanceProfileInfoBox>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3 mt-8">
        <button
          onClick={handleSave}
          className="w-full py-4 superellipse-xl font-semibold transition-all duration-300 bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg hover:shadow-xl hover:-translate-y-0.5"
        >
          {t('enhanceSearcher.common.saveAndContinue')}
        </button>
        <button
          onClick={handleSkip}
          className="w-full text-center text-sm text-transparent hover:text-gray-600 transition-colors duration-200 py-2"
        >
          {t('enhanceSearcher.common.skipForNow')}
        </button>
      </div>
    </EnhanceProfileLayout>
  );
}
