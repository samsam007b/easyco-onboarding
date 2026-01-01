'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/auth/supabase-client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Search, Bell, BellOff, Trash2, Play, Edit, MapPin, Home, DollarSign, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';
import LoadingHouse from '@/components/ui/LoadingHouse';
import { useLanguage } from '@/lib/i18n/use-language';

interface SavedSearch {
  id: string;
  name: string;
  filters: {
    city?: string;
    minPrice?: number;
    maxPrice?: number;
    bedrooms?: number;
    bathrooms?: number;
    propertyType?: string;
    furnished?: boolean;
    amenities?: string[];
  };
  email_alerts: boolean;
  alert_frequency: string;
  created_at: string;
  updated_at: string;
  last_checked_at?: string;
  properties_found_count: number;
  last_match_count: number;
}

export default function SavedSearchesPage() {
  const router = useRouter();
  const supabase = createClient();
  const { language, getSection } = useLanguage();
  const t = getSection('dashboard')?.searcher?.savedSearches;
  const [savedSearches, setSavedSearches] = useState<SavedSearch[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSavedSearches();
  }, []);

  const loadSavedSearches = async () => {
    try {
      setLoading(true);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }

      const { data, error } = await supabase
        .from('saved_searches')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading saved searches:', error);
        toast.error(t?.messages?.loadError?.[language] || 'Erreur lors du chargement');
        return;
      }

      setSavedSearches(data || []);
    } catch (error) {
      console.error('Error:', error);
      toast.error(t?.messages?.error?.[language] || 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    const confirmMessage = t?.messages?.confirmDelete?.[language]?.replace('{name}', name) || `Supprimer la recherche "${name}" ?`;
    if (!confirm(confirmMessage)) return;

    try {
      const { error } = await supabase
        .from('saved_searches')
        .delete()
        .eq('id', id);

      if (error) {
        toast.error(t?.messages?.deleteError?.[language] || 'Erreur lors de la suppression');
        return;
      }

      setSavedSearches(prev => prev.filter(s => s.id !== id));
      toast.success(t?.messages?.deleted?.[language] || 'Recherche supprimée');
    } catch (error) {
      console.error('Error:', error);
      toast.error(t?.messages?.error?.[language] || 'Une erreur est survenue');
    }
  };

  const handleToggleAlerts = async (id: string, currentValue: boolean) => {
    try {
      const { error } = await supabase
        .from('saved_searches')
        .update({ email_alerts: !currentValue })
        .eq('id', id);

      if (error) {
        toast.error(t?.messages?.updateError?.[language] || 'Erreur lors de la mise à jour');
        return;
      }

      setSavedSearches(prev =>
        prev.map(s => s.id === id ? { ...s, email_alerts: !currentValue } : s)
      );

      toast.success(!currentValue
        ? (t?.messages?.alertsEnabled?.[language] || 'Alertes activées')
        : (t?.messages?.alertsDisabled?.[language] || 'Alertes désactivées'));
    } catch (error) {
      console.error('Error:', error);
      toast.error(t?.messages?.error?.[language] || 'Une erreur est survenue');
    }
  };

  const buildSearchUrl = (filters: SavedSearch['filters']) => {
    const params = new URLSearchParams();

    if (filters.city) params.set('city', filters.city);
    if (filters.minPrice) params.set('minPrice', filters.minPrice.toString());
    if (filters.maxPrice) params.set('maxPrice', filters.maxPrice.toString());
    if (filters.bedrooms) params.set('bedrooms', filters.bedrooms.toString());
    if (filters.bathrooms) params.set('bathrooms', filters.bathrooms.toString());
    if (filters.propertyType) params.set('propertyType', filters.propertyType);
    if (filters.furnished !== undefined) params.set('furnished', filters.furnished.toString());

    return `/properties/browse?${params.toString()}`;
  };

  const renderFilterSummary = (filters: SavedSearch['filters']) => {
    const parts: string[] = [];

    if (filters.city) parts.push(`📍 ${filters.city}`);
    if (filters.minPrice || filters.maxPrice) {
      const upToLabel = t?.filters?.upTo?.[language] || 'Jusqu\'à';
      const priceStr = filters.minPrice && filters.maxPrice
        ? `€${filters.minPrice}-${filters.maxPrice}`
        : filters.minPrice
        ? `€${filters.minPrice}+`
        : `${upToLabel} €${filters.maxPrice}`;
      parts.push(`💰 ${priceStr}`);
    }
    if (filters.bedrooms) parts.push(`🛏️ ${filters.bedrooms} ${t?.filters?.bedrooms?.[language] || 'chambres'}`);
    if (filters.propertyType) parts.push(`🏠 ${filters.propertyType}`);
    if (filters.furnished) parts.push(`✨ ${t?.filters?.furnished?.[language] || 'Meublé'}`);

    return parts.length > 0 ? parts.join(' • ') : (t?.filters?.noFilter?.[language] || 'Aucun filtre');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 p-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center py-12">
            <LoadingHouse size={80} />
            <p className="text-gray-600">{t?.loading?.[language] || 'Chargement...'}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => router.back()}
              className="gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              {t?.back?.[language] || 'Retour'}
            </Button>

            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-600 rounded-2xl flex items-center justify-center shadow-md">
                  <Search className="w-6 h-6 text-white" />
                </div>
                {t?.title?.[language] || 'Mes Recherches Sauvegardées'}
              </h1>
              <p className="text-gray-600 mt-1">
                {savedSearches.length} {savedSearches.length === 1
                  ? (t?.count?.singular?.[language] || 'recherche sauvegardée')
                  : (t?.count?.plural?.[language] || 'recherches sauvegardées')}
              </p>
            </div>
          </div>

          <Button
            onClick={() => router.push('/properties/browse')}
            className="bg-gradient-to-r from-[#FFA040] to-[#FFB85C] text-white hover:from-[#FF8C30] hover:to-[#FFA548] gap-2"
          >
            <Search className="w-4 h-4" />
            {t?.newSearch?.[language] || 'Nouvelle Recherche'}
          </Button>
        </div>

        {/* Empty State */}
        {savedSearches.length === 0 ? (
          <div className="relative overflow-hidden bg-gradient-to-br from-orange-50 via-white to-orange-50 rounded-3xl border-2 border-orange-100 shadow-lg">
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-orange-200/30 to-orange-300/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-orange-100/40 to-orange-200/30 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2"></div>

            <div className="relative flex flex-col items-center justify-center py-20 px-8">
              <div className="w-24 h-24 bg-gradient-to-br from-orange-400 to-orange-600 rounded-3xl flex items-center justify-center mb-6 shadow-xl shadow-orange-500/30 animate-pulse">
                <Search className="w-12 h-12 text-white" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-3">
                {t?.empty?.title?.[language] || 'Aucune recherche sauvegardée'}
              </h3>
              <p className="text-lg text-gray-600 text-center max-w-md mb-8">
                {t?.empty?.description?.[language] || 'Sauvegarde tes recherches pour recevoir des alertes quand de nouvelles propriétés correspondent à tes critères'}
              </p>
              <Button
                onClick={() => router.push('/properties/browse')}
                className="bg-gradient-to-r from-[#FFA040] to-[#FFB85C] text-white hover:from-[#FF8C30] hover:to-[#FFA548] px-8 py-6 text-lg rounded-2xl shadow-lg shadow-orange-500/30 hover:shadow-xl hover:shadow-orange-500/40 transition-all"
              >
                <Sparkles className="w-5 h-5 mr-2" />
                {t?.empty?.button?.[language] || 'Créer une recherche'}
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {savedSearches.map((search) => (
              <Card key={search.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-xl mb-2">{search.name}</CardTitle>
                      <p className="text-sm text-gray-600 mb-3">
                        {renderFilterSummary(search.filters)}
                      </p>

                      <div className="flex flex-wrap gap-2">
                        <Badge variant={search.email_alerts ? 'default' : 'secondary'} className="gap-1">
                          {search.email_alerts ? <Bell className="w-3 h-3" /> : <BellOff className="w-3 h-3" />}
                          {search.email_alerts
                            ? `${t?.card?.alerts?.[language] || 'Alertes'} ${search.alert_frequency}`
                            : (t?.card?.alertsDisabled?.[language] || 'Alertes désactivées')}
                        </Badge>

                        {search.last_match_count > 0 && (
                          <Badge className="bg-green-100 text-green-800 border-green-200">
                            {search.last_match_count} {search.last_match_count === 1
                              ? (t?.card?.propertyFound?.singular?.[language] || 'propriété trouvée')
                              : (t?.card?.propertyFound?.plural?.[language] || 'propriétés trouvées')}
                          </Badge>
                        )}

                        <Badge variant="secondary">
                          {t?.card?.createdOn?.[language] || 'Créé le'} {new Date(search.created_at).toLocaleDateString(
                            language === 'fr' ? 'fr-FR' : language === 'de' ? 'de-DE' : language === 'nl' ? 'nl-NL' : 'en-GB'
                          )}
                        </Badge>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleToggleAlerts(search.id, search.email_alerts)}
                        className="gap-2"
                      >
                        {search.email_alerts ? <BellOff className="w-4 h-4" /> : <Bell className="w-4 h-4" />}
                      </Button>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(search.id, search.name)}
                        className="gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>

                <CardContent>
                  <Link href={buildSearchUrl(search.filters)}>
                    <Button className="w-full gap-2 bg-gradient-to-r from-[#FFA040] to-[#FFB85C] text-white hover:from-[#FF8C30] hover:to-[#FFA548]">
                      <Play className="w-4 h-4" />
                      {t?.card?.launch?.[language] || 'Lancer cette recherche'}
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
