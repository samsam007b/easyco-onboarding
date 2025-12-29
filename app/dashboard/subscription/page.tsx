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
  Sparkles,
  Users,
  MessageSquare,
  BarChart3,
  FileText,
  Bell,
  Home,
  Smartphone,
  Lock,
  HeadphonesIcon,
  ArrowRight,
  CheckCircle2,
  Crown,
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

type UserRole = 'owner' | 'resident' | 'searcher' | null;

export default function SubscriptionPage() {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<SubscriptionStatus | null>(null);
  const [user, setUser] = useState<any>(null);
  const [userRole, setUserRole] = useState<UserRole>(null);
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

      // Get user profile to determine role
      const { data: profileData } = await supabase
        .from('profiles')
        .select('user_type')
        .eq('id', authUser.id)
        .single();

      if (profileData?.user_type) {
        setUserRole(profileData.user_type as UserRole);
      }

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

  // Features data for non-subscribers - role-specific
  const ownerFeatures = [
    {
      icon: Home,
      title: 'Multi-propriétés',
      description: 'Gérez toutes vos colocations depuis un seul tableau de bord',
      bgColor: 'bg-purple-100',
      iconColor: 'text-purple-600',
    },
    {
      icon: Users,
      title: 'Matching colocataires',
      description: 'Trouvez les candidats idéaux grâce à notre algorithme de compatibilité',
      bgColor: 'bg-orange-100',
      iconColor: 'text-orange-600',
    },
    {
      icon: FileText,
      title: 'Gestion des candidatures',
      description: 'Recevez et gérez les demandes de location facilement',
      bgColor: 'bg-blue-100',
      iconColor: 'text-blue-600',
    },
    {
      icon: BarChart3,
      title: 'Tableau de bord analytique',
      description: 'Visualisez les performances de vos annonces',
      bgColor: 'bg-emerald-100',
      iconColor: 'text-emerald-600',
    },
    {
      icon: MessageSquare,
      title: 'Messagerie intégrée',
      description: 'Communiquez directement avec vos locataires potentiels',
      bgColor: 'bg-pink-100',
      iconColor: 'text-pink-600',
    },
    {
      icon: Bell,
      title: 'Alertes en temps réel',
      description: 'Soyez notifié des nouvelles candidatures instantanément',
      bgColor: 'bg-violet-100',
      iconColor: 'text-violet-600',
    },
  ];

  const searcherFeatures = [
    {
      icon: Home,
      title: 'Colocations vérifiées',
      description: 'Accédez à des annonces de qualité avec propriétaires vérifiés',
      bgColor: 'bg-orange-100',
      iconColor: 'text-orange-600',
    },
    {
      icon: Users,
      title: 'Matching intelligent',
      description: 'Trouvez des colocations compatibles avec votre personnalité',
      bgColor: 'bg-purple-100',
      iconColor: 'text-purple-600',
    },
    {
      icon: MessageSquare,
      title: 'Contact direct',
      description: 'Échangez directement avec les propriétaires et colocataires',
      bgColor: 'bg-blue-100',
      iconColor: 'text-blue-600',
    },
    {
      icon: Bell,
      title: 'Alertes personnalisées',
      description: 'Recevez les nouvelles annonces correspondant à vos critères',
      bgColor: 'bg-emerald-100',
      iconColor: 'text-emerald-600',
    },
    {
      icon: Shield,
      title: 'Profil vérifié',
      description: 'Augmentez vos chances avec un badge de confiance',
      bgColor: 'bg-pink-100',
      iconColor: 'text-pink-600',
    },
    {
      icon: BarChart3,
      title: 'Score de compatibilité',
      description: 'Visualisez votre affinité avec chaque colocation',
      bgColor: 'bg-violet-100',
      iconColor: 'text-violet-600',
    },
  ];

  // Select features based on user role
  const premiumFeatures = userRole === 'owner' ? ownerFeatures : searcherFeatures;

  const trustBadges = [
    { icon: Shield, text: 'Paiements sécurisés', subtext: 'via Stripe' },
    { icon: Lock, text: 'Données protégées', subtext: 'RGPD compliant' },
    { icon: HeadphonesIcon, text: 'Support 7j/7', subtext: 'Réponse < 24h' },
  ];

  if (!status) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-orange-50">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-sm border-b border-gray-100 sticky top-0 z-10">
          <div className="max-w-6xl mx-auto px-4 py-4">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition group"
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              <span>Retour</span>
            </button>
          </div>
        </div>

        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-6xl mx-auto px-4 pt-12 pb-8 text-center"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-100 to-orange-100 rounded-full mb-6">
            <Sparkles className="w-4 h-4 text-purple-600" />
            <span className="text-sm font-medium text-purple-700">Essai gratuit disponible</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Débloquez tout le potentiel de{' '}
            <span className="bg-gradient-to-r from-purple-600 via-orange-500 to-amber-500 bg-clip-text text-transparent">
              IzzIco
            </span>
          </h1>

          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            La plateforme complète pour gérer vos colocations, trouver des colocataires compatibles
            et simplifier votre quotidien.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <motion.button
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => router.push('/profile')}
              className="px-8 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-semibold shadow-lg shadow-purple-500/25 hover:shadow-xl hover:shadow-purple-500/30 transition-all flex items-center justify-center gap-2"
            >
              <Gift className="w-5 h-5" />
              Commencer l'essai gratuit
              <ArrowRight className="w-5 h-5" />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                const pricingSection = document.getElementById('pricing-section');
                pricingSection?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-8 py-4 bg-white text-gray-700 rounded-xl font-semibold border-2 border-gray-200 hover:border-purple-300 hover:bg-purple-50 transition-all"
            >
              Voir les tarifs
            </motion.button>
          </div>

          {/* Trust Badges */}
          <div className="flex flex-wrap justify-center gap-6">
            {trustBadges.map((badge, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.1 }}
                className="flex items-center gap-3 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-lg border border-gray-100"
              >
                <badge.icon className="w-5 h-5 text-green-600" />
                <div className="text-left">
                  <p className="text-sm font-semibold text-gray-900">{badge.text}</p>
                  <p className="text-xs text-gray-500">{badge.subtext}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Features Grid */}
        <div className="max-w-6xl mx-auto px-4 py-16">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Tout ce dont vous avez besoin
            </h2>
            <p className="text-gray-600 max-w-xl mx-auto">
              Des outils puissants pour simplifier la gestion de votre colocation
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {premiumFeatures.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                whileHover={{ scale: 1.02, y: -4 }}
                className="group bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-purple-200"
              >
                <div className={`w-14 h-14 ${feature.bgColor} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <feature.icon className={`w-7 h-7 ${feature.iconColor}`} />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Pricing Section */}
        <div id="pricing-section" className="max-w-6xl mx-auto px-4 py-16">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {userRole ? 'Votre plan' : 'Choisissez votre plan'}
            </h2>
            <p className="text-gray-600">
              {userRole
                ? `Activez votre essai gratuit ${userRole === 'owner' ? 'Owner' : 'Resident'}`
                : 'Commencez gratuitement, évoluez selon vos besoins'
              }
            </p>
          </motion.div>

          <div className={`grid gap-8 max-w-4xl mx-auto ${userRole ? 'md:grid-cols-1 max-w-lg' : 'md:grid-cols-2'}`}>
            {/* Owner Plan - Show if no role or if owner */}
            {(!userRole || userRole === 'owner') && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className={`bg-white rounded-3xl p-8 shadow-lg relative overflow-hidden ${
                  userRole === 'owner'
                    ? 'border-2 border-purple-400 ring-4 ring-purple-100'
                    : 'border-2 border-purple-200'
                }`}
              >
                {userRole === 'owner' ? (
                  <div className="absolute top-0 right-0 px-4 py-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs font-semibold rounded-bl-xl">
                    VOTRE PLAN
                  </div>
                ) : (
                  <div className="absolute top-0 right-0 px-4 py-1 bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-xs font-semibold rounded-bl-xl">
                    POPULAIRE
                  </div>
                )}

                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-indigo-100 rounded-xl flex items-center justify-center">
                    <Crown className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">Owner</h3>
                    <p className="text-sm text-gray-500">Pour les propriétaires</p>
                  </div>
                </div>

                <div className="mb-6">
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold text-gray-900">15,99€</span>
                    <span className="text-gray-500">/mois</span>
                  </div>
                  <p className="text-sm text-green-600 font-medium mt-1">
                    3 mois d'essai gratuit
                  </p>
                </div>

                <ul className="space-y-3 mb-8">
                  {[
                    'Gestion multi-propriétés',
                    'Matching avancé de colocataires',
                    'Messagerie illimitée',
                    'Tableau de bord analytique',
                    'Documents & contrats',
                    'Support prioritaire',
                  ].map((feature, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => router.push(userRole === 'owner' ? '/profile' : '/onboarding/owner')}
                  className="w-full py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-semibold shadow-lg shadow-purple-500/25 hover:shadow-xl transition-all"
                >
                  {userRole === 'owner' ? 'Activer mon essai gratuit' : 'Essayer gratuitement'}
                </motion.button>
              </motion.div>
            )}

            {/* Resident Plan - Show if no role or if searcher/resident */}
            {(!userRole || userRole === 'searcher' || userRole === 'resident') && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className={`bg-white rounded-3xl p-8 shadow-lg relative overflow-hidden ${
                  userRole
                    ? 'border-2 border-orange-400 ring-4 ring-orange-100'
                    : 'border border-gray-200'
                }`}
              >
                {(userRole === 'searcher' || userRole === 'resident') && (
                  <div className="absolute top-0 right-0 px-4 py-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs font-semibold rounded-bl-xl">
                    VOTRE PLAN
                  </div>
                )}

                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-100 to-amber-100 rounded-xl flex items-center justify-center">
                    <Users className="w-6 h-6 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">Resident</h3>
                    <p className="text-sm text-gray-500">Pour les colocataires</p>
                  </div>
                </div>

                <div className="mb-6">
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold text-gray-900">7,99€</span>
                    <span className="text-gray-500">/mois</span>
                  </div>
                  <p className="text-sm text-green-600 font-medium mt-1">
                    6 mois d'essai gratuit
                  </p>
                </div>

                <ul className="space-y-3 mb-8">
                  {[
                    'Profil vérifié & visible',
                    'Matching de colocations',
                    'Messagerie illimitée',
                    'Alertes personnalisées',
                    'Communauté de résidents',
                    'Support dédié',
                  ].map((feature, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-orange-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => router.push(userRole ? '/profile' : '/onboarding/searcher')}
                  className="w-full py-4 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl font-semibold shadow-lg shadow-orange-500/25 hover:shadow-xl transition-all"
                >
                  {userRole ? 'Activer mon essai gratuit' : 'Essayer gratuitement'}
                </motion.button>
              </motion.div>
            )}
          </div>

          {/* Annual savings note */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-8 text-center"
          >
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl border border-emerald-200">
              <Zap className="w-5 h-5 text-emerald-600" />
              <span className="text-emerald-700 font-medium">
                Économisez jusqu'à 17% avec l'abonnement annuel
              </span>
            </div>
          </motion.div>
        </div>


        {/* Final CTA */}
        <div className="max-w-6xl mx-auto px-4 py-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Prêt à commencer ?
            </h2>
            <p className="text-gray-600 mb-8 max-w-xl mx-auto">
              Rejoignez des centaines d'utilisateurs qui simplifient leur vie en colocation avec IzzIco.
            </p>

            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => router.push('/profile')}
              className="px-10 py-5 bg-gradient-to-r from-purple-600 via-pink-500 to-orange-500 text-white rounded-2xl font-bold text-lg shadow-2xl shadow-purple-500/30 hover:shadow-purple-500/40 transition-all"
            >
              <span className="flex items-center gap-3">
                <Sparkles className="w-6 h-6" />
                Démarrer mon essai gratuit
                <ArrowRight className="w-6 h-6" />
              </span>
            </motion.button>

            <p className="text-sm text-gray-500 mt-4">
              Aucune carte bancaire requise • Annulation à tout moment
            </p>
          </motion.div>
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
