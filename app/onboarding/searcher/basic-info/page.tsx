'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Globe, Users, Baby, UsersRound, UserPlus, Handshake, User, Calendar } from 'lucide-react';
import { safeLocalStorage } from '@/lib/browser';
import { createClient } from '@/lib/auth/supabase-client';
import { toast } from 'sonner';
import { useLanguage } from '@/lib/i18n/use-language';
import { useAutoSave } from '@/lib/hooks/use-auto-save';
import IconBadge from '@/components/IconBadge';
import { LanguagesChipInput, type LanguageChip } from '@/components/LanguagesChipInput';
import {
  OnboardingLayout,
  OnboardingHeading,
  OnboardingInput,
  OnboardingButton,
  OnboardingSelectionCard,
  OnboardingLabel,
  OnboardingGrid,
} from '@/components/onboarding';

export default function BasicInfoPage() {
  const router = useRouter();
  const supabase = createClient();
  const { t, getSection } = useLanguage();
  const onboarding = getSection('onboarding');
  const common = getSection('common');
  const [isLoading, setIsLoading] = useState(true);
  const saveData = useAutoSave({ key: 'basicInfo' });

  // Check if this is a dependent profile
  const [profileType, setProfileType] = useState<'self' | 'dependent'>('self');
  const [profileName, setProfileName] = useState('');
  const [relationship, setRelationship] = useState<'child' | 'family_member' | 'friend' | 'other'>('child');

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [nationality, setNationality] = useState('');
  const [languages, setLanguages] = useState<LanguageChip[]>([]);

  useEffect(() => {
    loadExistingData();
  }, []);

  const loadExistingData = async () => {
    try {
      // Check if this is a dependent profile from profile-type selection
      const profileTypeData = safeLocalStorage.get('searcherProfileType', {}) as any;
      if (profileTypeData.profileType === 'dependent') {
        setProfileType('dependent');
      }

      // First check localStorage for temporary data
      const saved = safeLocalStorage.get('basicInfo', {}) as any;

      // If dependent profile, load dependent-specific fields
      if (profileTypeData.profileType === 'dependent') {
        setProfileName(saved.profileName || '');
        setRelationship(saved.relationship || 'child');
      }

      // Get current user and their profile from database
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        const { data: profileData } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (profileData) {
          // Pre-fill from database, but localStorage takes priority (if user is in middle of editing)
          setFirstName(saved.firstName || profileData.first_name || '');
          setLastName(saved.lastName || profileData.last_name || '');
          setDateOfBirth(saved.dateOfBirth || profileData.date_of_birth || '');
          setNationality(saved.nationality || profileData.nationality || '');

          // Convert old string array format to new LanguageChip format if needed
          const savedLangs = saved.languages || profileData.languages || [];
          if (Array.isArray(savedLangs) && savedLangs.length > 0) {
            if (typeof savedLangs[0] === 'string') {
              // Old format: convert strings to chips
              setLanguages(savedLangs.map((lang: string) => ({
                code: lang, // Will be migrated properly later
                display: lang,
                canonicalEn: lang,
              })));
            } else {
              // New format: already LanguageChip[]
              setLanguages(savedLangs as LanguageChip[]);
            }
          }
        } else if (saved.firstName) {
          // Fallback to localStorage only if no database data
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
      // FIXME: Use logger.error('Error loading profile data:', error);
      toast.error(onboarding.errors.loadFailed);
    } finally {
      setIsLoading(false);
    }
  };

  const handleContinue = () => {
    // Save data using auto-save hook
    const dataToSave: any = {
      firstName,
      lastName,
      dateOfBirth,
      nationality,
      languages,
    };

    // Add dependent-specific fields if applicable
    if (profileType === 'dependent') {
      dataToSave.profileName = profileName;
      dataToSave.relationship = relationship;
      dataToSave.isDependent = true;
    }

    saveData(dataToSave);

    // Navigate to next step
    router.push('/onboarding/searcher/daily-habits');
  };

  const canContinue = profileType === 'dependent'
    ? firstName && lastName && dateOfBirth && nationality && profileName && relationship
    : firstName && lastName && dateOfBirth && nationality;

  return (
    <OnboardingLayout
      role="searcher"
      backUrl="/onboarding/searcher/profile-type"
      backLabel={common.back}
      progress={{
        current: 1,
        total: 6,
        label: `${t('onboarding.progress.step')} 1 ${t('onboarding.progress.of')} 6`,
        stepName: onboarding.basicInfo.title,
      }}
      isLoading={isLoading}
      loadingText={common.loadingInfo}
    >
      <OnboardingHeading
        role="searcher"
        title={onboarding.basicInfo.title}
        description={
          profileType === 'dependent'
            ? onboarding.basicInfo.subtitleDependent
            : onboarding.basicInfo.subtitle
        }
      />

      {/* Dependent Profile Badge */}
      {profileType === 'dependent' && (
        <div className="mb-6 p-4 bg-orange-50 border border-orange-200 superellipse-xl flex items-center gap-3">
          <Users className="w-5 h-5 text-orange-600" />
          <div>
            <p className="text-sm font-medium text-orange-600">
              {onboarding.basicInfo.dependentBadgeTitle}
            </p>
            <p className="text-xs text-gray-600">
              {onboarding.basicInfo.dependentBadgeSubtitle}
            </p>
          </div>
        </div>
      )}

      {/* Form */}
      <div className="space-y-6">
        {/* Profile Name (dependent only) */}
        {profileType === 'dependent' && (
          <div>
            <OnboardingInput
              role="searcher"
              label={onboarding.basicInfo.profileName}
              required
              value={profileName}
              onChange={(e) => setProfileName(e.target.value)}
              placeholder={onboarding.basicInfo.profileNamePlaceholder}
            />
            <p className="text-xs text-gray-500 mt-1">
              {onboarding.basicInfo.profileNameHelp}
            </p>
          </div>
        )}

        {/* Relationship (dependent only) */}
        {profileType === 'dependent' && (
          <div>
            <OnboardingLabel required>
              {onboarding.basicInfo.relationship}
            </OnboardingLabel>
            <OnboardingGrid columns={2}>
              {[
                { value: 'child', label: onboarding.basicInfo.relationshipChild, icon: Baby, variant: 'blue' as const },
                { value: 'family_member', label: onboarding.basicInfo.relationshipFamily, icon: UsersRound, variant: 'purple' as const },
                { value: 'friend', label: onboarding.basicInfo.relationshipFriend, icon: UserPlus, variant: 'green' as const },
                { value: 'other', label: onboarding.basicInfo.relationshipOther, icon: Handshake, variant: 'orange' as const },
              ].map((option) => (
                <OnboardingSelectionCard
                  key={option.value}
                  role="searcher"
                  selected={relationship === option.value}
                  onClick={() => setRelationship(option.value as any)}
                >
                  <div className="mb-2">
                    <IconBadge icon={option.icon} variant={option.variant} size="lg" />
                  </div>
                  <div className="text-sm font-medium">{option.label}</div>
                </OnboardingSelectionCard>
              ))}
            </OnboardingGrid>
          </div>
        )}

        {/* First Name */}
        <OnboardingInput
          role="searcher"
          label={onboarding.basicInfo.firstName}
          icon={User}
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          placeholder={onboarding.basicInfo.firstNamePlaceholder}
        />

        {/* Last Name */}
        <OnboardingInput
          role="searcher"
          label={onboarding.basicInfo.lastName}
          icon={User}
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          placeholder={onboarding.basicInfo.lastNamePlaceholder}
        />

        {/* Date of Birth */}
        <OnboardingInput
          role="searcher"
          label={onboarding.basicInfo.dateOfBirth}
          icon={Calendar}
          type="date"
          value={dateOfBirth}
          onChange={(e) => setDateOfBirth(e.target.value)}
        />

        {/* Nationality */}
        <OnboardingInput
          role="searcher"
          label={onboarding.basicInfo.nationality}
          icon={Globe}
          value={nationality}
          onChange={(e) => setNationality(e.target.value)}
          placeholder={onboarding.basicInfo.nationalityPlaceholder}
        />

        {/* Languages Spoken */}
        <div>
          <OnboardingLabel>
            {onboarding.basicInfo.languagesSpoken}
          </OnboardingLabel>
          <LanguagesChipInput
            value={languages}
            onChange={setLanguages}
            maxLanguages={10}
            placeholder={onboarding.basicInfo.languagesPlaceholder}
          />
        </div>
      </div>

      {/* Continue button */}
      <div className="mt-8">
        <OnboardingButton
          role="searcher"
          onClick={handleContinue}
          disabled={!canContinue}
        >
          {common.continue}
        </OnboardingButton>
      </div>
    </OnboardingLayout>
  );
}
