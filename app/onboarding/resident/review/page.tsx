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

export default function ResidentReviewPage() {
  const { t, getSection } = useLanguage();
  const resident = getSection('resident');
  const common = getSection('common');
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [data, setData] = useState<any>({});

  useEffect(() => {
    const coreBasicInfo = safeLocalStorage.get('coreBasicInfo', {});
    const coreDailyLife = safeLocalStorage.get('coreDailyLife', {});
    const coreSocialPersonality = safeLocalStorage.get('coreSocialPersonality', {});
    const coreValuesPreferences = safeLocalStorage.get('coreValuesPreferences', {});
    const livingSituation = safeLocalStorage.get('residentLivingSituation', {});

    setData({
      coreBasicInfo,
      coreDailyLife,
      coreSocialPersonality,
      coreValuesPreferences,
      livingSituation
    });
  }, []);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const supabase = createClient();

      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        toast.error(common.errors?.loginRequired || 'Please log in to continue');
        router.push('/login');
        return;
      }

      // Map CORE data to expected saveOnboardingData format
      const onboardingData = {
        // From coreBasicInfo
        firstName: data.coreBasicInfo?.firstName,
        lastName: data.coreBasicInfo?.lastName,
        dateOfBirth: data.coreBasicInfo?.dateOfBirth,
        nationality: data.coreBasicInfo?.nationality,
        languagesSpoken: data.coreBasicInfo?.languages,

        // From coreDailyLife
        occupationStatus: data.coreDailyLife?.occupationStatus,
        workSchedule: data.coreDailyLife?.workSchedule,
        earlyBirdNightOwl: data.coreDailyLife?.wakeUpTime,
        isSmoker: data.coreDailyLife?.smoking,
        hasPets: data.coreDailyLife?.hasPets,
        petType: data.coreDailyLife?.petType,
        cleanlinessPreference: data.coreDailyLife?.cleanliness,

        // From coreSocialPersonality
        introvertExtrovertScale: data.coreSocialPersonality?.socialEnergy,
        sharedMealsFrequency: data.coreSocialPersonality?.sharedMealsInterest ? 'often' : 'never',
        guestFrequency: data.coreSocialPersonality?.guestFrequency,

        // From coreValuesPreferences
        coreValues: data.coreValuesPreferences?.coreValues,

        // From livingSituation
        ...data.livingSituation,

        completedAt: new Date().toISOString()
      };

      // Save onboarding data to user_profiles table
      const saveResult = await saveOnboardingData(user.id, onboardingData, 'resident');
      if (!saveResult.success) {
        throw new Error('Failed to save profile data');
      }

      // Mark onboarding as completed in users table AND set user_type
      const { error: userUpdateError } = await supabase
        .from('users')
        .update({
          user_type: 'resident',  // ⚡ CRITICAL: Set user_type so middleware can check it
          onboarding_completed: true,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (userUpdateError) {
        // FIXME: Use logger.error('Error updating user onboarding status:', userUpdateError);
        throw new Error('Failed to complete onboarding');
      }

      // ⚡ CRITICAL: Force refresh auth session to update cached user data
      await supabase.auth.refreshSession();

      // ⚡ Verify the update was successful before proceeding
      const { data: verifyUser } = await supabase
        .from('users')
        .select('onboarding_completed')
        .eq('id', user.id)
        .single();

      if (!verifyUser?.onboarding_completed) {
        throw new Error('Failed to verify onboarding completion');
      }

      toast.success(resident.review?.success || 'Profile completed successfully!');

      // Clear localStorage after successful submission
      safeLocalStorage.remove('coreBasicInfo');
      safeLocalStorage.remove('coreDailyLife');
      safeLocalStorage.remove('coreSocialPersonality');
      safeLocalStorage.remove('coreValuesPreferences');
      safeLocalStorage.remove('residentLivingSituation');

      // Redirect to property setup (final step before success)
      router.push('/onboarding/resident/property-setup');
    } catch (err: any) {
      // FIXME: Use logger.error('Error submitting:', err);
      toast.error((common.errors?.error || 'Error: ') + err.message);
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

        <button onClick={() => router.back()} className="mb-6 bg-gradient-to-r from-[#e05747] via-[#e05747] to-[#e05747] bg-clip-text text-transparent">
          <ArrowLeft className="w-6 h-6" />
        </button>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-[#e05747] via-[#e05747] to-[#e05747] bg-clip-text text-transparent mb-2">
            {resident.review?.title || 'Review Your Profile'}
          </h1>
          <p className="text-gray-600">
            {resident.review?.subtitle || 'Please review your information before submitting'}
          </p>
        </div>

        <div className="space-y-4 mb-8">
          {/* Basic Info */}
          {data.coreBasicInfo && Object.keys(data.coreBasicInfo).length > 0 && (
            <div className="bg-white p-6 superellipse-2xl shadow">
              <h2 className="text-lg font-semibold bg-gradient-to-r from-[#e05747] via-[#e05747] to-[#e05747] bg-clip-text text-transparent mb-3">
                {resident.basicInfo?.stepLabel || 'Basic Information'}
              </h2>
              <dl className="space-y-2 text-sm">
                {data.coreBasicInfo.firstName && (
                  <div className="flex justify-between">
                    <dt>{resident.basicInfo?.firstName || 'First Name'}</dt>
                    <dd className="font-medium">{data.coreBasicInfo.firstName}</dd>
                  </div>
                )}
                {data.coreBasicInfo.lastName && (
                  <div className="flex justify-between">
                    <dt>{resident.basicInfo?.lastName || 'Last Name'}</dt>
                    <dd className="font-medium">{data.coreBasicInfo.lastName}</dd>
                  </div>
                )}
                {data.coreBasicInfo.dateOfBirth && (
                  <div className="flex justify-between">
                    <dt>{resident.basicInfo?.dateOfBirth || 'Date of Birth'}</dt>
                    <dd className="font-medium">{data.coreBasicInfo.dateOfBirth}</dd>
                  </div>
                )}
                {data.coreBasicInfo.nationality && (
                  <div className="flex justify-between">
                    <dt>{resident.basicInfo?.nationality || 'Nationality'}</dt>
                    <dd className="font-medium">{data.coreBasicInfo.nationality}</dd>
                  </div>
                )}
              </dl>
            </div>
          )}

          {/* Daily Life */}
          {data.coreDailyLife && Object.keys(data.coreDailyLife).length > 0 && (
            <div className="bg-white p-6 superellipse-2xl shadow">
              <h2 className="text-lg font-semibold bg-gradient-to-r from-[#e05747] via-[#e05747] to-[#e05747] bg-clip-text text-transparent mb-3">
                {resident.review?.dailyLife || 'Daily Life'}
              </h2>
              <dl className="space-y-2 text-sm">
                {data.coreDailyLife.occupationStatus && (
                  <div className="flex justify-between">
                    <dt>{resident.review?.occupation || 'Occupation'}</dt>
                    <dd className="font-medium capitalize">{data.coreDailyLife.occupationStatus.replace(/_/g, ' ')}</dd>
                  </div>
                )}
                {data.coreDailyLife.wakeUpTime && (
                  <div className="flex justify-between">
                    <dt>{resident.review?.wakeUpTime || 'Wake Up Time'}</dt>
                    <dd className="font-medium capitalize">{data.coreDailyLife.wakeUpTime}</dd>
                  </div>
                )}
                {data.coreDailyLife.sleepTime && (
                  <div className="flex justify-between">
                    <dt>{resident.review?.sleepTime || 'Sleep Time'}</dt>
                    <dd className="font-medium capitalize">{data.coreDailyLife.sleepTime}</dd>
                  </div>
                )}
                {data.coreDailyLife.workSchedule && (
                  <div className="flex justify-between">
                    <dt>{resident.review?.workSchedule || 'Work Schedule'}</dt>
                    <dd className="font-medium capitalize">{data.coreDailyLife.workSchedule}</dd>
                  </div>
                )}
                {data.coreDailyLife.cleanliness && (
                  <div className="flex justify-between">
                    <dt>{resident.review?.cleanlinessLevel || 'Cleanliness Level'}</dt>
                    <dd className="font-medium">{data.coreDailyLife.cleanliness}/10</dd>
                  </div>
                )}
              </dl>
            </div>
          )}

          {/* Social & Personality */}
          {data.coreSocialPersonality && Object.keys(data.coreSocialPersonality).length > 0 && (
            <div className="bg-white p-6 superellipse-2xl shadow">
              <h2 className="text-lg font-semibold bg-gradient-to-r from-[#e05747] via-[#e05747] to-[#e05747] bg-clip-text text-transparent mb-3">
                {resident.review?.socialLife || 'Social Life'}
              </h2>
              <dl className="space-y-2 text-sm">
                {data.coreSocialPersonality.socialEnergy !== undefined && (
                  <div className="flex justify-between">
                    <dt>{resident.review?.socialEnergy || 'Social Energy'}</dt>
                    <dd className="font-medium">{data.coreSocialPersonality.socialEnergy}/10</dd>
                  </div>
                )}
                {data.coreSocialPersonality.eventParticipationInterest && (
                  <div className="flex justify-between">
                    <dt>{resident.review?.eventParticipation || 'Event Participation'}</dt>
                    <dd className="font-medium capitalize">{data.coreSocialPersonality.eventParticipationInterest}</dd>
                  </div>
                )}
              </dl>
            </div>
          )}

          {/* Values & Preferences */}
          {data.coreValuesPreferences && Object.keys(data.coreValuesPreferences).length > 0 && (
            <div className="bg-white p-6 superellipse-2xl shadow">
              <h2 className="text-lg font-semibold bg-gradient-to-r from-[#e05747] via-[#e05747] to-[#e05747] bg-clip-text text-transparent mb-3">
                {resident.review?.values || 'Values'}
              </h2>
              <dl className="space-y-2 text-sm">
                {data.coreValuesPreferences.coreValues && data.coreValuesPreferences.coreValues.length > 0 && (
                  <div>
                    <dt className="mb-1">{resident.review?.coreValues || 'Core Values'}</dt>
                    <dd className="font-medium">
                      <div className="flex flex-wrap gap-1">
                        {data.coreValuesPreferences.coreValues.map((value: string) => (
                          <span key={value} className="px-2 py-1 bg-orange-100 text-orange-700 superellipse-lg text-xs capitalize">
                            {value}
                          </span>
                        ))}
                      </div>
                    </dd>
                  </div>
                )}
              </dl>
            </div>
          )}

          {/* Living Situation */}
          {data.livingSituation && Object.keys(data.livingSituation).length > 0 && (
            <div className="bg-white p-6 superellipse-2xl shadow">
              <h2 className="text-lg font-semibold bg-gradient-to-r from-[#e05747] via-[#e05747] to-[#e05747] bg-clip-text text-transparent mb-3">
                {resident.livingSituation?.stepLabel || 'Living Situation'}
              </h2>
              <dl className="space-y-2 text-sm">
                {data.livingSituation.city && (
                  <div className="flex justify-between">
                    <dt>{resident.livingSituation?.city || 'City'}</dt>
                    <dd className="font-medium">{data.livingSituation.city}</dd>
                  </div>
                )}
                {data.livingSituation.moveInDate && (
                  <div className="flex justify-between">
                    <dt>{resident.livingSituation?.moveInDate || 'Move-in Date'}</dt>
                    <dd className="font-medium">{data.livingSituation.moveInDate}</dd>
                  </div>
                )}
              </dl>
            </div>
          )}

        </div>

        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="w-full py-4 rounded-full bg-[color:var(--easy-yellow)] text-black font-semibold text-lg hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              {common.loading || 'Submitting...'}
            </>
          ) : (
            <>
              <CheckCircle2 className="w-5 h-5" />
              {resident.review?.submitButton || 'Submit My Profile'}
            </>
          )}
        </button>
      </div>
    </main>
  );
}
