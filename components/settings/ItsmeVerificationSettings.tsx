'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Shield,
  CheckCircle,
  AlertCircle,
  Loader2,
  ExternalLink,
  User,
  Calendar,
  Globe,
  BadgeCheck,
  Info,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useSearchParams } from 'next/navigation';
import { toast } from 'sonner';

// =============================================================================
// TYPES
// =============================================================================

interface ItsmeVerificationData {
  isVerified: boolean;
  verifiedAt?: string;
  givenName?: string;
  familyName?: string;
  birthdate?: string;
  nationality?: string;
}

interface ItsmeVerificationSettingsProps {
  onStatusChange?: (verified: boolean) => void;
  verificationData?: ItsmeVerificationData;
}

// =============================================================================
// ITSME LOGO COMPONENT
// =============================================================================

function ItsmeLogo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 120 40"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="120" height="40" rx="8" fill="#FF6B35" />
      <text
        x="60"
        y="27"
        textAnchor="middle"
        fill="white"
        fontFamily="Arial, sans-serif"
        fontWeight="bold"
        fontSize="18"
      >
        itsme
      </text>
    </svg>
  );
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export default function ItsmeVerificationSettings({
  onStatusChange,
  verificationData,
}: ItsmeVerificationSettingsProps) {
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [isVerified, setIsVerified] = useState(verificationData?.isVerified ?? false);
  const [userData, setUserData] = useState(verificationData);
  const [error, setError] = useState<string | null>(null);
  const [showInfo, setShowInfo] = useState(false);

  // Check for ITSME callback results
  useEffect(() => {
    const itsmeVerified = searchParams.get('itsme_verified');
    const itsmeError = searchParams.get('error');

    if (itsmeVerified === 'true') {
      setIsVerified(true);
      onStatusChange?.(true);
      toast.success('Identité vérifiée!', {
        description: 'Votre identité a été vérifiée avec succès via ITSME.',
      });

      // Clean URL
      window.history.replaceState({}, '', window.location.pathname);
    }

    if (itsmeError) {
      const errorMessages: Record<string, string> = {
        itsme_access_denied: 'Vous avez annulé la vérification ITSME.',
        itsme_not_configured: 'La vérification ITSME n\'est pas configurée.',
        state_mismatch: 'Erreur de sécurité. Veuillez réessayer.',
        session_expired: 'Session expirée. Veuillez réessayer.',
        verification_failed: 'La vérification a échoué. Veuillez réessayer.',
      };

      setError(errorMessages[itsmeError] || 'Une erreur est survenue.');

      // Clean URL
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, [searchParams, onStatusChange]);

  // Start ITSME verification
  const handleStartVerification = () => {
    setIsLoading(true);
    setError(null);

    // Redirect to ITSME authorization endpoint
    const returnUrl = encodeURIComponent(window.location.pathname);
    window.location.href = `/api/auth/itsme/authorize?returnUrl=${returnUrl}`;
  };

  // Format date for display
  const formatDate = (dateStr?: string) => {
    if (!dateStr) return null;
    try {
      return new Date(dateStr).toLocaleDateString('fr-BE', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className={cn(
          "w-10 h-10 rounded-xl flex items-center justify-center",
          isVerified
            ? "bg-emerald-100 text-emerald-600"
            : "bg-orange-100 text-orange-600"
        )}>
          <BadgeCheck className="w-5 h-5" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900">Vérification d'identité ITSME</h3>
          <p className="text-sm text-gray-500">
            {isVerified
              ? 'Votre identité est vérifiée'
              : 'Vérifiez votre identité avec l\'app ITSME'
            }
          </p>
        </div>

        {isVerified && (
          <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-full text-sm font-medium">
            <CheckCircle className="w-4 h-4" />
            Vérifié
          </div>
        )}
      </div>

      <AnimatePresence mode="wait">
        {/* NOT VERIFIED STATE */}
        {!isVerified && (
          <motion.div
            key="not-verified"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-4"
          >
            {/* ITSME Logo & Description */}
            <div className="bg-gradient-to-br from-orange-50 to-orange-100/50 rounded-xl p-6 text-center">
              <div className="flex justify-center mb-4">
                <ItsmeLogo className="w-32 h-auto" />
              </div>
              <p className="text-gray-700 mb-2">
                <strong>ITSME</strong> est l'identité numérique belge officielle.
              </p>
              <p className="text-sm text-gray-600">
                La vérification est rapide, sécurisée et gratuite.
              </p>
            </div>

            {/* Benefits */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                <Shield className="w-5 h-5 text-blue-600" />
                <span className="text-sm text-gray-700">Sécurisé</span>
              </div>
              <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                <User className="w-5 h-5 text-green-600" />
                <span className="text-sm text-gray-700">Badge vérifié</span>
              </div>
              <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                <Globe className="w-5 h-5 text-purple-600" />
                <span className="text-sm text-gray-700">Confiance</span>
              </div>
            </div>

            {/* Info toggle */}
            <button
              onClick={() => setShowInfo(!showInfo)}
              className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
            >
              <Info className="w-4 h-4" />
              {showInfo ? 'Masquer les informations' : 'Quelles données sont vérifiées ?'}
            </button>

            <AnimatePresence>
              {showInfo && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-blue-50 rounded-lg p-4 text-sm text-blue-800"
                >
                  <p className="font-medium mb-2">ITSME vérifie :</p>
                  <ul className="space-y-1">
                    <li>• Votre nom et prénom officiels</li>
                    <li>• Votre date de naissance</li>
                    <li>• Votre nationalité</li>
                    <li>• Votre numéro de registre national (hashé, jamais stocké en clair)</li>
                  </ul>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Error message */}
            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-50 text-red-700 rounded-lg text-sm">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {error}
              </div>
            )}

            {/* Start button */}
            <Button
              onClick={handleStartVerification}
              disabled={isLoading}
              className="w-full bg-[#FF6B35] hover:bg-[#E55A2B] text-white"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Redirection vers ITSME...
                </>
              ) : (
                <>
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Vérifier avec ITSME
                </>
              )}
            </Button>

            <p className="text-xs text-gray-500 text-center">
              Vous serez redirigé vers l'application ITSME pour confirmer votre identité.
              <br />
              <a
                href="https://www.itsme.be/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                Télécharger l'app ITSME
              </a>
            </p>
          </motion.div>
        )}

        {/* VERIFIED STATE */}
        {isVerified && (
          <motion.div
            key="verified"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-4"
          >
            {/* Verified info card */}
            <div className="bg-emerald-50 rounded-xl p-4 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                  <BadgeCheck className="w-6 h-6 text-emerald-600" />
                </div>
                <div>
                  <p className="font-semibold text-emerald-800">
                    {userData?.givenName && userData?.familyName
                      ? `${userData.givenName} ${userData.familyName}`
                      : 'Identité vérifiée'
                    }
                  </p>
                  <p className="text-sm text-emerald-600">
                    Vérifié via ITSME
                  </p>
                </div>
              </div>

              {/* Verified data */}
              {(userData?.birthdate || userData?.nationality) && (
                <div className="grid grid-cols-2 gap-3 pt-3 border-t border-emerald-200">
                  {userData?.birthdate && (
                    <div className="flex items-center gap-2 text-sm text-emerald-700">
                      <Calendar className="w-4 h-4" />
                      {formatDate(userData.birthdate)}
                    </div>
                  )}
                  {userData?.nationality && (
                    <div className="flex items-center gap-2 text-sm text-emerald-700">
                      <Globe className="w-4 h-4" />
                      {userData.nationality}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Benefits of being verified */}
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="font-medium text-gray-900 mb-2">Avantages du badge vérifié :</p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-500" />
                  Profil de confiance pour les propriétaires
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-500" />
                  Priorité dans les résultats de recherche
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-500" />
                  Badge "Vérifié" sur votre profil
                </li>
              </ul>
            </div>

            {userData?.verifiedAt && (
              <p className="text-xs text-gray-500 text-center">
                Vérifié le {formatDate(userData.verifiedAt)}
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
