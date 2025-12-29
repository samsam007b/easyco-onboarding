#!/usr/bin/env node

/**
 * Script pour aplatir la structure des icônes
 * Copie tous les PNG dans des dossiers "all-icons-{variant}" sans catégories
 *
 * Usage: node scripts/flatten-icons.js <chemin-vers-dossier-icons>
 */

const fs = require('fs');
const path = require('path');

// Récupérer le chemin depuis les arguments
const sourceDir = process.argv[2];

if (!sourceDir) {
  console.error('❌ Usage: node scripts/flatten-icons.js <chemin-vers-dossier-icons>');
  console.error('   Exemple: node scripts/flatten-icons.js ~/Downloads/izzico-icons-2025-12-06');
  process.exit(1);
}

const resolvedPath = sourceDir.startsWith('~')
  ? path.join(process.env.HOME, sourceDir.slice(1))
  : path.resolve(sourceDir);

if (!fs.existsSync(resolvedPath)) {
  console.error(`❌ Le dossier n'existe pas: ${resolvedPath}`);
  process.exit(1);
}

console.log(`📂 Source: ${resolvedPath}\n`);

// Variantes à traiter
const variants = ['black', 'white', 'purple', 'orange', 'yellow', 'gradient'];

let totalCopied = 0;

variants.forEach(variant => {
  const variantDir = path.join(resolvedPath, `icons-${variant}`);
  const outputDir = path.join(resolvedPath, `all-icons-${variant}`);

  if (!fs.existsSync(variantDir)) {
    console.log(`⚠️  Dossier manquant: icons-${variant}`);
    return;
  }

  // Créer le dossier de sortie
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  let copiedCount = 0;

  // Parcourir récursivement et copier tous les PNG
  function copyPNGFiles(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    entries.forEach(entry => {
      const fullPath = path.join(dir, entry.name);

      if (entry.isDirectory()) {
        // Récursion dans les sous-dossiers
        copyPNGFiles(fullPath);
      } else if (entry.isFile() && entry.name.endsWith('.png')) {
        // Copier le PNG
        const destPath = path.join(outputDir, entry.name);
        fs.copyFileSync(fullPath, destPath);
        copiedCount++;
      }
    });
  }

  copyPNGFiles(variantDir);

  console.log(`✅ ${variant.padEnd(10)} → ${copiedCount} icônes copiés dans all-icons-${variant}/`);
  totalCopied += copiedCount;
});

console.log(`\n🎉 Total: ${totalCopied} icônes copiés`);
console.log(`📍 Dossiers créés dans: ${resolvedPath}`);
