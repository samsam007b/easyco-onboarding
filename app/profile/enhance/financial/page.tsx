'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Euro, Shield, Briefcase } from 'lucide-react';
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

export default function FinancialInfoPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const [isLoading, setIsLoading] = useState(true);
  const [incomeRange, setIncomeRange] = useState('');
  const [hasGuarantor, setHasGuarantor] = useState(false);
  const [employmentType, setEmploymentType] = useState('');

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
        const savedData = safeLocalStorage.get('financialInfo', {}) as any;
        if (savedData.incomeRange) setIncomeRange(savedData.incomeRange);
        if (savedData.hasGuarantor !== undefined) setHasGuarantor(savedData.hasGuarantor);
        if (savedData.employmentType) setEmploymentType(savedData.employmentType);

        // If nothing in localStorage, load from database
        if (!savedData.incomeRange && !savedData.employmentType) {
          const { data: profileData } = await getOnboardingData(user.id);
          if (profileData) {
            setIncomeRange(profileData.incomeRange || '');
            setHasGuarantor(profileData.hasGuarantor || false);
            setEmploymentType(profileData.employmentType || '');
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

  const handleContinue = async () => {
    // Save to localStorage for immediate feedback
    safeLocalStorage.set('financialInfo', {
      incomeRange,
      hasGuarantor,
      employmentType,
    });

    // Save to database
    try {
      await fetch('/api/profile/enhance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          section: 'financial',
          data: { incomeRange, hasGuarantor, employmentType }
        })
      });
    } catch (error) {
      console.error('Failed to save to database:', error);
    }

    router.push('/profile');
  };

  const handleSkip = () => {
    router.push('/profile');
  };

  const canContinue = incomeRange && employmentType;

  const incomeRanges = [
    { value: 'under-1000', key: 'under1000' },
    { value: '1000-1500', key: 'range1000to1500' },
    { value: '1500-2000', key: 'range1500to2000' },
    { value: '2000-3000', key: 'range2000to3000' },
    { value: '3000-5000', key: 'range3000to5000' },
    { value: 'over-5000', key: 'over5000' },
  ];

  const employmentTypes = [
    { value: 'full-time', key: 'fullTime' },
    { value: 'part-time', key: 'partTime' },
    { value: 'freelance', key: 'freelance' },
    { value: 'contract', key: 'contract' },
    { value: 'internship', key: 'internship' },
    { value: 'student', key: 'student' },
    { value: 'unemployed', key: 'unemployed' },
  ];

  return (
    <EnhanceProfileLayout
      role="searcher"
      backUrl="/profile"
      backLabel={t('profileEnhance.common.backToProfile')}
      progress={undefined}
      isLoading={isLoading}
      loadingText={t('profileEnhance.financial.loading')}
    >
      <EnhanceProfileHeading
        role="searcher"
        title={t('profileEnhance.financial.title')}
        description={t('profileEnhance.financial.description')}
        icon={<Euro className="w-8 h-8 text-orange-600" />}
      />

      <div className="space-y-6">
        {/* Income range selector */}
        <EnhanceProfileSection>
          <label className="block text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
              <Euro className="w-4 h-4 text-green-600" />
            </div>
            {t('profileEnhance.financial.incomeRange.label')}
          </label>
          <div className="grid grid-cols-2 gap-3">
            {incomeRanges.map((range) => (
              <EnhanceProfileSelectionCard
                key={range.value}
                role="searcher"
                selected={incomeRange === range.value}
                onClick={() => setIncomeRange(range.value)}
              >
                {t(`profileEnhance.financial.incomeRange.${range.key}`)}
              </EnhanceProfileSelectionCard>
            ))}
          </div>
        </EnhanceProfileSection>

        {/* Guarantor toggle */}
        <EnhanceProfileSection>
          <div className="p-4 superellipse-xl bg-blue-50 border border-blue-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                  <Shield className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <span className="font-medium text-gray-700 block">{t('profileEnhance.financial.guarantor.title')}</span>
                  <span className="text-sm text-gray-500">{t('profileEnhance.financial.guarantor.description')}</span>
                </div>
              </div>
              <button
                onClick={() => setHasGuarantor(!hasGuarantor)}
                className={`relative w-[52px] h-[32px] rounded-full transition-all duration-300 flex-shrink-0 ${
                  hasGuarantor ? 'bg-gradient-to-r from-orange-500 to-orange-600' : 'bg-gray-300'
                }`}
              >
                <div
                  className={`absolute top-[2px] left-[2px] w-[28px] h-[28px] bg-white rounded-full shadow-md transition-all duration-300 ${
                    hasGuarantor ? 'translate-x-[20px]' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>
        </EnhanceProfileSection>

        {/* Employment type */}
        <EnhanceProfileSection>
          <label className="block text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center">
              <Briefcase className="w-4 h-4 text-orange-600" />
            </div>
            {t('profileEnhance.financial.employment.label')}
          </label>
          <div className="grid grid-cols-2 gap-3">
            {employmentTypes.map((type) => (
              <EnhanceProfileSelectionCard
                key={type.value}
                role="searcher"
                selected={employmentType === type.value}
                onClick={() => setEmploymentType(type.value)}
              >
                {t(`profileEnhance.financial.employment.${type.key}`)}
              </EnhanceProfileSelectionCard>
            ))}
          </div>
        </EnhanceProfileSection>

        {/* Privacy notice */}
        <EnhanceProfileInfoBox role="searcher">
          <div className="flex gap-3">
            <div className="flex-shrink-0">
              <Shield className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900 mb-1">{t('profileEnhance.financial.privacy.title')}</h3>
              <p className="text-sm text-gray-600">
                {t('profileEnhance.financial.privacy.description')}
              </p>
            </div>
          </div>
        </EnhanceProfileInfoBox>
      </div>

      {/* Action buttons */}
      <div className="mt-8 flex justify-between items-center gap-4">
        <button
          onClick={handleSkip}
          className="px-6 py-3 superellipse-xl font-semibold text-gray-700 hover:bg-gray-50 transition-all flex items-center gap-2"
        >
          {t('profileEnhance.common.skip')}
          <span className="text-lg">→</span>
        </button>
        <button
          onClick={handleContinue}
          disabled={!canContinue}
          className="px-8 py-3 superellipse-xl font-semibold bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none"
        >
          {t('profileEnhance.common.save')}
        </button>
      </div>
    </EnhanceProfileLayout>
  );
}
