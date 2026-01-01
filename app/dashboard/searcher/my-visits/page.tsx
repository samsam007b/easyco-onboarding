'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useVisits, type PropertyVisit } from '@/lib/hooks/use-visits';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { EventCalendar, type CalendarEvent } from '@/components/ui/event-calendar';
import LoadingHouse from '@/components/ui/LoadingHouse';
import {
  Calendar as CalendarIcon,
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
  Bell,
  TrendingUp,
} from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { toast } from 'sonner';
import { useLanguage } from '@/lib/i18n/use-language';

export default function MyVisitsPage() {
  const router = useRouter();
  const { language, getSection } = useLanguage();
  const t = getSection('dashboard')?.searcher?.visits;
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

  // Convert visits to calendar events
  const calendarEvents: CalendarEvent[] = [...upcomingVisits, ...pastVisits].map((visit) => {
    // Determine color based on status
    let color: 'orange' | 'blue' | 'green' | 'red' | 'purple' = 'blue';
    if (visit.status === 'confirmed') {
      color = 'orange';
    } else if (visit.status === 'completed') {
      color = 'green';
    } else if (visit.status === 'cancelled_by_visitor' || visit.status === 'cancelled_by_owner') {
      color = 'red';
    } else if (visit.status === 'no_show') {
      color = 'purple';
    }

    return {
      id: visit.id,
      title: visit.property?.title || 'Visite',
      description: visit.property?.address || '',
      start: new Date(visit.scheduled_at),
      end: visit.scheduled_at ? new Date(new Date(visit.scheduled_at).getTime() + 60 * 60 * 1000) : undefined, // 1 hour duration
      location: visit.property?.address,
      color,
    };
  });

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
        return t?.status?.confirmed?.[language] || 'Confirmée';
      case 'pending':
        return t?.status?.pending?.[language] || 'En attente';
      case 'completed':
        return t?.status?.completed?.[language] || 'Terminée';
      case 'cancelled_by_visitor':
        return t?.status?.cancelledByYou?.[language] || 'Annulée par vous';
      case 'cancelled_by_owner':
        return t?.status?.cancelledByOwner?.[language] || 'Annulée par le propriétaire';
      case 'no_show':
        return t?.status?.noShow?.[language] || 'Non présent';
      default:
        return status;
    }
  };

  const handleCancelVisit = async (visitId: string) => {
    if (!confirm(t?.confirmCancel?.[language] || 'Êtes-vous sûr de vouloir annuler cette visite ?')) return;

    const reason = prompt(t?.cancelReason?.[language] || 'Dites-nous pourquoi vous annulez (optionnel) :');
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
                  <CalendarIcon className="h-5 w-5 text-orange-600" />
                  <div>
                    <div className="text-xs text-gray-500">{t?.card?.date?.[language] || 'Date'}</div>
                    <div className="font-medium">
                      {scheduledDate.toLocaleDateString(
                        language === 'fr' ? 'fr-FR' : language === 'de' ? 'de-DE' : language === 'nl' ? 'nl-NL' : 'en-GB',
                        { weekday: 'short', day: 'numeric', month: 'short' }
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <Clock className="h-5 w-5 text-orange-600" />
                  <div>
                    <div className="text-xs text-gray-500">{t?.card?.time?.[language] || 'Heure'}</div>
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
                  {visit.visit_type === 'virtual'
                    ? (t?.card?.virtualTour?.[language] || 'Visite virtuelle')
                    : (t?.card?.inPerson?.[language] || 'Visite en personne')}
                </span>
              </div>

              {/* Owner Info */}
              <div className="flex items-center gap-2 mb-4 text-gray-600 text-sm">
                <User className="h-4 w-4" />
                <span>{t?.card?.hostedBy?.[language] || 'Organisé par'} {visit.owner?.full_name || (t?.card?.owner?.[language] || 'Propriétaire')}</span>
              </div>

              {/* Owner Response */}
              {visit.owner_response && (
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 mb-4">
                  <div className="text-xs text-blue-600 font-medium mb-1">{t?.card?.ownerMessage?.[language] || 'Message du propriétaire :'}</div>
                  <div className="text-sm text-gray-700">{visit.owner_response}</div>
                </div>
              )}

              {/* Meeting URL for virtual visits */}
              {visit.visit_type === 'virtual' && visit.meeting_url && visit.status === 'confirmed' && (
                <div className="bg-green-50 border border-green-200 rounded-xl p-3 mb-4">
                  <div className="text-xs text-green-600 font-medium mb-1">{t?.card?.virtualMeeting?.[language] || 'Réunion virtuelle :'}</div>
                  <a
                    href={visit.meeting_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:underline"
                  >
                    {t?.card?.joinCall?.[language] || 'Rejoindre l\'appel vidéo'}
                  </a>
                  {visit.meeting_password && (
                    <div className="text-xs text-gray-600 mt-1">
                      {t?.card?.password?.[language] || 'Mot de passe :'} {visit.meeting_password}
                    </div>
                  )}
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-2 mt-4">
                <Link href={`/properties/${visit.property_id}`} className="flex-1">
                  <Button variant="outline" className="w-full rounded-xl">
                    {t?.actions?.viewProperty?.[language] || 'Voir la propriété'}
                  </Button>
                </Link>

                {isUpcoming && visit.status === 'pending' && (
                  <Button
                    variant="outline"
                    onClick={() => handleCancelVisit(visit.id)}
                    className="rounded-xl text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <X className="h-4 w-4 mr-2" />
                    {t?.actions?.cancel?.[language] || 'Annuler'}
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
                    {t?.actions?.leaveFeedback?.[language] || 'Laisser un avis'}
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
          <LoadingHouse size={80} />
          <p className="text-gray-600">{t?.loading?.[language] || 'Chargement de vos visites...'}</p>
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
              <h1 className="text-3xl font-bold text-gray-900">{t?.title?.[language] || 'Mes Visites'}</h1>
              <p className="text-gray-600 mt-1">{t?.subtitle?.[language] || 'Gérez vos visites de propriétés'}</p>
            </div>
            <Button
              onClick={() => router.push('/properties/browse')}
              className="bg-gradient-to-r from-[#FFA040] to-[#FFB85C] hover:from-[#FF8C30] hover:to-[#FFA548] text-white rounded-2xl"
            >
              {t?.browseButton?.[language] || 'Parcourir les propriétés'}
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
                  <p className="text-sm text-gray-600">{t?.stats?.total?.[language] || 'Total visites'}</p>
                  <p className="text-3xl font-bold text-orange-600">{visits.length}</p>
                </div>
                <CalendarIcon className="h-12 w-12 text-orange-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{t?.stats?.upcoming?.[language] || 'À venir'}</p>
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
                  <p className="text-sm text-gray-600">{t?.stats?.completed?.[language] || 'Terminées'}</p>
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
              {t?.tabs?.upcoming?.[language] || 'À venir'} ({upcomingVisits.length})
            </TabsTrigger>
            <TabsTrigger value="past" className="rounded-xl">
              {t?.tabs?.past?.[language] || 'Passées'} ({pastVisits.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming" className="space-y-6">
            {upcomingVisits.length === 0 ? (
              <Card className="rounded-2xl shadow-lg">
                <CardContent className="p-12 text-center">
                  <CalendarIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">{t?.empty?.upcoming?.title?.[language] || 'Aucune visite à venir'}</h3>
                  <p className="text-gray-600 mb-6">
                    {t?.empty?.upcoming?.description?.[language] || 'Réservez une visite pour voir les propriétés qui vous intéressent'}
                  </p>
                  <Button
                    onClick={() => router.push('/properties/browse')}
                    className="bg-gradient-to-r from-[#FFA040] to-[#FFB85C] rounded-2xl"
                  >
                    {t?.browseButton?.[language] || 'Parcourir les propriétés'}
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
                  <h3 className="text-xl font-semibold mb-2">{t?.empty?.past?.title?.[language] || 'Aucune visite passée'}</h3>
                  <p className="text-gray-600">{t?.empty?.past?.description?.[language] || 'Votre historique de visites apparaîtra ici'}</p>
                </CardContent>
              </Card>
            ) : (
              pastVisits.map((visit) => <VisitCard key={visit.id} visit={visit} />)
            )}
          </TabsContent>
        </Tabs>

        {/* Interactive Calendar Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-8"
        >
          <Card className="rounded-2xl shadow-lg overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-orange-50 to-orange-100/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-orange-600 rounded-xl flex items-center justify-center">
                  <CalendarIcon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <CardTitle className="text-xl">{t?.calendar?.title?.[language] || 'Calendrier des visites'}</CardTitle>
                  <p className="text-sm text-gray-600 mt-1">
                    {t?.calendar?.subtitle?.[language] || 'Cliquez sur une date pour voir les détails des visites'}
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <EventCalendar
                events={calendarEvents}
                onEventClick={(event) => {
                  // Find the visit associated with this event
                  const visit = visits.find(v => v.id === event.id);
                  if (visit) {
                    toast.info(`${t?.calendar?.visitLabel?.[language] || 'Visite'}: ${event.title}`);
                  }
                }}
                onDateClick={(date) => {
                  console.log('Date clicked:', date);
                }}
              />
            </CardContent>
          </Card>
        </motion.div>

        {/* Important Announcements */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8 space-y-4"
        >
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Bell className="w-6 h-6 text-orange-600" />
            {t?.announcements?.title?.[language] || 'Annonces importantes'}
          </h2>

          {/* Upcoming visits reminder */}
          {upcomingVisits.length > 0 && (
            <Card className="rounded-2xl shadow-lg border-l-4 border-l-orange-600">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <AlertCircle className="w-6 h-6 text-orange-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {t?.announcements?.upcoming?.title?.[language] || 'Prochaines visites à venir'}
                    </h3>
                    <p className="text-gray-600 mb-3">
                      {t?.announcements?.upcoming?.description?.[language]
                        ?.replace('{count}', String(upcomingVisits.length))
                        || `Vous avez ${upcomingVisits.length} visite${upcomingVisits.length > 1 ? 's' : ''} programmée${upcomingVisits.length > 1 ? 's' : ''}. Pensez à bien noter les dates et heures !`}
                    </p>
                    <div className="space-y-2">
                      {upcomingVisits.slice(0, 3).map((visit) => {
                        const visitDate = new Date(visit.scheduled_at);
                        return (
                          <div
                            key={visit.id}
                            className="flex items-center gap-3 text-sm bg-orange-50 rounded-lg p-3"
                          >
                            <CalendarIcon className="w-4 h-4 text-orange-600" />
                            <span className="font-medium text-gray-900">
                              {visitDate.toLocaleDateString(
                                language === 'fr' ? 'fr-FR' : language === 'de' ? 'de-DE' : language === 'nl' ? 'nl-NL' : 'en-GB',
                                { weekday: 'long', day: 'numeric', month: 'long' }
                              )}
                            </span>
                            <Clock className="w-4 h-4 text-orange-600 ml-2" />
                            <span className="text-gray-700">
                              {visitDate.toLocaleTimeString(
                                language === 'fr' ? 'fr-FR' : language === 'de' ? 'de-DE' : language === 'nl' ? 'nl-NL' : 'en-GB',
                                { hour: '2-digit', minute: '2-digit' }
                              )}
                            </span>
                            <span className="text-gray-600 ml-auto">
                              {visit.property?.title}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Tips for visits */}
          <Card className="rounded-2xl shadow-lg border-l-4 border-l-blue-600">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <TrendingUp className="w-6 h-6 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {t?.tips?.title?.[language] || 'Conseils pour vos visites'}
                  </h3>
                  <ul className="space-y-2 text-gray-600">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                      <span>{t?.tips?.list?.questions?.[language] || 'Préparez vos questions à l\'avance pour ne rien oublier'}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                      <span>{t?.tips?.list?.equipment?.[language] || 'Vérifiez l\'état des équipements et des installations'}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                      <span>{t?.tips?.list?.roommates?.[language] || 'N\'hésitez pas à discuter avec les colocataires actuels'}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                      <span>{t?.tips?.list?.photos?.[language] || 'Prenez des photos pour comparer les logements plus tard'}</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Leave feedback reminder */}
          {pastVisits.filter(v => v.status === 'completed' && !v.visitor_rating).length > 0 && (
            <Card className="rounded-2xl shadow-lg border-l-4 border-l-green-600">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Star className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {t?.announcements?.feedback?.title?.[language] || 'Partagez votre expérience'}
                    </h3>
                    <p className="text-gray-600 mb-3">
                      {t?.announcements?.feedback?.description?.[language]
                        ?.replace('{count}', String(pastVisits.filter(v => v.status === 'completed' && !v.visitor_rating).length))
                        || `Vous avez ${pastVisits.filter(v => v.status === 'completed' && !v.visitor_rating).length} visite${pastVisits.filter(v => v.status === 'completed' && !v.visitor_rating).length > 1 ? 's' : ''} en attente d'évaluation. Votre avis aide les autres chercheurs et améliore la qualité du service.`}
                    </p>
                    <Button
                      onClick={() => {
                        const firstVisitWithoutFeedback = pastVisits.find(
                          v => v.status === 'completed' && !v.visitor_rating
                        );
                        if (firstVisitWithoutFeedback) {
                          setSelectedVisit(firstVisitWithoutFeedback);
                          setShowFeedbackModal(true);
                        }
                      }}
                      className="bg-green-600 hover:bg-green-700 rounded-xl"
                    >
                      <Star className="w-4 h-4 mr-2" />
                      {t?.actions?.leaveFeedback?.[language] || 'Laisser un avis'}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </motion.div>
      </div>

      {/* Feedback Modal */}
      {showFeedbackModal && selectedVisit && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl"
          >
            <h2 className="text-2xl font-bold mb-4">{t?.feedbackModal?.title?.[language] || 'Comment s\'est passée votre visite ?'}</h2>

            <div className="space-y-4">
              {/* Rating */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t?.feedbackModal?.rateLabel?.[language] || 'Évaluez votre expérience'}
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
                  {t?.feedbackModal?.thoughtsLabel?.[language] || 'Partagez vos impressions'}
                </label>
                <textarea
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder={t?.feedbackModal?.placeholder?.[language] || 'Qu\'avez-vous pensé de la propriété ?'}
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-600/20 outline-none"
                />
              </div>

              {/* Was Helpful */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t?.feedbackModal?.helpfulLabel?.[language] || 'Cette visite vous a-t-elle aidé à prendre une décision ?'}
                </label>
                <div className="flex gap-3">
                  <button
                    onClick={() => setWasHelpful(true)}
                    className={`flex-1 p-3 rounded-xl border-2 transition-all ${
                      wasHelpful ? 'border-green-600 bg-green-50' : 'border-gray-200'
                    }`}
                  >
                    <CheckCircle className="h-6 w-6 mx-auto mb-1 text-green-600" />
                    <div className="text-sm font-medium">{t?.feedbackModal?.yes?.[language] || 'Oui'}</div>
                  </button>
                  <button
                    onClick={() => setWasHelpful(false)}
                    className={`flex-1 p-3 rounded-xl border-2 transition-all ${
                      !wasHelpful ? 'border-red-600 bg-red-50' : 'border-gray-200'
                    }`}
                  >
                    <X className="h-6 w-6 mx-auto mb-1 text-red-600" />
                    <div className="text-sm font-medium">{t?.feedbackModal?.no?.[language] || 'Non'}</div>
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
                  {t?.feedbackModal?.cancel?.[language] || 'Annuler'}
                </Button>
                <Button
                  onClick={handleAddFeedback}
                  className="flex-1 bg-orange-600 hover:bg-orange-700 rounded-xl"
                >
                  {t?.feedbackModal?.submit?.[language] || 'Envoyer l\'avis'}
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
