'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import Link from 'next/link';
import PropertyCard from './PropertyCard';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { createClient } from '@/lib/auth/supabase-client';
import { useTheme } from '@/contexts/ThemeContext';

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

// Couleurs V3-fun pour Searcher
const SEARCHER_COLORS = {
  card: '#FFFBEB',
  cardDark: 'rgba(255, 160, 0, 0.08)',
  blob: '#FEF3C7',
  blobDark: 'rgba(255, 160, 0, 0.15)',
  text: '#A16300',
  border: 'rgba(255, 160, 0, 0.15)',
  gradient: 'linear-gradient(135deg, #ffa000 0%, #e05747 100%)',
};

export default function PropertyPreviewGrid({
  limit = 6,
  showHeader = true
}: PropertyPreviewGridProps) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScrollButtons = useCallback(() => {
    if (carouselRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      const cardWidth = 380; // Approximate card width + gap
      const scrollAmount = direction === 'left' ? -cardWidth : cardWidth;
      carouselRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  useEffect(() => {
    const carousel = carouselRef.current;
    if (carousel) {
      carousel.addEventListener('scroll', checkScrollButtons);
      checkScrollButtons();
      return () => carousel.removeEventListener('scroll', checkScrollButtons);
    }
  }, [properties, checkScrollButtons]);

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

      // Replace Figma screenshots with real property photos from hero folder
      const heroImages = [
        '/images/hero/pexels-charlotte-may-5824520.jpg',
        '/images/hero/pexels-jonathanborba-5570226.jpg',
        '/images/hero/pexels-kseniachernaya-4740485.jpg',
        '/images/hero/pexels-polina-zimmerman-3747425.jpg',
        '/images/hero/pexels-solliefoto-298842.jpg',
      ];

      const propertiesWithImages = (data || []).map((property, index) => {
        const imageIndex = index % 5;
        const heroImage = heroImages[imageIndex];

        const isFigmaScreenshot = property.main_image?.includes('/images/properties/property-') ||
                                  property.main_image?.includes('/images/carousel/figma-');

        return {
          ...property,
          main_image: (isFigmaScreenshot || !property.main_image) ? heroImage : property.main_image,
          images: property.images?.some((img: string) =>
            img.includes('/images/properties/property-') || img.includes('/images/carousel/figma-')
          )
            ? [heroImage]
            : (property.images || [heroImage])
        };
      });

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
      <div className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          {showHeader && (
            <div className="text-center mb-12">
              <div className="h-10 w-80 bg-gray-200 rounded-xl mx-auto mb-4 animate-pulse" />
              <div className="h-6 w-64 bg-gray-200 rounded-lg mx-auto animate-pulse" />
            </div>
          )}
          {/* Skeleton carousel */}
          <div className="flex gap-6 overflow-hidden">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex-shrink-0 w-[350px] h-[420px] bg-gray-200 rounded-3xl animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <section
      className="py-20 transition-colors duration-300"
      style={{
        background: isDark
          ? 'linear-gradient(to bottom, #0F0F12, #141418)'
          : 'linear-gradient(to bottom, #FFFFFF, #FAFAFA)',
      }}
    >
      <div className="max-w-7xl mx-auto">
        {showHeader && (
          <div className="text-center mb-12 px-6">
            <h2
              className="text-3xl md:text-4xl font-bold mb-4"
              style={{ color: isDark ? '#F5F5F7' : SEARCHER_COLORS.text }}
            >
              Co-livings Populaires à{' '}
              <span
                className="bg-clip-text text-transparent"
                style={{ backgroundImage: SEARCHER_COLORS.gradient }}
              >
                Bruxelles
              </span>
            </h2>
            <p className="text-base flex items-center justify-center gap-2">
              <span
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium"
                style={{
                  background: isDark ? 'rgba(34, 197, 94, 0.15)' : 'rgba(34, 197, 94, 0.1)',
                  color: isDark ? '#4ade80' : '#15803d',
                }}
              >
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                {totalCount} annonces verifiees
              </span>
              <span className={isDark ? 'text-gray-600' : 'text-gray-400'}>•</span>
              <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>Mises a jour en temps reel</span>
            </p>
          </div>
        )}

        {/* Carousel Container */}
        <div className="relative group">
          {/* Navigation Buttons */}
          {canScrollLeft && (
            <button
              onClick={() => scroll('left')}
              className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-all opacity-0 group-hover:opacity-100 hover:scale-110"
              style={{
                background: isDark ? 'rgba(26, 26, 31, 0.9)' : 'white',
                border: `1px solid ${isDark ? SEARCHER_COLORS.border : 'rgba(0,0,0,0.1)'}`,
              }}
            >
              <ChevronLeft className="w-6 h-6" style={{ color: SEARCHER_COLORS.text }} />
            </button>
          )}
          {canScrollRight && (
            <button
              onClick={() => scroll('right')}
              className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-all opacity-0 group-hover:opacity-100 hover:scale-110"
              style={{
                background: isDark ? 'rgba(26, 26, 31, 0.9)' : 'white',
                border: `1px solid ${isDark ? SEARCHER_COLORS.border : 'rgba(0,0,0,0.1)'}`,
              }}
            >
              <ChevronRight className="w-6 h-6" style={{ color: SEARCHER_COLORS.text }} />
            </button>
          )}

          {/* Gradient fade edges */}
          <div
            className="absolute left-0 top-0 bottom-0 w-12 z-[5] pointer-events-none"
            style={{
              background: isDark
                ? 'linear-gradient(to right, #0F0F12, transparent)'
                : 'linear-gradient(to right, #FFFFFF, transparent)',
            }}
          />
          <div
            className="absolute right-0 top-0 bottom-0 w-12 z-[5] pointer-events-none"
            style={{
              background: isDark
                ? 'linear-gradient(to left, #141418, transparent)'
                : 'linear-gradient(to left, #FAFAFA, transparent)',
            }}
          />

          {/* Scrollable Carousel */}
          <div
            ref={carouselRef}
            className="flex gap-6 overflow-x-auto scrollbar-hide px-6 pb-4 snap-x snap-mandatory"
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
            }}
          >
            {properties.map((property, index) => (
              <div
                key={property.id}
                className="flex-shrink-0 w-[350px] snap-start"
                style={{
                  animationDelay: `${index * 100}ms`,
                }}
              >
                <PropertyCard
                  property={property}
                  variant="default"
                />
              </div>
            ))}

            {/* "See all" card at the end */}
            <div className="flex-shrink-0 w-[350px] snap-start">
              <Link
                href="/properties/browse"
                className="group relative block h-full min-h-[420px] rounded-3xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
                style={{
                  background: isDark ? SEARCHER_COLORS.cardDark : SEARCHER_COLORS.card,
                  border: `1px solid ${isDark ? SEARCHER_COLORS.border : 'transparent'}`,
                }}
              >
                {/* Decorative blobs */}
                <div
                  className="absolute -top-12 -right-12 w-32 h-32 rounded-full opacity-60"
                  style={{ background: isDark ? SEARCHER_COLORS.blobDark : SEARCHER_COLORS.blob }}
                />
                <div
                  className="absolute -bottom-8 -left-8 w-24 h-24 rounded-full opacity-40"
                  style={{ background: isDark ? SEARCHER_COLORS.blobDark : SEARCHER_COLORS.blob }}
                />

                {/* Content */}
                <div className="relative z-10 h-full flex flex-col items-center justify-center p-8 text-center">
                  <div
                    className="w-20 h-20 rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform"
                    style={{ background: SEARCHER_COLORS.gradient }}
                  >
                    <ArrowRight className="w-10 h-10 text-white" />
                  </div>
                  <h3
                    className="text-2xl font-bold mb-3"
                    style={{ color: isDark ? '#F5F5F7' : SEARCHER_COLORS.text }}
                  >
                    Voir tout
                  </h3>
                  <p className={`text-base mb-6 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    Explore les {totalCount} annonces disponibles
                  </p>
                  <div
                    className="px-6 py-3 rounded-full text-white font-semibold group-hover:scale-105 transition-transform"
                    style={{ background: SEARCHER_COLORS.gradient }}
                  >
                    Explorer
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </div>

        {/* Mobile CTA (visible on small screens) */}
        <div className="text-center mt-8 px-6 md:hidden">
          <Link
            href="/properties/browse"
            className="inline-flex items-center gap-3 px-8 py-4 text-white font-bold rounded-full shadow-xl transition-all hover:scale-105"
            style={{ background: SEARCHER_COLORS.gradient }}
          >
            <span>Voir les {totalCount} annonces</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>

      {/* Hide scrollbar CSS */}
      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
}
