'use client';

import { ReactNode } from 'react';
import Link from 'next/link';
import { Lock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TeaserCardProps {
  /** If true, content is blurred and overlay shown */
  isLocked: boolean;
  /** Blur intensity level */
  blurLevel?: 1 | 2 | 3;
  /** Text displayed in the CTA overlay */
  ctaText?: string;
  /** Link for the CTA button */
  ctaHref?: string;
  /** Click handler for CTA (alternative to href) */
  onCtaClick?: () => void;
  /** Content to be displayed (blurred when locked) */
  children: ReactNode;
  /** Optional badge text (e.g., "Premium", "Score", "Pro") */
  badge?: string;
  /** Custom className for the container */
  className?: string;
}

/**
 * TeaserCard - Shows content with blur + CTA overlay when locked
 * Used to tease premium features and drive signups
 *
 * @example
 * <TeaserCard
 *   isLocked={!isAuthenticated}
 *   blurLevel={2}
 *   ctaText="Créer un compte pour voir le score de compatibilité"
 *   ctaHref="/auth/signup"
 *   badge="Premium"
 * >
 *   <CompatibilityScore score={92} />
 * </TeaserCard>
 */
export function TeaserCard({
  isLocked,
  blurLevel = 2,
  ctaText = 'Créer un compte pour débloquer',
  ctaHref,
  onCtaClick,
  children,
  badge,
  className = ''
}: TeaserCardProps) {
  // If not locked, just show children
  if (!isLocked) {
    return <>{children}</>;
  }

  // Locked: show blurred content with overlay
  return (
    <div className={cn('relative', className)}>
      {/* Blurred Content */}
      <div
        className={cn(
          'pointer-events-none select-none transition-all duration-300',
          blurLevel === 1 && 'blur-sm',
          blurLevel === 2 && 'blur-md',
          blurLevel === 3 && 'blur-lg'
        )}
        aria-hidden="true"
      >
        {children}
      </div>

      {/* Overlay with CTA */}
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-b from-white/80 via-white/90 to-white/95 backdrop-blur-sm">
        {badge && (
          <div className="mb-3 px-3 py-1 bg-purple-100 text-purple-700 text-xs font-bold rounded-full uppercase tracking-wide">
            {badge}
          </div>
        )}

        {/* Lock Icon */}
        <div className="w-12 h-12 sm:w-16 sm:h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
          <Lock className="w-6 h-6 sm:w-8 sm:h-8 text-purple-600" />
        </div>

        {/* CTA Text */}
        <p className="text-sm sm:text-base text-center text-gray-700 mb-4 px-4 max-w-md font-medium">
          {ctaText}
        </p>

        {/* CTA Button */}
        {ctaHref ? (
          <Link
            href={ctaHref}
            className="px-6 py-3 bg-[var(--easy-purple-900)] text-white font-semibold rounded-full hover:bg-[var(--easy-purple-700)] transition-all shadow-lg hover:shadow-xl hover:scale-105"
          >
            Créer un compte gratuit
          </Link>
        ) : onCtaClick ? (
          <button
            onClick={onCtaClick}
            className="px-6 py-3 bg-[var(--easy-purple-900)] text-white font-semibold rounded-full hover:bg-[var(--easy-purple-700)] transition-all shadow-lg hover:shadow-xl hover:scale-105"
          >
            Débloquer
          </button>
        ) : null}

        {/* Alternative: Login link */}
        {ctaHref && (
          <Link
            href="/auth"
            className="mt-3 text-sm text-gray-600 hover:text-purple-600 transition underline"
          >
            J'ai déjà un compte
          </Link>
        )}
      </div>
    </div>
  );
}

/**
 * Compact variant for inline teasers (e.g., in lists)
 */
export function TeaserCardCompact({
  isLocked,
  ctaText = 'Connexion requise',
  ctaHref = '/auth',
  children,
  className = ''
}: Pick<TeaserCardProps, 'isLocked' | 'ctaText' | 'ctaHref' | 'children' | 'className'>) {
  if (!isLocked) return <>{children}</>;

  return (
    <div className={cn('relative', className)}>
      <div className="blur-sm pointer-events-none select-none" aria-hidden="true">
        {children}
      </div>
      <div className="absolute inset-0 flex items-center justify-center bg-white/90 backdrop-blur-sm">
        <Link
          href={ctaHref}
          className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white text-sm font-semibold rounded-lg hover:bg-purple-700 transition"
        >
          <Lock className="w-4 h-4" />
          {ctaText}
        </Link>
      </div>
    </div>
  );
}

/**
 * Modal variant for full-screen teasers
 */
export function TeaserModal({
  isOpen,
  onClose,
  title = 'Fonctionnalité Premium',
  description = 'Créer un compte gratuit pour débloquer cette fonctionnalité',
  ctaHref = '/auth/signup',
  children
}: {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  ctaHref?: string;
  children?: ReactNode;
}) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
          aria-label="Fermer"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Icon */}
        <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Lock className="w-8 h-8 text-purple-600" />
        </div>

        {/* Title */}
        <h3 className="text-2xl font-bold text-gray-900 text-center mb-2">
          {title}
        </h3>

        {/* Description */}
        <p className="text-gray-600 text-center mb-6">
          {description}
        </p>

        {/* Custom content */}
        {children}

        {/* CTAs */}
        <div className="flex flex-col gap-3">
          <Link
            href={ctaHref}
            className="w-full px-6 py-3 bg-[var(--easy-purple-900)] text-white font-semibold rounded-full hover:bg-[var(--easy-purple-700)] transition text-center"
          >
            Créer mon compte gratuit
          </Link>
          <Link
            href="/auth"
            className="w-full px-6 py-3 border-2 border-purple-200 text-gray-700 font-semibold rounded-full hover:bg-purple-50 transition text-center"
          >
            J'ai déjà un compte
          </Link>
        </div>
      </div>
    </div>
  );
}
