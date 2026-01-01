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

      setMessage({ type: 'success', text: t?.messages?.success?.[language] || 'Préférences email enregistrées' });
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || (t?.messages?.error?.[language] || 'Erreur lors de l\'enregistrement') });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50/30 via-white to-rose-50/30">
        <div className="text-center">
          <LoadingHouse size={80} />
          <p className="text-gray-600 font-medium mt-4">{t?.loading?.[language] || 'Chargement...'}</p>
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
            {t?.back?.[language] || 'Retour aux paramètres'}
          </Button>

          <div className="flex items-center gap-4 mb-2">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-pink-200/70 to-rose-200/70 flex items-center justify-center shadow-sm">
              <Mail className="w-8 h-8 text-gray-700" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900">{t?.title?.[language] || 'Emails'}</h1>
              <p className="text-gray-600">{t?.subtitle?.[language] || 'Gérer vos préférences de communications'}</p>
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

        {/* Messages Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200 shadow-sm mb-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-100 to-sky-100 flex items-center justify-center">
              <MessageSquare className="w-6 h-6 text-gray-700" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">{t?.sections?.messages?.title?.[language] || 'Messages'}</h2>
              <p className="text-sm text-gray-600">{t?.sections?.messages?.subtitle?.[language] || 'Notifications de messagerie'}</p>
            </div>
          </div>

          <div className="space-y-4">
            <label className="flex items-center justify-between p-4 rounded-xl border border-gray-200 cursor-pointer hover:bg-gray-50">
              <div>
                <p className="font-semibold text-gray-900">{t?.options?.newMessage?.title?.[language] || 'Nouveau message'}</p>
                <p className="text-sm text-gray-600">{t?.options?.newMessage?.description?.[language] || 'Recevoir un email pour chaque nouveau message'}</p>
              </div>
              <input
                type="checkbox"
                checked={emailSettings.newMessage}
                onChange={(e) => setEmailSettings({ ...emailSettings, newMessage: e.target.checked })}
                className="w-5 h-5 rounded text-pink-600"
              />
            </label>

            <label className="flex items-center justify-between p-4 rounded-xl border border-gray-200 cursor-pointer hover:bg-gray-50">
              <div>
                <p className="font-semibold text-gray-900">{t?.options?.digest?.title?.[language] || 'Résumé quotidien'}</p>
                <p className="text-sm text-gray-600">{t?.options?.digest?.description?.[language] || 'Un email par jour avec vos messages non lus'}</p>
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
          className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200 shadow-sm mb-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-100 to-indigo-100 flex items-center justify-center">
              <Calendar className="w-6 h-6 text-gray-700" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">{t?.sections?.events?.title?.[language] || 'Événements & Tâches'}</h2>
              <p className="text-sm text-gray-600">{t?.sections?.events?.subtitle?.[language] || 'Calendrier et tâches de la résidence'}</p>
            </div>
          </div>

          <div className="space-y-4">
            <label className="flex items-center justify-between p-4 rounded-xl border border-gray-200 cursor-pointer hover:bg-gray-50">
              <div>
                <p className="font-semibold text-gray-900">{t?.options?.newEvent?.title?.[language] || 'Nouvel événement'}</p>
                <p className="text-sm text-gray-600">{t?.options?.newEvent?.description?.[language] || 'Notification pour les nouveaux événements'}</p>
              </div>
              <input
                type="checkbox"
                checked={emailSettings.newEvent}
                onChange={(e) => setEmailSettings({ ...emailSettings, newEvent: e.target.checked })}
                className="w-5 h-5 rounded text-pink-600"
              />
            </label>

            <label className="flex items-center justify-between p-4 rounded-xl border border-gray-200 cursor-pointer hover:bg-gray-50">
              <div>
                <p className="font-semibold text-gray-900">{t?.options?.eventReminder?.title?.[language] || 'Rappel d\'événement'}</p>
                <p className="text-sm text-gray-600">{t?.options?.eventReminder?.description?.[language] || 'Rappel 24h avant un événement'}</p>
              </div>
              <input
                type="checkbox"
                checked={emailSettings.eventReminder}
                onChange={(e) => setEmailSettings({ ...emailSettings, eventReminder: e.target.checked })}
                className="w-5 h-5 rounded text-pink-600"
              />
            </label>

            <label className="flex items-center justify-between p-4 rounded-xl border border-gray-200 cursor-pointer hover:bg-gray-50">
              <div>
                <p className="font-semibold text-gray-900">{t?.options?.taskAssigned?.title?.[language] || 'Tâche assignée'}</p>
                <p className="text-sm text-gray-600">{t?.options?.taskAssigned?.description?.[language] || 'Quand une tâche vous est assignée'}</p>
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
          className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200 shadow-sm mb-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-100 to-emerald-100 flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-gray-700" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">{t?.sections?.finances?.title?.[language] || 'Finances'}</h2>
              <p className="text-sm text-gray-600">{t?.sections?.finances?.subtitle?.[language] || 'Paiements et dépenses'}</p>
            </div>
          </div>

          <div className="space-y-4">
            <label className="flex items-center justify-between p-4 rounded-xl border border-gray-200 cursor-pointer hover:bg-gray-50">
              <div>
                <p className="font-semibold text-gray-900">{t?.options?.paymentReminder?.title?.[language] || 'Rappel de paiement'}</p>
                <p className="text-sm text-gray-600">{t?.options?.paymentReminder?.description?.[language] || 'Rappel avant l\'échéance du loyer'}</p>
              </div>
              <input
                type="checkbox"
                checked={emailSettings.paymentReminder}
                onChange={(e) => setEmailSettings({ ...emailSettings, paymentReminder: e.target.checked })}
                className="w-5 h-5 rounded text-pink-600"
              />
            </label>

            <label className="flex items-center justify-between p-4 rounded-xl border border-gray-200 cursor-pointer hover:bg-gray-50">
              <div>
                <p className="font-semibold text-gray-900">{t?.options?.paymentReceived?.title?.[language] || 'Paiement reçu'}</p>
                <p className="text-sm text-gray-600">{t?.options?.paymentReceived?.description?.[language] || 'Confirmation de réception d\'un paiement'}</p>
              </div>
              <input
                type="checkbox"
                checked={emailSettings.paymentReceived}
                onChange={(e) => setEmailSettings({ ...emailSettings, paymentReceived: e.target.checked })}
                className="w-5 h-5 rounded text-pink-600"
              />
            </label>

            <label className="flex items-center justify-between p-4 rounded-xl border border-gray-200 cursor-pointer hover:bg-gray-50">
              <div>
                <p className="font-semibold text-gray-900">{t?.options?.newExpense?.title?.[language] || 'Nouvelle dépense'}</p>
                <p className="text-sm text-gray-600">{t?.options?.newExpense?.description?.[language] || 'Quand une dépense partagée est créée'}</p>
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
          className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200 shadow-sm mb-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-100 to-amber-100 flex items-center justify-center">
              <Bell className="w-6 h-6 text-gray-700" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">{t?.sections?.community?.title?.[language] || 'Communauté'}</h2>
              <p className="text-sm text-gray-600">{t?.sections?.community?.subtitle?.[language] || 'Activités de la résidence'}</p>
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
                checked={emailSettings.newMember}
                onChange={(e) => setEmailSettings({ ...emailSettings, newMember: e.target.checked })}
                className="w-5 h-5 rounded text-pink-600"
              />
            </label>

            <label className="flex items-center justify-between p-4 rounded-xl border border-gray-200 cursor-pointer hover:bg-gray-50">
              <div>
                <p className="font-semibold text-gray-900">{t?.options?.announcements?.title?.[language] || 'Annonces importantes'}</p>
                <p className="text-sm text-gray-600">{t?.options?.announcements?.description?.[language] || 'Notifications importantes de la résidence'}</p>
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
            className="w-full rounded-xl bg-gradient-to-r from-pink-200/70 to-rose-200/70 text-gray-900 hover:from-pink-300/70 hover:to-rose-300/70"
          >
            {isSaving ? (t?.buttons?.saving?.[language] || 'Enregistrement...') : (t?.buttons?.save?.[language] || 'Enregistrer les modifications')}
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
