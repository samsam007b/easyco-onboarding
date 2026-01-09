'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import LoadingHouse from '@/components/ui/LoadingHouse';
import {
  Search,
  SlidersHorizontal,
  Sparkles,
  MapPin,
  Euro,
  Ruler,
  Sun,
  Thermometer,
  Palette,
  TrendingUp,
} from 'lucide-react';
import { AestheticFilters } from './AestheticFilters';
import {
  AestheticSearchFilters,
  AestheticSearchResult,
  calculateAestheticScore,
  getRatingLabel,
  DESIGN_STYLE_LABELS,
  getDesignStyleIconName,
} from '@/types/room-aesthetics.types';

interface AestheticRoomSearchProps {
  onRoomClick?: (roomId: string) => void;
}

export function AestheticRoomSearch({ onRoomClick }: AestheticRoomSearchProps) {
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<AestheticSearchFilters>({});
  const [searchResults, setSearchResults] = useState<AestheticSearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Perform search
  const handleSearch = async () => {
    setIsLoading(true);
    try {
      // Call the Supabase function
      const response = await fetch('/api/rooms/search-aesthetic', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...filters,
          city: searchQuery || filters.city,
        }),
      });

      const data = await response.json();
      setSearchResults(data.results || []);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApplyFilters = () => {
    handleSearch();
    setShowFilters(false);
  };

  const handleResetFilters = () => {
    setFilters({});
    setSearchResults([]);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Search Bar */}
      <div className="bg-searcher-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
            <Sparkles className="w-10 h-10" />
            Find Your Perfect Room
          </h1>
          <p className="text-searcher-100 mb-8">
            Search by design style, natural light, heating, and atmosphere
          </p>

          {/* Search Bar */}
          <div className="bg-white superellipse-xl shadow-2xl p-4 flex flex-col md:flex-row gap-4">
            <div className="flex-1 flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-lg">
              <MapPin className="w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="City or neighborhood..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                className="flex-1 bg-transparent outline-none text-gray-700 placeholder-gray-400"
              />
            </div>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
                showFilters
                  ? 'bg-searcher-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <SlidersHorizontal className="w-5 h-5" />
              <span>Aesthetic Filters</span>
              {Object.keys(filters).filter((k) => filters[k as keyof AestheticSearchFilters])
                .length > 0 && (
                <span className="px-2 py-0.5 bg-white text-searcher-600 text-xs rounded-full font-bold">
                  {
                    Object.keys(filters).filter((k) => filters[k as keyof AestheticSearchFilters])
                      .length
                  }
                </span>
              )}
            </button>

            <button
              onClick={handleSearch}
              className="bg-searcher-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-searcher-600 transition-all shadow-md flex items-center gap-2"
            >
              <Search className="w-5 h-5" />
              Search
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          {showFilters && (
            <div className="lg:col-span-1">
              <AestheticFilters
                filters={filters}
                onChange={setFilters}
                onApply={handleApplyFilters}
                onReset={handleResetFilters}
              />
            </div>
          )}

          {/* Results */}
          <div className={showFilters ? 'lg:col-span-3' : 'lg:col-span-4'}>
            {/* Results Header */}
            {searchResults.length > 0 && (
              <div className="mb-6 flex items-center justify-between">
                <p className="text-gray-600">
                  <span className="font-semibold text-gray-900">{searchResults.length}</span> rooms
                  found
                </p>
                <select className="px-4 py-2 border rounded-lg text-sm">
                  <option>Best match (Aesthetic Score)</option>
                  <option>Price: Low to High</option>
                  <option>Price: High to Low</option>
                  <option>Natural Light: High to Low</option>
                  <option>Size: Large to Small</option>
                </select>
              </div>
            )}

            {/* Loading State */}
            {isLoading && (
              <div className="flex items-center justify-center py-20">
                <LoadingHouse size={64} />
              </div>
            )}

            {/* Empty State */}
            {!isLoading && searchResults.length === 0 && (
              <div className="text-center py-20">
                <Sparkles className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                  Start your search
                </h3>
                <p className="text-gray-500">
                  Use the filters to find rooms that match your aesthetic preferences
                </p>
              </div>
            )}

            {/* Results Grid */}
            {!isLoading && searchResults.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {searchResults.map((room) => (
                  <RoomCard
                    key={room.id}
                    room={room}
                    onClick={() => onRoomClick?.(room.id)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Room Card Component
interface RoomCardProps {
  room: AestheticSearchResult;
  onClick: () => void;
}

function RoomCard({ room, onClick }: RoomCardProps) {
  const { label: scoreLabel, color: scoreColor } = getRatingLabel(room.aesthetic_score);

  return (
    <motion.div
      whileHover={{ y: -4 }}
      onClick={onClick}
      className="bg-white superellipse-xl overflow-hidden shadow-md hover:shadow-xl transition-all cursor-pointer"
    >
      {/* Image */}
      <div className="relative aspect-[4/3] bg-gray-200">
        {room.photos && room.photos.length > 0 ? (
          <img
            src={room.photos[0]}
            alt={room.room_name || 'Room'}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <Sparkles className="w-12 h-12" />
          </div>
        )}

        {/* Aesthetic Score Badge */}
        <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm px-3 py-1 rounded-full shadow-lg flex items-center gap-1">
          <Sparkles className="w-4 h-4 text-searcher-600" />
          <span className="font-bold text-sm">{room.aesthetic_score.toFixed(1)}</span>
          <span className="text-xs text-gray-500">/10</span>
        </div>

        {/* Design Style Badge */}
        {room.design_style && (
          <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1">
            <span>{getDesignStyleIconName(room.design_style)}</span>
            <span>{DESIGN_STYLE_LABELS[room.design_style]}</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Title & Location */}
        <h3 className="font-semibold text-lg mb-1 line-clamp-1">
          {room.room_name || `Room ${room.room_number}`}
        </h3>
        <p className="text-sm text-gray-600 mb-3 flex items-center gap-1">
          <MapPin className="w-3 h-3" />
          {room.neighborhood}, {room.city}
        </p>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          <div className="flex items-center gap-1 text-xs text-gray-600">
            <Ruler className="w-3 h-3" />
            <span>{room.size_sqm}m²</span>
          </div>
          {room.natural_light_rating && (
            <div className="flex items-center gap-1 text-xs text-gray-600">
              <Sun className="w-3 h-3 text-yellow-500" />
              <span>{room.natural_light_rating}/10</span>
            </div>
          )}
          {room.heating_type && (
            <div className="flex items-center gap-1 text-xs text-gray-600">
              <Thermometer className="w-3 h-3 text-red-500" />
              <span className="truncate">{room.heating_type.split('_')[0]}</span>
            </div>
          )}
        </div>

        {/* Atmosphere Tag */}
        {room.room_atmosphere && (
          <div className="mb-3">
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-searcher-50 text-searcher-700 text-xs rounded-full font-medium">
              <Palette className="w-3 h-3" />
              {room.room_atmosphere}
            </span>
          </div>
        )}

        {/* Price & CTA */}
        <div className="flex items-center justify-between pt-3 border-t">
          <div>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold text-gray-900">
                {room.total_monthly_cost}€
              </span>
              <span className="text-sm text-gray-500">/month</span>
            </div>
            <p className="text-xs text-gray-500">All costs included</p>
          </div>

          <button className="px-4 py-2 bg-searcher-500 text-white rounded-lg text-sm font-semibold hover:bg-searcher-600 transition-all shadow-md">
            View Details
          </button>
        </div>
      </div>
    </motion.div>
  );
}
