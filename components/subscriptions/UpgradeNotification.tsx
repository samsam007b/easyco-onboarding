/**
 * UPGRADE NOTIFICATION
 *
 * Toast/notification component for Stripe upgrade success/cancel
 * Automatically shows based on URL query parameters
 */

'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, X } from 'lucide-react';

export default function UpgradeNotification() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [show, setShow] = useState(false);
  const [type, setType] = useState<'success' | 'cancelled' | null>(null);

  useEffect(() => {
    const upgradeParam = searchParams.get('upgrade');

    if (upgradeParam === 'success') {
      setType('success');
      setShow(true);

      // Auto-hide after 8 seconds
      setTimeout(() => setShow(false), 8000);

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
  }, [searchParams, router]);

  const handleClose = () => {
    setShow(false);
  };

  return (
    <AnimatePresence>
      {show && type && (
        <motion.div
          initial={{ opacity: 0, y: -100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -100 }}
          className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-full max-w-md px-4"
        >
          <div
            className={`rounded-2xl shadow-2xl border-2 p-6 ${
              type === 'success'
                ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-300'
                : 'bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-300'
            }`}
          >
            <button
              onClick={handleClose}
              className="absolute top-3 right-3 p-1 hover:bg-white/50 rounded-full transition"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>

            <div className="flex items-start gap-4">
              {type === 'success' ? (
                <div className="flex-shrink-0 w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-7 h-7 text-green-600" />
                </div>
              ) : (
                <div className="flex-shrink-0 w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                  <XCircle className="w-7 h-7 text-yellow-600" />
                </div>
              )}

              <div className="flex-1 pt-1">
                {type === 'success' ? (
                  <>
                    <h3 className="text-lg font-bold text-green-900 mb-1">
                      🎉 Paiement réussi !
                    </h3>
                    <p className="text-sm text-green-800 mb-3">
                      Votre abonnement a été activé avec succès. Vous pouvez maintenant profiter de toutes les
                      fonctionnalités premium sans interruption.
                    </p>
                    <button
                      onClick={() => router.push('/dashboard/subscription')}
                      className="text-sm font-semibold text-green-700 hover:text-green-900 underline"
                    >
                      Voir mon abonnement →
                    </button>
                  </>
                ) : (
                  <>
                    <h3 className="text-lg font-bold text-yellow-900 mb-1">
                      Paiement annulé
                    </h3>
                    <p className="text-sm text-yellow-800 mb-3">
                      Vous avez annulé le processus de paiement. Vous pouvez réessayer à tout moment depuis la page
                      d'abonnement.
                    </p>
                    <button
                      onClick={() => router.push('/dashboard/subscription')}
                      className="text-sm font-semibold text-yellow-700 hover:text-yellow-900 underline"
                    >
                      Retour à l'abonnement →
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
