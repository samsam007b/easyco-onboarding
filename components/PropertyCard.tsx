'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Heart, MapPin, Users, Home, Star, Calendar } from 'lucide-react';
import { useState, memo, useCallback } from 'react';
import { useRouter } from 'next/navigation';

interface PropertyCardProps {
  property: {
    id: string;
    title: string;
    description?: string;
    city: string;
    neighborhood?: string;
    monthly_rent: number;
    bedrooms?: number;
    property_type: string;
    main_image?: string;
    images?: string[];
    views_count?: number;
    rating?: number;
    reviews_count?: number;
    available_from?: string;
  };
  showCompatibilityScore?: boolean;
  compatibilityScore?: number;
  onFavoriteClick?: (id: string) => void;
  isFavorite?: boolean;
  variant?: 'default' | 'compact';
}

function PropertyCard({
  property,
  showCompatibilityScore = false,
  compatibilityScore,
  onFavoriteClick,
  isFavorite = false,
  variant = 'default'
}: PropertyCardProps) {
  const router = useRouter();
  const [isHovered, setIsHovered] = useState(false);
  const [localFavorite, setLocalFavorite] = useState(isFavorite);

  const handleFavoriteClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setLocalFavorite(!localFavorite);
    onFavoriteClick?.(property.id);
  }, [localFavorite, property.id, onFavoriteClick]);

  const handleBookVisit = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    router.push(`/properties/${property.id}/book-visit`);
  }, [property.id, router]);

  // Generate placeholder image based on property type and location
  const getPlaceholderImage = () => {
    const seed = property.id || property.title;
    return `https://api.dicebear.com/7.x/shapes/svg?seed=${encodeURIComponent(seed)}&backgroundColor=6E56CF,FFD249,FF6F3C`;
  };

  const imageUrl = property.main_image || property.images?.[0] || getPlaceholderImage();

  if (variant === 'compact') {
    return (
      <Link
        href={`/properties/${property.id}`}
        className="block"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all overflow-hidden">
          {/* Image */}
          <div className="relative h-40 bg-gray-200">
            <Image
              src={imageUrl}
              alt={property.title}
              fill
              className="object-cover"
            />

            {/* Favorite button */}
            <button
              onClick={handleFavoriteClick}
              className="absolute top-2 right-2 p-2 bg-white/90 backdrop-blur-sm rounded-full hover:scale-110 transition-transform"
            >
              <Heart
                className={`w-4 h-4 ${localFavorite ? 'fill-red-500 text-red-500' : 'text-gray-600'}`}
              />
            </button>

            {/* Compatibility Score Badge */}
            {showCompatibilityScore && compatibilityScore && (
              <div className="absolute bottom-2 left-2 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                {compatibilityScore}% Match
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-3">
            <div className="flex items-start justify-between mb-1">
              <h3 className="font-semibold text-sm text-gray-900 line-clamp-1">
                {property.title}
              </h3>
              {property.rating && (
                <div className="flex items-center gap-1 flex-shrink-0 ml-2">
                  <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                  <span className="text-xs font-medium">{property.rating}</span>
                </div>
              )}
            </div>

            <p className="text-xs text-gray-600 mb-2 flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              {property.neighborhood ? `${property.neighborhood}, ${property.city}` : property.city}
            </p>

            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-gray-900">
                €{property.monthly_rent}
                <span className="text-xs text-gray-500 font-normal">/mois</span>
              </span>
              {property.bedrooms && (
                <span className="text-xs text-gray-500">
                  {property.bedrooms} {property.bedrooms > 1 ? 'chambres' : 'chambre'}
                </span>
              )}
            </div>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={`/properties/${property.id}`}
      className="block group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all overflow-hidden">
        {/* Image */}
        <div className="relative h-48 sm:h-56 bg-gray-200">
          <Image
            src={imageUrl}
            alt={property.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />

          {/* Favorite button */}
          <button
            onClick={handleFavoriteClick}
            className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full hover:scale-110 transition-transform z-10"
          >
            <Heart
              className={`w-5 h-5 ${localFavorite ? 'fill-red-500 text-red-500' : 'text-gray-600'}`}
            />
          </button>

          {/* Compatibility Score Badge */}
          {showCompatibilityScore && compatibilityScore && (
            <div className="absolute bottom-3 left-3 bg-green-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
              <span className="text-xl">{compatibilityScore}%</span> Match
            </div>
          )}

          {/* Property Type Badge */}
          <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium text-gray-700">
            {property.property_type}
          </div>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6">
          {/* Title and Rating */}
          <div className="flex items-start justify-between mb-2">
            <h3 className="font-bold text-lg text-gray-900 line-clamp-2 flex-1">
              {property.title}
            </h3>
            {property.rating && (
              <div className="flex items-center gap-1 flex-shrink-0 ml-3">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm font-semibold">{property.rating}</span>
                {property.reviews_count && (
                  <span className="text-xs text-gray-500">({property.reviews_count})</span>
                )}
              </div>
            )}
          </div>

          {/* Location */}
          <p className="text-sm text-gray-600 mb-3 flex items-center gap-1">
            <MapPin className="w-4 h-4" />
            {property.neighborhood ? `${property.neighborhood}, ${property.city}` : property.city}
          </p>

          {/* Details */}
          <div className="flex items-center gap-4 mb-4 text-sm text-gray-600">
            {property.bedrooms && (
              <div className="flex items-center gap-1">
                <Home className="w-4 h-4" />
                <span>{property.bedrooms} {property.bedrooms > 1 ? 'chambres' : 'chambre'}</span>
              </div>
            )}
            {property.views_count && (
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                <span>{property.views_count} vues</span>
              </div>
            )}
          </div>

          {/* Description (optional) */}
          {property.description && (
            <p className="text-sm text-gray-600 line-clamp-2 mb-4">
              {property.description}
            </p>
          )}

          {/* Footer: Price and CTA */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-200">
            <div>
              <span className="text-2xl font-bold text-gray-900">
                €{property.monthly_rent}
              </span>
              <span className="text-sm text-gray-500">/mois</span>
              {property.available_from && (
                <p className="text-xs text-gray-500 mt-1">
                  Dispo {new Date(property.available_from).toLocaleDateString('fr-FR', { month: 'short', day: 'numeric' })}
                </p>
              )}
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleBookVisit}
                className="px-3 py-2 bg-gradient-to-r from-yellow-400 to-orange-400 text-gray-900 font-semibold rounded-lg hover:from-yellow-500 hover:to-orange-500 transition-all flex items-center gap-1"
              >
                <Calendar className="w-4 h-4" />
                <span className="hidden sm:inline">Visite</span>
              </button>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  window.location.href = `/properties/${property.id}`;
                }}
                className="px-4 py-2 bg-[var(--easy-purple-900)] text-white font-semibold rounded-lg hover:bg-[var(--easy-purple-700)] transition-colors"
              >
                Voir
              </button>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default memo(PropertyCard);
