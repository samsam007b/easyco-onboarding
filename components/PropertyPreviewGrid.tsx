'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import PropertyCard from './PropertyCard';
import { PropertyCardsGridSkeleton } from './PropertyCardSkeleton';
import { ArrowRight } from 'lucide-react';
import { createClient } from '@/lib/auth/supabase-client';

interface Property {
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
}

interface PropertyPreviewGridProps {
  limit?: number;
  showHeader?: boolean;
}

export default function PropertyPreviewGrid({
  limit = 6,
  showHeader = true
}: PropertyPreviewGridProps) {
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      const supabase = createClient();

      // Fetch featured/recent properties from Supabase
      const { data, error, count } = await supabase
        .from('properties')
        .select('*', { count: 'exact' })
        .eq('status', 'published')
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;

      // Add fallback images from public folder if properties don't have images
      const propertiesWithImages = (data || []).map((property, index) => ({
        ...property,
        main_image: property.main_image || `/images/properties/property-${String(index + 1).padStart(2, '0')}.png`,
        images: property.images || [`/images/properties/property-${String(index + 1).padStart(2, '0')}.png`]
      }));

      setProperties(propertiesWithImages);
      setTotalCount(count || 0);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching properties:', error);
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="py-12 px-6">
        <div className="max-w-7xl mx-auto">
          {showHeader && (
            <div className="text-center mb-8">
              <div className="h-8 w-64 bg-gray-200 rounded mx-auto mb-4 animate-pulse" />
              <div className="h-4 w-96 bg-gray-200 rounded mx-auto animate-pulse" />
            </div>
          )}
          <PropertyCardsGridSkeleton count={limit} />
        </div>
      </div>
    );
  }

  return (
    <div className="py-20 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        {showHeader && (
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Colocations Populaires à{' '}
              <span
                className="bg-clip-text text-transparent"
                style={{
                  backgroundImage: 'linear-gradient(135deg, #6E56CF 0%, #FF6F3C 50%, #FFD249 100%)'
                }}
              >
                Bruxelles
              </span>
            </h2>
            <p className="text-base text-gray-600 flex items-center justify-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-50 text-green-700 text-sm font-medium">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                {totalCount} annonces vérifiées
              </span>
              <span className="text-gray-400">•</span>
              <span className="text-gray-600">Mises à jour en temps réel</span>
            </p>
          </div>
        )}

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {properties.map((property) => (
            <PropertyCard
              key={property.id}
              property={property}
              variant="default"
            />
          ))}
        </div>

        {/* CTA to view all - Modern gradient button */}
        <div className="text-center">
          <Link
            href="/properties/browse"
            className="group inline-flex items-center gap-3 px-8 py-5 text-white font-bold rounded-full shadow-2xl hover:shadow-purple-500/50 transition-all hover:scale-105"
            style={{
              background: 'linear-gradient(135deg, #6E56CF 0%, #9b87f5 100%)'
            }}
          >
            <span className="text-base">Voir toutes les {totalCount} annonces</span>
            <div className="w-6 h-6 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:bg-white/30 transition-all">
              <ArrowRight className="w-4 h-4" />
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
