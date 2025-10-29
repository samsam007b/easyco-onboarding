'use client';

import Link from 'next/link';
import { CheckCircle2, Home } from 'lucide-react';
import { useLanguage } from '@/lib/i18n/use-language';
import LanguageSwitcher from '@/components/LanguageSwitcher';

export default function SuccessPage() {
  const { t, getSection } = useLanguage();
  const onboarding = getSection('onboarding');

  return (
    <main className="min-h-screen bg-gradient-to-b from-green-50 to-white flex items-center justify-center p-6">
      {/* Language Switcher */}
      <div className="absolute top-6 right-6 z-50">
        <LanguageSwitcher />
      </div>

      <div className="max-w-md w-full text-center space-y-8">
        
        {/* Success icon */}
        <div className="flex justify-center">
          <div className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center">
            <CheckCircle2 className="w-14 h-14 text-green-600" />
          </div>
        </div>

        {/* Title */}
        <div className="space-y-3">
          <h1 className="text-3xl font-bold text-[color:var(--easy-purple)]">
            {onboarding.success.title}
          </h1>
          <p className="text-gray-600 text-lg">
            {onboarding.success.thankYou}
          </p>
        </div>

        {/* Info card */}
        <div className="bg-white p-6 rounded-2xl shadow-md border-2 border-green-200">
          <h2 className="text-lg font-semibold text-gray-800 mb-3">{onboarding.success.whatNext}</h2>
          <ul className="text-left text-sm text-gray-600 space-y-2">
            <li className="flex items-start gap-2">
              <span className="text-green-600 mt-0.5">✓</span>
              <span>{onboarding.success.profileSaved}</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 mt-0.5">✓</span>
              <span>{onboarding.success.findMatches}</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 mt-0.5">✓</span>
              <span>{onboarding.success.updateAnytime}</span>
            </li>
          </ul>
        </div>

        {/* CTA */}
        <div className="space-y-3">
          <Link
            href="/home/searcher"
            className="block w-full py-4 rounded-full bg-[color:var(--easy-yellow)] text-black font-semibold text-lg hover:opacity-90 transition shadow-md hover:shadow-lg"
          >
            {onboarding.success.startBrowsing}
          </Link>
          <Link
            href="/profile/enhance"
            className="block w-full py-4 rounded-full bg-[color:var(--easy-purple)] text-white font-semibold text-lg hover:opacity-90 transition shadow-md hover:shadow-lg"
          >
            {onboarding.success.enhanceProfile}
          </Link>
          <Link
            href="/"
            className="flex items-center justify-center gap-2 w-full py-3 rounded-full text-gray-600 font-medium hover:text-[color:var(--easy-purple)] transition"
          >
            <Home className="w-5 h-5" />
            {onboarding.success.backToHome}
          </Link>
        </div>

        {/* Footer note */}
        <p className="text-sm text-gray-400">
          {onboarding.success.thankYouNote}
        </p>
      </div>
    </main>
  );
}
