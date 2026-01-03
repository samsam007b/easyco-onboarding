# IzzIco Icon V1 - Assets

## Vectorisation Complete

Tous les fichiers SVG sont **entierement vectorises** avec des paths pre-calcules.
- Aucun attribut `transform` - toutes les coordonnees sont en valeurs absolues
- Compatible avec tous les logiciels de design (Figma, Illustrator, Sketch)
- Export parfait vers PNG/JPEG/PDF sans perte de qualite

## Fichiers SVG

| Fichier | Description | Usage |
|---------|-------------|-------|
| `izzico-icon-v1-white.svg` | Icone blanc (transparent) | Fonds sombres |
| `izzico-icon-v1-dark.svg` | Icone sombre (transparent) | Fonds clairs |
| `izzico-icon-v1-gradient.svg` | Icone gradient signature | Usage general |
| `izzico-icon-v1-multicolor.svg` | Icone avec couleurs par role | Usage distinctif |
| `izzico-app-icon-dark-bg.svg` | App icon avec fond sombre | iOS/Android |
| `izzico-app-icon-gradient-bg.svg` | App icon avec fond gradient | iOS/Android |
| `izzico-favicon-simplified.svg` | Favicon simplifie (sans dents) | 16-32px |

## Export PNG/JPEG

Ouvrir `generate-all-exports.html` dans un navigateur pour:
- Exporter en PNG (avec transparence)
- Exporter en JPEG (fond sombre)
- Choisir la taille: 64px, 128px, 256px, 512px, 1024px, 2048px

## Specifications Techniques

- **ViewBox**: 0 0 100 100
- **Linecaps**: 85% squircle (style Fredoka) - courbes de Bezier cubiques
- **Circle**: Donut path avec `fill-rule="evenodd"`
- **Strokes**: Convertis en paths remplis (pas de stroke)

### Dimensions originales (avant conversion en paths)
- Circle stroke: 7.5 (rayon ext: 18.75, int: 11.25)
- Handle/Key stroke: 6
- Teeth stroke: 3
- Bust stroke: 6.5

### Favicon (simplifie)
- Circle stroke: 9 (rayon ext: 19.5, int: 10.5)
- Handle/Key stroke: 8
- Bust stroke: 8
- Pas de dents (pour lisibilite a petite taille)

## Layer Order (Painter's Algorithm)

1. Loupe (arriere-plan)
2. Cle + Dents (arriere-plan)
3. Cercle (premier plan - couvre les manches)
4. Buste caps (arriere-plan du buste)
5. Buste path (premier plan du buste)

## Couleurs des Roles

| Role | Couleur | Hex |
|------|---------|-----|
| Searcher | Gold/Yellow | #ffa000 |
| Owner | Purple | #9c5698 |
| Resident | Orange/Coral | #e05747 |

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
