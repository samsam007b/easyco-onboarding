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
import { useLanguage } from '@/lib/i18n/use-language';

// Load Stripe outside of component to avoid recreating on each render
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

type PlanType = 'owner_monthly' | 'owner_annual' | 'resident_monthly' | 'resident_annual';

interface PlanDetails {
  name: string;
  price: string;
  intervalKey: 'month' | 'year';
  savings?: string;
  trialKey: 'owner' | 'resident';
  featureKeys: string[];
  isAnnual: boolean;
  userType: 'owner' | 'resident';
}

const planDetails: Record<PlanType, PlanDetails> = {
  owner_monthly: {
    name: 'IzzIco Owner',
    price: '22,99',
    intervalKey: 'month',
    trialKey: 'owner',
    featureKeys: [
      'multiProperty',
      'advancedMatching',
      'unlimitedMessaging',
      'analyticsBoard',
      'documentsContracts',
      'prioritySupport',
    ],
    isAnnual: false,
    userType: 'owner',
  },
  owner_annual: {
    name: 'IzzIco Owner',
    price: '229,90',
    intervalKey: 'year',
    savings: '2 mois',
    trialKey: 'owner',
    featureKeys: [
      'multiProperty',
      'advancedMatching',
      'unlimitedMessaging',
      'analyticsBoard',
      'documentsContracts',
      'prioritySupport',
    ],
    isAnnual: true,
    userType: 'owner',
  },
  resident_monthly: {
    name: 'IzzIco Resident',
    price: '3,99',
    intervalKey: 'month',
    trialKey: 'resident',
    featureKeys: [
      'verifiedProfile',
      'colivingMatching',
      'unlimitedMessaging',
      'personalizedAlerts',
      'residentCommunity',
      'dedicatedSupport',
    ],
    isAnnual: false,
    userType: 'resident',
  },
  resident_annual: {
    name: 'IzzIco Resident',
    price: '39,90',
    intervalKey: 'year',
    savings: '2 mois',
    trialKey: 'resident',
    featureKeys: [
      'verifiedProfile',
      'colivingMatching',
      'unlimitedMessaging',
      'personalizedAlerts',
      'residentCommunity',
      'dedicatedSupport',
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
    primary: '#e05747',
    secondary: '#e05747',
    light: '#fff5f2',
    gradient: 'from-[#e05747] to-[#e05747]',
    gradientLight: 'from-[#fff5f2] to-[#ffede5]',
    gradientVibrant: 'from-[#e05747] via-[#e05747] to-[#e05747]',
    bg: 'bg-[#fff5f2]',
    text: 'text-[#e05747]',
    border: 'border-[#e05747]',
    ring: 'ring-[#e05747]/20',
    shadow: 'shadow-[#e05747]/20',
  },
};

export default function CheckoutPage() {
  const router = useRouter();
  const params = useParams();
  const plan = params.plan as string;
  const { language, getSection } = useLanguage();
  const t = getSection('checkout');

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
      setPageError(t?.errors?.invalidPlan?.title?.[language] || 'Invalid plan');
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
          setPageError(t?.errors?.unauthorized?.[language] || 'You must be logged in to access this page');
          return;
        }
        throw new Error(data.error || t?.errors?.checkoutCreation?.[language] || 'Error creating checkout');
      }

      if (!data.clientSecret) {
        throw new Error(t?.errors?.sessionNotCreated?.[language] || 'The payment session could not be created. Please try again.');
      }

      setClientSecret(data.clientSecret);
      setCheckoutError(null);
    } catch (err: any) {
      console.error('Checkout error:', err);
      setCheckoutError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
      setCheckoutLoading(false);
    }
  }, [plan, language, t]);

  useEffect(() => {
    fetchClientSecret();
  }, [fetchClientSecret]);

  // Get translated trial period
  const getTrialDays = () => {
    if (!currentPlan) return '';
    return t?.plans?.trialDays?.[currentPlan.trialKey]?.[language] || (currentPlan.trialKey === 'owner' ? '3 months' : '6 months');
  };

  // Get translated interval
  const getInterval = () => {
    if (!currentPlan) return '';
    return t?.plans?.interval?.[currentPlan.intervalKey]?.[language] || currentPlan.intervalKey;
  };

  // Get translated subscription type
  const getSubscriptionType = () => {
    if (!currentPlan) return '';
    return currentPlan.isAnnual
      ? (t?.plans?.subscription?.annual?.[language] || 'Annual subscription')
      : (t?.plans?.subscription?.monthly?.[language] || 'Monthly subscription');
  };

  // Get translated feature
  const getFeature = (featureKey: string) => {
    if (!currentPlan) return featureKey;
    return t?.features?.[currentPlan.userType]?.[featureKey]?.[language] || featureKey;
  };

  // Handle invalid plan
  if (!currentPlan) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#fef3f0] via-white to-[#f3e8f2] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white superellipse-2xl shadow-xl p-8 max-w-md text-center"
        >
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {t?.errors?.invalidPlan?.title?.[language] || 'Invalid plan'}
          </h1>
          <p className="text-gray-600 mb-6">
            {t?.errors?.invalidPlan?.description?.[language] || 'The selected plan does not exist. Please choose a valid plan.'}
          </p>
          <button
            onClick={() => router.push('/dashboard/subscription')}
            className="px-6 py-3 bg-gradient-to-r from-[#e05747] to-[#9c5698] text-white superellipse-xl font-semibold hover:shadow-lg transition"
          >
            {t?.errors?.invalidPlan?.seeAvailablePlans?.[language] || 'See available plans'}
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
          <p className="text-gray-600 mt-4">
            {t?.loading?.preparingPayment?.[language] || 'Preparing secure payment...'}
          </p>
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
          className="bg-white superellipse-2xl shadow-xl p-8 max-w-md text-center"
        >
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {t?.errors?.generic?.title?.[language] || 'Error'}
          </h1>
          <p className="text-gray-600 mb-6">{pageError}</p>
          <div className="space-y-3">
            <button
              onClick={() => {
                setPageError(null);
                setLoading(true);
                fetchClientSecret();
              }}
              className={`w-full px-6 py-3 bg-gradient-to-r ${colors.gradient} text-white superellipse-xl font-semibold hover:shadow-lg transition`}
            >
              {t?.errors?.generic?.retry?.[language] || 'Retry'}
            </button>
            <button
              onClick={() => router.back()}
              className="w-full px-6 py-3 bg-gray-100 text-gray-700 superellipse-xl font-semibold hover:bg-gray-200 transition"
            >
              {t?.errors?.generic?.back?.[language] || 'Back'}
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
              <span className="font-medium">{t?.header?.back?.[language] || 'Back'}</span>
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
              <span className="text-sm font-medium hidden sm:inline">
                {t?.header?.securePayment?.[language] || 'Secure payment'}
              </span>
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
              <div className={`absolute -inset-0.5 bg-gradient-to-r ${colors.gradientVibrant} superellipse-2xl opacity-75 blur-sm`}></div>
              <div className="relative bg-white superellipse-2xl p-6">
                {/* Trial Badge */}
                <div className={`absolute -top-3 -right-3 bg-gradient-to-r ${colors.gradient} text-white px-4 py-1.5 rounded-full shadow-lg flex items-center gap-1.5`}>
                  <Gift className="w-4 h-4" />
                  <span className="text-sm font-bold">
                    {getTrialDays()} {t?.plans?.free?.[language] || 'FREE'}
                  </span>
                </div>

                {/* Plan Header */}
                <div className="flex items-center gap-4 mb-6 pt-2">
                  <div
                    className={`w-14 h-14 superellipse-2xl flex items-center justify-center bg-gradient-to-br ${colors.gradient} shadow-lg`}
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
                    <p className="text-sm text-gray-500">{getSubscriptionType()}</p>
                  </div>
                </div>

                {/* Price */}
                <div className="mb-6 pb-6 border-b border-gray-100">
                  <div className="flex items-baseline gap-1">
                    <span className={`text-4xl font-bold bg-gradient-to-r ${colors.gradient} bg-clip-text text-transparent`}>
                      {currentPlan.price}€
                    </span>
                    <span className="text-gray-500 font-medium">/{getInterval()}</span>
                  </div>
                  {currentPlan.savings && (
                    <div className={`inline-flex items-center gap-1.5 mt-2 px-3 py-1 rounded-full ${colors.bg}`}>
                      <Zap className={`w-4 h-4 ${colors.text}`} />
                      <span className={`text-sm font-semibold ${colors.text}`}>
                        {currentPlan.savings} {t?.plans?.free?.[language] || 'offerts'}
                      </span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 mt-3">
                    <Sparkles className="w-4 h-4 text-emerald-500" />
                    <span className="text-sm text-emerald-700 font-medium">
                      {t?.plans?.freeTrialIncluded?.[language] || 'Free trial of'} {getTrialDays()} {t?.plans?.included?.[language] || 'included'}
                    </span>
                  </div>
                </div>

                {/* Features */}
                <div className="space-y-3">
                  <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                    <Check className={`w-5 h-5 ${colors.text}`} />
                    {t?.features?.includedInSubscription?.[language] || 'Included in your subscription'}
                  </h3>
                  <div className="grid gap-2.5 pl-1">
                    {currentPlan.featureKeys.map((featureKey, index) => (
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
                        <span className="text-gray-700 text-sm">{getFeature(featureKey)}</span>
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
              className="bg-white superellipse-2xl shadow-lg p-6 border border-gray-100"
            >
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Shield className={`w-5 h-5 ${colors.text}`} />
                {t?.trust?.title?.[language] || '100% secure payment'}
              </h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 superellipse-xl flex items-center justify-center flex-shrink-0 ${colors.bg}`}>
                    <Shield className={`w-5 h-5 ${colors.text}`} />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      {t?.trust?.stripe?.title?.[language] || 'Secured by Stripe'}
                    </p>
                    <p className="text-sm text-gray-500">
                      {t?.trust?.stripe?.description?.[language] || 'SSL 256-bit encrypted data'}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 superellipse-xl flex items-center justify-center flex-shrink-0 ${colors.bg}`}>
                    <Lock className={`w-5 h-5 ${colors.text}`} />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      {t?.trust?.cancellation?.title?.[language] || 'Flexible cancellation'}
                    </p>
                    <p className="text-sm text-gray-500">
                      {t?.trust?.cancellation?.description?.[language] || 'Cancel anytime you want'}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 superellipse-xl flex items-center justify-center flex-shrink-0 ${colors.bg}`}>
                    <CreditCard className={`w-5 h-5 ${colors.text}`} />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      {t?.trust?.deferredPayment?.title?.[language] || 'Deferred payment'}
                    </p>
                    <p className="text-sm text-gray-500">
                      {t?.trust?.deferredPayment?.description?.[language] || 'First charge after trial'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Payment methods */}
              <div className="mt-6 pt-4 border-t border-gray-100">
                <p className="text-xs text-gray-500 mb-2">
                  {t?.trust?.paymentMethods?.[language] || 'Accepted payment methods'}
                </p>
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
            <div className="bg-white superellipse-2xl shadow-lg overflow-hidden border border-gray-100">
              {/* Header */}
              <div className={`bg-gradient-to-r ${colors.gradientLight} px-6 lg:px-8 py-4 border-b border-gray-100`}>
                <h2 className="text-xl font-bold text-gray-900">
                  {t?.form?.title?.[language] || 'Complete your subscription'}
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  {t?.form?.subtitle?.[language] || 'Enter your payment information below'}
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
                      {t?.errors?.unableToLoad?.title?.[language] || 'Unable to load form'}
                    </h3>
                    <p className="text-gray-600 mb-6 max-w-sm mx-auto">
                      {checkoutError}
                    </p>
                    <button
                      onClick={() => fetchClientSecret(true)}
                      disabled={checkoutLoading}
                      className={`px-6 py-3 bg-gradient-to-r ${colors.gradient} text-white superellipse-xl font-semibold hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      {checkoutLoading ? (
                        <span className="flex items-center gap-2">
                          <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Loading...
                        </span>
                      ) : (
                        t?.errors?.generic?.retry?.[language] || 'Retry'
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
                      {t?.loading?.loadingForm?.[language] || 'Loading payment form...'}
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
                {t?.support?.question?.[language] || 'Have a question? Contact us at'}{' '}
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
