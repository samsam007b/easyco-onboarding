'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { loadStripe } from '@stripe/stripe-js';
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout,
} from '@stripe/react-stripe-js';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Shield,
  Lock,
  CreditCard,
  Check,
  AlertCircle,
  Sparkles,
  Crown,
  Users,
} from 'lucide-react';
import LoadingHouse from '@/components/ui/LoadingHouse';

// Load Stripe outside of component to avoid recreating on each render
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

type PlanType = 'owner_monthly' | 'owner_annual' | 'resident_monthly' | 'resident_annual';

interface PlanDetails {
  name: string;
  price: string;
  interval: string;
  savings?: string;
  trialDays: string;
  features: string[];
  isAnnual: boolean;
  userType: 'owner' | 'resident';
}

const planDetails: Record<PlanType, PlanDetails> = {
  owner_monthly: {
    name: 'IzzIco Owner',
    price: '15,99',
    interval: 'mois',
    trialDays: '3 mois',
    features: [
      'Gestion multi-propriétés',
      'Matching avancé colocataires',
      'Messagerie illimitée',
      'Tableau de bord analytique',
      'Documents & contrats',
      'Support prioritaire',
    ],
    isAnnual: false,
    userType: 'owner',
  },
  owner_annual: {
    name: 'IzzIco Owner',
    price: '159,90',
    interval: 'an',
    savings: '31,98',
    trialDays: '3 mois',
    features: [
      'Gestion multi-propriétés',
      'Matching avancé colocataires',
      'Messagerie illimitée',
      'Tableau de bord analytique',
      'Documents & contrats',
      'Support prioritaire',
    ],
    isAnnual: true,
    userType: 'owner',
  },
  resident_monthly: {
    name: 'IzzIco Resident',
    price: '7,99',
    interval: 'mois',
    trialDays: '6 mois',
    features: [
      'Profil vérifié & visible',
      'Matching de colocations',
      'Messagerie illimitée',
      'Alertes personnalisées',
      'Communauté de résidents',
      'Support dédié',
    ],
    isAnnual: false,
    userType: 'resident',
  },
  resident_annual: {
    name: 'IzzIco Resident',
    price: '79,90',
    interval: 'an',
    savings: '15,98',
    trialDays: '6 mois',
    features: [
      'Profil vérifié & visible',
      'Matching de colocations',
      'Messagerie illimitée',
      'Alertes personnalisées',
      'Communauté de résidents',
      'Support dédié',
    ],
    isAnnual: true,
    userType: 'resident',
  },
};

export default function CheckoutPage() {
  const router = useRouter();
  const params = useParams();
  const plan = params.plan as string;

  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Validate plan
  const isValidPlan = (p: string): p is PlanType => {
    return ['owner_monthly', 'owner_annual', 'resident_monthly', 'resident_annual'].includes(p);
  };

  const currentPlan = isValidPlan(plan) ? planDetails[plan] : null;
  const isOwner = currentPlan?.userType === 'owner';

  // Colors based on user type
  const colors = {
    owner: {
      primary: '#9c5698',
      gradient: 'from-purple-600 to-indigo-600',
      gradientLight: 'from-purple-100 to-indigo-100',
      bg: 'bg-purple-50',
      text: 'text-purple-600',
      border: 'border-purple-200',
      ring: 'ring-purple-100',
    },
    resident: {
      primary: '#ee5736',
      gradient: 'from-orange-500 to-amber-500',
      gradientLight: 'from-orange-100 to-amber-100',
      bg: 'bg-orange-50',
      text: 'text-orange-600',
      border: 'border-orange-200',
      ring: 'ring-orange-100',
    },
  };

  const themeColors = currentPlan ? colors[currentPlan.userType] : colors.resident;

  // Fetch client secret for embedded checkout
  const fetchClientSecret = useCallback(async () => {
    if (!isValidPlan(plan)) {
      setError('Plan invalide');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/stripe/create-embedded-checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ plan }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors de la création du checkout');
      }

      setClientSecret(data.clientSecret);
    } catch (err: any) {
      console.error('Checkout error:', err);
      setError(err.message || 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  }, [plan]);

  useEffect(() => {
    fetchClientSecret();
  }, [fetchClientSecret]);

  // Handle invalid plan
  if (!currentPlan) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-orange-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-2xl shadow-xl p-8 max-w-md text-center"
        >
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Plan invalide</h1>
          <p className="text-gray-600 mb-6">
            Le plan sélectionné n'existe pas. Veuillez choisir un plan valide.
          </p>
          <button
            onClick={() => router.push('/dashboard/subscription')}
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-semibold hover:shadow-lg transition"
          >
            Voir les plans disponibles
          </button>
        </motion.div>
      </div>
    );
  }

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <LoadingHouse size={80} />
          <p className="text-gray-600 mt-4">Préparation du paiement sécurisé...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-orange-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-2xl shadow-xl p-8 max-w-md text-center"
        >
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Erreur</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="space-y-3">
            <button
              onClick={() => {
                setError(null);
                setLoading(true);
                fetchClientSecret();
              }}
              className={`w-full px-6 py-3 bg-gradient-to-r ${themeColors.gradient} text-white rounded-xl font-semibold hover:shadow-lg transition`}
            >
              Réessayer
            </button>
            <button
              onClick={() => router.back()}
              className="w-full px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition"
            >
              Retour
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-orange-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span>Retour</span>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-5 gap-8">
          {/* Left Side - Order Summary */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2 space-y-6"
          >
            {/* Plan Card */}
            <div className={`bg-white rounded-2xl shadow-lg p-6 border-2 ${themeColors.border}`}>
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br ${themeColors.gradientLight}`}>
                  {isOwner ? (
                    <Crown className={`w-6 h-6 ${themeColors.text}`} />
                  ) : (
                    <Users className={`w-6 h-6 ${themeColors.text}`} />
                  )}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{currentPlan.name}</h2>
                  <p className="text-sm text-gray-500">
                    {currentPlan.isAnnual ? 'Abonnement annuel' : 'Abonnement mensuel'}
                  </p>
                </div>
              </div>

              {/* Price */}
              <div className="mb-6 pb-6 border-b border-gray-100">
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-gray-900">{currentPlan.price}€</span>
                  <span className="text-gray-500">/{currentPlan.interval}</span>
                </div>
                {currentPlan.savings && (
                  <p className={`text-sm font-medium mt-1 ${themeColors.text}`}>
                    Économisez {currentPlan.savings}€/an
                  </p>
                )}
                <div className="flex items-center gap-2 mt-2">
                  <Sparkles className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-green-700 font-medium">
                    {currentPlan.trialDays} d'essai gratuit inclus
                  </span>
                </div>
              </div>

              {/* Features */}
              <div className="space-y-3">
                <h3 className="font-semibold text-gray-900">Inclus dans votre abonnement :</h3>
                {currentPlan.features.map((feature, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <Check className={`w-5 h-5 mt-0.5 flex-shrink-0 ${themeColors.text}`} />
                    <span className="text-gray-700 text-sm">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Trust Badges */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl shadow-lg p-6"
            >
              <h3 className="font-semibold text-gray-900 mb-4">Paiement sécurisé</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Shield className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Sécurisé par Stripe</p>
                    <p className="text-sm text-gray-600">Vos données sont chiffrées et protégées</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Lock className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Annulation flexible</p>
                    <p className="text-sm text-gray-600">Annulez à tout moment, sans frais cachés</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <CreditCard className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Paiement différé</p>
                    <p className="text-sm text-gray-600">
                      Premier prélèvement après l'essai gratuit
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Side - Stripe Checkout */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-3"
          >
            <div className="bg-white rounded-2xl shadow-lg p-6 lg:p-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Finaliser votre abonnement</h2>

              {clientSecret && (
                <EmbeddedCheckoutProvider
                  stripe={stripePromise}
                  options={{ clientSecret }}
                >
                  <EmbeddedCheckout />
                </EmbeddedCheckoutProvider>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
