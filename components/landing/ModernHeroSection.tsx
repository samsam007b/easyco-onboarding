'use client';

import Link from 'next/link';
import { Search, Home, MapPin, Euro, Calendar, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

export default function ModernHeroSection() {
  return (
    <section className="relative pt-24 pb-20 px-6 overflow-hidden min-h-[90vh] flex items-center">
      {/* Pas de voile blanc - images en full HD */}

      <div className="relative z-20 max-w-6xl mx-auto w-full">

        {/* Grand rectangle arrondi mauve avec logo et texte */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.7 }}
          className="bg-gradient-to-br from-purple-600 via-purple-700 to-purple-900 rounded-[48px] shadow-2xl p-12 md:p-16 mb-12"
        >
          {/* Logo Badge */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex justify-center mb-8"
          >
            <div className="w-24 h-24 rounded-3xl bg-white/20 backdrop-blur-xl flex items-center justify-center shadow-xl border border-white/30">
              <Home className="w-12 h-12 text-white" />
            </div>
          </motion.div>

          {/* Main Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-5xl md:text-7xl font-bold text-white text-center mb-4 leading-tight"
          >
            Trouve ta coloc
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-xl md:text-2xl text-white/90 text-center mb-0 max-w-3xl mx-auto"
          >
            En quelques clics
          </motion.p>
        </motion.div>

        {/* Unified Search Card - Dans un fond blanc légèrement transparent */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="max-w-5xl mx-auto mb-12"
        >
          <div className="bg-white/95 backdrop-blur-xl rounded-[32px] shadow-2xl p-4 border border-white/50">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-2">

              {/* Location Input */}
              <div className="p-4 rounded-2xl hover:bg-purple-50/50 transition-all cursor-pointer group">
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
              <div className="p-4 rounded-2xl hover:bg-purple-50/50 transition-all cursor-pointer group border-l-0 md:border-l border-gray-200">
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
              <div className="p-4 rounded-2xl hover:bg-purple-50/50 transition-all cursor-pointer group border-l-0 md:border-l border-gray-200">
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
                <Button className="w-full h-full bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-gray-900 font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all hover:scale-105">
                  <Search className="w-5 h-5 mr-2" />
                  Rechercher
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
          </div>
        </motion.div>

        {/* CTA Section - Modern Pills */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.6 }}
          className="text-center"
        >
          <p className="text-sm text-white/80 mb-6 font-medium">
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

            {/* Owner CTA - White Pill */}
            <Link href="/onboarding/owner" className="w-full sm:w-auto">
              <Button className="w-full sm:w-auto group relative overflow-hidden bg-white hover:bg-white/90 text-purple-900 font-bold px-8 py-6 rounded-full shadow-xl hover:shadow-2xl transition-all hover:scale-105 text-base border-2 border-white/30">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                    <Home className="w-5 h-5 text-purple-700" />
                  </div>
                  <div className="text-left">
                    <div className="font-bold text-base">Je loue mon bien</div>
                    <div className="text-xs text-purple-600 opacity-90">En toute confiance</div>
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
