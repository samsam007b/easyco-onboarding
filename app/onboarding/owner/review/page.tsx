'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, User, MapPin, Award, CheckCircle } from 'lucide-react';
import { safeLocalStorage } from '@/lib/browser';
import { createClient } from '@/lib/auth/supabase-client';
import { saveOnboardingData } from '@/lib/onboarding-helpers';
import { toast } from 'sonner';
import { useLanguage } from '@/lib/i18n/use-language';
import LanguageSwitcher from '@/components/LanguageSwitcher';

export default function OwnerReview() {
  const router = useRouter();
  const { t, getSection } = useLanguage();
  const onboarding = getSection('onboarding');
  const common = getSection('common');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [data, setData] = useState<any>({});

  useEffect(() => {
    const basicInfo = safeLocalStorage.get('ownerBasicInfo', {}) as any;
    const about = safeLocalStorage.get('ownerAbout', {}) as any;
    const propertyBasics = safeLocalStorage.get('ownerPropertyBasics', {}) as any;
    const verification = safeLocalStorage.get('ownerVerification', {}) as any;
    setData({ basicInfo, about, propertyBasics, verification });
  }, []);

  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      const supabase = createClient();

      // Get current authenticated user
      const { data: { user }, error: authError } = await supabase.auth.getUser();

      if (authError || !user) {
        toast.error('Authentication error. Please login again.');
        router.push('/login');
        return;
      }

      // Prepare owner onboarding data
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

      // Save to user_profiles using the helper
      const result = await saveOnboardingData(user.id, onboardingData, 'owner');

      if (!result.success) {
        throw new Error('Failed to save profile data');
      }

      // Clear onboarding data from localStorage
      safeLocalStorage.remove('ownerBasicInfo');
      safeLocalStorage.remove('ownerAbout');
      safeLocalStorage.remove('ownerPropertyBasics');
      safeLocalStorage.remove('ownerVerification');

      toast.success(onboarding.owner.review.profileCreated);

      // Redirect to success page
      router.push('/onboarding/owner/success');
    } catch (err: any) {
      // FIXME: Use logger.error('Error submitting owner onboarding:', err);
      toast.error('Error: ' + (err.message || 'Failed to create profile'));
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    router.push('/onboarding/owner/verification');
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
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white p-6">
      <div className="max-w-2xl mx-auto">
        {/* Language Switcher */}
        <div className="absolute top-6 right-6 z-50">
          <LanguageSwitcher />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 text-gray-600 hover:text-[color:var(--easy-purple)] transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>{common.back}</span>
          </button>
        </div>

        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-2xl bg-[color:var(--easy-purple)] flex items-center justify-center">
            <User className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-[color:var(--easy-purple)]">EasyCo</h1>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Step 3 of 3</span>
            <span className="text-sm font-semibold text-[color:var(--easy-purple)]">100%</span>
          </div>
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-[color:var(--easy-purple)] rounded-full" style={{ width: '100%' }} />
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{onboarding.owner.review.title}</h2>
            <p className="text-gray-600">{onboarding.owner.review.subtitle}</p>
          </div>

          {/* Profile Summary */}
          <div className="space-y-4">
            {/* Basic Info */}
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2 mb-3">
                <User className="w-5 h-5 text-[color:var(--easy-purple)]" />
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
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2 mb-3">
                <Award className="w-5 h-5 text-[color:var(--easy-purple)]" />
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
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2 mb-3">
                  <MapPin className="w-5 h-5 text-[color:var(--easy-purple)]" />
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
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2 mb-3">
                  <CheckCircle className="w-5 h-5 text-[color:var(--easy-purple)]" />
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
          </div>

          {/* Next Steps */}
          <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
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

          {/* Buttons */}
          <div className="flex gap-4 mt-8">
            <button
              onClick={handleBack}
              disabled={isSubmitting}
              className="flex-1 border-2 border-gray-300 text-gray-700 py-4 rounded-lg font-semibold hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              {common.back}
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex-1 bg-[color:var(--easy-purple)] text-white py-4 rounded-lg font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {isSubmitting ? onboarding.owner.review.submitting : onboarding.owner.review.createProfile}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
