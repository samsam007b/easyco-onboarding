'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Save, Loader2, CheckCircle } from 'lucide-react';
import { safeLocalStorage } from '@/lib/browser';
import { createClient } from '@/lib/auth/supabase-client';
import { saveOnboardingData } from '@/lib/onboarding-helpers';
import { toast } from 'sonner';
import { useLanguage } from '@/lib/i18n/use-language';
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
  const { t } = useLanguage();
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
        toast.error(t('enhanceOwner.review.errors.loginRequired'));
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

        toast.success(t('enhanceOwner.review.success'));

        setTimeout(() => {
          router.push(`/dashboard/${userType}`);
        }, 1000);
      } else {
        throw new Error(t('enhanceOwner.review.errors.saveFailed'));
      }
    } catch (error: any) {
      // FIXME: Use logger.error('Save error:', error);
      toast.error(error.message || t('enhanceOwner.review.errors.saveFailed'));
      setIsSaving(false);
    }
  };

  return (
    <EnhanceProfileLayout
      role="owner"
      backUrl="/dashboard/my-profile-owner"
      backLabel={t('enhanceOwner.common.backToProfile')}
      isLoading={isLoading}
      loadingText={t('enhanceOwner.common.loading')}
    >
      <EnhanceProfileHeading
        role="owner"
        title={t('enhanceOwner.review.title')}
        description={t('enhanceOwner.review.description')}
        icon={<CheckCircle className="w-8 h-8 text-purple-600" />}
      />

      <div className="space-y-6">
        {/* Experience & Motivation */}
        <EnhanceProfileSection>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">{t('enhanceOwner.review.experienceSection')}</h2>
            <button
              onClick={() => router.push('/profile/enhance-owner/experience')}
              className="text-sm text-purple-600 hover:opacity-70"
            >
              {t('enhanceOwner.review.edit')}
            </button>
          </div>
          <div className="space-y-2 text-sm">
            {data.experience?.experienceYears && (
              <div><span className="text-gray-600">{t('enhanceOwner.review.labels.experience')}</span> <span className="font-medium">{data.experience.experienceYears} {t('enhanceOwner.review.labels.years')}</span></div>
            )}
            {data.experience?.managementStyle && (
              <div><span className="text-gray-600">{t('enhanceOwner.review.labels.management')}</span> <span className="font-medium">{data.experience.managementStyle}</span></div>
            )}
            {data.experience?.primaryMotivation && (
              <div><span className="text-gray-600">{t('enhanceOwner.review.labels.motivation')}</span> <span className="font-medium">{data.experience.primaryMotivation}</span></div>
            )}
            {data.experience?.bio && (
              <div className="pt-2 border-t"><span className="text-gray-600">{t('enhanceOwner.review.labels.bio')}</span> <p className="text-gray-900 mt-1">{data.experience.bio}</p></div>
            )}
            {!data.experience?.experienceYears && <p className="text-gray-400 italic">{t('enhanceOwner.review.labels.noData')}</p>}
          </div>
        </EnhanceProfileSection>

        {/* Policies */}
        <EnhanceProfileSection>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">{t('enhanceOwner.review.policiesSection')}</h2>
            <button
              onClick={() => router.push('/profile/enhance-owner/policies')}
              className="text-sm text-purple-600 hover:opacity-70"
            >
              {t('enhanceOwner.review.edit')}
            </button>
          </div>
          <div className="space-y-2 text-sm">
            {data.policies?.petsAllowed !== null && data.policies?.petsAllowed !== undefined && (
              <div><span className="text-gray-600">{t('enhanceOwner.review.labels.pets')}</span> <span className="font-medium">{data.policies.petsAllowed ? t('enhanceOwner.review.labels.allowed') : t('enhanceOwner.review.labels.notAllowed')}</span></div>
            )}
            {data.policies?.smokingAllowed !== null && data.policies?.smokingAllowed !== undefined && (
              <div><span className="text-gray-600">{t('enhanceOwner.review.labels.smoking')}</span> <span className="font-medium">{data.policies.smokingAllowed ? t('enhanceOwner.review.labels.allowed') : t('enhanceOwner.review.labels.notAllowed')}</span></div>
            )}
            {data.policies?.minimumLeaseDuration && (
              <div><span className="text-gray-600">{t('enhanceOwner.review.labels.minLease')}</span> <span className="font-medium">{data.policies.minimumLeaseDuration} {t('enhanceOwner.review.labels.months')}</span></div>
            )}
            {data.policies?.depositAmount && (
              <div><span className="text-gray-600">{t('enhanceOwner.review.labels.deposit')}</span> <span className="font-medium">{data.policies.depositAmount}</span></div>
            )}
            {data.policies?.noticePeriod && (
              <div><span className="text-gray-600">{t('enhanceOwner.review.labels.noticePeriod')}</span> <span className="font-medium">{data.policies.noticePeriod}</span></div>
            )}
            {(!data.policies || (data.policies.petsAllowed === null && data.policies.smokingAllowed === null)) && <p className="text-gray-400 italic">{t('enhanceOwner.review.labels.noData')}</p>}
          </div>
        </EnhanceProfileSection>

        {/* Services */}
        <EnhanceProfileSection>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">{t('enhanceOwner.review.servicesSection')}</h2>
            <button
              onClick={() => router.push('/profile/enhance-owner/services')}
              className="text-sm text-purple-600 hover:opacity-70"
            >
              {t('enhanceOwner.review.edit')}
            </button>
          </div>
          <div className="space-y-3 text-sm">
            {data.services?.amenities?.length > 0 && (
              <div>
                <span className="text-gray-600 block mb-1">{t('enhanceOwner.review.labels.amenities')}</span>
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
                <span className="text-gray-600 block mb-1">{t('enhanceOwner.review.labels.services')}</span>
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
              <p className="text-gray-400 italic">{t('enhanceOwner.review.labels.noData')}</p>
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
              {t('enhanceOwner.review.saving')}
            </>
          ) : (
            <>
              <Save className="w-5 h-5" />
              {t('enhanceOwner.review.saveProfile')}
            </>
          )}
        </button>
        <button
          onClick={() => router.push('/dashboard/my-profile-owner')}
          disabled={isSaving}
          className="w-full text-center text-sm text-transparent hover:text-gray-600 transition-colors duration-200 py-2 disabled:opacity-50"
        >
          {t('enhanceOwner.review.skipForNow')}
        </button>
      </div>
    </EnhanceProfileLayout>
  );
}
