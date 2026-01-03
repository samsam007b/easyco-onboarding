# IzzIco Brand Work Report
## Session de travail - Janvier 2026

---

## Resume Executif

Finalisation complete de l'identite visuelle IzzIco avec creation du logo-icon (IzzIco Icon V1) et du trademark (wordmark). Tous les assets sont vectorises, documentes et prets pour l'integration.

---

## 1. IzzIco Icon V1 (Logo-Icon)

### Concept
Un symbole unique fusionnant **3 elements** representant les 3 roles utilisateurs :

| Element | Role | Signification |
|---------|------|---------------|
| **Loupe** | Searcher | Recherche de logement |
| **Cle** | Owner | Propriete, acces |
| **Buste** | Resident | Personne, communaute |

### Specifications Techniques Finales

#### Dimensions (ViewBox 0 0 100 100)
| Element | Stroke Original | Rayon/Position |
|---------|-----------------|----------------|
| Cercle (donut) | 7.5 | ext: 18.75, int: 11.25 |
| Manche loupe/cle | 6 | - |
| Dents de cle | 3 | - |
| Buste | 6.5 | - |

#### Style Linecaps : 85% Squircle
- **Choix valide** : 85% entre carre (0%) et rond (100%)
- **Raison** : Style Fredoka, ni trop dur ni trop mou
- **Implementation** : Courbes de Bezier cubiques pre-calculees

#### Layer Order (Painter's Algorithm)
1. Loupe (arriere-plan)
2. Cle + Dents (arriere-plan)
3. Cercle (premier plan - couvre les manches)
4. Buste caps (arriere-plan du buste)
5. Buste path (premier plan du buste)

### Fichiers Generes

```
.claude/brand/logo - icon - izzico/
├── README.md
├── generate-all-exports.html          # Export PNG/JPEG multi-tailles
├── izzico-icon-v1-white.svg           # Blanc transparent
├── izzico-icon-v1-dark.svg            # Sombre transparent
├── izzico-icon-v1-gradient.svg        # Gradient signature
├── izzico-icon-v1-multicolor.svg      # Couleurs par role
├── izzico-app-icon-dark-bg.svg        # App icon fond sombre
├── izzico-app-icon-gradient-bg.svg    # App icon fond gradient
└── izzico-favicon-simplified.svg      # Favicon (sans dents, strokes epais)
```

### Vectorisation
- **100% vectorise** : Tous les paths sont pre-calcules
- **Aucun transform** : Coordonnees en valeurs absolues
- **Compatible** : Figma, Illustrator, Sketch, export parfait

---

## 2. IzzIco Trademark (Wordmark)

### Police
- **Font Family** : Fredoka
- **Type** : Variable font (300-700)

### Poids par Lettre (Choix Final)

| Lettre | Weight | Raison |
|--------|--------|--------|
| **i** (1er) | 600 | Plus lourd pour ancrage visuel |
| **z** | 540 | Standard |
| **z** | 540 | Standard |
| **i** | 540 | Standard |
| **c** | 540 | Standard |
| **o** | 540 | Standard |

### ZZ Spacing (Decision Cle)

| Valeur | Status |
|--------|--------|
| `-0.18em` | Ancienne valeur |
| **`-0.20em`** | **Valeur finale validee** |

**Raison** : Les deux Z fusionnent visuellement pour creer une identite unique. La courbe du second Z n'est plus visible separement.

### Probleme Resolu : Gradient Overlap

**Probleme** : Quand les lettres se chevauchent avec un spacing negatif, le fond du 2e Z couvrait le 1er Z.

**Solution** : Appliquer le gradient au conteneur, pas aux lettres individuelles.

```css
/* CORRECT */
.wordmark-gradient {
    background: linear-gradient(...);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
}

/* INCORRECT - causait l'overlap */
.wordmark-gradient span {
    background: linear-gradient(...);
    -webkit-background-clip: text;
}
```

### Fichiers Generes

```
.claude/brand/logo - trademark - izzico/
├── README.md
├── generate-all-exports.html           # Export PNG/JPEG multi-tailles
├── izzico-trademark-vectorizer.html    # Outil vectorisation opentype.js
└── izzico-trademark-text-based.svg     # SVG avec police embarquee
```

---

## 3. Couleurs des Roles

| Role | Couleur Principale | Hex |
|------|-------------------|-----|
| **Searcher** | Gold/Yellow | `#ffa000` → `#ffc800` |
| **Owner** | Purple/Mauve | `#9c5698` |
| **Resident** | Orange/Coral | `#e05747` |

### Gradient Signature (Fusion des 3 roles)

```css
background: linear-gradient(135deg,
  #9c5698 0%,      /* Owner purple */
  #d15659 30%,
  #e05747 50%,     /* Resident coral */
  #ff7c10 70%,
  #ffc800 100%     /* Searcher gold */
);
```

---

## 4. Outils de Travail Crees

### Workbenches Interactifs

| Fichier | Usage |
|---------|-------|
| `izzico-brand-guidelines.html` | Guidelines completes (multi-pages) |
| `izzico-zz-typo-workbench.html` | Exploration typographique ZZ |
| `izzico-zz-spacing-tuning.html` | Fine-tuning du spacing ZZ |
| `izzico-icon-workbench.html` | Design de l'icon |
| `izzico-i-person-workbench.html` | Exploration du buste |
| `izzico-zz-lightning-workbench.html` | Exploration eclair (non retenu) |

### Outils d'Export

| Fichier | Usage |
|---------|-------|
| `logo - icon - izzico/generate-all-exports.html` | Export icon PNG/JPEG |
| `logo - trademark - izzico/generate-all-exports.html` | Export trademark PNG/JPEG |

---

## 5. Decisions de Design Importantes

### Retenues

| Decision | Raison |
|----------|--------|
| Loupe + Cle + Buste | Represente les 3 roles utilisateurs |
| 85% Squircle linecaps | Style Fredoka, equilibre doux/precis |
| ZZ spacing -0.20em | Fusion visuelle optimale |
| i weight 600 | Ancrage visuel du debut du mot |
| Gradient au conteneur | Evite le bug d'overlap |

### Non Retenues

| Idee | Raison du rejet |
|------|-----------------|
| Eclair dans le cercle | Trop agressif, pas assez "coliving" |
| ZZ spacing -0.18em | Pas assez de fusion |
| Gradient par lettre | Bug d'overlap avec spacing negatif |

---

## 6. Prochaines Etapes (Demain)

### Integration dans le Site

1. **Remplacer le logo actuel** par le nouvel icon
2. **Mettre a jour les favicons** (utiliser la version simplifiee)
3. **App icons iOS/Android** avec les versions dediees
4. **Mettre a jour le header** avec le nouveau trademark
5. **Verifier les couleurs des roles** dans tout le site

### Fichiers a Modifier

| Fichier | Changement |
|---------|------------|
| `app/layout.tsx` | Favicon, metadata |
| `public/` | Nouveaux assets icon/trademark |
| `components/Header.tsx` | Nouveau logo |
| `app/globals.css` | Variables CSS si necessaire |
| `capacitor.config.ts` | App icon references |

---

## 7. Structure des Dossiers Brand

```
.claude/brand/
├── BRAND-WORK-REPORT.md                    # Ce rapport
├── izzico-brand-guidelines.html            # Guidelines officielles
├── izzico-zz-typo-workbench.html          # Workbench typo
├── izzico-zz-spacing-tuning.html          # Workbench spacing
├── izzico-icon-workbench.html             # Workbench icon
├── logo - icon - izzico/                   # Assets icon finaux
│   ├── README.md
│   ├── generate-all-exports.html
│   ├── izzico-icon-v1-*.svg               # Variantes SVG
│   └── izzico-favicon-simplified.svg
└── logo - trademark - izzico/              # Assets trademark finaux
    ├── README.md
    ├── generate-all-exports.html
    ├── izzico-trademark-vectorizer.html
    └── izzico-trademark-text-based.svg
```

---

## Resume des Specifications Cles

| Element | Valeur |
|---------|--------|
| **Icon ViewBox** | 0 0 100 100 |
| **Linecaps** | 85% squircle |
| **Font** | Fredoka Variable |
| **Weight i1** | 600 |
| **Weight z/i/c/o** | 540 |
| **ZZ Spacing** | -0.20em |
| **Gradient Direction** | 135deg |

---

*Rapport genere le 3 janvier 2026*
*IzzIco Brand Identity - Version 1.0*
