'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@/contexts/ThemeContext';
import { User, Users, Home, Smartphone, Building2, BarChart3, FileText, Search, Wallet } from 'lucide-react';
import { type Role } from './landing/RoleSwitcher';

interface HowItWorksProps {
  activeRole: Role;
}

// Couleurs sémantiques UI (conventions UX du design system)
const SEMANTIC_COLORS = {
  // Profil/Identité - Lavender (premium, personnel)
  profile: { bg: '#9B7BD9', light: '#F5F3FF' },
  // Recherche/Exploration - Sky (découverte, confiance)
  search: { bg: '#5B8BD9', light: '#EFF6FF' },
  // Home/Logement - Teal (stabilité, foyer)
  home: { bg: '#70B0C0', light: '#F0FDFA' },
  // Mobile/App - Dusty Rose (moderne, accessible)
  mobile: { bg: '#D08090', light: '#FDF2F4' },
  // Paiements/Finance - Sage (succès financier)
  payment: { bg: '#7CB89B', light: '#F0F9F4' },
  // Documents - Sky (confiance, sécurité)
  documents: { bg: '#5B8BD9', light: '#EFF6FF' },
  // Analytics - Lavender (premium, insights)
  analytics: { bg: '#9B7BD9', light: '#F5F3FF' },
  // Utilisateurs/Candidatures - Teal
  users: { bg: '#70B0C0', light: '#F0FDFA' },
  // Propriété/Building - Terracotta
  property: { bg: '#C07070', light: '#FEF2F2' },
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
    gradient: 'linear-gradient(135deg, #ffa000 0%, #e05747 100%)',
  },
  resident: {
    card: '#FEF2EE', // resident-50
    cardDark: 'rgba(224, 87, 71, 0.08)',
    blob: '#FDE0D6', // resident-100
    blobDark: 'rgba(224, 87, 71, 0.15)',
    text: '#9A362C', // resident-700 (accessible)
    border: 'rgba(224, 87, 71, 0.15)',
    gradient: 'linear-gradient(135deg, #e05747 0%, #ff7c10 100%)',
  },
  owner: {
    card: '#F8F0F7', // owner-50
    cardDark: 'rgba(156, 86, 152, 0.08)',
    blob: '#F0E0EE', // owner-100
    blobDark: 'rgba(156, 86, 152, 0.15)',
    text: '#633668', // owner-700 (accessible)
    border: 'rgba(156, 86, 152, 0.15)',
    gradient: 'linear-gradient(135deg, #9c5698 0%, #c85570 100%)',
  },
};

interface Step {
  icon: React.ElementType;
  title: string;
  description: string;
  iconColor: { bg: string; light: string };
}

// Contenu spécifique par rôle - aligné avec le HTML de référence
const roleContent: Record<Role, { title: string; subtitle: string; steps: Step[]; cta: string; ctaLink: string }> = {
  searcher: {
    title: 'Comment ça marche ?',
    subtitle: 'Trouve ton co-living idéal en 3 étapes simples',
    steps: [
      {
        icon: User,
        title: 'Crée ton Living Persona',
        description: 'En 3 minutes, réponds à quelques questions sur ton style de vie, tes habitudes et tes préférences.',
        iconColor: SEMANTIC_COLORS.profile,
      },
      {
        icon: Search,
        title: 'Explore tes matchs',
        description: 'Découvre des co-livings et colocataires compatibles avec ton profil. Swipe, matche, discute.',
        iconColor: SEMANTIC_COLORS.search,
      },
      {
        icon: Home,
        title: 'Emménage sereinement',
        description: 'Visite, signe ton contrat en ligne et intègre ta nouvelle communauté.',
        iconColor: SEMANTIC_COLORS.home,
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
        iconColor: SEMANTIC_COLORS.mobile,
      },
      {
        icon: Home,
        title: 'Connecte ta résidence',
        description: 'Rejoins ta colocation et connecte-toi avec tes colocataires et ton propriétaire.',
        iconColor: SEMANTIC_COLORS.home,
      },
      {
        icon: Wallet,
        title: 'Gère ton quotidien',
        description: 'Partage les dépenses, gère les documents, et communique facilement avec tout le monde.',
        iconColor: SEMANTIC_COLORS.payment,
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
        iconColor: SEMANTIC_COLORS.property,
      },
      {
        icon: Users,
        title: 'Reçois des candidatures',
        description: 'Des candidats pré-qualifiés, compatibles avec tes résidents actuels.',
        iconColor: SEMANTIC_COLORS.users,
      },
      {
        icon: FileText,
        title: 'Signe en ligne',
        description: 'Contrats générés automatiquement, signature électronique sécurisée.',
        iconColor: SEMANTIC_COLORS.documents,
      },
      {
        icon: BarChart3,
        title: 'Encaisse sans effort',
        description: 'Loyers collectés automatiquement, reversés sur ton compte chaque mois.',
        iconColor: SEMANTIC_COLORS.analytics,
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
  const isDark = resolvedTheme === 'dark';
  const roleColors = ROLE_BG_COLORS[activeRole];
  const content = roleContent[activeRole];

  // Adapter la grille selon le nombre d'étapes (3 pour searcher/resident, 4 pour owner)
  const gridCols = content.steps.length === 4 ? 'md:grid-cols-4' : 'md:grid-cols-3';

  return (
    <section
      className="py-24 transition-colors duration-500"
      style={{
        background: isDark
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
                className="text-4xl md:text-5xl font-bold mb-4"
                style={{ color: isDark ? '#F5F5F7' : roleColors.text }}
              >
                {content.title}
              </h2>
              <p className={`text-xl max-w-2xl mx-auto leading-relaxed ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                {content.subtitle}
              </p>
            </div>

            {/* Steps */}
            <div className={`grid grid-cols-1 ${gridCols} gap-6 relative`}>
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
                    {/* Step Card with V3-fun design */}
                    <div
                      className="relative overflow-hidden rounded-3xl p-6 text-center transition-all duration-300 hover:shadow-xl hover:-translate-y-1 h-full flex flex-col"
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
                      <div className="relative z-10 flex flex-col h-full">
                        {/* Step Number + Icon container */}
                        <div className="relative inline-block mx-auto mb-5">
                          {/* Number Badge - gradient pour distinction */}
                          <div
                            className="absolute -top-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg z-10"
                            style={{ background: roleColors.gradient }}
                          >
                            {index + 1}
                          </div>

                          {/* Icon container - semantic color */}
                          <div
                            className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-md transform group-hover:rotate-3 transition-transform duration-300"
                            style={{ background: step.iconColor.bg }}
                          >
                            <Icon className="w-8 h-8 text-white" />
                          </div>
                        </div>

                        {/* Title - role color for hierarchy */}
                        <h3
                          className="text-xl font-bold mb-3"
                          style={{ color: isDark ? '#F5F5F7' : roleColors.text }}
                        >
                          {step.title}
                        </h3>

                        {/* Description */}
                        <p className={`text-sm leading-relaxed flex-grow ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                          {step.description}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* CTA - gradient réservé au CTA principal */}
            <div className="text-center mt-16">
              <a
                href={content.ctaLink}
                className="inline-block px-10 py-5 text-white font-bold rounded-full transition-all shadow-xl hover:shadow-2xl hover:scale-105 text-lg hover:brightness-110"
                style={{ background: roleColors.gradient }}
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
