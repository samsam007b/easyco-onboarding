'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/auth/supabase-client';
import { motion } from 'framer-motion';
import LoadingHouse from '@/components/ui/LoadingHouse';
import { useLanguage } from '@/lib/i18n/use-language';
import {
  User,
  Bell,
  Shield,
  Globe,
  CreditCard,
  Mail,
  Lock,
  Eye,
  Smartphone,
  ArrowRight,
  Check,
  ChevronRight,
  Settings as SettingsIcon,
  HelpCircle,
  Home,
  ArrowLeft,
  Sparkles,
  Receipt,
  FileText,
  Gift,
  BadgeCheck,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface SettingsSection {
  id: string;
  title: string;
  description: string;
  icon: any;
  href: string;
  badge?: string;
  color: string;
  category: 'account' | 'preferences' | 'advanced';
  requiresResidence?: boolean; // If true, hide for users without a residence
}

export default function SettingsPage() {
  const router = useRouter();
  const supabase = createClient();
  const [isLoading, setIsLoading] = useState(true);
  const [userType, setUserType] = useState<string>('');
  const [isCreator, setIsCreator] = useState(false);
  const [hasResidence, setHasResidence] = useState(false);
  const { getSection } = useLanguage();
  const settings = getSection('settings');

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }

      // Get user type
      const { data: userData } = await supabase
        .from('users')
        .select('user_type')
        .eq('id', user.id)
        .single();

      if (userData) {
        setUserType(userData.user_type);
      }

      // Check if user has a residence and if they are the creator
      const { data: membership } = await supabase
        .from('property_members')
        .select('property_id, is_creator')
        .eq('user_id', user.id)
        .eq('status', 'active')
        .maybeSingle();

      if (membership) {
        setHasResidence(true);
        setIsCreator(membership.is_creator || false);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Role-specific colors
  const getRoleColors = () => {
    if (userType === 'owner') return {
      gradient: 'from-purple-100 to-pink-100/70',
      light: 'from-purple-50/30 via-white to-pink-50/20',
      accent: 'purple',
      cardHover: 'hover:border-purple-200',
    };
    if (userType === 'resident') return {
      gradient: 'from-[#F5D5CF] to-[#FFDAC9]/70',
      light: 'from-[#FFF3EF]/30 via-white to-[#FFEBE5]/20',
      accent: 'orange',
      cardHover: 'hover:border-[#FFDAC9]',
    };
    return {
      gradient: 'from-[#FFA040] to-[#FFB85C]',
      light: 'from-orange-50 via-white to-yellow-50/30',
      accent: 'orange',
      cardHover: 'hover:border-orange-300',
    };
  };

  const colors = getRoleColors();

  const settingsSections: SettingsSection[] = [
    {
      id: 'profile',
      title: settings.sections?.profile?.title || 'Profil',
      description: settings.sections?.profile?.description || 'Gérer vos informations personnelles',
      icon: User,
      href: userType === 'owner' ? '/dashboard/my-profile-owner' : userType === 'resident' ? '/dashboard/my-profile-resident' : '/profile',
      color: 'bg-orange-100',
      category: 'account',
    },
    {
      id: 'security',
      title: settings.sections?.security?.title || 'Sécurité',
      description: settings.sections?.security?.description || 'Mot de passe et authentification',
      icon: Shield,
      href: '/settings/security',
      color: 'bg-red-100',
      category: 'account',
    },
    {
      id: 'verification',
      title: settings.sections?.verification?.title || 'Vérifications',
      description: settings.sections?.verification?.description || 'Téléphone, identité ITSME et badges',
      icon: BadgeCheck,
      href: '/settings/verification',
      color: 'bg-emerald-100',
      badge: settings.badges?.new || 'Nouveau',
      category: 'account',
    },
    {
      id: 'privacy',
      title: settings.sections?.privacy?.title || 'Confidentialité',
      description: settings.sections?.privacy?.description || 'Contrôler la visibilité de votre profil',
      icon: Eye,
      href: '/settings/privacy',
      color: 'bg-blue-100',
      category: 'account',
    },
    {
      id: 'private-codes',
      title: settings.sections?.privateCodes?.title || 'Codes Privés',
      description: settings.sections?.privateCodes?.description || 'Codes d\'invitation de votre résidence',
      icon: Lock,
      href: '/settings/private-codes',
      color: 'bg-purple-100',
      badge: isCreator ? (settings.badges?.creator || 'Créateur') : undefined,
      category: 'account',
      requiresResidence: true, // Hide for searchers without residence
    },
    {
      id: 'residence-profile',
      title: settings.sections?.residenceProfile?.title || 'Profil de la Résidence',
      description: settings.sections?.residenceProfile?.description || 'Gérer les informations de votre résidence',
      icon: Home,
      href: '/settings/residence-profile',
      color: 'bg-pink-100',
      badge: settings.badges?.new || 'New',
      category: 'account',
      requiresResidence: true, // Hide for searchers without residence
    },
    {
      id: 'referrals',
      title: settings.sections?.referrals?.title || 'Parrainage',
      description: settings.sections?.referrals?.description || 'Invitez vos amis et gagnez des mois gratuits',
      icon: Gift,
      href: '/settings/referrals',
      color: 'bg-green-100',
      badge: settings.badges?.new || 'Nouveau',
      category: 'account',
    },
    {
      id: 'invitations',
      title: settings.sections?.invitations?.title || 'Invitations',
      description: settings.sections?.invitations?.description || 'Gerez vos invitations a rejoindre des colocations',
      icon: Mail,
      href: '/settings/invitations',
      color: 'bg-amber-100',
      category: 'account',
      // Note: Invitations visible to all - searchers may receive invitations
    },
    {
      id: 'notifications',
      title: settings.sections?.notifications?.title || 'Notifications',
      description: settings.sections?.notifications?.description || 'Configurer vos préférences',
      icon: Bell,
      href: '/settings/notifications',
      color: 'bg-yellow-100',
      category: 'preferences',
    },
    {
      id: 'language',
      title: settings.sections?.language?.title || 'Langue & Région',
      description: settings.sections?.language?.description || 'Changer la langue de l\'interface',
      icon: Globe,
      href: '/settings/language',
      color: 'bg-emerald-100',
      category: 'preferences',
    },
    {
      id: 'email',
      title: settings.sections?.email?.title || 'Emails',
      description: settings.sections?.email?.description || 'Préférences de communications',
      icon: Mail,
      href: '/settings/email',
      color: 'bg-pink-100',
      category: 'preferences',
    },
    {
      id: 'subscription',
      title: settings.sections?.subscription?.title || 'Mon Abonnement',
      description: settings.sections?.subscription?.description || 'Gérer votre plan et votre essai gratuit',
      icon: Sparkles,
      href: '/dashboard/subscription',
      color: 'bg-gradient-to-br from-purple-100 to-pink-100',
      badge: 'Premium',
      category: 'advanced',
    },
    {
      id: 'payment',
      title: settings.sections?.payment?.title || 'Moyens de paiement',
      description: settings.sections?.payment?.description || 'Gérer vos cartes et méthodes de paiement',
      icon: CreditCard,
      href: '/settings/payment',
      color: 'bg-indigo-100',
      category: 'advanced',
    },
    {
      id: 'invoices',
      title: settings.sections?.invoices?.title || 'Factures',
      description: settings.sections?.invoices?.description || 'Historique et téléchargement des factures',
      icon: Receipt,
      href: '/settings/invoices',
      color: 'bg-emerald-100',
      category: 'advanced',
    },
    {
      id: 'devices',
      title: settings.sections?.devices?.title || 'Appareils',
      description: settings.sections?.devices?.description || 'Gérer vos sessions actives',
      icon: Smartphone,
      href: '/settings/devices',
      color: 'bg-cyan-100',
      category: 'advanced',
    },
  ];

  const categories = [
    { id: 'account', title: settings.categories?.account || 'Compte', icon: User },
    { id: 'preferences', title: settings.categories?.preferences || 'Préférences', icon: SettingsIcon },
    { id: 'advanced', title: settings.categories?.advanced || 'Avancé', icon: Shield },
  ] as const;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50/30 via-white to-orange-50/30">
        <div className="text-center">
          <LoadingHouse size={80} />
          <p className="text-gray-600 font-medium">{settings.loading || 'Chargement...'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50/30 via-white to-orange-50/30">
      {/* V3 Fun Header */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-br from-white/50 via-transparent to-white/30" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            {/* Back Button - V3 Style */}
            <Button
              onClick={() => {
                if (userType === 'owner') {
                  router.push('/dashboard/owner');
                } else if (userType === 'resident') {
                  router.push('/dashboard/resident');
                } else {
                  router.push('/dashboard/searcher');
                }
              }}
              variant="outline"
              className="mb-6 rounded-full border-gray-200 hover:border-transparent"
              style={{ color: '#ff651e' }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'linear-gradient(135deg, rgba(224, 87, 71, 0.08) 0%, rgba(255, 144, 20, 0.08) 100%)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              {settings.back || 'Retour'}
            </Button>

            <div className="text-center">
              {/* V3 Fun Icon with Glow */}
              <motion.div
                whileHover={{ scale: 1.05, rotate: 3 }}
                className="relative w-20 h-20 mx-auto mb-4"
              >
                {/* Glow effect */}
                <motion.div
                  className="absolute inset-0 rounded-2xl opacity-30"
                  style={{
                    background: 'linear-gradient(135deg, #e05747 0%, #ff651e 50%, #ff9014 100%)',
                    filter: 'blur(15px)',
                  }}
                  animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.4, 0.3] }}
                  transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
                />
                {/* Main icon container */}
                <div
                  className="relative w-20 h-20 rounded-2xl flex items-center justify-center shadow-lg"
                  style={{
                    background: 'linear-gradient(135deg, #e05747 0%, #ff651e 50%, #ff9014 100%)',
                    boxShadow: '0 8px 24px rgba(255, 101, 30, 0.3)',
                  }}
                >
                  <SettingsIcon className="w-10 h-10 text-white" />
                </div>
                {/* Floating sparkle */}
                <motion.div
                  className="absolute -top-1 -right-1"
                  animate={{ y: [-2, 2, -2], rotate: [0, 10, 0] }}
                  transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
                >
                  <Sparkles className="w-5 h-5 text-amber-400" />
                </motion.div>
              </motion.div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">{settings.title || 'Paramètres'}</h1>
              <p className="text-gray-600 text-lg">{settings.subtitle || 'Gérer votre compte et vos préférences'}</p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Settings Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        {categories.map((category, categoryIndex) => {
          const CategoryIcon = category.icon;
          // Filter sections by category and by residence requirement
          const categorySections = settingsSections.filter(s => {
            if (s.category !== category.id) return false;
            // Hide residence-related sections for users without a residence
            if (s.requiresResidence && !hasResidence) return false;
            return true;
          });

          return (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: categoryIndex * 0.1 }}
              className="mb-8"
            >
              {/* Category Header - V3 Style */}
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center shadow-md"
                  style={{
                    background: category.id === 'account'
                      ? 'linear-gradient(135deg, #e05747 0%, #ff651e 100%)'
                      : category.id === 'preferences'
                      ? 'linear-gradient(135deg, #ff651e 0%, #ff9014 100%)'
                      : 'linear-gradient(135deg, #ff9014 0%, #FFB85C 100%)',
                  }}
                >
                  <CategoryIcon className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">{category.title}</h2>
              </div>

              {/* Category Cards - V3 Fun Style */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {categorySections.map((section, index) => {
                  const Icon = section.icon;

                  // Get gradient colors based on section
                  const getIconGradient = () => {
                    switch (section.id) {
                      case 'profile': return 'linear-gradient(135deg, #e05747 0%, #ff651e 100%)';
                      case 'security': return 'linear-gradient(135deg, #D08080 0%, #E0A0A0 100%)';
                      case 'verification': return 'linear-gradient(135deg, #7CB89B 0%, #9FCFB5 100%)';
                      case 'privacy': return 'linear-gradient(135deg, #5B8BD9 0%, #7BA3E0 100%)';
                      case 'private-codes': return 'linear-gradient(135deg, #9B7BD9 0%, #B59BE0 100%)';
                      case 'residence-profile': return 'linear-gradient(135deg, #E07BAD 0%, #E0A0C0 100%)';
                      case 'referrals': return 'linear-gradient(135deg, #7CB89B 0%, #9FCFB5 100%)';
                      case 'invitations': return 'linear-gradient(135deg, #D97706 0%, #F59E0B 100%)';
                      case 'notifications': return 'linear-gradient(135deg, #D9A706 0%, #F5C30B 100%)';
                      case 'language': return 'linear-gradient(135deg, #7CB89B 0%, #9FCFB5 100%)';
                      case 'email': return 'linear-gradient(135deg, #E07BAD 0%, #E0A0C0 100%)';
                      case 'subscription': return 'linear-gradient(135deg, #9B7BD9 0%, #E07BAD 100%)';
                      case 'payment': return 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)';
                      case 'invoices': return 'linear-gradient(135deg, #7CB89B 0%, #9FCFB5 100%)';
                      case 'devices': return 'linear-gradient(135deg, #06B6D4 0%, #22D3EE 100%)';
                      default: return 'linear-gradient(135deg, #ff651e 0%, #ff9014 100%)';
                    }
                  };

                  return (
                    <motion.button
                      key={section.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: categoryIndex * 0.1 + index * 0.05 }}
                      whileHover={{ scale: 1.02, y: -4 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => router.push(section.href)}
                      className="group relative cursor-pointer bg-white rounded-2xl p-6 shadow-lg transition-all duration-300 text-left w-full overflow-hidden"
                      style={{ boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)' }}
                    >
                      {/* Decorative circle */}
                      <div
                        className="absolute -right-6 -top-6 w-24 h-24 rounded-full opacity-10"
                        style={{ background: getIconGradient() }}
                      />

                      <div className="relative">
                        {/* Icon with Badge */}
                        <div className="flex items-start justify-between mb-3">
                          <div
                            className="w-12 h-12 rounded-xl flex items-center justify-center shadow-md"
                            style={{ background: getIconGradient() }}
                          >
                            <Icon className="w-6 h-6 text-white" />
                          </div>
                          {section.badge && (
                            <span
                              className="px-2.5 py-1 rounded-lg text-xs font-semibold"
                              style={{
                                background: section.badge === 'Premium'
                                  ? 'linear-gradient(135deg, #F3E8FF 0%, #FCE7F3 100%)'
                                  : 'linear-gradient(135deg, #FFF5F3 0%, #FFE8E0 100%)',
                                color: section.badge === 'Premium' ? '#7C3AED' : '#ff651e',
                              }}
                            >
                              {section.badge}
                            </span>
                          )}
                        </div>

                        {/* Content */}
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900 mb-1">{section.title}</h3>
                            <p className="text-sm text-gray-500 leading-relaxed">{section.description}</p>
                          </div>
                          <div
                            className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-all group-hover:translate-x-1"
                            style={{ background: 'linear-gradient(135deg, #FFF5F3 0%, #FFE8E0 100%)' }}
                          >
                            <ChevronRight className="w-4 h-4" style={{ color: '#ff651e' }} />
                          </div>
                        </div>
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          );
        })}

        {/* Help Section - V3 Fun Style */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          whileHover={{ scale: 1.01 }}
          className="mt-8 rounded-3xl p-8 bg-white relative overflow-hidden shadow-lg"
          style={{ boxShadow: '0 8px 32px rgba(255, 101, 30, 0.12)' }}
        >
          {/* Decorative background */}
          <div
            className="absolute -right-12 -top-12 w-48 h-48 rounded-full opacity-10"
            style={{ background: 'linear-gradient(135deg, #e05747 0%, #ff651e 50%, #ff9014 100%)' }}
          />
          <div
            className="absolute -left-8 -bottom-8 w-32 h-32 rounded-full opacity-10"
            style={{ background: 'linear-gradient(135deg, #ff651e 0%, #ff9014 100%)' }}
          />

          <div className="relative flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg"
                style={{
                  background: 'linear-gradient(135deg, #e05747 0%, #ff651e 50%, #ff9014 100%)',
                  boxShadow: '0 6px 20px rgba(255, 101, 30, 0.3)',
                }}
              >
                <HelpCircle className="w-7 h-7 text-white" />
              </motion.div>
              <div>
                <h3 className="text-xl font-bold mb-1 text-gray-900">{settings.help?.title || 'Besoin d\'aide ?'}</h3>
                <p className="text-gray-500">{settings.help?.description || 'Consultez notre centre d\'aide ou contactez le support'}</p>
              </div>
            </div>
            <div className="flex gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => router.push('/help')}
                className="px-5 py-2.5 rounded-full border-2 border-gray-200 text-gray-700 hover:border-orange-200 transition-all duration-300 font-medium"
                style={{ background: 'linear-gradient(135deg, #FFF5F3 0%, #FFE8E0 100%)' }}
              >
                {settings.help?.helpCenter || 'Centre d\'aide'}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => router.push('/contact')}
                className="px-5 py-2.5 rounded-full text-white font-semibold shadow-lg transition-all duration-300"
                style={{
                  background: 'linear-gradient(135deg, #e05747 0%, #ff651e 50%, #ff9014 100%)',
                  boxShadow: '0 4px 14px rgba(255, 101, 30, 0.4)',
                }}
              >
                {settings.help?.contactSupport || 'Contacter le support'}
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Footer Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 text-center"
        >
          <p className="text-sm text-gray-500">Version 1.0.0 • Izzico © 2024</p>
        </motion.div>
      </div>
    </div>
  );
}
