# 📚 Exemples d'Utilisation du Security Monitoring

Ce document contient des exemples concrets d'utilisation du système de monitoring dans différents contextes.

---

## 1. Route API avec Monitoring Complet

```typescript
// app/api/users/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { monitoredRoute } from '@/lib/monitoring/monitoring-middleware';
import { errorTracker } from '@/lib/monitoring/error-tracker';
import { securityMonitor } from '@/lib/monitoring/security-monitor';
import { createClient } from '@/lib/auth/supabase-server';

export const GET = monitoredRoute(async (
  request: NextRequest,
  { params }: { params: { id: string } }
) => {
  try {
    const supabase = await createClient();
    const userId = params.id;

    // Vérifier l'auth
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      // Capturer tentative d'accès non autorisé
      await securityMonitor.logSecurityEvent({
        eventType: 'unauthorized_access',
        severity: 'warning',
        description: `Attempted to access user ${userId} without authentication`,
        route: `/api/users/${userId}`,
        method: 'GET',
      });

      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Vérifier que l'utilisateur accède à ses propres données
    if (user.id !== userId) {
      await securityMonitor.logSecurityEvent({
        eventType: 'privilege_escalation',
        severity: 'critical',
        description: `User ${user.id} attempted to access data of user ${userId}`,
        userId: user.id,
        route: `/api/users/${userId}`,
        method: 'GET',
        actionTaken: 'blocked',
        blocked: true,
      });

      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Récupérer les données
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      await errorTracker.captureDatabaseError(error, {
        route: `/api/users/${userId}`,
        method: 'GET',
        userId: user.id,
      });

      return NextResponse.json({ error: 'Database error' }, { status: 500 });
    }

    return NextResponse.json({ data });
  } catch (error) {
    // Les erreurs non gérées sont automatiquement capturées par monitoredRoute
    throw error;
  }
});
```

---

## 2. Validation avec Détection XSS/SQL Injection

```typescript
// app/api/comments/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { monitoredRoute } from '@/lib/monitoring/monitoring-middleware';
import { securityMonitor } from '@/lib/monitoring/security-monitor';
import { createClient } from '@/lib/auth/supabase-server';

export const POST = monitoredRoute(async (request: NextRequest) => {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { comment, postId } = body;

    // Détecter SQL Injection
    const hasSQLInjection = await securityMonitor.detectSQLInjection(comment, {
      route: '/api/comments',
      method: 'POST',
      userId: user.id,
    });

    if (hasSQLInjection) {
      return NextResponse.json(
        { error: 'Invalid input detected' },
        { status: 400 }
      );
    }

    // Détecter XSS
    const hasXSS = await securityMonitor.detectXSS(comment, {
      route: '/api/comments',
      method: 'POST',
      userId: user.id,
    });

    if (hasXSS) {
      return NextResponse.json(
        { error: 'Invalid input detected' },
        { status: 400 }
      );
    }

    // Sanitize et insérer
    const { data, error } = await supabase
      .from('comments')
      .insert({
        content: comment,
        post_id: postId,
        user_id: user.id,
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ data });
  } catch (error) {
    throw error;
  }
});
```

---

## 3. Rate Limiting Personnalisé

```typescript
// app/api/auth/login/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { monitoredRoute } from '@/lib/monitoring/monitoring-middleware';
import { securityMonitor } from '@/lib/monitoring/security-monitor';
import { createClient } from '@/lib/auth/supabase-server';

export const POST = monitoredRoute(async (request: NextRequest) => {
  try {
    const ipAddress = request.headers.get('x-forwarded-for')?.split(',')[0].trim() || 'unknown';

    // Rate limiting: 5 tentatives par 5 minutes
    const { allowed } = await securityMonitor.checkRateLimit(
      `auth:${ipAddress}`,
      5,
      5 * 60 * 1000
    );

    if (!allowed) {
      return NextResponse.json(
        { error: 'Too many login attempts. Please try again later.' },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { email, password } = body;

    const supabase = await createClient();
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      // Logger l'échec d'authentification
      await securityMonitor.logAuthFailure(
        ipAddress,
        email,
        error.message
      );

      return NextResponse.json({ error: error.message }, { status: 401 });
    }

    return NextResponse.json({ data });
  } catch (error) {
    throw error;
  }
});
```

---

## 4. Component React avec Error Boundary

```typescript
// components/ErrorBoundary.tsx
'use client';

import { Component, ReactNode } from 'react';
import { errorTracker } from '@/lib/monitoring/error-tracker';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    // Capturer l'erreur
    errorTracker.captureException(error, {
      route: window.location.pathname,
      metadata: {
        componentStack: errorInfo.componentStack,
      },
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <h2 className="text-lg font-semibold text-red-800 mb-2">
              Une erreur est survenue
            </h2>
            <p className="text-sm text-red-600">
              {this.state.error?.message || 'Erreur inconnue'}
            </p>
          </div>
        )
      );
    }

    return this.props.children;
  }
}
```

```typescript
// app/layout.tsx
import { ErrorBoundary } from '@/components/ErrorBoundary';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>
        <ErrorBoundary>
          {children}
        </ErrorBoundary>
      </body>
    </html>
  );
}
```

---

## 5. Hook personnalisé pour tracking

```typescript
// components/UserProfile.tsx
'use client';

import { useSecurityMonitoring } from '@/lib/hooks/use-security-monitoring';
import { useState } from 'react';

export function UserProfile({ userId }: { userId: string }) {
  const { captureError, trackSecurityEvent } = useSecurityMonitoring();
  const [loading, setLoading] = useState(false);

  const handleSensitiveAction = async () => {
    try {
      setLoading(true);

      // Tracker l'action sensible
      await trackSecurityEvent(
        'sensitive_action',
        `User viewed sensitive data: ${userId}`,
        'info'
      );

      // ... votre logique
    } catch (error) {
      // Capturer l'erreur
      captureError(error as Error, {
        action: 'handleSensitiveAction',
        userId,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <button onClick={handleSensitiveAction} disabled={loading}>
      {loading ? 'Loading...' : 'View Sensitive Data'}
    </button>
  );
}
```

---

## 6. Middleware personnalisé Next.js

```typescript
// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  // Import dynamique pour éviter les erreurs de build
  const { securityMonitor } = await import('./lib/monitoring/security-monitor');

  // Analyser la requête pour sécurité
  const analysis = await securityMonitor.analyzeRequest({
    url: request.nextUrl.pathname,
    method: request.method,
    headers: Object.fromEntries(request.headers.entries()),
    ipAddress: request.headers.get('x-forwarded-for')?.split(',')[0].trim(),
  });

  // Bloquer si menace détectée
  if (analysis.blocked) {
    return NextResponse.json(
      {
        error: 'Request blocked for security reasons',
        threats: analysis.threats,
      },
      { status: 403 }
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/api/:path*'],
};
```

---

## 7. Scan de Vulnérabilités Programmé

```typescript
// scripts/scheduled-security-scan.ts
import { vulnerabilityScanner } from '@/lib/monitoring/vulnerability-scanner';
import { alertSystem } from '@/lib/monitoring/alert-system';

async function runScheduledScan() {
  console.log('🔍 Starting scheduled security scan...');

  try {
    // Scanner les dépendances
    const depVulns = await vulnerabilityScanner.scanDependencies();
    console.log(`Found ${depVulns.length} dependency vulnerabilities`);

    // Scanner le code
    const codeVulns = await vulnerabilityScanner.scanCodePatterns();
    console.log(`Found ${codeVulns.length} code vulnerabilities`);

    // Reporter toutes les vulnérabilités
    for (const vuln of [...depVulns, ...codeVulns]) {
      await vulnerabilityScanner.reportVulnerability(vuln);
    }

    // Calculer le nouveau score
    const score = await vulnerabilityScanner.calculateAndSaveSecurityScore();
    console.log(`Security score: ${score.overallScore}/100`);

    // Créer une alerte si le score est bas
    if (score.overallScore < 70) {
      await alertSystem.createAlert({
        type: 'threshold',
        severity: 'critical',
        title: 'Low Security Score Detected',
        description: `Security score dropped to ${score.overallScore}/100`,
        metadata: {
          score: score.overallScore,
          criticalIssues: score.criticalIssues,
        },
        notificationChannels: ['email', 'slack'],
      });
    }

    console.log('✅ Security scan completed');
  } catch (error) {
    console.error('❌ Security scan failed:', error);
  }
}

// Exécuter le scan
runScheduledScan();
```

Puis ajouter dans `package.json`:
```json
{
  "scripts": {
    "security:scan": "tsx scripts/scheduled-security-scan.ts"
  }
}
```

Et créer un cron job (GitHub Actions ou autre):
```yaml
# .github/workflows/security-scan.yml
name: Daily Security Scan

on:
  schedule:
    - cron: '0 9 * * *' # Tous les jours à 9h

jobs:
  scan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm install
      - run: npm run security:scan
```

---

## 8. Génération de Rapport Mensuel

```typescript
// scripts/generate-monthly-report.ts
import { vulnerabilityScanner } from '@/lib/monitoring/vulnerability-scanner';
import { getErrorStats } from '@/lib/monitoring/error-tracker';
import { securityMonitor } from '@/lib/monitoring/security-monitor';
import { routeMonitor } from '@/lib/monitoring/route-monitor';
import fs from 'fs';

async function generateMonthlyReport() {
  console.log('📊 Generating monthly security report...');

  // Collecter toutes les données
  const [report, errorStats, securityStats, healthReport] = await Promise.all([
    vulnerabilityScanner.generateSecurityAuditReport(),
    getErrorStats('30 days'),
    securityMonitor.getSecurityStats('30 days'),
    routeMonitor.getSystemHealthReport(),
  ]);

  // Formatter en Markdown
  const markdown = `
# Security Report - ${new Date().toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}

## Executive Summary

- **Security Score**: ${report.score.overallScore}/100 (${report.score.trend})
- **Critical Issues**: ${report.score.criticalIssues}
- **System Health**: ${healthReport.overallHealth}

## Score Breakdown

| Category | Score |
|----------|-------|
| Authentication | ${report.score.authenticationScore}/100 |
| Authorization | ${report.score.authorizationScore}/100 |
| Data Protection | ${report.score.dataProtectionScore}/100 |
| Vulnerabilities | ${report.score.vulnerabilityScore}/100 |
| Monitoring | ${report.score.monitoringScore}/100 |
| Compliance | ${report.score.complianceScore}/100 |

## Errors This Month

- **Total Errors**: ${errorStats.total}
- **Critical**: ${errorStats.bySeverity.critical}
- **High**: ${errorStats.bySeverity.high}
- **Medium**: ${errorStats.bySeverity.medium}

## Security Events

- **Total Events**: ${securityStats.totalEvents}
- **Critical**: ${securityStats.criticalEvents}
- **Blocked Requests**: ${securityStats.blockedRequests}
- **Suspicious IPs**: ${securityStats.suspiciousIPs}

## Top Threats

${securityStats.topThreats.map((t, i) => `${i + 1}. ${t.type}: ${t.count} occurrences`).join('\n')}

## Vulnerabilities

### Critical Actions Required

${report.criticalActions.map((a, i) => `${i + 1}. ${a}`).join('\n')}

### Top Recommendations

${report.recommendations.slice(0, 5).map((r, i) => `
#### ${i + 1}. ${r.title} (${r.priority} priority)

**Category**: ${r.category}
**Description**: ${r.description}
**Effort**: ${r.estimatedEffort}
**Impact**: +${r.impactOnScore} points on security score
`).join('\n')}

## Strengths

${report.strengths.map((s, i) => `${i + 1}. ${s}`).join('\n')}

## Weaknesses

${report.weaknesses.map((w, i) => `${i + 1}. ${w}`).join('\n')}

---

*Report generated on ${new Date().toISOString()}*
  `;

  // Sauvegarder
  const filename = `security-report-${new Date().toISOString().split('T')[0]}.md`;
  fs.writeFileSync(filename, markdown);

  console.log(`✅ Report saved to ${filename}`);
}

generateMonthlyReport();
```

---

## 9. Dashboard Widget Personnalisé

```typescript
// components/SecurityScoreWidget.tsx
'use client';

import { useEffect, useState } from 'react';
import { Shield } from 'lucide-react';

export function SecurityScoreWidget() {
  const [score, setScore] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchScore();
    const interval = setInterval(fetchScore, 60000); // Refresh every minute
    return () => clearInterval(interval);
  }, []);

  const fetchScore = async () => {
    try {
      const response = await fetch('/api/admin/security-command-center?section=score-history');
      const data = await response.json();
      if (data.scoreHistory && data.scoreHistory.length > 0) {
        setScore(data.scoreHistory[0].overall_score);
      }
    } catch (error) {
      console.error('Failed to fetch security score:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="animate-pulse bg-slate-200 h-24 rounded-lg" />;
  }

  const getColor = (score: number) => {
    if (score >= 80) return 'text-emerald-500 bg-emerald-500/10';
    if (score >= 60) return 'text-amber-500 bg-amber-500/10';
    return 'text-red-500 bg-red-500/10';
  };

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-slate-600" />
          <span className="text-sm font-medium text-slate-600">Security Score</span>
        </div>
        <div className={`px-3 py-1 rounded-full font-bold text-2xl ${getColor(score || 0)}`}>
          {score || 0}
        </div>
      </div>
    </div>
  );
}
```

---

Ces exemples montrent comment intégrer le système de monitoring dans tous les aspects de votre application. Vous pouvez les adapter selon vos besoins spécifiques !
