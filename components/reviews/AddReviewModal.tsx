'use client';

import { useState } from 'react';
import { Star, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { createClient } from '@/lib/auth/supabase-client';
import { toast } from 'sonner';
import LoadingHouse from '@/components/ui/LoadingHouse';

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
                    ? 'fill-orange-500 text-orange-500'
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
      toast.error('Veuillez sélectionner une note globale');
      return;
    }

    setSubmitting(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('Vous devez être connecté');
        return;
      }

      // Check if user can review this property
      const { data: canReview } = await supabase.rpc('can_review_property', {
        p_property_id: propertyId,
        p_user_id: user.id,
      });

      if (!canReview) {
        toast.error('Vous devez avoir séjourné dans cette propriété pour laisser un avis');
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
          toast.error('Vous avez déjà laissé un avis pour cette propriété');
        } else {
          throw error;
        }
        return;
      }

      toast.success('Avis publié avec succès!');
      onSuccess?.();
      onClose();
    } catch (error: any) {
      console.error('Error submitting review:', error);
      toast.error(error.message || 'Erreur lors de la publication de l\'avis');
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
            <CardTitle className="text-2xl">Laisser un avis</CardTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="rounded-full"
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
              <Label className="text-base font-semibold">Note globale *</Label>
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
                          ? 'fill-orange-500 text-orange-500'
                          : 'text-gray-300'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Title */}
            <div>
              <Label htmlFor="title">Titre (optionnel)</Label>
              <input
                type="text"
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Résumez votre expérience"
                className="w-full mt-2 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                maxLength={100}
              />
            </div>

            {/* Comment */}
            <div>
              <Label htmlFor="comment">Votre avis (optionnel)</Label>
              <textarea
                id="comment"
                rows={4}
                value={formData.comment}
                onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                placeholder="Partagez votre expérience avec les futurs locataires..."
                className="w-full mt-2 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            {/* Detailed Ratings */}
            <div className="border-t pt-6">
              <h3 className="text-base font-semibold mb-4">Notes détaillées (optionnel)</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {renderStars('cleanlinessRating', formData.cleanlinessRating, 'Propreté')}
                {renderStars('locationRating', formData.locationRating, 'Emplacement')}
                {renderStars('valueRating', formData.valueRating, 'Rapport qualité-prix')}
                {renderStars('amenitiesRating', formData.amenitiesRating, 'Équipements')}
                {renderStars('communicationRating', formData.communicationRating, 'Communication')}
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
                Annuler
              </Button>
              <Button
                type="submit"
                disabled={submitting || formData.rating === 0}
                className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white"
              >
                {submitting ? (
                  <div className="flex items-center gap-2">
                    <LoadingHouse size={16} />
                    <span>Publication...</span>
                  </div>
                ) : (
                  'Publier l\'avis'
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
