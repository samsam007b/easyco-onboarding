'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/auth/supabase-client';
import { motion } from 'framer-motion';
import LoadingHouse from '@/components/ui/LoadingHouse';
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
  HelpCircle
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
}

export default function SettingsPage() {
  const router = useRouter();
  const supabase = createClient();
  const [isLoading, setIsLoading] = useState(true);
  const [userType, setUserType] = useState<string>('');

  useEffect(() => {
    loadUserType();
  }, []);

  const loadUserType = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }

      const { data: userData } = await supabase
        .from('users')
        .select('user_type')
        .eq('id', user.id)
        .single();

      if (userData) {
        setUserType(userData.user_type);
      }
    } catch (error) {
      console.error('Error loading user type:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Role-specific colors
  const getRoleColors = () => {
    if (userType === 'owner') return {
      gradient: 'from-purple-600 to-purple-700',
      light: 'from-purple-50 via-white to-purple-50/30',
      accent: 'purple',
      cardHover: 'hover:border-purple-300',
    };
    if (userType === 'resident') return {
      gradient: 'from-orange-600 to-red-600',
      light: 'from-orange-50 via-white to-red-50/30',
      accent: 'orange',
      cardHover: 'hover:border-orange-300',
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
      title: 'Profil',
      description: 'Gérer vos informations personnelles',
      icon: User,
      href: userType === 'owner' ? '/dashboard/my-profile-owner' : userType === 'resident' ? '/dashboard/my-profile-resident' : '/profile',
      color: 'from-orange-400 to-yellow-500',
      category: 'account',
    },
    {
      id: 'security',
      title: 'Sécurité',
      description: 'Mot de passe et authentification',
      icon: Shield,
      href: '/settings/security',
      color: 'from-red-500 to-red-600',
      category: 'account',
    },
    {
      id: 'privacy',
      title: 'Confidentialité',
      description: 'Contrôler la visibilité de votre profil',
      icon: Eye,
      href: '/settings/privacy',
      color: 'from-blue-500 to-blue-600',
      category: 'account',
    },
    {
      id: 'private-codes',
      title: 'Codes Privés',
      description: 'Codes d\'invitation de votre résidence',
      icon: Lock,
      href: '/settings/private-codes',
      color: 'from-purple-500 to-indigo-600',
      badge: userType === 'resident' ? 'Creator' : undefined,
      category: 'account',
    },
    {
      id: 'notifications',
      title: 'Notifications',
      description: 'Configurer vos préférences',
      icon: Bell,
      href: '/dashboard/settings/preferences',
      color: 'from-yellow-500 to-orange-600',
      category: 'preferences',
    },
    {
      id: 'language',
      title: 'Langue & Région',
      description: 'Changer la langue de l\'interface',
      icon: Globe,
      href: '/settings/language',
      color: 'from-green-500 to-emerald-600',
      category: 'preferences',
    },
    {
      id: 'email',
      title: 'Emails',
      description: 'Préférences de communications',
      icon: Mail,
      href: '/settings/email',
      color: 'from-pink-500 to-rose-600',
      category: 'preferences',
    },
    {
      id: 'payment',
      title: 'Paiement',
      description: 'Gérer vos moyens de paiement',
      icon: CreditCard,
      href: '/settings/payment',
      color: 'from-indigo-500 to-purple-600',
      badge: userType === 'owner' ? 'Pro' : undefined,
      category: 'advanced',
    },
    {
      id: 'devices',
      title: 'Appareils',
      description: 'Gérer vos sessions actives',
      icon: Smartphone,
      href: '/settings/devices',
      color: 'from-cyan-500 to-blue-600',
      category: 'advanced',
    },
  ];

  const categories = [
    { id: 'account', title: 'Compte', icon: User },
    { id: 'preferences', title: 'Préférences', icon: SettingsIcon },
    { id: 'advanced', title: 'Avancé', icon: Shield },
  ] as const;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-white">
        <div className="text-center">
          <LoadingHouse size={64} />
          <p className="text-gray-600 font-medium">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("min-h-screen bg-gradient-to-br", colors.light)}>
      {/* Premium Header */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-br from-white/50 via-transparent to-white/30" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <div className="inline-flex items-center gap-3 mb-4">
              <div className={cn("w-16 h-16 rounded-2xl flex items-center justify-center shadow-xl", `bg-gradient-to-br ${colors.gradient}`)}>
                <SettingsIcon className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Paramètres</h1>
            <p className="text-gray-600 text-lg">Gérer votre compte et vos préférences</p>
          </motion.div>
        </div>
      </div>

      {/* Settings Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        {categories.map((category, categoryIndex) => {
          const CategoryIcon = category.icon;
          const categorySections = settingsSections.filter(s => s.category === category.id);

          return (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: categoryIndex * 0.1 }}
              className="mb-8"
            >
              {/* Category Header */}
              <div className="flex items-center gap-3 mb-4">
                <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", `bg-gradient-to-br ${colors.gradient}`)}>
                  <CategoryIcon className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">{category.title}</h2>
              </div>

              {/* Category Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {categorySections.map((section, index) => {
                  const Icon = section.icon;

                  return (
                    <motion.div
                      key={section.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: categoryIndex * 0.1 + index * 0.05 }}
                      onClick={() => router.push(section.href)}
                      className={cn(
                        "group relative cursor-pointer bg-white/80 backdrop-blur-sm rounded-2xl p-5 border border-gray-200 transition-all hover:shadow-xl hover:scale-[1.02]",
                        colors.cardHover
                      )}
                    >
                      {/* Hover Gradient Effect */}
                      <div className={cn(
                        "absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-10 transition-opacity",
                        `bg-gradient-to-br ${section.color}`
                      )} />

                      <div className="relative">
                        {/* Icon with Badge */}
                        <div className="flex items-start justify-between mb-3">
                          <div className={cn(
                            "w-12 h-12 rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow",
                            `bg-gradient-to-br ${section.color}`
                          )}>
                            <Icon className="w-6 h-6 text-white" />
                          </div>
                          {section.badge && (
                            <span className={cn(
                              "px-2.5 py-1 rounded-lg text-xs font-bold shadow-sm",
                              `bg-gradient-to-br ${colors.gradient} text-white`
                            )}>
                              {section.badge}
                            </span>
                          )}
                        </div>

                        {/* Content */}
                        <h3 className="font-bold text-gray-900 mb-1.5 flex items-center justify-between">
                          {section.title}
                          <ChevronRight className="w-4 h-4 text-gray-400 group-hover:translate-x-1 transition-transform" />
                        </h3>
                        <p className="text-sm text-gray-600 leading-relaxed">{section.description}</p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          );
        })}

        {/* Help Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className={cn(
            "mt-8 rounded-3xl p-8 text-white relative overflow-hidden",
            `bg-gradient-to-r ${colors.gradient}`
          )}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-black/10" />
          <div className="relative flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <HelpCircle className="w-7 h-7 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-1">Besoin d'aide ?</h3>
                <p className="text-white/80">Consultez notre centre d'aide ou contactez le support</p>
              </div>
            </div>
            <div className="flex gap-3">
              <Button
                onClick={() => router.push('/help')}
                variant="outline"
                className="bg-white/10 border-white/30 text-white hover:bg-white/20 backdrop-blur-sm rounded-xl"
              >
                Centre d'aide
              </Button>
              <Button
                onClick={() => router.push('/contact')}
                className="bg-white text-gray-900 hover:bg-white/90 rounded-xl font-semibold"
              >
                Contacter le support
              </Button>
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
          <p className="text-sm text-gray-500">Version 1.0.0 • EasyCo © 2024</p>
        </motion.div>
      </div>
    </div>
  );
}
