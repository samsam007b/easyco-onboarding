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

            {/* Benefit 1: Verified - Owner colors (mauve #9c5698) */}
            <div className="relative group">
              {/* Background gradient on hover */}
              <div
                className="absolute inset-0 superellipse-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{
                  background: resolvedTheme === 'dark'
                    ? 'linear-gradient(to bottom right, rgba(156, 86, 152, 0.12), rgba(156, 86, 152, 0.12))'
                    : 'linear-gradient(to bottom right, rgba(156, 86, 152, 0.08), rgba(156, 86, 152, 0.08))',
                }}
              />

              <div
                className="relative text-center space-y-4 p-8 superellipse-3xl border transition-all duration-300 hover:shadow-xl hover:scale-[1.02]"
                style={{
                  background: resolvedTheme === 'dark' ? 'rgba(26, 26, 31, 0.8)' : '#FFFFFF',
                  borderColor: resolvedTheme === 'dark' ? 'rgba(156, 86, 152, 0.25)' : 'rgba(156, 86, 152, 0.18)',
                  backdropFilter: resolvedTheme === 'dark' ? 'blur(10px)' : 'none',
                }}
              >
                <div
                  className="w-20 h-20 mx-auto superellipse-2xl flex items-center justify-center shadow-lg"
                  style={{
                    background: 'var(--owner-primary)',
                  }}
                >
                  <Shield className="w-10 h-10 text-white" />
                </div>
                <h3
                  className="text-2xl font-bold bg-clip-text text-transparent"
                  style={{
                    backgroundImage: 'linear-gradient(to right, var(--owner-primary), var(--owner-primary))',
                  }}
                >
                  {landing.benefits.verified.title}
                </h3>
                <p className={resolvedTheme === 'dark' ? 'text-gray-400 leading-relaxed' : 'text-gray-600 leading-relaxed'}>
                  {landing.benefits.verified.description}
                </p>
              </div>
            </div>

            {/* Benefit 2: Compatibility - Resident colors (coral #e05747) */}
            <div className="relative group">
              {/* Background gradient on hover */}
              <div
                className="absolute inset-0 superellipse-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{
                  background: resolvedTheme === 'dark'
                    ? 'linear-gradient(to bottom right, rgba(224, 87, 71, 0.12), rgba(224, 87, 71, 0.12))'
                    : 'linear-gradient(to bottom right, rgba(224, 87, 71, 0.08), rgba(224, 87, 71, 0.08))',
                }}
              />

              <div
                className="relative text-center space-y-4 p-8 superellipse-3xl border transition-all duration-300 hover:shadow-xl hover:scale-[1.02]"
                style={{
                  background: resolvedTheme === 'dark' ? 'rgba(26, 26, 31, 0.8)' : '#FFFFFF',
                  borderColor: resolvedTheme === 'dark' ? 'rgba(224, 87, 71, 0.25)' : 'rgba(224, 87, 71, 0.18)',
                  backdropFilter: resolvedTheme === 'dark' ? 'blur(10px)' : 'none',
                }}
              >
                <div
                  className="w-20 h-20 mx-auto superellipse-2xl flex items-center justify-center shadow-lg"
                  style={{
                    background: 'var(--resident-primary)',
                  }}
                >
                  <Target className="w-10 h-10 text-white" />
                </div>
                <h3
                  className="text-2xl font-bold bg-clip-text text-transparent"
                  style={{
                    backgroundImage: 'linear-gradient(to right, var(--resident-primary), var(--resident-primary))',
                  }}
                >
                  {landing.benefits.compatibility.title}
                </h3>
                <p className={resolvedTheme === 'dark' ? 'text-gray-400 leading-relaxed' : 'text-gray-600 leading-relaxed'}>
                  {landing.benefits.compatibility.description}
                </p>
              </div>
            </div>

            {/* Benefit 3: Groups - Searcher colors (gold #ffa000) */}
            <div className="relative group">
              {/* Background gradient on hover */}
              <div
                className="absolute inset-0 superellipse-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{
                  background: resolvedTheme === 'dark'
                    ? 'linear-gradient(to bottom right, rgba(255, 160, 0, 0.12), rgba(255, 160, 0, 0.12))'
                    : 'linear-gradient(to bottom right, rgba(255, 160, 0, 0.08), rgba(255, 160, 0, 0.08))',
                }}
              />

              <div
                className="relative text-center space-y-4 p-8 superellipse-3xl border transition-all duration-300 hover:shadow-xl hover:scale-[1.02]"
                style={{
                  background: resolvedTheme === 'dark' ? 'rgba(26, 26, 31, 0.8)' : '#FFFFFF',
                  borderColor: resolvedTheme === 'dark' ? 'rgba(255, 160, 0, 0.25)' : 'rgba(255, 160, 0, 0.18)',
                  backdropFilter: resolvedTheme === 'dark' ? 'blur(10px)' : 'none',
                }}
              >
                <div
                  className="w-20 h-20 mx-auto superellipse-2xl flex items-center justify-center shadow-lg"
                  style={{
                    background: 'var(--searcher-primary)',
                  }}
                >
                  <Zap className="w-10 h-10 text-white" />
                </div>
                <h3
                  className="text-2xl font-bold bg-clip-text text-transparent"
                  style={{
                    backgroundImage: 'linear-gradient(to right, var(--searcher-primary), var(--searcher-primary))',
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

      {/* Features Signature Section - 5 features différenciantes prioritaires */}
      <section
        className="py-20 px-6 transition-colors duration-300"
        style={{
          background: resolvedTheme === 'dark'
            ? 'linear-gradient(to bottom, #141418, #0F0F12)'
            : 'linear-gradient(to bottom, #F9FAFB, #FFFFFF)',
        }}
      >
        <div className="max-w-6xl mx-auto">
          {/* Section Title */}
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 bg-clip-text text-transparent" style={{
              backgroundImage: 'linear-gradient(135deg, #9c5698 0%, #e05747 50%, #ffa000 100%)',
            }}>
              Les features qui changent tout
            </h2>
            <p className={`text-lg ${resolvedTheme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              Fini les galères du co-living — voici comment Izzico simplifie vraiment ton quotidien
            </p>
          </div>

          {/* Features Grid */}
          <div className="space-y-12">
            {/* Feature 1: Living Match */}
            <div className="relative group">
              <div
                className="absolute inset-0 superellipse-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{
                  background: resolvedTheme === 'dark'
                    ? 'linear-gradient(to bottom right, rgba(255, 160, 0, 0.12), rgba(224, 87, 71, 0.12))'
                    : 'linear-gradient(to bottom right, rgba(255, 160, 0, 0.08), rgba(224, 87, 71, 0.08))',
                }}
              />
              <div
                className="relative p-8 superellipse-3xl border transition-all duration-300 hover:shadow-xl"
                style={{
                  background: resolvedTheme === 'dark' ? 'rgba(26, 26, 31, 0.8)' : '#FFFFFF',
                  borderColor: resolvedTheme === 'dark' ? 'rgba(255, 160, 0, 0.25)' : 'rgba(255, 160, 0, 0.18)',
                  backdropFilter: resolvedTheme === 'dark' ? 'blur(10px)' : 'none',
                }}
              >
                <div className="flex flex-col md:flex-row gap-8 items-center">
                  <div
                    className="w-20 h-20 superellipse-2xl flex items-center justify-center shadow-lg flex-shrink-0"
                    style={{ background: 'linear-gradient(135deg, #ffa000, #e05747)' }}
                  >
                    <Target className="w-10 h-10 text-white" />
                  </div>
                  <div className="flex-1 text-center md:text-left">
                    <h3 className="text-2xl font-bold mb-3 bg-clip-text text-transparent" style={{
                      backgroundImage: 'linear-gradient(to right, #ffa000, #e05747)',
                    }}>
                      Living Match : trouve ceux qui te ressemblent
                    </h3>
                    <p className={`text-lg mb-3 ${resolvedTheme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                      Crée ton Living Persona en 3 minutes — notre algorithme trouve les résidences et colocataires qui matchent vraiment avec toi.
                    </p>
                    <p className={resolvedTheme === 'dark' ? 'text-gray-400 leading-relaxed' : 'text-gray-600 leading-relaxed'}>
                      Fini les profils vides et les incompatibilités. Ton Living Persona analyse tes rythmes de vie, tes valeurs et ton quotidien.
                      Résultat ? Des Living Matchs avec un score de compatibilité clair (70-90%+). Tu sais exactement pourquoi ça matche — et pourquoi ça vaut le coup de postuler.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Feature 2: Resident Swipe */}
            <div className="relative group">
              <div
                className="absolute inset-0 superellipse-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{
                  background: resolvedTheme === 'dark'
                    ? 'linear-gradient(to bottom right, rgba(224, 87, 71, 0.12), rgba(255, 160, 0, 0.12))'
                    : 'linear-gradient(to bottom right, rgba(224, 87, 71, 0.08), rgba(255, 160, 0, 0.08))',
                }}
              />
              <div
                className="relative p-8 superellipse-3xl border transition-all duration-300 hover:shadow-xl"
                style={{
                  background: resolvedTheme === 'dark' ? 'rgba(26, 26, 31, 0.8)' : '#FFFFFF',
                  borderColor: resolvedTheme === 'dark' ? 'rgba(224, 87, 71, 0.25)' : 'rgba(224, 87, 71, 0.18)',
                  backdropFilter: resolvedTheme === 'dark' ? 'blur(10px)' : 'none',
                }}
              >
                <div className="flex flex-col md:flex-row gap-8 items-center">
                  <div
                    className="w-20 h-20 superellipse-2xl flex items-center justify-center shadow-lg flex-shrink-0"
                    style={{ background: 'linear-gradient(135deg, #e05747, #ffa000)' }}
                  >
                    <Zap className="w-10 h-10 text-white" />
                  </div>
                  <div className="flex-1 text-center md:text-left">
                    <h3 className="text-2xl font-bold mb-3 bg-clip-text text-transparent" style={{
                      backgroundImage: 'linear-gradient(to right, #e05747, #ffa000)',
                    }}>
                      Resident Swipe : swipe pour trouver tes futurs colocs
                    </h3>
                    <p className={`text-lg mb-3 ${resolvedTheme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                      Compatible à 87% ? C'est parti pour un café. Incompatible ? Next.
                    </p>
                    <p className={resolvedTheme === 'dark' ? 'text-gray-400 leading-relaxed' : 'text-gray-600 leading-relaxed'}>
                      Ton futur colocataire est à un swipe de distance. Découvre des profils vérifiés avec un score de compatibilité basé sur vos rythmes de vie, vos valeurs et vos hobbies.
                      Swipe, matche, discute — simple, rapide, efficace.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Feature 3: Smart Split & Split & Scan */}
            <div className="relative group">
              <div
                className="absolute inset-0 superellipse-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{
                  background: resolvedTheme === 'dark'
                    ? 'linear-gradient(to bottom right, rgba(224, 87, 71, 0.12), rgba(224, 87, 71, 0.12))'
                    : 'linear-gradient(to bottom right, rgba(224, 87, 71, 0.08), rgba(224, 87, 71, 0.08))',
                }}
              />
              <div
                className="relative p-8 superellipse-3xl border transition-all duration-300 hover:shadow-xl"
                style={{
                  background: resolvedTheme === 'dark' ? 'rgba(26, 26, 31, 0.8)' : '#FFFFFF',
                  borderColor: resolvedTheme === 'dark' ? 'rgba(224, 87, 71, 0.25)' : 'rgba(224, 87, 71, 0.18)',
                  backdropFilter: resolvedTheme === 'dark' ? 'blur(10px)' : 'none',
                }}
              >
                <div className="flex flex-col md:flex-row gap-8 items-center">
                  <div
                    className="w-20 h-20 superellipse-2xl flex items-center justify-center shadow-lg flex-shrink-0"
                    style={{ background: 'var(--resident-primary)' }}
                  >
                    <Shield className="w-10 h-10 text-white" />
                  </div>
                  <div className="flex-1 text-center md:text-left">
                    <h3 className="text-2xl font-bold mb-3 bg-clip-text text-transparent" style={{
                      backgroundImage: 'linear-gradient(to right, var(--resident-primary), var(--resident-primary))',
                    }}>
                      Split & Scan : partage des dépenses sans prise de tête
                    </h3>
                    <p className={`text-lg mb-3 ${resolvedTheme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                      Scanne un ticket, on calcule qui paie quoi. Automatiquement.
                    </p>
                    <p className={resolvedTheme === 'dark' ? 'text-gray-400 leading-relaxed' : 'text-gray-600 leading-relaxed'}>
                      Plus de prises de tête sur les courses ou les factures. Scanne ton ticket avec ton téléphone, Split & Scan calcule automatiquement la répartition équitable entre colocataires.
                      Tout est clair, tout est juste — et tout le monde est content.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Feature 4: Resident Match (for Owners) */}
            <div className="relative group">
              <div
                className="absolute inset-0 superellipse-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{
                  background: resolvedTheme === 'dark'
                    ? 'linear-gradient(to bottom right, rgba(156, 86, 152, 0.12), rgba(156, 86, 152, 0.12))'
                    : 'linear-gradient(to bottom right, rgba(156, 86, 152, 0.08), rgba(156, 86, 152, 0.08))',
                }}
              />
              <div
                className="relative p-8 superellipse-3xl border transition-all duration-300 hover:shadow-xl"
                style={{
                  background: resolvedTheme === 'dark' ? 'rgba(26, 26, 31, 0.8)' : '#FFFFFF',
                  borderColor: resolvedTheme === 'dark' ? 'rgba(156, 86, 152, 0.25)' : 'rgba(156, 86, 152, 0.18)',
                  backdropFilter: resolvedTheme === 'dark' ? 'blur(10px)' : 'none',
                }}
              >
                <div className="flex flex-col md:flex-row gap-8 items-center">
                  <div
                    className="w-20 h-20 superellipse-2xl flex items-center justify-center shadow-lg flex-shrink-0"
                    style={{ background: 'var(--owner-primary)' }}
                  >
                    <Shield className="w-10 h-10 text-white" />
                  </div>
                  <div className="flex-1 text-center md:text-left">
                    <h3 className="text-2xl font-bold mb-3 bg-clip-text text-transparent" style={{
                      backgroundImage: 'linear-gradient(to right, var(--owner-primary), var(--owner-primary))',
                    }}>
                      Resident Match : trouve les bons résidents, automatiquement
                    </h3>
                    <p className={`text-lg mb-3 ${resolvedTheme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                      Reçois uniquement des candidatures compatibles avec tes résidents actuels.
                    </p>
                    <p className={resolvedTheme === 'dark' ? 'text-gray-400 leading-relaxed' : 'text-gray-600 leading-relaxed'}>
                      Ton temps est précieux. Resident Match analyse chaque candidature et te présente uniquement les profils compatibles avec tes résidents actuels — mêmes valeurs, mêmes rythmes, mêmes attentes.
                      Moins de tri, plus de qualité, meilleure ambiance.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Feature 5: Issue Hub */}
            <div className="relative group">
              <div
                className="absolute inset-0 superellipse-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{
                  background: resolvedTheme === 'dark'
                    ? 'linear-gradient(to bottom right, rgba(224, 87, 71, 0.12), rgba(156, 86, 152, 0.12))'
                    : 'linear-gradient(to bottom right, rgba(224, 87, 71, 0.08), rgba(156, 86, 152, 0.08))',
                }}
              />
              <div
                className="relative p-8 superellipse-3xl border transition-all duration-300 hover:shadow-xl"
                style={{
                  background: resolvedTheme === 'dark' ? 'rgba(26, 26, 31, 0.8)' : '#FFFFFF',
                  borderColor: resolvedTheme === 'dark' ? 'rgba(200, 85, 112, 0.25)' : 'rgba(200, 85, 112, 0.18)',
                  backdropFilter: resolvedTheme === 'dark' ? 'blur(10px)' : 'none',
                }}
              >
                <div className="flex flex-col md:flex-row gap-8 items-center">
                  <div
                    className="w-20 h-20 superellipse-2xl flex items-center justify-center shadow-lg flex-shrink-0"
                    style={{ background: 'linear-gradient(135deg, #e05747, #9c5698)' }}
                  >
                    <Target className="w-10 h-10 text-white" />
                  </div>
                  <div className="flex-1 text-center md:text-left">
                    <h3 className="text-2xl font-bold mb-3 bg-clip-text text-transparent" style={{
                      backgroundImage: 'linear-gradient(to right, #e05747, #9c5698)',
                    }}>
                      Issue Hub : gère les réparations avec sérénité
                    </h3>
                    <p className={`text-lg mb-3 ${resolvedTheme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                      Résidents et propriétaires sur la même longueur d'onde.
                    </p>
                    <p className={resolvedTheme === 'dark' ? 'text-gray-400 leading-relaxed' : 'text-gray-600 leading-relaxed'}>
                      Une fuite ? Un problème de chauffage ? Crée un ticket en 2 clics avec photos. Ton propriétaire reçoit la demande, te répond et suit l'avancement avec son artisan.
                      Tout est tracé, tout est transparent — zéro stress pour tout le monde.
                    </p>
                  </div>
                </div>
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
