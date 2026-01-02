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

### Stroke Global (Uniforme - Basé sur Fredoka 600)
```
stroke-width: 13
stroke-linecap: butt
terminal-rx: 4.225
terminal-ry: 4.225
```
> **Calcul:** Fredoka 600 a un ratio stem/em-square de ~13%.
> Dans un viewBox 100×100, cela donne stroke-width: 13.
> Toutes les parties de l'icône utilisent ce même stroke.
> Les terminaisons utilisent des rect arrondis (rx=ry=4.225).

### Cercle Central (Tête - Élément Partagé)
```
cx: 50
cy: 41
r: 15
stroke: 13 (global)
```
> Le cercle n'a pas de terminaisons visibles (forme fermée).

### Manche Loupe (Gauche - Searcher)
```
length: 21
angle: 139°
stroke: 13 (global)
terminal: rect rx=4.225 ry=4.225
```

### Tige Clé (Droite - Owner)
```
length: 21
angle: 36°
stroke: 13 (global)
teeth: 2
teethStroke: 6.5 (50% du global)
terminal: rect rx=4.225 ry=4.225
```

### Buste (Bas - Resident/Personne)
```
gap: 2
width: 35
height: 21
stroke: 13 (global)
terminal: stroke-linecap: round (compromis)
```
> **Note:** Le buste utilise `stroke-linecap: round` car les terminaisons
> custom sur une courbe de Bézier créent des artefacts visuels.
> Visuellement très proche du style Fredoka.

### Terminaisons (Style Fredoka)

**Lignes droites (Loupe, Clé, Dents):**
```
stroke-linecap: butt
Terminal caps: rect avec rx/ry

Ratio d'arrondi Fredoka:
  rx = 65% de (stroke-width / 2)
  ry = 65% de (stroke-width / 2)

Pour stroke-width: 13:
  half-width = 6.5
  rx = 6.5 * 0.65 = 4.225
  ry = 6.5 * 0.65 = 4.225
```

**Courbes (Buste):**
```
stroke-linecap: round (approximation acceptable)
```
> Les terminaisons round sont visuellement proches du style Fredoka
> et évitent les problèmes de calcul d'angle sur les arcs.

### Note Typographique
```
Le stroke-width de 13 correspond EXACTEMENT au ratio
stem/em-square de Fredoka 600 (13%).

Lignes droites: terminaisons custom (rect rx/ry=65%)
Courbes: stroke-linecap: round (compromis visuel)

Les dents de la clé utilisent 50% du stroke global
pour maintenir l'équilibre visuel.
```

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
