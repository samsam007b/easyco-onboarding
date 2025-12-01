'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle2, AlertCircle } from 'lucide-react';
import { safeLocalStorage } from '@/lib/browser';
import { createClient } from '@/lib/auth/supabase-client';
import { saveOnboardingData } from '@/lib/onboarding-helpers';
import { toast } from 'sonner';
import {
  EnhanceProfileLayout,
  EnhanceProfileHeading,
  EnhanceProfileButton,
  EnhanceProfileTag,
  EnhanceProfileSection,
  EnhanceProfileInfoBox,
} from '@/components/enhance-profile';

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

  const hasAnyData =
    data.about?.bio ||
    data.about?.aboutMe ||
    data.about?.lookingFor ||
    (data.hobbies?.hobbies && data.hobbies.hobbies.length > 0) ||
    (data.values?.coreValues && data.values.coreValues.length > 0) ||
    (data.values?.importantQualities && data.values.importantQualities.length > 0) ||
    (data.values?.dealBreakers && data.values.dealBreakers.length > 0);

  return (
    <EnhanceProfileLayout
      role="searcher"
      backUrl="/profile/enhance/community"
      backLabel="Back"
      progress={{
        current: 6,
        total: 6,
        label: 'Step 6 of 6',
        stepName: 'Review & Save',
      }}
      isLoading={isLoading}
      loadingText="Loading your profile..."
    >
      <EnhanceProfileHeading
        role="searcher"
        title="Review Your Enhanced Profile"
        description="Check your information before saving"
        icon={<CheckCircle2 className="w-8 h-8 text-orange-600" />}
      />

      {!hasAnyData ? (
        <EnhanceProfileInfoBox role="searcher" icon="⚠️">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
            <p className="text-gray-700">
              You haven't added any enhanced profile information yet. You can go back and add some, or skip this step for now.
            </p>
          </div>
        </EnhanceProfileInfoBox>
      ) : (
        <div className="space-y-6">
          {/* About Section */}
          {(data.about?.bio || data.about?.aboutMe || data.about?.lookingFor) && (
            <EnhanceProfileSection title="About You">
              <div className="bg-white p-6 rounded-xl border border-gray-200 space-y-4">
                {data.about.bio && (
                  <div>
                    <p className="text-sm font-semibold text-gray-700 mb-1">Bio:</p>
                    <p className="text-gray-600">{data.about.bio}</p>
                  </div>
                )}
                {data.about.aboutMe && (
                  <div>
                    <p className="text-sm font-semibold text-gray-700 mb-1">About Me:</p>
                    <p className="text-gray-600">{data.about.aboutMe}</p>
                  </div>
                )}
                {data.about.lookingFor && (
                  <div>
                    <p className="text-sm font-semibold text-gray-700 mb-1">Looking For:</p>
                    <p className="text-gray-600">{data.about.lookingFor}</p>
                  </div>
                )}
              </div>
            </EnhanceProfileSection>
          )}

          {/* Hobbies Section */}
          {data.hobbies?.hobbies && data.hobbies.hobbies.length > 0 && (
            <EnhanceProfileSection title="Hobbies & Interests">
              <div className="bg-white p-6 rounded-xl border border-gray-200">
                <div className="flex flex-wrap gap-2">
                  {data.hobbies.hobbies.map((hobby: string) => (
                    <EnhanceProfileTag key={hobby} role="searcher">
                      {hobby}
                    </EnhanceProfileTag>
                  ))}
                </div>
              </div>
            </EnhanceProfileSection>
          )}

          {/* Values Section */}
          {(data.values?.coreValues?.length > 0 ||
            data.values?.importantQualities?.length > 0 ||
            data.values?.dealBreakers?.length > 0) && (
            <EnhanceProfileSection title="Values & Preferences">
              <div className="bg-white p-6 rounded-xl border border-gray-200 space-y-4">
                {data.values.coreValues && data.values.coreValues.length > 0 && (
                  <div>
                    <p className="text-sm font-semibold text-gray-700 mb-2">Core Values:</p>
                    <div className="flex flex-wrap gap-2">
                      {data.values.coreValues.map((value: string) => (
                        <EnhanceProfileTag key={value} role="searcher">
                          {value}
                        </EnhanceProfileTag>
                      ))}
                    </div>
                  </div>
                )}

                {data.values.importantQualities && data.values.importantQualities.length > 0 && (
                  <div>
                    <p className="text-sm font-semibold text-gray-700 mb-2">Important Qualities:</p>
                    <div className="flex flex-wrap gap-2">
                      {data.values.importantQualities.map((quality: string) => (
                        <span
                          key={quality}
                          className="px-3 py-1.5 bg-green-100 text-green-700 rounded-full text-sm font-medium"
                        >
                          {quality}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {data.values.dealBreakers && data.values.dealBreakers.length > 0 && (
                  <div>
                    <p className="text-sm font-semibold text-gray-700 mb-2">Deal Breakers:</p>
                    <div className="flex flex-wrap gap-2">
                      {data.values.dealBreakers.map((dealBreaker: string) => (
                        <span
                          key={dealBreaker}
                          className="px-3 py-1.5 bg-red-100 text-red-700 rounded-full text-sm font-medium"
                        >
                          {dealBreaker}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </EnhanceProfileSection>
          )}

          {/* Financial Section */}
          {(data.financial?.incomeRange || data.financial?.employmentType) && (
            <EnhanceProfileSection title="Financial Information">
              <div className="bg-white p-6 rounded-xl border border-gray-200 space-y-3">
                {data.financial.incomeRange && (
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Income Range:</span>
                    <span className="text-sm font-medium text-gray-900">{data.financial.incomeRange}</span>
                  </div>
                )}
                {data.financial.employmentType && (
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Employment Type:</span>
                    <span className="text-sm font-medium text-gray-900">{data.financial.employmentType}</span>
                  </div>
                )}
                {data.financial.hasGuarantor !== undefined && (
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Has Guarantor:</span>
                    <span className="text-sm font-medium text-gray-900">{data.financial.hasGuarantor ? 'Yes' : 'No'}</span>
                  </div>
                )}
              </div>
            </EnhanceProfileSection>
          )}

          {/* Community Section */}
          {data.community?.eventInterest && (
            <EnhanceProfileSection title="Community Preferences">
              <div className="bg-white p-6 rounded-xl border border-gray-200 space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Event Interest:</span>
                  <span className="text-sm font-medium text-gray-900 capitalize">{data.community.eventInterest}</span>
                </div>
                {data.community.enjoySharedMeals !== undefined && (
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Enjoys Shared Meals:</span>
                    <span className="text-sm font-medium text-gray-900">{data.community.enjoySharedMeals ? 'Yes' : 'No'}</span>
                  </div>
                )}
                {data.community.openToMeetups !== undefined && (
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Open to Meetups:</span>
                    <span className="text-sm font-medium text-gray-900">{data.community.openToMeetups ? 'Yes' : 'No'}</span>
                  </div>
                )}
              </div>
            </EnhanceProfileSection>
          )}
        </div>
      )}

      {/* Action Buttons */}
      <div className="space-y-3 mt-8">
        <button
          onClick={handleSave}
          disabled={isSaving}
          className={`w-full py-4 rounded-xl font-semibold transition-all duration-300 ${
            !isSaving
              ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg hover:shadow-xl hover:-translate-y-0.5'
              : 'bg-transparent border-2 border-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          {isSaving ? 'Saving...' : 'Save Profile'}
        </button>
        <button
          onClick={() => router.push(`/dashboard/${userType}`)}
          disabled={isSaving}
          className="w-full text-center text-sm text-transparent hover:text-gray-600 transition-colors duration-200 py-2 disabled:opacity-50"
        >
          Skip for now
        </button>
      </div>
    </EnhanceProfileLayout>
  );
}
