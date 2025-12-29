import { createCanvas } from 'canvas';
import { writeFileSync } from 'fs';

// Lettres du logo avec leurs couleurs respectives
const letters = [
  { char: 'I', color: '#7B5FB8' },      // Owner - Mauve
  { char: 'z', color: '#A67BB8' },      // Owner gradient
  { char: 'z', color: '#C98B9E' },      // Owner gradient rose
  { char: 'i', color: '#E8865D' },      // Resident - Orange/Coral
  { char: 'c', color: '#FF8C4B' },      // Resident gradient
  { char: 'o', color: '#FFD080' },      // Searcher - Jaune doré
];

// Différentes tailles à exporter
const sizes = [
  { name: 'izzico-logo-256', fontSize: 256 },
  { name: 'izzico-logo-512', fontSize: 512 },
  { name: 'izzico-logo-1024', fontSize: 1024 },
  { name: 'izzico-logo-2048', fontSize: 2048 },
];

const outputDir = '/Users/samuelbaudon/easyco-onboarding/exported-logos';

function createLogo(fontSize, outputName) {
  // Créer un grand canvas pour être sûr d'avoir assez d'espace
  const tempSize = fontSize * 10;
  const canvas = createCanvas(tempSize, tempSize);
  const ctx = canvas.getContext('2d');

  // Fond transparent
  ctx.clearRect(0, 0, tempSize, tempSize);

  // Configuration du texte
  ctx.font = `800 ${fontSize}px -apple-system, BlinkMacSystemFont, "Segoe UI", "Helvetica Neue", sans-serif`;
  ctx.textBaseline = 'top';
  ctx.textAlign = 'left';

  // Position de départ avec beaucoup d'espace
  let x = tempSize / 4;
  const y = tempSize / 4;

  // Dessiner chaque lettre avec sa couleur
  letters.forEach((letter) => {
    ctx.fillStyle = letter.color;

    // Ombre subtile
    ctx.shadowColor = 'rgba(0, 0, 0, 0.15)';
    ctx.shadowBlur = fontSize * 0.04;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = fontSize * 0.015;

    ctx.fillText(letter.char, x, y);

    // Mesurer et avancer
    const metrics = ctx.measureText(letter.char);
    x += metrics.width;
  });

  // Détecter les limites du contenu (crop automatique)
  const imageData = ctx.getImageData(0, 0, tempSize, tempSize);
  const { data, width, height } = imageData;

  let minX = width, minY = height, maxX = 0, maxY = 0;

  // Parcourir tous les pixels pour trouver les limites
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const alpha = data[(y * width + x) * 4 + 3];
      if (alpha > 0) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }

  // Ajouter un padding
  const padding = Math.floor(fontSize * 0.1);
  minX = Math.max(0, minX - padding);
  minY = Math.max(0, minY - padding);
  maxX = Math.min(width - 1, maxX + padding);
  maxY = Math.min(height - 1, maxY + padding);

  const croppedWidth = maxX - minX + 1;
  const croppedHeight = maxY - minY + 1;

  // Créer un nouveau canvas avec les dimensions exactes
  const finalCanvas = createCanvas(croppedWidth, croppedHeight);
  const finalCtx = finalCanvas.getContext('2d');

  // Copier la partie croppée
  finalCtx.putImageData(
    ctx.getImageData(minX, minY, croppedWidth, croppedHeight),
    0,
    0
  );

  // Exporter
  const buffer = finalCanvas.toBuffer('image/png');
  writeFileSync(`${outputDir}/${outputName}.png`, buffer);
  console.log(`✅ Created ${outputName}.png (${croppedWidth}×${croppedHeight})`);
}

// Générer toutes les tailles
console.log('🎨 Generating high-resolution Izzico logos with auto-crop...\n');

sizes.forEach(({ name, fontSize }) => {
  createLogo(fontSize, name);
});

console.log('\n🎉 Perfect! Your Izzico logos are ready!');
console.log('   ✓ Transparent backgrounds');
console.log('   ✓ Automatically cropped to content');
console.log('   ✓ High resolution for any use');
