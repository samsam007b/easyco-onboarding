'use client';

import React from 'react';
import { APIProvider, Map, AdvancedMarker, Pin } from '@vis.gl/react-google-maps';
import { MapPin } from 'lucide-react';

interface SinglePropertyMapProps {
  latitude: number;
  longitude: number;
  title: string;
  address?: string;
  className?: string;
  zoom?: number;
}

export default function SinglePropertyMap({
  latitude,
  longitude,
  title,
  address,
  className = 'w-full h-[400px]',
  zoom = 15,
}: SinglePropertyMapProps) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  if (!apiKey) {
    return (
      <div className={`${className} bg-gray-100 rounded-2xl flex items-center justify-center`}>
        <div className="text-center">
          <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">Google Maps API key not configured</p>
        </div>
      </div>
    );
  }

  const position = { lat: latitude, lng: longitude };

  return (
    <APIProvider apiKey={apiKey}>
      <div className={className}>
        <Map
          mapId="easyco-property-detail-map"
          defaultCenter={position}
          defaultZoom={zoom}
          gestureHandling="greedy"
          disableDefaultUI={false}
          styles={[
            {
              featureType: 'poi',
              elementType: 'labels',
              stylers: [{ visibility: 'off' }],
            },
          ]}
        >
          <AdvancedMarker position={position}>
            <Pin
              background="#F59E0B"
              borderColor="#fff"
              glyphColor="#fff"
              scale={1.4}
            />
          </AdvancedMarker>
        </Map>

        {/* Address overlay */}
        {address && (
          <div className="absolute bottom-4 left-4 right-4 bg-white rounded-lg shadow-lg p-4 max-w-md">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
                <MapPin className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">{title}</h3>
                <p className="text-sm text-gray-600">{address}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </APIProvider>
  );
}
