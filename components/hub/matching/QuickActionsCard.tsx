'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Heart, Mail, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useRouter } from 'next/navigation';

const RESIDENT_GRADIENT = 'linear-gradient(135deg, #d9574f 0%, #ff5b21 50%, #ff8017 100%)';
const RESIDENT_PRIMARY = '#ee5736';

interface QuickActionsCardProps {
  matchCount?: number;
  hasInvitations?: boolean;
  invitationCount?: number;
}

export default function QuickActionsCard({
  matchCount = 23,
  hasInvitations = true,
  invitationCount = 3,
}: QuickActionsCardProps) {
  const router = useRouter();

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 space-y-6"
    >
      {/* Header */}
      <div className="text-center">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          Prêt à matcher ?
        </h3>
        <p className="text-gray-600">
          Commence à swiper pour trouver des candidats compatibles
        </p>
      </div>

      {/* Main CTA */}
      <Button
        onClick={() => router.push('/matching/swipe?context=resident_matching')}
        className="w-full rounded-full text-white font-semibold py-6 text-base shadow-lg hover:shadow-xl transition-all border-none"
        style={{ background: RESIDENT_GRADIENT }}
      >
        <ArrowRight className="w-5 h-5 mr-2" />
        Commencer à swiper
      </Button>

      {/* Secondary Actions */}
      <div className="space-y-3">
        {/* Voir mes matchs */}
        <Button
          onClick={() => router.push('/matching/matches')}
          variant="outline"
          className="w-full rounded-full border-gray-200 hover:border-transparent py-5"
          style={{ color: RESIDENT_PRIMARY }}
          onMouseEnter={(e) => e.currentTarget.style.background = 'linear-gradient(135deg, rgba(217, 87, 79, 0.08) 0%, rgba(255, 128, 23, 0.08) 100%)'}
          onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
        >
          <Heart className="w-4 h-4 mr-2" />
          Mes matchs ({matchCount})
        </Button>

        {/* Invitations badge */}
        {hasInvitations && (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="relative"
          >
            <Button
              onClick={() => router.push('/matching/matches?tab=invitations')}
              variant="outline"
              className="w-full rounded-full border-orange-200 bg-orange-50 hover:bg-orange-100 transition-all py-5"
              style={{ color: RESIDENT_PRIMARY }}
            >
              <Mail className="w-4 h-4 mr-2" />
              {invitationCount} nouvelle{invitationCount > 1 ? 's' : ''} invitation{invitationCount > 1 ? 's' : ''}
            </Button>
            {/* Notification badge */}
            <div
              className="absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg"
              style={{ background: RESIDENT_GRADIENT }}
            >
              {invitationCount}
            </div>
          </motion.div>
        )}
      </div>

      {/* Divider */}
      <div className="border-t border-gray-200 my-6" />

      {/* Feature List */}
      <div className="space-y-3">
        <p className="text-sm font-semibold text-gray-700 mb-3">
          Fonctionnalités incluses :
        </p>
        {[
          'Matching basé sur compatibilité',
          'Chat intégré après match',
          'Invitation à visiter la coloc',
          'Profils vérifiés',
        ].map((feature, index) => (
          <div key={index} className="flex items-center gap-3">
            <div
              className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ background: 'linear-gradient(135deg, rgba(217, 87, 79, 0.15) 0%, rgba(255, 128, 23, 0.15) 100%)' }}
            >
              <Check className="w-3 h-3" style={{ color: RESIDENT_PRIMARY }} />
            </div>
            <span className="text-sm text-gray-600">{feature}</span>
          </div>
        ))}
      </div>

      {/* Bottom Note */}
      <div className="pt-4 border-t border-gray-100">
        <p className="text-xs text-center text-gray-500">
          🎯 Algorithme qui analyse 50+ critères de compatibilité
        </p>
      </div>
    </motion.div>
  );
}
