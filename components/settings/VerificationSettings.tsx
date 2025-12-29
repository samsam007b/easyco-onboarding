'use client';

import { useState, useEffect, Suspense } from 'react';
import { motion } from 'framer-motion';
import {
  Shield,
  Mail,
  Phone,
  BadgeCheck,
  CheckCircle,
  AlertCircle,
  Loader2,
  ChevronRight,
  Star,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { createClient } from '@/lib/auth/supabase-client';
import PhoneVerificationSettings from './PhoneVerificationSettings';
import ItsmeVerificationSettings from './ItsmeVerificationSettings';

// =============================================================================
// TYPES
// =============================================================================

interface VerificationStatus {
  email: {
    verified: boolean;
    address?: string;
  };
  phone: {
    verified: boolean;
    number?: string;
  };
  itsme: {
    verified: boolean;
    givenName?: string;
    familyName?: string;
    birthdate?: string;
    nationality?: string;
    verifiedAt?: string;
  };
}

interface VerificationSettingsProps {
  onStatusChange?: (status: VerificationStatus) => void;
}

// =============================================================================
// PROGRESS INDICATOR
// =============================================================================

function VerificationProgress({
  emailVerified,
  phoneVerified,
  itsmeVerified,
}: {
  emailVerified: boolean;
  phoneVerified: boolean;
  itsmeVerified: boolean;
}) {
  const total = 3;
  const completed = [emailVerified, phoneVerified, itsmeVerified].filter(Boolean).length;
  const percentage = Math.round((completed / total) * 100);

  // Calculate verification level
  let level: 'starter' | 'basic' | 'verified' | 'premium' = 'starter';
  let levelLabel = 'Débutant';

  if (completed >= 1) {
    level = 'basic';
    levelLabel = 'Basique';
  }
  if (completed >= 2) {
    level = 'verified';
    levelLabel = 'Vérifié';
  }
  if (completed === 3) {
    level = 'premium';
    levelLabel = 'Premium';
  }

  const levelColors = {
    starter: 'from-gray-400 to-gray-500',
    basic: 'from-blue-400 to-blue-600',
    verified: 'from-emerald-400 to-emerald-600',
    premium: 'from-amber-400 to-orange-500',
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-semibold text-gray-900">Niveau de confiance</h3>
          <p className="text-sm text-gray-500">{completed}/{total} vérifications complétées</p>
        </div>
        <div className={cn(
          "px-4 py-2 rounded-full text-white font-medium bg-gradient-to-r",
          levelColors[level]
        )}>
          <div className="flex items-center gap-2">
            {level === 'premium' && <Star className="w-4 h-4" />}
            {levelLabel}
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className={cn(
            "h-full rounded-full bg-gradient-to-r",
            levelColors[level]
          )}
        />
      </div>

      {/* Individual indicators */}
      <div className="flex items-center justify-between mt-4 text-sm">
        <div className="flex items-center gap-2">
          {emailVerified ? (
            <CheckCircle className="w-4 h-4 text-emerald-500" />
          ) : (
            <AlertCircle className="w-4 h-4 text-gray-300" />
          )}
          <span className={emailVerified ? 'text-gray-900' : 'text-gray-400'}>Email</span>
        </div>
        <div className="flex items-center gap-2">
          {phoneVerified ? (
            <CheckCircle className="w-4 h-4 text-emerald-500" />
          ) : (
            <AlertCircle className="w-4 h-4 text-gray-300" />
          )}
          <span className={phoneVerified ? 'text-gray-900' : 'text-gray-400'}>Téléphone</span>
        </div>
        <div className="flex items-center gap-2">
          {itsmeVerified ? (
            <CheckCircle className="w-4 h-4 text-emerald-500" />
          ) : (
            <AlertCircle className="w-4 h-4 text-gray-300" />
          )}
          <span className={itsmeVerified ? 'text-gray-900' : 'text-gray-400'}>ITSME</span>
        </div>
      </div>
    </div>
  );
}

// =============================================================================
// EMAIL STATUS CARD (Read-only)
// =============================================================================

function EmailVerificationCard({
  verified,
  email,
}: {
  verified: boolean;
  email?: string;
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-4">
      <div className="flex items-center gap-3">
        <div className={cn(
          "w-10 h-10 rounded-xl flex items-center justify-center",
          verified ? "bg-emerald-100 text-emerald-600" : "bg-gray-100 text-gray-400"
        )}>
          <Mail className="w-5 h-5" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900">Email</h3>
          <p className="text-sm text-gray-500">
            {email || 'Non renseigné'}
          </p>
        </div>
        {verified ? (
          <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-full text-sm font-medium">
            <CheckCircle className="w-4 h-4" />
            Vérifié
          </div>
        ) : (
          <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-50 text-amber-700 rounded-full text-sm font-medium">
            <AlertCircle className="w-4 h-4" />
            Non vérifié
          </div>
        )}
      </div>
    </div>
  );
}

// =============================================================================
// LOADING STATE
// =============================================================================

function LoadingState() {
  return (
    <div className="space-y-4">
      <div className="bg-white rounded-2xl border border-gray-200 p-6 animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-1/3 mb-4" />
        <div className="h-3 bg-gray-200 rounded w-full mb-4" />
        <div className="flex justify-between">
          <div className="h-4 bg-gray-200 rounded w-16" />
          <div className="h-4 bg-gray-200 rounded w-16" />
          <div className="h-4 bg-gray-200 rounded w-16" />
        </div>
      </div>
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-white rounded-2xl border border-gray-200 p-6 animate-pulse">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-200 rounded-xl" />
            <div className="flex-1">
              <div className="h-5 bg-gray-200 rounded w-1/4 mb-2" />
              <div className="h-4 bg-gray-200 rounded w-1/3" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

function VerificationSettingsContent({ onStatusChange }: VerificationSettingsProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [status, setStatus] = useState<VerificationStatus>({
    email: { verified: false },
    phone: { verified: false },
    itsme: { verified: false },
  });

  // Load verification status
  useEffect(() => {
    loadVerificationStatus();
  }, []);

  const loadVerificationStatus = async () => {
    setIsLoading(true);

    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) return;

      // Get user data
      const { data: userData } = await supabase
        .from('users')
        .select('email, phone_number, phone_verified, email_verified')
        .eq('id', user.id)
        .single();

      // Get verification data
      const { data: verificationData } = await supabase
        .from('user_verifications')
        .select('*')
        .eq('user_id', user.id)
        .single();

      const newStatus: VerificationStatus = {
        email: {
          verified: userData?.email_verified || user.email_confirmed_at != null,
          address: user.email,
        },
        phone: {
          verified: verificationData?.phone_verified || userData?.phone_verified || false,
          number: userData?.phone_number,
        },
        itsme: {
          verified: verificationData?.itsme_verified || false,
          givenName: verificationData?.itsme_data?.given_name,
          familyName: verificationData?.itsme_data?.family_name,
          birthdate: verificationData?.itsme_data?.birthdate,
          nationality: verificationData?.itsme_data?.nationality,
          verifiedAt: verificationData?.itsme_verified_at,
        },
      };

      setStatus(newStatus);
      onStatusChange?.(newStatus);
    } catch (error) {
      console.error('Error loading verification status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePhoneStatusChange = (verified: boolean) => {
    const newStatus = {
      ...status,
      phone: { ...status.phone, verified },
    };
    setStatus(newStatus);
    onStatusChange?.(newStatus);
  };

  const handleItsmeStatusChange = (verified: boolean) => {
    const newStatus = {
      ...status,
      itsme: { ...status.itsme, verified },
    };
    setStatus(newStatus);
    onStatusChange?.(newStatus);
  };

  if (isLoading) {
    return <LoadingState />;
  }

  return (
    <div className="space-y-4">
      {/* Progress indicator */}
      <VerificationProgress
        emailVerified={status.email.verified}
        phoneVerified={status.phone.verified}
        itsmeVerified={status.itsme.verified}
      />

      {/* Email (read-only) */}
      <EmailVerificationCard
        verified={status.email.verified}
        email={status.email.address}
      />

      {/* Phone verification */}
      <PhoneVerificationSettings
        onStatusChange={handlePhoneStatusChange}
        initialPhone={status.phone.number}
        isVerified={status.phone.verified}
      />

      {/* ITSME verification */}
      <ItsmeVerificationSettings
        onStatusChange={handleItsmeStatusChange}
        verificationData={{
          isVerified: status.itsme.verified,
          verifiedAt: status.itsme.verifiedAt,
          givenName: status.itsme.givenName,
          familyName: status.itsme.familyName,
          birthdate: status.itsme.birthdate,
          nationality: status.itsme.nationality,
        }}
      />

      {/* Benefits callout */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 mt-6">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
            <Shield className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 mb-1">
              Pourquoi se faire vérifier ?
            </h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li className="flex items-center gap-2">
                <ChevronRight className="w-3 h-3 text-blue-500" />
                Profil de confiance pour les propriétaires et colocataires
              </li>
              <li className="flex items-center gap-2">
                <ChevronRight className="w-3 h-3 text-blue-500" />
                Badge "Vérifié" visible sur votre profil
              </li>
              <li className="flex items-center gap-2">
                <ChevronRight className="w-3 h-3 text-blue-500" />
                Priorité dans les résultats de recherche
              </li>
              <li className="flex items-center gap-2">
                <ChevronRight className="w-3 h-3 text-blue-500" />
                Accès à plus de fonctionnalités premium
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

// Wrap with Suspense for useSearchParams
export default function VerificationSettings(props: VerificationSettingsProps) {
  return (
    <Suspense fallback={<LoadingState />}>
      <VerificationSettingsContent {...props} />
    </Suspense>
  );
}
