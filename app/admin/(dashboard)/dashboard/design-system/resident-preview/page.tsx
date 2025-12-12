'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Home,
  Users,
  DollarSign,
  Calendar,
  MessageCircle,
  CheckSquare,
  Zap,
  Plus,
  UserPlus,
  MapPin,
  TrendingUp,
  Sparkles,
  Star,
  ChevronDown,
  Clock,
  Heart,
  ArrowRight,
  Bell,
  Settings,
  User
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

export default function ResidentPreviewPage() {
  const [selectedVersion, setSelectedVersion] = useState<'v1' | 'v2' | 'v4'>('v1');

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #d9574f 0%, #ff5b21 50%, #ff8017 100%)' }}
          >
            <Home className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Dashboard Résident - Preview & Choix</h1>
            <p className="text-sm text-slate-400">Comparez les différentes versions et choisissez votre préférée</p>
          </div>
        </div>
      </div>

      {/* Version Selector */}
      <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
        <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-orange-400" />
          Sélectionnez une version à visualiser
        </h3>
        <div className="flex gap-3">
          {[
            { id: 'v1', label: 'Version 1 - Gradient Complet 3 Couleurs', recommended: true },
            { id: 'v2', label: 'Version 2 - Couleur Principale Unie (#ee5736)', recommended: false },
            { id: 'v4', label: 'Version 4 - Gradient 2 Couleurs (Principal + Transparent)', recommended: true }
          ].map((version) => (
            <button
              key={version.id}
              onClick={() => setSelectedVersion(version.id as any)}
              className={cn(
                'flex-1 px-4 py-3 rounded-xl text-sm font-medium transition-all border-2 relative',
                selectedVersion === version.id
                  ? 'text-white border-orange-500'
                  : 'text-slate-400 border-slate-700 hover:border-slate-600'
              )}
              style={selectedVersion === version.id ? { background: 'linear-gradient(135deg, #d9574f 0%, #ff5b21 50%, #ff8017 100%)' } : {}}
            >
              {version.label}
              {version.recommended && (
                <Badge className="absolute -top-2 -right-2 bg-green-500 text-white text-xs">
                  Recommandé
                </Badge>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Preview Container */}
      <motion.div
        key={selectedVersion}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="space-y-6"
      >
        {selectedVersion === 'v1' && <Version1 />}
        {selectedVersion === 'v2' && <Version2 />}
        {selectedVersion === 'v4' && <Version4 />}
      </motion.div>

      {/* Recommendation Banner */}
      <Card className="bg-gradient-to-r from-green-900/50 to-emerald-900/50 border-green-700">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-green-500 flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white mb-2">💡 Recommandation</h3>
              <p className="text-sm text-green-100 mb-3">
                <strong>Version 1 (Gradient Complet 3 Couleurs)</strong> et <strong>Version 4 (Gradient 2 Couleurs)</strong> sont recommandées car elles utilisent le gradient signature extrait du logo IzzIco, créant une identité visuelle forte et cohérente.
              </p>
              <ul className="text-sm text-green-100 space-y-1 list-disc list-inside">
                <li><strong>V1</strong> : Parfaite pour les grandes surfaces (headers, bannières) - Impact visuel maximum</li>
                <li><strong>V4</strong> : Idéale pour les petits éléments (boutons, icônes, badges) - Plus subtile et moderne</li>
                <li><strong>V2</strong> : Bonne pour les états intermédiaires mais moins distinctive</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

/* ============================================
   VERSION 1 - GRADIENT COMPLET 3 COULEURS
   ============================================ */
function Version1() {
  return (
    <div className="space-y-6">
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold" style={{ background: 'linear-gradient(135deg, #d9574f 0%, #ff5b21 50%, #ff8017 100%)' }}>1</span>
            Version 1 - Gradient Complet 3 Couleurs
          </CardTitle>
          <p className="text-sm text-slate-400 mt-2">
            Gradient authentique du logo : #d9574f → #ff5b21 → #ff8017
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* ResidenceHeader V1 */}
          <div className="rounded-2xl overflow-hidden border-2 border-white/10 shadow-2xl"
            style={{ background: 'linear-gradient(135deg, #d9574f 0%, #ff5b21 50%, #ff8017 100%)' }}>
            <div className="p-6">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-start gap-4">
                  <div className="w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-sm border-2 border-white/30 overflow-hidden shadow-lg flex items-center justify-center">
                    <Home className="w-10 h-10 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-2">Résidence Bruxelles Centre</h2>
                    <div className="flex items-center gap-4 text-white/90 text-sm">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-4 h-4" />
                        <span>Ixelles, Bruxelles</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Users className="w-4 h-4" />
                        <span>4/6 colocataires</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Home className="w-4 h-4" />
                        <span>6 chambres</span>
                      </div>
                    </div>
                  </div>
                </div>
                <button className="px-6 py-3 bg-white rounded-xl font-semibold shadow-lg hover:scale-105 transition-transform flex items-center gap-2"
                  style={{ color: '#ee5736' }}>
                  <UserPlus className="w-5 h-5" />
                  Inviter des Colocs
                </button>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-4 gap-3">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center border border-white/20">
                  <p className="text-3xl font-bold text-white">€850</p>
                  <p className="text-xs text-white/70 mt-1">Loyer moyen</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center border border-white/20">
                  <p className="text-3xl font-bold text-white">4.8★</p>
                  <p className="text-xs text-white/70 mt-1">Note globale</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center border border-white/20">
                  <p className="text-3xl font-bold text-white">2</p>
                  <p className="text-xs text-white/70 mt-1">Tâches en cours</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center border border-white/20">
                  <p className="text-3xl font-bold text-white">€245</p>
                  <p className="text-xs text-white/70 mt-1">Dépenses ce mois</p>
                </div>
              </div>
            </div>
          </div>

          {/* Buttons avec V1 */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-white">Boutons avec Gradient Complet</h4>
            <div className="flex flex-wrap gap-3">
              <button className="px-6 py-3 rounded-xl text-white font-semibold shadow-lg hover:scale-105 transition-transform"
                style={{ background: 'linear-gradient(135deg, #d9574f 0%, #ff5b21 50%, #ff8017 100%)' }}>
                Inviter un colocataire
              </button>
              <button className="px-6 py-3 rounded-xl text-white font-semibold shadow-lg hover:scale-105 transition-transform flex items-center gap-2"
                style={{ background: 'linear-gradient(135deg, #d9574f 0%, #ff5b21 50%, #ff8017 100%)' }}>
                <Plus className="w-5 h-5" />
                Nouvelle dépense
              </button>
              <button className="px-6 py-3 rounded-xl text-white font-semibold shadow-lg hover:scale-105 transition-transform flex items-center gap-2"
                style={{ background: 'linear-gradient(135deg, #d9574f 0%, #ff5b21 50%, #ff8017 100%)' }}>
                <Zap className="w-5 h-5" />
                Actions Rapides
              </button>
            </div>
          </div>

          {/* KPI Card avec V1 */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-white">Cartes KPI avec Gradient Background</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="relative overflow-hidden rounded-3xl p-6 bg-white shadow-lg">
                <div className="absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-20"
                  style={{ background: 'linear-gradient(135deg, #d9574f, #ff8017)' }} />
                <div className="relative z-10">
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4 shadow-sm border border-gray-200"
                    style={{ background: 'linear-gradient(135deg, #d9574f 0%, #ff5b21 50%, #ff8017 100%)' }}
                  >
                    <Home className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-sm font-medium text-gray-600 mb-2">Loyer du Mois</h3>
                  <p className="text-2xl font-bold text-gray-900 mb-2">€850/1250</p>
                  <p className="text-xs text-gray-500">Échéance: 5 nov.</p>
                </div>
              </div>

              <div className="relative overflow-hidden rounded-3xl p-6 bg-white shadow-lg">
                <div className="absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-20"
                  style={{ background: 'linear-gradient(135deg, #d9574f, #ff8017)' }} />
                <div className="relative z-10">
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4 shadow-sm border border-gray-200"
                    style={{ background: 'linear-gradient(135deg, #d9574f 0%, #ff5b21 50%, #ff8017 100%)' }}
                  >
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-sm font-medium text-gray-600 mb-2">Colocataires</h3>
                  <p className="text-2xl font-bold text-gray-900 mb-2">4</p>
                  <p className="text-xs text-gray-500">Membres actifs</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

/* ============================================
   VERSION 2 - COULEUR PRINCIPALE UNIE
   ============================================ */
function Version2() {
  return (
    <div className="space-y-6">
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold" style={{ background: '#ee5736' }}>2</span>
            Version 2 - Couleur Principale Unie (#ee5736)
          </CardTitle>
          <p className="text-sm text-slate-400 mt-2">
            Couleur solide du milieu du gradient
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* ResidenceHeader V2 */}
          <div className="rounded-2xl overflow-hidden border-2 border-white/10 shadow-2xl"
            style={{ background: '#ee5736' }}>
            <div className="p-6">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-start gap-4">
                  <div className="w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-sm border-2 border-white/30 overflow-hidden shadow-lg flex items-center justify-center">
                    <Home className="w-10 h-10 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-2">Résidence Bruxelles Centre</h2>
                    <div className="flex items-center gap-4 text-white/90 text-sm">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-4 h-4" />
                        <span>Ixelles, Bruxelles</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Users className="w-4 h-4" />
                        <span>4/6 colocataires</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Home className="w-4 h-4" />
                        <span>6 chambres</span>
                      </div>
                    </div>
                  </div>
                </div>
                <button className="px-6 py-3 bg-white rounded-xl font-semibold shadow-lg hover:scale-105 transition-transform flex items-center gap-2"
                  style={{ color: '#ee5736' }}>
                  <UserPlus className="w-5 h-5" />
                  Inviter des Colocs
                </button>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-4 gap-3">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center border border-white/20">
                  <p className="text-3xl font-bold text-white">€850</p>
                  <p className="text-xs text-white/70 mt-1">Loyer moyen</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center border border-white/20">
                  <p className="text-3xl font-bold text-white">4.8★</p>
                  <p className="text-xs text-white/70 mt-1">Note globale</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center border border-white/20">
                  <p className="text-3xl font-bold text-white">2</p>
                  <p className="text-xs text-white/70 mt-1">Tâches en cours</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center border border-white/20">
                  <p className="text-3xl font-bold text-white">€245</p>
                  <p className="text-xs text-white/70 mt-1">Dépenses ce mois</p>
                </div>
              </div>
            </div>
          </div>

          {/* Buttons avec V2 */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-white">Boutons avec Couleur Unie</h4>
            <div className="flex flex-wrap gap-3">
              <button className="px-6 py-3 rounded-xl text-white font-semibold shadow-lg hover:scale-105 transition-transform"
                style={{ background: '#ee5736' }}>
                Inviter un colocataire
              </button>
              <button className="px-6 py-3 rounded-xl text-white font-semibold shadow-lg hover:scale-105 transition-transform flex items-center gap-2"
                style={{ background: '#ee5736' }}>
                <Plus className="w-5 h-5" />
                Nouvelle dépense
              </button>
              <button className="px-6 py-3 rounded-xl text-white font-semibold shadow-lg hover:scale-105 transition-transform flex items-center gap-2"
                style={{ background: '#ee5736' }}>
                <Zap className="w-5 h-5" />
                Actions Rapides
              </button>
            </div>
          </div>

          {/* KPI Card avec V2 */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-white">Cartes KPI avec Couleur Unie</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="relative overflow-hidden rounded-3xl p-6 bg-white shadow-lg">
                <div className="absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-20"
                  style={{ background: '#ee5736' }} />
                <div className="relative z-10">
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4 shadow-sm border border-gray-200"
                    style={{ background: '#ee5736' }}
                  >
                    <Home className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-sm font-medium text-gray-600 mb-2">Loyer du Mois</h3>
                  <p className="text-2xl font-bold text-gray-900 mb-2">€850/1250</p>
                  <p className="text-xs text-gray-500">Échéance: 5 nov.</p>
                </div>
              </div>

              <div className="relative overflow-hidden rounded-3xl p-6 bg-white shadow-lg">
                <div className="absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-20"
                  style={{ background: '#ee5736' }} />
                <div className="relative z-10">
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4 shadow-sm border border-gray-200"
                    style={{ background: '#ee5736' }}
                  >
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-sm font-medium text-gray-600 mb-2">Colocataires</h3>
                  <p className="text-2xl font-bold text-gray-900 mb-2">4</p>
                  <p className="text-xs text-gray-500">Membres actifs</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

/* ============================================
   VERSION 4 - GRADIENT 2 COULEURS
   ============================================ */
function Version4() {
  return (
    <div className="space-y-6">
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold"
              style={{ background: 'linear-gradient(to bottom right, #ee5736, #ee573680)' }}>4</span>
            Version 4 - Gradient 2 Couleurs (Principal + Transparent)
          </CardTitle>
          <p className="text-sm text-slate-400 mt-2">
            Gradient subtil : #ee5736 → #ee573680 (transparent)
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* ResidenceHeader V4 */}
          <div className="rounded-2xl overflow-hidden border-2 border-white/10 shadow-2xl"
            style={{ background: 'linear-gradient(to bottom right, #ee5736, #ee573680)' }}>
            <div className="p-6">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-start gap-4">
                  <div className="w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-sm border-2 border-white/30 overflow-hidden shadow-lg flex items-center justify-center">
                    <Home className="w-10 h-10 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-2">Résidence Bruxelles Centre</h2>
                    <div className="flex items-center gap-4 text-white/90 text-sm">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-4 h-4" />
                        <span>Ixelles, Bruxelles</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Users className="w-4 h-4" />
                        <span>4/6 colocataires</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Home className="w-4 h-4" />
                        <span>6 chambres</span>
                      </div>
                    </div>
                  </div>
                </div>
                <button className="px-6 py-3 bg-white/20 hover:bg-white/30 backdrop-blur rounded-xl text-white font-semibold shadow-lg hover:scale-105 transition-transform flex items-center gap-2 border border-white/30">
                  <UserPlus className="w-5 h-5" />
                  Inviter des Colocs
                </button>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-4 gap-3">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center border border-white/20">
                  <p className="text-3xl font-bold text-white">€850</p>
                  <p className="text-xs text-white/70 mt-1">Loyer moyen</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center border border-white/20">
                  <p className="text-3xl font-bold text-white">4.8★</p>
                  <p className="text-xs text-white/70 mt-1">Note globale</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center border border-white/20">
                  <p className="text-3xl font-bold text-white">2</p>
                  <p className="text-xs text-white/70 mt-1">Tâches en cours</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center border border-white/20">
                  <p className="text-3xl font-bold text-white">€245</p>
                  <p className="text-xs text-white/70 mt-1">Dépenses ce mois</p>
                </div>
              </div>
            </div>
          </div>

          {/* Buttons avec V4 */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-white">Boutons avec Gradient 2 Couleurs</h4>
            <div className="flex flex-wrap gap-3">
              <button className="px-6 py-3 rounded-xl text-white font-semibold shadow-lg hover:scale-105 transition-transform"
                style={{ background: 'linear-gradient(to bottom right, #ee5736, #ee573680)' }}>
                Inviter un colocataire
              </button>
              <button className="px-6 py-3 rounded-xl text-white font-semibold shadow-lg hover:scale-105 transition-transform flex items-center gap-2"
                style={{ background: 'linear-gradient(to bottom right, #ee5736, #ee573680)' }}>
                <Plus className="w-5 h-5" />
                Nouvelle dépense
              </button>
              <button className="px-6 py-3 rounded-xl text-white font-semibold shadow-lg hover:scale-105 transition-transform flex items-center gap-2"
                style={{ background: 'linear-gradient(to bottom right, #ee5736, #ee573680)' }}>
                <Zap className="w-5 h-5" />
                Actions Rapides
              </button>
            </div>
          </div>

          {/* KPI Card avec V4 */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-white">Cartes KPI avec Gradient 2 Couleurs</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="relative overflow-hidden rounded-3xl p-6 bg-white shadow-lg">
                <div className="absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-20"
                  style={{ background: 'linear-gradient(to bottom right, #ee573620, #ee573610)' }} />
                <div className="relative z-10">
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4 shadow-sm border border-gray-200"
                    style={{ background: 'linear-gradient(to bottom right, #ee5736, #ee573680)' }}
                  >
                    <Home className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-sm font-medium text-gray-600 mb-2">Loyer du Mois</h3>
                  <p className="text-2xl font-bold text-gray-900 mb-2">€850/1250</p>
                  <p className="text-xs text-gray-500">Échéance: 5 nov.</p>
                </div>
              </div>

              <div className="relative overflow-hidden rounded-3xl p-6 bg-white shadow-lg">
                <div className="absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-20"
                  style={{ background: 'linear-gradient(to bottom right, #ee573620, #ee573610)' }} />
                <div className="relative z-10">
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4 shadow-sm border border-gray-200"
                    style={{ background: 'linear-gradient(to bottom right, #ee5736, #ee573680)' }}
                  >
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-sm font-medium text-gray-600 mb-2">Colocataires</h3>
                  <p className="text-2xl font-bold text-gray-900 mb-2">4</p>
                  <p className="text-xs text-gray-500">Membres actifs</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
