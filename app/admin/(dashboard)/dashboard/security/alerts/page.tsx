'use client';

import { useState, useEffect, useCallback, useTransition } from 'react';
import { createClient } from '@/lib/auth/supabase-client';
import Link from 'next/link';
import {
  ArrowLeft,
  AlertTriangle,
  AlertCircle,
  RefreshCw,
  Check,
  Loader2,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  Eye,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils/cn';
import { toast } from 'sonner';
import { getHookTranslation } from '@/lib/i18n/get-language';
import { acknowledgeAlert, bulkAcknowledgeAlerts } from '../actions';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';

interface SecurityAlert {
  id: string;
  severity: string;
  title: string;
  description: string;
  alert_type: string | null;
  source: string | null;
  acknowledged: boolean;
  acknowledged_at: string | null;
  acknowledged_by: string | null;
  metadata: Record<string, unknown> | null;
  created_at: string;
}

const ITEMS_PER_PAGE = 20;

const severityColors: Record<string, string> = {
  critical: 'bg-red-500/20 text-red-400 border-red-500/30',
  high: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  medium: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  low: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
};

function getSeverityColor(severity: string) {
  return severityColors[severity.toLowerCase()] || 'bg-slate-500/20 text-slate-400 border-slate-500/30';
}

function formatDate(date: string): string {
  return new Date(date).toLocaleString('fr-FR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

type SeverityFilter = 'all' | 'critical' | 'high' | 'medium' | 'low';
type StatusFilter = 'all' | 'active' | 'acknowledged';

export default function AlertsPage() {
  const supabase = createClient();
  const [alerts, setAlerts] = useState<SecurityAlert[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [severityFilter, setSeverityFilter] = useState<SeverityFilter>('all');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [isPending, startTransition] = useTransition();
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [selectedAlerts, setSelectedAlerts] = useState<Set<string>>(new Set());
  const [detailAlert, setDetailAlert] = useState<SecurityAlert | null>(null);

  const loadAlerts = useCallback(async () => {
    setIsLoading(true);
    try {
      let query = supabase
        .from('security_alerts')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false });

      // Apply filters
      if (severityFilter !== 'all') {
        query = query.eq('severity', severityFilter);
      }
      if (statusFilter === 'active') {
        query = query.eq('acknowledged', false);
      } else if (statusFilter === 'acknowledged') {
        query = query.eq('acknowledged', true);
      }

      // Pagination
      const from = page * ITEMS_PER_PAGE;
      const to = from + ITEMS_PER_PAGE - 1;
      query = query.range(from, to);

      const { data, count, error } = await query;

      if (error) throw error;

      setAlerts(data || []);
      setTotalCount(count || 0);
    } catch (error) {
      console.error('[AlertsPage] Error loading:', error);
      toast.error(getHookTranslation('security', 'loadError'));
    } finally {
      setIsLoading(false);
    }
  }, [supabase, page, severityFilter, statusFilter]);

  useEffect(() => {
    loadAlerts();
  }, [loadAlerts]);

  // Reset page when filters change
  useEffect(() => {
    setPage(0);
    setSelectedAlerts(new Set());
  }, [severityFilter, statusFilter]);

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  const handleAcknowledge = async (alertId: string) => {
    setProcessingId(alertId);
    startTransition(async () => {
      const result = await acknowledgeAlert(alertId);
      if (result.success) {
        toast.success(getHookTranslation('security', 'alertAcknowledged'));
        loadAlerts();
        setSelectedAlerts(prev => {
          const next = new Set(prev);
          next.delete(alertId);
          return next;
        });
      } else {
        toast.error(result.error || 'Erreur');
      }
      setProcessingId(null);
    });
  };

  const handleBulkAcknowledge = async () => {
    if (selectedAlerts.size === 0) return;

    startTransition(async () => {
      const result = await bulkAcknowledgeAlerts(Array.from(selectedAlerts));
      if (result.success) {
        toast.success(`${result.count} alertes acquittees`);
        setSelectedAlerts(new Set());
        loadAlerts();
      } else {
        toast.error(result.error || 'Erreur');
      }
    });
  };

  const toggleSelection = (alertId: string, acknowledged: boolean) => {
    if (acknowledged) return;
    setSelectedAlerts(prev => {
      const next = new Set(prev);
      if (next.has(alertId)) {
        next.delete(alertId);
      } else {
        next.add(alertId);
      }
      return next;
    });
  };

  const selectAllActive = () => {
    const activeIds = alerts.filter(a => !a.acknowledged).map(a => a.id);
    setSelectedAlerts(new Set(activeIds));
  };

  const activeOnPage = alerts.filter(a => !a.acknowledged);

  const severityFilters: { key: SeverityFilter; label: string }[] = [
    { key: 'all', label: 'Toutes' },
    { key: 'critical', label: 'Critiques' },
    { key: 'high', label: 'Hautes' },
    { key: 'medium', label: 'Moyennes' },
    { key: 'low', label: 'Basses' },
  ];

  const statusFilters: { key: StatusFilter; label: string }[] = [
    { key: 'all', label: 'Toutes' },
    { key: 'active', label: 'Actives' },
    { key: 'acknowledged', label: 'Acquittees' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/dashboard/security"
            className="p-2 rounded-lg bg-slate-700/50 hover:bg-slate-700 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-slate-400" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <AlertTriangle className="w-6 h-6 text-orange-400" />
              Alertes de Securite
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              {totalCount} alertes au total
            </p>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={loadAlerts}
          disabled={isLoading}
          className="gap-2"
        >
          <RefreshCw className={cn('w-4 h-4', isLoading && 'animate-spin')} />
          Actualiser
        </Button>
      </div>

      {/* Filters + Bulk Actions */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardContent className="p-4">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-4">
              {/* Severity Filter */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-400">Severite:</span>
                <div className="flex gap-1">
                  {severityFilters.map((f) => (
                    <Button
                      key={f.key}
                      variant="ghost"
                      size="sm"
                      onClick={() => setSeverityFilter(f.key)}
                      className={cn(
                        'text-xs',
                        severityFilter === f.key
                          ? 'bg-slate-700 text-white'
                          : 'text-slate-400 hover:text-white'
                      )}
                    >
                      {f.label}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Status Filter */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-400">Statut:</span>
                <div className="flex gap-1">
                  {statusFilters.map((f) => (
                    <Button
                      key={f.key}
                      variant="ghost"
                      size="sm"
                      onClick={() => setStatusFilter(f.key)}
                      className={cn(
                        'text-xs',
                        statusFilter === f.key
                          ? 'bg-slate-700 text-white'
                          : 'text-slate-400 hover:text-white'
                      )}
                    >
                      {f.label}
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            {/* Bulk Actions */}
            <div className="flex items-center gap-2">
              {selectedAlerts.size > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleBulkAcknowledge}
                  disabled={isPending}
                  className="text-green-400 hover:text-green-300"
                >
                  {isPending ? (
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  ) : (
                    <Check className="w-4 h-4 mr-2" />
                  )}
                  Acquitter ({selectedAlerts.size})
                </Button>
              )}
              {activeOnPage.length > 1 && selectedAlerts.size !== activeOnPage.length && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={selectAllActive}
                  className="text-slate-400 hover:text-white"
                >
                  Tout selectionner
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Alerts List */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardContent className="p-4">
          {isLoading ? (
            <div className="space-y-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-slate-700/30 animate-pulse">
                  <div className="w-10 h-10 rounded bg-slate-600" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-3/4 bg-slate-600 rounded" />
                    <div className="h-3 w-1/2 bg-slate-700 rounded" />
                  </div>
                </div>
              ))}
            </div>
          ) : alerts.length === 0 ? (
            <div className="text-center py-12">
              <CheckCircle className="w-12 h-12 text-green-500/50 mx-auto mb-3" />
              <p className="text-slate-400">Aucune alerte trouvee</p>
              <p className="text-slate-500 text-sm mt-1">
                Essayez de modifier les filtres
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {alerts.map((alert) => (
                <div
                  key={alert.id}
                  className={cn(
                    'flex items-start gap-3 p-4 rounded-lg transition-all cursor-pointer',
                    alert.acknowledged ? 'bg-slate-700/20 opacity-60' : 'bg-slate-700/30 hover:bg-slate-700/50',
                    selectedAlerts.has(alert.id) && 'ring-2 ring-blue-500/50 bg-blue-500/10',
                    processingId === alert.id && 'opacity-50'
                  )}
                  onClick={() => toggleSelection(alert.id, alert.acknowledged)}
                >
                  {/* Selection checkbox for active */}
                  {!alert.acknowledged && (
                    <div
                      className={cn(
                        'w-5 h-5 rounded border-2 flex items-center justify-center transition-all flex-shrink-0 mt-0.5',
                        selectedAlerts.has(alert.id)
                          ? 'bg-blue-500 border-blue-500'
                          : 'border-slate-500'
                      )}
                    >
                      {selectedAlerts.has(alert.id) && <Check className="w-3 h-3 text-white" />}
                    </div>
                  )}

                  {/* Icon */}
                  <div className={cn('p-2 rounded flex-shrink-0', getSeverityColor(alert.severity))}>
                    {alert.acknowledged ? (
                      <CheckCircle className="w-4 h-4" />
                    ) : (
                      <AlertCircle className="w-4 h-4" />
                    )}
                  </div>

                  {/* Content */}
                  <div
                    className="flex-1 min-w-0 cursor-pointer"
                    onClick={(e) => { e.stopPropagation(); setDetailAlert(alert); }}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-white hover:underline">{alert.title}</span>
                      <Badge className={cn('text-xs', getSeverityColor(alert.severity))}>
                        {alert.severity}
                      </Badge>
                      {alert.alert_type && (
                        <Badge className="text-xs bg-slate-600/50 text-slate-300">
                          {alert.alert_type}
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-2">{alert.description}</p>
                    <div className="flex items-center gap-2 mt-1 text-xs text-slate-500">
                      <span>{formatDate(alert.created_at)}</span>
                      {alert.acknowledged && alert.acknowledged_at && (
                        <>
                          <span>-</span>
                          <span className="text-green-400">Acquittee le {formatDate(alert.acknowledged_at)}</span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => { e.stopPropagation(); setDetailAlert(alert); }}
                      className="text-slate-400 hover:text-white"
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    {!alert.acknowledged && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => { e.stopPropagation(); handleAcknowledge(alert.id); }}
                        disabled={isPending}
                        className="text-green-400 hover:text-green-300 hover:bg-green-500/10"
                        title="Acquitter"
                      >
                        {processingId === alert.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Check className="w-4 h-4" />
                        )}
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-slate-400">
            Page {page + 1} sur {totalPages} ({totalCount} resultats)
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setPage(p => Math.max(0, p - 1))}
              disabled={page === 0 || isLoading}
              className="text-slate-400 hover:text-white"
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Precedent
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
              disabled={page >= totalPages - 1 || isLoading}
              className="text-slate-400 hover:text-white"
            >
              Suivant
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>
      )}

      {/* Alert Detail Dialog */}
      <Dialog open={!!detailAlert} onOpenChange={() => setDetailAlert(null)}>
        <DialogContent className="bg-slate-800 border-slate-700 text-white max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-orange-400" />
              Detail de l'alerte
            </DialogTitle>
            <DialogDescription className="text-slate-400">
              {detailAlert?.alert_type || 'Alerte'} - {detailAlert?.source || 'Source inconnue'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Badge className={cn(getSeverityColor(detailAlert?.severity || 'low'))}>
                {detailAlert?.severity}
              </Badge>
              <Badge className={detailAlert?.acknowledged ? 'bg-green-500/20 text-green-400' : 'bg-orange-500/20 text-orange-400'}>
                {detailAlert?.acknowledged ? 'Acquittee' : 'Active'}
              </Badge>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">{detailAlert?.title}</h3>
              <p className="text-sm text-slate-300 mt-2">{detailAlert?.description}</p>
            </div>
            {detailAlert?.metadata && Object.keys(detailAlert.metadata).length > 0 && (
              <div className="p-4 bg-slate-900 rounded-lg">
                <p className="text-xs text-slate-500 mb-2">Metadata</p>
                <pre className="text-xs text-slate-400 whitespace-pre-wrap font-mono">
                  {JSON.stringify(detailAlert.metadata, null, 2)}
                </pre>
              </div>
            )}
            <div className="text-xs text-slate-500 space-y-1">
              <p>Cree le: {detailAlert?.created_at && formatDate(detailAlert.created_at)}</p>
              {detailAlert?.acknowledged_at && (
                <p>Acquittee le: {formatDate(detailAlert.acknowledged_at)}</p>
              )}
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="ghost">Fermer</Button>
            </DialogClose>
            {detailAlert && !detailAlert.acknowledged && (
              <Button
                onClick={() => {
                  handleAcknowledge(detailAlert.id);
                  setDetailAlert(null);
                }}
                className="bg-green-600 hover:bg-green-700"
              >
                <Check className="w-4 h-4 mr-2" />
                Acquitter
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
