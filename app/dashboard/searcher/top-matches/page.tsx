'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { PageContainer } from '@/components/layout/PageContainer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useMatching } from '@/lib/hooks/use-matching';
import { createClient } from '@/lib/auth/supabase-client';
import PropertyCard from '@/components/PropertyCard';
import { getResidentsForProperties } from '@/lib/services/rooms.service';
import {
  Sparkles,
  Settings,
  TrendingUp,
  Home,
  Euro,
  ArrowLeft,
} from 'lucide-react';

export default function TopMatchesPage() {
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [residentsData, setResidentsData] = useState<Map<string, any[]>>(new Map());

  const {
    propertiesWithMatches,
    userPreferences,
    isLoading: matchingLoading,
    loadPropertiesWithMatches,
    getTopMatches,
  } = useMatching(userId || undefined);

  useEffect(() => {
    const init = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        setUserId(user.id);
      }

      setLoading(false);
    };

    init();
  }, []);

  useEffect(() => {
    if (userId && !matchingLoading) {
      loadPropertiesWithMatches();
    }
  }, [userId, loadPropertiesWithMatches]);

  useEffect(() => {
    const loadResidents = async () => {
      if (propertiesWithMatches.length > 0) {
        const propertyIds = propertiesWithMatches.map(p => p.id);
        const residents = await getResidentsForProperties(propertyIds);
        setResidentsData(residents);
      }
    };

    loadResidents();
  }, [propertiesWithMatches]);

  const topMatches = getTopMatches(70); // Get matches with score >= 70

  if (loading || matchingLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Recherche de vos meilleurs matchs...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!userPreferences) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-2xl mx-auto text-center py-12">
            <Sparkles className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Configurez vos préférences d'abord
            </h2>
            <p className="text-gray-600 mb-6">
              Complétez votre profil et vos préférences pour obtenir des recommandations personnalisées
            </p>
            <Button
              onClick={() => router.push('/dashboard/settings')}
              className="bg-gradient-to-r from-[#FFA040] to-[#FFB85C] text-white hover:from-[#FF8C30] hover:to-[#FFA548]"
            >
              <Settings className="w-4 h-4 mr-2" />
              Configurer mes préférences
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => router.back()}
              className="gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Retour
            </Button>

            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <Sparkles className="w-8 h-8 text-orange-600 fill-orange-600" />
                Mes Top Matchs
              </h1>
              <p className="text-gray-600 mt-1">
                {topMatches.length} {topMatches.length === 1 ? 'propriété correspond' : 'propriétés correspondent'} à vos critères
              </p>
            </div>
          </div>
        </div>

        {/* Stats Banner */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-white border-orange-100 shadow-lg hover:shadow-xl transition-shadow rounded-2xl">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-600 rounded-2xl flex items-center justify-center shadow-md">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 font-medium">Top Matchs</p>
                  <p className="text-2xl font-bold text-gray-900">{topMatches.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-orange-100 shadow-lg hover:shadow-xl transition-shadow rounded-2xl">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-600 rounded-2xl flex items-center justify-center shadow-md">
                  <Home className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 font-medium">Total Propriétés</p>
                  <p className="text-2xl font-bold text-gray-900">{propertiesWithMatches.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-orange-100 shadow-lg hover:shadow-xl transition-shadow rounded-2xl">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-600 rounded-2xl flex items-center justify-center shadow-md">
                  <Euro className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 font-medium">Budget</p>
                  <p className="text-lg font-bold text-gray-900">
                    {userPreferences.min_budget ? `€${userPreferences.min_budget}` : '?'} - {userPreferences.max_budget ? `€${userPreferences.max_budget}` : '?'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Properties Grid */}
        {topMatches.length === 0 ? (
          <Card className="border-2 border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mb-4">
                <Sparkles className="w-10 h-10 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Aucun match élevé trouvé
              </h3>
              <p className="text-gray-600 text-center max-w-md mb-6">
                Ajustez vos préférences ou revenez plus tard pour de nouvelles annonces
              </p>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => router.push('/dashboard/settings')}
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Ajuster mes préférences
                </Button>
                <Button
                  onClick={() => router.push('/properties/browse')}
                  className="bg-gradient-to-r from-[#FFA040] to-[#FFB85C] text-white hover:from-[#FF8C30] hover:to-[#FFA548]"
                >
                  Explorer toutes les propriétés
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {topMatches.map((property) => {
              const residents = residentsData.get(property.id) || [];
              const matchScore = property.matchResult?.score;

              return (
                <PropertyCard
                  key={property.id}
                  property={{
                    id: property.id,
                    title: property.title,
                    description: property.description,
                    city: property.city,
                    neighborhood: property.neighborhood,
                    monthly_rent: property.price,
                    bedrooms: property.bedrooms,
                    property_type: 'Colocation',
                    main_image: property.images?.[0],
                    images: property.images,
                    available_from: property.available_from,
                  }}
                  residents={residents}
                  showCompatibilityScore={true}
                  compatibilityScore={matchScore}
                  variant="default"
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
