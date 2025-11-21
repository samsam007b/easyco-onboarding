'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/auth/supabase-client';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Clock, MapPin, Users, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CalendarEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEventCreated: () => void;
  eventToEdit?: {
    id: string;
    title: string;
    description?: string;
    date: string;
    time: string;
    location?: string;
    attendees: string[];
  } | null;
  propertyId: string;
}

interface PropertyMember {
  user_id: string;
  first_name: string;
  last_name: string;
}

export default function CalendarEventModal({
  isOpen,
  onClose,
  onEventCreated,
  eventToEdit,
  propertyId
}: CalendarEventModalProps) {
  const supabase = createClient();
  const [isLoading, setIsLoading] = useState(false);
  const [propertyMembers, setPropertyMembers] = useState<PropertyMember[]>([]);

  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [location, setLocation] = useState('');
  const [selectedAttendees, setSelectedAttendees] = useState<string[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isOpen) {
      loadPropertyMembers();
      if (eventToEdit) {
        // Populate form with event data
        setTitle(eventToEdit.title);
        setDescription(eventToEdit.description || '');
        setDate(eventToEdit.date);
        setTime(eventToEdit.time);
        setLocation(eventToEdit.location || '');
        setSelectedAttendees(eventToEdit.attendees);
      } else {
        // Reset form
        resetForm();
      }
    }
  }, [isOpen, eventToEdit]);

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setDate('');
    setTime('');
    setLocation('');
    setSelectedAttendees([]);
    setErrors({});
  };

  const loadPropertyMembers = async () => {
    try {
      const { data, error } = await supabase
        .rpc('get_property_members', { p_property_id: propertyId });

      if (error) throw error;
      setPropertyMembers(data || []);
    } catch (error) {
      console.error('Error loading property members:', error);
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!title.trim()) {
      newErrors.title = 'Le titre est requis';
    }
    if (!date) {
      newErrors.date = 'La date est requise';
    }
    if (!time) {
      newErrors.time = 'L\'heure est requise';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    setIsLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Combine date and time
      const startDateTime = new Date(`${date}T${time}`);
      const endDateTime = new Date(startDateTime.getTime() + 60 * 60 * 1000); // +1 hour

      if (eventToEdit) {
        // Update existing event
        const { error: updateError } = await supabase
          .from('calendar_events')
          .update({
            title,
            description: description || null,
            start_time: startDateTime.toISOString(),
            end_time: endDateTime.toISOString(),
            location: location || null,
          })
          .eq('id', eventToEdit.id);

        if (updateError) throw updateError;

        // Update attendees
        // First, delete all existing attendees
        await supabase
          .from('event_attendees')
          .delete()
          .eq('event_id', eventToEdit.id);

        // Then insert new attendees
        if (selectedAttendees.length > 0) {
          const attendeesData = selectedAttendees.map(userId => ({
            event_id: eventToEdit.id,
            user_id: userId
          }));

          await supabase
            .from('event_attendees')
            .insert(attendeesData);
        }
      } else {
        // Create new event
        const { data: newEvent, error: insertError } = await supabase
          .from('calendar_events')
          .insert({
            property_id: propertyId,
            title,
            description: description || null,
            start_time: startDateTime.toISOString(),
            end_time: endDateTime.toISOString(),
            location: location || null,
            created_by: user.id
          })
          .select()
          .single();

        if (insertError) throw insertError;

        // Add attendees
        if (selectedAttendees.length > 0) {
          const attendeesData = selectedAttendees.map(userId => ({
            event_id: newEvent.id,
            user_id: userId
          }));

          await supabase
            .from('event_attendees')
            .insert(attendeesData);
        }
      }

      onEventCreated();
      onClose();
      resetForm();
    } catch (error) {
      console.error('Error saving event:', error);
      alert('Erreur lors de la sauvegarde de l\'événement');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleAttendee = (userId: string) => {
    setSelectedAttendees(prev =>
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
          >
            <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto pointer-events-auto">
              {/* Header */}
              <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-3xl">
                <h2 className="text-2xl font-bold text-gray-900">
                  {eventToEdit ? 'Modifier l\'événement' : 'Nouvel événement'}
                </h2>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Titre de l'événement *
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="ex: Réunion de colocation"
                    className={`w-full px-4 py-3 rounded-xl border ${
                      errors.title ? 'border-red-500' : 'border-gray-300'
                    } focus:outline-none focus:ring-2 focus:ring-orange-500`}
                  />
                  {errors.title && (
                    <p className="text-red-500 text-sm mt-1">{errors.title}</p>
                  )}
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FileText className="w-4 h-4 inline mr-1" />
                    Description
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Ajoutez des détails sur l'événement..."
                    rows={3}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
                  />
                </div>

                {/* Date and Time */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Calendar className="w-4 h-4 inline mr-1" />
                      Date *
                    </label>
                    <input
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className={`w-full px-4 py-3 rounded-xl border ${
                        errors.date ? 'border-red-500' : 'border-gray-300'
                      } focus:outline-none focus:ring-2 focus:ring-orange-500`}
                    />
                    {errors.date && (
                      <p className="text-red-500 text-sm mt-1">{errors.date}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Clock className="w-4 h-4 inline mr-1" />
                      Heure *
                    </label>
                    <input
                      type="time"
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                      className={`w-full px-4 py-3 rounded-xl border ${
                        errors.time ? 'border-red-500' : 'border-gray-300'
                      } focus:outline-none focus:ring-2 focus:ring-orange-500`}
                    />
                    {errors.time && (
                      <p className="text-red-500 text-sm mt-1">{errors.time}</p>
                    )}
                  </div>
                </div>

                {/* Location */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <MapPin className="w-4 h-4 inline mr-1" />
                    Lieu
                  </label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="ex: Salon, cuisine, extérieur..."
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                {/* Attendees */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    <Users className="w-4 h-4 inline mr-1" />
                    Participants
                  </label>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {propertyMembers.map((member) => (
                      <label
                        key={member.user_id}
                        className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors"
                      >
                        <input
                          type="checkbox"
                          checked={selectedAttendees.includes(member.user_id)}
                          onChange={() => toggleAttendee(member.user_id)}
                          className="w-4 h-4 text-orange-600 rounded focus:ring-orange-500"
                        />
                        <span className="text-sm font-medium text-gray-700">
                          {member.first_name} {member.last_name}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    onClick={onClose}
                    variant="outline"
                    className="flex-1 rounded-full"
                    disabled={isLoading}
                  >
                    Annuler
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 rounded-full bg-gradient-to-r from-[#D97B6F] via-[#E8865D] to-[#FF8C4B]"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Enregistrement...' : eventToEdit ? 'Mettre à jour' : 'Créer l\'événement'}
                  </Button>
                </div>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
