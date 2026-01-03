'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/auth/supabase-client';
import { AlertsService } from '@/lib/services/alerts-service';
import { PropertyAlert } from '@/types/alerts.types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { motion } from 'framer-motion';
import { Bell, Trash2, Edit, Plus, BellOff, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import LoadingHouse from '@/components/ui/LoadingHouse';
import { useLanguage } from '@/lib/i18n/use-language';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  SearcherPageHeader,
  SearcherKPICard,
  SearcherKPIGrid,
  searcherGradientVibrant,
  searcherGradientLight,
  searcherAnimations,
} from '@/components/searcher';

export default function AlertsPage() {
  const router = useRouter();
  const supabase = createClient();
  const alertsService = new AlertsService(supabase);
  const { language, getSection } = useLanguage();
  const t = getSection('dashboard')?.searcher?.alerts;

  const [alerts, setAlerts] = useState<PropertyAlert[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [alertToDelete, setAlertToDelete] = useState<string | null>(null);

  useEffect(() => {
    loadAlerts();
  }, []);

  const loadAlerts = async () => {
    try {
      setIsLoading(true);
      const data = await alertsService.getUserAlerts();
      setAlerts(data);
    } catch (error) {
      console.error('Error loading alerts:', error);
      toast.error(t?.messages?.loadError?.[language] || 'Error loading alerts');
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleAlert = async (alertId: string, currentStatus: boolean) => {
    try {
      await alertsService.toggleAlert(alertId, !currentStatus);
      setAlerts((prev) =>
        prev.map((alert) =>
          alert.id === alertId ? { ...alert, is_active: !currentStatus } : alert
        )
      );
      toast.success(!currentStatus
        ? (t?.messages?.activated?.[language] || 'Alert activated')
        : (t?.messages?.deactivated?.[language] || 'Alert deactivated'));
    } catch (error) {
      console.error('Error toggling alert:', error);
      toast.error(t?.messages?.modifyError?.[language] || 'Error modifying alert');
    }
  };

  const handleDeleteAlert = async () => {
    if (!alertToDelete) return;

    try {
      await alertsService.deleteAlert(alertToDelete);
      setAlerts((prev) => prev.filter((alert) => alert.id !== alertToDelete));
      toast.success(t?.messages?.deleted?.[language] || 'Alert deleted');
      setAlertToDelete(null);
    } catch (error) {
      console.error('Error deleting alert:', error);
      toast.error(t?.messages?.deleteError?.[language] || 'Error deleting alert');
    }
  };

  const formatCriteria = (alert: PropertyAlert) => {
    const parts: string[] = [];

    if (alert.criteria.city) {
      parts.push(`📍 ${alert.criteria.city}`);
    }

    if (alert.criteria.minPrice || alert.criteria.maxPrice) {
      const min = alert.criteria.minPrice || 0;
      const max = alert.criteria.maxPrice || '∞';
      parts.push(`💰 ${min}€ - ${max}€`);
    }

    if (alert.criteria.bedrooms) {
      parts.push(`🛏️ ${alert.criteria.bedrooms} ${t?.criteria?.bedrooms?.[language] || 'bedrooms'}`);
    }

    if (alert.criteria.propertyType && alert.criteria.propertyType !== 'all') {
      parts.push(`🏠 ${alert.criteria.propertyType}`);
    }

    if (alert.criteria.furnished !== null && alert.criteria.furnished !== undefined) {
      parts.push(alert.criteria.furnished
        ? `✅ ${t?.criteria?.furnished?.[language] || 'Furnished'}`
        : `❌ ${t?.criteria?.unfurnished?.[language] || 'Unfurnished'}`);
    }

    return parts;
  };

  const getFrequencyLabel = (frequency: string) => {
    switch (frequency) {
      case 'instant':
        return t?.frequency?.instant?.[language] || 'Instant';
      case 'daily':
        return t?.frequency?.daily?.[language] || 'Daily';
      case 'weekly':
        return t?.frequency?.weekly?.[language] || 'Weekly';
      default:
        return frequency;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50/30 to-white flex items-center justify-center">
        <div className="text-center">
          <LoadingHouse size={80} />
          <p className="text-gray-600 font-medium mt-4">{t?.loading?.[language] || 'Chargement de vos alertes...'}</p>
        </div>
      </div>
    );
  }

  const activeCount = alerts.filter((a) => a.is_active).length;
  const inactiveCount = alerts.filter((a) => !a.is_active).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50/30 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          {...searcherAnimations.fadeInUp}
          className="space-y-6"
        >
          {/* Header */}
          <SearcherPageHeader
            icon={Bell}
            title={t?.title?.[language] || 'Mes Alertes'}
            subtitle={t?.subtitle?.[language] || 'Recevez des notifications quand une propriété correspond à vos critères'}
            breadcrumb={{ label: 'Accueil', href: '/dashboard/searcher' }}
            currentPage="Alertes"
            actions={
              <Button
                onClick={() => router.push('/properties/browse')}
                className="rounded-2xl text-white font-semibold"
                style={{ background: searcherGradientVibrant }}
              >
                <Plus className="w-4 h-4 mr-2" />
                {t?.createButton?.[language] || 'Créer une alerte'}
              </Button>
            }
          />

          {/* Stats KPIs */}
          <SearcherKPIGrid columns={3}>
            <SearcherKPICard
              title="Total alertes"
              value={alerts.length}
              icon={Bell}
              variant="primary"
            />
            <SearcherKPICard
              title={t?.stats?.active?.[language] || 'Actives'}
              value={activeCount}
              icon={Bell}
              variant="success"
            />
            <SearcherKPICard
              title={t?.stats?.inactive?.[language] || 'Inactives'}
              value={inactiveCount}
              icon={BellOff}
              variant="secondary"
            />
          </SearcherKPIGrid>

          {/* Alerts List */}
          {alerts.length === 0 ? (
            <motion.div
              {...searcherAnimations.cardHover}
              className="relative overflow-hidden rounded-3xl border-2 border-amber-100 shadow-lg"
              style={{ background: searcherGradientLight }}
            >
              <div className="absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-20" style={{ background: searcherGradientVibrant }} />
              <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2 opacity-10" style={{ background: searcherGradientVibrant }} />

              <div className="relative flex flex-col items-center justify-center py-20 px-8">
                <motion.div
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-24 h-24 rounded-3xl flex items-center justify-center mb-6 shadow-xl"
                  style={{ background: searcherGradientVibrant, boxShadow: '0 12px 32px rgba(255, 140, 32, 0.3)' }}
                >
                  <Bell className="w-12 h-12 text-white" />
                </motion.div>
                <h3 className="text-3xl font-bold text-gray-900 mb-3">
                  {t?.empty?.title?.[language] || 'Aucune alerte configurée'}
                </h3>
                <p className="text-lg text-gray-600 text-center max-w-md mb-8">
                  {t?.empty?.description?.[language] || 'Créez votre première alerte pour être notifié des nouvelles propriétés'}
                </p>
                <Button
                  onClick={() => router.push('/properties/browse')}
                  className="text-white px-8 py-6 text-lg rounded-2xl shadow-lg hover:shadow-xl transition-all"
                  style={{ background: searcherGradientVibrant, boxShadow: '0 8px 24px rgba(255, 140, 32, 0.3)' }}
                >
                  <Sparkles className="w-5 h-5 mr-2" />
                  {t?.createButton?.[language] || 'Créer une alerte'}
                </Button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0 },
                visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
              }}
              className="space-y-4"
            >
              {alerts.map((alert) => (
                <motion.div
                  key={alert.id}
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0 },
                  }}
                >
                  <Card className={`bg-white/80 backdrop-blur-sm border-gray-200 rounded-2xl hover:shadow-lg transition-shadow ${!alert.is_active ? 'opacity-60' : ''}`}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <CardTitle className="text-xl">{alert.name}</CardTitle>
                            {alert.is_active ? (
                              <Badge className="bg-green-100 text-green-700">{t?.badge?.active?.[language] || 'Active'}</Badge>
                            ) : (
                              <Badge variant="secondary">{t?.badge?.inactive?.[language] || 'Inactive'}</Badge>
                            )}
                          </div>
                          <CardDescription>
                            {t?.card?.created?.[language] || 'Créé le'} {new Date(alert.created_at).toLocaleDateString(language === 'fr' ? 'fr-FR' : language === 'de' ? 'de-DE' : language === 'nl' ? 'nl-NL' : 'en-GB')}
                            {alert.last_notified_at && (
                              <> • {t?.card?.lastNotification?.[language] || 'Dernière notification'} {new Date(alert.last_notified_at).toLocaleDateString(language === 'fr' ? 'fr-FR' : language === 'de' ? 'de-DE' : language === 'nl' ? 'nl-NL' : 'en-GB')}</>
                            )}
                          </CardDescription>
                        </div>
                        <Switch
                          checked={alert.is_active}
                          onCheckedChange={() => handleToggleAlert(alert.id, alert.is_active)}
                        />
                      </div>
                    </CardHeader>
                    <CardContent>
                      {/* Criteria */}
                      <div className="mb-4">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">{t?.card?.searchCriteria?.[language] || 'Critères de recherche'}</h4>
                        <div className="flex flex-wrap gap-2">
                          {formatCriteria(alert).map((criterion, index) => (
                            <Badge key={index} variant="default" className="text-sm">
                              {criterion}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* Notification Settings */}
                      <div className="mb-4">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">{t?.card?.notifications?.[language] || 'Notifications'}</h4>
                        <div className="flex flex-wrap gap-2">
                          {alert.email_notifications && (
                            <Badge variant="default" className="text-sm">
                              📧 Email
                            </Badge>
                          )}
                          {alert.in_app_notifications && (
                            <Badge variant="default" className="text-sm">
                              🔔 In-app
                            </Badge>
                          )}
                          <Badge variant="default" className="text-sm">
                            📅 {getFrequencyLabel(alert.notification_frequency)}
                          </Badge>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2 pt-4 border-t">
                        <Button variant="outline" size="sm" className="rounded-xl" onClick={() => router.push(`/dashboard/searcher/alerts/${alert.id}/edit`)}>
                          <Edit className="w-4 h-4 mr-2" />
                          {t?.actions?.edit?.[language] || 'Modifier'}
                        </Button>
                        <Button variant="outline" size="sm" className="rounded-xl text-red-600 hover:text-red-700 hover:bg-red-50" onClick={() => setAlertToDelete(alert.id)}>
                          <Trash2 className="w-4 h-4 mr-2" />
                          {t?.actions?.delete?.[language] || 'Supprimer'}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* Delete Confirmation Dialog */}
          <AlertDialog open={!!alertToDelete} onOpenChange={() => setAlertToDelete(null)}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>{t?.deleteDialog?.title?.[language] || 'Supprimer l\'alerte ?'}</AlertDialogTitle>
                <AlertDialogDescription>
                  {t?.deleteDialog?.description?.[language] || 'Cette action est irréversible. Vous ne recevrez plus de notifications pour cette alerte.'}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>{t?.deleteDialog?.cancel?.[language] || 'Annuler'}</AlertDialogCancel>
                <AlertDialogAction onClick={handleDeleteAlert} className="bg-red-600 hover:bg-red-700">
                  {t?.deleteDialog?.confirm?.[language] || 'Supprimer'}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </motion.div>
      </div>
    </div>
  );
}
