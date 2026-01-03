'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { createClient } from '@/lib/auth/supabase-client';
import { useLanguage } from '@/lib/i18n/use-language';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import LoadingHouse from '@/components/ui/LoadingHouse';
import {
  Bell,
  MapPin,
  Euro,
  Home,
  ArrowLeft,
  Plus,
  Trash2,
  Edit2,
  Sparkles,
  Filter,
  Settings,
  BellRing,
  BellOff,
} from 'lucide-react';
import { toast } from 'sonner';
import { getHookTranslation } from '@/lib/i18n/get-language';

// V3-FUN Palette
const SEARCHER_GRADIENT = 'linear-gradient(135deg, #F59E0B 0%, #FFB10B 50%, #FCD34D 100%)';
const SEARCHER_GRADIENT_SOFT = 'linear-gradient(135deg, #FFF9E6 0%, #FEF3C7 100%)';
const ALERT_GRADIENT = 'linear-gradient(135deg, #8B5CF6 0%, #A78BFA 100%)';

interface SearchAlert {
  id: string;
  name: string;
  city: string;
  budget_min?: number;
  budget_max?: number;
  rooms_min?: number;
  property_types: string[];
  is_active: boolean;
  created_at: string;
  new_matches: number;
  last_match?: string;
}

export default function SearcherAlertsPage() {
  const router = useRouter();
  const supabase = createClient();
  const { language } = useLanguage();

  const [loading, setLoading] = useState(true);
  const [alerts, setAlerts] = useState<SearchAlert[]>([]);

  useEffect(() => {
    const loadAlerts = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push('/login'); return; }

      // Mock alerts data
      const mockAlerts: SearchAlert[] = [
        {
          id: '1',
          name: 'Colocation Bruxelles Centre',
          city: 'Bruxelles',
          budget_min: 400,
          budget_max: 600,
          rooms_min: 1,
          property_types: ['shared'],
          is_active: true,
          created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          new_matches: 3,
          last_match: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
        },
        {
          id: '2',
          name: 'Studio Ixelles',
          city: 'Ixelles',
          budget_max: 800,
          property_types: ['studio', 'apartment'],
          is_active: true,
          created_at: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
          new_matches: 0,
          last_match: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: '3',
          name: 'Appartement familial',
          city: 'Woluwe-Saint-Lambert',
          budget_min: 800,
          budget_max: 1200,
          rooms_min: 2,
          property_types: ['apartment'],
          is_active: false,
          created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
          new_matches: 0
        }
      ];

      setAlerts(mockAlerts);
      setLoading(false);
    };
    loadAlerts();
  }, [supabase, router]);

  const handleToggleAlert = async (alertId: string, isActive: boolean) => {
    setAlerts(prev => prev.map(a =>
      a.id === alertId ? { ...a, is_active: isActive } : a
    ));
    toast.success(isActive ? getHookTranslation('alerts', 'activated') : getHookTranslation('alerts', 'deactivated'));
  };

  const handleDeleteAlert = async (alertId: string) => {
    if (!confirm('Supprimer cette alerte ?')) return;
    setAlerts(prev => prev.filter(a => a.id !== alertId));
    toast.success(getHookTranslation('alerts', 'deleted'));
  };

  const formatTimeAgo = (dateStr?: string) => {
    if (!dateStr) return 'Jamais';
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffHours < 1) return 'Il y a moins d\'une heure';
    if (diffHours < 24) return `Il y a ${diffHours}h`;
    if (diffDays === 1) return 'Hier';
    return `Il y a ${diffDays} jours`;
  };

  const activeCount = alerts.filter(a => a.is_active).length;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingHouse size={80} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-amber-50/30">
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
                    style={{ background: ALERT_GRADIENT }}
                  >
                    <Bell className="w-6 h-6 text-white" />
                  </div>
                  Mes Alertes
                </h1>
                <p className="text-gray-600 mt-1">
                  {activeCount} alerte{activeCount !== 1 ? 's' : ''} active{activeCount !== 1 ? 's' : ''}
                </p>
              </div>
            </div>

            <Button
              className="rounded-xl text-white shadow-lg"
              style={{ background: ALERT_GRADIENT }}
              onClick={() => router.push('/searcher/alerts/new')}
            >
              <Plus className="w-4 h-4 mr-2" />
              Créer une alerte
            </Button>
          </div>
        </motion.div>

        {/* Content */}
        {alerts.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative overflow-hidden rounded-3xl border-2 border-violet-100 shadow-lg"
            style={{ background: 'linear-gradient(135deg, #F5F3FF 0%, #EDE9FE 100%)' }}
          >
            <div className="absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-20" style={{ background: ALERT_GRADIENT }} />
            <div className="relative flex flex-col items-center justify-center py-20 px-8">
              <motion.div
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-24 h-24 rounded-3xl flex items-center justify-center mb-6 shadow-xl"
                style={{ background: ALERT_GRADIENT }}
              >
                <BellRing className="w-12 h-12 text-white" />
              </motion.div>
              <h3 className="text-3xl font-bold text-gray-900 mb-3">
                Aucune alerte configurée
              </h3>
              <p className="text-lg text-gray-600 text-center max-w-md mb-8">
                Créez des alertes pour être notifié dès qu'un bien correspond à vos critères
              </p>
              <Button
                onClick={() => router.push('/searcher/alerts/new')}
                className="text-white px-8 py-6 text-lg rounded-2xl shadow-lg hover:shadow-xl transition-all"
                style={{ background: ALERT_GRADIENT }}
              >
                <Sparkles className="w-5 h-5 mr-2" />
                Créer ma première alerte
              </Button>
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
            {alerts.map((alert) => (
              <motion.div
                key={alert.id}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 }
                }}
              >
                <Card className={`overflow-hidden rounded-2xl border-gray-100 hover:shadow-lg transition-all ${!alert.is_active ? 'opacity-60' : ''}`}>
                  <CardContent className="p-5">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      {/* Left: Alert Info */}
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <div
                            className="w-10 h-10 rounded-xl flex items-center justify-center"
                            style={{ background: alert.is_active ? `${ALERT_GRADIENT}20` : '#F3F4F6' }}
                          >
                            {alert.is_active ? (
                              <BellRing className="w-5 h-5" style={{ color: '#8B5CF6' }} />
                            ) : (
                              <BellOff className="w-5 h-5 text-gray-400" />
                            )}
                          </div>
                          <div>
                            <h3 className="font-semibold text-lg text-gray-900">{alert.name}</h3>
                            <div className="flex items-center gap-2 text-gray-600 text-sm">
                              <MapPin className="w-4 h-4" />
                              <span>{alert.city}</span>
                            </div>
                          </div>
                          {alert.new_matches > 0 && (
                            <Badge className="bg-violet-100 text-violet-700 border-0">
                              {alert.new_matches} nouveau{alert.new_matches > 1 ? 'x' : ''}
                            </Badge>
                          )}
                        </div>

                        {/* Criteria */}
                        <div className="flex flex-wrap gap-2 mt-3">
                          {(alert.budget_min || alert.budget_max) && (
                            <Badge variant="secondary" className="rounded-lg">
                              <Euro className="w-3 h-3 mr-1" />
                              {alert.budget_min && `${alert.budget_min}€`}
                              {alert.budget_min && alert.budget_max && ' - '}
                              {alert.budget_max && `${alert.budget_max}€`}
                            </Badge>
                          )}
                          {alert.rooms_min && (
                            <Badge variant="secondary" className="rounded-lg">
                              <Home className="w-3 h-3 mr-1" />
                              {alert.rooms_min}+ ch.
                            </Badge>
                          )}
                          {alert.property_types.map((type, i) => (
                            <Badge key={i} variant="secondary" className="rounded-lg">
                              {type === 'shared' ? 'Colocation' : type === 'studio' ? 'Studio' : 'Appartement'}
                            </Badge>
                          ))}
                        </div>

                        {/* Last Match */}
                        <p className="text-sm text-gray-500 mt-3">
                          Dernier match: {formatTimeAgo(alert.last_match)}
                        </p>
                      </div>

                      {/* Right: Actions */}
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-600">
                            {alert.is_active ? 'Active' : 'Inactive'}
                          </span>
                          <Switch
                            checked={alert.is_active}
                            onCheckedChange={(checked) => handleToggleAlert(alert.id, checked)}
                          />
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            className="rounded-xl"
                            onClick={() => router.push(`/searcher/alerts/${alert.id}/edit`)}
                          >
                            <Edit2 className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            className="rounded-xl text-red-600 hover:text-red-700 hover:border-red-300"
                            onClick={() => handleDeleteAlert(alert.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
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
