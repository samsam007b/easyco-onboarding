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
  Clock,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { useLanguage } from '@/lib/i18n/use-language';

// =============================================================================
// FEATURE FLAG - Set to true when ITSME is configured
// =============================================================================

const ITSME_VERIFICATION_ENABLED = false;

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
  const { language, getSection } = useLanguage();
  const verification = getSection('verification');

  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [isVerified, setIsVerified] = useState(verificationData?.isVerified ?? false);
  const [userData, setUserData] = useState(verificationData);
  const [error, setError] = useState<string | null>(null);
  const [showInfo, setShowInfo] = useState(false);

  // Locale mapping for date formatting
  const localeMap: Record<string, string> = {
    fr: 'fr-BE',
    en: 'en-US',
    nl: 'nl-BE',
    de: 'de-DE',
  };

  // Check for ITSME callback results
  useEffect(() => {
    const itsmeVerified = searchParams.get('itsme_verified');
    const itsmeError = searchParams.get('error');

    if (itsmeVerified === 'true') {
      setIsVerified(true);
      onStatusChange?.(true);
      toast.success(verification?.itsme?.identityVerified || 'Identity verified!', {
        description: verification?.itsme?.identityVerifiedSuccess || 'Your identity has been verified successfully via ITSME.',
      });

      // Clean URL
      window.history.replaceState({}, '', window.location.pathname);
    }

    if (itsmeError) {
      const errorMessages: Record<string, string> = {
        itsme_access_denied: verification?.itsme?.errors?.accessDenied || 'You cancelled the ITSME verification.',
        itsme_not_configured: verification?.itsme?.errors?.notConfigured || 'ITSME verification is not configured.',
        state_mismatch: verification?.itsme?.errors?.stateMismatch || 'Security error. Please try again.',
        session_expired: verification?.itsme?.errors?.sessionExpired || 'Session expired. Please try again.',
        verification_failed: verification?.itsme?.errors?.verificationFailed || 'Verification failed. Please try again.',
      };

      setError(errorMessages[itsmeError] || verification?.itsme?.errors?.generic || 'An error occurred.');

      // Clean URL
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, [searchParams, onStatusChange, verification]);

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
      return new Date(dateStr).toLocaleDateString(localeMap[language] || 'en-US', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  // =========================================================================
  // COMING SOON STATE
  // =========================================================================

  if (!ITSME_VERIFICATION_ENABLED) {
    return (
      <div className="bg-white superellipse-2xl border border-gray-200 p-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 superellipse-xl flex items-center justify-center bg-gray-100 text-gray-400">
            <BadgeCheck className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900">{verification?.itsme?.title || 'ITSME Identity Verification'}</h3>
            <p className="text-sm text-gray-500">
              {verification?.itsme?.subtitle || 'Verify your identity with the ITSME app'}
            </p>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-50 text-amber-700 rounded-full text-sm font-medium">
            <Clock className="w-4 h-4" />
            {verification?.comingSoon || 'Coming Soon'}
          </div>
        </div>

        {/* Coming Soon Content */}
        <div className="bg-gradient-to-br from-orange-50 to-orange-100/50 superellipse-xl p-5">
          <div className="flex justify-center mb-4">
            <ItsmeLogo className="w-28 h-auto opacity-60" />
          </div>
          <p className="text-sm text-gray-700 text-center mb-2">
            <strong>ITSME</strong> {verification?.itsme?.officialIdentity || 'is the official Belgian digital identity.'}
          </p>
          <p className="text-xs text-gray-500 text-center">
            {verification?.itsme?.comingSoonDescription || 'Soon, you will be able to verify your identity in seconds with the ITSME app to earn a premium trust badge on your profile.'}
          </p>
        </div>

        {/* Benefits preview */}
        <div className="mt-4 grid grid-cols-3 gap-2">
          <div className="flex flex-col items-center gap-1.5 p-2 bg-gray-50 rounded-lg">
            <Shield className="w-4 h-4 text-gray-400" />
            <span className="text-xs text-gray-500">{verification?.itsme?.secure || 'Secure'}</span>
          </div>
          <div className="flex flex-col items-center gap-1.5 p-2 bg-gray-50 rounded-lg">
            <User className="w-4 h-4 text-gray-400" />
            <span className="text-xs text-gray-500">{verification?.itsme?.verifiedBadge || 'Verified badge'}</span>
          </div>
          <div className="flex flex-col items-center gap-1.5 p-2 bg-gray-50 rounded-lg">
            <Globe className="w-4 h-4 text-gray-400" />
            <span className="text-xs text-gray-500">{verification?.itsme?.trust || 'Trust'}</span>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // ACTIVE STATE (when ITSME is configured)
  // =========================================================================

  return (
    <div className="bg-white superellipse-2xl border border-gray-200 p-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className={cn(
          "w-10 h-10 superellipse-xl flex items-center justify-center",
          isVerified
            ? "bg-emerald-100 text-emerald-600"
            : "bg-orange-100 text-orange-600"
        )}>
          <BadgeCheck className="w-5 h-5" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900">{verification?.itsme?.title || 'ITSME Identity Verification'}</h3>
          <p className="text-sm text-gray-500">
            {isVerified
              ? (verification?.itsme?.identityIsVerified || 'Your identity is verified')
              : (verification?.itsme?.subtitle || 'Verify your identity with the ITSME app')
            }
          </p>
        </div>

        {isVerified && (
          <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-full text-sm font-medium">
            <CheckCircle className="w-4 h-4" />
            {verification?.verified || 'Verified'}
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
            <div className="bg-gradient-to-br from-orange-50 to-orange-100/50 superellipse-xl p-6 text-center">
              <div className="flex justify-center mb-4">
                <ItsmeLogo className="w-32 h-auto" />
              </div>
              <p className="text-gray-700 mb-2">
                <strong>ITSME</strong> {verification?.itsme?.officialIdentity || 'is the official Belgian digital identity.'}
              </p>
              <p className="text-sm text-gray-600">
                {verification?.itsme?.fastSecureFree || 'Verification is fast, secure and free.'}
              </p>
            </div>

            {/* Benefits */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                <Shield className="w-5 h-5 text-blue-600" />
                <span className="text-sm text-gray-700">{verification?.itsme?.secure || 'Secure'}</span>
              </div>
              <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                <User className="w-5 h-5 text-green-600" />
                <span className="text-sm text-gray-700">{verification?.itsme?.verifiedBadge || 'Verified badge'}</span>
              </div>
              <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                <Globe className="w-5 h-5 text-purple-600" />
                <span className="text-sm text-gray-700">{verification?.itsme?.trust || 'Trust'}</span>
              </div>
            </div>

            {/* Info toggle */}
            <button
              onClick={() => setShowInfo(!showInfo)}
              className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
            >
              <Info className="w-4 h-4" />
              {showInfo ? (verification?.itsme?.hideInfo || 'Hide information') : (verification?.itsme?.whatDataVerified || 'What data is verified?')}
            </button>

            <AnimatePresence>
              {showInfo && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-blue-50 rounded-lg p-4 text-sm text-blue-800"
                >
                  <p className="font-medium mb-2">{verification?.itsme?.itsmeVerifies || 'ITSME verifies:'}</p>
                  <ul className="space-y-1">
                    <li>• {verification?.itsme?.verifyItem1 || 'Your official first and last name'}</li>
                    <li>• {verification?.itsme?.verifyItem2 || 'Your date of birth'}</li>
                    <li>• {verification?.itsme?.verifyItem3 || 'Your nationality'}</li>
                    <li>• {verification?.itsme?.verifyItem4 || 'Your national registry number (hashed, never stored in plain text)'}</li>
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
                  {verification?.itsme?.redirectingToItsme || 'Redirecting to ITSME...'}
                </>
              ) : (
                <>
                  <ExternalLink className="w-4 h-4 mr-2" />
                  {verification?.itsme?.verifyWithItsme || 'Verify with ITSME'}
                </>
              )}
            </Button>

            <p className="text-xs text-gray-500 text-center">
              {verification?.itsme?.redirectDescription || 'You will be redirected to the ITSME app to confirm your identity.'}
              <br />
              <a
                href="https://www.itsme.be/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                {verification?.itsme?.downloadApp || 'Download the ITSME app'}
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
            <div className="bg-emerald-50 superellipse-xl p-4 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                  <BadgeCheck className="w-6 h-6 text-emerald-600" />
                </div>
                <div>
                  <p className="font-semibold text-emerald-800">
                    {userData?.givenName && userData?.familyName
                      ? `${userData.givenName} ${userData.familyName}`
                      : (verification?.itsme?.identityVerified || 'Identity verified')
                    }
                  </p>
                  <p className="text-sm text-emerald-600">
                    {verification?.itsme?.verifiedViaItsme || 'Verified via ITSME'}
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
            <div className="bg-gray-50 superellipse-xl p-4">
              <p className="font-medium text-gray-900 mb-2">{verification?.itsme?.verifiedBenefits || 'Benefits of being verified:'}</p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-500" />
                  {verification?.itsme?.benefitTrust || 'Trusted profile for landlords'}
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-500" />
                  {verification?.itsme?.benefitPriority || 'Priority in search results'}
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-500" />
                  {verification?.itsme?.benefitBadge || '"Verified" badge on your profile'}
                </li>
              </ul>
            </div>

            {userData?.verifiedAt && (
              <p className="text-xs text-gray-500 text-center">
                {verification?.itsme?.verifiedOn || 'Verified on'} {formatDate(userData.verifiedAt)}
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
