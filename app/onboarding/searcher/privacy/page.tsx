'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Shield, Sparkles } from 'lucide-react';
import { safeLocalStorage } from '@/lib/browser';
import { useLanguage } from '@/lib/i18n/use-language';
import LanguageSwitcher from '@/components/LanguageSwitcher';

export default function PrivacyPage() {
  const { t } = useLanguage();
  const router = useRouter();
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [readPrivacy, setReadPrivacy] = useState(false);
  const [consentData, setConsentData] = useState(false);
  const [agreeMatching, setAgreeMatching] = useState(false);

  const handleFinish = () => {
    // Save privacy consents
    safeLocalStorage.set('privacy', {
      acceptTerms,
      readPrivacy,
      consentData,
      agreeMatching,
      timestamp: new Date().toISOString(),
    });

    // Navigate to verification step
    router.push('/onboarding/searcher/verification');
  };

  const canContinue = acceptTerms && readPrivacy && consentData;

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-md mx-auto">

        {/* Language Switcher */}
        <div className="absolute top-6 right-6 z-50">
          <LanguageSwitcher />
        </div>

        {/* Progress bar */}
        <div className="mb-6">
          <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-[color:var(--easy-purple)] w-5/6 transition-all" />
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
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center mb-4">
            <Shield className="w-8 h-8 text-[color:var(--easy-purple)]" />
          </div>
          <h1 className="text-2xl font-bold text-[color:var(--easy-purple)] mb-2">
            {t('onboarding.privacy.title')}
          </h1>
          <p className="text-gray-600">
            {t('onboarding.privacy.subtitle')}
          </p>
        </div>

        {/* Privacy consents */}
        <div className="space-y-4 mb-6">

          {/* Terms & Conditions */}
          <label className="flex items-start gap-3 p-4 rounded-xl bg-white border border-gray-200 cursor-pointer hover:border-[color:var(--easy-purple)] transition">
            <input
              type="checkbox"
              checked={acceptTerms}
              onChange={(e) => setAcceptTerms(e.target.checked)}
              className="mt-0.5 w-5 h-5 text-[color:var(--easy-purple)] rounded focus:ring-2 focus:ring-purple-100"
            />
            <div className="flex-1">
              <div className="font-medium text-gray-900 flex items-center gap-1">
                {t('onboarding.privacy.acceptTermsRequired')}
                <span className="text-red-500">*</span>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                {t('onboarding.privacy.reviewTerms')}{' '}
                <a href="/legal/terms" target="_blank" rel="noopener noreferrer" className="text-[color:var(--easy-purple)] underline">
                  {t('onboarding.privacy.termsOfService')}
                </a>
              </p>
            </div>
          </label>

          {/* Privacy Policy */}
          <label className="flex items-start gap-3 p-4 rounded-xl bg-white border border-gray-200 cursor-pointer hover:border-[color:var(--easy-purple)] transition">
            <input
              type="checkbox"
              checked={readPrivacy}
              onChange={(e) => setReadPrivacy(e.target.checked)}
              className="mt-0.5 w-5 h-5 text-[color:var(--easy-purple)] rounded focus:ring-2 focus:ring-purple-100"
            />
            <div className="flex-1">
              <div className="font-medium text-gray-900 flex items-center gap-1">
                {t('onboarding.privacy.readPrivacyRequired')}
                <span className="text-red-500">*</span>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                {t('onboarding.privacy.learnProtection')}{' '}
                <a href="/legal/privacy" target="_blank" rel="noopener noreferrer" className="text-[color:var(--easy-purple)] underline">
                  {t('onboarding.privacy.personalData')}
                </a>
              </p>
            </div>
          </label>

          {/* Data processing */}
          <label className="flex items-start gap-3 p-4 rounded-xl bg-white border border-gray-200 cursor-pointer hover:border-[color:var(--easy-purple)] transition">
            <input
              type="checkbox"
              checked={consentData}
              onChange={(e) => setConsentData(e.target.checked)}
              className="mt-0.5 w-5 h-5 text-[color:var(--easy-purple)] rounded focus:ring-2 focus:ring-purple-100"
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
          <label className="flex items-start gap-3 p-4 rounded-xl bg-yellow-50 border-2 border-yellow-200 cursor-pointer hover:border-yellow-300 transition">
            <input
              type="checkbox"
              checked={agreeMatching}
              onChange={(e) => setAgreeMatching(e.target.checked)}
              className="mt-0.5 w-5 h-5 text-[color:var(--easy-purple)] rounded focus:ring-2 focus:ring-purple-100"
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
        <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 mb-8">
          <p className="text-sm text-gray-700">
            <strong>{t('onboarding.privacy.privacyMatters')}</strong> {t('onboarding.privacy.privacyNotice')}
          </p>
        </div>

        {/* Finish button */}
        <button
          onClick={handleFinish}
          disabled={!canContinue}
          className={`w-full py-4 rounded-full font-semibold text-lg transition shadow-md ${
            canContinue
              ? 'bg-[color:var(--easy-yellow)] text-black hover:opacity-90 hover:shadow-lg'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          {t('onboarding.privacy.continueToPreferences')}
        </button>
      </div>
    </main>
  );
}
