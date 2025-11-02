'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import ArrowLeft from 'lucide-react/dist/esm/icons/arrow-left';
import Zap from 'lucide-react/dist/esm/icons/zap';

// Lazy load Framer Motion components
const AnimatePresence = dynamic(() => import('framer-motion').then(mod => ({ default: mod.AnimatePresence })), {
  ssr: false,
});
import { createClient } from '@/lib/auth/supabase-client';
import { useQuery } from '@tanstack/react-query';
import { calculateMatchScore, type UserPreferences, type PropertyFeatures } from '@/lib/services/matching-service';
import SearcherHeader from '@/components/layout/SearcherHeader';
import SwipeCard from '@/components/SwipeCard';
import SwipeActions from '@/components/SwipeActions';
import { Button } from '@/components/ui/button';

interface Property {
  id: string;
  title: string;
  city: string;
  neighborhood?: string;
  monthly_rent: number;
  bedrooms: number;
  bathrooms: number;
  main_image?: string;
  images?: string[];
  description?: string;
  furnished?: boolean;
  balcony?: boolean;
  parking?: boolean;
  available_from?: string;
  smoking_allowed?: boolean;
  pets_allowed?: boolean;
  compatibilityScore?: number;
}

interface SwipeHistory {
  propertyId: string;
  action: 'pass' | 'like' | 'superlike';
  timestamp: Date;
}

export default function SwipePage() {
  const router = useRouter();
  const supabase = createClient();
  const [userId, setUserId] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [swipeHistory, setSwipeHistory] = useState<SwipeHistory[]>([]);
  const [isAnimating, setIsAnimating] = useState(false);

  // Check authentication
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/auth?redirect=/matching/swipe');
        return;
      }
      setUserId(user.id);
    };
    checkAuth();
  }, [supabase, router]);

  // Fetch user profile
  const { data: userProfile } = useQuery({
    queryKey: ['user-profile', userId],
    queryFn: async () => {
      if (!userId) return null;
      const { data } = await supabase
        .from('profiles')
        .select('full_name, email, avatar_url')
        .eq('id', userId)
        .single();
      return data;
    },
    enabled: !!userId,
  });

  // Fetch user preferences - cached with React Query
  const { data: userPreferences } = useQuery({
    queryKey: ['user-preferences', userId],
    queryFn: async () => {
      if (!userId) return null;
      const { data } = await supabase
        .from('searcher_preferences')
        .select('*')
        .eq('user_id', userId)
        .single();
      return data as UserPreferences | null;
    },
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });

  // Fetch properties - optimized with selective column fetching
  const { data: properties, isLoading } = useQuery({
    queryKey: ['swipe-properties', userId],
    queryFn: async () => {
      // Fetch only necessary columns for swipe view
      const { data, error } = await supabase
        .from('properties')
        .select('id, title, city, neighborhood, monthly_rent, bedrooms, bathrooms, main_image, images, description, furnished, balcony, parking, available_from, smoking_allowed, pets_allowed')
        .eq('status', 'published')
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;

      // Get already swiped properties
      const { data: swipedData } = await supabase
        .from('property_likes')
        .select('property_id')
        .eq('user_id', userId);

      const swipedIds = swipedData?.map(s => s.property_id) || [];

      // Filter out already swiped
      return (data || []).filter(p => !swipedIds.includes(p.id));
    },
    enabled: !!userId,
  });

  // Calculate match scores
  const propertiesWithScores = useMemo(() => {
    if (!properties || !userPreferences) return properties || [];

    return properties.map(property => {
      try {
        const propertyFeatures: PropertyFeatures = {
          price: property.monthly_rent,
          city: property.city,
          neighborhood: property.neighborhood,
          bedrooms: property.bedrooms,
          bathrooms: property.bathrooms,
          furnished: property.furnished || false,
          balcony: property.balcony,
          parking: property.parking,
          available_from: property.available_from,
          smoking_allowed: property.smoking_allowed,
          pets_allowed: property.pets_allowed,
        };

        const matchResult = calculateMatchScore(userPreferences, propertyFeatures);

        return {
          ...property,
          compatibilityScore: matchResult.score,
        };
      } catch (error) {
        return property;
      }
    }).sort((a, b) => (b.compatibilityScore || 0) - (a.compatibilityScore || 0)); // Sort by best match first
  }, [properties, userPreferences]);

  const currentProperty = propertiesWithScores?.[currentIndex];

  const handleSwipe = useCallback(async (direction: 'left' | 'right', propertyId: string) => {
    if (isAnimating) return;

    setIsAnimating(true);
    const action = direction === 'right' ? 'like' : 'pass';

    // Save to history
    setSwipeHistory(prev => [...prev, {
      propertyId,
      action,
      timestamp: new Date(),
    }]);

    // Save to database
    if (direction === 'right') {
      await supabase.from('property_likes').insert({
        user_id: userId,
        property_id: propertyId,
        liked: true,
      });
    }

    // Move to next card
    setTimeout(() => {
      setCurrentIndex(prev => prev + 1);
      setIsAnimating(false);
    }, 300);
  }, [isAnimating, userId, supabase]);

  const handlePass = useCallback(() => {
    if (currentProperty) {
      handleSwipe('left', currentProperty.id);
    }
  }, [currentProperty, handleSwipe]);

  const handleLike = useCallback(() => {
    if (currentProperty) {
      handleSwipe('right', currentProperty.id);
    }
  }, [currentProperty, handleSwipe]);

  const handleSuperLike = useCallback(async () => {
    if (!currentProperty || isAnimating) return;

    setIsAnimating(true);

    // Save super like
    await supabase.from('property_likes').insert({
      user_id: userId,
      property_id: currentProperty.id,
      liked: true,
      super_link: true,
    });

    setSwipeHistory(prev => [...prev, {
      propertyId: currentProperty.id,
      action: 'superlike',
      timestamp: new Date(),
    }]);

    setTimeout(() => {
      setCurrentIndex(prev => prev + 1);
      setIsAnimating(false);
    }, 300);
  }, [currentProperty, isAnimating, userId, supabase]);

  const handleUndo = useCallback(() => {
    if (swipeHistory.length === 0 || currentIndex === 0) return;

    // Remove last action
    const lastAction = swipeHistory[swipeHistory.length - 1];
    setSwipeHistory(prev => prev.slice(0, -1));

    // Delete from database
    supabase.from('property_likes')
      .delete()
      .eq('user_id', userId)
      .eq('property_id', lastAction.propertyId)
      .then();

    // Go back
    setCurrentIndex(prev => prev - 1);
  }, [swipeHistory, currentIndex, userId, supabase]);

  if (isLoading || !userProfile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-purple-50">
        {userProfile && <SearcherHeader profile={userProfile} />}
        <div className="flex items-center justify-center h-[80vh]">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Chargement des propriétés...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!propertiesWithScores || propertiesWithScores.length === 0 || currentIndex >= propertiesWithScores.length) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-purple-50">
        <SearcherHeader profile={userProfile} />
        <div className="flex items-center justify-center h-[80vh]">
          <div className="text-center max-w-md px-6">
            <div className="w-24 h-24 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <Zap className="w-12 h-12 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Plus de propriétés ! 🎉
            </h2>
            <p className="text-gray-600 mb-8">
              Tu as vu toutes les propriétés disponibles. Reviens plus tard pour de nouvelles annonces !
            </p>
            <div className="flex flex-col gap-3">
              <Button
                onClick={() => router.push('/properties/browse')}
                className="w-full"
              >
                Voir mes matchs
              </Button>
              <Button
                onClick={() => router.push('/dashboard')}
                variant="outline"
                className="w-full"
              >
                Retour au dashboard
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-purple-50">
      <SearcherHeader profile={userProfile} />

      {/* Header */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="flex items-center justify-between mb-6">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-5 h-5" />
            Retour
          </Button>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              {currentIndex + 1} / {propertiesWithScores.length}
            </p>
            <div className="flex items-center gap-2 mt-1">
              <Zap className="w-4 h-4 text-yellow-500 fill-yellow-500" />
              <span className="text-sm font-medium text-gray-900">
                {swipeHistory.filter(h => h.action === 'like' || h.action === 'superlike').length} likes
              </span>
            </div>
          </div>

          <div className="w-20" /> {/* Spacer for alignment */}
        </div>
      </div>

      {/* Swipe Stack */}
      <div className="max-w-2xl mx-auto px-6">
        <div className="relative" style={{ height: '600px' }}>
          <AnimatePresence>
            {currentProperty && (
              <SwipeCard
                key={currentProperty.id}
                property={currentProperty}
                onSwipe={handleSwipe}
                onSuperLike={handleSuperLike}
              />
            )}
          </AnimatePresence>

          {/* Preview next card */}
          {propertiesWithScores[currentIndex + 1] && (
            <div className="absolute inset-0 bg-white rounded-3xl shadow-xl transform scale-95 -z-10 opacity-50" />
          )}
        </div>

        {/* Actions */}
        <div className="mt-8 mb-12">
          <SwipeActions
            onPass={handlePass}
            onLike={handleLike}
            onSuperLike={handleSuperLike}
            onUndo={handleUndo}
            canUndo={swipeHistory.length > 0 && currentIndex > 0}
          />
        </div>

        {/* Instructions */}
        <div className="text-center text-sm text-gray-500 mt-8">
          <p>Swipe ou utilise les boutons pour choisir</p>
          <p className="mt-1">
            ← Passer | ⭐ Super Like | Aimer →
          </p>
        </div>
      </div>
    </div>
  );
}
