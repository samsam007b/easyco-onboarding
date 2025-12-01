'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Home, Plus, MapPin } from 'lucide-react';
import { safeLocalStorage } from '@/lib/browser';
import { createClient } from '@/lib/auth/supabase-client';
import { toast } from 'sonner';
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

export default function PropertyBasicsPage() {
  const router = useRouter();
  const supabase = createClient();
  const { t, getSection } = useLanguage();
  const onboarding = getSection('onboarding');
  const common = getSection('common');
  const [isLoading, setIsLoading] = useState(true);
  const [hasProperty, setHasProperty] = useState<string>('');
  const [propertyCity, setPropertyCity] = useState('');
  const [propertyType, setPropertyType] = useState('');

  useEffect(() => {
    loadExistingData();
  }, []);

  const loadExistingData = async () => {
    try {
      const saved = safeLocalStorage.get('ownerPropertyBasics', {}) as any;
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        const { data: profileData } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (profileData) {
          const hasPropertyValue = saved.hasProperty || (profileData.has_property ? 'yes' : profileData.has_property === false ? 'no' : '');
          setHasProperty(hasPropertyValue);
          setPropertyCity(saved.propertyCity || profileData.property_city || '');
          setPropertyType(saved.propertyType || profileData.property_type || '');
        } else if (saved.hasProperty) {
          setHasProperty(saved.hasProperty);
          setPropertyCity(saved.propertyCity || '');
          setPropertyType(saved.propertyType || '');
        }
      }
    } catch (error) {
      toast.error(common.errorLoadingData);
    } finally {
      setIsLoading(false);
    }
  };

  const handleContinue = () => {
    safeLocalStorage.set('ownerPropertyBasics', {
      hasProperty,
      propertyCity: hasProperty === 'yes' ? propertyCity : '',
      propertyType: hasProperty === 'yes' ? propertyType : '',
    });
    router.push('/onboarding/owner/verification');
  };

  const canContinue = hasProperty && (hasProperty === 'no' || (propertyCity && propertyType));

  const propertyTypes = [
    { value: 'apartment', label: onboarding.owner.propertyBasics.apartment },
    { value: 'house', label: onboarding.owner.propertyBasics.house },
    { value: 'studio', label: onboarding.owner.propertyBasics.studio },
    { value: 'room', label: onboarding.owner.propertyBasics.privateRoom },
    { value: 'coliving', label: onboarding.owner.propertyBasics.colivingSpace },
    { value: 'other', label: onboarding.owner.propertyBasics.other },
  ];

  return (
    <OnboardingLayout
      role="owner"
      backUrl="/onboarding/owner/about"
      backLabel={common.back}
      progress={{
        current: 3,
        total: 3,
        label: `${t('onboarding.progress.step')} 3 ${t('onboarding.progress.of')} 3`,
        stepName: onboarding.owner.propertyBasics.title,
      }}
      isLoading={isLoading}
      loadingText={onboarding.owner.about.loadingInfo}
    >
      <OnboardingHeading
        role="owner"
        title={onboarding.owner.propertyBasics.title}
        description={onboarding.owner.propertyBasics.subtitle}
      />

      <div className="space-y-6">
        {/* Has Property */}
        <div>
          <OnboardingLabel required>
            {onboarding.owner.propertyBasics.hasPropertyLabel}
          </OnboardingLabel>
          <OnboardingGrid columns={2}>
            <OnboardingSelectionCard
              role="owner"
              selected={hasProperty === 'yes'}
              onClick={() => setHasProperty('yes')}
            >
              <div className="flex flex-col items-center gap-2 py-2">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  hasProperty === 'yes' ? 'bg-purple-100' : 'bg-gray-100'
                }`}>
                  <Home className={`w-5 h-5 ${
                    hasProperty === 'yes' ? 'text-purple-600' : 'text-gray-600'
                  }`} />
                </div>
                <span className={`font-semibold text-sm ${
                  hasProperty === 'yes' ? 'text-purple-600' : 'text-gray-900'
                }`}>
                  {onboarding.owner.propertyBasics.yes}
                </span>
              </div>
            </OnboardingSelectionCard>

            <OnboardingSelectionCard
              role="owner"
              selected={hasProperty === 'no'}
              onClick={() => setHasProperty('no')}
            >
              <div className="flex flex-col items-center gap-2 py-2">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  hasProperty === 'no' ? 'bg-purple-100' : 'bg-gray-100'
                }`}>
                  <Plus className={`w-5 h-5 ${
                    hasProperty === 'no' ? 'text-purple-600' : 'text-gray-600'
                  }`} />
                </div>
                <span className={`font-semibold text-sm ${
                  hasProperty === 'no' ? 'text-purple-600' : 'text-gray-900'
                }`}>
                  {onboarding.owner.propertyBasics.notYet}
                </span>
              </div>
            </OnboardingSelectionCard>
          </OnboardingGrid>
        </div>

        {/* Conditional: If has property */}
        {hasProperty === 'yes' && (
          <>
            {/* Property City */}
            <div className="p-5 rounded-xl bg-blue-50 border border-blue-200">
              <OnboardingInput
                role="owner"
                label={onboarding.owner.propertyBasics.propertyLocation}
                required
                icon={MapPin}
                value={propertyCity}
                onChange={(e) => setPropertyCity(e.target.value)}
                placeholder={onboarding.owner.propertyBasics.propertyLocationPlaceholder}
              />
            </div>

            {/* Property Type */}
            <div className="p-5 rounded-xl bg-yellow-50 border border-yellow-200">
              <OnboardingLabel required>
                <div className="flex items-center gap-2">
                  <Home className="w-4 h-4" />
                  {onboarding.owner.propertyBasics.propertyType}
                </div>
              </OnboardingLabel>
              <OnboardingGrid columns={2}>
                {propertyTypes.map((type) => (
                  <OnboardingSelectionCard
                    key={type.value}
                    role="owner"
                    selected={propertyType === type.value}
                    onClick={() => setPropertyType(type.value)}
                  >
                    <div className="text-center font-medium text-sm">{type.label}</div>
                  </OnboardingSelectionCard>
                ))}
              </OnboardingGrid>
            </div>

            {/* Info box */}
            <div className="p-4 rounded-lg bg-green-50 border border-green-200">
              <p className="text-sm text-gray-700">
                {onboarding.owner.propertyBasics.infoGreat}
              </p>
            </div>
          </>
        )}

        {/* Conditional: If no property */}
        {hasProperty === 'no' && (
          <div className="p-5 rounded-xl bg-purple-50 border border-purple-200">
            <h3 className="font-semibold text-gray-900 mb-2">{onboarding.owner.propertyBasics.noProblemTitle}</h3>
            <p className="text-sm text-gray-700">
              {onboarding.owner.propertyBasics.noProblemDesc}
            </p>
          </div>
        )}
      </div>

      <div className="mt-8">
        <OnboardingButton
          role="owner"
          onClick={handleContinue}
          disabled={!canContinue}
        >
          {common.continue}
        </OnboardingButton>
      </div>
    </OnboardingLayout>
  );
}
