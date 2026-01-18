// V3 Searcher Theme Constants
// Centralized design tokens for the Searcher dashboard
// Palette: Yellow/Gold/Amber (#ffa000 = official primary from brand guidelines)
//
// ⚠️ SOURCE DE VÉRITÉ: app/globals.css (CSS variables)
// Ce fichier DOIT être synchronisé manuellement avec globals.css
// Toute modification de couleur doit être faite dans globals.css D'ABORD,
// puis propagée ici pour les composants JS/TS.
//
// Référence: brand-identity/izzico-charte-graphique-complete.html

// Primary Searcher Gradient (Gold/Amber - aligned with brand guidelines)
export const searcherGradient = 'linear-gradient(135deg, #ffa000 0%, #FBBF24 25%, #FDE68A 50%, #FEF3C7 75%, #FFFBEB 100%)';
export const searcherGradientSimple = 'linear-gradient(135deg, #ffa000 0%, #FDE68A 100%)';
export const searcherGradientVibrant = 'linear-gradient(135deg, #D98400 0%, #ffa000 50%, #FBBF24 100%)';
export const searcherGradientLight = 'linear-gradient(135deg, #FFF9E6 0%, #FFFBEA 100%)';
export const searcherPageBackground = 'linear-gradient(135deg, #FFF9E6 0%, #FFFFFF 50%, #FFFBEA 100%)';

// Individual Searcher Colors (aligned with official v3 scale)
// Source: brand-identity/izzico-charte-graphique-complete.html
export const searcherColors = {
  primary: '#ffa000',    // 500 - Gold primary (official)
  secondary: '#FBBF24',  // 400 - Light gold
  tertiary: '#FDE68A',   // 200 - Soft yellow
  quaternary: '#FEF3C7', // 100 - Cream
  accent: '#D98400',     // 600 - Vibrant gold (for CTAs)
} as const;

// Extended Searcher Palette with light/bg variants for each color
// Aligned with v3 scale (50-900) from brand guidelines
export const searcherPalette = {
  primary: {
    main: '#ffa000',        // 500
    light: '#FFFBEB',       // 50
    bg: 'linear-gradient(135deg, #FFFBEB 0%, #FEF3C7 100%)', // 50→100
    text: '#A16300',        // 700 (WCAG AA compliant)
    border: '#FDE68A',      // 200
    shadow: 'rgba(255, 160, 0, 0.15)',
  },
  secondary: {
    main: '#FBBF24',        // 400
    light: '#FEF3C7',       // 100
    bg: 'linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%)', // 100→200
    text: '#A16300',        // 700
    border: '#FCD34D',      // 300
    shadow: 'rgba(251, 191, 36, 0.15)',
  },
  tertiary: {
    main: '#FDE68A',        // 200
    light: '#FFFBEB',       // 50
    bg: 'linear-gradient(135deg, #FFFBEB 0%, #FEF3C7 100%)', // 50→100
    text: '#A16300',        // 700
    border: '#FCD34D',      // 300
    shadow: 'rgba(253, 230, 138, 0.15)',
  },
  quaternary: {
    main: '#FEF3C7',        // 100
    light: '#FFFBEB',       // 50
    bg: 'linear-gradient(135deg, #FFFBEB 0%, #FEF3C7 100%)', // 50→100
    text: '#A16300',        // 700
    border: '#FDE68A',      // 200
    shadow: 'rgba(254, 243, 199, 0.15)',
  },
  accent: {
    main: '#D98400',        // 600 (vibrant)
    light: '#FEF3C7',       // 100
    bg: 'linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%)', // 100→200
    text: '#764800',        // 800 (darker for contrast)
    border: '#FCD34D',      // 300
    shadow: 'rgba(217, 132, 0, 0.15)',
  },
} as const;

// Color usage by UI purpose (hierarchy guide)
export const searcherUIColors = {
  // Header & Navigation
  headerIcon: searcherPalette.primary.main,
  headerIconBg: searcherPalette.primary.light,

  // KPI Cards - use different colors for variety
  kpiMatches: searcherPalette.primary,        // Top Matches
  kpiFavorites: searcherPalette.secondary,    // Favoris
  kpiApplications: searcherPalette.tertiary,  // Candidatures
  kpiVisits: searcherPalette.quaternary,      // Visites
  kpiMessages: searcherPalette.accent,        // Messages

  // Buttons
  buttonPrimary: searcherGradientVibrant,     // Full gradient - CTAs only
  buttonSecondary: searcherPalette.secondary.main,
  buttonOutline: searcherPalette.primary.main,

  // Charts
  chartArea: searcherPalette.tertiary.main,
  chartLine: searcherPalette.primary.main,
  chartBar: searcherPalette.secondary.main,

  // Progress bars
  progressFill: searcherPalette.primary.main,
  progressBg: searcherPalette.primary.light,
} as const;

// Semantic Colors (shared with other roles)
export const semanticColors = {
  success: {
    gradient: 'linear-gradient(135deg, #059669 0%, #10B981 100%)',
    light: 'linear-gradient(135deg, #ECFDF5 0%, #D1FAE5 100%)',
    text: '#166534',
    border: '#86EFAC',
    bg: '#F0FDF4',
  },
  warning: {
    gradient: 'linear-gradient(135deg, #D97706 0%, #F59E0B 100%)',
    light: 'linear-gradient(135deg, #FFFBEB 0%, #FEF3C7 100%)',
    text: '#92400E',
    border: '#FCD34D',
    bg: '#FFFBEB',
  },
  danger: {
    gradient: 'linear-gradient(135deg, #DC2626 0%, #EF4444 100%)',
    light: 'linear-gradient(135deg, #FEF2F2 0%, #FEE2E2 100%)',
    text: '#991B1B',
    border: '#FCA5A5',
    bg: '#FEF2F2',
  },
  info: {
    gradient: 'linear-gradient(135deg, #2563EB 0%, #3B82F6 100%)',
    light: 'linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%)',
    text: '#1E40AF',
    border: '#93C5FD',
    bg: '#EFF6FF',
  },
} as const;

// Application Status Colors
export const applicationStatusColors = {
  pending: {
    gradient: searcherGradientSimple,
    bg: '#FFF9E6',
    text: '#C67A30',
    border: '#FFD49A',
  },
  reviewing: {
    gradient: semanticColors.info.gradient,
    bg: '#EFF6FF',
    text: '#1E40AF',
    border: '#93C5FD',
  },
  approved: {
    gradient: semanticColors.success.gradient,
    bg: '#ECFDF5',
    text: '#166534',
    border: '#86EFAC',
  },
  rejected: {
    gradient: semanticColors.danger.gradient,
    bg: '#FEF2F2',
    text: '#991B1B',
    border: '#FCA5A5',
  },
  withdrawn: {
    gradient: 'linear-gradient(135deg, #6B7280 0%, #9CA3AF 100%)',
    bg: '#F9FAFB',
    text: '#374151',
    border: '#D1D5DB',
  },
} as const;

// Match Score Colors
export const matchScoreColors = {
  excellent: { // 80%+
    gradient: semanticColors.success.gradient,
    bg: '#ECFDF5',
    text: '#166534',
    label: 'Excellent',
  },
  good: { // 60-79%
    gradient: searcherGradientSimple,
    bg: '#FFF9E6',
    text: '#C67A30',
    label: 'Bon',
  },
  fair: { // 40-59%
    gradient: semanticColors.warning.gradient,
    bg: '#FFFBEB',
    text: '#92400E',
    label: 'Moyen',
  },
  low: { // < 40%
    gradient: 'linear-gradient(135deg, #6B7280 0%, #9CA3AF 100%)',
    bg: '#F9FAFB',
    text: '#374151',
    label: 'Faible',
  },
} as const;

// Get match score category
export function getMatchScoreCategory(score: number): keyof typeof matchScoreColors {
  if (score >= 80) return 'excellent';
  if (score >= 60) return 'good';
  if (score >= 40) return 'fair';
  return 'low';
}

// Shadows (aligned with #ffa000 = rgba(255, 160, 0))
export const searcherShadows = {
  card: '0 4px 14px rgba(255, 160, 0, 0.1)',
  cardHover: '0 8px 24px rgba(255, 160, 0, 0.15)',
  button: '0 4px 14px rgba(217, 132, 0, 0.3)',        // Using 600 for buttons
  glow: '0 0 40px rgba(255, 160, 0, 0.3)',
} as const;

// Animation Variants (for Framer Motion)
export const searcherAnimations = {
  fadeInUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
  },
  fadeInLeft: {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
  },
  fadeInRight: {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
  },
  scaleIn: {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
  },
  cardHover: {
    whileHover: { scale: 1.02, y: -4 },
    whileTap: { scale: 0.98 },
  },
  buttonHover: {
    whileHover: { scale: 1.05 },
    whileTap: { scale: 0.95 },
  },
  staggerChildren: {
    animate: { transition: { staggerChildren: 0.05 } },
  },
  staggerItem: {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
  },
} as const;

// Icon Glow Animation CSS
export const iconGlowKeyframes = `
  @keyframes searcherGlow {
    0%, 100% { transform: scale(1); opacity: 0.6; }
    50% { transform: scale(1.15); opacity: 0.8; }
  }
`;

// Sparkle Float Animation CSS
export const sparkleFloatKeyframes = `
  @keyframes sparkleFloat {
    0%, 100% { transform: translateY(0) rotate(0deg); }
    50% { transform: translateY(-2px) rotate(10deg); }
  }
`;

// Property Type Icons & Colors
export const propertyTypeConfig = {
  apartment: { label: 'Appartement', color: '#3B82F6', icon: 'Building2' },
  house: { label: 'Maison', color: '#10B981', icon: 'Home' },
  studio: { label: 'Studio', color: '#8B5CF6', icon: 'Square' },
  room: { label: 'Chambre', color: '#F59E0B', icon: 'Bed' },
  coliving: { label: 'Coliving', color: '#EC4899', icon: 'Users' },
  other: { label: 'Autre', color: '#6B7280', icon: 'MoreHorizontal' },
} as const;

// Amenity Icons & Colors
export const amenityConfig = {
  wifi: { label: 'WiFi', color: '#3B82F6' },
  parking: { label: 'Parking', color: '#6B7280' },
  gym: { label: 'Salle de sport', color: '#10B981' },
  pool: { label: 'Piscine', color: '#06B6D4' },
  garden: { label: 'Jardin', color: '#22C55E' },
  terrace: { label: 'Terrasse', color: '#F59E0B' },
  laundry: { label: 'Buanderie', color: '#8B5CF6' },
  pets: { label: 'Animaux acceptés', color: '#EC4899' },
  furnished: { label: 'Meublé', color: '#EAB308' },
  elevator: { label: 'Ascenseur', color: '#6366F1' },
} as const;

// Types
export type ApplicationStatus = keyof typeof applicationStatusColors;
export type MatchScoreCategory = keyof typeof matchScoreColors;
export type PropertyType = keyof typeof propertyTypeConfig;
export type Amenity = keyof typeof amenityConfig;
