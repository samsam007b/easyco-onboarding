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
  Check
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

  const settingsSections: SettingsSection[] = [
    {
      id: 'profile',
      title: 'Profil',
      description: 'Gérer vos informations personnelles',
      icon: User,
      href: userType === 'owner' ? '/dashboard/my-profile-owner' : userType === 'resident' ? '/dashboard/my-profile-resident' : '/profile',
      color: 'from-purple-500 to-purple-700',
    },
    {
      id: 'notifications',
      title: 'Notifications',
      description: 'Configurer vos préférences de notifications',
      icon: Bell,
      href: '/dashboard/settings/preferences',
      color: 'from-yellow-500 to-yellow-700',
    },
    {
      id: 'security',
      title: 'Sécurité',
      description: 'Mot de passe et authentification',
      icon: Shield,
      href: '/settings/security',
      color: 'from-red-500 to-red-700',
    },
    {
      id: 'privacy',
      title: 'Confidentialité',
      description: 'Contrôler la visibilité de votre profil',
      icon: Eye,
      href: '/settings/privacy',
      color: 'from-blue-500 to-blue-700',
    },
    {
      id: 'language',
      title: 'Langue & Région',
      description: 'Changer la langue de l\'interface',
      icon: Globe,
      href: '/settings/language',
      color: 'from-green-500 to-green-700',
    },
    {
      id: 'payment',
      title: 'Paiement',
      description: 'Gérer vos moyens de paiement',
      icon: CreditCard,
      href: '/settings/payment',
      color: 'from-indigo-500 to-indigo-700',
      badge: userType === 'owner' ? 'Pro' : undefined,
    },
    {
      id: 'email',
      title: 'Email & Communications',
      description: 'Préférences d\'emails et newsletters',
      icon: Mail,
      href: '/settings/email',
      color: 'from-pink-500 to-pink-700',
    },
    {
      id: 'devices',
      title: 'Appareils Connectés',
      description: 'Gérer vos sessions actives',
      icon: Smartphone,
      href: '/settings/devices',
      color: 'from-cyan-500 to-cyan-700',
    },
  ];

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
    <div className="min-h-screen bg-gradient-to-br from-purple-50/30 via-white to-purple-50/30">
      {/* Header with glassmorphism */}
      <div className="sticky top-0 z-40 backdrop-blur-xl bg-white/80 border-b border-purple-200/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Paramètres</h1>
              <p className="text-gray-600 mt-1">Gérer votre compte et vos préférences</p>
            </div>
            <Button
              onClick={() => router.back()}
              variant="outline"
              className="rounded-full"
            >
              Retour
            </Button>
          </div>
        </div>
      </div>

      {/* Settings Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {settingsSections.map((section, index) => {
            const Icon = section.icon;

            return (
              <motion.div
                key={section.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => router.push(section.href)}
                className="relative group cursor-pointer"
              >
                <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all border border-gray-200 hover:border-purple-300">
                  {/* Gradient Background Effect */}
                  <div className={cn(
                    "absolute top-0 right-0 w-24 h-24 rounded-full blur-3xl opacity-0 group-hover:opacity-20 transition-opacity",
                    `bg-gradient-to-br ${section.color}`
                  )} />

                  {/* Icon */}
                  <div className={cn(
                    "relative w-12 h-12 rounded-2xl flex items-center justify-center mb-4",
                    `bg-gradient-to-br ${section.color} shadow-lg`
                  )}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>

                  {/* Content */}
                  <div className="relative">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-bold text-gray-900">{section.title}</h3>
                      {section.badge && (
                        <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs font-bold rounded-full">
                          {section.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mb-4">{section.description}</p>

                    {/* Arrow */}
                    <div className="flex items-center text-purple-600 text-sm font-medium group-hover:gap-2 transition-all">
                      <span>Configurer</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8 bg-gradient-to-r from-purple-600 to-purple-700 rounded-2xl p-6 text-white"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold mb-1">Besoin d'aide ?</h3>
              <p className="text-purple-200 text-sm">Consultez notre centre d'aide ou contactez le support</p>
            </div>
            <div className="flex gap-3">
              <Button
                onClick={() => router.push('/help')}
                variant="outline"
                className="bg-white/10 border-white/30 text-white hover:bg-white/20 rounded-full"
              >
                Centre d'aide
              </Button>
              <Button
                onClick={() => router.push('/contact')}
                className="bg-white text-purple-700 hover:bg-white/90 rounded-full"
              >
                Contacter le support
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Account Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-6 text-center text-sm text-gray-500"
        >
          <p>Version 1.0.0 • EasyCo © 2024</p>
        </motion.div>
      </div>
    </div>
  );
}
