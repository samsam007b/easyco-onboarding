'use client';

import React, { useState, useCallback, useMemo } from 'react';
import { APIProvider, Map, AdvancedMarker, InfoWindow } from '@vis.gl/react-google-maps';
import { Property } from '@/types/property.types';
import { MapPin, Home, Users, Maximize } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import PropertyMarkerCard from './PropertyMarkerCard';

interface PropertyMapProps {
  properties: Property[];
  selectedPropertyId?: string;
  onPropertySelect?: (propertyId: string) => void;
  center?: { lat: number; lng: number };
  zoom?: number;
  className?: string;
}

interface PropertyMarkerData extends Property {
  position: { lat: number; lng: number };
  is_featured?: boolean;
}

export default function PropertyMap({
  properties,
  selectedPropertyId,
  onPropertySelect,
  center,
  zoom = 12,
  className = 'w-full h-[600px]',
}: PropertyMapProps) {
  const [selectedMarker, setSelectedMarker] = useState<string | null>(null);
  const [hoveredMarker, setHoveredMarker] = useState<string | null>(null);
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  if (!apiKey) {
    return (
      <div className="w-full h-[600px] bg-gray-100 rounded-2xl flex items-center justify-center">
        <div className="text-center">
          <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">Google Maps API key not configured</p>
        </div>
      </div>
    );
  }

  // Convert properties to markers with geocoding data
  const markers: PropertyMarkerData[] = useMemo(() => {
    return properties
      .filter(p => p.latitude && p.longitude)
      .map(property => ({
        ...property,
        position: {
          lat: property.latitude!,
          lng: property.longitude!,
        },
      }));
  }, [properties]);

  // Calculate map center based on properties
  const mapCenter = useMemo(() => {
    if (center) return center;

    if (markers.length === 0) {
      // Default to Brussels, Belgium
      return { lat: 50.8503, lng: 4.3517 };
    }

    // Calculate average position
    const avgLat = markers.reduce((sum, m) => sum + m.position.lat, 0) / markers.length;
    const avgLng = markers.reduce((sum, m) => sum + m.position.lng, 0) / markers.length;

    return { lat: avgLat, lng: avgLng };
  }, [markers, center]);

  const handleMarkerClick = useCallback((propertyId: string) => {
    setSelectedMarker(propertyId);
    onPropertySelect?.(propertyId);
  }, [onPropertySelect]);

  const handleCloseInfoWindow = useCallback(() => {
    setSelectedMarker(null);
  }, []);

  const handleMarkerHover = useCallback((propertyId: string) => {
    setHoveredMarker(propertyId);
  }, []);

  const handleMarkerLeave = useCallback(() => {
    setHoveredMarker(null);
  }, []);

  return (
    <APIProvider apiKey={apiKey}>
      <div className={className}>
        <Map
          mapId="easyco-property-map"
          defaultCenter={mapCenter}
          defaultZoom={zoom}
          gestureHandling="greedy"
          disableDefaultUI={false}
          clickableIcons={false}
          styles={[
            {
              featureType: 'poi',
              elementType: 'labels',
              stylers: [{ visibility: 'off' }],
            },
          ]}
        >
          {markers.map((property) => (
            <React.Fragment key={property.id}>
              <AdvancedMarker
                position={property.position}
                onClick={() => handleMarkerClick(property.id)}
              >
                <PropertyMarkerCard
                  imageUrl={property.main_image || '/placeholder-property.jpg'}
                  price={property.monthly_rent}
                  isSelected={property.id === selectedPropertyId || property.id === selectedMarker}
                  isHovered={property.id === hoveredMarker}
                  onClick={() => handleMarkerClick(property.id)}
                  onMouseEnter={() => handleMarkerHover(property.id)}
                  onMouseLeave={handleMarkerLeave}
                />
              </AdvancedMarker>

              {selectedMarker === property.id && (
                <InfoWindow
                  position={property.position}
                  onCloseClick={handleCloseInfoWindow}
                  maxWidth={320}
                >
                  <PropertyInfoCard property={property} />
                </InfoWindow>
              )}
            </React.Fragment>
          ))}
        </Map>
      </div>
    </APIProvider>
  );
}

// Info window content component
function PropertyInfoCard({ property }: { property: PropertyMarkerData }) {
  const imageSrc = property.main_image || '/placeholder-property.jpg';

  return (
    <Link
      href={`/properties/${property.id}`}
      className="block hover:opacity-90 transition-opacity"
    >
      <div className="w-[280px]">
        {/* Image */}
        <div className="relative w-full h-[160px] rounded-lg overflow-hidden mb-3">
          <Image
            src={imageSrc}
            alt={property.title}
            fill
            className="object-cover"
            sizes="280px"
          />
          {property.is_featured && (
            <div className="absolute top-2 right-2 bg-gradient-to-r from-yellow-400 to-orange-400 text-white text-xs font-bold px-2 py-1 rounded-full">
              Featured
            </div>
          )}
        </div>

        {/* Content */}
        <div className="space-y-2">
          <h3 className="font-semibold text-gray-900 text-lg line-clamp-1">
            {property.title}
          </h3>

          <div className="flex items-center text-sm text-gray-600">
            <MapPin className="w-4 h-4 mr-1" />
            <span className="line-clamp-1">{property.city}</span>
          </div>

          <div className="grid grid-cols-3 gap-2 text-xs text-gray-600">
            <div className="flex items-center">
              <Home className="w-3 h-3 mr-1" />
              <span className="capitalize">{property.property_type}</span>
            </div>
            <div className="flex items-center">
              <Users className="w-3 h-3 mr-1" />
              <span>{property.bedrooms} ch.</span>
            </div>
            {property.surface_area && (
              <div className="flex items-center">
                <Maximize className="w-3 h-3 mr-1" />
                <span>{property.surface_area}m²</span>
              </div>
            )}
          </div>

          <div className="pt-2 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {property.monthly_rent}€
                </div>
                <div className="text-xs text-gray-500">par mois</div>
              </div>
              <div className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white text-xs font-semibold px-3 py-2 rounded-lg">
                Voir détails
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
