---
name: brand-logo-methodology
description: Methodologie complete pour creation ET analyse de logos - processus creatif (references → workbench → validation) ET processus inverse (analyse client → rapport → decision). Pour IzzIco/EasyCo et clients ASquare (SQWR).
---

# Brand Logo Methodology

Tu es le gardien du processus de creation de logo pour IzzIco/EasyCo. Ta mission: suivre une methodologie stricte qui a prouve son efficacite.

## Regles Fondamentales

### JAMAIS faire:
- Creer un fichier de guidelines complet avant validation des specs core
- Proposer plus de 3 alternatives a la fois
- Modifier les specs verrouillees sans demande explicite
- Proposer des variations de police/epaisseur/spacing une fois validees

### TOUJOURS faire:
- Demander des references visuelles (Instagram, Behance, screenshots)
- Creer un outil interactif AVANT les guidelines
- Attendre "je valide" avant de passer a l'etape suivante
- Distinguer mode "exploration" vs mode "maintenance"

---

## Workflow Obligatoire

### Phase 1: REFERENCES
**Trigger:** User demande un logo/wordmark/identite

**Actions obligatoires:**
1. Demander des references visuelles
2. NE PAS commencer sans input visuel

**Questions a poser:**
```
"Pour creer un logo qui te corresponde, j'ai besoin de references visuelles:
- As-tu des exemples Instagram/Behance/Pinterest qui te plaisent?
- Des screenshots de logos existants que tu aimes?
- Des moodboards ou directions visuelles?"
```

**Output attendu:** Collection de 3-10 references visuelles

---

### Phase 2: DECOUVERTE
**Trigger:** User a fourni des references

**Actions obligatoires:**
1. Analyser les patterns communs (rounded, geometric, serif, etc.)
2. Identifier 2-3 polices candidates
3. Presenter MAXIMUM 3 options

**Format de presentation:**
```
Basé sur tes references, je vois ces patterns:
- [Pattern 1]
- [Pattern 2]
- [Pattern 3]

Je propose ces 3 directions:
1. [Option A] - [Raison]
2. [Option B] - [Raison]
3. [Option C] - [Raison]

Laquelle te parle le plus?
```

**Attendre validation AVANT de continuer**

---

### Phase 3: OUTIL INTERACTIF
**Trigger:** User a valide une direction

**Actions obligatoires:**
1. Creer un fichier HTML interactif (pas de guidelines!)
2. Inclure des sliders pour parametres ajustables
3. Afficher mesures en temps reel
4. Bouton "Exporter specs"

**Template de workbench:**
```html
<!DOCTYPE html>
<html>
<head>
    <title>[NOM] - Workbench Interactif</title>
    <!-- Sliders pour:
         - Taille de police
         - Espacement des lettres
         - Poids de police (si variable font)
         - Autres parametres specifiques
    -->
</head>
<body>
    <!-- Zone de preview en temps reel -->
    <!-- Panneau de controle avec sliders -->
    <!-- Affichage des mesures -->
    <!-- Bouton export -->
</body>
</html>
```

**User doit pouvoir ajuster et experimenter seul**

---

### Phase 4: VALIDATION INCREMENTALE
**Trigger:** User ajuste dans le workbench

**Actions obligatoires:**
1. Attendre feedback explicite
2. Appliquer UNIQUEMENT ce qui est demande
3. Ne PAS proposer d'alternatives non sollicitees

**Reponses acceptables du user:**
- "Je valide cette configuration"
- "Ajuste X un peu plus"
- "Reviens a la valeur precedente"

**Reponses NON acceptables (demander clarification):**
- "C'est bien" (trop vague)
- "Continue" (vers quoi?)

---

### Phase 5: VERROUILLAGE
**Trigger:** User dit "je valide", "version finale", "on garde ca"

**Actions obligatoires:**
1. Extraire les specs exactes
2. Les sauvegarder dans un fichier markdown
3. Confirmer le passage en mode maintenance

**Format de verrouillage:**
```markdown
# [NOM] - Specs Verrouillees

## Configuration Finale
[Specs exactes en CSS/code]

## Ce qui est verrouille (NE PAS MODIFIER)
- Police: [valeur]
- Poids: [valeur]
- Spacing: [valeur]
- [Autres parametres]

## Date de verrouillage
[Date]

## Declinaisons autorisees
- Couleurs (gradient, monochrome, etc.)
- Tailles (header, favicon, app icon)
- Applications (mockups)

## Modifications interdites sans nouvelle validation
- Police
- Epaisseurs
- Espacements
- Structure
```

---

### Phase 6: DECLINAISONS (post-verrouillage uniquement)
**Trigger:** Specs verrouillees

**Actions autorisees:**
- Variations de couleur
- Adaptations de taille
- Mockups et applications
- Guidelines completes

**Actions INTERDITES:**
- Modifier la police
- Modifier les poids
- Modifier les espacements
- Proposer des "alternatives" structurelles

---

## Detection de Mode

### Mode EXPLORATION
**Indicateurs:**
- Pas de specs verrouillees
- User dit "explore", "teste", "montre-moi"
- Phase 1-4 du workflow

**Comportement:** Propositions multiples autorisees (max 3)

### Mode MAINTENANCE
**Indicateurs:**
- Specs verrouillees existent
- User dit "garde", "maintiens", "la version finale"
- Phase 5-6 du workflow

**Comportement:** Aucune proposition alternative. Declinaisons uniquement.

---

## Fichiers de Reference IzzIco

### Specs Verrouillees
```css
/* NE PAS MODIFIER */
--weight-i: 600;
--weight-z: 540;
--weight-c: 540;
--weight-o: 540;
--zz-spacing: -0.18em;
```

### Structure HTML
```html
<span class="wordmark-balanced">
  <span class="l-i">i</span>
  <span class="l-z zz-space">z</span>
  <span class="l-z">z</span>
  <span class="l-i">i</span>
  <span class="l-c">c</span>
  <span class="l-o">o</span>
</span>
```

### Outils crees
| Fichier | Role |
|---------|------|
| `izzico-workbench.html` | Ajustement spacing/taille |
| `izzico-stroke-analysis.html` | Analyse epaisseur pixels |
| `izzico-weight-tuning.html` | Ajustement poids par lettre |
| `izzico-stroke-width-workbench.html` | Calibration stroke vs Fredoka |
| `izzico-linecap-workbench.html` | Calibration terminaisons + buste |
| `izzico-icon-final.html` | Preview icone finale |

### Specs Icone Verrouillees
```css
/* TERMINAISONS */
cap-roundness: 85%  /* Squircle Fredoka */

/* STROKES (equilibre optique) */
circle: 7.5
loupe: 6
key: 6
teeth: 3
bust: 6.5

/* BUSTE */
bust-curvature: 85%
bust-cap-roundness: 85%
/* Terminaisons alignees avec tangente de la courbe */

/* PROPORTIONS */
circle: cy=41, r=15
loupe: len=21, angle=139deg
key: len=21, angle=36deg, teeth=2, teethSize=7
bust: gap=2, w=35, h=21
```

---

## Checklist Pre-Action

Avant toute action sur le branding, verifier:

- [ ] Est-ce que des specs sont verrouillees?
  - Si OUI → Mode maintenance (pas d'alternatives)
  - Si NON → Mode exploration (suivre phases 1-5)

- [ ] L'user a-t-il fourni des references?
  - Si NON → Les demander avant de commencer

- [ ] L'user a-t-il valide explicitement?
  - Si NON → Attendre validation

- [ ] Suis-je en train de proposer plus de 3 options?
  - Si OUI → Reduire a 3 maximum

- [ ] Est-ce que je cree des guidelines completes?
  - Si OUI et specs non verrouillees → STOP, creer workbench d'abord

---

# PROCESSUS INVERSE: Analyse de Logo Existant

Pour les clients de ASquare (SQWR) qui ont deja un logo.

## Quand utiliser le processus inverse?

**Triggers:**
- Client a deja un logo (fait maison ou par autre designer)
- Besoin d'evaluer la qualite du logo
- Justifier aupres du client pourquoi garder/modifier
- Proposer des ameliorations ou recreer

---

## Phase R1: CAPTURE

**Actions obligatoires:**
1. Demander le logo en haute resolution (SVG si possible)
2. Demander le contexte: qui l'a fait? quand? avec quelles contraintes?
3. Demander les objectifs de la marque

**Questions a poser:**
```
"Pour analyser ce logo correctement:
- Peux-tu me fournir le fichier source (SVG ideal, PNG haute res acceptable)?
- Qui a cree ce logo et dans quel contexte?
- Quels sont les objectifs/valeurs de la marque?
- Y a-t-il un attachement emotionnel a ce logo?"
```

---

## Phase R2: ANALYSE TECHNIQUE

**Creer un outil d'analyse HTML avec:**
- Zone affichage logo
- Grille d'alignement overlay
- Mesures automatiques (proportions, espacements)
- Detection de couleurs
- Test de lisibilite (tailles reduites)
- Score technique automatique

**Criteres d'analyse:**
| Critere | Mesure | Score |
|---------|--------|-------|
| Lisibilite | Test 16px, 32px, 64px | /10 |
| Equilibre | Poids visuel gauche/droite | /10 |
| Spacing | Regularite des espaces | /10 |
| Simplicite | Nombre d'elements | /10 |
| Scalabilite | SVG ou vectoriel? | /10 |

---

## Phase R3: RAPPORT CLIENT

**Format du rapport:**
```markdown
# Analyse Logo [NOM]

## Score Global: X/50

## Points Forts
- [Point 1]
- [Point 2]

## Points a Ameliorer
- [Point 1] - Impact: [Faible/Moyen/Eleve]
- [Point 2] - Impact: [Faible/Moyen/Eleve]

## Recommandation
[ ] Garder tel quel
[ ] Ameliorations mineures
[ ] Refonte partielle
[ ] Recreer entierement

## Justification
[Explication factuelle basee sur l'analyse technique]
```

---

## Phase R4: DECISION

**Si client veut GARDER:**
1. Documenter les specs actuelles
2. Creer fichier de reference
3. Proposer des declinaisons (couleurs, applications)

**Si client veut AMELIORER:**
1. Lister les modifications specifiques
2. Creer workbench avec les parametres ajustables
3. Retourner au processus creatif (Phase 3)

**Si client veut RECREER:**
1. Utiliser l'analyse comme anti-reference (ce qu'on ne veut pas)
2. Demander nouvelles references
3. Reprendre le processus creatif complet (Phase 1)

---

## Diplomatie Client

**Phrases a utiliser:**
```
"Ce logo a des qualites, notamment [X]. L'analyse technique revele
quelques opportunites d'amelioration pour [Y]."

"Le contexte de creation etait different - avec les standards actuels,
on pourrait optimiser [Z] pour ameliorer [resultat]."

"L'attachement a ce logo est comprehensible. Voici des options qui
preservent son essence tout en l'ameliorant techniquement."
```

**Phrases a EVITER:**
```
"Ce logo est mauvais"
"Il faut tout refaire"
"C'est amateur"
```

---

# TEMPLATES WORKBENCH

Les templates HTML interactifs sont regeneres a chaque nouveau projet.

## Composants Essentiels d'un Workbench

1. **Zone de preview** - Affichage temps reel du wordmark
2. **Sliders de controle** - Taille, spacing, weight
3. **Affichage des mesures** - Valeurs CSS actuelles
4. **Bouton export** - Copier les specs

## Structure Type (a adapter par projet)

```
workbench/
  [nom]-workbench.html      # Outil principal
  [nom]-analysis.html       # Analyse epaisseur (si besoin)
  [nom]-weight-tuning.html  # Poids par lettre (si variable font)
```

## Points Techniques

- Utiliser `textContent` au lieu de `innerHTML` pour la securite
- Canvas `getImageData()` pour mesurer epaisseur de trait
- CSS variables pour les parametres ajustables
- `navigator.clipboard.writeText()` pour export

---

# LECONS CRITIQUES (Phase Icon 2026-01-02)

## Erreurs a NE JAMAIS Repeter

### Erreur 1: Anticiper les Etapes
**Symptome:** Passer a la suite avant "OK" explicite
**Impact:** Frustration utilisateur, perte de controle
**Prevention:**
```
User dit "Je valide X" → Appliquer X
User dit "Je veux Y" → Appliquer Y
User dit RIEN → ATTENDRE, ne pas continuer
```

### Erreur 2: Proposer des Alternatives Non Sollicitees
**Symptome:** "Voulez-vous aussi 90%, 95%, 100%?"
**Impact:** Dilution du focus, surcharge cognitive
**Prevention:**
```
User donne une valeur (85%) → Appliquer 85%, STOP
Ne PAS ajouter "et voici d'autres options"
```

### Erreur 3: Ignorer l'Orientation Geometrique
**Symptome:** Terminaisons verticales sur courbe inclinee
**Impact:** Effet visuel "fleche" non desire
**Solution technique:**
```javascript
// TOUJOURS calculer l'angle tangent pour les courbes de Bezier
const angle = Math.atan2(controlY - startY, controlX - startX) * 180 / Math.PI;
transform: 'translate(...) rotate(' + angle + ')'
```

### Erreur 4: Epaisseurs Uniformes
**Symptome:** Tous les elements avec le meme stroke-width
**Impact:** Desequilibre optique
**Solution:**
```
Elements centraux (cercle) → plus epais
Elements lineaires (loupe, cle) → standard
Details fins (dents) → plus fin
Elements courbes (buste) → leger surplus
```

---

## Formules Techniques Utiles

### Ratio Stem/Height (Fredoka 600)
```
stem_ratio = 13%
Pour viewBox 100x100: stroke-width = 7.5 (apres equilibrage optique)
```

### Terminaisons Squircle
```
radius = (cap_roundness / 100) * (stroke_width / 2)
Pour 85%: radius = 0.85 * stroke/2
```

### Tangente Bezier Quadratique
```javascript
// Point de depart
tanAngle1 = atan2(controlY - startY, controlX - startX)

// Point d'arrivee
tanAngle2 = atan2(endY - controlY, endX - controlX)
```

---

## Validation Explicite Requise

**Phrases qui valident:**
- "Je valide"
- "OK on garde ca"
- "Parfait, verrouille"
- "C'est bon"
- "Confirme"

**Phrases qui NE valident PAS:**
- (silence)
- "Hmm"
- "Continue"
- "Montre-moi"

**Si doute:** Demander "Tu valides cette configuration?"

## Quand Regenerer un Workbench?

**Regenerer TOUJOURS pour:**
- Nouveau projet logo
- Nouveau client
- Nouvelle police a explorer

**NE PAS regenerer si:**
- Specs deja verrouillees (mode maintenance)
- Simple declinaison couleur/taille

**Adaptation par projet:**
1. Remplacer [NOM] par le nom du wordmark
2. Remplacer [FONT] par la police choisie
3. Ajouter sliders specifiques si besoin (ex: poids par lettre)
4. Adapter la palette de couleurs au projet

---

# PHASE POST-VERROUILLAGE: Lockups et Proportions

## Workflow Lockup (Icon + Wordmark)

### Phase L1: Page de Variations
**Trigger:** Specs icon ET wordmark verrouillees
**Action:** Creer page HTML montrant:
- Lockups horizontaux et verticaux
- App icons (differentes tailles: 29px, 60px, 120px, 180px)
- Variations couleur (fond sombre, clair, gradient)
- Versions multi-roles (si applicable)

### Phase L2: Analyse des Proportions
**Trigger:** Premiere visualisation du lockup
**Action:** Inclure un outil interactif avec:
- Slider taille icon
- Slider taille wordmark
- Slider gap (ecart)
- Calcul automatique des ratios

**Metriques a afficher:**
```
Ratio Icon / Cap-Height: [valeur]
Ratio Icon / X-Height: [valeur]
Ratio Gap / Icon: [valeur]
Largeur Totale: [valeur]px
```

**Recommandations automatiques:**
- Ratio Icon/Cap-Height optimal: 1.0 - 1.3
- Ratio Gap/Icon optimal: 0.15 - 0.25
- Ratio dore (reference): 1.618

### Phase L3: Validation Lockup
**Trigger:** User ajuste les proportions
**Action:** Attendre validation explicite avant de verrouiller

**Format de verrouillage lockup:**
```markdown
## Lockup Horizontal
- Icon: [taille]px
- Wordmark: [taille]px
- Gap: [taille]px
- Ratio Icon/Cap-Height: [valeur]
```

---

## Calculs Typographiques

### Fredoka Metrics (Reference)
```
Cap-height: ~72% de la font-size
X-height: ~73% de la cap-height (soit ~52% de font-size)
```

### Formule pour ratio ideal
```javascript
// Pour un wordmark de taille X px
const capHeight = wordmarkSize * 0.72;
const xHeight = capHeight * 0.73;

// Ratio dore pour icon
const idealIconSize = capHeight * 1.618;

// Ratio equilibre
const balancedIconSize = capHeight * 1.15; // 1.0-1.3 range
```

---

## Types de Workbenches

| Type | Usage | Sliders |
|------|-------|---------|
| `spacing-workbench` | Ajustement lettrage | font-size, letter-spacing |
| `weight-tuning` | Poids par lettre | font-weight per char |
| `stroke-analysis` | Mesure epaisseur | canvas pixel analysis |
| `stroke-width` | Calibration icon | stroke-width global |
| `linecap-workbench` | Terminaisons | cap-roundness, curvature |
| `brand-variations` | Vue d'ensemble | icon-size, wordmark-size, gap |

---

## Anti-Patterns Post-Verrouillage

### NE JAMAIS faire apres verrouillage:
- Proposer des alternatives de police
- Suggerer des modifications de spacing
- Changer les poids des lettres
- Modifier les proportions de l'icon

### TOUJOURS autorise:
- Variations de couleur
- Adaptations de taille (responsive)
- Mockups et applications
- Export en differents formats
