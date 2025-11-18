'use client';

import { useState, useEffect } from 'react';
import { X, Cookie, Settings } from 'lucide-react';
import {
  hasConsentResponse,
  acceptAll,
  rejectAll,
  saveConsent,
  getConsent,
  type CookieConsent,
} from '@/lib/consent/cookie-consent';

export default function CookieConsentBanner() {
  const [isVisible, setIsVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [preferences, setPreferences] = useState({
    necessary: true,
    analytics: true,
    marketing: false,
  });

  useEffect(() => {
    // Show banner if user hasn't responded yet
    const hasResponse = hasConsentResponse();
    setIsVisible(!hasResponse);

    // Load existing preferences if available
    if (hasResponse) {
      const consent = getConsent();
      if (consent) {
        setPreferences({
          necessary: consent.necessary,
          analytics: consent.analytics,
          marketing: consent.marketing,
        });
      }
    }
  }, []);

  const handleAcceptAll = () => {
    acceptAll();
    setIsVisible(false);
  };

  const handleRejectAll = () => {
    rejectAll();
    setIsVisible(false);
  };

  const handleSavePreferences = () => {
    saveConsent(preferences);
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <>
      {/* Backdrop overlay */}
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[9998]" />

      {/* Cookie banner */}
      <div className="fixed bottom-0 left-0 right-0 z-[9999] p-4 sm:p-6">
        <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-2xl border border-gray-200">
          <div className="p-6 sm:p-8">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Cookie className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">
                    Nous respectons votre vie privée
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Conforme au RGPD
                  </p>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="mb-6">
              <p className="text-gray-700 leading-relaxed">
                Nous utilisons des cookies pour améliorer votre expérience, analyser le trafic
                et personnaliser le contenu. Vous pouvez choisir les cookies que vous acceptez.
              </p>
            </div>

            {/* Details section (expandable) */}
            {showDetails && (
              <div className="mb-6 space-y-4 p-4 bg-gray-50 rounded-xl">
                {/* Necessary cookies */}
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 mb-1">
                      Cookies nécessaires
                    </h4>
                    <p className="text-sm text-gray-600">
                      Essentiels au fonctionnement du site (authentification, sécurité, préférences).
                    </p>
                  </div>
                  <div className="ml-4 flex items-center">
                    <input
                      type="checkbox"
                      checked={true}
                      disabled
                      className="w-5 h-5 text-orange-600 border-gray-300 rounded focus:ring-orange-500 disabled:opacity-50"
                    />
                    <span className="ml-2 text-sm text-gray-500">Toujours actifs</span>
                  </div>
                </div>

                {/* Analytics cookies */}
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 mb-1">
                      Cookies analytiques
                    </h4>
                    <p className="text-sm text-gray-600">
                      Nous aident à comprendre comment vous utilisez le site pour l'améliorer
                      (Google Analytics, PostHog).
                    </p>
                  </div>
                  <div className="ml-4">
                    <input
                      type="checkbox"
                      checked={preferences.analytics}
                      onChange={(e) =>
                        setPreferences({ ...preferences, analytics: e.target.checked })
                      }
                      className="w-5 h-5 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                    />
                  </div>
                </div>

                {/* Marketing cookies */}
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 mb-1">
                      Cookies marketing
                    </h4>
                    <p className="text-sm text-gray-600">
                      Utilisés pour vous proposer des publicités pertinentes et mesurer leur efficacité.
                    </p>
                  </div>
                  <div className="ml-4">
                    <input
                      type="checkbox"
                      checked={preferences.marketing}
                      onChange={(e) =>
                        setPreferences({ ...preferences, marketing: e.target.checked })
                      }
                      className="w-5 h-5 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                    />
                  </div>
                </div>

                {/* Links */}
                <div className="pt-4 border-t border-gray-200">
                  <p className="text-sm text-gray-600">
                    Pour plus d'informations, consultez notre{' '}
                    <a href="/privacy" className="text-orange-600 hover:text-orange-700 font-medium">
                      politique de confidentialité
                    </a>{' '}
                    et nos{' '}
                    <a href="/terms" className="text-orange-600 hover:text-orange-700 font-medium">
                      conditions d'utilisation
                    </a>
                    .
                  </p>
                </div>
              </div>
            )}

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              {showDetails ? (
                <>
                  <button
                    onClick={() => setShowDetails(false)}
                    className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition"
                  >
                    Retour
                  </button>
                  <button
                    onClick={handleSavePreferences}
                    className="flex-1 px-6 py-3 bg-orange-600 text-white font-medium rounded-xl hover:bg-orange-700 transition shadow-lg shadow-orange-600/30"
                  >
                    Enregistrer mes préférences
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={handleRejectAll}
                    className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition"
                  >
                    Refuser tout
                  </button>
                  <button
                    onClick={() => setShowDetails(true)}
                    className="flex-1 px-6 py-3 border-2 border-orange-600 text-orange-600 font-medium rounded-xl hover:bg-orange-50 transition flex items-center justify-center gap-2"
                  >
                    <Settings className="w-5 h-5" />
                    Personnaliser
                  </button>
                  <button
                    onClick={handleAcceptAll}
                    className="flex-1 px-6 py-3 bg-orange-600 text-white font-medium rounded-xl hover:bg-orange-700 transition shadow-lg shadow-orange-600/30"
                  >
                    Accepter tout
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
