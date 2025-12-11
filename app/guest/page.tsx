'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Home,
  Users,
  Building2,
  Heart,
  MessageCircle,
  Calendar,
  MapPin,
  Euro,
  Bookmark,
  Target,
  TrendingUp,
  DollarSign,
  Clock,
  Wrench,
  UserPlus,
  LogIn,
  Lock,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  X,
  Star,
  Eye,
  Bed,
  Bath,
  Plus
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import Image from 'next/image';

type GuestView = 'searcher' | 'resident' | 'owner';

interface SearchCriteria {
  location: string | null;
  budgetMin: number | null;
  budgetMax: number | null;
  moveInDate: string | null;
}

// Mock data for property previews
const mockProperties = [
  {
    id: '1',
    title: 'Coliving Moderne Bruxelles',
    city: 'Bruxelles',
    neighborhood: 'Ixelles',
    monthly_rent: 750,
    bedrooms: 1,
    bathrooms: 1,
    main_image: null,
    compatibility_score: 87,
  },
  {
    id: '2',
    title: 'Appartement Partagé Centre',
    city: 'Bruxelles',
    neighborhood: 'Saint-Gilles',
    monthly_rent: 650,
    bedrooms: 1,
    bathrooms: 1,
    main_image: null,
    compatibility_score: 92,
  },
  {
    id: '3',
    title: 'Maison Coliving Verte',
    city: 'Bruxelles',
    neighborhood: 'Forest',
    monthly_rent: 580,
    bedrooms: 1,
    bathrooms: 1,
    main_image: null,
    compatibility_score: 78,
  },
];

// Mock roommates for swipe preview
const mockRoommates = [
  { id: '1', name: 'Marie L.', age: 26, score: 94, occupation: 'Designer' },
  { id: '2', name: 'Thomas B.', age: 28, score: 88, occupation: 'Développeur' },
  { id: '3', name: 'Sophie M.', age: 24, score: 91, occupation: 'Étudiante' },
];

function GuestPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeView, setActiveView] = useState<GuestView>('searcher');
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [lockedFeatureMessage, setLockedFeatureMessage] = useState('');

  // Parse search criteria from URL
  const searchCriteria: SearchCriteria = {
    location: searchParams.get('location'),
    budgetMin: searchParams.get('budget_min') ? parseInt(searchParams.get('budget_min')!) : null,
    budgetMax: searchParams.get('budget_max') ? parseInt(searchParams.get('budget_max')!) : null,
    moveInDate: searchParams.get('move_in_date'),
  };

  const hasSearchCriteria = searchCriteria.location || searchCriteria.budgetMin || searchCriteria.budgetMax || searchCriteria.moveInDate;

  const handleLockedFeature = (message: string) => {
    setLockedFeatureMessage(message);
    setShowSignupModal(true);
  };

  const viewTabs = [
    {
      id: 'searcher' as GuestView,
      label: 'Je cherche',
      icon: Search,
      description: 'Trouve ta colocation idéale',
      color: '#ff9811',
      bgColor: 'bg-orange-50',
    },
    {
      id: 'resident' as GuestView,
      label: 'Je vis en coloc',
      icon: Home,
      description: 'Gère ta vie en colocation',
      color: '#ee5736',
      bgColor: 'bg-rose-50',
    },
    {
      id: 'owner' as GuestView,
      label: 'Je suis proprio',
      icon: Building2,
      description: 'Gère tes propriétés',
      color: '#ad5684',
      bgColor: 'bg-purple-50',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with Sign Up CTA */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, #ad5684 0%, #ff9811 100%)' }}
              >
                <Home className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">
                <span style={{ color: '#ad5684' }}>Easy</span>
                <span style={{ color: '#ff9811' }}>Co</span>
              </span>
              <Badge variant="warning" size="sm" className="ml-2">
                Mode Découverte
              </Badge>
            </div>

            {/* Auth buttons */}
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push('/auth?mode=login')}
              >
                <LogIn className="w-4 h-4 mr-2" />
                Connexion
              </Button>
              <Button
                size="sm"
                onClick={() => router.push('/auth?mode=signup')}
                className="text-white font-semibold hover:brightness-110"
                style={{ background: '#ff9811' }}
              >
                <UserPlus className="w-4 h-4 mr-2" />
                Créer un compte
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* View Tabs - Main Navigation */}
      <div className="bg-white border-b border-gray-200 sticky top-[65px] z-40">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-center">
            <div className="relative inline-flex items-center bg-gray-100 rounded-2xl p-1.5">
              {/* Sliding pill background */}
              <motion.div
                className="absolute top-1.5 bottom-1.5 rounded-xl shadow-lg"
                style={{
                  background: activeView === 'searcher' ? '#ff9811' : activeView === 'resident' ? '#ee5736' : '#ad5684'
                }}
                initial={false}
                animate={{
                  left: activeView === 'searcher' ? '6px' : activeView === 'resident' ? 'calc(33.33% + 2px)' : 'calc(66.66% - 2px)',
                  width: 'calc(33.33% - 4px)',
                }}
                transition={{
                  type: 'spring',
                  stiffness: 400,
                  damping: 30,
                }}
              />

              {viewTabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeView === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveView(tab.id)}
                    className={cn(
                      "relative z-10 px-6 py-3 rounded-xl flex items-center gap-2 transition-all font-medium text-sm min-w-[140px] justify-center",
                      isActive ? 'text-white' : 'text-gray-600 hover:text-gray-900'
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="hidden sm:inline">{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Tab description */}
          <AnimatePresence mode="wait">
            <motion.p
              key={activeView}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="text-center text-gray-600 mt-3 text-sm"
            >
              {viewTabs.find(t => t.id === activeView)?.description}
            </motion.p>
          </AnimatePresence>
        </div>
      </div>

      {/* Content based on active view */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        <AnimatePresence mode="wait">
          {activeView === 'searcher' && (
            <SearcherGuestView
              key="searcher"
              onLockedFeature={handleLockedFeature}
              router={router}
              searchCriteria={searchCriteria}
            />
          )}
          {activeView === 'resident' && (
            <ResidentGuestView
              key="resident"
              onLockedFeature={handleLockedFeature}
              router={router}
            />
          )}
          {activeView === 'owner' && (
            <OwnerGuestView
              key="owner"
              onLockedFeature={handleLockedFeature}
              router={router}
            />
          )}
        </AnimatePresence>
      </main>

      {/* Bottom CTA Bar - Fixed */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-gray-200 p-4 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="hidden sm:block">
            <p className="font-semibold text-gray-900">Prêt à commencer ?</p>
            <p className="text-sm text-gray-600">Crée ton compte gratuitement en 2 minutes</p>
          </div>
          <div className="flex gap-3 w-full sm:w-auto">
            <Button
              onClick={() => router.push('/auth?mode=signup')}
              className="flex-1 sm:flex-none text-white font-semibold hover:brightness-110"
              style={{ background: '#ff9811' }}
              size="lg"
            >
              <UserPlus className="w-5 h-5 mr-2" />
              Créer mon compte
            </Button>
          </div>
        </div>
      </div>

      {/* Signup Modal */}
      <AnimatePresence>
        {showSignupModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
            onClick={() => setShowSignupModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl max-w-md w-full p-8 relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setShowSignupModal(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="text-center">
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
                  style={{ background: '#ff981120' }}
                >
                  <Lock className="w-8 h-8" style={{ color: '#ff9811' }} />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Fonctionnalité Premium
                </h3>
                <p className="text-gray-600 mb-6">
                  {lockedFeatureMessage || 'Crée un compte gratuit pour débloquer cette fonctionnalité et bien plus encore !'}
                </p>

                <div className="space-y-3 mb-6 text-left">
                  {[
                    'Matching intelligent avec colocataires',
                    'Messagerie avec propriétaires',
                    'Sauvegarder tes favoris',
                    'Alertes personnalisées',
                  ].map((benefit, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                      <span className="text-gray-700">{benefit}</span>
                    </div>
                  ))}
                </div>

                <div className="flex flex-col gap-3">
                  <Button
                    onClick={() => router.push('/auth?mode=signup')}
                    className="w-full text-white font-semibold hover:brightness-110"
                    style={{ background: '#ff9811' }}
                    size="lg"
                  >
                    <UserPlus className="w-5 h-5 mr-2" />
                    Créer mon compte gratuit
                  </Button>
                  <Button
                    onClick={() => router.push('/auth?mode=login')}
                    variant="outline"
                    className="w-full"
                  >
                    J'ai déjà un compte
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Spacer for fixed bottom bar */}
      <div className="h-24" />
    </div>
  );
}

// Searcher Guest View
function SearcherGuestView({
  onLockedFeature,
  router,
  searchCriteria,
}: {
  onLockedFeature: (msg: string) => void;
  router: any;
  searchCriteria: SearchCriteria;
}) {
  const hasSearchCriteria = searchCriteria.location || searchCriteria.budgetMin || searchCriteria.budgetMax || searchCriteria.moveInDate;

  // Format move-in date for display
  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return null;
    const date = new Date(dateStr);
    return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Search Criteria Banner - Only show if criteria exist */}
      {hasSearchCriteria && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-sm p-4"
          style={{ borderColor: '#ff981140', border: '1px solid' }}
        >
          <div className="flex items-center gap-2 mb-3">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: '#ff9811' }}
            >
              <Search className="w-4 h-4 text-white" />
            </div>
            <h3 className="font-semibold text-gray-900">Ta recherche</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {searchCriteria.location && (
              <Badge variant="default" className="flex items-center gap-1.5 px-3 py-1.5" style={{ background: '#ff981120', color: '#ff9811', borderColor: '#ff981140' }}>
                <MapPin className="w-3.5 h-3.5" />
                {searchCriteria.location}
              </Badge>
            )}
            {(searchCriteria.budgetMin || searchCriteria.budgetMax) && (
              <Badge variant="default" className="flex items-center gap-1.5 px-3 py-1.5" style={{ background: '#ff981120', color: '#ff9811', borderColor: '#ff981140' }}>
                <Euro className="w-3.5 h-3.5" />
                {searchCriteria.budgetMin && searchCriteria.budgetMax
                  ? `${searchCriteria.budgetMin}€ - ${searchCriteria.budgetMax}€`
                  : searchCriteria.budgetMin
                    ? `Min ${searchCriteria.budgetMin}€`
                    : `Max ${searchCriteria.budgetMax}€`
                }
              </Badge>
            )}
            {searchCriteria.moveInDate && (
              <Badge variant="default" className="flex items-center gap-1.5 px-3 py-1.5" style={{ background: '#ff981120', color: '#ff9811', borderColor: '#ff981140' }}>
                <Calendar className="w-3.5 h-3.5" />
                {formatDate(searchCriteria.moveInDate)}
              </Badge>
            )}
          </div>
          <p className="text-sm text-gray-500 mt-3">
            <Sparkles className="w-4 h-4 inline mr-1" style={{ color: '#ff9811' }} />
            Crée un compte pour sauvegarder ta recherche et recevoir des alertes
          </p>
        </motion.div>
      )}

      {/* Fake Dashboard Compact */}
      <div className="relative overflow-hidden rounded-3xl shadow-xl p-4" style={{ background: 'linear-gradient(135deg, #ff9811 0%, #FFB85C 100%)' }}>
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }} />

        <div className="relative z-10">
          {/* Profile header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-white/30 flex items-center justify-center border-2 border-white/50">
                <span className="text-white text-lg font-bold">?</span>
              </div>
              <div>
                <h1 className="text-base font-bold text-white drop-shadow-md">
                  {hasSearchCriteria ? 'Résultats de recherche' : 'Bienvenue !'}
                </h1>
                <p className="text-xs text-white/90 drop-shadow-sm">
                  {hasSearchCriteria
                    ? `${mockProperties.length} propriétés correspondent`
                    : 'Découvre EasyCo en mode invité'
                  }
                </p>
              </div>
            </div>
          </div>

          {/* KPI Grid */}
          <div className="grid grid-cols-4 gap-2 mb-3">
            {[
              { icon: Users, label: 'Groupes', value: '?', locked: true },
              { icon: Bookmark, label: 'Favoris', value: '?', locked: true },
              { icon: MessageCircle, label: 'Messages', value: '?', locked: true },
              { icon: Target, label: 'Profil', value: '0%', locked: false },
            ].map((item, idx) => {
              const Icon = item.icon;
              return (
                <button
                  key={idx}
                  onClick={() => item.locked && onLockedFeature('Crée ton compte pour accéder à cette fonctionnalité')}
                  className={cn(
                    "bg-white/25 backdrop-blur-sm rounded-xl py-2.5 px-2 transition text-center shadow-sm relative",
                    item.locked && "cursor-pointer hover:bg-white/35"
                  )}
                >
                  {item.locked && (
                    <div className="absolute top-1 right-1">
                      <Lock className="w-3 h-3 text-white/70" />
                    </div>
                  )}
                  <Icon className="w-5 h-5 text-white mx-auto mb-0.5 drop-shadow-sm" />
                  <p className="text-xl font-bold text-white drop-shadow-md">{item.value}</p>
                  <p className="text-[10px] text-white font-medium drop-shadow-sm">{item.label}</p>
                </button>
              );
            })}
          </div>

          {/* Search preferences teaser */}
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Target className="w-4 h-4 text-white drop-shadow-sm" />
                <div className="text-left">
                  <p className="text-sm font-semibold text-white drop-shadow-md">Ma Recherche</p>
                  <p className="text-xs text-white/90 font-medium drop-shadow-sm">
                    {hasSearchCriteria ? 'Critères actifs' : 'Configure tes préférences'}
                  </p>
                </div>
              </div>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onLockedFeature('Crée ton compte pour configurer tes préférences de recherche')}
                className="text-white hover:bg-white/20"
              >
                <Lock className="w-3 h-3 mr-1" />
                {hasSearchCriteria ? 'Modifier' : 'Configurer'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Properties Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">Propriétés disponibles</h2>
          <Badge variant="default" style={{ background: '#ff981120', color: '#ff9811', borderColor: '#ff981140' }}>
            Aperçu limité
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {mockProperties.map((property, idx) => (
            <motion.div
              key={property.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
            >
              {/* Property Image */}
              <div className="relative h-40" style={{ background: '#ff981120' }}>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Home className="w-12 h-12" style={{ color: '#ff981160' }} />
                </div>
                {/* Compatibility Badge - Blurred */}
                <div className="absolute top-3 right-3">
                  <div
                    className="px-3 py-1.5 rounded-xl flex items-center gap-1.5 cursor-pointer"
                    style={{ background: '#ff9811' }}
                    onClick={() => onLockedFeature('Crée ton compte pour voir ton score de compatibilité')}
                  >
                    <Sparkles className="w-3.5 h-3.5 text-white" />
                    <span className="text-white font-bold text-sm blur-[3px]">{property.compatibility_score}%</span>
                    <Lock className="w-3 h-3 text-white/80" />
                  </div>
                </div>
              </div>

              {/* Property Info */}
              <div className="p-4">
                <h3 className="font-bold text-gray-900 mb-1">{property.title}</h3>
                <div className="flex items-center gap-1 text-sm text-gray-600 mb-3">
                  <MapPin className="w-4 h-4" />
                  <span>{property.neighborhood}, {property.city}</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Bed className="w-4 h-4" />
                      {property.bedrooms}
                    </div>
                    <div className="flex items-center gap-1">
                      <Bath className="w-4 h-4" />
                      {property.bathrooms}
                    </div>
                  </div>
                  <p className="text-lg font-bold" style={{ color: '#ff9811' }}>
                    {property.monthly_rent}€<span className="text-sm font-normal text-gray-500">/mois</span>
                  </p>
                </div>

                {/* Action buttons */}
                <div className="flex gap-2 mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => onLockedFeature('Crée ton compte pour sauvegarder des favoris')}
                  >
                    <Heart className="w-4 h-4 mr-1" />
                    Favori
                  </Button>
                  <Button
                    size="sm"
                    className="flex-1 text-white hover:brightness-110"
                    style={{ background: '#ff9811' }}
                    onClick={() => onLockedFeature('Crée ton compte pour contacter le propriétaire')}
                  >
                    Contacter
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Matching Section - Teaser */}
      <div className="relative overflow-hidden rounded-3xl p-6" style={{ background: 'linear-gradient(135deg, #ff981115, #ee573615)', borderColor: '#ff981140', border: '1px solid' }}>
        <div className="flex flex-col lg:flex-row items-center gap-6">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, #ee5736, #ff9811)' }}
              >
                <Users className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Trouve tes colocataires idéaux</h3>
              <Lock className="w-5 h-5" style={{ color: '#ff9811' }} />
            </div>
            <p className="text-gray-600 mb-4">
              Notre algorithme de matching te connecte avec des personnes qui partagent ton style de vie,
              tes horaires et tes valeurs. Swipe pour créer ton groupe parfait !
            </p>
            <Button
              onClick={() => onLockedFeature('Crée ton compte pour accéder au matching intelligent')}
              className="text-white font-semibold hover:brightness-110"
              style={{ background: 'linear-gradient(135deg, #ee5736, #ff9811)' }}
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Découvrir le matching
            </Button>
          </div>

          {/* Mini profile cards preview */}
          <div className="relative w-64 h-40">
            {mockRoommates.slice(0, 3).map((mate, idx) => (
              <div
                key={mate.id}
                className={cn(
                  "absolute w-48 h-32 bg-white rounded-2xl shadow-lg p-3 border border-gray-200",
                  idx === 0 && "top-0 left-0 rotate-[-6deg] z-10",
                  idx === 1 && "top-2 left-4 rotate-[3deg] z-20",
                  idx === 2 && "top-4 left-8 rotate-[-2deg] z-30"
                )}
              >
                <div className="flex items-center gap-2 mb-2">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
                    style={{ background: '#ff981140', color: '#ff9811' }}
                  >
                    {mate.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-gray-900">{mate.name}</p>
                    <p className="text-xs text-gray-500">{mate.occupation}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full w-fit blur-[2px]">
                  <Sparkles className="w-3 h-3" />
                  <span>{mate.score}% compatible</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// Resident Guest View
function ResidentGuestView({
  onLockedFeature,
  router,
}: {
  onLockedFeature: (msg: string) => void;
  router: any;
}) {
  const kpiCards = [
    { title: 'Loyer du Mois', value: '€???/???', icon: Home, locked: true },
    { title: 'Dépenses Partagées', value: '€???', icon: DollarSign, locked: true },
    { title: 'Ton Solde', value: '€???', icon: TrendingUp, locked: true },
    { title: 'Colocataires', value: '?', icon: Users, locked: true },
  ];

  const features = [
    {
      icon: DollarSign,
      title: 'Gestion des dépenses',
      description: 'Partage équitable des courses, factures et loyer avec tes colocs',
    },
    {
      icon: Calendar,
      title: 'Planning partagé',
      description: 'Coordonne les tâches ménagères et événements de la maison',
    },
    {
      icon: MessageCircle,
      title: 'Chat de groupe',
      description: 'Communique facilement avec tous tes colocataires',
    },
    {
      icon: Wrench,
      title: 'Maintenance',
      description: 'Signale et suis les réparations avec ton propriétaire',
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Intro */}
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Simplifie ta vie en colocation
        </h2>
        <p className="text-gray-600">
          Gère les dépenses, planifie les tâches et communique avec tes colocs en un seul endroit
        </p>
      </div>

      {/* KPI Cards Preview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {kpiCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              onClick={() => onLockedFeature('Crée ton compte pour accéder au dashboard résident')}
              className="relative overflow-hidden rounded-2xl bg-white p-4 shadow-sm border border-gray-200 cursor-pointer hover:shadow-md transition-all group"
            >
              <div className="absolute top-2 right-2">
                <Lock className="w-4 h-4 group-hover:scale-110 transition" style={{ color: '#ee5736' }} />
              </div>

              <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{ background: '#ee573620' }}>
                <Icon className="w-5 h-5" style={{ color: '#ee5736' }} />
              </div>

              <p className="text-xs font-medium text-gray-500 mb-1">{card.title}</p>
              <p className="text-xl font-bold text-gray-900 blur-[4px]">{card.value}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {features.map((feature, idx) => {
          const Icon = feature.icon;
          return (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + idx * 0.1 }}
              onClick={() => onLockedFeature(`Crée ton compte pour accéder à "${feature.title}"`)}
              className="bg-white rounded-2xl p-5 shadow-sm border cursor-pointer hover:shadow-md transition-all group"
              style={{ borderColor: '#ee573640' }}
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition" style={{ background: '#ee573620' }}>
                  <Icon className="w-6 h-6" style={{ color: '#ee5736' }} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-gray-900">{feature.title}</h3>
                    <Lock className="w-4 h-4" style={{ color: '#ee5736' }} />
                  </div>
                  <p className="text-sm text-gray-600">{feature.description}</p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Mock Residence Card */}
      <div className="relative overflow-hidden rounded-3xl p-6" style={{ background: '#ee573610', borderColor: '#ee573640', border: '1px solid' }}>
        <div className="flex flex-col md:flex-row gap-6 items-center">
          {/* Property preview */}
          <div className="w-full md:w-64 h-40 rounded-2xl flex items-center justify-center" style={{ background: '#ee573640' }}>
            <Home className="w-16 h-16" style={{ color: '#ee5736' }} />
          </div>

          <div className="flex-1 text-center md:text-left">
            <h3 className="text-xl font-bold text-gray-900 mb-2">Ta future résidence</h3>
            <p className="text-gray-600 mb-4">
              Une fois que tu auras rejoint une colocation, tu pourras gérer toute ta vie
              de coloc depuis ce dashboard : dépenses, tâches, communications...
            </p>
            <div className="flex flex-wrap gap-2 justify-center md:justify-start">
              {['Gestion loyer', 'Tâches partagées', 'Chat groupe', 'Événements'].map((tag) => (
                <Badge key={tag} variant="default" style={{ background: '#ee573620', color: '#ee5736', borderColor: '#ee573640' }}>
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// Owner Guest View
function OwnerGuestView({
  onLockedFeature,
  router,
}: {
  onLockedFeature: (msg: string) => void;
  router: any;
}) {
  const kpiCards = [
    { title: 'Revenus Mensuels', value: '€???', change: '+??%', icon: DollarSign },
    { title: 'Propriétés', value: '?', subtitle: '? publiées', icon: Building2 },
    { title: "Taux d'Occupation", value: '??%', change: '+?%', icon: TrendingUp },
    { title: 'Candidatures', value: '?', subtitle: 'En attente', icon: Users },
  ];

  const features = [
    {
      icon: Building2,
      title: 'Gestion des propriétés',
      description: 'Publie et gère toutes tes annonces de coliving en un seul endroit',
    },
    {
      icon: Users,
      title: 'Sélection des locataires',
      description: 'Reçois des candidatures de profils compatibles et pré-qualifiés',
    },
    {
      icon: DollarSign,
      title: 'Suivi financier',
      description: 'Visualise tes revenus, dépenses et rentabilité en temps réel',
    },
    {
      icon: MessageCircle,
      title: 'Communication',
      description: 'Échange facilement avec tes locataires actuels et potentiels',
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Intro */}
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Gérez votre portefeuille coliving
        </h2>
        <p className="text-gray-600">
          Publiez vos annonces, trouvez les meilleurs locataires et suivez vos performances
        </p>
      </div>

      {/* KPI Cards Preview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {kpiCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              onClick={() => onLockedFeature('Créez votre compte propriétaire pour accéder au dashboard')}
              className="relative overflow-hidden rounded-2xl bg-white p-4 shadow-sm border border-gray-200 cursor-pointer hover:shadow-md transition-all group"
            >
              <div className="absolute top-2 right-2">
                <Lock className="w-4 h-4 group-hover:scale-110 transition" style={{ color: '#ad5684' }} />
              </div>

              <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{ background: '#ad568420' }}>
                <Icon className="w-5 h-5" style={{ color: '#ad5684' }} />
              </div>

              <p className="text-xs font-medium text-gray-500 mb-1">{card.title}</p>
              <p className="text-xl font-bold text-gray-900 blur-[4px]">{card.value}</p>
              {card.change && (
                <p className="text-xs text-green-600 font-medium blur-[3px]">{card.change}</p>
              )}
              {card.subtitle && (
                <p className="text-xs text-gray-500">{card.subtitle}</p>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {features.map((feature, idx) => {
          const Icon = feature.icon;
          return (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + idx * 0.1 }}
              onClick={() => onLockedFeature(`Créez votre compte pour accéder à "${feature.title}"`)}
              className="bg-white rounded-2xl p-5 shadow-sm border cursor-pointer hover:shadow-md transition-all group"
              style={{ borderColor: '#ad568440' }}
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition" style={{ background: '#ad568420' }}>
                  <Icon className="w-6 h-6" style={{ color: '#ad5684' }} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-gray-900">{feature.title}</h3>
                    <Lock className="w-4 h-4" style={{ color: '#ad5684' }} />
                  </div>
                  <p className="text-sm text-gray-600">{feature.description}</p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Add Property CTA */}
      <div className="relative overflow-hidden rounded-3xl p-8 text-center" style={{ background: '#ad568410', borderColor: '#ad568440', border: '1px solid' }}>
        <div className="max-w-md mx-auto">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ background: '#ad5684' }}>
            <Plus className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            Commencez à publier vos propriétés
          </h3>
          <p className="text-gray-600 mb-6">
            Créez votre compte propriétaire et publiez votre première annonce gratuitement.
            Atteignez des milliers de colocataires potentiels.
          </p>
          <Button
            onClick={() => router.push('/auth?mode=signup&role=owner')}
            size="lg"
            className="text-white font-semibold hover:brightness-110"
            style={{ background: '#ad5684' }}
          >
            <Building2 className="w-5 h-5 mr-2" />
            Créer mon compte propriétaire
          </Button>
        </div>
      </div>

      {/* Mock Chart Preview */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-gray-900 flex items-center gap-2">
            <TrendingUp className="w-5 h-5" style={{ color: '#ad5684' }} />
            Évolution des revenus
          </h3>
          <Lock className="w-5 h-5" style={{ color: '#ad5684' }} />
        </div>
        <div className="h-48 rounded-xl flex items-center justify-center border border-dashed" style={{ background: '#ad568410', borderColor: '#ad568440' }}>
          <div className="text-center">
            <Eye className="w-10 h-10 mx-auto mb-2" style={{ color: '#ad568460' }} />
            <p className="text-sm text-gray-500">Graphiques disponibles après inscription</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// Main export with Suspense for useSearchParams
export default function GuestPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-t-transparent rounded-full animate-spin mx-auto mb-4" style={{ borderColor: '#ff9811', borderTopColor: 'transparent' }} />
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    }>
      <GuestPageContent />
    </Suspense>
  );
}