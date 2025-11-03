'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { PageContainer } from '@/components/layout/PageContainer';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { MatchScore } from '@/components/MatchScore';
import { useMatching } from '@/lib/hooks/use-matching';
import { createClient } from '@/lib/auth/supabase-client';
import {
  Sparkles,
  MapPin,
  Bed,
  Bath,
  Euro,
  Calendar,
  Settings,
  TrendingUp,
  Home,
} from 'lucide-react';

export default function TopMatchesPage() {
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const {
    propertiesWithMatches,
    userPreferences,
    isLoading: matchingLoading,
    loadUserPreferences,
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

  const topMatches = getTopMatches(70); // Get matches with score >= 70

  if (loading || matchingLoading) {
    return (
      <PageContainer center maxWidth="2xl">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#4A148C]"></div>
            <p className="mt-4 text-gray-600">Finding your perfect matches...</p>
          </div>
        </div>
      </PageContainer>
    );
  }

  if (!userPreferences) {
    return (
      <PageContainer center maxWidth="2xl">
        <div className="max-w-2xl mx-auto text-center py-12">
          <Sparkles className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Set Your Preferences First
          </h2>
          <p className="text-gray-600 mb-6">
            Complete your profile and preferences to get personalized property recommendations
          </p>
          <Button onClick={() => router.push('/dashboard/settings')}>
            <Settings className="w-4 h-4 mr-2" />
            Set Preferences
          </Button>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer center maxWidth="2xl">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-6 h-6 text-[#4A148C]" />
          <h1 className="text-3xl font-bold text-gray-900">Your Top Matches</h1>
        </div>
        <p className="text-gray-600">Properties that best match your preferences and lifestyle</p>
      </div>

      {/* Stats Banner */}
      <Card className="mb-6 bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-white rounded-lg shadow-sm">
                <TrendingUp className="w-6 h-6 text-[#4A148C]" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Top Matches</p>
                <p className="text-2xl font-bold text-gray-900">{topMatches.length}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-white rounded-lg shadow-sm">
                <Home className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Properties</p>
                <p className="text-2xl font-bold text-gray-900">{propertiesWithMatches.length}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-white rounded-lg shadow-sm">
                <Euro className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Budget Range</p>
                <p className="text-lg font-bold text-gray-900">
                  {userPreferences.min_budget ? `€${userPreferences.min_budget}` : '?'} - {userPreferences.max_budget ? `€${userPreferences.max_budget}` : '?'}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Properties Grid */}
      {topMatches.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Home className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No high matches found yet
            </h3>
            <p className="text-gray-600 mb-4">
              Try adjusting your preferences or check back later for new listings
            </p>
            <div className="flex gap-3 justify-center">
              <Button variant="outline" onClick={() => router.push('/dashboard/settings')}>
                <Settings className="w-4 h-4 mr-2" />
                Adjust Preferences
              </Button>
              <Button onClick={() => router.push('/properties/browse')}>
                Browse All Properties
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {topMatches.map((property) => (
            <Card key={property.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-0">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Image */}
                  <div className="relative h-64 md:h-auto min-h-[256px]">
                    {property.images && property.images.length > 0 ? (
                      <Image
                        src={property.images[0]}
                        alt={property.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover md:rounded-l-lg"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                        <Home className="w-12 h-12 text-gray-400" />
                      </div>
                    )}

                    {/* Match Badge Overlay */}
                    <div className="absolute top-4 left-4">
                      {property.matchResult && (
                        <MatchScore matchResult={property.matchResult} variant="compact" />
                      )}
                    </div>
                  </div>

                  {/* Property Info */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{property.title}</h3>

                    <div className="flex items-center gap-2 text-gray-600 mb-4">
                      <MapPin className="w-4 h-4" />
                      <span className="text-sm">
                        {property.neighborhood && `${property.neighborhood}, `}{property.city}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div className="flex items-center gap-2 text-gray-700">
                        <Euro className="w-4 h-4 text-gray-500" />
                        <span className="font-semibold">€{property.price}/month</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-700">
                        <Bed className="w-4 h-4 text-gray-500" />
                        <span>{property.bedrooms} bed</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-700">
                        <Bath className="w-4 h-4 text-gray-500" />
                        <span>{property.bathrooms} bath</span>
                      </div>
                      {property.available_from && (
                        <div className="flex items-center gap-2 text-gray-700">
                          <Calendar className="w-4 h-4 text-gray-500" />
                          <span className="text-sm">
                            {new Date(property.available_from).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                            })}
                          </span>
                        </div>
                      )}
                    </div>

                    {property.description && (
                      <p className="text-sm text-gray-600 line-clamp-2 mb-4">
                        {property.description}
                      </p>
                    )}

                    <Button
                      className="w-full"
                      onClick={() => router.push(`/properties/${property.id}`)}
                    >
                      View Details
                    </Button>
                  </div>

                  {/* Match Details */}
                  <div className="p-6 bg-gray-50 md:rounded-r-lg">
                    {property.matchResult && (
                      <MatchScore
                        matchResult={property.matchResult}
                        variant="detailed"
                        showBreakdown={true}
                      />
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </PageContainer>
  );
}
