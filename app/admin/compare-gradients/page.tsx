'use client';

import { useState } from 'react';
import { Check, Copy, Eye } from 'lucide-react';

export default function CompareGradientsPage() {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  // Version FIGMA (Documentation)
  const figmaGradients = {
    brand: {
      name: 'Gradient Signature FIGMA',
      css: 'linear-gradient(135deg, #9256A4 0%, #FF6F3C 50%, #FFB10B 100%)',
      colors: ['#9256A4', '#FF6F3C', '#FFB10B'],
      description: 'Version documentée dans IZZICO_GRADIENTS_FIGMA.md',
      labels: ['0% Mauve', '50% Orange', '100% Jaune']
    },
    owner: {
      name: 'Owner CTA FIGMA',
      css: 'linear-gradient(135deg, #7B5FB8 0%, #A67BB8 50%, #C98B9E 100%)',
      colors: ['#7B5FB8', '#A67BB8', '#C98B9E'],
      description: 'Gradient CTA Owner (Figma)',
      labels: ['0% Mauve foncé', '50% Mauve rose', '100% Rose mauve']
    },
    resident: {
      name: 'Resident CTA FIGMA',
      css: 'linear-gradient(135deg, #D97B6F 0%, #E8865D 50%, #FF8C4B 100%)',
      colors: ['#D97B6F', '#E8865D', '#FF8C4B'],
      description: 'Gradient CTA Resident (Figma)',
      labels: ['0% Terracotta', '50% Corail', '100% Orange vif']
    },
    searcher: {
      name: 'Searcher CTA FIGMA',
      css: 'linear-gradient(135deg, #FFA040 0%, #FFB85C 50%, #FFD080 100%)',
      colors: ['#FFA040', '#FFB85C', '#FFD080'],
      description: 'Gradient CTA Searcher (Figma)',
      labels: ['0% Orange clair', '50% Beige doré', '100% Jaune doré']
    }
  };

  // Version CODE (Actuellement dans le code)
  const codeGradients = {
    brand: {
      name: 'Gradient Signature CODE',
      css: 'linear-gradient(135deg, #9c5698 0%, #FF5722 50%, #FFB10B 100%)',
      colors: ['#9c5698', '#FF5722', '#FFB10B'],
      description: 'Version actuellement dans globals.css et design system',
      labels: ['0% Mauve', '50% Orange', '100% Jaune']
    },
    owner: {
      name: 'Owner CTA CODE',
      css: 'linear-gradient(135deg, #7B5FB8 0%, #A67BB8 50%, #C98B9E 100%)',
      colors: ['#7B5FB8', '#A67BB8', '#C98B9E'],
      description: 'Identique à Figma',
      labels: ['0% Mauve foncé', '50% Mauve rose', '100% Rose mauve']
    },
    resident: {
      name: 'Resident CTA CODE',
      css: 'linear-gradient(135deg, #D97B6F 0%, #E8865D 50%, #FF8C4B 100%)',
      colors: ['#D97B6F', '#E8865D', '#FF8C4B'],
      description: 'Identique à Figma',
      labels: ['0% Terracotta', '50% Corail', '100% Orange vif']
    },
    searcher: {
      name: 'Searcher CTA CODE',
      css: 'linear-gradient(135deg, #FFA040 0%, #FFB85C 50%, #FFD080 100%)',
      colors: ['#FFA040', '#FFB85C', '#FFD080'],
      description: 'Identique à Figma',
      labels: ['0% Orange clair', '50% Beige doré', '100% Jaune doré']
    }
  };

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const GradientCard = ({
    gradient,
    index,
    version
  }: {
    gradient: any;
    index: number;
    version: 'figma' | 'code';
  }) => (
    <div className="bg-slate-800 superellipse-2xl border border-slate-700 p-6 hover:border-slate-600 transition-all">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-bold text-white mb-1">{gradient.name}</h3>
          <p className="text-xs text-slate-400">{gradient.description}</p>
        </div>
        <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
          version === 'figma'
            ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
            : 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
        }`}>
          {version === 'figma' ? 'Figma' : 'Code'}
        </div>
      </div>

      {/* Gradient Preview - Large */}
      <div
        className="w-full h-32 superellipse-2xl shadow-2xl mb-4"
        style={{ background: gradient.css }}
      />

      {/* Labels */}
      <div className="flex justify-between mb-4 text-[10px] text-slate-500 font-mono">
        {gradient.labels.map((label: string, i: number) => (
          <span key={i}>{label}</span>
        ))}
      </div>

      {/* Color Swatches */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        {gradient.colors.map((color: string, i: number) => (
          <div key={i} className="text-center">
            <div
              className="w-full h-16 rounded-lg shadow-md mb-2 border border-slate-600"
              style={{ backgroundColor: color }}
            />
            <code className="text-xs text-green-400 font-mono">{color}</code>
          </div>
        ))}
      </div>

      {/* CSS Code */}
      <div className="bg-slate-900 rounded-lg p-3 mb-3">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-slate-400 font-medium">CSS:</span>
          <button
            onClick={() => copyToClipboard(gradient.css, index)}
            className="text-xs text-slate-400 hover:text-white transition-colors flex items-center gap-1"
          >
            {copiedIndex === index ? (
              <>
                <Check className="w-3 h-3" />
                Copié
              </>
            ) : (
              <>
                <Copy className="w-3 h-3" />
                Copier
              </>
            )}
          </button>
        </div>
        <code className="text-[10px] text-green-400 font-mono break-all">
          {gradient.css}
        </code>
      </div>

      {/* Button Preview */}
      <button
        className="w-full py-3 rounded-full text-white font-semibold shadow-xl hover:scale-105 transition-transform"
        style={{ background: gradient.css }}
      >
        Aperçu Bouton CTA
      </button>
    </div>
  );

  const ComparisonRow = ({
    title,
    figmaGradient,
    codeGradient,
    isDifferent
  }: {
    title: string;
    figmaGradient: any;
    codeGradient: any;
    isDifferent: boolean;
  }) => (
    <div className="mb-12">
      <div className="flex items-center gap-3 mb-6">
        <h2 className="text-2xl font-bold text-white">{title}</h2>
        {isDifferent ? (
          <span className="px-3 py-1 bg-yellow-500/20 text-yellow-300 border border-yellow-500/40 rounded-full text-xs font-semibold">
            ⚠️ Différences détectées
          </span>
        ) : (
          <span className="px-3 py-1 bg-green-500/20 text-green-300 border border-green-500/40 rounded-full text-xs font-semibold">
            ✓ Identiques
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GradientCard gradient={figmaGradient} index={Math.random()} version="figma" />
        <GradientCard gradient={codeGradient} index={Math.random()} version="code" />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 superellipse-2xl bg-gradient-to-br from-purple-500 via-orange-500 to-yellow-400 flex items-center justify-center shadow-2xl">
              <Eye className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">Comparaison des Gradients</h1>
              <p className="text-slate-400">Comparez les versions Figma vs. Code pour choisir les couleurs officielles</p>
            </div>
          </div>

          {/* Legend */}
          <div className="bg-slate-800 superellipse-xl border border-slate-700 p-4 flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-purple-500"></div>
              <span className="text-sm text-slate-300">Version Figma = Documentation IZZICO_GRADIENTS_FIGMA.md</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              <span className="text-sm text-slate-300">Version Code = Actuellement dans globals.css et design system</span>
            </div>
          </div>
        </div>

        {/* Gradient Signature (IMPORTANT - seul différent) */}
        <ComparisonRow
          title="🌈 Gradient Signature (Logo/Brand)"
          figmaGradient={figmaGradients.brand}
          codeGradient={codeGradients.brand}
          isDifferent={true}
        />

        <div className="h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent my-12"></div>

        {/* Owner CTA */}
        <ComparisonRow
          title="🟣 Gradient Owner CTA"
          figmaGradient={figmaGradients.owner}
          codeGradient={codeGradients.owner}
          isDifferent={false}
        />

        <div className="h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent my-12"></div>

        {/* Resident CTA */}
        <ComparisonRow
          title="🟠 Gradient Resident CTA"
          figmaGradient={figmaGradients.resident}
          codeGradient={codeGradients.resident}
          isDifferent={false}
        />

        <div className="h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent my-12"></div>

        {/* Searcher CTA */}
        <ComparisonRow
          title="🟡 Gradient Searcher CTA"
          figmaGradient={figmaGradients.searcher}
          codeGradient={codeGradients.searcher}
          isDifferent={false}
        />

        {/* Summary */}
        <div className="mt-12 bg-gradient-to-r from-purple-500/10 via-orange-500/10 to-yellow-500/10 border border-purple-500/30 superellipse-2xl p-8">
          <h3 className="text-xl font-bold text-white mb-4">📊 Résumé des différences</h3>
          <div className="space-y-3 text-slate-300">
            <div className="flex items-start gap-3">
              <span className="text-yellow-400 font-bold">⚠️</span>
              <div>
                <p className="font-semibold text-white mb-1">Gradient Signature (Brand) :</p>
                <p className="text-sm">
                  Figma : <code className="text-purple-400">#9256A4</code> / <code className="text-orange-400">#FF6F3C</code> / <code className="text-yellow-400">#FFB10B</code>
                </p>
                <p className="text-sm">
                  Code : <code className="text-purple-400">#9c5698</code> / <code className="text-orange-400">#FF5722</code> / <code className="text-yellow-400">#FFB10B</code>
                </p>
                <p className="text-xs text-slate-400 mt-1">→ Différences sur les couleurs Mauve (début) et Orange (milieu)</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-green-400 font-bold">✓</span>
              <div>
                <p className="font-semibold text-white mb-1">Gradients CTA par rôle :</p>
                <p className="text-sm">Owner, Resident, Searcher sont <strong>identiques</strong> entre Figma et Code</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
