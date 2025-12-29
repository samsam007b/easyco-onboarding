'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Bug, ExternalLink, RefreshCw, AlertTriangle, AlertCircle, Info } from 'lucide-react';
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
}

export function SentryIssues() {
  const [issues, setIssues] = useState<SentryIssue[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [debug, setDebug] = useState<{ org?: string; project?: string; region?: string; apiUrl?: string } | null>(null);

  const fetchIssues = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/security/sentry-issues');
      const data = await response.json();

      if (data.error && !data.issues) {
        setError(data.error);
        setDebug(data.debug || null);
      } else {
        setIssues(data.issues || []);
        setError(data.error || null);
        setDebug(null);
      }
    } catch (err) {
      setError('Failed to fetch Sentry issues');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIssues();
  }, []);

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
        return <Badge variant="error" className="text-xs">Error</Badge>;
      case 'warning':
        return <Badge variant="warning" className="text-xs">Warning</Badge>;
      default:
        return <Badge variant="secondary" className="text-xs">{level}</Badge>;
    }
  };

  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-white flex items-center gap-2">
          <Bug className="w-5 h-5 text-purple-400" />
          Sentry Issues
          {issues.length > 0 && (
            <Badge className="ml-2 bg-purple-500/10 text-purple-400 border-purple-400">
              {issues.length} non résolus
            </Badge>
          )}
        </CardTitle>
        <Button
          variant="ghost"
          size="sm"
          onClick={fetchIssues}
          disabled={loading}
          className="text-slate-400 hover:text-white"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </Button>
      </CardHeader>
      <CardContent>
        {loading && issues.length === 0 ? (
          <div className="flex items-center justify-center py-8">
            <RefreshCw className="w-6 h-6 text-slate-400 animate-spin" />
          </div>
        ) : error && issues.length === 0 ? (
          <div className="text-center py-8">
            <AlertTriangle className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
            <p className="text-slate-400 text-sm">{error}</p>
            {debug && (
              <div className="mt-3 text-left bg-slate-900/50 rounded p-3 text-xs font-mono">
                <p className="text-slate-500">Debug info:</p>
                <p className="text-slate-400">Org: {debug.org || 'not set'}</p>
                <p className="text-slate-400">Project: {debug.project || 'not set'}</p>
                <p className="text-slate-400">Region: {debug.region || 'unknown'}</p>
              </div>
            )}
            {!debug && (
              <p className="text-slate-500 text-xs mt-1">
                Configurez SENTRY_AUTH_TOKEN_READ dans les variables d&apos;environnement
              </p>
            )}
          </div>
        ) : issues.length === 0 ? (
          <div className="text-center py-8">
            <Bug className="w-8 h-8 text-green-400 mx-auto mb-2" />
            <p className="text-slate-400">Aucun bug non résolu</p>
          </div>
        ) : (
          <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
            {issues.slice(0, 10).map((issue) => (
              <div
                key={issue.id}
                className="bg-slate-900/50 rounded-lg p-3 border border-slate-700 hover:border-slate-600 transition-colors"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-2 flex-1 min-w-0">
                    {getLevelIcon(issue.level)}
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm font-medium truncate" title={issue.title}>
                        {issue.title}
                      </p>
                      <p className="text-slate-500 text-xs truncate" title={issue.culprit}>
                        {issue.culprit || issue.shortId}
                      </p>
                    </div>
                  </div>
                  <a
                    href={issue.permalink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-slate-400 hover:text-white transition-colors shrink-0"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>

                <div className="flex items-center gap-3 mt-2 text-xs">
                  {getLevelBadge(issue.level)}
                  <span className="text-slate-500">
                    {issue.count} événements
                  </span>
                  <span className="text-slate-500">
                    {issue.userCount} utilisateurs
                  </span>
                  <span className="text-slate-500 ml-auto">
                    {formatDistanceToNow(new Date(issue.lastSeen), {
                      addSuffix: true,
                      locale: fr,
                    })}
                  </span>
                </div>
              </div>
            ))}

            {issues.length > 10 && (
              <a
                href="https://izzico-6g.sentry.io/issues/"
                target="_blank"
                rel="noopener noreferrer"
                className="block text-center text-purple-400 hover:text-purple-300 text-sm py-2"
              >
                Voir les {issues.length - 10} autres issues sur Sentry →
              </a>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
