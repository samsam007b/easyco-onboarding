'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { User, MapPin, Award, CheckCircle } from 'lucide-react';
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

export default function OwnerReview() {
  const router = useRouter();
  const { getSection } = useLanguage();
  const onboarding = getSection('onboarding');
  const common = getSection('common');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<any>({});

  useEffect(() => {
    const basicInfo = safeLocalStorage.get('ownerBasicInfo', {}) as any;
    const about = safeLocalStorage.get('ownerAbout', {}) as any;
    const propertyBasics = safeLocalStorage.get('ownerPropertyBasics', {}) as any;
    const verification = safeLocalStorage.get('ownerVerification', {}) as any;
    setData({ basicInfo, about, propertyBasics, verification });
    setIsLoading(false);
  }, []);

  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      const supabase = createClient();

      const { data: { user }, error: authError } = await supabase.auth.getUser();

      if (authError || !user) {
        toast.error('Authentication error. Please login again.');
        router.push('/login');
        return;
      }

      const onboardingData = {
        landlordType: data.basicInfo?.landlordType,
        firstName: data.basicInfo?.firstName,
        lastName: data.basicInfo?.lastName,
        companyName: data.basicInfo?.companyName,
        phoneNumber: data.basicInfo?.phoneNumber,
        nationality: data.basicInfo?.nationality,
        ownerType: data.about?.ownerType,
        primaryLocation: data.about?.primaryLocation,
        hostingExperience: data.about?.hostingExperience,
        hasProperty: data.propertyBasics?.hasProperty,
        propertyCity: data.propertyBasics?.propertyCity,
        propertyType: data.propertyBasics?.propertyType,
        phoneVerification: data.verification?.phoneNumber,
        idDocument: data.verification?.idDocument,
        proofOfOwnership: data.verification?.proofOfOwnership,
        completedAt: new Date().toISOString()
      };

      const result = await saveOnboardingData(user.id, onboardingData, 'owner');

      if (!result.success) {
        throw new Error('Failed to save profile data');
      }

      safeLocalStorage.remove('ownerBasicInfo');
      safeLocalStorage.remove('ownerAbout');
      safeLocalStorage.remove('ownerPropertyBasics');
      safeLocalStorage.remove('ownerVerification');

      toast.success(onboarding.owner.review.profileCreated);
      router.push('/onboarding/owner/success');
    } catch (err: any) {
      toast.error('Error: ' + (err.message || 'Failed to create profile'));
      setIsSubmitting(false);
    }
  };

  const getOwnerTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      individual: 'Individual Owner',
      agency: 'Property Agency',
      company: 'Company / Corporation',
    };
    return labels[type] || type;
  };

  return (
    <OnboardingLayout
      role="owner"
      backUrl="/onboarding/owner/verification"
      backLabel={common.back}
      progress={{
        current: 3,
        total: 3,
        label: 'Étape 3 sur 3',
        stepName: onboarding.owner.review.title,
      }}
      isLoading={isLoading}
      loadingText={common.loading}
    >
      {/* Header */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-purple-600" />
        </div>
        <OnboardingHeading
          role="owner"
          title={onboarding.owner.review.title}
          description={onboarding.owner.review.subtitle}
        />
      </div>

      {/* Profile Summary */}
      <div className="space-y-4">
        {/* Basic Info */}
        <div className="p-4 bg-purple-50 rounded-xl border border-purple-100">
          <div className="flex items-center gap-2 mb-3">
            <User className="w-5 h-5 text-purple-600" />
            <h3 className="font-semibold text-gray-900">{onboarding.owner.review.basicInfo}</h3>
          </div>
          <div className="space-y-2 text-sm">
            {data.basicInfo?.landlordType && (
              <div className="flex justify-between">
                <span className="text-gray-600">{onboarding.owner.review.type}</span>
                <span className="font-medium text-gray-900 capitalize">{data.basicInfo.landlordType}</span>
              </div>
            )}
            {data.basicInfo?.companyName && (
              <div className="flex justify-between">
                <span className="text-gray-600">{onboarding.owner.review.company}</span>
                <span className="font-medium text-gray-900">{data.basicInfo.companyName}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-gray-600">{onboarding.owner.review.name}</span>
              <span className="font-medium text-gray-900">
                {data.basicInfo?.firstName} {data.basicInfo?.lastName}
              </span>
            </div>
            {data.basicInfo?.phoneNumber && (
              <div className="flex justify-between">
                <span className="text-gray-600">{onboarding.owner.review.phone}</span>
                <span className="font-medium text-gray-900">{data.basicInfo.phoneNumber}</span>
              </div>
            )}
            {data.basicInfo?.nationality && (
              <div className="flex justify-between">
                <span className="text-gray-600">{onboarding.owner.review.nationality}</span>
                <span className="font-medium text-gray-900">{data.basicInfo.nationality}</span>
              </div>
            )}
          </div>
        </div>

        {/* About */}
        <div className="p-4 bg-purple-50 rounded-xl border border-purple-100">
          <div className="flex items-center gap-2 mb-3">
            <Award className="w-5 h-5 text-purple-600" />
            <h3 className="font-semibold text-gray-900">{onboarding.owner.review.profileDetails}</h3>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">{onboarding.owner.review.type}</span>
              <span className="font-medium text-gray-900">
                {getOwnerTypeLabel(data.about?.ownerType)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">{onboarding.owner.review.location}</span>
              <span className="font-medium text-gray-900">{data.about?.primaryLocation}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">{onboarding.owner.review.experience}</span>
              <span className="font-medium text-gray-900">{data.about?.hostingExperience}</span>
            </div>
          </div>
        </div>

        {/* Property Basics */}
        {data.propertyBasics && (
          <div className="p-4 bg-purple-50 rounded-xl border border-purple-100">
            <div className="flex items-center gap-2 mb-3">
              <MapPin className="w-5 h-5 text-purple-600" />
              <h3 className="font-semibold text-gray-900">{onboarding.owner.review.propertyInfo}</h3>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">{onboarding.owner.review.hasProperty}</span>
                <span className="font-medium text-gray-900">
                  {data.propertyBasics.hasProperty === 'yes' ? onboarding.owner.review.yesLabel : onboarding.owner.review.notYetLabel}
                </span>
              </div>
              {data.propertyBasics.propertyCity && (
                <div className="flex justify-between">
                  <span className="text-gray-600">{onboarding.owner.review.location}</span>
                  <span className="font-medium text-gray-900">{data.propertyBasics.propertyCity}</span>
                </div>
              )}
              {data.propertyBasics.propertyType && (
                <div className="flex justify-between">
                  <span className="text-gray-600">{onboarding.owner.review.type}</span>
                  <span className="font-medium text-gray-900 capitalize">{data.propertyBasics.propertyType}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Verification */}
        {data.verification && (data.verification.phoneNumber || data.verification.idDocument || data.verification.proofOfOwnership) && (
          <div className="p-4 bg-purple-50 rounded-xl border border-purple-100">
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle className="w-5 h-5 text-purple-600" />
              <h3 className="font-semibold text-gray-900">{onboarding.owner.review.verificationStatus}</h3>
            </div>
            <div className="space-y-2 text-sm">
              {data.verification.phoneNumber && (
                <div className="flex justify-between">
                  <span className="text-gray-600">{onboarding.owner.review.phone}</span>
                  <span className="font-medium text-gray-900">{data.verification.phoneNumber}</span>
                </div>
              )}
              {data.verification.idDocument && (
                <div className="flex justify-between">
                  <span className="text-gray-600">{onboarding.owner.review.idDocument}</span>
                  <span className="font-medium text-green-600">{onboarding.owner.review.uploaded}</span>
                </div>
              )}
              {data.verification.proofOfOwnership && (
                <div className="flex justify-between">
                  <span className="text-gray-600">{onboarding.owner.review.proofOfOwnership}</span>
                  <span className="font-medium text-green-600">{onboarding.owner.review.uploaded}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Next Steps */}
        <div className="p-4 bg-green-50 rounded-xl border border-green-200">
          <div className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
            <div>
              <h4 className="font-semibold text-green-900 mb-1">{onboarding.owner.review.nextStepsTitle}</h4>
              <p className="text-sm text-green-700">
                {onboarding.owner.review.nextStepsDesc}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex gap-4 mt-8">
        <OnboardingButton
          role="owner"
          variant="secondary"
          onClick={() => router.push('/onboarding/owner/verification')}
          disabled={isSubmitting}
        >
          {common.back}
        </OnboardingButton>
        <OnboardingButton
          role="owner"
          onClick={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? onboarding.owner.review.submitting : onboarding.owner.review.createProfile}
        </OnboardingButton>
      </div>
    </OnboardingLayout>
  );
}
