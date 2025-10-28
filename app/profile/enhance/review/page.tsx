'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, Loader2, CheckCircle2 } from 'lucide-react';
import { safeLocalStorage } from '@/lib/browser';
import { createClient } from '@/lib/auth/supabase-client';
import { saveOnboardingData } from '@/lib/onboarding-helpers';
import { toast } from 'sonner';

export default function EnhanceReviewPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [userType, setUserType] = useState<string>('');
  const [data, setData] = useState<any>({});

  useEffect(() => {
    const loadData = async () => {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
          router.push('/login');
          return;
        }

        // Get user type
        const { data: userData } = await supabase
          .from('users')
          .select('user_type')
          .eq('id', user.id)
          .single();

        if (userData) {
          setUserType(userData.user_type);
        }

        // Load all data from localStorage
        const aboutData = safeLocalStorage.get('enhanceAbout', {}) as any;
        const hobbiesData = safeLocalStorage.get('enhanceHobbies', {}) as any;
        const valuesData = safeLocalStorage.get('enhanceValues', {}) as any;
        const financialData = safeLocalStorage.get('financialInfo', {}) as any;
        const communityData = safeLocalStorage.get('communityEvents', {}) as any;

        setData({
          about: aboutData,
          hobbies: hobbiesData,
          values: valuesData,
          financial: financialData,
          community: communityData
        });
      } catch (error) {
        // FIXME: Use logger.error('Error loading data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [router]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        toast.error('Please log in to continue');
        return;
      }

      // Combine all enhanced data
      const enhancedData = {
        bio: data.about?.bio || '',
        aboutMe: data.about?.aboutMe || '',
        lookingFor: data.about?.lookingFor || '',
        hobbies: data.hobbies?.hobbies || [],
        coreValues: data.values?.coreValues || [],
        importantQualities: data.values?.importantQualities || [],
        dealBreakers: data.values?.dealBreakers || [],
        // Financial info
        incomeRange: data.financial?.incomeRange || '',
        hasGuarantor: data.financial?.hasGuarantor || false,
        employmentType: data.financial?.employmentType || '',
        // Community events
        eventInterest: data.community?.eventInterest || '',
        enjoySharedMeals: data.community?.enjoySharedMeals || false,
        openToMeetups: data.community?.openToMeetups || false
      };

      const result = await saveOnboardingData(user.id, enhancedData, userType);

      if (result.success) {
        // Clear localStorage
        safeLocalStorage.remove('enhanceAbout');
        safeLocalStorage.remove('enhanceHobbies');
        safeLocalStorage.remove('enhanceValues');
        safeLocalStorage.remove('financialInfo');
        safeLocalStorage.remove('communityEvents');

        toast.success('Profile enhanced successfully!');

        setTimeout(() => {
          router.push(`/dashboard/${userType}`);
        }, 1000);
      } else {
        throw new Error('Failed to save profile');
      }
    } catch (error: any) {
      // FIXME: Use logger.error('Error saving profile:', error);
      toast.error('Error: ' + error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleBack = () => {
    router.push('/profile/enhance/values');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[color:var(--easy-purple)] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const hasAnyData =
    data.about?.bio ||
    data.about?.aboutMe ||
    data.about?.lookingFor ||
    (data.hobbies?.hobbies && data.hobbies.hobbies.length > 0) ||
    (data.values?.coreValues && data.values.coreValues.length > 0) ||
    (data.values?.importantQualities && data.values.importantQualities.length > 0) ||
    (data.values?.dealBreakers && data.values.dealBreakers.length > 0);

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-2xl mx-auto">
        <button onClick={handleBack} className="mb-6 text-[color:var(--easy-purple)]">
          <ArrowLeft className="w-6 h-6" />
        </button>

        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-3">
            <CheckCircle2 className="w-8 h-8 text-[color:var(--easy-purple)]" />
            <h1 className="text-3xl font-bold text-[color:var(--easy-purple)]">Review Your Enhanced Profile</h1>
          </div>
          <p className="text-gray-600">Check your information before saving</p>
        </div>

        {!hasAnyData ? (
          <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6 mb-8">
            <p className="text-yellow-800 text-center">
              You haven't added any enhanced profile information yet. You can go back and add some, or skip this step for now.
            </p>
          </div>
        ) : (
          <div className="space-y-6 mb-8">
            {/* About Section */}
            {(data.about?.bio || data.about?.aboutMe || data.about?.lookingFor) && (
              <div className="bg-white p-6 rounded-2xl shadow">
                <h2 className="text-lg font-semibold text-[color:var(--easy-purple)] mb-4">About You</h2>
                <div className="space-y-3">
                  {data.about.bio && (
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-1">Bio:</p>
                      <p className="text-gray-600">{data.about.bio}</p>
                    </div>
                  )}
                  {data.about.aboutMe && (
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-1">About Me:</p>
                      <p className="text-gray-600">{data.about.aboutMe}</p>
                    </div>
                  )}
                  {data.about.lookingFor && (
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-1">Looking For:</p>
                      <p className="text-gray-600">{data.about.lookingFor}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Hobbies Section */}
            {data.hobbies?.hobbies && data.hobbies.hobbies.length > 0 && (
              <div className="bg-white p-6 rounded-2xl shadow">
                <h2 className="text-lg font-semibold text-[color:var(--easy-purple)] mb-4">Hobbies & Interests</h2>
                <div className="flex flex-wrap gap-2">
                  {data.hobbies.hobbies.map((hobby: string) => (
                    <span
                      key={hobby}
                      className="px-4 py-2 bg-purple-100 text-[color:var(--easy-purple)] rounded-full text-sm font-medium"
                    >
                      {hobby}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Values Section */}
            {(data.values?.coreValues?.length > 0 ||
              data.values?.importantQualities?.length > 0 ||
              data.values?.dealBreakers?.length > 0) && (
              <div className="bg-white p-6 rounded-2xl shadow">
                <h2 className="text-lg font-semibold text-[color:var(--easy-purple)] mb-4">Values & Preferences</h2>

                {data.values.coreValues && data.values.coreValues.length > 0 && (
                  <div className="mb-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">Core Values:</p>
                    <div className="flex flex-wrap gap-2">
                      {data.values.coreValues.map((value: string) => (
                        <span
                          key={value}
                          className="px-3 py-1 bg-purple-100 text-[color:var(--easy-purple)] rounded-full text-sm"
                        >
                          {value}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {data.values.importantQualities && data.values.importantQualities.length > 0 && (
                  <div className="mb-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">Important Qualities:</p>
                    <div className="flex flex-wrap gap-2">
                      {data.values.importantQualities.map((quality: string) => (
                        <span
                          key={quality}
                          className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm"
                        >
                          {quality}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {data.values.dealBreakers && data.values.dealBreakers.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">Deal Breakers:</p>
                    <div className="flex flex-wrap gap-2">
                      {data.values.dealBreakers.map((dealBreaker: string) => (
                        <span
                          key={dealBreaker}
                          className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm"
                        >
                          {dealBreaker}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-4">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex-1 py-4 rounded-full bg-[color:var(--easy-yellow)] text-black font-semibold text-lg hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                Save Profile
              </>
            )}
          </button>
          <button
            onClick={() => router.push(`/dashboard/${userType}`)}
            className="px-8 py-4 rounded-full bg-gray-200 text-gray-700 font-semibold hover:bg-gray-300"
          >
            Skip for Now
          </button>
        </div>
      </div>
    </main>
  );
}
