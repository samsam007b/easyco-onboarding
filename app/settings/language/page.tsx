'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/auth/supabase-client';
import { motion } from 'framer-motion';
import LoadingHouse from '@/components/ui/LoadingHouse';
import {
  Globe,
  Check,
  ArrowLeft,
  MapPin,
  Calendar,
  Clock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/lib/i18n/use-language';

const languages = [
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'it', name: 'Italiano', flag: '🇮🇹' },
];

const timezones = [
  { value: 'Europe/Paris', label: 'Paris (GMT+1)' },
  { value: 'Europe/London', label: 'London (GMT+0)' },
  { value: 'Europe/Berlin', label: 'Berlin (GMT+1)' },
  { value: 'Europe/Madrid', label: 'Madrid (GMT+1)' },
  { value: 'Europe/Rome', label: 'Rome (GMT+1)' },
  { value: 'America/New_York', label: 'New York (GMT-5)' },
  { value: 'America/Los_Angeles', label: 'Los Angeles (GMT-8)' },
];

const dateFormats = [
  { value: 'DD/MM/YYYY', label: 'JJ/MM/AAAA (31/12/2024)' },
  { value: 'MM/DD/YYYY', label: 'MM/JJ/AAAA (12/31/2024)' },
  { value: 'YYYY-MM-DD', label: 'AAAA-MM-JJ (2024-12-31)' },
];

export default function LanguagePage() {
  const router = useRouter();
  const supabase = createClient();
  const { language, getSection } = useLanguage();
  const t = getSection('settings')?.language;
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const [settings, setSettings] = useState({
    language: 'fr',
    timezone: 'Europe/Paris',
    dateFormat: 'DD/MM/YYYY',
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }

      const { data: preferences } = await supabase
        .from('user_preferences')
        .select('language_settings')
        .eq('user_id', user.id)
        .single();

      if (preferences?.language_settings) {
        setSettings(preferences.language_settings);
      }
    } catch (error) {
      console.error('Error loading settings:', error);
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
          language_settings: settings,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      setMessage({ type: 'success', text: t?.messages?.success?.[language] || 'Settings saved successfully' });
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || (t?.messages?.error?.[language] || 'Error saving settings') });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50/30 via-white to-teal-50/30">
        <div className="text-center">
          <LoadingHouse size={80} />
          <p className="text-gray-600 font-medium mt-4">{t?.loading?.[language] || 'Loading...'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50/30 via-white to-teal-50/30">
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
            <div className="w-16 h-16 superellipse-2xl bg-gradient-to-br from-emerald-200/70 to-teal-200/70 flex items-center justify-center shadow-sm">
              <Globe className="w-8 h-8 text-gray-700" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900">{t?.title?.[language] || 'Language & Region'}</h1>
              <p className="text-gray-600">{t?.subtitle?.[language] || 'Customize your regional preferences'}</p>
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

        {/* Language Selection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/80 backdrop-blur-sm superellipse-2xl p-6 border border-gray-200 shadow-sm mb-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 superellipse-xl bg-gradient-to-br from-blue-100 to-sky-100 flex items-center justify-center">
              <Globe className="w-6 h-6 text-gray-700" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">{t?.interface?.title?.[language] || 'Interface language'}</h2>
              <p className="text-sm text-gray-600">{t?.interface?.subtitle?.[language] || 'Choose your preferred language'}</p>
            </div>
          </div>

          <div className="grid gap-3">
            {languages.map((lang) => (
              <label
                key={lang.code}
                className={cn(
                  "flex items-center gap-4 p-4 superellipse-xl border-2 cursor-pointer transition-all",
                  settings.language === lang.code
                    ? 'border-emerald-500 bg-emerald-50/50'
                    : 'border-gray-200 hover:border-gray-300'
                )}
              >
                <input
                  type="radio"
                  name="language"
                  value={lang.code}
                  checked={settings.language === lang.code}
                  onChange={(e) => setSettings({ ...settings, language: e.target.value })}
                  className="w-5 h-5 text-emerald-600"
                />
                <span className="text-2xl">{lang.flag}</span>
                <span className="flex-1 font-semibold text-gray-900">{lang.name}</span>
                {settings.language === lang.code && (
                  <Check className="w-5 h-5 text-emerald-600" />
                )}
              </label>
            ))}
          </div>
        </motion.div>

        {/* Timezone */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/80 backdrop-blur-sm superellipse-2xl p-6 border border-gray-200 shadow-sm mb-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 superellipse-xl bg-gradient-to-br from-purple-100 to-indigo-100 flex items-center justify-center">
              <MapPin className="w-6 h-6 text-gray-700" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">{t?.timezone?.title?.[language] || 'Timezone'}</h2>
              <p className="text-sm text-gray-600">{t?.timezone?.subtitle?.[language] || 'Set your timezone'}</p>
            </div>
          </div>

          <select
            value={settings.timezone}
            onChange={(e) => setSettings({ ...settings, timezone: e.target.value })}
            className="w-full px-4 py-3 superellipse-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          >
            {timezones.map((tz) => (
              <option key={tz.value} value={tz.value}>
                {tz.label}
              </option>
            ))}
          </select>
        </motion.div>

        {/* Date Format */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white/80 backdrop-blur-sm superellipse-2xl p-6 border border-gray-200 shadow-sm mb-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 superellipse-xl bg-gradient-to-br from-orange-100 to-amber-100 flex items-center justify-center">
              <Calendar className="w-6 h-6 text-gray-700" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">{t?.dateFormat?.title?.[language] || 'Date format'}</h2>
              <p className="text-sm text-gray-600">{t?.dateFormat?.subtitle?.[language] || 'Choose date display format'}</p>
            </div>
          </div>

          <div className="grid gap-3">
            {dateFormats.map((format) => (
              <label
                key={format.value}
                className={cn(
                  "flex items-center gap-4 p-4 superellipse-xl border-2 cursor-pointer transition-all",
                  settings.dateFormat === format.value
                    ? 'border-emerald-500 bg-emerald-50/50'
                    : 'border-gray-200 hover:border-gray-300'
                )}
              >
                <input
                  type="radio"
                  name="dateFormat"
                  value={format.value}
                  checked={settings.dateFormat === format.value}
                  onChange={(e) => setSettings({ ...settings, dateFormat: e.target.value })}
                  className="w-5 h-5 text-emerald-600"
                />
                <span className="flex-1 font-medium text-gray-900">{format.label}</span>
                {settings.dateFormat === format.value && (
                  <Check className="w-5 h-5 text-emerald-600" />
                )}
              </label>
            ))}
          </div>
        </motion.div>

        {/* Save Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Button
            onClick={handleSaveSettings}
            disabled={isSaving}
            className="w-full superellipse-xl bg-gradient-to-r from-emerald-200/70 to-teal-200/70 text-gray-900 hover:from-emerald-300/70 hover:to-teal-300/70"
          >
            {isSaving ? (t?.buttons?.saving?.[language] || 'Saving...') : (t?.buttons?.save?.[language] || 'Save changes')}
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
