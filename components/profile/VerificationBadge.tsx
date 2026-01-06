'use client';

import { Check, BadgeCheck } from 'lucide-react';
import { cn } from '@/lib/utils';

export type VerificationLevel = 'starter' | 'basic' | 'verified' | 'itsme' | 'premium';

interface VerificationBadgeProps {
  level: VerificationLevel;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const BADGE_STYLES = {
  starter: {
    bg: 'bg-gray-100/30',
    border: 'border-gray-300/20',
    icon: 'text-gray-400/40',
    ring: 'ring-0',
    label: 'Starter',
    useItsmeIcon: false,
  },
  basic: {
    bg: 'bg-blue-100',
    border: 'border-blue-200',
    icon: 'text-blue-400',
    ring: 'ring-blue-100',
    label: 'Vérifié - Basique',
    useItsmeIcon: false,
  },
  verified: {
    bg: 'bg-gradient-to-br from-emerald-400 to-emerald-600',
    border: 'border-emerald-500',
    icon: 'text-white',
    ring: 'ring-emerald-300/30',
    label: 'Vérifié',
    useItsmeIcon: false,
  },
  itsme: {
    bg: 'bg-gradient-to-br from-[#FF6B35] to-[#E55A2B]',
    border: 'border-[#FF6B35]',
    icon: 'text-white',
    ring: 'ring-[#FF6B35]/40',
    label: 'ITSME Vérifié',
    useItsmeIcon: true,
  },
  premium: {
    bg: 'bg-gradient-to-br from-[#9c5698] via-[#e05747] to-[#FFB10B]',
    border: 'border-[#9c5698]',
    icon: 'text-white',
    ring: 'ring-[#FFB10B]/50',
    label: 'Vérifié - Premium',
    useItsmeIcon: true,
  },
} as const;

const SIZE_STYLES = {
  sm: {
    container: 'w-4 h-4',
    icon: 'w-2.5 h-2.5',
    border: 'border',
  },
  md: {
    container: 'w-5 h-5',
    icon: 'w-3 h-3',
    border: 'border-[1.5px]',
  },
  lg: {
    container: 'w-6 h-6',
    icon: 'w-3.5 h-3.5',
    border: 'border-2',
  },
} as const;

export default function VerificationBadge({
  level,
  size = 'md',
  className
}: VerificationBadgeProps) {
  const badgeStyle = BADGE_STYLES[level];
  const sizeStyle = SIZE_STYLES[size];

  return (
    <div
      className={cn(
        'relative flex items-center justify-center rounded-full',
        'transition-all duration-300',
        sizeStyle.container,
        sizeStyle.border,
        badgeStyle.bg,
        badgeStyle.border,
        className
      )}
      title={badgeStyle.label}
    >
      {/* Ring effect pour premium et itsme */}
      {(level === 'premium' || level === 'itsme') && (
        <div className={cn(
          'absolute inset-0 rounded-full animate-pulse',
          'ring-2',
          badgeStyle.ring
        )} />
      )}

      {/* Icon - BadgeCheck for ITSME levels, Check for others */}
      {badgeStyle.useItsmeIcon ? (
        <BadgeCheck
          className={cn(
            sizeStyle.icon,
            badgeStyle.icon,
            'stroke-[2.5]'
          )}
          strokeWidth={2.5}
        />
      ) : (
        <Check
          className={cn(
            sizeStyle.icon,
            badgeStyle.icon,
            'stroke-[3]'
          )}
          strokeWidth={3}
        />
      )}
    </div>
  );
}

/**
 * Calculate verification level based on user profile verification status
 *
 * Levels:
 * - starter: No verifications
 * - basic: Email only
 * - verified: Email + Phone
 * - itsme: ITSME verified (without other verifications)
 * - premium: ITSME + Email + Phone (full verification)
 */
export function getVerificationLevel(verificationData: {
  email_verified?: boolean;
  phone_verified?: boolean;
  itsme_verified?: boolean;
  /** @deprecated Use itsme_verified instead */
  id_verified?: boolean;
}): VerificationLevel {
  const {
    email_verified = false,
    phone_verified = false,
    itsme_verified = false,
    id_verified = false,
  } = verificationData;

  // ITSME is the strongest verification
  const hasItsme = itsme_verified || id_verified;

  // Count basic verifications (email + phone)
  const basicVerifiedCount = [email_verified, phone_verified].filter(Boolean).length;

  // Premium: ITSME + at least email verified
  if (hasItsme && email_verified) {
    return 'premium';
  }

  // ITSME only (without email/phone)
  if (hasItsme) {
    return 'itsme';
  }

  // Verified: Email + Phone
  if (email_verified && phone_verified) {
    return 'verified';
  }

  // Basic: At least one basic verification
  if (basicVerifiedCount >= 1) {
    return 'basic';
  }

  // No verification
  return 'starter';
}
