'use client';

import { useState } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { Shield, Target, Zap } from 'lucide-react';
import { useLanguage } from '@/lib/i18n/use-language';
import { useTheme } from '@/contexts/ThemeContext';
import ResumeOnboardingModal from '@/components/ResumeOnboardingModal';
import PublicSearchBar from '@/components/PublicSearchBar';
import ModernPublicHeader from '@/components/layout/ModernPublicHeader';
import SlidePageManager from '@/components/layout/SlidePageManager';
import ModernHeroSection from '@/components/landing/ModernHeroSection';
import Footer from '@/components/layout/Footer';
import InfinitePropertyCarousel from '@/components/landing/InfinitePropertyCarousel';

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
  const { resolvedTheme } = useTheme();
  const landing = getSection('landing');
  const [activePage, setActivePage] = useState<'explorer' | 'residents' | 'owners' | null>(null);

  return (
    <div
      className="min-h-screen transition-colors duration-300"
      style={{ background: resolvedTheme === 'dark' ? '#0F0F12' : '#FFFFFF' }}
    >
      {/* Modern Header with slide page navigation */}
      <ModernPublicHeader activePage={activePage} onNavigate={setActivePage} />

      {/* Slide Page Manager - shows Explorer/Residents/Owners pages */}
      <SlidePageManager activePage={activePage} />

      {/* Main landing content - only show when no slide page is active */}
      {!activePage && (
      <main>
        {/* Hero Section with Background Carousel */}
        <div className="relative">
          {/* Background Carousel - Infinite scrolling hero images */}
          <InfinitePropertyCarousel speed={120} opacity={1} blur={0} />

          {/* Modern Hero Section */}
          <ModernHeroSection />
        </div>

      {/* Property Preview Grid */}
      <PropertyPreviewGrid limit={6} />

      {/* Benefits Section - Modern Design with Logo Gradient Colors */}
      <section
        className="py-20 px-6 transition-colors duration-300"
        style={{
          background: resolvedTheme === 'dark'
            ? 'linear-gradient(to bottom, #0F0F12, #141418)'
            : 'linear-gradient(to bottom, #FFFFFF, #F9FAFB)',
        }}
      >
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

            {/* Benefit 1: Verified - Owner colors (mauve) */}
            <div className="relative group">
              {/* Background gradient on hover */}
              <div
                className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{
                  background: resolvedTheme === 'dark'
                    ? 'linear-gradient(to bottom right, #ad568420, #ad568420)'
                    : 'linear-gradient(to bottom right, #ad568415, #ad568415)',
                }}
              />

              <div
                className="relative text-center space-y-4 p-8 rounded-3xl border transition-all duration-300 hover:shadow-xl hover:scale-[1.02]"
                style={{
                  background: resolvedTheme === 'dark' ? 'rgba(26, 26, 31, 0.8)' : '#FFFFFF',
                  borderColor: resolvedTheme === 'dark' ? '#ad568440' : '#ad568430',
                  backdropFilter: resolvedTheme === 'dark' ? 'blur(10px)' : 'none',
                }}
              >
                <div
                  className="w-20 h-20 mx-auto rounded-2xl flex items-center justify-center shadow-lg"
                  style={{
                    background: '#ad5684',
                  }}
                >
                  <Shield className="w-10 h-10 text-white" />
                </div>
                <h3
                  className="text-2xl font-bold bg-clip-text text-transparent"
                  style={{
                    backgroundImage: 'linear-gradient(to right, #ad5684, #ad5684)',
                  }}
                >
                  {landing.benefits.verified.title}
                </h3>
                <p className={resolvedTheme === 'dark' ? 'text-gray-400 leading-relaxed' : 'text-gray-600 leading-relaxed'}>
                  {landing.benefits.verified.description}
                </p>
              </div>
            </div>

            {/* Benefit 2: Compatibility - Resident colors (coral/orange) */}
            <div className="relative group">
              {/* Background gradient on hover */}
              <div
                className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{
                  background: resolvedTheme === 'dark'
                    ? 'linear-gradient(to bottom right, #ee573620, #ee573620)'
                    : 'linear-gradient(to bottom right, #ee573615, #ee573615)',
                }}
              />

              <div
                className="relative text-center space-y-4 p-8 rounded-3xl border transition-all duration-300 hover:shadow-xl hover:scale-[1.02]"
                style={{
                  background: resolvedTheme === 'dark' ? 'rgba(26, 26, 31, 0.8)' : '#FFFFFF',
                  borderColor: resolvedTheme === 'dark' ? '#ee573640' : '#ee573630',
                  backdropFilter: resolvedTheme === 'dark' ? 'blur(10px)' : 'none',
                }}
              >
                <div
                  className="w-20 h-20 mx-auto rounded-2xl flex items-center justify-center shadow-lg"
                  style={{
                    background: '#ee5736',
                  }}
                >
                  <Target className="w-10 h-10 text-white" />
                </div>
                <h3
                  className="text-2xl font-bold bg-clip-text text-transparent"
                  style={{
                    backgroundImage: 'linear-gradient(to right, #ee5736, #ee5736)',
                  }}
                >
                  {landing.benefits.compatibility.title}
                </h3>
                <p className={resolvedTheme === 'dark' ? 'text-gray-400 leading-relaxed' : 'text-gray-600 leading-relaxed'}>
                  {landing.benefits.compatibility.description}
                </p>
              </div>
            </div>

            {/* Benefit 3: Groups - Searcher colors (orange/yellow gold) */}
            <div className="relative group">
              {/* Background gradient on hover */}
              <div
                className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{
                  background: resolvedTheme === 'dark'
                    ? 'linear-gradient(to bottom right, #ff981120, #ff981120)'
                    : 'linear-gradient(to bottom right, #ff981115, #ff981115)',
                }}
              />

              <div
                className="relative text-center space-y-4 p-8 rounded-3xl border transition-all duration-300 hover:shadow-xl hover:scale-[1.02]"
                style={{
                  background: resolvedTheme === 'dark' ? 'rgba(26, 26, 31, 0.8)' : '#FFFFFF',
                  borderColor: resolvedTheme === 'dark' ? '#ff981140' : '#ff981130',
                  backdropFilter: resolvedTheme === 'dark' ? 'blur(10px)' : 'none',
                }}
              >
                <div
                  className="w-20 h-20 mx-auto rounded-2xl flex items-center justify-center shadow-lg"
                  style={{
                    background: '#ff9811',
                  }}
                >
                  <Zap className="w-10 h-10 text-white" />
                </div>
                <h3
                  className="text-2xl font-bold bg-clip-text text-transparent"
                  style={{
                    backgroundImage: 'linear-gradient(to right, #ff9811, #ff9811)',
                  }}
                >
                  {landing.benefits.groups.title}
                </h3>
                <p className={resolvedTheme === 'dark' ? 'text-gray-400 leading-relaxed' : 'text-gray-600 leading-relaxed'}>
                  {landing.benefits.groups.description}
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <HowItWorks />

      {/* Stats Section */}
      <StatsSection />

      {/* Testimonials Section - Désactivé temporairement (pas de vrais utilisateurs) */}
      {/* <Testimonials /> */}

      {/* FAQ Section */}
      <FAQ />

      </main>
      )}

      {/* Footer - always visible */}
      <Footer />

      {/* Resume Onboarding Modal */}
      <ResumeOnboardingModal />
    </div>
  );
}
