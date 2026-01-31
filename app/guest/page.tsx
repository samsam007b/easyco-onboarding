'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import {
  Search,
  MapPin,
  Euro,
  Bed,
  Bath,
  Home,
  UserPlus,
  LogIn,
  ArrowRight,
  Sparkles,
  X,
  SlidersHorizontal,
  Heart,
  Users,
  Lock,
  CheckCircle2,
  Zap,
  Shield,
  Star,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { createClient } from '@/lib/auth/supabase-client';
import { useTheme } from '@/contexts/ThemeContext';
import Footer from '@/components/layout/Footer';

// ============================================
// V3-fun Searcher Color System
// ============================================
const SEARCHER_COLORS = {
  primary: '#ffa000',
  hover: '#D98400',
  accent: '#FBBF24',
  subtle: '#FCD34D',
  light: '#FDE68A',
  dark: '#A16300',
  card: '#FFFBEB',
  cardDark: 'rgba(255, 160, 0, 0.08)',
  blob: '#FEF3C7',
  blobDark: 'rgba(255, 160, 0, 0.15)',
  text: '#A16300',
  textDark: '#F5F5F7',
  border: 'rgba(255, 160, 0, 0.15)',
  gradient: 'linear-gradient(135deg, #ffa000 0%, #D98400 100%)',
  badgeBg: 'rgba(255, 160, 0, 0.12)',
  badgeBgDark: 'rgba(255, 160, 0, 0.2)',
  matchingTeaser: 'rgba(255, 160, 0, 0.9)',
};

// Signature Gradient Izzico (Brand Identity)
const SIGNATURE_GRADIENT = 'linear-gradient(135deg, #9c5698 0%, #c85570 20%, #d15659 35%, #e05747 50%, #ff7c10 75%, #ffa000 100%)';

interface Property {
  id: string;
  title: string;
  city: string;
  neighborhood?: string;
  monthly_rent: number;
  bedrooms?: number;
  bathrooms?: number;
  images?: string[];
  property_type?: string;
  available_from?: string;
  status?: string;
}

function GuestPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';
  const supabase = createClient();

  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('location') || '');
  const [showFilters, setShowFilters] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [lockedFeatureMessage, setLockedFeatureMessage] = useState('');

  // Filters
  const [minBudget, setMinBudget] = useState<string>('');
  const [maxBudget, setMaxBudget] = useState<string>('');

  useEffect(() => {
    loadProperties();
  }, []);

  const loadProperties = async () => {
    try {
      setIsLoading(true);

      const { data, error } = await supabase
        .from('properties')
        .select('id, title, city, neighborhood, monthly_rent, bedrooms, bathrooms, images, property_type, available_from, status')
        .eq('status', 'published')
        .order('created_at', { ascending: false })
        .limit(12);

      if (error) {
        console.error('Error fetching properties:', error);
        return;
      }

      setProperties(data || []);
    } catch (error) {
      console.error('Error loading properties:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredProperties = properties.filter((property) => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchesSearch =
        property.city?.toLowerCase().includes(query) ||
        property.neighborhood?.toLowerCase().includes(query) ||
        property.title?.toLowerCase().includes(query);
      if (!matchesSearch) return false;
    }

    if (minBudget && property.monthly_rent < parseInt(minBudget)) return false;
    if (maxBudget && property.monthly_rent > parseInt(maxBudget)) return false;

    return true;
  });

  const handleLockedFeature = (message: string) => {
    setLockedFeatureMessage(message);
    setShowSignupModal(true);
  };

  const handlePropertyClick = (propertyId: string) => {
    router.push(`/properties/${propertyId}`);
  };

  // Generate random "fake" match score for teaser (seeded by property id)
  const getFakeMatchScore = (propertyId: string) => {
    const hash = propertyId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return 75 + (hash % 20); // 75-94%
  };

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-950' : 'bg-gray-50'}`}>
      {/* Header */}
      <header className={`sticky top-0 z-50 backdrop-blur-md border-b ${isDark ? 'bg-gray-950/95 border-gray-800' : 'bg-white/95 border-gray-200'}`}>
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3">
              <Image
                src={isDark ? '/logos/izzico-lockup-squircle-epais-blanc.svg' : '/logos/izzico-lockup-squircle-epais-noir.svg'}
                alt="Izzico"
                width={140}
                height={40}
                className="h-10 w-auto"
              />
              <Badge
                className="font-medium superellipse-lg"
                style={{ background: SEARCHER_COLORS.badgeBg, color: SEARCHER_COLORS.dark, border: `1px solid ${SEARCHER_COLORS.border}` }}
              >
                Mode découverte
              </Badge>
            </Link>

            {/* Auth buttons */}
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push('/auth/login')}
                className={isDark ? 'text-gray-300' : 'text-gray-600'}
              >
                <LogIn className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Connexion</span>
              </Button>
              <Button
                size="sm"
                onClick={() => router.push('/auth/signup')}
                className="text-white font-semibold hover:brightness-110 superellipse-lg"
                style={{ background: SEARCHER_COLORS.primary }}
              >
                <UserPlus className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Créer un compte</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section with V3-fun glassmorphism */}
      <section className="relative py-16 px-4 overflow-hidden">
        {/* Background gradient blob */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] blur-3xl opacity-30"
          style={{ background: `radial-gradient(ellipse at center, ${SEARCHER_COLORS.primary} 0%, transparent 70%)` }}
        />

        <div className="max-w-4xl mx-auto text-center relative z-10">
          {/* Glassmorphism container */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="superellipse-3xl p-8 md:p-12 mb-8"
            style={{
              background: isDark
                ? 'linear-gradient(135deg, rgba(255, 160, 0, 0.12) 0%, rgba(255, 160, 0, 0.06) 100%)'
                : 'linear-gradient(135deg, rgba(255, 160, 0, 0.18) 0%, rgba(255, 251, 235, 0.9) 100%)',
              backdropFilter: 'blur(40px) saturate(180%)',
              WebkitBackdropFilter: 'blur(40px) saturate(180%)',
              boxShadow: isDark
                ? 'inset 0 0 60px rgba(255, 160, 0, 0.1), 0 20px 60px -20px rgba(0, 0, 0, 0.4)'
                : 'inset 0 0 60px rgba(255, 255, 255, 0.5), 0 20px 60px -20px rgba(255, 160, 0, 0.2)',
              border: isDark
                ? '1px solid rgba(255, 160, 0, 0.15)'
                : '1px solid rgba(255, 255, 255, 0.6)',
            }}
          >
            <h1 className={`text-4xl md:text-5xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Trouve ton{' '}
              <span style={{ color: SEARCHER_COLORS.primary }}>co-living</span>{' '}
              idéal
            </h1>
            <p className={`text-lg mb-8 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              Explore les propriétés disponibles à Bruxelles et trouve ta future colocation
            </p>

            {/* Search Bar */}
            <div className={`flex flex-col sm:flex-row gap-3 max-w-2xl mx-auto p-3 superellipse-2xl ${isDark ? 'bg-gray-900/80' : 'bg-white/90'} shadow-xl`}>
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: SEARCHER_COLORS.primary }} />
                <Input
                  type="text"
                  placeholder="Rechercher par ville ou quartier..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`pl-10 h-12 superellipse-xl border-2 focus:border-[#ffa000] ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'}`}
                />
              </div>
              <Button
                onClick={() => setShowFilters(!showFilters)}
                className="h-12 gap-2 superellipse-xl text-white font-semibold"
                style={{ background: SEARCHER_COLORS.primary }}
              >
                <SlidersHorizontal className="w-4 h-4" />
                Filtres
              </Button>
            </div>

            {/* Filters Panel */}
            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className={`mt-4 p-4 superellipse-xl max-w-2xl mx-auto ${isDark ? 'bg-gray-900/80' : 'bg-white/90'} shadow-lg`}
                >
                  <div className="flex flex-wrap items-center justify-center gap-4">
                    <div className="flex items-center gap-2">
                      <Euro className="w-4 h-4" style={{ color: SEARCHER_COLORS.primary }} />
                      <Input
                        type="number"
                        placeholder="Min €"
                        value={minBudget}
                        onChange={(e) => setMinBudget(e.target.value)}
                        className={`w-24 h-10 superellipse-lg ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'}`}
                      />
                      <span className="text-gray-400">-</span>
                      <Input
                        type="number"
                        placeholder="Max €"
                        value={maxBudget}
                        onChange={(e) => setMaxBudget(e.target.value)}
                        className={`w-24 h-10 superellipse-lg ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'}`}
                      />
                    </div>
                    {(minBudget || maxBudget || searchQuery) && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSearchQuery('');
                          setMinBudget('');
                          setMaxBudget('');
                        }}
                        className="text-gray-500"
                      >
                        <X className="w-4 h-4 mr-1" />
                        Effacer
                      </Button>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Value Props */}
          <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto">
            {[
              { icon: Shield, label: 'Annonces vérifiées' },
              { icon: Users, label: 'Colocs compatibles' },
              { icon: Zap, label: 'Matching intelligent' },
            ].map((prop, idx) => (
              <motion.div
                key={prop.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + idx * 0.1 }}
                className={`flex flex-col items-center gap-2 p-3 superellipse-xl ${isDark ? 'bg-gray-900/50' : 'bg-white/70'}`}
              >
                <prop.icon className="w-5 h-5" style={{ color: SEARCHER_COLORS.primary }} />
                <span className={`text-xs font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{prop.label}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Properties Grid */}
      <main className="max-w-7xl mx-auto px-4 pb-32">
        {/* Results Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Propriétés disponibles
            </h2>
            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              {filteredProperties.length} {filteredProperties.length === 1 ? 'résultat' : 'résultats'}
            </p>
          </div>
          <Button
            onClick={() => router.push('/auth/signup')}
            variant="outline"
            className="gap-2 superellipse-lg"
            style={{ borderColor: SEARCHER_COLORS.primary, color: SEARCHER_COLORS.dark }}
          >
            <Sparkles className="w-4 h-4" />
            Voir mon % de match
          </Button>
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, idx) => (
              <div
                key={idx}
                className={`superellipse-2xl overflow-hidden ${isDark ? 'bg-gray-900' : 'bg-white'} shadow-sm`}
              >
                <div className={`h-48 ${isDark ? 'bg-gray-800' : 'bg-gray-100'} animate-pulse`} />
                <div className="p-4 space-y-3">
                  <div className={`h-5 ${isDark ? 'bg-gray-800' : 'bg-gray-100'} superellipse-lg animate-pulse w-3/4`} />
                  <div className={`h-4 ${isDark ? 'bg-gray-800' : 'bg-gray-100'} superellipse-lg animate-pulse w-1/2`} />
                </div>
              </div>
            ))}
          </div>
        ) : filteredProperties.length === 0 ? (
          /* Empty State */
          <div className={`text-center py-16 superellipse-3xl ${isDark ? 'bg-gray-900' : 'bg-white'}`}>
            <Home className={`w-16 h-16 mx-auto mb-4 ${isDark ? 'text-gray-700' : 'text-gray-300'}`} />
            <h3 className={`text-xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Aucune propriété trouvée
            </h3>
            <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
              Essaie d'ajuster tes filtres de recherche
            </p>
          </div>
        ) : (
          <>
            {/* Properties Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProperties.map((property, idx) => (
                <motion.div
                  key={property.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  onClick={() => handlePropertyClick(property.id)}
                  className={`group cursor-pointer superellipse-2xl overflow-hidden border-2 transition-all duration-300 hover:shadow-xl ${
                    isDark
                      ? 'bg-gray-900 border-gray-800 hover:border-[#ffa000]/30'
                      : 'bg-white border-gray-100 hover:border-[#ffa000]/40'
                  }`}
                  style={{
                    boxShadow: isDark
                      ? '0 4px 20px rgba(0, 0, 0, 0.3)'
                      : '0 4px 20px rgba(255, 160, 0, 0.08)',
                  }}
                >
                  {/* Property Image */}
                  <div className="relative h-48 overflow-hidden">
                    {property.images && property.images.length > 0 ? (
                      <img
                        src={property.images[0]}
                        alt={property.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div
                        className="w-full h-full flex items-center justify-center"
                        style={{ background: isDark ? SEARCHER_COLORS.cardDark : SEARCHER_COLORS.card }}
                      >
                        <Home className="w-12 h-12" style={{ color: SEARCHER_COLORS.subtle }} />
                      </div>
                    )}

                    {/* Matching Teaser Badge - V3-fun style */}
                    <div
                      className="absolute top-3 left-3 px-3 py-1.5 superellipse-xl text-sm font-bold shadow-lg flex items-center gap-1.5 cursor-pointer"
                      style={{
                        background: SEARCHER_COLORS.matchingTeaser,
                        color: 'white',
                        backdropFilter: 'blur(8px)',
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleLockedFeature('Crée ton compte pour voir ton % de compatibilité avec ce bien');
                      }}
                    >
                      <span className="blur-[2px] select-none">{getFakeMatchScore(property.id)}%</span>
                      <span className="text-xs opacity-80">Match</span>
                      <Lock className="w-3 h-3 opacity-70" />
                    </div>

                    {/* Favorite button */}
                    <button
                      className="absolute top-3 right-3 w-9 h-9 superellipse-lg flex items-center justify-center bg-white/90 backdrop-blur-md shadow-lg hover:scale-110 transition-transform"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleLockedFeature('Crée ton compte pour sauvegarder tes favoris');
                      }}
                    >
                      <Heart className="w-5 h-5 text-gray-400" />
                    </button>

                    {/* Price Badge */}
                    <div className="absolute bottom-3 left-3">
                      <div
                        className="px-3 py-1.5 superellipse-xl backdrop-blur-md font-bold text-white shadow-lg"
                        style={{ background: SEARCHER_COLORS.gradient }}
                      >
                        {property.monthly_rent}€<span className="text-sm font-normal opacity-80">/mois</span>
                      </div>
                    </div>

                    {/* Location on image */}
                    <div className="absolute bottom-3 right-3 flex items-center gap-1.5 text-white text-sm font-medium drop-shadow-lg">
                      <MapPin className="w-4 h-4" />
                      <span>{property.city}</span>
                    </div>
                  </div>

                  {/* Property Info */}
                  <div className="p-4">
                    <h3 className={`font-bold text-lg mb-2 line-clamp-1 group-hover:text-[#ffa000] transition-colors ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {property.title}
                    </h3>

                    <div className={`flex items-center gap-1 text-sm mb-3 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      <MapPin className="w-4 h-4" />
                      <span>
                        {property.neighborhood ? `${property.neighborhood}, ` : ''}
                        {property.city}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className={`flex items-center gap-4 text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        {property.bedrooms && (
                          <div className="flex items-center gap-1">
                            <Bed className="w-4 h-4" />
                            <span>{property.bedrooms}</span>
                          </div>
                        )}
                        {property.bathrooms && (
                          <div className="flex items-center gap-1">
                            <Bath className="w-4 h-4" />
                            <span>{property.bathrooms}</span>
                          </div>
                        )}
                      </div>

                      <div
                        className="w-8 h-8 superellipse-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        style={{ background: SEARCHER_COLORS.badgeBg }}
                      >
                        <ArrowRight className="w-4 h-4" style={{ color: SEARCHER_COLORS.primary }} />
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Inline CTA after 3rd property */}
            {filteredProperties.length >= 3 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-8 p-6 superellipse-2xl text-center"
                style={{
                  background: isDark
                    ? 'linear-gradient(135deg, rgba(255, 160, 0, 0.15) 0%, rgba(255, 160, 0, 0.08) 100%)'
                    : 'linear-gradient(135deg, rgba(255, 160, 0, 0.12) 0%, rgba(255, 251, 235, 0.8) 100%)',
                  border: `2px dashed ${SEARCHER_COLORS.primary}40`,
                }}
              >
                <Sparkles className="w-8 h-8 mx-auto mb-3" style={{ color: SEARCHER_COLORS.primary }} />
                <h3 className={`text-lg font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Découvre ton score de compatibilité
                </h3>
                <p className={`text-sm mb-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  Crée ton Living Persona et vois quels biens matchent vraiment avec toi
                </p>
                <Button
                  onClick={() => router.push('/auth/signup')}
                  className="text-white font-semibold superellipse-xl"
                  style={{ background: SEARCHER_COLORS.gradient }}
                >
                  <UserPlus className="w-4 h-4 mr-2" />
                  Créer mon profil gratuit
                </Button>
              </motion.div>
            )}
          </>
        )}

        {/* Bottom CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-12 p-8 superellipse-3xl text-center relative overflow-hidden"
          style={{ background: SIGNATURE_GRADIENT }}
        >
          {/* Decorative elements */}
          <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />

          <div className="relative z-10">
            <Sparkles className="w-12 h-12 text-white mx-auto mb-4" />
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-3">
              Prêt à trouver ton co-living idéal ?
            </h3>
            <p className="text-white/90 mb-6 max-w-lg mx-auto">
              Crée ton compte gratuit pour accéder au matching intelligent, sauvegarder tes favoris et contacter les propriétaires.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                size="lg"
                onClick={() => router.push('/auth/signup')}
                className="bg-white text-gray-900 hover:bg-gray-100 font-semibold superellipse-xl"
              >
                <UserPlus className="w-5 h-5 mr-2" />
                Créer mon compte gratuit
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => router.push('/auth/login')}
                className="border-2 border-white text-white hover:bg-white/10 superellipse-xl"
              >
                J'ai déjà un compte
              </Button>
            </div>
          </div>
        </motion.div>
      </main>

      {/* Fixed Bottom CTA Bar */}
      <div className={`fixed bottom-0 left-0 right-0 z-50 backdrop-blur-xl border-t ${isDark ? 'bg-gray-950/95 border-gray-800' : 'bg-white/95 border-gray-200'}`}>
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="hidden sm:block">
            <p className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>Prêt à commencer ?</p>
            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Crée ton compte gratuit en 2 minutes
            </p>
          </div>
          <div className="flex gap-3 w-full sm:w-auto">
            <Button
              onClick={() => router.push('/auth/signup')}
              className="flex-1 sm:flex-none text-white font-semibold hover:brightness-110 superellipse-xl"
              style={{ background: SEARCHER_COLORS.gradient }}
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
              className={`superellipse-3xl max-w-md w-full p-8 relative ${isDark ? 'bg-gray-900' : 'bg-white'}`}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setShowSignupModal(false)}
                className={`absolute top-4 right-4 ${isDark ? 'text-gray-400 hover:text-gray-200' : 'text-gray-400 hover:text-gray-600'}`}
              >
                <X className="w-6 h-6" />
              </button>

              <div className="text-center">
                <div
                  className="w-16 h-16 superellipse-2xl flex items-center justify-center mx-auto mb-4"
                  style={{ background: SEARCHER_COLORS.badgeBg }}
                >
                  <Lock className="w-8 h-8" style={{ color: SEARCHER_COLORS.primary }} />
                </div>
                <h3 className={`text-2xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Fonctionnalité Premium
                </h3>
                <p className={`mb-6 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  {lockedFeatureMessage || 'Crée un compte gratuit pour débloquer cette fonctionnalité et bien plus encore !'}
                </p>

                <div className="space-y-3 mb-6 text-left">
                  {[
                    'Matching intelligent avec les colocs',
                    'Messagerie avec les propriétaires',
                    'Sauvegarde tes favoris',
                    'Alertes personnalisées',
                  ].map((benefit, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                      <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>{benefit}</span>
                    </div>
                  ))}
                </div>

                <div className="flex flex-col gap-3">
                  <Button
                    onClick={() => router.push('/auth/signup')}
                    className="w-full text-white font-semibold hover:brightness-110 superellipse-xl"
                    style={{ background: SEARCHER_COLORS.gradient }}
                    size="lg"
                  >
                    <UserPlus className="w-5 h-5 mr-2" />
                    Créer mon compte gratuit
                  </Button>
                  <Button
                    onClick={() => router.push('/auth/login')}
                    variant="outline"
                    className="w-full superellipse-xl"
                  >
                    J'ai déjà un compte
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <div className="pb-20">
        <Footer />
      </div>
    </div>
  );
}

// Main export with Suspense for useSearchParams
export default function GuestPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div
              className="w-12 h-12 border-4 border-t-transparent rounded-full animate-spin mx-auto mb-4"
              style={{ borderColor: SEARCHER_COLORS.primary, borderTopColor: 'transparent' }}
            />
            <p className="text-gray-600">Chargement...</p>
          </div>
        </div>
      }
    >
      <GuestPageContent />
    </Suspense>
  );
}

const SEARCHER_COLORS_FALLBACK = {
  primary: '#ffa000',
};
