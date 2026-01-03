# IzzIco Brand Specs - VERROUILLÉ

> **STATUS: LOCKED / VERROUILLÉ**
> Date de verrouillage: 2025-01-02
> Validé par: Samuel Baudon

---

## Configuration Définitive

### Poids par Lettre (Optical Balance)
```css
--weight-i: 600;  /* Unchanged - reference weight */
--weight-z: 540;  /* -10% optical compensation */
--weight-c: 540;  /* -10% optical compensation */
--weight-o: 540;  /* -10% optical compensation */
```

### Spacing
```css
--zz-spacing: -0.18em;  /* Applied to first Z only */
```

### Police
```
Font: Fredoka Variable
Weight Range: 300-700
Usage: Variable font-weight per letter for optical balance
```

---

## Structure HTML Validée

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

---

## Ce Qui Est VERROUILLÉ (Ne Pas Modifier)

| Paramètre | Valeur | Status |
|-----------|--------|--------|
| Police | Fredoka | 🔒 LOCKED |
| Poids i | 600 | 🔒 LOCKED |
| Poids z | 540 | 🔒 LOCKED |
| Poids c | 540 | 🔒 LOCKED |
| Poids o | 540 | 🔒 LOCKED |
| ZZ Spacing | -0.18em | 🔒 LOCKED |
| Structure HTML | wordmark-balanced | 🔒 LOCKED |
| Icon V1 | Cercle (85% linecap) | 🔒 LOCKED ✅ OFFICIEL |

---

## Déclinaisons Autorisées

Ces modifications sont permises SANS déverrouillage:
- ✅ Variations de couleur (gradient, monochrome, etc.)
- ✅ Adaptations de taille (header, favicon, app icon)
- ✅ Applications (mockups, supports marketing)
- ✅ Ajout de taglines sous le logo

---

## Modifications Interdites

Ces modifications NÉCESSITENT une nouvelle validation:
- ❌ Changer la police
- ❌ Modifier les poids des lettres
- ❌ Modifier le spacing ZZ
- ❌ Changer la structure HTML
- ❌ Proposer des "alternatives"

---

## Processus de Déverrouillage

Pour modifier les specs verrouillées:
1. Demande explicite avec justification
2. Retour en mode EXPLORATION
3. Nouveau cycle validation/workbench
4. Nouveau verrouillage avec nouvelle date

---

## Historique

| Date | Action | Par |
|------|--------|-----|
| 2025-01-02 | Verrouillage initial wordmark | Samuel Baudon |
| 2026-01-02 | Verrouillage unified icon | Samuel Baudon |
| 2026-01-02 | Verrouillage système couleurs (gradients optimisés) | Samuel Baudon |
| 2026-01-02 | Verrouillage typographie UI (Nunito + Inter) | Samuel Baudon |
| 2026-01-02 | Re-validation unified icon depuis workbench (bust-curvature 85%) | Samuel Baudon |
| 2026-01-03 | Verrouillage V1 + V2 icons (comparison finalisée) | Samuel Baudon |
| 2026-01-03 | V1 retenue comme icône officielle, V2 archivée | Samuel Baudon |

---

# UNIFIED ICON V1 (CERCLE) - VERROUILLÉ ✅ OFFICIEL

> **STATUS: LOCKED / VERROUILLÉ - ICÔNE OFFICIELLE**
> Date de verrouillage: 2026-01-02
> Confirmé le: 2026-01-03

## Configuration Icône Unifiée

### Terminaisons (Linecap)
```
stroke-linecap: custom
cap-roundness: 85%
/* Équivalent: rx = 0.85 * stroke/2 */
```
> **Note:** Les terminaisons utilisent un arrondi de 85% (style Fredoka).
> Ce n'est ni un `butt` (0%) ni un `round` parfait (100%), mais un squircle calibré.

### Cercle Central (Tête - Élément Partagé)
```
cx: 50
cy: 41
r: 15
stroke: 7.5
```
> Le cercle n'a pas de terminaisons visibles (forme fermée).

### Manche Loupe (Gauche - Searcher)
```
length: 21
angle: 139°
stroke: 6
linecap: custom (85%)
```
**Coordonnées calculées:**
```
startX: 38.68  (50 + 15 × cos(139°))
startY: 50.84  (41 + 15 × sin(139°))
endX:   22.83  (startX + 21 × cos(139°))
endY:   64.62  (startY + 21 × sin(139°))
```

### Tige Clé (Droite - Owner)
```
length: 21
angle: 36°
stroke: 6
teeth: 2
teethSize: 7
teethStroke: 3 (50% du stroke clé)
linecap: custom (85%)
```
**Coordonnées calculées:**
```
startX: 62.14  (50 + 15 × cos(36°))
startY: 49.82  (41 + 15 × sin(36°))
endX:   79.12  (startX + 21 × cos(36°))
endY:   62.16  (startY + 21 × sin(36°))
```

### Dents de Clé
```
angle: 126° (perpendiculaire à la clé: 36° + 90°)
```
**Coordonnées calculées:**
```
Dent 1 (t=0.5): (70.63, 55.99) → (66.52, 61.65)
Dent 2 (t=0.8): (75.73, 59.69) → (71.61, 65.35)
```

### Buste (Bas - Resident/Personne)
```
gap: 2
width: 35
height: 21
stroke: 6.5
curvature: 85%
cap-roundness: 85%
/* Les terminaisons sont alignées avec l'angle tangent de la courbe */
```
**Coordonnées calculées (curvature 85%):**
```
bustTop:  58     (41 + 15 + 2)
leftX:    32.5   (50 - 35/2)
rightX:   67.5   (50 + 35/2)
endY:     79     (58 + 21)
controlY: 61.15  (79 - 21 × 0.85)

Path SVG: M 32.5 79 Q 50 61.15 67.5 79
```
> Le buste utilise une courbe de Bézier quadratique.
> La curvature 85% contrôle la tension de la courbe (controlY = endY - height × 0.85).
> Les terminaisons squircle sont rotées pour épouser l'angle tangent de la courbe.

### Résumé des Strokes
```
Cercle:  7.5  (élément central, plus épais)
Loupe:   6    (cohérent avec clé)
Clé:     6    (cohérent avec loupe)
Dents:   3    (50% du stroke clé)
Buste:   6.5  (légèrement plus que loupe/clé)
```

### Résumé des Terminaisons
```
cap-roundness: 85%         (tous les éléments)
bust-curvature: 85%        (courbe de Bézier du buste)
bust-cap-roundness: 85%    (terminaisons du buste)
```
> Tous les éléments utilisent des terminaisons squircle 85% (style Fredoka).

### Code SVG Complet (V1 Fredoka - 85% Squircle)

**Technique de terminaisons 85%:**
- Au lieu de `stroke-linecap="round"` (100%) ou `butt` (0%)
- On utilise des `<rect>` avec `rx = 0.85 × (stroke/2)`
- Les rects sont rotés et translatés pour former des lignes avec caps custom

**Formules des rayons (85% roundness):**
```
Loupe/Clé (stroke=6):     rx = 0.85 × 3 = 2.55
Dents (stroke=3):         rx = 0.85 × 1.5 = 1.275
Buste (stroke=6.5):       rx = 0.85 × 3.25 = 2.7625
```

**Ordre des layers (z-index):**
```
1. Loupe (arrière-plan)
2. Clé + Dents (arrière-plan)
3. Cercle (premier plan - au-dessus des tiges)
4. Buste (bas)
```
> Le cercle est dessiné APRÈS les tiges pour apparaître visuellement au-dessus.

**SVG de référence officiel:**
```svg
<svg viewBox="0 0 100 100" fill="none">
  <!-- Layer 1: Loupe (arrière-plan) -->
  <g transform="translate(30.755, 57.73) rotate(139)">
    <rect x="-10.5" y="-3" width="21" height="6" rx="2.55" ry="2.55" fill="white"/>
  </g>

  <!-- Layer 2: Clé (arrière-plan) -->
  <g transform="translate(70.63, 55.99) rotate(36)">
    <rect x="-10.5" y="-3" width="21" height="6" rx="2.55" ry="2.55" fill="white"/>
  </g>

  <!-- Layer 3: Dents -->
  <g transform="translate(68.575, 58.82) rotate(126)">
    <rect x="-3.5" y="-1.5" width="7" height="3" rx="1.275" ry="1.275" fill="white"/>
  </g>
  <g transform="translate(73.67, 62.52) rotate(126)">
    <rect x="-3.5" y="-1.5" width="7" height="3" rx="1.275" ry="1.275" fill="white"/>
  </g>

  <!-- Layer 4: Cercle (premier plan - au-dessus des tiges) -->
  <circle cx="50" cy="41" r="15" stroke="white" stroke-width="7.5"/>

  <!-- Layer 5: Buste -->
  <path d="M 32.5 79 Q 50 61.15 67.5 79" stroke="white" stroke-width="6.5" stroke-linecap="butt" fill="none"/>
  <g transform="translate(32.5, 79) rotate(-45.6)">
    <rect x="-3.25" y="-3.25" width="6.5" height="6.5" rx="2.7625" ry="2.7625" fill="white"/>
  </g>
  <g transform="translate(67.5, 79) rotate(45.6)">
    <rect x="-3.25" y="-3.25" width="6.5" height="6.5" rx="2.7625" ry="2.7625" fill="white"/>
  </g>
</svg>
```

> **IMPORTANT:** Cette technique garantit les terminaisons 85% squircle (style Fredoka).
> Les caps du buste sont rotés pour épouser l'angle tangent de la courbe Bézier.

### Couleurs par Défaut
```
icon: #ffffff (blanc)
background: #1a1a2e (sombre)
```

---

## Couleurs de Rôle - VERROUILLÉ

> **STATUS: LOCKED / VERROUILLÉ**
> Date de verrouillage: 2026-01-02
> Validé par: Samuel Baudon

### Couleurs Principales (500)

| Rôle | Couleur | Hex | Hue Range |
|------|---------|-----|-----------|
| 🔑 Owner | Mauve/Rose | #9c5698 | 303° → 346° |
| 👤 Resident | Rouge/Orange | #e05747 | 6° → 32° |
| 🔍 Searcher | Or/Jaune | #ffa000 | 45° → 55° |

### Gradients par Rôle (5 stops)

```css
/* Owner - Mauve vers Rose */
--gradient-owner: linear-gradient(135deg,
  #9c5698, #a5568d, #af5682, #b85676, #c2566b
);

/* Resident - Rouge vers Orange (resserré) */
--gradient-resident: linear-gradient(135deg,
  #e05747, #f25a35, #ff6524, #ff7018, #ff7c10
);

/* Searcher - Or vers Jaune (décalé) */
--gradient-searcher: linear-gradient(135deg,
  #ffa000, #ffaa00, #ffb400, #ffbe00, #ffc800
);
```

### Dégradé Signature (Smooth)

```css
--gradient-signature: linear-gradient(135deg,
  #9c5698 0%,      /* Owner start */
  #af5682 12%,     /* Owner mid */
  #c2566b 24%,     /* Owner end */
  #d15659 30%,     /* Blend Owner→Resident */
  #e05747 36%,     /* Resident start */
  #ff6524 48%,     /* Resident mid */
  #ff7c10 60%,     /* Resident end */
  #ff8e08 66%,     /* Blend Resident→Searcher */
  #ffa000 72%,     /* Searcher start */
  #ffb400 86%,     /* Searcher mid */
  #ffc800 100%     /* Searcher end */
);
```

### Écarts de Teinte (Hue Gaps)

| Transition | Écart | Status |
|------------|-------|--------|
| Owner → Resident | ~40° | ✅ Distinct |
| Resident → Searcher | 13° | ✅ Suffisant |

> **Note:** L'écart minimum de 13° entre Resident (termine à 32°) et Searcher (commence à 45°) garantit une distinction visuelle claire sur tous les supports.

---

## Concept de l'Icône

Le cercle central représente SIMULTANÉMENT:
- 🔍 Le verre de la loupe (Searcher)
- 🔑 La tête de la clé (Owner)
- 👤 La tête de la personne (Resident)

**Version multicolore:**
- Manche loupe = Or Searcher (#ffa000)
- Cercle = Dégradé signature (représente les 3 rôles)
- Tige clé = Mauve Owner (#9c5698)
- Buste = Rouge-Orange Resident (#e05747)

---

# UNIFIED ICON V2 (FREDOKA "i") - ARCHIVÉ

> **STATUS: ARCHIVED / ARCHIVÉ** (non retenue)
> Date de création: 2026-01-03
> Archivé le: 2026-01-03
> Raison: V1 retenue comme icône officielle

## Concept V2

L'icône V2 est basée sur le caractère "i" de Fredoka:
- La **tête** (tittle) est une superellipse (squircle)
- Le **corps** (stem) est un rectangle arrondi
- La **loupe** et la **clé** partent de la tête

Cette version offre une cohérence typographique directe avec le wordmark "izzico".

## Configuration V2

### Tête (Superellipse - Tittle)
```
size: 39
n: 4.5          (exposant superellipse)
stroke: 8.5
position-y: 60  (centre)
```
> La superellipse avec n=4.5 produit un squircle proche du tittle Fredoka.

### Corps (Rectangle Arrondi - Stem)
```
width: 44
height: 40      (ajustable via slider)
radius: 50%     (coins arrondis)
gap: 15         (espace entre tête et corps)
```
**Position calculée:**
```
stemTop: 94.5   (60 + 39/2 + 15)
x: 78           (100 - 44/2)
```

### Loupe (Gauche - Searcher)
```
angle: 137°
length: 31
stroke: 8
linecap: round
```

### Clé (Droite - Owner)
```
angle: 40°
length: 31
stroke: 8
teeth: 2
teethSize: 10
teethStroke: 4  (50% du stroke clé)
linecap: round
```

### Résumé des Différences V1 vs V2

| Élément | V1 (Cercle) | V2 (Fredoka "i") |
|---------|-------------|------------------|
| Tête | Cercle stroke | Superellipse stroke |
| Corps | Courbe Bézier | Rectangle arrondi |
| Concept | 3 symboles fusionnés | Typographie "i" |
| Terminaisons | 85% squircle | Round natif |
| Style | Iconique | Typographique |

### Avantages V2
- ✅ Cohérence avec le wordmark Fredoka
- ✅ Silhouette distincte (rectangle vs courbe)
- ✅ Plus lisible aux petites tailles
- ✅ Aspect moderne/tech

### Avantages V1
- ✅ Symbolisme fort (loupe + clé + personne)
- ✅ Plus organique/humain
- ✅ Terminaisons Fredoka authentiques (85%)
- ✅ Déjà validé et utilisé

---

# TYPOGRAPHIE UI - VERROUILLÉ

> **STATUS: LOCKED / VERROUILLÉ**
> Date de verrouillage: 2026-01-02
> Validé par: Samuel Baudon

## Système Typographique

### Police Logo (Exclusive)
```
Font: Fredoka Variable
Usage: Logo "izzico" UNIQUEMENT
Weight Range: 300-700
Poids spécifiques: i=600, z=540, c=540, o=540
```
> **IMPORTANT:** Fredoka ne doit JAMAIS être utilisée pour du texte UI.

### Police Headings
```
Font: Nunito
Weight Range: 300-700
Usage: Titres (h1-h6), sous-titres, labels importants
Weights recommandés: 600 (semi-bold), 700 (bold)
```

### Police Body
```
Font: Inter
Weight Range: 300-700
Usage: Corps de texte, paragraphes, navigation, boutons
Weights recommandés: 400 (regular), 500 (medium), 600 (semi-bold)
```

### Justification du Choix

| Critère | Évaluation |
|---------|------------|
| Harmonie avec Fredoka | ✅ Nunito partage les formes arrondies |
| Lisibilité body | ✅ Inter = référence industrie |
| Contraste heading/body | ✅ Arrondi vs Neutre |
| Versatilité | ✅ Les deux supportent 300-700 |

### Configuration CSS

```css
/* Fonts Stack */
--font-logo: 'Fredoka', sans-serif;
--font-heading: 'Nunito', sans-serif;
--font-body: 'Inter', system-ui, sans-serif;

/* Usage */
h1, h2, h3, h4, h5, h6 {
  font-family: var(--font-heading);
}

body, p, span, button, input, label {
  font-family: var(--font-body);
}

.logo, .wordmark {
  font-family: var(--font-logo);
}
```

### Google Fonts Import

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Fredoka:wght@300..700&family=Inter:wght@300;400;500;600;700&family=Nunito:wght@300;400;500;600;700&display=swap" rel="stylesheet">
```

---

## Ce Qui Est VERROUILLÉ (Typographie)

| Paramètre | Valeur | Status |
|-----------|--------|--------|
| Police Logo | Fredoka | 🔒 LOCKED |
| Police Headings | Nunito | 🔒 LOCKED |
| Police Body | Inter | 🔒 LOCKED |
| Fredoka UI | INTERDIT | 🔒 LOCKED |
