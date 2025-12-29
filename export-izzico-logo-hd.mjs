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

// Tailles basées sur la HAUTEUR réelle du texte
const sizes = [
  { name: 'izzico-logo-small', height: 300 },      // 300px de haut
  { name: 'izzico-logo-medium', height: 600 },     // 600px de haut
  { name: 'izzico-logo-large', height: 1200 },     // 1200px de haut
  { name: 'izzico-logo-xlarge', height: 2400 },    // 2400px de haut - très haute résolution
];

const outputDir = '/Users/samuelbaudon/easyco-onboarding/exported-logos';

function createLogo(targetHeight, outputName) {
  // Le fontSize doit être plus grand que la hauteur cible pour compenser
  // la hauteur réelle des lettres (qui ne prennent pas tout l'espace vertical)
  const fontSize = Math.floor(targetHeight * 1.15);

  // Mesurer la largeur totale nécessaire
  const tempCanvas = createCanvas(100, 100);
  const tempCtx = tempCanvas.getContext('2d');
  tempCtx.font = `800 ${fontSize}px -apple-system, BlinkMacSystemFont, "Segoe UI", "Helvetica Neue", Arial, sans-serif`;

  // Mesurer chaque lettre
  let totalWidth = 0;
  letters.forEach((letter, index) => {
    const metrics = tempCtx.measureText(letter.char);
    totalWidth += metrics.width;
    if (index < letters.length - 1) {
      totalWidth += fontSize * 0.01; // Espacement minime entre lettres
    }
  });

  // Ajouter un padding minimal
  const paddingX = Math.floor(fontSize * 0.08);
  const paddingY = Math.floor(fontSize * 0.08);

  const canvasWidth = Math.ceil(totalWidth + paddingX * 2);
  const canvasHeight = Math.ceil(fontSize * 1.2 + paddingY * 2);

  // Créer le canvas final
  const canvas = createCanvas(canvasWidth, canvasHeight);
  const ctx = canvas.getContext('2d');

  // Fond transparent
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);

  // Configuration du texte - BOLD et grande taille
  ctx.font = `800 ${fontSize}px -apple-system, BlinkMacSystemFont, "Segoe UI", "Helvetica Neue", Arial, sans-serif`;
  ctx.textBaseline = 'top';
  ctx.textAlign = 'left';

  // Position de départ
  let x = paddingX;
  const y = paddingY;

  // Dessiner chaque lettre
  letters.forEach((letter) => {
    ctx.fillStyle = letter.color;

    // Ombre douce
    ctx.shadowColor = 'rgba(0, 0, 0, 0.12)';
    ctx.shadowBlur = fontSize * 0.02;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = fontSize * 0.01;

    ctx.fillText(letter.char, x, y);

    // Avancer pour la prochaine lettre
    const metrics = ctx.measureText(letter.char);
    x += metrics.width + (fontSize * 0.01);
  });

  // Auto-crop pour enlever l'espace vide
  const imageData = ctx.getImageData(0, 0, canvasWidth, canvasHeight);
  const { data, width, height } = imageData;

  let minX = width, minY = height, maxX = 0, maxY = 0;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const alpha = data[(y * width + x) * 4 + 3];
      if (alpha > 10) { // Seuil bas pour capturer même l'ombre
        minX = Math.min(minX, x);
        maxX = Math.max(maxX, x);
        minY = Math.min(minY, y);
        maxY = Math.max(maxY, y);
      }
    }
  }

  const finalWidth = maxX - minX + 1;
  const finalHeight = maxY - minY + 1;

  // Créer le canvas final cropé
  const finalCanvas = createCanvas(finalWidth, finalHeight);
  const finalCtx = finalCanvas.getContext('2d');
  finalCtx.putImageData(
    ctx.getImageData(minX, minY, finalWidth, finalHeight),
    0,
    0
  );

  // Sauvegarder
  const buffer = finalCanvas.toBuffer('image/png');
  const fileSizeKB = (buffer.length / 1024).toFixed(1);
  writeFileSync(`${outputDir}/${outputName}.png`, buffer);
  console.log(`✅ ${outputName}.png → ${finalWidth}×${finalHeight}px (${fileSizeKB} KB)`);
}

console.log('🎨 Generating HIGH-RESOLUTION Izzico logos...\n');

sizes.forEach(({ name, height }) => {
  createLogo(height, name);
});

console.log('\n🎉 Perfect! High-resolution logos exported!');
console.log('   ✓ Crisp, non-pixelated text');
console.log('   ✓ Transparent background');
console.log('   ✓ Optimized crop');
