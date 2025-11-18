# 🎯 Admin Dashboard - Guide d'Utilisation

## Accès au Dashboard

### URL
```
https://easyco.be/admin/dashboard
```

### Authentification Requise
Le dashboard est **protégé** et nécessite :
- ✅ Connexion utilisateur valide
- ✅ Rôle `admin` ou flag `is_admin = true` dans `user_profiles`

### Configuration Base de Données

Ajoutez le champ admin à votre table `user_profiles` :

```sql
ALTER TABLE user_profiles
ADD COLUMN is_admin BOOLEAN DEFAULT FALSE;

-- Donner accès admin à un utilisateur
UPDATE user_profiles
SET is_admin = TRUE
WHERE user_id = 'your-user-id';
```

---

## 📊 Fonctionnalités

### 1. **Quick Stats** (Cartes du haut)

Quatre métriques clés en temps réel :

| Métrique | Description | Source |
|----------|-------------|--------|
| **Utilisateurs Actifs** | Nombre d'utilisateurs actuellement en ligne | Analytics temps réel |
| **Vues de Pages** | Total des pages vues aujourd'hui | Analytics |
| **Conversions** | Nombre de conversions (inscriptions, candidatures) | Events trackés |
| **Temps de Réponse** | Temps moyen de réponse API en ms | System monitoring |

**Indicateurs de changement** :
- 🟢 Vert = amélioration
- 🔴 Rouge = dégradation

---

### 2. **Base de Données**

Statistiques en temps réel de la base Supabase :

```typescript
- Total Utilisateurs    // user_profiles.count()
- Propriétés           // properties.count()
- Candidatures         // applications.count()
- Matchs Actifs        // matches.count()
```

**Mise à jour** : Données réelles de Supabase, rafraîchies toutes les 30s

---

### 3. **Santé du Système**

Monitoring de l'infrastructure :

| Métrique | Excellent | Bon | Attention | Critique |
|----------|-----------|-----|-----------|----------|
| **Uptime** | > 99.9% | > 99% | > 95% | < 95% |
| **Temps Réponse** | < 200ms | < 500ms | < 1000ms | > 1000ms |
| **Taux Erreur** | < 0.5% | < 1% | < 2% | > 2% |
| **Queue Size** | < 10 | < 50 | < 100 | > 100 |

**Code couleur** :
- 🟢 Excellent (vert)
- 🔵 Bon (bleu)
- 🟡 Attention (jaune)
- 🔴 Critique (rouge)

---

### 4. **Core Web Vitals**

Performance utilisateur (métriques Google) :

```javascript
FCP (First Contentful Paint)    // Seuil: < 1.8s
LCP (Largest Contentful Paint)   // Seuil: < 2.5s
CLS (Cumulative Layout Shift)    // Seuil: < 0.1
FID (First Input Delay)          // Seuil: < 100ms
```

**Barres de progression** :
- 🟢 Vert = dans le seuil (bon)
- 🔴 Rouge = au-dessus du seuil (à améliorer)

---

### 5. **Analytics Temps Réel**

Vue d'ensemble de l'activité :

- **Taux de Rebond** : % d'utilisateurs quittant après 1 page
- **Utilisateurs en ligne** : Nombre actuel
- **Conversions aujourd'hui** : Total des conversions

---

## 🔄 Auto-Refresh

Le dashboard se met à jour **automatiquement toutes les 30 secondes**.

Vous pouvez aussi forcer un refresh manuel :
```
Bouton "Actualiser" (en haut à droite)
```

---

## 🎨 Personnalisation

### Ajouter de Nouvelles Métriques

Éditez `/app/admin/dashboard/page.tsx` :

```typescript
interface SystemMetrics {
  // Ajoutez votre nouvelle section ici
  myCustomMetrics: {
    metric1: number;
    metric2: string;
  };
}

// Dans loadMetrics()
const myData = await supabase
  .from('my_table')
  .select('*')
  .eq('status', 'active');

mockMetrics.myCustomMetrics = {
  metric1: myData.count,
  metric2: 'value',
};
```

### Intégrer Google Analytics

Remplacez les données simulées par de vraies données GA4 :

```typescript
// Installer @google-analytics/data
npm install @google-analytics/data

// Dans loadMetrics()
const analyticsData = await runReport({
  propertyId: 'YOUR_PROPERTY_ID',
  dateRanges: [{ startDate: 'today', endDate: 'today' }],
  metrics: [
    { name: 'activeUsers' },
    { name: 'screenPageViews' },
  ],
});
```

---

## 🔒 Sécurité

### Protection Route

La page vérifie automatiquement :
1. Utilisateur connecté
2. Rôle admin dans la base

Si l'une de ces conditions échoue :
```typescript
// Utilisateur non connecté → /login?redirect=/admin/dashboard
// Utilisateur non admin → /dashboard
```

### Logs d'Accès

Ajoutez un tracking des accès admin :

```typescript
// Dans checkAdminAccess()
await supabase.from('admin_access_logs').insert({
  user_id: user.id,
  accessed_at: new Date().toISOString(),
  ip_address: req.headers['x-forwarded-for'],
});
```

---

## 📈 KPIs Recommandés

### Business Metrics
```
- Taux de conversion onboarding: > 70%
- Temps moyen onboarding: < 5min
- Taux d'activation (J+7): > 40%
- Taux de rétention (M+1): > 60%
```

### Technical Metrics
```
- Uptime: > 99.9%
- Response time (P95): < 500ms
- Error rate: < 0.5%
- Core Web Vitals: tous "Good"
```

---

## 🚨 Alertes

### Configurer des Alertes Email

Ajoutez des seuils critiques :

```typescript
// Dans loadMetrics(), après avoir chargé les données
if (mockMetrics.system.errorRate > 2) {
  await sendAlertEmail({
    to: 'admin@easyco.be',
    subject: '🚨 ALERTE: Taux d\'erreur élevé',
    body: `Taux d'erreur actuel: ${mockMetrics.system.errorRate}%`,
  });
}

if (mockMetrics.system.responseTime > 1000) {
  await sendSlackNotification({
    channel: '#alerts',
    message: '⚠️ Temps de réponse élevé: ${mockMetrics.system.responseTime}ms',
  });
}
```

---

## 🎯 Prochaines Améliorations

- [ ] Graphiques historiques (Chart.js ou Recharts)
- [ ] Export CSV des métriques
- [ ] Logs d'erreurs en temps réel (Sentry integration)
- [ ] Alertes configurables par l'utilisateur
- [ ] Gestion des utilisateurs (ban, rôles)
- [ ] Statistiques de revenue

---

## 📞 Support

Pour toute question sur le dashboard admin :
- Documentation : `/docs/ADMIN_DASHBOARD.md`
- Code source : `/app/admin/dashboard/page.tsx`
- Tests : `/__tests__/admin/` (à créer)
