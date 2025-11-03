'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/auth/supabase-client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Calendar,
  Clock,
  MapPin,
  Video,
  Users,
  MessageSquare,
  CheckCircle,
  XCircle,
  AlertCircle,
} from 'lucide-react';
import { VirtualToursService } from '@/lib/services/virtual-tours-service';
import { PropertyTour } from '@/types/virtual-tours.types';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

export default function ToursPage() {
  const [tours, setTours] = useState<PropertyTour[]>([]);
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'past'>('upcoming');
  const [isLoading, setIsLoading] = useState(true);

  const supabase = createClient();
  const virtualToursService = new VirtualToursService(supabase);
  const router = useRouter();

  useEffect(() => {
    loadTours();
  }, [filter]);

  const loadTours = async () => {
    setIsLoading(true);
    try {
      const allTours = await virtualToursService.getUserTours();
      const now = new Date();

      if (filter === 'upcoming') {
        const upcomingTours = allTours.filter(
          (tour) =>
            new Date(tour.scheduled_at) >= now &&
            tour.status !== 'cancelled' &&
            tour.status !== 'completed'
        );
        setTours(upcomingTours);
      } else if (filter === 'past') {
        const pastTours = allTours.filter(
          (tour) => new Date(tour.scheduled_at) < now || tour.status === 'completed'
        );
        setTours(pastTours);
      } else {
        setTours(allTours);
      }
    } catch (error) {
      console.error('Error loading tours:', error);
      toast.error('Erreur lors du chargement des visites');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelTour = async (tourId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir annuler cette visite ?')) return;

    try {
      await virtualToursService.cancelTour(tourId);
      toast.success('Visite annulée');
      loadTours();
    } catch (error) {
      console.error('Error canceling tour:', error);
      toast.error('Erreur lors de l\'annulation');
    }
  };

  const getStatusBadge = (status: PropertyTour['status']) => {
    const statusConfig = {
      pending: { label: 'En attente', variant: 'warning' as const, icon: AlertCircle },
      confirmed: { label: 'Confirmée', variant: 'success' as const, icon: CheckCircle },
      cancelled: { label: 'Annulée', variant: 'error' as const, icon: XCircle },
      completed: { label: 'Terminée', variant: 'default' as const, icon: CheckCircle },
    };

    const config = statusConfig[status];
    const Icon = config.icon;

    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon className="w-3 h-3" />
        {config.label}
      </Badge>
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const upcomingCount = tours.filter(
    (t) => new Date(t.scheduled_at) > new Date() && t.status !== 'cancelled'
  ).length;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Mes visites</h1>
          <p className="text-gray-600">Gérez vos visites virtuelles et physiques planifiées</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Visites à venir</p>
                  <p className="text-2xl font-bold text-blue-600">{upcomingCount}</p>
                </div>
                <Calendar className="w-10 h-10 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Visites confirmées</p>
                  <p className="text-2xl font-bold text-green-600">
                    {tours.filter((t) => t.status === 'confirmed').length}
                  </p>
                </div>
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Visites terminées</p>
                  <p className="text-2xl font-bold text-gray-600">
                    {tours.filter((t) => t.status === 'completed').length}
                  </p>
                </div>
                <CheckCircle className="w-10 h-10 text-gray-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filter Tabs */}
        <div className="mb-6">
          <div className="flex items-center bg-white rounded-lg p-1 border border-gray-200 inline-flex">
            <button
              onClick={() => setFilter('upcoming')}
              className={`px-4 py-2 rounded-md transition-colors ${
                filter === 'upcoming'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              À venir
            </button>
            <button
              onClick={() => setFilter('past')}
              className={`px-4 py-2 rounded-md transition-colors ${
                filter === 'past' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Passées
            </button>
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-md transition-colors ${
                filter === 'all' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Toutes
            </button>
          </div>
        </div>

        {/* Tours List */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-600 mt-4">Chargement des visites...</p>
          </div>
        ) : tours.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Aucune visite planifiée
              </h3>
              <p className="text-gray-600 mb-4">
                Commencez à explorer les propriétés et planifiez vos visites
              </p>
              <Button onClick={() => router.push('/properties/browse')}>
                Parcourir les propriétés
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {tours.map((tour) => (
              <Card key={tour.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      {/* Tour Type & Status */}
                      <div className="flex items-center gap-3 mb-3">
                        {tour.tour_type === 'virtual' ? (
                          <div className="flex items-center gap-2 text-purple-600">
                            <Video className="w-5 h-5" />
                            <span className="font-semibold">Visite virtuelle</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 text-blue-600">
                            <MapPin className="w-5 h-5" />
                            <span className="font-semibold">Visite physique</span>
                          </div>
                        )}
                        {getStatusBadge(tour.status)}
                      </div>

                      {/* Property Title */}
                      <h3
                        className="text-lg font-bold text-gray-900 mb-3 hover:text-blue-600 cursor-pointer"
                        onClick={() => router.push(`/properties/${tour.property_id}`)}
                      >
                        Propriété #{tour.property_id.slice(0, 8)}
                      </h3>

                      {/* Date & Time */}
                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-3">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          <span>{formatDate(tour.scheduled_at)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          <span>{formatTime(tour.scheduled_at)}</span>
                        </div>
                        {tour.attendees_count > 1 && (
                          <div className="flex items-center gap-2">
                            <Users className="w-4 h-4" />
                            <span>{tour.attendees_count} participants</span>
                          </div>
                        )}
                      </div>

                      {/* Notes */}
                      {tour.notes && (
                        <div className="flex items-start gap-2 text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">
                          <MessageSquare className="w-4 h-4 mt-0.5 flex-shrink-0" />
                          <p>{tour.notes}</p>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-2 ml-4">
                      {tour.status === 'pending' || tour.status === 'confirmed' ? (
                        <>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => router.push(`/properties/${tour.property_id}`)}
                          >
                            Voir la propriété
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleCancelTour(tour.id)}
                            className="text-red-600 hover:bg-red-50"
                          >
                            Annuler
                          </Button>
                        </>
                      ) : (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => router.push(`/properties/${tour.property_id}`)}
                        >
                          Voir la propriété
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
