'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { createClient } from '@/lib/auth/supabase-client';
import { useLanguage } from '@/lib/i18n/use-language';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import LoadingHouse from '@/components/ui/LoadingHouse';
import {
  Calendar,
  Clock,
  MapPin,
  Home,
  ArrowLeft,
  CheckCircle,
  XCircle,
  Sparkles,
  Eye,
  MessageCircle,
  Phone,
  Video,
  Plus,
} from 'lucide-react';

// V3-FUN Palette
const SEARCHER_GRADIENT = 'linear-gradient(135deg, #F59E0B 0%, #FFB10B 50%, #FCD34D 100%)';
const SEARCHER_GRADIENT_SOFT = 'linear-gradient(135deg, #FFF9E6 0%, #FEF3C7 100%)';
const SUCCESS_GRADIENT = 'linear-gradient(135deg, #10B981 0%, #34D399 100%)';

interface Visit {
  id: string;
  property_id: string;
  visit_date: string;
  visit_time: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  visit_type: 'in_person' | 'video';
  notes?: string;
  property: {
    id: string;
    title: string;
    city: string;
    postal_code: string;
    address?: string;
    main_image?: string;
  };
  owner?: {
    full_name: string;
    phone?: string;
  };
}

export default function SearcherVisitsPage() {
  const router = useRouter();
  const supabase = createClient();
  const { language } = useLanguage();

  const [loading, setLoading] = useState(true);
  const [visits, setVisits] = useState<Visit[]>([]);
  const [filter, setFilter] = useState<'upcoming' | 'past' | 'all'>('upcoming');

  useEffect(() => {
    const loadVisits = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push('/login'); return; }

      // Mock visits data (would be fetched from property_visits table)
      const mockVisits: Visit[] = [
        {
          id: '1',
          property_id: 'p1',
          visit_date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          visit_time: '14:00',
          status: 'confirmed',
          visit_type: 'in_person',
          property: {
            id: 'p1',
            title: 'Appartement T3 lumineux',
            city: 'Bruxelles',
            postal_code: '1000',
            address: '42 Rue de la Loi',
            main_image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400'
          },
          owner: {
            full_name: 'Jean Dupont',
            phone: '+32 475 12 34 56'
          }
        },
        {
          id: '2',
          property_id: 'p2',
          visit_date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          visit_time: '10:30',
          status: 'pending',
          visit_type: 'video',
          property: {
            id: 'p2',
            title: 'Studio moderne à Ixelles',
            city: 'Ixelles',
            postal_code: '1050',
            main_image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400'
          },
          owner: {
            full_name: 'Marie Martin'
          }
        },
        {
          id: '3',
          property_id: 'p3',
          visit_date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          visit_time: '16:00',
          status: 'completed',
          visit_type: 'in_person',
          property: {
            id: 'p3',
            title: 'Colocation Saint-Gilles',
            city: 'Saint-Gilles',
            postal_code: '1060',
            main_image: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=400'
          },
          owner: {
            full_name: 'Sophie Leblanc'
          }
        }
      ];

      setVisits(mockVisits);
      setLoading(false);
    };
    loadVisits();
  }, [supabase, router]);

  const filteredVisits = visits.filter(visit => {
    const visitDate = new Date(visit.visit_date);
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    if (filter === 'upcoming') return visitDate >= now && visit.status !== 'cancelled';
    if (filter === 'past') return visitDate < now || visit.status === 'completed';
    return true;
  });

  const upcomingCount = visits.filter(v => {
    const d = new Date(v.visit_date);
    return d >= new Date() && v.status !== 'cancelled';
  }).length;

  const getStatusBadge = (status: Visit['status']) => {
    const config = {
      pending: { color: '#F59E0B', bg: '#FEF3C7', label: 'En attente' },
      confirmed: { color: '#10B981', bg: '#D1FAE5', label: 'Confirmée' },
      cancelled: { color: '#EF4444', bg: '#FEE2E2', label: 'Annulée' },
      completed: { color: '#6B7280', bg: '#F3F4F6', label: 'Terminée' }
    };
    const { color, bg, label } = config[status];
    return (
      <Badge style={{ background: bg, color }} className="border-0 font-medium">
        {label}
      </Badge>
    );
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat('fr-FR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long'
    }).format(date);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingHouse size={80} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-emerald-50/30">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-3">
              <Link href="/searcher">
                <Button variant="ghost" size="icon" className="rounded-xl">
                  <ArrowLeft className="w-5 h-5" />
                </Button>
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg"
                    style={{ background: SUCCESS_GRADIENT }}
                  >
                    <Calendar className="w-6 h-6 text-white" />
                  </div>
                  Mes Visites
                </h1>
                <p className="text-gray-600 mt-1">
                  {upcomingCount} visite{upcomingCount !== 1 ? 's' : ''} à venir
                </p>
              </div>
            </div>

            <Button
              className="rounded-xl text-white shadow-lg"
              style={{ background: SEARCHER_GRADIENT }}
              onClick={() => router.push('/searcher/explore')}
            >
              <Plus className="w-4 h-4 mr-2" />
              Planifier une visite
            </Button>
          </div>
        </motion.div>

        {/* Filter Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex gap-2 mb-6"
        >
          {[
            { id: 'upcoming', label: 'À venir' },
            { id: 'past', label: 'Passées' },
            { id: 'all', label: 'Toutes' }
          ].map((tab) => (
            <Button
              key={tab.id}
              variant={filter === tab.id ? 'default' : 'outline'}
              size="sm"
              className={`rounded-xl transition-all ${filter === tab.id ? 'text-white shadow-lg' : ''}`}
              style={filter === tab.id ? { background: SEARCHER_GRADIENT } : {}}
              onClick={() => setFilter(tab.id as typeof filter)}
            >
              {tab.label}
            </Button>
          ))}
        </motion.div>

        {/* Visits List */}
        {filteredVisits.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative overflow-hidden rounded-3xl border-2 border-emerald-100 shadow-lg"
            style={{ background: 'linear-gradient(135deg, #ECFDF5 0%, #D1FAE5 100%)' }}
          >
            <div className="absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-20" style={{ background: SUCCESS_GRADIENT }} />
            <div className="relative flex flex-col items-center justify-center py-20 px-8">
              <motion.div
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-24 h-24 rounded-3xl flex items-center justify-center mb-6 shadow-xl"
                style={{ background: SUCCESS_GRADIENT }}
              >
                <Calendar className="w-12 h-12 text-white" />
              </motion.div>
              <h3 className="text-3xl font-bold text-gray-900 mb-3">
                {filter === 'upcoming' ? 'Aucune visite planifiée' : 'Aucune visite'}
              </h3>
              <p className="text-lg text-gray-600 text-center max-w-md mb-8">
                {filter === 'upcoming'
                  ? 'Explorez les propriétés et planifiez vos visites'
                  : 'Aucune visite dans cette catégorie'}
              </p>
              {filter === 'upcoming' && (
                <Button
                  onClick={() => router.push('/searcher/explore')}
                  className="text-white px-8 py-6 text-lg rounded-2xl shadow-lg hover:shadow-xl transition-all"
                  style={{ background: SEARCHER_GRADIENT }}
                >
                  <Sparkles className="w-5 h-5 mr-2" />
                  Explorer les propriétés
                </Button>
              )}
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
            }}
            className="space-y-4"
          >
            {filteredVisits.map((visit) => (
              <motion.div
                key={visit.id}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 }
                }}
              >
                <Card className="overflow-hidden rounded-2xl border-gray-100 hover:border-amber-200 hover:shadow-lg transition-all">
                  <CardContent className="p-0">
                    <div className="flex flex-col md:flex-row">
                      {/* Property Image */}
                      <div className="relative w-full md:w-48 h-40 md:h-auto bg-gray-100 flex-shrink-0">
                        {visit.property.main_image ? (
                          <Image
                            src={visit.property.main_image}
                            alt={visit.property.title}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Home className="w-10 h-10 text-gray-300" />
                          </div>
                        )}
                        {/* Visit Type Badge */}
                        <div className="absolute top-3 left-3">
                          <Badge className="bg-white/90 backdrop-blur-sm text-gray-700 border-0">
                            {visit.visit_type === 'video' ? (
                              <><Video className="w-3 h-3 mr-1" /> Vidéo</>
                            ) : (
                              <><MapPin className="w-3 h-3 mr-1" /> Sur place</>
                            )}
                          </Badge>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="flex-1 p-5">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="font-semibold text-lg text-gray-900">
                              {visit.property.title}
                            </h3>
                            <div className="flex items-center gap-2 text-gray-600 text-sm mt-1">
                              <MapPin className="w-4 h-4" />
                              <span>{visit.property.city}, {visit.property.postal_code}</span>
                            </div>
                          </div>
                          {getStatusBadge(visit.status)}
                        </div>

                        {/* Date & Time */}
                        <div className="flex items-center gap-4 mb-4 p-3 rounded-xl bg-gray-50">
                          <div className="flex items-center gap-2 text-gray-700">
                            <Calendar className="w-5 h-5 text-amber-600" />
                            <span className="font-medium capitalize">{formatDate(visit.visit_date)}</span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-700">
                            <Clock className="w-5 h-5 text-amber-600" />
                            <span className="font-medium">{visit.visit_time}</span>
                          </div>
                        </div>

                        {/* Owner Info */}
                        {visit.owner && (
                          <div className="flex items-center justify-between">
                            <p className="text-sm text-gray-600">
                              Propriétaire: <span className="font-medium text-gray-900">{visit.owner.full_name}</span>
                            </p>
                            <div className="flex gap-2">
                              {visit.owner.phone && visit.status === 'confirmed' && (
                                <Button variant="outline" size="sm" className="rounded-xl">
                                  <Phone className="w-4 h-4 mr-1" />
                                  Appeler
                                </Button>
                              )}
                              <Button
                                variant="outline"
                                size="sm"
                                className="rounded-xl"
                                onClick={() => router.push(`/properties/${visit.property_id}`)}
                              >
                                <Eye className="w-4 h-4 mr-1" />
                                Voir le bien
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}
