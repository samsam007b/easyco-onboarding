'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/auth/supabase-client';
import { toast } from 'sonner';
import { getHookTranslation } from '@/lib/i18n/get-language';

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
        .select('id, user_id, property_id, created_at')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setFavorites(data || []);
      setFavoriteIds(new Set((data || []).map(f => f.property_id)));
    } catch (error: any) {
      // FIXME: Use logger.error - 'Error loading favorites:', error);
      toast.error(getHookTranslation('favorites', 'loadFailed'));
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
      toast.error(getHookTranslation('favorites', 'loginRequired'));
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

      toast.success(getHookTranslation('favorites', 'added'));
      return true;
    } catch (error: any) {
      // FIXME: Use logger.error - 'Error adding favorite:', error);

      if (error.code === '23505') {
        toast.error(getHookTranslation('favorites', 'alreadyExists'));
      } else {
        toast.error(getHookTranslation('favorites', 'addFailed'));
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

      toast.success(getHookTranslation('favorites', 'removed'));
      return true;
    } catch (error: any) {
      // FIXME: Use logger.error - 'Error removing favorite:', error);
      toast.error(getHookTranslation('favorites', 'removeFailed'));
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
