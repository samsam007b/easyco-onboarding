'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/auth/supabase-client';
import { logger } from '@/lib/utils/logger';
import {
  Bell,
  Mail,
  Shield,
  Palette,
  Globe,
  Save,
  AlertCircle,
  CheckCircle,
  Loader2,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { getHookTranslation } from '@/lib/i18n/get-language';

interface Settings {
  // General
  app_name: string;
  site_url: string;
  support_email: string;
  default_language: string;
  // Notifications
  email_notifications: boolean;
  push_notifications: boolean;
  weekly_summary: boolean;
  admin_alerts: boolean;
  // Email
  email_from: string;
  email_reply_to: string;
  // Security
  require_2fa: boolean;
  audit_logs: boolean;
  session_timeout: string;
  rate_limiting: boolean;
  // Appearance
  maintenance_mode: boolean;
  announcement_banner: boolean;
}

const defaultSettings: Settings = {
  app_name: 'Izzico',
  site_url: 'https://izzico.be',
  support_email: 'support@izzico.be',
  default_language: 'fr',
  email_notifications: true,
  push_notifications: true,
  weekly_summary: false,
  admin_alerts: true,
  email_from: 'Izzico <noreply@izzico.be>',
  email_reply_to: 'support@izzico.be',
  require_2fa: true,
  audit_logs: true,
  session_timeout: '60',
  rate_limiting: true,
  maintenance_mode: false,
  announcement_banner: false,
};

export default function AdminSettingsPage() {
  const supabase = createClient();
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // Load settings from database
  useEffect(() => {
    async function loadSettings() {
      try {
        const { data, error } = await supabase
          .from('app_settings')
          .select('key, value');

        if (error) {
          logger.error('Error loading settings', error);
          // Use defaults if table doesn't exist
          return;
        }

        if (data && data.length > 0) {
          const loadedSettings = { ...defaultSettings };
          data.forEach((row: { key: string; value: any }) => {
            if (row.key in loadedSettings) {
              const value = typeof row.value === 'string' ? JSON.parse(row.value) : row.value;
              (loadedSettings as any)[row.key] = value;
            }
          });
          setSettings(loadedSettings);
        }
      } catch (error) {
        logger.error('Failed to load settings', error);
      } finally {
        setIsLoading(false);
      }
    }

    loadSettings();
  }, []);

  const updateSetting = <K extends keyof Settings>(key: K, value: Settings[K]) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    setHasChanges(true);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();

      // Upsert each setting
      const updates = Object.entries(settings).map(([key, value]) => ({
        key,
        value: JSON.stringify(value),
        updated_by: user?.id,
      }));

      for (const update of updates) {
        const { error } = await supabase
          .from('app_settings')
          .upsert(update, { onConflict: 'key' });

        if (error) {
          logger.error(`Error saving setting ${update.key}`, error);
        }
      }

      // Log the action
      if (user) {
        await supabase.from('audit_logs').insert({
          user_id: user.id,
          action: 'settings_updated',
          resource_type: 'app_settings',
          metadata: {
            updated_by: user.email,
            timestamp: new Date().toISOString(),
          },
        });
      }

      toast.success(getHookTranslation('admin', 'settingsSaved'), {
        description: getHookTranslation('admin', 'settingsSavedDescription'),
      });
      setHasChanges(false);
    } catch (error) {
      logger.error('Failed to save settings', error);
      toast.error(getHookTranslation('admin', 'saveError'), {
        description: getHookTranslation('admin', 'saveErrorDescription'),
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 text-purple-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Paramètres</h2>
          <p className="text-slate-400 mt-1">Configurez les paramètres de la plateforme</p>
        </div>
        <Button
          onClick={handleSave}
          disabled={!hasChanges || isSaving}
          className="bg-purple-600 hover:bg-purple-700 text-white disabled:opacity-50"
        >
          {isSaving ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Enregistrement...
            </>
          ) : hasChanges ? (
            <>
              <Save className="w-4 h-4 mr-2" />
              Enregistrer
            </>
          ) : (
            <>
              <CheckCircle className="w-4 h-4 mr-2" />
              Sauvegardé
            </>
          )}
        </Button>
      </div>

      {hasChanges && (
        <div className="flex items-center gap-2 p-3 bg-orange-500/10 border border-orange-500/20 rounded-lg text-orange-400 text-sm">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>Vous avez des modifications non enregistrées</span>
        </div>
      )}

      {/* General Settings */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-purple-500/10">
              <Globe className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <CardTitle className="text-white">Paramètres généraux</CardTitle>
              <CardDescription className="text-slate-400">
                Configuration de base de la plateforme
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-slate-300">Nom de l'application</Label>
              <Input
                value={settings.app_name}
                onChange={(e) => updateSetting('app_name', e.target.value)}
                className="bg-slate-700/50 border-slate-600 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-slate-300">URL du site</Label>
              <Input
                value={settings.site_url}
                onChange={(e) => updateSetting('site_url', e.target.value)}
                className="bg-slate-700/50 border-slate-600 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-slate-300">Email de support</Label>
              <Input
                value={settings.support_email}
                onChange={(e) => updateSetting('support_email', e.target.value)}
                className="bg-slate-700/50 border-slate-600 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-slate-300">Langue par défaut</Label>
              <select
                value={settings.default_language}
                onChange={(e) => updateSetting('default_language', e.target.value)}
                className="w-full h-10 px-3 rounded-md bg-slate-700/50 border border-slate-600 text-white"
              >
                <option value="fr">Français</option>
                <option value="en">English</option>
                <option value="nl">Nederlands</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-500/10">
              <Bell className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <CardTitle className="text-white">Notifications</CardTitle>
              <CardDescription className="text-slate-400">
                Gérez les paramètres de notification
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between py-3 border-b border-slate-700/50">
            <div>
              <p className="text-sm font-medium text-white">Notifications email</p>
              <p className="text-xs text-slate-400">Envoyer des emails pour les événements importants</p>
            </div>
            <Switch
              checked={settings.email_notifications}
              onCheckedChange={(checked) => updateSetting('email_notifications', checked)}
            />
          </div>
          <div className="flex items-center justify-between py-3 border-b border-slate-700/50">
            <div>
              <p className="text-sm font-medium text-white">Notifications push</p>
              <p className="text-xs text-slate-400">Notifications push pour les utilisateurs mobiles</p>
            </div>
            <Switch
              checked={settings.push_notifications}
              onCheckedChange={(checked) => updateSetting('push_notifications', checked)}
            />
          </div>
          <div className="flex items-center justify-between py-3 border-b border-slate-700/50">
            <div>
              <p className="text-sm font-medium text-white">Résumé hebdomadaire</p>
              <p className="text-xs text-slate-400">Envoyer un résumé hebdomadaire aux propriétaires</p>
            </div>
            <Switch
              checked={settings.weekly_summary}
              onCheckedChange={(checked) => updateSetting('weekly_summary', checked)}
            />
          </div>
          <div className="flex items-center justify-between py-3">
            <div>
              <p className="text-sm font-medium text-white">Alertes admin</p>
              <p className="text-xs text-slate-400">Recevoir des alertes pour les événements critiques</p>
            </div>
            <Switch
              checked={settings.admin_alerts}
              onCheckedChange={(checked) => updateSetting('admin_alerts', checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Email Settings */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-green-500/10">
              <Mail className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <CardTitle className="text-white">Configuration Email</CardTitle>
              <CardDescription className="text-slate-400">
                Paramètres d'envoi d'emails
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-slate-300">Expéditeur (From)</Label>
              <Input
                value={settings.email_from}
                onChange={(e) => updateSetting('email_from', e.target.value)}
                className="bg-slate-700/50 border-slate-600 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-slate-300">Reply-To</Label>
              <Input
                value={settings.email_reply_to}
                onChange={(e) => updateSetting('email_reply_to', e.target.value)}
                className="bg-slate-700/50 border-slate-600 text-white"
              />
            </div>
          </div>
          <div className="p-4 rounded-lg bg-slate-700/30 border border-slate-600">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-orange-400 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-white">Configuration SMTP</p>
                <p className="text-xs text-slate-400 mt-1">
                  Les emails sont envoyés via Supabase/Resend. Pour modifier la configuration SMTP,
                  accédez au dashboard Supabase → Authentication → Email Templates.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Security Settings */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-red-500/10">
              <Shield className="w-5 h-5 text-red-400" />
            </div>
            <div>
              <CardTitle className="text-white">Sécurité</CardTitle>
              <CardDescription className="text-slate-400">
                Paramètres de sécurité de la plateforme
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between py-3 border-b border-slate-700/50">
            <div>
              <p className="text-sm font-medium text-white">Double authentification (2FA)</p>
              <p className="text-xs text-slate-400">Requérir 2FA pour tous les admins</p>
            </div>
            <Switch
              checked={settings.require_2fa}
              onCheckedChange={(checked) => updateSetting('require_2fa', checked)}
            />
          </div>
          <div className="flex items-center justify-between py-3 border-b border-slate-700/50">
            <div>
              <p className="text-sm font-medium text-white">Logs d'audit</p>
              <p className="text-xs text-slate-400">Enregistrer toutes les actions admin</p>
            </div>
            <Switch
              checked={settings.audit_logs}
              onCheckedChange={(checked) => updateSetting('audit_logs', checked)}
            />
          </div>
          <div className="flex items-center justify-between py-3 border-b border-slate-700/50">
            <div>
              <p className="text-sm font-medium text-white">Session timeout</p>
              <p className="text-xs text-slate-400">Déconnexion automatique après inactivité</p>
            </div>
            <select
              value={settings.session_timeout}
              onChange={(e) => updateSetting('session_timeout', e.target.value)}
              className="h-10 px-3 rounded-md bg-slate-700/50 border border-slate-600 text-white text-sm"
            >
              <option value="30">30 minutes</option>
              <option value="60">1 heure</option>
              <option value="120">2 heures</option>
              <option value="480">8 heures</option>
            </select>
          </div>
          <div className="flex items-center justify-between py-3">
            <div>
              <p className="text-sm font-medium text-white">Limitation de tentatives</p>
              <p className="text-xs text-slate-400">Bloquer après 5 tentatives échouées</p>
            </div>
            <Switch
              checked={settings.rate_limiting}
              onCheckedChange={(checked) => updateSetting('rate_limiting', checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Theme Settings */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-orange-500/10">
              <Palette className="w-5 h-5 text-orange-400" />
            </div>
            <div>
              <CardTitle className="text-white">Apparence</CardTitle>
              <CardDescription className="text-slate-400">
                Personnalisez l'apparence de la plateforme
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between py-3 border-b border-slate-700/50">
            <div>
              <p className="text-sm font-medium text-white">Mode maintenance</p>
              <p className="text-xs text-slate-400">Afficher une page de maintenance aux utilisateurs</p>
            </div>
            <Switch
              checked={settings.maintenance_mode}
              onCheckedChange={(checked) => updateSetting('maintenance_mode', checked)}
            />
          </div>
          <div className="flex items-center justify-between py-3">
            <div>
              <p className="text-sm font-medium text-white">Bannière d'annonce</p>
              <p className="text-xs text-slate-400">Afficher une bannière en haut du site</p>
            </div>
            <Switch
              checked={settings.announcement_banner}
              onCheckedChange={(checked) => updateSetting('announcement_banner', checked)}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
