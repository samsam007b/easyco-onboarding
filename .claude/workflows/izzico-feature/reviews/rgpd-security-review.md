# Review: RGPD & Security

**Objectif**: Vérifier la conformité RGPD et la sécurité du code.

## Sources de Vérité

- `.claude/skills/post-code-security-audit.md` - Patterns de sécurité
- `.claude/resources/ai-security-antipatterns.md` - Anti-patterns connus
- `supabase/migrations/117_bank_info_2fa.sql` - Référence sécurité bancaire

## Checklist RGPD

### 1. Collecte de Données

**Vérifier**:
- [ ] Consentement explicite avant collecte
- [ ] Finalité de la collecte claire
- [ ] Données minimales collectées (data minimization)

**Questions à se poser**:
- Cette donnée est-elle nécessaire pour la feature ?
- L'utilisateur sait-il pourquoi on collecte cette donnée ?
- Y a-t-il un consentement tracé ?

**Pattern recherché** (FAIL):
```tsx
// ❌ Collecte sans consentement
const trackUserBehavior = () => {
  analytics.track('page_view', { userId, location, device });
}

// ❌ Données excessives
const formData = { ...allUserInput }; // Collecte tout
```

**Pattern attendu** (PASS):
```tsx
// ✅ Avec consentement
if (user.hasConsented('analytics')) {
  analytics.track('page_view', { userId });
}

// ✅ Données minimales
const formData = {
  name: input.name,
  email: input.email,
  // Seulement ce qui est nécessaire
};
```

### 2. Stockage et Accès

**Vérifier**:
- [ ] RLS policies sur les tables concernées
- [ ] Pas d'accès à des données d'autres utilisateurs
- [ ] Données sensibles chiffrées

**Tables sensibles Izzico**:
| Table | Sensibilité | Protection Requise |
|-------|-------------|-------------------|
| `user_bank_info` | CRITICAL | RLS + 2FA + Chiffrement |
| `user_profiles` | HIGH | RLS |
| `messages` | HIGH | RLS (participants only) |
| `matching_preferences` | MEDIUM | RLS |

**Pattern recherché** (FAIL):
```sql
-- ❌ Pas de RLS
CREATE TABLE user_data (
  id UUID PRIMARY KEY,
  sensitive_info TEXT
);
-- Manque: ALTER TABLE user_data ENABLE ROW LEVEL SECURITY;

-- ❌ Policy trop permissive
CREATE POLICY "anyone can read" ON user_data FOR SELECT USING (true);
```

**Pattern attendu** (PASS):
```sql
-- ✅ RLS activé
ALTER TABLE user_data ENABLE ROW LEVEL SECURITY;

-- ✅ Policy restrictive
CREATE POLICY "users can read own data"
  ON user_data FOR SELECT
  USING (auth.uid() = user_id);
```

### 3. Droit à l'Oubli

**Vérifier**:
- [ ] Données peuvent être supprimées sur demande
- [ ] Cascade ou cleanup des données liées
- [ ] Pas de données orphelines

### 4. Portabilité

**Vérifier**:
- [ ] Export des données possible
- [ ] Format standard (JSON, CSV)

## Checklist Sécurité

### 5. Validation des Inputs

**Règle**: Tout input utilisateur doit être validé avec Zod.

**Vérifier**:
- [ ] Schéma Zod pour chaque API route
- [ ] Validation côté serveur (pas juste client)
- [ ] Types stricts

**Pattern recherché** (FAIL):
```typescript
// ❌ Pas de validation
export async function POST(request: Request) {
  const data = await request.json();
  const limit = parseInt(data.limit); // Injection possible
}
```

**Pattern attendu** (PASS):
```typescript
// ✅ Validation Zod
import { z } from 'zod';

const schema = z.object({
  limit: z.coerce.number().int().min(1).max(100),
  email: z.string().email(),
});

export async function POST(request: Request) {
  const data = schema.parse(await request.json());
}
```

### 6. Authentification

**Vérifier**:
- [ ] `auth.uid()` vérifié avant opérations sensibles
- [ ] Pas de `RETURN TRUE` hardcodé
- [ ] Session valide vérifiée

**Pattern recherché** (FAIL):
```sql
-- ❌ Auth bypassed
CREATE FUNCTION check_access() RETURNS BOOLEAN AS $$
BEGIN
  RETURN TRUE; -- TODO: implement
END;
$$ LANGUAGE plpgsql;
```

### 7. Logging Sécurisé

**Vérifier**:
- [ ] Pas de données sensibles dans les logs
- [ ] Pas de log injection possible
- [ ] Logs sanitized

**Pattern recherché** (FAIL):
```typescript
// ❌ Log injection
console.log(`User action: ${userInput}`);

// ❌ Données sensibles
console.log('User login:', { email, password });
```

**Pattern attendu** (PASS):
```typescript
// ✅ Sanitized
console.log('User action:', sanitizeLog(userInput));

// ✅ Pas de secrets
console.log('User login:', { email, timestamp: new Date() });
```

### 8. Erreurs Génériques

**Vérifier**:
- [ ] Pas d'erreurs détaillées en production
- [ ] Pas de stack traces exposés
- [ ] Messages génériques pour l'utilisateur

**Pattern recherché** (FAIL):
```typescript
// ❌ Erreur détaillée
return Response.json({ error: error.message, stack: error.stack });
```

**Pattern attendu** (PASS):
```typescript
// ✅ Erreur générique
console.error('[Internal]', error);
return Response.json({ error: 'Une erreur est survenue' }, { status: 500 });
```

### 9. Protection Données Bancaires (Spécifique Izzico)

**Si la feature touche `user_bank_info`**:

**Vérifier**:
- [ ] 2FA requis pour modification
- [ ] Cooldown 24h respecté
- [ ] Changement loggé dans `bank_info_change_notifications`

## Format du Rapport

Pour chaque issue trouvée:

```markdown
### S-[ID]: [Titre du problème]

**Sévérité**: [CRITICAL | HIGH | MEDIUM | LOW]
**Type**: [RGPD | SECURITY]
**Fichier**: [path/file.tsx:ligne]
**Règle violée**: [Nom de la règle]

**Code problématique**:
```[language]
[code actuel]
```

**Fix suggéré**:
```[language]
[code corrigé]
```

**Impact RGPD**: [Si applicable]
**Impact Sécurité**: [Conséquence potentielle]
```

## Classification des Sévérités

| Sévérité | Critères | Action |
|----------|----------|--------|
| CRITICAL | Faille exploitable, violation RGPD majeure | BLOCKER - Fix immédiat |
| HIGH | Vulnérabilité potentielle, données exposées | Fix avant deploy |
| MEDIUM | Best practice non respectée | Fix recommandé |
| LOW | Amélioration de sécurité | Fix optionnel |

## Scoring

| Catégorie | Points Max |
|-----------|------------|
| Validation inputs | 20 |
| RLS policies | 20 |
| Authentification | 15 |
| Logging sécurisé | 10 |
| Erreurs génériques | 10 |
| Consentement RGPD | 15 |
| Data minimization | 10 |

**Score Security = Total / 100**

- ≥ 90: ✅ SECURE
- 75-89: 🟡 ACCEPTABLE (fix mediums)
- 60-74: 🟠 AT RISK
- < 60: 🔴 VULNERABLE - DO NOT DEPLOY
