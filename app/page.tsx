'use client';

import Link from 'next/link';
import { Home as HomeIcon, Users, Heart, Shield, Target, Zap } from 'lucide-react';
import { useLanguage } from '@/lib/i18n/use-language';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import ResumeOnboardingModal from '@/components/ResumeOnboardingModal';

export default function Home() {
  const { t, getSection } = useLanguage();
  const landing = getSection('landing');

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header with Language Switcher */}
      <header className="absolute top-0 right-0 p-6 z-50">
        <div className="flex items-center gap-4">
          <Link
            href="/login"
            className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-[var(--easy-purple)] transition"
          >
            {landing.hero.login}
          </Link>
          <LanguageSwitcher />
        </div>
      </header>

      {/* Hero Section */}
      <section className="flex items-center justify-center min-h-screen p-6">
        <div className="max-w-4xl w-full text-center space-y-8">

          {/* Logo */}
          <div className="flex items-center justify-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-[var(--easy-purple)] flex items-center justify-center">
              <HomeIcon className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-[var(--easy-purple)]">EasyCo</h1>
          </div>

          {/* Icon trio */}
          <div className="flex items-center justify-center gap-4 py-4">
            <div className="w-16 h-16 rounded-full bg-[var(--easy-yellow)] flex items-center justify-center">
              <Users className="w-8 h-8 text-[var(--easy-purple)]" />
            </div>
            <div className="w-16 h-16 rounded-full bg-[var(--easy-purple)] flex items-center justify-center">
              <Heart className="w-8 h-8 text-white" />
            </div>
            <div className="w-16 h-16 rounded-full bg-[var(--easy-yellow)] flex items-center justify-center">
              <HomeIcon className="w-8 h-8 text-[var(--easy-purple)]" />
            </div>
          </div>

          {/* Title and subtitle */}
          <div className="space-y-3 max-w-2xl mx-auto">
            <h2 className="text-4xl font-bold text-[var(--easy-purple)]">
              {landing.hero.title}
            </h2>
            <p className="text-xl text-gray-600">
              {landing.hero.subtitle}
            </p>
          </div>

          {/* Trust Strip */}
          <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-gray-600 py-4">
            <div className="flex items-center gap-2">
              <span className="text-green-500">✓</span>
              {landing.trust.idVerified}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-500">✓</span>
              {landing.trust.listingsVerified}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-500">✓</span>
              {landing.trust.reporting}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-500">✓</span>
              {landing.trust.support}
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 max-w-2xl mx-auto">
            <Link
              href="/onboarding/searcher/basic-info"
              className="py-4 px-6 rounded-full bg-[var(--easy-yellow)] text-black font-semibold text-lg hover:opacity-90 transition shadow-md hover:shadow-lg"
            >
              {landing.hero.ctaSearcher}
            </Link>

            <Link
              href="/onboarding/owner/basic-info"
              className="py-4 px-6 rounded-full bg-[var(--easy-purple)] text-white font-semibold text-lg hover:opacity-90 transition shadow-md hover:shadow-lg"
            >
              {landing.hero.ctaOwner}
            </Link>
          </div>

          {/* Social Proof */}
          <p className="text-sm text-gray-400 pt-4">
            {landing.socialProof.claim}
          </p>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

            {/* Benefit 1: Verified */}
            <div className="text-center space-y-4 p-6 rounded-2xl hover:shadow-lg transition">
              <div className="w-16 h-16 mx-auto rounded-full bg-purple-100 flex items-center justify-center">
                <Shield className="w-8 h-8 text-[var(--easy-purple)]" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">
                {landing.benefits.verified.title}
              </h3>
              <p className="text-gray-600">
                {landing.benefits.verified.description}
              </p>
            </div>

            {/* Benefit 2: Compatibility */}
            <div className="text-center space-y-4 p-6 rounded-2xl hover:shadow-lg transition">
              <div className="w-16 h-16 mx-auto rounded-full bg-yellow-100 flex items-center justify-center">
                <Target className="w-8 h-8 text-[var(--easy-purple)]" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">
                {landing.benefits.compatibility.title}
              </h3>
              <p className="text-gray-600">
                {landing.benefits.compatibility.description}
              </p>
            </div>

            {/* Benefit 3: Groups */}
            <div className="text-center space-y-4 p-6 rounded-2xl hover:shadow-lg transition">
              <div className="w-16 h-16 mx-auto rounded-full bg-purple-100 flex items-center justify-center">
                <Zap className="w-8 h-8 text-[var(--easy-purple)]" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">
                {landing.benefits.groups.title}
              </h3>
              <p className="text-gray-600">
                {landing.benefits.groups.description}
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 bg-gray-50 border-t border-gray-200">
        <div className="max-w-6xl mx-auto text-center space-y-4">
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-600">
            <Link href="/legal/privacy" className="hover:text-[var(--easy-purple)] transition">
              {t('footer.privacy')}
            </Link>
            <Link href="/legal/terms" className="hover:text-[var(--easy-purple)] transition">
              {t('footer.terms')}
            </Link>
            <Link href="/legal/mentions" className="hover:text-[var(--easy-purple)] transition">
              {t('footer.mentions')}
            </Link>
            <Link href="/legal/cookies" className="hover:text-[var(--easy-purple)] transition">
              {t('footer.cookies')}
            </Link>
          </div>
          <p className="text-sm text-gray-500">
            © 2025 EasyCo. {t('footer.copyright')}
          </p>
        </div>
      </footer>

      {/* Resume Onboarding Modal */}
      <ResumeOnboardingModal />
    </main>
  );
}
