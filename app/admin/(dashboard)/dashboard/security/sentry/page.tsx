'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Bug,
  RefreshCw,
  ExternalLink,
  AlertTriangle,
  AlertCircle,
  Info,
  Users,
  Activity,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils/cn';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

interface SentryIssue {
  id: string;
  shortId: string;
  title: string;
  culprit: string;
  level: string;
  status: string;
  count: number;
  userCount: number;
  firstSeen: string;
  lastSeen: string;
  permalink: string;
  project?: {
    name: string;
    slug: string;
  };
}

type LevelFilter = 'all' | 'error' | 'warning' | 'info';
type StatusFilter = 'all' | 'unresolved' | 'resolved' | 'ignored';

export default function SentryPage() {
  const [issues, setIssues] = useState<SentryIssue[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [levelFilter, setLevelFilter] = useState<LevelFilter>('all');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('unresolved');

  const loadIssues = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        status: statusFilter === 'all' ? '' : statusFilter,
      });

      const response = await fetch(`/api/admin/security/sentry-issues?${params}`);
      const data = await response.json();

      if (data.error && !data.issues) {
        setError(data.error);
        setIssues([]);
      } else {
        setIssues(data.issues || []);
        if (data.error) {
          setError(data.error);
        }
      }
    } catch (err) {
      setError('Impossible de recuperer les issues Sentry');
      setIssues([]);
    } finally {
      setIsLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => {
    loadIssues();
  }, [loadIssues]);

  const getLevelIcon = (level: string) => {
    switch (level) {
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-400" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-yellow-400" />;
      default:
        return <Info className="w-4 h-4 text-blue-400" />;
    }
  };

  const getLevelBadge = (level: string) => {
    switch (level) {
      case 'error':
        return <Badge className="text-xs bg-red-500/10 text-red-400 border-red-500/30">Error</Badge>;
      case 'warning':
        return <Badge className="text-xs bg-yellow-500/10 text-yellow-400 border-yellow-500/30">Warning</Badge>;
      default:
        return <Badge className="text-xs bg-blue-500/10 text-blue-400 border-blue-500/30">{level}</Badge>;
    }
  };

  // Filter by level
  const filteredIssues = levelFilter === 'all'
    ? issues
    : issues.filter(issue => issue.level === levelFilter);

  const totalEvents = issues.reduce((sum, issue) => sum + issue.count, 0);
  const totalUsers = issues.reduce((sum, issue) => sum + issue.userCount, 0);

  const levelFilters: { key: LevelFilter; label: string }[] = [
    { key: 'all', label: 'Tous' },
    { key: 'error', label: 'Errors' },
    { key: 'warning', label: 'Warnings' },
    { key: 'info', label: 'Info' },
  ];

  const statusFilters: { key: StatusFilter; label: string }[] = [
    { key: 'unresolved', label: 'Non resolues' },
    { key: 'resolved', label: 'Resolues' },
    { key: 'ignored', label: 'Ignorees' },
    { key: 'all', label: 'Toutes' },
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
              <Bug className="w-6 h-6 text-purple-400" />
              Sentry Issues
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              {issues.length} issues au total
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <a
            href="https://easyco-6g.sentry.io/issues/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-3 py-2 text-sm text-purple-400 hover:text-purple-300 transition-colors"
          >
            Ouvrir Sentry
            <ExternalLink className="w-4 h-4" />
          </a>
          <Button
            variant="outline"
            size="sm"
            onClick={loadIssues}
            disabled={isLoading}
            className="gap-2"
          >
            <RefreshCw className={cn('w-4 h-4', isLoading && 'animate-spin')} />
            Actualiser
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-3 rounded-lg bg-purple-500/10">
              <Bug className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <p className="text-sm text-slate-400">Issues</p>
              <p className="text-2xl font-bold text-purple-400">{issues.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-3 rounded-lg bg-orange-500/10">
              <Activity className="w-6 h-6 text-orange-400" />
            </div>
            <div>
              <p className="text-sm text-slate-400">Evenements</p>
              <p className="text-2xl font-bold text-orange-400">{totalEvents}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-3 rounded-lg bg-blue-500/10">
              <Users className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-slate-400">Utilisateurs affectes</p>
              <p className="text-2xl font-bold text-blue-400">{totalUsers}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardContent className="p-4">
          <div className="flex items-center gap-6 flex-wrap">
            {/* Level Filter */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-400">Niveau:</span>
              <div className="flex gap-1">
                {levelFilters.map((f) => (
                  <Button
                    key={f.key}
                    variant="ghost"
                    size="sm"
                    onClick={() => setLevelFilter(f.key)}
                    className={cn(
                      'text-xs',
                      levelFilter === f.key
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
        </CardContent>
      </Card>

      {/* Issues List */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardContent className="p-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <RefreshCw className="w-8 h-8 text-slate-400 animate-spin" />
            </div>
          ) : error && issues.length === 0 ? (
            <div className="text-center py-12">
              <AlertTriangle className="w-12 h-12 text-yellow-400 mx-auto mb-3" />
              <p className="text-slate-400">{error}</p>
              <p className="text-slate-500 text-sm mt-2">
                Configurez SENTRY_AUTH_TOKEN_READ dans les variables d'environnement
              </p>
            </div>
          ) : filteredIssues.length === 0 ? (
            <div className="text-center py-12">
              <Bug className="w-12 h-12 text-green-500/50 mx-auto mb-3" />
              <p className="text-slate-400">Aucune issue trouvee</p>
              <p className="text-slate-500 text-sm mt-1">
                {levelFilter !== 'all' || statusFilter !== 'all' ? 'Essayez de modifier les filtres' : 'Excellent travail!'}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredIssues.map((issue) => (
                <div
                  key={issue.id}
                  className="bg-slate-900/50 rounded-lg p-4 border border-slate-700 hover:border-slate-600 transition-colors"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      {getLevelIcon(issue.level)}
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-sm font-medium truncate" title={issue.title}>
                          {issue.title}
                        </p>
                        <p className="text-slate-500 text-xs truncate mt-1" title={issue.culprit}>
                          {issue.culprit || issue.shortId}
                        </p>
                        <div className="flex items-center gap-3 mt-2 text-xs text-slate-400">
                          <span className="flex items-center gap-1">
                            <Activity className="w-3 h-3" />
                            {issue.count} evenements
                          </span>
                          <span className="flex items-center gap-1">
                            <Users className="w-3 h-3" />
                            {issue.userCount} utilisateurs
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2 flex-shrink-0">
                      <a
                        href={issue.permalink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-slate-400 hover:text-white transition-colors"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                      <span className="text-xs text-slate-500">
                        {formatDistanceToNow(new Date(issue.lastSeen), {
                          addSuffix: true,
                          locale: fr,
                        })}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mt-3">
                    {getLevelBadge(issue.level)}
                    <Badge className="text-xs bg-slate-600/50 text-slate-300">
                      {issue.shortId}
                    </Badge>
                    <Badge className={cn(
                      'text-xs',
                      issue.status === 'unresolved'
                        ? 'bg-orange-500/10 text-orange-400'
                        : issue.status === 'resolved'
                        ? 'bg-green-500/10 text-green-400'
                        : 'bg-slate-500/10 text-slate-400'
                    )}>
                      {issue.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Sentry Link */}
      {issues.length > 0 && (
        <div className="text-center">
          <a
            href="https://easyco-6g.sentry.io/issues/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 text-sm"
          >
            Voir toutes les issues sur Sentry
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      )}
    </div>
  );
}
