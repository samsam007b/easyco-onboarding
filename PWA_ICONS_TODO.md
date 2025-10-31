# Génération des icônes PWA

## Problème
Les icônes PNG pour la PWA n'ont pas encore été générées à partir du fichier SVG.

## Solution 1 : Installation d'un outil de conversion (Recommandé)

Installez ImageMagick via Homebrew :
```bash
brew install imagemagick
```

Puis exécutez le script de génération :
```bash
node scripts/generate-pwa-icons.js
```

## Solution 2 : Génération en ligne

1. Allez sur https://realfavicongenerator.net/ ou https://www.pwabuilder.com/imageGenerator
2. Uploadez le fichier `public/icons/icon.svg`
3. Téléchargez les icônes générées
4. Placez-les dans `public/icons/`

## Solution 3 : Utilisation du SVG temporairement

En attendant, vous pouvez modifier le `manifest.json` pour utiliser directement le SVG :

```json
"icons": [
  {
    "src": "/icons/icon.svg",
    "sizes": "any",
    "type": "image/svg+xml",
    "purpose": "any maskable"
  }
]
```

## Fichiers nécessaires

Les fichiers PNG suivants doivent être créés dans `public/icons/` :
- icon-72x72.png
- icon-96x96.png
- icon-128x128.png
- icon-144x144.png
- icon-152x152.png
- icon-192x192.png
- icon-384x384.png
- icon-512x512.png

Et pour les raccourcis :
- shortcut-explore.png (96x96)
- shortcut-favorites.png (96x96)
- shortcut-messages.png (96x96)
