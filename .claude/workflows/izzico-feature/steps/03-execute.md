# Étape 3: EXECUTE

**Objectif**: Implémenter la feature selon le plan établi.

## Règles d'Implémentation

### 3.1 Ordre d'Exécution

1. **Database first** (si migrations nécessaires)
   - Crée les migrations avec le bon numéro
   - Ajoute les RLS policies appropriées
   - Teste avec `npm run db:push` si disponible

2. **Types et interfaces**
   - Définis les types TypeScript
   - Utilise Zod pour la validation

3. **API routes** (si nécessaires)
   - Validation des inputs avec Zod
   - Gestion d'erreurs appropriée
   - Rate limiting si nécessaire

4. **Logique métier**
   - Hooks personnalisés
   - Fonctions utilitaires

5. **Composants UI**
   - Utilise les composants de `components/ui/` en priorité
   - Applique le design V3-fun
   - Respecte les couleurs du rôle

### 3.2 Checklist par Fichier

Pour chaque fichier créé/modifié:

**Composants React**:
- [ ] `'use client'` si hooks/interactivité
- [ ] Props typées avec interface
- [ ] Couleurs du rôle utilisées (pas de couleurs hardcodées)
- [ ] Textes en français (tutoiement)
- [ ] Pas d'emojis
- [ ] Animations avec Framer Motion si nécessaire
- [ ] Responsive (mobile-first)

**API Routes**:
- [ ] Validation Zod des inputs
- [ ] Authentification vérifiée
- [ ] Erreurs génériques (pas de détails sensibles)
- [ ] Logging sécurisé (sanitized)

**Migrations SQL**:
- [ ] Numéro séquentiel correct
- [ ] RLS policies incluses
- [ ] Rollback possible

### 3.3 Patterns Izzico à Utiliser

**Couleurs par rôle**:
```tsx
// Searcher
className="bg-searcher-500 hover:bg-searcher-600"
className="bg-gradient-searcher"

// Owner
className="bg-owner-500 hover:bg-owner-600"
className="bg-gradient-owner"

// Resident
className="bg-resident-500 hover:bg-resident-600"
className="bg-gradient-resident"
```

**Design V3-fun**:
```tsx
// Cards
className="rounded-2xl shadow-soft p-6"

// Buttons
className="rounded-full px-6 py-3 font-semibold"

// Animations
import { motion } from 'framer-motion'
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.3 }}
>
```

**Voice Guidelines**:
```tsx
// Tutoiement
"Crée ton Living Persona"  // ✅
"Créez votre profil"       // ❌

// Termes Izzico
"Living Match"             // ✅
"Match"                    // ❌

// Pas d'emojis
"Bienvenue !"              // ✅
"Bienvenue ! 🎉"          // ❌
```

### 3.4 Implémentation

**Exécute maintenant** chaque phase du plan:

1. Pour chaque tâche du plan:
   - Crée/modifie le fichier
   - Vérifie la checklist
   - Passe à la tâche suivante

2. Utilise le TodoWrite pour tracker la progression:
   - Marque chaque tâche en `in_progress` puis `completed`

## Validation de l'Étape

Avant de passer à la validation:
- [ ] Toutes les tâches du plan sont complétées
- [ ] Le code compile sans erreurs
- [ ] Les patterns Izzico sont respectés

## Next Step

**Étape suivante**: Lis et exécute `.claude/workflows/izzico-feature/steps/04-validate.md`
