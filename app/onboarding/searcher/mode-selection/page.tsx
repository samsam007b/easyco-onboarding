'use client';

import { useRouter } from 'next/navigation';
import { Zap, ListChecks, ArrowRight, Clock, Target } from 'lucide-react';
import { safeLocalStorage } from '@/lib/browser';
import { motion } from 'framer-motion';
import { useLanguage } from '@/lib/i18n/use-language';

export default function ModeSelectionPage() {
  const router = useRouter();
  const { t } = useLanguage();

  const handleModeSelect = (mode: 'quick' | 'full') => {
    // Save mode selection
    safeLocalStorage.set('onboardingMode', mode);

    // Redirect to first step based on mode
    if (mode === 'quick') {
      router.push('/onboarding/searcher/quick/basic-info');
    } else {
      router.push('/onboarding/searcher/profile-type');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-5xl w-full">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {t('modeSelection.title')}
          </h1>
          <p className="text-lg text-gray-600">
            {t('modeSelection.subtitle')}
          </p>
        </motion.div>

        {/* Mode Cards */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Quick Start Mode */}
          <motion.button
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            whileHover={{ scale: 1.02, y: -4 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleModeSelect('quick')}
            className="relative group bg-white superellipse-3xl p-8 border-2 border-orange-200 hover:border-orange-400 hover:shadow-2xl transition-all duration-300 text-left"
          >
            {/* Recommended Badge */}
            <div className="absolute -top-4 right-8 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-4 py-1 rounded-full text-sm font-bold shadow-lg">
              ⚡ {t('modeSelection.quick.recommended')}
            </div>

            {/* Icon */}
            <div className="w-16 h-16 bg-gradient-to-br from-orange-100 to-orange-200 superellipse-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Zap className="w-8 h-8 text-orange-600" />
            </div>

            {/* Title */}
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              {t('modeSelection.quick.title')}
            </h2>

            {/* Description */}
            <p className="text-gray-600 mb-6">
              {t('modeSelection.quick.description')}
            </p>

            {/* Features */}
            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <Clock className="w-4 h-4 text-orange-500" />
                <span>{t('modeSelection.quick.feature1')}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <Target className="w-4 h-4 text-orange-500" />
                <span>{t('modeSelection.quick.feature2')}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <ArrowRight className="w-4 h-4 text-orange-500" />
                <span>{t('modeSelection.quick.feature3')}</span>
              </div>
            </div>

            {/* CTA */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-200">
              <span className="text-sm text-gray-500">{t('modeSelection.quick.tagline')}</span>
              <div className="flex items-center gap-2 text-orange-600 font-semibold group-hover:gap-3 transition-all">
                <span>{t('modeSelection.choose')}</span>
                <ArrowRight className="w-5 h-5" />
              </div>
            </div>

            {/* Hover Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/0 to-orange-600/0 group-hover:from-orange-500/5 group-hover:to-orange-600/5 superellipse-3xl transition-all pointer-events-none" />
          </motion.button>

          {/* Full Mode */}
          <motion.button
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            whileHover={{ scale: 1.02, y: -4 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleModeSelect('full')}
            className="relative group bg-white superellipse-3xl p-8 border-2 border-purple-200 hover:border-purple-400 hover:shadow-2xl transition-all duration-300 text-left"
          >
            {/* Icon */}
            <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-purple-200 superellipse-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <ListChecks className="w-8 h-8 text-purple-600" />
            </div>

            {/* Title */}
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              {t('modeSelection.full.title')}
            </h2>

            {/* Description */}
            <p className="text-gray-600 mb-6">
              {t('modeSelection.full.description')}
            </p>

            {/* Features */}
            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <Clock className="w-4 h-4 text-purple-500" />
                <span>{t('modeSelection.full.feature1')}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <Target className="w-4 h-4 text-purple-500" />
                <span>{t('modeSelection.full.feature2')}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <ArrowRight className="w-4 h-4 text-purple-500" />
                <span>{t('modeSelection.full.feature3')}</span>
              </div>
            </div>

            {/* CTA */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-200">
              <span className="text-sm text-gray-500">{t('modeSelection.full.tagline')}</span>
              <div className="flex items-center gap-2 text-purple-600 font-semibold group-hover:gap-3 transition-all">
                <span>{t('modeSelection.choose')}</span>
                <ArrowRight className="w-5 h-5" />
              </div>
            </div>

            {/* Hover Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/0 to-purple-600/0 group-hover:from-purple-500/5 group-hover:to-purple-600/5 superellipse-3xl transition-all pointer-events-none" />
          </motion.button>
        </div>

        {/* Footer Note */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-center text-sm text-gray-500 mt-8"
        >
          💡 {t('modeSelection.footer')}
        </motion.p>
      </div>
    </div>
  );
}
