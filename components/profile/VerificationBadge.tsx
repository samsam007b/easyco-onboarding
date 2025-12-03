'use client';

import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

export type VerificationLevel = 'starter' | 'basic' | 'verified' | 'premium';

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
  },
  basic: {
    bg: 'bg-blue-100',
    border: 'border-blue-200',
    icon: 'text-blue-400',
    ring: 'ring-blue-100',
    label: 'Vérifié - Basique',
  },
  verified: {
    bg: 'bg-blue-500',
    border: 'border-blue-600',
    icon: 'text-white',
    ring: 'ring-blue-200',
    label: 'Vérifié',
  },
  premium: {
    bg: 'bg-blue-900',
    border: 'border-blue-950',
    icon: 'text-white',
    ring: 'ring-blue-400',
    label: 'Vérifié - Premium',
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
      {/* Ring effect pour premium */}
      {level === 'premium' && (
        <div className={cn(
          'absolute inset-0 rounded-full animate-pulse',
          'ring-2',
          badgeStyle.ring
        )} />
      )}

      {/* Check icon */}
      <Check
        className={cn(
          sizeStyle.icon,
          badgeStyle.icon,
          'stroke-[3]'
        )}
        strokeWidth={3}
      />
    </div>
  );
}

/**
 * Calculate verification level based on user profile verification status
 */
export function getVerificationLevel(verificationData: {
  email_verified?: boolean;
  phone_verified?: boolean;
  id_verified?: boolean;
  background_check?: boolean;
}): VerificationLevel {
  const {
    email_verified = false,
    phone_verified = false,
    id_verified = false,
    background_check = false,
  } = verificationData;

  // Count verified items
  const verifiedCount = [
    email_verified,
    phone_verified,
    id_verified,
    background_check,
  ].filter(Boolean).length;

  if (verifiedCount === 0) return 'starter'; // V gris transparent - Aucune vérification
  if (verifiedCount === 1) return 'basic'; // Bleu clair - Email ou téléphone seulement
  if (verifiedCount === 2) return 'verified'; // Bleu normal - Email + Téléphone
  return 'premium'; // Bleu foncé profond - Tout vérifié (4/4)
}
