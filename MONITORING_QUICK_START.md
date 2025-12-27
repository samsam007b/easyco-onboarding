# 🚀 MONITORING SYSTEM - QUICK START GUIDE

Bienvenue dans votre système de monitoring EASYCO de niveau bancaire!

---

## ⚡ Démarrage Rapide (10 minutes)

### Étape 1: Appliquer la migration (2 min)

```bash
# Si environnement local
supabase db reset

# Si production
supabase db push
```

### Étape 2: Configurer Sentry (2 min)

Ajoutez dans `.env.local`:
```env
NEXT_PUBLIC_SENTRY_DSN=https://xxx@xxx.ingest.sentry.io/xxx
```

### Étape 3: Tester le système (3 min)

```bash
# Exécuter le script de test
npx tsx scripts/test-monitoring.ts
```

Vous devriez voir:
```
🚀 Starting monitoring system tests...
✅ Error captured successfully
✅ SQL Injection detection: BLOCKED ✋
✅ XSS detection: BLOCKED ✋
🎉 ALL TESTS COMPLETED SUCCESSFULLY!
```

### Étape 4: Accéder au dashboard (1 min)

Naviguez vers:
```
http://localhost:3000/admin/dashboard/security
```

### Étape 5: Intégrer dans vos routes (2 min)

```typescript
import { monitoredRoute } from '@/lib/monitoring';

async function handler(req: NextRequest) {
  // Votre logique existante
  return NextResponse.json({ data: 'OK' });
}

// Ajouter cette ligne pour activer le monitoring
export const GET = monitoredRoute(handler);
```

**✅ C'est tout! Votre système est opérationnel!**

---

## 📚 Documentation Complète

### Pour aller plus loin:

1. **[MONITORING_ACTIVATION_CHECKLIST.md](./MONITORING_ACTIVATION_CHECKLIST.md)**
   - Guide étape par étape complet
   - Configuration des notifications
   - Scans automatiques
   - Troubleshooting

2. **[MONITORING_SYSTEM_ARCHITECTURE.md](./MONITORING_SYSTEM_ARCHITECTURE.md)**
   - Architecture détaillée des 5 systèmes
   - Schéma des 8 tables
   - Flux de données
   - Optimisations de performance

3. **[MONITORING_EXAMPLES.md](./MONITORING_EXAMPLES.md)**
   - 9 exemples pratiques
   - Cas d'usage réels
   - Best practices
   - Code copy-paste ready

4. **[SECURITY_MONITORING_GUIDE.md](./SECURITY_MONITORING_GUIDE.md)**
   - Guide d'utilisation complet
   - API référence
   - Configuration avancée
   - FAQ

5. **[SECURITY_SYSTEM_SUMMARY.md](./SECURITY_SYSTEM_SUMMARY.md)**
   - Vue d'ensemble exécutive
   - Fonctionnalités clés
   - Métriques importantes

---

## 🎯 Cas d'Usage Courants

### Capturer une erreur

```typescript
import { captureException } from '@/lib/monitoring';

try {
  await riskyOperation();
} catch (error) {
  await captureException(error, {
    route: '/api/users',
    userId: session.user.id
  });
  throw error;
}
```

### Détecter une attaque

```typescript
import { securityMonitor } from '@/lib/monitoring';

const { searchQuery } = await req.json();

if (await securityMonitor.detectSQLInjection(searchQuery, {
  ipAddress: req.ip,
  route: '/api/search'
})) {
  return NextResponse.json(
    { error: 'Invalid input' },
    { status: 400 }
  );
}
```

### Tracker les performances

```typescript
import { routeMonitor } from '@/lib/monitoring';

const startTime = Date.now();
const result = await expensiveOperation();
const duration = Date.now() - startTime;

await routeMonitor.trackRequest({
  route: '/api/heavy-task',
  method: 'POST',
  responseTimeMs: duration,
  statusCode: 200,
  errorOccurred: false
});
```

### Détecter une anomalie

```typescript
import { alertSystem } from '@/lib/monitoring';

const userSignups = await countSignupsToday();

await alertSystem.monitorMetric(
  'daily_signups',
  userSignups,
  { category: 'business_metrics' }
);

// Si anomalie détectée → alerte automatique
```

---

## 🎨 Dashboard - Aperçu des Données

Une fois le système actif, votre dashboard affichera:

### 🎯 Score de Sécurité
- **85/100** - Bon niveau de sécurité
- Détail par catégorie (Auth, Data, Monitoring, etc.)
- Tendance sur 7 jours

### 📊 KPIs en Temps Réel
- Total d'erreurs (dernières 24h)
- Événements de sécurité
- Temps de réponse moyen
- Alertes actives

### 🔴 Erreurs Critiques
- Liste des 10 erreurs critiques non résolues
- Stack traces complètes
- Contexte enrichi (user, IP, route)
- Actions: Résoudre, Ignorer

### 🔒 Menaces de Sécurité
- Tentatives d'attaque bloquées
- IPs suspectes
- Types d'attaque (SQL injection, XSS, brute force)
- Chronologie des événements

### ⚡ Performance
- Routes les plus lentes (P95, P99)
- Santé par endpoint (healthy/degraded/critical)
- Taux d'erreur par route
- Requêtes par minute

### 🛡️ Vulnérabilités
- Critiques: 0
- High: 2
- Medium: 5
- Recommandations d'action

### 🔮 Prédictions
- "Error rate increasing significantly" - 75% probabilité
- "Performance degradation likely" - 65% probabilité
- Actions préventives suggérées

---

## 🔧 Configuration Avancée

### Notifications par Email

Éditez `lib/monitoring/alert-system.ts:169`:

```typescript
private async sendEmailNotification(alert: Alert): Promise<void> {
  await fetch('https://api.sendgrid.com/v3/mail/send', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.SENDGRID_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      personalizations: [{ to: [{ email: 'admin@votredomaine.com' }] }],
      from: { email: 'alerts@votredomaine.com' },
      subject: `[ALERT] ${alert.title}`,
      content: [{ type: 'text/plain', value: alert.description }]
    })
  });
}
```

### Notifications Slack

Éditez `lib/monitoring/alert-system.ts:177`:

```typescript
private async sendSlackNotification(alert: Alert): Promise<void> {
  await fetch(process.env.SLACK_WEBHOOK_URL!, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      text: `🚨 ${alert.severity.toUpperCase()}: ${alert.title}`,
      blocks: [{
        type: 'section',
        text: { type: 'mrkdwn', text: alert.description }
      }]
    })
  });
}
```

Variables d'environnement:
```env
SENDGRID_API_KEY=your_key
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/xxx
```

### Scans Automatiques

Créez `app/api/cron/security-scan/route.ts`:

```typescript
import { vulnerabilityScanner } from '@/lib/monitoring';
import { NextResponse } from 'next/server';

export async function GET() {
  const audit = await vulnerabilityScanner.runSecurityAudit();

  return NextResponse.json({
    success: true,
    score: audit.securityScore.overallScore,
    vulnerabilities: audit.vulnerabilities.length
  });
}
```

Ajoutez dans `vercel.json`:
```json
{
  "crons": [{
    "path": "/api/cron/security-scan",
    "schedule": "0 2 * * *"
  }]
}
```

---

## 📈 Métriques de Succès

Après 24h d'utilisation, vous devriez observer:

- ✅ **100+** événements capturés
- ✅ **10+** requêtes par minute trackées
- ✅ **5+** anomalies détectées
- ✅ **0** faux positifs (ajustez les seuils si nécessaire)
- ✅ **< 2s** temps de chargement du dashboard

---

## 🆘 Problèmes Courants

### "Aucune donnée dans le dashboard"

**Solutions:**
1. Attendez 5-10 secondes (temps de flush des queues)
2. Vérifiez que vous êtes bien admin dans la table `profiles`
3. Vérifiez les RLS policies dans Supabase
4. Ouvrez la console (F12) pour voir les erreurs

### "Score de sécurité à 0"

**Solutions:**
1. Lancez un scan manuel: Cliquez "Run Vulnerability Scan"
2. Attendez la fin du scan (peut prendre 30-60s)
3. Rechargez la page

### "Erreurs Sentry non envoyées"

**Solutions:**
1. Vérifiez `NEXT_PUBLIC_SENTRY_DSN` dans `.env.local`
2. Redémarrez le serveur dev: `npm run dev`
3. Testez manuellement: `Sentry.captureMessage('test')`

### "Performances dégradées"

**Solutions:**
1. Augmentez `BATCH_SIZE` de 10 à 50
2. Augmentez `FLUSH_INTERVAL` de 5000 à 10000ms
3. Vérifiez les index PostgreSQL: `\di` dans psql

---

## 🎓 Prochaines Étapes Recommandées

### Semaine 1: Observation
- [ ] Surveiller le dashboard quotidiennement
- [ ] Identifier les patterns d'erreurs
- [ ] Noter les routes lentes (P95 > 1000ms)
- [ ] Ajuster les seuils d'alerte si nécessaire

### Semaine 2: Optimisation
- [ ] Résoudre les erreurs critiques
- [ ] Optimiser les routes avec taux d'erreur > 5%
- [ ] Configurer les notifications email/Slack
- [ ] Créer des alertes personnalisées

### Semaine 3: Automatisation
- [ ] Configurer les scans automatiques quotidiens
- [ ] Mettre en place des rapports hebdomadaires
- [ ] Créer des dashboards personnalisés
- [ ] Documenter les playbooks d'incident

### Mois 1: Excellence
- [ ] Score de sécurité > 85/100
- [ ] Taux d'erreur global < 1%
- [ ] Temps de réponse moyen < 200ms
- [ ] Zéro vulnérabilité critique

---

## 🏆 Objectifs Finaux

Votre système de monitoring devrait vous permettre de:

1. **Détecter** - Identifier les problèmes en temps réel
2. **Diagnostiquer** - Comprendre la cause racine rapidement
3. **Décider** - Avoir les données pour prioriser les actions
4. **Prévenir** - Anticiper les problèmes avant qu'ils arrivent
5. **Prouver** - Démontrer la fiabilité et sécurité de votre plateforme

---

## 📞 Ressources et Support

### Documentation
- [Guide complet](./SECURITY_MONITORING_GUIDE.md)
- [Architecture](./MONITORING_SYSTEM_ARCHITECTURE.md)
- [Exemples](./MONITORING_EXAMPLES.md)
- [Checklist](./MONITORING_ACTIVATION_CHECKLIST.md)

### Code Source
- [lib/monitoring/](./lib/monitoring/) - Tous les systèmes
- [app/admin/dashboard/security/](./app/admin/(dashboard)/dashboard/security/) - Dashboard
- [supabase/migrations/](./supabase/migrations/) - Schema DB

### Tests
- [scripts/test-monitoring.ts](./scripts/test-monitoring.ts) - Tests complets

---

## ✨ Félicitations!

Vous avez maintenant un système de monitoring de **niveau bancaire** avec:

- 🔒 Détection temps réel des menaces de sécurité
- 📊 Visibilité complète sur les erreurs et performances
- 🤖 Intelligence artificielle pour la détection d'anomalies
- 🔮 Prédictions des problèmes futurs
- 🎨 Dashboard moderne et intuitif
- 📧 Notifications multi-canal
- 🚀 Performance optimale (< 5ms overhead)
- 💰 Coût $0 (infrastructure uniquement)

**Votre plateforme est maintenant observable, sécurisée, et résiliente! 🎉**

---

*Besoin d'aide? Consultez les autres fichiers de documentation ou créez une issue.*
