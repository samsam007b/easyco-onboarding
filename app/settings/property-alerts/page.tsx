'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/auth/supabase-client';
import { motion } from 'framer-motion';
import LoadingHouse from '@/components/ui/LoadingHouse';
import { toast } from 'sonner';
import { getHookTranslation } from '@/lib/i18n/get-language';
import {
  BellRing,
  ArrowLeft,
  Check,
  FileText,
  Wrench,
  DollarSign,
  Users,
  Calendar,
  AlertTriangle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/lib/i18n/use-language';

interface AlertSetting {
  id: string;
  label: string;
  description: string;
  icon: any;
  enabled: boolean;
  category: 'leases' | 'maintenance' | 'payments' | 'tenants';
}

export default function PropertyAlertsPage() {
  const router = useRouter();
  const supabase = createClient();
  const { getSection } = useLanguage();
  const settings = getSection('settings');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [userType, setUserType] = useState<string>('');

  const [alertSettings, setAlertSettings] = useState<AlertSetting[]>([
    // Leases
    {
      id: 'lease_expiring_30',
      label: 'Bail expirant (30 jours)',
      description: 'Recevoir une alerte 30 jours avant expiration',
      icon: FileText,
      enabled: true,
      category: 'leases',
    },
    {
      id: 'lease_expiring_7',
      label: 'Bail expirant (7 jours)',
      description: 'Recevoir une alerte 7 jours avant expiration',
      icon: AlertTriangle,
      enabled: true,
      category: 'leases',
    },
    // Maintenance
    {
      id: 'maintenance_urgent',
      label: 'Maintenance urgente',
      description: 'Alertes immédiates pour les demandes urgentes',
      icon: Wrench,
      enabled: true,
      category: 'maintenance',
    },
    {
      id: 'maintenance_pending_48h',
      label: 'Tickets non traités (48h)',
      description: 'Rappel si un ticket est en attente depuis 48h',
      icon: Wrench,
      enabled: true,
      category: 'maintenance',
    },
    // Payments
    {
      id: 'payment_received',
      label: 'Paiement reçu',
      description: 'Notification quand un loyer est encaissé',
      icon: DollarSign,
      enabled: true,
      category: 'payments',
    },
    {
      id: 'payment_overdue',
      label: 'Paiement en retard',
      description: 'Alerte si un loyer est en retard',
      icon: DollarSign,
      enabled: true,
      category: 'payments',
    },
    {
      id: 'payment_reminder_tenant',
      label: 'Rappels automatiques locataires',
      description: 'Envoyer des rappels automatiques avant échéance',
      icon: Calendar,
      enabled: false,
      category: 'payments',
    },
    // Tenants
    {
      id: 'new_application',
      label: 'Nouvelle candidature',
      description: 'Notification pour chaque nouvelle candidature',
      icon: Users,
      enabled: true,
      category: 'tenants',
    },
    {
      id: 'tenant_message',
      label: 'Message locataire',
      description: 'Notification pour les messages des locataires',
      icon: Users,
      enabled: true,
      category: 'tenants',
    },
  ]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }

      // Check if user is owner
      const { data: userData } = await supabase
        .from('users')
        .select('user_type')
        .eq('id', user.id)
        .single();

      if (userData?.user_type !== 'owner') {
        router.push('/settings');
        return;
      }

      setUserType(userData.user_type);

      // Load saved preferences
      const { data: preferences } = await supabase
        .from('user_preferences')
        .select('property_alert_settings')
        .eq('user_id', user.id)
        .single();

      if (preferences?.property_alert_settings) {
        setAlertSettings(prev => prev.map(setting => ({
          ...setting,
          enabled: preferences.property_alert_settings[setting.id] ?? setting.enabled,
        })));
      }
    } catch (error) {
      console.error('Error loading alert settings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleSetting = (id: string) => {
    setAlertSettings(prev => prev.map(setting =>
      setting.id === id ? { ...setting, enabled: !setting.enabled } : setting
    ));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const settingsMap = alertSettings.reduce((acc, s) => {
        acc[s.id] = s.enabled;
        return acc;
      }, {} as Record<string, boolean>);

      const { error } = await supabase
        .from('user_preferences')
        .upsert({
          user_id: user.id,
          property_alert_settings: settingsMap,
          updated_at: new Date().toISOString(),
        });

      if (error) throw error;

      toast.success(getHookTranslation('alerts', 'saved'));
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error(getHookTranslation('alerts', 'saveFailed'));
    } finally {
      setIsSaving(false);
    }
  };

  const categories = [
    { id: 'leases', label: 'Baux', icon: FileText },
    { id: 'maintenance', label: 'Maintenance', icon: Wrench },
    { id: 'payments', label: 'Paiements', icon: DollarSign },
    { id: 'tenants', label: 'Locataires', icon: Users },
  ] as const;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50/30 via-white to-purple-50/30">
        <LoadingHouse />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50/30 via-white to-purple-50/30">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200/50 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => router.push('/settings')}
                className="rounded-full"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 superellipse-xl flex items-center justify-center shadow-md"
                  style={{ background: 'linear-gradient(135deg, #9B7BD9 0%, #B59BE0 100%)' }}
                >
                  <BellRing className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">
                    {settings?.sections?.propertyAlerts?.title || 'Alertes propriétés'}
                  </h1>
                  <p className="text-sm text-gray-500">
                    Configurez vos notifications
                  </p>
                </div>
              </div>
            </div>
            <Button
              onClick={handleSave}
              disabled={isSaving}
              className="bg-gradient-to-r from-purple-500 to-purple-600 text-white superellipse-xl"
            >
              {isSaving ? 'Sauvegarde...' : 'Sauvegarder'}
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {categories.map((category, categoryIndex) => {
          const categorySettings = alertSettings.filter(s => s.category === category.id);
          const CategoryIcon = category.icon;

          return (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: categoryIndex * 0.1 }}
              className="mb-8"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center">
                  <CategoryIcon className="w-4 h-4 text-purple-600" />
                </div>
                <h2 className="text-lg font-semibold text-gray-900">{category.label}</h2>
              </div>

              <div className="space-y-3">
                {categorySettings.map((setting) => {
                  const Icon = setting.icon;
                  return (
                    <motion.button
                      key={setting.id}
                      onClick={() => toggleSetting(setting.id)}
                      className={cn(
                        'w-full p-4 superellipse-xl border transition-all text-left flex items-center justify-between',
                        setting.enabled
                          ? 'bg-purple-50/50 border-purple-200'
                          : 'bg-white/60 border-gray-200 hover:border-gray-300'
                      )}
                      whileHover={{ scale: 1.005 }}
                      whileTap={{ scale: 0.995 }}
                    >
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          'w-10 h-10 superellipse-xl flex items-center justify-center',
                          setting.enabled ? 'bg-purple-100' : 'bg-gray-100'
                        )}>
                          <Icon className={cn(
                            'w-5 h-5',
                            setting.enabled ? 'text-purple-600' : 'text-gray-400'
                          )} />
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900">{setting.label}</h3>
                          <p className="text-sm text-gray-500">{setting.description}</p>
                        </div>
                      </div>
                      <div className={cn(
                        'w-6 h-6 rounded-full flex items-center justify-center transition-colors',
                        setting.enabled
                          ? 'bg-purple-500'
                          : 'bg-gray-200'
                      )}>
                        {setting.enabled && <Check className="w-4 h-4 text-white" />}
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
