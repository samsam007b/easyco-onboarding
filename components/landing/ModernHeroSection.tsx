'use client';

import Link from 'next/link';
import { Search, Home, MapPin, Euro, Calendar, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

export default function ModernHeroSection() {
  return (
    <section className="relative pt-24 pb-20 px-6 overflow-hidden min-h-[90vh] flex items-center">
      {/* Pas de voile blanc - images en full HD */}

      <div className="relative z-20 max-w-4xl mx-auto w-full">

        {/* Container unifié avec dégradé signature EasyCo */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.7 }}
          className="rounded-[40px] shadow-2xl overflow-hidden mb-12"
          style={{
            background: 'linear-gradient(135deg, #6E56CF 0%, #FF6F3C 50%, #FFD249 100%)'
          }}
        >
          {/* Section mauve avec logo et texte - Plus compact */}
          <div className="p-8 md:p-10">
            {/* Logo Badge - Signature gradient avec glassmorphism */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex justify-center mb-6"
            >
              <div className="w-16 h-16 rounded-2xl bg-white/30 backdrop-blur-xl flex items-center justify-center shadow-xl border border-white/40">
                <Home className="w-8 h-8 text-white drop-shadow-lg" />
              </div>
            </motion.div>

            {/* Main Title - Plus compact */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-4xl md:text-5xl font-bold text-white text-center mb-2 leading-tight"
            >
              Trouve ta coloc
            </motion.h1>

            {/* Subtitle - Plus petit */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-lg md:text-xl text-white/90 text-center mb-0"
            >
              En quelques clics
            </motion.p>
          </div>

          {/* Section blanche - Collée directement */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="bg-white p-4"
          >
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
          </motion.div>
        </motion.div>

        {/* CTA Section - Compact Pills */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.6 }}
          className="text-center"
        >
          <p className="text-sm text-white/90 mb-4 font-medium">
            Ou commence directement
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            {/* Searcher CTA - Yellow Pill Compact */}
            <Link href="/onboarding/searcher" className="w-full sm:w-auto">
              <Button className="w-full sm:w-auto group relative overflow-hidden bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-gray-900 font-bold px-6 py-4 rounded-full shadow-xl hover:shadow-2xl transition-all hover:scale-105">
                <div className="flex items-center gap-2">
                  <Search className="w-5 h-5" />
                  <span>Je cherche une coloc</span>
                </div>
              </Button>
            </Link>

            {/* Owner CTA - Purple Gradient with Grain */}
            <Link href="/onboarding/owner" className="w-full sm:w-auto">
              <Button className="cta-owner w-full sm:w-auto group relative overflow-hidden text-white font-bold px-6 py-4 rounded-full shadow-xl hover:shadow-2xl transition-all hover:scale-105">
                <div className="flex items-center gap-2">
                  <Home className="w-5 h-5" />
                  <span>Je loue mon bien</span>
                </div>
              </Button>
            </Link>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
