'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/auth/supabase-client';
import { logger } from '@/lib/utils/logger';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bookmark, Trash2, Bell, BellOff } from 'lucide-react';
import LoadingHouse from '@/components/ui/LoadingHouse';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';
import { fr, enUS, nl, de } from 'date-fns/locale';
import { useLanguage } from '@/lib/i18n/use-language';
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
  const { language, getSection } = useLanguage();
  const t = getSection('components')?.savedSearches;
  const supabase = createClient();
  const [searches, setSearches] = useState<SavedSearch[]>([]);
  const [loading, setLoading] = useState(true);

  const dateLocale = { fr, en: enUS, nl, de }[language] || fr;

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
      logger.error('Error loading saved searches', error);
      toast.error(t?.loadError?.[language] || 'Unable to load saved searches');
    } finally {
      setLoading(false);
    }
  };

  const deleteSearch = async (searchId: string) => {
    try {
      const { error } = await supabase.from('saved_searches').delete().eq('id', searchId);

      if (error) throw error;

      setSearches((prev) => prev.filter((s) => s.id !== searchId));
      toast.success(t?.deleteSuccess?.[language] || 'Search deleted');
    } catch (error) {
      logger.error('Error deleting search', error);
      toast.error(t?.deleteError?.[language] || 'Unable to delete search');
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
          ? (t?.notificationsEnabled?.[language] || 'Notifications enabled for this search')
          : (t?.notificationsDisabled?.[language] || 'Notifications disabled')
      );
    } catch (error) {
      logger.error('Error toggling notifications', error);
      toast.error(t?.notificationsError?.[language] || 'Unable to modify notifications');
    }
  };

  useEffect(() => {
    loadSearches();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <LoadingHouse size={40} />
      </div>
    );
  }

  if (searches.length === 0) {
    return (
      <div className="text-center p-8">
        <Bookmark className="w-12 h-12 text-gray-300 mx-auto mb-3" />
        <p className="text-gray-600">{t?.noSearches?.[language] || 'No saved searches'}</p>
        <p className="text-sm text-gray-500 mt-1">
          {t?.noSearchesHint?.[language] || 'Save your searches to access them quickly later'}
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
                      {search.filters.bedrooms} {search.filters.bedrooms > 1
                        ? (t?.bedrooms?.[language] || 'bedrooms')
                        : (t?.bedroom?.[language] || 'bedroom')}
                    </Badge>
                  )}
                  {(search.filters.minPrice || search.filters.maxPrice) && (
                    <Badge variant="secondary" size="sm">
                      {search.filters.minPrice}€ - {search.filters.maxPrice}€
                    </Badge>
                  )}
                  {search.filters.amenities && search.filters.amenities.length > 0 && (
                    <Badge variant="secondary" size="sm">
                      +{search.filters.amenities.length} {search.filters.amenities.length > 1
                        ? (t?.amenities?.[language] || 'amenities')
                        : (t?.amenity?.[language] || 'amenity')}
                    </Badge>
                  )}
                </div>

                <p className="text-xs text-gray-500">
                  {t?.created?.[language] || 'Created'}{' '}
                  {formatDistanceToNow(new Date(search.created_at), {
                    addSuffix: true,
                    locale: dateLocale,
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
                      ? (t?.disableNotifications?.[language] || 'Disable notifications')
                      : (t?.enableNotifications?.[language] || 'Enable notifications')
                  }
                >
                  {search.notifications_enabled ? (
                    <Bell className="w-4 h-4 text-searcher-600" />
                  ) : (
                    <BellOff className="w-4 h-4 text-gray-400" />
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => deleteSearch(search.id)}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  title={t?.delete?.[language] || 'Delete'}
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
              {t?.loadSearch?.[language] || 'Load this search'}
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
