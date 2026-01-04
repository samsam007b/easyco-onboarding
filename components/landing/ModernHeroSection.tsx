'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, Home, MapPin, Euro, Calendar, Users, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { useState } from 'react';
import SafeGooglePlacesAutocomplete from '@/components/ui/SafeGooglePlacesAutocomplete';
import DatePicker from '@/components/ui/date-picker';
import BudgetRangePicker from '@/components/ui/budget-range-picker';
import { useLanguage } from '@/lib/i18n/use-language';

export default function ModernHeroSection() {
  const { t } = useLanguage();
  const router = useRouter();
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [budgetRange, setBudgetRange] = useState({ min: 0, max: 2000 });

  const handlePlaceSelect = (place: google.maps.places.PlaceResult) => {
    if (place.formatted_address) {
      setSelectedLocation(place.formatted_address);
    }
  };

  const handleDateSelect = (date: Date | null) => {
    setSelectedDate(date);
  };

  const handleBudgetChange = (min: number, max: number) => {
    setBudgetRange({ min, max });
  };

  const handleSearch = () => {
    const params = new URLSearchParams();

    if (selectedLocation) {
      params.set('location', selectedLocation);
    }
    if (budgetRange.min > 0) {
      params.set('budget_min', budgetRange.min.toString());
    }
    if (budgetRange.max < 2000) {
      params.set('budget_max', budgetRange.max.toString());
    }
    if (selectedDate) {
      params.set('move_in_date', selectedDate.toISOString().split('T')[0]);
    }

    const queryString = params.toString();
    router.push(`/guest${queryString ? `?${queryString}` : ''}`);
  };
  return (
    <section className="relative pt-24 pb-20 px-6 overflow-hidden min-h-[90vh] flex items-center">
      {/* Pas de voile blanc - images en full HD */}

      <div className="relative z-20 max-w-4xl mx-auto w-full">

        {/* Container unifié avec effet verre trempé coloré */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.7 }}
          className="rounded-[40px] shadow-2xl mb-12 relative"
          style={{
            transform: 'translateZ(0)',
            perspective: '1000px',
            overflow: 'visible'
          }}
        >
          {/* Verre trempé avec gradient subtil et effet 3D - v3 colors */}
          <div className="absolute inset-0 rounded-[40px]"
               style={{
                 background: 'linear-gradient(135deg, rgba(156, 86, 152, 0.25) 0%, rgba(224, 87, 71, 0.22) 50%, rgba(255, 160, 0, 0.25) 100%)',
                 backdropFilter: 'blur(50px) saturate(250%) brightness(1.15)',
                 WebkitBackdropFilter: 'blur(50px) saturate(250%) brightness(1.15)',
                 boxShadow: 'inset 0 0 60px rgba(255, 255, 255, 0.4), inset 0 -2px 30px rgba(156, 86, 152, 0.3)',
                 overflow: 'hidden'
               }}
          />

          {/* Réfraction lumineuse sur les bords - effet prismatique - v3 colors */}
          <div className="absolute inset-0 rounded-[40px]"
               style={{
                 background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.4) 0%, transparent 20%, transparent 80%, rgba(156, 86, 152, 0.3) 100%)',
                 mixBlendMode: 'overlay',
                 overflow: 'hidden'
               }}
          />

          {/* Reflet lumineux haut gauche */}
          <div className="absolute top-0 left-0 w-1/2 h-1/2 rounded-[40px]"
               style={{
                 background: 'radial-gradient(circle at top left, rgba(255, 255, 255, 0.5) 0%, transparent 60%)',
                 mixBlendMode: 'soft-light',
                 overflow: 'hidden'
               }}
          />

          {/* Bordure extérieure avec effet de réfraction - v3 colors */}
          <div className="absolute -inset-[2px] rounded-[42px] pointer-events-none"
               style={{
                 background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.6) 0%, rgba(156, 86, 152, 0.4) 25%, rgba(224, 87, 71, 0.4) 50%, rgba(255, 160, 0, 0.4) 75%, rgba(255, 255, 255, 0.6) 100%)',
                 filter: 'blur(1px)',
                 opacity: 0.6,
                 overflow: 'hidden'
               }}
          />

          {/* Section mauve avec logo et texte - Plus compact */}
          <div className="p-8 md:p-10 relative z-10">
            {/* Logo Badge - 3 couches: gradient arrière + glassmorphism + logo blanc */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex justify-center mb-6"
            >
              <div className="relative w-24 h-24">
                {/* Couche 3 (arrière): App icon avec gradient signature */}
                <div
                  className="absolute inset-0 superellipse-2xl shadow-2xl"
                  style={{
                    background: 'linear-gradient(135deg, #9c5698 0%, #c85570 20%, #d15659 35%, #e05747 50%, #ff7c10 75%, #ffa000 100%)',
                    boxShadow: '0 8px 32px rgba(156, 86, 152, 0.4), 0 4px 16px rgba(255, 124, 16, 0.3)'
                  }}
                />

                {/* Couche 2 (milieu): Glassmorphism opaque révélant la lumière */}
                <div
                  className="absolute inset-0 superellipse-2xl border border-white/50"
                  style={{
                    background: 'rgba(255, 255, 255, 0.25)',
                    backdropFilter: 'blur(20px) saturate(180%)',
                    WebkitBackdropFilter: 'blur(20px) saturate(180%)',
                    boxShadow: 'inset 0 0 20px rgba(255, 255, 255, 0.3), inset 0 2px 10px rgba(255, 255, 255, 0.4)'
                  }}
                />

                {/* Reflet lumineux sur le glassmorphism */}
                <div
                  className="absolute inset-0 superellipse-2xl pointer-events-none"
                  style={{
                    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.4) 0%, transparent 50%)',
                  }}
                />

                {/* Couche 1 (avant): Logo icon blanc (squircle épais) */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <img
                    src="/logos/izzico-icon-squircle-blanc.svg"
                    alt="Izzico"
                    className="w-[85px] h-[85px] drop-shadow-lg"
                    style={{
                      filter: 'drop-shadow(0 2px 8px rgba(0, 0, 0, 0.15))'
                    }}
                  />
                </div>
              </div>
            </motion.div>

            {/* Main Title - Plus compact */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-4xl md:text-5xl font-bold text-white text-center mb-2 leading-tight"
            >
              Trouve ton Co-living
            </motion.h1>

            {/* Subtitle - Valeurs de la marque */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-lg md:text-xl text-white/90 text-center mb-0"
            >
              Facile, Rapide et Sécurisé
            </motion.p>
          </div>

          {/* Section blanche - Collée directement */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="bg-white p-4 relative z-10 rounded-b-[40px]"
          >
            <div className="grid grid-cols-1 md:grid-cols-4 gap-2">

              {/* Location Input */}
              <div className="p-4 superellipse-2xl hover:bg-purple-50/50 transition-all group">
                <label className="block text-xs font-semibold text-gray-900 mb-1">
                  Où ?
                </label>
                <SafeGooglePlacesAutocomplete
                  onPlaceSelect={handlePlaceSelect}
                  placeholder="Ville, quartier..."
                  iconClassName="w-4 h-4 text-gray-400 group-hover:text-purple-600 transition-colors"
                  inputClassName="w-full text-sm text-gray-600 placeholder:text-gray-400 bg-transparent outline-none"
                />
              </div>

              {/* Budget Input */}
              <div className="p-4 superellipse-2xl hover:bg-purple-50/50 transition-all group border-l-0 md:border-l border-gray-200">
                <label className="block text-xs font-semibold text-gray-900 mb-1">
                  Budget
                </label>
                <BudgetRangePicker
                  onBudgetChange={handleBudgetChange}
                  placeholder="€800/mois"
                  iconClassName="w-4 h-4 text-gray-400 group-hover:text-purple-600 transition-colors"
                  inputClassName="w-full text-sm text-gray-600 placeholder:text-gray-400 bg-transparent outline-none"
                  minBudget={0}
                  maxBudget={2000}
                />
              </div>

              {/* Date Input */}
              <div className="p-4 superellipse-2xl hover:bg-purple-50/50 transition-all group border-l-0 md:border-l border-gray-200">
                <label className="block text-xs font-semibold text-gray-900 mb-1">
                  Quand ?
                </label>
                <DatePicker
                  onDateSelect={handleDateSelect}
                  placeholder="Flexible"
                  iconClassName="w-4 h-4 text-gray-400 group-hover:text-purple-600 transition-colors"
                  inputClassName="w-full text-sm text-gray-600 placeholder:text-gray-400 bg-transparent outline-none"
                />
              </div>

              {/* Search Button - Gradient Signature v3 */}
              <div className="p-2 flex items-center justify-center">
                <Button
                  onClick={handleSearch}
                  className="w-full h-full group text-white font-semibold superellipse-2xl shadow-lg hover:shadow-xl transition-all hover:scale-105"
                  style={{
                    background: 'linear-gradient(135deg, #9c5698 0%, #e05747 50%, #ffa000 100%)',
                    boxShadow: '0 10px 30px -5px rgba(156, 86, 152, 0.4), 0 4px 10px -2px rgba(224, 87, 71, 0.3)'
                  }}
                >
                  <div className="flex items-center">
                    <Search className="w-5 h-5 mr-2" />
                    Rechercher
                  </div>
                </Button>
              </div>
            </div>

            {/* Trust badges in card */}
            <div className="flex flex-wrap items-center justify-center gap-6 mt-4 pt-4 border-t border-gray-200/50">
              <div className="flex items-center gap-2 text-xs text-gray-700">
                <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center">
                  <span className="text-green-600 font-bold text-xs">✓</span>
                </div>
                <span className="font-medium">ID vérifié</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-700">
                <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center">
                  <span className="text-green-600 font-bold text-xs">✓</span>
                </div>
                <span className="font-medium">Annonces vérifiées</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-700">
                <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center">
                  <span className="text-green-600 font-bold text-xs">✓</span>
                </div>
                <span className="font-medium">Support 24/7</span>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* CTA Section - Modern Pills */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.6 }}
          className="text-center"
        >
          <p className="text-white/80 mb-6 font-medium text-base drop-shadow-lg">
            Ou commence directement
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            {/* Owner CTA - Glassmorphism Style - v3 #9c5698 */}
            <Link href="/onboarding/owner" className="w-full sm:w-auto">
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
                className="w-full sm:w-auto group text-white font-bold px-8 py-5 rounded-full shadow-xl hover:shadow-2xl transition-all backdrop-blur-xl border border-white/30"
                style={{
                  background: 'rgba(156, 86, 152, 0.85)',
                  boxShadow: '0 10px 30px -5px rgba(156, 86, 152, 0.4), 0 4px 10px -2px rgba(156, 86, 152, 0.3)'
                }}
              >
                <div className="flex items-center justify-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center group-hover:bg-white/30 transition-all">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <span className="text-base">Je loue mon bien</span>
                </div>
              </motion.button>
            </Link>

            {/* Resident CTA - Glassmorphism Style - v3 #e05747 */}
            <Link href="/onboarding/resident" className="w-full sm:w-auto">
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
                className="w-full sm:w-auto group text-white font-bold px-8 py-5 rounded-full shadow-xl hover:shadow-2xl transition-all backdrop-blur-xl border border-white/30"
                style={{
                  background: 'rgba(224, 87, 71, 0.85)',
                  boxShadow: '0 10px 30px -5px rgba(224, 87, 71, 0.4), 0 4px 10px -2px rgba(224, 87, 71, 0.3)'
                }}
              >
                <div className="flex items-center justify-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center group-hover:bg-white/30 transition-all">
                    <Home className="w-4 h-4" />
                  </div>
                  <span className="text-base">Je suis résident</span>
                </div>
              </motion.button>
            </Link>

            {/* Searcher CTA - Glassmorphism Style - v3 #ffa000 */}
            <Link href="/guest" className="w-full sm:w-auto">
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
                className="w-full sm:w-auto group text-white font-bold px-8 py-5 rounded-full shadow-xl hover:shadow-2xl transition-all backdrop-blur-xl border border-white/30"
                style={{
                  background: 'rgba(255, 160, 0, 0.85)',
                  boxShadow: '0 10px 30px -5px rgba(255, 160, 0, 0.4), 0 4px 10px -2px rgba(255, 160, 0, 0.3)'
                }}
              >
                <div className="flex items-center justify-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center group-hover:bg-white/30 transition-all">
                    <Search className="w-4 h-4" />
                  </div>
                  <span className="text-base">Je cherche un logement</span>
                </div>
              </motion.button>
            </Link>
          </div>

          {/* Guest Mode Link */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.8 }}
            className="mt-6"
          >
            <Link href="/guest" className="text-white/70 hover:text-white text-sm font-medium underline decoration-white/30 hover:decoration-white transition-all">
              {t('landing.hero.guestMode')}
            </Link>
          </motion.div>
        </motion.div>

      </div>
    </section>
  );
}
