'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/auth/supabase-client';
import { Clock, CreditCard, Gift, TrendingUp, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/lib/i18n/use-language';

interface SubscriptionStatus {
  subscription_id: string;
  user_type: 'owner' | 'resident';
  plan: string;
  status: 'trial' | 'active' | 'past_due' | 'canceled' | 'expired';
  is_trial: boolean;
  trial_days_remaining: number;
  trial_progress_percent: number;
  days_until_billing: number | null;
  trial_end_date: string;
  next_billing_date: string | null;
  cancel_at_period_end: boolean;
}

interface SubscriptionBannerProps {
  userId: string;
  compact?: boolean; // For smaller displays
}

export default function SubscriptionBanner({ userId, compact = false }: SubscriptionBannerProps) {
  const supabase = createClient();
  const { language, getSection } = useLanguage();
  const ariaLabels = getSection('ariaLabels');
  const [status, setStatus] = useState<SubscriptionStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    loadSubscriptionStatus();
  }, [userId]);

  const loadSubscriptionStatus = async () => {
    try {
      const { data, error } = await supabase.rpc('get_subscription_status', {
        p_user_id: userId,
      });

      if (error) {
        console.error('Error loading subscription status:', error);
        return;
      }

      if (data && data.length > 0) {
        setStatus(data[0]);
      }
    } catch (error) {
      console.error('Error in loadSubscriptionStatus:', error);
    } finally {
      setLoading(false);
    }
  };

  // Don't show banner if dismissed or no subscription data
  if (loading || !status || dismissed) {
    return null;
  }

  // Only show for trial status
  if (status.status !== 'trial') {
    return null;
  }

  const isEndingSoon = status.trial_days_remaining <= 7;
  const isCritical = status.trial_days_remaining <= 3;

  // Calculate pricing based on user type (tarif de lancement)
  const monthlyPrice = status.user_type === 'owner' ? 15.99 : 7.99;
  const trialDaysTotal = status.user_type === 'owner' ? 90 : 180;

  // Color scheme based on urgency
  const getColorScheme = () => {
    if (isCritical) {
      return {
        bg: 'from-red-50 to-red-100',
        border: 'border-red-200',
        text: 'text-red-800',
        accent: 'text-red-600',
        progress: 'bg-red-500',
        icon: 'text-red-500',
      };
    }
    if (isEndingSoon) {
      return {
        bg: 'from-amber-50 to-amber-100',
        border: 'border-amber-200',
        text: 'text-amber-900',
        accent: 'text-amber-700',
        progress: 'bg-amber-500',
        icon: 'text-amber-600',
      };
    }
    return {
      bg: status.user_type === 'owner' ? 'from-owner-50 to-owner-100' : 'from-resident-50 to-resident-100',
      border: status.user_type === 'owner' ? 'border-owner-200' : 'border-resident-200',
      text: 'text-gray-800',
      accent: status.user_type === 'owner' ? 'text-owner-700' : 'text-resident-700',
      progress: status.user_type === 'owner' ? 'bg-owner-500' : 'bg-resident-500',
      icon: status.user_type === 'owner' ? 'text-owner-600' : 'text-resident-600',
    };
  };

  const colors = getColorScheme();

  // Format trial end date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  // Compact version for mobile/sidebar
  if (compact) {
    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className={`relative superellipse-lg border-2 ${colors.border} bg-gradient-to-r ${colors.bg} p-4 shadow-sm mb-4`}
        >
          <button
            onClick={() => setDismissed(true)}
            className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 transition"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-3 mb-3">
            <Gift className={`w-6 h-6 ${colors.icon}`} />
            <div>
              <p className={`text-sm font-semibold ${colors.text}`}>
                {status.trial_days_remaining} jours restants
              </p>
              <p className="text-xs text-gray-600">
                Essai gratuit jusqu'au {formatDate(status.trial_end_date)}
              </p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
            <motion.div
              className={`h-full ${colors.progress}`}
              initial={{ width: 0 }}
              animate={{ width: `${status.trial_progress_percent}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
            />
          </div>
        </motion.div>
      </AnimatePresence>
    );
  }

  // Full version for desktop/main dashboard
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
        className={`relative superellipse-2xl border-2 ${colors.border} bg-gradient-to-r ${colors.bg} p-6 shadow-lg mb-6`}
      >
        <button
          onClick={() => setDismissed(true)}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
          aria-label={ariaLabels?.hide?.[language] || 'Masquer'}
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Left: Trial Status */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className={`p-3 rounded-full ${colors.bg} border ${colors.border}`}>
                <Gift className={`w-6 h-6 ${colors.icon}`} />
              </div>
              <div>
                <h3 className={`text-xl font-bold ${colors.text}`}>
                  {status.user_type === 'owner' ? 'Essai Gratuit Owner' : 'Essai Gratuit Resident'}
                </h3>
                <p className="text-sm text-gray-600">
                  {status.user_type === 'owner' ? '3 mois offerts' : '6 mois offerts'} · Se termine le{' '}
                  <span className="font-semibold">{formatDate(status.trial_end_date)}</span>
                </p>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Progression de l'essai</span>
                <span className={`font-semibold ${colors.accent}`}>
                  {status.trial_progress_percent}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <motion.div
                  className={`h-full ${colors.progress} shadow-sm`}
                  initial={{ width: 0 }}
                  animate={{ width: `${status.trial_progress_percent}%` }}
                  transition={{ duration: 1.5, ease: 'easeOut' }}
                />
              </div>
              <p className="text-xs text-gray-500">
                {trialDaysTotal - status.trial_days_remaining} jours utilisés sur {trialDaysTotal}
              </p>
            </div>

            {/* Countdown */}
            <div className="mt-4 flex items-center gap-2">
              <Clock className={`w-5 h-5 ${colors.icon}`} />
              <p className={`text-lg font-semibold ${colors.accent}`}>
                {status.trial_days_remaining === 0
                  ? 'Dernier jour !'
                  : status.trial_days_remaining === 1
                  ? '1 jour restant'
                  : `${status.trial_days_remaining} jours restants`}
              </p>
            </div>

            {/* Warning message if ending soon */}
            {isEndingSoon && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`mt-4 p-3 superellipse-lg ${
                  isCritical ? 'bg-red-100 border border-red-200' : 'bg-amber-100 border border-amber-200'
                }`}
              >
                <p className={`text-sm font-medium ${isCritical ? 'text-red-800' : 'text-amber-800'}`}>
                  {isCritical ? '⚠️ Votre essai se termine très bientôt !' : '⏰ Votre essai se termine bientôt'}
                </p>
                <p className={`text-xs mt-1 ${isCritical ? 'text-red-700' : 'text-amber-700'}`}>
                  Ajoutez un moyen de paiement pour continuer à profiter de toutes les fonctionnalités.
                </p>
              </motion.div>
            )}
          </div>

          {/* Right: Pricing & CTA */}
          <div className="flex flex-col justify-between">
            <div>
              <div className="bg-white superellipse-xl p-4 border border-gray-200 shadow-sm mb-4">
                <div className="flex items-baseline gap-1 mb-1">
                  <span className="text-3xl font-bold text-gray-900">{monthlyPrice}€</span>
                  <span className="text-gray-600">/mois</span>
                </div>
                <p className="text-xs text-gray-500">Après la fin de l'essai gratuit</p>
              </div>

              <div className="space-y-2 text-sm text-gray-700">
                <div className="flex items-start gap-2">
                  <TrendingUp className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Accès complet à toutes les fonctionnalités</span>
                </div>
                <div className="flex items-start gap-2">
                  <CreditCard className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <span>Annulation possible à tout moment</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => (window.location.href = '/dashboard/subscription')}
              className={`mt-4 w-full py-3 px-4 superellipse-lg font-semibold text-white shadow-md hover:shadow-lg transition-all ${
                status.user_type === 'owner'
                  ? 'bg-owner-600 hover:bg-owner-700'
                  : 'bg-resident-600 hover:bg-resident-700'
              }`}
            >
              Gérer mon abonnement
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
