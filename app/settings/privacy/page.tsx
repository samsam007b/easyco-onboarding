'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/auth/supabase-client';
import { motion } from 'framer-motion';
import LoadingHouse from '@/components/ui/LoadingHouse';
import {
  Eye,
  Users,
  Lock,
  Globe,
  ArrowLeft,
  CheckCircle,
  Shield
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default function PrivacyPage() {
  const router = useRouter();
  const supabase = createClient();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const [privacySettings, setPrivacySettings] = useState({
    profileVisibility: 'residents', // 'everyone', 'residents', 'private'
    showEmail: false,
    showPhone: false,
    allowMessages: true,
    showOnlineStatus: true,
  });

  useEffect(() => {
    loadPrivacySettings();
  }, []);

  const loadPrivacySettings = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }

      // Load privacy settings from user metadata or preferences table
      const { data: preferences } = await supabase
        .from('user_preferences')
        .select('privacy_settings')
        .eq('user_id', user.id)
        .single();

      if (preferences?.privacy_settings) {
        setPrivacySettings(preferences.privacy_settings);
      }
    } catch (error) {
      console.error('Error loading privacy settings:', error);
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
          privacy_settings: privacySettings,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      setMessage({ type: 'success', text: 'Paramètres de confidentialité enregistrés' });
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Erreur lors de l\'enregistrement' });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50/30 via-white to-sky-50/30">
        <div className="text-center">
          <LoadingHouse size={80} />
          <p className="text-gray-600 font-medium mt-4">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/30 via-white to-sky-50/30">
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
            Retour aux paramètres
          </Button>

          <div className="flex items-center gap-4 mb-2">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-200/70 to-sky-200/70 flex items-center justify-center shadow-sm">
              <Eye className="w-8 h-8 text-gray-700" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Confidentialité</h1>
              <p className="text-gray-600">Contrôler la visibilité de votre profil</p>
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
            <CheckCircle className="w-5 h-5" />
            <p className="font-medium">{message.text}</p>
          </motion.div>
        )}

        {/* Profile Visibility */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200 shadow-sm mb-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-100 to-indigo-100 flex items-center justify-center">
              <Users className="w-6 h-6 text-gray-700" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Visibilité du profil</h2>
              <p className="text-sm text-gray-600">Qui peut voir votre profil</p>
            </div>
          </div>

          <div className="space-y-3">
            <label className={cn(
              "flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all",
              privacySettings.profileVisibility === 'everyone'
                ? 'border-blue-500 bg-blue-50/50'
                : 'border-gray-200 hover:border-gray-300'
            )}>
              <input
                type="radio"
                name="visibility"
                value="everyone"
                checked={privacySettings.profileVisibility === 'everyone'}
                onChange={(e) => setPrivacySettings({ ...privacySettings, profileVisibility: e.target.value })}
                className="w-5 h-5 text-blue-600"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <Globe className="w-5 h-5 text-gray-600" />
                  <p className="font-semibold text-gray-900">Public</p>
                </div>
                <p className="text-sm text-gray-600">Visible par tous les utilisateurs</p>
              </div>
            </label>

            <label className={cn(
              "flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all",
              privacySettings.profileVisibility === 'residents'
                ? 'border-blue-500 bg-blue-50/50'
                : 'border-gray-200 hover:border-gray-300'
            )}>
              <input
                type="radio"
                name="visibility"
                value="residents"
                checked={privacySettings.profileVisibility === 'residents'}
                onChange={(e) => setPrivacySettings({ ...privacySettings, profileVisibility: e.target.value })}
                className="w-5 h-5 text-blue-600"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <Users className="w-5 h-5 text-gray-600" />
                  <p className="font-semibold text-gray-900">Résidents uniquement</p>
                </div>
                <p className="text-sm text-gray-600">Visible par les membres de votre résidence</p>
              </div>
            </label>

            <label className={cn(
              "flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all",
              privacySettings.profileVisibility === 'private'
                ? 'border-blue-500 bg-blue-50/50'
                : 'border-gray-200 hover:border-gray-300'
            )}>
              <input
                type="radio"
                name="visibility"
                value="private"
                checked={privacySettings.profileVisibility === 'private'}
                onChange={(e) => setPrivacySettings({ ...privacySettings, profileVisibility: e.target.value })}
                className="w-5 h-5 text-blue-600"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <Lock className="w-5 h-5 text-gray-600" />
                  <p className="font-semibold text-gray-900">Privé</p>
                </div>
                <p className="text-sm text-gray-600">Profil invisible aux autres</p>
              </div>
            </label>
          </div>
        </motion.div>

        {/* Contact Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200 shadow-sm mb-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-100 to-emerald-100 flex items-center justify-center">
              <Shield className="w-6 h-6 text-gray-700" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Informations de contact</h2>
              <p className="text-sm text-gray-600">Contrôler ce qui est visible</p>
            </div>
          </div>

          <div className="space-y-4">
            <label className="flex items-center justify-between p-4 rounded-xl border border-gray-200 cursor-pointer hover:bg-gray-50">
              <div>
                <p className="font-semibold text-gray-900">Afficher mon email</p>
                <p className="text-sm text-gray-600">Visible sur votre profil public</p>
              </div>
              <input
                type="checkbox"
                checked={privacySettings.showEmail}
                onChange={(e) => setPrivacySettings({ ...privacySettings, showEmail: e.target.checked })}
                className="w-5 h-5 rounded text-blue-600"
              />
            </label>

            <label className="flex items-center justify-between p-4 rounded-xl border border-gray-200 cursor-pointer hover:bg-gray-50">
              <div>
                <p className="font-semibold text-gray-900">Afficher mon téléphone</p>
                <p className="text-sm text-gray-600">Visible sur votre profil public</p>
              </div>
              <input
                type="checkbox"
                checked={privacySettings.showPhone}
                onChange={(e) => setPrivacySettings({ ...privacySettings, showPhone: e.target.checked })}
                className="w-5 h-5 rounded text-blue-600"
              />
            </label>

            <label className="flex items-center justify-between p-4 rounded-xl border border-gray-200 cursor-pointer hover:bg-gray-50">
              <div>
                <p className="font-semibold text-gray-900">Autoriser les messages</p>
                <p className="text-sm text-gray-600">Les autres peuvent vous contacter</p>
              </div>
              <input
                type="checkbox"
                checked={privacySettings.allowMessages}
                onChange={(e) => setPrivacySettings({ ...privacySettings, allowMessages: e.target.checked })}
                className="w-5 h-5 rounded text-blue-600"
              />
            </label>

            <label className="flex items-center justify-between p-4 rounded-xl border border-gray-200 cursor-pointer hover:bg-gray-50">
              <div>
                <p className="font-semibold text-gray-900">Afficher le statut en ligne</p>
                <p className="text-sm text-gray-600">Montrer quand vous êtes connecté</p>
              </div>
              <input
                type="checkbox"
                checked={privacySettings.showOnlineStatus}
                onChange={(e) => setPrivacySettings({ ...privacySettings, showOnlineStatus: e.target.checked })}
                className="w-5 h-5 rounded text-blue-600"
              />
            </label>
          </div>
        </motion.div>

        {/* Save Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Button
            onClick={handleSaveSettings}
            disabled={isSaving}
            className="w-full rounded-xl bg-gradient-to-r from-blue-200/70 to-sky-200/70 text-gray-900 hover:from-blue-300/70 hover:to-sky-300/70"
          >
            {isSaving ? 'Enregistrement...' : 'Enregistrer les modifications'}
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
