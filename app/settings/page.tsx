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
  HelpCircle,
  Home,
  ArrowLeft
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
      title: 'Profil',
      description: 'Gérer vos informations personnelles',
      icon: User,
      href: userType === 'owner' ? '/dashboard/my-profile-owner' : userType === 'resident' ? '/dashboard/my-profile-resident' : '/profile',
      color: 'bg-orange-100',
      category: 'account',
    },
    {
      id: 'security',
      title: 'Sécurité',
      description: 'Mot de passe et authentification',
      icon: Shield,
      href: '/settings/security',
      color: 'bg-red-100',
      category: 'account',
    },
    {
      id: 'privacy',
      title: 'Confidentialité',
      description: 'Contrôler la visibilité de votre profil',
      icon: Eye,
      href: '/settings/privacy',
      color: 'bg-blue-100',
      category: 'account',
    },
    {
      id: 'private-codes',
      title: 'Codes Privés',
      description: 'Codes d\'invitation de votre résidence',
      icon: Lock,
      href: '/settings/private-codes',
      color: 'bg-purple-100',
      badge: userType === 'resident' ? 'Creator' : undefined,
      category: 'account',
    },
    {
      id: 'residence-profile',
      title: 'Profil de la Résidence',
      description: 'Gérer les informations de votre résidence',
      icon: Home,
      href: '/settings/residence-profile',
      color: 'bg-pink-100',
      badge: userType === 'resident' ? 'New' : undefined,
      category: 'account',
    },
    {
      id: 'notifications',
      title: 'Notifications',
      description: 'Configurer vos préférences',
      icon: Bell,
      href: '/dashboard/settings/preferences',
      color: 'bg-yellow-100',
      category: 'preferences',
    },
    {
      id: 'language',
      title: 'Langue & Région',
      description: 'Changer la langue de l\'interface',
      icon: Globe,
      href: '/settings/language',
      color: 'bg-emerald-100',
      category: 'preferences',
    },
    {
      id: 'email',
      title: 'Emails',
      description: 'Préférences de communications',
      icon: Mail,
      href: '/settings/email',
      color: 'bg-pink-100',
      category: 'preferences',
    },
    {
      id: 'payment',
      title: 'Paiement',
      description: 'Gérer vos moyens de paiement',
      icon: CreditCard,
      href: '/settings/payment',
      color: 'bg-indigo-100',
      badge: userType === 'owner' ? 'Pro' : undefined,
      category: 'advanced',
    },
    {
      id: 'devices',
      title: 'Appareils',
      description: 'Gérer vos sessions actives',
      icon: Smartphone,
      href: '/settings/devices',
      color: 'bg-cyan-100',
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
          <LoadingHouse size={80} />
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
            className="mb-8"
          >
            {/* Back Button */}
            <Button
              onClick={() => {
                // Navigation explicite pour éviter la boucle avec router.back()
                if (userType === 'owner') {
                  router.push('/dashboard/owner');
                } else if (userType === 'resident') {
                  router.push('/dashboard/resident');
                } else {
                  router.push('/dashboard/searcher');
                }
              }}
              variant="ghost"
              className="mb-6 rounded-full"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour
            </Button>

            <div className="text-center">
              <div className="inline-flex items-center gap-3 mb-4">
                <div className={cn(
                  "w-16 h-16 rounded-2xl flex items-center justify-center shadow-sm border border-gray-200",
                  userType === 'owner' ? 'bg-purple-100' :
                  userType === 'resident' ? 'bg-orange-100' :
                  'bg-orange-100'
                )}>
                  <SettingsIcon className={cn(
                    "w-8 h-8",
                    userType === 'owner' ? 'text-purple-600' :
                    userType === 'resident' ? 'text-orange-600' :
                    'text-orange-600'
                  )} />
                </div>
              </div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Paramètres</h1>
              <p className="text-gray-600 text-lg">Gérer votre compte et vos préférences</p>
            </div>
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
                <div className={cn(
                  "w-10 h-10 rounded-xl flex items-center justify-center border border-gray-200",
                  category.id === 'account' ? 'bg-orange-100' :
                  category.id === 'preferences' ? 'bg-blue-100' :
                  'bg-purple-100'
                )}>
                  <CategoryIcon className={cn(
                    "w-5 h-5",
                    category.id === 'account' ? 'text-orange-600' :
                    category.id === 'preferences' ? 'text-blue-600' :
                    'text-purple-600'
                  )} />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">{category.title}</h2>
              </div>

              {/* Category Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {categorySections.map((section, index) => {
                  const Icon = section.icon;

                  return (
                    <motion.button
                      key={section.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: categoryIndex * 0.1 + index * 0.05 }}
                      onClick={() => router.push(section.href)}
                      className="group relative cursor-pointer bg-white rounded-2xl p-6 border-2 border-gray-100 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 text-left w-full"
                    >
                      <div className="relative">
                        {/* Icon with Badge */}
                        <div className="flex items-start justify-between mb-3">
                          <div className={cn(
                            "w-12 h-12 rounded-xl flex items-center justify-center",
                            section.color
                          )}>
                            <Icon className={cn(
                              "w-6 h-6",
                              section.id === 'profile' ? 'text-orange-600' :
                              section.id === 'security' ? 'text-red-600' :
                              section.id === 'privacy' ? 'text-blue-600' :
                              section.id === 'private-codes' ? 'text-purple-600' :
                              section.id === 'residence-profile' ? 'text-pink-600' :
                              section.id === 'notifications' ? 'text-yellow-600' :
                              section.id === 'language' ? 'text-emerald-600' :
                              section.id === 'email' ? 'text-pink-600' :
                              section.id === 'payment' ? 'text-indigo-600' :
                              section.id === 'devices' ? 'text-cyan-600' :
                              'text-gray-700'
                            )} />
                          </div>
                          {section.badge && (
                            <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-orange-100 text-orange-700 border border-orange-200">
                              {section.badge}
                            </span>
                          )}
                        </div>

                        {/* Content */}
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900 mb-1">{section.title}</h3>
                            <p className="text-sm text-gray-600 leading-relaxed">{section.description}</p>
                          </div>
                          <svg
                            className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </div>
                    </motion.button>
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
          className="mt-8 rounded-3xl p-8 bg-white border-2 border-orange-100 relative overflow-hidden shadow-sm"
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center bg-gradient-to-br from-orange-100 to-orange-200">
                <HelpCircle className="w-7 h-7 text-orange-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-1 text-gray-900">Besoin d'aide ?</h3>
                <p className="text-gray-600">Consultez notre centre d'aide ou contactez le support</p>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => router.push('/help')}
                className="px-4 py-2 rounded-xl border-2 border-gray-200 text-gray-700 hover:bg-gray-50 transition-all duration-300 font-medium"
              >
                Centre d'aide
              </button>
              <button
                onClick={() => router.push('/contact')}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-500 to-purple-600 text-white hover:shadow-lg transition-all duration-300 font-semibold"
              >
                Contacter le support
              </button>
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
