'use client';

import { motion } from 'framer-motion';
import { Search, Calendar, Bell, Home, ArrowLeft, Sparkles, MapPin, Heart, Users, Zap } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/lib/i18n/use-language';

// V2 Fun Design Colors - Searcher Theme (Gold/Amber)
const SEARCHER_GRADIENT = 'linear-gradient(135deg, #f59e0b 0%, #f97316 100%)';
const SEARCHER_PRIMARY = '#f59e0b';
const CARD_BG_GRADIENT = 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)';
const ACCENT_SHADOW = 'rgba(245, 158, 11, 0.25)';

export default function SearcherComingSoon() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const { language, getSection } = useLanguage();
  const t = getSection('comingSoon')?.searcher;

  const handleWaitlist = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement save to Supabase (waitlist table)
    setSubscribed(true);
    setTimeout(() => {
      setEmail('');
      setSubscribed(false);
    }, 3000);
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const features = [
    {
      icon: Search,
      key: 'marketplace',
      gradient: 'linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)',
      bgColor: 'rgba(245, 158, 11, 0.1)',
    },
    {
      icon: Heart,
      key: 'matching',
      gradient: 'linear-gradient(135deg, #ef4444 0%, #f97316 100%)',
      bgColor: 'rgba(239, 68, 68, 0.1)',
    },
    {
      icon: Bell,
      key: 'alerts',
      gradient: 'linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%)',
      bgColor: 'rgba(139, 92, 246, 0.1)',
    },
  ];

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background with decorative elements */}
      <div className="fixed inset-0 -z-10">
        {/* Base gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-amber-50/80 via-white to-orange-50/60" />

        {/* Animated gradient blobs */}
        <motion.div
          animate={{ scale: [1, 1.1, 1], x: [0, 20, 0] }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute top-20 -left-20 w-96 h-96 rounded-full mix-blend-multiply filter blur-3xl opacity-40"
          style={{ background: SEARCHER_GRADIENT }}
        />
        <motion.div
          animate={{ scale: [1, 1.2, 1], y: [0, -30, 0] }}
          transition={{ duration: 10, repeat: Infinity, delay: 1 }}
          className="absolute top-40 -right-20 w-80 h-80 rounded-full mix-blend-multiply filter blur-3xl opacity-30"
          style={{ background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)' }}
        />
        <motion.div
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ duration: 12, repeat: Infinity, delay: 2 }}
          className="absolute -bottom-20 left-1/3 w-96 h-96 rounded-full mix-blend-multiply filter blur-3xl opacity-30"
          style={{ background: 'linear-gradient(135deg, #f97316 0%, #fb923c 100%)' }}
        />

        {/* Glass overlay */}
        <div className="absolute inset-0 backdrop-blur-3xl bg-white/40" />
      </div>

      {/* Content */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 max-w-4xl mx-auto px-4 py-8 md:py-12"
      >
        {/* Back button */}
        <motion.button
          variants={itemVariants}
          whileHover={{ x: -4 }}
          onClick={() => router.push('/')}
          className="mb-8 flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors group"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">{t?.backToHome?.[language] || 'Back to home'}</span>
        </motion.button>

        <div className="text-center">
          {/* Animated icon */}
          <motion.div
            variants={itemVariants}
            className="relative inline-block mb-8"
          >
            <motion.div
              animate={{
                scale: [1, 1.05, 1],
                rotate: [0, 3, -3, 0]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                repeatType: "reverse"
              }}
              className="w-28 h-28 md:w-32 md:h-32 superellipse-3xl flex items-center justify-center"
              style={{
                background: SEARCHER_GRADIENT,
                boxShadow: `0 20px 50px ${ACCENT_SHADOW}`,
              }}
            >
              <Search className="w-14 h-14 md:w-16 md:h-16 text-white" />
            </motion.div>

            {/* Floating badges */}
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute -top-2 -right-2 w-10 h-10 superellipse-xl flex items-center justify-center bg-white"
              style={{ boxShadow: `0 8px 24px ${ACCENT_SHADOW}` }}
            >
              <Sparkles className="w-5 h-5" style={{ color: SEARCHER_PRIMARY }} />
            </motion.div>
          </motion.div>

          {/* Title */}
          <motion.h1
            variants={itemVariants}
            className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 mb-4"
          >
            {t?.title?.[language] || 'Coming Soon!'}{' '}
            <motion.span
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
              className="inline-block"
            >
              🚀
            </motion.span>
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="text-xl md:text-2xl text-gray-600 mb-10"
          >
            {t?.subtitle?.[language] || 'The'}{' '}
            <span
              className="font-bold bg-clip-text text-transparent"
              style={{ backgroundImage: SEARCHER_GRADIENT }}
            >
              {t?.featureName?.[language] || 'Searcher'}
            </span>{' '}
            {t?.arriving?.[language] || 'feature is coming very soon.'}
          </motion.p>

          {/* Features Card */}
          <motion.div
            variants={itemVariants}
            className="relative overflow-hidden bg-white superellipse-3xl p-8 md:p-10 mb-8"
            style={{ boxShadow: `0 20px 60px ${ACCENT_SHADOW}` }}
          >
            {/* Decorative circles */}
            <div
              className="absolute -right-16 -top-16 w-48 h-48 rounded-full opacity-20"
              style={{ background: SEARCHER_GRADIENT }}
            />
            <div
              className="absolute -left-8 -bottom-8 w-32 h-32 rounded-full opacity-15"
              style={{ background: 'linear-gradient(135deg, #f97316 0%, #fb923c 100%)' }}
            />

            <div className="relative z-10">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8 flex items-center justify-center gap-3">
                <motion.div
                  whileHover={{ rotate: 5 }}
                  className="w-10 h-10 superellipse-xl flex items-center justify-center"
                  style={{ background: SEARCHER_GRADIENT }}
                >
                  <Zap className="w-5 h-5 text-white" />
                </motion.div>
                {t?.whatscoming?.[language] || 'What\'s coming?'}
              </h2>

              <div className="grid md:grid-cols-3 gap-6">
                {features.map((feature, index) => {
                  const Icon = feature.icon;
                  return (
                    <motion.div
                      key={index}
                      variants={itemVariants}
                      whileHover={{ scale: 1.03, y: -6 }}
                      className="relative overflow-hidden superellipse-2xl p-6 cursor-default"
                      style={{
                        background: 'white',
                        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.06)',
                      }}
                    >
                      {/* Decorative circle */}
                      <div
                        className="absolute -right-4 -top-4 w-20 h-20 rounded-full opacity-30"
                        style={{ background: feature.gradient }}
                      />

                      <div className="relative z-10">
                        <motion.div
                          whileHover={{ rotate: 5 }}
                          className="w-14 h-14 superellipse-xl flex items-center justify-center mx-auto mb-4"
                          style={{ background: feature.bgColor }}
                        >
                          <Icon className="w-7 h-7" style={{ color: feature.gradient.includes('#f59e0b') ? '#f59e0b' : feature.gradient.includes('#ef4444') ? '#ef4444' : '#8b5cf6' }} />
                        </motion.div>
                        <h3 className="font-bold text-gray-900 mb-2 text-lg">
                          {t?.features?.[feature.key]?.title?.[language] || feature.key}
                        </h3>
                        <p className="text-sm text-gray-600 leading-relaxed">
                          {t?.features?.[feature.key]?.description?.[language] || ''}
                        </p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </motion.div>

          {/* Waitlist CTA */}
          <motion.div
            variants={itemVariants}
            whileHover={{ scale: 1.01 }}
            className="relative overflow-hidden superellipse-3xl p-8 md:p-10 text-white mb-8"
            style={{
              background: SEARCHER_GRADIENT,
              boxShadow: `0 20px 60px ${ACCENT_SHADOW}`,
            }}
          >
            {/* Decorative elements */}
            <div className="absolute -right-20 -top-20 w-64 h-64 rounded-full bg-white/10" />
            <div className="absolute -left-10 -bottom-10 w-40 h-40 rounded-full bg-white/10" />

            <div className="relative z-10">
              <motion.div
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-14 h-14 superellipse-2xl flex items-center justify-center mx-auto mb-4 bg-white/20 backdrop-blur-sm"
              >
                <Bell className="w-7 h-7 text-white" />
              </motion.div>

              <h3 className="text-2xl md:text-3xl font-bold mb-3">
                {t?.waitlist?.title?.[language] || 'Join the waitlist'}
              </h3>
              <p className="mb-6 text-white/90 text-lg max-w-md mx-auto">
                {t?.waitlist?.subtitle?.[language] || 'Be among the first to access the marketplace!'}
              </p>

              {!subscribed ? (
                <form onSubmit={handleWaitlist} className="max-w-md mx-auto">
                  <div className="flex flex-col sm:flex-row gap-3">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={t?.waitlist?.placeholder?.[language] || 'your@email.com'}
                      required
                      className="flex-1 px-6 py-4 superellipse-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-white/30 transition-shadow text-base font-medium"
                    />
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      type="submit"
                      className="bg-white px-8 py-4 superellipse-xl font-bold transition-all text-base"
                      style={{ color: SEARCHER_PRIMARY }}
                    >
                      {t?.waitlist?.button?.[language] || 'Join'}
                    </motion.button>
                  </div>
                </form>
              ) : (
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="bg-white/20 backdrop-blur-sm superellipse-2xl p-6 max-w-md mx-auto"
                >
                  <p className="text-xl font-bold">{t?.waitlist?.success?.title?.[language] || '✅ Thanks! You\'re on the list!'}</p>
                  <p className="text-white/90 mt-2">
                    {t?.waitlist?.success?.message?.[language] || 'We\'ll contact you as soon as the marketplace opens.'}
                  </p>
                </motion.div>
              )}
            </div>
          </motion.div>

          {/* Alternative actions */}
          <motion.div
            variants={itemVariants}
            className="relative overflow-hidden bg-white superellipse-2xl p-6"
            style={{ boxShadow: `0 8px 24px rgba(0, 0, 0, 0.06)` }}
          >
            <div className="relative z-10">
              <h4 className="font-bold text-gray-900 mb-4 flex items-center justify-center gap-2">
                <Home className="w-5 h-5 text-gray-600" />
                {t?.alternatives?.title?.[language] || 'Meanwhile, discover our other features'}
              </h4>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                  <Button
                    onClick={() => router.push('/welcome')}
                    className="superellipse-xl px-6 py-5 font-semibold text-white border-none"
                    style={{ background: 'linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%)' }}
                  >
                    <Users className="w-4 h-4 mr-2" />
                    {t?.alternatives?.owner?.[language] || 'Manage a Property (Owner)'}
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                  <Button
                    onClick={() => router.push('/welcome')}
                    className="superellipse-xl px-6 py-5 font-semibold text-white border-none"
                    style={{ background: 'linear-gradient(135deg, #10b981 0%, #14b8a6 100%)' }}
                  >
                    <Home className="w-4 h-4 mr-2" />
                    {t?.alternatives?.resident?.[language] || 'Manage my Coliving (Resident)'}
                  </Button>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
