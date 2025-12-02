/**
 * Role-based color configuration for EasyCo platform
 * Defines the dominant color scheme for each user role
 */

export const ROLE_COLORS = {
  searcher: {
    primary: '#FFC107', // Amber (from iOS Theme)
    primaryRgb: '255, 193, 7',
    light: '#FFF9E6',
    dark: '#F9A825',
    bg: {
      light: 'bg-[#FFFEF0]', // _50
      medium: 'bg-[#FFF9E6]', // _100
      card: 'bg-[#FFF9E6]',
    },
    text: {
      primary: 'text-[#FFC107]',
      dark: 'text-[#F9A825]',
      light: 'text-[#FFD249]',
    },
    border: {
      primary: 'border-[#FFC107]',
      hover: 'hover:border-[#FFD249]',
    },
    button: {
      primary: 'bg-[#FFC107] hover:bg-[#F9A825] text-white',
      outline: 'border-[#FFC107] text-[#FFC107] hover:bg-[#FFF9E6]',
    },
    badge: 'bg-[#FFC107]',
  },
  owner: {
    primary: '#6E56CF', // Mauve/Purple (from iOS Theme)
    primaryRgb: '110, 86, 207',
    light: '#F3F1FF',
    dark: '#5B45B8',
    bg: {
      light: 'bg-[#F9F8FF]', // _50
      medium: 'bg-[#F3F1FF]', // _100
      card: 'bg-[#F3F1FF]',
    },
    text: {
      primary: 'text-[#6E56CF]',
      dark: 'text-[#5B45B8]',
      light: 'text-[#8E7AD6]',
    },
    border: {
      primary: 'border-[#6E56CF]',
      hover: 'hover:border-[#8E7AD6]',
    },
    button: {
      primary: 'bg-[#6E56CF] hover:bg-[#5B45B8] text-white',
      outline: 'border-[#6E56CF] text-[#6E56CF] hover:bg-[#F3F1FF]',
    },
    badge: 'bg-[#6E56CF]',
  },
  resident: {
    primary: '#FF5722', // Orange/Coral (from iOS Theme)
    primaryRgb: '255, 87, 34',
    light: '#FFF3EF',
    dark: '#E64A19',
    bg: {
      light: 'bg-[#FFFAF8]', // _50
      medium: 'bg-[#FFF3EF]', // _100
      card: 'bg-[#FFF3EF]',
    },
    text: {
      primary: 'text-[#FF5722]',
      dark: 'text-[#E64A19]',
      light: 'text-[#FF6F3C]',
    },
    border: {
      primary: 'border-[#FF5722]',
      hover: 'hover:border-[#FF6F3C]',
    },
    button: {
      primary: 'bg-[#FF5722] hover:bg-[#E64A19] text-white',
      outline: 'border-[#FF5722] text-[#FF5722] hover:bg-[#FFF3EF]',
    },
    badge: 'bg-[#FF5722]',
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
 * Get role background classes
 */
export function getRoleBackground(role: UserRole, intensity: 'light' | 'medium' = 'light') {
  return ROLE_COLORS[role].bg[intensity];
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
