'use client';

import Link from 'next/link';
import { Search, Home, MapPin, Euro, Calendar, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

export default function ModernHeroSection() {
  return (
    <section className="relative pt-24 pb-20 px-6 overflow-hidden min-h-[90vh] flex items-center">
      <div className="relative z-20 max-w-6xl mx-auto w-full">

        {/* Logo Badge */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="flex justify-center mb-6"
        >
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-purple-600 to-purple-800 flex items-center justify-center shadow-2xl">
            <Home className="w-10 h-10 text-white" />
          </div>
        </motion.div>

        {/* Main Title - Court et percutant */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-5xl md:text-7xl font-bold text-gray-900 text-center mb-4 leading-tight"
        >
          Trouve ton coloc idéal
        </motion.h1>

        {/* Subtitle - Minimal */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-xl md:text-2xl text-gray-600 text-center mb-12 max-w-3xl mx-auto"
        >
          En quelques clics
        </motion.p>

        {/* Unified Search Card - Style Airbnb */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="max-w-5xl mx-auto mb-12"
        >
          <div className="bg-white rounded-[32px] shadow-2xl p-4 border border-gray-100">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-2">

              {/* Location Input */}
              <div className="p-4 rounded-2xl hover:bg-gray-50 transition-all cursor-pointer group">
                <label className="block text-xs font-semibold text-gray-900 mb-1">
                  Où ?
                </label>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-gray-400 group-hover:text-purple-600 transition-colors" />
                  <input
                    type="text"
                    placeholder="Ville, quartier..."
                    className="w-full text-sm text-gray-600 placeholder:text-gray-400 bg-transparent outline-none"
                  />
                </div>
              </div>

              {/* Budget Input */}
              <div className="p-4 rounded-2xl hover:bg-gray-50 transition-all cursor-pointer group border-l-0 md:border-l border-gray-200">
                <label className="block text-xs font-semibold text-gray-900 mb-1">
                  Budget
                </label>
                <div className="flex items-center gap-2">
                  <Euro className="w-4 h-4 text-gray-400 group-hover:text-purple-600 transition-colors" />
                  <input
                    type="text"
                    placeholder="€800/mois"
                    className="w-full text-sm text-gray-600 placeholder:text-gray-400 bg-transparent outline-none"
                  />
                </div>
              </div>

              {/* Date Input */}
              <div className="p-4 rounded-2xl hover:bg-gray-50 transition-all cursor-pointer group border-l-0 md:border-l border-gray-200">
                <label className="block text-xs font-semibold text-gray-900 mb-1">
                  Quand ?
                </label>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-400 group-hover:text-purple-600 transition-colors" />
                  <input
                    type="text"
                    placeholder="Flexible"
                    className="w-full text-sm text-gray-600 placeholder:text-gray-400 bg-transparent outline-none"
                  />
                </div>
              </div>

              {/* Search Button Integrated */}
              <div className="p-2 flex items-center justify-center">
                <Button className="w-full h-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all hover:scale-105">
                  <Search className="w-5 h-5 mr-2" />
                  Rechercher
                </Button>
              </div>
            </div>

            {/* Trust badges in card */}
            <div className="flex flex-wrap items-center justify-center gap-6 mt-4 pt-4 border-t border-gray-100">
              <div className="flex items-center gap-2 text-xs text-gray-600">
                <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center">
                  <span className="text-green-600 font-bold text-xs">✓</span>
                </div>
                <span className="font-medium">ID vérifié</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-600">
                <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center">
                  <span className="text-green-600 font-bold text-xs">✓</span>
                </div>
                <span className="font-medium">Annonces vérifiées</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-600">
                <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center">
                  <span className="text-green-600 font-bold text-xs">✓</span>
                </div>
                <span className="font-medium">Support 24/7</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* CTA Section - Modern Pills */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="text-center"
        >
          <p className="text-sm text-gray-500 mb-6">
            Ou commence directement
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-2xl mx-auto">
            {/* Searcher CTA - Yellow Pill */}
            <Link href="/onboarding/searcher" className="w-full sm:w-auto">
              <Button className="w-full sm:w-auto group relative overflow-hidden bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-gray-900 font-bold px-8 py-6 rounded-full shadow-xl hover:shadow-2xl transition-all hover:scale-105 text-base">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                    <Search className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <div className="font-bold text-base">Je cherche une coloc</div>
                    <div className="text-xs text-gray-800 opacity-90">Trouve ta communauté</div>
                  </div>
                </div>
              </Button>
            </Link>

            {/* Owner CTA - Purple Pill */}
            <Link href="/onboarding/owner" className="w-full sm:w-auto">
              <Button className="w-full sm:w-auto group relative overflow-hidden bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 text-white font-bold px-8 py-6 rounded-full shadow-xl hover:shadow-2xl transition-all hover:scale-105 text-base">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                    <Home className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <div className="font-bold text-base">Je loue mon bien</div>
                    <div className="text-xs text-purple-200 opacity-90">En toute confiance</div>
                  </div>
                </div>
              </Button>
            </Link>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
