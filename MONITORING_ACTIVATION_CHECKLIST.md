# 🚀 MONITORING SYSTEM - CHECKLIST D'ACTIVATION

Ce document vous guide pas à pas pour activer et vérifier le système de monitoring EASYCO.

---

## ✅ ÉTAPE 1: Base de données (5 minutes)

### 1.1 Appliquer la migration

```bash
# Depuis la racine du projet
supabase db reset  # Si développement local
# OU
supabase db push  # Si production
```

### 1.2 Vérifier que les tables sont créées

Connectez-vous à votre dashboard Supabase et vérifiez que ces 8 tables existent:
- [ ] `security_errors`
- [ ] `security_events`
- [ ] `route_analytics`
- [ ] `security_vulnerabilities`
- [ ] `performance_metrics`
- [ ] `security_score_history`
- [ ] `security_alerts`
- [ ] `security_config`

### 1.3 Vérifier les RLS policies

Toutes les tables doivent avoir une RLS policy permettant l'accès aux admins uniquement.

---

## ✅ ÉTAPE 2: Configuration Sentry (2 minutes)

### 2.1 Obtenir votre DSN Sentry

1. Créez un compte sur [sentry.io](https://sentry.io) si ce n'est pas déjà fait
2. Créez un nouveau projet Next.js
3. Copiez votre DSN (format: `https://xxx@xxx.ingest.sentry.io/xxx`)

### 2.2 Configurer les variables d'environnement

Ajoutez dans `.env.local`:

```env
NEXT_PUBLIC_SENTRY_DSN=votre_dsn_ici
SENTRY_AUTH_TOKEN=votre_token_ici  # Optionnel mais recommandé
```

### 2.3 Vérifier l'intégration Sentry

Le système d'erreurs devrait automatiquement envoyer à Sentry ET à votre base de données.

---

## ✅ ÉTAPE 3: Premier test du système (5 minutes)

### 3.1 Tester la capture d'erreur

Créez un fichier de test `test-monitoring.ts`:

```typescript
import { errorTracker, securityMonitor, routeMonitor } from '@/lib/monitoring';

// Test 1: Capturer une erreur
await errorTracker.captureException(
  new Error('Test error'),
  { route: '/test', userId: 'test-user' }
);

// Test 2: Détecter une tentative SQL injection
await securityMonitor.detectSQLInjection(
  "SELECT * FROM users WHERE id = 1 OR 1=1",
  { ipAddress: '127.0.0.1', route: '/api/test' }
);

// Test 3: Tracker une requête
await routeMonitor.trackRequest({
  route: '/api/test',
  method: 'GET',
  responseTimeMs: 125,
  statusCode: 200,
  errorOccurred: false,
});

console.log('✅ Tests completed! Check your database and Sentry.');
```

Exécutez:
```bash
npx tsx test-monitoring.ts
```

### 3.2 Vérifier dans Supabase

Vérifiez que des entrées ont été créées dans:
- `security_errors` (1 entrée)
- `security_events` (1 entrée)
- `route_analytics` (1 entrée)

### 3.3 Vérifier dans Sentry

Vous devriez voir l'erreur de test dans votre dashboard Sentry.

---

## ✅ ÉTAPE 4: Intégration dans vos routes API (10 minutes)

### 4.1 Exemple de route monitorée

Modifiez une route API existante, par exemple `app/api/properties/route.ts`:

```typescript
import { monitoredRoute } from '@/lib/monitoring';

async function handler(request: NextRequest) {
  // Votre logique existante
  const properties = await fetchProperties();
  return NextResponse.json(properties);
}

// Wrapper avec monitoring automatique
export const GET = monitoredRoute(handler);
```

### 4.2 Exemple avec détection de sécurité

Pour une route qui accepte des inputs utilisateurs:

```typescript
import { monitoredRoute, securityMonitor } from '@/lib/monitoring';

async function handler(request: NextRequest) {
  const { searchQuery } = await request.json();

  // Vérifier SQL injection
  const isSQLInjection = await securityMonitor.detectSQLInjection(
    searchQuery,
    { route: '/api/search', ipAddress: request.ip }
  );

  if (isSQLInjection) {
    return NextResponse.json(
      { error: 'Invalid input detected' },
      { status: 400 }
    );
  }

  // Continuer normalement...
}

export const POST = monitoredRoute(handler);
```

### 4.3 Liste des routes à monitorer

Appliquez `monitoredRoute()` sur ces routes prioritaires:
- [ ] `/api/auth/*` (toutes les routes d'authentification)
- [ ] `/api/properties/*` (toutes les routes properties)
- [ ] `/api/users/*` (toutes les routes utilisateurs)
- [ ] Toute route qui manipule des données sensibles

---

## ✅ ÉTAPE 5: Dashboard de sécurité (2 minutes)

### 5.1 Accéder au dashboard

Connectez-vous en tant qu'admin et naviguez vers:
```
http://localhost:3000/admin/dashboard/security
```

### 5.2 Vérifier les données

Vous devriez voir:
- [ ] Score de sécurité (0-100)
- [ ] Nombre total d'erreurs
- [ ] Événements de sécurité
- [ ] Performance des routes
- [ ] Alertes et prédictions

### 5.3 Tester les filtres

Changez la fenêtre temporelle:
- [ ] 1 hour
- [ ] 24 hours
- [ ] 7 days
- [ ] 30 days

Le dashboard devrait se mettre à jour automatiquement.

---

## ✅ ÉTAPE 6: Notifications (Optionnel)

### 6.1 Configuration Email

Dans `lib/monitoring/alert-system.ts`, ligne 169-172, configurez votre service email:

```typescript
private async sendEmailNotification(alert: Alert): Promise<void> {
  // Intégrer SendGrid, AWS SES, ou autre
  await sendEmail({
    to: 'admin@votre-domaine.com',
    subject: `[ALERT] ${alert.title}`,
    body: alert.description,
  });
}
```

### 6.2 Configuration Slack

Créez un webhook Slack et configurez ligne 177-180:

```typescript
private async sendSlackNotification(alert: Alert): Promise<void> {
  await fetch(process.env.SLACK_WEBHOOK_URL!, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      text: `🚨 ${alert.title}`,
      blocks: [
        {
          type: 'section',
          text: { type: 'mrkdwn', text: alert.description }
        }
      ]
    })
  });
}
```

Ajoutez dans `.env.local`:
```env
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/xxx/xxx/xxx
```

---

## ✅ ÉTAPE 7: Scan de vulnérabilités (5 minutes)

### 7.1 Lancer un scan manuel

Dans le dashboard de sécurité, cliquez sur "Run Vulnerability Scan" ou exécutez:

```typescript
import { vulnerabilityScanner } from '@/lib/monitoring';

const audit = await vulnerabilityScanner.runSecurityAudit();
console.log('Security Score:', audit.securityScore.overallScore);
console.log('Vulnerabilities found:', audit.vulnerabilities.length);
```

### 7.2 Configurer les scans automatiques

Créez un cron job (via Vercel Cron ou autre):

```typescript
// app/api/cron/security-scan/route.ts
import { vulnerabilityScanner } from '@/lib/monitoring';

export async function GET() {
  await vulnerabilityScanner.runSecurityAudit();
  return Response.json({ success: true });
}
```

Dans `vercel.json`:
```json
{
  "crons": [
    {
      "path": "/api/cron/security-scan",
      "schedule": "0 2 * * *"
    }
  ]
}
```

---

## ✅ ÉTAPE 8: Monitoring Frontend (3 minutes)

### 8.1 Ajouter le hook global

Dans `app/layout.tsx`:

```typescript
'use client';

import { useSecurityMonitoring } from '@/lib/hooks/use-security-monitoring';

export default function RootLayout({ children }) {
  // Active le monitoring des erreurs frontend
  useSecurityMonitoring();

  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
```

### 8.2 Ajouter des Error Boundaries

Enveloppez vos composants critiques:

```typescript
import { ErrorBoundary } from '@/lib/monitoring/error-boundary';

export default function Page() {
  return (
    <ErrorBoundary>
      <CriticalComponent />
    </ErrorBoundary>
  );
}
```

---

## ✅ ÉTAPE 9: Vérification finale (5 minutes)

### 9.1 Checklist de vérification

Vérifiez que tout fonctionne:
- [ ] Les erreurs sont capturées dans Sentry
- [ ] Les erreurs sont stockées dans `security_errors`
- [ ] Les événements de sécurité sont loggés dans `security_events`
- [ ] Les métriques de route sont trackées dans `route_analytics`
- [ ] Le dashboard affiche des données réelles
- [ ] Le score de sécurité est calculé (0-100)
- [ ] Les alertes sont générées pour les anomalies

### 9.2 Test de bout en bout

1. Créez une erreur intentionnelle sur votre site
2. Tentez une injection SQL sur un formulaire de recherche
3. Faites 10 requêtes rapides sur la même route
4. Attendez 30 secondes
5. Vérifiez le dashboard - tout devrait être visible

### 9.3 Performance

Le système de monitoring ne devrait PAS ralentir votre application:
- Batch processing toutes les 3-5 secondes
- Indexation optimale en base de données
- Pas d'attente bloquante sur les requêtes

---

## 🎯 PROCHAINES ÉTAPES RECOMMANDÉES

### Semaine 1
- [ ] Monitorer et ajuster les seuils d'alerte
- [ ] Configurer les notifications par email/Slack
- [ ] Identifier les routes les plus lentes (P95 > 1000ms)

### Semaine 2
- [ ] Résoudre les vulnérabilités critiques détectées
- [ ] Optimiser les routes avec taux d'erreur > 5%
- [ ] Configurer les scans automatiques quotidiens

### Semaine 3
- [ ] Analyser les patterns d'attaque
- [ ] Améliorer le score de sécurité (objectif: > 80)
- [ ] Créer des rapports hebdomadaires automatiques

### Long terme
- [ ] Intégrer des alertes PagerDuty pour les incidents critiques
- [ ] Créer des dashboards Grafana personnalisés
- [ ] Implémenter l'auto-healing pour certaines erreurs

---

## 🆘 DÉPANNAGE

### Problème: Les données n'apparaissent pas dans le dashboard

**Solutions:**
1. Vérifiez que la migration a été appliquée (`\dt` dans psql)
2. Vérifiez les RLS policies (l'utilisateur doit être admin)
3. Vérifiez les logs du navigateur (F12)
4. Vérifiez que les systèmes flush leurs queues (attendez 5-10 secondes)

### Problème: Erreurs Sentry non envoyées

**Solutions:**
1. Vérifiez `NEXT_PUBLIC_SENTRY_DSN` dans `.env.local`
2. Vérifiez que Sentry est initialisé dans `instrumentation.ts`
3. Testez avec `Sentry.captureMessage('test')` directement

### Problème: Performance dégradée

**Solutions:**
1. Augmentez les intervalles de flush (5s → 10s)
2. Augmentez les batch sizes (10 → 50)
3. Vérifiez les index PostgreSQL
4. Activez le partitioning pour les tables volumineuses

### Problème: Faux positifs SQL injection

**Solutions:**
1. Ajustez les patterns regex dans `security-monitor.ts`
2. Créez une whitelist pour certaines routes
3. Diminuez la sensibilité pour les routes internes

---

## 📊 MÉTRIQUES DE SUCCÈS

Après 1 semaine d'activation, vous devriez avoir:
- **Score de sécurité:** > 70/100
- **Taux de détection:** > 95% des erreurs capturées
- **Temps de réponse moyen:** < 200ms
- **Faux positifs:** < 5%
- **Alertes critiques:** Réponse < 5 minutes

---

## 🎓 RESSOURCES SUPPLÉMENTAIRES

- **Guide complet:** `SECURITY_MONITORING_GUIDE.md`
- **Exemples de code:** `MONITORING_EXAMPLES.md`
- **Vue d'ensemble:** `SECURITY_SYSTEM_SUMMARY.md`

---

## ✅ VALIDATION FINALE

Une fois toutes les étapes complétées, votre système devrait être:
- 🔒 **Sécurisé** - Détection temps réel des menaces
- 👁️ **Observable** - Visibilité complète sur les erreurs et performances
- 🚀 **Performant** - Impact minimal sur l'application
- 🎯 **Actionnable** - Alertes et recommandations concrètes
- 📈 **Évolutif** - Prêt pour la croissance

**Félicitations! Votre système de monitoring niveau bancaire est opérationnel! 🎉**
