# IzzIco Brand Identity

Logos vectorisés finaux - Janvier 2025

## Structure

```
brand-identity/
├── logo-icon/                    # Icône IzzIco (symbole)
│   ├── izzico-icon-white.svg     → Fonds sombres/colorés
│   ├── izzico-icon-dark.svg      → Fonds clairs
│   ├── izzico-icon-gradient.svg  → Version signature
│   └── recraft-source/           → Exports Recraft originaux
│
└── logo-trademark/               # Trademark IzzIco (texte)
    ├── izzico-trademark-white.svg
    ├── izzico-trademark-dark.svg
    ├── izzico-trademark-gradient.svg
    └── recraft-source/           → Exports Recraft originaux
```

## Versions

| Version | Usage | Couleur |
|---------|-------|---------|
| **White** | Fonds sombres, dégradés, photos | `#FFFFFF` |
| **Dark** | Fonds clairs, blancs | `#1A1A2E` |
| **Gradient** | Marketing, hero sections | Dégradé IzzIco |

## Dégradé Signature

```css
background: linear-gradient(135deg, #9c5698, #d15659, #e05747, #ff7c10, #ffc800);
```

## Spécifications Techniques

### Icon
- **ViewBox**: 2048 x 2048
- **Paths**: 2 (assemblage top unifié + bust)
- **Vectorisation**: Boolean merge (Recraft)

### Trademark
- **ViewBox White**: 5800 x 1880
- **ViewBox Dark**: 3788 x 1228
- **Paths**: 7 (I, zz, I, c, o + 2 points)
- **Vectorisation**: Boolean merge (Recraft)

## Notes

- Tous les SVG sont proprement vectorisés (pas de géométrie cachée)
- Les fichiers `recraft-source/` contiennent les exports bruts de Recraft
- Les fichiers racine sont nettoyés et optimisés pour la production
