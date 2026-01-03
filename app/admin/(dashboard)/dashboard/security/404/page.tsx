'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  FileQuestion,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  TrendingUp,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils/cn';
import { toast } from 'sonner';
import { getHookTranslation } from '@/lib/i18n/get-language';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface Error404 {
  id: string;
  route: string;
  count: number;
  last_seen: string;
  first_seen?: string;
  referrers: string[];
}

const ITEMS_PER_PAGE = 20;

export default function Error404Page() {
  const [errors, setErrors] = useState<Error404[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [sortBy, setSortBy] = useState<'count' | 'recent'>('count');

  const loadErrors = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: ITEMS_PER_PAGE.toString(),
        sort: sortBy,
      });

      const response = await fetch(`/api/admin/security/errors-404?${params}`);
      if (response.ok) {
        const data = await response.json();
        setErrors(data.errors || []);
        setTotalCount(data.total || data.errors?.length || 0);
      }
    } catch (error) {
      console.error('[Error404Page] Error loading:', error);
      toast.error(getHookTranslation('security', 'loadError'));
    } finally {
      setIsLoading(false);
    }
  }, [page, sortBy]);

  useEffect(() => {
    loadErrors();
  }, [loadErrors]);

  // Reset page when sort changes
  useEffect(() => {
    setPage(0);
  }, [sortBy]);

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);
  const totalHits = errors.reduce((sum, e) => sum + e.count, 0);

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
              <FileQuestion className="w-6 h-6 text-orange-400" />
              Erreurs 404
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              {totalCount} routes non trouvees
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

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-3 rounded-lg bg-orange-500/10">
              <FileQuestion className="w-6 h-6 text-orange-400" />
            </div>
            <div>
              <p className="text-sm text-slate-400">Routes uniques</p>
              <p className="text-2xl font-bold text-orange-400">{totalCount}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-3 rounded-lg bg-yellow-500/10">
              <TrendingUp className="w-6 h-6 text-yellow-400" />
            </div>
            <div>
              <p className="text-sm text-slate-400">Total requetes</p>
              <p className="text-2xl font-bold text-yellow-400">{totalHits}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sort */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-400">Trier par:</span>
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSortBy('count')}
                className={cn(
                  'text-xs',
                  sortBy === 'count'
                    ? 'bg-slate-700 text-white'
                    : 'text-slate-400 hover:text-white'
                )}
              >
                Plus frequentes
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSortBy('recent')}
                className={cn(
                  'text-xs',
                  sortBy === 'recent'
                    ? 'bg-slate-700 text-white'
                    : 'text-slate-400 hover:text-white'
                )}
              >
                Plus recentes
              </Button>
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
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-3/4 bg-slate-600 rounded" />
                    <div className="h-3 w-1/2 bg-slate-700 rounded" />
                  </div>
                  <div className="w-16 h-6 bg-slate-600 rounded" />
                </div>
              ))}
            </div>
          ) : errors.length === 0 ? (
            <div className="text-center py-12">
              <FileQuestion className="w-12 h-12 text-green-500/50 mx-auto mb-3" />
              <p className="text-slate-400">Aucune erreur 404</p>
              <p className="text-slate-500 text-sm mt-1">
                C'est une bonne nouvelle!
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {errors.map((error) => (
                <div
                  key={error.id}
                  className="p-4 rounded-lg bg-slate-700/30 border border-slate-600/50"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <code className="text-sm text-orange-300 font-mono block truncate">
                        {error.route}
                      </code>
                      {error.referrers?.length > 0 && (
                        <div className="mt-2 space-y-1">
                          <p className="text-xs text-slate-500 font-medium">Referrers:</p>
                          {error.referrers.slice(0, 3).map((referrer, i) => (
                            <div key={i} className="flex items-center gap-1 text-xs text-slate-400">
                              <ExternalLink className="w-3 h-3" />
                              <span className="truncate">
                                {referrer === 'direct' ? 'Acces direct' : referrer}
                              </span>
                            </div>
                          ))}
                          {error.referrers.length > 3 && (
                            <span className="text-xs text-slate-500">
                              +{error.referrers.length - 3} autres
                            </span>
                          )}
                        </div>
                      )}
                      <div className="mt-2 text-xs text-slate-500">
                        Derniere occurrence: {format(new Date(error.last_seen), 'dd MMM yyyy HH:mm', { locale: fr })}
                      </div>
                    </div>
                    <div className="flex flex-col items-end flex-shrink-0">
                      <Badge className="bg-orange-500/10 text-orange-400 border-orange-500/30 text-lg px-3">
                        {error.count}x
                      </Badge>
                    </div>
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
    </div>
  );
}
