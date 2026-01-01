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
  Gift,
  Zap,
} from 'lucide-react';
import LoadingHouse from '@/components/ui/LoadingHouse';
import Image from 'next/image';

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

// IzzIco brand colors
const brandColors = {
  owner: {
    primary: '#9c5698',
    secondary: '#7c4078',
    light: '#f3e8f2',
    gradient: 'from-[#9c5698] to-[#7c4078]',
    gradientLight: 'from-[#f3e8f2] to-[#e8d4e6]',
    gradientVibrant: 'from-[#9c5698] via-[#8a4a86] to-[#6b3a6b]',
    bg: 'bg-[#f3e8f2]',
    text: 'text-[#9c5698]',
    border: 'border-[#9c5698]',
    ring: 'ring-[#9c5698]/20',
    shadow: 'shadow-[#9c5698]/20',
  },
  resident: {
    primary: '#ff651e',
    secondary: '#e05747',
    light: '#fff5f2',
    gradient: 'from-[#e05747] to-[#ff9014]',
    gradientLight: 'from-[#fff5f2] to-[#ffede5]',
    gradientVibrant: 'from-[#e05747] via-[#ff651e] to-[#ff9014]',
    bg: 'bg-[#fff5f2]',
    text: 'text-[#ff651e]',
    border: 'border-[#ff651e]',
    ring: 'ring-[#ff651e]/20',
    shadow: 'shadow-[#ff651e]/20',
  },
};

export default function CheckoutPage() {
  const router = useRouter();
  const params = useParams();
  const plan = params.plan as string;

  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [pageError, setPageError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  // Validate plan
  const isValidPlan = (p: string): p is PlanType => {
    return ['owner_monthly', 'owner_annual', 'resident_monthly', 'resident_annual'].includes(p);
  };

  const currentPlan = isValidPlan(plan) ? planDetails[plan] : null;
  const isOwner = currentPlan?.userType === 'owner';
  const colors = currentPlan ? brandColors[currentPlan.userType] : brandColors.resident;

  // Fetch client secret for embedded checkout
  const fetchClientSecret = useCallback(async (isRetry = false) => {
    if (!isValidPlan(plan)) {
      setPageError('Plan invalide');
      setLoading(false);
      return;
    }

    if (isRetry) {
      setCheckoutLoading(true);
      setCheckoutError(null);
    }

    try {
      const response = await fetch('/api/stripe/create-embedded-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          setPageError('Vous devez être connecté pour accéder à cette page');
          return;
        }
        throw new Error(data.error || 'Erreur lors de la création du checkout');
      }

      if (!data.clientSecret) {
        throw new Error('La session de paiement n\'a pas pu être créée. Veuillez réessayer.');
      }

      setClientSecret(data.clientSecret);
      setCheckoutError(null);
    } catch (err: any) {
      console.error('Checkout error:', err);
      setCheckoutError(err.message || 'Une erreur est survenue');
    } finally {
      setLoading(false);
      setCheckoutLoading(false);
    }
  }, [plan]);

  useEffect(() => {
    fetchClientSecret();
  }, [fetchClientSecret]);

  // Handle invalid plan
  if (!currentPlan) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#fef3f0] via-white to-[#f3e8f2] flex items-center justify-center p-4">
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
            className="px-6 py-3 bg-gradient-to-r from-[#ff651e] to-[#9c5698] text-white rounded-xl font-semibold hover:shadow-lg transition"
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
      <div className={`min-h-screen bg-gradient-to-br ${isOwner ? 'from-[#f3e8f2] via-white to-[#e8d4e6]' : 'from-[#fef3f0] via-white to-[#fde8e3]'} flex items-center justify-center`}>
        <div className="text-center">
          <LoadingHouse size={80} />
          <p className="text-gray-600 mt-4">Préparation du paiement sécurisé...</p>
        </div>
      </div>
    );
  }

  // Page-level error state
  if (pageError) {
    return (
      <div className={`min-h-screen bg-gradient-to-br ${isOwner ? 'from-[#f3e8f2] via-white to-[#e8d4e6]' : 'from-[#fef3f0] via-white to-[#fde8e3]'} flex items-center justify-center p-4`}>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-2xl shadow-xl p-8 max-w-md text-center"
        >
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Erreur</h1>
          <p className="text-gray-600 mb-6">{pageError}</p>
          <div className="space-y-3">
            <button
              onClick={() => {
                setPageError(null);
                setLoading(true);
                fetchClientSecret();
              }}
              className={`w-full px-6 py-3 bg-gradient-to-r ${colors.gradient} text-white rounded-xl font-semibold hover:shadow-lg transition`}
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
    <div className={`min-h-screen bg-gradient-to-br ${isOwner ? 'from-[#f3e8f2] via-white to-[#e8d4e6]' : 'from-[#fef3f0] via-white to-[#fde8e3]'}`}>
      {/* Branded Header */}
      <div className={`bg-gradient-to-r ${colors.gradientVibrant} text-white`}>
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-white/90 hover:text-white transition group"
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              <span className="font-medium">Retour</span>
            </button>
            <div className="flex items-center gap-2">
              <Image
                src="/images/logo-white.png"
                alt="IzzIco"
                width={100}
                height={30}
                className="h-7 w-auto"
                onError={(e) => {
                  // Fallback if logo doesn't exist
                  e.currentTarget.style.display = 'none';
                }}
              />
              <span className="font-bold text-lg tracking-tight">IzzIco</span>
            </div>
            <div className="flex items-center gap-2 text-white/90">
              <Lock className="w-4 h-4" />
              <span className="text-sm font-medium hidden sm:inline">Paiement sécurisé</span>
            </div>
          </div>
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
            {/* Plan Card with gradient border */}
            <div className="relative">
              {/* Gradient border effect */}
              <div className={`absolute -inset-0.5 bg-gradient-to-r ${colors.gradientVibrant} rounded-2xl opacity-75 blur-sm`}></div>
              <div className="relative bg-white rounded-2xl p-6">
                {/* Trial Badge */}
                <div className={`absolute -top-3 -right-3 bg-gradient-to-r ${colors.gradient} text-white px-4 py-1.5 rounded-full shadow-lg flex items-center gap-1.5`}>
                  <Gift className="w-4 h-4" />
                  <span className="text-sm font-bold">{currentPlan.trialDays} GRATUIT</span>
                </div>

                {/* Plan Header */}
                <div className="flex items-center gap-4 mb-6 pt-2">
                  <div
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center bg-gradient-to-br ${colors.gradient} shadow-lg`}
                    style={{ boxShadow: `0 8px 24px ${colors.primary}40` }}
                  >
                    {isOwner ? (
                      <Crown className="w-7 h-7 text-white" />
                    ) : (
                      <Users className="w-7 h-7 text-white" />
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
                    <span className={`text-4xl font-bold bg-gradient-to-r ${colors.gradient} bg-clip-text text-transparent`}>
                      {currentPlan.price}€
                    </span>
                    <span className="text-gray-500 font-medium">/{currentPlan.interval}</span>
                  </div>
                  {currentPlan.savings && (
                    <div className={`inline-flex items-center gap-1.5 mt-2 px-3 py-1 rounded-full ${colors.bg}`}>
                      <Zap className={`w-4 h-4 ${colors.text}`} />
                      <span className={`text-sm font-semibold ${colors.text}`}>
                        Économisez {currentPlan.savings}€/an
                      </span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 mt-3">
                    <Sparkles className="w-4 h-4 text-emerald-500" />
                    <span className="text-sm text-emerald-700 font-medium">
                      Essai gratuit de {currentPlan.trialDays} inclus
                    </span>
                  </div>
                </div>

                {/* Features */}
                <div className="space-y-3">
                  <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                    <Check className={`w-5 h-5 ${colors.text}`} />
                    Inclus dans votre abonnement
                  </h3>
                  <div className="grid gap-2.5 pl-1">
                    {currentPlan.features.map((feature, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="flex items-start gap-3"
                      >
                        <div
                          className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${colors.bg}`}
                        >
                          <Check className={`w-3 h-3 ${colors.text}`} />
                        </div>
                        <span className="text-gray-700 text-sm">{feature}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Trust Badges */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100"
            >
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Shield className={`w-5 h-5 ${colors.text}`} />
                Paiement 100% sécurisé
              </h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${colors.bg}`}>
                    <Shield className={`w-5 h-5 ${colors.text}`} />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Sécurisé par Stripe</p>
                    <p className="text-sm text-gray-500">Données chiffrées SSL 256-bit</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${colors.bg}`}>
                    <Lock className={`w-5 h-5 ${colors.text}`} />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Annulation flexible</p>
                    <p className="text-sm text-gray-500">Annulez quand vous voulez</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${colors.bg}`}>
                    <CreditCard className={`w-5 h-5 ${colors.text}`} />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Paiement différé</p>
                    <p className="text-sm text-gray-500">
                      1er prélèvement après l'essai
                    </p>
                  </div>
                </div>
              </div>

              {/* Payment methods */}
              <div className="mt-6 pt-4 border-t border-gray-100">
                <p className="text-xs text-gray-500 mb-2">Moyens de paiement acceptés</p>
                <div className="flex items-center gap-2">
                  <div className="px-2 py-1 bg-gray-50 rounded text-xs font-medium text-gray-600">Visa</div>
                  <div className="px-2 py-1 bg-gray-50 rounded text-xs font-medium text-gray-600">Mastercard</div>
                  <div className="px-2 py-1 bg-gray-50 rounded text-xs font-medium text-gray-600">Bancontact</div>
                  <div className="px-2 py-1 bg-gray-50 rounded text-xs font-medium text-gray-600">Klarna</div>
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
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
              {/* Header */}
              <div className={`bg-gradient-to-r ${colors.gradientLight} px-6 lg:px-8 py-4 border-b border-gray-100`}>
                <h2 className="text-xl font-bold text-gray-900">Finaliser votre abonnement</h2>
                <p className="text-sm text-gray-600 mt-1">
                  Entrez vos informations de paiement ci-dessous
                </p>
              </div>

              <div className="p-6 lg:p-8">
                {clientSecret ? (
                  <EmbeddedCheckoutProvider
                    stripe={stripePromise}
                    options={{ clientSecret }}
                  >
                    <EmbeddedCheckout />
                  </EmbeddedCheckoutProvider>
                ) : checkoutError ? (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <AlertCircle className="w-8 h-8 text-red-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Impossible de charger le formulaire
                    </h3>
                    <p className="text-gray-600 mb-6 max-w-sm mx-auto">
                      {checkoutError}
                    </p>
                    <button
                      onClick={() => fetchClientSecret(true)}
                      disabled={checkoutLoading}
                      className={`px-6 py-3 bg-gradient-to-r ${colors.gradient} text-white rounded-xl font-semibold hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      {checkoutLoading ? (
                        <span className="flex items-center gap-2">
                          <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Chargement...
                        </span>
                      ) : (
                        'Réessayer'
                      )}
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="animate-pulse space-y-4">
                      <div className={`h-12 rounded-lg ${colors.bg}`}></div>
                      <div className={`h-12 rounded-lg ${colors.bg}`}></div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className={`h-12 rounded-lg ${colors.bg}`}></div>
                        <div className={`h-12 rounded-lg ${colors.bg}`}></div>
                      </div>
                      <div className={`h-12 rounded-lg ${colors.bg}`}></div>
                      <div className={`h-14 bg-gradient-to-r ${colors.gradientLight} rounded-lg`}></div>
                    </div>
                    <p className="text-sm text-gray-500 text-center pt-4">
                      Chargement du formulaire de paiement...
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Support info */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="mt-6 text-center"
            >
              <p className="text-sm text-gray-500">
                Une question ? Contactez-nous à{' '}
                <a
                  href="mailto:support@izzico.be"
                  className={`font-medium ${colors.text} hover:underline`}
                >
                  support@izzico.be
                </a>
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
