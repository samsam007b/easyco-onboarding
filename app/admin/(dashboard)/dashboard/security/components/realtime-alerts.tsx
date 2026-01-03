'use client';

import { useState, useTransition } from 'react';
import { AlertTriangle, AlertCircle, CheckCircle, Eye, Check, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils/cn';
import { acknowledgeAlert, bulkAcknowledgeAlerts } from '../actions';
import { toast } from 'sonner';
import { getHookTranslation } from '@/lib/i18n/get-language';

interface SecurityAlert {
  id: string;
  severity: string;
  title: string;
  description: string;
  acknowledged: boolean;
  created_at: string;
}

interface RealtimeAlertsProps {
  alerts: SecurityAlert[];
  totalActive: number;
}

const severityColors: Record<string, string> = {
  critical: 'bg-red-500/20 text-red-400 border-red-500/30',
  high: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  medium: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  low: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
};

function getSeverityColor(severity: string) {
  return severityColors[severity.toLowerCase()] || 'bg-slate-500/20 text-slate-400 border-slate-500/30';
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function RealtimeAlerts({ alerts, totalActive }: RealtimeAlertsProps) {
  const [isPending, startTransition] = useTransition();
  const [acknowledgingId, setAcknowledgingId] = useState<string | null>(null);

  const handleAcknowledge = async (alertId: string) => {
    setAcknowledgingId(alertId);
    startTransition(async () => {
      const result = await acknowledgeAlert(alertId);
      if (result.success) {
        toast.success(getHookTranslation('security', 'alertAcknowledged'));
      } else {
        toast.error(result.error || 'Erreur');
      }
      setAcknowledgingId(null);
    });
  };

  const handleAcknowledgeAll = async () => {
    if (alerts.length === 0) return;

    startTransition(async () => {
      const result = await bulkAcknowledgeAlerts(alerts.map(a => a.id));
      if (result.success) {
        toast.success(`${result.count} alertes acquittees`);
      } else {
        toast.error(result.error || 'Erreur');
      }
    });
  };

  return (
    <Card className="bg-slate-800/50 border-slate-700 lg:col-span-2">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-white flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-orange-400" />
              Alertes Actives
              {alerts.length > 0 && (
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
                </span>
              )}
            </CardTitle>
            <CardDescription>{totalActive} en attente</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            {alerts.length > 1 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleAcknowledgeAll}
                disabled={isPending}
                className="text-slate-400 hover:text-white"
              >
                {isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : (
                  <Check className="w-4 h-4 mr-2" />
                )}
                Tout acquitter
              </Button>
            )}
            {totalActive > 0 && (
              <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30">
                {totalActive} non acquittees
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {alerts.length === 0 ? (
          <div className="text-center py-8">
            <CheckCircle className="w-12 h-12 text-green-500/50 mx-auto mb-3" />
            <p className="text-slate-400">Aucune alerte active</p>
          </div>
        ) : (
          <div className="space-y-3">
            {alerts.map((alert) => (
              <div
                key={alert.id}
                className={cn(
                  'flex items-start gap-3 p-3 rounded-lg bg-slate-700/30 hover:bg-slate-700/50 transition-all',
                  acknowledgingId === alert.id && 'opacity-50'
                )}
              >
                <div className={cn('p-2 rounded-lg', getSeverityColor(alert.severity))}>
                  <AlertCircle className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-white truncate">{alert.title}</span>
                    <Badge className={cn('text-xs', getSeverityColor(alert.severity))}>
                      {alert.severity}
                    </Badge>
                  </div>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2">{alert.description}</p>
                  <p className="text-xs text-slate-500 mt-1">{formatDate(alert.created_at)}</p>
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-slate-400 hover:text-white"
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleAcknowledge(alert.id)}
                    disabled={isPending}
                    className="text-green-400 hover:text-green-300 hover:bg-green-500/10"
                  >
                    {acknowledgingId === alert.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Check className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
