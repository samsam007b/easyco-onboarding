'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import { safeLocalStorage } from '@/lib/browser';
import { createClient } from '@/lib/auth/supabase-client';
import { saveOnboardingData } from '@/lib/onboarding-helpers';
import { toast } from 'sonner';

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
          experience: experienceData,
          policies: policiesData,
          services: servicesData
        });
      } catch (error) {
        console.error('Error loading data:', error);
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
      console.error('Save error:', error);
      toast.error(error.message || 'Failed to save');
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[color:var(--easy-purple)] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-2xl mx-auto">

        {/* Progress indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-[color:var(--easy-purple)]">Step 4 of 4</span>
            <span className="text-sm text-gray-500">Review & Save</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-[color:var(--easy-purple)] h-2 rounded-full" style={{ width: '100%' }} />
          </div>
        </div>

        {/* Back button */}
        <button
          onClick={() => router.back()}
          className="mb-6 text-[color:var(--easy-purple)] hover:opacity-70 transition"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[color:var(--easy-purple)] mb-2">
            Review Your Enhanced Profile
          </h1>
          <p className="text-gray-600">
            Make sure everything looks good before saving
          </p>
        </div>

        {/* Review Cards */}
        <div className="space-y-6">

          {/* Experience & Motivation */}
          <div className="bg-white p-6 rounded-2xl shadow">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Experience & Motivation</h2>
              <button
                onClick={() => router.push('/profile/enhance-owner/experience')}
                className="text-sm text-[color:var(--easy-purple)] hover:opacity-70"
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
          </div>

          {/* Policies */}
          <div className="bg-white p-6 rounded-2xl shadow">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Tenant Policies</h2>
              <button
                onClick={() => router.push('/profile/enhance-owner/policies')}
                className="text-sm text-[color:var(--easy-purple)] hover:opacity-70"
              >
                Edit
              </button>
            </div>
            <div className="space-y-2 text-sm">
              {data.policies?.petsAllowed !== null && (
                <div><span className="text-gray-600">Pets:</span> <span className="font-medium">{data.policies.petsAllowed ? 'Allowed' : 'Not allowed'}</span></div>
              )}
              {data.policies?.smokingAllowed !== null && (
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
              {data.policies?.petsAllowed === null && <p className="text-gray-400 italic">No data entered</p>}
            </div>
          </div>

          {/* Services */}
          <div className="bg-white p-6 rounded-2xl shadow">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Services & Amenities</h2>
              <button
                onClick={() => router.push('/profile/enhance-owner/services')}
                className="text-sm text-[color:var(--easy-purple)] hover:opacity-70"
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
                      <span key={amenity} className="px-3 py-1 bg-purple-100 text-[color:var(--easy-purple)] rounded-full text-xs font-medium">
                        {amenity}
                      </span>
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
          </div>

        </div>

        {/* Action buttons */}
        <div className="mt-8 flex gap-4">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className={`flex-1 py-4 rounded-full font-semibold text-lg transition shadow-md flex items-center justify-center gap-2 ${
              isSaving
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-[color:var(--easy-yellow)] text-black hover:opacity-90 hover:shadow-lg'
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
        </div>
      </div>
    </main>
  );
}
