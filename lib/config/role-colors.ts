/**
 * Role-based color configuration for EasyCo platform
 * Defines the dominant color scheme for each user role
 */

export const ROLE_COLORS = {
  searcher: {
    primary: '#FFD700', // Gold/Yellow
    primaryRgb: '255, 215, 0',
    light: '#FFF9E6',
    dark: '#E6C200',
    gradient: {
      from: '#FFD700',
      to: '#FFA500',
    },
    bg: {
      light: 'from-yellow-50 to-orange-50',
      medium: 'from-yellow-100 to-orange-100',
      card: 'bg-yellow-50',
    },
    text: {
      primary: 'text-yellow-600',
      dark: 'text-yellow-700',
      light: 'text-yellow-500',
    },
    border: {
      primary: 'border-yellow-300',
      hover: 'hover:border-yellow-400',
    },
    button: {
      primary: 'bg-yellow-500 hover:bg-yellow-600 text-white',
      outline: 'border-yellow-500 text-yellow-600 hover:bg-yellow-50',
    },
    badge: 'bg-yellow-500',
  },
  owner: {
    primary: '#4A148C', // Deep Purple
    primaryRgb: '74, 20, 140',
    light: '#E1BEE7',
    dark: '#311B92',
    gradient: {
      from: '#4A148C',
      to: '#7B1FA2',
    },
    bg: {
      light: 'from-purple-50 to-purple-100',
      medium: 'from-purple-100 to-purple-200',
      card: 'bg-purple-50',
    },
    text: {
      primary: 'text-purple-900',
      dark: 'text-purple-950',
      light: 'text-purple-700',
    },
    border: {
      primary: 'border-purple-300',
      hover: 'hover:border-purple-400',
    },
    button: {
      primary: 'bg-purple-900 hover:bg-purple-950 text-white',
      outline: 'border-purple-900 text-purple-900 hover:bg-purple-50',
    },
    badge: 'bg-purple-900',
  },
  resident: {
    primary: '#FF6F3C', // Orange
    primaryRgb: '255, 111, 60',
    light: '#FFE6DC',
    dark: '#E65A28',
    gradient: {
      from: '#FF6F3C',
      to: '#FF8C5A',
    },
    bg: {
      light: 'from-orange-50 to-red-50',
      medium: 'from-orange-100 to-red-100',
      card: 'bg-orange-50',
    },
    text: {
      primary: 'text-orange-600',
      dark: 'text-orange-700',
      light: 'text-orange-500',
    },
    border: {
      primary: 'border-orange-300',
      hover: 'hover:border-orange-400',
    },
    button: {
      primary: 'bg-orange-600 hover:bg-orange-700 text-white',
      outline: 'border-orange-600 text-orange-600 hover:bg-orange-50',
    },
    badge: 'bg-orange-600',
  },
} as const;

export type UserRole = keyof typeof ROLE_COLORS;

/**
 * Get role color configuration
 */
export function getRoleColors(role: UserRole) {
  return ROLE_COLORS[role];
}

/**
 * Get role gradient classes for backgrounds
 */
export function getRoleGradient(role: UserRole, intensity: 'light' | 'medium' = 'light') {
  return `bg-gradient-to-br ${ROLE_COLORS[role].bg[intensity]}`;
}

/**
 * Get role primary color hex
 */
export function getRolePrimaryColor(role: UserRole): string {
  return ROLE_COLORS[role].primary;
}

/**
 * Get role button classes
 */
export function getRoleButtonClasses(role: UserRole, variant: 'primary' | 'outline' = 'primary') {
  return ROLE_COLORS[role].button[variant];
}
