'use client';

import { motion } from 'framer-motion';
import { Users, Gift, Clock, TrendingUp, CheckCircle, Hourglass } from 'lucide-react';
import type { ReferralStats } from '@/types/referral.types';

interface ReferralStatsCardProps {
  stats: ReferralStats;
  isLoading?: boolean;
}

export function ReferralStatsCard({ stats, isLoading }: ReferralStatsCardProps) {
  if (isLoading) {
    return (
      <div className="bg-white superellipse-2xl shadow-lg border border-gray-100 p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/3" />
          <div className="grid grid-cols-3 gap-4">
            <div className="h-20 bg-gray-100 superellipse-xl" />
            <div className="h-20 bg-gray-100 superellipse-xl" />
            <div className="h-20 bg-gray-100 superellipse-xl" />
          </div>
        </div>
      </div>
    );
  }

  const statItems = [
    {
      icon: Users,
      label: 'Invitations envoyées',
      value: stats.total_referrals,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      icon: CheckCircle,
      label: 'Invitations réussies',
      value: stats.successful_referrals,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      icon: Hourglass,
      label: 'En attente',
      value: stats.pending_referrals,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="bg-white superellipse-2xl shadow-lg border border-gray-100 overflow-hidden"
    >
      {/* Header */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-owner-100 superellipse-lg">
            <TrendingUp className="w-5 h-5 text-owner-600" />
          </div>
          <h3 className="text-lg font-bold text-gray-900">Vos Statistiques</h3>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="p-6">
        <div className="grid grid-cols-3 gap-4 mb-6">
          {statItems.map((item, index) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 + index * 0.05 }}
              className={`p-4 ${item.bgColor} superellipse-xl text-center`}
            >
              <item.icon className={`w-6 h-6 ${item.color} mx-auto mb-2`} />
              <p className={`text-2xl font-bold ${item.color}`}>{item.value}</p>
              <p className="text-xs text-gray-600">{item.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Credits Display */}
        <div className="p-4 bg-owner-50 superellipse-xl border border-owner-200">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Gift className="w-5 h-5 text-owner-600" />
              <span className="font-medium text-gray-900">Crédits disponibles</span>
            </div>
            <span className="text-2xl font-bold text-owner-600">
              {stats.credits_available} <span className="text-sm font-normal">mois</span>
            </span>
          </div>

          {/* Progress bar */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs text-gray-500">
              <span>Utilisés: {stats.credits_used} mois</span>
              <span>Max: 24 mois</span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-owner-500 transition-all"
                style={{
                  width: `${Math.min((stats.credits_earned / 24) * 100, 100)}%`,
                }}
              />
            </div>
            <p className="text-xs text-gray-500 text-right">
              Total gagné: {stats.credits_earned} mois
            </p>
          </div>
        </div>
      </div>

      {/* Recent Referrals */}
      {stats.recent_referrals && stats.recent_referrals.length > 0 && (
        <div className="border-t border-gray-100 p-6">
          <h4 className="font-medium text-gray-900 mb-4 flex items-center gap-2">
            <Clock className="w-4 h-4 text-gray-500" />
            Invitations récentes
          </h4>
          <div className="space-y-3">
            {stats.recent_referrals.slice(0, 5).map((referral) => (
              <div
                key={referral.id}
                className="flex items-center justify-between p-3 bg-gray-50 superellipse-lg"
              >
                <div>
                  <p className="font-medium text-gray-900">
                    {referral.referred_name || 'Utilisateur'}
                  </p>
                  <p className="text-xs text-gray-500">
                    {referral.referred_user_type === 'owner' ? 'Propriétaire' : 'Résident'}
                    {' • '}
                    {new Date(referral.created_at).toLocaleDateString('fr-FR')}
                  </p>
                </div>
                <div className="text-right">
                  <span
                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      referral.status === 'rewarded'
                        ? 'bg-green-100 text-green-700'
                        : referral.status === 'qualified'
                        ? 'bg-blue-100 text-blue-700'
                        : referral.status === 'pending'
                        ? 'bg-orange-100 text-orange-700'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {referral.status === 'rewarded'
                      ? `+${referral.referrer_reward_months} mois`
                      : referral.status === 'qualified'
                      ? 'Qualifié'
                      : referral.status === 'pending'
                      ? 'En attente'
                      : 'Expiré'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}
