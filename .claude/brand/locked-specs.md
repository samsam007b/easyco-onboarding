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

---

# UNIFIED ICON - VERROUILLÉ

> **STATUS: LOCKED / VERROUILLÉ**
> Date de verrouillage: 2026-01-02

## Configuration Icône Unifiée

### Stroke (Par élément - Équilibre optique)
```
stroke-linecap: round (pour tous les éléments)
```
> **Note:** Les strokes individuels sont calibrés pour l'équilibre optique
> plutôt qu'une épaisseur uniforme. Cela crée une meilleure harmonie visuelle.

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
linecap: round
```

### Tige Clé (Droite - Owner)
```
length: 21
angle: 36°
stroke: 6
teeth: 2
teethSize: 7
teethStroke: 3 (50% du stroke clé)
linecap: round
```

### Buste (Bas - Resident/Personne)
```
gap: 2
width: 35
height: 21
stroke: 6.5
linecap: round
```
> Le buste utilise une courbe de Bézier quadratique.

### Résumé des Strokes
```
Cercle:  7.5  (élément central, plus épais)
Loupe:   6    (cohérent avec clé)
Clé:     6    (cohérent avec loupe)
Dents:   3    (50% du stroke clé)
Buste:   6.5  (légèrement plus que loupe/clé)
```
> Tous les éléments utilisent stroke-linecap: round.

### Couleurs par Défaut
```
icon: #ffffff (blanc)
background: #1a1a2e (sombre)
```

---

## Couleurs de Rôle

| Rôle | Couleur | Hex |
|------|---------|-----|
| Searcher | Jaune/Or | #FFB10B |
| Owner | Mauve/Violet | #9B59B6 |
| Resident | Orange/Corail | #E67E22 |

### Dégradé Signature
```css
background: linear-gradient(135deg, #FFB10B, #E67E22, #9B59B6);
/* Jaune → Orange → Violet */
```

---

## Concept de l'Icône

Le cercle central représente SIMULTANÉMENT:
- 🔍 Le verre de la loupe (Searcher)
- 🔑 La tête de la clé (Owner)
- 👤 La tête de la personne (Resident)

**Version multicolore:**
- Manche loupe = Jaune Searcher (#FFB10B)
- Cercle = Dégradé signature (représente les 3 rôles)
- Tige clé = Mauve Owner (#9B59B6)
- Buste = Orange Resident (#E67E22)
