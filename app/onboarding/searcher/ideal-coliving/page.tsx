'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Home, Users, Building2, Calendar } from 'lucide-react';
import { safeLocalStorage } from '@/lib/browser';
import { useLanguage } from '@/lib/i18n/use-language';
import IconBadge from '@/components/IconBadge';
import {
  OnboardingLayout,
  OnboardingHeading,
  OnboardingButton,
  OnboardingSelectionCard,
  OnboardingLabel,
  OnboardingGrid,
  OnboardingSlider,
} from '@/components/onboarding';

export default function IdealColivingPage() {
  const { t } = useLanguage();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [colivingSize, setColivingSize] = useState('');
  const [genderMix, setGenderMix] = useState('');
  const [minAge, setMinAge] = useState(18);
  const [maxAge, setMaxAge] = useState(35);
  const [sharedSpaceImportance, setSharedSpaceImportance] = useState(5);

  useEffect(() => {
    loadExistingData();
  }, []);

  const loadExistingData = () => {
    try {
      const saved = safeLocalStorage.get('idealColiving', {}) as any;
      if (saved.colivingSize) setColivingSize(saved.colivingSize);
      if (saved.genderMix) setGenderMix(saved.genderMix);
      if (saved.minAge) setMinAge(saved.minAge);
      if (saved.maxAge) setMaxAge(saved.maxAge);
      if (saved.sharedSpaceImportance) setSharedSpaceImportance(saved.sharedSpaceImportance);
    } finally {
      setIsLoading(false);
    }
  };

  const handleContinue = () => {
    safeLocalStorage.set('idealColiving', {
      colivingSize,
      genderMix,
      minAge,
      maxAge,
      sharedSpaceImportance,
    });
    router.push('/onboarding/searcher/preferences');
  };

  const canContinue = colivingSize && genderMix;

  const colivingSizes = [
    { value: 'small', label: t('onboarding.idealColiving.twoPeople'), icon: Users, variant: 'purple' as const, description: t('onboarding.idealColiving.intimateQuiet') },
    { value: 'medium', label: t('onboarding.idealColiving.fourPeople'), icon: Users, variant: 'blue' as const, description: t('onboarding.idealColiving.perfectBalance') },
    { value: 'large', label: t('onboarding.idealColiving.sevenPeople'), icon: Users, variant: 'green' as const, description: t('onboarding.idealColiving.vibrantCommunity') },
    { value: 'xlarge', label: t('onboarding.idealColiving.tenPlusPeople'), icon: Building2, variant: 'orange' as const, description: t('onboarding.idealColiving.largeCommunity') },
  ];

  const genderMixOptions = [
    { value: 'male-only', label: t('onboarding.idealColiving.maleOnly') },
    { value: 'female-only', label: t('onboarding.idealColiving.femaleOnly') },
    { value: 'mixed', label: t('onboarding.idealColiving.mixed') },
    { value: 'no-preference', label: t('onboarding.idealColiving.noPreference') },
  ];

  return (
    <OnboardingLayout
      role="searcher"
      backUrl="/onboarding/searcher/social-vibe"
      backLabel={t('common.back')}
      progress={{
        current: 5,
        total: 6,
        label: 'Étape 5 sur 6',
        stepName: t('onboarding.idealColiving.title'),
      }}
      isLoading={isLoading}
      loadingText={t('common.loading')}
    >
      <OnboardingHeading
        role="searcher"
        title={t('onboarding.idealColiving.title')}
        description={t('onboarding.idealColiving.subtitle')}
      />

      <div className="space-y-8">
        {/* Preferred coliving size */}
        <div>
          <OnboardingLabel required>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center">
                <Home className="w-4 h-4 text-orange-600" />
              </div>
              {t('onboarding.idealColiving.preferredColivingSize')}
            </div>
          </OnboardingLabel>
          <OnboardingGrid columns={2}>
            {colivingSizes.map((size) => (
              <OnboardingSelectionCard
                key={size.value}
                role="searcher"
                selected={colivingSize === size.value}
                onClick={() => setColivingSize(size.value)}
              >
                <div className="text-center">
                  <div className="flex justify-center mb-2">
                    <IconBadge icon={size.icon} variant={size.variant} size="lg" />
                  </div>
                  <div className={`font-semibold text-sm mb-1 ${
                    colivingSize === size.value ? 'text-orange-600' : 'text-gray-900'
                  }`}>
                    {size.label}
                  </div>
                  <div className="text-xs text-gray-500">{size.description}</div>
                </div>
              </OnboardingSelectionCard>
            ))}
          </OnboardingGrid>
        </div>

        {/* Gender mix preference */}
        <div>
          <OnboardingLabel required>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                <Users className="w-4 h-4 text-blue-600" />
              </div>
              {t('onboarding.idealColiving.genderMixPreference')}
            </div>
          </OnboardingLabel>
          <OnboardingGrid columns={2}>
            {genderMixOptions.map((option) => (
              <OnboardingSelectionCard
                key={option.value}
                role="searcher"
                selected={genderMix === option.value}
                onClick={() => setGenderMix(option.value)}
              >
                <div className="text-center font-medium text-sm">{option.label}</div>
              </OnboardingSelectionCard>
            ))}
          </OnboardingGrid>
        </div>

        {/* Roommate age range */}
        <div className="p-5 rounded-xl bg-yellow-50 border border-yellow-200">
          <OnboardingLabel>
            <div className="flex items-center gap-2">
              <IconBadge icon={Calendar} variant="yellow" size="sm" />
              {t('onboarding.idealColiving.roommateAgeRange')}
            </div>
          </OnboardingLabel>

          {/* Min age */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">{t('onboarding.idealColiving.minAge')}</span>
              <span className="text-lg font-bold text-orange-600">{minAge}</span>
            </div>
            <input
              type="range"
              min="18"
              max="65"
              value={minAge}
              onChange={(e) => setMinAge(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-orange-500"
            />
          </div>

          {/* Max age */}
          <div className="mb-2">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">{t('onboarding.idealColiving.maxAge')}</span>
              <span className="text-lg font-bold text-orange-600">{maxAge}</span>
            </div>
            <input
              type="range"
              min="18"
              max="65"
              value={maxAge}
              onChange={(e) => setMaxAge(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-orange-500"
            />
          </div>

          <p className="text-sm text-gray-600 mt-3">
            {t('onboarding.idealColiving.lookingForRoommates')} {minAge}-{maxAge}
          </p>
        </div>

        {/* Shared space importance */}
        <div className="p-5 rounded-xl bg-blue-50 border border-blue-200">
          <OnboardingSlider
            role="searcher"
            label={t('onboarding.idealColiving.sharedSpaceImportance')}
            value={sharedSpaceImportance}
            onChange={setSharedSpaceImportance}
            min={1}
            max={10}
            minLabel={t('onboarding.idealColiving.needPrivacy')}
            maxLabel={t('onboarding.idealColiving.loveCommunal')}
          />
          <p className="text-sm text-gray-500 mt-3">
            {t('onboarding.idealColiving.sharedSpaceHelp')}
          </p>
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
