'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Smile, Share2, MessageCircle, Globe } from 'lucide-react';
import { safeLocalStorage } from '@/lib/browser';
import { useLanguage } from '@/lib/i18n/use-language';
import {
  OnboardingLayout,
  OnboardingHeading,
  OnboardingButton,
  OnboardingSelectionCard,
  OnboardingLabel,
  OnboardingGrid,
} from '@/components/onboarding';

export default function SocialVibePage() {
  const { t } = useLanguage();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [socialEnergy, setSocialEnergy] = useState('');
  const [opennessToSharing, setOpennessToSharing] = useState('');
  const [communicationStyle, setCommunicationStyle] = useState('');
  const [culturalOpenness, setCulturalOpenness] = useState('');

  useEffect(() => {
    loadExistingData();
  }, []);

  const loadExistingData = () => {
    try {
      const saved = safeLocalStorage.get('socialVibe', {}) as any;
      if (saved.socialEnergy) setSocialEnergy(saved.socialEnergy);
      if (saved.opennessToSharing) setOpennessToSharing(saved.opennessToSharing);
      if (saved.communicationStyle) setCommunicationStyle(saved.communicationStyle);
      if (saved.culturalOpenness) setCulturalOpenness(saved.culturalOpenness);
    } finally {
      setIsLoading(false);
    }
  };

  const handleContinue = () => {
    safeLocalStorage.set('socialVibe', {
      socialEnergy,
      opennessToSharing,
      communicationStyle,
      culturalOpenness,
    });
    router.push('/onboarding/searcher/ideal-coliving');
  };

  const canContinue = socialEnergy && opennessToSharing && communicationStyle && culturalOpenness;

  const socialEnergyOptions = [
    { value: 'introvert', label: t('onboarding.socialVibe.introvert') },
    { value: 'moderate', label: t('onboarding.socialVibe.moderate') },
    { value: 'extrovert', label: t('onboarding.socialVibe.extrovert') },
  ];

  const sharingOptions = [
    { value: 'private', label: t('onboarding.socialVibe.private') },
    { value: 'moderate', label: t('onboarding.socialVibe.moderate') },
    { value: 'very-open', label: t('onboarding.socialVibe.veryOpen') },
  ];

  const communicationOptions = [
    { value: 'direct', label: t('onboarding.socialVibe.directStraightforward') },
    { value: 'diplomatic', label: t('onboarding.socialVibe.diplomaticTactful') },
    { value: 'casual', label: t('onboarding.socialVibe.casualFriendly') },
    { value: 'formal', label: t('onboarding.socialVibe.formalProfessional') },
  ];

  const culturalOptions = [
    { value: 'prefer-similar', label: t('onboarding.socialVibe.preferSimilar') },
    { value: 'moderate', label: t('onboarding.socialVibe.moderate') },
    { value: 'love-diversity', label: t('onboarding.socialVibe.loveDiversity') },
  ];

  return (
    <OnboardingLayout
      role="searcher"
      backUrl="/onboarding/searcher/home-lifestyle"
      backLabel={t('common.back')}
      progress={{
        current: 4,
        total: 6,
        label: 'Étape 4 sur 6',
        stepName: t('onboarding.socialVibe.title'),
      }}
      isLoading={isLoading}
      loadingText={t('common.loading')}
    >
      <OnboardingHeading
        role="searcher"
        title={t('onboarding.socialVibe.title')}
        description={t('onboarding.socialVibe.subtitle')}
      />

      <div className="space-y-6">
        {/* Social energy */}
        <div>
          <OnboardingLabel required>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center">
                <Smile className="w-4 h-4 text-orange-600" />
              </div>
              {t('onboarding.socialVibe.socialEnergy')}
            </div>
          </OnboardingLabel>
          <OnboardingGrid columns={3}>
            {socialEnergyOptions.map((option) => (
              <OnboardingSelectionCard
                key={option.value}
                role="searcher"
                selected={socialEnergy === option.value}
                onClick={() => setSocialEnergy(option.value)}
              >
                <div className="text-center font-medium text-sm">{option.label}</div>
              </OnboardingSelectionCard>
            ))}
          </OnboardingGrid>
          <p className="text-sm text-gray-500 mt-2">{t('onboarding.socialVibe.socialEnergyHelp')}</p>
        </div>

        {/* Openness to sharing */}
        <div className="p-4 rounded-xl bg-yellow-50 border border-yellow-200">
          <OnboardingLabel required>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center">
                <Share2 className="w-4 h-4 text-yellow-600" />
              </div>
              {t('onboarding.socialVibe.opennessToSharing')}
            </div>
          </OnboardingLabel>
          <OnboardingGrid columns={3}>
            {sharingOptions.map((option) => (
              <OnboardingSelectionCard
                key={option.value}
                role="searcher"
                selected={opennessToSharing === option.value}
                onClick={() => setOpennessToSharing(option.value)}
              >
                <div className="text-center font-medium text-sm">{option.label}</div>
              </OnboardingSelectionCard>
            ))}
          </OnboardingGrid>
          <p className="text-sm text-gray-500 mt-3">{t('onboarding.socialVibe.opennessHelp')}</p>
        </div>

        {/* Communication style */}
        <div>
          <OnboardingLabel required>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                <MessageCircle className="w-4 h-4 text-blue-600" />
              </div>
              {t('onboarding.socialVibe.communicationStyle')}
            </div>
          </OnboardingLabel>
          <OnboardingGrid columns={2}>
            {communicationOptions.map((option) => (
              <OnboardingSelectionCard
                key={option.value}
                role="searcher"
                selected={communicationStyle === option.value}
                onClick={() => setCommunicationStyle(option.value)}
              >
                <div className="text-center font-medium text-sm">{option.label}</div>
              </OnboardingSelectionCard>
            ))}
          </OnboardingGrid>
        </div>

        {/* Cultural openness */}
        <div>
          <OnboardingLabel required>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                <Globe className="w-4 h-4 text-blue-600" />
              </div>
              {t('onboarding.socialVibe.culturalOpenness')}
            </div>
          </OnboardingLabel>
          <OnboardingGrid columns={3}>
            {culturalOptions.map((option) => (
              <OnboardingSelectionCard
                key={option.value}
                role="searcher"
                selected={culturalOpenness === option.value}
                onClick={() => setCulturalOpenness(option.value)}
              >
                <div className="text-center font-medium text-sm">{option.label}</div>
              </OnboardingSelectionCard>
            ))}
          </OnboardingGrid>
          <p className="text-sm text-gray-500 mt-2">{t('onboarding.socialVibe.culturalOpennessHelp')}</p>
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
