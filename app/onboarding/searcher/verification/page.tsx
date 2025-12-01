'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Shield, Upload, Mail, Phone, Check } from 'lucide-react';
import { safeLocalStorage } from '@/lib/browser';
import { useLanguage } from '@/lib/i18n/use-language';
import {
  OnboardingLayout,
  OnboardingHeading,
  OnboardingButton,
  OnboardingInput,
} from '@/components/onboarding';

export default function VerificationPage() {
  const { t } = useLanguage();
  const router = useRouter();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [idDocument, setIdDocument] = useState<File | null>(null);

  const handleSaveProgress = () => {
    safeLocalStorage.set('verification', {
      phoneNumber,
      idDocument: idDocument?.name || null,
      verificationCompleted: false,
    });
    router.push('/onboarding/searcher/review');
  };

  const handleVerifyLater = () => {
    safeLocalStorage.set('verification', {
      phoneNumber: '',
      idDocument: null,
      verificationCompleted: false,
    });
    router.push('/onboarding/searcher/review');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setIdDocument(e.target.files[0]);
    }
  };

  return (
    <OnboardingLayout
      role="searcher"
      backUrl="/onboarding/searcher/privacy"
      backLabel={t('common.back')}
    >
      {/* Header */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Shield className="w-8 h-8 text-orange-600" />
        </div>
        <OnboardingHeading
          role="searcher"
          title={t('onboarding.verification.title')}
          description={t('onboarding.verification.subtitle')}
        />
      </div>

      <div className="space-y-6">
        {/* Identity verification (KYC) */}
        <div className="p-5 rounded-xl bg-white border border-gray-200">
          <div className="flex items-start gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0">
              <Upload className="w-5 h-5 text-orange-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 mb-1">
                {t('onboarding.verification.identityVerification')}
              </h3>
              <p className="text-sm text-gray-600 mb-3">
                {t('onboarding.verification.uploadIdHelp')}
              </p>
            </div>
          </div>

          <label className="block">
            <input
              type="file"
              accept="image/*,.pdf"
              onChange={handleFileChange}
              className="hidden"
              id="id-upload"
            />
            <label
              htmlFor="id-upload"
              className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-lg bg-orange-600 text-white font-medium cursor-pointer hover:bg-orange-700 transition"
            >
              <Upload className="w-4 h-4" />
              {idDocument ? t('onboarding.verification.changeId') : t('onboarding.verification.uploadId')}
            </label>
          </label>

          {idDocument && (
            <div className="mt-3 flex items-center gap-2 text-sm text-green-600">
              <Check className="w-4 h-4" />
              {idDocument.name}
            </div>
          )}
        </div>

        {/* Email verification */}
        <div className="p-5 rounded-xl bg-white border border-gray-200">
          <div className="flex items-start gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
              <Mail className="w-5 h-5 text-blue-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 mb-1">
                {t('onboarding.verification.emailVerification')}
              </h3>
              <p className="text-sm text-gray-600 mb-3">
                {t('onboarding.verification.emailVerificationHelp')}
              </p>
            </div>
          </div>

          <button className="w-full px-4 py-3 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition">
            {t('onboarding.verification.verifyEmail')}
          </button>
        </div>

        {/* Phone verification */}
        <div className="p-5 rounded-xl bg-white border border-gray-200">
          <div className="flex items-start gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0">
              <Phone className="w-5 h-5 text-orange-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 mb-1">
                {t('onboarding.verification.phoneVerification')}
              </h3>
              <p className="text-sm text-gray-600 mb-3">
                {t('onboarding.verification.phoneVerificationHelp')}
              </p>
            </div>
          </div>

          <OnboardingInput
            role="searcher"
            label=""
            type="tel"
            icon={Phone}
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder="+33 6 12 34 56 78"
          />

          <button
            disabled={!phoneNumber}
            className={`w-full mt-3 px-4 py-3 rounded-lg font-medium transition ${
              phoneNumber
                ? 'bg-orange-600 text-white hover:bg-orange-700'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            {t('onboarding.verification.sendOtp')}
          </button>
        </div>

        {/* Why verify? */}
        <div className="p-4 rounded-lg bg-yellow-50 border border-yellow-200">
          <h4 className="font-semibold text-gray-900 mb-2">{t('onboarding.verification.whyVerify')}</h4>
          <ul className="space-y-1 text-sm text-gray-700">
            <li className="flex items-start gap-2">
              <Check className="w-4 h-4 text-yellow-600 flex-shrink-0 mt-0.5" />
              <span>{t('onboarding.verification.benefit1')}</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="w-4 h-4 text-yellow-600 flex-shrink-0 mt-0.5" />
              <span>{t('onboarding.verification.benefit2')}</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="w-4 h-4 text-yellow-600 flex-shrink-0 mt-0.5" />
              <span>{t('onboarding.verification.benefit3')}</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Action buttons */}
      <div className="space-y-3 mt-8">
        <OnboardingButton role="searcher" onClick={handleSaveProgress}>
          {t('onboarding.verification.saveProgress')}
        </OnboardingButton>

        <button
          onClick={handleVerifyLater}
          className="w-full py-3 rounded-full font-medium text-gray-600 hover:text-gray-800 transition"
        >
          {t('onboarding.verification.verifyLater')}
        </button>
      </div>
    </OnboardingLayout>
  );
}
