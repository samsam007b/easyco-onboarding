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
      toast.error('First name is required');
      return;
    }
    if (!lastName.trim()) {
      toast.error('Last name is required');
      return;
    }
    if (!dateOfBirth) {
      toast.error('Date of birth is required');
      return;
    }
    if (!nationality.trim()) {
      toast.error('Nationality is required');
      return;
    }
    if (languages.length === 0) {
      toast.error('At least one language is required');
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
        label: 'Step 1 of 4',
        stepName: 'Basic Info',
      }}
      isLoading={isLoading}
      loadingText={common.loading}
    >
      <OnboardingHeading
        role={role}
        title="Tell us about yourself"
        description="Let's start with the basics"
      />

      <div className="space-y-6">
        {/* First Name */}
        <OnboardingInput
          role={role}
          type="text"
          label="First Name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          placeholder="John"
          icon={User}
          required
        />

        {/* Last Name */}
        <OnboardingInput
          role={role}
          type="text"
          label="Last Name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          placeholder="Doe"
          icon={User}
          required
        />

        {/* Date of Birth */}
        <OnboardingInput
          role={role}
          type="date"
          label="Date of Birth"
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
          label="Nationality"
          value={nationality}
          onChange={(e) => setNationality(e.target.value)}
          placeholder="French, American, etc."
          icon={Globe}
          required
        />

        {/* Languages */}
        <div>
          <OnboardingLabel required>Languages Spoken</OnboardingLabel>
          <LanguagesChipInput
            value={languages}
            onChange={setLanguages}
            maxLanguages={10}
            placeholder="Start typing a language..."
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
