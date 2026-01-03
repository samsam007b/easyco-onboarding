import React from 'react';
import { cn } from '@/lib/utils';

type LogoVariant = 'trademark' | 'icon';
type LogoTheme = 'gradient' | 'white' | 'dark';
type LogoSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

interface IzzicoLogoProps {
  variant?: LogoVariant;
  theme?: LogoTheme;
  size?: LogoSize;
  className?: string;
}

// Tailles pour l'icône (carrée)
const iconSizeClasses: Record<LogoSize, string> = {
  xs: 'w-6 h-6',
  sm: 'w-8 h-8',
  md: 'w-10 h-10',
  lg: 'w-12 h-12',
  xl: 'w-16 h-16',
  '2xl': 'w-24 h-24',
};

// Tailles pour le trademark (rectangle ~3:1)
const trademarkSizeClasses: Record<LogoSize, string> = {
  xs: 'h-5 w-auto',
  sm: 'h-6 w-auto',
  md: 'h-8 w-auto',
  lg: 'h-10 w-auto',
  xl: 'h-14 w-auto',
  '2xl': 'h-20 w-auto',
};

// Sources SVG vectorisées (nouveau système)
const logoSources = {
  icon: {
    gradient: '/logos/izzico-icon-gradient.svg',
    white: '/logos/izzico-icon-white.svg',
    dark: '/logos/izzico-icon-dark.svg',
  },
  trademark: {
    gradient: '/logos/izzico-trademark-gradient.svg',
    white: '/logos/izzico-trademark-white.svg',
    dark: '/logos/izzico-trademark-dark.svg',
  },
};

/**
 * Composant Logo IzzIco avec variantes SVG vectorisées
 *
 * @example
 * // Icône avec gradient (pour headers sur fond clair)
 * <IzzicoLogo variant="icon" theme="gradient" size="md" />
 *
 * @example
 * // Trademark blanc (pour headers sur fond coloré/sombre)
 * <IzzicoLogo variant="trademark" theme="white" size="lg" />
 *
 * @example
 * // Icône sombre (pour fonds clairs/blancs)
 * <IzzicoLogo variant="icon" theme="dark" size="sm" />
 */
export function IzzicoLogo({
  variant = 'icon',
  theme = 'gradient',
  size = 'md',
  className,
}: IzzicoLogoProps) {
  const sizeClass = variant === 'icon'
    ? iconSizeClasses[size]
    : trademarkSizeClasses[size];
  const src = logoSources[variant][theme];

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
 * Icône IzzIco seule
 * Usage: Headers, navigation compacte, favicon
 */
export function IzzicoIcon({
  theme = 'gradient',
  size = 'md',
  className
}: Omit<IzzicoLogoProps, 'variant'>) {
  return <IzzicoLogo variant="icon" theme={theme} size={size} className={className} />;
}

/**
 * Trademark IzzIco (texte complet)
 * Usage: Headers desktop, landing page, marketing
 */
export function IzzicoTrademark({
  theme = 'gradient',
  size = 'md',
  className
}: Omit<IzzicoLogoProps, 'variant'>) {
  return <IzzicoLogo variant="trademark" theme={theme} size={size} className={className} />;
}

// ============================================
// Aliases pour compatibilité avec l'ancien système
// ============================================

/** @deprecated Use IzzicoTrademark instead */
export function IzzicoLogoFull({ size = 'md', className }: { size?: LogoSize; className?: string }) {
  return <IzzicoTrademark theme="gradient" size={size} className={className} />;
}

/** @deprecated Use IzzicoTrademark instead */
export function IzzicoLogoCompact({ size = 'md', className }: { size?: LogoSize; className?: string }) {
  return <IzzicoTrademark theme="gradient" size={size} className={className} />;
}
