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
      toast.error('Please select at least one core value');
      return;
    }
    if (!opennessToSharing) {
      toast.error('Openness to sharing is required');
      return;
    }
    if (!culturalOpenness) {
      toast.error('Cultural openness is required');
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
    { value: 'respect', label: 'Respect', icon: <Shield className="w-4 h-4" />, desc: 'Mutual respect is key' },
    { value: 'cleanliness', label: 'Cleanliness', icon: <Shield className="w-4 h-4" />, desc: 'Keep things tidy' },
    { value: 'communication', label: 'Communication', icon: <Shield className="w-4 h-4" />, desc: 'Open dialogue' },
    { value: 'sustainability', label: 'Sustainability', icon: <Shield className="w-4 h-4" />, desc: 'Eco-conscious living' },
    { value: 'fun', label: 'Fun', icon: <Shield className="w-4 h-4" />, desc: 'Enjoy life together' },
    { value: 'privacy', label: 'Privacy', icon: <Shield className="w-4 h-4" />, desc: 'Personal space matters' },
    { value: 'diversity', label: 'Diversity', icon: <Shield className="w-4 h-4" />, desc: 'Embrace differences' },
    { value: 'growth', label: 'Personal Growth', icon: <Shield className="w-4 h-4" />, desc: 'Self-improvement' },
  ];

  const opennessOptions = [
    { value: 'private', label: 'Private', desc: 'I prefer my own space and things' },
    { value: 'moderate', label: 'Moderate', desc: 'Happy to share some things' },
    { value: 'open', label: 'Open', desc: 'I enjoy sharing and communal living' },
    { value: 'very_open', label: 'Very Open', desc: 'Everything is shared!' },
  ];

  const culturalOpennessOptions = [
    { value: 'conservative', label: 'Conservative', desc: 'Prefer similar backgrounds' },
    { value: 'moderate', label: 'Moderate', desc: 'Open to some diversity' },
    { value: 'open', label: 'Open', desc: 'Enjoy cultural diversity' },
    { value: 'very_open', label: 'Very Open', desc: 'Love multicultural living!' },
  ];

  return (
    <OnboardingLayout
      role={role}
      backUrl={`/onboarding/core/social-personality?role=${role}`}
      backLabel={common.back}
      progress={{
        current: 4,
        total: 4,
        label: 'Step 4 of 4',
        stepName: 'Values',
      }}
      isLoading={isLoading}
      loadingText={common.loading}
    >
      <OnboardingHeading
        role={role}
        title="Your Core Values"
        description="What matters most to you in a shared living environment?"
      />

      <div className="space-y-6">
        {/* Core Values */}
        <div>
          <OnboardingLabel required>Select Your Core Values</OnboardingLabel>
          <p className="text-sm text-gray-600 mb-3">
            Choose the values that are most important to you (select multiple)
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
                    <div className="font-medium text-sm">{option.label}</div>
                    <div className="text-xs text-gray-500 mt-1">{option.desc}</div>
                  </div>
                </div>
              </OnboardingSelectionCard>
            ))}
          </OnboardingGrid>
          {coreValues.length > 0 && (
            <p className="text-xs text-gray-500 mt-2">
              Selected: {coreValues.length} value{coreValues.length > 1 ? 's' : ''}
            </p>
          )}
        </div>

        {/* Openness to Sharing */}
        <div>
          <OnboardingLabel required>Openness to Sharing</OnboardingLabel>
          <p className="text-sm text-gray-600 mb-3">
            How comfortable are you sharing spaces and items with flatmates?
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
                  <div className="font-medium">{option.label}</div>
                  <div className="text-xs text-gray-500 mt-1">{option.desc}</div>
                </div>
              </OnboardingSelectionCard>
            ))}
          </OnboardingGrid>
        </div>

        {/* Cultural Openness */}
        <div>
          <OnboardingLabel required>Cultural Openness</OnboardingLabel>
          <p className="text-sm text-gray-600 mb-3">
            How do you feel about living with people from different cultures?
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
