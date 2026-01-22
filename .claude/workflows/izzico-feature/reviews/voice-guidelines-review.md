# Review: Voice Guidelines

**Objectif**: Vérifier la conformité des textes avec la voix Izzico.

## Source de Vérité

- `brand-identity/izzico-voice-guidelines.md` - Règles absolues

## Checklist de Review

### 1. Terminologie Izzico

**Termes OBLIGATOIRES**:

| Utiliser | NE PAS utiliser |
|----------|-----------------|
| co-living | coloc, colocation, kot |
| résident | locataire |
| résidence, maison | bien immobilier, propriété |
| Living Persona | profil, questionnaire |
| Living Match | match, correspondance |
| contrat | bail |

**Pattern recherché** (FAIL):
```tsx
// ❌ Mauvaise terminologie
<h1>Trouvez votre coloc idéale</h1>
<p>Remplissez votre profil</p>
<span>Vous avez un nouveau match !</span>
<label>Votre bien immobilier</label>
```

**Pattern attendu** (PASS):
```tsx
// ✅ Terminologie Izzico
<h1>Trouve ton co-living idéal</h1>
<p>Crée ton Living Persona</p>
<span>Tu as un nouveau Living Match !</span>
<label>Ta résidence</label>
```

### 2. Tutoiement

**Règle**: TOUJOURS "tu" sauf pages légales.

| Contexte | Pronom |
|----------|--------|
| Tous les utilisateurs | Tu |
| Pages légales/CGV | Vous |
| Emails transactionnels | Tu |

**Pattern recherché** (FAIL):
```tsx
// ❌ Vouvoiement inapproprié
<p>Bienvenue sur votre espace</p>
<button>Modifiez vos préférences</button>
<span>Nous vous remercions</span>
```

**Pattern attendu** (PASS):
```tsx
// ✅ Tutoiement
<p>Bienvenue dans ton espace</p>
<button>Modifie tes préférences</button>
<span>Merci !</span>
```

### 3. Salutations & Signatures

**Par segment**:

| Segment | Salutation | Signature |
|---------|------------|-----------|
| Searchers | "Hello [Prénom] !" | "L'équipe Izzico" |
| Résidents | "Hello [Prénom] !" | "L'équipe Izzico" |
| Propriétaires | "Bonjour [Prénom]" | "L'équipe Izzico" |

**Pattern recherché** (FAIL):
```tsx
// ❌ Salutations incorrectes (pour Searcher)
<h1>Bonjour {user.name},</h1>  // Trop formel
<p>Cordialement, L'équipe</p>  // Mauvaise signature

// ❌ Pour Propriétaire
<h1>Hello {user.name} !</h1>  // Trop casual
```

**Pattern attendu** (PASS):
```tsx
// ✅ Searcher/Résident
<h1>Hello {user.firstName} !</h1>
<p>L'équipe Izzico</p>

// ✅ Propriétaire
<h1>Bonjour {user.firstName}</h1>
<p>L'équipe Izzico</p>
```

### 4. Emojis

**Règle**: BANNIR tous les emojis standards.

**Pattern recherché** (FAIL):
```tsx
// ❌ Emojis présents
<h1>Bienvenue ! 🎉</h1>
<p>Tu as un message 💬</p>
<button>Valider ✅</button>
<span>Attention ⚠️</span>
```

**Pattern attendu** (PASS):
```tsx
// ✅ Pas d'emojis - utiliser icônes Izzico
<h1>Bienvenue !</h1>
<p>Tu as un message</p>
<button>Valider</button>
<span>Attention</span>

// ✅ Avec icônes custom si besoin
import { IzzicoIcon } from '@/components/icons'
<IzzicoIcon name="check" />
```

### 5. Mots Bannis

**Corporate speak** (BANNIR):
- leverage, synergy, revolutionary, disruptive
- game-changer, innovative, solutions, empower
- transform, seamless, cutting-edge
- best-in-class, world-class

**Froideur immobilière** (BANNIR):
- bien immobilier, locataire, bail
- candidature (pour matching), propriété (pour résidence)

**Formalisme excessif** (BANNIR):
- "Nous vous informons que..."
- "Veuillez noter que..."
- "Il est porté à votre connaissance..."
- "Suite à votre demande..."
- "Nous avons le plaisir de..."

**Culpabilisation** (BANNIR):
- "Vous n'avez toujours pas..."
- "N'oubliez pas de..."
- "Il est important de..."
- "Comme mentionné précédemment..."

### 6. Ton par Segment

**Dimensions du ton** (échelle 1-5):

| Dimension | Searchers | Résidents | Propriétaires |
|-----------|-----------|-----------|---------------|
| Formalité | 4 (Casual) | 4 (Casual) | 3 (Neutre) |
| Humour | 4 (Léger) | 5 (Désamorce) | 3 (Sobre) |
| Irrévérence | 4 | 4-5 | 2 (Respectueux) |
| Énergie | 4-5 (Haute) | 4-5 (Haute) | 3-4 (Modérée) |

**Exemples par segment**:

```tsx
// Searcher - Casual, énergique
"Tu cherches ton prochain chez-toi ? On t'aide à le trouver !"

// Résident - Très casual, peut désamorcer
"Ton nouveau coloc fait trop de bruit ? On a des tips."

// Propriétaire - Plus posé, respectueux
"Votre annonce est en ligne. Les premiers résidents intéressés vont bientôt vous contacter."
```

### 7. Longueur et Clarté

**Règles**:
- Phrases courtes (< 20 mots idéalement)
- Un message par phrase
- Verbes d'action

**Pattern recherché** (FAIL):
```tsx
// ❌ Trop long et passif
<p>
  Nous sommes heureux de vous informer que votre demande
  a été traitée avec succès et que vous allez recevoir
  un email de confirmation dans les prochaines heures.
</p>
```

**Pattern attendu** (PASS):
```tsx
// ✅ Court et direct
<p>C'est fait ! Check ta boîte mail.</p>
```

## Format du Rapport

Pour chaque issue trouvée:

```markdown
### V-[ID]: [Titre du problème]

**Sévérité**: [CRITICAL | HIGH | MEDIUM | LOW]
**Fichier**: [path/file.tsx:ligne]
**Règle violée**: [Terminologie | Tutoiement | Emoji | Ton | etc.]
**Segment concerné**: [Searcher | Résident | Propriétaire | Tous]

**Texte problématique**:
> [texte actuel]

**Correction suggérée**:
> [texte corrigé]

**Justification**: [Pourquoi ce changement]
```

## Classification des Sévérités

| Sévérité | Critères |
|----------|----------|
| CRITICAL | "Coloc" ou termes interdits en gros titre |
| HIGH | Vouvoiement, emojis, mots bannis |
| MEDIUM | Ton inapproprié au segment |
| LOW | Optimisation de formulation |

## Scoring

| Catégorie | Points Max |
|-----------|------------|
| Terminologie Izzico | 25 |
| Tutoiement | 20 |
| Pas d'emojis | 15 |
| Mots bannis | 15 |
| Ton approprié | 15 |
| Clarté | 10 |

**Score Voice = Total / 100**

- ≥ 90: ✅ IZZICO VOICE
- 75-89: 🟡 PRESQUE (quelques ajustements)
- 60-74: 🟠 RÉVISION NÉCESSAIRE
- < 60: 🔴 RÉÉCRITURE REQUISE
