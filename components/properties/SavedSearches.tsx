'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/auth/supabase-client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bookmark, Trash2, Bell, BellOff, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import type { AdvancedFilterOptions } from './AdvancedFilters';

interface SavedSearch {
  id: string;
  name: string;
  filters: Partial<AdvancedFilterOptions>;
  created_at: string;
  notifications_enabled: boolean;
}

interface SavedSearchesProps {
  onLoadSearch: (filters: Partial<AdvancedFilterOptions>) => void;
}

export function SavedSearches({ onLoadSearch }: SavedSearchesProps) {
  const supabase = createClient();
  const [searches, setSearches] = useState<SavedSearch[]>([]);
  const [loading, setLoading] = useState(true);

  const loadSearches = async () => {
    try {
      setLoading(true);
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      const { data, error } = await supabase
        .from('saved_searches')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setSearches(data || []);
    } catch (error) {
      console.error('Error loading saved searches:', error);
      toast.error('Impossible de charger les recherches sauvegardées');
    } finally {
      setLoading(false);
    }
  };

  const deleteSearch = async (searchId: string) => {
    try {
      const { error } = await supabase.from('saved_searches').delete().eq('id', searchId);

      if (error) throw error;

      setSearches((prev) => prev.filter((s) => s.id !== searchId));
      toast.success('Recherche supprimée');
    } catch (error) {
      console.error('Error deleting search:', error);
      toast.error('Impossible de supprimer la recherche');
    }
  };

  const toggleNotifications = async (searchId: string, currentValue: boolean) => {
    try {
      const { error } = await supabase
        .from('saved_searches')
        .update({ notifications_enabled: !currentValue })
        .eq('id', searchId);

      if (error) throw error;

      setSearches((prev) =>
        prev.map((s) =>
          s.id === searchId ? { ...s, notifications_enabled: !currentValue } : s
        )
      );

      toast.success(
        !currentValue
          ? 'Notifications activées pour cette recherche'
          : 'Notifications désactivées'
      );
    } catch (error) {
      console.error('Error toggling notifications:', error);
      toast.error('Impossible de modifier les notifications');
    }
  };

  useEffect(() => {
    loadSearches();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="w-6 h-6 animate-spin text-purple-600" />
      </div>
    );
  }

  if (searches.length === 0) {
    return (
      <div className="text-center p-8">
        <Bookmark className="w-12 h-12 text-gray-300 mx-auto mb-3" />
        <p className="text-gray-600">Aucune recherche sauvegardée</p>
        <p className="text-sm text-gray-500 mt-1">
          Sauvegardez vos recherches pour y accéder rapidement plus tard
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {searches.map((search) => (
        <Card key={search.id} className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900 mb-2">{search.name}</h4>

                {/* Display some key filters */}
                <div className="flex flex-wrap gap-2 mb-3">
                  {search.filters.city && (
                    <Badge variant="secondary" size="sm">
                      {search.filters.city}
                    </Badge>
                  )}
                  {search.filters.propertyType && search.filters.propertyType !== 'all' && (
                    <Badge variant="secondary" size="sm">
                      {search.filters.propertyType}
                    </Badge>
                  )}
                  {search.filters.bedrooms !== null && search.filters.bedrooms !== undefined && (
                    <Badge variant="secondary" size="sm">
                      {search.filters.bedrooms} chambre{search.filters.bedrooms > 1 ? 's' : ''}
                    </Badge>
                  )}
                  {(search.filters.minPrice || search.filters.maxPrice) && (
                    <Badge variant="secondary" size="sm">
                      {search.filters.minPrice}€ - {search.filters.maxPrice}€
                    </Badge>
                  )}
                  {search.filters.amenities && search.filters.amenities.length > 0 && (
                    <Badge variant="secondary" size="sm">
                      +{search.filters.amenities.length} équipement
                      {search.filters.amenities.length > 1 ? 's' : ''}
                    </Badge>
                  )}
                </div>

                <p className="text-xs text-gray-500">
                  Créée{' '}
                  {formatDistanceToNow(new Date(search.created_at), {
                    addSuffix: true,
                    locale: fr,
                  })}
                </p>
              </div>

              {/* Actions */}
              <div className="flex gap-2 ml-4">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => toggleNotifications(search.id, search.notifications_enabled)}
                  title={
                    search.notifications_enabled
                      ? 'Désactiver les notifications'
                      : 'Activer les notifications'
                  }
                >
                  {search.notifications_enabled ? (
                    <Bell className="w-4 h-4 text-purple-600" />
                  ) : (
                    <BellOff className="w-4 h-4 text-gray-400" />
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => deleteSearch(search.id)}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  title="Supprimer"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Load search button */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => onLoadSearch(search.filters)}
              className="w-full mt-3"
            >
              Charger cette recherche
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
