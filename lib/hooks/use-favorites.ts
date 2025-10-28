'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/auth/supabase-client';
import { toast } from 'sonner';

export interface Favorite {
  id: string;
  user_id: string;
  property_id: string;
  created_at: string;
}

export function useFavorites(userId?: string) {
  const supabase = createClient();
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);

  // Load user's favorites
  const loadFavorites = async () => {
    if (!userId) {
      setIsLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('favorites')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setFavorites(data || []);
      setFavoriteIds(new Set((data || []).map(f => f.property_id)));
    } catch (error: any) {
      // FIXME: Use logger.error - 'Error loading favorites:', error);
      toast.error('Failed to load favorites');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadFavorites();
  }, [userId]);

  // Check if a property is favorited
  const isFavorited = (propertyId: string): boolean => {
    return favoriteIds.has(propertyId);
  };

  // Add a property to favorites
  const addFavorite = async (propertyId: string): Promise<boolean> => {
    if (!userId) {
      toast.error('Please login to save favorites');
      return false;
    }

    try {
      const { error } = await supabase
        .from('favorites')
        .insert({
          user_id: userId,
          property_id: propertyId,
        });

      if (error) throw error;

      // Update local state
      setFavoriteIds(prev => new Set([...prev, propertyId]));

      // Reload to get the full favorite object
      await loadFavorites();

      toast.success('Added to favorites');
      return true;
    } catch (error: any) {
      // FIXME: Use logger.error - 'Error adding favorite:', error);

      if (error.code === '23505') {
        toast.error('Already in favorites');
      } else {
        toast.error('Failed to add favorite');
      }

      return false;
    }
  };

  // Remove a property from favorites
  const removeFavorite = async (propertyId: string): Promise<boolean> => {
    if (!userId) {
      return false;
    }

    try {
      const { error } = await supabase
        .from('favorites')
        .delete()
        .eq('user_id', userId)
        .eq('property_id', propertyId);

      if (error) throw error;

      // Update local state
      setFavoriteIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(propertyId);
        return newSet;
      });

      // Reload favorites list
      await loadFavorites();

      toast.success('Removed from favorites');
      return true;
    } catch (error: any) {
      // FIXME: Use logger.error - 'Error removing favorite:', error);
      toast.error('Failed to remove favorite');
      return false;
    }
  };

  // Toggle favorite status
  const toggleFavorite = async (propertyId: string): Promise<boolean> => {
    if (isFavorited(propertyId)) {
      return await removeFavorite(propertyId);
    } else {
      return await addFavorite(propertyId);
    }
  };

  return {
    favorites,
    favoriteIds,
    isLoading,
    isFavorited,
    addFavorite,
    removeFavorite,
    toggleFavorite,
    refreshFavorites: loadFavorites,
  };
}
