'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, TrendingUp, Clock, MapPin, Euro, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface SmartFiltersProps {
  onFilterApply: (filters: SmartFilterValues) => void;
  currentFilters?: SmartFilterValues;
}

export interface SmartFilterValues {
  cities?: string[];
  priceRange?: { min: number; max: number };
  bedrooms?: number;
  propertyTypes?: string[];
}

interface FilterSuggestion {
  id: string;
  label: string;
  description: string;
  icon: React.ReactNode;
  filters: SmartFilterValues;
  category: 'popular' | 'recent' | 'trending' | 'personalized';
}

export default function SmartFilters({ onFilterApply, currentFilters }: SmartFiltersProps) {
  const [recentSearches, setRecentSearches] = useState<FilterSuggestion[]>([]);
  const [selectedSuggestion, setSelectedSuggestion] = useState<string | null>(null);

  // Load recent searches from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('recentSearches');
    if (stored) {
      try {
        setRecentSearches(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to parse recent searches:', e);
      }
    }
  }, []);

  // Save search to localStorage
  const saveSearch = (suggestion: FilterSuggestion) => {
    const updated = [suggestion, ...recentSearches.filter(s => s.id !== suggestion.id)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem('recentSearches', JSON.stringify(updated));
  };

  // Predefined popular filters
  const popularSuggestions: FilterSuggestion[] = useMemo(() => [
    {
      id: 'student-friendly',
      label: 'Étudiant',
      description: 'Budget étudiant, proche des universités',
      icon: <Home className="w-4 h-4" />,
      category: 'popular',
      filters: {
        priceRange: { min: 0, max: 600 },
        cities: ['Bruxelles', 'Louvain-la-Neuve', 'Liège'],
      },
    },
    {
      id: 'city-center',
      label: 'Centre-ville',
      description: 'Proche du centre, bien desservi',
      icon: <MapPin className="w-4 h-4" />,
      category: 'popular',
      filters: {
        cities: ['Bruxelles', 'Anvers'],
        priceRange: { min: 600, max: 1200 },
      },
    },
    {
      id: 'large-space',
      label: 'Grands espaces',
      description: '3+ chambres, idéal pour groupes',
      icon: <Home className="w-4 h-4" />,
      category: 'popular',
      filters: {
        bedrooms: 3,
        priceRange: { min: 0, max: 1500 },
      },
    },
    {
      id: 'budget-friendly',
      label: 'Petit budget',
      description: 'Moins de 500€/mois',
      icon: <Euro className="w-4 h-4" />,
      category: 'trending',
      filters: {
        priceRange: { min: 0, max: 500 },
      },
    },
    {
      id: 'cozy-space',
      label: 'Cosy & Confort',
      description: 'Meublé, tout équipé',
      icon: <Sparkles className="w-4 h-4" />,
      category: 'trending',
      filters: {
        priceRange: { min: 500, max: 900 },
        propertyTypes: ['Appartement meublé', 'Studio'],
      },
    },
    {
      id: 'professional',
      label: 'Professionnel',
      description: 'Pour jeunes actifs',
      icon: <TrendingUp className="w-4 h-4" />,
      category: 'personalized',
      filters: {
        cities: ['Bruxelles'],
        priceRange: { min: 700, max: 1500 },
      },
    },
  ], []);

  const handleSuggestionClick = (suggestion: FilterSuggestion) => {
    setSelectedSuggestion(suggestion.id);
    saveSearch(suggestion);
    onFilterApply(suggestion.filters);
  };

  const handleClearRecent = () => {
    setRecentSearches([]);
    localStorage.removeItem('recentSearches');
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'popular':
        return <TrendingUp className="w-4 h-4 text-orange-600" />;
      case 'recent':
        return <Clock className="w-4 h-4 text-blue-600" />;
      case 'trending':
        return <Sparkles className="w-4 h-4 text-purple-600" />;
      case 'personalized':
        return <Sparkles className="w-4 h-4 text-pink-600" />;
      default:
        return null;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'popular':
        return 'from-orange-50 to-orange-100 border-orange-200 hover:border-orange-300';
      case 'recent':
        return 'from-blue-50 to-blue-100 border-blue-200 hover:border-blue-300';
      case 'trending':
        return 'from-purple-50 to-purple-100 border-purple-200 hover:border-purple-300';
      case 'personalized':
        return 'from-pink-50 to-pink-100 border-pink-200 hover:border-pink-300';
      default:
        return 'from-gray-50 to-gray-100 border-gray-200 hover:border-gray-300';
    }
  };

  return (
    <div className="space-y-6">
      {/* Recent Searches */}
      {recentSearches.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-gray-600" />
              <h3 className="font-semibold text-gray-900">Recherches récentes</h3>
            </div>
            <button
              onClick={handleClearRecent}
              className="text-xs text-gray-500 hover:text-gray-700 transition"
            >
              Effacer
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {recentSearches.map((suggestion) => (
              <motion.button
                key={suggestion.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                onClick={() => handleSuggestionClick(suggestion)}
                className={`relative p-4 rounded-xl border-2 transition-all text-left bg-gradient-to-br ${getCategoryColor(
                  suggestion.category
                )} ${selectedSuggestion === suggestion.id ? 'ring-2 ring-orange-500' : ''}`}
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-white shadow-sm flex items-center justify-center flex-shrink-0">
                    {suggestion.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-gray-900 text-sm mb-1">{suggestion.label}</h4>
                    <p className="text-xs text-gray-600 line-clamp-2">{suggestion.description}</p>
                  </div>
                </div>
                {selectedSuggestion === suggestion.id && (
                  <div className="absolute top-2 right-2">
                    <Badge className="bg-orange-500 text-white text-xs">Actif</Badge>
                  </div>
                )}
              </motion.button>
            ))}
          </div>
        </div>
      )}

      {/* Popular Suggestions */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <TrendingUp className="w-5 h-5 text-gray-600" />
          <h3 className="font-semibold text-gray-900">Recherches populaires</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {popularSuggestions
            .filter((s) => s.category === 'popular')
            .map((suggestion) => (
              <motion.button
                key={suggestion.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleSuggestionClick(suggestion)}
                className={`relative p-4 rounded-xl border-2 transition-all text-left bg-gradient-to-br ${getCategoryColor(
                  suggestion.category
                )} ${selectedSuggestion === suggestion.id ? 'ring-2 ring-orange-500' : ''}`}
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-white shadow-sm flex items-center justify-center flex-shrink-0">
                    {suggestion.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-gray-900 text-sm mb-1">{suggestion.label}</h4>
                    <p className="text-xs text-gray-600 line-clamp-2">{suggestion.description}</p>
                  </div>
                </div>
                {selectedSuggestion === suggestion.id && (
                  <div className="absolute top-2 right-2">
                    <Badge className="bg-orange-500 text-white text-xs">Actif</Badge>
                  </div>
                )}
              </motion.button>
            ))}
        </div>
      </div>

      {/* Trending Suggestions */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-5 h-5 text-gray-600" />
          <h3 className="font-semibold text-gray-900">Tendances</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {popularSuggestions
            .filter((s) => s.category === 'trending' || s.category === 'personalized')
            .map((suggestion) => (
              <motion.button
                key={suggestion.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleSuggestionClick(suggestion)}
                className={`relative p-4 rounded-xl border-2 transition-all text-left bg-gradient-to-br ${getCategoryColor(
                  suggestion.category
                )} ${selectedSuggestion === suggestion.id ? 'ring-2 ring-orange-500' : ''}`}
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-white shadow-sm flex items-center justify-center flex-shrink-0">
                    {suggestion.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-gray-900 text-sm">{suggestion.label}</h4>
                      {getCategoryIcon(suggestion.category)}
                    </div>
                    <p className="text-xs text-gray-600 line-clamp-2">{suggestion.description}</p>
                  </div>
                </div>
                {selectedSuggestion === suggestion.id && (
                  <div className="absolute top-2 right-2">
                    <Badge className="bg-orange-500 text-white text-xs">Actif</Badge>
                  </div>
                )}
              </motion.button>
            ))}
        </div>
      </div>

      {/* Info Banner */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-gradient-to-r from-orange-50 to-yellow-50 border border-orange-200 rounded-xl p-4"
      >
        <div className="flex items-start gap-3">
          <Sparkles className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h4 className="font-semibold text-gray-900 text-sm mb-1">Filtres intelligents</h4>
            <p className="text-xs text-gray-600">
              Les suggestions s'adaptent à ton historique de recherche et tes préférences pour te faire gagner du temps.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
