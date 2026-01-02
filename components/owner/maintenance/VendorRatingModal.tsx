'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Star,
  ThumbsUp,
  ThumbsDown,
  Loader2,
  CheckCircle,
  Wrench,
  Clock,
  DollarSign,
  MessageSquare,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { vendorService, type CreateRatingData } from '@/lib/services/vendor-service';
import { ownerGradient } from '@/lib/constants/owner-theme';
import { cn } from '@/lib/utils';

interface VendorRatingModalProps {
  open: boolean;
  onClose: () => void;
  vendorId: string;
  vendorName: string;
  maintenanceRequestId?: string;
  propertyId?: string;
  jobType?: string;
  onRatingSubmitted?: () => void;
}

interface RatingCategory {
  key: 'quality' | 'punctuality' | 'price' | 'communication';
  label: string;
  icon: React.ElementType;
  description: string;
}

const ratingCategories: RatingCategory[] = [
  {
    key: 'quality',
    label: 'Qualite du travail',
    icon: Wrench,
    description: 'Qualite de l\'intervention',
  },
  {
    key: 'punctuality',
    label: 'Ponctualite',
    icon: Clock,
    description: 'Respect des horaires',
  },
  {
    key: 'price',
    label: 'Rapport qualite/prix',
    icon: DollarSign,
    description: 'Prix justifie',
  },
  {
    key: 'communication',
    label: 'Communication',
    icon: MessageSquare,
    description: 'Echanges et suivi',
  },
];

export function VendorRatingModal({
  open,
  onClose,
  vendorId,
  vendorName,
  maintenanceRequestId,
  propertyId,
  jobType,
  onRatingSubmitted,
}: VendorRatingModalProps) {
  const [overallRating, setOverallRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [detailedRatings, setDetailedRatings] = useState<Record<string, number>>({
    quality: 0,
    punctuality: 0,
    price: 0,
    communication: 0,
  });
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [wouldRecommend, setWouldRecommend] = useState<boolean | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleDetailedRating = (key: string, value: number) => {
    setDetailedRatings((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    if (overallRating === 0) {
      toast.error('Veuillez donner une note globale');
      return;
    }

    setIsSubmitting(true);

    try {
      const {
        data: { user },
      } = await (await import('@/lib/auth/supabase-client')).createClient().auth.getUser();

      if (!user) {
        toast.error('Vous devez etre connecte');
        return;
      }

      const ratingData: CreateRatingData = {
        vendorId,
        maintenanceRequestId,
        propertyId,
        overallRating,
        qualityRating: detailedRatings.quality || undefined,
        punctualityRating: detailedRatings.punctuality || undefined,
        priceRating: detailedRatings.price || undefined,
        communicationRating: detailedRatings.communication || undefined,
        title: title || undefined,
        comment: comment || undefined,
        jobType,
        wouldRecommend: wouldRecommend ?? undefined,
        jobDate: new Date(),
      };

      const result = await vendorService.submitRating(user.id, ratingData);

      if (result) {
        setIsSubmitted(true);
        toast.success('Evaluation enregistree');
        setTimeout(() => {
          onRatingSubmitted?.();
          onClose();
        }, 1500);
      } else {
        toast.error('Erreur lors de l\'enregistrement');
      }
    } catch (error) {
      console.error('Error submitting rating:', error);
      toast.error('Erreur lors de l\'enregistrement');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
    }
  };

  if (!open) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative z-10 w-full max-w-lg mx-4 bg-white rounded-2xl shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div
            className="px-6 py-4 text-white"
            style={{ background: ownerGradient }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                  <Star className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="font-bold text-lg">Evaluer le prestataire</h2>
                  <p className="text-white/80 text-sm">{vendorName}</p>
                </div>
              </div>
              <button
                onClick={handleClose}
                disabled={isSubmitting}
                className="p-2 hover:bg-white/20 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
            {isSubmitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-8"
              >
                <div
                  className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center"
                  style={{ background: ownerGradient }}
                >
                  <CheckCircle className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Merci pour votre evaluation!
                </h3>
                <p className="text-gray-600">
                  Votre avis aide a ameliorer la qualite des prestataires.
                </p>
              </motion.div>
            ) : (
              <>
                {/* Overall Rating */}
                <div className="text-center">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Note globale <span className="text-red-500">*</span>
                  </label>
                  <div className="flex justify-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        onClick={() => setOverallRating(star)}
                        className="focus:outline-none transition-transform hover:scale-110"
                      >
                        <Star
                          className={cn(
                            'w-10 h-10 transition-colors',
                            (hoverRating || overallRating) >= star
                              ? 'text-yellow-400 fill-yellow-400'
                              : 'text-gray-300'
                          )}
                        />
                      </button>
                    ))}
                  </div>
                  <p className="text-sm text-gray-500 mt-2">
                    {overallRating === 0
                      ? 'Cliquez pour noter'
                      : overallRating === 1
                      ? 'Tres insatisfait'
                      : overallRating === 2
                      ? 'Insatisfait'
                      : overallRating === 3
                      ? 'Correct'
                      : overallRating === 4
                      ? 'Satisfait'
                      : 'Tres satisfait'}
                  </p>
                </div>

                {/* Detailed Ratings */}
                <div className="space-y-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Notes detaillees (optionnel)
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    {ratingCategories.map((category) => (
                      <div
                        key={category.key}
                        className="p-3 rounded-xl border border-gray-200 hover:border-purple-200 transition-colors"
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <category.icon className="w-4 h-4 text-gray-500" />
                          <span className="text-sm font-medium text-gray-700">
                            {category.label}
                          </span>
                        </div>
                        <div className="flex gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              onClick={() => handleDetailedRating(category.key, star)}
                              className="focus:outline-none"
                            >
                              <Star
                                className={cn(
                                  'w-5 h-5 transition-colors',
                                  detailedRatings[category.key] >= star
                                    ? 'text-yellow-400 fill-yellow-400'
                                    : 'text-gray-300'
                                )}
                              />
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Would Recommend */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Recommanderiez-vous ce prestataire?
                  </label>
                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={() => setWouldRecommend(true)}
                      className={cn(
                        'flex-1 flex items-center justify-center gap-2 p-3 rounded-xl border-2 transition-all',
                        wouldRecommend === true
                          ? 'border-green-500 bg-green-50 text-green-700'
                          : 'border-gray-200 hover:border-green-300'
                      )}
                    >
                      <ThumbsUp className="w-5 h-5" />
                      <span className="font-medium">Oui</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setWouldRecommend(false)}
                      className={cn(
                        'flex-1 flex items-center justify-center gap-2 p-3 rounded-xl border-2 transition-all',
                        wouldRecommend === false
                          ? 'border-red-500 bg-red-50 text-red-700'
                          : 'border-gray-200 hover:border-red-300'
                      )}
                    >
                      <ThumbsDown className="w-5 h-5" />
                      <span className="font-medium">Non</span>
                    </button>
                  </div>
                </div>

                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Titre de l'evaluation (optionnel)
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Ex: Intervention rapide et efficace"
                    maxLength={100}
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-200 focus:border-purple-400"
                  />
                </div>

                {/* Comment */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Commentaire (optionnel)
                  </label>
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Decrivez votre experience avec ce prestataire..."
                    rows={3}
                    maxLength={500}
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-200 focus:border-purple-400 resize-none"
                  />
                  <p className="text-xs text-gray-500 mt-1 text-right">
                    {comment.length}/500
                  </p>
                </div>
              </>
            )}
          </div>

          {/* Footer */}
          {!isSubmitted && (
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={handleClose}
                disabled={isSubmitting}
                className="rounded-full"
              >
                Annuler
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting || overallRating === 0}
                className="rounded-full text-white"
                style={{ background: ownerGradient }}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Envoi...
                  </>
                ) : (
                  <>
                    <Star className="w-4 h-4 mr-2" />
                    Envoyer l'evaluation
                  </>
                )}
              </Button>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
