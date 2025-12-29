'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Phone,
  CheckCircle,
  AlertCircle,
  Loader2,
  Send,
  RefreshCw,
  Shield,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

// =============================================================================
// TYPES
// =============================================================================

type VerificationStep = 'idle' | 'sending' | 'pending' | 'verifying' | 'verified';

interface PhoneVerificationSettingsProps {
  onStatusChange?: (verified: boolean) => void;
  initialPhone?: string;
  isVerified?: boolean;
}

// =============================================================================
// OTP INPUT COMPONENT
// =============================================================================

function OTPInput({
  value,
  onChange,
  disabled = false,
  onComplete,
}: {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  onComplete?: () => void;
}) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value.replace(/\D/g, '').slice(0, 6);
    onChange(newValue);

    if (newValue.length === 6 && onComplete) {
      onComplete();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && value.length === 6 && onComplete) {
      onComplete();
    }
  };

  return (
    <div className="relative">
      <div className="flex justify-center gap-2">
        {[0, 1, 2, 3, 4, 5].map((index) => (
          <div
            key={index}
            className={cn(
              "w-11 h-13 rounded-xl border-2 flex items-center justify-center text-xl font-bold transition-all",
              value[index]
                ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                : "border-gray-300 bg-white text-gray-400",
              disabled && "opacity-50"
            )}
          >
            {value[index] || '-'}
          </div>
        ))}
      </div>
      <input
        type="text"
        inputMode="numeric"
        pattern="[0-9]*"
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        className="absolute inset-0 opacity-0 cursor-pointer"
        autoFocus
        aria-label="Code de vérification"
      />
    </div>
  );
}

// =============================================================================
// COUNTDOWN TIMER
// =============================================================================

function CountdownTimer({
  seconds,
  onComplete,
}: {
  seconds: number;
  onComplete: () => void;
}) {
  const [remaining, setRemaining] = useState(seconds);

  useEffect(() => {
    if (remaining <= 0) {
      onComplete();
      return;
    }

    const timer = setTimeout(() => {
      setRemaining(remaining - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [remaining, onComplete]);

  const minutes = Math.floor(remaining / 60);
  const secs = remaining % 60;

  return (
    <span className="font-mono text-gray-500">
      {minutes}:{secs.toString().padStart(2, '0')}
    </span>
  );
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export default function PhoneVerificationSettings({
  onStatusChange,
  initialPhone = '',
  isVerified: initialVerified = false,
}: PhoneVerificationSettingsProps) {
  const [step, setStep] = useState<VerificationStep>(initialVerified ? 'verified' : 'idle');
  const [phoneNumber, setPhoneNumber] = useState(initialPhone);
  const [maskedPhone, setMaskedPhone] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [canResend, setCanResend] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(60);

  // Format phone number as user types
  const formatPhoneInput = (value: string) => {
    // Remove non-digits except +
    let cleaned = value.replace(/[^\d+]/g, '');

    // If starts with 0, assume French number
    if (cleaned.startsWith('0') && cleaned.length <= 10) {
      // Format as: 06 12 34 56 78
      const digits = cleaned.slice(0, 10);
      const parts = digits.match(/.{1,2}/g) || [];
      return parts.join(' ');
    }

    // If starts with +, format international
    if (cleaned.startsWith('+')) {
      // +33 6 12 34 56 78
      if (cleaned.startsWith('+33') && cleaned.length > 3) {
        const rest = cleaned.slice(3);
        const parts = rest.match(/.{1,2}/g) || [];
        return `+33 ${parts.join(' ')}`;
      }
      if (cleaned.startsWith('+32') && cleaned.length > 3) {
        const rest = cleaned.slice(3);
        const parts = rest.match(/.{1,2}/g) || [];
        return `+32 ${parts.join(' ')}`;
      }
    }

    return cleaned;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneInput(e.target.value);
    setPhoneNumber(formatted);
    setError(null);
  };

  // Send OTP
  const handleSendOTP = async () => {
    if (!phoneNumber.trim()) {
      setError('Veuillez entrer un numéro de téléphone');
      return;
    }

    setIsLoading(true);
    setError(null);
    setStep('sending');

    try {
      const response = await fetch('/api/auth/phone/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Erreur lors de l\'envoi du code');
        setStep('idle');
        return;
      }

      setMaskedPhone(data.maskedPhone || phoneNumber);
      setStep('pending');
      setCanResend(false);
      setResendCooldown(60);

      toast.success('Code envoyé!', {
        description: `Un code de vérification a été envoyé au ${data.maskedPhone}`,
      });
    } catch (err) {
      setError('Erreur de connexion. Veuillez réessayer.');
      setStep('idle');
    } finally {
      setIsLoading(false);
    }
  };

  // Verify OTP
  const handleVerifyOTP = useCallback(async () => {
    if (otpCode.length !== 6) return;

    setIsLoading(true);
    setError(null);
    setStep('verifying');

    try {
      const response = await fetch('/api/auth/phone/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber, code: otpCode }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Code invalide');
        setStep('pending');
        setOtpCode('');
        return;
      }

      setStep('verified');
      onStatusChange?.(true);

      toast.success('Téléphone vérifié!', {
        description: 'Votre numéro de téléphone a été vérifié avec succès.',
      });
    } catch (err) {
      setError('Erreur de connexion. Veuillez réessayer.');
      setStep('pending');
      setOtpCode('');
    } finally {
      setIsLoading(false);
    }
  }, [otpCode, phoneNumber, onStatusChange]);

  // Resend OTP
  const handleResend = async () => {
    if (!canResend) return;

    setOtpCode('');
    await handleSendOTP();
  };

  // Handle cooldown complete
  const handleCooldownComplete = useCallback(() => {
    setCanResend(true);
  }, []);

  // Reset to change number
  const handleChangeNumber = () => {
    setStep('idle');
    setPhoneNumber('');
    setOtpCode('');
    setError(null);
    setMaskedPhone('');
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className={cn(
          "w-10 h-10 rounded-xl flex items-center justify-center",
          step === 'verified'
            ? "bg-emerald-100 text-emerald-600"
            : "bg-blue-100 text-blue-600"
        )}>
          <Phone className="w-5 h-5" />
        </div>
        <div>
          <h3 className="font-semibold text-gray-900">Vérification du téléphone</h3>
          <p className="text-sm text-gray-500">
            {step === 'verified'
              ? 'Votre numéro est vérifié'
              : 'Confirmez votre numéro par SMS'
            }
          </p>
        </div>

        {step === 'verified' && (
          <div className="ml-auto flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-full text-sm font-medium">
            <CheckCircle className="w-4 h-4" />
            Vérifié
          </div>
        )}
      </div>

      <AnimatePresence mode="wait">
        {/* IDLE STATE - Phone input */}
        {step === 'idle' && (
          <motion.div
            key="idle"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-4"
          >
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Numéro de téléphone
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={handlePhoneChange}
                  placeholder="+33 6 12 34 56 78"
                  className={cn(
                    "w-full pl-10 pr-4 py-3 rounded-xl border-2 transition-colors",
                    "focus:outline-none focus:ring-0",
                    error
                      ? "border-red-300 focus:border-red-500"
                      : "border-gray-200 focus:border-blue-500"
                  )}
                />
              </div>
              {error && (
                <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {error}
                </p>
              )}
            </div>

            <Button
              onClick={handleSendOTP}
              disabled={isLoading || !phoneNumber.trim()}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Send className="w-4 h-4 mr-2" />
              )}
              Envoyer le code
            </Button>

            <p className="text-xs text-gray-500 text-center">
              Un code de vérification sera envoyé par SMS à ce numéro.
            </p>
          </motion.div>
        )}

        {/* SENDING STATE */}
        {step === 'sending' && (
          <motion.div
            key="sending"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center py-8"
          >
            <Loader2 className="w-10 h-10 text-blue-600 animate-spin mb-4" />
            <p className="text-gray-600">Envoi du code en cours...</p>
          </motion.div>
        )}

        {/* PENDING STATE - OTP input */}
        {(step === 'pending' || step === 'verifying') && (
          <motion.div
            key="pending"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            <div className="text-center">
              <p className="text-gray-600 mb-1">
                Code envoyé au <span className="font-medium">{maskedPhone}</span>
              </p>
              <button
                onClick={handleChangeNumber}
                className="text-sm text-blue-600 hover:underline"
              >
                Changer de numéro
              </button>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3 text-center">
                Entrez le code à 6 chiffres
              </label>
              <OTPInput
                value={otpCode}
                onChange={setOtpCode}
                disabled={step === 'verifying'}
                onComplete={handleVerifyOTP}
              />
            </div>

            {error && (
              <p className="text-sm text-red-600 flex items-center justify-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {error}
              </p>
            )}

            <div className="flex items-center justify-center gap-2 text-sm">
              {canResend ? (
                <button
                  onClick={handleResend}
                  className="text-blue-600 hover:underline flex items-center gap-1"
                >
                  <RefreshCw className="w-4 h-4" />
                  Renvoyer le code
                </button>
              ) : (
                <span className="text-gray-500">
                  Renvoyer dans{' '}
                  <CountdownTimer
                    seconds={resendCooldown}
                    onComplete={handleCooldownComplete}
                  />
                </span>
              )}
            </div>

            {step === 'verifying' && (
              <div className="flex items-center justify-center gap-2 text-blue-600">
                <Loader2 className="w-4 h-4 animate-spin" />
                Vérification en cours...
              </div>
            )}
          </motion.div>
        )}

        {/* VERIFIED STATE */}
        {step === 'verified' && (
          <motion.div
            key="verified"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-4"
          >
            <div className="flex items-center justify-between p-4 bg-emerald-50 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                  <Shield className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <p className="font-medium text-emerald-800">
                    {maskedPhone || phoneNumber || 'Téléphone vérifié'}
                  </p>
                  <p className="text-sm text-emerald-600">
                    Numéro vérifié avec succès
                  </p>
                </div>
              </div>
              <CheckCircle className="w-6 h-6 text-emerald-600" />
            </div>

            <Button
              variant="outline"
              onClick={handleChangeNumber}
              className="w-full"
            >
              Changer de numéro
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
