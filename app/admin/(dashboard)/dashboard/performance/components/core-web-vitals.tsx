'use client';

import {
  Eye,
  MousePointer2,
  Paintbrush,
  Image,
  Server,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import Link from 'next/link';

// ============================================================================
// TYPES
// ============================================================================

interface WebVitalsData {
  cls: { value: number; rating: 'good' | 'needs-improvement' | 'poor' };
  inp: { value: number; rating: 'good' | 'needs-improvement' | 'poor' };
  fcp: { value: number; rating: 'good' | 'needs-improvement' | 'poor' };
  lcp: { value: number; rating: 'good' | 'needs-improvement' | 'poor' };
  ttfb: { value: number; rating: 'good' | 'needs-improvement' | 'poor' };
}

interface CoreWebVitalsProps {
  webVitals: WebVitalsData;
  compact?: boolean;
}

// ============================================================================
// CONSTANTS
// ============================================================================

const vitalsMeta = {
  cls: {
    name: 'CLS',
    fullName: 'Cumulative Layout Shift',
    description: 'Mesure la stabilité visuelle',
    icon: Eye,
    unit: '',
    thresholds: { good: 0.1, poor: 0.25 },
  },
  inp: {
    name: 'INP',
    fullName: 'Interaction to Next Paint',
    description: 'Mesure la réactivité aux interactions',
    icon: MousePointer2,
    unit: 'ms',
    thresholds: { good: 200, poor: 500 },
  },
  fcp: {
    name: 'FCP',
    fullName: 'First Contentful Paint',
    description: 'Premier contenu affiché',
    icon: Paintbrush,
    unit: 'ms',
    thresholds: { good: 1800, poor: 3000 },
  },
  lcp: {
    name: 'LCP',
    fullName: 'Largest Contentful Paint',
    description: 'Plus grand élément visible',
    icon: Image,
    unit: 'ms',
    thresholds: { good: 2500, poor: 4000 },
  },
  ttfb: {
    name: 'TTFB',
    fullName: 'Time to First Byte',
    description: 'Temps de réponse serveur',
    icon: Server,
    unit: 'ms',
    thresholds: { good: 800, poor: 1800 },
  },
};

// ============================================================================
// HELPERS
// ============================================================================

function getRatingColor(rating: string) {
  switch (rating) {
    case 'good':
      return 'text-emerald-400 bg-emerald-500/20 border-emerald-500/30';
    case 'needs-improvement':
      return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30';
    case 'poor':
      return 'text-red-400 bg-red-500/20 border-red-500/30';
    default:
      return 'text-slate-400 bg-slate-500/20 border-slate-500/30';
  }
}

function getRatingIcon(rating: string) {
  switch (rating) {
    case 'good':
      return <CheckCircle2 className="w-4 h-4 text-emerald-400" />;
    case 'needs-improvement':
      return <AlertTriangle className="w-4 h-4 text-yellow-400" />;
    case 'poor':
      return <AlertCircle className="w-4 h-4 text-red-400" />;
    default:
      return null;
  }
}

function getProgressValue(metric: keyof typeof vitalsMeta, value: number): number {
  const { thresholds } = vitalsMeta[metric];
  // Normalize to 0-100 scale where 100 is best (good threshold)
  const maxValue = thresholds.poor * 1.5;
  const normalized = Math.max(0, Math.min(100, 100 - (value / maxValue) * 100));
  return normalized;
}

function formatValue(metric: keyof typeof vitalsMeta, value: number): string {
  const { unit } = vitalsMeta[metric];
  if (metric === 'cls') {
    return value.toFixed(3);
  }
  return `${Math.round(value)}${unit}`;
}

// ============================================================================
// COMPONENT
// ============================================================================

export function CoreWebVitals({ webVitals, compact = false }: CoreWebVitalsProps) {
  const vitalsArray = Object.entries(webVitals) as [keyof typeof vitalsMeta, { value: number; rating: string }][];
  const goodCount = vitalsArray.filter(([_, v]) => v.rating === 'good').length;

  if (compact) {
    return (
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-white text-lg">Core Web Vitals</CardTitle>
            <Badge className={goodCount === 5 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-yellow-500/20 text-yellow-400'}>
              {goodCount}/5 optimal
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {vitalsArray.map(([key, data]) => {
              const meta = vitalsMeta[key];
              return (
                <div key={key} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <meta.icon className="w-4 h-4 text-slate-400" />
                    <span className="text-sm text-slate-300">{meta.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-mono text-white">
                      {formatValue(key, data.value)}
                    </span>
                    {getRatingIcon(data.rating)}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-white text-xl">Core Web Vitals</CardTitle>
              <CardDescription>
                Métriques Google pour l'expérience utilisateur
              </CardDescription>
            </div>
            <Link
              href="https://web.dev/vitals/"
              target="_blank"
              className="flex items-center gap-1 text-sm text-cyan-400 hover:text-cyan-300"
            >
              En savoir plus
              <ExternalLink className="w-3 h-3" />
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {vitalsArray.map(([key, data]) => {
              const meta = vitalsMeta[key];
              const progressValue = getProgressValue(key, data.value);

              return (
                <Card key={key} className={`border ${getRatingColor(data.rating)}`}>
                  <CardContent className="pt-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className={`p-2 rounded-lg ${getRatingColor(data.rating)}`}>
                          <meta.icon className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="font-medium text-white">{meta.name}</p>
                          <p className="text-xs text-slate-400">{meta.fullName}</p>
                        </div>
                      </div>
                      {getRatingIcon(data.rating)}
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-baseline justify-between">
                        <span className="text-2xl font-bold text-white">
                          {formatValue(key, data.value)}
                        </span>
                        <Badge variant="outline" className={getRatingColor(data.rating)}>
                          {data.rating === 'good' ? 'Bon' : data.rating === 'needs-improvement' ? 'À améliorer' : 'Mauvais'}
                        </Badge>
                      </div>

                      <Progress value={progressValue} className="h-2" />

                      <p className="text-xs text-slate-400">
                        {meta.description}
                      </p>

                      <div className="flex justify-between text-xs text-slate-500">
                        <span>Bon: ≤{meta.thresholds.good}{meta.unit}</span>
                        <span>Mauvais: &gt;{meta.thresholds.poor}{meta.unit}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Recommendations */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white text-lg">Recommandations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {vitalsArray
              .filter(([_, v]) => v.rating !== 'good')
              .map(([key, data]) => {
                const meta = vitalsMeta[key];
                const recommendations: Record<string, string> = {
                  cls: "Réserver l'espace pour les images et publicités avec width/height. Éviter les insertions de contenu dynamique.",
                  inp: 'Optimiser les event handlers. Utiliser requestIdleCallback pour les tâches non-urgentes.',
                  fcp: 'Réduire le temps de blocage du rendu. Précharger les ressources critiques.',
                  lcp: 'Optimiser les images (WebP, lazy loading). Précharger les ressources LCP.',
                  ttfb: 'Optimiser les requêtes serveur. Utiliser le cache et un CDN.',
                };

                return (
                  <div key={key} className="flex items-start gap-3 p-3 bg-slate-700/30 rounded-lg">
                    <AlertTriangle className="w-5 h-5 text-yellow-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-white">
                        Améliorer {meta.name} ({formatValue(key, data.value)})
                      </p>
                      <p className="text-xs text-slate-400 mt-1">
                        {recommendations[key]}
                      </p>
                    </div>
                  </div>
                );
              })}

            {vitalsArray.every(([_, v]) => v.rating === 'good') && (
              <div className="flex items-center gap-3 p-3 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <div>
                  <p className="text-sm font-medium text-emerald-400">
                    Toutes les métriques sont optimales !
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    Continuez à surveiller ces métriques pour maintenir de bonnes performances.
                  </p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
