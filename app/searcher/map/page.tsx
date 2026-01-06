'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import { createClient } from '@/lib/auth/supabase-client';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import LoadingHouse from '@/components/ui/LoadingHouse';
import {
  Map as MapIcon,
  List,
  ArrowLeft,
  Filter,
  MapPin,
  Euro,
  Home,
  Bed,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

// V3-FUN Palette
// V3 Color System - Using CSS Variables from globals.css

// Dynamically import the map component to avoid SSR issues
const SafePropertyMap = dynamic(
  () => import('@/components/SafePropertyMap'),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-searcher-500 border-t-transparent rounded-full mx-auto mb-2" />
          <p className="text-gray-600 text-sm">Chargement de la carte...</p>
        </div>
      </div>
    )
  }
);

interface Property {
  id: string;
  title: string;
  city: string;
  postal_code: string;
  monthly_rent: number;
  available_rooms: number;
  latitude?: number;
  longitude?: number;
  main_image?: string;
  property_type: string;
}

export default function SearcherMapPage() {
  const router = useRouter();
  const supabase = createClient();

  const [loading, setLoading] = useState(true);
  const [properties, setProperties] = useState<Property[]>([]);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [showSidebar, setShowSidebar] = useState(true);

  useEffect(() => {
    const loadProperties = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push('/login'); return; }

      // Load properties with coordinates
      const { data: props } = await supabase
        .from('properties')
        .select('id, title, city, postal_code, monthly_rent, available_rooms, latitude, longitude, main_image, property_type')
        .eq('is_active', true)
        .not('latitude', 'is', null)
        .limit(100);

      if (props) {
        setProperties(props);
      }
      setLoading(false);
    };
    loadProperties();
  }, [supabase, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingHouse size={80} />
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-64px)] flex flex-col">
      {/* Header Bar */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between"
      >
        <div className="flex items-center gap-3">
          <Link href="/searcher">
            <Button variant="ghost" size="icon" className="superellipse-xl">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div className="flex items-center gap-2">
            <div
              className="w-10 h-10 superellipse-xl flex items-center justify-center shadow-md"
              style={{ background: 'var(--gradient-searcher)' }}
            >
              <MapIcon className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-semibold text-gray-900">Carte interactive</h1>
              <p className="text-sm text-gray-600">{properties.length} biens disponibles</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="superellipse-xl">
            <Filter className="w-4 h-4 mr-2" />
            Filtrer
          </Button>
          <Link href="/searcher/explore">
            <Button variant="outline" size="sm" className="superellipse-xl">
              <List className="w-4 h-4 mr-2" />
              Liste
            </Button>
          </Link>
        </div>
      </motion.div>

      {/* Map Container */}
      <div className="flex-1 relative">
        {/* Sidebar Toggle */}
        <button
          onClick={() => setShowSidebar(!showSidebar)}
          className="absolute top-4 left-4 z-10 w-10 h-10 bg-white superellipse-xl shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors"
        >
          {showSidebar ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
        </button>

        {/* Sidebar */}
        <motion.div
          initial={false}
          animate={{ x: showSidebar ? 0 : -320 }}
          className="absolute top-0 left-0 h-full w-80 bg-white shadow-xl z-[5] overflow-y-auto"
        >
          <div className="p-4">
            <h2 className="font-semibold text-gray-900 mb-4">Biens sur la carte</h2>
            <div className="space-y-3">
              {properties.slice(0, 10).map((property) => (
                <motion.div
                  key={property.id}
                  whileHover={{ scale: 1.02 }}
                  className={`p-3 superellipse-xl border cursor-pointer transition-all ${
                    selectedProperty?.id === property.id
                      ? 'border-searcher-400 bg-searcher-50'
                      : 'border-gray-200 hover:border-searcher-200'
                  }`}
                  onClick={() => setSelectedProperty(property)}
                >
                  <div className="flex gap-3">
                    <div className="w-16 h-16 superellipse-lg bg-gray-100 flex-shrink-0 flex items-center justify-center overflow-hidden">
                      {property.main_image ? (
                        <img
                          src={property.main_image}
                          alt={property.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Home className="w-6 h-6 text-gray-300" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900 text-sm truncate">{property.title}</h3>
                      <div className="flex items-center gap-1 text-gray-600 text-xs mt-1">
                        <MapPin className="w-3 h-3" />
                        <span>{property.city}</span>
                      </div>
                      <div className="flex items-center gap-3 mt-2">
                        <Badge variant="secondary" className="text-xs">
                          <Euro className="w-3 h-3 mr-1" />
                          {property.monthly_rent}€
                        </Badge>
                        <Badge variant="secondary" className="text-xs">
                          <Bed className="w-3 h-3 mr-1" />
                          {property.available_rooms} ch.
                        </Badge>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Map */}
        <div className="w-full h-full">
          {properties.length > 0 ? (
            <SafePropertyMap
              properties={properties
                .filter(p => p.latitude && p.longitude)
                .map(p => ({
                  id: p.id,
                  title: p.title,
                  latitude: p.latitude!,
                  longitude: p.longitude!,
                  price: p.monthly_rent,
                  image_url: p.main_image
                }))}
              selectedPropertyId={selectedProperty?.id}
              onPropertySelect={(id) => {
                if (id) {
                  const prop = properties.find(p => p.id === id);
                  if (prop) setSelectedProperty(prop);
                } else {
                  setSelectedProperty(null);
                }
              }}
              className="w-full h-full"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-100">
              <div className="text-center">
                <MapIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-600">Aucun bien avec coordonnées</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
