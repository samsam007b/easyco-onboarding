/**
 * UPGRADE NOTIFICATION
 *
 * Toast/notification component for Stripe upgrade success/cancel
 * IMPORTANT: Verifies payment status with Stripe API before showing success
 */

'use client';

import { useEffect, useState, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, X, Loader2, AlertTriangle } from 'lucide-react';

type NotificationType = 'success' | 'cancelled' | 'verifying' | 'error' | null;

interface VerificationResult {
  verified: boolean;
  status?: string;
  subscription?: {
    id: string | null;
    status: string | null;
    trial_end: string | null;
  };
  error?: string;
  message?: string;
}

export default function UpgradeNotification() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [show, setShow] = useState(false);
  const [type, setType] = useState<NotificationType>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [trialInfo, setTrialInfo] = useState<string | null>(null);

  const verifyPayment = useCallback(async (sessionId: string): Promise<VerificationResult> => {
    try {
      const response = await fetch(`/api/stripe/verify-session?session_id=${sessionId}`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Payment verification error:', error);
      return { verified: false, error: 'Erreur de connexion' };
    }
  }, []);

  useEffect(() => {
    const upgradeParam = searchParams.get('upgrade');
    const sessionId = searchParams.get('session_id');

    const handleVerification = async () => {
      if (upgradeParam === 'success' && sessionId) {
        // Show verifying state
        setType('verifying');
        setShow(true);

        // Verify with Stripe
        const result = await verifyPayment(sessionId);

        if (result.verified) {
          setType('success');

          // Show trial info if applicable
          if (result.subscription?.trial_end) {
            const trialEndDate = new Date(result.subscription.trial_end);
            const formattedDate = trialEndDate.toLocaleDateString('fr-FR', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            });
            setTrialInfo(`Période d'essai jusqu'au ${formattedDate}`);
          }

          // Auto-hide after 8 seconds
          setTimeout(() => setShow(false), 8000);
        } else {
          // Payment not verified - show error
          setType('error');
          setErrorMessage(result.message || result.error || 'Le paiement n\'a pas pu être vérifié');

          // Auto-hide after 10 seconds
          setTimeout(() => setShow(false), 10000);
        }

        // Clean up URL
        const newUrl = window.location.pathname;
        router.replace(newUrl);

      } else if (upgradeParam === 'cancelled') {
        setType('cancelled');
        setShow(true);

        // Auto-hide after 6 seconds
        setTimeout(() => setShow(false), 6000);

        // Clean up URL
        const newUrl = window.location.pathname;
        router.replace(newUrl);
      }
    };

    if (upgradeParam) {
      handleVerification();
    }
  }, [searchParams, router, verifyPayment]);

  const handleClose = () => {
    setShow(false);
  };

  const getNotificationContent = () => {
    switch (type) {
      case 'verifying':
        return {
          bgClass: 'bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-300',
          iconBg: 'bg-blue-100',
          icon: <Loader2 className="w-7 h-7 text-blue-600 animate-spin" />,
          title: 'Vérification en cours...',
          titleClass: 'text-blue-900',
          message: 'Nous vérifions votre paiement auprès de Stripe.',
          messageClass: 'text-blue-800',
          showButton: false,
        };

      case 'success':
        return {
          bgClass: 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-300',
          iconBg: 'bg-green-100',
          icon: <CheckCircle className="w-7 h-7 text-green-600" />,
          title: '🎉 Paiement réussi !',
          titleClass: 'text-green-900',
          message: trialInfo
            ? `Votre abonnement a été activé avec succès. ${trialInfo}. Profitez de toutes les fonctionnalités premium !`
            : 'Votre abonnement a été activé avec succès. Vous pouvez maintenant profiter de toutes les fonctionnalités premium sans interruption.',
          messageClass: 'text-green-800',
          showButton: true,
          buttonText: 'Voir mon abonnement →',
          buttonClass: 'text-green-700 hover:text-green-900',
        };

      case 'error':
        return {
          bgClass: 'bg-gradient-to-r from-red-50 to-orange-50 border-red-300',
          iconBg: 'bg-red-100',
          icon: <AlertTriangle className="w-7 h-7 text-red-600" />,
          title: 'Paiement non confirmé',
          titleClass: 'text-red-900',
          message: errorMessage || 'Le paiement n\'a pas été finalisé. Si vous avez été débité, contactez notre support.',
          messageClass: 'text-red-800',
          showButton: true,
          buttonText: 'Réessayer →',
          buttonClass: 'text-red-700 hover:text-red-900',
        };

      case 'cancelled':
        return {
          bgClass: 'bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-300',
          iconBg: 'bg-yellow-100',
          icon: <XCircle className="w-7 h-7 text-yellow-600" />,
          title: 'Paiement annulé',
          titleClass: 'text-yellow-900',
          message: 'Vous avez annulé le processus de paiement. Vous pouvez réessayer à tout moment depuis la page d\'abonnement.',
          messageClass: 'text-yellow-800',
          showButton: true,
          buttonText: 'Retour à l\'abonnement →',
          buttonClass: 'text-yellow-700 hover:text-yellow-900',
        };

      default:
        return null;
    }
  };

  const content = getNotificationContent();

  return (
    <AnimatePresence>
      {show && content && (
        <motion.div
          initial={{ opacity: 0, y: -100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -100 }}
          className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-full max-w-md px-4"
        >
          <div className={`rounded-2xl shadow-2xl border-2 p-6 relative ${content.bgClass}`}>
            {type !== 'verifying' && (
              <button
                onClick={handleClose}
                className="absolute top-3 right-3 p-1 hover:bg-white/50 rounded-full transition"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            )}

            <div className="flex items-start gap-4">
              <div className={`flex-shrink-0 w-12 h-12 ${content.iconBg} rounded-full flex items-center justify-center`}>
                {content.icon}
              </div>

              <div className="flex-1 pt-1">
                <h3 className={`text-lg font-bold ${content.titleClass} mb-1`}>
                  {content.title}
                </h3>
                <p className={`text-sm ${content.messageClass} mb-3`}>
                  {content.message}
                </p>
                {content.showButton && (
                  <button
                    onClick={() => router.push('/dashboard/subscription')}
                    className={`text-sm font-semibold ${content.buttonClass} underline`}
                  >
                    {content.buttonText}
                  </button>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
