'use client';

import { Shield, Bug, AlertTriangle, Clock, Wifi, WifiOff } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils/cn';

interface SecurityStats {
  totalErrors: number;
  errors24h: number;
  unresolvedErrors: number;
  activeAlerts: number;
  securityScore: number;
}

interface RealtimeStatsProps {
  stats: SecurityStats;
  isConnected: boolean;
}

export function RealtimeStats({ stats, isConnected }: RealtimeStatsProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  const statCards = [
    {
      title: 'Score de Securite',
      value: stats.securityScore,
      suffix: '/100',
      icon: Shield,
      color: getScoreColor(stats.securityScore),
      bgColor: 'bg-emerald-500/10',
    },
    {
      title: 'Erreurs (24h)',
      value: stats.errors24h,
      icon: Bug,
      color: stats.errors24h > 10 ? 'text-red-400' : 'text-blue-400',
      bgColor: stats.errors24h > 10 ? 'bg-red-500/10' : 'bg-blue-500/10',
    },
    {
      title: 'Alertes actives',
      value: stats.activeAlerts,
      icon: AlertTriangle,
      color: stats.activeAlerts > 0 ? 'text-orange-400' : 'text-green-400',
      bgColor: stats.activeAlerts > 0 ? 'bg-orange-500/10' : 'bg-green-500/10',
    },
    {
      title: 'Non resolues',
      value: stats.unresolvedErrors,
      icon: Clock,
      color: stats.unresolvedErrors > 5 ? 'text-yellow-400' : 'text-slate-400',
      bgColor: 'bg-slate-500/10',
    },
  ];

  return (
    <div className="space-y-2">
      {/* Connection status */}
      <div className="flex items-center justify-end gap-2 text-xs">
        {isConnected ? (
          <>
            <Wifi className="w-3 h-3 text-green-400" />
            <span className="text-green-400">Temps reel actif</span>
          </>
        ) : (
          <>
            <WifiOff className="w-3 h-3 text-slate-500" />
            <span className="text-slate-500">Connexion...</span>
          </>
        )}
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => (
          <Card key={stat.title} className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">{stat.title}</p>
                  <p className={cn('text-2xl font-bold mt-1 transition-all', stat.color)}>
                    {stat.value}{stat.suffix || ''}
                  </p>
                </div>
                <div className={cn('p-3 superellipse-xl', stat.bgColor)}>
                  <stat.icon className={cn('w-6 h-6', stat.color)} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
