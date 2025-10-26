'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, CheckCircle2, Loader2 } from 'lucide-react';
import { safeLocalStorage } from '@/lib/browser';
import { createClient } from '@/lib/auth/supabase-client';
import { saveOnboardingData } from '@/lib/onboarding-helpers';
import { toast } from 'sonner';

export default function ReviewPage() {
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
          wake_up_time: data.dailyHabits?.wakeUpTime,
          sleep_time: data.dailyHabits?.sleepTime,

          // Social (from socialVibe)
          introvert_extrovert_scale: data.socialVibe?.introvertExtrovertScale,
          sociability_level: data.socialVibe?.socialEnergy,
          shared_meals_interest: data.socialVibe?.sharedMealsInterest,
          preferred_interaction_type: data.socialVibe?.interactionPreference,
          home_activity_level: data.socialVibe?.homeActivity,

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
          console.error('Error saving dependent profile:', insertError);
          throw new Error('Failed to save dependent profile');
        }

        toast.success(`Profile for ${data.basicInfo.profileName} saved successfully!`);
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
      console.error('Error submitting:', err);
      toast.error('Error: ' + err.message);
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-2xl mx-auto">
        <button onClick={() => router.back()} className="mb-6 text-[color:var(--easy-purple)]">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[color:var(--easy-purple)] mb-2">Review Your Profile</h1>
          <p className="text-gray-600">Make sure everything looks good</p>
        </div>
        <div className="space-y-4 mb-8">
          {data.basicInfo && Object.keys(data.basicInfo).length > 0 && (
            <div className="bg-white p-6 rounded-2xl shadow">
              <h2 className="text-lg font-semibold text-[color:var(--easy-purple)] mb-3">Basic Info</h2>
              <dl className="space-y-2 text-sm">
                {data.basicInfo.firstName && <div className="flex justify-between"><dt>First Name:</dt><dd className="font-medium">{data.basicInfo.firstName}</dd></div>}
                {data.basicInfo.lastName && <div className="flex justify-between"><dt>Last Name:</dt><dd className="font-medium">{data.basicInfo.lastName}</dd></div>}
                <div className="flex justify-between"><dt>Date of Birth:</dt><dd className="font-medium">{data.basicInfo.dateOfBirth}</dd></div>
                <div className="flex justify-between"><dt>Nationality:</dt><dd className="font-medium">{data.basicInfo.nationality}</dd></div>
                <div className="flex justify-between"><dt>Languages:</dt><dd className="font-medium">{data.basicInfo.languages?.join(', ')}</dd></div>
              </dl>
            </div>
          )}
          {data.dailyHabits && Object.keys(data.dailyHabits).length > 0 && (
            <div className="bg-white p-6 rounded-2xl shadow">
              <h2 className="text-lg font-semibold text-[color:var(--easy-purple)] mb-3">Daily Habits</h2>
              <dl className="space-y-2 text-sm">
                <div className="flex justify-between"><dt>Wake-up:</dt><dd className="font-medium capitalize">{data.dailyHabits.wakeUpTime}</dd></div>
                <div className="flex justify-between"><dt>Sleep:</dt><dd className="font-medium capitalize">{data.dailyHabits.sleepTime}</dd></div>
                <div className="flex justify-between"><dt>Smoker:</dt><dd className="font-medium">{data.dailyHabits.isSmoker ? 'Yes' : 'No'}</dd></div>
              </dl>
            </div>
          )}
          {data.idealColiving && Object.keys(data.idealColiving).length > 0 && (
            <div className="bg-white p-6 rounded-2xl shadow">
              <h2 className="text-lg font-semibold text-[color:var(--easy-purple)] mb-3">Ideal Coliving</h2>
              <dl className="space-y-2 text-sm">
                {data.idealColiving.colivingSize && <div className="flex justify-between"><dt>Coliving Size:</dt><dd className="font-medium capitalize">{data.idealColiving.colivingSize}</dd></div>}
                {data.idealColiving.genderMix && <div className="flex justify-between"><dt>Gender Mix:</dt><dd className="font-medium capitalize">{data.idealColiving.genderMix.replace(/-/g, ' ')}</dd></div>}
                {data.idealColiving.minAge && <div className="flex justify-between"><dt>Age Range:</dt><dd className="font-medium">{data.idealColiving.minAge} - {data.idealColiving.maxAge}</dd></div>}
                {data.idealColiving.sharedSpaceImportance && <div className="flex justify-between"><dt>Shared Space:</dt><dd className="font-medium">{data.idealColiving.sharedSpaceImportance}/10</dd></div>}
              </dl>
            </div>
          )}
          {data.preferences && Object.keys(data.preferences).length > 0 && (
            <div className="bg-white p-6 rounded-2xl shadow">
              <h2 className="text-lg font-semibold text-[color:var(--easy-purple)] mb-3">Preferences</h2>
              <dl className="space-y-2 text-sm">
                <div className="flex justify-between"><dt>Budget:</dt><dd className="font-medium">€{data.preferences.budgetMin} - €{data.preferences.budgetMax}</dd></div>
                <div className="flex justify-between"><dt>District:</dt><dd className="font-medium">{data.preferences.preferredDistrict || 'Any'}</dd></div>
              </dl>
            </div>
          )}
          {data.verification && data.verification.phoneNumber && (
            <div className="bg-white p-6 rounded-2xl shadow">
              <h2 className="text-lg font-semibold text-[color:var(--easy-purple)] mb-3">Verification</h2>
              <dl className="space-y-2 text-sm">
                {data.verification.phoneNumber && <div className="flex justify-between"><dt>Phone:</dt><dd className="font-medium">{data.verification.phoneNumber}</dd></div>}
                {data.verification.idDocument && <div className="flex justify-between"><dt>ID Document:</dt><dd className="font-medium">✓ Uploaded</dd></div>}
              </dl>
            </div>
          )}
        </div>
        <button onClick={handleSubmit} disabled={isSubmitting} className="w-full py-4 rounded-full bg-[color:var(--easy-yellow)] text-black font-semibold text-lg hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2">
          {isSubmitting ? (<><Loader2 className="w-5 h-5 animate-spin" />Submitting...</>) : (<><CheckCircle2 className="w-5 h-5" />Submit My Profile</>)}
        </button>
      </div>
    </main>
  );
}
