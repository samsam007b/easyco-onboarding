'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle2, Loader2, User, Clock, Home, Users, Settings } from 'lucide-react';
import { safeLocalStorage } from '@/lib/browser';
import { createClient } from '@/lib/auth/supabase-client';
import { saveOnboardingData } from '@/lib/onboarding-helpers';
import { toast } from 'sonner';
import { useLanguage } from '@/lib/i18n/use-language';
import {
  OnboardingLayout,
  OnboardingHeading,
  OnboardingButton,
} from '@/components/onboarding';

export default function ReviewPage() {
  const { t } = useLanguage();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<any>({});

  useEffect(() => {
    // Load from new CORE localStorage keys
    const coreBasicInfo = safeLocalStorage.get('coreBasicInfo', {});
    const coreDailyLife = safeLocalStorage.get('coreDailyLife', {});
    const coreSocialPersonality = safeLocalStorage.get('coreSocialPersonality', {});
    const coreValuesPreferences = safeLocalStorage.get('coreValuesPreferences', {});
    const preferences = safeLocalStorage.get('preferences', {});
    const verification = safeLocalStorage.get('verification', {});
    const testerId = safeLocalStorage.get('tester_id', null);

    setData({
      coreBasicInfo,
      coreDailyLife,
      coreSocialPersonality,
      coreValuesPreferences,
      preferences,
      verification,
      testerId
    });
    setIsLoading(false);
  }, []);

  // Map frontend values to database constraint values with validation
  const mapWakeUpTime = (value: string): string | null => {
    if (!value) return null;
    const mapping: Record<string, string> = {
      'early': 'early',
      'moderate': 'average',
      'average': 'average',
      'late': 'late'
    };
    const mapped = mapping[value.toLowerCase()];
    if (!mapped) return 'average';
    return mapped;
  };

  const mapSleepTime = (value: string): string | null => {
    if (!value) return null;
    const mapping: Record<string, string> = {
      'early': 'before_23h',
      'moderate': '23h_01h',
      'late': 'after_01h',
      'before_23h': 'before_23h',
      '23h_01h': '23h_01h',
      'after_01h': 'after_01h'
    };
    const mapped = mapping[value.toLowerCase()];
    if (!mapped) return '23h_01h';
    return mapped;
  };

  const mapSociabilityLevel = (value: string): string | null => {
    if (!value) return null;
    const mapping: Record<string, string> = {
      'introvert': 'low',
      'moderate': 'medium',
      'extrovert': 'high',
      'low': 'low',
      'medium': 'medium',
      'high': 'high'
    };
    const mapped = mapping[value.toLowerCase()];
    if (!mapped) return 'medium';
    return mapped;
  };

  const mapHomeActivityLevel = (value: string) => {
    const mapping: Record<string, string> = {
      'calm': 'quiet',
      'balanced': 'social',
      'lively': 'very_active',
      'quiet': 'quiet',
      'social': 'social',
      'very_active': 'very_active'
    };
    return mapping[value] || value;
  };

  const mapPreferredInteractionType = (value: string) => {
    const mapping: Record<string, string> = {
      'cozy': 'cozy_evenings',
      'independent': 'independent_living',
      'community': 'community_events',
      'cozy_evenings': 'cozy_evenings',
      'independent_living': 'independent_living',
      'community_events': 'community_events'
    };
    return mapping[value] || value;
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const supabase = createClient();

      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        toast.error(t('common.errors.loginRequired') || 'Please log in to continue');
        router.push('/login');
        return;
      }

      const isDependent = data.coreBasicInfo?.isDependent === true;

      const lifestyleArray = [
        data.coreDailyLife?.smoking ? 'smoker' : 'non-smoker',
        data.coreDailyLife?.cleanliness ? `cleanliness-${data.coreDailyLife.cleanliness}` : '',
        data.coreDailyLife?.hasPets ? 'has-pets' : 'no-pets',
        data.coreSocialPersonality?.socialEnergy ? `social-energy-${data.coreSocialPersonality.socialEnergy}` : '',
      ].filter(Boolean);

      // Map CORE data to expected saveOnboardingData format
      const onboardingData = {
        // From coreBasicInfo
        firstName: data.coreBasicInfo?.firstName,
        lastName: data.coreBasicInfo?.lastName,
        dateOfBirth: data.coreBasicInfo?.dateOfBirth,
        nationality: data.coreBasicInfo?.nationality,
        languagesSpoken: data.coreBasicInfo?.languages, // Map 'languages' to 'languagesSpoken'

        // From coreDailyLife
        occupationStatus: data.coreDailyLife?.occupationStatus,
        workSchedule: data.coreDailyLife?.workSchedule,
        earlyBirdNightOwl: data.coreDailyLife?.wakeUpTime, // Map wakeUpTime to earlyBirdNightOwl
        isSmoker: data.coreDailyLife?.smoking,
        hasPets: data.coreDailyLife?.hasPets,
        petType: data.coreDailyLife?.petType,
        cleanlinessPreference: data.coreDailyLife?.cleanliness, // Map cleanliness to cleanlinessPreference

        // From coreSocialPersonality
        introvertExtrovertScale: data.coreSocialPersonality?.socialEnergy, // Map socialEnergy to introvertExtrovertScale
        sharedMealsFrequency: data.coreSocialPersonality?.sharedMealsInterest ? 'often' : 'never',
        guestFrequency: data.coreSocialPersonality?.guestFrequency,

        // From coreValuesPreferences
        coreValues: data.coreValuesPreferences?.coreValues,

        // From preferences (Searcher-specific)
        ...data.preferences,

        // From verification
        ...data.verification,

        lifestyle: lifestyleArray,
        completedAt: new Date().toISOString()
      };

      if (isDependent) {
        const dependentProfileData = {
          parent_user_id: user.id,
          profile_name: data.coreBasicInfo.profileName,
          relationship: data.coreBasicInfo.relationship,
          is_active: true,
          first_name: data.coreBasicInfo.firstName,
          last_name: data.coreBasicInfo.lastName,
          date_of_birth: data.coreBasicInfo.dateOfBirth,
          nationality: data.coreBasicInfo.nationality,
          languages_spoken: data.coreBasicInfo.languages,
          occupation_status: data.coreDailyLife?.occupationStatus,
          field_of_study_or_work: data.coreDailyLife?.fieldOfStudy,
          institution_or_company: data.coreDailyLife?.institution,
          current_city: data.preferences?.currentCity,
          preferred_cities: data.preferences?.preferredCities,
          budget_min: data.preferences?.budgetMin,
          budget_max: data.preferences?.budgetMax,
          move_in_date: data.preferences?.moveInDate,
          preferred_accommodation: data.preferences?.accommodationType,
          cleanliness_preference: data.coreDailyLife?.cleanliness,
          is_smoker: data.coreDailyLife?.smoking || false,
          has_pets: data.coreDailyLife?.hasPets || false,
          pet_types: data.coreDailyLife?.petType ? [data.coreDailyLife.petType] : null,
          wake_up_time: data.coreDailyLife?.wakeUpTime ? mapWakeUpTime(data.coreDailyLife.wakeUpTime) : null,
          sleep_time: data.coreDailyLife?.sleepTime ? mapSleepTime(data.coreDailyLife.sleepTime) : null,
          introvert_extrovert_scale: data.coreSocialPersonality?.socialEnergy || 5,
          sociability_level: data.coreSocialPersonality?.eventParticipationInterest || 'medium',
          shared_meals_interest: data.coreSocialPersonality?.sharedMealsInterest,
          preferred_interaction_type: 'independent_living',
          home_activity_level: 'social',
          bio: null,
          about_me: null,
          looking_for: null,
          core_values: data.coreValuesPreferences?.coreValues,
          important_qualities: null,
          deal_breakers: null,
        };

        const { error: insertError } = await supabase
          .from('dependent_profiles')
          .insert(dependentProfileData);

        if (insertError) {
          throw new Error('Failed to save dependent profile');
        }

        const { error: userUpdateError } = await supabase
          .from('users')
          .update({
            onboarding_completed: true,
            updated_at: new Date().toISOString()
          })
          .eq('id', user.id);

        safeLocalStorage.remove('searcherProfileType');
        safeLocalStorage.remove('coreBasicInfo');
        safeLocalStorage.remove('coreDailyLife');
        safeLocalStorage.remove('coreSocialPersonality');
        safeLocalStorage.remove('coreValuesPreferences');
        safeLocalStorage.remove('preferences');
        safeLocalStorage.remove('verification');

        toast.success(`${t('onboarding.review.dependentProfileSaved') || 'Profile saved'}: ${data.coreBasicInfo.profileName}`);
        router.push('/dashboard/searcher');
      } else {
        const result = await saveOnboardingData(user.id, onboardingData, 'searcher');

        if (!result.success) {
          throw new Error('Failed to save profile');
        }

        toast.success(t('onboarding.review.profileSaved') || 'Profile saved successfully!');
      }

      safeLocalStorage.remove('coreBasicInfo');
      safeLocalStorage.remove('coreDailyLife');
      safeLocalStorage.remove('coreSocialPersonality');
      safeLocalStorage.remove('coreValuesPreferences');
      safeLocalStorage.remove('preferences');
      safeLocalStorage.remove('verification');
      safeLocalStorage.remove('searcherProfileType');

      router.push('/onboarding/searcher/enhance');
    } catch (err: any) {
      toast.error((t('common.errors.error') || 'Error: ') + err.message);
      setIsSubmitting(false);
    }
  };

  return (
    <OnboardingLayout
      role="searcher"
      backUrl="/onboarding/searcher/verification"
      backLabel={t('common.back')}
      progress={{
        current: 6,
        total: 6,
        label: `${t('onboarding.progress.step')} 6 ${t('onboarding.progress.of')} 6`,
        stepName: t('onboarding.review.title'),
      }}
      isLoading={isLoading}
      loadingText={t('common.loading')}
    >
      {/* Header */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-8 h-8 text-orange-600" />
        </div>
        <OnboardingHeading
          role="searcher"
          title={t('onboarding.review.title')}
          description={t('onboarding.review.subtitle')}
        />
      </div>

      <div className="space-y-4 mb-8">
        {/* Basic Info */}
        {data.coreBasicInfo && Object.keys(data.coreBasicInfo).length > 0 && (
          <div className="p-4 bg-orange-50 rounded-xl border border-orange-100">
            <div className="flex items-center gap-2 mb-3">
              <User className="w-5 h-5 text-orange-600" />
              <h2 className="font-semibold text-gray-900">{t('onboarding.review.basicInfoSection')}</h2>
            </div>
            <dl className="space-y-2 text-sm">
              {data.coreBasicInfo.firstName && (
                <div className="flex justify-between">
                  <dt className="text-gray-600">{t('onboarding.review.firstNameLabel')}</dt>
                  <dd className="font-medium text-gray-900">{data.coreBasicInfo.firstName}</dd>
                </div>
              )}
              {data.coreBasicInfo.lastName && (
                <div className="flex justify-between">
                  <dt className="text-gray-600">{t('onboarding.review.lastNameLabel')}</dt>
                  <dd className="font-medium text-gray-900">{data.coreBasicInfo.lastName}</dd>
                </div>
              )}
              {data.coreBasicInfo.dateOfBirth && (
                <div className="flex justify-between">
                  <dt className="text-gray-600">{t('onboarding.review.dateOfBirthLabel')}</dt>
                  <dd className="font-medium text-gray-900">{data.coreBasicInfo.dateOfBirth}</dd>
                </div>
              )}
              {data.coreBasicInfo.nationality && (
                <div className="flex justify-between">
                  <dt className="text-gray-600">{t('onboarding.review.nationalityLabel')}</dt>
                  <dd className="font-medium text-gray-900">{data.coreBasicInfo.nationality}</dd>
                </div>
              )}
              {data.coreBasicInfo.languages && (
                <div className="flex justify-between">
                  <dt className="text-gray-600">{t('onboarding.review.languagesLabel')}</dt>
                  <dd className="font-medium text-gray-900">
                    {Array.isArray(data.coreBasicInfo.languages)
                      ? data.coreBasicInfo.languages.map((l: any) =>
                          typeof l === 'string' ? l : l.display || l.canonicalEn || l.code
                        ).join(', ')
                      : data.coreBasicInfo.languages}
                  </dd>
                </div>
              )}
            </dl>
          </div>
        )}

        {/* Daily Life */}
        {data.coreDailyLife && Object.keys(data.coreDailyLife).length > 0 && (
          <div className="p-4 bg-orange-50 rounded-xl border border-orange-100">
            <div className="flex items-center gap-2 mb-3">
              <Clock className="w-5 h-5 text-orange-600" />
              <h2 className="font-semibold text-gray-900">{t('onboarding.review.dailyLifeSection')}</h2>
            </div>
            <dl className="space-y-2 text-sm">
              {data.coreDailyLife.occupationStatus && (
                <div className="flex justify-between">
                  <dt className="text-gray-600">{t('onboarding.review.occupationLabel')}</dt>
                  <dd className="font-medium text-gray-900 capitalize">{data.coreDailyLife.occupationStatus.replace(/_/g, ' ')}</dd>
                </div>
              )}
              {data.coreDailyLife.wakeUpTime && (
                <div className="flex justify-between">
                  <dt className="text-gray-600">{t('onboarding.review.wakeUpLabel')}</dt>
                  <dd className="font-medium text-gray-900 capitalize">{data.coreDailyLife.wakeUpTime}</dd>
                </div>
              )}
              {data.coreDailyLife.sleepTime && (
                <div className="flex justify-between">
                  <dt className="text-gray-600">{t('onboarding.review.sleepLabel')}</dt>
                  <dd className="font-medium text-gray-900 capitalize">{data.coreDailyLife.sleepTime}</dd>
                </div>
              )}
              {data.coreDailyLife.workSchedule && (
                <div className="flex justify-between">
                  <dt className="text-gray-600">{t('onboarding.review.workScheduleLabel')}</dt>
                  <dd className="font-medium text-gray-900 capitalize">{data.coreDailyLife.workSchedule}</dd>
                </div>
              )}
              <div className="flex justify-between">
                <dt className="text-gray-600">{t('onboarding.review.smokerLabel')}</dt>
                <dd className="font-medium text-gray-900">{data.coreDailyLife.smoking ? t('common.yes') : t('common.no')}</dd>
              </div>
              {data.coreDailyLife.hasPets !== undefined && (
                <div className="flex justify-between">
                  <dt className="text-gray-600">{t('onboarding.review.petsLabel')}</dt>
                  <dd className="font-medium text-gray-900">
                    {data.coreDailyLife.hasPets
                      ? `${t('common.yes')}${data.coreDailyLife.petType ? ` (${data.coreDailyLife.petType})` : ''}`
                      : t('common.no')}
                  </dd>
                </div>
              )}
              {data.coreDailyLife.cleanliness && (
                <div className="flex justify-between">
                  <dt className="text-gray-600">{t('onboarding.review.cleanlinessLabel')}</dt>
                  <dd className="font-medium text-gray-900">{data.coreDailyLife.cleanliness}/10</dd>
                </div>
              )}
            </dl>
          </div>
        )}

        {/* Social & Personality */}
        {data.coreSocialPersonality && Object.keys(data.coreSocialPersonality).length > 0 && (
          <div className="p-4 bg-orange-50 rounded-xl border border-orange-100">
            <div className="flex items-center gap-2 mb-3">
              <Users className="w-5 h-5 text-orange-600" />
              <h2 className="font-semibold text-gray-900">{t('onboarding.review.socialLifeSection')}</h2>
            </div>
            <dl className="space-y-2 text-sm">
              {data.coreSocialPersonality.socialEnergy !== undefined && (
                <div className="flex justify-between">
                  <dt className="text-gray-600">{t('onboarding.review.socialEnergyLabel')}</dt>
                  <dd className="font-medium text-gray-900">{data.coreSocialPersonality.socialEnergy}/10</dd>
                </div>
              )}
              {data.coreSocialPersonality.sharedMealsInterest !== undefined && (
                <div className="flex justify-between">
                  <dt className="text-gray-600">{t('onboarding.review.sharedMealsLabel')}</dt>
                  <dd className="font-medium text-gray-900">{data.coreSocialPersonality.sharedMealsInterest ? t('onboarding.review.interested') : t('onboarding.review.notInterested')}</dd>
                </div>
              )}
              {data.coreSocialPersonality.eventParticipationInterest && (
                <div className="flex justify-between">
                  <dt className="text-gray-600">{t('onboarding.review.eventParticipationLabel')}</dt>
                  <dd className="font-medium text-gray-900 capitalize">{data.coreSocialPersonality.eventParticipationInterest}</dd>
                </div>
              )}
              {data.coreSocialPersonality.guestFrequency && (
                <div className="flex justify-between">
                  <dt className="text-gray-600">{t('onboarding.review.guestFrequencyLabel')}</dt>
                  <dd className="font-medium text-gray-900 capitalize">{data.coreSocialPersonality.guestFrequency}</dd>
                </div>
              )}
            </dl>
          </div>
        )}

        {/* Values & Preferences */}
        {data.coreValuesPreferences && Object.keys(data.coreValuesPreferences).length > 0 && (
          <div className="p-4 bg-orange-50 rounded-xl border border-orange-100">
            <div className="flex items-center gap-2 mb-3">
              <Home className="w-5 h-5 text-orange-600" />
              <h2 className="font-semibold text-gray-900">{t('onboarding.review.valuesSection')}</h2>
            </div>
            <dl className="space-y-2 text-sm">
              {data.coreValuesPreferences.coreValues && data.coreValuesPreferences.coreValues.length > 0 && (
                <div>
                  <dt className="text-gray-600 mb-1">{t('onboarding.review.coreValuesLabel')}</dt>
                  <dd className="font-medium text-gray-900">
                    <div className="flex flex-wrap gap-1">
                      {data.coreValuesPreferences.coreValues.map((value: string) => (
                        <span key={value} className="px-2 py-1 bg-orange-100 text-orange-700 rounded-lg text-xs capitalize">
                          {value}
                        </span>
                      ))}
                    </div>
                  </dd>
                </div>
              )}
              {data.coreValuesPreferences.opennessToSharing && (
                <div className="flex justify-between">
                  <dt className="text-gray-600">{t('onboarding.review.opennessLabel')}</dt>
                  <dd className="font-medium text-gray-900 capitalize">{data.coreValuesPreferences.opennessToSharing.replace(/_/g, ' ')}</dd>
                </div>
              )}
              {data.coreValuesPreferences.culturalOpenness && (
                <div className="flex justify-between">
                  <dt className="text-gray-600">{t('onboarding.review.culturalOpennessLabel')}</dt>
                  <dd className="font-medium text-gray-900 capitalize">{data.coreValuesPreferences.culturalOpenness}</dd>
                </div>
              )}
            </dl>
          </div>
        )}

        {/* Preferences */}
        {data.preferences && Object.keys(data.preferences).length > 0 && (
          <div className="p-4 bg-orange-50 rounded-xl border border-orange-100">
            <div className="flex items-center gap-2 mb-3">
              <Settings className="w-5 h-5 text-orange-600" />
              <h2 className="font-semibold text-gray-900">{t('onboarding.review.preferencesSection')}</h2>
            </div>
            <dl className="space-y-2 text-sm">
              {data.preferences.budgetMin && (
                <div className="flex justify-between">
                  <dt className="text-gray-600">{t('onboarding.review.budgetLabel')}</dt>
                  <dd className="font-medium text-gray-900">€{data.preferences.budgetMin} - €{data.preferences.budgetMax}</dd>
                </div>
              )}
              <div className="flex justify-between">
                <dt className="text-gray-600">{t('onboarding.review.districtLabel')}</dt>
                <dd className="font-medium text-gray-900">{data.preferences.preferredDistrict || t('onboarding.review.any')}</dd>
              </div>
            </dl>
          </div>
        )}

        {/* Verification */}
        {data.verification && data.verification.phoneNumber && (
          <div className="p-4 bg-orange-50 rounded-xl border border-orange-100">
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle2 className="w-5 h-5 text-orange-600" />
              <h2 className="font-semibold text-gray-900">{t('onboarding.review.verificationSection')}</h2>
            </div>
            <dl className="space-y-2 text-sm">
              {data.verification.phoneNumber && (
                <div className="flex justify-between">
                  <dt className="text-gray-600">{t('onboarding.review.phoneLabel')}</dt>
                  <dd className="font-medium text-gray-900">{data.verification.phoneNumber}</dd>
                </div>
              )}
              {data.verification.idDocument && (
                <div className="flex justify-between">
                  <dt className="text-gray-600">{t('onboarding.review.idDocumentLabel')}</dt>
                  <dd className="font-medium text-green-600">{t('onboarding.review.uploaded')}</dd>
                </div>
              )}
            </dl>
          </div>
        )}
      </div>

      <OnboardingButton
        role="searcher"
        onClick={handleSubmit}
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <span className="flex items-center justify-center gap-2">
            <Loader2 className="w-5 h-5 animate-spin" />
            {t('onboarding.review.submitting')}
          </span>
        ) : (
          <span className="flex items-center justify-center gap-2">
            <CheckCircle2 className="w-5 h-5" />
            {t('onboarding.review.submitMyProfile')}
          </span>
        )}
      </OnboardingButton>
    </OnboardingLayout>
  );
}
