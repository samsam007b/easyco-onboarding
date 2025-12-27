'use client';

import { useState, useTransition } from 'react';
import { Bug, CheckCircle, XCircle, Check, RotateCcw, Loader2, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils/cn';
import { resolveError, reopenError, bulkResolveErrors } from '../actions';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
  created_at: string;
}

interface RealtimeErrorsProps {
  errors: SecurityError[];
  totalErrors: number;
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

export function RealtimeErrors({ errors, totalErrors }: RealtimeErrorsProps) {
  const [isPending, startTransition] = useTransition();
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [selectedErrors, setSelectedErrors] = useState<Set<string>>(new Set());
  const [detailError, setDetailError] = useState<SecurityError | null>(null);

  const unresolvedErrors = errors.filter(e => !e.resolved);

  const handleResolve = async (errorId: string) => {
    setProcessingId(errorId);
    startTransition(async () => {
      const result = await resolveError(errorId);
      if (result.success) {
        toast.success('Erreur marquee comme resolue');
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
        toast.info('Erreur reeouverte');
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
      } else {
        toast.error(result.error || 'Erreur');
      }
    });
  };

  const toggleSelection = (errorId: string) => {
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
    setSelectedErrors(new Set(unresolvedErrors.map(e => e.id)));
  };

  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-white flex items-center gap-2">
            <Bug className="w-5 h-5 text-red-400" />
            Erreurs Recentes
          </CardTitle>
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
            {unresolvedErrors.length > 1 && selectedErrors.size !== unresolvedErrors.length && (
              <Button
                variant="ghost"
                size="sm"
                onClick={selectAllUnresolved}
                className="text-slate-400 hover:text-white"
              >
                Tout selectionner
              </Button>
            )}
            <Badge className="bg-slate-600/50 text-slate-300">{totalErrors} total</Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {errors.length === 0 ? (
          <div className="text-center py-8">
            <CheckCircle className="w-12 h-12 text-green-500/50 mx-auto mb-3" />
            <p className="text-slate-400">Aucune erreur recente</p>
          </div>
        ) : (
          <div className="space-y-2">
            {errors.map((error) => (
              <div
                key={error.id}
                className={cn(
                  'flex items-start gap-3 p-3 rounded-lg transition-all cursor-pointer',
                  error.resolved ? 'bg-slate-700/20 opacity-60' : 'bg-slate-700/30 hover:bg-slate-700/50',
                  selectedErrors.has(error.id) && 'ring-2 ring-blue-500/50 bg-blue-500/10',
                  processingId === error.id && 'opacity-50'
                )}
                onClick={() => !error.resolved && toggleSelection(error.id)}
              >
                {/* Selection checkbox for unresolved */}
                {!error.resolved && (
                  <div
                    className={cn(
                      'w-5 h-5 rounded border-2 flex items-center justify-center transition-all',
                      selectedErrors.has(error.id)
                        ? 'bg-blue-500 border-blue-500'
                        : 'border-slate-500'
                    )}
                  >
                    {selectedErrors.has(error.id) && <Check className="w-3 h-3 text-white" />}
                  </div>
                )}

                {/* Status icon */}
                <div className={cn('p-1.5 rounded', getSeverityColor(error.severity))}>
                  {error.resolved ? (
                    <CheckCircle className="w-3 h-3" />
                  ) : (
                    <XCircle className="w-3 h-3" />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0" onClick={(e) => { e.stopPropagation(); setDetailError(error); }}>
                  <span className="text-sm text-white truncate block hover:underline">
                    {error.message.slice(0, 60)}...
                  </span>
                  <div className="flex items-center gap-2 mt-1 text-xs text-slate-500">
                    <span>{error.error_type}</span>
                    {error.route && (
                      <>
                        <span>-</span>
                        <span className="font-mono">{error.route}</span>
                      </>
                    )}
                  </div>
                </div>

                {/* Severity + Actions */}
                <div className="flex items-center gap-2">
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
            <div className="text-xs text-slate-500">
              Cree le: {detailError?.created_at && new Date(detailError.created_at).toLocaleString('fr-FR')}
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
    </Card>
  );
}
