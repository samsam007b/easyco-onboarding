'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Search, Home, Building2, Smartphone, BarChart3, Users, Shield, Target, CheckCircle2, Wallet, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
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
    y: 30,
  },
  center: {
    opacity: 1,
    y: 0,
  },
  exit: {
    opacity: 0,
    y: -30,
  },
};

export default function RoleHeroSection({ activeRole }: RoleHeroSectionProps) {
  const { resolvedTheme } = useTheme();

  // Role-based gradient backgrounds
  const backgrounds: Record<Role, string> = {
    searcher: 'linear-gradient(135deg, rgba(255, 160, 0, 0.15) 0%, rgba(224, 87, 71, 0.1) 50%, rgba(156, 86, 152, 0.08) 100%)',
    resident: 'linear-gradient(135deg, rgba(224, 87, 71, 0.18) 0%, rgba(255, 124, 16, 0.12) 50%, rgba(255, 160, 0, 0.08) 100%)',
    owner: 'linear-gradient(135deg, rgba(156, 86, 152, 0.18) 0%, rgba(200, 85, 112, 0.12) 50%, rgba(224, 87, 71, 0.08) 100%)',
  };

  return (
    <section
      className="relative min-h-screen flex items-center overflow-hidden transition-all duration-500"
      style={{
        background: resolvedTheme === 'dark'
          ? 'linear-gradient(to bottom, #0F0F12, #141418)'
          : backgrounds[activeRole],
        paddingTop: '80px',
      }}
    >
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 py-16">
        <AnimatePresence mode="wait">
          {activeRole === 'searcher' && (
            <motion.div
              key="searcher"
              variants={contentVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
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
              transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
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
              transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
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
// SEARCHER HERO - Full width with prominent search
// ============================================================================
function HeroSearcher() {
  const router = useRouter();
  const { resolvedTheme } = useTheme();
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
    <div className="flex flex-col items-center text-center">
      {/* Glassmorphism Container - Enhanced for better text readability */}
      <div
        className="relative w-full max-w-4xl mx-auto rounded-[40px] p-8 md:p-12"
        style={{
          background: resolvedTheme === 'dark'
            ? 'linear-gradient(135deg, rgba(15, 15, 18, 0.85) 0%, rgba(20, 20, 24, 0.85) 100%)'
            : 'linear-gradient(135deg, rgba(255, 255, 255, 0.92) 0%, rgba(255, 251, 235, 0.9) 100%)',
          backdropFilter: 'blur(40px) saturate(180%)',
          WebkitBackdropFilter: 'blur(40px) saturate(180%)',
          boxShadow: resolvedTheme === 'dark'
            ? 'inset 0 0 60px rgba(255, 160, 0, 0.08), 0 25px 80px -20px rgba(0, 0, 0, 0.6)'
            : 'inset 0 0 60px rgba(255, 160, 0, 0.15), 0 25px 80px -20px rgba(255, 160, 0, 0.2)',
          border: resolvedTheme === 'dark'
            ? '1px solid rgba(255, 160, 0, 0.15)'
            : '1px solid rgba(255, 160, 0, 0.2)',
        }}
      >
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8"
          style={{
            background: resolvedTheme === 'dark' ? 'rgba(255, 160, 0, 0.25)' : 'rgba(255, 255, 255, 0.7)',
            border: '1px solid rgba(255, 160, 0, 0.3)',
            backdropFilter: 'blur(10px)',
          }}
        >
          <Search className="w-4 h-4 text-searcher-600" />
          <span className={`text-sm font-medium ${resolvedTheme === 'dark' ? 'text-searcher-400' : 'text-searcher-700'}`}>
            +500 co-livings disponibles
          </span>
        </motion.div>

        {/* Main Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-5xl md:text-7xl font-bold mb-6 leading-tight"
        >
          <span
            className="bg-clip-text text-transparent"
            style={{
              backgroundImage: 'linear-gradient(135deg, #ffa000 0%, #e05747 50%, #9c5698 100%)',
            }}
          >
            Trouve ton co-living
          </span>
          <br />
          <span className={resolvedTheme === 'dark' ? 'text-white' : 'text-gray-900'}>
            idéal
          </span>
        </motion.h1>

        {/* Subtitle - Enhanced contrast for glassmorphism */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className={`text-xl md:text-2xl mb-12 max-w-2xl mx-auto font-medium ${resolvedTheme === 'dark' ? 'text-white' : 'text-gray-900'}`}
        >
          Annonces vérifiées, colocs compatibles, zéro arnaque.
          <br className="hidden md:block" />
          Trouve ton chez-toi en quelques clics.
        </motion.p>

        {/* Search Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="w-full"
        >
          <div
            className="rounded-3xl shadow-2xl overflow-hidden"
            style={{
              background: resolvedTheme === 'dark' ? 'rgba(26, 26, 31, 0.9)' : 'rgba(255, 255, 255, 0.95)',
              boxShadow: resolvedTheme === 'dark'
                ? '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
                : '0 25px 50px -12px rgba(255, 160, 0, 0.25)',
              backdropFilter: 'blur(20px)',
            }}
          >
          <div className="p-2">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-0">
              {/* Location */}
              <div className={`p-4 rounded-2xl transition-colors ${resolvedTheme === 'dark' ? 'hover:bg-white/5' : 'hover:bg-searcher-50/50'}`}>
                <label className={`block text-xs font-semibold mb-1 ${resolvedTheme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                  Où ?
                </label>
                <SafeGooglePlacesAutocomplete
                  onPlaceSelect={handlePlaceSelect}
                  placeholder="Bruxelles, Liège..."
                  iconClassName={`w-4 h-4 ${resolvedTheme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}
                  inputClassName={`w-full text-base font-medium bg-transparent outline-none ${resolvedTheme === 'dark' ? 'text-white placeholder:text-gray-500' : 'text-gray-900 placeholder:text-gray-400'}`}
                />
              </div>

              {/* Budget */}
              <div className={`p-4 rounded-2xl transition-colors border-l ${resolvedTheme === 'dark' ? 'hover:bg-white/5 border-white/10' : 'hover:bg-searcher-50/50 border-gray-200'}`}>
                <label className={`block text-xs font-semibold mb-1 ${resolvedTheme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                  Budget
                </label>
                <BudgetRangePicker
                  onBudgetChange={(min, max) => setBudgetRange({ min, max })}
                  placeholder="€800/mois"
                  iconClassName={`w-4 h-4 ${resolvedTheme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}
                  inputClassName={`w-full text-base font-medium bg-transparent outline-none ${resolvedTheme === 'dark' ? 'text-white placeholder:text-gray-500' : 'text-gray-900 placeholder:text-gray-400'}`}
                  minBudget={0}
                  maxBudget={2000}
                />
              </div>

              {/* Date */}
              <div className={`p-4 rounded-2xl transition-colors border-l ${resolvedTheme === 'dark' ? 'hover:bg-white/5 border-white/10' : 'hover:bg-searcher-50/50 border-gray-200'}`}>
                <label className={`block text-xs font-semibold mb-1 ${resolvedTheme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                  Quand ?
                </label>
                <DatePicker
                  onDateSelect={setSelectedDate}
                  placeholder="Flexible"
                  iconClassName={`w-4 h-4 ${resolvedTheme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}
                  inputClassName={`w-full text-base font-medium bg-transparent outline-none ${resolvedTheme === 'dark' ? 'text-white placeholder:text-gray-500' : 'text-gray-900 placeholder:text-gray-400'}`}
                />
              </div>

              {/* Search Button - Searcher yellow gradient */}
              <div className="p-2 flex items-center">
                <Button
                  onClick={handleSearch}
                  className="w-full h-full min-h-[60px] text-white font-semibold text-lg rounded-2xl shadow-lg hover:shadow-xl transition-all hover:scale-[1.02]"
                  style={{
                    background: 'linear-gradient(135deg, #ffa000 0%, #D98400 100%)',
                    boxShadow: '0 10px 30px -5px rgba(255, 160, 0, 0.5)',
                  }}
                >
                  <Search className="w-5 h-5 mr-2" />
                  Rechercher
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Trust badges - Enhanced visibility */}
        <div className="flex flex-wrap items-center justify-center gap-6 mt-8">
          {[
            { icon: CheckCircle2, text: 'Identité vérifiée' },
            { icon: Shield, text: 'Annonces certifiées' },
            { icon: Target, text: 'Matching intelligent' },
          ].map((badge, i) => (
            <div
              key={i}
              className="flex items-center gap-2 px-4 py-2 rounded-full"
              style={{
                background: resolvedTheme === 'dark' ? 'rgba(0, 0, 0, 0.3)' : 'rgba(255, 255, 255, 0.8)',
                backdropFilter: 'blur(10px)',
              }}
            >
              <badge.icon className="w-5 h-5 text-green-500" />
              <span className={`text-sm font-semibold ${resolvedTheme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                {badge.text}
              </span>
            </div>
          ))}
        </div>

        {/* Secondary CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10"
        >
          <Link href="/onboarding/searcher">
            <Button
              variant="outline"
              className={`px-6 py-5 text-base font-semibold rounded-2xl border-2 transition-all hover:scale-105 ${
                resolvedTheme === 'dark'
                  ? 'border-searcher-500/50 text-searcher-400 hover:bg-searcher-500/10'
                  : 'border-searcher-500 text-searcher-600 hover:bg-searcher-50'
              }`}
            >
              <Target className="w-5 h-5 mr-2" />
              Créer mon Living Persona
            </Button>
          </Link>
          <Link href="/guest">
            <Button
              variant="ghost"
              className={`px-6 py-5 text-base font-medium rounded-2xl transition-all ${
                resolvedTheme === 'dark'
                  ? 'text-gray-300 hover:text-white hover:bg-white/5'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              Explorer les annonces
              <span className="ml-2">→</span>
            </Button>
          </Link>
        </motion.div>
      </motion.div>
      </div>{/* End Glassmorphism Container */}
    </div>
  );
}

// ============================================================================
// RESIDENT HERO - App showcase with features
// ============================================================================
function HeroResident() {
  const { resolvedTheme } = useTheme();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
      {/* Text Content */}
      <div className="text-center lg:text-left order-2 lg:order-1">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6"
          style={{
            background: resolvedTheme === 'dark' ? 'rgba(224, 87, 71, 0.2)' : 'rgba(224, 87, 71, 0.15)',
            border: '1px solid rgba(224, 87, 71, 0.3)',
          }}
        >
          <Smartphone className="w-4 h-4 text-resident-500" />
          <span className={`text-sm font-medium ${resolvedTheme === 'dark' ? 'text-resident-400' : 'text-resident-700'}`}>
            App disponible iOS & Android
          </span>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-5xl md:text-6xl font-bold mb-6 leading-tight"
        >
          <span
            className="bg-clip-text text-transparent"
            style={{
              backgroundImage: 'linear-gradient(135deg, #e05747 0%, #ff7c10 100%)',
            }}
          >
            Ton co-living,
          </span>
          <br />
          <span className={resolvedTheme === 'dark' ? 'text-white' : 'text-gray-900'}>
            simplifié
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className={`text-xl mb-10 ${resolvedTheme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}
        >
          Gère tes dépenses, communique avec tes colocs et ton propriétaire,
          tout en un seul endroit.
        </motion.p>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex flex-wrap justify-center lg:justify-start gap-4 mb-10"
        >
          {[
            { icon: Wallet, label: 'Split & Scan', color: '#e05747' },
            { icon: Target, label: 'Living Match', color: '#ff7c10' },
            { icon: MessageSquare, label: 'Issue Hub', color: '#ffa000' },
          ].map((feature, i) => (
            <div
              key={i}
              className={`flex items-center gap-3 px-4 py-3 rounded-2xl ${resolvedTheme === 'dark' ? 'bg-white/5' : 'bg-white shadow-sm'}`}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: `${feature.color}20` }}
              >
                <feature.icon className="w-5 h-5" style={{ color: feature.color }} />
              </div>
              <span className={`font-medium ${resolvedTheme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                {feature.label}
              </span>
            </div>
          ))}
        </motion.div>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4"
        >
          <Link href="/auth">
            <Button
              className="px-8 py-6 text-lg font-semibold rounded-2xl text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all"
              style={{
                background: 'linear-gradient(135deg, #e05747 0%, #ff7c10 100%)',
                boxShadow: '0 10px 30px -5px rgba(224, 87, 71, 0.4)',
              }}
            >
              <Home className="w-5 h-5 mr-2" />
              Accéder à mon co-living
            </Button>
          </Link>
          <Link href="/signup">
            <Button
              variant="outline"
              className={`px-8 py-6 text-lg font-semibold rounded-2xl border-2 transition-all hover:scale-105 ${
                resolvedTheme === 'dark'
                  ? 'border-resident-500/50 text-resident-400 hover:bg-resident-500/10'
                  : 'border-resident-500 text-resident-600 hover:bg-resident-50'
              }`}
            >
              Créer mon compte
            </Button>
          </Link>
        </motion.div>
      </div>

      {/* Phone Mockup */}
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="relative flex justify-center order-1 lg:order-2"
      >
        {/* Phone */}
        <div
          className="relative w-[320px] h-[640px] rounded-[60px] p-4 shadow-2xl"
          style={{
            background: 'linear-gradient(145deg, #1a1a1a, #2d2d2d)',
            boxShadow: '0 50px 100px -20px rgba(0, 0, 0, 0.5)',
          }}
        >
          {/* Screen */}
          <div className="w-full h-full rounded-[48px] overflow-hidden bg-white">
            {/* App UI */}
            <div className="h-full flex flex-col">
              {/* Header */}
              <div
                className="h-16 flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, #e05747, #ff7c10)' }}
              >
                <span className="text-white font-semibold text-lg">Mon co-living</span>
              </div>

              {/* Content */}
              <div className="flex-1 p-4 space-y-4 bg-gradient-to-b from-resident-50/50 to-white">
                {/* Balance card */}
                <div className="bg-white rounded-3xl p-4 shadow-lg border border-gray-100">
                  <p className="text-xs text-gray-500 mb-1">Solde du mois</p>
                  <p className="text-2xl font-bold text-gray-900">€127.50</p>
                  <div className="mt-3 flex gap-2">
                    <div className="flex-1 h-2 bg-resident-200 rounded-full overflow-hidden">
                      <div className="h-full w-3/4 bg-resident-500 rounded-full" />
                    </div>
                  </div>
                </div>

                {/* Quick actions */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-resident-100 rounded-2xl p-4 text-center">
                    <Wallet className="w-6 h-6 mx-auto mb-2 text-resident-600" />
                    <p className="text-xs font-medium text-resident-700">Ajouter dépense</p>
                  </div>
                  <div className="bg-searcher-100 rounded-2xl p-4 text-center">
                    <Users className="w-6 h-6 mx-auto mb-2 text-searcher-600" />
                    <p className="text-xs font-medium text-searcher-700">Voir les colocs</p>
                  </div>
                </div>

                {/* Recent activity */}
                <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                  <p className="text-sm font-semibold text-gray-900 mb-3">Activité récente</p>
                  <div className="space-y-3">
                    {[
                      { label: 'Courses Colruyt', amount: '-€45.20', color: 'text-red-500' },
                      { label: 'Loyer reçu', amount: '+€850', color: 'text-green-500' },
                    ].map((item, i) => (
                      <div key={i} className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">{item.label}</span>
                        <span className={`text-sm font-semibold ${item.color}`}>{item.amount}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Floating notification */}
        <motion.div
          initial={{ opacity: 0, x: 30, y: -20 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          transition={{ delay: 0.8 }}
          className="absolute -right-8 top-32 px-5 py-4 rounded-2xl shadow-2xl bg-white"
          style={{ boxShadow: '0 20px 50px rgba(0,0,0,0.15)' }}
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-resident-100 flex items-center justify-center">
              <Users className="w-6 h-6 text-resident-600" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">Nouveau match !</p>
              <p className="text-sm text-gray-500">87% compatible</p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

// ============================================================================
// OWNER HERO - Dashboard focus with stats
// ============================================================================
function HeroOwner() {
  const { resolvedTheme } = useTheme();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
      {/* Text Content */}
      <div className="text-center lg:text-left">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6"
          style={{
            background: resolvedTheme === 'dark' ? 'rgba(156, 86, 152, 0.2)' : 'rgba(156, 86, 152, 0.15)',
            border: '1px solid rgba(156, 86, 152, 0.3)',
          }}
        >
          <BarChart3 className="w-4 h-4 text-owner-500" />
          <span className={`text-sm font-medium ${resolvedTheme === 'dark' ? 'text-owner-400' : 'text-owner-700'}`}>
            Dashboard propriétaire
          </span>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-5xl md:text-6xl font-bold mb-6 leading-tight"
        >
          <span
            className="bg-clip-text text-transparent"
            style={{
              backgroundImage: 'linear-gradient(135deg, #9c5698 0%, #c85570 100%)',
            }}
          >
            Maximise tes
          </span>
          <br />
          <span className={resolvedTheme === 'dark' ? 'text-white' : 'text-gray-900'}>
            revenus locatifs
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className={`text-xl mb-10 ${resolvedTheme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}
        >
          Gère tes biens, trouve les meilleurs résidents et automatise ton quotidien de propriétaire.
        </motion.p>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-3 gap-6 mb-10"
        >
          {[
            { value: '95%', label: "Taux d'occupation" },
            { value: '-70%', label: 'Temps de gestion' },
            { value: '0€', label: 'Frais cachés' },
          ].map((stat, i) => (
            <div key={i} className="text-center lg:text-left">
              <p
                className="text-4xl font-bold bg-clip-text text-transparent"
                style={{ backgroundImage: 'linear-gradient(135deg, #9c5698, #c85570)' }}
              >
                {stat.value}
              </p>
              <p className={`text-sm ${resolvedTheme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
                {stat.label}
              </p>
            </div>
          ))}
        </motion.div>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4"
        >
          <Link href="/onboarding/owner">
            <Button
              className="px-8 py-6 text-lg font-semibold rounded-2xl text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all"
              style={{
                background: 'linear-gradient(135deg, #9c5698 0%, #c85570 100%)',
                boxShadow: '0 10px 30px -5px rgba(156, 86, 152, 0.4)',
              }}
            >
              <Building2 className="w-5 h-5 mr-2" />
              Ajouter mon bien
            </Button>
          </Link>
          <Link href="/auth">
            <Button
              variant="outline"
              className={`px-8 py-6 text-lg font-semibold rounded-2xl border-2 transition-all hover:scale-105 ${
                resolvedTheme === 'dark'
                  ? 'border-owner-500/50 text-owner-400 hover:bg-owner-500/10'
                  : 'border-owner-500 text-owner-600 hover:bg-owner-50'
              }`}
            >
              Voir mon dashboard
            </Button>
          </Link>
        </motion.div>
      </div>

      {/* Dashboard Mockup */}
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="relative flex justify-center"
      >
        {/* Browser Frame */}
        <div
          className="relative w-full max-w-[500px] rounded-2xl overflow-hidden shadow-2xl"
          style={{
            background: '#1a1a1a',
            boxShadow: '0 50px 100px -20px rgba(0, 0, 0, 0.5)',
          }}
        >
          {/* Browser bar */}
          <div className="h-10 bg-gray-800 flex items-center px-4 gap-2">
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <div className="w-3 h-3 rounded-full bg-green-500" />
            </div>
            <div className="flex-1 mx-8">
              <div className="h-6 bg-gray-700 rounded-lg px-3 flex items-center">
                <span className="text-xs text-gray-400">izzico.be/dashboard</span>
              </div>
            </div>
          </div>

          {/* Dashboard content */}
          <div className="bg-owner-50 p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-lg font-semibold text-gray-900">Tableau de bord</p>
                <p className="text-sm text-gray-500">3 biens actifs</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-owner-200" />
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-white rounded-2xl p-4 shadow-sm">
                <p className="text-sm text-gray-500">Revenus ce mois</p>
                <p className="text-2xl font-bold text-owner-600">€4,250</p>
              </div>
              <div className="bg-white rounded-2xl p-4 shadow-sm">
                <p className="text-sm text-gray-500">Résidents</p>
                <p className="text-2xl font-bold text-gray-900">12</p>
              </div>
            </div>

            {/* Chart */}
            <div className="bg-white rounded-2xl p-4 shadow-sm">
              <p className="text-sm text-gray-500 mb-3">Occupation</p>
              <div className="flex items-end gap-2 h-20">
                {[40, 60, 80, 70, 90, 95, 85, 90, 88, 92, 95, 97].map((h, i) => (
                  <div
                    key={i}
                    className="flex-1 rounded-t transition-all hover:opacity-80"
                    style={{
                      height: `${h}%`,
                      background: 'linear-gradient(to top, #9c5698, #c85570)',
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Floating notification */}
        <motion.div
          initial={{ opacity: 0, x: -30, y: 20 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          transition={{ delay: 0.8 }}
          className="absolute -left-8 bottom-20 px-5 py-4 rounded-2xl shadow-2xl bg-white"
          style={{ boxShadow: '0 20px 50px rgba(0,0,0,0.15)' }}
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">Loyer reçu</p>
              <p className="text-sm text-gray-500">+€850 de Marc D.</p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
