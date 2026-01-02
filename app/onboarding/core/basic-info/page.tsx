'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { User, Calendar, Globe } from 'lucide-react';
import { safeLocalStorage } from '@/lib/browser';
import { createClient } from '@/lib/auth/supabase-client';
import { toast } from 'sonner';
import { useLanguage } from '@/lib/i18n/use-language';
import { LanguagesChipInput, type LanguageChip } from '@/components/LanguagesChipInput';
import {
  OnboardingLayout,
  OnboardingHeading,
  OnboardingInput,
  OnboardingButton,
  OnboardingLabel,
} from '@/components/onboarding';

export default function CoreBasicInfoPage() {
  const router = useRouter();
  const supabase = createClient();
  const { t, getSection } = useLanguage();
  const common = getSection('common');
  const [isLoading, setIsLoading] = useState(true);

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [nationality, setNationality] = useState('');
  const [languages, setLanguages] = useState<LanguageChip[]>([]);

  // Determine role from URL
  const [role, setRole] = useState<'searcher' | 'resident'>('searcher');

  useEffect(() => {
    // Detect role from pathname
    const pathname = window.location.pathname;
    if (pathname.includes('/resident/')) {
      setRole('resident');
    }
    loadExistingData();
  }, []);

  const loadExistingData = async () => {
    try {
      // Check localStorage first
      const saved = safeLocalStorage.get('coreBasicInfo', {}) as any;

      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        const { data: profileData } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (profileData) {
          setFirstName(saved.firstName || profileData.first_name || '');
          setLastName(saved.lastName || profileData.last_name || '');
          setDateOfBirth(saved.dateOfBirth || profileData.date_of_birth || '');
          setNationality(saved.nationality || profileData.nationality || '');

          // Convert languages
          const savedLangs = saved.languages || profileData.languages || [];
          if (Array.isArray(savedLangs) && savedLangs.length > 0) {
            if (typeof savedLangs[0] === 'string') {
              setLanguages(savedLangs.map((lang: string) => ({
                code: lang,
                display: lang,
                canonicalEn: lang,
              })));
            } else {
              setLanguages(savedLangs as LanguageChip[]);
            }
          }
        } else if (saved.firstName) {
          setFirstName(saved.firstName);
          setLastName(saved.lastName);
          setDateOfBirth(saved.dateOfBirth);
          setNationality(saved.nationality);

          const savedLangs = saved.languages || [];
          if (Array.isArray(savedLangs) && savedLangs.length > 0) {
            if (typeof savedLangs[0] === 'string') {
              setLanguages(savedLangs.map((lang: string) => ({
                code: lang,
                display: lang,
                canonicalEn: lang,
              })));
            } else {
              setLanguages(savedLangs as LanguageChip[]);
            }
          }
        }
      }
    } catch (error) {
      toast.error(common.errors.loadFailed);
    } finally {
      setIsLoading(false);
    }
  };

  const handleContinue = () => {
    if (!firstName.trim()) {
      toast.error(t('coreOnboarding.basicInfo.errors.firstNameRequired'));
      return;
    }
    if (!lastName.trim()) {
      toast.error(t('coreOnboarding.basicInfo.errors.lastNameRequired'));
      return;
    }
    if (!dateOfBirth) {
      toast.error(t('coreOnboarding.basicInfo.errors.dateOfBirthRequired'));
      return;
    }
    if (!nationality.trim()) {
      toast.error(t('coreOnboarding.basicInfo.errors.nationalityRequired'));
      return;
    }
    if (languages.length === 0) {
      toast.error(t('coreOnboarding.basicInfo.errors.languageRequired'));
      return;
    }

    safeLocalStorage.set('coreBasicInfo', {
      firstName,
      lastName,
      dateOfBirth,
      nationality,
      languages,
    });

    // Navigate to next step based on role
    if (role === 'resident') {
      router.push('/onboarding/core/daily-life?role=resident');
    } else {
      router.push('/onboarding/core/daily-life?role=searcher');
    }
  };

  const canContinue = firstName && lastName && dateOfBirth && nationality && languages.length > 0;

  return (
    <OnboardingLayout
      role={role}
      backUrl={role === 'resident' ? '/dashboard/resident' : '/onboarding/searcher'}
      backLabel={common.back}
      progress={{
        current: 1,
        total: 4,
        label: t('coreOnboarding.basicInfo.progress'),
        stepName: t('coreOnboarding.basicInfo.stepName'),
      }}
      isLoading={isLoading}
      loadingText={common.loading}
    >
      <OnboardingHeading
        role={role}
        title={t('coreOnboarding.basicInfo.title')}
        description={t('coreOnboarding.basicInfo.description')}
      />

      <div className="space-y-6">
        {/* First Name */}
        <OnboardingInput
          role={role}
          type="text"
          label={t('coreOnboarding.basicInfo.firstName')}
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          placeholder={t('coreOnboarding.basicInfo.firstNamePlaceholder')}
          icon={User}
          required
        />

        {/* Last Name */}
        <OnboardingInput
          role={role}
          type="text"
          label={t('coreOnboarding.basicInfo.lastName')}
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          placeholder={t('coreOnboarding.basicInfo.lastNamePlaceholder')}
          icon={User}
          required
        />

        {/* Date of Birth */}
        <OnboardingInput
          role={role}
          type="date"
          label={t('coreOnboarding.basicInfo.dateOfBirth')}
          value={dateOfBirth}
          onChange={(e) => setDateOfBirth(e.target.value)}
          max={new Date().toISOString().split('T')[0]}
          icon={Calendar}
          required
        />

        {/* Nationality */}
        <OnboardingInput
          role={role}
          type="text"
          label={t('coreOnboarding.basicInfo.nationality')}
          value={nationality}
          onChange={(e) => setNationality(e.target.value)}
          placeholder={t('coreOnboarding.basicInfo.nationalityPlaceholder')}
          icon={Globe}
          required
        />

        {/* Languages */}
        <div>
          <OnboardingLabel required>{t('coreOnboarding.basicInfo.languagesSpoken')}</OnboardingLabel>
          <LanguagesChipInput
            value={languages}
            onChange={setLanguages}
            maxLanguages={10}
            placeholder={t('coreOnboarding.basicInfo.languagesPlaceholder')}
          />
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
