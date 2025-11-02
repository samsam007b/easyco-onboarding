'use client';

import { Heart, MessageCircle, CreditCard, Home, Star, TrendingUp } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export default function DesignDemoPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Comparaison: Brillant vs Grain
          </h1>
          <p className="text-lg text-gray-600">
            Explorez les différents niveaux de texture grain sur nos gradients
          </p>
        </div>

        {/* Tricolor Logo Comparison */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            Logo Tricolore Signature
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Original Brillant */}
            <div className="text-center">
              <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200 mb-4">
                <div
                  className="w-24 h-24 mx-auto rounded-3xl flex items-center justify-center shadow-xl"
                  style={{
                    background: 'linear-gradient(135deg, #6E56CF 0%, #FF6F3C 50%, #FFD249 100%)'
                  }}
                >
                  <Home className="w-12 h-12 text-white" />
                </div>
              </div>
              <h3 className="font-semibold text-gray-900">Original (Brillant)</h3>
              <p className="text-sm text-gray-600">Lisse & moderne</p>
            </div>

            {/* Grain Subtil */}
            <div className="text-center">
              <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200 mb-4">
                <div className="gradient-brand-grain w-24 h-24 mx-auto rounded-3xl flex items-center justify-center shadow-xl overflow-hidden">
                  <Home className="w-12 h-12 text-white" />
                </div>
              </div>
              <h3 className="font-semibold text-gray-900">Grain Subtil</h3>
              <p className="text-sm text-gray-600">Texture légère</p>
            </div>

            {/* Grain Medium */}
            <div className="text-center">
              <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200 mb-4">
                <div className="grain-medium w-24 h-24 mx-auto rounded-3xl flex items-center justify-center shadow-xl overflow-hidden"
                  style={{
                    background: 'linear-gradient(135deg, #6E56CF 0%, #FF6F3C 50%, #FFD249 100%)'
                  }}>
                  <Home className="w-12 h-12 text-white" />
                </div>
              </div>
              <h3 className="font-semibold text-gray-900">Grain Moyen</h3>
              <p className="text-sm text-gray-600">Équilibré</p>
            </div>

            {/* Grain Fort */}
            <div className="text-center">
              <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200 mb-4">
                <div className="grain-strong w-24 h-24 mx-auto rounded-3xl flex items-center justify-center shadow-xl overflow-hidden"
                  style={{
                    background: 'linear-gradient(135deg, #6E56CF 0%, #FF6F3C 50%, #FFD249 100%)'
                  }}>
                  <Home className="w-12 h-12 text-white" />
                </div>
              </div>
              <h3 className="font-semibold text-gray-900">Grain Fort</h3>
              <p className="text-sm text-gray-600">Style crayon</p>
            </div>
          </div>
        </section>

        {/* Logo Variations par Rôle */}
        <section className="mb-16 bg-gradient-to-br from-blue-50 to-purple-50 rounded-3xl p-8 border border-purple-200">
          <h2 className="text-3xl font-bold text-gray-900 mb-4 text-center">
            Variations de Logo par Rôle
          </h2>
          <p className="text-center text-gray-600 mb-8 max-w-3xl mx-auto">
            Chaque interface a son propre logo avec un dégradé adapté à son design system.
            Le logo principal tricolore représente l'unité des 3 rôles.
          </p>

          {/* SEARCHER - Dégradé extrait du logo original */}
          <div className="mb-12">
            <div className="bg-yellow-100/50 rounded-2xl p-6 mb-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-2 flex items-center gap-2">
                <span className="w-3 h-3 bg-yellow-500 rounded-full"></span>
                🟡 SEARCHER - Extrait du Logo Original
              </h3>
              <p className="text-gray-700">Zone jaune/orange du logo tricolore (partie droite)</p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-2xl border-4 border-yellow-400">
              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="text-center">
                  <div
                    className="grain-medium w-32 h-32 mx-auto rounded-3xl flex items-center justify-center shadow-2xl overflow-hidden"
                    style={{
                      background: 'linear-gradient(135deg, #FFA040 0%, #FFB85C 50%, #FFD080 100%)'
                    }}
                  >
                    <Home className="w-16 h-16 text-white" />
                  </div>
                  <Badge className="mt-4 bg-green-100 text-green-700 border-green-300 text-sm px-4 py-1">
                    ✨ Logo Authentique
                  </Badge>
                </div>
                <div className="flex-1">
                  <h4 className="text-2xl font-bold text-gray-900 mb-3">Dégradé Searcher</h4>
                  <p className="text-gray-700 mb-4 leading-relaxed">
                    Extrait directement de la zone jaune/orange du logo tricolore. Garantit une cohérence parfaite.
                  </p>
                  <div className="bg-gradient-to-r from-[#FFA040] via-[#FFB85C] to-[#FFD080] rounded-lg p-4 mb-3">
                    <p className="text-white font-bold text-center drop-shadow-lg">Aperçu complet du dégradé</p>
                  </div>
                  <div className="grid grid-cols-3 gap-3 text-xs font-mono">
                    <div className="bg-gray-50 rounded p-2 text-center">
                      <div className="w-8 h-8 rounded mx-auto mb-1" style={{ background: '#FFA040' }}></div>
                      <span className="text-gray-700">#FFA040</span>
                    </div>
                    <div className="bg-gray-50 rounded p-2 text-center">
                      <div className="w-8 h-8 rounded mx-auto mb-1" style={{ background: '#FFB85C' }}></div>
                      <span className="text-gray-700">#FFB85C</span>
                    </div>
                    <div className="bg-gray-50 rounded p-2 text-center">
                      <div className="w-8 h-8 rounded mx-auto mb-1" style={{ background: '#FFD080' }}></div>
                      <span className="text-gray-700">#FFD080</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RESIDENT - Dégradé extrait du logo original */}
          <div className="mb-12">
            <div className="bg-orange-100/50 rounded-2xl p-6 mb-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-2 flex items-center gap-2">
                <span className="w-3 h-3 bg-orange-500 rounded-full"></span>
                🟠 RESIDENT - Extrait du Logo Original
              </h3>
              <p className="text-gray-700">Zone orange/corail du logo tricolore (partie centrale)</p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-2xl border-4 border-orange-400">
              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="text-center">
                  <div
                    className="grain-medium w-32 h-32 mx-auto rounded-3xl flex items-center justify-center shadow-2xl overflow-hidden"
                    style={{
                      background: 'linear-gradient(135deg, #D97B6F 0%, #E8865D 50%, #FF8C4B 100%)'
                    }}
                  >
                    <Home className="w-16 h-16 text-white" />
                  </div>
                  <Badge className="mt-4 bg-green-100 text-green-700 border-green-300 text-sm px-4 py-1">
                    ✨ Logo Authentique
                  </Badge>
                </div>
                <div className="flex-1">
                  <h4 className="text-2xl font-bold text-gray-900 mb-3">Dégradé Resident</h4>
                  <p className="text-gray-700 mb-4 leading-relaxed">
                    Extrait directement de la zone orange/corail du logo tricolore. Chaleureux et accueillant.
                  </p>
                  <div className="bg-gradient-to-r from-[#D97B6F] via-[#E8865D] to-[#FF8C4B] rounded-lg p-4 mb-3">
                    <p className="text-white font-bold text-center drop-shadow-lg">Aperçu complet du dégradé</p>
                  </div>
                  <div className="grid grid-cols-3 gap-3 text-xs font-mono">
                    <div className="bg-gray-50 rounded p-2 text-center">
                      <div className="w-8 h-8 rounded mx-auto mb-1" style={{ background: '#D97B6F' }}></div>
                      <span className="text-gray-700">#D97B6F</span>
                    </div>
                    <div className="bg-gray-50 rounded p-2 text-center">
                      <div className="w-8 h-8 rounded mx-auto mb-1" style={{ background: '#E8865D' }}></div>
                      <span className="text-gray-700">#E8865D</span>
                    </div>
                    <div className="bg-gray-50 rounded p-2 text-center">
                      <div className="w-8 h-8 rounded mx-auto mb-1" style={{ background: '#FF8C4B' }}></div>
                      <span className="text-gray-700">#FF8C4B</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* OWNER - Dégradé extrait du logo original */}
          <div className="mb-4">
            <div className="bg-purple-100/50 rounded-2xl p-6 mb-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-2 flex items-center gap-2">
                <span className="w-3 h-3 bg-purple-600 rounded-full"></span>
                🟣 OWNER - Extrait du Logo Original
              </h3>
              <p className="text-gray-700">Zone violette/mauve du logo tricolore (partie gauche)</p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-2xl border-4 border-purple-400">
              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="text-center">
                  <div
                    className="grain-medium w-32 h-32 mx-auto rounded-3xl flex items-center justify-center shadow-2xl overflow-hidden"
                    style={{
                      background: 'linear-gradient(135deg, #7B5FB8 0%, #A67BB8 50%, #C98B9E 100%)'
                    }}
                  >
                    <Home className="w-16 h-16 text-white" />
                  </div>
                  <Badge className="mt-4 bg-green-100 text-green-700 border-green-300 text-sm px-4 py-1">
                    ✨ Logo Authentique
                  </Badge>
                </div>
                <div className="flex-1">
                  <h4 className="text-2xl font-bold text-gray-900 mb-3">Dégradé Owner</h4>
                  <p className="text-gray-700 mb-4 leading-relaxed">
                    Extrait directement de la zone violette/mauve du logo tricolore. Professionnel et premium.
                  </p>
                  <div className="bg-gradient-to-r from-[#7B5FB8] via-[#A67BB8] to-[#C98B9E] rounded-lg p-4 mb-3">
                    <p className="text-white font-bold text-center drop-shadow-lg">Aperçu complet du dégradé</p>
                  </div>
                  <div className="grid grid-cols-3 gap-3 text-xs font-mono">
                    <div className="bg-gray-50 rounded p-2 text-center">
                      <div className="w-8 h-8 rounded mx-auto mb-1" style={{ background: '#7B5FB8' }}></div>
                      <span className="text-gray-700">#7B5FB8</span>
                    </div>
                    <div className="bg-gray-50 rounded p-2 text-center">
                      <div className="w-8 h-8 rounded mx-auto mb-1" style={{ background: '#A67BB8' }}></div>
                      <span className="text-gray-700">#A67BB8</span>
                    </div>
                    <div className="bg-gray-50 rounded p-2 text-center">
                      <div className="w-8 h-8 rounded mx-auto mb-1" style={{ background: '#C98B9E' }}></div>
                      <span className="text-gray-700">#C98B9E</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Usage Note */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border-2 border-blue-200">
            <h4 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
              <span className="text-2xl">💡</span>
              Note d'utilisation
            </h4>
            <p className="text-gray-700 leading-relaxed">
              Les options marquées "Recommandé ✨" reproduisent le mieux l'effet visuel du logo principal tricolore
              avec une transition fluide de couleurs tout en restant dans l'univers chromatique de chaque rôle.
              Tous les logos incluent la texture grain pour le style "crayon" organique.
            </p>
          </div>
        </section>

        {/* Resident Orange Gradient */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            Dégradé Resident (Orange)
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Sans Grain */}
            <div className="bg-white rounded-3xl shadow-xl border border-gray-200 overflow-hidden">
              <div
                className="p-8"
                style={{
                  background: 'linear-gradient(135deg, #FFF3EF 0%, #FFE5DC 100%)'
                }}
              >
                <div className="flex items-center gap-4 mb-6">
                  <div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg"
                    style={{
                      background: 'linear-gradient(135deg, #FF6F3C 0%, #FF5722 100%)'
                    }}
                  >
                    <Heart className="w-8 h-8 text-white fill-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">Sans Grain</h3>
                    <p className="text-gray-600">Style actuel brillant</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/80 backdrop-blur rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="w-5 h-5 text-orange-600" />
                      <span className="text-sm font-medium text-gray-600">Revenus</span>
                    </div>
                    <p className="text-2xl font-bold text-gray-900">2,400€</p>
                  </div>
                  <div className="bg-white/80 backdrop-blur rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Star className="w-5 h-5 text-orange-600" />
                      <span className="text-sm font-medium text-gray-600">Favoris</span>
                    </div>
                    <p className="text-2xl font-bold text-gray-900">12</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Avec Grain */}
            <div className="bg-white rounded-3xl shadow-xl border border-gray-200 overflow-hidden">
              <div className="gradient-resident-grain p-8 overflow-hidden">
                <div className="flex items-center gap-4 mb-6">
                  <div className="grain-medium w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg overflow-hidden"
                    style={{
                      background: 'linear-gradient(135deg, #FF6F3C 0%, #FF5722 100%)'
                    }}>
                    <Heart className="w-8 h-8 text-white fill-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">Avec Grain</h3>
                    <p className="text-gray-600">Style crayon/organique</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/80 backdrop-blur rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="w-5 h-5 text-orange-600" />
                      <span className="text-sm font-medium text-gray-600">Revenus</span>
                    </div>
                    <p className="text-2xl font-bold text-gray-900">2,400€</p>
                  </div>
                  <div className="bg-white/80 backdrop-blur rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Star className="w-5 h-5 text-orange-600" />
                      <span className="text-sm font-medium text-gray-600">Favoris</span>
                    </div>
                    <p className="text-2xl font-bold text-gray-900">12</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Owner Purple Gradient */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            Dégradé Owner (Mauve)
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Sans Grain */}
            <div className="bg-white rounded-3xl shadow-xl border border-gray-200 overflow-hidden">
              <div
                className="p-8"
                style={{
                  background: 'linear-gradient(135deg, #F3F1FF 0%, #F9F8FF 100%)'
                }}
              >
                <div className="flex items-center gap-4 mb-6">
                  <div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg"
                    style={{
                      background: 'linear-gradient(135deg, #6E56CF 0%, #5B45B8 100%)'
                    }}
                  >
                    <CreditCard className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">Sans Grain</h3>
                    <p className="text-gray-600">Style actuel brillant</p>
                  </div>
                </div>
                <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white">
                  Accéder aux paiements
                </Button>
              </div>
            </div>

            {/* Avec Grain */}
            <div className="bg-white rounded-3xl shadow-xl border border-gray-200 overflow-hidden">
              <div className="gradient-owner-grain p-8 overflow-hidden">
                <div className="flex items-center gap-4 mb-6">
                  <div className="grain-medium w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg overflow-hidden"
                    style={{
                      background: 'linear-gradient(135deg, #6E56CF 0%, #5B45B8 100%)'
                    }}>
                    <CreditCard className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">Avec Grain</h3>
                    <p className="text-gray-600">Style crayon/organique</p>
                  </div>
                </div>
                <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white">
                  Accéder aux paiements
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Searcher Yellow Gradient */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            Dégradé Searcher (Jaune)
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Sans Grain */}
            <div className="bg-white rounded-3xl shadow-xl border border-gray-200 overflow-hidden">
              <div
                className="p-8"
                style={{
                  background: 'linear-gradient(135deg, #FFF9E6 0%, #FFFBEA 100%)'
                }}
              >
                <div className="flex items-center gap-4 mb-6">
                  <div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg"
                    style={{
                      background: 'linear-gradient(135deg, #FFD249 0%, #FFC107 100%)'
                    }}
                  >
                    <MessageCircle className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">Sans Grain</h3>
                    <p className="text-gray-600">Style actuel brillant</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Badge variant="default" className="bg-yellow-500 text-white">
                    3 nouveaux messages
                  </Badge>
                </div>
              </div>
            </div>

            {/* Avec Grain */}
            <div className="bg-white rounded-3xl shadow-xl border border-gray-200 overflow-hidden">
              <div className="gradient-searcher-grain p-8 overflow-hidden">
                <div className="flex items-center gap-4 mb-6">
                  <div className="grain-medium w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg overflow-hidden"
                    style={{
                      background: 'linear-gradient(135deg, #FFD249 0%, #FFC107 100%)'
                    }}>
                    <MessageCircle className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">Avec Grain</h3>
                    <p className="text-gray-600">Style crayon/organique</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Badge variant="default" className="bg-yellow-500 text-white">
                    3 nouveaux messages
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Header Gris Comparisons */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center">
            Headers Gris avec Grain Subtil
          </h2>
          <p className="text-center text-gray-600 mb-8">
            Comparaison de différentes teintes de gris pour un header universel (Landing + Interfaces)
          </p>

          <div className="grid grid-cols-1 gap-8">
            {/* Header Slate (Gris Ardoise Moderne) */}
            <div className="rounded-2xl overflow-hidden shadow-xl border border-gray-200">
              <div className="header-gray-slate text-white p-6">
                <div className="max-w-6xl mx-auto flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Home className="w-8 h-8" />
                    <span className="text-xl font-bold">EasyCo</span>
                  </div>
                  <nav className="flex gap-6">
                    <a href="#" className="hover:opacity-80">Chercheurs</a>
                    <a href="#" className="hover:opacity-80">Propriétaires</a>
                    <a href="#" className="hover:opacity-80">Résidents</a>
                  </nav>
                  <Button variant="outline" size="sm">Connexion</Button>
                </div>
              </div>
              <div className="bg-white p-4 text-center">
                <h3 className="font-semibold text-gray-900 mb-1">Option 1 - Gris Ardoise Moderne</h3>
                <p className="text-sm text-gray-600 mb-2">Professionnel, avec une très légère teinte bleue-grise</p>
                <code className="text-xs bg-gray-100 px-2 py-1 rounded">#475569 → #64748B</code>
              </div>
            </div>

            {/* Header Warm (Gris Chaud) */}
            <div className="rounded-2xl overflow-hidden shadow-xl border border-gray-200">
              <div className="header-gray-warm text-white p-6">
                <div className="max-w-6xl mx-auto flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Home className="w-8 h-8" />
                    <span className="text-xl font-bold">EasyCo</span>
                  </div>
                  <nav className="flex gap-6">
                    <a href="#" className="hover:opacity-80">Chercheurs</a>
                    <a href="#" className="hover:opacity-80">Propriétaires</a>
                    <a href="#" className="hover:opacity-80">Résidents</a>
                  </nav>
                  <Button variant="outline" size="sm">Connexion</Button>
                </div>
              </div>
              <div className="bg-white p-4 text-center">
                <h3 className="font-semibold text-gray-900 mb-1">Option 2 - Gris Chaud Neutre ⭐ RECOMMANDÉ</h3>
                <p className="text-sm text-gray-600 mb-2">S'harmonise parfaitement avec les couleurs chaudes (violet, orange, jaune)</p>
                <code className="text-xs bg-gray-100 px-2 py-1 rounded">#57534E → #78716C</code>
              </div>
            </div>

            {/* Header Graphite */}
            <div className="rounded-2xl overflow-hidden shadow-xl border border-gray-200">
              <div className="header-gray-graphite text-white p-6">
                <div className="max-w-6xl mx-auto flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Home className="w-8 h-8" />
                    <span className="text-xl font-bold">EasyCo</span>
                  </div>
                  <nav className="flex gap-6">
                    <a href="#" className="hover:opacity-80">Chercheurs</a>
                    <a href="#" className="hover:opacity-80">Propriétaires</a>
                    <a href="#" className="hover:opacity-80">Résidents</a>
                  </nav>
                  <Button variant="outline" size="sm">Connexion</Button>
                </div>
              </div>
              <div className="bg-white p-4 text-center">
                <h3 className="font-semibold text-gray-900 mb-1">Option 3 - Gris Graphite</h3>
                <p className="text-sm text-gray-600 mb-2">Plus foncé, élégant et premium</p>
                <code className="text-xs bg-gray-100 px-2 py-1 rounded">#374151 → #4B5563</code>
              </div>
            </div>
          </div>

          {/* Analysis Box */}
          <div className="mt-8 bg-blue-50 border-l-4 border-blue-500 p-6 rounded-lg">
            <h3 className="font-bold text-blue-900 mb-3 flex items-center gap-2">
              <Star className="w-5 h-5" />
              Analyse Design Manager
            </h3>
            <ul className="space-y-2 text-blue-800">
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-1">•</span>
                <span><strong>Option 2 (Gris Chaud)</strong> est ma recommandation : elle s'harmonise mieux avec votre palette chaude (violet/orange/jaune)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-1">•</span>
                <span><strong>Neutralité</strong> : Un header gris permet d'être universel sans favoriser un rôle spécifique</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-1">•</span>
                <span><strong>Grain subtil</strong> : Cohérence avec le nouveau style texturé tout en restant discret sur le header</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-1">•</span>
                <span><strong>Versatilité</strong> : Fonctionne aussi bien sur la landing page que dans les interfaces utilisateur</span>
              </li>
            </ul>
          </div>
        </section>

        {/* Recommendation */}
        <section className="bg-gradient-to-r from-purple-50 to-orange-50 rounded-3xl p-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Mon Avis en tant que Design Manager
          </h2>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto mb-6">
            Le style <strong>grain moyen</strong> offre le meilleur équilibre : il ajoute de la personnalité
            et de la chaleur tout en préservant la lisibilité. Il distingue EasyCo des plateformes
            concurrentes avec un style moderne mais organique, parfait pour une plateforme centrée sur
            les relations humaines.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <div className="bg-white rounded-xl p-4 shadow-lg">
              <p className="font-semibold text-gray-900 mb-1">✅ Recommandé</p>
              <p className="text-sm text-gray-600">Grain Moyen (subtil)</p>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-lg">
              <p className="font-semibold text-gray-900 mb-1">⚡ Pour accents</p>
              <p className="text-sm text-gray-600">Grain Fort (badges, icônes)</p>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-lg">
              <p className="font-semibold text-gray-900 mb-1">📐 Backgrounds</p>
              <p className="text-sm text-gray-600">Grain Subtil (grandes surfaces)</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
