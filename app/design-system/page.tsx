'use client';

import { Home, Heart, MessageCircle, Settings, Star, TrendingUp, Users, Calendar, DollarSign } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export default function DesignSystemPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Design System par Rôle
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Palettes harmonieuses monochromes pour chaque rôle. Éviter l'arc-en-ciel
            en utilisant des variations d'une seule couleur principale par interface.
          </p>
        </div>

        {/* Vue d'ensemble des palettes */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Vue d'ensemble des palettes</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Searcher Palette */}
            <div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center">
                  <Home className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Searcher</h3>
                  <p className="text-sm text-gray-600">Jaune/Doré/Ambré</p>
                </div>
              </div>
              <p className="text-sm text-gray-700 mb-4">
                Énergique, optimiste, aventureux. Pour les chercheurs de colocation.
              </p>
              <div className="grid grid-cols-5 gap-2">
                <div className="aspect-square rounded-lg" style={{ backgroundColor: 'var(--searcher-100)' }} title="100"></div>
                <div className="aspect-square rounded-lg" style={{ backgroundColor: 'var(--searcher-300)' }} title="300"></div>
                <div className="aspect-square rounded-lg" style={{ backgroundColor: 'var(--searcher-500)' }} title="500"></div>
                <div className="aspect-square rounded-lg" style={{ backgroundColor: 'var(--searcher-700)' }} title="700"></div>
                <div className="aspect-square rounded-lg" style={{ backgroundColor: 'var(--searcher-900)' }} title="900"></div>
              </div>
            </div>

            {/* Resident Palette */}
            <div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Resident</h3>
                  <p className="text-sm text-gray-600">Orange/Corail/Terracotta</p>
                </div>
              </div>
              <p className="text-sm text-gray-700 mb-4">
                Convivial, chaleureux, communautaire. Pour les résidents actuels.
              </p>
              <div className="grid grid-cols-5 gap-2">
                <div className="aspect-square rounded-lg" style={{ backgroundColor: 'var(--resident-100)' }} title="100"></div>
                <div className="aspect-square rounded-lg" style={{ backgroundColor: 'var(--resident-300)' }} title="300"></div>
                <div className="aspect-square rounded-lg" style={{ backgroundColor: 'var(--resident-500)' }} title="500"></div>
                <div className="aspect-square rounded-lg" style={{ backgroundColor: 'var(--resident-700)' }} title="700"></div>
                <div className="aspect-square rounded-lg" style={{ backgroundColor: 'var(--resident-900)' }} title="900"></div>
              </div>
            </div>

            {/* Owner Palette */}
            <div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-600 to-purple-700 flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Owner</h3>
                  <p className="text-sm text-gray-600">Mauve/Violet/Indigo</p>
                </div>
              </div>
              <p className="text-sm text-gray-700 mb-4">
                Professionnel, premium, confiant. Pour les propriétaires.
              </p>
              <div className="grid grid-cols-5 gap-2">
                <div className="aspect-square rounded-lg" style={{ backgroundColor: 'var(--owner-100)' }} title="100"></div>
                <div className="aspect-square rounded-lg" style={{ backgroundColor: 'var(--owner-300)' }} title="300"></div>
                <div className="aspect-square rounded-lg" style={{ backgroundColor: 'var(--owner-500)' }} title="500"></div>
                <div className="aspect-square rounded-lg" style={{ backgroundColor: 'var(--owner-700)' }} title="700"></div>
                <div className="aspect-square rounded-lg" style={{ backgroundColor: 'var(--owner-900)' }} title="900"></div>
              </div>
            </div>
          </div>
        </section>

        {/* Exemples d'utilisation */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Exemples d'utilisation</h2>

          {/* Searcher Examples */}
          <div className="mb-12 role-searcher">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-yellow-500"></span>
              Interface Searcher
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Card Example */}
              <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-role-200">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-bold text-role-800">Propriété Match</h4>
                  <Badge className="bg-role-500 text-white">95% Match</Badge>
                </div>
                <p className="text-gray-700 mb-4">
                  Colocation moderne dans le quartier recherché. Disponible immédiatement.
                </p>
                <div className="flex gap-2 mb-4">
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-role-100 text-role-700 text-sm font-medium">
                    <Home className="w-4 h-4" />
                    3 chambres
                  </span>
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-role-100 text-role-700 text-sm font-medium">
                    <DollarSign className="w-4 h-4" />
                    850€/mois
                  </span>
                </div>
                <div className="flex gap-2">
                  <button className="flex-1 px-4 py-2 bg-role-500 hover:bg-role-600 text-white font-semibold rounded-xl transition">
                    Voir le bien
                  </button>
                  <button className="px-4 py-2 border-2 border-role-500 text-role-700 hover:bg-role-100 font-semibold rounded-xl transition">
                    <Heart className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Stats Card */}
              <div className="bg-gradient-to-br from-role-50 to-role-100 rounded-2xl p-6 border border-role-200">
                <h4 className="text-lg font-bold text-role-800 mb-4">Vos statistiques</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-role-700 font-medium">Favoris</span>
                    <span className="text-2xl font-bold text-role-600">12</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-role-700 font-medium">Visites planifiées</span>
                    <span className="text-2xl font-bold text-role-600">3</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-role-700 font-medium">Messages</span>
                    <span className="text-2xl font-bold text-role-600">8</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Resident Examples */}
          <div className="mb-12 role-resident">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-orange-500"></span>
              Interface Resident
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Tasks Card */}
              <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-role-200">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-bold text-role-800">Tâches communes</h4>
                  <Badge className="bg-role-500 text-white">4 en cours</Badge>
                </div>
                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-3 rounded-lg bg-role-50 border border-role-200">
                    <input type="checkbox" className="mt-1 accent-role-500" />
                    <div className="flex-1">
                      <p className="font-medium text-role-800">Sortir les poubelles</p>
                      <p className="text-sm text-role-600">Assigné à Marie • Demain</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 rounded-lg bg-role-50 border border-role-200">
                    <input type="checkbox" className="mt-1 accent-role-500" />
                    <div className="flex-1">
                      <p className="font-medium text-role-800">Nettoyer la cuisine</p>
                      <p className="text-sm text-role-600">Assigné à toi • Aujourd'hui</p>
                    </div>
                  </div>
                </div>
                <button className="mt-4 w-full px-4 py-2 bg-role-500 hover:bg-role-600 text-white font-semibold rounded-xl transition">
                  Ajouter une tâche
                </button>
              </div>

              {/* Expenses Card */}
              <div className="bg-gradient-to-br from-role-50 to-role-100 rounded-2xl p-6 border border-role-200">
                <h4 className="text-lg font-bold text-role-800 mb-4">Finances partagées</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                    <span className="text-role-700 font-medium">Loyer</span>
                    <span className="text-lg font-bold text-role-600">850€</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                    <span className="text-role-700 font-medium">Électricité</span>
                    <span className="text-lg font-bold text-role-600">45€</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                    <span className="text-role-700 font-medium">Internet</span>
                    <span className="text-lg font-bold text-role-600">30€</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Owner Examples */}
          <div className="mb-12 role-owner">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-purple-600"></span>
              Interface Owner
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Property Card */}
              <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-role-200">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-bold text-role-800">Appartement Paris 11e</h4>
                  <Badge className="bg-role-500 text-white">Publié</Badge>
                </div>
                <div className="space-y-3 mb-4">
                  <div className="flex items-center gap-2 text-role-700">
                    <Users className="w-4 h-4 text-role-500" />
                    <span className="text-sm font-medium">12 candidatures</span>
                  </div>
                  <div className="flex items-center gap-2 text-role-700">
                    <Star className="w-4 h-4 text-role-500" />
                    <span className="text-sm font-medium">8 favoris</span>
                  </div>
                  <div className="flex items-center gap-2 text-role-700">
                    <Calendar className="w-4 h-4 text-role-500" />
                    <span className="text-sm font-medium">5 visites planifiées</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="flex-1 px-4 py-2 bg-role-500 hover:bg-role-600 text-white font-semibold rounded-xl transition">
                    Voir les candidatures
                  </button>
                  <button className="px-4 py-2 border-2 border-role-500 text-role-700 hover:bg-role-100 font-semibold rounded-xl transition">
                    <Settings className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Revenue Card */}
              <div className="bg-gradient-to-br from-role-50 to-role-100 rounded-2xl p-6 border border-role-200">
                <h4 className="text-lg font-bold text-role-800 mb-4">Revenus mensuels</h4>
                <div className="text-center mb-4">
                  <p className="text-4xl font-bold text-role-600 mb-1">2,450€</p>
                  <p className="text-sm text-role-700">+12% vs mois dernier</p>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-role-700">Taux d'occupation</span>
                    <span className="font-bold text-role-800">95%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-role-700">ROI annuel</span>
                    <span className="font-bold text-role-800">8.5%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Guide d'utilisation */}
        <section className="bg-blue-50 border-l-4 border-blue-500 p-8 rounded-lg">
          <h2 className="text-2xl font-bold text-blue-900 mb-4">Guide d'utilisation</h2>

          <div className="space-y-4 text-blue-800">
            <div>
              <h3 className="font-bold mb-2">1. Appliquer le contexte de rôle</h3>
              <code className="block bg-blue-100 p-3 rounded text-sm">
                {'<div className="role-searcher">'}
                <br />
                {'  {/* Tout le contenu ici utilisera les couleurs Searcher */}'}
                <br />
                {'</div>'}
              </code>
            </div>

            <div>
              <h3 className="font-bold mb-2">2. Utiliser les classes utilitaires</h3>
              <code className="block bg-blue-100 p-3 rounded text-sm">
                {'<button className="bg-role-500 hover:bg-role-600 text-white">'}
                <br />
                {'  Action'}
                <br />
                {'</button>'}
              </code>
            </div>

            <div>
              <h3 className="font-bold mb-2">3. Variables CSS directes</h3>
              <code className="block bg-blue-100 p-3 rounded text-sm">
                {'style={{ backgroundColor: "var(--role-100)" }}'}
              </code>
            </div>

            <div>
              <h3 className="font-bold mb-2">4. Palettes disponibles par rôle</h3>
              <ul className="list-disc list-inside space-y-1">
                <li><strong>50-900:</strong> Nuances de la couleur principale (50 = très clair, 900 = très foncé)</li>
                <li><strong>accent:</strong> Couleur d'accent pour highlights</li>
                <li><strong>muted:</strong> Backgrounds désactivés</li>
                <li><strong>border:</strong> Bordures subtiles</li>
                <li><strong>shadow:</strong> Ombres colorées</li>
              </ul>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
