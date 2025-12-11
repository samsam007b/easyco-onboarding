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
          className="w-12 h-12 rounded-2xl flex items-center justify-center"
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
      <div className="bg-slate-800 rounded-xl p-2 border border-slate-700">
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
          <div className="relative h-24 rounded-2xl overflow-hidden border-2 border-white shadow-2xl">
            <div
              className="absolute inset-0"
              style={{ background: 'linear-gradient(135deg, #D97B6F 0%, #E8865D 50%, #FF8C4B 100%)' }}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <p className="text-white font-bold text-lg drop-shadow-lg">
                linear-gradient(135deg, #D97B6F 0%, #E8865D 50%, #FF8C4B 100%)
              </p>
            </div>
          </div>

          {/* Les 3 couleurs du gradient */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-3">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-3 h-3 rounded-full bg-white" />
                <label className="text-sm font-semibold text-slate-300">Couleur 1 - Terracotta</label>
              </div>
              <div className="flex items-center gap-3">
                <div
                  className="w-20 h-20 rounded-xl border-2 border-white shadow-lg"
                  style={{ background: '#D97B6F' }}
                />
                <div>
                  <p className="text-white font-mono font-bold text-lg">#D97B6F</p>
                  <p className="text-xs text-slate-400">0% - Start</p>
                  <p className="text-xs text-orange-300 mt-1">Terracotta rosé</p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-3 h-3 rounded-full bg-white" />
                <label className="text-sm font-semibold text-slate-300">Couleur 2 - Corail</label>
              </div>
              <div className="flex items-center gap-3">
                <div
                  className="w-20 h-20 rounded-xl border-2 border-white shadow-lg"
                  style={{ background: '#E8865D' }}
                />
                <div>
                  <p className="text-white font-mono font-bold text-lg">#E8865D</p>
                  <p className="text-xs text-slate-400">50% - Middle</p>
                  <p className="text-xs text-orange-300 mt-1">Corail doux</p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-3 h-3 rounded-full bg-white" />
                <label className="text-sm font-semibold text-slate-300">Couleur 3 - Orange</label>
              </div>
              <div className="flex items-center gap-3">
                <div
                  className="w-20 h-20 rounded-xl border-2 border-white shadow-lg"
                  style={{ background: '#FF8C4B' }}
                />
                <div>
                  <p className="text-white font-mono font-bold text-lg">#FF8C4B</p>
                  <p className="text-xs text-slate-400">100% - End</p>
                  <p className="text-xs text-orange-300 mt-1">Orange vif</p>
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

            {/* 5 Color Swatches in Grid */}
            <div className="grid grid-cols-5 gap-3">
              <div className="space-y-2">
                <div className="w-full h-24 rounded-lg border-2 border-white shadow-lg" style={{ background: '#D97B6F' }} />
                <p className="text-white font-mono text-xs font-bold text-center">#D97B6F</p>
                <p className="text-xs text-slate-400 text-center">0%</p>
              </div>

              <div className="space-y-2">
                <div className="w-full h-24 rounded-lg border-2 border-white shadow-lg" style={{ background: '#DF8267' }} />
                <p className="text-white font-mono text-xs font-bold text-center">#DF8267</p>
                <p className="text-xs text-slate-400 text-center">25%</p>
              </div>

              <div className="space-y-2">
                <div className="w-full h-24 rounded-lg border-2 border-white shadow-lg" style={{ background: '#E8865D' }} />
                <p className="text-white font-mono text-xs font-bold text-center">#E8865D</p>
                <p className="text-xs text-slate-400 text-center">50%</p>
              </div>

              <div className="space-y-2">
                <div className="w-full h-24 rounded-lg border-2 border-white shadow-lg" style={{ background: '#F38954' }} />
                <p className="text-white font-mono text-xs font-bold text-center">#F38954</p>
                <p className="text-xs text-slate-400 text-center">75%</p>
              </div>

              <div className="space-y-2">
                <div className="w-full h-24 rounded-lg border-2 border-white shadow-lg" style={{ background: '#FF8C4B' }} />
                <p className="text-white font-mono text-xs font-bold text-center">#FF8C4B</p>
                <p className="text-xs text-slate-400 text-center">100%</p>
              </div>
            </div>

            <div className="mt-4 p-3 bg-slate-900/80 rounded-lg border border-orange-500/30">
              <p className="text-sm text-orange-300 font-medium mb-1">💡 Usage recommandé</p>
              <p className="text-xs text-slate-400">
                Utilisez ces 5 couleurs pour créer des variations subtiles. Le gradient complet (3 couleurs) est réservé aux grandes surfaces.
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
                  className="w-full h-24 rounded-xl border-2 border-white shadow-lg flex items-center justify-center"
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
                  className="w-full h-24 rounded-xl border-2 border-white shadow-lg"
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
                  className="w-full h-24 rounded-xl border-2 border-slate-600 shadow-lg"
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
                  className="w-full h-24 rounded-xl border-2 shadow-lg bg-slate-900"
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
                className="w-16 h-16 rounded-xl border-2 border-white shadow-lg"
                style={{ background: '#c23f21' }}
              />
              <div className="flex-1">
                <p className="text-white font-mono font-bold">#c23f21</p>
                <p className="text-xs text-slate-400">Variante plus foncée (non recommandée)</p>
                <p className="text-xs text-yellow-400 mt-1">⚠️ Incohérence détectée : utilisé sur bouton "membres" - préférer #ee5736</p>
              </div>
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
                  className="flex items-center justify-between p-3 rounded-xl transition-all"
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
      {/* Header Components */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Header - ModernResidentHeader</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Logo */}
          <div>
            <h3 className="text-sm font-semibold text-slate-400 mb-3">Logo IzzIco</h3>
            <div className="p-4 bg-slate-900 rounded-lg border border-slate-700">
              <code className="text-xs text-slate-300">
                width: 90px, height: 28px
              </code>
            </div>
          </div>

          {/* Navigation Items */}
          <div>
            <h3 className="text-sm font-semibold text-slate-400 mb-3">Items de Navigation</h3>
            <div className="space-y-2">
              <div className="p-3 rounded-xl" style={{ background: '#ee573610', borderColor: '#ee573630', border: '1px solid' }}>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4" style={{ color: '#ee5736' }} />
                  <span style={{ color: '#ee5736' }} className="text-sm font-medium">État actif avec triangle pointer</span>
                </div>
              </div>
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-700">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-gray-600" />
                  <span className="text-sm font-medium text-gray-600">État inactif (hover: fond orange subtil)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div>
            <h3 className="text-sm font-semibold text-slate-400 mb-3">Boutons</h3>
            <div className="space-y-3">
              {/* Actions Rapides Button */}
              <div className="space-y-2">
                <label className="text-xs text-slate-500">Bouton "Actions Rapides"</label>
                <div className="flex gap-3">
                  <button
                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all border"
                    style={{
                      background: '#ee573610',
                      borderColor: '#ee573630',
                      color: '#ee5736'
                    }}
                  >
                    <Zap className="w-4 h-4" style={{ color: '#ee5736' }} />
                    <span>État Normal</span>
                    <ChevronDown className="w-4 h-4" />
                  </button>
                  <button
                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all border"
                    style={{
                      background: 'linear-gradient(to bottom right, #ee5736, #ee573680)',
                      borderColor: '#ee5736',
                      color: 'white'
                    }}
                  >
                    <Zap className="w-4 h-4 text-white" />
                    <span>État Hover/Actif</span>
                    <ChevronDown className="w-4 h-4 text-white rotate-180" />
                  </button>
                </div>
              </div>

              {/* Members Button */}
              <div className="space-y-2">
                <label className="text-xs text-slate-500">Bouton "Membres"</label>
                <button
                  className="flex items-center gap-2 px-3 py-2 rounded-xl border transition-all"
                  style={{
                    background: '#ee573610',
                    borderColor: '#ee573630'
                  }}
                >
                  <Users className="w-4 h-4" style={{ color: '#ee5736' }} />
                  <span className="text-sm font-medium" style={{ color: '#c23f21' }}>4 membres</span>
                </button>
              </div>
            </div>
          </div>

          {/* Profile Avatar */}
          <div>
            <h3 className="text-sm font-semibold text-slate-400 mb-3">Avatar Profil</h3>
            <div className="flex items-center gap-3">
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center border-2 border-gray-200 shadow-sm"
                style={{ background: 'linear-gradient(to bottom right, #ee5736, #ee573680)' }}
              >
                <Key className="w-4 h-4 text-white" />
              </div>
              <div className="text-sm text-slate-300">
                Icône Key avec dégradé orange
              </div>
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
          <div className="p-6 rounded-2xl" style={{ background: 'linear-gradient(to right, #D97B6F, #E8865D, #FF8C4B)' }}>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center">
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
            <div className="relative overflow-hidden rounded-3xl p-6 bg-white shadow-lg">
              <div className="absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-20" style={{ background: 'linear-gradient(to bottom right, #ee573620, #ee573610)' }} />
              <div className="relative z-10">
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4 shadow-sm border border-gray-200"
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
            <div className="relative overflow-hidden rounded-3xl p-6 bg-white shadow-lg">
              <div className="absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-20" style={{ background: 'linear-gradient(to bottom right, #ee573620, #ee573610)' }} />
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
        </CardContent>
      </Card>

      {/* Quick Actions Dropdown */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Quick Actions Dropdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="w-72 bg-white/95 backdrop-blur-2xl rounded-2xl shadow-2xl border border-white/20 py-2">
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
                    className="flex items-start gap-3 px-3 py-3 rounded-xl hover:bg-orange-50 transition group cursor-pointer"
                  >
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform border border-gray-200"
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
          fix: '✅ Corrigé - Texte blanc sur fond orange au hover/actif'
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
          fix: '✅ Réduit à 90x28px (-18%) pour meilleur équilibre'
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
