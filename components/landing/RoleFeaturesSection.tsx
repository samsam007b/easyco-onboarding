'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Users, MessageSquare, FileText, Wallet, Heart, UserPlus, AlertTriangle, PieChart } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { type Role } from './RoleSwitcher';

interface RoleFeaturesSectionProps {
  activeRole: Role;
}

// Couleurs sémantiques UI (conventions UX du design system)
const SEMANTIC_COLORS = {
  // Matching/Compatibilité - Dusty Rose (social, relationnel)
  match: { bg: '#D08090', light: '#FDF2F4' },
  // Vérification/Sécurité - Sage (succès, validation)
  verified: { bg: '#7CB89B', light: '#F0F9F4' },
  // Groupe/Social - Dusty Rose
  social: { bg: '#D08090', light: '#FDF2F4' },
  // Communication - Blush
  communication: { bg: '#E07BAD', light: '#FDF2F8' },
  // Paiements/Finance - Sage (succès financier)
  payment: { bg: '#7CB89B', light: '#F0F9F4' },
  // Documents - Sky (confiance, sécurité)
  documents: { bg: '#5B8BD9', light: '#EFF6FF' },
  // Alertes - Amber
  alert: { bg: '#D9A870', light: '#FFFBEB' },
  // Analytics - Lavender (premium)
  analytics: { bg: '#9B7BD9', light: '#F5F3FF' },
  // Utilisateurs - Teal
  users: { bg: '#70B0C0', light: '#F0FDFA' },
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

interface Feature {
  icon: React.ElementType;
  title: string;
  subtitle: string;
  description: string;
  iconColor: { bg: string; light: string };
}

const searcherFeatures: Feature[] = [
  {
    icon: Heart,
    title: 'Living Match',
    subtitle: 'Compatibilité intelligente',
    description: 'Notre algorithme analyse ton Living Persona pour te proposer des colocations et colocataires compatibles.',
    iconColor: SEMANTIC_COLORS.match,
  },
  {
    icon: Shield,
    title: '100% Vérifié',
    subtitle: 'Zéro mauvaise surprise',
    description: 'Chaque bien est visité et validé par notre équipe. Photos réelles, propriétaires vérifiés.',
    iconColor: SEMANTIC_COLORS.verified,
  },
  {
    icon: UserPlus,
    title: 'Recherche en groupe',
    subtitle: 'Cherche avec tes amis',
    description: 'Tu cherches avec des amis ? Créez un groupe et trouvez ensemble le co-living parfait.',
    iconColor: SEMANTIC_COLORS.social,
  },
  {
    icon: MessageSquare,
    title: 'Chat direct',
    subtitle: 'Communique facilement',
    description: 'Contacte les propriétaires et futurs colocataires directement depuis l\'app.',
    iconColor: SEMANTIC_COLORS.communication,
  },
];

const residentFeatures: Feature[] = [
  {
    icon: Wallet,
    title: 'Paiements simplifiés',
    subtitle: 'Fini les calculs',
    description: 'Split du loyer, partage des charges, tout est automatisé.',
    iconColor: SEMANTIC_COLORS.payment,
  },
  {
    icon: FileText,
    title: 'Documents centralisés',
    subtitle: 'Tout au même endroit',
    description: 'Contrats, quittances, règlement intérieur... accessibles en un clic.',
    iconColor: SEMANTIC_COLORS.documents,
  },
  {
    icon: MessageSquare,
    title: 'Communication fluide',
    subtitle: 'Reste connecté',
    description: 'Chat de groupe, annonces, planning partagé avec tes colocataires.',
    iconColor: SEMANTIC_COLORS.communication,
  },
  {
    icon: AlertTriangle,
    title: 'Signalement rapide',
    subtitle: 'Problème résolu vite',
    description: 'Un problème ? Signale-le en 2 clics. Le proprio est notifié.',
    iconColor: SEMANTIC_COLORS.alert,
  },
];

const ownerFeatures: Feature[] = [
  {
    icon: Users,
    title: 'Locataires pré-qualifiés',
    subtitle: 'Candidats triés sur le volet',
    description: 'Candidatures avec dossier complet et score de compatibilité.',
    iconColor: SEMANTIC_COLORS.users,
  },
  {
    icon: Wallet,
    title: 'Paiements garantis',
    subtitle: 'Loyers sécurisés',
    description: 'Loyers collectés automatiquement, reversés en un virement.',
    iconColor: SEMANTIC_COLORS.payment,
  },
  {
    icon: FileText,
    title: 'Contrats automatisés',
    subtitle: 'Signature en ligne',
    description: 'Génération automatique, signature électronique, archivage.',
    iconColor: SEMANTIC_COLORS.documents,
  },
  {
    icon: PieChart,
    title: 'Analytics détaillés',
    subtitle: 'Pilotez vos biens',
    description: 'Revenus, occupation, incidents... toutes les métriques clés.',
    iconColor: SEMANTIC_COLORS.analytics,
  },
];

const featuresByRole: Record<Role, { features: Feature[]; title: string; subtitle: string }> = {
  searcher: {
    features: searcherFeatures,
    title: 'Trouve ton co-living idéal',
    subtitle: 'Des outils pensés pour ta recherche',
  },
  resident: {
    features: residentFeatures,
    title: 'Simplifie ton quotidien',
    subtitle: 'Des outils pensés pour la vie en co-living',
  },
  owner: {
    features: ownerFeatures,
    title: 'Gère tes biens efficacement',
    subtitle: 'Des outils pensés pour les propriétaires',
  },
};

const contentVariants = {
  enter: { opacity: 0, y: 20 },
  center: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

export default function RoleFeaturesSection({ activeRole }: RoleFeaturesSectionProps) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';
  const { features, title, subtitle } = featuresByRole[activeRole];
  const roleColors = ROLE_BG_COLORS[activeRole];

  return (
    <section
      className="py-20 px-6 transition-colors duration-300"
      style={{
        background: isDark
          ? 'linear-gradient(to bottom, #141418, #0F0F12)'
          : 'linear-gradient(to bottom, #FAFAFA, #FFFFFF)',
      }}
    >
      <div className="max-w-6xl mx-auto">
        {/* Section Title */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeRole}
            variants={contentVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.3 }}
            className="text-center mb-16"
          >
            <h2
              className="text-4xl font-bold mb-4"
              style={{ color: isDark ? '#F5F5F7' : roleColors.text }}
            >
              {title}
            </h2>
            <p className={`text-lg ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              {subtitle}
            </p>
          </motion.div>
        </AnimatePresence>

        {/* Features Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeRole}
            variants={contentVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.4 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="relative group"
                >
                  {/* Card with V3-fun design */}
                  <div
                    className="relative overflow-hidden rounded-3xl p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
                    style={{
                      background: isDark ? roleColors.cardDark : roleColors.card,
                      border: `1px solid ${isDark ? roleColors.border : 'transparent'}`,
                    }}
                  >
                    {/* Decorative blob - top right */}
                    <div
                      className="absolute -top-8 -right-8 w-24 h-24 rounded-full opacity-60 transition-transform duration-300 group-hover:scale-110"
                      style={{
                        background: isDark ? roleColors.blobDark : roleColors.blob,
                      }}
                    />

                    {/* Decorative blob - bottom left (smaller) */}
                    <div
                      className="absolute -bottom-4 -left-4 w-16 h-16 rounded-full opacity-40"
                      style={{
                        background: isDark ? roleColors.blobDark : roleColors.blob,
                      }}
                    />

                    {/* Content */}
                    <div className="relative z-10">
                      {/* Icon container - solid color, not gradient */}
                      <div
                        className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4 shadow-md"
                        style={{ background: feature.iconColor.bg }}
                      >
                        <Icon className="w-6 h-6 text-white" />
                      </div>

                      {/* Title - role color for hierarchy */}
                      <h3
                        className="text-lg font-bold mb-1"
                        style={{ color: isDark ? '#F5F5F7' : roleColors.text }}
                      >
                        {feature.title}
                      </h3>

                      {/* Subtitle */}
                      <p className={`text-sm font-medium mb-3 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                        {feature.subtitle}
                      </p>

                      {/* Description */}
                      <p className={`text-sm leading-relaxed ${isDark ? 'text-gray-500' : 'text-gray-600'}`}>
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
