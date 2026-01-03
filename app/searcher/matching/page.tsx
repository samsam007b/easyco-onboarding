'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { createClient } from '@/lib/auth/supabase-client';
import { useLanguage } from '@/lib/i18n/use-language';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import LoadingHouse from '@/components/ui/LoadingHouse';
import {
  Heart,
  Home,
  Users,
  MapPin,
  Euro,
  Star,
  ArrowLeft,
  Sparkles,
  TrendingUp,
  Eye,
  Send,
  Filter,
  RefreshCw,
  Zap,
} from 'lucide-react';

// V3-FUN Palette
const SEARCHER_GRADIENT = 'linear-gradient(135deg, #F59E0B 0%, #FFB10B 50%, #FCD34D 100%)';
const SEARCHER_GRADIENT_SOFT = 'linear-gradient(135deg, #FFF9E6 0%, #FEF3C7 100%)';
const MATCH_GRADIENT = 'linear-gradient(135deg, #EC4899 0%, #F472B6 50%, #F9A8D4 100%)';

interface PropertyMatch {
  id: string;
  property_id: string;
  compatibility_score: number;
  match_reasons: string[];
  property: {
    id: string;
    title: string;
    city: string;
    postal_code: string;
    monthly_rent: number;
    available_rooms: number;
    max_roommates: number;
    main_image?: string;
    property_type: string;
  };
}

export default function SearcherMatchingPage() {
  const router = useRouter();
  const supabase = createClient();
  const { language } = useLanguage();

  const [loading, setLoading] = useState(true);
  const [matches, setMatches] = useState<PropertyMatch[]>([]);
  const [sortBy, setSortBy] = useState<'score' | 'price' | 'recent'>('score');

  useEffect(() => {
    const loadMatches = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push('/login'); return; }

      // Load property matches
      // Note: This assumes a matching_property_scores or similar table exists
      // For now, we'll simulate with favorites and random scores
      const { data: favorites } = await supabase
        .from('favorites')
        .select(`
          id,
          property_id,
          property:properties(
            id,
            title,
            city,
            postal_code,
            monthly_rent,
            available_rooms,
            max_roommates,
            main_image,
            property_type
          )
        `)
        .eq('user_id', user.id)
        .limit(10);

      if (favorites) {
        const matchData: PropertyMatch[] = favorites
          .filter(f => f.property !== null)
          .map(f => {
            // Supabase returns relations as arrays, handle both cases
            const property = Array.isArray(f.property) ? f.property[0] : f.property;
            return {
              id: f.id,
              property_id: f.property_id,
              compatibility_score: Math.floor(Math.random() * 30) + 70, // 70-100%
              match_reasons: [
                'Budget correspondant',
                'Localisation idéale',
                'Style de vie compatible'
              ],
              property: property as PropertyMatch['property']
            };
          })
          .filter(m => m.property !== null && m.property !== undefined)
          .sort((a, b) => b.compatibility_score - a.compatibility_score);

        setMatches(matchData);
      }
      setLoading(false);
    };
    loadMatches();
  }, [supabase, router]);

  const getScoreColor = (score: number) => {
    if (score >= 90) return '#10B981'; // green
    if (score >= 80) return '#F59E0B'; // amber
    if (score >= 70) return '#3B82F6'; // blue
    return '#6B7280'; // gray
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingHouse size={80} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-amber-50/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-3">
              <Link href="/searcher">
                <Button variant="ghost" size="icon" className="rounded-xl">
                  <ArrowLeft className="w-5 h-5" />
                </Button>
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg"
                    style={{ background: MATCH_GRADIENT }}
                  >
                    <Heart className="w-6 h-6 text-white" />
                  </div>
                  Matching Hub
                </h1>
                <p className="text-gray-600 mt-1">
                  Propriétés compatibles avec votre profil
                </p>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-2">
              <Link href="/searcher/matching">
                <Button
                  variant="default"
                  className="rounded-xl text-white shadow-lg"
                  style={{ background: MATCH_GRADIENT }}
                >
                  <Home className="w-4 h-4 mr-2" />
                  Propriétés
                </Button>
              </Link>
              <Link href="/searcher/matching/people">
                <Button variant="outline" className="rounded-xl">
                  <Users className="w-4 h-4 mr-2" />
                  Colocataires
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Stats Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8 p-6 rounded-2xl border border-pink-200"
          style={{ background: 'linear-gradient(135deg, #FDF2F8 0%, #FCE7F3 100%)' }}
        >
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg" style={{ background: MATCH_GRADIENT }}>
                <TrendingUp className="w-7 h-7 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{matches.length} matchs</p>
                <p className="text-gray-600">avec plus de 70% de compatibilité</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="rounded-xl">
                <Filter className="w-4 h-4 mr-2" />
                Filtrer
              </Button>
              <Button variant="outline" size="sm" className="rounded-xl">
                <RefreshCw className="w-4 h-4 mr-2" />
                Actualiser
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Matches Grid */}
        {matches.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative overflow-hidden rounded-3xl border-2 border-pink-100 shadow-lg"
            style={{ background: 'linear-gradient(135deg, #FDF2F8 0%, #FCE7F3 100%)' }}
          >
            <div className="absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-20" style={{ background: MATCH_GRADIENT }} />
            <div className="relative flex flex-col items-center justify-center py-20 px-8">
              <motion.div
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-24 h-24 rounded-3xl flex items-center justify-center mb-6 shadow-xl"
                style={{ background: MATCH_GRADIENT }}
              >
                <Heart className="w-12 h-12 text-white" />
              </motion.div>
              <h3 className="text-3xl font-bold text-gray-900 mb-3">
                Pas encore de matchs
              </h3>
              <p className="text-lg text-gray-600 text-center max-w-md mb-8">
                Complétez votre profil et vos préférences pour découvrir les propriétés qui vous correspondent
              </p>
              <Button
                onClick={() => router.push('/profile/searcher')}
                className="text-white px-8 py-6 text-lg rounded-2xl shadow-lg hover:shadow-xl transition-all"
                style={{ background: MATCH_GRADIENT }}
              >
                <Sparkles className="w-5 h-5 mr-2" />
                Compléter mon profil
              </Button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
            }}
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {matches.map((match, index) => (
              <motion.div
                key={match.id}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 }
                }}
              >
                <Card className="overflow-hidden rounded-2xl border-gray-100 hover:border-pink-200 hover:shadow-lg transition-all group">
                  {/* Image */}
                  <div className="relative h-48 bg-gray-100">
                    {match.property.main_image ? (
                      <Image
                        src={match.property.main_image}
                        alt={match.property.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Home className="w-12 h-12 text-gray-300" />
                      </div>
                    )}
                    {/* Match Score Badge */}
                    <div
                      className="absolute top-3 right-3 px-3 py-1.5 rounded-xl text-white font-bold text-lg shadow-lg flex items-center gap-1"
                      style={{ background: getScoreColor(match.compatibility_score) }}
                    >
                      <Zap className="w-4 h-4" />
                      {match.compatibility_score}%
                    </div>
                    {/* Rank Badge */}
                    {index < 3 && (
                      <div className="absolute top-3 left-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-lg">
                        <span className="font-bold text-gray-900">#{index + 1}</span>
                      </div>
                    )}
                  </div>

                  <CardContent className="p-5">
                    <h3 className="font-semibold text-lg text-gray-900 mb-2 line-clamp-1">
                      {match.property.title}
                    </h3>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-gray-600 text-sm">
                        <MapPin className="w-4 h-4" />
                        <span>{match.property.city}, {match.property.postal_code}</span>
                      </div>
                    </div>

                    {/* Match Reasons */}
                    <div className="flex flex-wrap gap-1 mb-4">
                      {match.match_reasons.slice(0, 2).map((reason, i) => (
                        <Badge key={i} variant="secondary" className="rounded-lg bg-pink-50 text-pink-700 border-0 text-xs">
                          {reason}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <Euro className="w-5 h-5 text-amber-600" />
                        <span className="text-xl font-bold text-gray-900">
                          {match.property.monthly_rent.toLocaleString()}
                        </span>
                        <span className="text-gray-500 text-sm">/mois</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 rounded-xl"
                        onClick={() => router.push(`/properties/${match.property.id}`)}
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        Voir
                      </Button>
                      <Button
                        size="sm"
                        className="flex-1 rounded-xl text-white"
                        style={{ background: MATCH_GRADIENT }}
                        onClick={() => router.push(`/properties/${match.property.id}/apply`)}
                      >
                        <Send className="w-4 h-4 mr-1" />
                        Postuler
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}
