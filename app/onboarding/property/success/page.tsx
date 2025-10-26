'use client';

import Link from 'next/link';
import { CheckCircle, Home, Plus, BarChart } from 'lucide-react';
import { useLanguage } from '@/lib/i18n/use-language';
import LanguageSwitcher from '@/components/LanguageSwitcher';

export default function PropertySuccess() {
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
        <h2 className="text-2xl font-bold text-gray-900 mb-3">{onboarding.property.success.title}</h2>
        <p className="text-gray-600 mb-8">
          {onboarding.property.success.subtitle}
        </p>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="p-4 bg-purple-50 rounded-lg border border-purple-100">
            <BarChart className="w-6 h-6 text-[color:var(--easy-purple)] mx-auto mb-2" />
            <div className="text-sm font-semibold text-gray-900">{onboarding.property.success.trackViewsLabel}</div>
            <div className="text-xs text-gray-600">{onboarding.property.success.trackViewsDesc}</div>
          </div>
          <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-100">
            <Plus className="w-6 h-6 text-yellow-600 mx-auto mb-2" />
            <div className="text-sm font-semibold text-gray-900">{onboarding.property.success.addPhotosLabel}</div>
            <div className="text-xs text-gray-600">{onboarding.property.success.addPhotosDesc}</div>
          </div>
        </div>

        {/* Next Steps */}
        <div className="space-y-3">
          <Link
            href="/onboarding/property/basics"
            className="flex items-center justify-center gap-2 w-full bg-[color:var(--easy-purple)] text-white py-4 rounded-lg font-semibold hover:opacity-90 transition-opacity"
          >
            <Plus className="w-5 h-5" />
            {onboarding.property.success.addAnotherProperty}
          </Link>

          <Link
            href="/"
            className="block w-full border-2 border-gray-300 text-gray-700 py-4 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
          >
            {onboarding.property.success.backToHome}
          </Link>
        </div>

        {/* Tips */}
        <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200 text-left">
          <h4 className="font-semibold text-blue-900 mb-2">{onboarding.property.success.proTipsTitle}</h4>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>{onboarding.property.success.proTip1}</li>
            <li>{onboarding.property.success.proTip2}</li>
            <li>{onboarding.property.success.proTip3}</li>
          </ul>
        </div>

        {/* Help Link */}
        <p className="mt-6 text-sm text-gray-500">
          {onboarding.property.success.needHelp}{' '}
          <a href="mailto:support@easyco.com" className="text-[color:var(--easy-purple)] hover:underline">
            {onboarding.property.success.contactSupport}
          </a>
        </p>
      </div>
    </main>
  );
}
