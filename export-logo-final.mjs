import { createCanvas } from 'canvas';
import { writeFileSync } from 'fs';

const letters = [
  { char: 'E', color: '#7B5FB8' },
  { char: 'a', color: '#A67BB8' },
  { char: 's', color: '#C98B9E' },
  { char: 'y', color: '#E8865D' },
  { char: 'C', color: '#FF8C4B' },
  { char: 'o', color: '#FFD080' },
];

const outputDir = '/Users/samuelbaudon/easyco-onboarding/exported-logos';

// Tailles en pixels pour le fontSize (taille réelle du texte)
const sizes = [
  { name: 'easyco-logo-small', fontSize: 400 },
  { name: 'easyco-logo-medium', fontSize: 800 },
  { name: 'easyco-logo-large', fontSize: 1600 },
  { name: 'easyco-logo-xlarge', fontSize: 3200 },
];

function createLogo(fontSize, outputName) {
  // Créer un très grand canvas pour être sûr que tout rentre
  const canvasSize = fontSize * 8;
  const canvas = createCanvas(canvasSize, canvasSize);
  const ctx = canvas.getContext('2d');

  // Configuration
  ctx.font = `bold ${fontSize}px -apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif`;
  ctx.textBaseline = 'alphabetic';

  // Position centrale pour commencer
  let x = canvasSize / 4;
  const y = canvasSize / 2;

  // Dessiner chaque lettre
  letters.forEach((letter) => {
    ctx.fillStyle = letter.color;
    ctx.shadowColor = 'rgba(0, 0, 0, 0.1)';
    ctx.shadowBlur = fontSize * 0.02;
    ctx.shadowOffsetY = fontSize * 0.01;

    ctx.fillText(letter.char, x, y);

    const metrics = ctx.measureText(letter.char);
    x += metrics.width;
  });

  // Détecter les limites
  const imageData = ctx.getImageData(0, 0, canvasSize, canvasSize);
  const { data, width, height } = imageData;

  let minX = width, minY = height, maxX = 0, maxY = 0;

  for (let py = 0; py < height; py++) {
    for (let px = 0; px < width; px++) {
      const alpha = data[(py * width + px) * 4 + 3];
      if (alpha > 5) {
        if (px < minX) minX = px;
        if (px > maxX) maxX = px;
        if (py < minY) minY = py;
        if (py > maxY) maxY = py;
      }
    }
  }

  // Padding
  const pad = Math.floor(fontSize * 0.05);
  minX = Math.max(0, minX - pad);
  minY = Math.max(0, minY - pad);
  maxX = Math.min(width - 1, maxX + pad);
  maxY = Math.min(height - 1, maxY + pad);

  const w = maxX - minX + 1;
  const h = maxY - minY + 1;

  // Canvas final
  const finalCanvas = createCanvas(w, h);
  const finalCtx = finalCanvas.getContext('2d');
  finalCtx.putImageData(ctx.getImageData(minX, minY, w, h), 0, 0);

  // Sauvegarder
  const buffer = finalCanvas.toBuffer('image/png');
  const kb = (buffer.length / 1024).toFixed(1);
  writeFileSync(`${outputDir}/${outputName}.png`, buffer);
  console.log(`✅ ${outputName}.png → ${w}×${h}px (${kb} KB)`);
}

console.log('🎨 Generating EasyCo logos in high resolution...\n');
sizes.forEach(({ name, fontSize }) => createLogo(fontSize, name));
console.log('\n✨ Done! Your logos are ready in exported-logos/');
