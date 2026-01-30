'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/lib/i18n/use-language';
import { useTheme } from '@/contexts/ThemeContext';
import { User, Target, Users, Home, Smartphone, Building2, BarChart3, FileText, Search, Heart, Wallet, MessageSquare } from 'lucide-react';
import { type Role } from './landing/RoleSwitcher';

interface HowItWorksProps {
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
    title: 'Comment ça marche ?',
    subtitle: 'Trouve ton co-living idéal en 3 étapes simples',
    steps: [
      {
        icon: User,
        title: 'Crée ton Living Persona',
        description: 'En 3 minutes, réponds à quelques questions sur ton style de vie, tes habitudes et tes préférences.',
      },
      {
        icon: Search,
        title: 'Explore tes matchs',
        description: 'Découvre des co-livings et colocataires compatibles avec ton profil. Swipe, matche, discute.',
      },
      {
        icon: Home,
        title: 'Emménage sereinement',
        description: 'Visite, signe ton contrat en ligne et intègre ta nouvelle communauté.',
      },
    ],
    cta: 'Créer mon Living Persona',
    ctaLink: '/onboarding/searcher',
  },
  resident: {
    title: 'Comment ça marche ?',
    subtitle: 'Simplifie ton quotidien en co-living',
    steps: [
      {
        icon: Smartphone,
        title: 'Télécharge l\'app',
        description: 'Disponible sur iOS et Android, installe l\'app Izzico en quelques secondes.',
      },
      {
        icon: Home,
        title: 'Connecte ta résidence',
        description: 'Rejoins ta colocation et connecte-toi avec tes colocataires et ton propriétaire.',
      },
      {
        icon: Wallet,
        title: 'Gère ton quotidien',
        description: 'Partage les dépenses, gère les documents, et communique facilement avec tout le monde.',
      },
    ],
    cta: 'Télécharger l\'app',
    ctaLink: '/auth',
  },
  owner: {
    title: 'Comment ça marche ?',
    subtitle: 'Gère tes biens efficacement en 4 étapes',
    steps: [
      {
        icon: Building2,
        title: 'Crée ton annonce',
        description: 'Ajoute tes propriétés en quelques clics avec photos, description et loyer.',
      },
      {
        icon: Users,
        title: 'Reçois des candidatures',
        description: 'Des candidats pré-qualifiés, compatibles avec tes résidents actuels.',
      },
      {
        icon: FileText,
        title: 'Signe en ligne',
        description: 'Contrats générés automatiquement, signature électronique sécurisée.',
      },
      {
        icon: BarChart3,
        title: 'Encaisse sans effort',
        description: 'Loyers collectés automatiquement, reversés sur ton compte chaque mois.',
      },
    ],
    cta: 'Ajouter mon bien',
    ctaLink: '/onboarding/owner',
  },
};

const contentVariants = {
  enter: { opacity: 0, y: 20 },
  center: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

export default function HowItWorks({ activeRole }: HowItWorksProps) {
  const { resolvedTheme } = useTheme();
  const colors = ROLE_COLORS[activeRole];
  const content = roleContent[activeRole];

  return (
    <section
      className="py-24 transition-colors duration-500"
      style={{
        background: resolvedTheme === 'dark'
          ? 'linear-gradient(to bottom, #141418, #0F0F12)'
          : 'linear-gradient(to bottom, #F9FAFB, #FFFFFF)',
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
            <div className="text-center mb-20">
              <h2
                className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent mb-4"
                style={{ backgroundImage: colors.gradient }}
              >
                {content.title}
              </h2>
              <p className={`text-xl max-w-2xl mx-auto leading-relaxed ${resolvedTheme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                {content.subtitle}
              </p>
            </div>

            {/* Steps */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
              {/* Decorative connecting line */}
              <div
                className="hidden md:block absolute top-1/4 left-1/6 right-1/6 h-1 -z-10"
                style={{ background: `linear-gradient(to right, transparent, ${colors.primary}30, transparent)` }}
              />

              {content.steps.map((step, index) => {
                const Icon = step.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.15, duration: 0.4 }}
                    className="relative group"
                  >
                    {/* Background glow on hover */}
                    <div
                      className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl -z-10"
                      style={{ background: colors.light }}
                    />

                    {/* Step Card */}
                    <div
                      className="relative rounded-3xl p-8 text-center hover:shadow-2xl transition-all duration-300 hover:scale-105 border h-full flex flex-col"
                      style={{
                        background: resolvedTheme === 'dark' ? 'rgba(26, 26, 31, 0.8)' : '#FFFFFF',
                        borderColor: resolvedTheme === 'dark' ? `${colors.primary}40` : colors.border,
                        backdropFilter: resolvedTheme === 'dark' ? 'blur(10px)' : 'none',
                      }}
                    >
                      {/* Step Number Badge */}
                      <div className="relative inline-block mx-auto mb-6">
                        {/* Number Badge */}
                        <div
                          className="absolute -top-3 -right-3 w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-xl z-10"
                          style={{ background: colors.gradient }}
                        >
                          {index + 1}
                        </div>

                        {/* Icon Circle */}
                        <div
                          className="w-24 h-24 rounded-2xl flex items-center justify-center shadow-lg transform group-hover:rotate-6 transition-transform duration-300"
                          style={{ background: colors.gradient }}
                        >
                          <Icon className="w-12 h-12 text-white" />
                        </div>
                      </div>

                      {/* Content */}
                      <h3
                        className="text-2xl font-bold bg-clip-text text-transparent mb-4"
                        style={{ backgroundImage: colors.gradient }}
                      >
                        {step.title}
                      </h3>
                      <p className={`leading-relaxed text-lg flex-grow ${resolvedTheme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                        {step.description}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* CTA */}
            <div className="text-center mt-16">
              <a
                href={content.ctaLink}
                className="inline-block px-10 py-5 text-white font-bold rounded-full transition-all shadow-xl hover:shadow-2xl hover:scale-105 text-lg hover:brightness-110"
                style={{ background: colors.gradient }}
              >
                {content.cta}
              </a>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
