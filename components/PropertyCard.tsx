'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Heart, MapPin, Users, Home, Star, Calendar } from 'lucide-react';
import { useState, memo, useCallback } from 'react';

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
  onFavoriteClick?: (id: string) => void;
  isFavorite?: boolean;
  variant?: 'default' | 'compact';
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

function PropertyCard({
  property,
  residents = [],
  showCompatibilityScore = false,
  compatibilityScore,
  onFavoriteClick,
  isFavorite = false,
  variant = 'default',
  onMouseEnter,
  onMouseLeave
}: PropertyCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [localFavorite, setLocalFavorite] = useState(isFavorite);

  const handleFavoriteClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setLocalFavorite(!localFavorite);
    onFavoriteClick?.(property.id);
  }, [localFavorite, property.id, onFavoriteClick]);

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
        onMouseEnter={() => {
          setIsHovered(true);
          onMouseEnter?.();
        }}
        onMouseLeave={() => {
          setIsHovered(false);
          onMouseLeave?.();
        }}
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

            {/* Residents Photos */}
            {residents && residents.length > 0 && (
              <div className="absolute bottom-2 left-2 flex items-center gap-1">
                <div className="flex -space-x-2">
                  {residents.slice(0, 3).map((resident, index) => (
                    <div
                      key={resident.id}
                      className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 border-2 border-white shadow-md flex items-center justify-center"
                      style={{ zIndex: 10 - index }}
                    >
                      {resident.profile_photo_url ? (
                        <img
                          src={resident.profile_photo_url}
                          alt={resident.first_name}
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        <Users className="w-4 h-4 text-white" />
                      )}
                    </div>
                  ))}
                </div>
                {residents.length > 3 && (
                  <div className="w-8 h-8 rounded-full bg-gray-800/80 backdrop-blur-sm border-2 border-white text-white text-xs font-bold flex items-center justify-center shadow-md">
                    +{residents.length - 3}
                  </div>
                )}
              </div>
            )}

            {/* Compatibility Score Badge */}
            {showCompatibilityScore && compatibilityScore && (
              <div className="absolute top-2 left-2 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold">
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

            {/* Price section - V3.A Clean */}
            <div className="flex items-center justify-between pt-2 mt-2 border-t border-gray-100">
              <span className="text-sm font-bold text-gray-900">
                €{property.monthly_rent}
                <span className="text-xs text-gray-500 font-normal">/mois</span>
              </span>
              {property.bedrooms && (
                <span className="text-xs text-gray-500">
                  {property.bedrooms} ch.
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
        onMouseEnter={() => {
          setIsHovered(true);
          onMouseEnter?.();
        }}
        onMouseLeave={() => {
          setIsHovered(false);
          onMouseLeave?.();
        }}
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

          {/* Residents Photos - Enhanced */}
          {residents && residents.length > 0 && (
            <div className="absolute bottom-3 left-3 flex items-center gap-2 group/residents">
              <div className="flex -space-x-4">
                {residents.slice(0, 3).map((resident, index) => (
                  <div
                    key={resident.id}
                    className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 border-3 border-white shadow-xl flex items-center justify-center transition-transform hover:scale-110 hover:z-50"
                    style={{ zIndex: 10 - index }}
                    title={resident.first_name}
                  >
                    {resident.profile_photo_url ? (
                      <img
                        src={resident.profile_photo_url}
                        alt={resident.first_name}
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <Users className="w-6 h-6 text-white" />
                    )}
                  </div>
                ))}
              </div>
              {residents.length > 3 && (
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 border-3 border-white text-white text-sm font-bold flex items-center justify-center shadow-xl">
                  +{residents.length - 3}
                </div>
              )}
              {/* Tooltip on hover */}
              <div className="absolute bottom-full left-0 mb-2 hidden group-hover/residents:block bg-black/90 text-white text-xs px-3 py-2 rounded-lg whitespace-nowrap shadow-xl">
                {residents.length} colocataire{residents.length > 1 ? 's' : ''} · Voir les profils
              </div>
            </div>
          )}

          {/* Compatibility Score Badge - V3.A Flat */}
          {showCompatibilityScore && compatibilityScore && (
            <div className={`absolute top-3 left-3 px-3 py-1.5 rounded-full text-sm font-bold shadow-md ${
              compatibilityScore >= 80
                ? 'bg-green-500 text-white'
                : compatibilityScore >= 60
                ? 'bg-orange-500 text-white'
                : 'bg-gray-500 text-white'
            }`}>
              {compatibilityScore}% Match
            </div>
          )}

          {/* Property Type Badge */}
          {!showCompatibilityScore && (
            <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium text-gray-700">
              {property.property_type}
            </div>
          )}
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

          {/* Info Tags - V3.A Flat Modern */}
          <div className="flex flex-wrap gap-2 mb-4">
            {property.bedrooms && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 rounded-full text-xs font-medium text-gray-700">
                <Home className="w-3.5 h-3.5" />
                {property.bedrooms} ch.
              </span>
            )}
            {residents && residents.length > 0 && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 rounded-full text-xs font-medium text-gray-700">
                <Users className="w-3.5 h-3.5" />
                {residents.length} coloc{residents.length > 1 ? 's' : ''}
              </span>
            )}
            {property.available_from && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-50 text-green-700 rounded-full text-xs font-medium">
                <Calendar className="w-3.5 h-3.5" />
                Dispo {new Date(property.available_from).toLocaleDateString('fr-FR', { month: 'short' })}
              </span>
            )}
          </div>

          {/* Resident Avatars - Subtle */}
          {residents && residents.length > 0 && (
            <div className="flex items-center gap-2 mb-4">
              <div className="flex -space-x-2">
                {residents.slice(0, 3).map((resident, index) => (
                  <div
                    key={resident.id}
                    className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-orange-500 border-2 border-white shadow-sm flex items-center justify-center"
                    style={{ zIndex: 10 - index }}
                  >
                    {resident.profile_photo_url ? (
                      <img
                        src={resident.profile_photo_url}
                        alt={resident.first_name}
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <span className="text-xs font-medium text-white">
                        {resident.first_name.charAt(0)}
                      </span>
                    )}
                  </div>
                ))}
                {residents.length > 3 && (
                  <div className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white text-gray-600 text-xs font-medium flex items-center justify-center">
                    +{residents.length - 3}
                  </div>
                )}
              </div>
              <span className="text-xs text-gray-500">
                {residents.slice(0, 2).map(r => r.first_name).join(', ')}
                {residents.length > 2 && ` ...`}
              </span>
            </div>
          )}

          {/* Footer: Price and CTA - V3.A Clean */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            <div>
              <span className="text-2xl font-bold text-gray-900">
                €{property.monthly_rent}
              </span>
              <span className="text-sm text-gray-500">/mois</span>
            </div>
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                window.location.href = `/properties/${property.id}`;
              }}
              className="px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold rounded-full transition-colors shadow-md hover:shadow-lg"
            >
              Voir détails
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default memo(PropertyCard);
