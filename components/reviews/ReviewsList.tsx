'use client';

import { useEffect, useState } from 'react';
import { Star, ThumbsUp, Calendar, User, CheckCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { createClient } from '@/lib/auth/supabase-client';
import { toast } from 'sonner';

interface Review {
  id: string;
  rating: number;
  title: string | null;
  comment: string | null;
  cleanliness_rating: number | null;
  location_rating: number | null;
  value_rating: number | null;
  amenities_rating: number | null;
  communication_rating: number | null;
  helpful_count: number;
  verified_stay: boolean;
  stay_duration_months: number | null;
  created_at: string;
  reviewer: {
    first_name: string;
    last_name: string;
    profile_photo_url: string | null;
  };
}

interface ReviewsListProps {
  propertyId: string;
  className?: string;
}

export default function ReviewsList({ propertyId, className }: ReviewsListProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [helpfulVotes, setHelpfulVotes] = useState<Set<string>>(new Set());
  const [userId, setUserId] = useState<string | null>(null);

  const supabase = createClient();

  useEffect(() => {
    loadReviews();
    loadUserHelpfulVotes();
  }, [propertyId]);

  const loadReviews = async () => {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select(`
          *,
          reviewer:user_profiles!reviewer_id(first_name, last_name, profile_photo_url)
        `)
        .eq('property_id', propertyId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setReviews(data || []);
    } catch (error) {
      console.error('Error loading reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadUserHelpfulVotes = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    setUserId(user.id);

    const { data } = await supabase
      .from('review_helpful_votes')
      .select('review_id')
      .eq('user_id', user.id);

    if (data) {
      setHelpfulVotes(new Set(data.map((v) => v.review_id)));
    }
  };

  const handleHelpfulClick = async (reviewId: string) => {
    if (!userId) {
      toast.error('Connectez-vous pour voter');
      return;
    }

    const isHelpful = helpfulVotes.has(reviewId);

    try {
      if (isHelpful) {
        // Remove vote
        await supabase
          .from('review_helpful_votes')
          .delete()
          .eq('review_id', reviewId)
          .eq('user_id', userId);

        setHelpfulVotes((prev) => {
          const newSet = new Set(prev);
          newSet.delete(reviewId);
          return newSet;
        });
      } else {
        // Add vote
        await supabase
          .from('review_helpful_votes')
          .insert({ review_id: reviewId, user_id: userId });

        setHelpfulVotes((prev) => new Set(prev).add(reviewId));
      }

      // Refresh reviews to get updated helpful_count
      loadReviews();
    } catch (error: any) {
      console.error('Error voting:', error);
      toast.error('Erreur lors du vote');
    }
  };

  const renderStars = (rating: number, size: 'sm' | 'lg' = 'sm') => {
    const starSize = size === 'sm' ? 'w-4 h-4' : 'w-5 h-5';
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${starSize} ${
              star <= rating
                ? 'fill-orange-500 text-orange-500'
                : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  const getAverageRatings = () => {
    if (reviews.length === 0) return null;

    const totals = {
      overall: 0,
      cleanliness: 0,
      location: 0,
      value: 0,
      amenities: 0,
      communication: 0,
    };

    const counts = {
      cleanliness: 0,
      location: 0,
      value: 0,
      amenities: 0,
      communication: 0,
    };

    reviews.forEach((review) => {
      totals.overall += review.rating;
      if (review.cleanliness_rating) {
        totals.cleanliness += review.cleanliness_rating;
        counts.cleanliness++;
      }
      if (review.location_rating) {
        totals.location += review.location_rating;
        counts.location++;
      }
      if (review.value_rating) {
        totals.value += review.value_rating;
        counts.value++;
      }
      if (review.amenities_rating) {
        totals.amenities += review.amenities_rating;
        counts.amenities++;
      }
      if (review.communication_rating) {
        totals.communication += review.communication_rating;
        counts.communication++;
      }
    });

    return {
      overall: (totals.overall / reviews.length).toFixed(1),
      cleanliness: counts.cleanliness > 0 ? (totals.cleanliness / counts.cleanliness).toFixed(1) : null,
      location: counts.location > 0 ? (totals.location / counts.location).toFixed(1) : null,
      value: counts.value > 0 ? (totals.value / counts.value).toFixed(1) : null,
      amenities: counts.amenities > 0 ? (totals.amenities / counts.amenities).toFixed(1) : null,
      communication: counts.communication > 0 ? (totals.communication / counts.communication).toFixed(1) : null,
    };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className="text-center py-12">
        <Star className="w-12 h-12 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucun avis pour le moment</h3>
        <p className="text-gray-600">Soyez le premier à laisser un avis sur cette propriété</p>
      </div>
    );
  }

  const averages = getAverageRatings();

  return (
    <div className={className}>
      {/* Summary */}
      {averages && (
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex items-center gap-6 mb-6">
              <div className="text-center">
                <div className="text-4xl font-bold text-orange-600 mb-2">
                  {averages.overall}
                </div>
                {renderStars(Math.round(parseFloat(averages.overall)), 'lg')}
                <p className="text-sm text-gray-600 mt-2">
                  {reviews.length} avis
                </p>
              </div>

              <div className="flex-1 space-y-2">
                {averages.cleanliness && (
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-600 w-32">Propreté</span>
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-orange-500 h-2 rounded-full"
                        style={{ width: `${(parseFloat(averages.cleanliness) / 5) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium w-8">{averages.cleanliness}</span>
                  </div>
                )}
                {averages.location && (
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-600 w-32">Emplacement</span>
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-orange-500 h-2 rounded-full"
                        style={{ width: `${(parseFloat(averages.location) / 5) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium w-8">{averages.location}</span>
                  </div>
                )}
                {averages.value && (
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-600 w-32">Rapport qualité-prix</span>
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-orange-500 h-2 rounded-full"
                        style={{ width: `${(parseFloat(averages.value) / 5) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium w-8">{averages.value}</span>
                  </div>
                )}
                {averages.amenities && (
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-600 w-32">Équipements</span>
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-orange-500 h-2 rounded-full"
                        style={{ width: `${(parseFloat(averages.amenities) / 5) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium w-8">{averages.amenities}</span>
                  </div>
                )}
                {averages.communication && (
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-600 w-32">Communication</span>
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-orange-500 h-2 rounded-full"
                        style={{ width: `${(parseFloat(averages.communication) / 5) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium w-8">{averages.communication}</span>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.map((review) => (
          <Card key={review.id}>
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                {/* Avatar */}
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center flex-shrink-0 text-white font-semibold">
                  {review.reviewer.profile_photo_url ? (
                    <img
                      src={review.reviewer.profile_photo_url}
                      alt={`${review.reviewer.first_name} ${review.reviewer.last_name}`}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <span>
                      {review.reviewer.first_name[0]}
                      {review.reviewer.last_name[0]}
                    </span>
                  )}
                </div>

                <div className="flex-1">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-gray-900">
                          {review.reviewer.first_name} {review.reviewer.last_name}
                        </h4>
                        {review.verified_stay && (
                          <Badge className="bg-green-100 text-green-700 text-xs">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Séjour vérifié
                          </Badge>
                        )}
                      </div>
                      {renderStars(review.rating)}
                    </div>
                    <div className="text-sm text-gray-500 flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {new Date(review.created_at).toLocaleDateString('fr-FR')}
                    </div>
                  </div>

                  {/* Title */}
                  {review.title && (
                    <h5 className="font-semibold text-gray-900 mb-2">{review.title}</h5>
                  )}

                  {/* Comment */}
                  {review.comment && (
                    <p className="text-gray-700 mb-3">{review.comment}</p>
                  )}

                  {/* Stay duration */}
                  {review.stay_duration_months && (
                    <p className="text-sm text-gray-600 mb-3">
                      A séjourné {review.stay_duration_months} mois
                    </p>
                  )}

                  {/* Helpful button */}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleHelpfulClick(review.id)}
                    className={`text-sm ${
                      helpfulVotes.has(review.id)
                        ? 'text-orange-600'
                        : 'text-gray-600'
                    }`}
                  >
                    <ThumbsUp
                      className={`w-4 h-4 mr-1 ${
                        helpfulVotes.has(review.id) ? 'fill-orange-600' : ''
                      }`}
                    />
                    Utile ({review.helpful_count})
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
