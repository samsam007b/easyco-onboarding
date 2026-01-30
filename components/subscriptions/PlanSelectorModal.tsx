/**
 * PLAN SELECTOR MODAL
 *
 * Modal component for selecting subscription plan (monthly vs annual)
 * Shows pricing, savings, and initiates Stripe Checkout
 */

'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, Zap, Calendar, CreditCard } from 'lucide-react';
import { useStripeCheckout, type SubscriptionPlan } from '@/hooks/use-stripe-checkout';

interface PlanSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  userType: 'owner' | 'resident';
}

export default function PlanSelectorModal({ isOpen, onClose, userType }: PlanSelectorModalProps) {
  const [selectedInterval, setSelectedInterval] = useState<'monthly' | 'annual'>('monthly');
  const { startCheckout, isLoading, error } = useStripeCheckout();

  // Pricing data (tarif de lancement)
  const pricing = {
    owner: {
      monthly: 22.99,
      annual: 229.90,
    },
    resident: {
      monthly: 3.99,
      annual: 39.90,
    },
  };

  const currentPricing = pricing[userType];
  const monthlyPrice = currentPricing.monthly;
  const annualPrice = currentPricing.annual;
  const annualMonthlyPrice = (annualPrice / 12).toFixed(2);
  const savings = (monthlyPrice * 12 - annualPrice).toFixed(2);
  const savingsPercent = Math.round(((monthlyPrice * 12 - annualPrice) / (monthlyPrice * 12)) * 100);

  const handleSubscribe = async () => {
    const plan: SubscriptionPlan = `${userType}_${selectedInterval}` as SubscriptionPlan;
    await startCheckout(plan);
  };

  const features = [
    'Accès complet à toutes les fonctionnalités',
    'Support client prioritaire',
    'Stockage illimité de documents',
    'Messagerie en temps réel',
    'Tableau de bord analytique',
    userType === 'owner' ? 'Gestion multi-propriétés' : 'Communauté de résidents',
    'Notifications personnalisées',
    'Mises à jour régulières',
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white superellipse-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            >
              {/* Header */}
              <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Choisissez votre plan {userType === 'owner' ? 'Owner' : 'Resident'}
                  </h2>
                  <p className="text-sm text-gray-600 mt-1">Commencez dès aujourd'hui avec notre tarif de lancement</p>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 rounded-full transition"
                  disabled={isLoading}
                >
                  <X className="w-6 h-6 text-gray-600" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6">
                {/* Interval Toggle */}
                <div className="flex items-center justify-center mb-8">
                  <div className="bg-gray-100 rounded-full p-1 flex gap-1">
                    <button
                      onClick={() => setSelectedInterval('monthly')}
                      disabled={isLoading}
                      className={`px-6 py-3 rounded-full font-semibold transition ${
                        selectedInterval === 'monthly'
                          ? 'bg-white text-gray-900 shadow-sm'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      Mensuel
                    </button>
                    <button
                      onClick={() => setSelectedInterval('annual')}
                      disabled={isLoading}
                      className={`px-6 py-3 rounded-full font-semibold transition flex items-center gap-2 ${
                        selectedInterval === 'annual'
                          ? 'bg-white text-gray-900 shadow-sm'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      <Zap className="w-4 h-4" />
                      Annuel
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                        2 mois offerts
                      </span>
                    </button>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  {/* Left: Pricing Card */}
                  <div>
                    <div
                      className={`border-2 superellipse-2xl p-6 ${
                        selectedInterval === 'annual'
                          ? 'border-green-500 bg-gradient-to-br from-green-50 to-emerald-50'
                          : 'border-gray-200 bg-white'
                      }`}
                    >
                      {selectedInterval === 'annual' && (
                        <div className="flex items-center gap-2 text-green-700 font-semibold mb-3">
                          <Zap className="w-5 h-5" />
                          <span>Meilleure offre - 2 mois offerts</span>
                        </div>
                      )}

                      <div className="mb-4">
                        <div className="flex items-baseline gap-2">
                          <span className="text-5xl font-bold text-gray-900">
                            {selectedInterval === 'monthly' ? monthlyPrice : annualMonthlyPrice}€
                          </span>
                          <span className="text-gray-600">/mois</span>
                        </div>
                        {selectedInterval === 'annual' && (
                          <p className="text-sm text-gray-600 mt-1">
                            Soit {annualPrice}€ facturé annuellement
                          </p>
                        )}
                      </div>

                      <div className="space-y-3 mb-6">
                        <div className="flex items-center gap-3 text-sm">
                          <Calendar className="w-5 h-5 text-gray-600" />
                          <span className="text-gray-700">
                            Facturation {selectedInterval === 'monthly' ? 'mensuelle' : 'annuelle'}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-sm">
                          <CreditCard className="w-5 h-5 text-gray-600" />
                          <span className="text-gray-700">Annulation à tout moment</span>
                        </div>
                      </div>

                      {error && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 superellipse-lg">
                          <p className="text-sm text-red-800">{error}</p>
                        </div>
                      )}

                      <button
                        onClick={handleSubscribe}
                        disabled={isLoading}
                        className={`w-full py-4 superellipse-xl font-bold text-white shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                          userType === 'owner'
                            ? 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700'
                            : 'bg-gradient-to-r from-orange-600 to-yellow-600 hover:from-orange-700 hover:to-yellow-700'
                        }`}
                      >
                        {isLoading ? (
                          <div className="flex items-center justify-center gap-2">
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            <span>Redirection vers le paiement...</span>
                          </div>
                        ) : (
                          <>S'abonner maintenant</>
                        )}
                      </button>

                      <p className="text-xs text-gray-500 text-center mt-3">
                        Paiement sécurisé via Stripe • SSL & 3D Secure
                      </p>
                    </div>
                  </div>

                  {/* Right: Features List */}
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Tout ce dont vous avez besoin</h3>
                    <div className="space-y-3">
                      {features.map((feature, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="flex items-start gap-3"
                        >
                          <div className="flex-shrink-0 w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mt-0.5">
                            <Check className="w-4 h-4 text-green-600" />
                          </div>
                          <span className="text-gray-700">{feature}</span>
                        </motion.div>
                      ))}
                    </div>

                    <div className="mt-6 p-4 bg-blue-50 border border-blue-200 superellipse-xl">
                      <p className="text-sm text-blue-900 font-medium">Garantie satisfaction</p>
                      <p className="text-xs text-blue-700 mt-1">
                        Vous pouvez annuler votre abonnement à tout moment, sans frais ni engagement.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
