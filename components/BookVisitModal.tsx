'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/auth/supabase-client';
import { useVisits, useVisitAvailability, type VisitType } from '@/lib/hooks/use-visits';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  X,
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  Video,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/lib/i18n/use-language';

const t = {
  title: {
    fr: 'Réserver une visite',
    en: 'Book a Visit',
    nl: 'Bezoek Boeken',
    de: 'Besichtigung Buchen',
  },
  visitType: {
    title: {
      fr: 'Type de visite',
      en: 'Visit Type',
      nl: 'Type bezoek',
      de: 'Besichtigungsart',
    },
    inPerson: {
      fr: 'En personne',
      en: 'In Person',
      nl: 'Persoonlijk',
      de: 'Vor Ort',
    },
    inPersonDesc: {
      fr: 'Visiter la propriété',
      en: 'Visit the property',
      nl: 'Bezoek het pand',
      de: 'Immobilie besichtigen',
    },
    virtual: {
      fr: 'Virtuelle',
      en: 'Virtual',
      nl: 'Virtueel',
      de: 'Virtuell',
    },
    virtualDesc: {
      fr: 'Appel vidéo',
      en: 'Video call',
      nl: 'Videogesprek',
      de: 'Videoanruf',
    },
  },
  date: {
    selectDate: {
      fr: 'Sélectionner une date',
      en: 'Select a Date',
      nl: 'Selecteer een datum',
      de: 'Datum auswählen',
    },
    availableSlots: {
      fr: 'Créneaux disponibles',
      en: 'Available Slots',
      nl: 'Beschikbare tijdslots',
      de: 'Verfügbare Termine',
    },
    noSlots: {
      fr: 'Aucun créneau disponible pour cette date',
      en: 'No slots available for this date',
      nl: 'Geen tijdslots beschikbaar voor deze datum',
      de: 'Keine Termine für dieses Datum verfügbar',
    },
    tryAnother: {
      fr: 'Essayez une autre date',
      en: 'Try another date',
      nl: 'Probeer een andere datum',
      de: 'Versuchen Sie ein anderes Datum',
    },
  },
  contact: {
    title: {
      fr: 'Vos coordonnées',
      en: 'Your Contact Info',
      nl: 'Uw contactgegevens',
      de: 'Ihre Kontaktdaten',
    },
    email: {
      fr: 'Email',
      en: 'Email',
      nl: 'E-mail',
      de: 'E-Mail',
    },
    phone: {
      fr: 'Téléphone *',
      en: 'Phone *',
      nl: 'Telefoon *',
      de: 'Telefon *',
    },
    message: {
      fr: 'Message au propriétaire (Optionnel)',
      en: 'Message to Owner (Optional)',
      nl: 'Bericht aan eigenaar (Optioneel)',
      de: 'Nachricht an Eigentümer (Optional)',
    },
    messagePlaceholder: {
      fr: 'Dites pourquoi vous êtes intéressé...',
      en: 'Tell them why you are interested...',
      nl: 'Vertel waarom u geïnteresseerd bent...',
      de: 'Erzählen Sie, warum Sie interessiert sind...',
    },
  },
  summary: {
    title: {
      fr: 'Résumé de la réservation',
      en: 'Booking Summary',
      nl: 'Samenvatting boeking',
      de: 'Buchungsübersicht',
    },
    date: {
      fr: 'Date:',
      en: 'Date:',
      nl: 'Datum:',
      de: 'Datum:',
    },
    time: {
      fr: 'Heure:',
      en: 'Time:',
      nl: 'Tijd:',
      de: 'Uhrzeit:',
    },
    type: {
      fr: 'Type:',
      en: 'Type:',
      nl: 'Type:',
      de: 'Art:',
    },
    inPersonVisit: {
      fr: 'Visite en personne',
      en: 'In-person visit',
      nl: 'Persoonlijk bezoek',
      de: 'Vor-Ort-Besichtigung',
    },
    virtualVisit: {
      fr: 'Visite virtuelle',
      en: 'Virtual visit',
      nl: 'Virtueel bezoek',
      de: 'Virtuelle Besichtigung',
    },
    duration: {
      fr: 'Durée:',
      en: 'Duration:',
      nl: 'Duur:',
      de: 'Dauer:',
    },
    thirtyMinutes: {
      fr: '30 minutes',
      en: '30 minutes',
      nl: '30 minuten',
      de: '30 Minuten',
    },
  },
  buttons: {
    cancel: {
      fr: 'Annuler',
      en: 'Cancel',
      nl: 'Annuleren',
      de: 'Abbrechen',
    },
    booking: {
      fr: 'Réservation...',
      en: 'Booking...',
      nl: 'Boeken...',
      de: 'Buchung...',
    },
    confirm: {
      fr: 'Confirmer la réservation',
      en: 'Confirm Booking',
      nl: 'Bevestig boeking',
      de: 'Buchung bestätigen',
    },
  },
  perMonth: {
    fr: '/mois',
    en: '/month',
    nl: '/maand',
    de: '/Monat',
  },
  toasts: {
    selectDateSlot: {
      fr: 'Veuillez sélectionner une date et un créneau',
      en: 'Please select a date and time slot',
      nl: 'Selecteer een datum en tijdslot',
      de: 'Bitte wählen Sie ein Datum und einen Termin',
    },
    phoneRequired: {
      fr: 'Veuillez fournir votre numéro de téléphone',
      en: 'Please provide your phone number',
      nl: 'Gelieve uw telefoonnummer in te vullen',
      de: 'Bitte geben Sie Ihre Telefonnummer an',
    },
    bookingFailed: {
      fr: 'Échec de la réservation',
      en: 'Booking failed',
      nl: 'Boeking mislukt',
      de: 'Buchung fehlgeschlagen',
    },
  },
};

type Language = 'fr' | 'en' | 'nl' | 'de';

interface BookVisitModalProps {
  property: {
    id: string;
    title: string;
    city: string;
    address?: string;
    monthly_rent: number;
    main_image?: string;
  };
  ownerId: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function BookVisitModal({ property, ownerId, isOpen, onClose }: BookVisitModalProps) {
  const supabase = createClient();
  const { language } = useLanguage();
  const lang = language as Language;
  const { bookVisit } = useVisits();
  const { getAvailableSlots } = useVisitAvailability(property.id);

  const [booking, setBooking] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedSlot, setSelectedSlot] = useState<string>('');
  const [availableSlots, setAvailableSlots] = useState<any[]>([]);
  const [visitType, setVisitType] = useState<VisitType>('in_person');
  const [visitorPhone, setVisitorPhone] = useState('');
  const [visitorNotes, setVisitorNotes] = useState('');
  const [userEmail, setUserEmail] = useState('');

  // Get user email on mount
  useEffect(() => {
    const getUserEmail = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user?.email) {
        setUserEmail(user.email);
      }
    };
    if (isOpen) {
      getUserEmail();
    }
  }, [isOpen]);

  // Fetch available slots when date changes
  useEffect(() => {
    const fetchSlots = async () => {
      if (!selectedDate || !property.id) return;

      const slots = await getAvailableSlots(property.id, selectedDate);
      setAvailableSlots(slots || []);
    };

    fetchSlots();
  }, [selectedDate, property.id]);

  // Get next 14 days for date selection
  const getNextDays = (count: number = 14) => {
    const days = [];
    for (let i = 1; i <= count; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      days.push({
        date: date.toISOString().split('T')[0],
        display: date.toLocaleDateString('fr-FR', {
          weekday: 'short',
          day: 'numeric',
          month: 'short',
        }),
        dayOfWeek: date.getDay(),
      });
    }
    return days;
  };

  const handleBookVisit = async () => {
    if (!selectedDate || !selectedSlot) {
      toast.error(t.toasts.selectDateSlot[lang]);
      return;
    }

    if (!visitorPhone.trim()) {
      toast.error(t.toasts.phoneRequired[lang]);
      return;
    }

    setBooking(true);

    try {
      const result = await bookVisit({
        property_id: property.id,
        owner_id: ownerId,
        scheduled_at: selectedSlot,
        duration_minutes: 30,
        visit_type: visitType,
        visitor_notes: visitorNotes,
        visitor_phone: visitorPhone,
        visitor_email: userEmail,
      });

      if (result) {
        onClose();
        // Reset form
        setSelectedDate('');
        setSelectedSlot('');
        setVisitorPhone('');
        setVisitorNotes('');
      }
    } catch (err: any) {
      toast.error(err.message || t.toasts.bookingFailed[lang]);
    } finally {
      setBooking(false);
    }
  };

  const nextDays = getNextDays();

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="bg-white superellipse-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
        >
          {/* Header */}
          <div className="sticky top-0 bg-white border-b p-6 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{t.title[lang]}</h2>
              <p className="text-gray-600">{property.title}</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="h-6 w-6 text-gray-600" />
            </button>
          </div>

          <div className="p-6 space-y-6">
            {/* Property Info */}
            <div className="flex items-center gap-4 p-4 bg-gray-50 superellipse-xl">
              {property.main_image && (
                <img
                  src={property.main_image}
                  alt={property.title}
                  className="w-20 h-20 rounded-lg object-cover"
                />
              )}
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">{property.title}</h3>
                <div className="flex items-center gap-2 text-gray-600 text-sm">
                  <MapPin className="h-4 w-4" />
                  <span>{property.address ? `${property.address}, ` : ''}{property.city}</span>
                </div>
                <p className="text-searcher-700 font-bold mt-1">€{property.monthly_rent}{t.perMonth[lang]}</p>
              </div>
            </div>

            {/* Visit Type */}
            <div>
              <h3 className="text-lg font-semibold mb-3">{t.visitType.title[lang]}</h3>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => setVisitType('in_person')}
                  className={`p-4 superellipse-xl border-2 transition-all ${
                    visitType === 'in_person'
                      ? 'border-searcher-600 bg-searcher-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <MapPin className="h-6 w-6 mx-auto mb-2 text-searcher-600" />
                  <div className="font-semibold text-gray-900">{t.visitType.inPerson[lang]}</div>
                  <div className="text-xs text-gray-500 mt-1">{t.visitType.inPersonDesc[lang]}</div>
                </button>
                <button
                  onClick={() => setVisitType('virtual')}
                  className={`p-4 superellipse-xl border-2 transition-all ${
                    visitType === 'virtual'
                      ? 'border-searcher-600 bg-searcher-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <Video className="h-6 w-6 mx-auto mb-2 text-searcher-600" />
                  <div className="font-semibold text-gray-900">{t.visitType.virtual[lang]}</div>
                  <div className="text-xs text-gray-500 mt-1">{t.visitType.virtualDesc[lang]}</div>
                </button>
              </div>
            </div>

            {/* Date Selection */}
            <div>
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <CalendarIcon className="h-5 w-5" />
                {t.date.selectDate[lang]}
              </h3>
              <div className="grid grid-cols-7 gap-2">
                {nextDays.map((day) => (
                  <button
                    key={day.date}
                    onClick={() => {
                      setSelectedDate(day.date);
                      setSelectedSlot('');
                    }}
                    className={`p-2 superellipse-xl text-center transition-all ${
                      selectedDate === day.date
                        ? 'bg-searcher-600 text-white shadow-lg'
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                    }`}
                  >
                    <div className="text-xs font-medium">{day.display.split(' ')[0]}</div>
                    <div className="text-lg font-bold mt-1">{day.display.split(' ')[1]}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Time Slots */}
            {selectedDate && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  {t.date.availableSlots[lang]}
                </h3>
                {availableSlots.length === 0 ? (
                  <div className="text-center py-8 text-gray-500 bg-gray-50 superellipse-xl">
                    <AlertCircle className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                    <p>{t.date.noSlots[lang]}</p>
                    <p className="text-sm mt-1">{t.date.tryAnother[lang]}</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-4 gap-2">
                    {availableSlots.map((slot) => (
                      <button
                        key={slot.slot_start}
                        onClick={() => setSelectedSlot(slot.slot_start)}
                        disabled={!slot.is_available}
                        className={`p-3 superellipse-xl text-sm font-medium transition-all ${
                          selectedSlot === slot.slot_start
                            ? 'bg-searcher-600 text-white shadow-lg'
                            : slot.is_available
                            ? 'bg-green-50 text-green-700 hover:bg-green-100 border border-green-200'
                            : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        }`}
                      >
                        {new Date(slot.slot_start).toLocaleTimeString('fr-FR', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </button>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {/* Contact Information */}
            {selectedSlot && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                <h3 className="text-lg font-semibold">{t.contact.title[lang]}</h3>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t.contact.email[lang]}
                  </label>
                  <Input
                    type="email"
                    value={userEmail}
                    onChange={(e) => setUserEmail(e.target.value)}
                    placeholder="votre.email@example.com"
                    className="superellipse-xl"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t.contact.phone[lang]}
                  </label>
                  <Input
                    type="tel"
                    value={visitorPhone}
                    onChange={(e) => setVisitorPhone(e.target.value)}
                    placeholder="+32 123 456 789"
                    className="superellipse-xl"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t.contact.message[lang]}
                  </label>
                  <textarea
                    value={visitorNotes}
                    onChange={(e) => setVisitorNotes(e.target.value)}
                    placeholder={t.contact.messagePlaceholder[lang]}
                    rows={3}
                    maxLength={500}
                    className="w-full px-4 py-3 superellipse-xl border border-gray-200 focus:border-searcher-600 focus:ring-2 focus:ring-searcher-600/20 outline-none transition"
                  />
                </div>
              </motion.div>
            )}

            {/* Summary */}
            {selectedSlot && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-gradient-to-br from-searcher-50 to-blue-50 superellipse-xl p-4 border border-searcher-200"
              >
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-searcher-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">{t.summary.title[lang]}</h4>
                    <div className="space-y-1 text-sm text-gray-700">
                      <p>
                        <strong>{t.summary.date[lang]}</strong>{' '}
                        {new Date(selectedDate).toLocaleDateString(lang === 'en' ? 'en-GB' : lang === 'nl' ? 'nl-BE' : lang === 'de' ? 'de-DE' : 'fr-FR', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </p>
                      <p>
                        <strong>{t.summary.time[lang]}</strong>{' '}
                        {new Date(selectedSlot).toLocaleTimeString(lang === 'en' ? 'en-GB' : lang === 'nl' ? 'nl-BE' : lang === 'de' ? 'de-DE' : 'fr-FR', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                      <p>
                        <strong>{t.summary.type[lang]}</strong>{' '}
                        {visitType === 'in_person' ? t.summary.inPersonVisit[lang] : t.summary.virtualVisit[lang]}
                      </p>
                      <p>
                        <strong>{t.summary.duration[lang]}</strong> {t.summary.thirtyMinutes[lang]}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {/* Footer */}
          <div className="sticky bottom-0 bg-white border-t p-6 flex gap-3">
            <Button
              onClick={onClose}
              variant="outline"
              className="flex-1 superellipse-xl"
              disabled={booking}
            >
              {t.buttons.cancel[lang]}
            </Button>
            <Button
              onClick={handleBookVisit}
              disabled={booking || !selectedSlot || !visitorPhone.trim()}
              className="flex-1 bg-searcher-600 hover:bg-searcher-700 text-white superellipse-xl shadow-lg"
            >
              {booking ? t.buttons.booking[lang] : t.buttons.confirm[lang]}
            </Button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
