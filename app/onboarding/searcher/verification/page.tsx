'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Shield, Upload, Mail, Phone, Check } from 'lucide-react';
import { safeLocalStorage } from '@/lib/browser';
import { useLanguage } from '@/lib/i18n/use-language';
import LanguageSwitcher from '@/components/LanguageSwitcher';

export default function VerificationPage() {
  const { t } = useLanguage();
  const router = useRouter();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [idDocument, setIdDocument] = useState<File | null>(null);

  const handleSaveProgress = () => {
    // Save to localStorage
    safeLocalStorage.set('verification', {
      phoneNumber,
      idDocument: idDocument?.name || null,
      verificationCompleted: false,
    });

    // Navigate to review
    router.push('/onboarding/searcher/review');
  };

  const handleVerifyLater = () => {
    // Save minimal data
    safeLocalStorage.set('verification', {
      phoneNumber: '',
      idDocument: null,
      verificationCompleted: false,
    });

    // Navigate to review
    router.push('/onboarding/searcher/review');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setIdDocument(e.target.files[0]);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-md mx-auto">

        {/* Language Switcher */}
        <div className="absolute top-6 right-6 z-50">
          <LanguageSwitcher />
        </div>

        {/* Back button */}
        <button
          onClick={() => router.back()}
          className="mb-6 text-[color:var(--easy-purple)] hover:opacity-70 transition"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>

        {/* Header */}
        <div className="flex items-center justify-center mb-8">
          <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
            <Shield className="w-8 h-8 text-blue-600" />
          </div>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-[color:var(--easy-purple)] mb-2">
            {t('onboarding.verification.title')}
          </h1>
          <p className="text-gray-600">
            {t('onboarding.verification.subtitle')}
          </p>
        </div>

        {/* Form */}
        <div className="space-y-6">

          {/* Identity verification (KYC) */}
          <div className="p-5 rounded-xl bg-white border border-gray-200">
            <div className="flex items-start gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                <Upload className="w-5 h-5 text-purple-600" />
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
                className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-lg bg-[color:var(--easy-purple)] text-white font-medium cursor-pointer hover:opacity-90 transition"
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

            <button className="w-full px-4 py-3 rounded-lg bg-blue-600 text-white font-medium hover:opacity-90 transition">
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

            <input
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[color:var(--easy-purple)] focus:ring-2 focus:ring-purple-100 outline-none transition mb-3"
              placeholder="+33 6 12 34 56 78"
            />

            <button
              disabled={!phoneNumber}
              className={`w-full px-4 py-3 rounded-lg font-medium transition ${
                phoneNumber
                  ? 'bg-orange-600 text-white hover:opacity-90'
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
        <div className="space-y-3 mt-12">
          <button
            onClick={handleSaveProgress}
            className="w-full py-4 rounded-full bg-[color:var(--easy-yellow)] text-black font-semibold text-lg hover:opacity-90 transition shadow-md hover:shadow-lg"
          >
            {t('onboarding.verification.saveProgress')}
          </button>

          <button
            onClick={handleVerifyLater}
            className="w-full py-3 rounded-full font-medium text-gray-600 hover:text-gray-800 transition"
          >
            {t('onboarding.verification.verifyLater')}
          </button>
        </div>
      </div>
    </main>
  );
}
