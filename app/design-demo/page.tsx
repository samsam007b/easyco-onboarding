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
