// V3 Resident Theme Constants
// Centralized design tokens for the Resident dashboard
// Palette: Coral/Orange (#e05747 = official primary from brand guidelines)
//
// ⚠️ SOURCE DE VÉRITÉ: app/globals.css (CSS variables)
// Ce fichier DOIT être synchronisé manuellement avec globals.css
// Toute modification de couleur doit être faite dans globals.css D'ABORD,
// puis propagée ici pour les composants JS/TS.
//
// Référence: brand-identity/izzico-charte-graphique-complete.html

// Primary Resident Gradient (Coral/Orange - aligned with brand guidelines)
export const residentGradient = 'linear-gradient(135deg, #e05747 0%, #E96A50 25%, #F28B6A 50%, #F9B8A0 75%, #FDE0D6 100%)';
export const residentGradientSimple = 'linear-gradient(135deg, #e05747 0%, #F9B8A0 100%)';
export const residentGradientVibrant = 'linear-gradient(135deg, #C04538 0%, #e05747 50%, #E96A50 100%)';
export const residentGradientLight = 'linear-gradient(135deg, #FEF2EE 0%, #FDE0D6 100%)';
export const residentPageBackground = 'linear-gradient(135deg, #FEF2EE 0%, #FFFFFF 50%, #FDE0D6 100%)';

// Individual Resident Colors (aligned with official v3 scale)
// Source: brand-identity/izzico-charte-graphique-complete.html
export const residentColors = {
  primary: '#e05747',    // 500 - Coral primary (official)
  secondary: '#E96A50',  // 400 - Light coral
  tertiary: '#F28B6A',   // 300 - Soft coral
  quaternary: '#F9B8A0', // 200 - Cream coral
  accent: '#C04538',     // 600 - Vibrant coral (for CTAs)
} as const;

// Extended Resident Palette with light/bg variants for each color
// Aligned with v3 scale (50-900) from brand guidelines
export const residentPalette = {
  primary: {
    main: '#e05747',        // 500
    light: '#FEF2EE',       // 50
    bg: 'linear-gradient(135deg, #FEF2EE 0%, #FDE0D6 100%)', // 50→100
    text: '#9A362C',        // 700 (WCAG AA compliant)
    border: '#F9B8A0',      // 200
    shadow: 'rgba(224, 87, 71, 0.15)',
  },
  secondary: {
    main: '#E96A50',        // 400
    light: '#FDE0D6',       // 100
    bg: 'linear-gradient(135deg, #FDE0D6 0%, #F9B8A0 100%)', // 100→200
    text: '#9A362C',        // 700
    border: '#F28B6A',      // 300
    shadow: 'rgba(233, 106, 80, 0.15)',
  },
  tertiary: {
    main: '#F28B6A',        // 300
    light: '#FEF2EE',       // 50
    bg: 'linear-gradient(135deg, #FEF2EE 0%, #FDE0D6 100%)', // 50→100
    text: '#9A362C',        // 700
    border: '#F9B8A0',      // 200
    shadow: 'rgba(242, 139, 106, 0.15)',
  },
  quaternary: {
    main: '#F9B8A0',        // 200
    light: '#FEF2EE',       // 50
    bg: 'linear-gradient(135deg, #FEF2EE 0%, #FDE0D6 100%)', // 50→100
    text: '#9A362C',        // 700
    border: '#F28B6A',      // 300
    shadow: 'rgba(249, 184, 160, 0.15)',
  },
  accent: {
    main: '#C04538',        // 600 (vibrant)
    light: '#FDE0D6',       // 100
    bg: 'linear-gradient(135deg, #FDE0D6 0%, #F9B8A0 100%)', // 100→200
    text: '#742920',        // 800 (darker for contrast)
    border: '#F28B6A',      // 300
    shadow: 'rgba(192, 69, 56, 0.15)',
  },
} as const;

// Color usage by UI purpose (hierarchy guide)
export const residentUIColors = {
  // Header & Navigation
  headerIcon: residentPalette.primary.main,
  headerIconBg: residentPalette.primary.light,

  // KPI Cards - use different colors for variety
  kpiTasks: residentPalette.primary,        // Tâches
  kpiPayments: residentPalette.secondary,   // Paiements
  kpiEvents: residentPalette.tertiary,      // Événements
  kpiMessages: residentPalette.quaternary,  // Messages
  kpiMilestones: residentPalette.accent,    // Milestones

  // Buttons
  buttonPrimary: residentGradientVibrant,     // Full gradient - CTAs only
  buttonSecondary: residentPalette.secondary.main,
  buttonOutline: residentPalette.primary.main,

  // Charts
  chartArea: residentPalette.tertiary.main,
  chartLine: residentPalette.primary.main,
  chartBar: residentPalette.secondary.main,

  // Progress bars
  progressFill: residentPalette.primary.main,
  progressBg: residentPalette.primary.light,
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

// Task Status Colors
export const taskStatusColors = {
  pending: {
    gradient: residentGradientSimple,
    bg: '#FEF2EE',
    text: '#9A362C',
    border: '#F9B8A0',
  },
  inProgress: {
    gradient: semanticColors.info.gradient,
    bg: '#EFF6FF',
    text: '#1E40AF',
    border: '#93C5FD',
  },
  completed: {
    gradient: semanticColors.success.gradient,
    bg: '#ECFDF5',
    text: '#166534',
    border: '#86EFAC',
  },
  overdue: {
    gradient: semanticColors.danger.gradient,
    bg: '#FEF2F2',
    text: '#991B1B',
    border: '#FCA5A5',
  },
  cancelled: {
    gradient: 'linear-gradient(135deg, #6B7280 0%, #9CA3AF 100%)',
    bg: '#F9FAFB',
    text: '#374151',
    border: '#D1D5DB',
  },
} as const;

// Payment Status Colors
export const paymentStatusColors = {
  paid: {
    gradient: semanticColors.success.gradient,
    bg: '#ECFDF5',
    text: '#166534',
    label: 'Payé',
  },
  pending: {
    gradient: semanticColors.warning.gradient,
    bg: '#FFFBEB',
    text: '#92400E',
    label: 'En attente',
  },
  overdue: {
    gradient: semanticColors.danger.gradient,
    bg: '#FEF2F2',
    text: '#991B1B',
    label: 'En retard',
  },
  partial: {
    gradient: residentGradientSimple,
    bg: '#FEF2EE',
    text: '#9A362C',
    label: 'Partiel',
  },
} as const;

// Get task status category
export function getTaskStatusCategory(status: string): keyof typeof taskStatusColors {
  const normalized = status.toLowerCase().replace(/[_\s]/g, '');
  if (normalized.includes('progress') || normalized.includes('doing')) return 'inProgress';
  if (normalized.includes('completed') || normalized.includes('done')) return 'completed';
  if (normalized.includes('overdue') || normalized.includes('late')) return 'overdue';
  if (normalized.includes('cancelled') || normalized.includes('canceled')) return 'cancelled';
  return 'pending';
}

// Get payment status category
export function getPaymentStatusCategory(status: string): keyof typeof paymentStatusColors {
  const normalized = status.toLowerCase().replace(/[_\s]/g, '');
  if (normalized.includes('paid') || normalized.includes('complete')) return 'paid';
  if (normalized.includes('overdue') || normalized.includes('late')) return 'overdue';
  if (normalized.includes('partial')) return 'partial';
  return 'pending';
}

// Shadows (aligned with #e05747 = rgba(224, 87, 71))
export const residentShadows = {
  card: '0 4px 14px rgba(224, 87, 71, 0.1)',
  cardHover: '0 8px 24px rgba(224, 87, 71, 0.15)',
  button: '0 4px 14px rgba(192, 69, 56, 0.3)',        // Using 600 for buttons
  glow: '0 0 40px rgba(224, 87, 71, 0.3)',
} as const;

// Animation Variants (for Framer Motion)
export const residentAnimations = {
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
  @keyframes residentGlow {
    0%, 100% { transform: scale(1); opacity: 0.6; }
    50% { transform: scale(1.15); opacity: 0.8; }
  }
`;

// Float Animation CSS
export const floatKeyframes = `
  @keyframes residentFloat {
    0%, 100% { transform: translateY(0) rotate(0deg); }
    50% { transform: translateY(-2px) rotate(5deg); }
  }
`;

// Types
export type TaskStatus = keyof typeof taskStatusColors;
export type PaymentStatus = keyof typeof paymentStatusColors;
