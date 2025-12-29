import React from 'react';
import { cn } from '@/lib/utils';

type LogoVariant = 'text-full' | 'text-compact' | 'icon';
type LogoSize = 'sm' | 'md' | 'lg' | 'xl';

interface IzzicoLogoProps {
  variant?: LogoVariant;
  size?: LogoSize;
  className?: string;
}

const sizeClasses = {
  icon: {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24',
  },
  'text-compact': {
    sm: 'h-8',
    md: 'h-12',
    lg: 'h-16',
    xl: 'h-24',
  },
  'text-full': {
    sm: 'h-12',
    md: 'h-16',
    lg: 'h-24',
    xl: 'h-32',
  },
};

const logoSources = {
  'text-full': '/logos/izzico-logo-final.png',
  'text-compact': '/logos/izzico-logo-final.png',
  icon: '/logos/izzico-icon.png',
};

/**
 * Composant Logo IzzIco avec variantes et tailles
 *
 * @example
 * // Logo textuel complet (pour headers desktop)
 * <IzzicoLogo variant="text-full" size="lg" />
 *
 * @example
 * // Logo compact (pour navigation)
 * <IzzicoLogo variant="text-compact" size="md" />
 *
 * @example
 * // Icône seule (pour favicon, app mobile)
 * <IzzicoLogo variant="icon" size="sm" />
 */
export function IzzicoLogo({
  variant = 'text-full',
  size = 'md',
  className,
}: IzzicoLogoProps) {
  const sizeClass = sizeClasses[variant][size];
  const src = logoSources[variant];

  return (
    <img
      src={src}
      alt="IzzIco"
      className={cn(sizeClass, className)}
      loading="eager"
      decoding="async"
    />
  );
}

/**
 * Logo textuel complet avec gradient signature
 * Format: 600×200px
 * Usage: Headers desktop, bannières marketing
 */
export function IzzicoLogoFull({ size = 'md', className }: Omit<IzzicoLogoProps, 'variant'>) {
  return <IzzicoLogo variant="text-full" size={size} className={className} />;
}

/**
 * Logo compact pour headers
 * Format: 400×120px
 * Usage: Navigation web, signatures email
 */
export function IzzicoLogoCompact({ size = 'md', className }: Omit<IzzicoLogoProps, 'variant'>) {
  return <IzzicoLogo variant="text-compact" size={size} className={className} />;
}

/**
 * Icône maison seule
 * Format: 200×200px (carré)
 * Usage: Favicon, app mobile, menus compacts
 */
export function IzzicoIcon({ size = 'md', className }: Omit<IzzicoLogoProps, 'variant'>) {
  return <IzzicoLogo variant="icon" size={size} className={className} />;
}
