'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Users, Calendar, UserPlus, Sparkles } from 'lucide-react';
import { safeLocalStorage } from '@/lib/browser';
import { toast } from 'sonner';
import { useLanguage } from '@/lib/i18n/use-language';
import {
  OnboardingLayout,
  OnboardingHeading,
  OnboardingButton,
  OnboardingSelectionCard,
  OnboardingLabel,
  OnboardingGrid,
  OnboardingSlider,
} from '@/components/onboarding';

export default function CoreSocialPersonalityPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t, getSection } = useLanguage();
  const common = getSection('common');
  const [isLoading, setIsLoading] = useState(true);

  // Detect role
  const role = (searchParams.get('role') as 'searcher' | 'resident') || 'searcher';

  const [socialEnergy, setSocialEnergy] = useState(5);
  const [sharedMealsInterest, setSharedMealsInterest] = useState(false);
  const [eventParticipationInterest, setEventParticipationInterest] = useState('');
  const [guestFrequency, setGuestFrequency] = useState('');

  useEffect(() => {
    loadExistingData();
  }, []);

  const loadExistingData = () => {
    try {
      const saved = safeLocalStorage.get('coreSocialPersonality', {}) as any;
      if (saved.socialEnergy !== undefined) setSocialEnergy(saved.socialEnergy);
      if (saved.sharedMealsInterest !== undefined) setSharedMealsInterest(saved.sharedMealsInterest);
      if (saved.eventParticipationInterest) setEventParticipationInterest(saved.eventParticipationInterest);
      if (saved.guestFrequency) setGuestFrequency(saved.guestFrequency);
    } finally {
      setIsLoading(false);
    }
  };

  const handleContinue = () => {
    if (!eventParticipationInterest) {
      toast.error(t('coreOnboarding.socialPersonality.errors.eventRequired'));
      return;
    }
    if (!guestFrequency) {
      toast.error(t('coreOnboarding.socialPersonality.errors.guestRequired'));
      return;
    }

    safeLocalStorage.set('coreSocialPersonality', {
      socialEnergy,
      sharedMealsInterest,
      eventParticipationInterest,
      guestFrequency,
    });

    router.push(`/onboarding/core/values-preferences?role=${role}`);
  };

  const canContinue = eventParticipationInterest && guestFrequency;

  const eventParticipationOptions = [
    { value: 'low', labelKey: 'lowInterest', icon: <Users className="w-5 h-5" />, descKey: 'lowDesc' },
    { value: 'medium', labelKey: 'moderate', icon: <Users className="w-5 h-5" />, descKey: 'moderateDesc' },
    { value: 'high', labelKey: 'highInterest', icon: <Users className="w-5 h-5" />, descKey: 'highDesc' },
  ];

  const guestFrequencyOptions = [
    { value: 'never', labelKey: 'never', descKey: 'neverDesc' },
    { value: 'rarely', labelKey: 'rarely', descKey: 'rarelyDesc' },
    { value: 'sometimes', labelKey: 'sometimes', descKey: 'sometimesDesc' },
    { value: 'often', labelKey: 'often', descKey: 'oftenDesc' },
  ];

  return (
    <OnboardingLayout
      role={role}
      backUrl={`/onboarding/core/daily-life?role=${role}`}
      backLabel={common.back}
      progress={{
        current: 3,
        total: 4,
        label: t('coreOnboarding.socialPersonality.progress'),
        stepName: t('coreOnboarding.socialPersonality.stepName'),
      }}
      isLoading={isLoading}
      loadingText={common.loading}
    >
      <OnboardingHeading
        role={role}
        title={t('coreOnboarding.socialPersonality.title')}
        description={t('coreOnboarding.socialPersonality.description')}
      />

      <div className="space-y-6">
        {/* Social Energy */}
        <div>
          <p className="text-sm text-gray-600 mb-3">
            {t('coreOnboarding.socialPersonality.socialEnergyQuestion')}
          </p>
          <OnboardingSlider
            role={role}
            label={t('coreOnboarding.socialPersonality.socialEnergyLevel')}
            value={socialEnergy}
            onChange={setSocialEnergy}
            min={1}
            max={10}
            minLabel={t('coreOnboarding.socialPersonality.introvert')}
            maxLabel={t('coreOnboarding.socialPersonality.extrovert')}
          />
          <p className="text-xs text-gray-500 mt-2">
            {socialEnergy <= 3 && t('coreOnboarding.socialPersonality.energyDescLow')}
            {socialEnergy > 3 && socialEnergy <= 7 && t('coreOnboarding.socialPersonality.energyDescMid')}
            {socialEnergy > 7 && t('coreOnboarding.socialPersonality.energyDescHigh')}
          </p>
        </div>

        {/* Shared Meals Interest */}
        <div>
          <OnboardingLabel required>{t('coreOnboarding.socialPersonality.sharedMeals')}</OnboardingLabel>
          <p className="text-sm text-gray-600 mb-3">
            {t('coreOnboarding.socialPersonality.sharedMealsQuestion')}
          </p>
          <OnboardingGrid columns={2}>
            <OnboardingSelectionCard
              role={role}
              selected={!sharedMealsInterest}
              onClick={() => setSharedMealsInterest(false)}
            >
              <div className="text-center">
                <div className="font-medium">{t('coreOnboarding.socialPersonality.sharedMealsOptions.notInterested')}</div>
                <div className="text-xs text-gray-500 mt-1">{t('coreOnboarding.socialPersonality.sharedMealsOptions.notInterestedDesc')}</div>
              </div>
            </OnboardingSelectionCard>
            <OnboardingSelectionCard
              role={role}
              selected={sharedMealsInterest}
              onClick={() => setSharedMealsInterest(true)}
            >
              <div className="text-center">
                <div className="font-medium">{t('coreOnboarding.socialPersonality.sharedMealsOptions.interested')}</div>
                <div className="text-xs text-gray-500 mt-1">{t('coreOnboarding.socialPersonality.sharedMealsOptions.interestedDesc')}</div>
              </div>
            </OnboardingSelectionCard>
          </OnboardingGrid>
        </div>

        {/* Event Participation Interest */}
        <div>
          <OnboardingLabel required>{t('coreOnboarding.socialPersonality.communityEvents')}</OnboardingLabel>
          <p className="text-sm text-gray-600 mb-3">
            {t('coreOnboarding.socialPersonality.communityEventsQuestion')}
          </p>
          <OnboardingGrid columns={3}>
            {eventParticipationOptions.map((option) => (
              <OnboardingSelectionCard
                key={option.value}
                role={role}
                selected={eventParticipationInterest === option.value}
                onClick={() => setEventParticipationInterest(option.value)}
              >
                <div className="text-center">
                  <div className="flex justify-center mb-2 text-gray-600">{option.icon}</div>
                  <div className="font-medium text-sm">{t(`coreOnboarding.socialPersonality.eventOptions.${option.labelKey}`)}</div>
                  <div className="text-xs text-gray-500 mt-1">{t(`coreOnboarding.socialPersonality.eventOptions.${option.descKey}`)}</div>
                </div>
              </OnboardingSelectionCard>
            ))}
          </OnboardingGrid>
        </div>

        {/* Guest Frequency */}
        <div>
          <OnboardingLabel required>{t('coreOnboarding.socialPersonality.guestFrequency')}</OnboardingLabel>
          <p className="text-sm text-gray-600 mb-3">
            {t('coreOnboarding.socialPersonality.guestFrequencyQuestion')}
          </p>
          <OnboardingGrid columns={2}>
            {guestFrequencyOptions.map((option) => (
              <OnboardingSelectionCard
                key={option.value}
                role={role}
                selected={guestFrequency === option.value}
                onClick={() => setGuestFrequency(option.value)}
              >
                <div className="text-center">
                  <div className="font-medium">{t(`coreOnboarding.socialPersonality.guestOptions.${option.labelKey}`)}</div>
                  <div className="text-xs text-gray-500 mt-1">{t(`coreOnboarding.socialPersonality.guestOptions.${option.descKey}`)}</div>
                </div>
              </OnboardingSelectionCard>
            ))}
          </OnboardingGrid>
        </div>
      </div>

      {/* Continue Button */}
      <div className="mt-8">
        <OnboardingButton
          role={role}
          onClick={handleContinue}
          disabled={!canContinue}
        >
          {common.continue}
        </OnboardingButton>
      </div>
    </OnboardingLayout>
  );
}
