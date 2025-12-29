'use client';

import Link from 'next/link';
import {
  ArrowLeft,
  Shield,
  AlertTriangle,
  AlertCircle,
  CheckCircle,
  Info,
  ExternalLink,
  TrendingUp,
  Target,
  Clock,
  FileText,
  Lock,
  Server,
  Database,
  Globe,
  Upload,
  Code,
  Package,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils/cn';

// Security Audit Data - 2025-12-29
const auditData = {
  date: '2025-12-29',
  version: '0.4.x',
  overallScore: 8.4,
  frameworks: ['OWASP Top 10 2023', 'NIST CSF 2.0', 'ISO 27001:2022', 'SOC 2 Type II', 'PCI-DSS v4.0'],

  categories: [
    { name: 'Authentification & Autorisation', score: 9.5, status: 'excellent', icon: Lock },
    { name: 'Validation des Entrees', score: 8.5, status: 'tres-bon', icon: Code },
    { name: 'Securite API', score: 9.0, status: 'excellent', icon: Server },
    { name: 'Protection des Donnees', score: 9.0, status: 'excellent', icon: Database },
    { name: 'Securite Cote Client', score: 7.5, status: 'bon', icon: Globe },
    { name: 'Dependances', score: 7.0, status: 'acceptable', icon: Package },
    { name: 'Configuration', score: 9.5, status: 'excellent', icon: FileText },
    { name: 'Upload de Fichiers', score: 9.0, status: 'excellent', icon: Upload },
  ],

  vulnerabilities: {
    critical: 1,
    high: 1,
    medium: 3,
    low: 8,
  },

  criticalIssues: [
    {
      id: 'XSS-001',
      title: 'XSS via Injection HTML Non Sanitisee',
      file: 'components/VirtualTourViewer.tsx:159',
      cvss: 8.1,
      owasp: 'A03:2021 - Injection',
      description: 'Le composant utilise une injection HTML directe sans sanitisation. Un attaquant pourrait injecter du JavaScript malveillant.',
      impact: ['Vol de session', 'Keylogging', 'Defacement', 'Vol de donnees'],
      remediation: 'Sanitiser avec DOMPurify ou valider strictement les domaines d\'embed autorises',
      priority: 'IMMEDIATE (24h)',
    },
  ],

  highIssues: [
    {
      id: 'NPM-001',
      title: 'Vulnerabilites NPM Connues',
      packages: ['@next/eslint-plugin-next (HAUTE - ReDoS)', '@sentry/nextjs (MODEREE)'],
      remediation: 'npm update @next/eslint-plugin-next && npm audit fix',
      priority: '1-7 jours',
    },
  ],

  mediumIssues: [
    {
      id: 'CSP-001',
      title: 'CSP avec unsafe-inline/unsafe-eval',
      description: 'Reduit l\'efficacite de la CSP contre les attaques XSS',
    },
    {
      id: 'RATE-001',
      title: 'Rate Limiter en mode Fail-Open',
      description: 'Si Redis echoue, les requetes sont autorisees',
    },
    {
      id: 'LOG-001',
      title: 'Secrets potentiels dans console.error',
      description: 'Les erreurs peuvent contenir des informations sensibles',
    },
  ],

  strengths: [
    { title: 'Authentification Supabase SSR', detail: 'Cookies securises, HttpOnly' },
    { title: 'Rate Limiting', detail: 'Upstash Redis, sliding window' },
    { title: 'RLS comprehensif', detail: '130+ fichiers SQL avec politiques' },
    { title: 'Headers de securite', detail: 'HSTS, X-Frame-Options, CSP' },
    { title: 'Magic number validation', detail: 'Verification signature fichiers' },
    { title: 'Logger securise', detail: 'Redaction automatique des secrets' },
  ],

  idealTargets: [
    { name: 'MFA (Multi-Factor Auth)', current: false, description: 'TOTP ou WebAuthn' },
    { name: 'WAF', current: false, description: 'Cloudflare ou AWS WAF' },
    { name: 'SIEM', current: false, description: 'Datadog Security ou Splunk' },
    { name: 'Penetration Testing', current: false, description: 'Annuel minimum' },
    { name: 'Bug Bounty Program', current: false, description: 'HackerOne ou Bugcrowd' },
    { name: 'SOC 2 Certification', current: false, description: 'Type II' },
    { name: 'Zero Trust Architecture', current: false, description: 'Service mesh' },
    { name: 'Key Management (HSM)', current: false, description: 'AWS KMS ou HashiCorp Vault' },
  ],

  actionPlan: [
    { timeline: 'Immediat (24-48h)', items: ['Corriger XSS dans VirtualTourViewer.tsx'], severity: 'critical' },
    { timeline: 'Court terme (1-7j)', items: ['Mettre a jour npm vulnerables', 'Unifier le logging'], severity: 'high' },
    { timeline: 'Moyen terme (1-4sem)', items: ['Circuit breaker rate limiter', 'Monitoring securite', 'Plan incidents'], severity: 'medium' },
    { timeline: 'Long terme (1-6mois)', items: ['CSP avec nonces', 'MFA admin', 'WAF', 'Pentest pro'], severity: 'low' },
  ],

  nistScores: [
    { function: 'Identify', score: 3, max: 5 },
    { function: 'Protect', score: 4, max: 5 },
    { function: 'Detect', score: 3, max: 5 },
    { function: 'Respond', score: 2, max: 5 },
    { function: 'Recover', score: 2, max: 5 },
  ],
};

function getScoreColor(score: number) {
  if (score >= 9) return 'text-emerald-400';
  if (score >= 8) return 'text-green-400';
  if (score >= 7) return 'text-yellow-400';
  return 'text-red-400';
}

function getScoreBg(score: number) {
  if (score >= 9) return 'bg-emerald-500/20';
  if (score >= 8) return 'bg-green-500/20';
  if (score >= 7) return 'bg-yellow-500/20';
  return 'bg-red-500/20';
}

function getStatusBadge(status: string) {
  switch (status) {
    case 'excellent':
      return <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">Excellent</Badge>;
    case 'tres-bon':
      return <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Tres Bon</Badge>;
    case 'bon':
      return <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">Bon</Badge>;
    case 'acceptable':
      return <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30">Acceptable</Badge>;
    default:
      return <Badge className="bg-slate-500/20 text-slate-400">{status}</Badge>;
  }
}

export default function SecurityReportPage() {
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
              <Shield className="w-6 h-6 text-emerald-400" />
              Rapport d'Audit de Securite
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Analyse comprehensive - {auditData.date}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {auditData.frameworks.slice(0, 2).map((fw) => (
            <Badge key={fw} className="bg-slate-700 text-slate-300 text-xs">
              {fw}
            </Badge>
          ))}
          <Badge className="bg-slate-700 text-slate-300 text-xs">
            +{auditData.frameworks.length - 2}
          </Badge>
        </div>
      </div>

      {/* Executive Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Overall Score */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-6">
            <div className="flex flex-col items-center">
              <div className="relative w-32 h-32">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="12"
                    className="text-slate-700"
                  />
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="12"
                    strokeLinecap="round"
                    strokeDasharray={`${(auditData.overallScore / 10) * 352} 352`}
                    className={cn('transition-all duration-1000', getScoreColor(auditData.overallScore))}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className={cn('text-3xl font-bold', getScoreColor(auditData.overallScore))}>
                    {auditData.overallScore}
                  </span>
                  <span className="text-slate-500 text-xs">/10</span>
                </div>
              </div>
              <p className="mt-4 text-sm font-medium text-white">Score Global</p>
              <p className="text-xs text-slate-500">Production-ready*</p>
            </div>
          </CardContent>
        </Card>

        {/* Vulnerabilities Count */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-white text-sm flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-orange-400" />
              Vulnerabilites
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-2">
              <div className="flex items-center justify-between p-2 rounded bg-red-500/10">
                <span className="text-xs text-red-400">Critiques</span>
                <span className="text-lg font-bold text-red-400">{auditData.vulnerabilities.critical}</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded bg-orange-500/10">
                <span className="text-xs text-orange-400">Hautes</span>
                <span className="text-lg font-bold text-orange-400">{auditData.vulnerabilities.high}</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded bg-yellow-500/10">
                <span className="text-xs text-yellow-400">Moyennes</span>
                <span className="text-lg font-bold text-yellow-400">{auditData.vulnerabilities.medium}</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded bg-blue-500/10">
                <span className="text-xs text-blue-400">Basses</span>
                <span className="text-lg font-bold text-blue-400">{auditData.vulnerabilities.low}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* NIST Framework */}
        <Card className="bg-slate-800/50 border-slate-700 lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-white text-sm flex items-center gap-2">
              <Target className="w-4 h-4 text-purple-400" />
              NIST Cybersecurity Framework 2.0
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {auditData.nistScores.map((item) => (
                <div key={item.function} className="flex items-center gap-3">
                  <span className="text-xs text-slate-400 w-16">{item.function}</span>
                  <div className="flex-1 bg-slate-700 rounded-full h-2">
                    <div
                      className={cn(
                        'h-2 rounded-full transition-all',
                        item.score >= 4 ? 'bg-emerald-500' : item.score >= 3 ? 'bg-yellow-500' : 'bg-red-500'
                      )}
                      style={{ width: `${(item.score / item.max) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs text-slate-400">{item.score}/{item.max}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Critical Issues Alert */}
      {auditData.criticalIssues.length > 0 && (
        <Card className="bg-red-950/30 border-red-500/30">
          <CardHeader>
            <CardTitle className="text-red-400 flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              Vulnerabilites Critiques - Action Immediate Requise
            </CardTitle>
          </CardHeader>
          <CardContent>
            {auditData.criticalIssues.map((issue) => (
              <div key={issue.id} className="space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-white font-medium">{issue.title}</h3>
                    <p className="text-slate-400 text-sm mt-1">{issue.description}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-red-500/20 text-red-400">CVSS {issue.cvss}</Badge>
                    <Badge className="bg-slate-700 text-slate-300">{issue.owasp}</Badge>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="p-3 rounded bg-slate-800/50">
                    <p className="text-slate-500 text-xs mb-1">Fichier</p>
                    <p className="text-slate-300 font-mono text-xs">{issue.file}</p>
                  </div>
                  <div className="p-3 rounded bg-slate-800/50">
                    <p className="text-slate-500 text-xs mb-1">Impact</p>
                    <div className="flex flex-wrap gap-1">
                      {issue.impact.map((i) => (
                        <Badge key={i} className="text-xs bg-red-500/10 text-red-400">{i}</Badge>
                      ))}
                    </div>
                  </div>
                  <div className="p-3 rounded bg-slate-800/50">
                    <p className="text-slate-500 text-xs mb-1">Priorite</p>
                    <p className="text-red-400 font-medium">{issue.priority}</p>
                  </div>
                </div>
                <div className="p-3 rounded bg-emerald-500/10 border border-emerald-500/20">
                  <p className="text-emerald-400 text-xs font-medium mb-1">Remediation</p>
                  <p className="text-slate-300 text-sm">{issue.remediation}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Category Scores */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-400" />
            Scores par Categorie
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {auditData.categories.map((cat) => {
              const IconComponent = cat.icon;
              return (
                <div
                  key={cat.name}
                  className={cn('p-4 rounded-lg border transition-colors', getScoreBg(cat.score), 'border-slate-700')}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 rounded-lg bg-slate-800">
                      <IconComponent className={cn('w-4 h-4', getScoreColor(cat.score))} />
                    </div>
                    <span className={cn('text-2xl font-bold', getScoreColor(cat.score))}>{cat.score}</span>
                  </div>
                  <p className="text-sm text-white mb-1">{cat.name}</p>
                  {getStatusBadge(cat.status)}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Strengths and Action Plan */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Strengths */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-emerald-400" />
              Points Forts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {auditData.strengths.map((strength) => (
                <div key={strength.title} className="flex items-start gap-3 p-3 rounded-lg bg-slate-700/30">
                  <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm text-white">{strength.title}</p>
                    <p className="text-xs text-slate-500">{strength.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Action Plan */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Clock className="w-5 h-5 text-orange-400" />
              Plan d'Action
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {auditData.actionPlan.map((plan) => (
                <div key={plan.timeline} className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge
                      className={cn(
                        'text-xs',
                        plan.severity === 'critical'
                          ? 'bg-red-500/20 text-red-400'
                          : plan.severity === 'high'
                            ? 'bg-orange-500/20 text-orange-400'
                            : plan.severity === 'medium'
                              ? 'bg-yellow-500/20 text-yellow-400'
                              : 'bg-blue-500/20 text-blue-400'
                      )}
                    >
                      {plan.timeline}
                    </Badge>
                  </div>
                  <ul className="space-y-1 pl-4">
                    {plan.items.map((item) => (
                      <li key={item} className="text-sm text-slate-300 list-disc">
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Ideal Targets */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Target className="w-5 h-5 text-purple-400" />
            Cibles Ideales (Best Practices Bancaires)
          </CardTitle>
          <CardDescription>
            Objectifs de securite a long terme pour atteindre les standards des institutions financieres
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {auditData.idealTargets.map((target) => (
              <div
                key={target.name}
                className={cn(
                  'p-4 rounded-lg border transition-colors',
                  target.current
                    ? 'bg-emerald-500/10 border-emerald-500/30'
                    : 'bg-slate-700/30 border-slate-600'
                )}
              >
                <div className="flex items-center gap-2 mb-2">
                  {target.current ? (
                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <Target className="w-4 h-4 text-slate-500" />
                  )}
                  <span className="text-sm font-medium text-white">{target.name}</span>
                </div>
                <p className="text-xs text-slate-500">{target.description}</p>
                {!target.current && (
                  <Badge className="mt-2 text-xs bg-purple-500/10 text-purple-400">A implementer</Badge>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* High Issues */}
      {auditData.highIssues.length > 0 && (
        <Card className="bg-orange-950/20 border-orange-500/30">
          <CardHeader>
            <CardTitle className="text-orange-400 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              Vulnerabilites Hautes
            </CardTitle>
          </CardHeader>
          <CardContent>
            {auditData.highIssues.map((issue) => (
              <div key={issue.id} className="space-y-3">
                <h3 className="text-white font-medium">{issue.title}</h3>
                <div className="flex flex-wrap gap-2">
                  {issue.packages.map((pkg) => (
                    <Badge key={pkg} className="text-xs bg-slate-700 text-slate-300">{pkg}</Badge>
                  ))}
                </div>
                <div className="p-3 rounded bg-slate-800/50">
                  <p className="text-slate-500 text-xs mb-1">Remediation</p>
                  <code className="text-xs text-emerald-400 font-mono">{issue.remediation}</code>
                </div>
                <p className="text-xs text-slate-500">Priorite: {issue.priority}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Medium Issues */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-yellow-400 flex items-center gap-2">
            <Info className="w-5 h-5" />
            Vulnerabilites Moyennes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {auditData.mediumIssues.map((issue) => (
              <div key={issue.id} className="flex items-start gap-3 p-3 rounded-lg bg-yellow-500/5 border border-yellow-500/20">
                <AlertTriangle className="w-4 h-4 text-yellow-400 mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm text-white">{issue.title}</p>
                  <p className="text-xs text-slate-500 mt-1">{issue.description}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Footer */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardContent className="p-4">
          <div className="flex items-center justify-between text-sm">
            <div className="text-slate-500">
              <p>Prochaine revue recommandee: <span className="text-slate-300">2025-03-29</span></p>
              <p>Audit de penetration recommande: <span className="text-slate-300">2025-06-29</span></p>
            </div>
            <Link
              href="/admin/dashboard/security/audit/security-audit-2025-12-29.md"
              target="_blank"
              className="flex items-center gap-2 text-purple-400 hover:text-purple-300 transition-colors"
            >
              <FileText className="w-4 h-4" />
              Voir le rapport complet
              <ExternalLink className="w-3 h-3" />
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
