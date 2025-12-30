'use client';

import { useState } from 'react';
import { History, Calendar, Palette, Layout, Users, CheckSquare, Heart, Clock, ArrowLeft, Eye, Tag, Layers } from 'lucide-react';
import Link from 'next/link';

type DesignVersion = {
  id: string;
  name: string;
  codename: string;
  date: string;
  status: 'active' | 'archived' | 'deprecated';
  role: 'resident' | 'owner' | 'global';
  description: string;
  keyFeatures: string[];
  colorPalette: { name: string; hex: string; usage: string }[];
  pages: {
    name: string;
    description: string;
    characteristics: string[];
  }[];
  screenshots: {
    name: string;
    description: string;
  }[];
};

const designVersions: DesignVersion[] = [
  {
    id: 'v1-coral-gradient-resident',
    name: 'Version Dégradé Corail',
    codename: 'Coral Gradient Resident',
    date: 'Décembre 2024',
    status: 'active',
    role: 'resident',
    description: 'Design principal pour l\'interface résident avec des dégradés corail/orange chaleureux. Ce design utilise des cartes arrondies avec des dégradés subtils et une hiérarchie visuelle claire.',
    keyFeatures: [
      'Header avec dégradé corail (#d9574f → #ff5b21 → #ff8017)',
      'Cartes statistiques avec icônes colorées et ombres douces',
      'Navigation bottom bar avec indicateur actif',
      'Cartes membres avec avatars et badges de rôle',
      'Interface de matching style Tinder avec swipe',
      'Calendrier avec indicateurs de tâches',
    ],
    colorPalette: [
      { name: 'Corail Primary', hex: '#d9574f', usage: 'Début du gradient header' },
      { name: 'Orange Accent', hex: '#ff5b21', usage: 'Milieu du gradient' },
      { name: 'Orange Warm', hex: '#ff8017', usage: 'Fin du gradient' },
      { name: 'Green Success', hex: '#22C55E', usage: 'Solde positif, succès' },
      { name: 'Purple Owner', hex: '#9333EA', usage: 'Badge propriétaire' },
      { name: 'Background Light', hex: '#FFF5F2', usage: 'Fond des pages' },
    ],
    pages: [
      {
        name: 'Hub Dashboard',
        description: 'Page principale avec résumé des informations',
        characteristics: [
          'Header arrondi avec gradient corail et nom de résidence',
          'Grille 2x2 de cartes statistiques (Loyer, Dépenses, Solde, Colocataires)',
          'Section "Prochaines tâches" avec liste de tâches à venir',
          'Bottom navigation avec 5 onglets',
        ],
      },
      {
        name: 'Liste des Membres',
        description: 'Affichage des colocataires avec leurs informations',
        characteristics: [
          'Cartes membres avec avatar circulaire',
          'Gradient subtil sur les cartes (orange → rose)',
          'Badge de rôle (Propriétaire, Résident)',
          'Informations de contact (email, téléphone)',
          'Bouton d\'action contextuel',
        ],
      },
      {
        name: 'Matching/Swipe',
        description: 'Interface de découverte de colocataires potentiels',
        characteristics: [
          'Carte centrale avec photo de profil',
          'Boutons d\'action style Tinder (X, coeur, étoile)',
          'Animation de swipe gauche/droite',
          'Informations utilisateur superposées sur l\'image',
        ],
      },
      {
        name: 'Gestion des Tâches',
        description: 'Liste et détail des tâches ménagères',
        characteristics: [
          'Tabs pour filtrer (Toutes, À faire, Terminées)',
          'Cartes de tâches avec checkbox',
          'Avatar de l\'assigné',
          'Date limite avec indicateur visuel',
          'Labels colorés par catégorie',
        ],
      },
      {
        name: 'Calendrier',
        description: 'Vue calendrier des événements et tâches',
        characteristics: [
          'Vue mensuelle avec navigation',
          'Points indicateurs sur les jours avec événements',
          'Liste des événements du jour sélectionné',
          'Couleurs par type d\'événement',
        ],
      },
    ],
    screenshots: [
      { name: 'hub-dashboard', description: 'Dashboard principal avec statistiques' },
      { name: 'hub-tasks', description: 'Section des prochaines tâches' },
      { name: 'members-list', description: 'Liste des colocataires' },
      { name: 'member-card', description: 'Carte membre détaillée' },
      { name: 'matching-swipe', description: 'Interface de matching' },
      { name: 'tasks-management', description: 'Gestion des tâches' },
      { name: 'calendar-view', description: 'Vue calendrier' },
    ],
  },
];

export default function DesignHistoryPage() {
  const [selectedVersion, setSelectedVersion] = useState<string>(designVersions[0].id);
  const [activeTab, setActiveTab] = useState<'overview' | 'colors' | 'pages' | 'screenshots'>('overview');

  const currentVersion = designVersions.find(v => v.id === selectedVersion) || designVersions[0];

  const getStatusBadge = (status: DesignVersion['status']) => {
    switch (status) {
      case 'active':
        return <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-full">Actif</span>;
      case 'archived':
        return <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 text-xs rounded-full">Archivé</span>;
      case 'deprecated':
        return <span className="px-2 py-1 bg-red-500/20 text-red-400 text-xs rounded-full">Obsolète</span>;
    }
  };

  const getRoleBadge = (role: DesignVersion['role']) => {
    switch (role) {
      case 'resident':
        return <span className="px-2 py-1 bg-orange-500/20 text-orange-400 text-xs rounded-full">Résident</span>;
      case 'owner':
        return <span className="px-2 py-1 bg-purple-500/20 text-purple-400 text-xs rounded-full">Propriétaire</span>;
      case 'global':
        return <span className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded-full">Global</span>;
    }
  };

  const tabs = [
    { id: 'overview', label: 'Vue d\'ensemble', icon: Eye },
    { id: 'colors', label: 'Palette', icon: Palette },
    { id: 'pages', label: 'Pages', icon: Layout },
    { id: 'screenshots', label: 'Screenshots', icon: Layers },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white p-8">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex items-center gap-4 mb-2">
          <Link href="/admin/dashboard/design-system" className="text-slate-400 hover:text-white transition-colors">
            <ArrowLeft className="w-5 h-5 inline mr-2" />
            Retour Design System
          </Link>
        </div>
        <div className="bg-gradient-to-r from-amber-900/50 via-orange-900/50 to-red-900/50 rounded-xl border border-amber-700/50 p-6">
          <div className="flex items-center gap-3 mb-2">
            <History className="w-8 h-8 text-amber-400" />
            <h1 className="text-3xl font-bold">Historique des Designs</h1>
          </div>
          <p className="text-slate-300">
            Archive de toutes les versions de design qui ont existé dans l'application.
            Permet de préserver et comparer les différentes directions visuelles.
          </p>
        </div>
      </div>

      {/* Version Selector */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="bg-slate-800 rounded-xl border border-slate-700 p-4">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Tag className="w-5 h-5 text-slate-400" />
            Versions disponibles
          </h2>
          <div className="flex flex-wrap gap-3">
            {designVersions.map((version) => (
              <button
                key={version.id}
                onClick={() => setSelectedVersion(version.id)}
                className={`px-4 py-3 rounded-lg transition-all flex flex-col items-start ${
                  selectedVersion === version.id
                    ? 'bg-gradient-to-r from-orange-600 to-amber-600 text-white'
                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                }`}
              >
                <span className="font-medium">{version.name}</span>
                <span className="text-xs opacity-75">{version.codename}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Version Details Header */}
      <div className="max-w-7xl mx-auto mb-6">
        <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-2xl font-bold">{currentVersion.name}</h2>
                {getStatusBadge(currentVersion.status)}
                {getRoleBadge(currentVersion.role)}
              </div>
              <p className="text-slate-400 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                {currentVersion.date}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-slate-400">Codename</p>
              <p className="font-mono text-amber-400">{currentVersion.codename}</p>
            </div>
          </div>
          <p className="mt-4 text-slate-300">{currentVersion.description}</p>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="max-w-7xl mx-auto mb-6">
        <div className="flex gap-2 overflow-x-auto pb-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all flex items-center gap-2 ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-orange-600 to-amber-600 text-white'
                    : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content */}
      <div className="max-w-7xl mx-auto">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <CheckSquare className="w-5 h-5 text-green-400" />
                Caractéristiques clés
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentVersion.keyFeatures.map((feature, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-slate-900 rounded-lg">
                    <div className="w-6 h-6 rounded-full bg-orange-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-orange-400 text-xs font-bold">{index + 1}</span>
                    </div>
                    <p className="text-slate-300">{feature}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Color Preview */}
            <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Palette className="w-5 h-5 text-pink-400" />
                Aperçu des couleurs principales
              </h3>
              <div className="flex gap-2 flex-wrap">
                {currentVersion.colorPalette.slice(0, 4).map((color, index) => (
                  <div key={index} className="flex items-center gap-2 p-2 bg-slate-900 rounded-lg">
                    <div
                      className="w-8 h-8 rounded-lg border border-slate-600"
                      style={{ backgroundColor: color.hex }}
                    />
                    <div>
                      <p className="text-sm font-medium text-slate-300">{color.name}</p>
                      <p className="text-xs text-slate-500 font-mono">{color.hex}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Gradient Preview */}
            <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
              <h3 className="text-xl font-bold mb-4">Gradient Header Signature</h3>
              <div
                className="h-24 rounded-xl"
                style={{ background: 'linear-gradient(135deg, #d9574f 0%, #ff5b21 50%, #ff8017 100%)' }}
              />
              <p className="mt-3 text-sm text-slate-400 font-mono">
                linear-gradient(135deg, #d9574f 0%, #ff5b21 50%, #ff8017 100%)
              </p>
            </div>
          </div>
        )}

        {/* Colors Tab */}
        {activeTab === 'colors' && (
          <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Palette className="w-5 h-5 text-pink-400" />
              Palette de couleurs complète
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {currentVersion.colorPalette.map((color, index) => (
                <div key={index} className="bg-slate-900 rounded-lg p-4">
                  <div
                    className="h-20 rounded-lg mb-3 border border-slate-600"
                    style={{ backgroundColor: color.hex }}
                  />
                  <h4 className="font-semibold text-white mb-1">{color.name}</h4>
                  <p className="text-sm font-mono text-amber-400 mb-2">{color.hex}</p>
                  <p className="text-sm text-slate-400">{color.usage}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Pages Tab */}
        {activeTab === 'pages' && (
          <div className="space-y-4">
            {currentVersion.pages.map((page, index) => (
              <div key={index} className="bg-slate-800 rounded-xl border border-slate-700 p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500/20 to-amber-500/20 flex items-center justify-center flex-shrink-0">
                    <Layout className="w-6 h-6 text-orange-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-white mb-1">{page.name}</h3>
                    <p className="text-slate-400 mb-4">{page.description}</p>
                    <div className="bg-slate-900 rounded-lg p-4">
                      <h4 className="text-sm font-semibold text-slate-300 mb-3">Caractéristiques visuelles</h4>
                      <ul className="space-y-2">
                        {page.characteristics.map((char, charIndex) => (
                          <li key={charIndex} className="flex items-start gap-2 text-sm text-slate-400">
                            <span className="text-orange-400 mt-1">•</span>
                            {char}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Screenshots Tab */}
        {activeTab === 'screenshots' && (
          <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Layers className="w-5 h-5 text-blue-400" />
              Screenshots de référence
            </h3>
            <p className="text-slate-400 mb-6">
              Les screenshots de cette version sont stockés pour référence future.
              Ils documentent l'état exact du design à cette période.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {currentVersion.screenshots.map((screenshot, index) => (
                <div key={index} className="bg-slate-900 rounded-lg overflow-hidden border border-slate-700">
                  {/* Placeholder for screenshot - in production these would be actual images */}
                  <div className="aspect-[9/16] bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center">
                    <div className="text-center p-4">
                      <Layers className="w-12 h-12 text-slate-600 mx-auto mb-2" />
                      <p className="text-slate-500 text-sm">{screenshot.name}</p>
                    </div>
                  </div>
                  <div className="p-3">
                    <p className="text-sm font-medium text-slate-300">{screenshot.description}</p>
                    <p className="text-xs text-slate-500 font-mono mt-1">{screenshot.name}.png</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 bg-amber-500/10 border border-amber-500/30 rounded-lg p-4">
              <p className="text-amber-300 text-sm">
                <strong>Note:</strong> Pour ajouter les screenshots réels, placez-les dans
                <code className="mx-1 px-2 py-0.5 bg-slate-800 rounded text-amber-400">
                  /public/design-history/v1-coral-gradient-resident/
                </code>
                avec les noms correspondants.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Footer with instructions */}
      <div className="max-w-7xl mx-auto mt-8">
        <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 p-6">
          <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <Clock className="w-5 h-5 text-slate-400" />
            Comment ajouter une nouvelle version
          </h3>
          <ol className="list-decimal list-inside space-y-2 text-slate-400 text-sm">
            <li>Prendre des screenshots de toutes les pages principales</li>
            <li>Ajouter un nouvel objet dans le tableau <code className="text-amber-400">designVersions</code></li>
            <li>Documenter les couleurs, pages et caractéristiques</li>
            <li>Stocker les screenshots dans <code className="text-amber-400">/public/design-history/[version-id]/</code></li>
            <li>Marquer l'ancienne version comme "archived" si elle est remplacée</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
