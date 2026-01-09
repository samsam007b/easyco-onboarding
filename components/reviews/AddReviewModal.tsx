'use client';

import { useState } from 'react';
import { Star, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { createClient } from '@/lib/auth/supabase-client';
import { logger } from '@/lib/utils/logger';
import { toast } from 'sonner';
import LoadingHouse from '@/components/ui/LoadingHouse';
import { useLanguage } from '@/lib/i18n/use-language';

interface AddReviewModalProps {
  propertyId: string;
  propertyTitle: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function AddReviewModal({
  propertyId,
  propertyTitle,
  isOpen,
  onClose,
  onSuccess,
}: AddReviewModalProps) {
  const { language, getSection } = useLanguage();
  const t = getSection('components')?.reviews;
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    rating: 0,
    title: '',
    comment: '',
    cleanlinessRating: 0,
    locationRating: 0,
    valueRating: 0,
    amenitiesRating: 0,
    communicationRating: 0,
  });

  const supabase = createClient();

  const handleStarClick = (field: string, value: number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const renderStars = (field: string, currentValue: number, label: string) => {
    return (
      <div className="space-y-2">
        <Label className="text-sm font-medium">{label}</Label>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => handleStarClick(field, star)}
              className="focus:outline-none transition-transform hover:scale-110"
            >
              <Star
                className={`w-8 h-8 ${
                  star <= currentValue
                    ? 'fill-searcher-500 text-searcher-500'
                    : 'text-gray-300'
                }`}
              />
            </button>
          ))}
        </div>
      </div>
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.rating === 0) {
      toast.error(t?.selectRatingError?.[language] || 'Please select an overall rating');
      return;
    }

    setSubmitting(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error(t?.mustBeLoggedIn?.[language] || 'You must be logged in');
        return;
      }

      // Check if user can review this property
      const { data: canReview } = await supabase.rpc('can_review_property', {
        p_property_id: propertyId,
        p_user_id: user.id,
      });

      if (!canReview) {
        toast.error(t?.mustHaveStayed?.[language] || 'You must have stayed at this property to leave a review');
        return;
      }

      // Create review
      const { error } = await supabase.from('reviews').insert({
        review_type: 'property',
        property_id: propertyId,
        reviewer_id: user.id,
        rating: formData.rating,
        title: formData.title || null,
        comment: formData.comment || null,
        cleanliness_rating: formData.cleanlinessRating || null,
        location_rating: formData.locationRating || null,
        value_rating: formData.valueRating || null,
        amenities_rating: formData.amenitiesRating || null,
        communication_rating: formData.communicationRating || null,
        verified_stay: true, // Since we checked can_review_property
      });

      if (error) {
        if (error.code === '23505') {
          toast.error(t?.alreadyReviewed?.[language] || 'You have already reviewed this property');
        } else {
          throw error;
        }
        return;
      }

      toast.success(t?.reviewPublished?.[language] || 'Review published successfully!');
      onSuccess?.();
      onClose();
    } catch (error: any) {
      logger.error('Error submitting review', error);
      toast.error(error.message || (t?.publishError?.[language] || 'Error publishing review'));
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <Card className="max-w-2xl w-full my-8">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl">{t?.leaveReview?.[language] || 'Leave a review'}</CardTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="rounded-full"
              aria-label={t?.close?.[language] || 'Close'}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
          <p className="text-sm text-gray-600 mt-2">{propertyTitle}</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Overall Rating */}
            <div className="space-y-2">
              <Label className="text-base font-semibold">{t?.overallRating?.[language] || 'Overall rating'} *</Label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => handleStarClick('rating', star)}
                    className="focus:outline-none transition-transform hover:scale-110"
                  >
                    <Star
                      className={`w-10 h-10 ${
                        star <= formData.rating
                          ? 'fill-searcher-500 text-searcher-500'
                          : 'text-gray-300'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Title */}
            <div>
              <Label htmlFor="title">{t?.titleOptional?.[language] || 'Title (optional)'}</Label>
              <input
                type="text"
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder={t?.titlePlaceholder?.[language] || 'Summarize your experience'}
                className="w-full mt-2 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-searcher-500"
                maxLength={100}
              />
            </div>

            {/* Comment */}
            <div>
              <Label htmlFor="comment">{t?.yourReviewOptional?.[language] || 'Your review (optional)'}</Label>
              <textarea
                id="comment"
                rows={4}
                value={formData.comment}
                onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                placeholder={t?.commentPlaceholder?.[language] || 'Share your experience with future tenants...'}
                className="w-full mt-2 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-searcher-500"
              />
            </div>

            {/* Detailed Ratings */}
            <div className="border-t pt-6">
              <h3 className="text-base font-semibold mb-4">{t?.detailedRatingsOptional?.[language] || 'Detailed ratings (optional)'}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {renderStars('cleanlinessRating', formData.cleanlinessRating, t?.cleanliness?.[language] || 'Cleanliness')}
                {renderStars('locationRating', formData.locationRating, t?.location?.[language] || 'Location')}
                {renderStars('valueRating', formData.valueRating, t?.valueForMoney?.[language] || 'Value for money')}
                {renderStars('amenitiesRating', formData.amenitiesRating, t?.amenities?.[language] || 'Amenities')}
                {renderStars('communicationRating', formData.communicationRating, t?.communication?.[language] || 'Communication')}
              </div>
            </div>

            {/* Submit */}
            <div className="flex justify-end gap-3 pt-6 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={submitting}
              >
                {t?.cancel?.[language] || 'Cancel'}
              </Button>
              <Button
                type="submit"
                disabled={submitting || formData.rating === 0}
                className="bg-searcher-500 hover:bg-searcher-600 text-white"
              >
                {submitting ? (
                  <div className="flex items-center gap-2">
                    <LoadingHouse size={16} />
                    <span>{t?.publishing?.[language] || 'Publishing...'}</span>
                  </div>
                ) : (
                  t?.publishReview?.[language] || 'Publish review'
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
