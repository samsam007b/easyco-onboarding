/**
 * EASYCO DESIGN SYSTEM - GRADIENTS
 *
 * Gradients officiels pour chaque interface utilisateur
 */

export const GRADIENTS = {
  // Gradient SEARCHER (orange bright)
  // Utilisé pour: Interface chercheurs de logement
  searcher: {
    css: 'linear-gradient(135deg, #FFA040 0%, #FFB85C 100%)',
    tailwind: 'from-[#FFA040] to-[#FFB85C]',
    colors: {
      start: '#FFA040',
      end: '#FFB85C'
    }
  },

  // Gradient RESIDENT (orange corail)
  // Utilisé pour: Interface résidents/colocataires
  resident: {
    css: 'linear-gradient(135deg, #D97B6F 0%, #E8865D 50%, #FF8C4B 100%)',
    tailwind: 'from-[#D97B6F] via-[#E8865D] to-[#FF8C4B]',
    colors: {
      start: '#D97B6F',
      mid: '#E8865D',
      end: '#FF8C4B'
    }
  },

  // Gradient OWNER (bleu/violet)
  // Utilisé pour: Interface propriétaires
  owner: {
    css: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    tailwind: 'from-[#667eea] to-[#764ba2]',
    colors: {
      start: '#667eea',
      end: '#764ba2'
    }
  }
} as const;

export type GradientType = keyof typeof GRADIENTS;

/**
 * Helper function to get gradient by user type
 */
export function getGradientForUserType(userType: 'searcher' | 'resident' | 'owner') {
  return GRADIENTS[userType];
}
