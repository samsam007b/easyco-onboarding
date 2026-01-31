'use client';

import { Info, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

type DisclaimerVariant = 'info' | 'warning' | 'subtle';
type DisclaimerSize = 'sm' | 'md' | 'lg';

interface PaymentDisclaimerProps {
  variant?: DisclaimerVariant;
  size?: DisclaimerSize;
  className?: string;
  showIcon?: boolean;
  customMessage?: string;
}

const messages = {
  default: {
    fr: "Izzico facilite le suivi des paiements mais ne gère pas les transferts d'argent. Les paiements s'effectuent directement entre les parties.",
    en: "Izzico facilitates payment tracking but does not handle money transfers. Payments are made directly between parties.",
    nl: "Izzico faciliteert betalingsopvolging maar beheert geen geldtransfers. Betalingen gebeuren rechtstreeks tussen partijen.",
    de: "Izzico erleichtert die Zahlungsverfolgung, verwaltet aber keine Geldtransfers. Zahlungen erfolgen direkt zwischen den Parteien.",
  },
  short: {
    fr: "Paiements directs entre parties. Izzico = suivi uniquement.",
    en: "Direct payments between parties. Izzico = tracking only.",
    nl: "Directe betalingen tussen partijen. Izzico = alleen opvolging.",
    de: "Direkte Zahlungen zwischen Parteien. Izzico = nur Verfolgung.",
  },
};

/**
 * PaymentDisclaimer - Composant réutilisable pour afficher le disclaimer paiements
 *
 * UTILISATION OBLIGATOIRE sur tous les écrans liés aux paiements entre utilisateurs
 * (loyers, charges partagées, remboursements, etc.)
 *
 * @example
 * // Sur une page de paiement
 * <PaymentDisclaimer variant="info" />
 *
 * // Version subtile dans un footer
 * <PaymentDisclaimer variant="subtle" size="sm" />
 *
 * // Avec message personnalisé
 * <PaymentDisclaimer customMessage="Les loyers sont payés directement au propriétaire." />
 */
export function PaymentDisclaimer({
  variant = 'info',
  size = 'md',
  className,
  showIcon = true,
  customMessage,
}: PaymentDisclaimerProps) {
  // TODO: Use i18n hook when available
  const locale = 'fr';
  const message = customMessage || messages.default[locale];

  const sizeStyles = {
    sm: 'text-xs py-1.5 px-2.5',
    md: 'text-sm py-2 px-3',
    lg: 'text-base py-3 px-4',
  };

  const variantStyles = {
    info: 'bg-sky-50 border-sky-200 text-sky-800',
    warning: 'bg-amber-50 border-amber-200 text-amber-800',
    subtle: 'bg-gray-50 border-gray-200 text-gray-600',
  };

  const iconSizes = {
    sm: 'h-3.5 w-3.5',
    md: 'h-4 w-4',
    lg: 'h-5 w-5',
  };

  const Icon = variant === 'warning' ? AlertTriangle : Info;

  return (
    <div
      className={cn(
        'flex items-start gap-2 rounded-lg border',
        sizeStyles[size],
        variantStyles[variant],
        className
      )}
      role="note"
      aria-label="Information sur les paiements"
    >
      {showIcon && (
        <Icon className={cn('flex-shrink-0 mt-0.5', iconSizes[size])} />
      )}
      <p className="leading-relaxed">{message}</p>
    </div>
  );
}

/**
 * Version inline pour les formulaires et tooltips
 */
export function PaymentDisclaimerInline({ className }: { className?: string }) {
  const locale = 'fr';
  return (
    <span className={cn('text-xs text-gray-500', className)}>
      {messages.short[locale]}
    </span>
  );
}

/**
 * Hook pour obtenir le message de disclaimer
 * Utile pour les modales ou les confirmations
 */
export function usePaymentDisclaimerMessage(variant: 'default' | 'short' = 'default') {
  const locale = 'fr'; // TODO: use i18n
  return messages[variant][locale];
}

export default PaymentDisclaimer;
