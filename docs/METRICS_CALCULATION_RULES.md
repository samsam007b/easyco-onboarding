# Règles de Calcul des Métriques Izzico

## Principe Fondamental

```
┌─────────────────────────────────────────────────────────────┐
│  IZZICO = Usine à Data & Insights                           │
│                                                             │
│  1. On calcule dès qu'on a AU MOINS 1 donnée               │
│  2. Les valeurs se lissent naturellement avec le temps     │
│  3. Sections TOUJOURS visibles ("--" si pas de données)    │
│  4. Jamais de valeurs hardcodées visibles                  │
└─────────────────────────────────────────────────────────────┘
```

## Catégories de Données

### À COLLECTER (Impossible à inventer)
- Documents légaux (fiches de paie, contrats)
- IBAN / Coordonnées bancaires
- Informations de contact
- Photos propriété
- Loyer demandé
- Déclarations de paiement (popup resident)
- Signalements maintenance
- Coûts de réparation (factures owner)

### À GÉNÉRER (Notre valeur ajoutée - Core Business)
- Taux de rétention
- Jour de paiement réel moyen
- Mode de paiement préféré (observé)
- Coût moyen maintenance
- Performance financière
- Tendances & projections
- Score de santé
- Comparaisons marché

---

## Métriques Détaillées

### 1. Taux de Recouvrement (Collection Rate)

| Propriété | Valeur |
|-----------|--------|
| **Formule** | `(montant_déclaré_payé / montant_attendu) × 100` |
| **Période** | Mois en cours |
| **Affichage dès** | Premier loyer attendu créé |
| **Avant données** | `--` |

```typescript
const collectionRate = totalExpected > 0
  ? Math.round((totalPaid / totalExpected) * 100)
  : null;

// Affichage
{collectionRate !== null ? `${collectionRate}%` : '--'}
```

---

### 2. Évolution des Revenus (Revenue Change %)

| Propriété | Valeur |
|-----------|--------|
| **Formule** | `((revenu_mois_N - revenu_mois_N-1) / revenu_mois_N-1) × 100` |
| **Affichage dès** | 2ème mois complet de données |
| **Avant 2 mois** | Afficher montant brut, pas de % |

```typescript
const revenueChange = previousMonthRevenue > 0
  ? Math.round(((currentMonthRevenue - previousMonthRevenue) / previousMonthRevenue) * 100)
  : null;

// Affichage
{revenueChange !== null ? (
  <span className={revenueChange >= 0 ? 'text-green-500' : 'text-red-500'}>
    {revenueChange >= 0 ? '+' : ''}{revenueChange}%
  </span>
) : (
  <span className="text-gray-400">Premier mois</span>
)}
```

---

### 3. Taux d'Occupation

| Propriété | Valeur |
|-----------|--------|
| **Formule** | `(propriétés_avec_résidents / total_propriétés) × 100` |
| **Affichage dès** | Première propriété créée |
| **Avant données** | `0%` (réel, pas mock) |

```typescript
const occupationRate = totalProperties > 0
  ? Math.round((occupiedProperties / totalProperties) * 100)
  : 0;
```

---

### 4. Taux de Rétention

| Propriété | Valeur |
|-----------|--------|
| **Formule** | `(résidents_restés / total_résidents_depuis_début) × 100` |
| **Affichage dès** | Toujours (100% par défaut = réel) |
| **Note** | 100% au début n'est PAS du mock, c'est la réalité |

```typescript
const retentionRate = totalResidentsEver > 0
  ? Math.round(((totalResidentsEver - totalDepartures) / totalResidentsEver) * 100)
  : 100; // 100% si personne n'est jamais parti = réel
```

---

### 5. Durée Moyenne de Séjour

| Propriété | Valeur |
|-----------|--------|
| **Formule** | `moyenne(date_départ - date_arrivée)` pour résidents partis |
| **Affichage dès** | Premier départ enregistré |
| **Avant données** | `--` |

```typescript
const avgStayDuration = departedResidents.length > 0
  ? Math.round(departedResidents.reduce((sum, r) =>
      sum + daysBetween(r.move_in_date, r.move_out_date), 0) / departedResidents.length / 30)
  : null;

// Affichage
{avgStayDuration !== null ? `${avgStayDuration} mois` : '--'}
```

---

### 6. Coût Moyen Maintenance

| Propriété | Valeur |
|-----------|--------|
| **Formule** | `somme(coûts_réels) / nombre_interventions_avec_coût` |
| **Affichage dès** | Premier coût renseigné |
| **Avant données** | `--` |

```typescript
const avgMaintenanceCost = ticketsWithCost.length > 0
  ? Math.round(ticketsWithCost.reduce((sum, t) => sum + t.actual_cost, 0) / ticketsWithCost.length)
  : null;

// Affichage
{avgMaintenanceCost !== null ? `€${avgMaintenanceCost}` : '--'}
```

---

### 7. Temps Moyen de Résolution

| Propriété | Valeur |
|-----------|--------|
| **Formule** | `moyenne(date_résolu - date_créé)` en heures |
| **Affichage dès** | Premier ticket résolu |
| **Avant données** | `--` |

```typescript
const avgResolutionTime = resolvedTickets.length > 0
  ? Math.round(resolvedTickets.reduce((sum, t) =>
      sum + hoursBetween(t.created_at, t.resolved_at), 0) / resolvedTickets.length)
  : null;

// Affichage
{avgResolutionTime !== null ? `${avgResolutionTime}h` : '--'}
```

---

### 8. Health Score (Score de Santé)

| Propriété | Valeur |
|-----------|--------|
| **Formule** | Combinaison pondérée (voir ci-dessous) |
| **Affichage dès** | Première propriété avec résident |
| **Avant données** | `--` |

**Formule de calcul :**
```typescript
const calculateHealthScore = () => {
  // Composants disponibles avec leurs poids
  const components = [
    { value: occupationRate, weight: 0.30, available: totalProperties > 0 },
    { value: collectionRate, weight: 0.30, available: totalExpected > 0 },
    { value: maintenanceScore, weight: 0.20, available: resolvedTickets.length > 0 },
    { value: retentionRate, weight: 0.20, available: true }, // Toujours dispo (100% par défaut)
  ];

  const availableComponents = components.filter(c => c.available);
  if (availableComponents.length === 0) return null;

  // Recalculer les poids pour les composants disponibles
  const totalWeight = availableComponents.reduce((sum, c) => sum + c.weight, 0);

  return Math.round(
    availableComponents.reduce((sum, c) =>
      sum + (c.value * (c.weight / totalWeight)), 0)
  );
};
```

**Interprétation :**
- 90-100 : Excellent (vert)
- 70-89 : Bon (vert clair)
- 50-69 : Attention (orange)
- < 50 : Critique (rouge)

---

## Affichage UI

### Pattern "En attente de données"

```tsx
// Composant réutilisable
const MetricValue = ({
  value,
  suffix = '',
  prefix = '',
  fallbackText = '--'
}: {
  value: number | null;
  suffix?: string;
  prefix?: string;
  fallbackText?: string;
}) => {
  if (value === null) {
    return <span className="text-gray-400">{fallbackText}</span>;
  }
  return <span>{prefix}{value}{suffix}</span>;
};

// Usage
<MetricValue value={revenueChange} suffix="%" prefix="+" />
<MetricValue value={avgStayDuration} suffix=" mois" />
<MetricValue value={collectionRate} suffix="%" />
```

### Tooltip explicatif (optionnel)

Pour les métriques sans données, on peut ajouter un tooltip :

```tsx
<Tooltip content="Cette métrique sera calculée après le premier mois complet">
  <span className="text-gray-400 cursor-help">--</span>
</Tooltip>
```

---

## Règles de Persistence

### Données à stocker pour calculs historiques

```sql
-- Vue mensuelle agrégée (à créer)
CREATE VIEW monthly_owner_stats AS
SELECT
  owner_id,
  DATE_TRUNC('month', created_at) as month,
  SUM(amount) FILTER (WHERE status = 'paid') as total_paid,
  SUM(amount) as total_expected,
  COUNT(DISTINCT property_id) as properties_count
FROM rent_payments
JOIN properties ON properties.id = rent_payments.property_id
GROUP BY owner_id, DATE_TRUNC('month', created_at);
```

### Calcul de l'historique

Pour les nouveaux owners, on commence à compter à partir de leur `created_at` dans la table `profiles` ou leur première propriété.

---

## Résumé des Seuils d'Affichage

| Métrique | Condition Minimale | Fallback |
|----------|-------------------|----------|
| Collection Rate | 1 loyer attendu | `--` |
| Revenue Change % | 2 mois complets | "Premier mois" |
| Occupation Rate | 1 propriété | `0%` |
| Retention Rate | Toujours | `100%` |
| Avg Stay Duration | 1 départ | `--` |
| Avg Maintenance Cost | 1 coût renseigné | `--` |
| Avg Resolution Time | 1 ticket résolu | `--` |
| Health Score | 1 propriété occupée | `--` |

---

## Changelog

- **2026-02-01** : Création du document
- Règles définies avec @samuel pour assurer cohérence données réelles vs mockées
