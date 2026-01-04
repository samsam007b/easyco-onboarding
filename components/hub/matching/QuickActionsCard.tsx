'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Heart, Mail, Check, Sparkles, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useRouter } from 'next/navigation';

// V3 Option C - Official Resident Palette
const RESIDENT_GRADIENT = 'linear-gradient(135deg, #e05747 0%, #ff651e 50%, #ff9014 100%)';
const RESIDENT_PRIMARY = '#ff651e';
const CARD_BG_GRADIENT = 'linear-gradient(135deg, #FFF5F0 0%, #FFEDE5 100%)';
const ACCENT_SHADOW = 'rgba(255, 101, 30, 0.2)';

interface QuickActionsCardProps {
  matchCount?: number;
  hasInvitations?: boolean;
  invitationCount?: number;
  isAdminDemo?: boolean;
}

export default function QuickActionsCard({
  matchCount = 23,
  hasInvitations = true,
  invitationCount = 3,
  isAdminDemo = false,
}: QuickActionsCardProps) {
  // Only show mock values for admin demo accounts
  const displayMatchCount = isAdminDemo ? matchCount : 0;
  const displayHasInvitations = isAdminDemo ? hasInvitations : false;
  const displayInvitationCount = isAdminDemo ? invitationCount : 0;
  const router = useRouter();

  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      className="relative superellipse-3xl overflow-hidden bg-white p-8 space-y-6"
      style={{
        boxShadow: `0 20px 60px ${ACCENT_SHADOW}`,
      }}
    >
      {/* Decorative circles */}
      <div
        className="absolute -right-12 -top-12 w-40 h-40 rounded-full opacity-20"
        style={{ background: RESIDENT_GRADIENT }}
      />
      <div
        className="absolute -left-8 -bottom-8 w-24 h-24 rounded-full opacity-15"
        style={{ background: 'linear-gradient(135deg, #ff9014 0%, #ff651e 100%)' }}
      />

      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <div className="text-center mb-6">
          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-16 h-16 superellipse-2xl flex items-center justify-center mx-auto mb-4"
            style={{ background: CARD_BG_GRADIENT }}
          >
            <Zap className="w-8 h-8" style={{ color: RESIDENT_PRIMARY }} />
          </motion.div>
          <h3 className="text-2xl font-black text-gray-900 mb-2">
            Prêt à matcher ?
          </h3>
          <p className="text-gray-600 text-sm leading-relaxed">
            Commence à swiper pour trouver des candidats compatibles avec ta coloc
          </p>
        </div>

        {/* Main CTA */}
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button
            onClick={() => router.push('/hub/matching')}
            className="w-full superellipse-2xl text-white font-bold py-6 text-base border-none"
            style={{
              background: RESIDENT_GRADIENT,
              boxShadow: `0 12px 32px ${ACCENT_SHADOW}`,
            }}
          >
            <ArrowRight className="w-5 h-5 mr-2" />
            Commencer à swiper
          </Button>
        </motion.div>

        {/* Secondary Actions */}
        <div className="space-y-3 mt-4">
          {/* Voir mes matchs */}
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              onClick={() => router.push('/hub/matching')}
              variant="outline"
              className="w-full superellipse-2xl border-2 py-5 font-semibold transition-all"
              style={{
                borderColor: `${RESIDENT_PRIMARY}30`,
                color: RESIDENT_PRIMARY,
                background: 'transparent',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = CARD_BG_GRADIENT;
                e.currentTarget.style.borderColor = RESIDENT_PRIMARY;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.borderColor = `${RESIDENT_PRIMARY}30`;
              }}
            >
              <Heart className="w-4 h-4 mr-2" />
              Mes matchs ({displayMatchCount})
            </Button>
          </motion.div>

          {/* Invitations badge - only show for admin demo or when real invitations exist */}
          {displayHasInvitations && displayInvitationCount > 0 && (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="relative"
            >
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  onClick={() => router.push('/hub/matching')}
                  variant="outline"
                  className="w-full superellipse-2xl border-2 py-5 font-semibold"
                  style={{
                    borderColor: '#f97316',
                    background: 'rgba(249, 115, 22, 0.08)',
                    color: '#f97316',
                  }}
                >
                  <Mail className="w-4 h-4 mr-2" />
                  {displayInvitationCount} nouvelle{displayInvitationCount > 1 ? 's' : ''} invitation{displayInvitationCount > 1 ? 's' : ''}
                </Button>
              </motion.div>
              {/* Notification badge */}
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="absolute -top-2 -right-2 w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold"
                style={{
                  background: RESIDENT_GRADIENT,
                  boxShadow: `0 4px 12px ${ACCENT_SHADOW}`,
                }}
              >
                {displayInvitationCount}
              </motion.div>
            </motion.div>
          )}
        </div>

        {/* Divider */}
        <div className="border-t border-gray-100 my-6" />

        {/* Feature List */}
        <div className="space-y-3">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5" style={{ color: RESIDENT_PRIMARY }} />
            Fonctionnalités incluses
          </p>
          {[
            { label: 'Matching basé sur compatibilité', color: '#e05747' },
            { label: 'Chat intégré après match', color: '#f8572b' },
            { label: 'Invitation à visiter la coloc', color: '#ff651e' },
            { label: 'Profils vérifiés', color: '#ff7b19' },
          ].map((feature, index) => (
            <motion.div
              key={index}
              whileHover={{ x: 4 }}
              className="flex items-center gap-3"
            >
              <div
                className="w-6 h-6 superellipse-lg flex items-center justify-center flex-shrink-0"
                style={{ background: `${feature.color}15` }}
              >
                <Check className="w-3.5 h-3.5" style={{ color: feature.color }} />
              </div>
              <span className="text-sm text-gray-700 font-medium">{feature.label}</span>
            </motion.div>
          ))}
        </div>

        {/* Bottom Note */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="mt-6 p-4 superellipse-2xl text-center"
          style={{ background: CARD_BG_GRADIENT }}
        >
          <p className="text-xs font-semibold" style={{ color: RESIDENT_PRIMARY }}>
            🎯 Algorithme qui analyse 50+ critères de compatibilité
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
}
