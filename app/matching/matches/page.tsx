'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/auth/supabase-client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, MessageCircle, MapPin, Briefcase, Heart, Users, Sparkles, Plus, UserPlus, Check } from 'lucide-react';
import { UserProfile } from '@/lib/services/user-matching-service';
import { toast } from 'sonner';
import LoadingHouse from '@/components/ui/LoadingHouse';

export default function MatchesPage() {
  const router = useRouter();
  const supabase = createClient();
  const [user, setUser] = useState<any>(null);
  const [matches, setMatches] = useState<UserProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMatches, setSelectedMatches] = useState<Set<string>>(new Set());

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
      loadMatches(user.id);
    };

    getUser();
  }, [supabase, router]);

  const loadMatches = async (userId: string) => {
    try {
      setIsLoading(true);

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
        setMatches([]);
        setIsLoading(false);
        return;
      }

      // Fetch profiles for matched users
      const { data: profiles, error: profileError } = await supabase
        .from('user_profiles')
        .select('*')
        .in('user_id', matchedUserIds);

      if (profileError) throw profileError;

      setMatches(profiles as UserProfile[]);
    } catch (error) {
      console.error('Failed to load matches:', error);
      toast.error('Impossible de charger les matchs');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleSelectMatch = (userId: string) => {
    const newSelected = new Set(selectedMatches);
    if (newSelected.has(userId)) {
      newSelected.delete(userId);
    } else {
      newSelected.add(userId);
    }
    setSelectedMatches(newSelected);
  };

  const handleCreateGroup = () => {
    if (selectedMatches.size === 0) {
      toast.error('Sélectionne au moins une personne pour créer un groupe');
      return;
    }

    // Navigate to group creation with selected members
    const memberIds = Array.from(selectedMatches).join(',');
    router.push(`/dashboard/searcher/groups/create?members=${memberIds}`);
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

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-white">
        <div className="text-center">
          <LoadingHouse size={64} />
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
                {matches.length} {matches.length === 1 ? 'personne' : 'personnes'}
              </p>
            </div>
          </div>

          {/* Create Group Button */}
          {selectedMatches.size > 0 && (
            <Button
              onClick={handleCreateGroup}
              className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
            >
              <UserPlus className="w-4 h-4 mr-2" />
              Créer un groupe ({selectedMatches.size})
            </Button>
          )}
        </div>

        {/* Info Banner */}
        {matches.length > 0 && (
          <Card className="mb-6 border-orange-200 bg-gradient-to-r from-orange-50 to-white">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-gray-900 mb-1">
                    Crée ton groupe de colocation !
                  </p>
                  <p className="text-sm text-gray-700">
                    Sélectionne plusieurs matchs compatibles pour créer un groupe et chercher un logement ensemble.
                    On te suggère des groupes potentiels en bas de page.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* No Matches State */}
        {matches.length === 0 ? (
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
          <>
            {/* Matches Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {matches.map((match) => {
                const age = calculateAge(match.date_of_birth);
                const isSelected = selectedMatches.has(match.user_id);

                return (
                  <Card
                    key={match.user_id}
                    className={`overflow-hidden hover:shadow-xl transition-all cursor-pointer rounded-3xl border-2 ${
                      isSelected
                        ? 'border-orange-500 ring-2 ring-orange-200'
                        : 'border-orange-100 hover:border-orange-300'
                    }`}
                    onClick={() => toggleSelectMatch(match.user_id)}
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

                      {/* Match Badge */}
                      <div className="absolute top-4 right-4 px-3 py-1 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-full shadow-lg">
                        <div className="flex items-center gap-1">
                          <Heart className="w-3 h-3 fill-current" />
                          <span className="text-xs font-bold">Match</span>
                        </div>
                      </div>

                      {/* Selection Indicator */}
                      {isSelected && (
                        <div className="absolute top-4 left-4 w-8 h-8 bg-orange-600 rounded-full flex items-center justify-center shadow-lg">
                          <Check className="w-5 h-5 text-white" />
                        </div>
                      )}
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

                      <div className="flex gap-2">
                        <Button
                          className="flex-1 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
                          onClick={(e) => {
                            e.stopPropagation();
                            toast.info('Fonctionnalité de chat bientôt disponible !');
                          }}
                        >
                          <MessageCircle className="w-4 h-4 mr-2" />
                          Message
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Suggested Group Combinations */}
            {matches.length >= 2 && (
              <div className="mt-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Users className="w-6 h-6 text-orange-600" />
                  Suggestions de groupes
                </h2>
                <p className="text-gray-600 mb-6">
                  Voici des combinaisons de matchs qui pourraient bien s'entendre ensemble
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Generate suggested groups - simple example: groups of 2-3 people */}
                  {matches.slice(0, 4).map((match1, idx1) => {
                    const match2 = matches[idx1 + 1];
                    if (!match2) return null;

                    return (
                      <Card
                        key={`suggestion-${idx1}`}
                        className="p-4 rounded-2xl border border-orange-200 hover:border-orange-400 hover:shadow-lg transition-all cursor-pointer"
                        onClick={() => {
                          const groupMembers = [match1.user_id, match2.user_id].join(',');
                          router.push(`/dashboard/searcher/groups/create?members=${groupMembers}`);
                        }}
                      >
                        <div className="flex items-center gap-3 mb-3">
                          <div className="flex -space-x-2">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-bold border-2 border-white">
                              {match1.first_name.charAt(0)}
                            </div>
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center text-white font-bold border-2 border-white">
                              {match2.first_name.charAt(0)}
                            </div>
                          </div>
                          <div className="flex-1">
                            <p className="font-semibold text-gray-900">
                              {match1.first_name} + {match2.first_name}
                            </p>
                            <p className="text-xs text-gray-600">Groupe de 2 personnes</p>
                          </div>
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-orange-300 text-orange-700 hover:bg-orange-50"
                          >
                            <Plus className="w-4 h-4 mr-1" />
                            Créer
                          </Button>
                        </div>
                        <p className="text-sm text-gray-600">
                          Compatibilité élevée • Critères similaires
                        </p>
                      </Card>
                    );
                  })}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
