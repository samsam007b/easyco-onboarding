/**
 * Izzico Icon System Configuration
 *
 * Defines icon sizes, variants, and role-based styling
 * Based on brand-identity/izzico-color-system.html
 */

export type IconSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
export type IconVariant = 'default' | 'outline' | 'filled' | 'gradient';
export type IconRole = 'owner' | 'resident' | 'searcher' | 'neutral';

export const iconSizes: Record<IconSize, { size: number; className: string }> = {
  xs: { size: 12, className: 'w-3 h-3' },
  sm: { size: 16, className: 'w-4 h-4' },
  md: { size: 20, className: 'w-5 h-5' },
  lg: { size: 24, className: 'w-6 h-6' },
  xl: { size: 32, className: 'w-8 h-8' },
  '2xl': { size: 48, className: 'w-12 h-12' },
};

/**
 * Role-based icon colors
 * Follows brand color system with 3 role primaries
 */
export const iconRoleColors: Record<IconRole, {
  primary: string;
  light: string;
  dark: string;
  gradient: string;
}> = {
  owner: {
    primary: 'text-owner-500',
    light: 'text-owner-300',
    dark: 'text-owner-700',
    gradient: 'bg-owner-500',
  },
  resident: {
    primary: 'text-resident-500',
    light: 'text-resident-300',
    dark: 'text-resident-700',
    gradient: 'bg-resident-500',
  },
  searcher: {
    primary: 'text-searcher-500',
    light: 'text-searcher-300',
    dark: 'text-searcher-700',
    gradient: 'bg-searcher-500',
  },
  neutral: {
    primary: 'text-gray-600 dark:text-gray-400',
    light: 'text-gray-400 dark:text-gray-500',
    dark: 'text-gray-800 dark:text-gray-200',
    gradient: 'bg-gradient-to-br from-gray-400 to-gray-600',
  },
};

/**
 * Icon button variants with hover/active states
 */
export const iconButtonVariants: Record<IconVariant, {
  base: string;
  hover: string;
  active: string;
}> = {
  default: {
    base: 'bg-transparent',
    hover: 'hover:bg-gray-100 dark:hover:bg-gray-800',
    active: 'active:scale-95',
  },
  outline: {
    base: 'border-2 bg-transparent',
    hover: 'hover:bg-opacity-10',
    active: 'active:scale-95',
  },
  filled: {
    base: 'text-white shadow-md',
    hover: 'hover:shadow-lg hover:brightness-110',
    active: 'active:scale-95',
  },
  gradient: {
    base: 'text-white shadow-md bg-gradient-signature',
    hover: 'hover:shadow-lg hover:scale-105',
    active: 'active:scale-100',
  },
};

/**
 * Accessibility helpers for icons
 */
export interface IconAccessibility {
  label: string;
  description?: string;
  role?: 'img' | 'button' | 'presentation';
}

/**
 * Get icon button classes based on role and variant
 */
export function getIconButtonClasses(
  role: IconRole,
  variant: IconVariant,
  size: IconSize,
  disabled?: boolean
): string {
  const sizeClass = iconSizes[size].className;
  const variantClasses = iconButtonVariants[variant];
  const roleColors = iconRoleColors[role];

  let colorClasses = '';

  if (variant === 'filled') {
    // For filled buttons, use background color
    const bgColorMap = {
      owner: 'bg-owner-500 hover:bg-owner-600',
      resident: 'bg-resident-500 hover:bg-resident-600',
      searcher: 'bg-searcher-500 hover:bg-searcher-600',
      neutral: 'bg-gray-600 hover:bg-gray-700',
    };
    colorClasses = bgColorMap[role];
  } else if (variant === 'outline') {
    // For outline buttons, use border and text color
    const borderColorMap = {
      owner: 'border-owner-500 text-owner-500 hover:bg-owner-500',
      resident: 'border-resident-500 text-resident-500 hover:bg-resident-500',
      searcher: 'border-searcher-500 text-searcher-500 hover:bg-searcher-500',
      neutral: 'border-gray-600 text-gray-600 hover:bg-gray-600',
    };
    colorClasses = borderColorMap[role];
  } else if (variant === 'gradient') {
    colorClasses = roleColors.gradient;
  } else {
    colorClasses = roleColors.primary;
  }

  const baseClasses = [
    'inline-flex items-center justify-center',
    'rounded-xl',
    'transition-all duration-200',
    'focus:outline-none focus:ring-2 focus:ring-offset-2',
    variantClasses.base,
    variantClasses.hover,
    variantClasses.active,
    colorClasses,
  ];

  if (disabled) {
    baseClasses.push('opacity-50 cursor-not-allowed pointer-events-none');
  }

  return baseClasses.join(' ');
}

/**
 * Get icon size in pixels for custom SVGs
 */
export function getIconSize(size: IconSize): number {
  return iconSizes[size].size;
}
