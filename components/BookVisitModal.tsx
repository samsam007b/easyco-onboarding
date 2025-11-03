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
      toast.error('Veuillez sélectionner une date et un créneau');
      return;
    }

    if (!visitorPhone.trim()) {
      toast.error('Veuillez fournir votre numéro de téléphone');
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
      toast.error(err.message || 'Échec de la réservation');
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
          className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
        >
          {/* Header */}
          <div className="sticky top-0 bg-white border-b p-6 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Réserver une visite</h2>
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
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
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
                <p className="text-purple-700 font-bold mt-1">€{property.monthly_rent}/mois</p>
              </div>
            </div>

            {/* Visit Type */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Type de visite</h3>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => setVisitType('in_person')}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    visitType === 'in_person'
                      ? 'border-purple-600 bg-purple-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <MapPin className="h-6 w-6 mx-auto mb-2 text-purple-600" />
                  <div className="font-semibold text-gray-900">En personne</div>
                  <div className="text-xs text-gray-500 mt-1">Visiter la propriété</div>
                </button>
                <button
                  onClick={() => setVisitType('virtual')}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    visitType === 'virtual'
                      ? 'border-purple-600 bg-purple-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <Video className="h-6 w-6 mx-auto mb-2 text-purple-600" />
                  <div className="font-semibold text-gray-900">Virtuelle</div>
                  <div className="text-xs text-gray-500 mt-1">Appel vidéo</div>
                </button>
              </div>
            </div>

            {/* Date Selection */}
            <div>
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <CalendarIcon className="h-5 w-5" />
                Sélectionner une date
              </h3>
              <div className="grid grid-cols-7 gap-2">
                {nextDays.map((day) => (
                  <button
                    key={day.date}
                    onClick={() => {
                      setSelectedDate(day.date);
                      setSelectedSlot('');
                    }}
                    className={`p-2 rounded-xl text-center transition-all ${
                      selectedDate === day.date
                        ? 'bg-purple-600 text-white shadow-lg'
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
                  Créneaux disponibles
                </h3>
                {availableSlots.length === 0 ? (
                  <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-xl">
                    <AlertCircle className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                    <p>Aucun créneau disponible pour cette date</p>
                    <p className="text-sm mt-1">Essayez une autre date</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-4 gap-2">
                    {availableSlots.map((slot) => (
                      <button
                        key={slot.slot_start}
                        onClick={() => setSelectedSlot(slot.slot_start)}
                        disabled={!slot.is_available}
                        className={`p-3 rounded-xl text-sm font-medium transition-all ${
                          selectedSlot === slot.slot_start
                            ? 'bg-purple-600 text-white shadow-lg'
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
                <h3 className="text-lg font-semibold">Vos coordonnées</h3>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <Input
                    type="email"
                    value={userEmail}
                    onChange={(e) => setUserEmail(e.target.value)}
                    placeholder="votre.email@example.com"
                    className="rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Téléphone *
                  </label>
                  <Input
                    type="tel"
                    value={visitorPhone}
                    onChange={(e) => setVisitorPhone(e.target.value)}
                    placeholder="+32 123 456 789"
                    className="rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message au propriétaire (Optionnel)
                  </label>
                  <textarea
                    value={visitorNotes}
                    onChange={(e) => setVisitorNotes(e.target.value)}
                    placeholder="Dites pourquoi vous êtes intéressé..."
                    rows={3}
                    maxLength={500}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-purple-600 focus:ring-2 focus:ring-purple-600/20 outline-none transition"
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
                className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl p-4 border border-purple-200"
              >
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-purple-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Résumé de la réservation</h4>
                    <div className="space-y-1 text-sm text-gray-700">
                      <p>
                        <strong>Date:</strong>{' '}
                        {new Date(selectedDate).toLocaleDateString('fr-FR', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </p>
                      <p>
                        <strong>Heure:</strong>{' '}
                        {new Date(selectedSlot).toLocaleTimeString('fr-FR', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                      <p>
                        <strong>Type:</strong>{' '}
                        {visitType === 'in_person' ? 'Visite en personne' : 'Visite virtuelle'}
                      </p>
                      <p>
                        <strong>Durée:</strong> 30 minutes
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
              className="flex-1 rounded-xl"
              disabled={booking}
            >
              Annuler
            </Button>
            <Button
              onClick={handleBookVisit}
              disabled={booking || !selectedSlot || !visitorPhone.trim()}
              className="flex-1 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white rounded-xl shadow-lg"
            >
              {booking ? 'Réservation...' : 'Confirmer la réservation'}
            </Button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
