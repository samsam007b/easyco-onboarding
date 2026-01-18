# Supabase Cost Projection - Izzico (0 → 100k users)

## Pricing Tiers Supabase (2026)

| Tier | Prix/mois | DB Size | Bandwidth | Storage | API Requests |
|------|-----------|---------|-----------|---------|--------------|
| **Free** | $0 | 500 MB | 5 GB | 1 GB | Illimité* |
| **Pro** | $25 | 8 GB | 250 GB | 100 GB | Illimité* |
| **Team** | $599 | 100 GB | 1 TB | 500 GB | Illimité* |
| **Enterprise** | Custom | Illimité | Illimité | Illimité | Illimité |

\* Fair use policy appliquée

## Projection par palier d'utilisateurs

### 🟢 100 utilisateurs (Phase MVP - Mois 1-3)
```
Users actifs: 100
Messages/mois: 5,000
Notifications: 3,000
Properties: 50 listings

DB Size: 100 users × 2 KB = 200 KB
        + 5,000 messages × 1 KB = 5 MB
        + Metadata (properties, notifs) = 5 MB
        = ~10 MB total

Storage: 100 users × 5 MB = 500 MB (avatars + docs)
Bandwidth: ~2 GB/mois (images, API responses)

Tier: FREE ✅
Coût mensuel: $0
```

### 🟡 1,000 utilisateurs (Early Growth - Mois 4-8)
```
Users actifs: 1,000
Messages/mois: 50,000
Notifications: 30,000
Properties: 500 listings

DB Size: 1,000 users × 2 KB = 2 MB
        + 50,000 messages × 1 KB = 50 MB
        + 500 properties × 10 KB = 5 MB
        + Historical data = 50 MB
        = ~107 MB total

Storage: 1,000 users × 5 MB = 5 GB (avatars + docs)
Bandwidth: ~30 GB/mois

Tier: PRO ($25) ⚠️ Obligatoire (storage > 1 GB)
Coût mensuel: $25
```

### 🟠 5,000 utilisateurs (Product-Market Fit - Mois 9-18)
```
Users actifs: 5,000
Messages/mois: 250,000
Notifications: 150,000
Properties: 2,000 listings

DB Size: 5,000 users × 2 KB = 10 MB
        + 250,000 messages × 1 KB = 250 MB
        + 2,000 properties × 10 KB = 20 MB
        + Historical data (1 an) = 500 MB
        = ~780 MB total

Storage: 5,000 users × 5 MB = 25 GB
Bandwidth: ~150 GB/mois

Tier: PRO ($25) ✅ Confortable
Coût mensuel: $25
```

### 🔴 10,000 utilisateurs (Scale - An 2)
```
Users actifs: 10,000
Messages/mois: 500,000
Notifications: 300,000
Properties: 4,000 listings

DB Size: 10,000 users × 2 KB = 20 MB
        + 500,000 messages × 1 KB = 500 MB
        + 4,000 properties × 10 KB = 40 MB
        + Historical data (2 ans) = 1.5 GB
        = ~2.1 GB total

Storage: 10,000 users × 5 MB = 50 GB
Bandwidth: ~300 GB/mois (⚠️ dépassement Pro: 250 GB)

Tier: PRO ($25) + Bandwidth overage
Coût mensuel: $25 + $0.09/GB × 50 GB = $29.50
```

### ⚠️ 50,000 utilisateurs (POINT CRITIQUE - An 3-4)
```
Users actifs: 50,000
Messages/mois: 2,500,000
Notifications: 1,500,000
Properties: 15,000 listings

DB Size: 50,000 users × 2 KB = 100 MB
        + 2,500,000 messages × 1 KB = 2.5 GB
        + 15,000 properties × 10 KB = 150 MB
        + Historical data (3 ans) = 8 GB
        = ~10.8 GB total ⚠️ DÉPASSE PRO (8 GB)

Storage: 50,000 users × 5 MB = 250 GB (⚠️ dépassement Pro: 100 GB)
Bandwidth: ~1.5 TB/mois (⚠️ dépassement Pro: 250 GB)

Tier: TEAM ($599) OBLIGATOIRE
Coût mensuel: $599
```

**🚨 POINT DE RUPTURE #1** : À ~50k users, tu DOIS passer en Team tier ($599/mois) ou optimiser drastiquement.

### 🔥 100,000 utilisateurs (Scale Massive - An 5+)
```
Users actifs: 100,000
Messages/mois: 5,000,000
Notifications: 3,000,000
Properties: 25,000 listings

DB Size: 100,000 users × 2 KB = 200 MB
        + 5,000,000 messages × 1 KB = 5 GB
        + 25,000 properties × 10 KB = 250 MB
        + Historical data (4-5 ans) = 25 GB
        = ~30.5 GB total

Storage: 100,000 users × 5 MB = 500 GB
Bandwidth: ~3 TB/mois

Tier: TEAM ($599) + DB overage
Coût mensuel: $599 base
            + DB overage: (30.5 - 100 GB) = DANS limite Team ✅
            + Storage overage: 0 GB (exactement limite) ✅
            + Bandwidth overage: (3000 - 1000 GB) × $0.09 = $180
            = $779/mois
```

**🚨 POINT DE RUPTURE #2** : À 100k users, Supabase Team atteint ses limites. Migration vers Enterprise ou custom backend devient critique.

---

## Courbe de Coûts Supabase (graphique texte)

```
Coût mensuel ($)
│
800│                                              ╭─────● 100k users ($779)
   │                                            ╱
600│                                      ╭────● 50k users ($599)
   │                                    ╱
400│                                  ╱
   │                                ╱
200│                              ╱
   │                            ╱
 25│──────────────────────────● 1k-10k users ($25-30)
   │
  0│─────● 0-100 users ($0)
   └─────┬─────┬─────┬─────┬─────┬─────┬─────┬─────→ Utilisateurs
       100   1k   5k   10k  25k  50k  75k  100k
```

**Observation clé** : Coût reste STABLE à $25/mois de 1k à ~40k users, puis **explose** à $599 à 50k users (×24 d'augmentation brutale).

---

## Optimisations possibles pour retarder le Team tier

### 1. Archive des anciens messages (réduction DB)
```sql
-- Archiver messages > 2 ans dans table froide (moins chère)
CREATE TABLE messages_archive AS
SELECT * FROM messages
WHERE created_at < NOW() - INTERVAL '2 years';

DELETE FROM messages
WHERE created_at < NOW() - INTERVAL '2 years';
```
**Impact** : -50% DB size à 50k users → reste en Pro ($25) jusqu'à ~80k users

### 2. Compression d'images (réduction Storage)
```javascript
// Compresser avatars à 200×200, docs en WebP
// Au lieu de 5 MB/user → 2 MB/user
```
**Impact** : Storage 50k users = 100 GB (limite Pro) au lieu de 250 GB

### 3. CDN externe pour assets statiques (réduction Bandwidth)
```
CloudFlare R2 ou Backblaze B2 : $0.01/GB vs $0.09/GB Supabase
Bandwidth 1.5 TB = $15/mois au lieu de inclus dans Team tier
```

### 4. Pagination agressive (réduction API calls & bandwidth)
```typescript
// Charger 20 messages au lieu de 100
const { data } = await supabase
  .from('messages')
  .select('*')
  .limit(20) // Au lieu de 100
```

**Optimisations combinées** :
- Pro tier viable jusqu'à ~80k users (au lieu de 40k)
- Économie : $574/mois entre 50k-80k users
- Mais : Dette technique accumulée

---

## 🚨 Limites techniques Supabase (au-delà du pricing)

### Performance DB (critère ignoré par le pricing)

| Users | Messages/jour | Queries/sec | Statut Supabase |
|-------|---------------|-------------|-----------------|
| 1k | 1,600 | ~20 | ✅ Excellent |
| 10k | 16,000 | ~200 | ✅ Bon |
| 50k | 80,000 | ~1,000 | ⚠️ RLS commence à ralentir |
| 100k | 160,000 | ~2,000 | 🔴 **PostgreSQL saturé** |

**Point de rupture performance** : ~75k users actifs simultanés, PostgreSQL single-instance ne suit plus (même avec infra Team/Enterprise).

### Solutions à 100k users

1. **Read replicas** (Supabase Enterprise only)
   - Coût : +$500/mois par replica
   - Limite : Pas de sharding, juste lecture distribuée

2. **Sharding manuel** (migration hors Supabase)
   - Séparer DB par région géographique
   - Complexité : 3-6 mois de travail ingénieur senior

3. **Microservices** (migration partielle)
   - Messages → Service séparé (Redis + MongoDB)
   - Matching → Service ML séparé
   - Auth/Users → Reste sur Supabase
   - Complexité : 6-12 mois

---

## Recommandation stratégique palier par palier

### 0 → 10k users : RESTER SUR SUPABASE PRO ($25/mois)
**Pourquoi** :
- Coût ridiculement bas vs valeur
- Vélocité maximale (focus product)
- Migration prématurée = perte de temps

**Actions** :
- ✅ Continuer à utiliser Supabase tel quel
- ✅ Monitorer DB size mensuel
- ✅ Implémenter analytics (revenus vs coûts infra)

---

### 10k → 50k users : OPTIMISER + PLANIFIER
**Pourquoi** :
- Team tier ($599) approche
- Fenêtre pour optimiser avant saut de coût
- Temps de préparer migration si nécessaire

**Actions** :
- ⚠️ Implémenter archivage messages anciens
- ⚠️ Migrer assets vers CDN externe (CloudFlare R2)
- ⚠️ Auditer les requêtes les plus coûteuses (RLS)
- ⚠️ Évaluer alternatives (Firebase, AWS, custom)
- ⚠️ **Décision GO/NO-GO** : Rester Supabase Team ou migrer ?

**Coût migration à ce stade** : ~$30k-50k (2-3 mois ingénieur senior)

---

### 50k → 100k users : MIGRATION OU TEAM TIER
**Scénario A : Rester sur Supabase Team ($599/mois)**
- ✅ Simple, pas de migration
- ❌ Coût élevé ($7,188/an)
- ❌ Performance dégradée (RLS lent)
- ❌ Risque saturation à 100k+

**Scénario B : Migrer vers Custom Backend**
- ✅ Performance optimale (sharding, caching)
- ✅ Coût long terme inférieur (voir tableau comparatif)
- ❌ Coût migration : $50k-100k (6 mois)
- ❌ Risque technique (bugs, downtime)

**Décision basée sur** :
- **Revenus** : Si MRR > $20k → migration rentable
- **Équipe** : Si tu as levé + embauché CTO → migration
- **Croissance** : Si projection 200k users An 5 → migration obligatoire

---

## Comparaison : Supabase vs Alternatives (100k users)

Je vais créer un tableau de comparaison détaillé.
