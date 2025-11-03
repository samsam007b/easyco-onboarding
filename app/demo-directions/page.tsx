'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Home, Users, Star, TrendingUp, Calendar, MessageSquare, Settings } from 'lucide-react';

type Direction = 'linear' | 'airbnb' | 'stripe' | 'hybrid';

export default function DemoDirectionsPage() {
  const [activeDirection, setActiveDirection] = useState<Direction>('hybrid');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sticky Direction Selector */}
      <div className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <h1 className="text-2xl font-bold mb-4">EasyCo - Benchmark Design 2025</h1>
          <div className="flex gap-3">
            <button
              onClick={() => setActiveDirection('linear')}
              className={`px-6 py-2 rounded-xl font-semibold transition-all ${
                activeDirection === 'linear'
                  ? 'bg-zinc-900 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Direction 1: Linear Style
            </button>
            <button
              onClick={() => setActiveDirection('airbnb')}
              className={`px-6 py-2 rounded-xl font-semibold transition-all ${
                activeDirection === 'airbnb'
                  ? 'bg-[#FF385C] text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Direction 2: Airbnb Warm
            </button>
            <button
              onClick={() => setActiveDirection('stripe')}
              className={`px-6 py-2 rounded-xl font-semibold transition-all ${
                activeDirection === 'stripe'
                  ? 'bg-[#635bff] text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Direction 3: Stripe Pro
            </button>
            <button
              onClick={() => setActiveDirection('hybrid')}
              className={`px-6 py-2 rounded-xl font-semibold transition-all ${
                activeDirection === 'hybrid'
                  ? 'bg-gradient-to-r from-[#7B5FB8] via-[#E8865D] to-[#FFD080] text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Direction 4: EasyCo Hybrid ⭐
            </button>
          </div>
        </div>
      </div>

      {/* Demo Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Description de la direction */}
        <div className="mb-12">
          {activeDirection === 'linear' && <LinearDescription />}
          {activeDirection === 'airbnb' && <AirbnbDescription />}
          {activeDirection === 'stripe' && <StripeDescription />}
          {activeDirection === 'hybrid' && <HybridDescription />}
        </div>

        {/* Header Demo */}
        <section className="mb-12">
          <h2 className="text-xl font-bold mb-4">Header Navigation</h2>
          {activeDirection === 'linear' && <LinearHeader />}
          {activeDirection === 'airbnb' && <AirbnbHeader />}
          {activeDirection === 'stripe' && <StripeHeader />}
          {activeDirection === 'hybrid' && <HybridHeader />}
        </section>

        {/* Property Cards Demo */}
        <section className="mb-12">
          <h2 className="text-xl font-bold mb-4">Property Cards</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {activeDirection === 'linear' && <LinearPropertyCards />}
            {activeDirection === 'airbnb' && <AirbnbPropertyCards />}
            {activeDirection === 'stripe' && <StripePropertyCards />}
            {activeDirection === 'hybrid' && <HybridPropertyCards />}
          </div>
        </section>

        {/* Stats/Dashboard Demo */}
        <section className="mb-12">
          <h2 className="text-xl font-bold mb-4">Dashboard Stats</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {activeDirection === 'linear' && <LinearStats />}
            {activeDirection === 'airbnb' && <AirbnbStats />}
            {activeDirection === 'stripe' && <StripeStats />}
            {activeDirection === 'hybrid' && <HybridStats />}
          </div>
        </section>

        {/* CTA Buttons Demo */}
        <section className="mb-12">
          <h2 className="text-xl font-bold mb-4">Call-to-Action Buttons</h2>
          <div className="flex flex-wrap gap-4">
            {activeDirection === 'linear' && <LinearCTAs />}
            {activeDirection === 'airbnb' && <AirbnbCTAs />}
            {activeDirection === 'stripe' && <StripeCTAs />}
            {activeDirection === 'hybrid' && <HybridCTAs />}
          </div>
        </section>
      </div>
    </div>
  );
}

// ============================================
// Direction 1: LINEAR STYLE
// ============================================

function LinearDescription() {
  return (
    <div className="bg-zinc-900 text-white p-8 rounded-2xl">
      <h3 className="text-2xl font-bold mb-3">Direction 1: Linear Style - Ultra-Moderne & Performant</h3>
      <p className="text-zinc-300 mb-4">
        Minimalisme extrême, micro-interactions raffinées, performance obsessionnelle.
        Dark mode premium avec glassmorphism subtil.
      </p>
      <div className="flex gap-4">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-zinc-700"></div>
          <span className="text-sm text-zinc-400">Zinc/Slate</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-blue-500"></div>
          <span className="text-sm text-zinc-400">Blue Accent</span>
        </div>
      </div>
    </div>
  );
}

function LinearHeader() {
  return (
    <header className="backdrop-blur-xl bg-zinc-900/90 text-white rounded-2xl p-4">
      <div className="flex items-center justify-between">
        <div className="text-xl font-bold">EasyCo</div>
        <nav className="flex items-center gap-8">
          {['Explorer', 'Communauté', 'Blog'].map((item) => (
            <a
              key={item}
              className="text-sm font-medium text-zinc-300 hover:text-white transition-colors duration-200 cursor-pointer relative group"
            >
              {item}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-white group-hover:w-full transition-all duration-200"></span>
            </a>
          ))}
        </nav>
        <button className="bg-white text-zinc-900 px-6 py-2 rounded-xl text-sm font-semibold hover:scale-105 transition-transform duration-200">
          Se Connecter
        </button>
      </div>
    </header>
  );
}

function LinearPropertyCards() {
  const properties = [
    { name: 'Coliving Louise', location: 'Ixelles', price: '650€', rooms: 5 },
    { name: 'Urban Nest', location: 'Saint-Gilles', price: '720€', rooms: 6 },
    { name: 'The Hive', location: 'Schaerbeek', price: '580€', rooms: 4 },
  ];

  return (
    <>
      {properties.map((prop, i) => (
        <div
          key={i}
          className="group bg-zinc-900 rounded-xl overflow-hidden hover:scale-[1.01] transition-all duration-200 cursor-pointer"
        >
          <div className="aspect-[4/3] bg-zinc-800"></div>
          <div className="p-4">
            <h3 className="font-semibold text-white mb-1 tracking-tight">{prop.name}</h3>
            <p className="text-sm text-zinc-500 mb-3">{prop.location} • {prop.rooms} chambres</p>
            <p className="text-lg font-bold text-white">
              {prop.price}<span className="text-sm font-normal text-zinc-500">/mois</span>
            </p>
          </div>
        </div>
      ))}
    </>
  );
}

function LinearStats() {
  const stats = [
    { label: 'Revenus', value: '€3,240', change: '+12%' },
    { label: 'Occupation', value: '87%', change: '+5%' },
    { label: 'Demandes', value: '12', change: 'new' },
  ];

  return (
    <>
      {stats.map((stat, i) => (
        <div key={i} className="bg-zinc-900 rounded-xl p-6 border border-zinc-800">
          <p className="text-sm font-medium text-zinc-500 mb-2">{stat.label}</p>
          <p className="text-4xl font-bold text-white mb-2">{stat.value}</p>
          <span className="text-sm text-green-400 font-medium">{stat.change}</span>
        </div>
      ))}
    </>
  );
}

function LinearCTAs() {
  return (
    <>
      <button className="bg-zinc-900 text-white px-8 py-3 rounded-xl font-semibold hover:bg-zinc-800 transition-all duration-200">
        Primary Action
      </button>
      <button className="bg-zinc-100 text-zinc-900 px-8 py-3 rounded-xl font-semibold hover:bg-zinc-200 transition-all duration-200">
        Secondary Action
      </button>
    </>
  );
}

// ============================================
// Direction 2: AIRBNB WARM
// ============================================

function AirbnbDescription() {
  return (
    <div className="bg-gradient-to-r from-rose-50 to-orange-50 p-8 rounded-2xl border border-rose-100">
      <h3 className="text-2xl font-bold mb-3 text-gray-900">Direction 2: Airbnb Warm - Chaleureux & Lifestyle</h3>
      <p className="text-gray-700 mb-4">
        Photographie lifestyle, couleurs chaudes, spacing généreux, trust signals omniprésents.
        Accent sur la communauté et les visages humains.
      </p>
      <div className="flex gap-4">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-[#FF385C]"></div>
          <span className="text-sm text-gray-600">Rausch Pink</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-orange-500"></div>
          <span className="text-sm text-gray-600">Warm Orange</span>
        </div>
      </div>
    </div>
  );
}

function AirbnbHeader() {
  return (
    <header className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between">
        <div className="text-xl font-bold text-[#FF385C]">EasyCo</div>
        <nav className="flex items-center gap-8">
          {['Explorer', 'Communauté', 'Blog'].map((item) => (
            <a
              key={item}
              className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors cursor-pointer"
            >
              {item}
            </a>
          ))}
        </nav>
        <button className="bg-[#FF385C] text-white px-6 py-2 rounded-full text-sm font-semibold hover:bg-[#E31C5F] transition-colors">
          Se Connecter
        </button>
      </div>
    </header>
  );
}

function AirbnbPropertyCards() {
  const properties = [
    { name: 'Coliving Louise', location: 'Ixelles', price: '650€', rating: 4.8, reviews: 23 },
    { name: 'Urban Nest', location: 'Saint-Gilles', price: '720€', rating: 4.9, reviews: 31 },
    { name: 'The Hive', location: 'Schaerbeek', price: '580€', rating: 4.7, reviews: 18 },
  ];

  return (
    <>
      {properties.map((prop, i) => (
        <div
          key={i}
          className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer"
        >
          <div className="aspect-[20/19] bg-gray-200 relative">
            {/* Resident avatars */}
            <div className="absolute top-4 left-4 flex -space-x-2">
              <div className="w-8 h-8 rounded-full bg-blue-500 border-2 border-white"></div>
              <div className="w-8 h-8 rounded-full bg-green-500 border-2 border-white"></div>
              <div className="w-8 h-8 rounded-full bg-purple-500 border-2 border-white"></div>
            </div>
          </div>
          <div className="p-6">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-sm text-gray-600">8 résidents</span>
            </div>
            <h3 className="font-semibold text-lg mb-1">{prop.name}</h3>
            <p className="text-gray-600 text-sm mb-3">{prop.location}</p>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                <span className="text-yellow-500">★</span>
                <span className="font-medium">{prop.rating}</span>
                <span className="text-gray-500 text-sm">({prop.reviews})</span>
              </div>
              <p className="text-lg font-bold text-gray-900">
                {prop.price}<span className="text-sm font-normal text-gray-600">/mois</span>
              </p>
            </div>
          </div>
        </div>
      ))}
    </>
  );
}

function AirbnbStats() {
  const stats = [
    { icon: Home, label: 'Propriétés', value: '247', color: 'rose' },
    { icon: Users, label: 'Utilisateurs', value: '1,842', color: 'orange' },
    { icon: Star, label: 'Satisfaction', value: '98%', color: 'rose' },
  ];

  return (
    <>
      {stats.map((stat, i) => {
        const Icon = stat.icon;
        return (
          <div key={i} className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-shadow duration-300">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 ${
              stat.color === 'rose' ? 'bg-rose-100' : 'bg-orange-100'
            }`}>
              <Icon className={`w-6 h-6 ${
                stat.color === 'rose' ? 'text-[#FF385C]' : 'text-orange-500'
              }`} />
            </div>
            <div className={`text-4xl font-bold mb-2 ${
              stat.color === 'rose' ? 'text-[#FF385C]' : 'text-orange-500'
            }`}>
              {stat.value}
            </div>
            <div className="text-sm text-gray-600 font-medium">{stat.label}</div>
          </div>
        );
      })}
    </>
  );
}

function AirbnbCTAs() {
  return (
    <>
      <button className="bg-[#FF385C] text-white px-8 py-3 rounded-full font-semibold hover:bg-[#E31C5F] transition-colors shadow-lg">
        Trouver Mon Coliving
      </button>
      <button className="bg-white text-[#FF385C] border-2 border-[#FF385C] px-8 py-3 rounded-full font-semibold hover:bg-rose-50 transition-colors">
        En Savoir Plus
      </button>
    </>
  );
}

// ============================================
// Direction 3: STRIPE PROFESSIONAL
// ============================================

function StripeDescription() {
  return (
    <div className="bg-gradient-to-br from-[#0a2540] to-[#1e3a5f] text-white p-8 rounded-2xl">
      <h3 className="text-2xl font-bold mb-3">Direction 3: Stripe Professional - Sophistiqué & Data-Driven</h3>
      <p className="text-blue-100 mb-4">
        Gradients multi-couches, visualisation de données, professionnalisme absolu.
        Typographie hiérarchique et animations subtiles.
      </p>
      <div className="flex gap-4">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-[#635bff]"></div>
          <span className="text-sm text-blue-200">Blurple</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-[#0a2540]"></div>
          <span className="text-sm text-blue-200">Navy</span>
        </div>
      </div>
    </div>
  );
}

function StripeHeader() {
  return (
    <header className="bg-[#0a2540] text-white rounded-2xl p-4">
      <div className="flex items-center justify-between">
        <div className="text-xl font-bold">EasyCo</div>
        <nav className="flex items-center gap-8">
          {['Explorer', 'Communauté', 'Blog'].map((item) => (
            <a
              key={item}
              className="text-sm font-medium text-blue-200 hover:text-white transition-colors cursor-pointer"
            >
              {item}
            </a>
          ))}
        </nav>
        <button className="bg-[#635bff] text-white px-6 py-2 rounded-lg text-sm font-semibold hover:bg-[#5850e6] transition-colors">
          Se Connecter
        </button>
      </div>
    </header>
  );
}

function StripePropertyCards() {
  const properties = [
    { name: 'Coliving Louise', location: 'Ixelles', occupancy: 85, revenue: '€2,850' },
    { name: 'Urban Nest', location: 'Saint-Gilles', occupancy: 92, revenue: '€3,240' },
    { name: 'The Hive', location: 'Schaerbeek', occupancy: 78, revenue: '€2,420' },
  ];

  return (
    <>
      {properties.map((prop, i) => (
        <div
          key={i}
          className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-lg transition-shadow duration-200"
        >
          <h3 className="font-semibold text-lg mb-1">{prop.name}</h3>
          <p className="text-gray-600 text-sm mb-4">{prop.location}</p>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-xs text-gray-500">Occupation</p>
              <p className="text-lg font-semibold text-green-600">{prop.occupancy}%</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Revenus</p>
              <p className="text-lg font-semibold text-[#635bff]">{prop.revenue}</p>
            </div>
          </div>
          {/* Mini chart placeholder */}
          <div className="h-12 bg-gradient-to-r from-[#635bff]/20 to-transparent rounded"></div>
        </div>
      ))}
    </>
  );
}

function StripeStats() {
  const stats = [
    { label: 'Revenus ce mois', value: '€3,240', change: '↑ 12%', changeColor: 'green' },
    { label: "Taux d'occupation", value: '87%', change: '↑ 5%', changeColor: 'green' },
    { label: 'Demandes en attente', value: '12', change: 'Voir →', changeColor: 'blue' },
  ];

  return (
    <>
      {stats.map((stat, i) => (
        <div key={i} className="bg-gradient-to-br from-blue-50 to-white rounded-2xl p-6 border border-blue-100">
          <p className="text-sm font-medium text-gray-600 mb-2">{stat.label}</p>
          <p className="text-4xl font-bold text-[#0a2540] mb-2">{stat.value}</p>
          <div className="flex items-center gap-2 text-sm">
            <span className={`font-medium ${
              stat.changeColor === 'green' ? 'text-green-600' : 'text-[#635bff]'
            }`}>
              {stat.change}
            </span>
            {stat.changeColor === 'green' && <span className="text-gray-500">vs mois dernier</span>}
          </div>
          {/* Mini chart */}
          <div className="mt-4 h-12 rounded overflow-hidden bg-gray-100">
            <div className="h-full bg-gradient-to-r from-[#635bff] to-[#00d4ff] opacity-50"></div>
          </div>
        </div>
      ))}
    </>
  );
}

function StripeCTAs() {
  return (
    <>
      <button className="bg-[#635bff] text-white px-8 py-3 rounded-lg font-semibold hover:bg-[#5850e6] transition-colors shadow-lg">
        Commencer
      </button>
      <button className="bg-white text-[#635bff] border border-gray-300 px-8 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors">
        Documentation
      </button>
    </>
  );
}

// ============================================
// Direction 4: EASYCO HYBRID (RECOMMENDED)
// ============================================

function HybridDescription() {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-gray-50 to-white p-8 rounded-2xl border border-gray-200">
      <div className="grain-overlay-demo absolute inset-0 opacity-20"></div>
      <div className="relative z-10">
        <h3 className="text-2xl font-bold mb-3">
          <span className="text-gradient-brand-demo">
            Direction 4: EasyCo Hybrid - Le Meilleur des Mondes ⭐
          </span>
        </h3>
        <p className="text-gray-700 mb-4">
          Architecture technique de Linear + Chaleur d'Airbnb + Sophistication de Stripe.
          Gradients tricolores du logo, grain textures, role-based theming.
        </p>
        <div className="flex gap-4">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-[#7B5FB8]"></div>
            <span className="text-sm text-gray-600">Owner</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-[#E8865D]"></div>
            <span className="text-sm text-gray-600">Resident</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-[#FFD080]"></div>
            <span className="text-sm text-gray-600">Searcher</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function HybridHeader() {
  return (
    <header className="backdrop-blur-xl bg-gradient-to-r from-[#FFA040]/95 via-[#FFB85C]/95 to-[#FFD080]/95 rounded-2xl p-4">
      <div className="flex items-center justify-between">
        <div className="text-xl font-bold text-white">EasyCo</div>
        <nav className="flex items-center gap-8">
          {['Explorer', 'Communauté', 'Blog'].map((item) => (
            <a
              key={item}
              className="nav-item-hybrid text-white font-medium cursor-pointer relative group"
            >
              <span className="nav-text transition-all duration-200">{item}</span>
            </a>
          ))}
        </nav>
        <button className="bg-white text-[#FFA040] px-6 py-2 rounded-xl font-semibold hover:scale-105 transition-all duration-200">
          Se Connecter
        </button>
      </div>
    </header>
  );
}

function HybridPropertyCards() {
  const properties = [
    { name: 'Coliving Louise', location: 'Ixelles', price: '650€', rating: 4.8, reviews: 23 },
    { name: 'Urban Nest', location: 'Saint-Gilles', price: '720€', rating: 4.9, reviews: 31 },
    { name: 'The Hive', location: 'Schaerbeek', price: '580€', rating: 4.7, reviews: 18 },
  ];

  return (
    <>
      {properties.map((prop, i) => (
        <div
          key={i}
          className="card-interactive-demo bg-white rounded-2xl overflow-hidden shadow-sm transition-all duration-200 cursor-pointer"
        >
          <div className="aspect-[20/19] bg-gray-200 relative">
            {/* Verified badge with gradient */}
            <div className="absolute top-4 right-4 bg-gradient-to-r from-[#FFA040] to-[#FFD080] text-white px-3 py-1 rounded-full text-sm font-semibold">
              Vérifié
            </div>
            {/* Resident avatars */}
            <div className="absolute bottom-4 left-4 flex -space-x-2">
              <div className="w-8 h-8 rounded-full bg-blue-500 border-2 border-white"></div>
              <div className="w-8 h-8 rounded-full bg-green-500 border-2 border-white"></div>
              <div className="w-8 h-8 rounded-full bg-purple-500 border-2 border-white"></div>
            </div>
          </div>
          <div className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-sm text-gray-600">8 résidents</span>
            </div>
            <h3 className="font-semibold text-lg mb-1">{prop.name}</h3>
            <p className="text-gray-600 text-sm mb-3">{prop.location} • 5 chambres</p>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                <span className="text-yellow-500">★</span>
                <span className="font-medium">{prop.rating}</span>
                <span className="text-gray-500 text-sm">({prop.reviews})</span>
              </div>
              <p className="text-lg font-bold text-gray-900">
                {prop.price}<span className="text-sm font-normal text-gray-600">/mois</span>
              </p>
            </div>
          </div>
        </div>
      ))}
    </>
  );
}

function HybridStats() {
  const stats = [
    { label: 'Revenus ce mois', value: '€3,240', change: '↑ 12%', gradient: 'from-[#7B5FB8] to-[#C98B9E]' },
    { label: "Taux d'occupation", value: '87%', change: '↑ 5%', gradient: 'from-[#7B5FB8] to-[#C98B9E]' },
    { label: 'Demandes en attente', value: '12', change: 'Voir →', gradient: 'from-[#7B5FB8] to-[#C98B9E]' },
  ];

  return (
    <>
      {stats.map((stat, i) => (
        <div
          key={i}
          className={`stat-card-demo rounded-2xl p-6 bg-gradient-to-br ${stat.gradient} bg-opacity-5 border border-[#7B5FB8]/20`}
        >
          <p className="text-sm font-medium text-gray-600 mb-2">{stat.label}</p>
          <p className="text-4xl font-bold text-[#7B5FB8] mb-2">{stat.value}</p>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-green-600 font-medium">{stat.change}</span>
            {stat.change.includes('↑') && <span className="text-gray-500">vs mois dernier</span>}
          </div>
        </div>
      ))}
    </>
  );
}

function HybridCTAs() {
  return (
    <>
      <button className="cta-searcher-demo px-8 py-3 rounded-xl text-white font-semibold transition-all duration-200">
        Trouver Mon Coliving
      </button>
      <button className="cta-owner-demo px-8 py-3 rounded-xl text-white font-semibold transition-all duration-200">
        Louer Ma Propriété
      </button>
      <button className="cta-brand-demo px-8 py-3 rounded-xl text-white font-semibold transition-all duration-200">
        Commencer Maintenant
      </button>
    </>
  );
}
