'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/auth/supabase-client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { Search, Bell, BellOff, Trash2, Play, MapPin, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';
import LoadingHouse from '@/components/ui/LoadingHouse';
import { useLanguage } from '@/lib/i18n/use-language';
import {
  SearcherPageHeader,
  SearcherKPICard,
  SearcherKPIGrid,
  searcherGradientVibrant,
  searcherGradientLight,
  searcherAnimations,
} from '@/components/searcher';

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
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50/30 to-white flex items-center justify-center">
        <div className="text-center">
          <LoadingHouse size={80} />
          <p className="text-gray-600 font-medium mt-4">{t?.loading?.[language] || 'Chargement de vos recherches...'}</p>
        </div>
      </div>
    );
  }

  // Calculate stats
  const activeAlerts = savedSearches.filter(s => s.email_alerts).length;
  const totalMatches = savedSearches.reduce((sum, s) => sum + (s.last_match_count || 0), 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50/30 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          {...searcherAnimations.fadeInUp}
          className="space-y-6"
        >
          {/* Header */}
          <SearcherPageHeader
            icon={Search}
            title={t?.title?.[language] || 'Mes Recherches Sauvegardées'}
            subtitle={`${savedSearches.length} ${savedSearches.length === 1 ? (t?.count?.singular?.[language] || 'recherche sauvegardée') : (t?.count?.plural?.[language] || 'recherches sauvegardées')}`}
            breadcrumb={{ label: 'Accueil', href: '/dashboard/searcher' }}
            currentPage="Recherches"
            actions={
              savedSearches.length > 0 && (
                <Button
                  onClick={() => router.push('/properties/browse')}
                  className="rounded-2xl text-white font-semibold"
                  style={{ background: searcherGradientVibrant }}
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  {t?.newSearch?.[language] || 'Nouvelle Recherche'}
                </Button>
              )
            }
          />

          {/* Empty State */}
          {savedSearches.length === 0 ? (
            <motion.div
              {...searcherAnimations.cardHover}
              className="relative overflow-hidden rounded-3xl border-2 border-amber-100 shadow-lg"
              style={{ background: searcherGradientLight }}
            >
              <div className="absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-20" style={{ background: searcherGradientVibrant }} />
              <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2 opacity-10" style={{ background: searcherGradientVibrant }} />

              <div className="relative flex flex-col items-center justify-center py-20 px-8">
                <motion.div
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-24 h-24 rounded-3xl flex items-center justify-center mb-6 shadow-xl"
                  style={{ background: searcherGradientVibrant, boxShadow: '0 12px 32px rgba(255, 140, 32, 0.3)' }}
                >
                  <Search className="w-12 h-12 text-white" />
                </motion.div>
                <h3 className="text-3xl font-bold text-gray-900 mb-3">
                  {t?.empty?.title?.[language] || 'Aucune recherche sauvegardée'}
                </h3>
                <p className="text-lg text-gray-600 text-center max-w-md mb-8">
                  {t?.empty?.description?.[language] || 'Sauvegarde tes recherches pour recevoir des alertes quand de nouvelles propriétés correspondent à tes critères'}
                </p>
                <Button
                  onClick={() => router.push('/properties/browse')}
                  className="text-white px-8 py-6 text-lg rounded-2xl shadow-lg hover:shadow-xl transition-all"
                  style={{ background: searcherGradientVibrant, boxShadow: '0 8px 24px rgba(255, 140, 32, 0.3)' }}
                >
                  <Sparkles className="w-5 h-5 mr-2" />
                  {t?.empty?.button?.[language] || 'Créer une recherche'}
                </Button>
              </div>
            </motion.div>
          ) : (
            <>
              {/* Stats KPIs */}
              <SearcherKPIGrid columns={3}>
                <SearcherKPICard
                  title={t?.stats?.total?.[language] || 'Total recherches'}
                  value={savedSearches.length}
                  icon={Search}
                  variant="primary"
                />
                <SearcherKPICard
                  title={t?.stats?.activeAlerts?.[language] || 'Alertes actives'}
                  value={activeAlerts}
                  icon={Bell}
                  variant="success"
                />
                <SearcherKPICard
                  title={t?.stats?.matches?.[language] || 'Propriétés trouvées'}
                  value={totalMatches}
                  icon={MapPin}
                  variant="info"
                />
              </SearcherKPIGrid>

              {/* Searches List */}
              <motion.div
                initial="hidden"
                animate="visible"
                variants={{
                  hidden: { opacity: 0 },
                  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
                }}
                className="space-y-4"
              >
                  {savedSearches.map((search) => (
                  <motion.div
                    key={search.id}
                    variants={{
                      hidden: { opacity: 0, y: 20 },
                      visible: { opacity: 1, y: 0 },
                    }}
                  >
                    <Card className="hover:shadow-lg transition-shadow bg-white/80 backdrop-blur-sm border-gray-200 rounded-2xl">
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
                          <Button
                            className="w-full gap-2 text-white rounded-xl"
                            style={{ background: searcherGradientVibrant }}
                          >
                            <Play className="w-4 h-4" />
                            {t?.card?.launch?.[language] || 'Lancer cette recherche'}
                          </Button>
                        </Link>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
}
