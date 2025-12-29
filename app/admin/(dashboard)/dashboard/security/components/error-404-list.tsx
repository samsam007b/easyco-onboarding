'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FileQuestion, RefreshCw, ExternalLink, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { format } from 'date-fns';

interface Error404 {
  id: string;
  route: string;
  count: number;
  last_seen: string;
  referrers: string[];
}

interface Error404ListProps {
  initialErrors?: Error404[];
}

export function Error404List({ initialErrors = [] }: Error404ListProps) {
  const [errors, setErrors] = useState<Error404[]>(initialErrors);
  const [loading, setLoading] = useState(false);
  const [showAll, setShowAll] = useState(false);

  const fetchErrors = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/security/errors-404');
      if (response.ok) {
        const data = await response.json();
        setErrors(data.errors || []);
      }
    } catch (error) {
      console.error('Failed to fetch 404 errors:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialErrors.length === 0) {
      fetchErrors();
    }
  }, [initialErrors.length]);

  const displayedErrors = showAll ? errors : errors.slice(0, 5);
  const totalHits = errors.reduce((sum, e) => sum + e.count, 0);

  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-white flex items-center gap-2">
              <FileQuestion className="w-5 h-5 text-orange-400" />
              Erreurs 404
            </CardTitle>
            <CardDescription>
              {errors.length} routes · {totalHits} requetes
            </CardDescription>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={fetchErrors}
            disabled={loading}
          >
            <RefreshCw className={cn('w-4 h-4', loading && 'animate-spin')} />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {errors.length === 0 ? (
          <div className="text-center py-8">
            <FileQuestion className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <p className="text-slate-400">Aucune erreur 404</p>
            <p className="text-xs text-slate-500 mt-1">C'est une bonne nouvelle!</p>
          </div>
        ) : (
          <div className="space-y-2">
            {displayedErrors.map((error) => (
              <div
                key={error.id}
                className="p-3 rounded-lg bg-slate-700/30 border border-slate-600/50"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <code className="text-sm text-orange-300 font-mono truncate">
                        {error.route}
                      </code>
                    </div>
                    {error.referrers?.length > 0 && (
                      <div className="mt-1 flex items-center gap-1 text-xs text-slate-500">
                        <ExternalLink className="w-3 h-3" />
                        <span className="truncate">
                          {error.referrers[0] === 'direct' ? 'Acces direct' : error.referrers[0]}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col items-end">
                    <Badge className="bg-orange-500/10 text-orange-400 border-orange-500/30">
                      {error.count}x
                    </Badge>
                    <span className="text-xs text-slate-500 mt-1">
                      {format(new Date(error.last_seen), 'dd/MM HH:mm')}
                    </span>
                  </div>
                </div>
              </div>
            ))}

            {errors.length > 5 && (
              <Button
                variant="ghost"
                size="sm"
                className="w-full text-slate-400"
                onClick={() => setShowAll(!showAll)}
              >
                {showAll ? 'Voir moins' : `Voir tout (${errors.length})`}
                <ChevronDown className={cn('w-4 h-4 ml-2 transition-transform', showAll && 'rotate-180')} />
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
