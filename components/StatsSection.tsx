'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@/contexts/ThemeContext';
import { Home, Users, Star, CheckCircle, Building2, TrendingUp, Clock, Shield, Heart, Wallet, BarChart3 } from 'lucide-react';
import { type Role } from './landing/RoleSwitcher';

interface StatsSectionProps {
  activeRole: Role;
}

// Couleurs du design system v3 - couleurs primaires exactes par rôle
const ROLE_COLORS = {
  owner: {
    primary: '#9c5698',
    secondary: '#c85570',
    gradient: 'linear-gradient(135deg, #9c5698 0%, #c85570 100%)',
    light: 'rgba(156, 86, 152, 0.1)',
    border: 'rgba(156, 86, 152, 0.2)',
  },
  resident: {
    primary: '#e05747',
    secondary: '#ff7c10',
    gradient: 'linear-gradient(135deg, #e05747 0%, #ff7c10 100%)',
    light: 'rgba(224, 87, 71, 0.1)',
    border: 'rgba(224, 87, 71, 0.2)',
  },
  searcher: {
    primary: '#ffa000',
    secondary: '#e05747',
    gradient: 'linear-gradient(135deg, #ffa000 0%, #e05747 100%)',
    light: 'rgba(255, 160, 0, 0.1)',
    border: 'rgba(255, 160, 0, 0.2)',
  },
};

// Contenu spécifique par rôle - aligné avec le HTML de référence
const roleContent = {
  searcher: {
    title: 'Izzico en chiffres',
    subtitle: 'La confiance de milliers de chercheurs',
    stats: [
      { icon: Home, value: '247', label: 'Co-livings disponibles' },
      { icon: Users, value: '1,842', label: 'Membres actifs' },
      { icon: Star, value: '98%', label: 'Satisfaction' },
    ],
    trustBadge: 'Toutes les annonces sont vérifiées par notre équipe',
  },
  resident: {
    title: 'Izzico en chiffres',
    subtitle: 'Simplifie ton quotidien',
    stats: [
      { icon: Clock, value: '3 min', label: 'Pour payer ton loyer' },
      { icon: Shield, value: '100%', label: 'Paiements sécurisés' },
      { icon: Heart, value: '24/7', label: 'Support disponible' },
    ],
    trustBadge: 'Simplifie ton quotidien avec tes colocs',
  },
  owner: {
    title: 'Izzico en chiffres',
    subtitle: 'La gestion locative simplifiée',
    stats: [
      { icon: TrendingUp, value: '+15%', label: 'Revenus locatifs' },
      { icon: Building2, value: '98%', label: "Taux d'occupation" },
      { icon: CheckCircle, value: '0€', label: 'Impayés' },
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
  const colors = ROLE_COLORS[activeRole];
  const content = roleContent[activeRole];

  return (
    <section
      className="py-20 transition-colors duration-500"
      style={{
        background: resolvedTheme === 'dark'
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
                className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent mb-4"
                style={{ backgroundImage: colors.gradient }}
              >
                {content.title}
              </h2>
              <p className={`text-xl max-w-2xl mx-auto ${resolvedTheme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
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
                    {/* Glow effect on hover */}
                    <div
                      className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl"
                      style={{ background: colors.light }}
                    />

                    {/* Stat Card */}
                    <div
                      className="relative rounded-3xl p-8 text-center shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 border"
                      style={{
                        background: resolvedTheme === 'dark' ? 'rgba(26, 26, 31, 0.8)' : '#FFFFFF',
                        borderColor: resolvedTheme === 'dark' ? `${colors.primary}40` : colors.border,
                        backdropFilter: resolvedTheme === 'dark' ? 'blur(10px)' : 'none',
                      }}
                    >
                      {/* Icon */}
                      <div
                        className="w-16 h-16 mx-auto mb-6 rounded-2xl flex items-center justify-center shadow-lg transform group-hover:rotate-6 transition-transform duration-300"
                        style={{ background: colors.gradient }}
                      >
                        <Icon className="w-8 h-8 text-white" />
                      </div>

                      {/* Value */}
                      <div
                        className="text-4xl md:text-5xl font-bold mb-3 bg-clip-text text-transparent"
                        style={{ backgroundImage: colors.gradient }}
                      >
                        {stat.value}
                      </div>

                      {/* Label */}
                      <div className={`text-sm md:text-base font-medium leading-snug ${resolvedTheme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                        {stat.label}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Trust Badge */}
            <div className="mt-16 text-center">
              <div
                className="inline-flex items-center gap-3 px-8 py-4 rounded-full shadow-md border"
                style={{
                  background: resolvedTheme === 'dark'
                    ? `linear-gradient(to right, ${colors.primary}15, ${colors.secondary}15)`
                    : `linear-gradient(to right, ${colors.light}, ${colors.light})`,
                  borderColor: resolvedTheme === 'dark' ? `${colors.primary}40` : colors.border,
                }}
              >
                <CheckCircle style={{ color: colors.primary }} className="w-6 h-6" />
                <span className={`font-semibold text-lg ${resolvedTheme === 'dark' ? 'text-gray-100' : 'text-gray-800'}`}>
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
