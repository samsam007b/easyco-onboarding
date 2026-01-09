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
import { useLanguage } from '@/lib/i18n/use-language';

type Language = 'fr' | 'en' | 'nl' | 'de';

const translations = {
  modal: {
    title: {
      fr: 'Évaluer le prestataire',
      en: 'Rate the vendor',
      nl: 'Beoordeel de leverancier',
      de: 'Dienstleister bewerten',
    },
  },
  categories: {
    quality: {
      label: {
        fr: 'Qualité du travail',
        en: 'Work quality',
        nl: 'Kwaliteit van het werk',
        de: 'Arbeitsqualität',
      },
      description: {
        fr: "Qualité de l'intervention",
        en: 'Quality of the intervention',
        nl: 'Kwaliteit van de interventie',
        de: 'Qualität der Intervention',
      },
    },
    punctuality: {
      label: {
        fr: 'Ponctualité',
        en: 'Punctuality',
        nl: 'Stiptheid',
        de: 'Pünktlichkeit',
      },
      description: {
        fr: 'Respect des horaires',
        en: 'Schedule adherence',
        nl: 'Tijdschema naleven',
        de: 'Einhaltung der Termine',
      },
    },
    price: {
      label: {
        fr: 'Rapport qualité/prix',
        en: 'Value for money',
        nl: 'Prijs-kwaliteitverhouding',
        de: 'Preis-Leistungs-Verhältnis',
      },
      description: {
        fr: 'Prix justifié',
        en: 'Fair pricing',
        nl: 'Eerlijke prijs',
        de: 'Angemessener Preis',
      },
    },
    communication: {
      label: {
        fr: 'Communication',
        en: 'Communication',
        nl: 'Communicatie',
        de: 'Kommunikation',
      },
      description: {
        fr: 'Échanges et suivi',
        en: 'Updates and follow-up',
        nl: 'Updates en opvolging',
        de: 'Updates und Nachverfolgung',
      },
    },
  },
  labels: {
    overallRating: {
      fr: 'Note globale',
      en: 'Overall rating',
      nl: 'Algemene beoordeling',
      de: 'Gesamtbewertung',
    },
    detailedRatings: {
      fr: 'Notes détaillées (optionnel)',
      en: 'Detailed ratings (optional)',
      nl: 'Gedetailleerde beoordelingen (optioneel)',
      de: 'Detaillierte Bewertungen (optional)',
    },
    wouldRecommend: {
      fr: 'Recommanderiez-vous ce prestataire?',
      en: 'Would you recommend this vendor?',
      nl: 'Zou u deze leverancier aanbevelen?',
      de: 'Würden Sie diesen Dienstleister empfehlen?',
    },
    title: {
      fr: "Titre de l'évaluation (optionnel)",
      en: 'Review title (optional)',
      nl: 'Titel van de beoordeling (optioneel)',
      de: 'Bewertungstitel (optional)',
    },
    titlePlaceholder: {
      fr: 'Ex: Intervention rapide et efficace',
      en: 'Ex: Fast and efficient service',
      nl: 'Bijv: Snelle en efficiënte service',
      de: 'Z.B.: Schneller und effizienter Service',
    },
    comment: {
      fr: 'Commentaire (optionnel)',
      en: 'Comment (optional)',
      nl: 'Opmerking (optioneel)',
      de: 'Kommentar (optional)',
    },
    commentPlaceholder: {
      fr: 'Décrivez votre expérience avec ce prestataire...',
      en: 'Describe your experience with this vendor...',
      nl: 'Beschrijf uw ervaring met deze leverancier...',
      de: 'Beschreiben Sie Ihre Erfahrung mit diesem Dienstleister...',
    },
  },
  ratings: {
    clickToRate: {
      fr: 'Cliquez pour noter',
      en: 'Click to rate',
      nl: 'Klik om te beoordelen',
      de: 'Klicken zum Bewerten',
    },
    veryDissatisfied: {
      fr: 'Très insatisfait',
      en: 'Very dissatisfied',
      nl: 'Zeer ontevreden',
      de: 'Sehr unzufrieden',
    },
    dissatisfied: {
      fr: 'Insatisfait',
      en: 'Dissatisfied',
      nl: 'Ontevreden',
      de: 'Unzufrieden',
    },
    neutral: {
      fr: 'Correct',
      en: 'Neutral',
      nl: 'Neutraal',
      de: 'Neutral',
    },
    satisfied: {
      fr: 'Satisfait',
      en: 'Satisfied',
      nl: 'Tevreden',
      de: 'Zufrieden',
    },
    verySatisfied: {
      fr: 'Très satisfait',
      en: 'Very satisfied',
      nl: 'Zeer tevreden',
      de: 'Sehr zufrieden',
    },
  },
  buttons: {
    yes: { fr: 'Oui', en: 'Yes', nl: 'Ja', de: 'Ja' },
    no: { fr: 'Non', en: 'No', nl: 'Nee', de: 'Nein' },
    cancel: { fr: 'Annuler', en: 'Cancel', nl: 'Annuleren', de: 'Abbrechen' },
    submit: { fr: "Envoyer l'évaluation", en: 'Submit review', nl: 'Beoordeling versturen', de: 'Bewertung senden' },
    submitting: { fr: 'Envoi...', en: 'Sending...', nl: 'Verzenden...', de: 'Senden...' },
  },
  success: {
    title: {
      fr: 'Merci pour votre évaluation!',
      en: 'Thank you for your review!',
      nl: 'Bedankt voor uw beoordeling!',
      de: 'Vielen Dank für Ihre Bewertung!',
    },
    message: {
      fr: 'Votre avis aide à améliorer la qualité des prestataires.',
      en: 'Your feedback helps improve vendor quality.',
      nl: 'Uw feedback helpt de kwaliteit van leveranciers te verbeteren.',
      de: 'Ihr Feedback hilft, die Qualität der Dienstleister zu verbessern.',
    },
  },
  toasts: {
    ratingRequired: {
      fr: 'Veuillez donner une note globale',
      en: 'Please provide an overall rating',
      nl: 'Geef een algemene beoordeling',
      de: 'Bitte geben Sie eine Gesamtbewertung ab',
    },
    loginRequired: {
      fr: 'Vous devez être connecté',
      en: 'You must be logged in',
      nl: 'U moet ingelogd zijn',
      de: 'Sie müssen angemeldet sein',
    },
    success: {
      fr: 'Évaluation enregistrée',
      en: 'Review submitted',
      nl: 'Beoordeling verzonden',
      de: 'Bewertung gesendet',
    },
    error: {
      fr: "Erreur lors de l'enregistrement",
      en: 'Error saving review',
      nl: 'Fout bij opslaan beoordeling',
      de: 'Fehler beim Speichern der Bewertung',
    },
  },
};

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
  icon: React.ElementType;
}

const ratingCategories: RatingCategory[] = [
  { key: 'quality', icon: Wrench },
  { key: 'punctuality', icon: Clock },
  { key: 'price', icon: DollarSign },
  { key: 'communication', icon: MessageSquare },
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
  const { language } = useLanguage();
  const lang = language as Language;
  const t = translations;

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
      toast.error(t.toasts.ratingRequired[lang]);
      return;
    }

    setIsSubmitting(true);

    try {
      const {
        data: { user },
      } = await (await import('@/lib/auth/supabase-client')).createClient().auth.getUser();

      if (!user) {
        toast.error(t.toasts.loginRequired[lang]);
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
        toast.success(t.toasts.success[lang]);
        setTimeout(() => {
          onRatingSubmitted?.();
          onClose();
        }, 1500);
      } else {
        toast.error(t.toasts.error[lang]);
      }
    } catch (error) {
      console.error('Error submitting rating:', error);
      toast.error(t.toasts.error[lang]);
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
          className="relative z-10 w-full max-w-lg mx-4 bg-white superellipse-2xl shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div
            className="px-6 py-4 text-white"
            style={{ background: ownerGradient }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 superellipse-xl bg-white/20 flex items-center justify-center">
                  <Star className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="font-bold text-lg">{t.modal.title[lang]}</h2>
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
                  {t.success.title[lang]}
                </h3>
                <p className="text-gray-600">
                  {t.success.message[lang]}
                </p>
              </motion.div>
            ) : (
              <>
                {/* Overall Rating */}
                <div className="text-center">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    {t.labels.overallRating[lang]} <span className="text-red-500">*</span>
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
                      ? t.ratings.clickToRate[lang]
                      : overallRating === 1
                      ? t.ratings.veryDissatisfied[lang]
                      : overallRating === 2
                      ? t.ratings.dissatisfied[lang]
                      : overallRating === 3
                      ? t.ratings.neutral[lang]
                      : overallRating === 4
                      ? t.ratings.satisfied[lang]
                      : t.ratings.verySatisfied[lang]}
                  </p>
                </div>

                {/* Detailed Ratings */}
                <div className="space-y-4">
                  <label className="block text-sm font-medium text-gray-700">
                    {t.labels.detailedRatings[lang]}
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    {ratingCategories.map((category) => (
                      <div
                        key={category.key}
                        className="p-3 superellipse-xl border border-gray-200 hover:border-owner-200 transition-colors"
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <category.icon className="w-4 h-4 text-gray-500" />
                          <span className="text-sm font-medium text-gray-700">
                            {t.categories[category.key].label[lang]}
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
                    {t.labels.wouldRecommend[lang]}
                  </label>
                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={() => setWouldRecommend(true)}
                      className={cn(
                        'flex-1 flex items-center justify-center gap-2 p-3 superellipse-xl border-2 transition-all',
                        wouldRecommend === true
                          ? 'border-green-500 bg-green-50 text-green-700'
                          : 'border-gray-200 hover:border-green-300'
                      )}
                    >
                      <ThumbsUp className="w-5 h-5" />
                      <span className="font-medium">{t.buttons.yes[lang]}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setWouldRecommend(false)}
                      className={cn(
                        'flex-1 flex items-center justify-center gap-2 p-3 superellipse-xl border-2 transition-all',
                        wouldRecommend === false
                          ? 'border-red-500 bg-red-50 text-red-700'
                          : 'border-gray-200 hover:border-red-300'
                      )}
                    >
                      <ThumbsDown className="w-5 h-5" />
                      <span className="font-medium">{t.buttons.no[lang]}</span>
                    </button>
                  </div>
                </div>

                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t.labels.title[lang]}
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder={t.labels.titlePlaceholder[lang]}
                    maxLength={100}
                    className="w-full px-4 py-2 border border-gray-200 superellipse-xl focus:outline-none focus:ring-2 focus:ring-owner-200 focus:border-owner-400"
                  />
                </div>

                {/* Comment */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t.labels.comment[lang]}
                  </label>
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder={t.labels.commentPlaceholder[lang]}
                    rows={3}
                    maxLength={500}
                    className="w-full px-4 py-2 border border-gray-200 superellipse-xl focus:outline-none focus:ring-2 focus:ring-owner-200 focus:border-owner-400 resize-none"
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
                {t.buttons.cancel[lang]}
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
                    {t.buttons.submitting[lang]}
                  </>
                ) : (
                  <>
                    <Star className="w-4 h-4 mr-2" />
                    {t.buttons.submit[lang]}
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
