const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const sizes = [
  { size: 20, scales: [2, 3] },
  { size: 29, scales: [2, 3] },
  { size: 40, scales: [2, 3] },
  { size: 60, scales: [2, 3] },
  { size: 76, scales: [1, 2] },
  { size: 83.5, scales: [2] },
  { size: 1024, scales: [1] }
];

const iconsDir = path.join(__dirname, '..', 'public', 'icons');
const sourceSvg = path.join(iconsDir, 'icon.svg');

// Vérifier que le fichier source existe
if (!fs.existsSync(sourceSvg)) {
  console.error('❌ Fichier source icon.svg non trouvé');
  process.exit(1);
}

console.log('🎨 Génération des icônes iOS...\n');

let completed = 0;
let total = sizes.reduce((acc, { scales }) => acc + scales.length, 0);

sizes.forEach(({ size, scales }) => {
  scales.forEach(scale => {
    const dimension = Math.round(size * scale);
    const outputFile = path.join(iconsDir, `icon-${dimension}x${dimension}.png`);

    // Vérifier si le fichier existe déjà
    if (fs.existsSync(outputFile)) {
      console.log(`✓ ${dimension}x${dimension} (existe déjà)`);
      completed++;
      return;
    }

    const sips = spawn('sips', [
      '-s', 'format', 'png',
      '-z', dimension.toString(), dimension.toString(),
      sourceSvg,
      '--out', outputFile
    ]);

    sips.on('close', (code) => {
      if (code === 0) {
        console.log(`✓ ${dimension}x${dimension}`);
      } else {
        console.error(`✗ Erreur pour ${dimension}x${dimension}`);
      }
      completed++;

      if (completed === total) {
        console.log('\n✅ Génération des icônes terminée !');
      }
    });
  });
});
