'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import PropertyCard from './PropertyCard';
import { PropertyCardsGridSkeleton } from './PropertyCardSkeleton';
import { ArrowRight } from 'lucide-react';

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
      // For now, use mock data. Replace with actual API call
      const mockProperties: Property[] = [
        {
          id: '1',
          title: 'Studio Moderne - Ixelles',
          description: 'Magnifique studio entièrement rénové à proximité de l\'ULB',
          city: 'Bruxelles',
          neighborhood: 'Ixelles',
          monthly_rent: 750,
          bedrooms: 1,
          property_type: 'Studio',
          main_image: '/properties/studio-ixelles.jpg',
          rating: 4.9,
          reviews_count: 12,
          views_count: 247,
          available_from: '2025-12-01'
        },
        {
          id: '2',
          title: 'Colocation 3 Chambres - Etterbeek',
          description: 'Grande colocation avec jardin, proche des transports',
          city: 'Bruxelles',
          neighborhood: 'Etterbeek',
          monthly_rent: 550,
          bedrooms: 3,
          property_type: 'Colocation',
          main_image: '/properties/coloc-etterbeek.jpg',
          rating: 4.7,
          reviews_count: 8,
          views_count: 189,
          available_from: '2025-11-15'
        },
        {
          id: '3',
          title: 'Appartement 2 Chambres - Saint-Gilles',
          description: 'Appartement lumineux dans quartier animé',
          city: 'Bruxelles',
          neighborhood: 'Saint-Gilles',
          monthly_rent: 900,
          bedrooms: 2,
          property_type: 'Appartement',
          main_image: '/properties/appart-stgilles.jpg',
          rating: 5.0,
          reviews_count: 15,
          views_count: 312,
          available_from: '2025-11-01'
        },
        {
          id: '4',
          title: 'Chambre en Coloc - Schaerbeek',
          description: 'Chambre meublée dans coloc sympa de 4 personnes',
          city: 'Bruxelles',
          neighborhood: 'Schaerbeek',
          monthly_rent: 480,
          bedrooms: 1,
          property_type: 'Chambre',
          main_image: '/properties/chambre-schaerbeek.jpg',
          rating: 4.6,
          reviews_count: 6,
          views_count: 156,
          available_from: '2025-12-15'
        },
        {
          id: '5',
          title: 'Studio Étudiant - Près ULB',
          description: 'Studio parfait pour étudiant, à 5 min de l\'ULB',
          city: 'Bruxelles',
          neighborhood: 'Ixelles',
          monthly_rent: 650,
          bedrooms: 1,
          property_type: 'Studio',
          main_image: '/properties/studio-ulb.jpg',
          rating: 4.8,
          reviews_count: 10,
          views_count: 278,
          available_from: '2025-11-20'
        },
        {
          id: '6',
          title: 'Grande Coloc - Forest',
          description: 'Maison spacieuse avec jardin, idéale pour groupe',
          city: 'Bruxelles',
          neighborhood: 'Forest',
          monthly_rent: 520,
          bedrooms: 4,
          property_type: 'Maison',
          main_image: '/properties/maison-forest.jpg',
          rating: 4.9,
          reviews_count: 14,
          views_count: 203,
          available_from: '2025-12-01'
        },
      ];

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));

      setProperties(mockProperties.slice(0, limit));
      setTotalCount(247); // Mock total
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
