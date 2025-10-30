'use client';

import Link from 'next/link';
import dynamic from 'next/dynamic';
import { Home as HomeIcon, Users, Heart, Shield, Target, Zap, Search as SearchIcon } from 'lucide-react';
import { useLanguage } from '@/lib/i18n/use-language';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import ResumeOnboardingModal from '@/components/ResumeOnboardingModal';
import PublicSearchBar from '@/components/PublicSearchBar';

// ============================================================================
// PERFORMANCE OPTIMIZATION: Dynamic Imports for Below-the-Fold Components
// ============================================================================

const PropertyPreviewGrid = dynamic(() => import('@/components/PropertyPreviewGrid'), {
  loading: () => (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="h-96 bg-gray-100 rounded-3xl animate-pulse" />
    </div>
  ),
});

const HowItWorks = dynamic(() => import('@/components/HowItWorks'), {
  loading: () => (
    <div className="max-w-6xl mx-auto px-6 py-20">
      <div className="h-96 bg-gray-100 rounded-3xl animate-pulse" />
    </div>
  ),
});

const StatsSection = dynamic(() => import('@/components/StatsSection'), {
  loading: () => (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <div className="h-32 bg-gray-100 rounded-2xl animate-pulse" />
    </div>
  ),
});

const Testimonials = dynamic(() => import('@/components/Testimonials'), {
  loading: () => (
    <div className="max-w-6xl mx-auto px-6 py-20">
      <div className="h-80 bg-gray-100 rounded-3xl animate-pulse" />
    </div>
  ),
});

const FAQ = dynamic(() => import('@/components/FAQ'), {
  loading: () => (
    <div className="max-w-3xl mx-auto px-6 py-20">
      <div className="h-96 bg-gray-100 rounded-2xl animate-pulse" />
    </div>
  ),
});

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

      {/* Hero Section with Search */}
      <section className="pt-32 pb-16 px-6 bg-gradient-to-b from-purple-50 via-white to-gray-50">
        <div className="max-w-6xl mx-auto">

          {/* Logo and Title */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[var(--easy-purple-900)] to-[var(--easy-purple-700)] flex items-center justify-center shadow-lg">
                <HomeIcon className="w-9 h-9 text-white" />
              </div>
              <h1 className="text-4xl font-bold text-[var(--easy-purple-900)]">EasyCo</h1>
            </div>

            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              {landing.hero.title}
            </h2>
            <p className="text-xl text-gray-600 mb-2">
              {landing.hero.subtitle}
            </p>

            {/* Trust Strip */}
            <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-gray-600 mt-6">
              <div className="flex items-center gap-2">
                <span className="text-green-500 font-bold">✓</span>
                <span className="font-medium">{landing.trust.idVerified}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-500 font-bold">✓</span>
                <span className="font-medium">{landing.trust.listingsVerified}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-500 font-bold">✓</span>
                <span className="font-medium">{landing.trust.support}</span>
              </div>
            </div>
          </div>

          {/* Public Search Bar */}
          <div className="max-w-4xl mx-auto mb-8">
            <PublicSearchBar variant="hero" />
          </div>

          {/* Or Create Account CTAs */}
          <div className="text-center">
            <p className="text-sm text-gray-500 mb-4">
              Ou crée ton compte pour accéder à toutes les fonctionnalités
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/onboarding/searcher/basic-info"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[var(--searcher-primary)] text-black font-semibold hover:bg-[var(--searcher-hover)] transition-all shadow-md hover:shadow-lg"
              >
                <SearchIcon className="w-5 h-5" />
                {landing.hero.ctaSearcher}
              </Link>

              <Link
                href="/onboarding/owner/basic-info"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[var(--owner-primary)] text-white font-semibold hover:bg-[var(--owner-hover)] transition-all shadow-md hover:shadow-lg"
              >
                <HomeIcon className="w-5 h-5" />
                {landing.hero.ctaOwner}
              </Link>
            </div>

            {/* Social Proof */}
            <p className="text-sm text-gray-500 mt-6">
              {landing.socialProof.claim}
            </p>
          </div>

        </div>
      </section>

      {/* Property Preview Grid */}
      <PropertyPreviewGrid limit={6} />

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

      {/* How It Works Section */}
      <HowItWorks />

      {/* Stats Section */}
      <StatsSection />

      {/* Testimonials Section */}
      <Testimonials />

      {/* FAQ Section */}
      <FAQ />

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
