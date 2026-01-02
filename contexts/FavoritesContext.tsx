'use client';

import { createContext, useContext, useState, useEffect, ReactNode, useRef } from 'react';
import { createClient } from '@/lib/auth/supabase-client';
import { useAuth } from '@/lib/contexts/auth-context';
import { useLanguage } from '@/lib/i18n/use-language';
import { toast } from 'sonner';
import type {
  UserFavorite,
  FavoriteWithDetails,
  PropertyComparison,
  SavedSearch,
  PropertyMatch,
  FavoritesContextValue,
  AddFavoriteParams,
  UpdateFavoriteParams,
  CreateComparisonParams,
  UpdateComparisonParams,
  CreateSavedSearchParams,
  UpdateSavedSearchParams,
} from '@/types/favorites.types';

// =============================================================================
// TRANSLATIONS
// =============================================================================
const t = {
  loading: {
    favorites: {
      fr: 'Erreur lors du chargement des favoris',
      en: 'Error loading favorites',
      nl: 'Fout bij laden van favorieten',
      de: 'Fehler beim Laden der Favoriten',
    },
    comparisons: {
      fr: 'Erreur lors du chargement des comparaisons',
      en: 'Error loading comparisons',
      nl: 'Fout bij laden van vergelijkingen',
      de: 'Fehler beim Laden der Vergleiche',
    },
    searches: {
      fr: 'Erreur lors du chargement des recherches',
      en: 'Error loading searches',
      nl: 'Fout bij laden van zoekopdrachten',
      de: 'Fehler beim Laden der Suchen',
    },
  },
  auth: {
    required: {
      fr: 'Vous devez être connecté',
      en: 'You must be logged in',
      nl: 'U moet ingelogd zijn',
      de: 'Sie müssen angemeldet sein',
    },
  },
  favorites: {
    added: {
      fr: 'Propriété ajoutée aux favoris',
      en: 'Property added to favorites',
      nl: 'Eigendom toegevoegd aan favorieten',
      de: 'Immobilie zu Favoriten hinzugefügt',
    },
    alreadyExists: {
      fr: 'Cette propriété est déjà dans vos favoris',
      en: 'This property is already in your favorites',
      nl: 'Dit eigendom staat al in uw favorieten',
      de: 'Diese Immobilie ist bereits in Ihren Favoriten',
    },
    addError: {
      fr: "Erreur lors de l'ajout aux favoris",
      en: 'Error adding to favorites',
      nl: 'Fout bij toevoegen aan favorieten',
      de: 'Fehler beim Hinzufügen zu Favoriten',
    },
    updated: {
      fr: 'Favori mis à jour',
      en: 'Favorite updated',
      nl: 'Favoriet bijgewerkt',
      de: 'Favorit aktualisiert',
    },
    updateError: {
      fr: 'Erreur lors de la mise à jour',
      en: 'Error updating',
      nl: 'Fout bij bijwerken',
      de: 'Fehler beim Aktualisieren',
    },
    removed: {
      fr: 'Propriété retirée des favoris',
      en: 'Property removed from favorites',
      nl: 'Eigendom verwijderd uit favorieten',
      de: 'Immobilie aus Favoriten entfernt',
    },
    removeError: {
      fr: 'Erreur lors de la suppression',
      en: 'Error removing',
      nl: 'Fout bij verwijderen',
      de: 'Fehler beim Entfernen',
    },
  },
  comparisons: {
    created: {
      fr: 'Comparaison créée',
      en: 'Comparison created',
      nl: 'Vergelijking aangemaakt',
      de: 'Vergleich erstellt',
    },
    createError: {
      fr: 'Erreur lors de la création de la comparaison',
      en: 'Error creating comparison',
      nl: 'Fout bij aanmaken vergelijking',
      de: 'Fehler beim Erstellen des Vergleichs',
    },
    updated: {
      fr: 'Comparaison mise à jour',
      en: 'Comparison updated',
      nl: 'Vergelijking bijgewerkt',
      de: 'Vergleich aktualisiert',
    },
    updateError: {
      fr: 'Erreur lors de la mise à jour',
      en: 'Error updating',
      nl: 'Fout bij bijwerken',
      de: 'Fehler beim Aktualisieren',
    },
    deleted: {
      fr: 'Comparaison supprimée',
      en: 'Comparison deleted',
      nl: 'Vergelijking verwijderd',
      de: 'Vergleich gelöscht',
    },
    deleteError: {
      fr: 'Erreur lors de la suppression',
      en: 'Error deleting',
      nl: 'Fout bij verwijderen',
      de: 'Fehler beim Löschen',
    },
    maxProperties: {
      fr: 'Maximum 5 propriétés par comparaison',
      en: 'Maximum 5 properties per comparison',
      nl: 'Maximaal 5 eigendommen per vergelijking',
      de: 'Maximal 5 Immobilien pro Vergleich',
    },
    propertyExists: {
      fr: 'Cette propriété est déjà dans la comparaison',
      en: 'This property is already in the comparison',
      nl: 'Dit eigendom staat al in de vergelijking',
      de: 'Diese Immobilie ist bereits im Vergleich',
    },
  },
  searches: {
    saved: {
      fr: 'Recherche sauvegardée',
      en: 'Search saved',
      nl: 'Zoekopdracht opgeslagen',
      de: 'Suche gespeichert',
    },
    saveError: {
      fr: 'Erreur lors de la sauvegarde de la recherche',
      en: 'Error saving search',
      nl: 'Fout bij opslaan zoekopdracht',
      de: 'Fehler beim Speichern der Suche',
    },
    updated: {
      fr: 'Recherche mise à jour',
      en: 'Search updated',
      nl: 'Zoekopdracht bijgewerkt',
      de: 'Suche aktualisiert',
    },
    updateError: {
      fr: 'Erreur lors de la mise à jour',
      en: 'Error updating',
      nl: 'Fout bij bijwerken',
      de: 'Fehler beim Aktualisieren',
    },
    deleted: {
      fr: 'Recherche supprimée',
      en: 'Search deleted',
      nl: 'Zoekopdracht verwijderd',
      de: 'Suche gelöscht',
    },
    deleteError: {
      fr: 'Erreur lors de la suppression',
      en: 'Error deleting',
      nl: 'Fout bij verwijderen',
      de: 'Fehler beim Löschen',
    },
    matchError: {
      fr: 'Erreur lors de la recherche de correspondances',
      en: 'Error finding matches',
      nl: 'Fout bij zoeken naar overeenkomsten',
      de: 'Fehler beim Suchen von Übereinstimmungen',
    },
  },
};

type Language = 'fr' | 'en' | 'nl' | 'de';

const FavoritesContext = createContext<FavoritesContextValue | undefined>(undefined);

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within FavoritesProvider');
  }
  return context;
}

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const { language } = useLanguage();
  const langRef = useRef<Language>(language as Language);
  langRef.current = language as Language;
  const supabase = createClient();

  // State
  const [favorites, setFavorites] = useState<FavoriteWithDetails[]>([]);
  const [comparisons, setComparisons] = useState<PropertyComparison[]>([]);
  const [savedSearches, setSavedSearches] = useState<SavedSearch[]>([]);
  const [favoritesCount, setFavoritesCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  // ============================================================================
  // FAVORITES
  // ============================================================================

  const loadFavorites = async () => {
    if (!user) return;

    try {
      setIsLoading(true);

      // Use the database function to get favorites with full details
      const { data, error } = await supabase
        .rpc('get_user_favorites_with_details', { user_uuid: user.id });

      if (error) throw error;
      setFavorites(data || []);
      setFavoritesCount(data?.length || 0);
    } catch (error) {
      console.error('Error loading favorites:', error);
      toast.error(t.loading.favorites[langRef.current]);
    } finally {
      setIsLoading(false);
    }
  };

  const addFavorite = async (params: AddFavoriteParams): Promise<UserFavorite | null> => {
    if (!user) {
      toast.error(t.auth.required[langRef.current]);
      return null;
    }

    // Optimistic update - add to local state immediately
    const optimisticId = `temp-${Date.now()}`;
    const optimisticFavorite: FavoriteWithDetails = {
      favorite_id: optimisticId,
      property_id: params.property_id,
      priority: params.priority || 3,
      user_notes: params.user_notes || undefined,
      created_at: new Date().toISOString(),
      visited: false,
      // Property details will be loaded on next full refresh
      property_title: '',
      monthly_rent: 0,
      property_city: undefined,
      property_neighborhood: undefined,
      bedrooms: 0,
      main_image: undefined,
      available_from: undefined,
    };

    setFavorites(prev => [optimisticFavorite, ...prev]);
    setFavoritesCount(prev => prev + 1);

    try {
      const { data, error } = await supabase
        .from('user_favorites')
        .insert({
          user_id: user.id,
          ...params,
          priority: params.priority || 3,
        })
        .select('id, user_id, property_id, priority, user_notes, is_active, visited, created_at, updated_at')
        .single();

      if (error) throw error;

      // Replace optimistic entry with real data (will get full details on next load)
      setFavorites(prev => prev.map(f =>
        f.favorite_id === optimisticId
          ? { ...f, favorite_id: data.id }
          : f
      ));

      toast.success(t.favorites.added[langRef.current]);
      // Type assertion needed because Supabase infers from insert, not select
      return {
        id: data.id,
        user_id: data.user_id,
        property_id: data.property_id,
        user_notes: data.user_notes,
        priority: data.priority,
        is_active: data.is_active,
        visited: data.visited,
        created_at: data.created_at,
        updated_at: data.updated_at,
      } as UserFavorite;
    } catch (error: any) {
      // Rollback optimistic update on error
      setFavorites(prev => prev.filter(f => f.favorite_id !== optimisticId));
      setFavoritesCount(prev => prev - 1);

      // Check for unique constraint violation
      if (error?.code === '23505') {
        toast.info(t.favorites.alreadyExists[langRef.current]);
      } else {
        console.error('Error adding favorite:', error);
        toast.error(t.favorites.addError[langRef.current]);
      }
      return null;
    }
  };

  const updateFavorite = async (
    favoriteId: string,
    params: UpdateFavoriteParams
  ): Promise<boolean> => {
    if (!user) return false;

    // Store original state for rollback
    const originalFavorites = [...favorites];

    // Optimistic update
    setFavorites(prev => prev.map(f =>
      f.favorite_id === favoriteId
        ? { ...f, ...params }
        : f
    ));

    try {
      const { error } = await supabase
        .from('user_favorites')
        .update(params)
        .eq('id', favoriteId)
        .eq('user_id', user.id);

      if (error) throw error;

      toast.success(t.favorites.updated[langRef.current]);
      return true;
    } catch (error) {
      // Rollback on error
      setFavorites(originalFavorites);
      console.error('Error updating favorite:', error);
      toast.error(t.favorites.updateError[langRef.current]);
      return false;
    }
  };

  const removeFavorite = async (favoriteId: string): Promise<boolean> => {
    if (!user) return false;

    // Store original state for rollback
    const originalFavorites = [...favorites];
    const originalCount = favoritesCount;

    // Optimistic update - remove immediately
    setFavorites(prev => prev.filter(f => f.favorite_id !== favoriteId));
    setFavoritesCount(prev => prev - 1);

    try {
      const { error } = await supabase
        .from('user_favorites')
        .delete()
        .eq('id', favoriteId)
        .eq('user_id', user.id);

      if (error) throw error;

      toast.success(t.favorites.removed[langRef.current]);
      return true;
    } catch (error) {
      // Rollback on error
      setFavorites(originalFavorites);
      setFavoritesCount(originalCount);
      console.error('Error removing favorite:', error);
      toast.error(t.favorites.removeError[langRef.current]);
      return false;
    }
  };

  const isFavorited = (propertyId: string): boolean => {
    return favorites.some(fav => fav.property_id === propertyId);
  };

  const toggleFavorite = async (propertyId: string): Promise<boolean> => {
    const existing = favorites.find(fav => fav.property_id === propertyId);

    if (existing) {
      return await removeFavorite(existing.favorite_id);
    } else {
      const result = await addFavorite({ property_id: propertyId });
      return result !== null;
    }
  };

  // ============================================================================
  // COMPARISONS
  // ============================================================================

  const loadComparisons = async () => {
    if (!user) return;

    try {
      // Step 1: Load all comparisons (1 query)
      const { data, error } = await supabase
        .from('property_comparisons')
        .select('id, user_id, name, property_ids, created_at, updated_at, is_active')
        .eq('user_id', user.id)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      if (!data || data.length === 0) {
        setComparisons([]);
        return;
      }

      // Step 2: Collect ALL unique property IDs across all comparisons
      const allPropertyIds = [...new Set(
        data.flatMap(comparison => comparison.property_ids || [])
      )];

      // Step 3: Single batch query for all properties (1 query instead of N)
      let propertiesMap = new Map<string, any>();
      if (allPropertyIds.length > 0) {
        const { data: properties } = await supabase
          .from('properties')
          .select('id, title, price, city, neighborhood, bedrooms, bathrooms, images, status')
          .in('id', allPropertyIds);

        propertiesMap = new Map((properties || []).map(p => [p.id, p]));
      }

      // Step 4: Enrich comparisons with property data (no additional queries)
      const comparisonsWithProperties: PropertyComparison[] = data.map(comparison => ({
        ...comparison,
        properties: (comparison.property_ids || [])
          .map((id: string) => propertiesMap.get(id))
          .filter(Boolean),
      }));

      setComparisons(comparisonsWithProperties);
    } catch (error) {
      console.error('Error loading comparisons:', error);
      toast.error(t.loading.comparisons[langRef.current]);
    }
  };

  const createComparison = async (
    params: CreateComparisonParams
  ): Promise<PropertyComparison | null> => {
    if (!user) {
      toast.error(t.auth.required[langRef.current]);
      return null;
    }

    try {
      const { data, error } = await supabase
        .from('property_comparisons')
        .insert({
          user_id: user.id,
          ...params,
        })
        .select()
        .single();

      if (error) throw error;

      await loadComparisons();
      toast.success(t.comparisons.created[langRef.current]);
      return data;
    } catch (error) {
      console.error('Error creating comparison:', error);
      toast.error(t.comparisons.createError[langRef.current]);
      return null;
    }
  };

  const updateComparison = async (
    comparisonId: string,
    params: UpdateComparisonParams
  ): Promise<boolean> => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('property_comparisons')
        .update(params)
        .eq('id', comparisonId)
        .eq('user_id', user.id);

      if (error) throw error;

      await loadComparisons();
      toast.success(t.comparisons.updated[langRef.current]);
      return true;
    } catch (error) {
      console.error('Error updating comparison:', error);
      toast.error(t.comparisons.updateError[langRef.current]);
      return false;
    }
  };

  const deleteComparison = async (comparisonId: string): Promise<boolean> => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('property_comparisons')
        .delete()
        .eq('id', comparisonId)
        .eq('user_id', user.id);

      if (error) throw error;

      await loadComparisons();
      toast.success(t.comparisons.deleted[langRef.current]);
      return true;
    } catch (error) {
      console.error('Error deleting comparison:', error);
      toast.error(t.comparisons.deleteError[langRef.current]);
      return false;
    }
  };

  const addPropertyToComparison = async (
    comparisonId: string,
    propertyId: string
  ): Promise<boolean> => {
    const comparison = comparisons.find(c => c.id === comparisonId);
    if (!comparison) return false;

    // Max 5 properties per comparison
    if (comparison.property_ids.length >= 5) {
      toast.error(t.comparisons.maxProperties[langRef.current]);
      return false;
    }

    if (comparison.property_ids.includes(propertyId)) {
      toast.info(t.comparisons.propertyExists[langRef.current]);
      return false;
    }

    return await updateComparison(comparisonId, {
      property_ids: [...comparison.property_ids, propertyId],
    });
  };

  const removePropertyFromComparison = async (
    comparisonId: string,
    propertyId: string
  ): Promise<boolean> => {
    const comparison = comparisons.find(c => c.id === comparisonId);
    if (!comparison) return false;

    return await updateComparison(comparisonId, {
      property_ids: comparison.property_ids.filter(id => id !== propertyId),
    });
  };

  // ============================================================================
  // SAVED SEARCHES
  // ============================================================================

  const loadSavedSearches = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('saved_searches')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSavedSearches(data || []);
    } catch (error) {
      console.error('Error loading saved searches:', error);
      toast.error(t.loading.searches[langRef.current]);
    }
  };

  const createSavedSearch = async (
    params: CreateSavedSearchParams
  ): Promise<SavedSearch | null> => {
    if (!user) {
      toast.error(t.auth.required[langRef.current]);
      return null;
    }

    try {
      const { data, error } = await supabase
        .from('saved_searches')
        .insert({
          user_id: user.id,
          ...params,
        })
        .select()
        .single();

      if (error) throw error;

      await loadSavedSearches();
      toast.success(t.searches.saved[langRef.current]);
      return data;
    } catch (error) {
      console.error('Error creating saved search:', error);
      toast.error(t.searches.saveError[langRef.current]);
      return null;
    }
  };

  const updateSavedSearch = async (
    searchId: string,
    params: UpdateSavedSearchParams
  ): Promise<boolean> => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('saved_searches')
        .update(params)
        .eq('id', searchId)
        .eq('user_id', user.id);

      if (error) throw error;

      await loadSavedSearches();
      toast.success(t.searches.updated[langRef.current]);
      return true;
    } catch (error) {
      console.error('Error updating saved search:', error);
      toast.error(t.searches.updateError[langRef.current]);
      return false;
    }
  };

  const deleteSavedSearch = async (searchId: string): Promise<boolean> => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('saved_searches')
        .delete()
        .eq('id', searchId)
        .eq('user_id', user.id);

      if (error) throw error;

      await loadSavedSearches();
      toast.success(t.searches.deleted[langRef.current]);
      return true;
    } catch (error) {
      console.error('Error deleting saved search:', error);
      toast.error(t.searches.deleteError[langRef.current]);
      return false;
    }
  };

  const findMatchingProperties = async (searchId: string): Promise<PropertyMatch[]> => {
    try {
      const { data, error } = await supabase
        .rpc('find_properties_matching_search', { search_uuid: searchId });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error finding matching properties:', error);
      toast.error(t.searches.matchError[langRef.current]);
      return [];
    }
  };

  // ============================================================================
  // STATS
  // ============================================================================

  const getFavoritesCount = async (): Promise<number> => {
    if (!user) return 0;

    try {
      const { data, error } = await supabase
        .rpc('get_favorites_count', { user_uuid: user.id });

      if (error) throw error;
      return data || 0;
    } catch (error) {
      console.error('Error getting favorites count:', error);
      return 0;
    }
  };

  // ============================================================================
  // EFFECTS
  // ============================================================================

  // Load initial data when user is authenticated
  useEffect(() => {
    if (user) {
      loadFavorites();
      loadComparisons();
      loadSavedSearches();
    } else {
      // Clear data on logout
      setFavorites([]);
      setComparisons([]);
      setSavedSearches([]);
      setFavoritesCount(0);
    }
  }, [user]);

  // ============================================================================
  // CONTEXT VALUE
  // ============================================================================

  const value: FavoritesContextValue = {
    favorites,
    comparisons,
    savedSearches,
    favoritesCount,
    isLoading,

    loadFavorites,
    addFavorite,
    updateFavorite,
    removeFavorite,
    isFavorited,
    toggleFavorite,

    loadComparisons,
    createComparison,
    updateComparison,
    deleteComparison,
    addPropertyToComparison,
    removePropertyFromComparison,

    loadSavedSearches,
    createSavedSearch,
    updateSavedSearch,
    deleteSavedSearch,
    findMatchingProperties,

    getFavoritesCount,
  };

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
}
