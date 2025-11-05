'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useVisits, type PropertyVisit } from '@/lib/hooks/use-visits';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Calendar,
  Clock,
  MapPin,
  Video,
  User,
  X,
  CheckCircle,
  AlertCircle,
  MessageCircle,
  Star,
  Home,
} from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { toast } from 'sonner';

export default function MyVisitsPage() {
  const router = useRouter();
  const {
    visits,
    loading,
    fetchMyVisits,
    getUpcomingVisits,
    getPastVisits,
    cancelVisit,
    addVisitFeedback,
  } = useVisits();

  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [selectedVisit, setSelectedVisit] = useState<PropertyVisit | null>(null);
  const [rating, setRating] = useState(5);
  const [feedback, setFeedback] = useState('');
  const [wasHelpful, setWasHelpful] = useState(true);

  useEffect(() => {
    fetchMyVisits();
  }, []);

  const upcomingVisits = getUpcomingVisits();
  const pastVisits = getPastVisits();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'completed':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'cancelled_by_visitor':
      case 'cancelled_by_owner':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'no_show':
        return 'bg-gray-100 text-gray-700 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'Confirmed';
      case 'pending':
        return 'Pending';
      case 'completed':
        return 'Completed';
      case 'cancelled_by_visitor':
        return 'Cancelled by You';
      case 'cancelled_by_owner':
        return 'Cancelled by Owner';
      case 'no_show':
        return 'No Show';
      default:
        return status;
    }
  };

  const handleCancelVisit = async (visitId: string) => {
    if (!confirm('Are you sure you want to cancel this visit?')) return;

    const reason = prompt('Please tell us why you\'re cancelling (optional):');
    await cancelVisit(visitId, reason || undefined);
  };

  const handleAddFeedback = async () => {
    if (!selectedVisit) return;

    await addVisitFeedback(selectedVisit.id, rating, feedback, wasHelpful);
    setShowFeedbackModal(false);
    setSelectedVisit(null);
    setRating(5);
    setFeedback('');
    setWasHelpful(true);
  };

  const VisitCard = ({ visit }: { visit: PropertyVisit }) => {
    const scheduledDate = new Date(visit.scheduled_at);
    const isUpcoming = scheduledDate > new Date();

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="rounded-2xl shadow-lg hover:shadow-xl transition-shadow overflow-hidden">
          <div className="flex flex-col md:flex-row">
            {/* Property Image */}
            <div className="md:w-1/3">
              {visit.property?.main_image_url ? (
                <img
                  src={visit.property.main_image_url}
                  alt={visit.property.title}
                  className="w-full h-48 md:h-full object-cover"
                />
              ) : (
                <div className="w-full h-48 md:h-full bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center">
                  <Home className="h-16 w-16 text-orange-300" />
                </div>
              )}
            </div>

            {/* Visit Details */}
            <div className="md:w-2/3 p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-1">
                    {visit.property?.title || 'Property Visit'}
                  </h3>
                  <div className="flex items-center gap-2 text-gray-600 text-sm">
                    <MapPin className="h-4 w-4" />
                    <span>
                      {visit.property?.city} {visit.property?.address && `• ${visit.property.address}`}
                    </span>
                  </div>
                </div>
                <Badge className={`${getStatusColor(visit.status)} border`}>
                  {getStatusLabel(visit.status)}
                </Badge>
              </div>

              {/* Date & Time */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="flex items-center gap-2 text-gray-700">
                  <Calendar className="h-5 w-5 text-orange-600" />
                  <div>
                    <div className="text-xs text-gray-500">Date</div>
                    <div className="font-medium">
                      {scheduledDate.toLocaleDateString('fr-FR', {
                        weekday: 'short',
                        day: 'numeric',
                        month: 'short',
                      })}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <Clock className="h-5 w-5 text-orange-600" />
                  <div>
                    <div className="text-xs text-gray-500">Time</div>
                    <div className="font-medium">
                      {scheduledDate.toLocaleTimeString('fr-FR', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* Visit Type */}
              <div className="flex items-center gap-2 mb-4">
                {visit.visit_type === 'virtual' ? (
                  <Video className="h-5 w-5 text-blue-600" />
                ) : (
                  <MapPin className="h-5 w-5 text-green-600" />
                )}
                <span className="text-sm font-medium text-gray-700">
                  {visit.visit_type === 'virtual' ? 'Virtual Tour' : 'In-Person Visit'}
                </span>
              </div>

              {/* Owner Info */}
              <div className="flex items-center gap-2 mb-4 text-gray-600 text-sm">
                <User className="h-4 w-4" />
                <span>Hosted by {visit.owner?.full_name || 'Owner'}</span>
              </div>

              {/* Owner Response */}
              {visit.owner_response && (
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 mb-4">
                  <div className="text-xs text-blue-600 font-medium mb-1">Owner's Message:</div>
                  <div className="text-sm text-gray-700">{visit.owner_response}</div>
                </div>
              )}

              {/* Meeting URL for virtual visits */}
              {visit.visit_type === 'virtual' && visit.meeting_url && visit.status === 'confirmed' && (
                <div className="bg-green-50 border border-green-200 rounded-xl p-3 mb-4">
                  <div className="text-xs text-green-600 font-medium mb-1">Virtual Meeting:</div>
                  <a
                    href={visit.meeting_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:underline"
                  >
                    Join Video Call
                  </a>
                  {visit.meeting_password && (
                    <div className="text-xs text-gray-600 mt-1">
                      Password: {visit.meeting_password}
                    </div>
                  )}
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-2 mt-4">
                <Link href={`/properties/${visit.property_id}`} className="flex-1">
                  <Button variant="outline" className="w-full rounded-xl">
                    View Property
                  </Button>
                </Link>

                {isUpcoming && visit.status === 'pending' && (
                  <Button
                    variant="outline"
                    onClick={() => handleCancelVisit(visit.id)}
                    className="rounded-xl text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </Button>
                )}

                {visit.status === 'completed' && !visit.visitor_rating && (
                  <Button
                    onClick={() => {
                      setSelectedVisit(visit);
                      setShowFeedbackModal(true);
                    }}
                    className="rounded-xl bg-orange-600 hover:bg-orange-700"
                  >
                    <Star className="h-4 w-4 mr-2" />
                    Leave Feedback
                  </Button>
                )}
              </div>
            </div>
          </div>
        </Card>
      </motion.div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4" />
          <p className="text-gray-600">Loading your visits...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Visits</h1>
              <p className="text-gray-600 mt-1">Manage your property viewings</p>
            </div>
            <Button
              onClick={() => router.push('/properties/browse')}
              className="bg-gradient-to-r from-[#FFA040] to-[#FFB85C] hover:from-[#FF8C30] hover:to-[#FFA548] text-white rounded-2xl"
            >
              Browse Properties
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="rounded-2xl shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Visits</p>
                  <p className="text-3xl font-bold text-orange-600">{visits.length}</p>
                </div>
                <Calendar className="h-12 w-12 text-orange-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Upcoming</p>
                  <p className="text-3xl font-bold text-green-600">{upcomingVisits.length}</p>
                </div>
                <CheckCircle className="h-12 w-12 text-green-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Completed</p>
                  <p className="text-3xl font-bold text-blue-600">
                    {visits.filter((v) => v.status === 'completed').length}
                  </p>
                </div>
                <Star className="h-12 w-12 text-blue-200" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Visits Tabs */}
        <Tabs defaultValue="upcoming" className="space-y-6">
          <TabsList className="bg-white rounded-2xl p-1 shadow-lg">
            <TabsTrigger value="upcoming" className="rounded-xl">
              Upcoming ({upcomingVisits.length})
            </TabsTrigger>
            <TabsTrigger value="past" className="rounded-xl">
              Past ({pastVisits.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming" className="space-y-6">
            {upcomingVisits.length === 0 ? (
              <Card className="rounded-2xl shadow-lg">
                <CardContent className="p-12 text-center">
                  <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No upcoming visits</h3>
                  <p className="text-gray-600 mb-6">
                    Book a visit to view properties you're interested in
                  </p>
                  <Button
                    onClick={() => router.push('/properties/browse')}
                    className="bg-gradient-to-r from-[#FFA040] to-[#FFB85C] rounded-2xl"
                  >
                    Browse Properties
                  </Button>
                </CardContent>
              </Card>
            ) : (
              upcomingVisits.map((visit) => <VisitCard key={visit.id} visit={visit} />)
            )}
          </TabsContent>

          <TabsContent value="past" className="space-y-6">
            {pastVisits.length === 0 ? (
              <Card className="rounded-2xl shadow-lg">
                <CardContent className="p-12 text-center">
                  <Clock className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No past visits</h3>
                  <p className="text-gray-600">Your visit history will appear here</p>
                </CardContent>
              </Card>
            ) : (
              pastVisits.map((visit) => <VisitCard key={visit.id} visit={visit} />)
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Feedback Modal */}
      {showFeedbackModal && selectedVisit && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl"
          >
            <h2 className="text-2xl font-bold mb-4">How was your visit?</h2>

            <div className="space-y-4">
              {/* Rating */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rate your experience
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setRating(star)}
                      className="transition-transform hover:scale-110"
                    >
                      <Star
                        className={`h-8 w-8 ${
                          star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Feedback */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Share your thoughts
                </label>
                <textarea
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="What did you think about the property?"
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-600/20 outline-none"
                />
              </div>

              {/* Was Helpful */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Did this visit help you make a decision?
                </label>
                <div className="flex gap-3">
                  <button
                    onClick={() => setWasHelpful(true)}
                    className={`flex-1 p-3 rounded-xl border-2 transition-all ${
                      wasHelpful ? 'border-green-600 bg-green-50' : 'border-gray-200'
                    }`}
                  >
                    <CheckCircle className="h-6 w-6 mx-auto mb-1 text-green-600" />
                    <div className="text-sm font-medium">Yes</div>
                  </button>
                  <button
                    onClick={() => setWasHelpful(false)}
                    className={`flex-1 p-3 rounded-xl border-2 transition-all ${
                      !wasHelpful ? 'border-red-600 bg-red-50' : 'border-gray-200'
                    }`}
                  >
                    <X className="h-6 w-6 mx-auto mb-1 text-red-600" />
                    <div className="text-sm font-medium">No</div>
                  </button>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 mt-6">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowFeedbackModal(false);
                    setSelectedVisit(null);
                  }}
                  className="flex-1 rounded-xl"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleAddFeedback}
                  className="flex-1 bg-orange-600 hover:bg-orange-700 rounded-xl"
                >
                  Submit Feedback
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
