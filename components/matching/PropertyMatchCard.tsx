'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useState, memo, useCallback } from 'react';
import { MapPin, Euro, Calendar, Heart, X, Eye, TrendingUp, Home, Users, Sparkles } from 'lucide-react';

export interface PropertyMatch {
  id: string;
  property_id: string;
  searcher_id: string;
  owner_id: string;
  match_score: number;
  score_breakdown: {
    budget_score: number;
    location_score: number;
    lifestyle_score: number;
    availability_score: number;
    preferences_score: number;
  };
  match_reasons: string[];
  status: 'active' | 'viewed' | 'contacted' | 'hidden';
  viewed_at?: string;
  contacted_at?: string;
  created_at: string;
  property?: {
    id: string;
    title: string;
    description?: string;
    city: string;
    neighborhood?: string;
    monthly_rent: number;
    available_from: string;
    property_type: string;
    number_of_rooms?: number;
    furnished?: boolean;
    photo_urls?: string[];
  };
  owner?: {
    id: string;
    first_name: string;
    last_name: string;
    profile_photo_url?: string;
  };
}

interface PropertyMatchCardProps {
  match: PropertyMatch;
  onContact?: (matchId: string) => void;
  onHide?: (matchId: string) => void;
  onViewDetails?: (matchId: string, propertyId: string) => void;
}

// Memoized helper functions outside component
const getScoreColor = (score: number) => {
  if (score >= 80) return 'text-green-600';
  if (score >= 60) return 'text-yellow-600';
  return 'text-orange-600';
};

const getScoreBgColor = (score: number) => {
  if (score >= 80) return 'bg-green-100';
  if (score >= 60) return 'bg-yellow-100';
  return 'bg-orange-100';
};

const priceFormatter = new Intl.NumberFormat('fr-FR', {
  style: 'currency',
  currency: 'EUR',
  minimumFractionDigits: 0,
});

const formatPrice = (price: number) => priceFormatter.format(price);

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
};

export const PropertyMatchCard = memo(function PropertyMatchCard({
  match,
  onContact,
  onHide,
  onViewDetails,
}: PropertyMatchCardProps) {
  const [showDetails, setShowDetails] = useState(false);
  const property = match.property;
  const owner = match.owner;

  const toggleDetails = useCallback(() => {
    setShowDetails(prev => !prev);
  }, []);

  const handleViewDetails = useCallback(() => {
    if (onViewDetails && property) {
      onViewDetails(match.id, property.id);
    }
  }, [onViewDetails, match.id, property]);

  const handleContact = useCallback(() => {
    if (onContact) {
      onContact(match.id);
    }
  }, [onContact, match.id]);

  const handleHide = useCallback(() => {
    if (onHide) {
      onHide(match.id);
    }
  }, [onHide, match.id]);

  if (!property) return null;

  const scoreBreakdown = match.score_breakdown;

  return (
    <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-purple-200">
      {/* Property Image */}
      <div className="relative h-56 overflow-hidden group">
        {property.photo_urls && property.photo_urls.length > 0 ? (
          <img
            src={property.photo_urls[0]}
            alt={property.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-purple-200 via-purple-100 to-yellow-100 flex items-center justify-center">
            <Home className="w-16 h-16 text-purple-300" />
          </div>
        )}

        {/* Match Score Badge */}
        <div className="absolute top-4 right-4">
          <div
            className={`px-4 py-2 ${getScoreBgColor(match.match_score)} rounded-full shadow-lg backdrop-blur-sm`}
          >
            <div className="flex items-center gap-2">
              <Sparkles className={`w-4 h-4 ${getScoreColor(match.match_score)}`} />
              <span className={`text-lg font-bold ${getScoreColor(match.match_score)}`}>
                {match.match_score}%
              </span>
            </div>
          </div>
        </div>

        {/* Status Badge */}
        {match.status === 'viewed' && (
          <div className="absolute top-4 left-4">
            <Badge variant="secondary" className="backdrop-blur-sm">
              <Eye className="w-3 h-3 mr-1" />
              Vu
            </Badge>
          </div>
        )}

        {match.status === 'contacted' && (
          <div className="absolute top-4 left-4">
            <Badge variant="default" className="backdrop-blur-sm">
              <Users className="w-3 h-3 mr-1" />
              Contacté
            </Badge>
          </div>
        )}
      </div>

      <CardContent className="p-5">
        {/* Property Title & Location */}
        <div className="mb-3">
          <h3 className="text-xl font-bold text-[#4A148C] mb-2 line-clamp-1">
            {property.title}
          </h3>
          <div className="flex items-center gap-2 text-gray-600">
            <MapPin className="w-4 h-4" />
            <span className="text-sm">
              {property.neighborhood ? `${property.neighborhood}, ` : ''}
              {property.city}
            </span>
          </div>
        </div>

        {/* Price & Availability */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="flex items-center gap-2 text-gray-700">
            <Euro className="w-4 h-4 text-purple-600" />
            <span className="font-semibold">{formatPrice(property.monthly_rent)}/mois</span>
          </div>
          <div className="flex items-center gap-2 text-gray-700">
            <Calendar className="w-4 h-4 text-purple-600" />
            <span className="text-sm">{formatDate(property.available_from)}</span>
          </div>
        </div>

        {/* Property Details */}
        <div className="flex flex-wrap gap-2 mb-4">
          <Badge variant="secondary" size="sm">
            {property.property_type}
          </Badge>
          {property.number_of_rooms && (
            <Badge variant="secondary" size="sm">
              {property.number_of_rooms} pièces
            </Badge>
          )}
          {property.furnished && (
            <Badge variant="secondary" size="sm">
              Meublé
            </Badge>
          )}
        </div>

        {/* Match Reasons */}
        {match.match_reasons && match.match_reasons.length > 0 && (
          <div className="mb-4 p-3 bg-purple-50 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-purple-600" />
              <span className="text-sm font-semibold text-purple-900">
                Pourquoi ce match ?
              </span>
            </div>
            <ul className="text-sm text-purple-800 space-y-1">
              {match.match_reasons.slice(0, 2).map((reason, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-purple-400 mt-0.5">•</span>
                  <span>{reason}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Score Breakdown Toggle */}
        <button
          onClick={toggleDetails}
          className="w-full text-sm text-purple-600 hover:text-purple-800 font-medium mb-3 text-left flex items-center gap-2"
        >
          <TrendingUp className="w-4 h-4" />
          {showDetails ? 'Masquer les détails' : 'Voir le détail du score'}
        </button>

        {/* Detailed Score Breakdown */}
        {showDetails && (
          <div className="mb-4 space-y-3 p-3 bg-gray-50 rounded-lg">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-700">Budget</span>
                <span className={`font-semibold ${getScoreColor(scoreBreakdown.budget_score)}`}>
                  {scoreBreakdown.budget_score}%
                </span>
              </div>
              <Progress value={scoreBreakdown.budget_score} className="h-2" />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-700">Localisation</span>
                <span className={`font-semibold ${getScoreColor(scoreBreakdown.location_score)}`}>
                  {scoreBreakdown.location_score}%
                </span>
              </div>
              <Progress value={scoreBreakdown.location_score} className="h-2" />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-700">Style de vie</span>
                <span className={`font-semibold ${getScoreColor(scoreBreakdown.lifestyle_score)}`}>
                  {scoreBreakdown.lifestyle_score}%
                </span>
              </div>
              <Progress value={scoreBreakdown.lifestyle_score} className="h-2" />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-700">Disponibilité</span>
                <span
                  className={`font-semibold ${getScoreColor(scoreBreakdown.availability_score)}`}
                >
                  {scoreBreakdown.availability_score}%
                </span>
              </div>
              <Progress value={scoreBreakdown.availability_score} className="h-2" />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-700">Préférences</span>
                <span
                  className={`font-semibold ${getScoreColor(scoreBreakdown.preferences_score)}`}
                >
                  {scoreBreakdown.preferences_score}%
                </span>
              </div>
              <Progress value={scoreBreakdown.preferences_score} className="h-2" />
            </div>
          </div>
        )}

        {/* Owner Info */}
        {owner && (
          <div className="mb-4 p-3 bg-gray-50 rounded-lg flex items-center gap-3">
            {owner.profile_photo_url ? (
              <img
                src={owner.profile_photo_url}
                alt={`${owner.first_name} ${owner.last_name}`}
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-purple-200 flex items-center justify-center">
                <span className="text-purple-700 font-semibold text-sm">
                  {owner.first_name.charAt(0)}
                  {owner.last_name.charAt(0)}
                </span>
              </div>
            )}
            <div>
              <p className="text-sm font-medium text-gray-900">
                {owner.first_name} {owner.last_name}
              </p>
              <p className="text-xs text-gray-600">Propriétaire</p>
            </div>
          </div>
        )}

        {/* Action Buttons - with glassmorphism */}
        <div className="relative -mx-5 -mb-5 mt-4 px-5 py-4 rounded-b-2xl overflow-hidden">
          {/* Animated background lights - Slow right to left */}
          <div className="absolute inset-0 bg-gradient-to-br from-orange-50 via-purple-50 to-yellow-50">
            <div className="absolute top-0 left-1/4 w-32 h-32 bg-orange-300/60 rounded-full blur-2xl"
                 style={{ animation: 'float 20s ease-in-out infinite' }} />
            <div className="absolute bottom-0 right-1/3 w-40 h-40 bg-purple-300/50 rounded-full blur-2xl"
                 style={{ animation: 'float 25s ease-in-out infinite 5s' }} />
            <div className="absolute top-1/2 left-1/2 w-36 h-36 bg-yellow-200/50 rounded-full blur-2xl"
                 style={{ animation: 'float 22s ease-in-out infinite 10s' }} />
          </div>

          {/* Glassmorphism layer */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/70 via-white/60 to-white/50 backdrop-blur-2xl backdrop-saturate-150 z-10"
               style={{
                 WebkitBackdropFilter: 'blur(40px) saturate(150%)',
                 backdropFilter: 'blur(40px) saturate(150%)'
               }}
          />
          <div className="absolute inset-0 border-t border-white/30 shadow-lg z-10" />

          <div className="relative z-20 flex gap-2">
            <Button
              className="flex-1"
              variant="default"
              onClick={handleViewDetails}
            >
              <Eye className="w-4 h-4 mr-2" />
              Voir le bien
            </Button>

            {match.status !== 'contacted' && (
              <Button
                className="flex-1"
                variant="outline"
                onClick={handleContact}
              >
                <Heart className="w-4 h-4 mr-2" />
                Contacter
              </Button>
            )}

            <Button
              variant="ghost"
              size="icon"
              className="text-gray-400 hover:text-red-600"
              onClick={handleHide}
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
});
