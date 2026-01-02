'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/auth/supabase-client';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Clock, MapPin, Users, FileText, Sparkles, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';

// V3 Option C - Official Resident Palette
const RESIDENT_GRADIENT = 'linear-gradient(135deg, #e05747 0%, #ff651e 50%, #ff9014 100%)';
const RESIDENT_PRIMARY = '#ff651e';
const CARD_BG_GRADIENT = 'linear-gradient(135deg, #FFF5F0 0%, #FFEDE5 100%)';
const ACCENT_SHADOW = 'rgba(255, 101, 30, 0.25)';

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
      // Get property members
      const { data: membersData, error: membersError } = await supabase
        .from('property_members')
        .select('user_id')
        .eq('property_id', propertyId)
        .eq('status', 'active');

      if (membersError) throw membersError;

      // Get user profiles for members
      const memberUserIds = membersData?.map(m => m.user_id) || [];
      if (memberUserIds.length === 0) {
        setPropertyMembers([]);
        return;
      }

      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('id, first_name, last_name')
        .in('id', memberUserIds);

      if (profilesError) throw profilesError;

      const members = profilesData?.map(profile => ({
        user_id: profile.id,
        first_name: profile.first_name,
        last_name: profile.last_name
      })) || [];

      setPropertyMembers(members);
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
            <div
              className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-hidden pointer-events-auto relative border-2 border-orange-100"
              style={{
                boxShadow: `0 25px 80px ${ACCENT_SHADOW}`,
              }}
            >
              {/* Decorative gradient circles - positioned inside but clipped */}
              <div
                className="absolute right-0 top-0 w-32 h-32 rounded-full opacity-10 pointer-events-none"
                style={{ background: RESIDENT_GRADIENT, transform: 'translate(30%, -30%)' }}
              />
              <div
                className="absolute left-0 bottom-0 w-24 h-24 rounded-full opacity-8 pointer-events-none"
                style={{ background: 'linear-gradient(135deg, #ff9014 0%, #ff651e 100%)', transform: 'translate(-30%, 30%)' }}
              />

              {/* Scrollable content wrapper */}
              <div className="max-h-[90vh] overflow-y-auto relative">
                {/* Header - sticky with solid background */}
                <div
                  className="sticky top-0 border-b-2 border-orange-100 px-6 py-5 flex items-center justify-between z-30"
                  style={{ background: '#FFF5F0' }}
                >
                <div className="flex items-center gap-4">
                  <motion.div
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="w-12 h-12 rounded-xl flex items-center justify-center"
                    style={{ background: RESIDENT_GRADIENT }}
                  >
                    <Calendar className="w-6 h-6 text-white" />
                  </motion.div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">
                      {eventToEdit ? 'Modifier l\'événement' : 'Nouvel événement'}
                    </h2>
                    <p className="text-sm text-gray-500 flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5" style={{ color: RESIDENT_PRIMARY }} />
                      Planifie un moment avec ta coloc
                    </p>
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onClose}
                  className="p-2.5 rounded-xl transition-colors"
                  style={{ background: 'rgba(255, 101, 30, 0.1)' }}
                >
                  <X className="w-5 h-5" style={{ color: RESIDENT_PRIMARY }} />
                </motion.button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="p-6 space-y-6 relative z-10">
                {/* Title */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    <div
                      className="w-6 h-6 rounded-lg flex items-center justify-center"
                      style={{ background: `${RESIDENT_PRIMARY}15` }}
                    >
                      <Calendar className="w-3.5 h-3.5" style={{ color: RESIDENT_PRIMARY }} />
                    </div>
                    Titre de l'événement *
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="ex: Réunion de colocation"
                    className={`w-full px-4 py-3.5 rounded-2xl border-2 transition-all ${
                      errors.title ? 'border-red-400 bg-red-50' : 'border-gray-200 hover:border-orange-200'
                    } focus:outline-none focus:border-orange-400 focus:bg-orange-50/30`}
                  />
                  {errors.title && (
                    <p className="text-red-500 text-sm mt-1.5 font-medium">{errors.title}</p>
                  )}
                </div>

                {/* Description */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    <div
                      className="w-6 h-6 rounded-lg flex items-center justify-center"
                      style={{ background: `${RESIDENT_PRIMARY}15` }}
                    >
                      <FileText className="w-3.5 h-3.5" style={{ color: RESIDENT_PRIMARY }} />
                    </div>
                    Description
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Ajoutez des détails sur l'événement..."
                    rows={3}
                    className="w-full px-4 py-3.5 rounded-2xl border-2 border-gray-200 hover:border-orange-200 focus:outline-none focus:border-orange-400 focus:bg-orange-50/30 resize-none transition-all"
                  />
                </div>

                {/* Date and Time */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                      <div
                        className="w-6 h-6 rounded-lg flex items-center justify-center"
                        style={{ background: '#10b98115' }}
                      >
                        <Calendar className="w-3.5 h-3.5" style={{ color: '#10b981' }} />
                      </div>
                      Date *
                    </label>
                    <input
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className={`w-full px-4 py-3.5 rounded-2xl border-2 transition-all ${
                        errors.date ? 'border-red-400 bg-red-50' : 'border-gray-200 hover:border-orange-200'
                      } focus:outline-none focus:border-orange-400 focus:bg-orange-50/30`}
                    />
                    {errors.date && (
                      <p className="text-red-500 text-sm mt-1.5 font-medium">{errors.date}</p>
                    )}
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                      <div
                        className="w-6 h-6 rounded-lg flex items-center justify-center"
                        style={{ background: '#8b5cf615' }}
                      >
                        <Clock className="w-3.5 h-3.5" style={{ color: '#8b5cf6' }} />
                      </div>
                      Heure *
                    </label>
                    <input
                      type="time"
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                      className={`w-full px-4 py-3.5 rounded-2xl border-2 transition-all ${
                        errors.time ? 'border-red-400 bg-red-50' : 'border-gray-200 hover:border-orange-200'
                      } focus:outline-none focus:border-orange-400 focus:bg-orange-50/30`}
                    />
                    {errors.time && (
                      <p className="text-red-500 text-sm mt-1.5 font-medium">{errors.time}</p>
                    )}
                  </div>
                </div>

                {/* Location */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    <div
                      className="w-6 h-6 rounded-lg flex items-center justify-center"
                      style={{ background: '#3b82f615' }}
                    >
                      <MapPin className="w-3.5 h-3.5" style={{ color: '#3b82f6' }} />
                    </div>
                    Lieu
                  </label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="ex: Salon, cuisine, extérieur..."
                    className="w-full px-4 py-3.5 rounded-2xl border-2 border-gray-200 hover:border-orange-200 focus:outline-none focus:border-orange-400 focus:bg-orange-50/30 transition-all"
                  />
                </div>

                {/* Attendees */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                    <div
                      className="w-6 h-6 rounded-lg flex items-center justify-center"
                      style={{ background: '#ec489915' }}
                    >
                      <Users className="w-3.5 h-3.5" style={{ color: '#ec4899' }} />
                    </div>
                    Participants
                  </label>
                  <div
                    className="space-y-2 max-h-40 overflow-y-auto rounded-2xl border-2 border-gray-200 p-3"
                    style={{ background: 'rgba(255, 255, 255, 0.8)' }}
                  >
                    {propertyMembers.length === 0 ? (
                      <p className="text-sm text-gray-500 text-center py-2">Aucun membre disponible</p>
                    ) : (
                      propertyMembers.map((member) => (
                        <motion.label
                          key={member.user_id}
                          whileHover={{ scale: 1.01 }}
                          whileTap={{ scale: 0.99 }}
                          className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all ${
                            selectedAttendees.includes(member.user_id)
                              ? 'bg-orange-50 border-2 border-orange-200'
                              : 'hover:bg-gray-50 border-2 border-transparent'
                          }`}
                        >
                          <div
                            className={`w-5 h-5 rounded-lg flex items-center justify-center transition-all ${
                              selectedAttendees.includes(member.user_id)
                                ? ''
                                : 'border-2 border-gray-300'
                            }`}
                            style={
                              selectedAttendees.includes(member.user_id)
                                ? { background: RESIDENT_GRADIENT }
                                : {}
                            }
                          >
                            {selectedAttendees.includes(member.user_id) && (
                              <Check className="w-3 h-3 text-white" />
                            )}
                          </div>
                          <input
                            type="checkbox"
                            checked={selectedAttendees.includes(member.user_id)}
                            onChange={() => toggleAttendee(member.user_id)}
                            className="hidden"
                          />
                          <span className="text-sm font-medium text-gray-700">
                            {member.first_name} {member.last_name}
                          </span>
                        </motion.label>
                      ))
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-4">
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="flex-1">
                    <Button
                      type="button"
                      onClick={onClose}
                      variant="outline"
                      className="w-full rounded-2xl py-6 font-semibold border-2 transition-all"
                      style={{
                        borderColor: `${RESIDENT_PRIMARY}30`,
                        color: RESIDENT_PRIMARY,
                      }}
                      disabled={isLoading}
                    >
                      Annuler
                    </Button>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="flex-1">
                    <Button
                      type="submit"
                      className="w-full rounded-2xl py-6 font-bold text-white border-none"
                      style={{
                        background: RESIDENT_GRADIENT,
                        boxShadow: `0 12px 32px ${ACCENT_SHADOW}`,
                      }}
                      disabled={isLoading}
                    >
                      {isLoading ? 'Enregistrement...' : eventToEdit ? 'Mettre à jour' : 'Créer l\'événement'}
                    </Button>
                  </motion.div>
                </div>
              </form>
              </div>{/* End scrollable content wrapper */}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
