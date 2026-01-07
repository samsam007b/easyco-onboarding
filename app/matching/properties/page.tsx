'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/auth/supabase-client';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import LoadingHouse from '@/components/ui/LoadingHouse';
import {
  ArrowLeft,
  RefreshCw,
  Filter,
  TrendingUp,
  Home,
  Sparkles,
  AlertCircle,
} from 'lucide-react';
import { PropertyMatchCard, PropertyMatch } from '@/components/matching/PropertyMatchCard';
import { toast } from 'sonner';
import { useLanguage } from '@/lib/i18n/use-language';

interface MatchStatistics {
  total_matches: number;
  viewed_matches: number;
  contacted_matches: number;
  hidden_matches: number;
  average_match_score: number;
  top_match_score: number;
}

export default function PropertyMatchesPage() {
  const router = useRouter();
  const supabase = createClient();
  const { getSection } = useLanguage();
  const matching = getSection('matching');
  const [user, setUser] = useState<any>(null);
  const [matches, setMatches] = useState<PropertyMatch[]>([]);
  const [statistics, setStatistics] = useState<MatchStatistics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [minScore, setMinScore] = useState(60);
  const [statusFilter, setStatusFilter] = useState<string[]>(['active', 'viewed']);

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }

      // Check if user is a searcher
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('user_type')
        .eq('user_id', user.id)
        .single();

      if (profile?.user_type !== 'searcher') {
        toast.error(matching.properties?.toasts?.searcherOnly || 'This page is for searchers only');
        router.push('/');
        return;
      }

      setUser(user);
      loadMatches();
    };

    getUser();
  }, [supabase, router]);

  const loadMatches = async (includeStats = true) => {
    try {
      setIsLoading(true);

      const params = new URLSearchParams({
        limit: '50',
        minScore: minScore.toString(),
        status: statusFilter.join(','),
        includeStats: includeStats.toString(),
      });

      const response = await fetch(`/api/matching/matches?${params}`);

      if (!response.ok) {
        throw new Error('Failed to fetch matches');
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to fetch matches');
      }

      setMatches(data.matches || []);
      if (data.stats) {
        setStatistics(data.stats);
      }
    } catch (error) {
      console.error('Failed to load matches:', error);
      toast.error(matching.properties?.toasts?.loadError || 'Unable to load matches');
    } finally {
      setIsLoading(false);
    }
  };

  const generateMatches = async () => {
    try {
      setIsGenerating(true);
      toast.info(matching.properties?.toasts?.generatingNew || 'Generating new matches...');

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

      toast.success(`${data.matchesGenerated} ${matching.properties?.toasts?.newMatchesGenerated || 'new matches generated!'}`);
      await loadMatches();
    } catch (error) {
      console.error('Failed to generate matches:', error);
      toast.error(matching.properties?.toasts?.generateError || 'Unable to generate matches');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleViewDetails = async (matchId: string, propertyId: string) => {
    try {
      // Mark match as viewed
      await fetch(`/api/matching/matches/${matchId}/view`, {
        method: 'POST',
      });

      // Navigate to property details
      router.push(`/properties/${propertyId}`);
    } catch (error) {
      console.error('Failed to mark as viewed:', error);
      router.push(`/properties/${propertyId}`);
    }
  };

  const handleContact = async (matchId: string) => {
    try {
      const response = await fetch(`/api/matching/matches/${matchId}/contact`, {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Failed to contact');
      }

      toast.success(matching.properties?.toasts?.contactSent || 'Contact request sent!');
      await loadMatches(false);
    } catch (error) {
      console.error('Failed to contact:', error);
      toast.error(matching.properties?.toasts?.contactError || 'Unable to contact owner');
    }
  };

  const handleHide = async (matchId: string) => {
    try {
      const response = await fetch(`/api/matching/matches/${matchId}/hide`, {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Failed to hide match');
      }

      toast.success(matching.properties?.toasts?.matchHidden || 'Match hidden');
      setMatches(matches.filter((m) => m.id !== matchId));
    } catch (error) {
      console.error('Failed to hide match:', error);
      toast.error(matching.properties?.toasts?.hideError || 'Unable to hide this match');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-yellow-50">
        <div className="text-center">
          <LoadingHouse size={80} />
          <p className="text-gray-600">{matching.common?.loadingMatches || 'Loading your matches...'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-yellow-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => router.push('/')}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-[#9c5698] flex items-center gap-2">
                <Sparkles className="w-8 h-8" />
                {matching.properties?.title || 'Your Matches'}
              </h1>
              <p className="text-gray-600">
                {matches.length} {matches.length === 1
                  ? (matching.properties?.propertySingular || 'property found')
                  : (matching.properties?.propertiesPlural || 'properties found')}
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => loadMatches()}
              disabled={isLoading}
              size="sm"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              {matching.properties?.refresh || 'Refresh'}
            </Button>
            <Button
              variant="default"
              onClick={generateMatches}
              disabled={isGenerating}
              size="sm"
            >
              <TrendingUp className={`w-4 h-4 mr-2 ${isGenerating ? 'animate-pulse' : ''}`} />
              {isGenerating
                ? (matching.properties?.generating || 'Generating...')
                : (matching.properties?.generateNew || 'Generate new matches')}
            </Button>
          </div>
        </div>

        {/* Statistics */}
        {statistics && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 mb-8">
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-[#9c5698]">
                  {statistics.total_matches}
                </div>
                <div className="text-sm text-gray-600">{matching.properties?.stats?.total || 'Total'}</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-blue-600">{statistics.viewed_matches}</div>
                <div className="text-sm text-gray-600">{matching.properties?.stats?.viewed || 'Viewed'}</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-green-600">
                  {statistics.contacted_matches}
                </div>
                <div className="text-sm text-gray-600">{matching.properties?.stats?.contacted || 'Contacted'}</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {Math.round(statistics.average_match_score)}%
                </div>
                <div className="text-sm text-gray-600">{matching.properties?.stats?.averageScore || 'Average score'}</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-green-600">
                  {Math.round(statistics.top_match_score)}%
                </div>
                <div className="text-sm text-gray-600">{matching.properties?.stats?.topScore || 'Top score'}</div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex items-center gap-4 flex-wrap">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-700">{matching.properties?.filters?.title || 'Filters'}:</span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">{matching.properties?.filters?.minScore || 'Minimum score'}:</span>
                <div className="flex gap-2">
                  {[50, 60, 70, 80].map((score) => (
                    <Badge
                      key={score}
                      variant={minScore === score ? 'default' : 'secondary'}
                      className="cursor-pointer"
                      onClick={() => {
                        setMinScore(score);
                        setTimeout(() => loadMatches(), 100);
                      }}
                    >
                      {score}%
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">{matching.properties?.filters?.status || 'Status'}:</span>
                <div className="flex gap-2">
                  {[
                    { value: 'active', label: matching.properties?.filters?.active || 'Active' },
                    { value: 'viewed', label: matching.properties?.filters?.viewed || 'Viewed' },
                    { value: 'contacted', label: matching.properties?.filters?.contacted || 'Contacted' },
                  ].map((status) => (
                    <Badge
                      key={status.value}
                      variant={statusFilter.includes(status.value) ? 'default' : 'secondary'}
                      className="cursor-pointer"
                      onClick={() => {
                        const newFilter = statusFilter.includes(status.value)
                          ? statusFilter.filter((s) => s !== status.value)
                          : [...statusFilter, status.value];
                        setStatusFilter(newFilter.length > 0 ? newFilter : ['active']);
                        setTimeout(() => loadMatches(), 100);
                      }}
                    >
                      {status.label}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* No Matches State */}
        {matches.length === 0 ? (
          <Card className="p-12 text-center">
            <div className="text-6xl mb-4">
              <Home className="w-24 h-24 mx-auto text-gray-300" />
            </div>
            <h3 className="text-2xl font-bold text-[#9c5698] mb-2">{matching.properties?.empty?.title || 'No matches found'}</h3>
            <p className="text-gray-600 mb-6">
              {statusFilter.length === 0
                ? (matching.properties?.empty?.noFilter || 'Select at least one status filter')
                : (matching.properties?.empty?.suggestion || 'Try lowering the minimum score or generating new matches')}
            </p>
            <div className="flex gap-3 justify-center">
              {minScore > 50 && (
                <Button
                  variant="outline"
                  onClick={() => {
                    setMinScore(Math.max(50, minScore - 10));
                    setTimeout(() => loadMatches(), 100);
                  }}
                >
                  <Filter className="w-4 h-4 mr-2" />
                  {matching.properties?.empty?.lowerScore || 'Lower minimum score'}
                </Button>
              )}
              <Button variant="default" onClick={generateMatches} disabled={isGenerating}>
                <TrendingUp className="w-4 h-4 mr-2" />
                {isGenerating
                  ? (matching.properties?.generating || 'Generating...')
                  : (matching.properties?.empty?.generate || 'Generate matches')}
              </Button>
            </div>
          </Card>
        ) : (
          <>
            {/* Info Banner */}
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm text-blue-900">
                  <strong>{matching.properties?.info?.title || 'How does it work?'}</strong> {matching.properties?.info?.description || 'Matches are calculated based on your budget (30%), location (25%), lifestyle (20%), availability (15%) and preferences (10%). The higher the score, the better the property matches your criteria.'}
                </p>
              </div>
            </div>

            {/* Matches Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {matches.map((match) => (
                <PropertyMatchCard
                  key={match.id}
                  match={match}
                  onViewDetails={handleViewDetails}
                  onContact={handleContact}
                  onHide={handleHide}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
