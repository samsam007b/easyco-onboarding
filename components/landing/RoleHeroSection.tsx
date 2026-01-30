'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Search, Home, Building2, Download, Smartphone, BarChart3, Users, Shield, Zap, Target, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useTheme } from '@/contexts/ThemeContext';
import SafeGooglePlacesAutocomplete from '@/components/ui/SafeGooglePlacesAutocomplete';
import DatePicker from '@/components/ui/date-picker';
import BudgetRangePicker from '@/components/ui/budget-range-picker';
import { type Role } from './RoleSwitcher';

interface RoleHeroSectionProps {
  activeRole: Role;
}

// Animation variants for smooth transitions
const contentVariants = {
  enter: {
    opacity: 0,
    filter: 'blur(8px)',
    scale: 1.02,
  },
  center: {
    opacity: 1,
    filter: 'blur(0px)',
    scale: 1,
  },
  exit: {
    opacity: 0,
    filter: 'blur(8px)',
    scale: 0.98,
  },
};

export default function RoleHeroSection({ activeRole }: RoleHeroSectionProps) {
  return (
    <section className="relative pt-24 pb-20 px-6 overflow-hidden min-h-[90vh] flex items-center">
      <div className="relative z-20 max-w-4xl mx-auto w-full">
        <AnimatePresence mode="wait">
          {activeRole === 'searcher' && (
            <motion.div
              key="searcher"
              variants={contentVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
            >
              <HeroSearcher />
            </motion.div>
          )}
          {activeRole === 'resident' && (
            <motion.div
              key="resident"
              variants={contentVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
            >
              <HeroResident />
            </motion.div>
          )}
          {activeRole === 'owner' && (
            <motion.div
              key="owner"
              variants={contentVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
            >
              <HeroOwner />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

// ============================================================================
// SEARCHER HERO - Search-focused with property search bar
// ============================================================================
function HeroSearcher() {
  const router = useRouter();
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [budgetRange, setBudgetRange] = useState({ min: 0, max: 2000 });

  const handlePlaceSelect = (place: google.maps.places.PlaceResult) => {
    if (place.formatted_address) {
      setSelectedLocation(place.formatted_address);
    }
  };

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (selectedLocation) params.set('location', selectedLocation);
    if (budgetRange.min > 0) params.set('budget_min', budgetRange.min.toString());
    if (budgetRange.max < 2000) params.set('budget_max', budgetRange.max.toString());
    if (selectedDate) params.set('move_in_date', selectedDate.toISOString().split('T')[0]);
    router.push(`/guest${params.toString() ? `?${params.toString()}` : ''}`);
  };

  return (
    <>
      {/* Glassmorphism card */}
      <div
        className="rounded-[40px] shadow-2xl mb-12 relative"
        style={{ transform: 'translateZ(0)', perspective: '1000px', overflow: 'visible' }}
      >
        {/* Gradient glass background */}
        <div className="absolute inset-0 rounded-[40px]"
          style={{
            background: 'linear-gradient(135deg, rgba(255, 160, 0, 0.25) 0%, rgba(224, 87, 71, 0.22) 50%, rgba(156, 86, 152, 0.25) 100%)',
            backdropFilter: 'blur(50px) saturate(250%) brightness(1.15)',
            WebkitBackdropFilter: 'blur(50px) saturate(250%) brightness(1.15)',
            boxShadow: 'inset 0 0 60px rgba(255, 255, 255, 0.4), inset 0 -2px 30px rgba(255, 160, 0, 0.3)',
          }}
        />

        {/* Border glow */}
        <div className="absolute -inset-[2px] rounded-[42px] pointer-events-none"
          style={{
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.6) 0%, rgba(255, 160, 0, 0.4) 25%, rgba(224, 87, 71, 0.4) 50%, rgba(156, 86, 152, 0.4) 75%, rgba(255, 255, 255, 0.6) 100%)',
            filter: 'blur(1px)',
            opacity: 0.6,
          }}
        />

        {/* Content */}
        <div className="p-8 md:p-10 relative z-10">
          {/* Logo Badge */}
          <div className="flex justify-center mb-6">
            <div className="relative w-24 h-24">
              <div
                className="absolute inset-0 superellipse-2xl shadow-2xl"
                style={{
                  background: 'linear-gradient(135deg, #ffa000 0%, #e05747 50%, #9c5698 100%)',
                  boxShadow: '0 8px 32px rgba(255, 160, 0, 0.4), 0 4px 16px rgba(224, 87, 71, 0.3)'
                }}
              />
              <div
                className="absolute inset-0 superellipse-2xl border border-white/50"
                style={{
                  background: 'rgba(255, 255, 255, 0.25)',
                  backdropFilter: 'blur(20px) saturate(180%)',
                }}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <img
                  src="/logos/izzico-icon-squircle-blanc.svg"
                  alt="Izzico"
                  className="w-[85px] h-[85px] drop-shadow-lg"
                />
              </div>
            </div>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-white text-center mb-2 leading-tight">
            Trouve ton co-living
          </h1>
          <p className="text-lg md:text-xl text-white/90 text-center mb-0">
            Facile, Rapide et Sécurisé
          </p>
        </div>

        {/* Search form */}
        <div className="bg-white p-4 relative z-10 rounded-b-[40px]">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
            <div className="p-4 superellipse-2xl hover:bg-searcher-50/50 transition-all group">
              <label className="block text-xs font-semibold text-gray-900 mb-1">Où ?</label>
              <SafeGooglePlacesAutocomplete
                onPlaceSelect={handlePlaceSelect}
                placeholder="Ville, quartier..."
                iconClassName="w-4 h-4 text-gray-400 group-hover:text-searcher-600 transition-colors"
                inputClassName="w-full text-sm text-gray-600 placeholder:text-gray-400 bg-transparent outline-none"
              />
            </div>
            <div className="p-4 superellipse-2xl hover:bg-searcher-50/50 transition-all group border-l-0 md:border-l border-gray-200">
              <label className="block text-xs font-semibold text-gray-900 mb-1">Budget</label>
              <BudgetRangePicker
                onBudgetChange={(min, max) => setBudgetRange({ min, max })}
                placeholder="€800/mois"
                iconClassName="w-4 h-4 text-gray-400 group-hover:text-searcher-600 transition-colors"
                inputClassName="w-full text-sm text-gray-600 placeholder:text-gray-400 bg-transparent outline-none"
                minBudget={0}
                maxBudget={2000}
              />
            </div>
            <div className="p-4 superellipse-2xl hover:bg-searcher-50/50 transition-all group border-l-0 md:border-l border-gray-200">
              <label className="block text-xs font-semibold text-gray-900 mb-1">Quand ?</label>
              <DatePicker
                onDateSelect={setSelectedDate}
                placeholder="Flexible"
                iconClassName="w-4 h-4 text-gray-400 group-hover:text-searcher-600 transition-colors"
                inputClassName="w-full text-sm text-gray-600 placeholder:text-gray-400 bg-transparent outline-none"
              />
            </div>
            <div className="p-2 flex items-center justify-center">
              <Button
                onClick={handleSearch}
                className="w-full h-full group text-white font-semibold superellipse-2xl shadow-lg hover:shadow-xl transition-all hover:scale-105"
                style={{
                  background: 'var(--searcher-primary)',
                  boxShadow: '0 10px 30px -5px rgba(255, 160, 0, 0.4)'
                }}
              >
                <Search className="w-5 h-5 mr-2" />
                Rechercher
              </Button>
            </div>
          </div>

          {/* Trust badges */}
          <div className="flex flex-wrap items-center justify-center gap-6 mt-4 pt-4 border-t border-gray-200/50">
            <div className="flex items-center gap-2 text-xs text-gray-700">
              <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle2 className="w-3 h-3 text-green-600" />
              </div>
              <span className="font-medium">ID vérifié</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-700">
              <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle2 className="w-3 h-3 text-green-600" />
              </div>
              <span className="font-medium">Annonces vérifiées</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-700">
              <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle2 className="w-3 h-3 text-green-600" />
              </div>
              <span className="font-medium">Support 24/7</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// ============================================================================
// RESIDENT HERO - App-focused with mockup and features
// ============================================================================
function HeroResident() {
  const { resolvedTheme } = useTheme();

  return (
    <>
      <div
        className="rounded-[40px] shadow-2xl mb-12 relative overflow-hidden"
        style={{ transform: 'translateZ(0)' }}
      >
        {/* Gradient glass background - Resident colors */}
        <div className="absolute inset-0 rounded-[40px]"
          style={{
            background: 'linear-gradient(135deg, rgba(224, 87, 71, 0.3) 0%, rgba(255, 124, 16, 0.25) 50%, rgba(255, 160, 0, 0.2) 100%)',
            backdropFilter: 'blur(50px) saturate(250%) brightness(1.15)',
            WebkitBackdropFilter: 'blur(50px) saturate(250%) brightness(1.15)',
            boxShadow: 'inset 0 0 60px rgba(255, 255, 255, 0.4), inset 0 -2px 30px rgba(224, 87, 71, 0.3)',
          }}
        />

        {/* Border glow */}
        <div className="absolute -inset-[2px] rounded-[42px] pointer-events-none"
          style={{
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.6) 0%, rgba(224, 87, 71, 0.5) 50%, rgba(255, 160, 0, 0.4) 100%)',
            filter: 'blur(1px)',
            opacity: 0.6,
          }}
        />

        <div className="relative z-10 p-8 md:p-12">
          <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
            {/* Text content */}
            <div className="flex-1 text-center lg:text-left">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm mb-6">
                <Smartphone className="w-4 h-4 text-white" />
                <span className="text-sm font-medium text-white">App disponible</span>
              </div>

              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
                Ton co-living,<br />simplifié
              </h1>
              <p className="text-lg md:text-xl text-white/90 mb-8">
                Gère tes dépenses, communique avec tes colocs et ton propriétaire, tout en un seul endroit.
              </p>

              {/* Features mini list */}
              <div className="flex flex-wrap justify-center lg:justify-start gap-4 mb-8">
                <div className="flex items-center gap-2 text-white/90">
                  <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center">
                    <Users className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-medium">Split & Scan</span>
                </div>
                <div className="flex items-center gap-2 text-white/90">
                  <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center">
                    <Target className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-medium">Living Match</span>
                </div>
                <div className="flex items-center gap-2 text-white/90">
                  <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center">
                    <Shield className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-medium">Issue Hub</span>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <Link href="/auth">
                  <Button
                    className="px-8 py-6 text-lg font-semibold rounded-2xl text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all"
                    style={{
                      background: 'var(--resident-primary)',
                      boxShadow: '0 10px 30px -5px rgba(224, 87, 71, 0.5)'
                    }}
                  >
                    <Home className="w-5 h-5 mr-2" />
                    Connecte-toi
                  </Button>
                </Link>
                <Link href="/onboarding/resident">
                  <Button
                    variant="outline"
                    className="px-8 py-6 text-lg font-semibold rounded-2xl border-2 border-white/50 text-white hover:bg-white/10 transition-all"
                  >
                    Créer mon compte
                  </Button>
                </Link>
              </div>
            </div>

            {/* App Mockup */}
            <div className="flex-shrink-0">
              <div className="relative">
                {/* Phone frame */}
                <div
                  className="relative w-[280px] h-[560px] rounded-[50px] p-3 shadow-2xl"
                  style={{
                    background: 'linear-gradient(145deg, #1a1a1a, #2d2d2d)',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), inset 0 1px 1px rgba(255,255,255,0.1)'
                  }}
                >
                  {/* Screen */}
                  <div className="w-full h-full rounded-[40px] overflow-hidden bg-gray-100">
                    {/* App screenshot placeholder - will be replaced with actual screenshot */}
                    <div className="w-full h-full bg-gradient-to-b from-resident-50 to-white flex flex-col">
                      {/* Status bar */}
                      <div className="h-12 bg-resident-500 flex items-center justify-center">
                        <span className="text-white text-sm font-medium">Mon co-living</span>
                      </div>
                      {/* Content placeholder */}
                      <div className="flex-1 p-4 space-y-3">
                        <div className="h-24 bg-white rounded-2xl shadow-sm border border-gray-100" />
                        <div className="grid grid-cols-2 gap-2">
                          <div className="h-20 bg-resident-100 rounded-xl" />
                          <div className="h-20 bg-searcher-100 rounded-xl" />
                        </div>
                        <div className="h-16 bg-white rounded-2xl shadow-sm border border-gray-100" />
                        <div className="h-16 bg-white rounded-2xl shadow-sm border border-gray-100" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating notification */}
                <div
                  className="absolute -right-4 top-20 px-4 py-3 rounded-2xl shadow-xl bg-white"
                  style={{ boxShadow: '0 10px 40px rgba(0,0,0,0.15)' }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-resident-100 flex items-center justify-center">
                      <Users className="w-5 h-5 text-resident-600" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-900">Nouveau match !</p>
                      <p className="text-xs text-gray-500">87% compatible</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// ============================================================================
// OWNER HERO - Dashboard-focused with stats and management
// ============================================================================
function HeroOwner() {
  const { resolvedTheme } = useTheme();

  return (
    <>
      <div
        className="rounded-[40px] shadow-2xl mb-12 relative overflow-hidden"
        style={{ transform: 'translateZ(0)' }}
      >
        {/* Gradient glass background - Owner colors */}
        <div className="absolute inset-0 rounded-[40px]"
          style={{
            background: 'linear-gradient(135deg, rgba(156, 86, 152, 0.3) 0%, rgba(200, 85, 112, 0.25) 50%, rgba(224, 87, 71, 0.2) 100%)',
            backdropFilter: 'blur(50px) saturate(250%) brightness(1.15)',
            WebkitBackdropFilter: 'blur(50px) saturate(250%) brightness(1.15)',
            boxShadow: 'inset 0 0 60px rgba(255, 255, 255, 0.4), inset 0 -2px 30px rgba(156, 86, 152, 0.3)',
          }}
        />

        {/* Border glow */}
        <div className="absolute -inset-[2px] rounded-[42px] pointer-events-none"
          style={{
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.6) 0%, rgba(156, 86, 152, 0.5) 50%, rgba(224, 87, 71, 0.4) 100%)',
            filter: 'blur(1px)',
            opacity: 0.6,
          }}
        />

        <div className="relative z-10 p-8 md:p-12">
          <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
            {/* Text content */}
            <div className="flex-1 text-center lg:text-left">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm mb-6">
                <BarChart3 className="w-4 h-4 text-white" />
                <span className="text-sm font-medium text-white">Dashboard propriétaire</span>
              </div>

              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
                Maximise tes<br />revenus locatifs
              </h1>
              <p className="text-lg md:text-xl text-white/90 mb-8">
                Gère tes biens, trouve les meilleurs résidents et automatise ton quotidien de propriétaire.
              </p>

              {/* Stats preview */}
              <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="text-center lg:text-left">
                  <p className="text-3xl font-bold text-white">95%</p>
                  <p className="text-sm text-white/70">Taux d'occupation</p>
                </div>
                <div className="text-center lg:text-left">
                  <p className="text-3xl font-bold text-white">-70%</p>
                  <p className="text-sm text-white/70">Temps de gestion</p>
                </div>
                <div className="text-center lg:text-left">
                  <p className="text-3xl font-bold text-white">0€</p>
                  <p className="text-sm text-white/70">Frais cachés</p>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <Link href="/onboarding/owner">
                  <Button
                    className="px-8 py-6 text-lg font-semibold rounded-2xl text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all"
                    style={{
                      background: 'var(--owner-primary)',
                      boxShadow: '0 10px 30px -5px rgba(156, 86, 152, 0.5)'
                    }}
                  >
                    <Building2 className="w-5 h-5 mr-2" />
                    Liste ton bien
                  </Button>
                </Link>
                <Link href="/auth">
                  <Button
                    variant="outline"
                    className="px-8 py-6 text-lg font-semibold rounded-2xl border-2 border-white/50 text-white hover:bg-white/10 transition-all"
                  >
                    Accéder au dashboard
                  </Button>
                </Link>
              </div>
            </div>

            {/* Dashboard Preview */}
            <div className="flex-shrink-0">
              <div className="relative">
                {/* Browser frame */}
                <div
                  className="relative w-[400px] rounded-2xl overflow-hidden shadow-2xl"
                  style={{
                    background: '#1a1a1a',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
                  }}
                >
                  {/* Browser bar */}
                  <div className="h-8 bg-gray-800 flex items-center px-3 gap-2">
                    <div className="flex gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-red-500" />
                      <div className="w-3 h-3 rounded-full bg-yellow-500" />
                      <div className="w-3 h-3 rounded-full bg-green-500" />
                    </div>
                    <div className="flex-1 mx-4">
                      <div className="h-4 bg-gray-700 rounded-md px-2 flex items-center">
                        <span className="text-[10px] text-gray-400">izzico.be/dashboard</span>
                      </div>
                    </div>
                  </div>

                  {/* Dashboard content */}
                  <div className="bg-owner-50 p-4 h-[280px]">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <p className="text-sm font-semibold text-gray-900">Tableau de bord</p>
                        <p className="text-xs text-gray-500">3 biens actifs</p>
                      </div>
                      <div className="w-8 h-8 rounded-full bg-owner-200" />
                    </div>

                    {/* Stats cards */}
                    <div className="grid grid-cols-2 gap-2 mb-3">
                      <div className="bg-white rounded-xl p-3 shadow-sm">
                        <p className="text-xs text-gray-500">Revenus ce mois</p>
                        <p className="text-lg font-bold text-owner-600">€4,250</p>
                      </div>
                      <div className="bg-white rounded-xl p-3 shadow-sm">
                        <p className="text-xs text-gray-500">Résidents</p>
                        <p className="text-lg font-bold text-gray-900">12</p>
                      </div>
                    </div>

                    {/* Mini chart placeholder */}
                    <div className="bg-white rounded-xl p-3 shadow-sm">
                      <p className="text-xs text-gray-500 mb-2">Occupation</p>
                      <div className="flex items-end gap-1 h-12">
                        {[40, 60, 80, 70, 90, 95, 85].map((h, i) => (
                          <div
                            key={i}
                            className="flex-1 rounded-t"
                            style={{
                              height: `${h}%`,
                              background: `linear-gradient(to top, var(--owner-primary), var(--owner-400))`
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating card */}
                <div
                  className="absolute -left-4 bottom-8 px-4 py-3 rounded-2xl shadow-xl bg-white"
                  style={{ boxShadow: '0 10px 40px rgba(0,0,0,0.15)' }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                      <CheckCircle2 className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-900">Loyer reçu</p>
                      <p className="text-xs text-gray-500">+€850 de Marc D.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
