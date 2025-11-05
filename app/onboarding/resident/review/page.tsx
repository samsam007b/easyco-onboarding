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
    const basicInfo = safeLocalStorage.get('residentBasicInfo', {});
    const lifestyle = safeLocalStorage.get('residentLifestyle', {});
    const livingSituation = safeLocalStorage.get('residentLivingSituation', {});
    const personality = safeLocalStorage.get('residentPersonality', {});

    setData({ basicInfo, lifestyle, livingSituation, personality });
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

      toast.success('Profile completed successfully!');

      // Clear localStorage after successful submission
      safeLocalStorage.remove('residentBasicInfo');
      safeLocalStorage.remove('residentLifestyle');
      safeLocalStorage.remove('residentLivingSituation');
      safeLocalStorage.remove('residentPersonality');

      // ⚡ Add cache-busting parameter to force reload
      router.push('/onboarding/resident/success?completed=true');
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

        <button onClick={() => router.back()} className="mb-6 bg-gradient-to-r from-[#D97B6F] via-[#E8865D] to-[#FF8C4B] bg-clip-text text-transparent">
          <ArrowLeft className="w-6 h-6" />
        </button>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-[#D97B6F] via-[#E8865D] to-[#FF8C4B] bg-clip-text text-transparent mb-2">
            {resident.review?.title || 'Review Your Profile'}
          </h1>
          <p className="text-gray-600">
            {resident.review?.subtitle || 'Please review your information before submitting'}
          </p>
        </div>

        <div className="space-y-4 mb-8">
          {/* Basic Info */}
          {data.basicInfo && Object.keys(data.basicInfo).length > 0 && (
            <div className="bg-white p-6 rounded-2xl shadow">
              <h2 className="text-lg font-semibold bg-gradient-to-r from-[#D97B6F] via-[#E8865D] to-[#FF8C4B] bg-clip-text text-transparent mb-3">
                {resident.basicInfo?.stepLabel || 'Basic Information'}
              </h2>
              <dl className="space-y-2 text-sm">
                {data.basicInfo.firstName && (
                  <div className="flex justify-between">
                    <dt>{resident.basicInfo?.firstName || 'First Name'}</dt>
                    <dd className="font-medium">{data.basicInfo.firstName}</dd>
                  </div>
                )}
                {data.basicInfo.lastName && (
                  <div className="flex justify-between">
                    <dt>{resident.basicInfo?.lastName || 'Last Name'}</dt>
                    <dd className="font-medium">{data.basicInfo.lastName}</dd>
                  </div>
                )}
                {data.basicInfo.dateOfBirth && (
                  <div className="flex justify-between">
                    <dt>{resident.basicInfo?.dateOfBirth || 'Date of Birth'}</dt>
                    <dd className="font-medium">{data.basicInfo.dateOfBirth}</dd>
                  </div>
                )}
                {data.basicInfo.nationality && (
                  <div className="flex justify-between">
                    <dt>{resident.basicInfo?.nationality || 'Nationality'}</dt>
                    <dd className="font-medium">{data.basicInfo.nationality}</dd>
                  </div>
                )}
              </dl>
            </div>
          )}

          {/* Lifestyle */}
          {data.lifestyle && Object.keys(data.lifestyle).length > 0 && (
            <div className="bg-white p-6 rounded-2xl shadow">
              <h2 className="text-lg font-semibold bg-gradient-to-r from-[#D97B6F] via-[#E8865D] to-[#FF8C4B] bg-clip-text text-transparent mb-3">
                {resident.lifestyle?.stepLabel || 'Lifestyle'}
              </h2>
              <dl className="space-y-2 text-sm">
                {data.lifestyle.occupationStatus && (
                  <div className="flex justify-between">
                    <dt>{resident.lifestyle?.occupationStatus || 'Occupation'}</dt>
                    <dd className="font-medium capitalize">{data.lifestyle.occupationStatus}</dd>
                  </div>
                )}
                {data.lifestyle.wakeUpTime && (
                  <div className="flex justify-between">
                    <dt>{resident.lifestyle?.wakeUpTime || 'Wake Up Time'}</dt>
                    <dd className="font-medium capitalize">{data.lifestyle.wakeUpTime}</dd>
                  </div>
                )}
                {data.lifestyle.sleepTime && (
                  <div className="flex justify-between">
                    <dt>{resident.lifestyle?.sleepTime || 'Sleep Time'}</dt>
                    <dd className="font-medium capitalize">{data.lifestyle.sleepTime}</dd>
                  </div>
                )}
              </dl>
            </div>
          )}

          {/* Living Situation */}
          {data.livingSituation && Object.keys(data.livingSituation).length > 0 && (
            <div className="bg-white p-6 rounded-2xl shadow">
              <h2 className="text-lg font-semibold bg-gradient-to-r from-[#D97B6F] via-[#E8865D] to-[#FF8C4B] bg-clip-text text-transparent mb-3">
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

          {/* Personality */}
          {data.personality && Object.keys(data.personality).length > 0 && (
            <div className="bg-white p-6 rounded-2xl shadow">
              <h2 className="text-lg font-semibold bg-gradient-to-r from-[#D97B6F] via-[#E8865D] to-[#FF8C4B] bg-clip-text text-transparent mb-3">
                {resident.personality?.stepLabel || 'Personality'}
              </h2>
              <dl className="space-y-2 text-sm">
                {data.personality.sociabilityLevel && (
                  <div className="flex justify-between">
                    <dt>{resident.personality?.sociabilityLevel || 'Sociability'}</dt>
                    <dd className="font-medium capitalize">{data.personality.sociabilityLevel}</dd>
                  </div>
                )}
                {data.personality.introvertExtrovertScale && (
                  <div className="flex justify-between">
                    <dt>{resident.personality?.introvertExtrovertScale || 'Introvert/Extrovert'}</dt>
                    <dd className="font-medium">{data.personality.introvertExtrovertScale}/5</dd>
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
