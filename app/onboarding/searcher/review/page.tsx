'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, CheckCircle2, Loader2 } from 'lucide-react';
import { safeLocalStorage } from '@/lib/browser';
import { createClient } from '@/lib/auth/supabase-client';
import { saveOnboardingData } from '@/lib/onboarding-helpers';
import { toast } from 'sonner';
import { useLanguage } from '@/lib/i18n/use-language';
import LanguageSwitcher from '@/components/LanguageSwitcher';

export default function ReviewPage() {
  const { t } = useLanguage();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
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
    if (!mapped) {
      // FIXME: Use logger.warn(`Invalid wake_up_time value: ${value}, using default 'average'`);
      return 'average';
    }
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
    if (!mapped) {
      // FIXME: Use logger.warn(`Invalid sleep_time value: ${value}, using default '23h_01h'`);
      return '23h_01h';
    }
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
    if (!mapped) {
      // FIXME: Use logger.warn(`Invalid sociability_level value: ${value}, using default 'medium'`);
      return 'medium';
    }
    return mapped;
  };

  const mapHomeActivityLevel = (value: string) => {
    // Map from frontend values to database constraint values
    // Database expects: 'quiet', 'social', 'very_active'
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
    // Database expects: 'cozy_evenings', 'independent_living', 'community_events'
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

      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        toast.error('Please log in to continue');
        router.push('/login');
        return;
      }

      // Check if this is a dependent profile
      const isDependent = data.basicInfo?.isDependent === true;

      // Prepare lifestyle array from collected data
      const lifestyleArray = [
        data.dailyHabits?.isSmoker ? 'smoker' : 'non-smoker',
        data.homeLifestyle?.cleanliness || '',
        data.homeLifestyle?.hasPets ? 'has-pets' : 'no-pets',
        data.socialVibe?.socialEnergy || '',
      ].filter(Boolean);

      // Prepare complete onboarding data
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
        // Save to dependent_profiles table
        const dependentProfileData = {
          parent_user_id: user.id,
          profile_name: data.basicInfo.profileName,
          relationship: data.basicInfo.relationship,
          is_active: true,

          // Basic info
          first_name: data.basicInfo.firstName,
          last_name: data.basicInfo.lastName,
          date_of_birth: data.basicInfo.dateOfBirth,
          nationality: data.basicInfo.nationality,
          languages_spoken: data.basicInfo.languages,

          // Professional (from daily habits or preferences)
          occupation_status: data.dailyHabits?.occupationStatus,
          field_of_study_or_work: data.dailyHabits?.fieldOfStudy,
          institution_or_company: data.dailyHabits?.institution,

          // Location & Budget (from preferences)
          current_city: data.preferences?.currentCity,
          preferred_cities: data.preferences?.preferredCities,
          budget_min: data.preferences?.budgetMin,
          budget_max: data.preferences?.budgetMax,
          move_in_date: data.preferences?.moveInDate,
          preferred_accommodation: data.preferences?.accommodationType,

          // Lifestyle (from homeLifestyle)
          cleanliness_preference: data.homeLifestyle?.cleanlinessLevel,
          is_smoker: data.dailyHabits?.isSmoker || false,
          has_pets: data.homeLifestyle?.hasPets || false,
          pet_types: data.homeLifestyle?.petTypes,
          wake_up_time: data.dailyHabits?.wakeUpTime ? mapWakeUpTime(data.dailyHabits.wakeUpTime) : null,
          sleep_time: data.dailyHabits?.sleepTime ? mapSleepTime(data.dailyHabits.sleepTime) : null,

          // Social (from socialVibe)
          introvert_extrovert_scale: data.socialVibe?.introvertExtrovertScale,
          sociability_level: data.socialVibe?.socialEnergy ? mapSociabilityLevel(data.socialVibe.socialEnergy) : null,
          shared_meals_interest: data.socialVibe?.sharedMealsInterest,
          preferred_interaction_type: data.socialVibe?.interactionPreference ? mapPreferredInteractionType(data.socialVibe.interactionPreference) : null,
          home_activity_level: data.socialVibe?.homeActivity ? mapHomeActivityLevel(data.socialVibe.homeActivity) : null,

          // Profile text (from idealColiving)
          bio: data.idealColiving?.bio,
          about_me: data.idealColiving?.aboutMe,
          looking_for: data.idealColiving?.lookingFor,

          // Enhanced profile (from idealColiving)
          core_values: data.idealColiving?.coreValues,
          important_qualities: data.idealColiving?.importantQualities,
          deal_breakers: data.idealColiving?.dealBreakers,
        };

        const { error: insertError } = await supabase
          .from('dependent_profiles')
          .insert(dependentProfileData);

        if (insertError) {
          // FIXME: Use logger.error('Error saving dependent profile:', insertError);
          throw new Error('Failed to save dependent profile');
        }

        // Mark parent user's onboarding as completed
        const { error: userUpdateError } = await supabase
          .from('users')
          .update({
            onboarding_completed: true,
            updated_at: new Date().toISOString()
          })
          .eq('id', user.id);

        if (userUpdateError) {
          // FIXME: Use logger.error('Error updating user onboarding status:', userUpdateError);
          // Don't throw - dependent profile was saved successfully
        }

        // Clear ALL onboarding localStorage after successful dependent profile creation
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
        // Save to user_profiles table (original behavior)
        const result = await saveOnboardingData(user.id, onboardingData, 'searcher');

        if (!result.success) {
          throw new Error('Failed to save profile');
        }

        toast.success('Profile saved successfully!');
      }

      // Clear localStorage after successful submission
      safeLocalStorage.remove('basicInfo');
      safeLocalStorage.remove('dailyHabits');
      safeLocalStorage.remove('homeLifestyle');
      safeLocalStorage.remove('socialVibe');
      safeLocalStorage.remove('idealColiving');
      safeLocalStorage.remove('preferences');
      safeLocalStorage.remove('verification');
      safeLocalStorage.remove('searcherProfileType');

      router.push('/onboarding/searcher/success');
    } catch (err: any) {
      // FIXME: Use logger.error('Error submitting:', err);
      toast.error('Error: ' + err.message);
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-2xl mx-auto">
        {/* Language Switcher */}
        <div className="absolute top-6 right-6 z-50">
          <LanguageSwitcher />
        </div>

        <button onClick={() => router.back()} className="mb-6 text-orange-600">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-orange-600 mb-2">{t('onboarding.review.title')}</h1>
          <p className="text-gray-600">{t('onboarding.review.subtitle')}</p>
        </div>
        <div className="space-y-4 mb-8">
          {data.basicInfo && Object.keys(data.basicInfo).length > 0 && (
            <div className="bg-white p-6 rounded-2xl shadow">
              <h2 className="text-lg font-semibold text-orange-600 mb-3">{t('onboarding.review.basicInfoSection')}</h2>
              <dl className="space-y-2 text-sm">
                {data.basicInfo.firstName && <div className="flex justify-between"><dt>{t('onboarding.review.firstNameLabel')}</dt><dd className="font-medium">{data.basicInfo.firstName}</dd></div>}
                {data.basicInfo.lastName && <div className="flex justify-between"><dt>{t('onboarding.review.lastNameLabel')}</dt><dd className="font-medium">{data.basicInfo.lastName}</dd></div>}
                <div className="flex justify-between"><dt>{t('onboarding.review.dateOfBirthLabel')}</dt><dd className="font-medium">{data.basicInfo.dateOfBirth}</dd></div>
                <div className="flex justify-between"><dt>{t('onboarding.review.nationalityLabel')}</dt><dd className="font-medium">{data.basicInfo.nationality}</dd></div>
                <div className="flex justify-between"><dt>{t('onboarding.review.languagesLabel')}</dt><dd className="font-medium">{data.basicInfo.languages?.join(', ')}</dd></div>
              </dl>
            </div>
          )}
          {data.dailyHabits && Object.keys(data.dailyHabits).length > 0 && (
            <div className="bg-white p-6 rounded-2xl shadow">
              <h2 className="text-lg font-semibold text-orange-600 mb-3">{t('onboarding.review.dailyHabitsSection')}</h2>
              <dl className="space-y-2 text-sm">
                <div className="flex justify-between"><dt>{t('onboarding.review.wakeUpLabel')}</dt><dd className="font-medium capitalize">{data.dailyHabits.wakeUpTime}</dd></div>
                <div className="flex justify-between"><dt>{t('onboarding.review.sleepLabel')}</dt><dd className="font-medium capitalize">{data.dailyHabits.sleepTime}</dd></div>
                <div className="flex justify-between"><dt>{t('onboarding.review.smokerLabel')}</dt><dd className="font-medium">{data.dailyHabits.isSmoker ? t('onboarding.review.yes') : t('onboarding.review.no')}</dd></div>
              </dl>
            </div>
          )}
          {data.idealColiving && Object.keys(data.idealColiving).length > 0 && (
            <div className="bg-white p-6 rounded-2xl shadow">
              <h2 className="text-lg font-semibold text-orange-600 mb-3">{t('onboarding.review.idealColivingSection')}</h2>
              <dl className="space-y-2 text-sm">
                {data.idealColiving.colivingSize && <div className="flex justify-between"><dt>{t('onboarding.review.colivingSizeLabel')}</dt><dd className="font-medium capitalize">{data.idealColiving.colivingSize}</dd></div>}
                {data.idealColiving.genderMix && <div className="flex justify-between"><dt>{t('onboarding.review.genderMixLabel')}</dt><dd className="font-medium capitalize">{data.idealColiving.genderMix.replace(/-/g, ' ')}</dd></div>}
                {data.idealColiving.minAge && <div className="flex justify-between"><dt>{t('onboarding.review.ageRangeLabel')}</dt><dd className="font-medium">{data.idealColiving.minAge} - {data.idealColiving.maxAge}</dd></div>}
                {data.idealColiving.sharedSpaceImportance && <div className="flex justify-between"><dt>{t('onboarding.review.sharedSpaceLabel')}</dt><dd className="font-medium">{data.idealColiving.sharedSpaceImportance}/10</dd></div>}
              </dl>
            </div>
          )}
          {data.preferences && Object.keys(data.preferences).length > 0 && (
            <div className="bg-white p-6 rounded-2xl shadow">
              <h2 className="text-lg font-semibold text-orange-600 mb-3">{t('onboarding.review.preferencesSection')}</h2>
              <dl className="space-y-2 text-sm">
                <div className="flex justify-between"><dt>{t('onboarding.review.budgetLabel')}</dt><dd className="font-medium">€{data.preferences.budgetMin} - €{data.preferences.budgetMax}</dd></div>
                <div className="flex justify-between"><dt>{t('onboarding.review.districtLabel')}</dt><dd className="font-medium">{data.preferences.preferredDistrict || t('onboarding.review.any')}</dd></div>
              </dl>
            </div>
          )}
          {data.verification && data.verification.phoneNumber && (
            <div className="bg-white p-6 rounded-2xl shadow">
              <h2 className="text-lg font-semibold text-orange-600 mb-3">{t('onboarding.review.verificationSection')}</h2>
              <dl className="space-y-2 text-sm">
                {data.verification.phoneNumber && <div className="flex justify-between"><dt>{t('onboarding.review.phoneLabel')}</dt><dd className="font-medium">{data.verification.phoneNumber}</dd></div>}
                {data.verification.idDocument && <div className="flex justify-between"><dt>{t('onboarding.review.idDocumentLabel')}</dt><dd className="font-medium">{t('onboarding.review.uploaded')}</dd></div>}
              </dl>
            </div>
          )}
        </div>
        <button onClick={handleSubmit} disabled={isSubmitting} className="w-full py-4 rounded-full bg-gradient-to-r from-[#FFA040] to-[#FFB85C] text-white font-semibold text-lg hover:from-[#FF8C30] hover:to-[#FFA548] disabled:opacity-50 flex items-center justify-center gap-2">
          {isSubmitting ? (<><Loader2 className="w-5 h-5 animate-spin" />{t('onboarding.review.submitting')}</>) : (<><CheckCircle2 className="w-5 h-5" />{t('onboarding.review.submitMyProfile')}</>)}
        </button>
      </div>
    </main>
  );
}
