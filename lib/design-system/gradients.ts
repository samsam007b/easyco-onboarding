/**
 * IZZICO DESIGN SYSTEM - GRADIENTS
 *
 * 🔒 GRADIENTS OFFICIELS VERROUILLÉS - NE PAS MODIFIER
 * Date de verrouillage: 9 décembre 2025
 * Version choisie: CODE (après comparaison visuelle Figma vs Code)
 *
 * Pour le gradient signature de marque, voir GRADIENTS_OFFICIELS_IZZICO.md
 * Gradient Brand: linear-gradient(135deg, #9c5698 0%, #FF5722 50%, #FFB10B 100%)
 *
 * Gradients officiels pour chaque interface utilisateur
 */

export const GRADIENTS = {
  // 🌈 GRADIENT SIGNATURE DE MARQUE (Logo IzzIco)
  // Gradient tricolore représentant l'ensemble des 3 rôles
  // 🔒 VERROUILLÉ - Version officielle choisie le 9 décembre 2025
  brand: {
    css: 'linear-gradient(135deg, #9c5698 0%, #FF5722 50%, #FFB10B 100%)',
    tailwind: 'from-[#9c5698] via-[#FF5722] to-[#FFB10B]',
    colors: {
      start: '#9c5698',  // Mauve (Owner Primary)
      mid: '#FF5722',    // Orange (Resident Primary)
      end: '#FFB10B'     // Jaune (Searcher Primary)
    },
    usage: [
      'Logo principal IzzIco',
      'Bouton "S\'inscrire" landing page',
      'Bouton "Continuer" onboarding',
      'Badge "Profil Vérifié"',
      'Action "Super Like"',
      'Empty states (icônes)',
      'Logo mobile'
    ]
  },

  // Gradient SEARCHER (orange → jaune doré)
  // Utilisé pour: Interface chercheurs de logement
  // Source: IZZICO_GRADIENTS_FIGMA.md - Gradient CTA Searcher
  searcher: {
    css: 'linear-gradient(135deg, #FFA040 0%, #FFB85C 50%, #FFD080 100%)',
    tailwind: 'from-[#FFA040] via-[#FFB85C] to-[#FFD080]',
    colors: {
      start: '#FFA040',  // Orange clair
      mid: '#FFB85C',    // Beige doré
      end: '#FFD080'     // Jaune doré
    }
  },

  // Gradient RESIDENT (terracotta → corail → orange)
  // Utilisé pour: Interface résidents/colocataires
  // Source: IZZICO_GRADIENTS_FIGMA.md - Gradient CTA Resident
  resident: {
    css: 'linear-gradient(135deg, #D97B6F 0%, #E8865D 50%, #FF8C4B 100%)',
    tailwind: 'from-[#D97B6F] via-[#E8865D] to-[#FF8C4B]',
    colors: {
      start: '#D97B6F',  // Terracotta
      mid: '#E8865D',    // Corail doux
      end: '#FF8C4B'     // Orange vif
    }
  },

  // Gradient OWNER (mauve → lavande → rose)
  // Utilisé pour: Interface propriétaires
  // Source: IZZICO_GRADIENTS_FIGMA.md - Gradient CTA Owner
  owner: {
    css: 'linear-gradient(135deg, #7B5FB8 0%, #A67BB8 50%, #C98B9E 100%)',
    tailwind: 'from-[#7B5FB8] via-[#A67BB8] to-[#C98B9E]',
    colors: {
      start: '#7B5FB8',  // Mauve foncé
      mid: '#A67BB8',    // Mauve rose
      end: '#C98B9E'     // Rose mauve
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
