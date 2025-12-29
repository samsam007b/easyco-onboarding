'use client';

import { useState } from 'react';
import {
  Shield, Lock, Key, Eye, Server, Globe, Database,
  CheckCircle2, Circle, AlertTriangle, Zap, Target,
  ChevronDown, ChevronUp, ExternalLink, Clock, DollarSign,
  TrendingUp, Layers, FileCheck, Users, Network, Bug
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils/cn';

// =============================================================================
// TYPES & DATA
// =============================================================================

interface SecurityItem {
  id: string;
  name: string;
  description: string;
  status: 'completed' | 'in_progress' | 'not_started';
  isFree: boolean;
  estimatedCost?: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  implementationTime?: string;
  documentation?: string;
}

interface SecurityCategory {
  id: string;
  name: string;
  icon: React.ElementType;
  color: string;
  items: SecurityItem[];
}

interface MaturityLevel {
  level: number;
  name: string;
  description: string;
  minScore: number;
  color: string;
  bgColor: string;
  features: string[];
}

// Security Maturity Levels (5 levels)
const MATURITY_LEVELS: MaturityLevel[] = [
  {
    level: 1,
    name: 'Basique',
    description: 'Protection minimale - vulnérable aux attaques courantes',
    minScore: 0,
    color: 'text-red-400',
    bgColor: 'bg-red-500/20',
    features: ['Authentification basique', 'HTTPS activé', 'Validation côté client']
  },
  {
    level: 2,
    name: 'Standard',
    description: 'Protections essentielles en place - résiste aux attaques automatisées',
    minScore: 40,
    color: 'text-orange-400',
    bgColor: 'bg-orange-500/20',
    features: ['Rate limiting', 'Validation serveur', 'Logs basiques', 'Protection CSRF']
  },
  {
    level: 3,
    name: 'Avancé',
    description: 'Sécurité proactive - détection et réponse aux menaces',
    minScore: 60,
    color: 'text-yellow-400',
    bgColor: 'bg-yellow-500/20',
    features: ['WAF actif', 'Monitoring temps réel', 'Audit logs', 'MFA disponible']
  },
  {
    level: 4,
    name: 'Professionnel',
    description: 'Sécurité de niveau entreprise - conforme aux standards',
    minScore: 80,
    color: 'text-green-400',
    bgColor: 'bg-green-500/20',
    features: ['SOC 2 Type II', 'Pen testing régulier', 'SIEM intégré', 'DLP actif']
  },
  {
    level: 5,
    name: 'Bancaire',
    description: 'Sécurité maximale - niveau institution financière',
    minScore: 95,
    color: 'text-emerald-400',
    bgColor: 'bg-emerald-500/20',
    features: ['HSM', 'Zero Trust', 'Bug bounty', 'Red team annuel']
  }
];

// Security Categories with items
const SECURITY_CATEGORIES: SecurityCategory[] = [
  {
    id: 'auth',
    name: 'Authentification & Accès',
    icon: Key,
    color: 'text-blue-400',
    items: [
      {
        id: 'auth-1',
        name: 'Authentification Supabase',
        description: 'Auth sécurisée avec JWT, session management, et refresh tokens automatiques',
        status: 'completed',
        isFree: true,
        priority: 'critical'
      },
      {
        id: 'auth-2',
        name: 'Row Level Security (RLS)',
        description: 'Politiques RLS sur toutes les tables pour isolation des données par utilisateur',
        status: 'completed',
        isFree: true,
        priority: 'critical'
      },
      {
        id: 'auth-3',
        name: 'Protection CSRF',
        description: 'Tokens CSRF sur tous les formulaires et API routes',
        status: 'completed',
        isFree: true,
        priority: 'high'
      },
      {
        id: 'auth-4',
        name: 'MFA (Authentification Multi-Facteurs)',
        description: 'TOTP avec app authenticator via Supabase Auth. Interface utilisateur complète dans /settings/security.',
        status: 'completed',
        isFree: true,
        priority: 'high'
      },
      {
        id: 'auth-5',
        name: 'Session Timeout Configurable',
        description: 'Déconnexion automatique après inactivité. 30min utilisateurs, 15min admins. Configurable via env vars.',
        status: 'completed',
        isFree: true,
        priority: 'medium'
      },
      {
        id: 'auth-6',
        name: 'SSO Enterprise (SAML/OIDC)',
        description: 'Single Sign-On pour grandes entreprises avec Active Directory/Okta',
        status: 'not_started',
        isFree: false,
        estimatedCost: '200-500€/mois',
        priority: 'low',
        implementationTime: '1-2 semaines'
      }
    ]
  },
  {
    id: 'data',
    name: 'Protection des Données',
    icon: Database,
    color: 'text-purple-400',
    items: [
      {
        id: 'data-1',
        name: 'Chiffrement au repos (AES-256)',
        description: 'Toutes les données stockées sont chiffrées via Supabase/PostgreSQL',
        status: 'completed',
        isFree: true,
        priority: 'critical'
      },
      {
        id: 'data-2',
        name: 'Chiffrement en transit (TLS 1.3)',
        description: 'Toutes les communications utilisent HTTPS avec TLS 1.3',
        status: 'completed',
        isFree: true,
        priority: 'critical'
      },
      {
        id: 'data-3',
        name: 'Sanitization des inputs',
        description: 'Validation et sanitization de tous les inputs utilisateur (XSS, SQLi)',
        status: 'completed',
        isFree: true,
        priority: 'critical'
      },
      {
        id: 'data-4',
        name: 'Backup automatiques',
        description: 'Backups quotidiens avec rétention 7 jours (Supabase Pro)',
        status: 'completed',
        isFree: true,
        priority: 'high'
      },
      {
        id: 'data-5',
        name: 'Point-in-Time Recovery (PITR)',
        description: 'Restauration à n\'importe quel point dans le temps (dernières 7 jours)',
        status: 'not_started',
        isFree: false,
        estimatedCost: '25€/mois (Supabase Pro)',
        priority: 'medium',
        implementationTime: 'Configuration uniquement'
      },
      {
        id: 'data-6',
        name: 'Chiffrement E2E Documents',
        description: 'Chiffrement côté client des documents sensibles avant upload',
        status: 'not_started',
        isFree: true,
        priority: 'medium',
        implementationTime: '1 semaine'
      }
    ]
  },
  {
    id: 'network',
    name: 'Sécurité Réseau',
    icon: Network,
    color: 'text-cyan-400',
    items: [
      {
        id: 'net-1',
        name: 'Rate Limiting avec Circuit Breaker',
        description: 'Protection contre les attaques par force brute avec fallback in-memory',
        status: 'completed',
        isFree: true,
        priority: 'critical'
      },
      {
        id: 'net-2',
        name: 'Headers de sécurité HTTP',
        description: 'CSP, X-Frame-Options, X-Content-Type-Options, HSTS',
        status: 'completed',
        isFree: true,
        priority: 'high'
      },
      {
        id: 'net-3',
        name: 'Vercel Firewall (WAF)',
        description: 'Protection automatique contre les attaques web courantes (OWASP Top 10). Activé par défaut sur Vercel.',
        status: 'completed',
        isFree: true,
        priority: 'high'
      },
      {
        id: 'net-4',
        name: 'DDoS Protection',
        description: 'Protection contre les attaques DDoS via Vercel/Cloudflare',
        status: 'completed',
        isFree: true,
        priority: 'high'
      },
      {
        id: 'net-5',
        name: 'IP Allowlisting Admin',
        description: 'Accès admin restreint aux IPs autorisées. Support CIDR, détection de patterns suspects (XSS, SQLi).',
        status: 'completed',
        isFree: true,
        priority: 'medium'
      },
      {
        id: 'net-6',
        name: 'Cloudflare Enterprise',
        description: 'WAF avancé, bot management, analytics détaillées',
        status: 'not_started',
        isFree: false,
        estimatedCost: '200€/mois+',
        priority: 'low',
        implementationTime: '1-2 jours'
      }
    ]
  },
  {
    id: 'monitoring',
    name: 'Monitoring & Détection',
    icon: Eye,
    color: 'text-amber-400',
    items: [
      {
        id: 'mon-1',
        name: 'Logging sécurisé',
        description: 'Logs avec sanitization automatique des données sensibles',
        status: 'completed',
        isFree: true,
        priority: 'high'
      },
      {
        id: 'mon-2',
        name: 'Sentry Error Tracking',
        description: 'Capture et alertes sur les erreurs en production',
        status: 'completed',
        isFree: true,
        priority: 'high'
      },
      {
        id: 'mon-3',
        name: 'Audit Logs',
        description: 'Traçabilité complète des actions utilisateurs et admin',
        status: 'completed',
        isFree: true,
        priority: 'high'
      },
      {
        id: 'mon-4',
        name: 'Alertes temps réel',
        description: 'Notifications email/Slack sur événements de sécurité',
        status: 'completed',
        isFree: true,
        priority: 'medium'
      },
      {
        id: 'mon-5',
        name: 'SIEM Integration',
        description: 'Intégration avec Datadog/Splunk pour corrélation d\'événements',
        status: 'not_started',
        isFree: false,
        estimatedCost: '100-500€/mois',
        priority: 'low',
        implementationTime: '1-2 semaines'
      },
      {
        id: 'mon-6',
        name: 'Anomaly Detection ML',
        description: 'Détection automatique des comportements suspects via ML',
        status: 'not_started',
        isFree: false,
        estimatedCost: '300€/mois+',
        priority: 'low',
        implementationTime: '2-4 semaines'
      }
    ]
  },
  {
    id: 'compliance',
    name: 'Conformité & Audit',
    icon: FileCheck,
    color: 'text-green-400',
    items: [
      {
        id: 'comp-1',
        name: 'RGPD Compliance',
        description: 'Conformité RGPD: consentement, droit à l\'oubli, portabilité',
        status: 'completed',
        isFree: true,
        priority: 'critical'
      },
      {
        id: 'comp-2',
        name: 'Privacy Policy & CGU',
        description: 'Documents légaux à jour et accessibles',
        status: 'completed',
        isFree: true,
        priority: 'critical'
      },
      {
        id: 'comp-3',
        name: 'Cookie Consent',
        description: 'Bannière de consentement cookies conforme RGPD',
        status: 'completed',
        isFree: true,
        priority: 'high'
      },
      {
        id: 'comp-4',
        name: 'Security Documentation',
        description: 'Documentation des mesures de sécurité pour clients',
        status: 'in_progress',
        isFree: true,
        priority: 'medium',
        implementationTime: '1-2 jours'
      },
      {
        id: 'comp-5',
        name: 'SOC 2 Type II',
        description: 'Certification SOC 2 pour conformité entreprise',
        status: 'not_started',
        isFree: false,
        estimatedCost: '15,000-50,000€/an',
        priority: 'low',
        implementationTime: '3-6 mois'
      },
      {
        id: 'comp-6',
        name: 'ISO 27001',
        description: 'Certification internationale de management de la sécurité',
        status: 'not_started',
        isFree: false,
        estimatedCost: '20,000-100,000€',
        priority: 'low',
        implementationTime: '6-12 mois'
      }
    ]
  },
  {
    id: 'testing',
    name: 'Tests & Validation',
    icon: Bug,
    color: 'text-rose-400',
    items: [
      {
        id: 'test-1',
        name: 'npm audit automatique',
        description: 'Vérification des dépendances pour vulnérabilités connues',
        status: 'completed',
        isFree: true,
        priority: 'high'
      },
      {
        id: 'test-2',
        name: 'Code Review Sécurité',
        description: 'Revue de code orientée sécurité avant merge',
        status: 'in_progress',
        isFree: true,
        priority: 'high',
        implementationTime: 'Processus continu'
      },
      {
        id: 'test-3',
        name: 'Dependabot/Renovate',
        description: 'Mises à jour automatiques des dépendances',
        status: 'completed',
        isFree: true,
        priority: 'medium'
      },
      {
        id: 'test-4',
        name: 'Penetration Testing',
        description: 'Test d\'intrusion annuel par une équipe externe',
        status: 'not_started',
        isFree: false,
        estimatedCost: '3,000-15,000€/an',
        priority: 'medium',
        implementationTime: '2-4 semaines'
      },
      {
        id: 'test-5',
        name: 'Bug Bounty Program',
        description: 'Programme de récompenses pour découverte de vulnérabilités',
        status: 'not_started',
        isFree: false,
        estimatedCost: '500-5,000€/mois',
        priority: 'low',
        implementationTime: '1-2 semaines setup'
      },
      {
        id: 'test-6',
        name: 'Red Team Exercise',
        description: 'Simulation d\'attaque complète par équipe spécialisée',
        status: 'not_started',
        isFree: false,
        estimatedCost: '10,000-50,000€',
        priority: 'low',
        implementationTime: '2-4 semaines'
      }
    ]
  }
];

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

function calculateCategoryScore(category: SecurityCategory): number {
  const totalItems = category.items.length;
  const completedItems = category.items.filter(i => i.status === 'completed').length;
  const inProgressItems = category.items.filter(i => i.status === 'in_progress').length;
  return Math.round(((completedItems + inProgressItems * 0.5) / totalItems) * 100);
}

function calculateOverallScore(): number {
  const allItems = SECURITY_CATEGORIES.flatMap(c => c.items);
  const totalItems = allItems.length;
  const completedItems = allItems.filter(i => i.status === 'completed').length;
  const inProgressItems = allItems.filter(i => i.status === 'in_progress').length;
  return Math.round(((completedItems + inProgressItems * 0.5) / totalItems) * 100);
}

function getCurrentMaturityLevel(score: number): MaturityLevel {
  for (let i = MATURITY_LEVELS.length - 1; i >= 0; i--) {
    if (score >= MATURITY_LEVELS[i].minScore) {
      return MATURITY_LEVELS[i];
    }
  }
  return MATURITY_LEVELS[0];
}

function getNextMaturityLevel(current: MaturityLevel): MaturityLevel | null {
  const index = MATURITY_LEVELS.findIndex(l => l.level === current.level);
  return index < MATURITY_LEVELS.length - 1 ? MATURITY_LEVELS[index + 1] : null;
}

function getPriorityColor(priority: string): string {
  switch (priority) {
    case 'critical': return 'text-red-400 bg-red-500/20';
    case 'high': return 'text-orange-400 bg-orange-500/20';
    case 'medium': return 'text-yellow-400 bg-yellow-500/20';
    case 'low': return 'text-blue-400 bg-blue-500/20';
    default: return 'text-slate-400 bg-slate-500/20';
  }
}

function getStatusIcon(status: string) {
  switch (status) {
    case 'completed': return <CheckCircle2 className="w-4 h-4 text-green-400" />;
    case 'in_progress': return <Clock className="w-4 h-4 text-yellow-400 animate-pulse" />;
    default: return <Circle className="w-4 h-4 text-slate-500" />;
  }
}

// =============================================================================
// COMPONENTS
// =============================================================================

function MaturityLevelIndicator({ score }: { score: number }) {
  const currentLevel = getCurrentMaturityLevel(score);
  const nextLevel = getNextMaturityLevel(currentLevel);

  return (
    <Card className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Layers className="w-5 h-5 text-emerald-400" />
          Niveau de Maturité Sécurité
        </CardTitle>
        <CardDescription>Votre position sur l'échelle de maturité</CardDescription>
      </CardHeader>
      <CardContent>
        {/* Current Level Display */}
        <div className="flex items-center justify-center mb-6">
          <div className={cn('text-center p-6 rounded-2xl', currentLevel.bgColor)}>
            <div className={cn('text-6xl font-bold mb-2', currentLevel.color)}>
              {currentLevel.level}
            </div>
            <div className={cn('text-xl font-semibold', currentLevel.color)}>
              {currentLevel.name}
            </div>
            <p className="text-slate-400 text-sm mt-2 max-w-xs">
              {currentLevel.description}
            </p>
          </div>
        </div>

        {/* Level Progress Bar */}
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-slate-400">Progression globale</span>
            <span className={cn('font-bold', currentLevel.color)}>{score}%</span>
          </div>
          <div className="relative">
            <Progress value={score} className="h-3" />
            {/* Level markers */}
            <div className="absolute top-0 left-0 w-full h-full flex">
              {MATURITY_LEVELS.map((level, idx) => (
                <div
                  key={level.level}
                  className="relative flex-1"
                  style={{ borderRight: idx < MATURITY_LEVELS.length - 1 ? '2px solid rgba(100,116,139,0.5)' : 'none' }}
                >
                  <span className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs text-slate-500">
                    {level.minScore}%
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div className="flex justify-between text-xs text-slate-500 mt-6">
            {MATURITY_LEVELS.map(level => (
              <span key={level.level} className={cn(level.level === currentLevel.level && level.color)}>
                {level.name}
              </span>
            ))}
          </div>
        </div>

        {/* Next Level Target */}
        {nextLevel && (
          <div className="mt-6 p-4 rounded-lg bg-slate-700/30 border border-slate-600/50">
            <div className="flex items-center gap-2 mb-2">
              <Target className="w-4 h-4 text-amber-400" />
              <span className="text-sm font-medium text-white">Prochain objectif: Niveau {nextLevel.name}</span>
            </div>
            <p className="text-xs text-slate-400 mb-3">{nextLevel.description}</p>
            <div className="flex flex-wrap gap-2">
              {nextLevel.features.map((feature, idx) => (
                <Badge key={idx} className="text-xs bg-slate-700/50 border-slate-600 text-slate-300">
                  {feature}
                </Badge>
              ))}
            </div>
            <div className="mt-3 text-xs text-slate-400">
              <span className={nextLevel.color}>+{nextLevel.minScore - score}%</span> nécessaire pour atteindre ce niveau
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function CategoryCard({
  category,
  isExpanded,
  onToggle
}: {
  category: SecurityCategory;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  const score = calculateCategoryScore(category);
  const completedCount = category.items.filter(i => i.status === 'completed').length;
  const inProgressCount = category.items.filter(i => i.status === 'in_progress').length;
  const freeItems = category.items.filter(i => i.isFree && i.status !== 'completed');
  const paidItems = category.items.filter(i => !i.isFree);

  const Icon = category.icon;

  return (
    <Card className="bg-slate-800/50 border-slate-700 overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full text-left"
      >
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={cn('p-2 rounded-lg bg-slate-700/50')}>
                <Icon className={cn('w-5 h-5', category.color)} />
              </div>
              <div>
                <CardTitle className="text-white text-base">{category.name}</CardTitle>
                <CardDescription className="text-xs">
                  {completedCount}/{category.items.length} complétés
                  {inProgressCount > 0 && ` • ${inProgressCount} en cours`}
                </CardDescription>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className={cn(
                  'text-xl font-bold',
                  score >= 80 ? 'text-green-400' : score >= 50 ? 'text-yellow-400' : 'text-red-400'
                )}>
                  {score}%
                </div>
              </div>
              {isExpanded ? (
                <ChevronUp className="w-5 h-5 text-slate-400" />
              ) : (
                <ChevronDown className="w-5 h-5 text-slate-400" />
              )}
            </div>
          </div>
          <Progress value={score} className="h-1.5 mt-3" />
        </CardHeader>
      </button>

      {isExpanded && (
        <CardContent className="pt-0 border-t border-slate-700/50">
          <div className="space-y-3 mt-4">
            {category.items.map(item => (
              <div
                key={item.id}
                className={cn(
                  'p-3 rounded-lg border transition-all',
                  item.status === 'completed'
                    ? 'bg-green-500/5 border-green-500/20'
                    : item.status === 'in_progress'
                      ? 'bg-yellow-500/5 border-yellow-500/20'
                      : 'bg-slate-700/20 border-slate-600/30'
                )}
              >
                <div className="flex items-start gap-3">
                  <div className="mt-0.5">{getStatusIcon(item.status)}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={cn(
                        'font-medium text-sm',
                        item.status === 'completed' ? 'text-green-300' : 'text-white'
                      )}>
                        {item.name}
                      </span>
                      <Badge className={cn('text-xs', getPriorityColor(item.priority))}>
                        {item.priority}
                      </Badge>
                      {item.isFree ? (
                        <Badge className="text-xs bg-emerald-500/20 text-emerald-400">
                          Gratuit
                        </Badge>
                      ) : (
                        <Badge className="text-xs bg-purple-500/20 text-purple-400">
                          <DollarSign className="w-3 h-3 mr-1" />
                          {item.estimatedCost}
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 mt-1">{item.description}</p>
                    {item.status !== 'completed' && (
                      <div className="flex items-center gap-4 mt-2 text-xs">
                        {item.implementationTime && (
                          <span className="text-slate-500 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {item.implementationTime}
                          </span>
                        )}
                        {item.documentation && (
                          <a
                            href={item.documentation}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-400 hover:text-blue-300 flex items-center gap-1"
                            onClick={e => e.stopPropagation()}
                          >
                            <ExternalLink className="w-3 h-3" />
                            Documentation
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      )}
    </Card>
  );
}

function InvestmentRoadmap() {
  const freeImprovements = SECURITY_CATEGORIES.flatMap(c =>
    c.items.filter(i => i.isFree && i.status !== 'completed')
  ).sort((a, b) => {
    const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });

  const paidImprovements = SECURITY_CATEGORIES.flatMap(c =>
    c.items.filter(i => !i.isFree && i.status !== 'completed')
  ).sort((a, b) => {
    const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });

  return (
    <Card className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-emerald-400" />
          Roadmap d'Investissement Sécurité
        </CardTitle>
        <CardDescription>Priorisez vos investissements pour maximiser la sécurité</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Free Quick Wins */}
        <div>
          <h4 className="text-sm font-semibold text-emerald-400 mb-3 flex items-center gap-2">
            <Zap className="w-4 h-4" />
            Quick Wins Gratuits ({freeImprovements.length} restants)
          </h4>
          <div className="space-y-2">
            {freeImprovements.slice(0, 5).map(item => (
              <div key={item.id} className="flex items-center justify-between p-2 rounded bg-slate-700/30">
                <div className="flex items-center gap-2">
                  <Badge className={cn('text-xs', getPriorityColor(item.priority))}>
                    {item.priority}
                  </Badge>
                  <span className="text-sm text-white">{item.name}</span>
                </div>
                {item.implementationTime && (
                  <span className="text-xs text-slate-500">{item.implementationTime}</span>
                )}
              </div>
            ))}
            {freeImprovements.length > 5 && (
              <p className="text-xs text-slate-500 text-center pt-2">
                +{freeImprovements.length - 5} autres améliorations gratuites disponibles
              </p>
            )}
          </div>
        </div>

        {/* Paid Investments by Priority */}
        <div>
          <h4 className="text-sm font-semibold text-purple-400 mb-3 flex items-center gap-2">
            <DollarSign className="w-4 h-4" />
            Investissements Recommandés
          </h4>
          <div className="space-y-3">
            {/* Short term - High priority paid */}
            <div className="p-3 rounded-lg bg-orange-500/10 border border-orange-500/20">
              <div className="flex items-center gap-2 mb-2">
                <Badge className="bg-orange-500/30 text-orange-300 text-xs">Court terme</Badge>
                <span className="text-xs text-orange-300">Quand vous aurez du budget</span>
              </div>
              {paidImprovements.filter(i => i.priority === 'high' || i.priority === 'critical').slice(0, 3).map(item => (
                <div key={item.id} className="flex items-center justify-between py-1.5">
                  <span className="text-sm text-white">{item.name}</span>
                  <span className="text-xs text-orange-400">{item.estimatedCost}</span>
                </div>
              ))}
            </div>

            {/* Medium term */}
            <div className="p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
              <div className="flex items-center gap-2 mb-2">
                <Badge className="bg-yellow-500/30 text-yellow-300 text-xs">Moyen terme</Badge>
                <span className="text-xs text-yellow-300">Après validation du business model</span>
              </div>
              {paidImprovements.filter(i => i.priority === 'medium').slice(0, 3).map(item => (
                <div key={item.id} className="flex items-center justify-between py-1.5">
                  <span className="text-sm text-white">{item.name}</span>
                  <span className="text-xs text-yellow-400">{item.estimatedCost}</span>
                </div>
              ))}
            </div>

            {/* Long term - Enterprise */}
            <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
              <div className="flex items-center gap-2 mb-2">
                <Badge className="bg-blue-500/30 text-blue-300 text-xs">Long terme</Badge>
                <span className="text-xs text-blue-300">Scale-up / Enterprise</span>
              </div>
              {paidImprovements.filter(i => i.priority === 'low').slice(0, 3).map(item => (
                <div key={item.id} className="flex items-center justify-between py-1.5">
                  <span className="text-sm text-white">{item.name}</span>
                  <span className="text-xs text-blue-400">{item.estimatedCost}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function QuickStats() {
  const allItems = SECURITY_CATEGORIES.flatMap(c => c.items);
  const completed = allItems.filter(i => i.status === 'completed').length;
  const inProgress = allItems.filter(i => i.status === 'in_progress').length;
  const notStarted = allItems.filter(i => i.status === 'not_started').length;
  const freeNotDone = allItems.filter(i => i.isFree && i.status !== 'completed').length;
  const criticalNotDone = allItems.filter(i => i.priority === 'critical' && i.status !== 'completed').length;

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
      <Card className="bg-green-500/10 border-green-500/30">
        <CardContent className="p-4 text-center">
          <CheckCircle2 className="w-6 h-6 text-green-400 mx-auto mb-1" />
          <div className="text-2xl font-bold text-green-400">{completed}</div>
          <div className="text-xs text-green-300">Complétés</div>
        </CardContent>
      </Card>
      <Card className="bg-yellow-500/10 border-yellow-500/30">
        <CardContent className="p-4 text-center">
          <Clock className="w-6 h-6 text-yellow-400 mx-auto mb-1" />
          <div className="text-2xl font-bold text-yellow-400">{inProgress}</div>
          <div className="text-xs text-yellow-300">En cours</div>
        </CardContent>
      </Card>
      <Card className="bg-slate-500/10 border-slate-500/30">
        <CardContent className="p-4 text-center">
          <Circle className="w-6 h-6 text-slate-400 mx-auto mb-1" />
          <div className="text-2xl font-bold text-slate-400">{notStarted}</div>
          <div className="text-xs text-slate-300">À faire</div>
        </CardContent>
      </Card>
      <Card className="bg-emerald-500/10 border-emerald-500/30">
        <CardContent className="p-4 text-center">
          <Zap className="w-6 h-6 text-emerald-400 mx-auto mb-1" />
          <div className="text-2xl font-bold text-emerald-400">{freeNotDone}</div>
          <div className="text-xs text-emerald-300">Gratuits restants</div>
        </CardContent>
      </Card>
      <Card className="bg-red-500/10 border-red-500/30">
        <CardContent className="p-4 text-center">
          <AlertTriangle className="w-6 h-6 text-red-400 mx-auto mb-1" />
          <div className="text-2xl font-bold text-red-400">{criticalNotDone}</div>
          <div className="text-xs text-red-300">Critiques à faire</div>
        </CardContent>
      </Card>
    </div>
  );
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export function SecurityMaturityDashboard() {
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const overallScore = calculateOverallScore();

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev => {
      const next = new Set(prev);
      if (next.has(categoryId)) {
        next.delete(categoryId);
      } else {
        next.add(categoryId);
      }
      return next;
    });
  };

  const expandAll = () => {
    setExpandedCategories(new Set(SECURITY_CATEGORIES.map(c => c.id)));
  };

  const collapseAll = () => {
    setExpandedCategories(new Set());
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Shield className="w-6 h-6 text-emerald-400" />
            Maturité Sécurité 360°
          </h2>
          <p className="text-slate-400 text-sm mt-1">
            Vue complète de votre posture de sécurité et roadmap d'investissement
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={expandAll}>
            Tout ouvrir
          </Button>
          <Button variant="outline" size="sm" onClick={collapseAll}>
            Tout fermer
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <QuickStats />

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Maturity Level */}
        <div className="lg:col-span-1 space-y-6">
          <MaturityLevelIndicator score={overallScore} />
          <InvestmentRoadmap />
        </div>

        {/* Right Column - Categories */}
        <div className="lg:col-span-2 space-y-4">
          {SECURITY_CATEGORIES.map(category => (
            <CategoryCard
              key={category.id}
              category={category}
              isExpanded={expandedCategories.has(category.id)}
              onToggle={() => toggleCategory(category.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
