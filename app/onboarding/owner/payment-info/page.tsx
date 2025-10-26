'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, CreditCard, Shield } from 'lucide-react';
import { safeLocalStorage } from '@/lib/browser';
import { createClient } from '@/lib/auth/supabase-client';
import { toast } from 'sonner';
import { useLanguage } from '@/lib/i18n/use-language';
import LanguageSwitcher from '@/components/LanguageSwitcher';

export default function PaymentInfoPage() {
  const router = useRouter();
  const supabase = createClient();
  const { t, getSection } = useLanguage();
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
      console.error('Error loading payment data:', error);
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[color:var(--easy-purple)] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">{onboarding.owner.about.loadingInfo}</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white p-6">
      <div className="max-w-2xl mx-auto">
        {/* Language Switcher */}
        <div className="absolute top-6 right-6 z-50">
          <LanguageSwitcher />
        </div>

        {/* Header */}
        <button
          onClick={() => router.push('/dashboard/my-profile-owner')}
          className="mb-6 text-[color:var(--easy-purple)] hover:opacity-70 transition flex items-center gap-2"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>{onboarding.owner.paymentInfo.backToProfile}</span>
        </button>

        {/* Title */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
              <CreditCard className="w-6 h-6 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold text-[color:var(--easy-purple)]">
              {onboarding.owner.paymentInfo.title}
            </h1>
          </div>
          <p className="text-gray-600">
            {onboarding.owner.paymentInfo.subtitle}
          </p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 space-y-6">
          {/* IBAN */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {onboarding.owner.paymentInfo.iban} <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={iban}
              onChange={(e) => setIban(e.target.value.toUpperCase())}
              placeholder={onboarding.owner.paymentInfo.ibanPlaceholder}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[color:var(--easy-purple)] focus:border-transparent outline-none transition-all"
            />
            <p className="text-xs text-gray-500 mt-2">
              {onboarding.owner.paymentInfo.ibanHelp}
            </p>
          </div>

          {/* SWIFT/BIC */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {onboarding.owner.paymentInfo.swiftBic} <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={swiftBic}
              onChange={(e) => setSwiftBic(e.target.value.toUpperCase())}
              placeholder={onboarding.owner.paymentInfo.swiftBicPlaceholder}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[color:var(--easy-purple)] focus:border-transparent outline-none transition-all"
            />
            <p className="text-xs text-gray-500 mt-2">
              {onboarding.owner.paymentInfo.swiftBicHelp}
            </p>
          </div>

          {/* Security Notice */}
          <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200 flex gap-3">
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
          <button
            onClick={() => router.push('/dashboard/my-profile-owner')}
            className="flex-1 border-2 border-gray-300 text-gray-700 py-4 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
          >
            {common.cancel}
          </button>
          <button
            onClick={handleSave}
            disabled={!iban || !swiftBic}
            className={`flex-1 py-4 rounded-lg font-semibold transition-colors ${
              iban && swiftBic
                ? 'bg-[color:var(--easy-purple)] text-white hover:opacity-90'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {onboarding.owner.paymentInfo.saveChanges}
          </button>
        </div>
      </div>
    </main>
  );
}
