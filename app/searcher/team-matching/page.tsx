'use client';

import { motion } from 'framer-motion';
import {
  Users,
  Heart,
  ArrowLeft,
  Sparkles,
  Home,
  UserPlus,
  Target,
  MessageCircle,
  CheckCircle2,
  Zap,
  Bell,
  Search,
  MapPin,
  Calendar,
  Shield,
  Star
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/lib/i18n/use-language';
import Link from 'next/link';

// V3-FUN Searcher Theme (Gold/Amber)
const SEARCHER_GRADIENT = 'linear-gradient(135deg, #F59E0B 0%, #FFB10B 50%, #FCD34D 100%)';
const SEARCHER_PRIMARY = '#FFB10B';
const SEARCHER_DARK = '#F59E0B';
const ACCENT_SHADOW = 'rgba(255, 177, 11, 0.25)';
const MATCHING_GRADIENT = 'linear-gradient(135deg, #FFA040 0%, #FF8C20 100%)';

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
  visible: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 400, damping: 25 } }
};

export default function TeamMatchingComingSoon() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const { language } = useLanguage();

  const handleWaitlist = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement save to Supabase (waitlist table)
    setSubscribed(true);
    setTimeout(() => {
      setEmail('');
      setSubscribed(false);
    }, 3000);
  };

  const features = [
    {
      icon: Heart,
      title: 'Swipe & Match',
      description: 'Parcourez les profils de futurs colocataires et likez ceux qui vous correspondent. Un match mutuel ouvre la conversation !',
      gradient: 'linear-gradient(135deg, #EC4899 0%, #F472B6 100%)',
      bgColor: 'rgba(236, 72, 153, 0.1)',
    },
    {
      icon: Users,
      title: 'Formez votre Dream Team',
      description: 'Créez votre groupe de recherche idéal. Trouvez des personnes avec les mêmes critères et budgets que vous.',
      gradient: MATCHING_GRADIENT,
      bgColor: 'rgba(255, 160, 64, 0.1)',
    },
    {
      icon: Target,
      title: 'Recherche groupée',
      description: 'Cherchez ensemble avec plus de pouvoir de négociation. Les propriétaires adorent les groupes déjà formés !',
      gradient: 'linear-gradient(135deg, #8B5CF6 0%, #A78BFA 100%)',
      bgColor: 'rgba(139, 92, 246, 0.1)',
    },
  ];

  const benefits = [
    {
      icon: Shield,
      title: 'Profils vérifiés',
      description: 'Tous les membres sont vérifiés pour votre sécurité'
    },
    {
      icon: Star,
      title: 'Compatibilité calculée',
      description: 'Algorithme intelligent basé sur vos modes de vie'
    },
    {
      icon: MessageCircle,
      title: 'Chat intégré',
      description: 'Discutez directement avec vos futurs colocataires'
    },
    {
      icon: Calendar,
      title: 'Visites groupées',
      description: 'Organisez des visites ensemble facilement'
    },
  ];

  const steps = [
    {
      number: '01',
      title: 'Complétez votre profil',
      description: 'Ajoutez vos préférences de vie, budget et critères'
    },
    {
      number: '02',
      title: 'Découvrez les profils',
      description: 'Swipez sur les colocataires potentiels comme sur Tinder'
    },
    {
      number: '03',
      title: 'Matchez et discutez',
      description: 'Un like mutuel = un match ! Commencez à discuter'
    },
    {
      number: '04',
      title: 'Formez votre équipe',
      description: 'Créez un groupe et cherchez votre colocation ensemble'
    },
  ];

  return (
    <div className="min-h-screen relative overflow-hidden pb-24 md:pb-8">
      {/* Glassmorphism Background */}
      <div className="fixed inset-0 -z-10">
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
          style={{ background: MATCHING_GRADIENT }}
        />
        <motion.div
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ duration: 12, repeat: Infinity, delay: 2 }}
          className="absolute -bottom-20 left-1/3 w-96 h-96 rounded-full mix-blend-multiply filter blur-3xl opacity-30"
          style={{ background: 'linear-gradient(135deg, #EC4899 0%, #F472B6 100%)' }}
        />

        {/* Glass overlay */}
        <div className="absolute inset-0 backdrop-blur-3xl bg-white/40" />
      </div>

      {/* Content */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 max-w-5xl mx-auto px-4 py-8 md:py-12"
      >
        {/* Back button */}
        <motion.div variants={itemVariants} className="mb-8">
          <Link href="/searcher/matching">
            <Button variant="ghost" className="gap-2 text-gray-600 hover:text-gray-900 hover:bg-amber-50 rounded-xl">
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Retour au matching</span>
            </Button>
          </Link>
        </motion.div>

        <div className="text-center">
          {/* Animated icon with floating hearts */}
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
              className="w-28 h-28 md:w-32 md:h-32 rounded-3xl flex items-center justify-center"
              style={{
                background: MATCHING_GRADIENT,
                boxShadow: `0 20px 50px ${ACCENT_SHADOW}`,
              }}
            >
              <Users className="w-14 h-14 md:w-16 md:h-16 text-white" />
            </motion.div>

            {/* Floating hearts */}
            <motion.div
              animate={{ y: [0, -8, 0], rotate: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute -top-2 -right-2 w-10 h-10 rounded-xl flex items-center justify-center bg-white"
              style={{ boxShadow: `0 8px 24px rgba(236, 72, 153, 0.3)` }}
            >
              <Heart className="w-5 h-5 text-pink-500" fill="#EC4899" />
            </motion.div>
            <motion.div
              animate={{ y: [0, -6, 0], rotate: [0, -10, 0] }}
              transition={{ duration: 2.5, repeat: Infinity, delay: 0.5 }}
              className="absolute -bottom-1 -left-3 w-8 h-8 rounded-lg flex items-center justify-center bg-white"
              style={{ boxShadow: `0 8px 24px rgba(139, 92, 246, 0.3)` }}
            >
              <Sparkles className="w-4 h-4 text-violet-500" />
            </motion.div>
          </motion.div>

          {/* Title */}
          <motion.div variants={itemVariants} className="mb-2">
            <span
              className="inline-block px-4 py-1.5 rounded-full text-sm font-bold text-white mb-4"
              style={{ background: MATCHING_GRADIENT }}
            >
              Bientot disponible
            </span>
          </motion.div>

          <motion.h1
            variants={itemVariants}
            className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 mb-4"
          >
            Team Matching{' '}
            <motion.span
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="inline-block"
            >
              💜
            </motion.span>
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="text-xl md:text-2xl text-gray-600 mb-4 max-w-2xl mx-auto"
          >
            Trouvez vos{' '}
            <span
              className="font-bold bg-clip-text text-transparent"
              style={{ backgroundImage: MATCHING_GRADIENT }}
            >
              colocataires idéaux
            </span>{' '}
            et formez votre équipe de rêve !
          </motion.p>

          <motion.p
            variants={itemVariants}
            className="text-lg text-gray-500 mb-10 max-w-xl mx-auto"
          >
            Comme Tinder, mais pour trouver les personnes parfaites avec qui chercher et vivre en colocation.
          </motion.p>

          {/* Features Cards */}
          <motion.div
            variants={itemVariants}
            className="grid md:grid-cols-3 gap-6 mb-12"
          >
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.03, y: -6 }}
                  className="relative overflow-hidden bg-white rounded-3xl p-6 cursor-default"
                  style={{
                    boxShadow: '0 8px 30px rgba(0, 0, 0, 0.08)',
                  }}
                >
                  {/* Decorative circle */}
                  <div
                    className="absolute -right-6 -top-6 w-24 h-24 rounded-full opacity-20"
                    style={{ background: feature.gradient }}
                  />

                  <div className="relative z-10">
                    <motion.div
                      whileHover={{ rotate: 5 }}
                      className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
                      style={{ background: feature.bgColor }}
                    >
                      <Icon className="w-8 h-8" style={{ color: feature.gradient.includes('#EC4899') ? '#EC4899' : feature.gradient.includes('#FF') ? '#FFA040' : '#8B5CF6' }} />
                    </motion.div>
                    <h3 className="font-bold text-gray-900 mb-2 text-xl">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>

          {/* How it works */}
          <motion.div
            variants={itemVariants}
            className="bg-white rounded-3xl p-8 md:p-10 mb-12"
            style={{ boxShadow: `0 20px 60px ${ACCENT_SHADOW}` }}
          >
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8 flex items-center justify-center gap-3">
              <motion.div
                whileHover={{ rotate: 5 }}
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: MATCHING_GRADIENT }}
              >
                <Zap className="w-5 h-5 text-white" />
              </motion.div>
              Comment ca marche ?
            </h2>

            <div className="grid md:grid-cols-4 gap-6">
              {steps.map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="relative text-center"
                >
                  {/* Connector line */}
                  {index < steps.length - 1 && (
                    <div className="hidden md:block absolute top-8 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-amber-200 to-transparent" />
                  )}

                  <div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl font-black text-white"
                    style={{ background: SEARCHER_GRADIENT }}
                  >
                    {step.number}
                  </div>
                  <h4 className="font-bold text-gray-900 mb-2">{step.title}</h4>
                  <p className="text-sm text-gray-600">{step.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Benefits grid */}
          <motion.div
            variants={itemVariants}
            className="grid sm:grid-cols-2 md:grid-cols-4 gap-4 mb-12"
          >
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.02 }}
                  className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 text-left"
                  style={{ boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)' }}
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
                    style={{ background: `${SEARCHER_PRIMARY}20` }}
                  >
                    <Icon className="w-5 h-5" style={{ color: SEARCHER_DARK }} />
                  </div>
                  <h4 className="font-bold text-gray-900 text-sm mb-1">{benefit.title}</h4>
                  <p className="text-xs text-gray-500">{benefit.description}</p>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Waitlist CTA */}
          <motion.div
            variants={itemVariants}
            whileHover={{ scale: 1.01 }}
            className="relative overflow-hidden rounded-3xl p-8 md:p-10 text-white mb-8"
            style={{
              background: MATCHING_GRADIENT,
              boxShadow: `0 20px 60px rgba(255, 140, 32, 0.3)`,
            }}
          >
            {/* Decorative elements */}
            <div className="absolute -right-20 -top-20 w-64 h-64 rounded-full bg-white/10" />
            <div className="absolute -left-10 -bottom-10 w-40 h-40 rounded-full bg-white/10" />
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
              className="absolute right-10 top-10 opacity-20"
            >
              <Heart className="w-20 h-20" />
            </motion.div>

            <div className="relative z-10">
              <motion.div
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 bg-white/20 backdrop-blur-sm"
              >
                <Bell className="w-8 h-8 text-white" />
              </motion.div>

              <h3 className="text-2xl md:text-3xl font-bold mb-3">
                Soyez les premiers informes !
              </h3>
              <p className="mb-6 text-white/90 text-lg max-w-md mx-auto">
                Inscrivez-vous pour etre notifie des le lancement du Team Matching
              </p>

              {!subscribed ? (
                <form onSubmit={handleWaitlist} className="max-w-md mx-auto">
                  <div className="flex flex-col sm:flex-row gap-3">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="votre@email.com"
                      required
                      className="flex-1 px-6 py-4 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-white/30 transition-shadow text-base font-medium"
                    />
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      type="submit"
                      className="bg-white px-8 py-4 rounded-xl font-bold transition-all text-base flex items-center justify-center gap-2"
                      style={{ color: '#FF8C20' }}
                    >
                      <Sparkles className="w-4 h-4" />
                      M'inscrire
                    </motion.button>
                  </div>
                </form>
              ) : (
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 max-w-md mx-auto"
                >
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <CheckCircle2 className="w-6 h-6" />
                    <p className="text-xl font-bold">Parfait !</p>
                  </div>
                  <p className="text-white/90">
                    Vous serez notifie des le lancement de Team Matching.
                  </p>
                </motion.div>
              )}
            </div>
          </motion.div>

          {/* Alternative actions */}
          <motion.div
            variants={itemVariants}
            className="relative overflow-hidden bg-white rounded-2xl p-6"
            style={{ boxShadow: '0 8px 24px rgba(0, 0, 0, 0.06)' }}
          >
            <div className="relative z-10">
              <h4 className="font-bold text-gray-900 mb-4 flex items-center justify-center gap-2">
                <Search className="w-5 h-5 text-gray-600" />
                En attendant, continuez votre recherche
              </h4>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                  <Button
                    onClick={() => router.push('/searcher/matching')}
                    className="rounded-xl px-6 py-5 font-semibold text-white border-none"
                    style={{ background: SEARCHER_GRADIENT }}
                  >
                    <Home className="w-4 h-4 mr-2" />
                    Matching Proprietes
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                  <Button
                    onClick={() => router.push('/searcher/groups/create')}
                    className="rounded-xl px-6 py-5 font-semibold text-white border-none"
                    style={{ background: 'linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%)' }}
                  >
                    <UserPlus className="w-4 h-4 mr-2" />
                    Creer un groupe
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                  <Button
                    onClick={() => router.push('/searcher/explore')}
                    variant="outline"
                    className="rounded-xl px-6 py-5 font-semibold border-gray-200"
                  >
                    <MapPin className="w-4 h-4 mr-2" />
                    Explorer les biens
                  </Button>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Mobile Bottom Nav Spacer */}
      <div className="h-20 md:hidden" />
    </div>
  );
}
