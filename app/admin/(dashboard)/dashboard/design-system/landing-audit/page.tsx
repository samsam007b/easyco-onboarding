'use client';

import { useState } from 'react';
import { AlertCircle, CheckCircle, Building2, Home, Search, Sparkles, ArrowRight } from 'lucide-react';
import Link from 'next/link';

type Section = 'overview' | 'buttons' | 'colors' | 'gradients' | 'issues';

export default function LandingPageAudit() {
  const [activeSection, setActiveSection] = useState<Section>('overview');

  // Couleurs actuelles dans la landing
  const currentColors = {
    owner: { name: 'Owner (Propriétaire)', current: 'rgba(110, 86, 207, 0.6)', hex: '#6E56CF', role: 'owner' },
    resident: { name: 'Resident (Résident)', current: 'rgba(255, 111, 60, 0.6)', hex: '#FF6F3C', role: 'resident' },
    searcher: { name: 'Searcher (Chercheur)', current: 'Non défini', hex: '#FFD249', role: 'searcher' },
  };

  // Couleurs du design system (nouvelle charte - couleurs dominantes exactes)
  const designSystemColors = {
    owner: { hex: '#ad5684', rgb: 'rgb(173, 86, 132)', name: 'Mauve (Owner Primary)' },
    resident: { hex: '#ee5736', rgb: 'rgb(238, 87, 54)', name: 'Orange (Resident Primary)' },
    searcher: { hex: '#ff9811', rgb: 'rgb(255, 152, 17)', name: 'Jaune (Searcher Primary)' },
    signature: { gradient: 'linear-gradient(135deg, #9c5698 0%, #FF5722 50%, #FFB10B 100%)', name: 'Gradient Signature' },
  };

  // Détection des incohérences
  const issues = [
    {
      type: 'warning',
      title: 'Bouton "Je loue mon bien" (Owner)',
      description: `Utilise rgba(110, 86, 207, 0.6) au lieu de la couleur dominante ${designSystemColors.owner.hex}`,
      impact: 'Couleur owner différente de la charte',
      fix: `Changer vers ${designSystemColors.owner.hex} (opaque ou glassmorphism 85%)`,
    },
    {
      type: 'warning',
      title: 'Bouton "Je suis résident" (Resident)',
      description: `Utilise rgba(255, 111, 60, 0.6) au lieu de la couleur dominante ${designSystemColors.resident.hex}`,
      impact: 'Couleur resident différente de la charte',
      fix: `Changer vers ${designSystemColors.resident.hex} (opaque ou glassmorphism 85%)`,
    },
    {
      type: 'error',
      title: 'Bouton Searcher manquant',
      description: 'Pas de bouton "Je cherche un logement" dans le hero',
      impact: 'Rôle searcher non représenté visuellement',
      fix: `Ajouter bouton avec ${designSystemColors.searcher.hex} (opaque ou glassmorphism 85%)`,
    },
    {
      type: 'info',
      title: 'Choix du style : Opaque vs Glassmorphism',
      description: 'Décider entre couleurs opaques (plus vives) ou glassmorphism (plus moderne)',
      impact: 'Cohérence visuelle et lisibilité',
      fix: 'Tester les deux options et choisir celle qui correspond le mieux au design global',
    },
    {
      type: 'info',
      title: 'Bouton "Rechercher" principal',
      description: 'Devrait utiliser le gradient signature des 3 couleurs',
      impact: 'Bouton CTA principal - identité visuelle',
      fix: `Appliquer gradient : ${designSystemColors.signature.gradient}`,
    },
  ];

  const sections = [
    { id: 'overview', label: 'Vue d\'ensemble' },
    { id: 'buttons', label: 'Boutons CTA' },
    { id: 'colors', label: 'Couleurs' },
    { id: 'gradients', label: 'Gradients' },
    { id: 'issues', label: `Issues (${issues.length})` },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white p-8">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex items-center gap-4 mb-2">
          <Link href="/admin/dashboard/design-system" className="text-slate-400 hover:text-white transition-colors">
            ← Retour Design System
          </Link>
        </div>
        <div className="bg-gradient-to-r from-purple-900/50 via-orange-900/50 to-amber-900/50 rounded-xl border border-purple-700/50 p-6">
          <h1 className="text-3xl font-bold mb-2">🔍 Audit Landing Page</h1>
          <p className="text-slate-300">
            Analyse des éléments graphiques et détection des incohérences avec le design system
          </p>
        </div>
      </div>

      {/* Navigation */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex gap-2 overflow-x-auto pb-2">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id as Section)}
              className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all ${
                activeSection === section.id
                  ? 'bg-gradient-to-r from-purple-600 to-orange-600 text-white'
                  : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'
              }`}
            >
              {section.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto">
        {/* Overview */}
        {activeSection === 'overview' && (
          <div className="space-y-6">
            <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
              <h2 className="text-2xl font-bold mb-4">📊 Résumé de l'audit</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                  <div className="text-red-400 text-2xl font-bold mb-1">
                    {issues.filter((i) => i.type === 'error').length}
                  </div>
                  <div className="text-sm text-red-300">Erreurs critiques</div>
                </div>
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                  <div className="text-yellow-400 text-2xl font-bold mb-1">
                    {issues.filter((i) => i.type === 'warning').length}
                  </div>
                  <div className="text-sm text-yellow-300">Avertissements</div>
                </div>
                <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                  <div className="text-blue-400 text-2xl font-bold mb-1">
                    {issues.filter((i) => i.type === 'info').length}
                  </div>
                  <div className="text-sm text-blue-300">Suggestions</div>
                </div>
              </div>
            </div>

            <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
              <h3 className="text-xl font-bold mb-4">🎯 Objectifs de l'uniformisation</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong>Appliquer les couleurs dominantes exactes</strong>
                    <p className="text-sm text-slate-400">
                      Utiliser les couleurs dominantes par rôle : Owner (#ad5684), Resident (#ee5736), Searcher (#ff9811)
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong>Choisir entre couleurs opaques ou glassmorphism</strong>
                    <p className="text-sm text-slate-400">
                      Option A : Couleurs vives opaques pour maximum de visibilité | Option B : Glassmorphism avec 85% opacité pour effet moderne
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong>Cohérence avec l'ensemble de l'application</strong>
                    <p className="text-sm text-slate-400">
                      Les couleurs de la landing page doivent correspondre aux couleurs des dashboards
                    </p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        )}

        {/* Boutons */}
        {activeSection === 'buttons' && (
          <div className="space-y-6">
            <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
              <h2 className="text-2xl font-bold mb-6">🔘 Boutons CTA de la landing page</h2>

              {/* Comparaison rapide */}
              <div className="bg-gradient-to-r from-purple-900/30 via-orange-900/30 to-amber-900/30 rounded-xl border border-purple-700/30 p-6 mb-8">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  ⚖️ Comparaison : Opaque vs Glassmorphism
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Version Opaque */}
                  <div className="bg-slate-900/50 rounded-lg p-6 border border-slate-700">
                    <h4 className="font-bold mb-4 text-green-400">OPTION A - Couleurs opaques</h4>
                    <div className="space-y-4">
                      <button
                        className="w-full text-white font-bold px-6 py-4 rounded-full shadow-xl transition-all hover:scale-105"
                        style={{ background: designSystemColors.owner.hex }}
                      >
                        Owner
                      </button>
                      <button
                        className="w-full text-white font-bold px-6 py-4 rounded-full shadow-xl transition-all hover:scale-105"
                        style={{ background: designSystemColors.resident.hex }}
                      >
                        Resident
                      </button>
                      <button
                        className="w-full text-white font-bold px-6 py-4 rounded-full shadow-xl transition-all hover:scale-105"
                        style={{ background: designSystemColors.searcher.hex }}
                      >
                        Searcher
                      </button>
                    </div>
                    <div className="mt-4 text-sm text-slate-300">
                      <strong>Avantages :</strong>
                      <ul className="list-disc list-inside mt-2 space-y-1">
                        <li>Couleurs vives et vibrantes</li>
                        <li>Excellente lisibilité</li>
                        <li>Impact visuel maximum</li>
                      </ul>
                    </div>
                  </div>

                  {/* Version Glassmorphism */}
                  <div className="bg-slate-900/50 rounded-lg p-6 border border-slate-700">
                    <h4 className="font-bold mb-4 text-blue-400">OPTION B - Glassmorphism (85% opacité)</h4>
                    <div className="space-y-4">
                      <button
                        className="w-full text-white font-bold px-6 py-4 rounded-full shadow-xl backdrop-blur-xl border border-white/30 transition-all hover:scale-105"
                        style={{ background: `${designSystemColors.owner.hex}d9` }}
                      >
                        Owner
                      </button>
                      <button
                        className="w-full text-white font-bold px-6 py-4 rounded-full shadow-xl backdrop-blur-xl border border-white/30 transition-all hover:scale-105"
                        style={{ background: `${designSystemColors.resident.hex}d9` }}
                      >
                        Resident
                      </button>
                      <button
                        className="w-full text-white font-bold px-6 py-4 rounded-full shadow-xl backdrop-blur-xl border border-white/30 transition-all hover:scale-105"
                        style={{ background: `${designSystemColors.searcher.hex}d9` }}
                      >
                        Searcher
                      </button>
                    </div>
                    <div className="mt-4 text-sm text-slate-300">
                      <strong>Avantages :</strong>
                      <ul className="list-disc list-inside mt-2 space-y-1">
                        <li>Effet verre moderne et élégant</li>
                        <li>Laisse transparaître l'arrière-plan</li>
                        <li>Cohérent avec le style glassmorphism de la landing</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-8">
                {/* Bouton Owner ACTUEL */}
                <div>
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <span className="px-2 py-1 bg-red-500/20 text-red-400 text-xs rounded">ACTUEL</span>
                    Je loue mon bien (Owner)
                  </h3>
                  <div className="bg-slate-900 rounded-lg p-6 mb-3">
                    <button
                      className="w-full sm:w-auto group text-white font-bold px-8 py-5 rounded-full shadow-xl backdrop-blur-xl border border-white/30"
                      style={{ background: 'rgba(110, 86, 207, 0.6)' }}
                    >
                      <div className="flex items-center justify-center gap-3">
                        <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                          <Building2 className="w-4 h-4" />
                        </div>
                        <span className="text-base">Je loue mon bien</span>
                      </div>
                    </button>
                  </div>
                  <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 text-sm">
                    <p className="text-red-300 mb-2">
                      <strong>❌ Problème:</strong> Couleur rgba(110, 86, 207, 0.6) différente de la charte (#9c5698)
                    </p>
                    <code className="text-xs text-red-200">
                      background: rgba(110, 86, 207, 0.6)
                    </code>
                  </div>
                </div>

                {/* Bouton Owner PROPOSÉ - Version Opaque */}
                <div>
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded">OPTION A</span>
                    Je loue mon bien (Owner) - Version opaque
                  </h3>
                  <div className="bg-slate-900 rounded-lg p-6 mb-3">
                    <button
                      className="w-full sm:w-auto group text-white font-bold px-8 py-5 rounded-full shadow-xl transition-all hover:scale-105"
                      style={{
                        background: designSystemColors.owner.hex,
                        boxShadow: `0 10px 30px -5px ${designSystemColors.owner.hex}40, 0 4px 10px -2px ${designSystemColors.owner.hex}30`,
                      }}
                    >
                      <div className="flex items-center justify-center gap-3">
                        <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                          <Building2 className="w-4 h-4" />
                        </div>
                        <span className="text-base">Je loue mon bien</span>
                      </div>
                    </button>
                  </div>
                  <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 text-sm">
                    <p className="text-green-300 mb-2">
                      <strong>✅ Avantages:</strong> Couleur vibrante, maximum de visibilité
                    </p>
                    <code className="text-xs text-green-200">background: {designSystemColors.owner.hex}</code>
                  </div>
                </div>

                {/* Bouton Owner PROPOSÉ - Version Glassmorphism */}
                <div>
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded">OPTION B</span>
                    Je loue mon bien (Owner) - Version glassmorphism
                  </h3>
                  <div className="bg-slate-900 rounded-lg p-6 mb-3">
                    <button
                      className="w-full sm:w-auto group text-white font-bold px-8 py-5 rounded-full shadow-xl backdrop-blur-xl border border-white/30 transition-all hover:scale-105"
                      style={{
                        background: `${designSystemColors.owner.hex}d9`,
                        boxShadow: `0 10px 30px -5px ${designSystemColors.owner.hex}40, 0 4px 10px -2px ${designSystemColors.owner.hex}30`,
                      }}
                    >
                      <div className="flex items-center justify-center gap-3">
                        <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                          <Building2 className="w-4 h-4" />
                        </div>
                        <span className="text-base">Je loue mon bien</span>
                      </div>
                    </button>
                  </div>
                  <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 text-sm">
                    <p className="text-green-300 mb-2">
                      <strong>✅ Avantages:</strong> Effet verre moderne, laisse passer l'arrière-plan
                    </p>
                    <code className="text-xs text-green-200">background: {designSystemColors.owner.hex}d9 (85% opacité) + backdrop-blur-xl</code>
                  </div>
                </div>

                {/* Bouton Resident ACTUEL */}
                <div>
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <span className="px-2 py-1 bg-red-500/20 text-red-400 text-xs rounded">ACTUEL</span>
                    Je suis résident (Resident)
                  </h3>
                  <div className="bg-slate-900 rounded-lg p-6 mb-3">
                    <button
                      className="w-full sm:w-auto group text-white font-bold px-8 py-5 rounded-full shadow-xl backdrop-blur-xl border border-white/30"
                      style={{ background: 'rgba(255, 111, 60, 0.6)' }}
                    >
                      <div className="flex items-center justify-center gap-3">
                        <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                          <Home className="w-4 h-4" />
                        </div>
                        <span className="text-base">Je suis résident</span>
                      </div>
                    </button>
                  </div>
                  <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 text-sm">
                    <p className="text-red-300 mb-2">
                      <strong>❌ Problème:</strong> Couleur rgba(255, 111, 60, 0.6) différente de la charte (#FF5722)
                    </p>
                    <code className="text-xs text-red-200">background: rgba(255, 111, 60, 0.6)</code>
                  </div>
                </div>

                {/* Bouton Resident PROPOSÉ - Version Opaque */}
                <div>
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded">OPTION A</span>
                    Je suis résident (Resident) - Version opaque
                  </h3>
                  <div className="bg-slate-900 rounded-lg p-6 mb-3">
                    <button
                      className="w-full sm:w-auto group text-white font-bold px-8 py-5 rounded-full shadow-xl transition-all hover:scale-105"
                      style={{
                        background: designSystemColors.resident.hex,
                        boxShadow: `0 10px 30px -5px ${designSystemColors.resident.hex}40, 0 4px 10px -2px ${designSystemColors.resident.hex}30`,
                      }}
                    >
                      <div className="flex items-center justify-center gap-3">
                        <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                          <Home className="w-4 h-4" />
                        </div>
                        <span className="text-base">Je suis résident</span>
                      </div>
                    </button>
                  </div>
                  <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 text-sm">
                    <p className="text-green-300 mb-2">
                      <strong>✅ Avantages:</strong> Couleur vibrante, maximum de visibilité
                    </p>
                    <code className="text-xs text-green-200">background: {designSystemColors.resident.hex}</code>
                  </div>
                </div>

                {/* Bouton Resident PROPOSÉ - Version Glassmorphism */}
                <div>
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded">OPTION B</span>
                    Je suis résident (Resident) - Version glassmorphism
                  </h3>
                  <div className="bg-slate-900 rounded-lg p-6 mb-3">
                    <button
                      className="w-full sm:w-auto group text-white font-bold px-8 py-5 rounded-full shadow-xl backdrop-blur-xl border border-white/30 transition-all hover:scale-105"
                      style={{
                        background: `${designSystemColors.resident.hex}d9`,
                        boxShadow: `0 10px 30px -5px ${designSystemColors.resident.hex}40, 0 4px 10px -2px ${designSystemColors.resident.hex}30`,
                      }}
                    >
                      <div className="flex items-center justify-center gap-3">
                        <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                          <Home className="w-4 h-4" />
                        </div>
                        <span className="text-base">Je suis résident</span>
                      </div>
                    </button>
                  </div>
                  <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 text-sm">
                    <p className="text-green-300 mb-2">
                      <strong>✅ Avantages:</strong> Effet verre moderne, laisse passer l'arrière-plan
                    </p>
                    <code className="text-xs text-green-200">background: {designSystemColors.resident.hex}d9 (85% opacité) + backdrop-blur-xl</code>
                  </div>
                </div>

                {/* Bouton Searcher PROPOSÉ - Version Opaque */}
                <div>
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 text-xs rounded">NOUVEAU - OPTION A</span>
                    Je cherche un logement (Searcher) - Version opaque
                  </h3>
                  <div className="bg-slate-900 rounded-lg p-6 mb-3">
                    <button
                      className="w-full sm:w-auto group text-white font-bold px-8 py-5 rounded-full shadow-xl transition-all hover:scale-105"
                      style={{
                        background: designSystemColors.searcher.hex,
                        boxShadow: `0 10px 30px -5px ${designSystemColors.searcher.hex}40, 0 4px 10px -2px ${designSystemColors.searcher.hex}30`,
                      }}
                    >
                      <div className="flex items-center justify-center gap-3">
                        <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                          <Search className="w-4 h-4" />
                        </div>
                        <span className="text-base">Je cherche un logement</span>
                      </div>
                    </button>
                  </div>
                  <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 text-sm">
                    <p className="text-yellow-300 mb-2">
                      <strong>⚠️ À ajouter:</strong> Couleur vibrante, maximum de visibilité
                    </p>
                    <code className="text-xs text-yellow-200">background: {designSystemColors.searcher.hex}</code>
                  </div>
                </div>

                {/* Bouton Searcher PROPOSÉ - Version Glassmorphism */}
                <div>
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 text-xs rounded">NOUVEAU - OPTION B</span>
                    Je cherche un logement (Searcher) - Version glassmorphism
                  </h3>
                  <div className="bg-slate-900 rounded-lg p-6 mb-3">
                    <button
                      className="w-full sm:w-auto group text-white font-bold px-8 py-5 rounded-full shadow-xl backdrop-blur-xl border border-white/30 transition-all hover:scale-105"
                      style={{
                        background: `${designSystemColors.searcher.hex}d9`,
                        boxShadow: `0 10px 30px -5px ${designSystemColors.searcher.hex}40, 0 4px 10px -2px ${designSystemColors.searcher.hex}30`,
                      }}
                    >
                      <div className="flex items-center justify-center gap-3">
                        <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                          <Search className="w-4 h-4" />
                        </div>
                        <span className="text-base">Je cherche un logement</span>
                      </div>
                    </button>
                  </div>
                  <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 text-sm">
                    <p className="text-yellow-300 mb-2">
                      <strong>⚠️ À ajouter:</strong> Effet verre moderne, laisse passer l'arrière-plan
                    </p>
                    <code className="text-xs text-yellow-200">background: {designSystemColors.searcher.hex}d9 (85% opacité) + backdrop-blur-xl</code>
                  </div>
                </div>

                {/* Bouton Signature */}
                <div>
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <span className="px-2 py-1 bg-purple-500/20 text-purple-400 text-xs rounded">SIGNATURE</span>
                    Rechercher / S'inscrire - Gradient signature
                  </h3>
                  <div className="bg-slate-900 rounded-lg p-6 mb-3">
                    <button
                      className="w-full sm:w-auto group text-white font-bold px-8 py-5 rounded-full shadow-xl transition-all hover:scale-105"
                      style={{
                        background: designSystemColors.signature.gradient,
                        boxShadow: '0 10px 30px -5px rgba(156, 86, 152, 0.4), 0 4px 10px -2px rgba(255, 87, 34, 0.3)',
                      }}
                    >
                      <div className="flex items-center justify-center gap-3">
                        <Sparkles className="w-5 h-5" />
                        <span className="text-base">Rechercher</span>
                        <ArrowRight className="w-5 h-5" />
                      </div>
                    </button>
                  </div>
                  <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4 text-sm">
                    <p className="text-purple-300 mb-2">
                      <strong>✨ Spécial:</strong> Le bouton CTA principal conserve le gradient signature IzzIco
                    </p>
                    <code className="text-xs text-purple-200">
                      {designSystemColors.signature.gradient}
                    </code>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Couleurs */}
        {activeSection === 'colors' && (
          <div className="space-y-6">
            <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
              <h2 className="text-2xl font-bold mb-4">🎨 Comparaison des couleurs</h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Owner */}
                <div className="bg-slate-900 rounded-lg p-6">
                  <h3 className="font-bold mb-4 flex items-center gap-2">
                    <Building2 className="w-5 h-5" />
                    Owner (Propriétaire)
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-slate-400 mb-2">Actuel (Landing)</p>
                      <div className="h-16 rounded-lg border border-slate-600" style={{ background: currentColors.owner.current }} />
                      <p className="text-xs text-red-400 mt-2">rgba(110, 86, 207, 0.6)</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-400 mb-2">Design System ✅</p>
                      <div className="h-16 rounded-lg border border-slate-600" style={{ background: designSystemColors.owner.hex }} />
                      <p className="text-xs text-green-400 mt-2">{designSystemColors.owner.hex}</p>
                    </div>
                  </div>
                </div>

                {/* Resident */}
                <div className="bg-slate-900 rounded-lg p-6">
                  <h3 className="font-bold mb-4 flex items-center gap-2">
                    <Home className="w-5 h-5" />
                    Resident (Résident)
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-slate-400 mb-2">Actuel (Landing)</p>
                      <div className="h-16 rounded-lg border border-slate-600" style={{ background: currentColors.resident.current }} />
                      <p className="text-xs text-red-400 mt-2">rgba(255, 111, 60, 0.6)</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-400 mb-2">Design System ✅</p>
                      <div className="h-16 rounded-lg border border-slate-600" style={{ background: designSystemColors.resident.hex }} />
                      <p className="text-xs text-green-400 mt-2">{designSystemColors.resident.hex}</p>
                    </div>
                  </div>
                </div>

                {/* Searcher */}
                <div className="bg-slate-900 rounded-lg p-6">
                  <h3 className="font-bold mb-4 flex items-center gap-2">
                    <Search className="w-5 h-5" />
                    Searcher (Chercheur)
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-slate-400 mb-2">Actuel (Landing)</p>
                      <div className="h-16 rounded-lg border border-slate-600 bg-slate-700 flex items-center justify-center">
                        <span className="text-slate-500 text-sm">Non défini</span>
                      </div>
                      <p className="text-xs text-yellow-400 mt-2">Manquant</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-400 mb-2">Design System ✅</p>
                      <div className="h-16 rounded-lg border border-slate-600" style={{ background: designSystemColors.searcher.hex }} />
                      <p className="text-xs text-green-400 mt-2">{designSystemColors.searcher.hex}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Gradients */}
        {activeSection === 'gradients' && (
          <div className="space-y-6">
            <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
              <h2 className="text-2xl font-bold mb-4">✨ Gradient Signature</h2>

              <div className="bg-slate-900 rounded-lg p-8 mb-6">
                <div className="h-32 rounded-xl" style={{ background: designSystemColors.signature.gradient }} />
                <p className="text-sm text-slate-400 mt-4">
                  <code className="text-green-400">{designSystemColors.signature.gradient}</code>
                </p>
              </div>

              <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                <p className="text-blue-300">
                  <strong>📌 Règle:</strong> Le gradient signature doit être réservé uniquement au bouton CTA principal
                  "Rechercher" ou "S'inscrire". Les autres boutons (par rôle) utilisent leur couleur dominante pure.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Issues */}
        {activeSection === 'issues' && (
          <div className="space-y-4">
            <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
              <h2 className="text-2xl font-bold mb-4">⚠️ Issues détectées ({issues.length})</h2>

              <div className="space-y-4">
                {issues.map((issue, index) => (
                  <div
                    key={index}
                    className={`rounded-lg p-4 border ${
                      issue.type === 'error'
                        ? 'bg-red-500/10 border-red-500/30'
                        : issue.type === 'warning'
                        ? 'bg-yellow-500/10 border-yellow-500/30'
                        : 'bg-blue-500/10 border-blue-500/30'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {issue.type === 'error' ? (
                        <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                      ) : issue.type === 'warning' ? (
                        <AlertCircle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                      ) : (
                        <CheckCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                      )}
                      <div className="flex-1">
                        <h3
                          className={`font-bold mb-1 ${
                            issue.type === 'error'
                              ? 'text-red-300'
                              : issue.type === 'warning'
                              ? 'text-yellow-300'
                              : 'text-blue-300'
                          }`}
                        >
                          {issue.title}
                        </h3>
                        <p className="text-sm text-slate-300 mb-2">{issue.description}</p>
                        <p className="text-xs text-slate-400 mb-3">
                          <strong>Impact:</strong> {issue.impact}
                        </p>
                        <div className="bg-slate-900 rounded p-3 text-sm">
                          <p className="text-green-400 mb-1">
                            <strong>✅ Solution proposée:</strong>
                          </p>
                          <p className="text-slate-300">{issue.fix}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Action buttons */}
            <div className="bg-gradient-to-r from-purple-900/50 via-orange-900/50 to-amber-900/50 rounded-xl border border-purple-700/50 p-6">
              <h3 className="text-xl font-bold mb-4">🚀 Prochaines étapes</h3>
              <div className="space-y-3">
                <button
                  className="w-full px-6 py-4 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg transition-colors flex items-center justify-center gap-2"
                  onClick={() => {
                    if (confirm('Appliquer toutes les corrections à la landing page ?')) {
                      alert('Fonctionnalité en cours de développement...');
                    }
                  }}
                >
                  <CheckCircle className="w-5 h-5" />
                  Appliquer toutes les corrections
                </button>
                <p className="text-sm text-slate-400 text-center">
                  Cela mettra à jour tous les boutons de la landing page avec les couleurs du design system
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
