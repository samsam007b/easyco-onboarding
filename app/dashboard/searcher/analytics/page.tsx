'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/auth/supabase-client';
import { AnalyticsService } from '@/lib/services/analytics-service';
import { Property } from '@/types/property.types';
import { AnalyticsSummary } from '@/types/analytics.types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import LoadingHouse from '@/components/ui/LoadingHouse';
import {
  ArrowLeft,
  Eye,
  Search,
  Heart,
  FileText,
  TrendingUp,
  Calendar,
  Trash2,
  MapPin,
  Euro,
} from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';
import Image from 'next/image';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

export default function AnalyticsPage() {
  const router = useRouter();
  const supabase = createClient();
  const analyticsService = new AnalyticsService(supabase);

  const [summary, setSummary] = useState<AnalyticsSummary | null>(null);
  const [recentlyViewed, setRecentlyViewed] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showClearDialog, setShowClearDialog] = useState(false);
  const [clearType, setClearType] = useState<'views' | 'searches' | 'all'>('all');

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      setIsLoading(true);
      const [summaryData, recentData] = await Promise.all([
        analyticsService.getAnalyticsSummary(),
        analyticsService.getRecentlyViewedProperties(12),
      ]);

      setSummary(summaryData);
      setRecentlyViewed(recentData);
    } catch (error) {
      console.error('Error loading analytics:', error);
      toast.error('Erreur lors du chargement des statistiques');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearHistory = async () => {
    try {
      await analyticsService.clearHistory(clearType);
      toast.success('Historique effacé');
      setShowClearDialog(false);
      loadAnalytics();
    } catch (error) {
      console.error('Error clearing history:', error);
      toast.error('Erreur lors de la suppression');
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <LoadingHouse size={64} />
            <p className="text-gray-600">Chargement des statistiques...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <Button variant="ghost" onClick={() => router.back()} className="mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour
        </Button>

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Mes Statistiques</h1>
            <p className="text-gray-600">Analyse de ton activité de recherche</p>
          </div>

          <Button
            variant="outline"
            onClick={() => {
              setClearType('all');
              setShowClearDialog(true);
            }}
            className="text-red-600 border-red-300 hover:bg-red-50"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Effacer l'historique
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <Search className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Recherches</p>
                <p className="text-2xl font-bold text-gray-900">{summary?.totalSearches || 0}</p>
                <p className="text-xs text-gray-500">
                  ~{summary?.averageSearchesPerDay || 0}/jour
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                <Eye className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Propriétés vues</p>
                <p className="text-2xl font-bold text-gray-900">{summary?.totalViews || 0}</p>
                <p className="text-xs text-gray-500">~{summary?.averageViewsPerDay || 0}/jour</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center">
                <Heart className="w-6 h-6 text-pink-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Favoris</p>
                <p className="text-2xl font-bold text-gray-900">{summary?.totalFavorites || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <FileText className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Candidatures</p>
                <p className="text-2xl font-bold text-gray-900">
                  {summary?.totalApplications || 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Insights */}
      {summary && (summary.mostViewedCity || summary.mostSearchedPriceRange) && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Tes préférences
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {summary.mostViewedCity && (
                <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg">
                  <MapPin className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-600">Ville préférée</p>
                    <p className="font-semibold text-gray-900">{summary.mostViewedCity}</p>
                  </div>
                </div>
              )}

              {summary.mostSearchedPriceRange && (
                <div className="flex items-center gap-3 p-4 bg-green-50 rounded-lg">
                  <Euro className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="text-sm text-gray-600">Fourchette de prix</p>
                    <p className="font-semibold text-gray-900">
                      {summary.mostSearchedPriceRange.min}€ -{' '}
                      {summary.mostSearchedPriceRange.max}€
                    </p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recently Viewed Properties */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Propriétés récemment consultées
            </CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setClearType('views');
                setShowClearDialog(true);
              }}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Effacer
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {recentlyViewed.length === 0 ? (
            <div className="text-center py-12">
              <Eye className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600">Aucune propriété consultée récemment</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {recentlyViewed.map((property) => (
                <Link
                  key={property.id}
                  href={`/properties/${property.id}`}
                  className="group block"
                >
                  <div className="bg-white border rounded-lg overflow-hidden hover:shadow-lg transition">
                    {/* Image */}
                    <div className="relative h-40">
                      <Image
                        src={property.main_image || '/placeholder-property.jpg'}
                        alt={property.title}
                        fill
                        className="object-cover group-hover:scale-105 transition"
                      />
                    </div>

                    {/* Content */}
                    <div className="p-3">
                      <h3 className="font-semibold text-sm text-gray-900 line-clamp-2 mb-2">
                        {property.title}
                      </h3>

                      <div className="flex items-center text-xs text-gray-600 mb-2">
                        <MapPin className="w-3 h-3 mr-1" />
                        {property.city}
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="font-bold text-gray-900">{property.monthly_rent}€</span>
                        <Badge variant="default" className="text-xs">
                          {property.property_type}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Clear History Dialog */}
      <AlertDialog open={showClearDialog} onOpenChange={setShowClearDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Effacer l'historique ?</AlertDialogTitle>
            <AlertDialogDescription>
              {clearType === 'all' && 'Cela supprimera toutes tes recherches et propriétés consultées.'}
              {clearType === 'views' && 'Cela supprimera toutes les propriétés que tu as consultées.'}
              {clearType === 'searches' && 'Cela supprimera toutes tes recherches.'}
              <br />
              Cette action est irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleClearHistory}
              className="bg-red-600 hover:bg-red-700"
            >
              Effacer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
