'use client';

import Link from 'next/link';
import { Search, Home, MapPin, Euro, Calendar, Users, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { useState } from 'react';
import SafeGooglePlacesAutocomplete from '@/components/ui/SafeGooglePlacesAutocomplete';
import DatePicker from '@/components/ui/date-picker';
import BudgetRangePicker from '@/components/ui/budget-range-picker';

export default function ModernHeroSection() {
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
          {/* Verre trempé avec gradient subtil et effet 3D */}
          <div className="absolute inset-0 rounded-[40px]"
               style={{
                 background: 'linear-gradient(135deg, rgba(110, 86, 207, 0.25) 0%, rgba(255, 111, 60, 0.22) 50%, rgba(255, 210, 73, 0.25) 100%)',
                 backdropFilter: 'blur(50px) saturate(250%) brightness(1.15)',
                 WebkitBackdropFilter: 'blur(50px) saturate(250%) brightness(1.15)',
                 boxShadow: 'inset 0 0 60px rgba(255, 255, 255, 0.4), inset 0 -2px 30px rgba(110, 86, 207, 0.3)',
                 overflow: 'hidden'
               }}
          />

          {/* Réfraction lumineuse sur les bords - effet prismatique */}
          <div className="absolute inset-0 rounded-[40px]"
               style={{
                 background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.4) 0%, transparent 20%, transparent 80%, rgba(110, 86, 207, 0.3) 100%)',
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

          {/* Bordure extérieure avec effet de réfraction */}
          <div className="absolute -inset-[2px] rounded-[42px] pointer-events-none"
               style={{
                 background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.6) 0%, rgba(110, 86, 207, 0.4) 25%, rgba(255, 111, 60, 0.4) 50%, rgba(255, 210, 73, 0.4) 75%, rgba(255, 255, 255, 0.6) 100%)',
                 filter: 'blur(1px)',
                 opacity: 0.6,
                 overflow: 'hidden'
               }}
          />

          {/* Section mauve avec logo et texte - Plus compact */}
          <div className="p-8 md:p-10 relative z-10">
            {/* Logo Badge - Signature gradient avec glassmorphism */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex justify-center mb-6"
            >
              <div className="w-16 h-16 rounded-2xl bg-white/30 backdrop-blur-xl flex items-center justify-center shadow-xl border border-white/40">
                <div
                  className="w-8 h-8"
                  style={{
                    background: 'linear-gradient(135deg, #6E56CF 0%, #FF6F3C 50%, #FFD249 100%)',
                    WebkitMask: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'currentColor\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3E%3Cpath d=\'m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z\'/%3E%3Cpolyline points=\'9 22 9 12 15 12 15 22\'/%3E%3C/svg%3E") center / contain no-repeat',
                    mask: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'currentColor\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3E%3Cpath d=\'m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z\'/%3E%3Cpolyline points=\'9 22 9 12 15 12 15 22\'/%3E%3C/svg%3E") center / contain no-repeat'
                  }}
                />
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
              <div className="p-4 rounded-2xl hover:bg-purple-50/50 transition-all group">
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
              <div className="p-4 rounded-2xl hover:bg-purple-50/50 transition-all group border-l-0 md:border-l border-gray-200">
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
              <div className="p-4 rounded-2xl hover:bg-purple-50/50 transition-all group border-l-0 md:border-l border-gray-200">
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

              {/* Search Button Integrated - Matching Searcher interface gradient */}
              <div className="p-2 flex items-center justify-center">
                <Button
                  className="w-full h-full group relative overflow-hidden text-gray-900 font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all hover:scale-105"
                  style={{
                    background: 'linear-gradient(135deg, #FFA040 0%, #FFB85C 50%, #FFD080 100%)'
                  }}
                >
                  {/* Shine effect on hover */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />

                  <div className="relative flex items-center">
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
            {/* Searcher CTA - Orange Gradient Pill (matching Searcher interface) */}
            <Link href="/onboarding/searcher" className="w-full sm:w-auto">
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
                className="w-full sm:w-auto group relative overflow-hidden text-white font-bold px-8 py-5 rounded-full shadow-2xl hover:shadow-orange-500/50 transition-all"
                style={{
                  background: 'linear-gradient(135deg, #FFA040 0%, #FFB85C 50%, #FFD080 100%)'
                }}
              >
                {/* Shine effect on hover */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />

                <div className="relative flex items-center justify-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:bg-white/30 transition-all">
                    <Search className="w-4 h-4" />
                  </div>
                  <span className="text-base">Je cherche une coloc</span>
                </div>
              </motion.button>
            </Link>

            {/* Owner CTA - Purple to Pink Gradient Pill (Brand Colors) */}
            <Link href="/onboarding/owner" className="w-full sm:w-auto">
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
                className="w-full sm:w-auto group relative overflow-hidden text-white font-bold px-8 py-5 rounded-full shadow-2xl hover:shadow-purple-500/50 transition-all"
                style={{
                  background: 'linear-gradient(135deg, #6E56CF 0%, #B76386 100%)'
                }}
              >
                {/* Shine effect on hover */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />

                <div className="relative flex items-center justify-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:bg-white/30 transition-all">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <span className="text-base">Je loue mon bien</span>
                </div>
              </motion.button>
            </Link>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
