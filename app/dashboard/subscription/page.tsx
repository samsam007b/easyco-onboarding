'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/auth/supabase-client';
import {
  CreditCard,
  Calendar,
  Gift,
  Check,
  AlertCircle,
  ArrowLeft,
  Clock,
  DollarSign,
  Shield,
  Zap,
} from 'lucide-react';
import { motion } from 'framer-motion';
import LoadingHouse from '@/components/ui/LoadingHouse';
import PlanSelectorModal from '@/components/subscriptions/PlanSelectorModal';

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

export default function SubscriptionPage() {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<SubscriptionStatus | null>(null);
  const [user, setUser] = useState<any>(null);
  const [showPlanModal, setShowPlanModal] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // Get current user
      const {
        data: { user: authUser },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !authUser) {
        router.push('/auth');
        return;
      }

      setUser(authUser);

      // Get subscription status
      const { data: subData, error: subError } = await supabase.rpc('get_subscription_status', {
        p_user_id: authUser.id,
      });

      if (subError) {
        console.error('Error loading subscription:', subError);
      } else if (subData && subData.length > 0) {
        setStatus(subData[0]);
      }
    } catch (error) {
      console.error('Error in loadData:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddPaymentMethod = () => {
    setShowPlanModal(true);
  };

  const handleCancelSubscription = async () => {
    if (!status) return;

    const confirmed = confirm(
      'Êtes-vous sûr de vouloir annuler votre abonnement ?\n\nVous conserverez l\'accès jusqu\'à la fin de votre période en cours.'
    );

    if (!confirmed) return;

    try {
      const { error } = await supabase
        .from('subscriptions')
        .update({
          cancel_at_period_end: true,
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', user.id);

      if (error) throw error;

      alert('✅ Votre abonnement sera annulé à la fin de la période en cours.');
      loadData(); // Refresh data
    } catch (error) {
      console.error('Error canceling subscription:', error);
      alert('❌ Erreur lors de l\'annulation. Veuillez réessayer.');
    }
  };

  const handleReactivateSubscription = async () => {
    if (!status) return;

    try {
      const { error } = await supabase
        .from('subscriptions')
        .update({
          cancel_at_period_end: false,
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', user.id);

      if (error) throw error;

      alert('✅ Votre abonnement a été réactivé !');
      loadData(); // Refresh data
    } catch (error) {
      console.error('Error reactivating subscription:', error);
      alert('❌ Erreur lors de la réactivation. Veuillez réessayer.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <LoadingHouse size={80} />
          <p className="text-gray-600 mt-4">Chargement de votre abonnement...</p>
        </div>
      </div>
    );
  }

  if (!status) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-md text-center">
          <AlertCircle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Aucun abonnement trouvé</h2>
          <p className="text-gray-600 mb-6">
            Vous n'avez pas encore d'abonnement actif. Complétez votre profil pour activer votre essai gratuit.
          </p>
          <button
            onClick={() => router.push('/profile')}
            className="px-6 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition"
          >
            Retour au profil
          </button>
        </div>
      </div>
    );
  }

  // Tarif de lancement
  const monthlyPrice = status.user_type === 'owner' ? 15.99 : 7.99;
  const annualPrice = status.user_type === 'owner' ? 159.90 : 79.90;
  const annualSavings = (monthlyPrice * 12 - annualPrice).toFixed(2);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const getStatusBadge = () => {
    switch (status.status) {
      case 'trial':
        return (
          <span className="px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-semibold">
            ✨ Essai Gratuit
          </span>
        );
      case 'active':
        return (
          <span className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">
            ✓ Actif
          </span>
        );
      case 'past_due':
        return (
          <span className="px-4 py-2 bg-red-100 text-red-800 rounded-full text-sm font-semibold">
            ⚠️ Paiement en retard
          </span>
        );
      case 'canceled':
        return (
          <span className="px-4 py-2 bg-gray-100 text-gray-800 rounded-full text-sm font-semibold">
            ✕ Annulé
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-yellow-50 p-4 sm:p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span>Retour</span>
          </button>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">Mon Abonnement</h1>
              <p className="text-gray-600 mt-1">
                Gérez votre abonnement {status.user_type === 'owner' ? 'Owner' : 'Resident'}
              </p>
            </div>
            {getStatusBadge()}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content - Left 2/3 */}
          <div className="lg:col-span-2 space-y-6">
            {/* Current Plan Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-lg p-6 border-2 border-purple-100"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-purple-100 rounded-full">
                  <Gift className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Plan Actuel</h2>
                  <p className="text-sm text-gray-600">
                    {status.user_type === 'owner' ? 'Owner Monthly' : 'Resident Monthly'}
                  </p>
                </div>
              </div>

              {status.is_trial && (
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4 mb-4">
                  <div className="flex items-start gap-3">
                    <Clock className="w-5 h-5 text-green-600 mt-0.5" />
                    <div className="flex-1">
                      <p className="font-semibold text-green-900 mb-1">
                        Essai gratuit de {status.user_type === 'owner' ? '3 mois' : '6 mois'}
                      </p>
                      <p className="text-sm text-green-700 mb-2">
                        {status.trial_days_remaining === 0
                          ? 'Se termine aujourd\'hui'
                          : `${status.trial_days_remaining} jours restants`}{' '}
                        · Fin le {formatDate(status.trial_end_date)}
                      </p>

                      {/* Progress Bar */}
                      <div className="w-full bg-green-200 rounded-full h-2 overflow-hidden">
                        <motion.div
                          className="h-full bg-green-600"
                          initial={{ width: 0 }}
                          animate={{ width: `${status.trial_progress_percent}%` }}
                          transition={{ duration: 1 }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-3">
                <div className="flex items-center justify-between py-3 border-b border-gray-100">
                  <span className="text-gray-600">Prix mensuel</span>
                  <span className="text-2xl font-bold text-gray-900">{monthlyPrice}€/mois</span>
                </div>

                {status.next_billing_date && (
                  <div className="flex items-center justify-between py-3 border-b border-gray-100">
                    <span className="text-gray-600">Prochaine facturation</span>
                    <span className="font-semibold text-gray-900">{formatDate(status.next_billing_date)}</span>
                  </div>
                )}

                {status.cancel_at_period_end && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                    <p className="text-sm text-yellow-800 font-medium">
                      ⚠️ Votre abonnement sera annulé le {formatDate(status.next_billing_date || status.trial_end_date)}
                    </p>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Features Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl shadow-lg p-6"
            >
              <h3 className="text-lg font-bold text-gray-900 mb-4">Fonctionnalités incluses</h3>
              <div className="grid sm:grid-cols-2 gap-3">
                {[
                  'Gestion complète des propriétés',
                  'Messagerie en temps réel',
                  'Tableau de bord analytique',
                  'Support client prioritaire',
                  'Stockage illimité de documents',
                  'Notifications personnalisées',
                  status.user_type === 'owner' ? 'Gestion multi-propriétés' : 'Communauté de résidents',
                  'Accès mobile et desktop',
                ].map((feature, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Payment Method Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl shadow-lg p-6"
            >
              <h3 className="text-lg font-bold text-gray-900 mb-4">Moyen de paiement</h3>

              {status.is_trial ? (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <CreditCard className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div className="flex-1">
                      <p className="font-semibold text-blue-900 mb-1">Aucun paiement requis pour l'instant</p>
                      <p className="text-sm text-blue-700 mb-3">
                        Vous êtes actuellement en période d'essai gratuit. Ajoutez un moyen de paiement avant la fin de
                        votre essai pour continuer sans interruption.
                      </p>
                      <button
                        onClick={handleAddPaymentMethod}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition text-sm"
                      >
                        Ajouter un moyen de paiement
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg">
                  <CreditCard className="w-6 h-6 text-gray-600" />
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">Carte se terminant par ••••</p>
                    <p className="text-sm text-gray-600">Expire le --/--</p>
                  </div>
                  <button className="text-sm text-purple-600 hover:text-purple-700 font-medium">Modifier</button>
                </div>
              )}
            </motion.div>
          </div>

          {/* Sidebar - Right 1/3 */}
          <div className="space-y-6">
            {/* Upgrade to Annual Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-gradient-to-br from-purple-600 to-indigo-600 rounded-2xl shadow-lg p-6 text-white"
            >
              <div className="flex items-center gap-2 mb-3">
                <Zap className="w-6 h-6" />
                <h3 className="text-lg font-bold">Économisez avec l'annuel</h3>
              </div>
              <div className="mb-4">
                <div className="flex items-baseline gap-1 mb-1">
                  <span className="text-4xl font-bold">{annualPrice}€</span>
                  <span className="text-white/80">/an</span>
                </div>
                <p className="text-sm text-white/90">Économisez {annualSavings}€ par an</p>
              </div>
              <button
                onClick={() => setShowPlanModal(true)}
                className="w-full py-3 bg-white text-purple-600 rounded-lg font-semibold hover:bg-gray-100 transition"
              >
                Passer à l'annuel
              </button>
            </motion.div>

            {/* Security Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl shadow-lg p-6"
            >
              <div className="flex items-center gap-2 mb-3">
                <Shield className="w-5 h-5 text-green-600" />
                <h3 className="text-lg font-bold text-gray-900">Sécurisé & Flexible</h3>
              </div>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Paiements sécurisés via Stripe</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Annulation à tout moment</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Pas de frais cachés</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Support client 7j/7</span>
                </li>
              </ul>
            </motion.div>

            {/* Cancel Subscription */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-2xl shadow-lg p-6"
            >
              <h3 className="text-lg font-bold text-gray-900 mb-3">Gestion de l'abonnement</h3>

              {status.cancel_at_period_end ? (
                <button
                  onClick={handleReactivateSubscription}
                  className="w-full py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition"
                >
                  Réactiver l'abonnement
                </button>
              ) : (
                <button
                  onClick={handleCancelSubscription}
                  className="w-full py-3 bg-red-50 text-red-600 rounded-lg font-semibold hover:bg-red-100 transition border border-red-200"
                >
                  Annuler l'abonnement
                </button>
              )}

              <p className="text-xs text-gray-500 mt-2 text-center">
                Vous conserverez l'accès jusqu'à la fin de votre période en cours
              </p>
            </motion.div>
          </div>
        </div>

        {/* Plan Selector Modal */}
        {status && (
          <PlanSelectorModal
            isOpen={showPlanModal}
            onClose={() => setShowPlanModal(false)}
            userType={status.user_type}
          />
        )}
      </div>
    </div>
  );
}
