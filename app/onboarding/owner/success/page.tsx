'use client';

import Link from 'next/link';
import { CheckCircle, Home, ArrowRight } from 'lucide-react';
import { useLanguage } from '@/lib/i18n/use-language';
import LanguageSwitcher from '@/components/LanguageSwitcher';

export default function OwnerSuccess() {
  const { t, getSection } = useLanguage();
  const onboarding = getSection('onboarding');
  const common = getSection('common');

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center">
        {/* Language Switcher */}
        <div className="absolute top-6 right-6 z-50">
          <LanguageSwitcher />
        </div>

        {/* Success Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
        </div>

        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-[color:var(--easy-purple)] flex items-center justify-center">
            <Home className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-[color:var(--easy-purple)]">EasyCo</h1>
        </div>

        {/* Success Message */}
        <h2 className="text-2xl font-bold text-gray-900 mb-3">{onboarding.owner.success.title}</h2>
        <p className="text-gray-600 mb-8">
          {onboarding.owner.success.welcome}
        </p>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="p-4 bg-purple-50 rounded-lg border border-purple-100">
            <div className="text-2xl font-bold text-[color:var(--easy-purple)]">{onboarding.owner.success.stat3xLabel}</div>
            <div className="text-sm text-gray-600">{onboarding.owner.success.stat3xDesc}</div>
          </div>
          <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-100">
            <div className="text-2xl font-bold text-yellow-600">{onboarding.owner.success.statFastLabel}</div>
            <div className="text-sm text-gray-600">{onboarding.owner.success.statFastDesc}</div>
          </div>
        </div>

        {/* Next Steps */}
        <div className="space-y-3">
          <Link
            href="/dashboard/owner"
            className="flex items-center justify-center gap-2 w-full bg-[color:var(--easy-yellow)] text-black py-4 rounded-lg font-semibold hover:opacity-90 transition shadow-md hover:shadow-lg"
          >
            {onboarding.owner.success.goToDashboard}
            <ArrowRight className="w-5 h-5" />
          </Link>

          <Link
            href="/profile/enhance-owner"
            className="block w-full bg-[color:var(--easy-purple)] text-white py-4 rounded-lg font-semibold hover:opacity-90 transition shadow-md hover:shadow-lg"
          >
            {onboarding.owner.success.enhanceProfile}
          </Link>

          <Link
            href="/"
            className="block w-full text-gray-600 py-3 rounded-lg font-medium hover:text-[color:var(--easy-purple)] transition"
          >
            {onboarding.owner.success.backToHome}
          </Link>
        </div>

        {/* Help Link */}
        <p className="mt-6 text-sm text-gray-500">
          {onboarding.owner.success.needHelp}{' '}
          <a href="mailto:support@easyco.com" className="text-[color:var(--easy-purple)] hover:underline">
            {onboarding.owner.success.contactSupport}
          </a>
        </p>
      </div>
    </main>
  );
}
