'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle, Sparkles, Home, Heart, Users, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { useLanguage } from '@/lib/i18n/use-language';
import ProgressBar, { generateStepsArray } from '@/components/onboarding/ProgressBar';

export default function QuickCompletePage() {
  const router = useRouter();
  const { t } = useLanguage();
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    // Fire confetti
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    function randomInRange(min: number, max: number) {
      return Math.random() * (max - min) + min;
    }

    const interval: NodeJS.Timeout = setInterval(function () {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);

      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
      });
    }, 250);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Countdown timer
    if (countdown === 0) {
      router.push('/dashboard/searcher/v2');
      return;
    }

    const timer = setTimeout(() => {
      setCountdown(countdown - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [countdown, router]);

  const handleGoToDashboard = () => {
    router.push('/dashboard/searcher/v2');
  };

  const handleCompleteProfile = () => {
    router.push('/profile/enhance');
  };

  const steps = generateStepsArray('quick', 4);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-purple-50 to-yellow-50">
      <ProgressBar steps={steps} currentStep={4} mode="quick" />

      <div className="max-w-3xl mx-auto px-4 py-12">
        {/* Success Animation */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, type: 'spring' }}
          className="text-center mb-8"
        >
          <div className="relative inline-block">
            <motion.div
              animate={{
                rotate: [0, 10, -10, 10, 0],
                scale: [1, 1.1, 1.1, 1.1, 1],
              }}
              transition={{ duration: 1, repeat: Infinity, repeatDelay: 2 }}
              className="w-32 h-32 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto shadow-2xl"
            >
              <CheckCircle className="w-20 h-20 text-white" />
            </motion.div>

            {/* Sparkles */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
              className="absolute -top-4 -right-4"
            >
              <Sparkles className="w-12 h-12 text-yellow-400" />
            </motion.div>
          </div>
        </motion.div>

        {/* Success Message */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            🎉 {t('quickOnboarding.complete.congrats')}
          </h1>
          <p className="text-xl text-gray-600 mb-2">
            {t('quickOnboarding.complete.profileReady')}
          </p>
          <p className="text-gray-500">
            {t('quickOnboarding.complete.aiMessage')}
          </p>
        </motion.div>

        {/* What's Next Card */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-3xl shadow-xl p-8 mb-8"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-orange-500" />
            {t('quickOnboarding.complete.whatsNext.title')}
          </h2>

          <div className="space-y-4">
            {/* Feature 1 */}
            <div className="flex items-start gap-4 p-4 rounded-xl hover:bg-orange-50 transition">
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <Home className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">
                  {t('quickOnboarding.complete.whatsNext.matches.title')}
                </h3>
                <p className="text-sm text-gray-600">
                  {t('quickOnboarding.complete.whatsNext.matches.description')}
                </p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="flex items-start gap-4 p-4 rounded-xl hover:bg-purple-50 transition">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <Heart className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">
                  {t('quickOnboarding.complete.whatsNext.favorites.title')}
                </h3>
                <p className="text-sm text-gray-600">
                  {t('quickOnboarding.complete.whatsNext.favorites.description')}
                </p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="flex items-start gap-4 p-4 rounded-xl hover:bg-yellow-50 transition">
              <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <Users className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">
                  {t('quickOnboarding.complete.whatsNext.group.title')}
                </h3>
                <p className="text-sm text-gray-600">
                  {t('quickOnboarding.complete.whatsNext.group.description')}
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* CTAs */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="space-y-4"
        >
          {/* Primary CTA */}
          <button
            onClick={handleGoToDashboard}
            className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold py-5 px-8 rounded-2xl flex items-center justify-center gap-3 transition-all hover:shadow-2xl hover:scale-105"
          >
            <span className="text-lg">{t('quickOnboarding.complete.goToDashboard')}</span>
            <ArrowRight className="w-6 h-6" />
          </button>

          {/* Secondary CTA */}
          <button
            onClick={handleCompleteProfile}
            className="w-full bg-white hover:bg-gray-50 text-gray-700 font-semibold py-4 px-6 rounded-2xl border-2 border-gray-200 hover:border-orange-300 transition-all flex items-center justify-center gap-2"
          >
            <Sparkles className="w-5 h-5 text-orange-500" />
            <span>{t('quickOnboarding.complete.completeProfile')}</span>
          </button>

          {/* Auto-redirect Counter */}
          <p className="text-center text-sm text-gray-500">
            {`${t('quickOnboarding.complete.autoRedirect') || 'Redirection dans'} ${countdown}s...`}
          </p>
        </motion.div>

        {/* Tip */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-8 bg-blue-50 border border-blue-200 rounded-2xl p-6"
        >
          <p className="text-sm text-blue-800">
            💡 <span className="font-semibold">{t('quickOnboarding.complete.proTip.label')}</span> {t('quickOnboarding.complete.proTip.text')}
          </p>
        </motion.div>
      </div>
    </div>
  );
}
