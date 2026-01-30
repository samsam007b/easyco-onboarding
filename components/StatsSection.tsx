'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@/contexts/ThemeContext';
import { Home, Users, Star, CheckCircle, Building2, TrendingUp, Clock, Shield, Heart } from 'lucide-react';
import { type Role } from './landing/RoleSwitcher';

interface StatsSectionProps {
  activeRole: Role;
}

// Couleurs sémantiques UI (conventions UX du design system)
const SEMANTIC_COLORS = {
  // Logements/Properties - Teal (stabilité)
  home: { bg: '#70B0C0', light: '#F0FDFA' },
  // Utilisateurs/Communauté - Dusty Rose (social)
  users: { bg: '#D08090', light: '#FDF2F4' },
  // Satisfaction/Étoiles - Amber (positif, chaleur)
  satisfaction: { bg: '#D9A870', light: '#FFFBEB' },
  // Temps/Rapidité - Sky (efficacité)
  time: { bg: '#5B8BD9', light: '#EFF6FF' },
  // Sécurité - Sage (confiance, succès)
  security: { bg: '#7CB89B', light: '#F0F9F4' },
  // Support/Coeur - Dusty Rose (relationnel)
  support: { bg: '#D08090', light: '#FDF2F4' },
  // Croissance/Revenus - Sage (succès financier)
  growth: { bg: '#7CB89B', light: '#F0F9F4' },
  // Occupation/Building - Lavender (premium)
  occupation: { bg: '#9B7BD9', light: '#F5F3FF' },
  // Zéro impayé - Sage (succès)
  success: { bg: '#7CB89B', light: '#F0F9F4' },
};

// Couleurs de fond par rôle (tons très légers)
const ROLE_BG_COLORS = {
  searcher: {
    card: '#FFFBEB', // searcher-50
    cardDark: 'rgba(255, 160, 0, 0.08)',
    blob: '#FEF3C7', // searcher-100
    blobDark: 'rgba(255, 160, 0, 0.15)',
    text: '#A16300', // searcher-700 (accessible)
    border: 'rgba(255, 160, 0, 0.15)',
  },
  resident: {
    card: '#FEF2EE', // resident-50
    cardDark: 'rgba(224, 87, 71, 0.08)',
    blob: '#FDE0D6', // resident-100
    blobDark: 'rgba(224, 87, 71, 0.15)',
    text: '#9A362C', // resident-700 (accessible)
    border: 'rgba(224, 87, 71, 0.15)',
  },
  owner: {
    card: '#F8F0F7', // owner-50
    cardDark: 'rgba(156, 86, 152, 0.08)',
    blob: '#F0E0EE', // owner-100
    blobDark: 'rgba(156, 86, 152, 0.15)',
    text: '#633668', // owner-700 (accessible)
    border: 'rgba(156, 86, 152, 0.15)',
  },
};

interface Stat {
  icon: React.ElementType;
  value: string;
  label: string;
  iconColor: { bg: string; light: string };
}

// Contenu spécifique par rôle - aligné avec le HTML de référence
const roleContent: Record<Role, { title: string; subtitle: string; stats: Stat[]; trustBadge: string }> = {
  searcher: {
    title: 'Izzico en chiffres',
    subtitle: 'La confiance de milliers de chercheurs',
    stats: [
      { icon: Home, value: '247', label: 'Co-livings disponibles', iconColor: SEMANTIC_COLORS.home },
      { icon: Users, value: '1,842', label: 'Membres actifs', iconColor: SEMANTIC_COLORS.users },
      { icon: Star, value: '98%', label: 'Satisfaction', iconColor: SEMANTIC_COLORS.satisfaction },
    ],
    trustBadge: 'Toutes les annonces sont vérifiées par notre équipe',
  },
  resident: {
    title: 'Izzico en chiffres',
    subtitle: 'Simplifie ton quotidien',
    stats: [
      { icon: Clock, value: '3 min', label: 'Pour payer ton loyer', iconColor: SEMANTIC_COLORS.time },
      { icon: Shield, value: '100%', label: 'Paiements sécurisés', iconColor: SEMANTIC_COLORS.security },
      { icon: Heart, value: '24/7', label: 'Support disponible', iconColor: SEMANTIC_COLORS.support },
    ],
    trustBadge: 'Simplifie ton quotidien avec tes colocs',
  },
  owner: {
    title: 'Izzico en chiffres',
    subtitle: 'La gestion locative simplifiée',
    stats: [
      { icon: TrendingUp, value: '+15%', label: 'Revenus locatifs', iconColor: SEMANTIC_COLORS.growth },
      { icon: Building2, value: '98%', label: "Taux d'occupation", iconColor: SEMANTIC_COLORS.occupation },
      { icon: CheckCircle, value: '0€', label: 'Impayés', iconColor: SEMANTIC_COLORS.success },
    ],
    trustBadge: 'Rejoins les propriétaires qui nous font confiance',
  },
};

const contentVariants = {
  enter: { opacity: 0, y: 20 },
  center: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

export default function StatsSection({ activeRole }: StatsSectionProps) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';
  const roleColors = ROLE_BG_COLORS[activeRole];
  const content = roleContent[activeRole];

  return (
    <section
      className="py-20 transition-colors duration-500"
      style={{
        background: isDark
          ? 'linear-gradient(to bottom, #0F0F12 0%, #141418 50%, #0F0F12 100%)'
          : 'linear-gradient(to bottom, #FFFFFF 0%, rgba(249, 250, 251, 0.3) 50%, #FFFFFF 100%)',
      }}
    >
      <div className="max-w-6xl mx-auto px-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeRole}
            variants={contentVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.4 }}
          >
            {/* Section Header */}
            <div className="text-center mb-16">
              <h2
                className="text-4xl md:text-5xl font-bold mb-4"
                style={{ color: isDark ? '#F5F5F7' : roleColors.text }}
              >
                {content.title}
              </h2>
              <p className={`text-xl max-w-2xl mx-auto ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                {content.subtitle}
              </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {content.stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.4 }}
                    className="group relative"
                  >
                    {/* Stat Card with V3-fun design */}
                    <div
                      className="relative overflow-hidden rounded-3xl p-8 text-center transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
                      style={{
                        background: isDark ? roleColors.cardDark : roleColors.card,
                        border: `1px solid ${isDark ? roleColors.border : 'transparent'}`,
                      }}
                    >
                      {/* Decorative blob - top right */}
                      <div
                        className="absolute -top-10 -right-10 w-28 h-28 rounded-full opacity-60 transition-transform duration-300 group-hover:scale-110"
                        style={{
                          background: isDark ? roleColors.blobDark : roleColors.blob,
                        }}
                      />

                      {/* Decorative blob - bottom left (smaller) */}
                      <div
                        className="absolute -bottom-6 -left-6 w-20 h-20 rounded-full opacity-40"
                        style={{
                          background: isDark ? roleColors.blobDark : roleColors.blob,
                        }}
                      />

                      {/* Content */}
                      <div className="relative z-10">
                        {/* Icon - semantic color */}
                        <div
                          className="w-14 h-14 mx-auto mb-5 rounded-2xl flex items-center justify-center shadow-md transform group-hover:rotate-3 transition-transform duration-300"
                          style={{ background: stat.iconColor.bg }}
                        >
                          <Icon className="w-7 h-7 text-white" />
                        </div>

                        {/* Value - role color for hierarchy */}
                        <div
                          className="text-4xl md:text-5xl font-bold mb-3"
                          style={{ color: isDark ? '#F5F5F7' : roleColors.text }}
                        >
                          {stat.value}
                        </div>

                        {/* Label */}
                        <div className={`text-sm md:text-base font-medium leading-snug ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                          {stat.label}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Trust Badge */}
            <div className="mt-16 text-center">
              <div
                className="inline-flex items-center gap-3 px-8 py-4 rounded-full shadow-md"
                style={{
                  background: isDark ? roleColors.cardDark : roleColors.card,
                  border: `1px solid ${isDark ? roleColors.border : 'transparent'}`,
                }}
              >
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ background: SEMANTIC_COLORS.security.bg }}
                >
                  <CheckCircle className="w-5 h-5 text-white" />
                </div>
                <span className={`font-semibold text-lg ${isDark ? 'text-gray-100' : 'text-gray-800'}`}>
                  {content.trustBadge}
                </span>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
