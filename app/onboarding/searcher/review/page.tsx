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
    const basicInfo = safeLocalStorage.get('basicInfo', {});
    const dailyHabits = safeLocalStorage.get('dailyHabits', {});
    const homeLifestyle = safeLocalStorage.get('homeLifestyle', {});
    const socialVibe = safeLocalStorage.get('socialVibe', {});
    const idealColiving = safeLocalStorage.get('idealColiving', {});
    const preferences = safeLocalStorage.get('preferences', {});
    const verification = safeLocalStorage.get('verification', {});
    const testerId = safeLocalStorage.get('tester_id', null);

    setData({ basicInfo, dailyHabits, homeLifestyle, socialVibe, idealColiving, preferences, verification, testerId });
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
        toast.error('Please log in to continue');
        router.push('/login');
        return;
      }

      const isDependent = data.basicInfo?.isDependent === true;

      const lifestyleArray = [
        data.dailyHabits?.isSmoker ? 'smoker' : 'non-smoker',
        data.homeLifestyle?.cleanliness || '',
        data.homeLifestyle?.hasPets ? 'has-pets' : 'no-pets',
        data.socialVibe?.socialEnergy || '',
      ].filter(Boolean);

      const onboardingData = {
        ...data.basicInfo,
        ...data.dailyHabits,
        ...data.homeLifestyle,
        ...data.socialVibe,
        ...data.idealColiving,
        ...data.preferences,
        ...data.verification,
        lifestyle: lifestyleArray,
        completedAt: new Date().toISOString()
      };

      if (isDependent) {
        const dependentProfileData = {
          parent_user_id: user.id,
          profile_name: data.basicInfo.profileName,
          relationship: data.basicInfo.relationship,
          is_active: true,
          first_name: data.basicInfo.firstName,
          last_name: data.basicInfo.lastName,
          date_of_birth: data.basicInfo.dateOfBirth,
          nationality: data.basicInfo.nationality,
          languages_spoken: data.basicInfo.languages,
          occupation_status: data.dailyHabits?.occupationStatus,
          field_of_study_or_work: data.dailyHabits?.fieldOfStudy,
          institution_or_company: data.dailyHabits?.institution,
          current_city: data.preferences?.currentCity,
          preferred_cities: data.preferences?.preferredCities,
          budget_min: data.preferences?.budgetMin,
          budget_max: data.preferences?.budgetMax,
          move_in_date: data.preferences?.moveInDate,
          preferred_accommodation: data.preferences?.accommodationType,
          cleanliness_preference: data.homeLifestyle?.cleanlinessLevel,
          is_smoker: data.dailyHabits?.isSmoker || false,
          has_pets: data.homeLifestyle?.hasPets || false,
          pet_types: data.homeLifestyle?.petTypes,
          wake_up_time: data.dailyHabits?.wakeUpTime ? mapWakeUpTime(data.dailyHabits.wakeUpTime) : null,
          sleep_time: data.dailyHabits?.sleepTime ? mapSleepTime(data.dailyHabits.sleepTime) : null,
          introvert_extrovert_scale: data.socialVibe?.introvertExtrovertScale,
          sociability_level: data.socialVibe?.socialEnergy ? mapSociabilityLevel(data.socialVibe.socialEnergy) : null,
          shared_meals_interest: data.socialVibe?.sharedMealsInterest,
          preferred_interaction_type: data.socialVibe?.interactionPreference ? mapPreferredInteractionType(data.socialVibe.interactionPreference) : null,
          home_activity_level: data.socialVibe?.homeActivity ? mapHomeActivityLevel(data.socialVibe.homeActivity) : null,
          bio: data.idealColiving?.bio,
          about_me: data.idealColiving?.aboutMe,
          looking_for: data.idealColiving?.lookingFor,
          core_values: data.idealColiving?.coreValues,
          important_qualities: data.idealColiving?.importantQualities,
          deal_breakers: data.idealColiving?.dealBreakers,
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
        safeLocalStorage.remove('basicInfo');
        safeLocalStorage.remove('dailyHabits');
        safeLocalStorage.remove('homeLifestyle');
        safeLocalStorage.remove('socialVibe');
        safeLocalStorage.remove('idealColiving');
        safeLocalStorage.remove('preferences');
        safeLocalStorage.remove('verification');

        toast.success(`Profile for ${data.basicInfo.profileName} saved successfully!`);
        router.push('/dashboard/searcher');
      } else {
        const result = await saveOnboardingData(user.id, onboardingData, 'searcher');

        if (!result.success) {
          throw new Error('Failed to save profile');
        }

        toast.success('Profile saved successfully!');
      }

      safeLocalStorage.remove('basicInfo');
      safeLocalStorage.remove('dailyHabits');
      safeLocalStorage.remove('homeLifestyle');
      safeLocalStorage.remove('socialVibe');
      safeLocalStorage.remove('idealColiving');
      safeLocalStorage.remove('preferences');
      safeLocalStorage.remove('verification');
      safeLocalStorage.remove('searcherProfileType');

      router.push('/onboarding/searcher/enhance');
    } catch (err: any) {
      toast.error('Error: ' + err.message);
      setIsSubmitting(false);
    }
  };

  return (
    <OnboardingLayout
      role="searcher"
      backUrl="/onboarding/searcher/verification"
      backLabel={t('common.back')}
      progress={{
        current: 8,
        total: 8,
        label: 'Étape 8 sur 8',
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
        {data.basicInfo && Object.keys(data.basicInfo).length > 0 && (
          <div className="p-4 bg-orange-50 rounded-xl border border-orange-100">
            <div className="flex items-center gap-2 mb-3">
              <User className="w-5 h-5 text-orange-600" />
              <h2 className="font-semibold text-gray-900">{t('onboarding.review.basicInfoSection')}</h2>
            </div>
            <dl className="space-y-2 text-sm">
              {data.basicInfo.firstName && (
                <div className="flex justify-between">
                  <dt className="text-gray-600">{t('onboarding.review.firstNameLabel')}</dt>
                  <dd className="font-medium text-gray-900">{data.basicInfo.firstName}</dd>
                </div>
              )}
              {data.basicInfo.lastName && (
                <div className="flex justify-between">
                  <dt className="text-gray-600">{t('onboarding.review.lastNameLabel')}</dt>
                  <dd className="font-medium text-gray-900">{data.basicInfo.lastName}</dd>
                </div>
              )}
              {data.basicInfo.dateOfBirth && (
                <div className="flex justify-between">
                  <dt className="text-gray-600">{t('onboarding.review.dateOfBirthLabel')}</dt>
                  <dd className="font-medium text-gray-900">{data.basicInfo.dateOfBirth}</dd>
                </div>
              )}
              {data.basicInfo.nationality && (
                <div className="flex justify-between">
                  <dt className="text-gray-600">{t('onboarding.review.nationalityLabel')}</dt>
                  <dd className="font-medium text-gray-900">{data.basicInfo.nationality}</dd>
                </div>
              )}
              {data.basicInfo.languages && (
                <div className="flex justify-between">
                  <dt className="text-gray-600">{t('onboarding.review.languagesLabel')}</dt>
                  <dd className="font-medium text-gray-900">{data.basicInfo.languages?.join(', ')}</dd>
                </div>
              )}
            </dl>
          </div>
        )}

        {/* Daily Habits */}
        {data.dailyHabits && Object.keys(data.dailyHabits).length > 0 && (
          <div className="p-4 bg-orange-50 rounded-xl border border-orange-100">
            <div className="flex items-center gap-2 mb-3">
              <Clock className="w-5 h-5 text-orange-600" />
              <h2 className="font-semibold text-gray-900">{t('onboarding.review.dailyHabitsSection')}</h2>
            </div>
            <dl className="space-y-2 text-sm">
              {data.dailyHabits.wakeUpTime && (
                <div className="flex justify-between">
                  <dt className="text-gray-600">{t('onboarding.review.wakeUpLabel')}</dt>
                  <dd className="font-medium text-gray-900 capitalize">{data.dailyHabits.wakeUpTime}</dd>
                </div>
              )}
              {data.dailyHabits.sleepTime && (
                <div className="flex justify-between">
                  <dt className="text-gray-600">{t('onboarding.review.sleepLabel')}</dt>
                  <dd className="font-medium text-gray-900 capitalize">{data.dailyHabits.sleepTime}</dd>
                </div>
              )}
              <div className="flex justify-between">
                <dt className="text-gray-600">{t('onboarding.review.smokerLabel')}</dt>
                <dd className="font-medium text-gray-900">{data.dailyHabits.isSmoker ? t('onboarding.review.yes') : t('onboarding.review.no')}</dd>
              </div>
            </dl>
          </div>
        )}

        {/* Ideal Coliving */}
        {data.idealColiving && Object.keys(data.idealColiving).length > 0 && (
          <div className="p-4 bg-orange-50 rounded-xl border border-orange-100">
            <div className="flex items-center gap-2 mb-3">
              <Home className="w-5 h-5 text-orange-600" />
              <h2 className="font-semibold text-gray-900">{t('onboarding.review.idealColivingSection')}</h2>
            </div>
            <dl className="space-y-2 text-sm">
              {data.idealColiving.colivingSize && (
                <div className="flex justify-between">
                  <dt className="text-gray-600">{t('onboarding.review.colivingSizeLabel')}</dt>
                  <dd className="font-medium text-gray-900 capitalize">{data.idealColiving.colivingSize}</dd>
                </div>
              )}
              {data.idealColiving.genderMix && (
                <div className="flex justify-between">
                  <dt className="text-gray-600">{t('onboarding.review.genderMixLabel')}</dt>
                  <dd className="font-medium text-gray-900 capitalize">{data.idealColiving.genderMix.replace(/-/g, ' ')}</dd>
                </div>
              )}
              {data.idealColiving.minAge && (
                <div className="flex justify-between">
                  <dt className="text-gray-600">{t('onboarding.review.ageRangeLabel')}</dt>
                  <dd className="font-medium text-gray-900">{data.idealColiving.minAge} - {data.idealColiving.maxAge}</dd>
                </div>
              )}
              {data.idealColiving.sharedSpaceImportance && (
                <div className="flex justify-between">
                  <dt className="text-gray-600">{t('onboarding.review.sharedSpaceLabel')}</dt>
                  <dd className="font-medium text-gray-900">{data.idealColiving.sharedSpaceImportance}/10</dd>
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
