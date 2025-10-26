// components/ConsentActions.tsx
'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { safeLocalStorage } from '@/lib/browser';
import { useLanguage } from '@/lib/i18n/use-language';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { Shield, Lock, Zap } from 'lucide-react';

interface ConsentActionsProps {
  source?: string;
  nextHref?: string;
}

export default function ConsentActions({ source = 'unknown', nextHref = '/onboarding/searcher/basic-info' }: ConsentActionsProps) {
  const router = useRouter();
  const { t, getSection } = useLanguage();
  const consent = getSection('consent');

  const accept = () => {
    safeLocalStorage.set('consent', 'accepted');
    safeLocalStorage.set('source', source);
    router.push(nextHref);
  };

  const decline = () => {
    safeLocalStorage.set('consent', 'declined');
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header with Language Switcher */}
      <header className="absolute top-0 right-0 p-6 z-50">
        <LanguageSwitcher />
      </header>

      <main className="max-w-3xl mx-auto px-6 py-16 space-y-8">
        {/* Title Section */}
        <div className="text-center space-y-3">
          <h1 className="text-3xl font-bold text-[var(--easy-purple)]">
            {consent.title}
          </h1>
          <p className="text-lg text-gray-600">
            {consent.subtitle}
          </p>
        </div>

        {/* Main Description */}
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
          <p className="text-gray-700 leading-relaxed">
            {consent.description}
          </p>
        </div>

        {/* Benefits/Guarantees */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-start gap-3 bg-purple-50 rounded-xl p-4">
            <div className="w-10 h-10 rounded-full bg-[var(--easy-purple)] flex items-center justify-center flex-shrink-0">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="font-medium text-gray-900">{consent.bullets.anonymous}</div>
            </div>
          </div>

          <div className="flex items-start gap-3 bg-purple-50 rounded-xl p-4">
            <div className="w-10 h-10 rounded-full bg-[var(--easy-purple)] flex items-center justify-center flex-shrink-0">
              <Lock className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="font-medium text-gray-900">{consent.bullets.secure}</div>
            </div>
          </div>

          <div className="flex items-start gap-3 bg-purple-50 rounded-xl p-4">
            <div className="w-10 h-10 rounded-full bg-[var(--easy-purple)] flex items-center justify-center flex-shrink-0">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="font-medium text-gray-900">{consent.bullets.improve}</div>
            </div>
          </div>

          <div className="flex items-start gap-3 bg-purple-50 rounded-xl p-4">
            <div className="w-10 h-10 rounded-full bg-[var(--easy-purple)] flex items-center justify-center flex-shrink-0">
              <span className="text-white text-lg">✓</span>
            </div>
            <div>
              <div className="font-medium text-gray-900">{consent.bullets.optional}</div>
            </div>
          </div>
        </div>

        {/* Privacy Notice */}
        <div className="text-center text-sm text-gray-600">
          {consent.privacy}{' '}
          <Link href="/legal/privacy" className="text-[var(--easy-purple)] hover:underline font-medium">
            {consent.privacyLink}
          </Link>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
          <button
            onClick={accept}
            className="w-full sm:flex-1 px-6 py-4 rounded-full bg-[var(--easy-purple)] text-white font-semibold text-lg hover:opacity-90 transition shadow-md hover:shadow-lg"
          >
            {consent.ctaAccept}
          </button>
          <button
            onClick={decline}
            className="w-full sm:w-auto px-6 py-4 rounded-full border-2 border-gray-300 hover:bg-gray-50 transition font-medium text-gray-700"
          >
            {consent.ctaDecline}
          </button>
        </div>

        {/* Debug Info (kept for development) */}
        {process.env.NODE_ENV === 'development' && (
          <p className="text-xs text-gray-400 text-center">Source: {source}</p>
        )}
      </main>
    </div>
  );
}
