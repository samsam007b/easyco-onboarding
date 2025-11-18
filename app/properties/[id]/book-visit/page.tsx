'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { createClient } from '@/lib/auth/supabase-client';
import { useVisits, useVisitAvailability, type VisitType } from '@/lib/hooks/use-visits';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  ArrowLeft,
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  Video,
  User,
  Phone,
  Mail,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function BookVisitPage() {
  const router = useRouter();
  const params = useParams();
  const propertyId = params?.id as string;
  const supabase = createClient();

  const { bookVisit } = useVisits();
  const { getAvailableSlots } = useVisitAvailability(propertyId);

  const [property, setProperty] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);

  // Form state
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedSlot, setSelectedSlot] = useState<string>('');
  const [availableSlots, setAvailableSlots] = useState<any[]>([]);
  const [visitType, setVisitType] = useState<VisitType>('in_person');
  const [visitorPhone, setVisitorPhone] = useState('');
  const [visitorNotes, setVisitorNotes] = useState('');
  const [userEmail, setUserEmail] = useState('');

  // Fetch property details
  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const { data, error } = await supabase
          .from('properties')
          .select(`
            *,
            owner:users!properties_owner_id_fkey(id, full_name, email)
          `)
          .eq('id', propertyId)
          .single();

        if (error) throw error;
        setProperty(data);

        // Get user email
        const { data: { user } } = await supabase.auth.getUser();
        if (user?.email) {
          setUserEmail(user.email);
        }
      } catch (err: any) {
        toast.error('Failed to load property');
        router.push('/properties/browse');
      } finally {
        setLoading(false);
      }
    };

    if (propertyId) {
      fetchProperty();
    }
  }, [propertyId]);

  // Fetch available slots when date changes
  useEffect(() => {
    const fetchSlots = async () => {
      if (!selectedDate || !propertyId) return;

      const slots = await getAvailableSlots(propertyId, selectedDate);
      setAvailableSlots(slots || []);
    };

    fetchSlots();
  }, [selectedDate, propertyId]);

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
      toast.error('Please select a date and time slot');
      return;
    }

    if (!visitorPhone.trim()) {
      toast.error('Please provide your phone number');
      return;
    }

    if (!property?.owner?.id) {
      toast.error('Property owner information is missing');
      return;
    }

    setBooking(true);

    try {
      const result = await bookVisit({
        property_id: propertyId,
        owner_id: property.owner.id,
        scheduled_at: selectedSlot,
        duration_minutes: 30,
        visit_type: visitType,
        visitor_notes: visitorNotes,
        visitor_phone: visitorPhone,
        visitor_email: userEmail,
      });

      if (result) {
        router.push('/dashboard/searcher/my-visits');
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to book visit');
    } finally {
      setBooking(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-yellow-50 flex items-center justify-center">
        <div className="text-center">
          <LoadingHouse size={48} />
          <p className="text-gray-600">Loading property...</p>
        </div>
      </div>
    );
  }

  if (!property) {
    return null;
  }

  const nextDays = getNextDays();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-yellow-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="icon"
              onClick={() => router.back()}
              className="rounded-full"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Book a Visit</h1>
              <p className="text-gray-600">{property.title}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left: Property Info */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="rounded-2xl shadow-lg overflow-hidden">
              {property.main_image_url && (
                <img
                  src={property.main_image_url}
                  alt={property.title}
                  className="w-full h-48 object-cover"
                />
              )}
              <CardContent className="p-6">
                <h2 className="text-xl font-bold mb-2">{property.title}</h2>
                <div className="flex items-center gap-2 text-gray-600 mb-4">
                  <MapPin className="h-4 w-4" />
                  <span className="text-sm">
                    {property.address}, {property.city}
                  </span>
                </div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-2xl font-bold text-purple-700">
                    €{property.monthly_rent}
                    <span className="text-sm text-gray-500">/mois</span>
                  </span>
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <User className="h-4 w-4" />
                  <span className="text-sm">Hosted by {property.owner.full_name}</span>
                </div>
              </CardContent>
            </Card>

            {/* Info Card */}
            <Card className="rounded-2xl shadow-lg bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200">
              <CardContent className="p-6">
                <div className="flex gap-3">
                  <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-gray-700">
                    <p className="font-medium mb-2">Before you book:</p>
                    <ul className="space-y-1 text-gray-600">
                      <li>• Choose a convenient time slot</li>
                      <li>• Provide accurate contact information</li>
                      <li>• The owner will confirm within 24 hours</li>
                      <li>• You'll receive confirmation by email</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right: Booking Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Visit Type */}
            <Card className="rounded-2xl shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Video className="h-5 w-5 text-purple-700" />
                  Visit Type
                </CardTitle>
              </CardHeader>
              <CardContent>
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
                    <div className="font-semibold text-gray-900">In Person</div>
                    <div className="text-xs text-gray-500 mt-1">Visit the property</div>
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
                    <div className="font-semibold text-gray-900">Virtual Tour</div>
                    <div className="text-xs text-gray-500 mt-1">Video call</div>
                  </button>
                </div>
              </CardContent>
            </Card>

            {/* Date Selection */}
            <Card className="rounded-2xl shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CalendarIcon className="h-5 w-5 text-purple-700" />
                  Select a Date
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-7 gap-2">
                  {nextDays.map((day) => (
                    <button
                      key={day.date}
                      onClick={() => {
                        setSelectedDate(day.date);
                        setSelectedSlot('');
                      }}
                      className={`p-3 rounded-xl text-center transition-all ${
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
              </CardContent>
            </Card>

            {/* Time Slots */}
            {selectedDate && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="rounded-2xl shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Clock className="h-5 w-5 text-purple-700" />
                      Available Time Slots
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {availableSlots.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        <AlertCircle className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                        <p>No available slots for this date</p>
                        <p className="text-sm mt-1">Please try another date</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
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
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Contact Information */}
            {selectedSlot && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="rounded-2xl shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Phone className="h-5 w-5 text-purple-700" />
                      Your Contact Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address
                      </label>
                      <Input
                        type="email"
                        value={userEmail}
                        onChange={(e) => setUserEmail(e.target.value)}
                        placeholder="your.email@example.com"
                        className="rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number *
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
                        Message to Owner (Optional)
                      </label>
                      <textarea
                        value={visitorNotes}
                        onChange={(e) => setVisitorNotes(e.target.value)}
                        placeholder="Tell the owner why you're interested..."
                        rows={3}
                        maxLength={500}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-purple-600 focus:ring-2 focus:ring-purple-600/20 outline-none transition"
                      />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Summary & Book Button */}
            {selectedSlot && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="rounded-2xl shadow-lg bg-gradient-to-br from-purple-50 to-blue-50 border-purple-200">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-3 mb-4">
                      <CheckCircle2 className="h-5 w-5 text-purple-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-2">Booking Summary</h3>
                        <div className="space-y-1 text-sm text-gray-700">
                          <p>
                            <strong>Property:</strong> {property.title}
                          </p>
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
                            <strong>Time:</strong>{' '}
                            {new Date(selectedSlot).toLocaleTimeString('fr-FR', {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </p>
                          <p>
                            <strong>Type:</strong>{' '}
                            {visitType === 'in_person' ? 'In-Person Visit' : 'Virtual Tour'}
                          </p>
                          <p>
                            <strong>Duration:</strong> 30 minutes
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <Button
                        onClick={() => router.back()}
                        variant="outline"
                        className="flex-1 rounded-xl"
                        disabled={booking}
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={handleBookVisit}
                        disabled={booking || !visitorPhone.trim()}
                        className="flex-1 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white rounded-xl shadow-lg"
                      >
                        {booking ? 'Booking...' : 'Confirm Booking'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
