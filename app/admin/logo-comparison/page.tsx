'use client';

import React from 'react';
import Image from 'next/image';

export default function LogoComparisonPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-2 text-slate-900">
          Comparaison des logos IzzIco
        </h1>
        <p className="text-slate-600 mb-8">
          Analyse visuelle des différentes versions du logo textuel et de l'icône
        </p>

        {/* Version actuelle - Icône maison */}
        <section className="mb-12 bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold mb-4 text-slate-900">
            Version actuelle : Icône maison
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold text-slate-700 mb-3">Fond blanc</h3>
              <div className="bg-white border-2 border-slate-200 rounded-xl p-8 flex items-center justify-center">
                <Image
                  src="/logos/izzico-icon.svg"
                  alt="IzzIco Icon - Fond blanc"
                  width={200}
                  height={200}
                />
              </div>
              <div className="mt-4 text-sm text-slate-600">
                <p><strong>Type :</strong> Icône (maison stylisée)</p>
                <p><strong>Dimensions :</strong> 200×200px (carré)</p>
                <p><strong>Gradient :</strong> Diagonal 135deg</p>
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-slate-700 mb-3">Fond sombre</h3>
              <div className="bg-slate-900 rounded-xl p-8 flex items-center justify-center">
                <Image
                  src="/logos/izzico-icon.svg"
                  alt="IzzIco Icon - Fond sombre"
                  width={200}
                  height={200}
                />
              </div>
              <div className="mt-4 text-sm text-slate-600">
                <p><strong>Couleurs :</strong></p>
                <ul className="list-disc list-inside ml-2">
                  <li>#9c5698 (Mauve Owner)</li>
                  <li>#FF5722 (Orange Resident)</li>
                  <li>#FFB10B (Jaune Searcher)</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Version 1 - Logo textuel (stop à 50%) */}
        <section className="mb-12 bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold mb-4 text-slate-900">
            Version 1 : Logo textuel (stop orange à 50%)
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold text-slate-700 mb-3">Fond blanc</h3>
              <div className="bg-white border-2 border-slate-200 rounded-xl p-8 flex items-center justify-center">
                <Image
                  src="/logos/izzico-logo-text-v1.svg"
                  alt="IzzIco Logo V1 - Fond blanc"
                  width={600}
                  height={200}
                />
              </div>
              <div className="mt-4 text-sm text-slate-600">
                <p><strong>Type :</strong> Texte "IzzIco"</p>
                <p><strong>Dimensions :</strong> 600×200px (format bannière)</p>
                <p><strong>Gradient :</strong> Horizontal (0deg, gauche→droite)</p>
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-slate-700 mb-3">Fond sombre</h3>
              <div className="bg-slate-900 rounded-xl p-8 flex items-center justify-center">
                <Image
                  src="/logos/izzico-logo-text-v1.svg"
                  alt="IzzIco Logo V1 - Fond sombre"
                  width={600}
                  height={200}
                />
              </div>
              <div className="mt-4 text-sm text-slate-600">
                <p><strong>Stops gradient :</strong></p>
                <ul className="list-disc list-inside ml-2">
                  <li>0% : #9c5698 (Mauve)</li>
                  <li><strong>50%</strong> : #FF5722 (Orange)</li>
                  <li>100% : #FFB10B (Jaune)</li>
                </ul>
                <p className="mt-2 text-xs italic">
                  Répartition équilibrée des 3 couleurs
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Version 2 - Logo textuel (stop à 55%) */}
        <section className="mb-12 bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold mb-4 text-slate-900">
            Version 2 : Logo textuel (stop orange à 55%)
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold text-slate-700 mb-3">Fond blanc</h3>
              <div className="bg-white border-2 border-slate-200 rounded-xl p-8 flex items-center justify-center">
                <Image
                  src="/logos/izzico-logo-text-v2.svg"
                  alt="IzzIco Logo V2 - Fond blanc"
                  width={600}
                  height={200}
                />
              </div>
              <div className="mt-4 text-sm text-slate-600">
                <p><strong>Type :</strong> Texte "IzzIco"</p>
                <p><strong>Dimensions :</strong> 600×200px (format bannière)</p>
                <p><strong>Gradient :</strong> Horizontal (0deg, gauche→droite)</p>
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-slate-700 mb-3">Fond sombre</h3>
              <div className="bg-slate-900 rounded-xl p-8 flex items-center justify-center">
                <Image
                  src="/logos/izzico-logo-text-v2.svg"
                  alt="IzzIco Logo V2 - Fond sombre"
                  width={600}
                  height={200}
                />
              </div>
              <div className="mt-4 text-sm text-slate-600">
                <p><strong>Stops gradient :</strong></p>
                <ul className="list-disc list-inside ml-2">
                  <li>0% : #9c5698 (Mauve)</li>
                  <li><strong>55%</strong> : #FF5722 (Orange)</li>
                  <li>100% : #FFB10B (Jaune)</li>
                </ul>
                <p className="mt-2 text-xs italic">
                  Plus de mauve-orange (55%), moins de orange-jaune (45%)
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Version FINALE - Logo textuel avec soft glow */}
        <section className="mb-12 bg-gradient-to-br from-purple-50 via-orange-50 to-amber-50 rounded-2xl shadow-2xl p-8 border-4 border-purple-200">
          <div className="flex items-center gap-3 mb-4">
            <h2 className="text-3xl font-bold text-slate-900">
              ⭐ Version FINALE - Avec soft glow
            </h2>
            <span className="px-4 py-1 bg-gradient-to-r from-purple-600 to-orange-600 text-white text-sm font-bold rounded-full">
              CHOIX FINAL
            </span>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold text-slate-700 mb-3">Fond blanc</h3>
              <div className="bg-white border-2 border-slate-200 rounded-xl p-8 flex items-center justify-center">
                <Image
                  src="/logos/izzico-logo-text-final.svg"
                  alt="IzzIco Logo Final - Fond blanc"
                  width={600}
                  height={200}
                />
              </div>
              <div className="mt-4 text-sm text-slate-600">
                <p><strong>Type :</strong> Texte "IzzIco" avec effets</p>
                <p><strong>Dimensions :</strong> 600×200px (format bannière)</p>
                <p><strong>Gradient :</strong> Horizontal (0deg, gauche→droite)</p>
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-slate-700 mb-3">Fond sombre</h3>
              <div className="bg-slate-900 rounded-xl p-8 flex items-center justify-center">
                <Image
                  src="/logos/izzico-logo-text-final.svg"
                  alt="IzzIco Logo Final - Fond sombre"
                  width={600}
                  height={200}
                />
              </div>
              <div className="mt-4 text-sm text-slate-600 space-y-2">
                <p><strong>✨ Caractéristiques :</strong></p>
                <ul className="list-disc list-inside ml-2">
                  <li>Stop orange à <strong>55%</strong></li>
                  <li><strong>Soft glow</strong> (ombre portée 2px)</li>
                  <li><strong>Letter-spacing -2px</strong></li>
                  <li>Z inversés dans "IzzIco"</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Version compacte pour headers */}
          <div className="mt-8 pt-8 border-t-2 border-purple-200">
            <h3 className="text-xl font-bold text-slate-900 mb-4">
              📱 Version compacte (pour headers)
            </h3>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white border-2 border-slate-200 rounded-xl p-6 flex items-center justify-center">
                <Image
                  src="/logos/izzico-logo-compact.svg"
                  alt="IzzIco Logo Compact - Fond blanc"
                  width={400}
                  height={120}
                />
              </div>
              <div className="bg-slate-900 rounded-xl p-6 flex items-center justify-center">
                <Image
                  src="/logos/izzico-logo-compact.svg"
                  alt="IzzIco Logo Compact - Fond sombre"
                  width={400}
                  height={120}
                />
              </div>
            </div>
            <p className="text-sm text-slate-600 mt-4">
              <strong>Dimensions :</strong> 400×120px •
              <strong> Taille police :</strong> 90px •
              <strong> Glow :</strong> 1.5px (réduit)
            </p>
          </div>
        </section>

        {/* Analyse comparative */}
        <section className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold mb-6 text-slate-900">
            🎨 Analyse comparative
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl p-6">
              <h3 className="font-bold text-lg mb-3 text-purple-700">Icône actuelle</h3>
              <ul className="space-y-2 text-sm text-slate-700">
                <li>✓ Reconnaissable (maison)</li>
                <li>✓ Format carré (versatile)</li>
                <li>✓ Gradient diagonal (dynamique)</li>
                <li>✓ Fonctionne en petit (favicon)</li>
                <li>⚠ Ne montre pas le nom "IzzIco"</li>
              </ul>
            </div>

            <div className="bg-white rounded-xl p-6">
              <h3 className="font-bold text-lg mb-3 text-orange-700">Logo textuel V1</h3>
              <ul className="space-y-2 text-sm text-slate-700">
                <li>✓ Nom de marque visible</li>
                <li>✓ Gradient horizontal (lecture)</li>
                <li>✓ Répartition équilibrée (50%)</li>
                <li>✓ Format bannière (header)</li>
                <li>⚠ Trop grand pour favicon</li>
              </ul>
            </div>

            <div className="bg-white rounded-xl p-6">
              <h3 className="font-bold text-lg mb-3 text-amber-700">Logo textuel V2</h3>
              <ul className="space-y-2 text-sm text-slate-700">
                <li>✓ Nom de marque visible</li>
                <li>✓ Gradient horizontal (lecture)</li>
                <li>✓ Plus de mauve (55%)</li>
                <li>✓ Format bannière (header)</li>
                <li>⚠ Trop grand pour favicon</li>
              </ul>
            </div>
          </div>

          <div className="mt-8 bg-white rounded-xl p-6">
            <h3 className="font-bold text-lg mb-4 text-slate-900">📋 Recommandations</h3>
            <div className="space-y-3 text-sm text-slate-700">
              <div className="flex items-start gap-3">
                <span className="text-2xl">🏠</span>
                <div>
                  <strong>Icône (favicon, app mobile) :</strong>
                  <p>Garder l'icône maison actuelle - parfaite pour les petits formats</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-2xl">📱</span>
                <div>
                  <strong>Logo header web :</strong>
                  <p>Utiliser le logo textuel pour l'identité de marque sur desktop</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-2xl">🎯</span>
                <div>
                  <strong>Choix V1 vs V2 :</strong>
                  <p><strong>V1 (50%)</strong> = équilibre parfait des 3 rôles</p>
                  <p><strong>V2 (55%)</strong> = met plus l'accent sur les propriétaires (mauve)</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Gradient technique */}
        <section className="mt-8 bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold mb-4 text-slate-900">
            🔧 Spécifications techniques
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-slate-700 mb-3">Gradient actuel (diagonal)</h3>
              <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg text-xs overflow-x-auto">
{`linear-gradient(135deg,
  #9c5698 0%,
  #FF5722 50%,
  #FFB10B 100%
)`}</pre>
            </div>
            <div>
              <h3 className="font-semibold text-slate-700 mb-3">Gradient proposé (horizontal)</h3>
              <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg text-xs overflow-x-auto">
{`linear-gradient(90deg,
  #9c5698 0%,
  #FF5722 55%,
  #FFB10B 100%
)`}</pre>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
