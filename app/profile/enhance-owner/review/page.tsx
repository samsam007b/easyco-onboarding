'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Save, Loader2, CheckCircle } from 'lucide-react';
import { safeLocalStorage } from '@/lib/browser';
import { createClient } from '@/lib/auth/supabase-client';
import { saveOnboardingData } from '@/lib/onboarding-helpers';
import { toast } from 'sonner';
import {
  EnhanceProfileLayout,
  EnhanceProfileHeading,
  EnhanceProfileButton,
  EnhanceProfileSection,
  EnhanceProfileTag,
} from '@/components/enhance-profile';

export const dynamic = 'force-dynamic';

export default function OwnerEnhanceReviewPage() {
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
        const experienceData = safeLocalStorage.get('ownerExperience', {}) as any;
        const policiesData = safeLocalStorage.get('ownerPolicies', {}) as any;
        const servicesData = safeLocalStorage.get('ownerServices', {}) as any;

        setData({
          experience: experienceData || {},
          policies: policiesData || {},
          services: servicesData || {}
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
        // Experience & Motivation
        experienceYears: data.experience?.experienceYears || '',
        managementStyle: data.experience?.managementStyle || '',
        primaryMotivation: data.experience?.primaryMotivation || '',
        ownerBio: data.experience?.bio || '',
        // Policies
        petsAllowed: data.policies?.petsAllowed ?? null,
        smokingAllowed: data.policies?.smokingAllowed ?? null,
        minimumLeaseDuration: data.policies?.minimumLeaseDuration || '',
        depositAmount: data.policies?.depositAmount || '',
        noticePeriod: data.policies?.noticePeriod || '',
        // Services
        amenities: data.services?.amenities || [],
        includedServices: data.services?.includedServices || []
      };

      const result = await saveOnboardingData(user.id, enhancedData, userType);

      if (result.success) {
        // Clear localStorage
        safeLocalStorage.remove('ownerExperience');
        safeLocalStorage.remove('ownerPolicies');
        safeLocalStorage.remove('ownerServices');

        toast.success('Enhanced profile saved successfully!');

        setTimeout(() => {
          router.push(`/dashboard/${userType}`);
        }, 1000);
      } else {
        throw new Error('Failed to save enhanced profile');
      }
    } catch (error: any) {
      // FIXME: Use logger.error('Save error:', error);
      toast.error(error.message || 'Failed to save');
      setIsSaving(false);
    }
  };

  return (
    <EnhanceProfileLayout
      role="owner"
      backUrl="/dashboard/my-profile-owner"
      backLabel="Back to Profile"
      isLoading={isLoading}
      loadingText="Loading your information..."
    >
      <EnhanceProfileHeading
        role="owner"
        title="Review Your Enhanced Profile"
        description="Make sure everything looks good before saving"
        icon={<CheckCircle className="w-8 h-8 text-purple-600" />}
      />

      <div className="space-y-6">
        {/* Experience & Motivation */}
        <EnhanceProfileSection>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Experience & Motivation</h2>
            <button
              onClick={() => router.push('/profile/enhance-owner/experience')}
              className="text-sm text-purple-600 hover:opacity-70"
            >
              Edit
            </button>
          </div>
          <div className="space-y-2 text-sm">
            {data.experience?.experienceYears && (
              <div><span className="text-gray-600">Experience:</span> <span className="font-medium">{data.experience.experienceYears} years</span></div>
            )}
            {data.experience?.managementStyle && (
              <div><span className="text-gray-600">Management:</span> <span className="font-medium">{data.experience.managementStyle}</span></div>
            )}
            {data.experience?.primaryMotivation && (
              <div><span className="text-gray-600">Motivation:</span> <span className="font-medium">{data.experience.primaryMotivation}</span></div>
            )}
            {data.experience?.bio && (
              <div className="pt-2 border-t"><span className="text-gray-600">Bio:</span> <p className="text-gray-900 mt-1">{data.experience.bio}</p></div>
            )}
            {!data.experience?.experienceYears && <p className="text-gray-400 italic">No data entered</p>}
          </div>
        </EnhanceProfileSection>

        {/* Policies */}
        <EnhanceProfileSection>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Tenant Policies</h2>
            <button
              onClick={() => router.push('/profile/enhance-owner/policies')}
              className="text-sm text-purple-600 hover:opacity-70"
            >
              Edit
            </button>
          </div>
          <div className="space-y-2 text-sm">
            {data.policies?.petsAllowed !== null && data.policies?.petsAllowed !== undefined && (
              <div><span className="text-gray-600">Pets:</span> <span className="font-medium">{data.policies.petsAllowed ? 'Allowed' : 'Not allowed'}</span></div>
            )}
            {data.policies?.smokingAllowed !== null && data.policies?.smokingAllowed !== undefined && (
              <div><span className="text-gray-600">Smoking:</span> <span className="font-medium">{data.policies.smokingAllowed ? 'Allowed' : 'Not allowed'}</span></div>
            )}
            {data.policies?.minimumLeaseDuration && (
              <div><span className="text-gray-600">Min lease:</span> <span className="font-medium">{data.policies.minimumLeaseDuration} months</span></div>
            )}
            {data.policies?.depositAmount && (
              <div><span className="text-gray-600">Deposit:</span> <span className="font-medium">{data.policies.depositAmount}</span></div>
            )}
            {data.policies?.noticePeriod && (
              <div><span className="text-gray-600">Notice period:</span> <span className="font-medium">{data.policies.noticePeriod}</span></div>
            )}
            {(!data.policies || (data.policies.petsAllowed === null && data.policies.smokingAllowed === null)) && <p className="text-gray-400 italic">No data entered</p>}
          </div>
        </EnhanceProfileSection>

        {/* Services */}
        <EnhanceProfileSection>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Services & Amenities</h2>
            <button
              onClick={() => router.push('/profile/enhance-owner/services')}
              className="text-sm text-purple-600 hover:opacity-70"
            >
              Edit
            </button>
          </div>
          <div className="space-y-3 text-sm">
            {data.services?.amenities?.length > 0 && (
              <div>
                <span className="text-gray-600 block mb-1">Amenities:</span>
                <div className="flex flex-wrap gap-2">
                  {data.services.amenities.map((amenity: string) => (
                    <EnhanceProfileTag key={amenity} role="owner">
                      {amenity}
                    </EnhanceProfileTag>
                  ))}
                </div>
              </div>
            )}
            {data.services?.includedServices?.length > 0 && (
              <div>
                <span className="text-gray-600 block mb-1">Services:</span>
                <div className="flex flex-wrap gap-2">
                  {data.services.includedServices.map((service: string) => (
                    <span key={service} className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                      {service}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {(!data.services?.amenities?.length && !data.services?.includedServices?.length) && (
              <p className="text-gray-400 italic">No data entered</p>
            )}
          </div>
        </EnhanceProfileSection>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3 mt-8">
        <button
          onClick={handleSave}
          disabled={isSaving}
          className={`w-full py-4 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${
            !isSaving
              ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg hover:shadow-xl hover:-translate-y-0.5'
              : 'bg-transparent border-2 border-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          {isSaving ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="w-5 h-5" />
              Save Enhanced Profile
            </>
          )}
        </button>
        <button
          onClick={() => router.push('/dashboard/my-profile-owner')}
          disabled={isSaving}
          className="w-full text-center text-sm text-transparent hover:text-gray-600 transition-colors duration-200 py-2 disabled:opacity-50"
        >
          Skip for now
        </button>
      </div>
    </EnhanceProfileLayout>
  );
}
