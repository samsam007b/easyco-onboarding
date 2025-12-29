'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Smartphone,
  Shield,
  CheckCircle,
  AlertCircle,
  Copy,
  ExternalLink,
  Trash2,
  Loader2,
  QrCode,
  KeyRound
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  getMFAStatus,
  enrollMFA,
  verifyMFAEnrollment,
  unenrollMFA,
  type MFAStatus,
  type MFAFactor
} from '@/lib/auth/mfa';

// =============================================================================
// TYPES
// =============================================================================

type SetupStep = 'initial' | 'scanning' | 'verifying' | 'success';

interface MFASettingsProps {
  onStatusChange?: (enabled: boolean) => void;
}

// =============================================================================
// OTP INPUT COMPONENT
// =============================================================================

function OTPInput({
  value,
  onChange,
  disabled = false
}: {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value.replace(/\D/g, '').slice(0, 6);
    onChange(newValue);
  };

  return (
    <div className="flex justify-center gap-2">
      {[0, 1, 2, 3, 4, 5].map((index) => (
        <div
          key={index}
          className={cn(
            "w-12 h-14 rounded-xl border-2 flex items-center justify-center text-2xl font-bold transition-all",
            value[index]
              ? "border-emerald-500 bg-emerald-50 text-emerald-700"
              : "border-gray-300 bg-white text-gray-400",
            disabled && "opacity-50"
          )}
        >
          {value[index] || '-'}
        </div>
      ))}
      <input
        type="text"
        inputMode="numeric"
        pattern="[0-9]*"
        value={value}
        onChange={handleChange}
        disabled={disabled}
        className="absolute opacity-0 w-0 h-0"
        autoFocus
      />
    </div>
  );
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export default function MFASettings({ onStatusChange }: MFASettingsProps) {
  const [mfaStatus, setMfaStatus] = useState<MFAStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [setupStep, setSetupStep] = useState<SetupStep>('initial');
  const [setupData, setSetupData] = useState<{
    factorId: string;
    qrCode: string;
    secret: string;
  } | null>(null);
  const [verificationCode, setVerificationCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [secretCopied, setSecretCopied] = useState(false);

  // Load MFA status on mount
  useEffect(() => {
    loadMFAStatus();
  }, []);

  const loadMFAStatus = async () => {
    setIsLoading(true);
    try {
      const status = await getMFAStatus();
      setMfaStatus(status);
    } catch (err) {
      console.error('Error loading MFA status:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Auto-submit when 6 digits entered
  useEffect(() => {
    if (verificationCode.length === 6 && setupStep === 'verifying' && !isSubmitting) {
      handleVerify();
    }
  }, [verificationCode]);

  const handleStartSetup = async () => {
    setError(null);
    setIsSubmitting(true);

    try {
      const result = await enrollMFA('Mon Application Authenticator');

      if (!result.success || !result.qrCode || !result.secret || !result.factorId) {
        setError(result.error || 'Erreur lors de la configuration MFA');
        return;
      }

      setSetupData({
        factorId: result.factorId,
        qrCode: result.qrCode,
        secret: result.secret,
      });
      setSetupStep('scanning');
    } catch (err) {
      setError('Erreur inattendue lors de la configuration');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleProceedToVerify = () => {
    setSetupStep('verifying');
    setVerificationCode('');
  };

  const handleVerify = async () => {
    if (!setupData || verificationCode.length !== 6) return;

    setError(null);
    setIsSubmitting(true);

    try {
      const result = await verifyMFAEnrollment(setupData.factorId, verificationCode);

      if (!result.success) {
        setError(result.error || 'Code invalide');
        setVerificationCode('');
        return;
      }

      setSetupStep('success');
      await loadMFAStatus();
      onStatusChange?.(true);
    } catch (err) {
      setError('Erreur lors de la vérification');
      setVerificationCode('');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDisableMFA = async (factorId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir désactiver l\'authentification à deux facteurs ?')) {
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const result = await unenrollMFA(factorId);

      if (!result.success) {
        setError(result.error || 'Erreur lors de la désactivation');
        return;
      }

      await loadMFAStatus();
      onStatusChange?.(false);
    } catch (err) {
      setError('Erreur lors de la désactivation');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopySecret = () => {
    if (setupData?.secret) {
      navigator.clipboard.writeText(setupData.secret);
      setSecretCopied(true);
      setTimeout(() => setSecretCopied(false), 2000);
    }
  };

  const handleCancel = () => {
    setSetupStep('initial');
    setSetupData(null);
    setVerificationCode('');
    setError(null);
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200 shadow-sm">
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
        </div>
      </div>
    );
  }

  // MFA is enabled - show status
  if (mfaStatus?.enabled && setupStep === 'initial') {
    return (
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-100 to-green-100 flex items-center justify-center">
            <Smartphone className="w-6 h-6 text-emerald-700" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Authentification à deux facteurs</h2>
            <p className="text-sm text-gray-600">Sécurisez votre compte avec un code supplémentaire</p>
          </div>
        </div>

        {/* MFA Enabled Status */}
        <div className="bg-emerald-50 rounded-xl p-4 mb-6 border border-emerald-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <p className="font-semibold text-emerald-800">2FA activée</p>
              <p className="text-sm text-emerald-600">
                Votre compte est protégé par l'authentification à deux facteurs
              </p>
            </div>
          </div>
        </div>

        {/* Enrolled Factors */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-gray-700">Méthodes d'authentification</h3>
          {mfaStatus.factors.map((factor) => (
            <div
              key={factor.id}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-xl"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center border border-gray-200">
                  <KeyRound className="w-5 h-5 text-gray-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">
                    {factor.friendly_name || 'Application Authenticator'}
                  </p>
                  <p className="text-xs text-gray-500">
                    Ajouté le {new Date(factor.created_at).toLocaleDateString('fr-FR')}
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDisableMFA(factor.id)}
                disabled={isSubmitting}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                {isSubmitting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Trash2 className="w-4 h-4" />
                )}
              </Button>
            </div>
          ))}
        </div>

        {error && (
          <div className="mt-4 p-3 bg-red-50 rounded-xl text-red-600 text-sm flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            {error}
          </div>
        )}
      </div>
    );
  }

  // Setup flow
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200 shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-100 to-violet-100 flex items-center justify-center">
          <Shield className="w-6 h-6 text-purple-700" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">Authentification à deux facteurs</h2>
          <p className="text-sm text-gray-600">Ajoutez une couche de sécurité supplémentaire</p>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {/* Step 1: Initial - Explain & Start */}
        {setupStep === 'initial' && (
          <motion.div
            key="initial"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <div className="bg-amber-50 rounded-xl p-4 mb-6 border border-amber-200">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-amber-800">2FA non activée</p>
                  <p className="text-sm text-amber-700 mt-1">
                    Votre compte n'est pas protégé par l'authentification à deux facteurs.
                    Activez-la pour une sécurité renforcée.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4 mb-6">
              <h3 className="font-semibold text-gray-900">Comment ça marche ?</h3>
              <div className="grid gap-3">
                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
                  <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center text-purple-700 font-bold text-sm">
                    1
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Installez une application</p>
                    <p className="text-sm text-gray-600">
                      Google Authenticator, Authy, ou 1Password
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
                  <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center text-purple-700 font-bold text-sm">
                    2
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Scannez le QR code</p>
                    <p className="text-sm text-gray-600">
                      Liez votre compte à l'application
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
                  <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center text-purple-700 font-bold text-sm">
                    3
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Entrez le code</p>
                    <p className="text-sm text-gray-600">
                      Un code à 6 chiffres pour confirmer
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <Button
              onClick={handleStartSetup}
              disabled={isSubmitting}
              className="w-full rounded-xl bg-gradient-to-r from-purple-500 to-violet-500 text-white hover:from-purple-600 hover:to-violet-600"
            >
              {isSubmitting ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Shield className="w-4 h-4 mr-2" />
              )}
              Activer l'authentification 2FA
            </Button>

            {error && (
              <div className="mt-4 p-3 bg-red-50 rounded-xl text-red-600 text-sm flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {error}
              </div>
            )}
          </motion.div>
        )}

        {/* Step 2: Scanning QR Code */}
        {setupStep === 'scanning' && setupData && (
          <motion.div
            key="scanning"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-center"
          >
            <div className="mb-4">
              <h3 className="font-semibold text-gray-900 mb-2">Scannez ce QR code</h3>
              <p className="text-sm text-gray-600">
                Ouvrez votre application d'authentification et scannez ce code
              </p>
            </div>

            {/* QR Code */}
            <div className="flex justify-center mb-4">
              <div className="p-4 bg-white rounded-2xl border-2 border-gray-200 shadow-sm">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={setupData.qrCode}
                  alt="QR Code pour configuration 2FA"
                  className="w-48 h-48"
                />
              </div>
            </div>

            {/* Manual Entry */}
            <div className="mb-6">
              <p className="text-xs text-gray-500 mb-2">
                Ou entrez ce code manuellement :
              </p>
              <div className="flex items-center justify-center gap-2">
                <code className="px-3 py-2 bg-gray-100 rounded-lg font-mono text-sm text-gray-800 select-all">
                  {setupData.secret}
                </code>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCopySecret}
                  className="p-2"
                >
                  {secretCopied ? (
                    <CheckCircle className="w-4 h-4 text-emerald-500" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={handleCancel}
                className="flex-1 rounded-xl"
              >
                Annuler
              </Button>
              <Button
                onClick={handleProceedToVerify}
                className="flex-1 rounded-xl bg-gradient-to-r from-purple-500 to-violet-500 text-white hover:from-purple-600 hover:to-violet-600"
              >
                Continuer
              </Button>
            </div>
          </motion.div>
        )}

        {/* Step 3: Verifying Code */}
        {setupStep === 'verifying' && (
          <motion.div
            key="verifying"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-center"
          >
            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-2">Entrez le code</h3>
              <p className="text-sm text-gray-600">
                Entrez le code à 6 chiffres affiché dans votre application
              </p>
            </div>

            {/* OTP Input */}
            <div className="mb-6 relative">
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={6}
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                disabled={isSubmitting}
                autoFocus
                className="w-full text-center text-3xl font-mono tracking-[0.5em] py-4 px-6 rounded-xl border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="------"
              />
              {isSubmitting && (
                <div className="absolute inset-0 flex items-center justify-center bg-white/80 rounded-xl">
                  <Loader2 className="w-6 h-6 animate-spin text-purple-500" />
                </div>
              )}
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-50 rounded-xl text-red-600 text-sm flex items-center justify-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {error}
              </div>
            )}

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={handleCancel}
                disabled={isSubmitting}
                className="flex-1 rounded-xl"
              >
                Annuler
              </Button>
              <Button
                onClick={handleVerify}
                disabled={isSubmitting || verificationCode.length !== 6}
                className="flex-1 rounded-xl bg-gradient-to-r from-purple-500 to-violet-500 text-white hover:from-purple-600 hover:to-violet-600"
              >
                {isSubmitting ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <CheckCircle className="w-4 h-4 mr-2" />
                )}
                Vérifier
              </Button>
            </div>
          </motion.div>
        )}

        {/* Step 4: Success */}
        {setupStep === 'success' && (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-6"
          >
            <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-10 h-10 text-emerald-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">2FA activée avec succès !</h3>
            <p className="text-gray-600 mb-6">
              Votre compte est maintenant protégé par l'authentification à deux facteurs.
            </p>
            <Button
              onClick={() => setSetupStep('initial')}
              className="rounded-xl bg-gradient-to-r from-emerald-500 to-green-500 text-white hover:from-emerald-600 hover:to-green-600"
            >
              Terminé
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
