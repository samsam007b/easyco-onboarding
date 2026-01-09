/**
 * Izzico Feather Icons Configuration
 *
 * Configuration centralisée pour l'utilisation de Feather Icons
 * avec le système de rôles Izzico (Owner, Resident, Searcher)
 */

import { Icon as FeatherIconType } from 'react-feather';

export type IconSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
export type IconRole = 'owner' | 'resident' | 'searcher' | 'neutral';

/**
 * Tailles d'icônes en pixels
 * Basé sur le design system Izzico
 */
export const iconSizes: Record<IconSize, number> = {
  xs: 12,
  sm: 16,
  md: 20,
  lg: 24,
  xl: 32,
  '2xl': 48,
};

/**
 * Classes Tailwind pour les tailles
 */
export const iconSizeClasses: Record<IconSize, string> = {
  xs: 'w-3 h-3',
  sm: 'w-4 h-4',
  md: 'w-5 h-5',
  lg: 'w-6 h-6',
  xl: 'w-8 h-8',
  '2xl': 'w-12 h-12',
};

/**
 * Couleurs par rôle (référence: brand-identity/izzico-color-system.html)
 */
export const iconRoleColors: Record<IconRole, {
  primary: string;
  light: string;
  dark: string;
  hex: string;
}> = {
  owner: {
    primary: 'text-owner-500',
    light: 'text-owner-300',
    dark: 'text-owner-700',
    hex: '#9c5698',
  },
  resident: {
    primary: 'text-resident-500',
    light: 'text-resident-300',
    dark: 'text-resident-700',
    hex: '#e05747',
  },
  searcher: {
    primary: 'text-searcher-500',
    light: 'text-searcher-300',
    dark: 'text-searcher-700',
    hex: '#ffa000',
  },
  neutral: {
    primary: 'text-gray-600 dark:text-gray-400',
    light: 'text-gray-400 dark:text-gray-500',
    dark: 'text-gray-800 dark:text-gray-200',
    hex: '#52525B',
  },
};

/**
 * Stroke width par défaut pour Feather
 * Feather utilise 2px par défaut, ce qui donne un look friendly
 */
export const defaultStrokeWidth = 1.5;

/**
 * Props communes pour les icônes Feather
 */
export interface FeatherIconProps {
  icon: FeatherIconType;
  size?: IconSize | number;
  role?: IconRole;
  className?: string;
  strokeWidth?: number;
  'aria-label'?: string;
}

/**
 * Helper: Récupère la couleur hex pour un rôle
 */
export function getIconRoleColor(role: IconRole = 'neutral'): string {
  return iconRoleColors[role].hex;
}

/**
 * Helper: Récupère la taille en pixels
 */
export function getIconSize(size: IconSize | number = 'md'): number {
  if (typeof size === 'number') return size;
  return iconSizes[size];
}

/**
 * Helper: Génère les classes Tailwind pour une icône
 */
export function getIconClasses(
  role: IconRole = 'neutral',
  size?: IconSize,
  additionalClasses?: string
): string {
  const classes: string[] = [];

  // Couleur du rôle
  classes.push(iconRoleColors[role].primary);

  // Taille (si spécifiée comme IconSize)
  if (size && typeof size === 'string') {
    classes.push(iconSizeClasses[size]);
  }

  // Classes additionnelles
  if (additionalClasses) {
    classes.push(additionalClasses);
  }

  return classes.join(' ');
}
