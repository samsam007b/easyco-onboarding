'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { User, Building2, Users, MapPin } from 'lucide-react';
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
  OnboardingInput,
} from '@/components/onboarding';

export default function OwnerAbout() {
  const router = useRouter();
  const supabase = createClient();
  const { t } = useLanguage();
  const [isLoading, setIsLoading] = useState(true);
  const [ownerType, setOwnerType] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [primaryLocation, setPrimaryLocation] = useState('');
  const [hostingExperience, setHostingExperience] = useState('');

  useEffect(() => {
    loadExistingData();
  }, []);

  const loadExistingData = async () => {
    try {
      const saved = safeLocalStorage.get('ownerAbout', {}) as any;
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        const { data: profileData } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (profileData) {
          setOwnerType(saved.ownerType || profileData.owner_type || '');
          setCompanyName(saved.companyName || profileData.company_name || '');
          setPrimaryLocation(saved.primaryLocation || profileData.primary_location || '');
          setHostingExperience(saved.hostingExperience || profileData.hosting_experience || '');
        } else if (saved.ownerType) {
          setOwnerType(saved.ownerType);
          setCompanyName(saved.companyName || '');
          setPrimaryLocation(saved.primaryLocation);
          setHostingExperience(saved.hostingExperience);
        }
      }
    } catch (error) {
      toast.error(t('onboarding.errors.loadFailed'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleContinue = () => {
    if (!ownerType || !primaryLocation || !hostingExperience) {
      toast.error(t('onboarding.owner.about.errorRequired'));
      return;
    }

    if ((ownerType === 'agency' || ownerType === 'company') && !companyName.trim()) {
      toast.error(t('onboarding.owner.about.errorCompanyName'));
      return;
    }

    safeLocalStorage.set('ownerAbout', {
      ownerType,
      companyName: (ownerType === 'agency' || ownerType === 'company') ? companyName : '',
      primaryLocation,
      hostingExperience,
    });
    router.push('/onboarding/owner/property-basics');
  };

  const ownerTypes = [
    {
      value: 'individual',
      label: t('onboarding.owner.about.individualOwner'),
      icon: User,
      description: t('onboarding.owner.about.individualOwnerDesc')
    },
    {
      value: 'agency',
      label: t('onboarding.owner.about.propertyAgency'),
      icon: Building2,
      description: t('onboarding.owner.about.propertyAgencyDesc')
    },
    {
      value: 'company',
      label: t('onboarding.owner.about.companyCorporation'),
      icon: Users,
      description: t('onboarding.owner.about.companyCorporationDesc')
    },
  ];

  const experienceOptions = [
    { value: '0-1 year', label: t('onboarding.owner.about.experience0to1') },
    { value: '1-3 years', label: t('onboarding.owner.about.experience1to3') },
    { value: '3+ years', label: t('onboarding.owner.about.experience3plus') },
  ];

  const canContinue = ownerType && primaryLocation && hostingExperience &&
    (!['agency', 'company'].includes(ownerType) || companyName.trim());

  return (
    <OnboardingLayout
      role="owner"
      backUrl="/onboarding/owner/basic-info"
      backLabel={t('common.back')}
      progress={{
        current: 2,
        total: 3,
        label: `${t('onboarding.progress.step')} 2 ${t('onboarding.progress.of')} 3`,
        stepName: t('onboarding.owner.about.title'),
      }}
      isLoading={isLoading}
      loadingText={t('onboarding.owner.about.loading')}
    >
      <OnboardingHeading
        role="owner"
        title={t('onboarding.owner.about.title')}
        description={t('onboarding.owner.about.subtitle')}
      />

      <div className="space-y-6">
        {/* Owner Type */}
        <div>
          <OnboardingLabel required>
            {t('onboarding.owner.about.ownerTypeLabel')}
          </OnboardingLabel>
          <div className="space-y-3">
            {ownerTypes.map((type) => {
              const Icon = type.icon;
              return (
                <OnboardingSelectionCard
                  key={type.value}
                  role="owner"
                  selected={ownerType === type.value}
                  onClick={() => setOwnerType(type.value)}
                  className="w-full"
                >
                  <div className="flex items-start gap-3">
                    <Icon className={`w-5 h-5 mt-0.5 ${ownerType === type.value ? 'text-purple-600' : 'text-gray-400'}`} />
                    <div className="flex-1 text-left">
                      <div className="font-semibold text-gray-900">{type.label}</div>
                      <div className="text-sm text-gray-500">{type.description}</div>
                    </div>
                    {ownerType === type.value && (
                      <div className="w-5 h-5 rounded-full bg-purple-600 flex items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded-full" />
                      </div>
                    )}
                  </div>
                </OnboardingSelectionCard>
              );
            })}
          </div>
        </div>

        {/* Company Name (conditional) */}
        {(ownerType === 'agency' || ownerType === 'company') && (
          <OnboardingInput
            role="owner"
            label={t('onboarding.owner.about.companyName')}
            required
            icon={Building2}
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            placeholder={t('onboarding.owner.about.companyNamePlaceholder')}
          />
        )}

        {/* Primary Location */}
        <OnboardingInput
          role="owner"
          label={t('onboarding.owner.about.primaryLocation')}
          required
          icon={MapPin}
          value={primaryLocation}
          onChange={(e) => setPrimaryLocation(e.target.value)}
          placeholder={t('onboarding.owner.about.primaryLocationPlaceholder')}
        />

        {/* Hosting Experience */}
        <div>
          <OnboardingLabel required>
            {t('onboarding.owner.about.hostingExperience')}
          </OnboardingLabel>
          <div className="grid grid-cols-3 gap-3">
            {experienceOptions.map((option) => (
              <OnboardingSelectionCard
                key={option.value}
                role="owner"
                selected={hostingExperience === option.value}
                onClick={() => setHostingExperience(option.value)}
              >
                <div className="text-center font-medium text-sm">{option.label}</div>
              </OnboardingSelectionCard>
            ))}
          </div>
          <div className="mt-3 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
            <p className="text-sm text-yellow-800">
              {t('onboarding.owner.about.tipComplete')}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-8 flex gap-4">
        <OnboardingButton
          role="owner"
          variant="secondary"
          onClick={() => router.push('/onboarding/owner/basic-info')}
        >
          {t('common.back')}
        </OnboardingButton>
        <OnboardingButton
          role="owner"
          onClick={handleContinue}
          disabled={!canContinue}
        >
          {t('common.continue')}
        </OnboardingButton>
      </div>
    </OnboardingLayout>
  );
}
