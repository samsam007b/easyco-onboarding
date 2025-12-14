'use client';

import { motion } from 'framer-motion';
import { Sparkles, Users, Heart, ArrowRight, MessageCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import MockCardStack from './MockCardStack';
import QuickActionsCard from './QuickActionsCard';

// Couleurs Resident V1
const RESIDENT_GRADIENT = 'linear-gradient(135deg, #d9574f 0%, #ff5b21 50%, #ff8017 100%)';
const RESIDENT_PRIMARY = '#ee5736';

interface MatchingPreviewSectionProps {
  matchCount?: number;
  candidateCount?: number;
  hasInvitations?: boolean;
  invitationCount?: number;
}

export default function MatchingPreviewSection({
  matchCount = 23,
  candidateCount = 147,
  hasInvitations = true,
  invitationCount = 3,
}: MatchingPreviewSectionProps) {
  const router = useRouter();

  return (
    <section className="py-20 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6" style={{ background: 'linear-gradient(135deg, rgba(217, 87, 79, 0.1) 0%, rgba(255, 128, 23, 0.1) 100%)', border: '1px solid rgba(238, 87, 54, 0.2)' }}>
            <Sparkles className="w-4 h-4" style={{ color: RESIDENT_PRIMARY }} />
            <span className="text-sm font-semibold" style={{ color: RESIDENT_PRIMARY }}>
              Matching intelligent
            </span>
          </div>

          {/* Titre */}
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Trouve ton futur{' '}
            <span
              className="bg-clip-text text-transparent"
              style={{ backgroundImage: RESIDENT_GRADIENT }}
            >
              co-liver
            </span>
          </h2>

          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Un colocataire part bientôt ? Anticipe et trouve le match parfait grâce à notre algorithme de compatibilité
          </p>
        </motion.div>

        {/* Grid Layout */}
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          {/* Left: Preview Interactive */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            {/* Mock Card Stack */}
            <MockCardStack />

            {/* Stats Pills */}
            <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
              <div className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-white shadow-md border border-gray-100">
                <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: RESIDENT_GRADIENT }}>
                  <Users className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium">Candidats</p>
                  <p className="text-lg font-bold text-gray-900">{candidateCount}+</p>
                </div>
              </div>

              <div className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-white shadow-md border border-gray-100">
                <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #ff5b21 0%, #ff8017 100%)' }}>
                  <Heart className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium">Matchs actifs</p>
                  <p className="text-lg font-bold text-gray-900">{matchCount}</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right: Quick Actions */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <QuickActionsCard
              matchCount={matchCount}
              hasInvitations={hasInvitations}
              invitationCount={invitationCount}
            />
          </motion.div>
        </div>

        {/* Features List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-12 grid md:grid-cols-3 gap-6"
        >
          {[
            {
              icon: Sparkles,
              title: 'Matching basé sur compatibilité',
              description: 'Algorithme qui analyse 50+ critères pour trouver le match parfait',
            },
            {
              icon: MessageCircle,
              title: 'Chat intégré',
              description: 'Discute directement avec tes matchs avant de les rencontrer',
            },
            {
              icon: Users,
              title: 'Invitation à visiter',
              description: 'Invite tes meilleurs matchs à visiter ta coloc',
            },
          ].map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="flex items-start gap-4 p-6 rounded-2xl bg-white/60 backdrop-blur-sm border border-gray-100 hover:shadow-lg transition-all"
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: 'linear-gradient(135deg, rgba(217, 87, 79, 0.1) 0%, rgba(255, 128, 23, 0.1) 100%)' }}
                >
                  <Icon className="w-6 h-6" style={{ color: RESIDENT_PRIMARY }} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">{feature.title}</h3>
                  <p className="text-sm text-gray-600">{feature.description}</p>
                </div>
              </div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
