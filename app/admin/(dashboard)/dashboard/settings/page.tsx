'use client';

import { useState } from 'react';
import {
  Settings,
  Bell,
  Mail,
  Shield,
  Palette,
  Globe,
  Save,
  AlertCircle,
  CheckCircle,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

export default function AdminSettingsPage() {
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

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
          className="bg-purple-600 hover:bg-purple-700 text-white"
        >
          {saved ? (
            <>
              <CheckCircle className="w-4 h-4 mr-2" />
              Enregistré
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              Enregistrer
            </>
          )}
        </Button>
      </div>

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
                defaultValue="EasyCo"
                className="bg-slate-700/50 border-slate-600 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-slate-300">URL du site</Label>
              <Input
                defaultValue="https://easyco.be"
                className="bg-slate-700/50 border-slate-600 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-slate-300">Email de support</Label>
              <Input
                defaultValue="support@easyco.be"
                className="bg-slate-700/50 border-slate-600 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-slate-300">Langue par défaut</Label>
              <select className="w-full h-10 px-3 rounded-md bg-slate-700/50 border border-slate-600 text-white">
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
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between py-3 border-b border-slate-700/50">
            <div>
              <p className="text-sm font-medium text-white">Notifications push</p>
              <p className="text-xs text-slate-400">Notifications push pour les utilisateurs mobiles</p>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between py-3 border-b border-slate-700/50">
            <div>
              <p className="text-sm font-medium text-white">Résumé hebdomadaire</p>
              <p className="text-xs text-slate-400">Envoyer un résumé hebdomadaire aux propriétaires</p>
            </div>
            <Switch />
          </div>
          <div className="flex items-center justify-between py-3">
            <div>
              <p className="text-sm font-medium text-white">Alertes admin</p>
              <p className="text-xs text-slate-400">Recevoir des alertes pour les événements critiques</p>
            </div>
            <Switch defaultChecked />
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
                defaultValue="EasyCo <noreply@easyco.be>"
                className="bg-slate-700/50 border-slate-600 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-slate-300">Reply-To</Label>
              <Input
                defaultValue="support@easyco.be"
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
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between py-3 border-b border-slate-700/50">
            <div>
              <p className="text-sm font-medium text-white">Logs d'audit</p>
              <p className="text-xs text-slate-400">Enregistrer toutes les actions admin</p>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between py-3 border-b border-slate-700/50">
            <div>
              <p className="text-sm font-medium text-white">Session timeout</p>
              <p className="text-xs text-slate-400">Déconnexion automatique après inactivité</p>
            </div>
            <select className="h-10 px-3 rounded-md bg-slate-700/50 border border-slate-600 text-white text-sm">
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
            <Switch defaultChecked />
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
            <Switch />
          </div>
          <div className="flex items-center justify-between py-3">
            <div>
              <p className="text-sm font-medium text-white">Bannière d'annonce</p>
              <p className="text-xs text-slate-400">Afficher une bannière en haut du site</p>
            </div>
            <Switch />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
