'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/auth/supabase-client';
import { motion } from 'framer-motion';
import LoadingHouse from '@/components/ui/LoadingHouse';
import {
  Bell,
  MessageSquare,
  Calendar,
  DollarSign,
  Users,
  Megaphone,
  ArrowLeft,
  Check,
  Smartphone,
  Mail
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/lib/i18n/use-language';

export default function NotificationsPage() {
  const router = useRouter();
  const supabase = createClient();
  const { language, getSection } = useLanguage();
  const t = getSection('settings')?.notifications;
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const [notificationSettings, setNotificationSettings] = useState({
    // Push notifications
    pushEnabled: true,

    // Messages
    newMessage: true,

    // Events & Tasks
    newEvent: true,
    eventReminder: true,
    taskAssigned: true,
    taskDue: true,

    // Finances
    paymentReminder: true,
    paymentReceived: true,
    expenseCreated: true,

    // Community
    newMember: true,
    memberLeft: false,
    announcements: true,
  });

  useEffect(() => {
    loadNotificationSettings();
  }, []);

  const loadNotificationSettings = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }

      const { data: preferences } = await supabase
        .from('user_preferences')
        .select('notification_settings')
        .eq('user_id', user.id)
        .single();

      if (preferences?.notification_settings) {
        setNotificationSettings(preferences.notification_settings);
      }
    } catch (error) {
      console.error('Error loading notification settings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveSettings = async () => {
    setIsSaving(true);
    setMessage(null);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('user_preferences')
        .upsert({
          user_id: user.id,
          notification_settings: notificationSettings,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      setMessage({ type: 'success', text: t?.messages?.success?.[language] || 'Préférences de notifications enregistrées' });
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || (t?.messages?.error?.[language] || 'Erreur lors de l\'enregistrement') });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-50/30 via-white to-amber-50/30">
        <div className="text-center">
          <LoadingHouse size={80} />
          <p className="text-gray-600 font-medium mt-4">{t?.loading?.[language] || 'Chargement...'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50/30 via-white to-amber-50/30">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Button
            onClick={() => router.push('/settings')}
            variant="ghost"
            className="mb-4 rounded-full"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t?.back?.[language] || 'Retour aux paramètres'}
          </Button>

          <div className="flex items-center gap-4 mb-2">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-yellow-200/70 to-amber-200/70 flex items-center justify-center shadow-sm">
              <Bell className="w-8 h-8 text-gray-700" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900">{t?.title?.[language] || 'Notifications'}</h1>
              <p className="text-gray-600">{t?.subtitle?.[language] || 'Configurer vos préférences de notifications'}</p>
            </div>
          </div>
        </motion.div>

        {/* Message */}
        {message && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
              "mb-6 p-4 rounded-xl flex items-center gap-3",
              message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
            )}
          >
            <Check className="w-5 h-5" />
            <p className="font-medium">{message.text}</p>
          </motion.div>
        )}

        {/* Push Notifications Master Toggle */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200 shadow-sm mb-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-100 to-amber-100 flex items-center justify-center">
              <Smartphone className="w-6 h-6 text-gray-700" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-gray-900">{t?.push?.title?.[language] || 'Notifications Push'}</h2>
              <p className="text-sm text-gray-600">{t?.push?.subtitle?.[language] || 'Activer les notifications sur votre appareil'}</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={notificationSettings.pushEnabled}
                onChange={(e) => setNotificationSettings({ ...notificationSettings, pushEnabled: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-yellow-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-yellow-500"></div>
            </label>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Mail className="w-4 h-4" />
            <span>{t?.push?.emailNote?.[language] || 'Les notifications email peuvent être configurées dans la section Emails'}</span>
            <Button
              variant="ghost"
              className="text-orange-600 p-0 h-auto hover:bg-transparent hover:underline"
              onClick={() => router.push('/settings/email')}
            >
              {t?.push?.emailLink?.[language] || 'Configurer'}
            </Button>
          </div>
        </motion.div>

        {/* Messages Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200 shadow-sm mb-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-100 to-sky-100 flex items-center justify-center">
              <MessageSquare className="w-6 h-6 text-gray-700" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">{t?.messages?.title?.[language] || 'Messages'}</h2>
              <p className="text-sm text-gray-600">{t?.messages?.subtitle?.[language] || 'Notifications de messagerie'}</p>
            </div>
          </div>

          <label className="flex items-center justify-between p-4 rounded-xl border border-gray-200 cursor-pointer hover:bg-gray-50">
            <div>
              <p className="font-semibold text-gray-900">{t?.options?.newMessage?.title?.[language] || 'Nouveau message'}</p>
              <p className="text-sm text-gray-600">{t?.options?.newMessage?.description?.[language] || 'Recevoir une notification pour chaque nouveau message'}</p>
            </div>
            <input
              type="checkbox"
              checked={notificationSettings.newMessage}
              onChange={(e) => setNotificationSettings({ ...notificationSettings, newMessage: e.target.checked })}
              className="w-5 h-5 rounded text-yellow-600"
            />
          </label>
        </motion.div>

        {/* Events Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200 shadow-sm mb-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-100 to-indigo-100 flex items-center justify-center">
              <Calendar className="w-6 h-6 text-gray-700" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">{t?.events?.title?.[language] || 'Événements & Tâches'}</h2>
              <p className="text-sm text-gray-600">{t?.events?.subtitle?.[language] || 'Calendrier et tâches de la résidence'}</p>
            </div>
          </div>

          <div className="space-y-4">
            <label className="flex items-center justify-between p-4 rounded-xl border border-gray-200 cursor-pointer hover:bg-gray-50">
              <div>
                <p className="font-semibold text-gray-900">{t?.options?.newEvent?.title?.[language] || 'Nouvel événement'}</p>
                <p className="text-sm text-gray-600">{t?.options?.newEvent?.description?.[language] || 'Quand un événement est créé'}</p>
              </div>
              <input
                type="checkbox"
                checked={notificationSettings.newEvent}
                onChange={(e) => setNotificationSettings({ ...notificationSettings, newEvent: e.target.checked })}
                className="w-5 h-5 rounded text-yellow-600"
              />
            </label>

            <label className="flex items-center justify-between p-4 rounded-xl border border-gray-200 cursor-pointer hover:bg-gray-50">
              <div>
                <p className="font-semibold text-gray-900">{t?.options?.eventReminder?.title?.[language] || 'Rappel d\'événement'}</p>
                <p className="text-sm text-gray-600">{t?.options?.eventReminder?.description?.[language] || 'Rappel avant un événement'}</p>
              </div>
              <input
                type="checkbox"
                checked={notificationSettings.eventReminder}
                onChange={(e) => setNotificationSettings({ ...notificationSettings, eventReminder: e.target.checked })}
                className="w-5 h-5 rounded text-yellow-600"
              />
            </label>

            <label className="flex items-center justify-between p-4 rounded-xl border border-gray-200 cursor-pointer hover:bg-gray-50">
              <div>
                <p className="font-semibold text-gray-900">{t?.options?.taskAssigned?.title?.[language] || 'Tâche assignée'}</p>
                <p className="text-sm text-gray-600">{t?.options?.taskAssigned?.description?.[language] || 'Quand une tâche vous est assignée'}</p>
              </div>
              <input
                type="checkbox"
                checked={notificationSettings.taskAssigned}
                onChange={(e) => setNotificationSettings({ ...notificationSettings, taskAssigned: e.target.checked })}
                className="w-5 h-5 rounded text-yellow-600"
              />
            </label>

            <label className="flex items-center justify-between p-4 rounded-xl border border-gray-200 cursor-pointer hover:bg-gray-50">
              <div>
                <p className="font-semibold text-gray-900">{t?.options?.taskDue?.title?.[language] || 'Tâche à échéance'}</p>
                <p className="text-sm text-gray-600">{t?.options?.taskDue?.description?.[language] || 'Rappel avant l\'échéance d\'une tâche'}</p>
              </div>
              <input
                type="checkbox"
                checked={notificationSettings.taskDue}
                onChange={(e) => setNotificationSettings({ ...notificationSettings, taskDue: e.target.checked })}
                className="w-5 h-5 rounded text-yellow-600"
              />
            </label>
          </div>
        </motion.div>

        {/* Finances Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200 shadow-sm mb-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-100 to-emerald-100 flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-gray-700" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">{t?.finances?.title?.[language] || 'Finances'}</h2>
              <p className="text-sm text-gray-600">{t?.finances?.subtitle?.[language] || 'Paiements et dépenses'}</p>
            </div>
          </div>

          <div className="space-y-4">
            <label className="flex items-center justify-between p-4 rounded-xl border border-gray-200 cursor-pointer hover:bg-gray-50">
              <div>
                <p className="font-semibold text-gray-900">{t?.options?.paymentReminder?.title?.[language] || 'Rappel de paiement'}</p>
                <p className="text-sm text-gray-600">{t?.options?.paymentReminder?.description?.[language] || 'Rappel avant l\'échéance'}</p>
              </div>
              <input
                type="checkbox"
                checked={notificationSettings.paymentReminder}
                onChange={(e) => setNotificationSettings({ ...notificationSettings, paymentReminder: e.target.checked })}
                className="w-5 h-5 rounded text-yellow-600"
              />
            </label>

            <label className="flex items-center justify-between p-4 rounded-xl border border-gray-200 cursor-pointer hover:bg-gray-50">
              <div>
                <p className="font-semibold text-gray-900">{t?.options?.paymentReceived?.title?.[language] || 'Paiement reçu'}</p>
                <p className="text-sm text-gray-600">{t?.options?.paymentReceived?.description?.[language] || 'Confirmation de réception'}</p>
              </div>
              <input
                type="checkbox"
                checked={notificationSettings.paymentReceived}
                onChange={(e) => setNotificationSettings({ ...notificationSettings, paymentReceived: e.target.checked })}
                className="w-5 h-5 rounded text-yellow-600"
              />
            </label>

            <label className="flex items-center justify-between p-4 rounded-xl border border-gray-200 cursor-pointer hover:bg-gray-50">
              <div>
                <p className="font-semibold text-gray-900">{t?.options?.newExpense?.title?.[language] || 'Nouvelle dépense'}</p>
                <p className="text-sm text-gray-600">{t?.options?.newExpense?.description?.[language] || 'Quand une dépense partagée est créée'}</p>
              </div>
              <input
                type="checkbox"
                checked={notificationSettings.expenseCreated}
                onChange={(e) => setNotificationSettings({ ...notificationSettings, expenseCreated: e.target.checked })}
                className="w-5 h-5 rounded text-yellow-600"
              />
            </label>
          </div>
        </motion.div>

        {/* Community Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200 shadow-sm mb-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-100 to-amber-100 flex items-center justify-center">
              <Users className="w-6 h-6 text-gray-700" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">{t?.community?.title?.[language] || 'Communauté'}</h2>
              <p className="text-sm text-gray-600">{t?.community?.subtitle?.[language] || 'Activités de la résidence'}</p>
            </div>
          </div>

          <div className="space-y-4">
            <label className="flex items-center justify-between p-4 rounded-xl border border-gray-200 cursor-pointer hover:bg-gray-50">
              <div>
                <p className="font-semibold text-gray-900">{t?.options?.newMember?.title?.[language] || 'Nouveau membre'}</p>
                <p className="text-sm text-gray-600">{t?.options?.newMember?.description?.[language] || 'Quand quelqu\'un rejoint la résidence'}</p>
              </div>
              <input
                type="checkbox"
                checked={notificationSettings.newMember}
                onChange={(e) => setNotificationSettings({ ...notificationSettings, newMember: e.target.checked })}
                className="w-5 h-5 rounded text-yellow-600"
              />
            </label>

            <label className="flex items-center justify-between p-4 rounded-xl border border-gray-200 cursor-pointer hover:bg-gray-50">
              <div>
                <p className="font-semibold text-gray-900">{t?.options?.announcements?.title?.[language] || 'Annonces importantes'}</p>
                <p className="text-sm text-gray-600">{t?.options?.announcements?.description?.[language] || 'Notifications importantes de la résidence'}</p>
              </div>
              <input
                type="checkbox"
                checked={notificationSettings.announcements}
                onChange={(e) => setNotificationSettings({ ...notificationSettings, announcements: e.target.checked })}
                className="w-5 h-5 rounded text-yellow-600"
              />
            </label>
          </div>
        </motion.div>

        {/* Save Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
        >
          <Button
            onClick={handleSaveSettings}
            disabled={isSaving}
            className="w-full rounded-xl bg-gradient-to-r from-yellow-200/70 to-amber-200/70 text-gray-900 hover:from-yellow-300/70 hover:to-amber-300/70"
          >
            {isSaving ? (t?.buttons?.saving?.[language] || 'Enregistrement...') : (t?.buttons?.save?.[language] || 'Enregistrer les modifications')}
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
