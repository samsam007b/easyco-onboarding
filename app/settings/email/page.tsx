'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/auth/supabase-client';
import { motion } from 'framer-motion';
import LoadingHouse from '@/components/ui/LoadingHouse';
import {
  Mail,
  Bell,
  MessageSquare,
  DollarSign,
  Calendar,
  ArrowLeft,
  Check
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/lib/i18n/use-language';

export default function EmailPage() {
  const router = useRouter();
  const supabase = createClient();
  const { language, getSection } = useLanguage();
  const t = getSection('settings')?.email;
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const [emailSettings, setEmailSettings] = useState({
    // Notifications générales
    newMessage: true,
    messageDigest: false,

    // Activités de la résidence
    newEvent: true,
    eventReminder: true,
    taskAssigned: true,

    // Finances
    paymentReminder: true,
    paymentReceived: true,
    expenseCreated: true,

    // Communauté
    newMember: false,
    memberLeft: false,
    announcements: true,

    // Marketing
    newsletter: false,
    productUpdates: false,
    tips: true,
  });

  useEffect(() => {
    loadEmailSettings();
  }, []);

  const loadEmailSettings = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }

      const { data: preferences } = await supabase
        .from('user_preferences')
        .select('email_settings')
        .eq('user_id', user.id)
        .single();

      if (preferences?.email_settings) {
        setEmailSettings(preferences.email_settings);
      }
    } catch (error) {
      console.error('Error loading email settings:', error);
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
          email_settings: emailSettings,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      setMessage({ type: 'success', text: t?.messages?.success?.[language] || 'Email preferences saved' });
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || (t?.messages?.error?.[language] || 'Error saving preferences') });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50/30 via-white to-rose-50/30">
        <div className="text-center">
          <LoadingHouse size={80} />
          <p className="text-gray-600 font-medium mt-4">{t?.loading?.[language] || 'Loading...'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50/30 via-white to-rose-50/30">
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
            <div className="w-16 h-16 superellipse-2xl bg-gradient-to-br from-pink-200/70 to-rose-200/70 flex items-center justify-center shadow-sm">
              <Mail className="w-8 h-8 text-gray-700" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900">{t?.title?.[language] || 'Emails'}</h1>
              <p className="text-gray-600">{t?.subtitle?.[language] || 'Manage your communication preferences'}</p>
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

        {/* Messages Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/80 backdrop-blur-sm superellipse-2xl p-6 border border-gray-200 shadow-sm mb-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 superellipse-xl bg-gradient-to-br from-blue-100 to-sky-100 flex items-center justify-center">
              <MessageSquare className="w-6 h-6 text-gray-700" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">{t?.sections?.messages?.title?.[language] || 'Messages'}</h2>
              <p className="text-sm text-gray-600">{t?.sections?.messages?.subtitle?.[language] || 'Messaging notifications'}</p>
            </div>
          </div>

          <div className="space-y-4">
            <label className="flex items-center justify-between p-4 superellipse-xl border border-gray-200 cursor-pointer hover:bg-gray-50">
              <div>
                <p className="font-semibold text-gray-900">{t?.options?.newMessage?.title?.[language] || 'New message'}</p>
                <p className="text-sm text-gray-600">{t?.options?.newMessage?.description?.[language] || 'Receive an email for each new message'}</p>
              </div>
              <input
                type="checkbox"
                checked={emailSettings.newMessage}
                onChange={(e) => setEmailSettings({ ...emailSettings, newMessage: e.target.checked })}
                className="w-5 h-5 rounded text-pink-600"
              />
            </label>

            <label className="flex items-center justify-between p-4 superellipse-xl border border-gray-200 cursor-pointer hover:bg-gray-50">
              <div>
                <p className="font-semibold text-gray-900">{t?.options?.digest?.title?.[language] || 'Daily digest'}</p>
                <p className="text-sm text-gray-600">{t?.options?.digest?.description?.[language] || 'One email per day with your unread messages'}</p>
              </div>
              <input
                type="checkbox"
                checked={emailSettings.messageDigest}
                onChange={(e) => setEmailSettings({ ...emailSettings, messageDigest: e.target.checked })}
                className="w-5 h-5 rounded text-pink-600"
              />
            </label>
          </div>
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
              <h2 className="text-xl font-bold text-gray-900">{t?.sections?.events?.title?.[language] || 'Events & Tasks'}</h2>
              <p className="text-sm text-gray-600">{t?.sections?.events?.subtitle?.[language] || 'Residence calendar and tasks'}</p>
            </div>
          </div>

          <div className="space-y-4">
            <label className="flex items-center justify-between p-4 superellipse-xl border border-gray-200 cursor-pointer hover:bg-gray-50">
              <div>
                <p className="font-semibold text-gray-900">{t?.options?.newEvent?.title?.[language] || 'New event'}</p>
                <p className="text-sm text-gray-600">{t?.options?.newEvent?.description?.[language] || 'Notification for new events'}</p>
              </div>
              <input
                type="checkbox"
                checked={emailSettings.newEvent}
                onChange={(e) => setEmailSettings({ ...emailSettings, newEvent: e.target.checked })}
                className="w-5 h-5 rounded text-pink-600"
              />
            </label>

            <label className="flex items-center justify-between p-4 superellipse-xl border border-gray-200 cursor-pointer hover:bg-gray-50">
              <div>
                <p className="font-semibold text-gray-900">{t?.options?.eventReminder?.title?.[language] || 'Event reminder'}</p>
                <p className="text-sm text-gray-600">{t?.options?.eventReminder?.description?.[language] || 'Reminder 24h before an event'}</p>
              </div>
              <input
                type="checkbox"
                checked={emailSettings.eventReminder}
                onChange={(e) => setEmailSettings({ ...emailSettings, eventReminder: e.target.checked })}
                className="w-5 h-5 rounded text-pink-600"
              />
            </label>

            <label className="flex items-center justify-between p-4 superellipse-xl border border-gray-200 cursor-pointer hover:bg-gray-50">
              <div>
                <p className="font-semibold text-gray-900">{t?.options?.taskAssigned?.title?.[language] || 'Task assigned'}</p>
                <p className="text-sm text-gray-600">{t?.options?.taskAssigned?.description?.[language] || 'When a task is assigned to you'}</p>
              </div>
              <input
                type="checkbox"
                checked={emailSettings.taskAssigned}
                onChange={(e) => setEmailSettings({ ...emailSettings, taskAssigned: e.target.checked })}
                className="w-5 h-5 rounded text-pink-600"
              />
            </label>
          </div>
        </motion.div>

        {/* Finances Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white/80 backdrop-blur-sm superellipse-2xl p-6 border border-gray-200 shadow-sm mb-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 superellipse-xl bg-gradient-to-br from-green-100 to-emerald-100 flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-gray-700" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">{t?.sections?.finances?.title?.[language] || 'Finances'}</h2>
              <p className="text-sm text-gray-600">{t?.sections?.finances?.subtitle?.[language] || 'Payments and expenses'}</p>
            </div>
          </div>

          <div className="space-y-4">
            <label className="flex items-center justify-between p-4 superellipse-xl border border-gray-200 cursor-pointer hover:bg-gray-50">
              <div>
                <p className="font-semibold text-gray-900">{t?.options?.paymentReminder?.title?.[language] || 'Payment reminder'}</p>
                <p className="text-sm text-gray-600">{t?.options?.paymentReminder?.description?.[language] || 'Reminder before rent is due'}</p>
              </div>
              <input
                type="checkbox"
                checked={emailSettings.paymentReminder}
                onChange={(e) => setEmailSettings({ ...emailSettings, paymentReminder: e.target.checked })}
                className="w-5 h-5 rounded text-pink-600"
              />
            </label>

            <label className="flex items-center justify-between p-4 superellipse-xl border border-gray-200 cursor-pointer hover:bg-gray-50">
              <div>
                <p className="font-semibold text-gray-900">{t?.options?.paymentReceived?.title?.[language] || 'Payment received'}</p>
                <p className="text-sm text-gray-600">{t?.options?.paymentReceived?.description?.[language] || 'Confirmation when a payment is received'}</p>
              </div>
              <input
                type="checkbox"
                checked={emailSettings.paymentReceived}
                onChange={(e) => setEmailSettings({ ...emailSettings, paymentReceived: e.target.checked })}
                className="w-5 h-5 rounded text-pink-600"
              />
            </label>

            <label className="flex items-center justify-between p-4 superellipse-xl border border-gray-200 cursor-pointer hover:bg-gray-50">
              <div>
                <p className="font-semibold text-gray-900">{t?.options?.newExpense?.title?.[language] || 'New expense'}</p>
                <p className="text-sm text-gray-600">{t?.options?.newExpense?.description?.[language] || 'When a shared expense is created'}</p>
              </div>
              <input
                type="checkbox"
                checked={emailSettings.expenseCreated}
                onChange={(e) => setEmailSettings({ ...emailSettings, expenseCreated: e.target.checked })}
                className="w-5 h-5 rounded text-pink-600"
              />
            </label>
          </div>
        </motion.div>

        {/* Community Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white/80 backdrop-blur-sm superellipse-2xl p-6 border border-gray-200 shadow-sm mb-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 superellipse-xl bg-resident-100 flex items-center justify-center">
              <Bell className="w-6 h-6 text-gray-700" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">{t?.sections?.community?.title?.[language] || 'Community'}</h2>
              <p className="text-sm text-gray-600">{t?.sections?.community?.subtitle?.[language] || 'Residence activities'}</p>
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
                checked={emailSettings.newMember}
                onChange={(e) => setEmailSettings({ ...emailSettings, newMember: e.target.checked })}
                className="w-5 h-5 rounded text-pink-600"
              />
            </label>

            <label className="flex items-center justify-between p-4 superellipse-xl border border-gray-200 cursor-pointer hover:bg-gray-50">
              <div>
                <p className="font-semibold text-gray-900">{t?.options?.announcements?.title?.[language] || 'Important announcements'}</p>
                <p className="text-sm text-gray-600">{t?.options?.announcements?.description?.[language] || 'Important residence notifications'}</p>
              </div>
              <input
                type="checkbox"
                checked={emailSettings.announcements}
                onChange={(e) => setEmailSettings({ ...emailSettings, announcements: e.target.checked })}
                className="w-5 h-5 rounded text-pink-600"
              />
            </label>
          </div>
        </motion.div>

        {/* Save Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Button
            onClick={handleSaveSettings}
            disabled={isSaving}
            className="w-full superellipse-xl bg-gradient-to-r from-pink-200/70 to-rose-200/70 text-gray-900 hover:from-pink-300/70 hover:to-rose-300/70"
          >
            {isSaving ? (t?.buttons?.saving?.[language] || 'Saving...') : (t?.buttons?.save?.[language] || 'Save changes')}
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
