'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Heart, MapPin, Bed, Users, Calendar } from 'lucide-react';
import { useState, memo, useCallback, useMemo } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { calculatePropertySearcherMatch, getPropertyMatchQuality } from '@/lib/services/property-matching-service';
import type { PropertyWithResidents, PropertySearcherProfile } from '@/lib/services/property-matching-service';
import type { PropertyRoommateCompatibility } from '@/lib/services/roommate-matching-service';

// Couleurs V3-fun pour Searcher (pure amber/gold - pas de transition vers orange)
const SEARCHER_COLORS = {
  card: '#FFFBEB',
  cardDark: 'rgba(255, 160, 0, 0.08)',
  blob: '#FEF3C7',
  blobDark: 'rgba(255, 160, 0, 0.15)',
  text: '#A16300',
  textDark: '#F5F5F7',
  border: 'rgba(255, 160, 0, 0.15)',
  // Gradient searcher pur (jaune -> jaune fonce) - PAS de transition vers orange/rouge
  gradient: 'linear-gradient(135deg, #ffa000 0%, #D98400 100%)',
  badgeBg: 'rgba(255, 160, 0, 0.12)',
  badgeBgDark: 'rgba(255, 160, 0, 0.2)',
  // Pour le matching teaser
  matchingTeaser: 'rgba(255, 160, 0, 0.9)',
};

interface ResidentProfile {
  id: string;
  first_name: string;
  profile_photo_url?: string;
}

interface PropertyCardProps {
  property: {
    id: string;
    title: string;
    description?: string;
    city: string;
    neighborhood?: string;
    address?: string;
    monthly_rent: number;
    bedrooms?: number;
    property_type: string;
    main_image?: string;
    images?: string[];
    views_count?: number;
    rating?: number;
    reviews_count?: number;
    available_from?: string;
    owner_id?: string;
  };
  residents?: ResidentProfile[];
  showCompatibilityScore?: boolean;
  compatibilityScore?: number;
  searcherProfile?: PropertySearcherProfile;
  roommateMatch?: PropertyRoommateCompatibility;
  onFavoriteClick?: (id: string) => void;
  isFavorite?: boolean;
  variant?: 'default' | 'compact';
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  index?: number;
}

function PropertyCard({
  property,
  residents = [],
  showCompatibilityScore = false,
  compatibilityScore,
  searcherProfile,
  roommateMatch,
  onFavoriteClick,
  isFavorite = false,
  variant = 'default',
  onMouseEnter,
  onMouseLeave,
  index = 0,
}: PropertyCardProps) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';
  const [localFavorite, setLocalFavorite] = useState(isFavorite);

  // Calculate property matching score if searcher profile is provided
  const propertyMatchResult = useMemo(() => {
    if (!searcherProfile) return null;

    const propertyWithResidents: PropertyWithResidents = {
      id: property.id,
      owner_id: property.owner_id || '',
      title: property.title,
      property_type: property.property_type as any,
      address: property.address || '',
      city: property.city,
      postal_code: '',
      bedrooms: property.bedrooms || 0,
      bathrooms: 0,
      furnished: false,
      monthly_rent: property.monthly_rent,
      charges: 0,
      deposit: 0,
      is_available: true,
      amenities: [],
      smoking_allowed: false,
      pets_allowed: false,
      couples_allowed: false,
      images: property.images || [],
      status: 'published',
      views_count: property.views_count || 0,
      inquiries_count: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      residents: [],
    };

    return calculatePropertySearcherMatch(propertyWithResidents, searcherProfile);
  }, [property, searcherProfile]);

  const displayScore = roommateMatch?.averageScore ?? propertyMatchResult?.score ?? compatibilityScore;
  const matchQuality = displayScore ? getPropertyMatchQuality(displayScore) : null;

  const handleFavoriteClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setLocalFavorite(!localFavorite);
    onFavoriteClick?.(property.id);
  }, [localFavorite, property.id, onFavoriteClick]);

  const getPlaceholderImage = () => {
    const seed = property.id || property.title;
    return `https://api.dicebear.com/7.x/shapes/svg?seed=${encodeURIComponent(seed)}&backgroundColor=ffa000,e05747`;
  };

  const imageUrl = property.main_image || property.images?.[0] || getPlaceholderImage();

  // Check if available now or soon
  const isAvailableSoon = property.available_from && new Date(property.available_from) <= new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

  // ============================================================================
  // COMPACT VARIANT
  // ============================================================================
  if (variant === 'compact') {
    return (
      <Link
        href={`/properties/${property.id}`}
        className="block group"
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        <div
          className="relative overflow-hidden rounded-2xl transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
          style={{
            background: isDark ? SEARCHER_COLORS.cardDark : SEARCHER_COLORS.card,
            border: `1px solid ${isDark ? SEARCHER_COLORS.border : 'transparent'}`,
          }}
        >
          {/* Decorative blob */}
          <div
            className="absolute -top-6 -right-6 w-16 h-16 rounded-full opacity-50"
            style={{ background: isDark ? SEARCHER_COLORS.blobDark : SEARCHER_COLORS.blob }}
          />

          {/* Image */}
          <div className="relative h-32 overflow-hidden">
            <Image
              src={imageUrl}
              alt={property.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 640px) 50vw, 200px"
              quality={75}
              priority={index < 2}
              loading={index < 2 ? 'eager' : 'lazy'}
            />

            {/* Favorite */}
            <button
              onClick={handleFavoriteClick}
              className="absolute top-2 right-2 p-1.5 rounded-xl transition-all duration-200 hover:scale-110"
              style={{
                background: isDark ? 'rgba(0,0,0,0.5)' : 'rgba(255,255,255,0.9)',
              }}
            >
              <Heart
                className={`w-4 h-4 transition-colors ${
                  localFavorite ? 'fill-red-500 text-red-500' : isDark ? 'text-white' : 'text-gray-600'
                }`}
              />
            </button>

            {/* Match Score */}
            {(showCompatibilityScore || searcherProfile) && displayScore !== undefined && propertyMatchResult?.isScoreReliable !== false && (
              <div
                className="absolute top-2 left-2 px-2 py-1 rounded-lg text-xs font-bold"
                style={{
                  background: matchQuality?.color === 'green' ? 'rgba(34, 197, 94, 0.9)' :
                              matchQuality?.color === 'blue' ? 'rgba(59, 130, 246, 0.9)' :
                              'rgba(255, 160, 0, 0.9)',
                  color: 'white',
                }}
              >
                {displayScore}%
              </div>
            )}
          </div>

          {/* Content */}
          <div className="relative z-10 p-3">
            <h3
              className="font-bold text-sm line-clamp-1 mb-1"
              style={{ color: isDark ? SEARCHER_COLORS.textDark : SEARCHER_COLORS.text }}
            >
              {property.title}
            </h3>

            <p className={`text-xs mb-2 flex items-center gap-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              <MapPin className="w-3 h-3 flex-shrink-0" />
              <span className="truncate">{property.neighborhood || property.city}</span>
            </p>

            <div className="flex items-center justify-between">
              <span
                className="text-base font-bold"
                style={{ color: isDark ? SEARCHER_COLORS.textDark : SEARCHER_COLORS.text }}
              >
                €{property.monthly_rent}
                <span className={`text-xs font-normal ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>/mois</span>
              </span>
              {property.bedrooms && (
                <span
                  className="text-xs px-2 py-1 rounded-lg"
                  style={{
                    background: isDark ? SEARCHER_COLORS.badgeBgDark : SEARCHER_COLORS.badgeBg,
                    color: SEARCHER_COLORS.text,
                  }}
                >
                  {property.bedrooms} ch.
                </span>
              )}
            </div>
          </div>
        </div>
      </Link>
    );
  }

  // ============================================================================
  // DEFAULT VARIANT - V3-fun Design
  // ============================================================================
  return (
    <Link
      href={`/properties/${property.id}`}
      className="block group"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div
        className="relative overflow-hidden rounded-3xl transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
        style={{
          background: isDark ? SEARCHER_COLORS.cardDark : SEARCHER_COLORS.card,
          border: `1px solid ${isDark ? SEARCHER_COLORS.border : 'transparent'}`,
        }}
      >
        {/* Decorative blob - top right */}
        <div
          className="absolute -top-10 -right-10 w-28 h-28 rounded-full opacity-60 transition-transform duration-300 group-hover:scale-110"
          style={{ background: isDark ? SEARCHER_COLORS.blobDark : SEARCHER_COLORS.blob }}
        />

        {/* Decorative blob - bottom left (smaller) */}
        <div
          className="absolute -bottom-6 -left-6 w-20 h-20 rounded-full opacity-40"
          style={{ background: isDark ? SEARCHER_COLORS.blobDark : SEARCHER_COLORS.blob }}
        />

        {/* Image Container */}
        <div className="relative h-52 overflow-hidden rounded-t-3xl">
          <Image
            src={imageUrl}
            alt={property.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 350px"
            quality={85}
            priority={index < 3}
            loading={index < 3 ? 'eager' : 'lazy'}
          />

          {/* Gradient overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

          {/* Favorite Button */}
          <button
            onClick={handleFavoriteClick}
            className="absolute top-3 right-3 p-2.5 rounded-xl transition-all duration-200 hover:scale-110 z-10"
            style={{
              background: isDark ? 'rgba(0,0,0,0.5)' : 'rgba(255,255,255,0.95)',
              backdropFilter: 'blur(8px)',
            }}
          >
            <Heart
              className={`w-5 h-5 transition-colors ${
                localFavorite ? 'fill-red-500 text-red-500' : isDark ? 'text-white' : 'text-gray-600'
              }`}
            />
          </button>

          {/* Match Score Badge */}
          {(showCompatibilityScore || searcherProfile) && displayScore !== undefined && propertyMatchResult?.isScoreReliable !== false && (
            <div
              className="absolute top-3 left-3 px-3 py-1.5 rounded-xl text-sm font-bold shadow-lg"
              style={{
                background: matchQuality?.color === 'green' ? 'rgba(34, 197, 94, 0.95)' :
                            matchQuality?.color === 'blue' ? 'rgba(59, 130, 246, 0.95)' :
                            matchQuality?.color === 'yellow' ? 'rgba(245, 158, 11, 0.95)' :
                            'rgba(255, 160, 0, 0.95)',
                color: 'white',
                backdropFilter: 'blur(8px)',
              }}
            >
              {displayScore}% Match
            </div>
          )}

          {/* Profile Incomplete Badge */}
          {searcherProfile && propertyMatchResult && propertyMatchResult.isScoreReliable === false && (
            <div
              className="absolute top-3 left-3 px-3 py-1.5 rounded-xl text-sm font-medium shadow-lg"
              style={{
                background: 'rgba(255,255,255,0.95)',
                color: SEARCHER_COLORS.text,
                backdropFilter: 'blur(8px)',
              }}
            >
              Complete ton profil
            </div>
          )}

          {/* Available Now Badge OR Matching Teaser */}
          {!showCompatibilityScore && !searcherProfile && (
            isAvailableSoon ? (
              <div
                className="absolute top-3 left-3 px-3 py-1.5 rounded-xl text-sm font-medium shadow-lg flex items-center gap-1.5"
                style={{
                  background: 'rgba(34, 197, 94, 0.95)',
                  color: 'white',
                  backdropFilter: 'blur(8px)',
                }}
              >
                <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                Dispo
              </div>
            ) : (
              // Matching Teaser for non-logged users - encourages signup
              <div
                className="absolute top-3 left-3 px-3 py-1.5 rounded-xl text-sm font-medium shadow-lg flex items-center gap-1.5 cursor-pointer"
                style={{
                  background: SEARCHER_COLORS.matchingTeaser,
                  color: 'white',
                  backdropFilter: 'blur(8px)',
                }}
                title="Crée ton profil pour voir ton % de compatibilité"
              >
                <span className="blur-[2px] select-none">87%</span>
                <span className="text-xs opacity-80">Match</span>
              </div>
            )
          )}

          {/* Location on image */}
          <div className="absolute bottom-3 left-3 flex items-center gap-1.5 text-white text-sm font-medium">
            <MapPin className="w-4 h-4" />
            <span className="drop-shadow-md">
              {property.neighborhood ? `${property.neighborhood}, ${property.city}` : property.city}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="relative z-10 p-5">
          {/* Title */}
          <h3
            className="font-bold text-lg line-clamp-2 mb-3"
            style={{ color: isDark ? SEARCHER_COLORS.textDark : SEARCHER_COLORS.text }}
          >
            {property.title}
          </h3>

          {/* Info Tags + Resident Avatars */}
          <div className="flex items-center justify-between mb-4">
            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              {property.bedrooms && (
                <span
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold"
                  style={{
                    background: isDark ? SEARCHER_COLORS.badgeBgDark : SEARCHER_COLORS.badgeBg,
                    color: SEARCHER_COLORS.text,
                  }}
                >
                  <Bed className="w-3.5 h-3.5" />
                  {property.bedrooms} ch.
                </span>
              )}
              {residents && residents.length > 0 && (
                <span
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold"
                  style={{
                    background: isDark ? SEARCHER_COLORS.badgeBgDark : SEARCHER_COLORS.badgeBg,
                    color: SEARCHER_COLORS.text,
                  }}
                >
                  <Users className="w-3.5 h-3.5" />
                  {residents.length} coloc{residents.length > 1 ? 's' : ''}
                </span>
              )}
            </div>

            {/* Resident Avatars - Community aspect */}
            {residents && residents.length > 0 && (
              <div className="flex items-center -space-x-2">
                {residents.slice(0, 3).map((resident, idx) => (
                  <div
                    key={resident.id}
                    className="w-8 h-8 rounded-full border-2 overflow-hidden"
                    style={{
                      borderColor: isDark ? '#1a1a1f' : '#FFFBEB',
                      zIndex: 3 - idx,
                    }}
                  >
                    {resident.profile_photo_url ? (
                      <Image
                        src={resident.profile_photo_url}
                        alt={resident.first_name}
                        width={32}
                        height={32}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div
                        className="w-full h-full flex items-center justify-center text-xs font-bold text-white"
                        style={{ background: SEARCHER_COLORS.gradient }}
                      >
                        {resident.first_name.charAt(0)}
                      </div>
                    )}
                  </div>
                ))}
                {residents.length > 3 && (
                  <div
                    className="w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-bold"
                    style={{
                      borderColor: isDark ? '#1a1a1f' : '#FFFBEB',
                      background: isDark ? SEARCHER_COLORS.badgeBgDark : SEARCHER_COLORS.badgeBg,
                      color: SEARCHER_COLORS.text,
                    }}
                  >
                    +{residents.length - 3}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Price - Prominent */}
          <div
            className="pt-4 flex items-center justify-between"
            style={{ borderTop: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'}` }}
          >
            <div>
              <span className={`text-xs block mb-0.5 ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                à partir de
              </span>
              <span
                className="text-2xl font-bold"
                style={{ color: isDark ? SEARCHER_COLORS.textDark : SEARCHER_COLORS.text }}
              >
                €{property.monthly_rent}
              </span>
              <span className={`text-sm ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>/mois</span>
            </div>

            {/* Subtle arrow indicator */}
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110"
              style={{ background: SEARCHER_COLORS.gradient }}
            >
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default memo(PropertyCard);
