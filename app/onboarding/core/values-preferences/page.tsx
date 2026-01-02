'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Heart, Users, Globe, Shield } from 'lucide-react';
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
} from '@/components/onboarding';

export default function CoreValuesPreferencesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t, getSection } = useLanguage();
  const common = getSection('common');
  const [isLoading, setIsLoading] = useState(true);

  // Detect role
  const role = (searchParams.get('role') as 'searcher' | 'resident') || 'searcher';

  const [coreValues, setCoreValues] = useState<string[]>([]);
  const [opennessToSharing, setOpennessToSharing] = useState('');
  const [culturalOpenness, setCulturalOpenness] = useState('');

  useEffect(() => {
    loadExistingData();
  }, []);

  const loadExistingData = () => {
    try {
      const saved = safeLocalStorage.get('coreValuesPreferences', {}) as any;
      if (saved.coreValues && Array.isArray(saved.coreValues)) setCoreValues(saved.coreValues);
      if (saved.opennessToSharing) setOpennessToSharing(saved.opennessToSharing);
      if (saved.culturalOpenness) setCulturalOpenness(saved.culturalOpenness);
    } finally {
      setIsLoading(false);
    }
  };

  const handleContinue = () => {
    if (coreValues.length === 0) {
      toast.error(t('coreOnboarding.valuesPreferences.errors.valuesRequired'));
      return;
    }
    if (!opennessToSharing) {
      toast.error(t('coreOnboarding.valuesPreferences.errors.sharingRequired'));
      return;
    }
    if (!culturalOpenness) {
      toast.error(t('coreOnboarding.valuesPreferences.errors.culturalRequired'));
      return;
    }

    safeLocalStorage.set('coreValuesPreferences', {
      coreValues,
      opennessToSharing,
      culturalOpenness,
    });

    // Navigate based on role
    if (role === 'resident') {
      router.push('/onboarding/resident/review?role=resident');
    } else {
      router.push('/onboarding/searcher/preferences?role=searcher');
    }
  };

  const canContinue = coreValues.length > 0 && opennessToSharing && culturalOpenness;

  const toggleCoreValue = (value: string) => {
    if (coreValues.includes(value)) {
      setCoreValues(coreValues.filter(v => v !== value));
    } else {
      setCoreValues([...coreValues, value]);
    }
  };

  const coreValueOptions = [
    { value: 'respect', labelKey: 'respect', icon: <Shield className="w-4 h-4" />, descKey: 'respectDesc' },
    { value: 'cleanliness', labelKey: 'cleanliness', icon: <Shield className="w-4 h-4" />, descKey: 'cleanlinessDesc' },
    { value: 'communication', labelKey: 'communication', icon: <Shield className="w-4 h-4" />, descKey: 'communicationDesc' },
    { value: 'sustainability', labelKey: 'sustainability', icon: <Shield className="w-4 h-4" />, descKey: 'sustainabilityDesc' },
    { value: 'fun', labelKey: 'fun', icon: <Shield className="w-4 h-4" />, descKey: 'funDesc' },
    { value: 'privacy', labelKey: 'privacy', icon: <Shield className="w-4 h-4" />, descKey: 'privacyDesc' },
    { value: 'diversity', labelKey: 'diversity', icon: <Shield className="w-4 h-4" />, descKey: 'diversityDesc' },
    { value: 'growth', labelKey: 'growth', icon: <Shield className="w-4 h-4" />, descKey: 'growthDesc' },
  ];

  const opennessOptions = [
    { value: 'private', labelKey: 'private', descKey: 'privateDesc' },
    { value: 'moderate', labelKey: 'moderate', descKey: 'moderateDesc' },
    { value: 'open', labelKey: 'open', descKey: 'openDesc' },
    { value: 'very_open', labelKey: 'veryOpen', descKey: 'veryOpenDesc' },
  ];

  const culturalOpennessOptions = [
    { value: 'conservative', labelKey: 'conservative', descKey: 'conservativeDesc' },
    { value: 'moderate', labelKey: 'moderate', descKey: 'moderateDesc' },
    { value: 'open', labelKey: 'open', descKey: 'openDesc' },
    { value: 'very_open', labelKey: 'veryOpen', descKey: 'veryOpenDesc' },
  ];

  return (
    <OnboardingLayout
      role={role}
      backUrl={`/onboarding/core/social-personality?role=${role}`}
      backLabel={common.back}
      progress={{
        current: 4,
        total: 4,
        label: t('coreOnboarding.valuesPreferences.progress'),
        stepName: t('coreOnboarding.valuesPreferences.stepName'),
      }}
      isLoading={isLoading}
      loadingText={common.loading}
    >
      <OnboardingHeading
        role={role}
        title={t('coreOnboarding.valuesPreferences.title')}
        description={t('coreOnboarding.valuesPreferences.description')}
      />

      <div className="space-y-6">
        {/* Core Values */}
        <div>
          <OnboardingLabel required>{t('coreOnboarding.valuesPreferences.selectValues')}</OnboardingLabel>
          <p className="text-sm text-gray-600 mb-3">
            {t('coreOnboarding.valuesPreferences.selectValuesHint')}
          </p>
          <OnboardingGrid columns={2}>
            {coreValueOptions.map((option) => (
              <OnboardingSelectionCard
                key={option.value}
                role={role}
                selected={coreValues.includes(option.value)}
                onClick={() => toggleCoreValue(option.value)}
              >
                <div className="flex items-start gap-2">
                  <div className="mt-1 text-gray-600">{option.icon}</div>
                  <div className="flex-1">
                    <div className="font-medium text-sm">{t(`coreOnboarding.valuesPreferences.values.${option.labelKey}`)}</div>
                    <div className="text-xs text-gray-500 mt-1">{t(`coreOnboarding.valuesPreferences.values.${option.descKey}`)}</div>
                  </div>
                </div>
              </OnboardingSelectionCard>
            ))}
          </OnboardingGrid>
          {coreValues.length > 0 && (
            <p className="text-xs text-gray-500 mt-2">
              {coreValues.length} {t('coreOnboarding.valuesPreferences.selected')}
            </p>
          )}
        </div>

        {/* Openness to Sharing */}
        <div>
          <OnboardingLabel required>{t('coreOnboarding.valuesPreferences.opennessToSharing')}</OnboardingLabel>
          <p className="text-sm text-gray-600 mb-3">
            {t('coreOnboarding.valuesPreferences.opennessQuestion')}
          </p>
          <OnboardingGrid columns={2}>
            {opennessOptions.map((option) => (
              <OnboardingSelectionCard
                key={option.value}
                role={role}
                selected={opennessToSharing === option.value}
                onClick={() => setOpennessToSharing(option.value)}
              >
                <div className="text-center">
                  <div className="font-medium">{t(`coreOnboarding.valuesPreferences.opennessOptions.${option.labelKey}`)}</div>
                  <div className="text-xs text-gray-500 mt-1">{t(`coreOnboarding.valuesPreferences.opennessOptions.${option.descKey}`)}</div>
                </div>
              </OnboardingSelectionCard>
            ))}
          </OnboardingGrid>
        </div>

        {/* Cultural Openness */}
        <div>
          <OnboardingLabel required>{t('coreOnboarding.valuesPreferences.culturalOpenness')}</OnboardingLabel>
          <p className="text-sm text-gray-600 mb-3">
            {t('coreOnboarding.valuesPreferences.culturalQuestion')}
          </p>
          <OnboardingGrid columns={2}>
            {culturalOpennessOptions.map((option) => (
              <OnboardingSelectionCard
                key={option.value}
                role={role}
                selected={culturalOpenness === option.value}
                onClick={() => setCulturalOpenness(option.value)}
              >
                <div className="text-center">
                  <div className="font-medium">{t(`coreOnboarding.valuesPreferences.culturalOptions.${option.labelKey}`)}</div>
                  <div className="text-xs text-gray-500 mt-1">{t(`coreOnboarding.valuesPreferences.culturalOptions.${option.descKey}`)}</div>
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
