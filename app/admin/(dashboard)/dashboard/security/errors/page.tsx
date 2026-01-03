'use client';

import { useState, useEffect, useCallback, useTransition } from 'react';
import { createClient } from '@/lib/auth/supabase-client';
import Link from 'next/link';
import {
  ArrowLeft,
  Bug,
  RefreshCw,
  Check,
  RotateCcw,
  Loader2,
  Filter,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  XCircle,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils/cn';
import { toast } from 'sonner';
import { getHookTranslation } from '@/lib/i18n/get-language';
import { resolveError, reopenError, bulkResolveErrors } from '../actions';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';

interface SecurityError {
  id: string;
  error_type: string;
  severity: string;
  message: string;
  route: string | null;
  resolved: boolean;
  resolved_at: string | null;
  resolved_by: string | null;
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
type StatusFilter = 'all' | 'resolved' | 'unresolved';

export default function ErrorsPage() {
  const supabase = createClient();
  const [errors, setErrors] = useState<SecurityError[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [severityFilter, setSeverityFilter] = useState<SeverityFilter>('all');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [selectedErrors, setSelectedErrors] = useState<Set<string>>(new Set());
  const [detailError, setDetailError] = useState<SecurityError | null>(null);

  const loadErrors = useCallback(async () => {
    setIsLoading(true);
    try {
      let query = supabase
        .from('security_errors')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false });

      // Apply filters
      if (severityFilter !== 'all') {
        query = query.eq('severity', severityFilter);
      }
      if (statusFilter === 'resolved') {
        query = query.eq('resolved', true);
      } else if (statusFilter === 'unresolved') {
        query = query.eq('resolved', false);
      }

      // Pagination
      const from = page * ITEMS_PER_PAGE;
      const to = from + ITEMS_PER_PAGE - 1;
      query = query.range(from, to);

      const { data, count, error } = await query;

      if (error) throw error;

      setErrors(data || []);
      setTotalCount(count || 0);
    } catch (error) {
      console.error('[ErrorsPage] Error loading:', error);
      toast.error(getHookTranslation('security', 'loadError'));
    } finally {
      setIsLoading(false);
    }
  }, [supabase, page, severityFilter, statusFilter]);

  useEffect(() => {
    loadErrors();
  }, [loadErrors]);

  // Reset page when filters change
  useEffect(() => {
    setPage(0);
    setSelectedErrors(new Set());
  }, [severityFilter, statusFilter]);

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  const handleResolve = async (errorId: string) => {
    setProcessingId(errorId);
    startTransition(async () => {
      const result = await resolveError(errorId);
      if (result.success) {
        toast.success(getHookTranslation('security', 'errorMarkedResolved'));
        loadErrors();
        setSelectedErrors(prev => {
          const next = new Set(prev);
          next.delete(errorId);
          return next;
        });
      } else {
        toast.error(result.error || 'Erreur');
      }
      setProcessingId(null);
    });
  };

  const handleReopen = async (errorId: string) => {
    setProcessingId(errorId);
    startTransition(async () => {
      const result = await reopenError(errorId);
      if (result.success) {
        toast.info(getHookTranslation('security', 'errorReopened'));
        loadErrors();
      } else {
        toast.error(result.error || 'Erreur');
      }
      setProcessingId(null);
    });
  };

  const handleBulkResolve = async () => {
    if (selectedErrors.size === 0) return;

    startTransition(async () => {
      const result = await bulkResolveErrors(Array.from(selectedErrors));
      if (result.success) {
        toast.success(`${result.count} erreurs resolues`);
        setSelectedErrors(new Set());
        loadErrors();
      } else {
        toast.error(result.error || 'Erreur');
      }
    });
  };

  const toggleSelection = (errorId: string, resolved: boolean) => {
    if (resolved) return;
    setSelectedErrors(prev => {
      const next = new Set(prev);
      if (next.has(errorId)) {
        next.delete(errorId);
      } else {
        next.add(errorId);
      }
      return next;
    });
  };

  const selectAllUnresolved = () => {
    const unresolvedIds = errors.filter(e => !e.resolved).map(e => e.id);
    setSelectedErrors(new Set(unresolvedIds));
  };

  const unresolvedOnPage = errors.filter(e => !e.resolved);

  const severityFilters: { key: SeverityFilter; label: string }[] = [
    { key: 'all', label: 'Toutes' },
    { key: 'critical', label: 'Critiques' },
    { key: 'high', label: 'Hautes' },
    { key: 'medium', label: 'Moyennes' },
    { key: 'low', label: 'Basses' },
  ];

  const statusFilters: { key: StatusFilter; label: string }[] = [
    { key: 'all', label: 'Tous' },
    { key: 'unresolved', label: 'Non resolues' },
    { key: 'resolved', label: 'Resolues' },
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
              <Bug className="w-6 h-6 text-red-400" />
              Erreurs de Securite
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              {totalCount} erreurs au total
            </p>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={loadErrors}
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
              {selectedErrors.size > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleBulkResolve}
                  disabled={isPending}
                  className="text-green-400 hover:text-green-300"
                >
                  {isPending ? (
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  ) : (
                    <Check className="w-4 h-4 mr-2" />
                  )}
                  Resoudre ({selectedErrors.size})
                </Button>
              )}
              {unresolvedOnPage.length > 1 && selectedErrors.size !== unresolvedOnPage.length && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={selectAllUnresolved}
                  className="text-slate-400 hover:text-white"
                >
                  Tout selectionner
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Errors List */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardContent className="p-4">
          {isLoading ? (
            <div className="space-y-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-slate-700/30 animate-pulse">
                  <div className="w-8 h-8 rounded bg-slate-600" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-3/4 bg-slate-600 rounded" />
                    <div className="h-3 w-1/2 bg-slate-700 rounded" />
                  </div>
                </div>
              ))}
            </div>
          ) : errors.length === 0 ? (
            <div className="text-center py-12">
              <CheckCircle className="w-12 h-12 text-green-500/50 mx-auto mb-3" />
              <p className="text-slate-400">Aucune erreur trouvee</p>
              <p className="text-slate-500 text-sm mt-1">
                Essayez de modifier les filtres
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {errors.map((error) => (
                <div
                  key={error.id}
                  className={cn(
                    'flex items-start gap-3 p-4 rounded-lg transition-all cursor-pointer',
                    error.resolved ? 'bg-slate-700/20 opacity-60' : 'bg-slate-700/30 hover:bg-slate-700/50',
                    selectedErrors.has(error.id) && 'ring-2 ring-blue-500/50 bg-blue-500/10',
                    processingId === error.id && 'opacity-50'
                  )}
                  onClick={() => toggleSelection(error.id, error.resolved)}
                >
                  {/* Selection checkbox for unresolved */}
                  {!error.resolved && (
                    <div
                      className={cn(
                        'w-5 h-5 rounded border-2 flex items-center justify-center transition-all flex-shrink-0 mt-0.5',
                        selectedErrors.has(error.id)
                          ? 'bg-blue-500 border-blue-500'
                          : 'border-slate-500'
                      )}
                    >
                      {selectedErrors.has(error.id) && <Check className="w-3 h-3 text-white" />}
                    </div>
                  )}

                  {/* Status icon */}
                  <div className={cn('p-2 rounded flex-shrink-0', getSeverityColor(error.severity))}>
                    {error.resolved ? (
                      <CheckCircle className="w-4 h-4" />
                    ) : (
                      <XCircle className="w-4 h-4" />
                    )}
                  </div>

                  {/* Content */}
                  <div
                    className="flex-1 min-w-0 cursor-pointer"
                    onClick={(e) => { e.stopPropagation(); setDetailError(error); }}
                  >
                    <span className="text-sm text-white block hover:underline">
                      {error.message.length > 100 ? `${error.message.slice(0, 100)}...` : error.message}
                    </span>
                    <div className="flex items-center gap-2 mt-1 text-xs text-slate-500 flex-wrap">
                      <span className="font-medium">{error.error_type}</span>
                      {error.route && (
                        <>
                          <span>-</span>
                          <span className="font-mono">{error.route}</span>
                        </>
                      )}
                      <span>-</span>
                      <span>{formatDate(error.created_at)}</span>
                      {error.resolved && error.resolved_at && (
                        <>
                          <span>-</span>
                          <span className="text-green-400">Resolue le {formatDate(error.resolved_at)}</span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Severity + Actions */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Badge className={cn('text-xs', getSeverityColor(error.severity))}>
                      {error.severity}
                    </Badge>
                    {error.resolved ? (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => { e.stopPropagation(); handleReopen(error.id); }}
                        disabled={isPending}
                        className="text-slate-400 hover:text-white"
                        title="Reouvrir"
                      >
                        {processingId === error.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <RotateCcw className="w-4 h-4" />
                        )}
                      </Button>
                    ) : (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => { e.stopPropagation(); handleResolve(error.id); }}
                        disabled={isPending}
                        className="text-green-400 hover:text-green-300 hover:bg-green-500/10"
                        title="Marquer resolue"
                      >
                        {processingId === error.id ? (
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

      {/* Error Detail Dialog */}
      <Dialog open={!!detailError} onOpenChange={() => setDetailError(null)}>
        <DialogContent className="bg-slate-800 border-slate-700 text-white max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Bug className="w-5 h-5 text-red-400" />
              Detail de l'erreur
            </DialogTitle>
            <DialogDescription className="text-slate-400">
              {detailError?.error_type} - {detailError?.route || 'Route inconnue'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Badge className={cn(getSeverityColor(detailError?.severity || 'low'))}>
                {detailError?.severity}
              </Badge>
              <Badge className={detailError?.resolved ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}>
                {detailError?.resolved ? 'Resolue' : 'Non resolue'}
              </Badge>
            </div>
            <div className="p-4 bg-slate-900 rounded-lg">
              <pre className="text-sm text-slate-300 whitespace-pre-wrap font-mono">
                {detailError?.message}
              </pre>
            </div>
            <div className="text-xs text-slate-500 space-y-1">
              <p>Cree le: {detailError?.created_at && formatDate(detailError.created_at)}</p>
              {detailError?.resolved_at && (
                <p>Resolue le: {formatDate(detailError.resolved_at)}</p>
              )}
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="ghost">Fermer</Button>
            </DialogClose>
            {detailError && !detailError.resolved && (
              <Button
                onClick={() => {
                  handleResolve(detailError.id);
                  setDetailError(null);
                }}
                className="bg-green-600 hover:bg-green-700"
              >
                <Check className="w-4 h-4 mr-2" />
                Marquer resolue
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
