'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CreditCard, Shield } from 'lucide-react';
import { safeLocalStorage } from '@/lib/browser';
import { createClient } from '@/lib/auth/supabase-client';
import { toast } from 'sonner';
import { useLanguage } from '@/lib/i18n/use-language';
import {
  OnboardingLayout,
  OnboardingHeading,
  OnboardingButton,
  OnboardingInput,
} from '@/components/onboarding';

export default function PaymentInfoPage() {
  const router = useRouter();
  const supabase = createClient();
  const { getSection } = useLanguage();
  const onboarding = getSection('onboarding');
  const common = getSection('common');
  const [isLoading, setIsLoading] = useState(true);
  const [iban, setIban] = useState('');
  const [swiftBic, setSwiftBic] = useState('');

  useEffect(() => {
    loadExistingData();
  }, []);

  const loadExistingData = async () => {
    try {
      const saved = safeLocalStorage.get('ownerPaymentInfo', {}) as any;

      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        const { data: profileData } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (profileData) {
          setIban(saved.iban || profileData.iban || '');
          setSwiftBic(saved.swiftBic || profileData.swift_bic || '');
        } else if (saved.iban) {
          setIban(saved.iban);
          setSwiftBic(saved.swiftBic || '');
        }
      }
    } catch (error) {
      toast.error(common.errorLoadingData);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = () => {
    safeLocalStorage.set('ownerPaymentInfo', {
      iban,
      swiftBic,
    });
    toast.success(onboarding.owner.paymentInfo.saved);
    router.push('/dashboard/my-profile-owner');
  };

  const canSave = iban && swiftBic;

  return (
    <OnboardingLayout
      role="owner"
      backUrl="/dashboard/my-profile-owner"
      backLabel={onboarding.owner.paymentInfo.backToProfile}
      isLoading={isLoading}
      loadingText={onboarding.owner.about.loadingInfo}
    >
      {/* Header */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <CreditCard className="w-8 h-8 text-green-600" />
        </div>
        <OnboardingHeading
          role="owner"
          title={onboarding.owner.paymentInfo.title}
          description={onboarding.owner.paymentInfo.subtitle}
        />
      </div>

      {/* Form */}
      <div className="space-y-6">
        {/* IBAN */}
        <OnboardingInput
          role="owner"
          label={onboarding.owner.paymentInfo.iban}
          required
          icon={CreditCard}
          value={iban}
          onChange={(e) => setIban(e.target.value.toUpperCase())}
          placeholder={onboarding.owner.paymentInfo.ibanPlaceholder}
        />
        <p className="text-xs text-gray-500 -mt-4">
          {onboarding.owner.paymentInfo.ibanHelp}
        </p>

        {/* SWIFT/BIC */}
        <OnboardingInput
          role="owner"
          label={onboarding.owner.paymentInfo.swiftBic}
          required
          icon={CreditCard}
          value={swiftBic}
          onChange={(e) => setSwiftBic(e.target.value.toUpperCase())}
          placeholder={onboarding.owner.paymentInfo.swiftBicPlaceholder}
        />
        <p className="text-xs text-gray-500 -mt-4">
          {onboarding.owner.paymentInfo.swiftBicHelp}
        </p>

        {/* Security Notice */}
        <div className="p-4 bg-yellow-50 rounded-xl border border-yellow-200 flex gap-3">
          <Shield className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-medium text-gray-900 mb-1">{onboarding.owner.paymentInfo.securityNoticeTitle}</h3>
            <p className="text-sm text-gray-600">
              {onboarding.owner.paymentInfo.securityNoticeDesc}
            </p>
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex gap-4 mt-8">
        <OnboardingButton
          role="owner"
          variant="secondary"
          onClick={() => router.push('/dashboard/my-profile-owner')}
        >
          {common.cancel}
        </OnboardingButton>
        <OnboardingButton
          role="owner"
          onClick={handleSave}
          disabled={!canSave}
        >
          {onboarding.owner.paymentInfo.saveChanges}
        </OnboardingButton>
      </div>
    </OnboardingLayout>
  );
}
