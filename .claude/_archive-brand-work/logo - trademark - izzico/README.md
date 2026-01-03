# IzzIco Trademark (Wordmark) - Assets

## Vectorisation Status

**En cours de developpement**

Le wordmark IzzIco utilise la police Fredoka avec des poids variables par lettre.

## Specifications Typographiques

### Police
- **Font Family**: Fredoka
- **Type**: Variable font (300-700)

### Poids par lettre
| Lettre | Weight | Description |
|--------|--------|-------------|
| i (premier) | 600 | Plus lourd pour l'ancrage |
| z | 540 | Poids standard |
| z | 540 | Poids standard |
| i | 540 | Poids standard |
| c | 540 | Poids standard |
| o | 540 | Poids standard |

### Spacing ZZ
- **Valeur**: `-0.20em`
- **Raison**: Fusion visuelle des deux Z pour creer une identite unique
- **Application**: `letter-spacing` ou `margin-right` sur le premier Z

## Fichiers SVG (a generer)

| Fichier | Description | Usage |
|---------|-------------|-------|
| `izzico-trademark-v1-white.svg` | Wordmark blanc (transparent) | Fonds sombres |
| `izzico-trademark-v1-dark.svg` | Wordmark sombre (transparent) | Fonds clairs |
| `izzico-trademark-v1-gradient.svg` | Wordmark gradient signature | Usage general |

## Outils

### izzico-trademark-vectorizer.html
Outil interactif pour generer les SVG vectorises a partir de la police Fredoka.

**Fonctionnalites:**
- Apercu en temps reel
- Configuration du spacing ZZ
- Export en 3 variantes (blanc, sombre, gradient)
- Specifications techniques

**Utilisation:**
1. Ouvrir `izzico-trademark-vectorizer.html` dans un navigateur
2. Attendre le chargement de la police
3. Cliquer sur "Generer les SVG"
4. Telecharger les variantes souhaitees

## Gradient Signature

```css
background: linear-gradient(135deg,
  #9c5698 0%,    /* Owner purple */
  #d15659 30%,
  #e05747 50%,   /* Resident coral */
  #ff7c10 70%,
  #ffc800 100%   /* Searcher gold */
);
```

## Notes Techniques

### Probleme du Z overlap
Quand on applique un `letter-spacing` negatif, les lettres se chevauchent.
Si le gradient est applique a chaque lettre individuellement, le fond du
deuxieme Z couvre le premier Z.

**Solution**: Appliquer le gradient au conteneur parent, pas aux lettres individuelles.

```css
/* CORRECT */
.wordmark-gradient {
    background: linear-gradient(...);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
}

/* INCORRECT - cause overlap */
.wordmark-gradient span {
    background: linear-gradient(...);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
}
```

### Limitations opentype.js
La bibliotheque opentype.js ne supporte pas completement les variable fonts.
Pour une vectorisation precise, il peut etre necessaire de:
1. Utiliser des instances statiques de la police a differents poids
2. Ou exporter depuis un logiciel de design (Figma, Illustrator)
