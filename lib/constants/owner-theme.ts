// V3 Owner Theme Constants
// Centralized design tokens for the Owner dashboard

// Primary Owner Gradient (Mauve to Magenta)
export const ownerGradient = 'linear-gradient(135deg, #9c5698 0%, #a5568d 25%, #af5682 50%, #b85676 75%, #c2566b 100%)';
export const ownerGradientSimple = 'linear-gradient(135deg, #9c5698 0%, #c2566b 100%)';
export const ownerGradientLight = 'linear-gradient(135deg, #F8F0F7 0%, #FDF5F9 100%)';
export const ownerPageBackground = 'linear-gradient(135deg, #F8F0F7 0%, #FFFFFF 50%, #FDF5F9 100%)';

// Individual Owner Colors
export const ownerColors = {
  primary: '#9c5698',
  secondary: '#a5568d',
  tertiary: '#af5682',
  quaternary: '#b85676',
  accent: '#c2566b',
} as const;

// Semantic Colors
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

// Health Status Colors (for tenant health, lease status, etc.)
export const healthColors = {
  excellent: {
    gradient: semanticColors.success.gradient,
    bg: '#ECFDF5',
    text: '#166534',
    border: '#86EFAC',
  },
  attention: {
    gradient: semanticColors.warning.gradient,
    bg: '#FFFBEB',
    text: '#92400E',
    border: '#FCD34D',
  },
  critical: {
    gradient: semanticColors.danger.gradient,
    bg: '#FEF2F2',
    text: '#991B1B',
    border: '#FCA5A5',
  },
} as const;

// Priority Colors (for maintenance tickets)
export const priorityColors = {
  low: {
    gradient: 'linear-gradient(135deg, #6B7280 0%, #9CA3AF 100%)',
    bg: '#F9FAFB',
    text: '#374151',
    border: '#D1D5DB',
  },
  medium: {
    gradient: semanticColors.info.gradient,
    bg: '#EFF6FF',
    text: '#1E40AF',
    border: '#93C5FD',
  },
  high: {
    gradient: semanticColors.warning.gradient,
    bg: '#FFFBEB',
    text: '#92400E',
    border: '#FCD34D',
  },
  urgent: {
    gradient: semanticColors.danger.gradient,
    bg: '#FEF2F2',
    text: '#991B1B',
    border: '#FCA5A5',
  },
  emergency: {
    gradient: semanticColors.danger.gradient,
    bg: '#FEF2F2',
    text: '#991B1B',
    border: '#FCA5A5',
  },
} as const;

// Ticket Status Colors
export const statusColors = {
  open: {
    gradient: semanticColors.danger.gradient,
    bg: '#FEF2F2',
    text: '#991B1B',
  },
  in_progress: {
    gradient: semanticColors.warning.gradient,
    bg: '#FFFBEB',
    text: '#92400E',
  },
  resolved: {
    gradient: semanticColors.success.gradient,
    bg: '#ECFDF5',
    text: '#166534',
  },
  closed: {
    gradient: 'linear-gradient(135deg, #6B7280 0%, #9CA3AF 100%)',
    bg: '#F9FAFB',
    text: '#374151',
  },
} as const;

// Shadows
export const ownerShadows = {
  card: '0 4px 14px rgba(156, 86, 152, 0.1)',
  cardHover: '0 8px 24px rgba(156, 86, 152, 0.15)',
  button: '0 4px 14px rgba(156, 86, 152, 0.3)',
  glow: '0 0 40px rgba(156, 86, 152, 0.3)',
} as const;

// Animation Variants (for Framer Motion)
export const ownerAnimations = {
  fadeInUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
  },
  fadeInLeft: {
    initial: { opacity: 0, x: -20 },
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
} as const;

// Icon Glow Animation CSS
export const iconGlowKeyframes = `
  @keyframes ownerGlow {
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

// Category Icons & Colors (for maintenance)
export const categoryConfig = {
  plumbing: { label: 'Plomberie', color: '#3B82F6' },
  electrical: { label: 'Électricité', color: '#F59E0B' },
  heating: { label: 'Chauffage', color: '#EF4444' },
  appliances: { label: 'Électroménager', color: '#8B5CF6' },
  structural: { label: 'Structure', color: '#6B7280' },
  cleaning: { label: 'Nettoyage', color: '#10B981' },
  pest_control: { label: 'Nuisibles', color: '#F97316' },
  other: { label: 'Autre', color: '#9CA3AF' },
} as const;

export type HealthStatus = keyof typeof healthColors;
export type Priority = keyof typeof priorityColors;
export type TicketStatus = keyof typeof statusColors;
export type MaintenanceCategory = keyof typeof categoryConfig;
