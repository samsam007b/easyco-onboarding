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
import { Bell, Trash2, Edit, Plus, BellOff, MapPin, Euro, Home, Calendar } from 'lucide-react';
import { toast } from 'sonner';
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

export default function AlertsPage() {
  const router = useRouter();
  const supabase = createClient();
  const alertsService = new AlertsService(supabase);

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
      toast.error('Erreur lors du chargement des alertes');
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
      toast.success(!currentStatus ? 'Alerte activée' : 'Alerte désactivée');
    } catch (error) {
      console.error('Error toggling alert:', error);
      toast.error('Erreur lors de la modification');
    }
  };

  const handleDeleteAlert = async () => {
    if (!alertToDelete) return;

    try {
      await alertsService.deleteAlert(alertToDelete);
      setAlerts((prev) => prev.filter((alert) => alert.id !== alertToDelete));
      toast.success('Alerte supprimée');
      setAlertToDelete(null);
    } catch (error) {
      console.error('Error deleting alert:', error);
      toast.error('Erreur lors de la suppression');
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
      parts.push(`🛏️ ${alert.criteria.bedrooms} chambres`);
    }

    if (alert.criteria.propertyType && alert.criteria.propertyType !== 'all') {
      parts.push(`🏠 ${alert.criteria.propertyType}`);
    }

    if (alert.criteria.furnished !== null && alert.criteria.furnished !== undefined) {
      parts.push(alert.criteria.furnished ? '✅ Meublé' : '❌ Non meublé');
    }

    return parts;
  };

  const getFrequencyLabel = (frequency: string) => {
    switch (frequency) {
      case 'instant':
        return 'Instantané';
      case 'daily':
        return 'Quotidien';
      case 'weekly':
        return 'Hebdomadaire';
      default:
        return frequency;
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-yellow-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Chargement des alertes...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Mes Alertes</h1>
            <p className="text-gray-600">
              Recevez des notifications lorsqu'une propriété correspond à vos critères
            </p>
          </div>
          <Button onClick={() => router.push('/properties/browse')} className="bg-gradient-to-r from-yellow-600 to-orange-600">
            <Plus className="w-4 h-4 mr-2" />
            Créer une alerte
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Bell className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total</p>
                  <p className="text-2xl font-bold">{alerts.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <Bell className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Actives</p>
                  <p className="text-2xl font-bold">{alerts.filter((a) => a.is_active).length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                  <BellOff className="w-6 h-6 text-gray-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Inactives</p>
                  <p className="text-2xl font-bold">{alerts.filter((a) => !a.is_active).length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Alerts List */}
      <div className="space-y-4">
        {alerts.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucune alerte</h3>
              <p className="text-gray-600 mb-6">
                Créez votre première alerte pour être notifié des nouvelles propriétés
              </p>
              <Button onClick={() => router.push('/properties/browse')}>
                <Plus className="w-4 h-4 mr-2" />
                Créer une alerte
              </Button>
            </CardContent>
          </Card>
        ) : (
          alerts.map((alert) => (
            <Card key={alert.id} className={!alert.is_active ? 'opacity-60' : ''}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <CardTitle className="text-xl">{alert.name}</CardTitle>
                      {alert.is_active ? (
                        <Badge className="bg-green-100 text-green-700">Active</Badge>
                      ) : (
                        <Badge variant="secondary">Inactive</Badge>
                      )}
                    </div>
                    <CardDescription>
                      Créée {new Date(alert.created_at).toLocaleDateString('fr-FR')}
                      {alert.last_notified_at && (
                        <> • Dernière notification {new Date(alert.last_notified_at).toLocaleDateString('fr-FR')}</>
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
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Critères de recherche</h4>
                  <div className="flex flex-wrap gap-2">
                    {formatCriteria(alert).map((criterion, index) => (
                      <Badge key={index} variant="outline" className="text-sm">
                        {criterion}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Notification Settings */}
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Notifications</h4>
                  <div className="flex flex-wrap gap-2">
                    {alert.email_notifications && (
                      <Badge variant="outline" className="text-sm">
                        📧 Email
                      </Badge>
                    )}
                    {alert.in_app_notifications && (
                      <Badge variant="outline" className="text-sm">
                        🔔 In-app
                      </Badge>
                    )}
                    <Badge variant="outline" className="text-sm">
                      📅 {getFrequencyLabel(alert.notification_frequency)}
                    </Badge>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-4 border-t">
                  <Button variant="outline" size="sm" onClick={() => router.push(`/dashboard/searcher/alerts/${alert.id}/edit`)}>
                    <Edit className="w-4 h-4 mr-2" />
                    Modifier
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setAlertToDelete(alert.id)} className="text-red-600 hover:text-red-700">
                    <Trash2 className="w-4 h-4 mr-2" />
                    Supprimer
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!alertToDelete} onOpenChange={() => setAlertToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer l'alerte ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. Vous ne recevrez plus de notifications pour cette alerte.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteAlert} className="bg-red-600 hover:bg-red-700">
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
