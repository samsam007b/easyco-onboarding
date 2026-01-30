'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Target, Zap, Users, BarChart3, Home, Search, CheckCircle2, Calendar, MessageSquare, FileText, Wallet, Heart } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { type Role } from './RoleSwitcher';

interface RoleFeaturesSectionProps {
  activeRole: Role;
}

interface Feature {
  icon: React.ElementType;
  title: string;
  subtitle: string;
  description: string;
  gradient: string;
  borderColor: string;
  hoverBg: string;
}

const searcherFeatures: Feature[] = [
  {
    icon: Target,
    title: 'Living Match',
    subtitle: 'Trouve ceux qui te ressemblent',
    description: 'Crée ton Living Persona en 3 minutes — notre algorithme trouve les résidences et colocataires qui matchent vraiment avec toi.',
    gradient: 'linear-gradient(135deg, #ffa000, #e05747)',
    borderColor: 'rgba(255, 160, 0, 0.18)',
    hoverBg: 'rgba(255, 160, 0, 0.08)',
  },
  {
    icon: Shield,
    title: 'Annonces vérifiées',
    subtitle: 'Zéro arnaque, garanti',
    description: 'Chaque annonce est vérifiée par notre équipe. Photos réelles, propriétaires identifiés, contrats conformes.',
    gradient: 'linear-gradient(135deg, #ffa000, #ffa000)',
    borderColor: 'rgba(255, 160, 0, 0.18)',
    hoverBg: 'rgba(255, 160, 0, 0.08)',
  },
  {
    icon: Heart,
    title: 'Swipe & Match',
    subtitle: 'Trouve tes futurs colocs',
    description: 'Compatible à 87% ? Swipe, matche, discute. Découvre des profils vérifiés avec un score de compatibilité basé sur vos styles de vie.',
    gradient: 'linear-gradient(135deg, #e05747, #ffa000)',
    borderColor: 'rgba(224, 87, 71, 0.18)',
    hoverBg: 'rgba(224, 87, 71, 0.08)',
  },
];

const residentFeatures: Feature[] = [
  {
    icon: Wallet,
    title: 'Split & Scan',
    subtitle: 'Partage des dépenses sans prise de tête',
    description: 'Scanne un ticket, on calcule qui paie quoi. Automatiquement. Plus de discussions interminables sur les courses.',
    gradient: 'linear-gradient(135deg, #e05747, #e05747)',
    borderColor: 'rgba(224, 87, 71, 0.18)',
    hoverBg: 'rgba(224, 87, 71, 0.08)',
  },
  {
    icon: Target,
    title: 'Resident Swipe',
    subtitle: 'Trouve ton futur coloc',
    description: 'Un swipe de distance. Découvre des profils compatibles avec tes rythmes de vie, tes valeurs et tes hobbies.',
    gradient: 'linear-gradient(135deg, #e05747, #ffa000)',
    borderColor: 'rgba(224, 87, 71, 0.18)',
    hoverBg: 'rgba(224, 87, 71, 0.08)',
  },
  {
    icon: MessageSquare,
    title: 'Issue Hub',
    subtitle: 'Gère les réparations sereinement',
    description: "Une fuite ? Crée un ticket en 2 clics avec photos. Ton propriétaire reçoit la demande et suit l'avancement.",
    gradient: 'linear-gradient(135deg, #e05747, #9c5698)',
    borderColor: 'rgba(200, 85, 112, 0.18)',
    hoverBg: 'rgba(200, 85, 112, 0.08)',
  },
];

const ownerFeatures: Feature[] = [
  {
    icon: Users,
    title: 'Resident Match',
    subtitle: 'Les bons résidents, automatiquement',
    description: 'Reçois uniquement des candidatures compatibles avec tes résidents actuels. Moins de tri, plus de qualité.',
    gradient: 'linear-gradient(135deg, #9c5698, #9c5698)',
    borderColor: 'rgba(156, 86, 152, 0.18)',
    hoverBg: 'rgba(156, 86, 152, 0.08)',
  },
  {
    icon: BarChart3,
    title: 'Dashboard intuitif',
    subtitle: "Tout en un coup d'œil",
    description: 'Revenus, occupation, paiements en retard — toutes les infos importantes sur un seul écran.',
    gradient: 'linear-gradient(135deg, #9c5698, #c85570)',
    borderColor: 'rgba(156, 86, 152, 0.18)',
    hoverBg: 'rgba(156, 86, 152, 0.08)',
  },
  {
    icon: FileText,
    title: 'Contrats automatisés',
    subtitle: 'Génère et signe en ligne',
    description: 'Baux conformes, états des lieux digitaux, signatures électroniques. Tout est légal et archivé.',
    gradient: 'linear-gradient(135deg, #9c5698, #e05747)',
    borderColor: 'rgba(200, 85, 112, 0.18)',
    hoverBg: 'rgba(200, 85, 112, 0.08)',
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
  const { features, title, subtitle } = featuresByRole[activeRole];

  return (
    <section
      className="py-20 px-6 transition-colors duration-300"
      style={{
        background: resolvedTheme === 'dark'
          ? 'linear-gradient(to bottom, #141418, #0F0F12)'
          : 'linear-gradient(to bottom, #F9FAFB, #FFFFFF)',
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
              className="text-4xl font-bold mb-4 bg-clip-text text-transparent"
              style={{
                backgroundImage: activeRole === 'searcher'
                  ? 'linear-gradient(135deg, #ffa000 0%, #e05747 100%)'
                  : activeRole === 'resident'
                  ? 'linear-gradient(135deg, #e05747 0%, #ff7c10 100%)'
                  : 'linear-gradient(135deg, #9c5698 0%, #c85570 100%)',
              }}
            >
              {title}
            </h2>
            <p className={`text-lg ${resolvedTheme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
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
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
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
                  {/* Background gradient on hover */}
                  <div
                    className="absolute inset-0 superellipse-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{
                      background: resolvedTheme === 'dark'
                        ? feature.hoverBg.replace('0.08', '0.12')
                        : feature.hoverBg,
                    }}
                  />

                  <div
                    className="relative text-center space-y-4 p-8 superellipse-3xl border transition-all duration-300 hover:shadow-xl hover:scale-[1.02]"
                    style={{
                      background: resolvedTheme === 'dark' ? 'rgba(26, 26, 31, 0.8)' : '#FFFFFF',
                      borderColor: resolvedTheme === 'dark'
                        ? feature.borderColor.replace('0.18', '0.25')
                        : feature.borderColor,
                      backdropFilter: resolvedTheme === 'dark' ? 'blur(10px)' : 'none',
                    }}
                  >
                    {/* Icon */}
                    <div
                      className="w-16 h-16 mx-auto superellipse-2xl flex items-center justify-center shadow-lg"
                      style={{ background: feature.gradient }}
                    >
                      <Icon className="w-8 h-8 text-white" />
                    </div>

                    {/* Title */}
                    <h3
                      className="text-xl font-bold bg-clip-text text-transparent"
                      style={{ backgroundImage: feature.gradient }}
                    >
                      {feature.title}
                    </h3>

                    {/* Subtitle */}
                    <p className={`text-sm font-medium ${resolvedTheme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                      {feature.subtitle}
                    </p>

                    {/* Description */}
                    <p className={`text-sm ${resolvedTheme === 'dark' ? 'text-gray-400' : 'text-gray-600'} leading-relaxed`}>
                      {feature.description}
                    </p>
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
