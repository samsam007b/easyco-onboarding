'use client';

import { useState } from 'react';
import {
  CheckCircle2,
  Circle,
  Clock,
  Zap,
  Database,
  Package,
  Globe,
  Server,
  Code2,
  Layers,
  ChevronDown,
  ChevronUp,
  Sparkles,
  DollarSign,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

// ============================================================================
// TYPES
// ============================================================================

type ItemStatus = 'completed' | 'in_progress' | 'not_started';
type Priority = 'critical' | 'high' | 'medium' | 'low';

interface MaturityItem {
  id: string;
  name: string;
  description: string;
  status: ItemStatus;
  isFree: boolean;
  priority: Priority;
  impact?: string;
}

interface MaturityCategory {
  id: string;
  name: string;
  icon: React.ElementType;
  color: string;
  items: MaturityItem[];
}

// ============================================================================
// DATA
// ============================================================================

const categories: MaturityCategory[] = [
  {
    id: 'database',
    name: 'Base de données',
    icon: Database,
    color: 'text-blue-400',
    items: [
      {
        id: 'db-1',
        name: 'Optimisation SELECT *',
        description: 'Remplacer SELECT * par des colonnes explicites dans toutes les requêtes.',
        status: 'completed',
        isFree: true,
        priority: 'high',
        impact: '-30% bande passante DB',
      },
      {
        id: 'db-2',
        name: 'Fix N+1 Queries',
        description: 'Batching des requêtes dans FavoritesContext et autres contextes.',
        status: 'completed',
        isFree: true,
        priority: 'critical',
        impact: '-80% requêtes DB',
      },
      {
        id: 'db-3',
        name: 'Index sur colonnes fréquentes',
        description: 'Ajouter des index sur user_id, property_id, created_at.',
        status: 'completed',
        isFree: true,
        priority: 'high',
        impact: '-50% temps requêtes',
      },
      {
        id: 'db-4',
        name: 'Pagination cursor-based',
        description: 'Remplacer offset pagination par cursor-based pour les grandes listes.',
        status: 'not_started',
        isFree: true,
        priority: 'medium',
        impact: 'Scalabilité améliorée',
      },
      {
        id: 'db-5',
        name: 'Connection pooling',
        description: 'Configurer PgBouncer pour optimiser les connexions.',
        status: 'completed',
        isFree: false,
        priority: 'medium',
        impact: '+100 connexions simultanées',
      },
    ],
  },
  {
    id: 'react',
    name: 'React & Rendering',
    icon: Code2,
    color: 'text-cyan-400',
    items: [
      {
        id: 'react-1',
        name: 'Memoization composants lourds',
        description: 'React.memo() sur ExpenseScanner, ModernSearcherDashboard, etc.',
        status: 'not_started',
        isFree: true,
        priority: 'high',
        impact: '-40% re-renders',
      },
      {
        id: 'react-2',
        name: 'Optimistic Updates',
        description: 'Mises à jour optimistes dans FavoritesContext.',
        status: 'completed',
        isFree: true,
        priority: 'high',
        impact: 'UX instantanée',
      },
      {
        id: 'react-3',
        name: 'Lazy loading composants',
        description: 'Dynamic imports pour les composants non-critiques.',
        status: 'in_progress',
        isFree: true,
        priority: 'medium',
        impact: '-20% bundle initial',
      },
      {
        id: 'react-4',
        name: 'Virtualisation listes longues',
        description: 'react-window pour les listes de propriétés.',
        status: 'not_started',
        isFree: true,
        priority: 'medium',
        impact: '-90% DOM nodes',
      },
      {
        id: 'react-5',
        name: 'Provider optimization',
        description: 'Lazy load Google Maps APIProvider et autres providers lourds.',
        status: 'not_started',
        isFree: true,
        priority: 'medium',
        impact: '-15% temps chargement',
      },
    ],
  },
  {
    id: 'bundle',
    name: 'Bundle Size',
    icon: Package,
    color: 'text-orange-400',
    items: [
      {
        id: 'bundle-1',
        name: 'Centralisation icons Lucide',
        description: 'Exporter uniquement les icônes utilisées depuis un fichier central.',
        status: 'not_started',
        isFree: true,
        priority: 'medium',
        impact: '-15% bundle size',
      },
      {
        id: 'bundle-2',
        name: 'Dynamic import Tesseract.js',
        description: 'Charger Tesseract uniquement à l\'utilisation OCR.',
        status: 'not_started',
        isFree: true,
        priority: 'high',
        impact: '-2MB bundle',
      },
      {
        id: 'bundle-3',
        name: 'Tree shaking Recharts',
        description: 'Importer uniquement les composants Recharts nécessaires.',
        status: 'in_progress',
        isFree: true,
        priority: 'medium',
        impact: '-200KB',
      },
      {
        id: 'bundle-4',
        name: 'Code splitting routes',
        description: 'Vérifier que le code splitting Next.js fonctionne correctement.',
        status: 'completed',
        isFree: true,
        priority: 'medium',
        impact: 'Chargement progressif',
      },
    ],
  },
  {
    id: 'api',
    name: 'API Performance',
    icon: Zap,
    color: 'text-purple-400',
    items: [
      {
        id: 'api-1',
        name: 'Response caching (unstable_cache)',
        description: 'Cache server-side pour les données peu volatiles.',
        status: 'completed',
        isFree: true,
        priority: 'high',
        impact: '-70% requêtes DB',
      },
      {
        id: 'api-2',
        name: 'Rate limiting',
        description: 'Limiter les requêtes abusives avec Redis.',
        status: 'completed',
        isFree: true,
        priority: 'high',
        impact: 'Protection serveur',
      },
      {
        id: 'api-3',
        name: 'Compression responses',
        description: 'Gzip/Brotli activé dans next.config.',
        status: 'completed',
        isFree: true,
        priority: 'medium',
        impact: '-70% taille responses',
      },
      {
        id: 'api-4',
        name: 'API route handlers optimisés',
        description: 'Parallel fetching avec Promise.all dans les routes.',
        status: 'completed',
        isFree: true,
        priority: 'high',
        impact: '-50% temps response',
      },
    ],
  },
  {
    id: 'webvitals',
    name: 'Core Web Vitals',
    icon: Globe,
    color: 'text-emerald-400',
    items: [
      {
        id: 'wv-1',
        name: 'Monitoring Web Vitals',
        description: 'Tracking CLS, INP, FCP, LCP, TTFB avec web-vitals.',
        status: 'completed',
        isFree: true,
        priority: 'high',
        impact: 'Visibilité performance',
      },
      {
        id: 'wv-2',
        name: 'Image optimization',
        description: 'next/image avec formats modernes (WebP, AVIF).',
        status: 'completed',
        isFree: true,
        priority: 'high',
        impact: '-50% taille images',
      },
      {
        id: 'wv-3',
        name: 'Font optimization',
        description: 'Préchargement fonts avec next/font.',
        status: 'completed',
        isFree: true,
        priority: 'medium',
        impact: 'Pas de FOUT',
      },
      {
        id: 'wv-4',
        name: 'Preload critical resources',
        description: 'Précharger les ressources critiques (CSS, fonts).',
        status: 'in_progress',
        isFree: true,
        priority: 'medium',
        impact: '-200ms FCP',
      },
    ],
  },
  {
    id: 'infra',
    name: 'Infrastructure',
    icon: Server,
    color: 'text-pink-400',
    items: [
      {
        id: 'infra-1',
        name: 'CDN pour assets statiques',
        description: 'Vercel Edge Network activé.',
        status: 'completed',
        isFree: true,
        priority: 'high',
        impact: '-80% latence assets',
      },
      {
        id: 'infra-2',
        name: 'Edge Functions',
        description: 'Middleware et routes critiques en Edge.',
        status: 'completed',
        isFree: true,
        priority: 'medium',
        impact: '-50ms latence',
      },
      {
        id: 'infra-3',
        name: 'ISR (Incremental Static Regeneration)',
        description: 'Pages semi-statiques avec revalidation.',
        status: 'not_started',
        isFree: true,
        priority: 'low',
        impact: 'Cache pages publiques',
      },
    ],
  },
];

// ============================================================================
// HELPERS
// ============================================================================

function getStatusIcon(status: ItemStatus) {
  switch (status) {
    case 'completed':
      return <CheckCircle2 className="w-5 h-5 text-emerald-400" />;
    case 'in_progress':
      return <Clock className="w-5 h-5 text-yellow-400" />;
    case 'not_started':
      return <Circle className="w-5 h-5 text-slate-500" />;
  }
}

function getPriorityColor(priority: Priority) {
  switch (priority) {
    case 'critical':
      return 'bg-red-500/20 text-red-400 border-red-500/30';
    case 'high':
      return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
    case 'medium':
      return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
    case 'low':
      return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
  }
}

// ============================================================================
// COMPONENT
// ============================================================================

export function PerformanceMaturityDashboard() {
  const [expandedCategories, setExpandedCategories] = useState<string[]>(categories.map(c => c.id));

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  // Calculate stats
  const allItems = categories.flatMap(c => c.items);
  const completedItems = allItems.filter(i => i.status === 'completed');
  const inProgressItems = allItems.filter(i => i.status === 'in_progress');
  const freeItems = allItems.filter(i => i.isFree);
  const freeCompleted = freeItems.filter(i => i.status === 'completed');

  const overallProgress = Math.round((completedItems.length / allItems.length) * 100);
  const freeProgress = Math.round((freeCompleted.length / freeItems.length) * 100);

  // Maturity levels
  const getMaturityLevel = (progress: number) => {
    if (progress >= 90) return { level: 5, name: 'Elite', color: 'text-purple-400', bg: 'bg-purple-500/20' };
    if (progress >= 75) return { level: 4, name: 'Professionnel', color: 'text-emerald-400', bg: 'bg-emerald-500/20' };
    if (progress >= 60) return { level: 3, name: 'Avancé', color: 'text-blue-400', bg: 'bg-blue-500/20' };
    if (progress >= 40) return { level: 2, name: 'Standard', color: 'text-yellow-400', bg: 'bg-yellow-500/20' };
    return { level: 1, name: 'Basique', color: 'text-slate-400', bg: 'bg-slate-500/20' };
  };

  const maturity = getMaturityLevel(overallProgress);

  return (
    <div className="space-y-6">
      {/* Overview Card */}
      <Card className="bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Maturity Level */}
            <div className="text-center">
              <div className={cn('inline-flex items-center justify-center w-20 h-20 rounded-2xl mb-3', maturity.bg)}>
                <span className={cn('text-3xl font-bold', maturity.color)}>{maturity.level}</span>
              </div>
              <p className={cn('text-lg font-semibold', maturity.color)}>{maturity.name}</p>
              <p className="text-sm text-slate-400">Niveau de maturité</p>
            </div>

            {/* Overall Progress */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-slate-400">Progression globale</span>
                <span className="text-sm font-medium text-white">{overallProgress}%</span>
              </div>
              <Progress value={overallProgress} className="h-3 mb-2" />
              <p className="text-xs text-slate-500">
                {completedItems.length}/{allItems.length} items complétés
              </p>
            </div>

            {/* Free Items Progress */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-slate-400 flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> Gratuit
                </span>
                <span className="text-sm font-medium text-emerald-400">{freeProgress}%</span>
              </div>
              <Progress value={freeProgress} className="h-3 mb-2" />
              <p className="text-xs text-slate-500">
                {freeCompleted.length}/{freeItems.length} items gratuits
              </p>
            </div>

            {/* Status Summary */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span className="text-sm text-slate-300">{completedItems.length} Complétés</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-yellow-400" />
                <span className="text-sm text-slate-300">{inProgressItems.length} En cours</span>
              </div>
              <div className="flex items-center gap-2">
                <Circle className="w-4 h-4 text-slate-500" />
                <span className="text-sm text-slate-300">
                  {allItems.length - completedItems.length - inProgressItems.length} À faire
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Categories */}
      <div className="space-y-4">
        {categories.map(category => {
          const categoryCompleted = category.items.filter(i => i.status === 'completed').length;
          const categoryProgress = Math.round((categoryCompleted / category.items.length) * 100);
          const isExpanded = expandedCategories.includes(category.id);

          return (
            <Card key={category.id} className="bg-slate-800/50 border-slate-700">
              <CardHeader
                className="cursor-pointer hover:bg-slate-700/30 transition-colors"
                onClick={() => toggleCategory(category.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={cn('p-2 rounded-lg', category.color.replace('text-', 'bg-').replace('400', '500/20'))}>
                      <category.icon className={cn('w-5 h-5', category.color)} />
                    </div>
                    <div>
                      <CardTitle className="text-white text-lg">{category.name}</CardTitle>
                      <CardDescription>
                        {categoryCompleted}/{category.items.length} complétés
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-32">
                      <Progress value={categoryProgress} className="h-2" />
                    </div>
                    <span className="text-sm font-medium text-white w-12 text-right">
                      {categoryProgress}%
                    </span>
                    {isExpanded ? (
                      <ChevronUp className="w-5 h-5 text-slate-400" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-slate-400" />
                    )}
                  </div>
                </div>
              </CardHeader>

              {isExpanded && (
                <CardContent className="pt-0">
                  <div className="space-y-2">
                    {category.items.map(item => (
                      <div
                        key={item.id}
                        className={cn(
                          'flex items-start gap-3 p-3 rounded-lg transition-colors',
                          item.status === 'completed' ? 'bg-emerald-500/5' : 'bg-slate-700/30'
                        )}
                      >
                        {getStatusIcon(item.status)}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className={cn(
                              'font-medium',
                              item.status === 'completed' ? 'text-emerald-400' : 'text-white'
                            )}>
                              {item.name}
                            </span>
                            <Badge variant="secondary" className={getPriorityColor(item.priority)}>
                              {item.priority}
                            </Badge>
                            {item.isFree && (
                              <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
                                <Sparkles className="w-3 h-3 mr-1" />
                                Gratuit
                              </Badge>
                            )}
                            {!item.isFree && (
                              <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">
                                <DollarSign className="w-3 h-3 mr-1" />
                                Payant
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-slate-400 mt-1">{item.description}</p>
                          {item.impact && (
                            <p className="text-xs text-cyan-400 mt-1">
                              Impact: {item.impact}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}
