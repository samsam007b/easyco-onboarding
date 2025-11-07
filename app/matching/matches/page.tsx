'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/auth/supabase-client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, MessageCircle, User, MapPin, Briefcase, Heart, Users } from 'lucide-react';
import { UserProfile } from '@/lib/services/user-matching-service';
import { toast } from 'sonner';

export default function MatchesPage() {
  const router = useRouter();
  const supabase = createClient();
  const [user, setUser] = useState<any>(null);
  const [matches, setMatches] = useState<UserProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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
      toast.error('Failed to load matches');
    } finally {
      setIsLoading(false);
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

  if (isLoading) {
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
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Tes Matchs</h1>
            <p className="text-gray-600">
              {matches.length} {matches.length === 1 ? 'match' : 'matchs'}
            </p>
          </div>
        </div>

        {/* No Matches State */}
        {matches.length === 0 ? (
          <Card className="p-12 text-center rounded-3xl border-2 border-dashed border-orange-200 bg-gradient-to-br from-orange-50/50 to-white">
            <div className="text-6xl mb-4">💔</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No matches yet</h3>
            <p className="text-gray-600 mb-6">
              Start swiping to find your perfect roommates or co-searchers!
            </p>
            <Button
              onClick={() => router.push('/properties/browse')}
              className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
            >
              <Users className="w-4 h-4 mr-2" />
              Start Swiping
            </Button>
          </Card>
        ) : (
          /* Matches Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {matches.map((match) => {
              const age = calculateAge(match.date_of_birth);

              return (
                <Card
                  key={match.user_id}
                  className="overflow-hidden hover:shadow-xl transition-all cursor-pointer rounded-3xl border border-orange-100 hover:border-orange-300"
                  onClick={() => {
                    // TODO: Open chat or profile
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

                    {/* Match Badge */}
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

                    {/* Core Values */}
                    {match.core_values && match.core_values.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {match.core_values.slice(0, 3).map((value, idx) => (
                          <Badge key={idx} variant="default" size="sm" className="capitalize">
                            {value}
                          </Badge>
                        ))}
                      </div>
                    )}

                    {/* Action Button */}
                    <Button
                      className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
                      onClick={(e) => {
                        e.stopPropagation();
                        // TODO: Open chat
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
      </div>
    </div>
  );
}
