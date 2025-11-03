'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar, Clock, Users, MessageSquare, Video, MapPin } from 'lucide-react';
import { VirtualToursService } from '@/lib/services/virtual-tours-service';
import { ScheduleTourInput } from '@/types/virtual-tours.types';
import { createClient } from '@/lib/auth/supabase-client';
import { toast } from 'sonner';

interface ScheduleTourModalProps {
  isOpen: boolean;
  onClose: () => void;
  propertyId: string;
  propertyTitle: string;
  hasVirtualTour: boolean;
}

export default function ScheduleTourModal({
  isOpen,
  onClose,
  propertyId,
  propertyTitle,
  hasVirtualTour,
}: ScheduleTourModalProps) {
  const [tourType, setTourType] = useState<'virtual' | 'physical'>(
    hasVirtualTour ? 'virtual' : 'physical'
  );
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [attendees, setAttendees] = useState(1);
  const [notes, setNotes] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const supabase = createClient();
  const virtualToursService = new VirtualToursService(supabase);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Combine date and time
      const scheduledFor = new Date(`${selectedDate}T${selectedTime}`);

      const tourInput: ScheduleTourInput = {
        property_id: propertyId,
        tour_type: tourType,
        scheduled_at: scheduledFor.toISOString(),
        attendees_count: attendees,
        user_notes: notes || undefined,
      };

      await virtualToursService.scheduleTour(tourInput);

      toast.success(
        tourType === 'virtual'
          ? 'Visite virtuelle planifiée avec succès !'
          : 'Visite physique planifiée avec succès !',
        {
          description: `Nous vous enverrons un rappel avant votre visite du ${new Date(scheduledFor).toLocaleDateString('fr-FR')}.`,
        }
      );

      onClose();
      resetForm();
    } catch (error) {
      console.error('Error scheduling tour:', error);
      toast.error('Erreur lors de la planification', {
        description: 'Veuillez réessayer plus tard.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setTourType(hasVirtualTour ? 'virtual' : 'physical');
    setSelectedDate('');
    setSelectedTime('');
    setAttendees(1);
    setNotes('');
  };

  // Get minimum date (today)
  const today = new Date().toISOString().split('T')[0];

  // Get maximum date (3 months from now)
  const maxDate = new Date();
  maxDate.setMonth(maxDate.getMonth() + 3);
  const maxDateString = maxDate.toISOString().split('T')[0];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-xl">Planifier une visite</DialogTitle>
          <p className="text-sm text-gray-600 mt-2">{propertyTitle}</p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 mt-4">
          {/* Tour Type Selection */}
          <div className="space-y-2">
            <Label>Type de visite</Label>
            <div className="grid grid-cols-2 gap-3">
              {hasVirtualTour && (
                <button
                  type="button"
                  onClick={() => setTourType('virtual')}
                  className={`p-4 border-2 rounded-lg transition-all ${
                    tourType === 'virtual'
                      ? 'border-purple-600 bg-purple-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <Video
                    className={`w-6 h-6 mx-auto mb-2 ${
                      tourType === 'virtual' ? 'text-purple-600' : 'text-gray-400'
                    }`}
                  />
                  <p className="font-semibold text-sm">Visite virtuelle</p>
                  <p className="text-xs text-gray-600 mt-1">360° en ligne</p>
                </button>
              )}

              <button
                type="button"
                onClick={() => setTourType('physical')}
                className={`p-4 border-2 rounded-lg transition-all ${
                  tourType === 'physical'
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <MapPin
                  className={`w-6 h-6 mx-auto mb-2 ${
                    tourType === 'physical' ? 'text-blue-600' : 'text-gray-400'
                  }`}
                />
                <p className="font-semibold text-sm">Visite physique</p>
                <p className="text-xs text-gray-600 mt-1">Sur place</p>
              </button>
            </div>
          </div>

          {/* Date Selection */}
          <div className="space-y-2">
            <Label htmlFor="date" className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Date
            </Label>
            <Input
              id="date"
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              min={today}
              max={maxDateString}
              required
            />
          </div>

          {/* Time Selection */}
          <div className="space-y-2">
            <Label htmlFor="time" className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Heure
            </Label>
            <Input
              id="time"
              type="time"
              value={selectedTime}
              onChange={(e) => setSelectedTime(e.target.value)}
              required
            />
          </div>

          {/* Attendees Count */}
          <div className="space-y-2">
            <Label htmlFor="attendees" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Nombre de participants
            </Label>
            <Input
              id="attendees"
              type="number"
              value={attendees}
              onChange={(e) => setAttendees(Number(e.target.value))}
              min={1}
              max={10}
              required
            />
            <p className="text-xs text-gray-500">Maximum 10 personnes</p>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes" className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              Notes ou questions (optionnel)
            </Label>
            <textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              placeholder="Questions spécifiques, contraintes horaires, etc."
            />
          </div>

          {/* Info Banner */}
          <div
            className={`rounded-lg p-3 ${
              tourType === 'virtual' ? 'bg-purple-50' : 'bg-blue-50'
            }`}
          >
            <p className="text-xs text-gray-700">
              {tourType === 'virtual' ? (
                <>
                  <strong>Visite virtuelle :</strong> Vous recevrez un email avec le lien de
                  connexion 15 minutes avant l'heure prévue.
                </>
              ) : (
                <>
                  <strong>Visite physique :</strong> L'adresse exacte vous sera communiquée par
                  email après confirmation du propriétaire.
                </>
              )}
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
              disabled={isLoading}
            >
              Annuler
            </Button>
            <Button
              type="submit"
              className={`flex-1 ${
                tourType === 'virtual'
                  ? 'bg-purple-600 hover:bg-purple-700'
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
              disabled={isLoading}
            >
              {isLoading ? 'Planification...' : 'Confirmer'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
