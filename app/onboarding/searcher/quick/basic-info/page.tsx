'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, User, Calendar, Globe } from 'lucide-react';
import { createClient } from '@/lib/auth/supabase-client';
import { toast } from 'sonner';
import { safeLocalStorage } from '@/lib/browser';
import ProgressBar, { generateStepsArray } from '@/components/onboarding/ProgressBar';
import { useOnboardingFunnel } from '@/lib/analytics/use-analytics';
import { trackQuickStartFunnel } from '@/lib/analytics/funnels';
import { useLanguage } from '@/lib/i18n/use-language';
import {
  OnboardingLayout,
  OnboardingHeading,
  OnboardingButton,
  OnboardingInput,
} from '@/components/onboarding';

export default function QuickBasicInfoPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const supabase = createClient();
  const [isLoading, setIsLoading] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(true);

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [nationality, setNationality] = useState('');

  // Analytics tracking
  const { trackStepCompleted, trackOnboardingStarted } = useOnboardingFunnel('quick');

  const loadExistingData = useCallback(async () => {
    try {
      const saved = safeLocalStorage.get('quickBasicInfo', {}) as any;
      if (saved.firstName) setFirstName(saved.firstName);
      if (saved.lastName) setLastName(saved.lastName);
      if (saved.dateOfBirth) setDateOfBirth(saved.dateOfBirth);
      if (saved.nationality) setNationality(saved.nationality);

      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profileData } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (profileData) {
          if (profileData.first_name) setFirstName(profileData.first_name);
          if (profileData.last_name) setLastName(profileData.last_name);
          if (profileData.date_of_birth) setDateOfBirth(profileData.date_of_birth);
          if (profileData.nationality) setNationality(profileData.nationality);
        }
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setIsPageLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    loadExistingData();
    trackOnboardingStarted();
    trackQuickStartFunnel.modeSelected({ mode: 'quick' });
  }, [loadExistingData, trackOnboardingStarted]);

  // Auto-save to localStorage
  useEffect(() => {
    const saveData = {
      firstName,
      lastName,
      dateOfBirth,
      nationality,
    };
    safeLocalStorage.set('quickBasicInfo', saveData);
  }, [firstName, lastName, dateOfBirth, nationality]);

  const handleNext = async () => {
    if (!firstName.trim()) {
      toast.error(t('quickOnboarding.basicInfo.errors.firstNameRequired'));
      return;
    }
    if (!lastName.trim()) {
      toast.error(t('quickOnboarding.basicInfo.errors.lastNameRequired'));
      return;
    }
    if (!dateOfBirth) {
      toast.error(t('quickOnboarding.basicInfo.errors.dobRequired'));
      return;
    }

    const birthDate = new Date(dateOfBirth);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    if (age < 18) {
      toast.error(t('quickOnboarding.basicInfo.errors.ageRestriction'));
      return;
    }
    if (!nationality.trim()) {
      toast.error(t('quickOnboarding.basicInfo.errors.nationalityRequired'));
      return;
    }

    setIsLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        // 🔍 DETAILED LOGGING FOR DEBUGGING
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('🔍 UPSERT ATTEMPT - Quick Onboarding Basic Info');
        console.log('🆔 User ID:', user.id);
        console.log('📝 Data:', {
          user_id: user.id,
          first_name: firstName.trim(),
          last_name: lastName.trim(),
          date_of_birth: dateOfBirth,
          nationality: nationality.trim(),
        });
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

        const { error } = await supabase
          .from('user_profiles')
          .upsert(
            {
              user_id: user.id,
              first_name: firstName.trim(),
              last_name: lastName.trim(),
              date_of_birth: dateOfBirth,
              nationality: nationality.trim(),
              updated_at: new Date().toISOString(),
            },
            { onConflict: 'user_id' }
          );

        if (error) {
          console.error('❌ UPSERT ERROR:', {
            message: error.message,
            details: error.details,
            hint: error.hint,
            code: error.code,
          });
          throw error;
        }

        console.log('✅ UPSERT SUCCESS');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      }

      trackStepCompleted('basic_info', 1);
      trackQuickStartFunnel.basicInfoCompleted({
        has_nationality: !!nationality,
        age_range: age < 25 ? '18-24' : age < 35 ? '25-34' : age < 45 ? '35-44' : '45+',
      });

      router.push('/onboarding/searcher/quick/budget-location');
    } catch (error: any) {
      console.error('Error saving:', error);
      toast.error(error.message || t('quickOnboarding.common.saveError'));
    } finally {
      setIsLoading(false);
    }
  };

  const canContinue = firstName && lastName && dateOfBirth && nationality;

  return (
    <OnboardingLayout
      role="searcher"
      backUrl="/onboarding/searcher/mode-selection"
      backLabel={t('quickOnboarding.common.back')}
      progress={{
        current: 1,
        total: 5,
        label: 'Étape 1 sur 5',
        stepName: t('quickOnboarding.basicInfo.stepName'),
      }}
      isLoading={isPageLoading}
      loadingText={t('quickOnboarding.common.loading')}
    >
      {/* Header */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <User className="w-8 h-8 text-orange-600" />
        </div>
        <OnboardingHeading
          role="searcher"
          title={t('quickOnboarding.basicInfo.title')}
          description={t('quickOnboarding.basicInfo.description')}
        />
      </div>

      <div className="space-y-6">
        {/* First Name */}
        <OnboardingInput
          role="searcher"
          label={t('quickOnboarding.basicInfo.firstName')}
          required
          icon={User}
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          placeholder={t('quickOnboarding.basicInfo.firstNamePlaceholder')}
        />

        {/* Last Name */}
        <OnboardingInput
          role="searcher"
          label={t('quickOnboarding.basicInfo.lastName')}
          required
          icon={User}
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          placeholder={t('quickOnboarding.basicInfo.lastNamePlaceholder')}
        />

        {/* Date of Birth */}
        <div>
          <OnboardingInput
            role="searcher"
            label={t('quickOnboarding.basicInfo.dateOfBirth')}
            required
            icon={Calendar}
            type="date"
            value={dateOfBirth}
            onChange={(e) => setDateOfBirth(e.target.value)}
          />
          <p className="text-xs text-gray-500 mt-1">{t('quickOnboarding.basicInfo.ageHint')}</p>
        </div>

        {/* Nationality */}
        <OnboardingInput
          role="searcher"
          label={t('quickOnboarding.basicInfo.nationality')}
          required
          icon={Globe}
          value={nationality}
          onChange={(e) => setNationality(e.target.value)}
          placeholder={t('quickOnboarding.basicInfo.nationalityPlaceholder')}
        />
      </div>

      <div className="mt-8">
        <OnboardingButton
          role="searcher"
          onClick={handleNext}
          disabled={!canContinue || isLoading}
        >
          {isLoading ? (
            t('quickOnboarding.common.loading')
          ) : (
            <span className="flex items-center justify-center gap-2">
              {t('quickOnboarding.common.continue')}
              <ArrowRight className="w-5 h-5" />
            </span>
          )}
        </OnboardingButton>
      </div>

      <p className="text-center text-sm text-gray-500 mt-6">
        {t('quickOnboarding.common.autoSave')}
      </p>
    </OnboardingLayout>
  );
}
