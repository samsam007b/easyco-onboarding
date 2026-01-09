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
  Key,
  AlertTriangle,
  Info,
  ArrowRight,
  Plus,
  UserPlus,
  Receipt,
  AlertCircle,
  Sparkles,
  MapPin,
  ChevronDown,
  Bell,
  Globe,
  Settings,
  User,
  LogOut,
  TrendingUp,
  Wrench,
  BarChart3,
  Palette
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

export default function InterfaceResidentPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'components' | 'oppositions'>('overview');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div
          className="w-12 h-12 superellipse-2xl flex items-center justify-center"
          style={{ background: 'linear-gradient(to bottom right, #ee5736, #ee573680)' }}
        >
          <Key className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">Interface Resident</h1>
          <p className="text-sm text-slate-400">Inventaire complet de l'interface colocation</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-slate-800 superellipse-xl p-2 border border-slate-700">
        <div className="flex gap-1">
          {[
            { id: 'overview', label: 'Vue d\'ensemble', icon: Home },
            { id: 'components', label: 'Composants', icon: Sparkles },
            { id: 'oppositions', label: 'Oppositions', icon: AlertTriangle }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={cn(
                  'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all',
                  isActive
                    ? 'text-white'
                    : 'text-slate-400 hover:bg-slate-700 hover:text-white'
                )}
                style={isActive ? { background: 'linear-gradient(to bottom right, #ee5736, #ee573680)' } : {}}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.15 }}
      >
        {activeTab === 'overview' && <OverviewSection />}
        {activeTab === 'components' && <ComponentsSection />}
        {activeTab === 'oppositions' && <OppositionsSection />}
      </motion.div>
    </div>
  );
}

/* ============================================
   OVERVIEW SECTION
   ============================================ */
function OverviewSection() {
  return (
    <div className="space-y-6">
      {/* Gradient Signature - Les 3 couleurs du dégradé */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-orange-400" />
            Dégradé Signature Resident
          </CardTitle>
          <p className="text-sm text-slate-400 mt-2">
            Gradient officiel extrait du logo IzzIco (zone centrale orange)
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Visual Gradient Bar */}
          <div className="relative h-24 superellipse-2xl overflow-hidden border-2 border-white shadow-2xl">
            <div
              className="absolute inset-0"
              style={{ background: 'linear-gradient(135deg, #d9574f 0%, #ff5b21 50%, #ff8017 100%)' }}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <p className="text-white font-bold text-lg drop-shadow-lg">
                linear-gradient(135deg, #d9574f 0%, #ff5b21 50%, #ff8017 100%)
              </p>
            </div>
          </div>

          {/* Les 3 couleurs du gradient */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-3">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-3 h-3 rounded-full bg-white" />
                <label className="text-sm font-semibold text-slate-300">Couleur 1</label>
              </div>
              <div className="flex items-center gap-3">
                <div
                  className="w-20 h-20 superellipse-xl border-2 border-white shadow-lg"
                  style={{ background: '#d9574f' }}
                />
                <div>
                  <p className="text-white font-mono font-bold text-lg">#d9574f</p>
                  <p className="text-xs text-slate-400">0% - Start</p>
                  <p className="text-xs text-orange-300 mt-1">Rouge orangé</p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-3 h-3 rounded-full bg-white" />
                <label className="text-sm font-semibold text-slate-300">Couleur 2</label>
              </div>
              <div className="flex items-center gap-3">
                <div
                  className="w-20 h-20 superellipse-xl border-2 border-white shadow-lg"
                  style={{ background: '#ff5b21' }}
                />
                <div>
                  <p className="text-white font-mono font-bold text-lg">#ff5b21</p>
                  <p className="text-xs text-slate-400">50% - Middle</p>
                  <p className="text-xs text-orange-300 mt-1">Orange vif</p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-3 h-3 rounded-full bg-white" />
                <label className="text-sm font-semibold text-slate-300">Couleur 3</label>
              </div>
              <div className="flex items-center gap-3">
                <div
                  className="w-20 h-20 superellipse-xl border-2 border-white shadow-lg"
                  style={{ background: '#ff8017' }}
                />
                <div>
                  <p className="text-white font-mono font-bold text-lg">#ff8017</p>
                  <p className="text-xs text-slate-400">100% - End</p>
                  <p className="text-xs text-orange-300 mt-1">Orange doré</p>
                </div>
              </div>
            </div>
          </div>

          {/* Usage CSS */}
          <div className="p-4 bg-slate-900 rounded-lg border border-slate-600">
            <p className="text-xs text-slate-500 mb-2">CSS Variable (recommandé)</p>
            <code className="text-sm text-green-400 font-mono">
              background: var(--gradient-resident);
            </code>
          </div>

          {/* PALETTE 5 COULEURS - NEW */}
          <div className="border-t border-slate-600 pt-6">
            <div className="flex items-center gap-2 mb-4">
              <Palette className="w-5 h-5 text-orange-400" />
              <h4 className="text-base font-bold text-white">Palette 5 Couleurs pour Enrichissement</h4>
            </div>
            <p className="text-sm text-slate-400 mb-6">
              5 couleurs équidistantes extraites du gradient pour créer des variations dans vos boutons, badges et composants
            </p>

            {/* 5 Color Swatches - EXACTEMENT comme dans la page principale du design system */}
            <div className="grid grid-cols-5 gap-3">
              <div className="space-y-2">
                <div className="w-full h-24 rounded-lg border-2 border-white shadow-lg" style={{ background: '#d9574f' }} />
                <p className="text-white font-mono text-xs font-bold text-center">#d9574f</p>
                <p className="text-xs text-slate-400 text-center">0%</p>
              </div>

              <div className="space-y-2">
                <div className="w-full h-24 rounded-lg border-2 border-white shadow-lg" style={{ background: '#ee5736' }} />
                <p className="text-white font-mono text-xs font-bold text-center">#ee5736</p>
                <p className="text-xs text-slate-400 text-center">25%</p>
              </div>

              <div className="space-y-2">
                <div className="w-full h-24 rounded-lg border-2 border-white shadow-lg" style={{ background: '#ff5b21' }} />
                <p className="text-white font-mono text-xs font-bold text-center">#ff5b21</p>
                <p className="text-xs text-slate-400 text-center">50%</p>
              </div>

              <div className="space-y-2">
                <div className="w-full h-24 rounded-lg border-2 border-white shadow-lg" style={{ background: '#ff6e1c' }} />
                <p className="text-white font-mono text-xs font-bold text-center">#ff6e1c</p>
                <p className="text-xs text-slate-400 text-center">75%</p>
              </div>

              <div className="space-y-2">
                <div className="w-full h-24 rounded-lg border-2 border-white shadow-lg" style={{ background: '#ff8017' }} />
                <p className="text-white font-mono text-xs font-bold text-center">#ff8017</p>
                <p className="text-xs text-slate-400 text-center">100%</p>
              </div>
            </div>

            <div className="mt-6 p-4 bg-slate-900/80 rounded-lg border border-orange-500/30">
              <p className="text-sm text-orange-300 font-medium mb-2">Usage recommande</p>
              <p className="text-xs text-slate-400">
                Utilisez ces 5 couleurs pour créer des variations dans vos boutons, badges, icônes et composants.
                Le gradient complet (3 couleurs) est réservé aux grandes surfaces comme les headers.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Couleur Principale + Variations */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Couleur Principale & Variations</CardTitle>
          <p className="text-sm text-slate-400 mt-2">
            Couleur solide utilisée dans l'interface (textes, icônes, CTAs)
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Primary Color - #ee5736 */}
            <div className="space-y-2">
              <label className="text-sm text-slate-400">Couleur Principale</label>
              <div className="flex flex-col gap-3">
                <div
                  className="w-full h-24 superellipse-xl border-2 border-white shadow-lg flex items-center justify-center"
                  style={{ background: '#ee5736' }}
                >
                  <span className="text-white font-bold text-sm">var(--resident-500)</span>
                </div>
                <div>
                  <p className="text-white font-mono font-bold">#ee5736</p>
                  <p className="text-xs text-slate-400">Orange Resident Principal</p>
                  <p className="text-xs text-orange-300 mt-1">Icônes, textes actifs, CTAs</p>
                </div>
              </div>
            </div>

            {/* Gradient 2 couleurs */}
            <div className="space-y-2">
              <label className="text-sm text-slate-400">Dégradé 2 couleurs</label>
              <div className="flex flex-col gap-3">
                <div
                  className="w-full h-24 superellipse-xl border-2 border-white shadow-lg"
                  style={{ background: 'linear-gradient(to bottom right, #ee5736, #ee573680)' }}
                />
                <div>
                  <p className="text-white font-mono text-xs">to-br, #ee5736 → 80</p>
                  <p className="text-xs text-slate-400">Boutons, badges</p>
                  <p className="text-xs text-orange-300 mt-1">Avatars, icônes rondes</p>
                </div>
              </div>
            </div>

            {/* Fond Subtil 10% */}
            <div className="space-y-2">
              <label className="text-sm text-slate-400">Fond Subtil (10%)</label>
              <div className="flex flex-col gap-3">
                <div
                  className="w-full h-24 superellipse-xl border-2 border-slate-600 shadow-lg"
                  style={{ background: '#ee573610' }}
                />
                <div>
                  <p className="text-white font-mono text-xs">#ee573610</p>
                  <p className="text-xs text-slate-400">Backgrounds légers</p>
                  <p className="text-xs text-orange-300 mt-1">Boutons hover, zones</p>
                </div>
              </div>
            </div>

            {/* Bordure 30% */}
            <div className="space-y-2">
              <label className="text-sm text-slate-400">Bordure (30%)</label>
              <div className="flex flex-col gap-3">
                <div
                  className="w-full h-24 superellipse-xl border-2 shadow-lg bg-slate-900"
                  style={{ borderColor: '#ee573630' }}
                />
                <div>
                  <p className="text-white font-mono text-xs">#ee573630</p>
                  <p className="text-xs text-slate-400">Borders, séparateurs</p>
                  <p className="text-xs text-orange-300 mt-1">Contours subtils</p>
                </div>
              </div>
            </div>
          </div>

          {/* Darker variant */}
          <div className="p-4 bg-slate-900 rounded-lg border border-slate-600">
            <div className="flex items-center gap-4">
              <div
                className="w-16 h-16 superellipse-xl border-2 border-white shadow-lg"
                style={{ background: '#c23f21' }}
              />
              <div className="flex-1">
                <p className="text-white font-mono font-bold">#c23f21</p>
                <p className="text-xs text-slate-400">Variante plus foncée (non recommandée)</p>
                <p className="text-xs text-yellow-400 mt-1">[!] Incoherence detectee : utilise sur bouton "membres" - preferer #ee5736</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Variantes de Boutons avec les 5 Couleurs */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Wrench className="w-5 h-5 text-orange-400" />
            Variantes de Boutons - Choisissez votre Style
          </CardTitle>
          <p className="text-sm text-slate-400 mt-2">
            Testez différentes combinaisons de couleurs pour vos boutons et composants
          </p>
        </CardHeader>
        <CardContent className="space-y-8">
          {/* Version 1 - Gradient complet */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 rounded-full bg-gradient-to-r from-green-500 to-green-600 flex items-center justify-center text-white text-xs font-bold">1</div>
              <h4 className="text-base font-bold text-white">Version 1 - Gradient Signature Complet</h4>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <button className="px-4 py-2.5 superellipse-xl text-white font-semibold shadow-lg hover:scale-105 transition-transform"
                style={{ background: 'linear-gradient(135deg, #d9574f 0%, #ff5b21 50%, #ff8017 100%)' }}>
                Action Principale
              </button>
              <button className="px-4 py-2.5 superellipse-xl text-white font-semibold shadow-lg hover:scale-105 transition-transform"
                style={{ background: 'linear-gradient(135deg, #d9574f 0%, #ff5b21 50%, #ff8017 100%)' }}>
                <Users className="w-4 h-4 inline mr-2" />
                Membres
              </button>
              <button className="px-4 py-2.5 superellipse-xl text-white font-semibold shadow-lg hover:scale-105 transition-transform"
                style={{ background: 'linear-gradient(135deg, #d9574f 0%, #ff5b21 50%, #ff8017 100%)' }}>
                <Plus className="w-4 h-4 inline mr-2" />
                Ajouter
              </button>
              <button className="px-4 py-2.5 superellipse-xl text-white font-semibold shadow-lg hover:scale-105 transition-transform"
                style={{ background: 'linear-gradient(135deg, #d9574f 0%, #ff5b21 50%, #ff8017 100%)' }}>
                Valider
              </button>
            </div>
          </div>

          {/* Version 2 - Couleur unique (#ee5736) */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center text-white text-xs font-bold">2</div>
              <h4 className="text-base font-bold text-white">Version 2 - Couleur Principale Unie (#ee5736)</h4>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <button className="px-4 py-2.5 superellipse-xl text-white font-semibold shadow-lg hover:scale-105 transition-transform"
                style={{ background: '#ee5736' }}>
                Action Principale
              </button>
              <button className="px-4 py-2.5 superellipse-xl text-white font-semibold shadow-lg hover:scale-105 transition-transform"
                style={{ background: '#ee5736' }}>
                <Users className="w-4 h-4 inline mr-2" />
                Membres
              </button>
              <button className="px-4 py-2.5 superellipse-xl text-white font-semibold shadow-lg hover:scale-105 transition-transform"
                style={{ background: '#ee5736' }}>
                <Plus className="w-4 h-4 inline mr-2" />
                Ajouter
              </button>
              <button className="px-4 py-2.5 superellipse-xl text-white font-semibold shadow-lg hover:scale-105 transition-transform"
                style={{ background: '#ee5736' }}>
                Valider
              </button>
            </div>
          </div>

          {/* Version 3 - Mix des 5 couleurs */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 rounded-full bg-gradient-to-r from-purple-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold">3</div>
              <h4 className="text-base font-bold text-white">Version 3 - Mix Palette (1 couleur par bouton)</h4>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              <button className="px-4 py-2.5 superellipse-xl text-white font-semibold shadow-lg hover:scale-105 transition-transform"
                style={{ background: '#d9574f' }}>
                Couleur 1
              </button>
              <button className="px-4 py-2.5 superellipse-xl text-white font-semibold shadow-lg hover:scale-105 transition-transform"
                style={{ background: '#ee5736' }}>
                Couleur 2
              </button>
              <button className="px-4 py-2.5 superellipse-xl text-white font-semibold shadow-lg hover:scale-105 transition-transform"
                style={{ background: '#ff5b21' }}>
                Couleur 3
              </button>
              <button className="px-4 py-2.5 superellipse-xl text-white font-semibold shadow-lg hover:scale-105 transition-transform"
                style={{ background: '#ff6e1c' }}>
                Couleur 4
              </button>
              <button className="px-4 py-2.5 superellipse-xl text-white font-semibold shadow-lg hover:scale-105 transition-transform"
                style={{ background: '#ff8017' }}>
                Couleur 5
              </button>
            </div>
          </div>

          {/* Version 4 - Gradient 2 couleurs */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 rounded-full bg-gradient-to-r from-yellow-500 to-yellow-600 flex items-center justify-center text-white text-xs font-bold">4</div>
              <h4 className="text-base font-bold text-white">Version 4 - Gradient 2 Couleurs (Principal + Transparent)</h4>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <button className="px-4 py-2.5 superellipse-xl text-white font-semibold shadow-lg hover:scale-105 transition-transform"
                style={{ background: 'linear-gradient(to bottom right, #ee5736, #ee573680)' }}>
                Action Principale
              </button>
              <button className="px-4 py-2.5 superellipse-xl text-white font-semibold shadow-lg hover:scale-105 transition-transform"
                style={{ background: 'linear-gradient(to bottom right, #ee5736, #ee573680)' }}>
                <Users className="w-4 h-4 inline mr-2" />
                Membres
              </button>
              <button className="px-4 py-2.5 superellipse-xl text-white font-semibold shadow-lg hover:scale-105 transition-transform"
                style={{ background: 'linear-gradient(to bottom right, #ee5736, #ee573680)' }}>
                <Plus className="w-4 h-4 inline mr-2" />
                Ajouter
              </button>
              <button className="px-4 py-2.5 superellipse-xl text-white font-semibold shadow-lg hover:scale-105 transition-transform"
                style={{ background: 'linear-gradient(to bottom right, #ee5736, #ee573680)' }}>
                Valider
              </button>
            </div>
          </div>

          {/* Version 5 - Outline avec couleurs */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 rounded-full bg-gradient-to-r from-pink-500 to-pink-600 flex items-center justify-center text-white text-xs font-bold">5</div>
              <h4 className="text-base font-bold text-white">Version 5 - Outline (Bordure Colorée)</h4>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <button className="px-4 py-2.5 superellipse-xl font-semibold hover:scale-105 transition-transform border-2"
                style={{ borderColor: '#ee5736', color: '#ee5736', background: 'transparent' }}>
                Action Principale
              </button>
              <button className="px-4 py-2.5 superellipse-xl font-semibold hover:scale-105 transition-transform border-2"
                style={{ borderColor: '#ee5736', color: '#ee5736', background: 'transparent' }}>
                <Users className="w-4 h-4 inline mr-2" />
                Membres
              </button>
              <button className="px-4 py-2.5 superellipse-xl font-semibold hover:scale-105 transition-transform border-2"
                style={{ borderColor: '#ee5736', color: '#ee5736', background: 'transparent' }}>
                <Plus className="w-4 h-4 inline mr-2" />
                Ajouter
              </button>
              <button className="px-4 py-2.5 superellipse-xl font-semibold hover:scale-105 transition-transform border-2"
                style={{ borderColor: '#ee5736', color: '#ee5736', background: 'transparent' }}>
                Valider
              </button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Variantes de Headers/Banners Résidence */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Home className="w-5 h-5 text-orange-400" />
            Variantes Header/Banner Résidence - Choisissez votre Style
          </CardTitle>
          <p className="text-sm text-slate-400 mt-2">
            Testez différentes combinaisons pour le header de votre résidence
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Version 1 - Gradient Signature Complet */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 rounded-full bg-gradient-to-r from-green-500 to-green-600 flex items-center justify-center text-white text-xs font-bold">1</div>
              <h4 className="text-base font-bold text-white">Version 1 - Gradient Signature Complet</h4>
              <Badge className="bg-blue-500/20 text-blue-300 text-xs">Recommandé pour Actions Rapides</Badge>
            </div>
            <div className="superellipse-2xl overflow-hidden border-2 border-white/20 shadow-2xl"
              style={{ background: 'linear-gradient(135deg, #d9574f 0%, #ff5b21 50%, #ff8017 100%)' }}>
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 superellipse-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                      <Home className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">Résidence Bruxelles Centre</h3>
                      <p className="text-sm text-white/80">12 colocataires • 6 chambres</p>
                    </div>
                  </div>
                  <button className="px-4 py-2 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white superellipse-xl font-semibold transition-all">
                    Actions Rapides
                  </button>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-white/10 backdrop-blur-sm superellipse-xl p-3 text-center">
                    <p className="text-2xl font-bold text-white">€850</p>
                    <p className="text-xs text-white/70">Loyer moyen</p>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm superellipse-xl p-3 text-center">
                    <p className="text-2xl font-bold text-white">4.8★</p>
                    <p className="text-xs text-white/70">Note globale</p>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm superellipse-xl p-3 text-center">
                    <p className="text-2xl font-bold text-white">2</p>
                    <p className="text-xs text-white/70">Tâches en cours</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Version 2 - Couleur Unie (#ee5736) */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center text-white text-xs font-bold">2</div>
              <h4 className="text-base font-bold text-white">Version 2 - Couleur Principale Unie (#ee5736)</h4>
              <Badge className="bg-green-500/20 text-green-300 text-xs">Simple & Élégant</Badge>
            </div>
            <div className="superellipse-2xl overflow-hidden border-2 border-white/20 shadow-2xl"
              style={{ background: '#ee5736' }}>
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 superellipse-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                      <Home className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">Résidence Bruxelles Centre</h3>
                      <p className="text-sm text-white/80">12 colocataires • 6 chambres</p>
                    </div>
                  </div>
                  <button className="px-4 py-2 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white superellipse-xl font-semibold transition-all">
                    Actions Rapides
                  </button>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-white/10 backdrop-blur-sm superellipse-xl p-3 text-center">
                    <p className="text-2xl font-bold text-white">€850</p>
                    <p className="text-xs text-white/70">Loyer moyen</p>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm superellipse-xl p-3 text-center">
                    <p className="text-2xl font-bold text-white">4.8★</p>
                    <p className="text-xs text-white/70">Note globale</p>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm superellipse-xl p-3 text-center">
                    <p className="text-2xl font-bold text-white">2</p>
                    <p className="text-xs text-white/70">Tâches en cours</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Version 4 - Gradient 2 Couleurs (déjà existante) */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 rounded-full bg-gradient-to-r from-yellow-500 to-yellow-600 flex items-center justify-center text-white text-xs font-bold">4</div>
              <h4 className="text-base font-bold text-white">Version 4 - Gradient 2 Couleurs (Principal + Transparent)</h4>
              <Badge className="bg-purple-500/20 text-purple-300 text-xs">Doux & Moderne</Badge>
            </div>
            <div className="superellipse-2xl overflow-hidden border-2 border-white/20 shadow-2xl"
              style={{ background: 'linear-gradient(to bottom right, #ee5736, #ee573680)' }}>
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 superellipse-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                      <Home className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">Résidence Bruxelles Centre</h3>
                      <p className="text-sm text-white/80">12 colocataires • 6 chambres</p>
                    </div>
                  </div>
                  <button className="px-4 py-2 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white superellipse-xl font-semibold transition-all">
                    Actions Rapides
                  </button>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-white/10 backdrop-blur-sm superellipse-xl p-3 text-center">
                    <p className="text-2xl font-bold text-white">€850</p>
                    <p className="text-xs text-white/70">Loyer moyen</p>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm superellipse-xl p-3 text-center">
                    <p className="text-2xl font-bold text-white">4.8★</p>
                    <p className="text-xs text-white/70">Note globale</p>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm superellipse-xl p-3 text-center">
                    <p className="text-2xl font-bold text-white">2</p>
                    <p className="text-xs text-white/70">Tâches en cours</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Recommandations d'usage */}
          <div className="mt-6 p-4 bg-gradient-to-r from-orange-500/10 to-orange-600/10 superellipse-xl border border-orange-500/30">
            <h4 className="text-sm font-bold text-orange-300 mb-3">Recommandations d'usage</h4>
            <div className="space-y-2 text-xs text-slate-300">
              <p><strong className="text-white">Version 1 (Gradient complet):</strong> Idéal pour les sections qui nécessitent une attention maximale - Actions Rapides, Profile Dropdown Background, Logo IzzIco</p>
              <p><strong className="text-white">Version 2 (Couleur unie):</strong> Parfait pour les boutons généraux d'utilisation de l'app - Navigation, CTAs standards</p>
              <p><strong className="text-white">Version 3 (Mix palette):</strong> Excellent pour différencier visuellement les thèmes/pages/actions avec des couleurs respectives par catégorie</p>
              <p><strong className="text-white">Version 4 (Gradient doux):</strong> Élégant pour les headers/banners de résidence avec un look moderne et subtil</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Navigation Items */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Navigation Principale</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { label: 'Résidents', icon: Users, href: '/hub/members', badge: 4 },
              { label: 'Tâches', icon: CheckSquare, href: '/hub/tasks', badge: 3 },
              { label: 'Finances', icon: DollarSign, href: '/hub/finances', badge: '!' },
              { label: 'Calendrier', icon: Calendar, href: '/hub/calendar' },
              { label: 'Messages', icon: MessageCircle, href: '/hub/messages', badge: 2 }
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.label}
                  className="flex items-center justify-between p-3 superellipse-xl transition-all"
                  style={{ background: '#ee573610' }}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-5 h-5" style={{ color: '#ee5736' }} />
                    <span className="text-white font-medium">{item.label}</span>
                  </div>
                  {item.badge && (
                    <Badge
                      className="badge-gradient-resident h-5 min-w-[20px] px-1.5"
                      style={{ background: 'linear-gradient(to bottom right, #ee5736, #ee573680)' }}
                    >
                      {item.badge}
                    </Badge>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

/* ============================================
   COMPONENTS SECTION
   ============================================ */
function ComponentsSection() {
  return (
    <div className="space-y-6">
      {/* Logo IzzIco avec Gradient */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-orange-400" />
            Logo IzzIco avec Gradient Signature
          </CardTitle>
          <p className="text-sm text-slate-400 mt-2">
            Utilisé dans le header pour les Actions Rapides, Profile Dropdown, et Logo principal
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Version 1 - Logo avec gradient complet en background */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-white">Version 1 - Background Gradient Complet</h4>
            <div className="p-6 superellipse-xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #d9574f 0%, #ff5b21 50%, #ff8017 100%)' }}>
              <div className="text-white font-bold text-xl">IzzIco</div>
            </div>
            <code className="text-xs text-slate-400 block p-2 bg-slate-900 rounded">
              background: linear-gradient(135deg, #d9574f 0%, #ff5b21 50%, #ff8017 100%)
            </code>
          </div>

          {/* Version 2 - Icon avec gradient en background */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-white">Version 2 - Icon Background (Profile Dropdown)</h4>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full flex items-center justify-center shadow-lg"
                style={{ background: 'linear-gradient(135deg, #d9574f 0%, #ff5b21 50%, #ff8017 100%)' }}>
                <User className="w-5 h-5 text-white" />
              </div>
              <div className="w-10 h-10 superellipse-xl flex items-center justify-center shadow-lg"
                style={{ background: 'linear-gradient(135deg, #d9574f 0%, #ff5b21 50%, #ff8017 100%)' }}>
                <Settings className="w-5 h-5 text-white" />
              </div>
              <div className="w-10 h-10 superellipse-2xl flex items-center justify-center shadow-lg"
                style={{ background: 'linear-gradient(135deg, #d9574f 0%, #ff5b21 50%, #ff8017 100%)' }}>
                <Bell className="w-5 h-5 text-white" />
              </div>
            </div>
          </div>

          {/* Version 3 - Bouton "Actions Rapides" avec gradient */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-white">Version 3 - Bouton "Actions Rapides"</h4>
            <button className="px-6 py-3 superellipse-xl text-white font-semibold shadow-lg hover:scale-105 transition-transform flex items-center gap-2"
              style={{ background: 'linear-gradient(135deg, #d9574f 0%, #ff5b21 50%, #ff8017 100%)' }}>
              <Zap className="w-5 h-5" />
              Actions Rapides
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Navigation Items */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Home className="w-5 h-5 text-orange-400" />
            Navigation Items - États et Variantes
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* État Actif */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-white">État Actif (Page courante)</h4>
            <div className="p-3 superellipse-xl relative" style={{ background: '#ee573610', borderLeft: '3px solid #ee5736' }}>
              <div className="flex items-center gap-2">
                <Home className="w-5 h-5" style={{ color: '#ee5736' }} />
                <span style={{ color: '#ee5736' }} className="text-sm font-semibold">Dashboard</span>
              </div>
            </div>
          </div>

          {/* État Inactif */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-white">État Inactif</h4>
            <div className="p-3 superellipse-xl bg-transparent hover:bg-slate-700/50 transition-all cursor-pointer">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-slate-400" />
                <span className="text-sm font-medium text-slate-400">Membres</span>
              </div>
            </div>
          </div>

          {/* Avec Badge */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-white">Avec Badge de Notification</h4>
            <div className="p-3 superellipse-xl relative" style={{ background: '#ee573610', borderLeft: '3px solid #ee5736' }}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MessageCircle className="w-5 h-5" style={{ color: '#ee5736' }} />
                  <span style={{ color: '#ee5736' }} className="text-sm font-semibold">Messages</span>
                </div>
                <Badge className="text-white text-xs font-bold px-2 py-0.5"
                  style={{ background: 'linear-gradient(135deg, #d9574f 0%, #ff5b21 50%, #ff8017 100%)' }}>
                  3
                </Badge>
              </div>
            </div>
          </div>

          {/* Liste complète d'exemples */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-white">Exemples d'Items de Navigation</h4>
            <div className="space-y-2">
              {[
                { icon: Home, label: 'Dashboard', active: true, badge: null },
                { icon: Users, label: 'Membres', active: false, badge: 4 },
                { icon: CheckSquare, label: 'Tâches', active: false, badge: 3 },
                { icon: DollarSign, label: 'Finances', active: false, badge: '!' },
                { icon: MessageCircle, label: 'Messages', active: false, badge: 2 }
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.label}
                    className={`p-3 superellipse-xl transition-all cursor-pointer ${item.active ? 'border-l-3' : ''}`}
                    style={item.active ? { background: '#ee573610', borderLeft: '3px solid #ee5736' } : {}}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Icon className="w-5 h-5" style={{ color: item.active ? '#ee5736' : '#94a3b8' }} />
                        <span className={`text-sm font-${item.active ? 'semibold' : 'medium'}`}
                          style={{ color: item.active ? '#ee5736' : '#94a3b8' }}>
                          {item.label}
                        </span>
                      </div>
                      {item.badge && (
                        <Badge className="text-white text-xs font-bold px-2 py-0.5"
                          style={{ background: item.badge === '!' ? '#ef4444' : 'linear-gradient(135deg, #d9574f 0%, #ff5b21 50%, #ff8017 100%)' }}>
                          {item.badge}
                        </Badge>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Dropdowns */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <ChevronDown className="w-5 h-5 text-orange-400" />
            Dropdowns - Actions Rapides & Profile
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Actions Rapides Dropdown */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-white">Dropdown "Actions Rapides"</h4>
            <div className="bg-slate-900 superellipse-xl border border-slate-700 p-4 space-y-2">
              {[
                { icon: UserPlus, label: 'Inviter un colocataire', color: '#ee5736' },
                { icon: Plus, label: 'Nouvelle dépense', color: '#ee5736' },
                { icon: CheckSquare, label: 'Créer une tâche', color: '#ee5736' },
                { icon: Calendar, label: 'Ajouter un événement', color: '#ee5736' }
              ].map((action) => {
                const Icon = action.icon;
                return (
                  <button
                    key={action.label}
                    className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-slate-800 transition-all text-left"
                  >
                    <Icon className="w-5 h-5" style={{ color: action.color }} />
                    <span className="text-sm font-medium text-white">{action.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Profile Dropdown */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-white">Dropdown "Profile"</h4>
            <div className="bg-slate-900 superellipse-xl border border-slate-700 p-4">
              {/* User Info */}
              <div className="flex items-center gap-3 pb-3 border-b border-slate-700">
                <div className="w-12 h-12 rounded-full flex items-center justify-center shadow-lg"
                  style={{ background: 'linear-gradient(135deg, #d9574f 0%, #ff5b21 50%, #ff8017 100%)' }}>
                  <User className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-white font-semibold text-sm">Jean Dupont</p>
                  <p className="text-slate-400 text-xs">jean@example.com</p>
                </div>
              </div>

              {/* Menu Items */}
              <div className="space-y-1 pt-3">
                {[
                  { icon: User, label: 'Mon Profil' },
                  { icon: Settings, label: 'Paramètres' },
                  { icon: Bell, label: 'Notifications' },
                  { icon: Globe, label: 'Langue' }
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.label}
                      className="w-full flex items-center gap-3 p-2.5 rounded-lg hover:bg-slate-800 transition-all text-left"
                    >
                      <Icon className="w-4 h-4 text-slate-400" />
                      <span className="text-sm text-slate-300">{item.label}</span>
                    </button>
                  );
                })}

                {/* Logout */}
                <div className="pt-2 border-t border-slate-700">
                  <button className="w-full flex items-center gap-3 p-2.5 rounded-lg hover:bg-red-500/10 transition-all text-left">
                    <LogOut className="w-4 h-4 text-red-400" />
                    <span className="text-sm text-red-400 font-medium">Déconnexion</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Buttons Variantes */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Wrench className="w-5 h-5 text-orange-400" />
            Boutons - Toutes les Variantes
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Primary CTA - Gradient */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-white">Primary CTA - Gradient Complet</h4>
            <div className="flex flex-wrap gap-3">
              <button className="px-6 py-3 superellipse-xl text-white font-semibold shadow-lg hover:scale-105 transition-transform"
                style={{ background: 'linear-gradient(135deg, #d9574f 0%, #ff5b21 50%, #ff8017 100%)' }}>
                Inviter un colocataire
              </button>
              <button className="px-6 py-3 superellipse-xl text-white font-semibold shadow-lg hover:scale-105 transition-transform flex items-center gap-2"
                style={{ background: 'linear-gradient(135deg, #d9574f 0%, #ff5b21 50%, #ff8017 100%)' }}>
                <Plus className="w-5 h-5" />
                Nouvelle dépense
              </button>
            </div>
          </div>

          {/* Secondary - Couleur Unie */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-white">Secondary - Couleur Unie (#ee5736)</h4>
            <div className="flex flex-wrap gap-3">
              <button className="px-5 py-2.5 superellipse-xl text-white font-semibold shadow-lg hover:scale-105 transition-transform"
                style={{ background: '#ee5736' }}>
                Sauvegarder
              </button>
              <button className="px-5 py-2.5 superellipse-xl text-white font-semibold shadow-lg hover:scale-105 transition-transform flex items-center gap-2"
                style={{ background: '#ee5736' }}>
                <CheckSquare className="w-4 h-4" />
                Valider
              </button>
            </div>
          </div>

          {/* Outline */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-white">Outline - Bordure Colorée</h4>
            <div className="flex flex-wrap gap-3">
              <button className="px-5 py-2.5 superellipse-xl font-semibold transition-transform hover:scale-105 border-2"
                style={{ borderColor: '#ee5736', color: '#ee5736', background: 'transparent' }}>
                Annuler
              </button>
              <button className="px-5 py-2.5 superellipse-xl font-semibold transition-transform hover:scale-105 border-2 flex items-center gap-2"
                style={{ borderColor: '#ee5736', color: '#ee5736', background: 'transparent' }}>
                <Users className="w-4 h-4" />
                Voir les membres
              </button>
            </div>
          </div>

          {/* Ghost - Fond Subtil */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-white">Ghost - Fond Subtil</h4>
            <div className="flex flex-wrap gap-3">
              <button className="px-5 py-2.5 superellipse-xl font-semibold transition-all hover:scale-105"
                style={{ background: '#ee573610', color: '#ee5736' }}>
                Modifier
              </button>
              <button className="px-5 py-2.5 superellipse-xl font-semibold transition-all hover:scale-105 flex items-center gap-2"
                style={{ background: '#ee573610', color: '#ee5736' }}>
                <Settings className="w-4 h-4" />
                Paramètres
              </button>
            </div>
          </div>

          {/* Avec Icons */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-white">Avec Icônes - Mix Palette</h4>
            <div className="flex flex-wrap gap-3">
              <button className="px-4 py-2.5 superellipse-xl text-white font-semibold shadow-lg hover:scale-105 transition-transform flex items-center gap-2"
                style={{ background: '#d9574f' }}>
                <Home className="w-4 h-4" />
                Résidence
              </button>
              <button className="px-4 py-2.5 superellipse-xl text-white font-semibold shadow-lg hover:scale-105 transition-transform flex items-center gap-2"
                style={{ background: '#ee5736' }}>
                <Users className="w-4 h-4" />
                Membres
              </button>
              <button className="px-4 py-2.5 superellipse-xl text-white font-semibold shadow-lg hover:scale-105 transition-transform flex items-center gap-2"
                style={{ background: '#ff5b21' }}>
                <CheckSquare className="w-4 h-4" />
                Tâches
              </button>
              <button className="px-4 py-2.5 superellipse-xl text-white font-semibold shadow-lg hover:scale-105 transition-transform flex items-center gap-2"
                style={{ background: '#ff6e1c' }}>
                <DollarSign className="w-4 h-4" />
                Finances
              </button>
              <button className="px-4 py-2.5 superellipse-xl text-white font-semibold shadow-lg hover:scale-105 transition-transform flex items-center gap-2"
                style={{ background: '#ff8017' }}>
                <Calendar className="w-4 h-4" />
                Calendrier
              </button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Residence Header */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">ResidenceHeader - Bannière Résidence</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-6 superellipse-2xl" style={{ background: 'linear-gradient(to right, #D97B6F, #E8865D, #FF8C4B)' }}>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 superellipse-xl bg-white/20 backdrop-blur flex items-center justify-center">
                <Home className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold text-white mb-1">Appartement 2 Chambres - Ixelles Flagey</h2>
                <div className="flex items-center gap-3 text-white/90 text-sm">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    <span>Ixelles</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    <span>1 colocataire</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-2 mt-4">
              <button className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-white bg-white/20 hover:bg-white/30 border border-white/30 backdrop-blur">
                <Plus className="w-4 h-4" />
                Dépense
              </button>
              <button className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-white bg-white/20 hover:bg-white/30 border border-white/30 backdrop-blur">
                <UserPlus className="w-4 h-4" />
                Inviter
              </button>
            </div>

            {/* Progress Section */}
            <div className="mt-4 pt-4 border-t border-white/20">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-white" />
                  <span className="text-white font-medium text-sm">Complétez votre résidence</span>
                </div>
                <span className="text-white font-bold text-sm">65%</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-white/20 mb-3">
                <div className="h-full" style={{ width: '65%', background: 'linear-gradient(90deg, rgba(255,255,255,0.9), rgba(255,255,255,0.7))' }} />
              </div>
              <div className="flex gap-2">
                <button className="text-xs bg-white/20 backdrop-blur text-white px-3 py-1.5 rounded-full hover:bg-white/30">
                  Inviter des colocataires
                </button>
                <button className="text-xs bg-white/20 backdrop-blur text-white px-3 py-1.5 rounded-full hover:bg-white/30">
                  Configurer des tâches
                </button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Dashboard Cards */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Dashboard KPI Cards</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Loyer Card */}
            <div className="relative overflow-hidden superellipse-3xl p-6 bg-white shadow-lg">
              <div className="absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-20" style={{ background: 'linear-gradient(to bottom right, #ee573620, #ee573610)' }} />
              <div className="relative z-10">
                <div
                  className="w-12 h-12 superellipse-2xl flex items-center justify-center mb-4 shadow-sm border border-gray-200"
                  style={{ background: 'linear-gradient(to bottom right, #ee5736, #ee573680)' }}
                >
                  <Home className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-sm font-medium text-gray-600 mb-2">Loyer du Mois</h3>
                <p className="text-2xl font-bold text-gray-900 mb-2">€1062/1250</p>
                <p className="text-xs text-gray-500">Échéance: 5 nov.</p>
              </div>
            </div>

            {/* Colocataires Card */}
            <div className="relative overflow-hidden superellipse-3xl p-6 bg-white shadow-lg">
              <div className="absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-20" style={{ background: 'linear-gradient(to bottom right, #ee573620, #ee573610)' }} />
              <div className="relative z-10">
                <div
                  className="w-12 h-12 superellipse-2xl flex items-center justify-center mb-4 shadow-sm border border-gray-200"
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
        </CardContent>
      </Card>

      {/* Quick Actions Dropdown */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Quick Actions Dropdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="w-72 bg-white/95 backdrop-blur-2xl superellipse-2xl shadow-2xl border border-white/20 py-2">
            <div className="px-4 py-3 border-b border-gray-100">
              <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                <Zap className="w-4 h-4" style={{ color: '#ee5736' }} />
                Actions Rapides
              </h3>
            </div>
            <div className="p-2">
              {[
                { label: 'Payer le loyer', icon: Receipt, description: 'Effectuer un paiement' },
                { label: 'Signaler un problème', icon: AlertCircle, description: 'Créer une demande' },
                { label: 'Ajouter une dépense', icon: Plus, description: 'Partager une dépense' }
              ].map((action) => {
                const Icon = action.icon;
                return (
                  <div
                    key={action.label}
                    className="flex items-start gap-3 px-3 py-3 superellipse-xl hover:bg-orange-50 transition group cursor-pointer"
                  >
                    <div
                      className="w-10 h-10 superellipse-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform border border-gray-200"
                      style={{ background: 'linear-gradient(to bottom right, #ee5736, #ee573680)' }}
                    >
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-gray-900">{action.label}</p>
                      <p className="text-xs text-gray-500">{action.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* DASHBOARD RÉSIDENCE MODERNE - COMPLET */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-orange-400" />
            Dashboard Résidence - Vue Complète Moderne
          </CardTitle>
          <p className="text-sm text-slate-400 mt-2">
            Dashboard complet inspiré des meilleures apps : Utile + Beau + Intuitif
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Header Section avec Photo Résidence */}
          <div className="superellipse-2xl overflow-hidden border-2 border-white/10 shadow-2xl"
            style={{ background: 'linear-gradient(135deg, #d9574f 0%, #ff5b21 50%, #ff8017 100%)' }}>
            <div className="p-6">
              {/* Top Row - Photo + Infos + CTA Principal */}
              <div className="flex items-start gap-6 mb-6">
                {/* Photo Résidence (comme photo de profil) */}
                <div className="relative flex-shrink-0">
                  <div className="w-24 h-24 superellipse-2xl bg-white/20 backdrop-blur-sm border-2 border-white/30 overflow-hidden shadow-lg">
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-white/10 to-white/5">
                      <Home className="w-12 h-12 text-white" />
                    </div>
                  </div>
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center shadow-lg"
                    style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}>
                    <span className="text-white text-xs font-bold">✓</span>
                  </div>
                </div>

                {/* Infos Résidence */}
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-white mb-2">Résidence Bruxelles Centre</h2>
                  <div className="flex items-center gap-4 text-white/90 text-sm mb-3">
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

                  {/* Tags */}
                  <div className="flex gap-2">
                    <Badge className="bg-white/20 text-white text-xs backdrop-blur-sm border border-white/30">
                      Actif
                    </Badge>
                    <Badge className="bg-white/20 text-white text-xs backdrop-blur-sm border border-white/30">
                      Vérifié
                    </Badge>
                  </div>
                </div>

                {/* CTA Principal - Inviter des colocataires */}
                <button className="px-6 py-3 bg-white text-orange-600 superellipse-xl font-semibold shadow-lg hover:scale-105 transition-transform flex items-center gap-2"
                  style={{ color: '#ee5736' }}>
                  <UserPlus className="w-5 h-5" />
                  Inviter des Colocs
                </button>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-4 gap-3">
                <div className="bg-white/10 backdrop-blur-sm superellipse-xl p-4 text-center border border-white/20">
                  <p className="text-3xl font-bold text-white">€1,250</p>
                  <p className="text-xs text-white/70 mt-1">Loyer Total/mois</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm superellipse-xl p-4 text-center border border-white/20">
                  <p className="text-3xl font-bold text-white">4.8★</p>
                  <p className="text-xs text-white/70 mt-1">Note Résidence</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm superellipse-xl p-4 text-center border border-white/20">
                  <p className="text-3xl font-bold text-white">3</p>
                  <p className="text-xs text-white/70 mt-1">Tâches en cours</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm superellipse-xl p-4 text-center border border-white/20">
                  <p className="text-3xl font-bold text-white">€245</p>
                  <p className="text-xs text-white/70 mt-1">Dépenses ce mois</p>
                </div>
              </div>
            </div>
          </div>

          {/* Bonheur de la Résidence - GROS POURCENTAGE */}
          <div className="relative overflow-hidden superellipse-3xl p-8 bg-gradient-to-br from-slate-800 to-slate-900 border-2 border-slate-700 shadow-2xl">
            <div className="absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl opacity-20"
              style={{ background: 'linear-gradient(135deg, #d9574f, #ff8017)' }} />

            <div className="relative z-10">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="w-6 h-6 text-orange-400" />
                    <h3 className="text-xl font-bold text-white">Bonheur de la Résidence</h3>
                  </div>
                  <p className="text-sm text-slate-400">Basé sur l'activité, les paiements et la satisfaction</p>
                </div>
                <Badge className="text-white text-xs font-bold px-3 py-1.5"
                  style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}>
                  +12% ce mois
                </Badge>
              </div>

              {/* GRAND POURCENTAGE */}
              <div className="flex items-center gap-8">
                <div className="relative">
                  {/* Cercle de progression */}
                  <svg className="w-48 h-48 transform -rotate-90">
                    <circle
                      cx="96"
                      cy="96"
                      r="88"
                      stroke="#1e293b"
                      strokeWidth="12"
                      fill="none"
                    />
                    <circle
                      cx="96"
                      cy="96"
                      r="88"
                      stroke="url(#gradient)"
                      strokeWidth="12"
                      fill="none"
                      strokeDasharray="552.92"
                      strokeDashoffset={552.92 * (1 - 0.87)}
                      strokeLinecap="round"
                      className="transition-all duration-1000"
                    />
                    <defs>
                      <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#d9574f" />
                        <stop offset="50%" stopColor="#ff5b21" />
                        <stop offset="100%" stopColor="#ff8017" />
                      </linearGradient>
                    </defs>
                  </svg>

                  {/* Pourcentage au centre */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <p className="text-6xl font-bold text-white mb-1">87%</p>
                      <p className="text-sm text-slate-400">Excellent</p>
                    </div>
                  </div>
                </div>

                {/* Détails des métriques */}
                <div className="flex-1 grid grid-cols-2 gap-4">
                  <div className="p-4 superellipse-xl bg-slate-800/50 border border-slate-700">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                        style={{ background: 'linear-gradient(135deg, #d9574f, #ff5b21)' }}>
                        <Users className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-sm font-medium text-slate-300">Participation</span>
                    </div>
                    <p className="text-2xl font-bold text-white">92%</p>
                    <p className="text-xs text-slate-400 mt-1">4/4 membres actifs</p>
                  </div>

                  <div className="p-4 superellipse-xl bg-slate-800/50 border border-slate-700">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                        style={{ background: 'linear-gradient(135deg, #ff5b21, #ff8017)' }}>
                        <DollarSign className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-sm font-medium text-slate-300">Paiements</span>
                    </div>
                    <p className="text-2xl font-bold text-white">100%</p>
                    <p className="text-xs text-slate-400 mt-1">À jour ce mois</p>
                  </div>

                  <div className="p-4 superellipse-xl bg-slate-800/50 border border-slate-700">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                        style={{ background: 'linear-gradient(135deg, #d9574f, #ff5b21)' }}>
                        <CheckSquare className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-sm font-medium text-slate-300">Tâches</span>
                    </div>
                    <p className="text-2xl font-bold text-white">78%</p>
                    <p className="text-xs text-slate-400 mt-1">21/27 complétées</p>
                  </div>

                  <div className="p-4 superellipse-xl bg-slate-800/50 border border-slate-700">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                        style={{ background: 'linear-gradient(135deg, #ff5b21, #ff8017)' }}>
                        <MessageCircle className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-sm font-medium text-slate-300">Communication</span>
                    </div>
                    <p className="text-2xl font-bold text-white">85%</p>
                    <p className="text-xs text-slate-400 mt-1">Très actif</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Complétion des Détails Résidence */}
          <div className="p-6 superellipse-2xl bg-gradient-to-br from-slate-800 to-slate-900 border-2 border-slate-700 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 superellipse-xl flex items-center justify-center"
                  style={{ background: 'linear-gradient(135deg, #d9574f, #ff8017)' }}>
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-white">Complétez votre résidence</h4>
                  <p className="text-xs text-slate-400">6 étapes restantes pour 100%</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-white">72%</p>
                <p className="text-xs text-slate-400">Complété</p>
              </div>
            </div>

            {/* Barre de progression */}
            <div className="h-3 w-full overflow-hidden rounded-full bg-slate-700/50 mb-6">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: '72%',
                  background: 'linear-gradient(90deg, #d9574f 0%, #ff5b21 50%, #ff8017 100%)'
                }}
              />
            </div>

            {/* Checklist des étapes */}
            <div className="space-y-3">
              {[
                { label: 'Ajouter une photo de la résidence', done: true },
                { label: 'Inviter tous les colocataires (4/6)', done: false },
                { label: 'Configurer le calendrier de ménage', done: true },
                { label: 'Définir les règles de la maison', done: true },
                { label: 'Ajouter les équipements communs', done: false },
                { label: 'Créer le budget mensuel', done: false }
              ].map((step, index) => (
                <div
                  key={index}
                  className={`flex items-center gap-3 p-3 superellipse-xl transition-all ${
                    step.done ? 'bg-slate-800/50' : 'bg-slate-700/30 border-2 border-dashed border-slate-600'
                  }`}
                >
                  <div className={`w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    step.done ? 'bg-green-500' : 'bg-slate-600'
                  }`}>
                    {step.done ? (
                      <span className="text-white text-sm font-bold">✓</span>
                    ) : (
                      <span className="text-slate-400 text-sm">{index + 1}</span>
                    )}
                  </div>
                  <span className={`text-sm font-medium flex-1 ${
                    step.done ? 'text-slate-400 line-through' : 'text-white'
                  }`}>
                    {step.label}
                  </span>
                  {!step.done && (
                    <button className="px-3 py-1.5 rounded-lg text-xs font-semibold text-white hover:scale-105 transition-transform"
                      style={{ background: 'linear-gradient(135deg, #d9574f, #ff8017)' }}>
                      Compléter
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: UserPlus, label: 'Inviter', color: '#d9574f', description: 'Nouveau coloc' },
              { icon: Plus, label: 'Dépense', color: '#ee5736', description: 'Partager frais' },
              { icon: CheckSquare, label: 'Tâche', color: '#ff5b21', description: 'Ajouter tâche' },
              { icon: Calendar, label: 'Événement', color: '#ff8017', description: 'Planifier' }
            ].map((action) => {
              const Icon = action.icon;
              return (
                <button
                  key={action.label}
                  className="p-4 superellipse-xl bg-slate-800 border-2 border-slate-700 hover:border-slate-600 transition-all group text-left"
                >
                  <div className="w-12 h-12 superellipse-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform"
                    style={{ background: action.color }}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <p className="text-sm font-semibold text-white mb-1">{action.label}</p>
                  <p className="text-xs text-slate-400">{action.description}</p>
                </button>
              );
            })}
          </div>

          {/* Recommendations */}
          <div className="p-4 bg-gradient-to-r from-orange-500/10 to-orange-600/10 superellipse-xl border border-orange-500/30">
            <h4 className="text-sm font-bold text-orange-300 mb-3">Design Principles Appliques</h4>
            <div className="space-y-2 text-xs text-slate-300">
              <p><strong className="text-white">Hierarchie Visuelle:</strong> Photo residence en haut a gauche (principe F-pattern), CTA principal en haut a droite</p>
              <p><strong className="text-white">Data Visualization:</strong> Grand pourcentage circulaire pour le bonheur (inspire des fitness apps)</p>
              <p><strong className="text-white">Gamification:</strong> Progression de completion avec checklist (inspire d'Airbnb host onboarding)</p>
              <p><strong className="text-white">Call-to-Actions:</strong> Boutons d'action rapide avec icons colores differencies (inspire de Notion)</p>
              <p><strong className="text-white">Visual Consistency:</strong> Gradient signature utilise strategiquement pour attirer l'attention</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

/* ============================================
   OPPOSITIONS SECTION
   ============================================ */
function OppositionsSection() {
  const oppositions = [
    {
      category: 'Cohérence des couleurs',
      issues: [
        {
          title: 'Bouton "membres" - Couleur de texte incohérente',
          description: 'Le bouton affiche "#c23f21" (rouge-brun) au lieu de "#ee5736" (orange principal)',
          severity: 'minor',
          location: 'ModernResidentHeader.tsx:302',
          fix: 'Utiliser color: "#ee5736" ou color: "white" sur fond rempli'
        }
      ]
    },
    {
      category: 'Uniformité des états',
      issues: [
        {
          title: 'Bouton "Actions Rapides" - Transition manquante',
          description: 'Avant correction: le texte restait gris au hover. Maintenant corrigé avec texte blanc.',
          severity: 'fixed',
          location: 'ModernResidentHeader.tsx:309-338',
          fix: '[OK] Corrige - Texte blanc sur fond orange au hover/actif'
        }
      ]
    },
    {
      category: 'Taille et proportions',
      issues: [
        {
          title: 'Logo IzzIco trop grand',
          description: 'Le logo à 110x34px dominait trop le header',
          severity: 'fixed',
          location: 'Tous les headers',
          fix: '[OK] Reduit a 90x28px (-18%) pour meilleur equilibre'
        }
      ]
    },
    {
      category: 'Accessibilité',
      issues: [
        {
          title: 'Contraste texte sur fond subtil',
          description: 'Certains textes oranges (#ee5736) sur fond orange léger (#ee573610) peuvent manquer de contraste',
          severity: 'warning',
          location: 'Divers boutons et badges',
          fix: 'Envisager un texte blanc ou plus foncé pour améliorer le contraste'
        }
      ]
    },
    {
      category: 'Design System',
      issues: [
        {
          title: 'Valeurs de couleur hardcodées',
          description: 'Utilisation de valeurs hexadécimales au lieu de variables CSS',
          severity: 'improvement',
          location: 'Tous les composants',
          fix: 'Migrer vers var(--resident-500) et autres variables CSS'
        },
        {
          title: 'Manque de documentation',
          description: 'Pas de guide clair sur quand utiliser #ee5736 vs le dégradé vs les opacités',
          severity: 'improvement',
          location: 'Documentation',
          fix: 'Cette page ! Établir des règles claires d\'utilisation'
        }
      ]
    }
  ];

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'critical':
        return <Badge className="bg-red-500 text-white">Critique</Badge>;
      case 'major':
        return <Badge className="bg-orange-500 text-white">Majeur</Badge>;
      case 'minor':
        return <Badge className="bg-yellow-500 text-white">Mineur</Badge>;
      case 'warning':
        return <Badge className="bg-amber-500 text-white">Avertissement</Badge>;
      case 'improvement':
        return <Badge className="bg-blue-500 text-white">Amélioration</Badge>;
      case 'fixed':
        return <Badge className="bg-green-500 text-white">✓ Corrigé</Badge>;
      default:
        return <Badge className="bg-gray-500 text-white">Info</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Summary */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Résumé des Oppositions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-400">2</div>
              <div className="text-xs text-slate-400 mt-1">Corrigés</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-400">1</div>
              <div className="text-xs text-slate-400 mt-1">Mineurs</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-amber-400">1</div>
              <div className="text-xs text-slate-400 mt-1">Avertissements</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-400">2</div>
              <div className="text-xs text-slate-400 mt-1">Améliorations</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Issues */}
      {oppositions.map((category, idx) => (
        <Card key={idx} className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">{category.category}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {category.issues.map((issue, issueIdx) => (
              <div
                key={issueIdx}
                className="p-4 rounded-lg bg-slate-900 border border-slate-700 space-y-3"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      {getSeverityBadge(issue.severity)}
                      <h3 className="text-white font-semibold">{issue.title}</h3>
                    </div>
                    <p className="text-sm text-slate-300 mb-2">{issue.description}</p>
                    {issue.location && (
                      <p className="text-xs text-slate-500 font-mono mb-2">📍 {issue.location}</p>
                    )}
                  </div>
                </div>
                <div className="p-3 bg-slate-800 rounded-lg border border-slate-600">
                  <div className="flex items-start gap-2">
                    <Info className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-slate-300">{issue.fix}</div>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      ))}

      {/* Recommendations */}
      <Card className="bg-gradient-to-br from-blue-900/20 to-purple-900/20 border-blue-700/30">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-blue-400" />
            Recommandations
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0">
              <span className="text-blue-400 text-xs font-bold">1</span>
            </div>
            <div className="flex-1">
              <p className="text-white font-medium">Unifier les couleurs de texte sur fond orange</p>
              <p className="text-sm text-slate-300 mt-1">
                Toujours utiliser #ee5736 ou white, jamais de variations comme #c23f21
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0">
              <span className="text-blue-400 text-xs font-bold">2</span>
            </div>
            <div className="flex-1">
              <p className="text-white font-medium">Migrer vers variables CSS</p>
              <p className="text-sm text-slate-300 mt-1">
                Remplacer les valeurs hardcodées par var(--resident-500) pour faciliter la maintenance
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0">
              <span className="text-blue-400 text-xs font-bold">3</span>
            </div>
            <div className="flex-1">
              <p className="text-white font-medium">Tests de contraste WCAG</p>
              <p className="text-sm text-slate-300 mt-1">
                Vérifier que tous les textes respectent les normes d'accessibilité AA (ratio 4.5:1)
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
