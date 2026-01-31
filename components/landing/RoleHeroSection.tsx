'use client';

import { motion, AnimatePresence, useMotionValue, useTransform, animate } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { Search, Home, Building2, Smartphone, BarChart3, Users, Shield, Target, CheckCircle2, Wallet, MessageSquare, Bell, TrendingUp, Calendar, Receipt, ArrowUpRight, Zap, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/contexts/ThemeContext';
import SafeGooglePlacesAutocomplete from '@/components/ui/SafeGooglePlacesAutocomplete';
import DatePicker from '@/components/ui/date-picker';
import BudgetRangePicker from '@/components/ui/budget-range-picker';
import { type Role } from './RoleSwitcher';

interface RoleHeroSectionProps {
  activeRole: Role;
}

// Custom hook for animated counters
function useAnimatedCounter(targetValue: number, duration: number = 2, startDelay: number = 0, decimals: number = 0) {
  const [displayValue, setDisplayValue] = useState(0);
  const countRef = useRef<number>(0);

  useEffect(() => {
    const timeout = setTimeout(() => {
      const startTime = Date.now();
      const endTime = startTime + duration * 1000;

      const updateCount = () => {
        const now = Date.now();
        const progress = Math.min((now - startTime) / (duration * 1000), 1);
        // Easing function for smooth deceleration
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = targetValue * eased;

        setDisplayValue(Number(current.toFixed(decimals)));
        countRef.current = current;

        if (progress < 1) {
          requestAnimationFrame(updateCount);
        }
      };

      requestAnimationFrame(updateCount);
    }, startDelay * 1000);

    return () => clearTimeout(timeout);
  }, [targetValue, duration, startDelay, decimals]);

  return displayValue;
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
// RESIDENT HERO - Professional App showcase with advanced animations
// ============================================================================
function HeroResident() {
  const { resolvedTheme } = useTheme();

  // Animated counters
  const balanceValue = useAnimatedCounter(127.5, 1.5, 0.8, 2);
  const matchPercent = useAnimatedCounter(87, 1.2, 1.5, 0);
  const progressValue = useAnimatedCounter(75, 1.8, 1.0, 0);

  // Stagger animation variants with proper typing
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08, delayChildren: 0.6 }
    }
  } as const;

  const itemVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { type: 'spring' as const, stiffness: 300, damping: 24 }
    }
  } as const;

  const floatingAnimation = {
    y: [0, -8, 0],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: 'easeInOut' as const
    }
  };

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
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 + i * 0.1, type: 'spring', stiffness: 200 }}
              whileHover={{ scale: 1.05, y: -2 }}
              className={`flex items-center gap-3 px-4 py-3 rounded-2xl cursor-pointer ${resolvedTheme === 'dark' ? 'bg-white/5' : 'bg-white shadow-sm'}`}
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
            </motion.div>
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

      {/* Phone Mockup with Advanced Animations */}
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="relative flex justify-center order-1 lg:order-2"
      >
        {/* Phone Frame */}
        <motion.div
          animate={floatingAnimation}
          className="relative w-[320px] h-[640px] rounded-[60px] p-4 shadow-2xl"
          style={{
            background: 'linear-gradient(145deg, #1a1a1a, #2d2d2d)',
            boxShadow: '0 50px 100px -20px rgba(0, 0, 0, 0.5)',
          }}
        >
          {/* Dynamic Island / Notch */}
          <div className="absolute top-6 left-1/2 -translate-x-1/2 w-28 h-7 bg-black rounded-full z-20" />

          {/* Screen */}
          <div className="w-full h-full rounded-[48px] overflow-hidden bg-white">
            {/* App UI with Staggered Animations */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="h-full flex flex-col"
            >
              {/* Header with gradient */}
              <motion.div
                variants={itemVariants}
                className="h-20 flex items-end pb-3 justify-center relative overflow-hidden"
                style={{ background: 'linear-gradient(135deg, #e05747, #ff7c10)' }}
              >
                {/* Animated background shapes */}
                <motion.div
                  animate={{
                    x: [0, 10, 0],
                    opacity: [0.1, 0.2, 0.1],
                  }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                  className="absolute -top-4 -right-4 w-20 h-20 rounded-full bg-white/10"
                />
                <span className="text-white font-semibold text-lg relative z-10">Mon co-living</span>
              </motion.div>

              {/* Content */}
              <div className="flex-1 p-4 space-y-4 bg-gradient-to-b from-resident-50/50 to-white overflow-hidden">
                {/* Balance card with animated counter */}
                <motion.div
                  variants={itemVariants}
                  className="bg-white rounded-3xl p-4 shadow-lg border border-gray-100"
                >
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs text-gray-500">Solde du mois</p>
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 1.2, type: 'spring' }}
                      className="flex items-center gap-1 px-2 py-0.5 bg-green-100 rounded-full"
                    >
                      <TrendingUp className="w-3 h-3 text-green-600" />
                      <span className="text-xs font-medium text-green-600">+12%</span>
                    </motion.div>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">
                    €{balanceValue.toFixed(2)}
                  </p>
                  <div className="mt-3 flex gap-2">
                    <div className="flex-1 h-2 bg-resident-200 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progressValue}%` }}
                        transition={{ delay: 1.0, duration: 1.5, ease: 'easeOut' }}
                        className="h-full bg-gradient-to-r from-resident-500 to-resident-400 rounded-full"
                      />
                    </div>
                  </div>
                  <p className="text-xs text-gray-400 mt-2">Budget mensuel utilisé</p>
                </motion.div>

                {/* Quick actions with hover effects */}
                <motion.div variants={itemVariants} className="grid grid-cols-2 gap-3">
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="bg-gradient-to-br from-resident-100 to-resident-50 rounded-2xl p-4 text-center cursor-pointer border border-resident-200/50"
                  >
                    <motion.div
                      animate={{ rotate: [0, -10, 10, 0] }}
                      transition={{ delay: 2, duration: 0.5, repeat: Infinity, repeatDelay: 4 }}
                    >
                      <Receipt className="w-6 h-6 mx-auto mb-2 text-resident-600" />
                    </motion.div>
                    <p className="text-xs font-medium text-resident-700">Scanner ticket</p>
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="bg-gradient-to-br from-searcher-100 to-searcher-50 rounded-2xl p-4 text-center cursor-pointer border border-searcher-200/50"
                  >
                    <Users className="w-6 h-6 mx-auto mb-2 text-searcher-600" />
                    <p className="text-xs font-medium text-searcher-700">Mes colocs</p>
                  </motion.div>
                </motion.div>

                {/* Recent activity with staggered items */}
                <motion.div
                  variants={itemVariants}
                  className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100"
                >
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-sm font-semibold text-gray-900">Activité récente</p>
                    <Calendar className="w-4 h-4 text-gray-400" />
                  </div>
                  <div className="space-y-3">
                    {[
                      { label: 'Courses Colruyt', amount: '-€45.20', color: 'text-red-500', icon: '🛒', time: '14:32' },
                      { label: 'Loyer reçu', amount: '+€850', color: 'text-green-500', icon: '🏠', time: '09:00' },
                      { label: 'Internet', amount: '-€24.99', color: 'text-red-500', icon: '📶', time: 'Hier' },
                    ].map((item, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 1.4 + i * 0.15 }}
                        className="flex justify-between items-center py-1"
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-sm">{item.icon}</span>
                          <div>
                            <span className="text-sm text-gray-700 font-medium">{item.label}</span>
                            <p className="text-xs text-gray-400">{item.time}</p>
                          </div>
                        </div>
                        <span className={`text-sm font-semibold ${item.color}`}>{item.amount}</span>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                {/* Bottom nav */}
                <motion.div
                  variants={itemVariants}
                  className="absolute bottom-4 left-4 right-4 h-16 bg-white/90 backdrop-blur-xl rounded-2xl shadow-lg flex items-center justify-around px-4"
                  style={{ border: '1px solid rgba(0,0,0,0.05)' }}
                >
                  {[
                    { icon: Home, active: true },
                    { icon: Wallet, active: false },
                    { icon: Users, active: false },
                    { icon: Bell, active: false },
                  ].map((item, i) => (
                    <motion.div
                      key={i}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                        item.active
                          ? 'bg-gradient-to-br from-resident-500 to-resident-400'
                          : 'hover:bg-gray-100'
                      }`}
                    >
                      <item.icon className={`w-5 h-5 ${item.active ? 'text-white' : 'text-gray-400'}`} />
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Floating notification - Match */}
        <motion.div
          initial={{ opacity: 0, x: 50, y: -20, scale: 0.8 }}
          animate={{ opacity: 1, x: 0, y: 0, scale: 1 }}
          transition={{ delay: 1.2, type: 'spring', stiffness: 200 }}
          className="absolute -right-4 md:-right-12 top-24 px-5 py-4 rounded-2xl shadow-2xl bg-white"
          style={{ boxShadow: '0 20px 50px rgba(224, 87, 71, 0.2)' }}
        >
          <motion.div
            animate={{ scale: [1, 1.02, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="flex items-center gap-4"
          >
            <div className="relative">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-resident-100 to-resident-200 flex items-center justify-center">
                <Target className="w-6 h-6 text-resident-600" />
              </div>
              <motion.div
                animate={{ scale: [1, 1.4, 1], opacity: [1, 0, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"
              />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">Living Match !</p>
              <p className="text-sm text-resident-500 font-bold">{matchPercent}% compatible</p>
            </div>
          </motion.div>
        </motion.div>

        {/* Second floating element - Message notification */}
        <motion.div
          initial={{ opacity: 0, x: -50, y: 20, scale: 0.8 }}
          animate={{ opacity: 1, x: 0, y: 0, scale: 1 }}
          transition={{ delay: 1.6, type: 'spring', stiffness: 200 }}
          className="absolute -left-4 md:-left-8 bottom-40 px-4 py-3 rounded-2xl shadow-xl bg-white"
          style={{ boxShadow: '0 15px 40px rgba(0, 0, 0, 0.1)' }}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-searcher-100 to-searcher-200 flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-searcher-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Emma a écrit</p>
              <p className="text-sm font-medium text-gray-800">Qui fait les courses ?</p>
            </div>
          </div>
        </motion.div>

        {/* Decorative glow */}
        <div
          className="absolute -z-10 inset-0 blur-3xl opacity-30"
          style={{
            background: 'radial-gradient(circle at 50% 50%, #e05747 0%, transparent 60%)',
          }}
        />
      </motion.div>
    </div>
  );
}

// ============================================================================
// OWNER HERO - Professional Dashboard with advanced animations
// ============================================================================
function HeroOwner() {
  const { resolvedTheme } = useTheme();

  // Animated counters
  const revenueValue = useAnimatedCounter(4250, 2, 0.8, 0);
  const residentsCount = useAnimatedCounter(12, 1.5, 1, 0);
  const occupancyRate = useAnimatedCounter(95, 1.8, 0.5, 0);
  const timeReduction = useAnimatedCounter(70, 1.5, 0.7, 0);

  // Chart data with animated heights
  const chartData = [40, 60, 80, 70, 90, 95, 85, 90, 88, 92, 95, 97];
  const months = ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'];

  // Stagger animation variants with proper typing
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.5 }
    }
  } as const;

  const itemVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { type: 'spring' as const, stiffness: 300, damping: 24 }
    }
  } as const;

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

        {/* Animated Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-3 gap-6 mb-10"
        >
          {[
            { value: occupancyRate, suffix: '%', label: "Taux d'occupation" },
            { value: timeReduction, prefix: '-', suffix: '%', label: 'Temps de gestion' },
            { value: 0, suffix: '€', label: 'Frais cachés' },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 + i * 0.15, type: 'spring' }}
              className="text-center lg:text-left"
            >
              <p
                className="text-4xl font-bold bg-clip-text text-transparent"
                style={{ backgroundImage: 'linear-gradient(135deg, #9c5698, #c85570)' }}
              >
                {stat.prefix || ''}{stat.value}{stat.suffix}
              </p>
              <p className={`text-sm ${resolvedTheme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
                {stat.label}
              </p>
            </motion.div>
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

      {/* Professional Dashboard Mockup */}
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="relative flex justify-center"
      >
        {/* Browser Frame with subtle floating animation */}
        <motion.div
          animate={{
            y: [0, -5, 0],
          }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          className="relative w-full max-w-[520px] rounded-2xl overflow-hidden shadow-2xl"
          style={{
            background: '#1a1a1a',
            boxShadow: '0 50px 100px -20px rgba(156, 86, 152, 0.3)',
          }}
        >
          {/* Browser bar with real controls */}
          <div className="h-12 bg-gradient-to-b from-gray-800 to-gray-900 flex items-center px-4 gap-3">
            <div className="flex gap-2">
              <motion.div
                whileHover={{ scale: 1.2 }}
                className="w-3 h-3 rounded-full bg-red-500 cursor-pointer"
              />
              <motion.div
                whileHover={{ scale: 1.2 }}
                className="w-3 h-3 rounded-full bg-yellow-500 cursor-pointer"
              />
              <motion.div
                whileHover={{ scale: 1.2 }}
                className="w-3 h-3 rounded-full bg-green-500 cursor-pointer"
              />
            </div>
            <div className="flex-1 mx-4">
              <div className="h-7 bg-gray-700/50 rounded-lg px-3 flex items-center gap-2">
                <Shield className="w-3 h-3 text-green-500" />
                <span className="text-xs text-gray-400">izzico.be/dashboard/owner</span>
              </div>
            </div>
            <div className="flex gap-2">
              <div className="w-6 h-6 rounded bg-gray-700/50 flex items-center justify-center">
                <Bell className="w-3 h-3 text-gray-400" />
              </div>
            </div>
          </div>

          {/* Dashboard content with staggered animations */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="bg-gradient-to-br from-owner-50 to-white p-5"
          >
            {/* Header with user info */}
            <motion.div variants={itemVariants} className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-gradient-to-br from-owner-400 to-owner-600 flex items-center justify-center text-white font-bold">
                  JD
                </div>
                <div>
                  <p className="text-base font-semibold text-gray-900">Bonjour, Jean</p>
                  <p className="text-xs text-gray-500">3 biens actifs</p>
                </div>
              </div>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 1.2, type: 'spring' }}
                className="flex items-center gap-2 px-3 py-1.5 bg-green-100 rounded-full"
              >
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-xs font-medium text-green-700">Tout va bien</span>
              </motion.div>
            </motion.div>

            {/* Stats grid with animated counters */}
            <motion.div variants={itemVariants} className="grid grid-cols-2 gap-3 mb-4">
              <motion.div
                whileHover={{ scale: 1.02, y: -2 }}
                className="bg-white rounded-2xl p-4 shadow-sm border border-owner-100 cursor-pointer"
              >
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs text-gray-500">Revenus ce mois</p>
                  <motion.div
                    initial={{ rotate: 0 }}
                    animate={{ rotate: [0, 15, 0] }}
                    transition={{ delay: 2, duration: 0.5, repeat: Infinity, repeatDelay: 5 }}
                  >
                    <ArrowUpRight className="w-4 h-4 text-green-500" />
                  </motion.div>
                </div>
                <p className="text-2xl font-bold bg-clip-text text-transparent" style={{ backgroundImage: 'linear-gradient(135deg, #9c5698, #c85570)' }}>
                  €{revenueValue.toLocaleString()}
                </p>
                <p className="text-xs text-green-600 mt-1">+8.5% vs mois dernier</p>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.02, y: -2 }}
                className="bg-white rounded-2xl p-4 shadow-sm border border-owner-100 cursor-pointer"
              >
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs text-gray-500">Résidents</p>
                  <Users className="w-4 h-4 text-owner-400" />
                </div>
                <p className="text-2xl font-bold text-gray-900">{residentsCount}</p>
                <div className="flex -space-x-2 mt-2">
                  {[...Array(4)].map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 1.5 + i * 0.1 }}
                      className="w-6 h-6 rounded-full border-2 border-white"
                      style={{
                        background: `linear-gradient(135deg, ${['#e05747', '#ff7c10', '#ffa000', '#9c5698'][i]}, ${['#ff7c10', '#ffa000', '#e05747', '#c85570'][i]})`,
                      }}
                    />
                  ))}
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.9 }}
                    className="w-6 h-6 rounded-full border-2 border-white bg-gray-200 flex items-center justify-center text-xs font-medium text-gray-600"
                  >
                    +8
                  </motion.div>
                </div>
              </motion.div>
            </motion.div>

            {/* Occupation rate mini card */}
            <motion.div
              variants={itemVariants}
              className="bg-gradient-to-r from-owner-500 to-owner-400 rounded-2xl p-4 mb-4 text-white"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-white/70">Taux d'occupation</p>
                  <p className="text-3xl font-bold">{occupancyRate}%</p>
                </div>
                <div className="w-16 h-16 relative">
                  <svg className="w-16 h-16 transform -rotate-90">
                    <circle
                      cx="32"
                      cy="32"
                      r="28"
                      stroke="rgba(255,255,255,0.2)"
                      strokeWidth="8"
                      fill="none"
                    />
                    <motion.circle
                      cx="32"
                      cy="32"
                      r="28"
                      stroke="white"
                      strokeWidth="8"
                      fill="none"
                      strokeLinecap="round"
                      initial={{ strokeDasharray: '0 176' }}
                      animate={{ strokeDasharray: `${(occupancyRate / 100) * 176} 176` }}
                      transition={{ delay: 1, duration: 1.5, ease: 'easeOut' }}
                    />
                  </svg>
                  <Zap className="w-5 h-5 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white" />
                </div>
              </div>
            </motion.div>

            {/* Chart with animated bars */}
            <motion.div variants={itemVariants} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-semibold text-gray-900">Revenus 2024</p>
                <div className="flex items-center gap-1 text-xs text-gray-400">
                  <TrendingUp className="w-3 h-3 text-green-500" />
                  <span>+12%</span>
                </div>
              </div>
              <div className="flex items-end gap-1.5 h-24">
                {chartData.map((h, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${h}%` }}
                      transition={{
                        delay: 1.2 + i * 0.08,
                        duration: 0.8,
                        ease: [0.34, 1.56, 0.64, 1],
                      }}
                      whileHover={{ scale: 1.1, opacity: 0.9 }}
                      className="w-full rounded-t cursor-pointer"
                      style={{
                        background: i === 11
                          ? 'linear-gradient(to top, #9c5698, #c85570)'
                          : i >= 9
                          ? 'linear-gradient(to top, rgba(156, 86, 152, 0.7), rgba(200, 85, 112, 0.7))'
                          : 'linear-gradient(to top, rgba(156, 86, 152, 0.3), rgba(200, 85, 112, 0.3))',
                      }}
                    />
                    <span className="text-[9px] text-gray-400">{months[i]}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Recent payments list */}
            <motion.div variants={itemVariants} className="mt-4 space-y-2">
              {[
                { name: 'Marc D.', amount: '+€850', time: 'Il y a 2h', avatar: 'MD' },
                { name: 'Sophie L.', amount: '+€720', time: 'Hier', avatar: 'SL' },
              ].map((payment, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 2 + i * 0.15 }}
                  whileHover={{ x: 5 }}
                  className="flex items-center justify-between p-3 bg-white rounded-xl border border-gray-100 cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-resident-400 to-resident-500 flex items-center justify-center text-white text-xs font-medium">
                      {payment.avatar}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{payment.name}</p>
                      <p className="text-xs text-gray-400">{payment.time}</p>
                    </div>
                  </div>
                  <span className="text-sm font-bold text-green-600">{payment.amount}</span>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Floating payment notification */}
        <motion.div
          initial={{ opacity: 0, x: -60, y: 20, scale: 0.8 }}
          animate={{ opacity: 1, x: 0, y: 0, scale: 1 }}
          transition={{ delay: 1.4, type: 'spring', stiffness: 200 }}
          className="absolute -left-4 md:-left-12 bottom-32 px-5 py-4 rounded-2xl shadow-2xl bg-white"
          style={{ boxShadow: '0 20px 50px rgba(34, 197, 94, 0.2)' }}
        >
          <motion.div
            animate={{ scale: [1, 1.02, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="flex items-center gap-4"
          >
            <div className="relative">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-green-600" />
              </div>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 1.8, type: 'spring' }}
                className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white flex items-center justify-center"
              >
                <span className="text-[10px] text-white font-bold">✓</span>
              </motion.div>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">Paiement reçu !</p>
              <p className="text-sm text-green-600 font-bold">+€850 de Marc D.</p>
            </div>
          </motion.div>
        </motion.div>

        {/* Floating new applicant notification */}
        <motion.div
          initial={{ opacity: 0, x: 60, y: -20, scale: 0.8 }}
          animate={{ opacity: 1, x: 0, y: 0, scale: 1 }}
          transition={{ delay: 1.8, type: 'spring', stiffness: 200 }}
          className="absolute -right-4 md:-right-8 top-24 px-4 py-3 rounded-2xl shadow-xl bg-white"
          style={{ boxShadow: '0 15px 40px rgba(156, 86, 152, 0.15)' }}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-owner-100 to-owner-200 flex items-center justify-center">
              <Star className="w-5 h-5 text-owner-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Nouvelle candidature</p>
              <p className="text-sm font-medium text-gray-800">Emma K. - 92% match</p>
            </div>
          </div>
        </motion.div>

        {/* Decorative glow */}
        <div
          className="absolute -z-10 inset-0 blur-3xl opacity-30"
          style={{
            background: 'radial-gradient(circle at 50% 50%, #9c5698 0%, transparent 60%)',
          }}
        />
      </motion.div>
    </div>
  );
}
