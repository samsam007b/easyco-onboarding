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
      toast.error('Event participation interest is required');
      return;
    }
    if (!guestFrequency) {
      toast.error('Guest frequency is required');
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
    { value: 'low', label: 'Low Interest', icon: <Users className="w-5 h-5" />, desc: 'I prefer staying in' },
    { value: 'medium', label: 'Moderate', icon: <Users className="w-5 h-5" />, desc: 'Once in a while' },
    { value: 'high', label: 'High Interest', icon: <Users className="w-5 h-5" />, desc: 'I love social events!' },
  ];

  const guestFrequencyOptions = [
    { value: 'never', label: 'Never', desc: 'I don\'t have guests over' },
    { value: 'rarely', label: 'Rarely', desc: 'Few times a year' },
    { value: 'sometimes', label: 'Sometimes', desc: 'Once a month' },
    { value: 'often', label: 'Often', desc: 'Multiple times a month' },
  ];

  return (
    <OnboardingLayout
      role={role}
      backUrl={`/onboarding/core/daily-life?role=${role}`}
      backLabel={common.back}
      progress={{
        current: 3,
        total: 4,
        label: 'Step 3 of 4',
        stepName: 'Social Life',
      }}
      isLoading={isLoading}
      loadingText={common.loading}
    >
      <OnboardingHeading
        role={role}
        title="Your Social Vibe"
        description="Help us understand how you like to connect with others"
      />

      <div className="space-y-6">
        {/* Social Energy */}
        <div>
          <p className="text-sm text-gray-600 mb-3">
            How would you describe your social energy at home?
          </p>
          <OnboardingSlider
            role={role}
            label="Social Energy Level"
            value={socialEnergy}
            onChange={setSocialEnergy}
            min={1}
            max={10}
            minLabel="Introvert"
            maxLabel="Extrovert"
          />
          <p className="text-xs text-gray-500 mt-2">
            {socialEnergy <= 3 && 'You prefer quiet time and solitude to recharge'}
            {socialEnergy > 3 && socialEnergy <= 7 && 'You enjoy a balance of social time and alone time'}
            {socialEnergy > 7 && 'You thrive on social interactions and group activities'}
          </p>
        </div>

        {/* Shared Meals Interest */}
        <div>
          <OnboardingLabel required>Interest in Shared Meals</OnboardingLabel>
          <p className="text-sm text-gray-600 mb-3">
            Would you enjoy cooking and eating together with flatmates?
          </p>
          <OnboardingGrid columns={2}>
            <OnboardingSelectionCard
              role={role}
              selected={!sharedMealsInterest}
              onClick={() => setSharedMealsInterest(false)}
            >
              <div className="text-center">
                <div className="font-medium">Not interested</div>
                <div className="text-xs text-gray-500 mt-1">I prefer eating alone</div>
              </div>
            </OnboardingSelectionCard>
            <OnboardingSelectionCard
              role={role}
              selected={sharedMealsInterest}
              onClick={() => setSharedMealsInterest(true)}
            >
              <div className="text-center">
                <div className="font-medium">Yes, interested!</div>
                <div className="text-xs text-gray-500 mt-1">I enjoy shared meals</div>
              </div>
            </OnboardingSelectionCard>
          </OnboardingGrid>
        </div>

        {/* Event Participation Interest */}
        <div>
          <OnboardingLabel required>Community Events & Activities</OnboardingLabel>
          <p className="text-sm text-gray-600 mb-3">
            How interested are you in participating in flatmate events and activities?
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
                  <div className="font-medium text-sm">{option.label}</div>
                  <div className="text-xs text-gray-500 mt-1">{option.desc}</div>
                </div>
              </OnboardingSelectionCard>
            ))}
          </OnboardingGrid>
        </div>

        {/* Guest Frequency */}
        <div>
          <OnboardingLabel required>How Often Do You Have Guests?</OnboardingLabel>
          <p className="text-sm text-gray-600 mb-3">
            How frequently do you invite friends or family over?
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
                  <div className="font-medium">{option.label}</div>
                  <div className="text-xs text-gray-500 mt-1">{option.desc}</div>
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
