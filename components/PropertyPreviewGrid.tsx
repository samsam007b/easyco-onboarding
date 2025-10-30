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

      setProperties(data || []);
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
    <div className="py-12 px-6 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {showHeader && (
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              Colocations Populaires à Bruxelles
            </h2>
            <p className="text-lg text-gray-600">
              {totalCount} annonces vérifiées • Mises à jour en temps réel
            </p>
          </div>
        )}

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {properties.map((property) => (
            <PropertyCard
              key={property.id}
              property={property}
              variant="default"
            />
          ))}
        </div>

        {/* CTA to view all */}
        <div className="text-center">
          <Link
            href="/properties/browse"
            className="inline-flex items-center gap-2 px-8 py-4 bg-[var(--easy-purple-900)] text-white font-semibold text-lg rounded-full hover:bg-[var(--easy-purple-700)] transition-all shadow-lg hover:shadow-xl"
          >
            Voir toutes les {totalCount} annonces
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
