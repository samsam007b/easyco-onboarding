'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Shield, Sparkles } from 'lucide-react';
import { safeLocalStorage } from '@/lib/browser';
import { useLanguage } from '@/lib/i18n/use-language';
import {
  OnboardingLayout,
  OnboardingHeading,
  OnboardingButton,
} from '@/components/onboarding';

export default function PrivacyPage() {
  const { t } = useLanguage();
  const router = useRouter();
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [readPrivacy, setReadPrivacy] = useState(false);
  const [consentData, setConsentData] = useState(false);
  const [agreeMatching, setAgreeMatching] = useState(false);

  const handleFinish = () => {
    safeLocalStorage.set('privacy', {
      acceptTerms,
      readPrivacy,
      consentData,
      agreeMatching,
      timestamp: new Date().toISOString(),
    });
    router.push('/onboarding/searcher/verification');
  };

  const canContinue = acceptTerms && readPrivacy && consentData;

  return (
    <OnboardingLayout
      role="searcher"
      backUrl="/onboarding/searcher/preferences"
      backLabel={t('common.back')}
      progress={{
        current: 7,
        total: 8,
        label: `${t('onboarding.progress.step')} 7 ${t('onboarding.progress.of')} 8`,
        stepName: t('onboarding.privacy.title'),
      }}
    >
      {/* Header */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-orange-100 superellipse-2xl flex items-center justify-center mx-auto mb-4">
          <Shield className="w-8 h-8 text-orange-600" />
        </div>
        <OnboardingHeading
          role="searcher"
          title={t('onboarding.privacy.title')}
          description={t('onboarding.privacy.subtitle')}
        />
      </div>

      {/* Privacy consents */}
      <div className="space-y-4 mb-6">
        {/* Terms & Conditions */}
        <label className="flex items-start gap-3 p-4 superellipse-xl bg-white border border-gray-200 cursor-pointer hover:border-orange-500 transition">
          <input
            type="checkbox"
            checked={acceptTerms}
            onChange={(e) => setAcceptTerms(e.target.checked)}
            className="mt-0.5 w-5 h-5 text-orange-600 rounded focus:ring-2 focus:ring-orange-100"
          />
          <div className="flex-1">
            <div className="font-medium text-gray-900 flex items-center gap-1">
              {t('onboarding.privacy.acceptTermsRequired')}
              <span className="text-red-500">*</span>
            </div>
            <p className="text-sm text-gray-500 mt-1">
              {t('onboarding.privacy.reviewTerms')}{' '}
              <a href="/legal/terms" target="_blank" rel="noopener noreferrer" className="text-orange-600 underline">
                {t('onboarding.privacy.termsOfService')}
              </a>
            </p>
          </div>
        </label>

        {/* Privacy Policy */}
        <label className="flex items-start gap-3 p-4 superellipse-xl bg-white border border-gray-200 cursor-pointer hover:border-orange-500 transition">
          <input
            type="checkbox"
            checked={readPrivacy}
            onChange={(e) => setReadPrivacy(e.target.checked)}
            className="mt-0.5 w-5 h-5 text-orange-600 rounded focus:ring-2 focus:ring-orange-100"
          />
          <div className="flex-1">
            <div className="font-medium text-gray-900 flex items-center gap-1">
              {t('onboarding.privacy.readPrivacyRequired')}
              <span className="text-red-500">*</span>
            </div>
            <p className="text-sm text-gray-500 mt-1">
              {t('onboarding.privacy.learnProtection')}{' '}
              <a href="/legal/privacy" target="_blank" rel="noopener noreferrer" className="text-orange-600 underline">
                {t('onboarding.privacy.personalData')}
              </a>
            </p>
          </div>
        </label>

        {/* Data processing */}
        <label className="flex items-start gap-3 p-4 superellipse-xl bg-white border border-gray-200 cursor-pointer hover:border-orange-500 transition">
          <input
            type="checkbox"
            checked={consentData}
            onChange={(e) => setConsentData(e.target.checked)}
            className="mt-0.5 w-5 h-5 text-orange-600 rounded focus:ring-2 focus:ring-orange-100"
          />
          <div className="flex-1">
            <div className="font-medium text-gray-900 flex items-center gap-1">
              {t('onboarding.privacy.consentDataRequired')}
              <span className="text-red-500">*</span>
            </div>
            <p className="text-sm text-gray-500 mt-1">
              {t('onboarding.privacy.consentDataHelp')}
            </p>
          </div>
        </label>

        {/* Algorithmic matching (optional) */}
        <label className="flex items-start gap-3 p-4 superellipse-xl bg-yellow-50 border-2 border-yellow-200 cursor-pointer hover:border-yellow-300 transition">
          <input
            type="checkbox"
            checked={agreeMatching}
            onChange={(e) => setAgreeMatching(e.target.checked)}
            className="mt-0.5 w-5 h-5 text-orange-600 rounded focus:ring-2 focus:ring-orange-100"
          />
          <div className="flex-1">
            <div className="font-medium text-gray-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-yellow-600" />
              {t('onboarding.privacy.agreeMatchingOptional')}
              <span className="text-xs text-gray-500">({t('common.optional')})</span>
            </div>
            <p className="text-sm text-gray-600 mt-1">
              {t('onboarding.privacy.agreeMatchingHelp')}
            </p>
          </div>
        </label>
      </div>

      {/* Privacy notice */}
      <div className="p-4 superellipse-xl bg-blue-50 border border-blue-200 mb-8">
        <p className="text-sm text-gray-700">
          <strong>{t('onboarding.privacy.privacyMatters')}</strong> {t('onboarding.privacy.privacyNotice')}
        </p>
      </div>

      {/* Finish button */}
      <OnboardingButton
        role="searcher"
        onClick={handleFinish}
        disabled={!canContinue}
      >
        {t('onboarding.privacy.continueToPreferences')}
      </OnboardingButton>
    </OnboardingLayout>
  );
}
