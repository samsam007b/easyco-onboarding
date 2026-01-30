'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { useTheme } from '@/contexts/ThemeContext';
import ResumeOnboardingModal from '@/components/ResumeOnboardingModal';
import ModernPublicHeader from '@/components/layout/ModernPublicHeader';
import SlidePageManager from '@/components/layout/SlidePageManager';
import RoleHeroSection from '@/components/landing/RoleHeroSection';
import RoleFeaturesSection from '@/components/landing/RoleFeaturesSection';
import Footer from '@/components/layout/Footer';
import InfinitePropertyCarousel from '@/components/landing/InfinitePropertyCarousel';
import { type Role } from '@/components/landing/RoleSwitcher';

// ============================================================================
// PERFORMANCE OPTIMIZATION: Dynamic Imports for Below-the-Fold Components
// ============================================================================

const PropertyPreviewGrid = dynamic(() => import('@/components/PropertyPreviewGrid'), {
  loading: () => (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="h-96 bg-gray-100 superellipse-3xl animate-pulse" />
    </div>
  ),
});

const HowItWorks = dynamic(() => import('@/components/HowItWorks'), {
  loading: () => (
    <div className="max-w-6xl mx-auto px-6 py-20">
      <div className="h-96 bg-gray-100 superellipse-3xl animate-pulse" />
    </div>
  ),
});

const StatsSection = dynamic(() => import('@/components/StatsSection'), {
  loading: () => (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <div className="h-32 bg-gray-100 superellipse-2xl animate-pulse" />
    </div>
  ),
});

const Testimonials = dynamic(() => import('@/components/Testimonials'), {
  loading: () => (
    <div className="max-w-6xl mx-auto px-6 py-20">
      <div className="h-80 bg-gray-100 superellipse-3xl animate-pulse" />
    </div>
  ),
});

const FAQ = dynamic(() => import('@/components/FAQ'), {
  loading: () => (
    <div className="max-w-3xl mx-auto px-6 py-20">
      <div className="h-96 bg-gray-100 superellipse-2xl animate-pulse" />
    </div>
  ),
});

export default function Home() {
  const { resolvedTheme } = useTheme();
  const [activePage, setActivePage] = useState<'explorer' | 'residents' | 'owners' | null>(null);
  const [activeRole, setActiveRole] = useState<Role>('searcher');

  return (
    <div
      className="min-h-screen transition-colors duration-300"
      data-role={activeRole}
      style={{ background: resolvedTheme === 'dark' ? '#0F0F12' : '#FFFFFF' }}
    >
      {/* Modern Header with role switcher */}
      <ModernPublicHeader
        activePage={activePage}
        onNavigate={setActivePage}
        activeRole={activeRole}
        onRoleChange={setActiveRole}
      />

      {/* Slide Page Manager - shows Explorer/Residents/Owners pages (legacy) */}
      <SlidePageManager activePage={activePage} />

      {/* Main landing content - always visible with role-based content */}
      {!activePage && (
      <main>
        {/* Hero Section with Background Carousel */}
        <div className="relative">
          {/* Background Carousel - Only for Searcher role */}
          {activeRole === 'searcher' && (
            <InfinitePropertyCarousel speed={120} opacity={1} blur={0} />
          )}

          {/* Role-based Hero Section */}
          <RoleHeroSection activeRole={activeRole} />
        </div>

      {/* Property Preview Grid - Only for Searchers */}
      {activeRole === 'searcher' && <PropertyPreviewGrid limit={6} />}

      {/* Role-based Features Section */}
      <RoleFeaturesSection activeRole={activeRole} />

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
