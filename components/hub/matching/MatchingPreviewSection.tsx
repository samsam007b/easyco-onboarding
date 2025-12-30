'use client';

import { motion } from 'framer-motion';
import { Sparkles, Users, Heart, ArrowRight, MessageCircle, Search, UserPlus, Zap, Shield, Star } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import MockCardStack from './MockCardStack';
import QuickActionsCard from './QuickActionsCard';
import { shouldShowDemoData } from '@/lib/utils/admin-demo';

// V2 Fun Design Colors
const RESIDENT_GRADIENT = 'linear-gradient(135deg, #d9574f 0%, #ff5b21 50%, #ff8017 100%)';
const RESIDENT_PRIMARY = '#ee5736';
const CARD_BG_GRADIENT = 'linear-gradient(135deg, #fff5f3 0%, #ffe8e0 100%)';
const ACCENT_SHADOW = 'rgba(238, 87, 54, 0.2)';

interface MatchingPreviewSectionProps {
  matchCount?: number;
  candidateCount?: number;
  hasInvitations?: boolean;
  invitationCount?: number;
  userEmail?: string | null;
}

export default function MatchingPreviewSection({
  matchCount = 23,
  candidateCount = 147,
  hasInvitations = true,
  invitationCount = 3,
  userEmail,
}: MatchingPreviewSectionProps) {
  const isAdminDemo = shouldShowDemoData(userEmail);
  const router = useRouter();

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

  return (
    <section className="py-16 px-6 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-20 left-10 w-64 h-64 rounded-full opacity-20 blur-3xl"
          style={{ background: RESIDENT_GRADIENT }}
        />
        <div
          className="absolute bottom-20 right-10 w-80 h-80 rounded-full opacity-15 blur-3xl"
          style={{ background: 'linear-gradient(135deg, #ff8017 0%, #ff5b21 100%)' }}
        />
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="max-w-7xl mx-auto relative z-10"
      >
        {/* Section Header */}
        <motion.div variants={itemVariants} className="text-center mb-12">
          {/* Badge */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full mb-6 cursor-default"
            style={{
              background: CARD_BG_GRADIENT,
              boxShadow: `0 8px 24px ${ACCENT_SHADOW}`,
            }}
          >
            <div
              className="w-6 h-6 rounded-lg flex items-center justify-center"
              style={{ background: RESIDENT_GRADIENT }}
            >
              <Sparkles className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="text-sm font-bold" style={{ color: RESIDENT_PRIMARY }}>
              Matching intelligent
            </span>
          </motion.div>

          {/* Title */}
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
            Trouve ton futur{' '}
            <span
              className="bg-clip-text text-transparent"
              style={{ backgroundImage: RESIDENT_GRADIENT }}
            >
              co-liver
            </span>
          </h2>

          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Un colocataire part bientôt ? Anticipe et trouve le match parfait grâce à notre algorithme de compatibilité
          </p>
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-2 gap-10 items-start mb-12">
          {/* Left: Preview Interactive */}
          <motion.div variants={itemVariants} className="space-y-6">
            {/* Card Preview Container */}
            <motion.div
              whileHover={{ scale: 1.01 }}
              className="relative rounded-3xl p-6 overflow-hidden"
              style={{
                background: CARD_BG_GRADIENT,
                boxShadow: `0 20px 60px ${ACCENT_SHADOW}`,
              }}
            >
              {/* Decorative circle */}
              <div
                className="absolute -right-16 -top-16 w-48 h-48 rounded-full opacity-30"
                style={{ background: RESIDENT_GRADIENT }}
              />
              <div
                className="absolute -left-10 -bottom-10 w-32 h-32 rounded-full opacity-20"
                style={{ background: 'linear-gradient(135deg, #ff8017 0%, #ff5b21 100%)' }}
              />

              {/* Card Stack or Empty State */}
              <div className="relative z-10">
                {isAdminDemo ? (
                  <MockCardStack />
                ) : (
                  /* Empty state for regular users */
                  <div className="relative h-[380px] flex items-center justify-center">
                    <motion.div
                      whileHover={{ scale: 1.02, y: -4 }}
                      className="w-[300px] rounded-3xl shadow-2xl overflow-hidden bg-white p-8 text-center"
                      style={{ boxShadow: `0 16px 48px ${ACCENT_SHADOW}` }}
                    >
                      <motion.div
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6"
                        style={{ background: CARD_BG_GRADIENT }}
                      >
                        <UserPlus className="w-10 h-10" style={{ color: RESIDENT_PRIMARY }} />
                      </motion.div>
                      <h3 className="text-xl font-bold text-gray-900 mb-3">Aucun match pour l'instant</h3>
                      <p className="text-gray-600 text-sm mb-6 leading-relaxed">
                        Signale qu'un coloc part bientôt pour commencer à recevoir des candidatures compatibles.
                      </p>
                      <Button
                        onClick={() => router.push('/hub/departure')}
                        className="rounded-full px-6 py-5 font-semibold text-white border-none shadow-lg hover:shadow-xl transition-all"
                        style={{ background: RESIDENT_GRADIENT }}
                      >
                        <UserPlus className="w-4 h-4 mr-2" />
                        Signaler un départ
                      </Button>
                    </motion.div>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Stats Pills */}
            <motion.div
              variants={itemVariants}
              className="flex flex-wrap gap-4 justify-center lg:justify-start"
            >
              {/* Candidates Stat */}
              <motion.div
                whileHover={{ scale: 1.05, y: -2 }}
                className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-white cursor-default"
                style={{ boxShadow: `0 8px 24px ${ACCENT_SHADOW}` }}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background: RESIDENT_GRADIENT }}
                >
                  <Users className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium">Candidats actifs</p>
                  <p className="text-xl font-black text-gray-900">{isAdminDemo ? `${candidateCount}+` : '0'}</p>
                </div>
              </motion.div>

              {/* Matches Stat */}
              <motion.div
                whileHover={{ scale: 1.05, y: -2 }}
                className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-white cursor-default"
                style={{ boxShadow: `0 8px 24px rgba(239, 68, 68, 0.15)` }}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background: 'linear-gradient(135deg, #ef4444 0%, #f97316 100%)' }}
                >
                  <Heart className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium">Matchs actifs</p>
                  <p className="text-xl font-black text-gray-900">{isAdminDemo ? matchCount : 0}</p>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Right: Quick Actions */}
          <motion.div variants={itemVariants}>
            <QuickActionsCard
              matchCount={matchCount}
              hasInvitations={hasInvitations}
              invitationCount={invitationCount}
              isAdminDemo={isAdminDemo}
            />
          </motion.div>
        </div>

        {/* Features Grid */}
        <motion.div
          variants={containerVariants}
          className="grid md:grid-cols-3 gap-6"
        >
          {[
            {
              icon: Zap,
              title: 'Matching intelligent',
              description: 'Algorithme qui analyse 50+ critères pour trouver le match parfait',
              gradient: 'linear-gradient(135deg, #f59e0b 0%, #f97316 100%)',
              bgColor: 'rgba(245, 158, 11, 0.1)',
            },
            {
              icon: MessageCircle,
              title: 'Chat intégré',
              description: 'Discute directement avec tes matchs avant de les rencontrer',
              gradient: 'linear-gradient(135deg, #3b82f6 0%, #6366f1 100%)',
              bgColor: 'rgba(59, 130, 246, 0.1)',
            },
            {
              icon: Shield,
              title: 'Profils vérifiés',
              description: 'Tous les candidats sont vérifiés pour ta sécurité',
              gradient: 'linear-gradient(135deg, #10b981 0%, #14b8a6 100%)',
              bgColor: 'rgba(16, 185, 129, 0.1)',
            },
          ].map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ scale: 1.03, y: -6 }}
                className="relative overflow-hidden rounded-2xl bg-white p-6 cursor-default"
                style={{
                  boxShadow: `0 12px 32px rgba(0, 0, 0, 0.08)`,
                }}
              >
                {/* Decorative circle */}
                <div
                  className="absolute -right-6 -top-6 w-24 h-24 rounded-full opacity-20"
                  style={{ background: feature.gradient }}
                />

                <div className="relative z-10 flex items-start gap-4">
                  <motion.div
                    whileHover={{ rotate: 5 }}
                    className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: feature.bgColor }}
                  >
                    <Icon className="w-6 h-6" style={{ color: feature.gradient.includes('#f59e0b') ? '#f59e0b' : feature.gradient.includes('#3b82f6') ? '#3b82f6' : '#10b981' }} />
                  </motion.div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1 text-base">{feature.title}</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">{feature.description}</p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </motion.div>
    </section>
  );
}
