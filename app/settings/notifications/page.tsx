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

      setMessage({ type: 'success', text: t?.messages?.success?.[language] || 'Notification preferences saved' });
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || (t?.messages?.error?.[language] || 'Error saving preferences') });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-searcher-50/30 via-white to-searcher-50/30">
        <div className="text-center">
          <LoadingHouse size={80} />
          <p className="text-gray-600 font-medium mt-4">{t?.loading?.[language] || 'Loading...'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-searcher-50/30 via-white to-searcher-50/30">
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
            {t?.back?.[language] || 'Back to settings'}
          </Button>

          <div className="flex items-center gap-4 mb-2">
            <div className="w-16 h-16 superellipse-2xl bg-gradient-to-br from-searcher-200/70 to-searcher-200/70 flex items-center justify-center shadow-sm">
              <Bell className="w-8 h-8 text-gray-700" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900">{t?.title?.[language] || 'Notifications'}</h1>
              <p className="text-gray-600">{t?.subtitle?.[language] || 'Configure your notification preferences'}</p>
            </div>
          </div>
        </motion.div>

        {/* Message */}
        {message && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
              "mb-6 p-4 superellipse-xl flex items-center gap-3",
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
          className="bg-white/80 backdrop-blur-sm superellipse-2xl p-6 border border-gray-200 shadow-sm mb-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 superellipse-xl bg-gradient-to-br from-searcher-100 to-searcher-100 flex items-center justify-center">
              <Smartphone className="w-6 h-6 text-gray-700" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-gray-900">{t?.push?.title?.[language] || 'Push Notifications'}</h2>
              <p className="text-sm text-gray-600">{t?.push?.subtitle?.[language] || 'Enable notifications on your device'}</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={notificationSettings.pushEnabled}
                onChange={(e) => setNotificationSettings({ ...notificationSettings, pushEnabled: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-searcher-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-searcher-500"></div>
            </label>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Mail className="w-4 h-4" />
            <span>{t?.push?.emailNote?.[language] || 'Email notifications can be configured in the Email section'}</span>
            <Button
              variant="ghost"
              className="text-resident-600 p-0 h-auto hover:bg-transparent hover:underline"
              onClick={() => router.push('/settings/email')}
            >
              {t?.push?.emailLink?.[language] || 'Configure'}
            </Button>
          </div>
        </motion.div>

        {/* Messages Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-white/80 backdrop-blur-sm superellipse-2xl p-6 border border-gray-200 shadow-sm mb-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 superellipse-xl bg-gradient-to-br from-blue-100 to-sky-100 flex items-center justify-center">
              <MessageSquare className="w-6 h-6 text-gray-700" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">{t?.messages?.title?.[language] || 'Messages'}</h2>
              <p className="text-sm text-gray-600">{t?.messages?.subtitle?.[language] || 'Messaging notifications'}</p>
            </div>
          </div>

          <label className="flex items-center justify-between p-4 superellipse-xl border border-gray-200 cursor-pointer hover:bg-gray-50">
            <div>
              <p className="font-semibold text-gray-900">{t?.options?.newMessage?.title?.[language] || 'New message'}</p>
              <p className="text-sm text-gray-600">{t?.options?.newMessage?.description?.[language] || 'Receive a notification for each new message'}</p>
            </div>
            <input
              type="checkbox"
              checked={notificationSettings.newMessage}
              onChange={(e) => setNotificationSettings({ ...notificationSettings, newMessage: e.target.checked })}
              className="w-5 h-5 rounded text-searcher-600"
            />
          </label>
        </motion.div>

        {/* Events Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/80 backdrop-blur-sm superellipse-2xl p-6 border border-gray-200 shadow-sm mb-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 superellipse-xl bg-gradient-to-br from-purple-100 to-indigo-100 flex items-center justify-center">
              <Calendar className="w-6 h-6 text-gray-700" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">{t?.events?.title?.[language] || 'Events & Tasks'}</h2>
              <p className="text-sm text-gray-600">{t?.events?.subtitle?.[language] || 'Residence calendar and tasks'}</p>
            </div>
          </div>

          <div className="space-y-4">
            <label className="flex items-center justify-between p-4 superellipse-xl border border-gray-200 cursor-pointer hover:bg-gray-50">
              <div>
                <p className="font-semibold text-gray-900">{t?.options?.newEvent?.title?.[language] || 'New event'}</p>
                <p className="text-sm text-gray-600">{t?.options?.newEvent?.description?.[language] || 'When an event is created'}</p>
              </div>
              <input
                type="checkbox"
                checked={notificationSettings.newEvent}
                onChange={(e) => setNotificationSettings({ ...notificationSettings, newEvent: e.target.checked })}
                className="w-5 h-5 rounded text-searcher-600"
              />
            </label>

            <label className="flex items-center justify-between p-4 superellipse-xl border border-gray-200 cursor-pointer hover:bg-gray-50">
              <div>
                <p className="font-semibold text-gray-900">{t?.options?.eventReminder?.title?.[language] || 'Event reminder'}</p>
                <p className="text-sm text-gray-600">{t?.options?.eventReminder?.description?.[language] || 'Reminder before an event'}</p>
              </div>
              <input
                type="checkbox"
                checked={notificationSettings.eventReminder}
                onChange={(e) => setNotificationSettings({ ...notificationSettings, eventReminder: e.target.checked })}
                className="w-5 h-5 rounded text-searcher-600"
              />
            </label>

            <label className="flex items-center justify-between p-4 superellipse-xl border border-gray-200 cursor-pointer hover:bg-gray-50">
              <div>
                <p className="font-semibold text-gray-900">{t?.options?.taskAssigned?.title?.[language] || 'Task assigned'}</p>
                <p className="text-sm text-gray-600">{t?.options?.taskAssigned?.description?.[language] || 'When a task is assigned to you'}</p>
              </div>
              <input
                type="checkbox"
                checked={notificationSettings.taskAssigned}
                onChange={(e) => setNotificationSettings({ ...notificationSettings, taskAssigned: e.target.checked })}
                className="w-5 h-5 rounded text-searcher-600"
              />
            </label>

            <label className="flex items-center justify-between p-4 superellipse-xl border border-gray-200 cursor-pointer hover:bg-gray-50">
              <div>
                <p className="font-semibold text-gray-900">{t?.options?.taskDue?.title?.[language] || 'Task due'}</p>
                <p className="text-sm text-gray-600">{t?.options?.taskDue?.description?.[language] || 'Reminder before a task is due'}</p>
              </div>
              <input
                type="checkbox"
                checked={notificationSettings.taskDue}
                onChange={(e) => setNotificationSettings({ ...notificationSettings, taskDue: e.target.checked })}
                className="w-5 h-5 rounded text-searcher-600"
              />
            </label>
          </div>
        </motion.div>

        {/* Finances Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="bg-white/80 backdrop-blur-sm superellipse-2xl p-6 border border-gray-200 shadow-sm mb-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 superellipse-xl bg-gradient-to-br from-green-100 to-emerald-100 flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-gray-700" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">{t?.finances?.title?.[language] || 'Finances'}</h2>
              <p className="text-sm text-gray-600">{t?.finances?.subtitle?.[language] || 'Payments and expenses'}</p>
            </div>
          </div>

          <div className="space-y-4">
            <label className="flex items-center justify-between p-4 superellipse-xl border border-gray-200 cursor-pointer hover:bg-gray-50">
              <div>
                <p className="font-semibold text-gray-900">{t?.options?.paymentReminder?.title?.[language] || 'Payment reminder'}</p>
                <p className="text-sm text-gray-600">{t?.options?.paymentReminder?.description?.[language] || 'Reminder before due date'}</p>
              </div>
              <input
                type="checkbox"
                checked={notificationSettings.paymentReminder}
                onChange={(e) => setNotificationSettings({ ...notificationSettings, paymentReminder: e.target.checked })}
                className="w-5 h-5 rounded text-searcher-600"
              />
            </label>

            <label className="flex items-center justify-between p-4 superellipse-xl border border-gray-200 cursor-pointer hover:bg-gray-50">
              <div>
                <p className="font-semibold text-gray-900">{t?.options?.paymentReceived?.title?.[language] || 'Payment received'}</p>
                <p className="text-sm text-gray-600">{t?.options?.paymentReceived?.description?.[language] || 'Receipt confirmation'}</p>
              </div>
              <input
                type="checkbox"
                checked={notificationSettings.paymentReceived}
                onChange={(e) => setNotificationSettings({ ...notificationSettings, paymentReceived: e.target.checked })}
                className="w-5 h-5 rounded text-searcher-600"
              />
            </label>

            <label className="flex items-center justify-between p-4 superellipse-xl border border-gray-200 cursor-pointer hover:bg-gray-50">
              <div>
                <p className="font-semibold text-gray-900">{t?.options?.newExpense?.title?.[language] || 'New expense'}</p>
                <p className="text-sm text-gray-600">{t?.options?.newExpense?.description?.[language] || 'When a shared expense is created'}</p>
              </div>
              <input
                type="checkbox"
                checked={notificationSettings.expenseCreated}
                onChange={(e) => setNotificationSettings({ ...notificationSettings, expenseCreated: e.target.checked })}
                className="w-5 h-5 rounded text-searcher-600"
              />
            </label>
          </div>
        </motion.div>

        {/* Community Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white/80 backdrop-blur-sm superellipse-2xl p-6 border border-gray-200 shadow-sm mb-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 superellipse-xl bg-gradient-to-br from-searcher-100 to-searcher-100 flex items-center justify-center">
              <Users className="w-6 h-6 text-gray-700" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">{t?.community?.title?.[language] || 'Community'}</h2>
              <p className="text-sm text-gray-600">{t?.community?.subtitle?.[language] || 'Residence activities'}</p>
            </div>
          </div>

          <div className="space-y-4">
            <label className="flex items-center justify-between p-4 superellipse-xl border border-gray-200 cursor-pointer hover:bg-gray-50">
              <div>
                <p className="font-semibold text-gray-900">{t?.options?.newMember?.title?.[language] || 'New member'}</p>
                <p className="text-sm text-gray-600">{t?.options?.newMember?.description?.[language] || 'When someone joins the residence'}</p>
              </div>
              <input
                type="checkbox"
                checked={notificationSettings.newMember}
                onChange={(e) => setNotificationSettings({ ...notificationSettings, newMember: e.target.checked })}
                className="w-5 h-5 rounded text-searcher-600"
              />
            </label>

            <label className="flex items-center justify-between p-4 superellipse-xl border border-gray-200 cursor-pointer hover:bg-gray-50">
              <div>
                <p className="font-semibold text-gray-900">{t?.options?.announcements?.title?.[language] || 'Important announcements'}</p>
                <p className="text-sm text-gray-600">{t?.options?.announcements?.description?.[language] || 'Important residence notifications'}</p>
              </div>
              <input
                type="checkbox"
                checked={notificationSettings.announcements}
                onChange={(e) => setNotificationSettings({ ...notificationSettings, announcements: e.target.checked })}
                className="w-5 h-5 rounded text-searcher-600"
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
            className="w-full superellipse-xl bg-gradient-to-r from-searcher-200/70 to-searcher-200/70 text-gray-900 hover:from-searcher-300/70 hover:to-searcher-300/70"
          >
            {isSaving ? (t?.buttons?.saving?.[language] || 'Saving...') : (t?.buttons?.save?.[language] || 'Save changes')}
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
