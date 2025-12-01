'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Sparkles, Users, Music, PawPrint, ChefHat } from 'lucide-react';
import { safeLocalStorage } from '@/lib/browser';
import { Slider } from '@/components/ui/slider';
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

export default function HomeLifestylePage() {
  const { t } = useLanguage();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [cleanliness, setCleanliness] = useState(5);
  const [guestFrequency, setGuestFrequency] = useState('');
  const [musicHabits, setMusicHabits] = useState('');
  const [hasPets, setHasPets] = useState(false);
  const [petType, setPetType] = useState('');
  const [cookingFrequency, setCookingFrequency] = useState('');

  useEffect(() => {
    loadExistingData();
  }, []);

  const loadExistingData = () => {
    try {
      const saved = safeLocalStorage.get('homeLifestyle', {}) as any;
      if (saved.cleanliness) setCleanliness(saved.cleanliness);
      if (saved.guestFrequency) setGuestFrequency(saved.guestFrequency);
      if (saved.musicHabits) setMusicHabits(saved.musicHabits);
      if (saved.hasPets !== undefined) setHasPets(saved.hasPets);
      if (saved.petType) setPetType(saved.petType);
      if (saved.cookingFrequency) setCookingFrequency(saved.cookingFrequency);
    } finally {
      setIsLoading(false);
    }
  };

  const handleContinue = () => {
    safeLocalStorage.set('homeLifestyle', {
      cleanliness,
      guestFrequency,
      musicHabits,
      hasPets,
      petType: hasPets ? petType : null,
      cookingFrequency,
    });
    router.push('/onboarding/searcher/social-vibe');
  };

  const canContinue = guestFrequency && musicHabits && cookingFrequency && (!hasPets || petType);

  const guestOptions = [
    { value: 'never', label: t('onboarding.homeLifestyle.never') },
    { value: 'rarely', label: t('onboarding.dailyHabits.rarely') },
    { value: 'sometimes', label: t('onboarding.homeLifestyle.sometimes') },
    { value: 'often', label: t('onboarding.homeLifestyle.often') },
  ];

  const musicOptions = [
    { value: 'quiet', label: t('onboarding.homeLifestyle.quietEnvironment') },
    { value: 'low-volume', label: t('onboarding.homeLifestyle.lowVolume') },
    { value: 'moderate', label: t('onboarding.homeLifestyle.moderateVolume') },
    { value: 'loud', label: t('onboarding.homeLifestyle.loudSometimes') },
  ];

  const cookingOptions = [
    { value: 'never', label: t('onboarding.homeLifestyle.neverRarely') },
    { value: 'once-week', label: t('onboarding.dailyHabits.onceWeek') },
    { value: 'few-times', label: t('onboarding.homeLifestyle.fewTimesAWeek') },
    { value: 'daily', label: t('onboarding.dailyHabits.daily') },
  ];

  return (
    <OnboardingLayout
      role="searcher"
      backUrl="/onboarding/searcher/daily-habits"
      backLabel={t('common.back')}
      progress={{
        current: 3,
        total: 6,
        label: 'Étape 3 sur 6',
        stepName: t('onboarding.homeLifestyle.title'),
      }}
      isLoading={isLoading}
      loadingText={t('common.loading')}
    >
      <OnboardingHeading
        role="searcher"
        title={t('onboarding.homeLifestyle.title')}
        description={t('onboarding.homeLifestyle.subtitle')}
      />

      <div className="space-y-6">
        {/* Cleanliness preference */}
        <div className="p-4 rounded-xl bg-orange-50 border border-orange-200">
          <OnboardingLabel>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-orange-600" />
              </div>
              {t('onboarding.homeLifestyle.cleanliness')}
            </div>
          </OnboardingLabel>
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
          <OnboardingLabel required>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                <Users className="w-4 h-4 text-blue-600" />
              </div>
              {t('onboarding.homeLifestyle.guestFrequency')}
            </div>
          </OnboardingLabel>
          <OnboardingGrid columns={2}>
            {guestOptions.map((option) => (
              <OnboardingSelectionCard
                key={option.value}
                role="searcher"
                selected={guestFrequency === option.value}
                onClick={() => setGuestFrequency(option.value)}
              >
                <div className="text-center font-medium text-sm">{option.label}</div>
              </OnboardingSelectionCard>
            ))}
          </OnboardingGrid>
        </div>

        {/* Music habits */}
        <div>
          <OnboardingLabel required>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-pink-100 flex items-center justify-center">
                <Music className="w-4 h-4 text-pink-600" />
              </div>
              {t('onboarding.homeLifestyle.musicHabits')}
            </div>
          </OnboardingLabel>
          <OnboardingGrid columns={2}>
            {musicOptions.map((option) => (
              <OnboardingSelectionCard
                key={option.value}
                role="searcher"
                selected={musicHabits === option.value}
                onClick={() => setMusicHabits(option.value)}
              >
                <div className="text-center font-medium text-sm">{option.label}</div>
              </OnboardingSelectionCard>
            ))}
          </OnboardingGrid>
        </div>

        {/* Pets toggle */}
        <div className="space-y-3">
          <OnboardingLabel>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center">
                <PawPrint className="w-4 h-4 text-orange-600" />
              </div>
              {t('onboarding.homeLifestyle.iHavePets')}
            </div>
          </OnboardingLabel>
          <OnboardingGrid columns={2}>
            <OnboardingSelectionCard
              role="searcher"
              selected={!hasPets}
              onClick={() => setHasPets(false)}
            >
              <div className="text-center font-medium text-sm">Non</div>
            </OnboardingSelectionCard>
            <OnboardingSelectionCard
              role="searcher"
              selected={hasPets}
              onClick={() => setHasPets(true)}
            >
              <div className="text-center font-medium text-sm">Oui</div>
            </OnboardingSelectionCard>
          </OnboardingGrid>

          {hasPets && (
            <OnboardingInput
              role="searcher"
              label=""
              value={petType}
              onChange={(e) => setPetType(e.target.value)}
              placeholder={t('onboarding.homeLifestyle.petTypePlaceholder')}
            />
          )}
        </div>

        {/* Cooking frequency */}
        <div>
          <OnboardingLabel required>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center">
                <ChefHat className="w-4 h-4 text-yellow-600" />
              </div>
              {t('onboarding.homeLifestyle.cookingFrequency')}
            </div>
          </OnboardingLabel>
          <OnboardingGrid columns={2}>
            {cookingOptions.map((option) => (
              <OnboardingSelectionCard
                key={option.value}
                role="searcher"
                selected={cookingFrequency === option.value}
                onClick={() => setCookingFrequency(option.value)}
              >
                <div className="text-center font-medium text-sm">{option.label}</div>
              </OnboardingSelectionCard>
            ))}
          </OnboardingGrid>
        </div>
      </div>

      <div className="mt-8">
        <OnboardingButton
          role="searcher"
          onClick={handleContinue}
          disabled={!canContinue}
        >
          {t('common.continue')}
        </OnboardingButton>
      </div>
    </OnboardingLayout>
  );
}
