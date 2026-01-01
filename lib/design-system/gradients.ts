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

  // Gradient RESIDENT (Option C - Palette officielle V3)
  // Utilisé pour: Interface résidents/colocataires
  // Palette: #e05747 → #f8572b → #ff651e → #ff7b19 → #ff9014
  resident: {
    css: 'linear-gradient(135deg, #e05747 0%, #ff651e 50%, #ff9014 100%)',
    tailwind: 'from-[#e05747] via-[#ff651e] to-[#ff9014]',
    colors: {
      start: '#e05747',  // Dark orange
      mid: '#ff651e',    // Primary orange
      end: '#ff9014'     // Light orange/gold
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
