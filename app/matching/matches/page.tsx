'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/auth/supabase-client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, MessageCircle, User, MapPin, Briefcase, Heart, Users, Home, Sparkles, RefreshCw, TrendingUp, Filter } from 'lucide-react';
import { UserProfile } from '@/lib/services/user-matching-service';
import { PropertyMatchCard, PropertyMatch } from '@/components/matching/PropertyMatchCard';
import { toast } from 'sonner';

export default function MatchesPage() {
  const router = useRouter();
  const supabase = createClient();
  const [user, setUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'people' | 'properties'>('people');

  // People matches state
  const [peopleMatches, setPeopleMatches] = useState<UserProfile[]>([]);
  const [isLoadingPeople, setIsLoadingPeople] = useState(true);

  // Property matches state
  const [propertyMatches, setPropertyMatches] = useState<PropertyMatch[]>([]);
  const [isLoadingProperties, setIsLoadingProperties] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }
      setUser(user);
      loadPeopleMatches(user.id);
    };

    getUser();
  }, [supabase, router]);

  // Load property matches when switching tabs
  useEffect(() => {
    if (activeTab === 'properties' && user && propertyMatches.length === 0) {
      loadPropertyMatches();
    }
  }, [activeTab, user]);

  const loadPeopleMatches = async (userId: string) => {
    try {
      setIsLoadingPeople(true);

      // Get matches from user_matches table
      const { data: matchData, error: matchError } = await supabase
        .from('user_matches')
        .select('*')
        .or(`user1_id.eq.${userId},user2_id.eq.${userId}`)
        .eq('is_active', true)
        .order('matched_at', { ascending: false });

      if (matchError) throw matchError;

      // Extract matched user IDs
      const matchedUserIds = matchData.map((m: any) => {
        return m.user1_id === userId ? m.user2_id : m.user1_id;
      });

      if (matchedUserIds.length === 0) {
        setPeopleMatches([]);
        setIsLoadingPeople(false);
        return;
      }

      // Fetch profiles for matched users
      const { data: profiles, error: profileError } = await supabase
        .from('user_profiles')
        .select('*')
        .in('user_id', matchedUserIds);

      if (profileError) throw profileError;

      setPeopleMatches(profiles as UserProfile[]);
    } catch (error) {
      console.error('Failed to load people matches:', error);
      toast.error('Impossible de charger les matchs de personnes');
    } finally {
      setIsLoadingPeople(false);
    }
  };

  const loadPropertyMatches = async () => {
    try {
      setIsLoadingProperties(true);

      const response = await fetch('/api/matching/matches?limit=50&minScore=60&status=active,viewed');

      if (!response.ok) {
        throw new Error('Failed to fetch property matches');
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to fetch property matches');
      }

      setPropertyMatches(data.matches || []);
    } catch (error) {
      console.error('Failed to load property matches:', error);
      toast.error('Impossible de charger les matchs de propriétés');
    } finally {
      setIsLoadingProperties(false);
    }
  };

  const generateMatches = async () => {
    try {
      setIsGenerating(true);
      toast.info('Génération des nouveaux matches...');

      const response = await fetch('/api/matching/generate', {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Failed to generate matches');
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to generate matches');
      }

      toast.success(`${data.matchesGenerated} nouveaux matches générés !`);
      await loadPropertyMatches();
    } catch (error) {
      console.error('Failed to generate matches:', error);
      toast.error('Impossible de générer les matches');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleViewPropertyDetails = async (matchId: string, propertyId: string) => {
    try {
      await fetch(`/api/matching/matches/${matchId}/view`, {
        method: 'POST',
      });
      router.push(`/properties/${propertyId}`);
    } catch (error) {
      console.error('Failed to mark as viewed:', error);
      router.push(`/properties/${propertyId}`);
    }
  };

  const handleContactProperty = async (matchId: string) => {
    try {
      const response = await fetch(`/api/matching/matches/${matchId}/contact`, {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Failed to contact');
      }

      toast.success('Demande de contact envoyée !');
      await loadPropertyMatches();
    } catch (error) {
      console.error('Failed to contact:', error);
      toast.error('Impossible de contacter le propriétaire');
    }
  };

  const handleHideProperty = async (matchId: string) => {
    try {
      const response = await fetch(`/api/matching/matches/${matchId}/hide`, {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Failed to hide match');
      }

      toast.success('Match masqué');
      setPropertyMatches(propertyMatches.filter((m) => m.id !== matchId));
    } catch (error) {
      console.error('Failed to hide match:', error);
      toast.error('Impossible de masquer ce match');
    }
  };

  const calculateAge = (dateOfBirth?: string): number | null => {
    if (!dateOfBirth) return null;
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const isLoading = activeTab === 'people' ? isLoadingPeople : isLoadingProperties;
  const currentMatches = activeTab === 'people' ? peopleMatches : propertyMatches;

  if (isLoadingPeople && peopleMatches.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-orange-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50/30 via-white to-orange-50/30 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.back()}
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                <Sparkles className="w-8 h-8 text-orange-600" />
                Tes Matchs
              </h1>
              <p className="text-gray-600">
                {activeTab === 'people' ? peopleMatches.length : propertyMatches.length}{' '}
                {activeTab === 'people'
                  ? (peopleMatches.length === 1 ? 'personne' : 'personnes')
                  : (propertyMatches.length === 1 ? 'bien' : 'biens')}
              </p>
            </div>
          </div>

          {/* Action buttons for properties tab */}
          {activeTab === 'properties' && (
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => loadPropertyMatches()}
                disabled={isLoadingProperties}
                size="sm"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${isLoadingProperties ? 'animate-spin' : ''}`} />
                Actualiser
              </Button>
              <Button
                variant="default"
                onClick={generateMatches}
                disabled={isGenerating}
                size="sm"
                className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
              >
                <TrendingUp className={`w-4 h-4 mr-2 ${isGenerating ? 'animate-pulse' : ''}`} />
                {isGenerating ? 'Génération...' : 'Générer matches'}
              </Button>
            </div>
          )}
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex items-center bg-white rounded-full p-2 shadow-lg border border-orange-100">
            <button
              onClick={() => setActiveTab('people')}
              className={`px-6 py-3 rounded-full flex items-center gap-2 transition-all font-medium ${
                activeTab === 'people'
                  ? 'bg-gradient-to-r from-[#FFA040] to-[#FFB85C] text-white shadow-md'
                  : 'text-gray-600 hover:text-orange-600 hover:bg-orange-50/50'
              }`}
            >
              <Users className="w-5 h-5" />
              <span>Personnes</span>
            </button>
            <button
              onClick={() => setActiveTab('properties')}
              className={`px-6 py-3 rounded-full flex items-center gap-2 transition-all font-medium ${
                activeTab === 'properties'
                  ? 'bg-gradient-to-r from-[#FFA040] to-[#FFB85C] text-white shadow-md'
                  : 'text-gray-600 hover:text-orange-600 hover:bg-orange-50/50'
              }`}
            >
              <Home className="w-5 h-5" />
              <span>Biens</span>
            </button>
          </div>
        </div>

        {/* Content based on active tab */}
        {activeTab === 'people' ? (
          /* People Matches */
          <>
            {isLoadingPeople ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-orange-500 border-t-transparent"></div>
              </div>
            ) : peopleMatches.length === 0 ? (
              <Card className="p-12 text-center rounded-3xl border-2 border-dashed border-orange-200 bg-gradient-to-br from-orange-50/50 to-white">
                <div className="text-6xl mb-4">💔</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Aucun match pour le moment</h3>
                <p className="text-gray-600 mb-6">
                  Commence à swiper pour trouver tes futurs colocataires !
                </p>
                <Button
                  onClick={() => router.push('/properties/browse')}
                  className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
                >
                  <Users className="w-4 h-4 mr-2" />
                  Commencer à swiper
                </Button>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {peopleMatches.map((match) => {
                  const age = calculateAge(match.date_of_birth);

                  return (
                    <Card
                      key={match.user_id}
                      className="overflow-hidden hover:shadow-xl transition-all cursor-pointer rounded-3xl border border-orange-100 hover:border-orange-300"
                      onClick={() => {
                        toast.info('Fonctionnalité de chat bientôt disponible !');
                      }}
                    >
                      <div className="relative h-64 overflow-hidden">
                        {match.profile_photo_url ? (
                          <img
                            src={match.profile_photo_url}
                            alt={`${match.first_name} ${match.last_name}`}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-orange-200 via-orange-100 to-yellow-100 flex items-center justify-center">
                            <div className="text-5xl font-bold text-orange-600 opacity-30">
                              {match.first_name.charAt(0)}
                              {match.last_name.charAt(0)}
                            </div>
                          </div>
                        )}

                        <div className="absolute top-4 right-4 px-3 py-1 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-full shadow-lg">
                          <div className="flex items-center gap-1">
                            <Heart className="w-3 h-3 fill-current" />
                            <span className="text-xs font-bold">Match</span>
                          </div>
                        </div>
                      </div>

                      <CardContent className="p-4">
                        <h3 className="text-xl font-bold text-gray-900 mb-1">
                          {match.first_name} {match.last_name}
                          {age && <span className="text-lg font-normal ml-2">{age}</span>}
                        </h3>

                        {match.occupation_status && (
                          <div className="flex items-center gap-2 text-gray-600 mb-3">
                            <Briefcase className="w-4 h-4" />
                            <span className="text-sm capitalize">
                              {match.occupation_status.replace('_', ' ')}
                            </span>
                          </div>
                        )}

                        {match.nationality && (
                          <div className="flex items-center gap-2 text-gray-600 mb-3">
                            <MapPin className="w-4 h-4" />
                            <span className="text-sm">{match.nationality}</span>
                          </div>
                        )}

                        {match.bio && (
                          <p className="text-sm text-gray-700 mb-4 line-clamp-2">{match.bio}</p>
                        )}

                        {match.core_values && match.core_values.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-4">
                            {match.core_values.slice(0, 3).map((value, idx) => (
                              <Badge key={idx} variant="default" size="sm" className="capitalize">
                                {value}
                              </Badge>
                            ))}
                          </div>
                        )}

                        <Button
                          className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
                          onClick={(e) => {
                            e.stopPropagation();
                            toast.info('Fonctionnalité de chat bientôt disponible !');
                          }}
                        >
                          <MessageCircle className="w-4 h-4 mr-2" />
                          Envoyer un message
                        </Button>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </>
        ) : (
          /* Property Matches */
          <>
            {isLoadingProperties ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-orange-500 border-t-transparent"></div>
              </div>
            ) : propertyMatches.length === 0 ? (
              <Card className="p-12 text-center rounded-3xl border-2 border-dashed border-orange-200 bg-gradient-to-br from-orange-50/50 to-white">
                <div className="text-6xl mb-4">
                  <Home className="w-24 h-24 mx-auto text-gray-300" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Aucun bien trouvé</h3>
                <p className="text-gray-600 mb-6">
                  Génère des matches pour découvrir les biens qui te correspondent !
                </p>
                <Button
                  variant="default"
                  onClick={generateMatches}
                  disabled={isGenerating}
                  className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
                >
                  <TrendingUp className="w-4 h-4 mr-2" />
                  {isGenerating ? 'Génération...' : 'Générer des matches'}
                </Button>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {propertyMatches.map((match) => (
                  <PropertyMatchCard
                    key={match.id}
                    match={match}
                    onViewDetails={handleViewPropertyDetails}
                    onContact={handleContactProperty}
                    onHide={handleHideProperty}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
