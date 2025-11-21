'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Globe, Users, Baby, UsersRound, UserPlus, Handshake } from 'lucide-react';
import { safeLocalStorage } from '@/lib/browser';
import { createClient } from '@/lib/auth/supabase-client';
import { toast } from 'sonner';
import { useLanguage } from '@/lib/i18n/use-language';
import { useAutoSave } from '@/lib/hooks/use-auto-save';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import IconBadge from '@/components/IconBadge';
import { LanguagesChipInput, type LanguageChip } from '@/components/LanguagesChipInput';
import LoadingHouse from '@/components/ui/LoadingHouse';

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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <LoadingHouse size={80} />
          <p className="text-gray-600">{common.loadingInfo}</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      {/* Language Switcher */}
      <div className="absolute top-6 right-6 z-50">
        <LanguageSwitcher />
      </div>

      <div className="max-w-md mx-auto">

        {/* Progress bar */}
        <div className="mb-6">
          <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-orange-600 w-1/6 transition-all" />
          </div>
        </div>

        {/* Back button */}
        <button
          onClick={() => router.back()}
          className="mb-6 text-orange-600 hover:opacity-70 transition"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-orange-600 mb-2">
            {onboarding.basicInfo.title}
          </h1>
          <p className="text-gray-600">
            {profileType === 'dependent'
              ? onboarding.basicInfo.subtitleDependent
              : onboarding.basicInfo.subtitle}
          </p>
        </div>

        {/* Dependent Profile Badge */}
        {profileType === 'dependent' && (
          <div className="mb-6 p-4 bg-orange-50 border border-orange-200 rounded-xl flex items-center gap-3">
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
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {onboarding.basicInfo.profileName} <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={profileName}
                onChange={(e) => setProfileName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-100 outline-none transition"
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
              <label className="block text-sm font-medium text-gray-700 mb-3">
                {onboarding.basicInfo.relationship} <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { value: 'child', label: onboarding.basicInfo.relationshipChild, icon: Baby, variant: 'blue' as const },
                  { value: 'family_member', label: onboarding.basicInfo.relationshipFamily, icon: UsersRound, variant: 'purple' as const },
                  { value: 'friend', label: onboarding.basicInfo.relationshipFriend, icon: UserPlus, variant: 'green' as const },
                  { value: 'other', label: onboarding.basicInfo.relationshipOther, icon: Handshake, variant: 'orange' as const },
                ].map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setRelationship(option.value as any)}
                    className={`p-4 rounded-xl border-2 transition text-left ${
                      relationship === option.value
                        ? 'border-orange-500 bg-orange-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="mb-2">
                      <IconBadge icon={option.icon} variant={option.variant} size="lg" />
                    </div>
                    <div className="text-sm font-medium">{option.label}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* First Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {onboarding.basicInfo.firstName}
            </label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-100 outline-none transition"
              placeholder={onboarding.basicInfo.firstNamePlaceholder}
            />
          </div>

          {/* Last Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {onboarding.basicInfo.lastName}
            </label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-100 outline-none transition"
              placeholder={onboarding.basicInfo.lastNamePlaceholder}
            />
          </div>

          {/* Date of Birth */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {onboarding.basicInfo.dateOfBirth}
            </label>
            <input
              type="date"
              value={dateOfBirth}
              onChange={(e) => setDateOfBirth(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-100 outline-none transition"
              placeholder={onboarding.basicInfo.dateOfBirthPlaceholder}
            />
          </div>

          {/* Nationality */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <Globe className="w-4 h-4" />
              {onboarding.basicInfo.nationality}
            </label>
            <input
              type="text"
              value={nationality}
              onChange={(e) => setNationality(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-100 outline-none transition"
              placeholder={onboarding.basicInfo.nationalityPlaceholder}
            />
          </div>

          {/* Languages Spoken */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {onboarding.basicInfo.languagesSpoken}
            </label>
            <LanguagesChipInput
              value={languages}
              onChange={setLanguages}
              maxLanguages={10}
              placeholder={onboarding.basicInfo.languagesPlaceholder}
            />
          </div>
        </div>

        {/* Continue button */}
        <button
          onClick={handleContinue}
          disabled={!canContinue}
          className={`w-full mt-12 py-4 rounded-full font-semibold text-lg transition shadow-md ${
            canContinue
              ? 'bg-gradient-to-r from-[#FFA040] to-[#FFB85C] text-white hover:from-[#FF8C30] hover:to-[#FFA548] hover:shadow-lg'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          {common.continue}
        </button>
      </div>
    </main>
  );
}
