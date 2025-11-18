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

const sizes = [
  { name: 'easyco-logo-small', fontSize: 600 },
  { name: 'easyco-logo-medium', fontSize: 1200 },
  { name: 'easyco-logo-large', fontSize: 2400 },
];

function createLogo(fontSize, outputName) {
  // Canvas raisonnable (5x la taille du texte)
  const canvasWidth = fontSize * 5;
  const canvasHeight = fontSize * 2;

  const canvas = createCanvas(canvasWidth, canvasHeight);
  const ctx = canvas.getContext('2d');

  // Fond transparent
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);

  // Police avec poids 800 (extra bold)
  ctx.font = `800 ${fontSize}px -apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif`;
  ctx.textBaseline = 'middle';
  ctx.textAlign = 'left';

  // Position de départ
  let x = fontSize * 0.3;
  const y = canvasHeight / 2;

  // Dessiner chaque lettre
  letters.forEach((letter) => {
    ctx.fillStyle = letter.color;
    ctx.shadowColor = 'rgba(0, 0, 0, 0.1)';
    ctx.shadowBlur = fontSize * 0.015;
    ctx.shadowOffsetY = fontSize * 0.008;

    ctx.fillText(letter.char, x, y);

    const metrics = ctx.measureText(letter.char);
    x += metrics.width;
  });

  // Auto-crop
  const imageData = ctx.getImageData(0, 0, canvasWidth, canvasHeight);
  const { data, width, height } = imageData;

  let minX = width, minY = height, maxX = 0, maxY = 0;
  let hasContent = false;

  for (let py = 0; py < height; py++) {
    for (let px = 0; px < width; px++) {
      const alpha = data[(py * width + px) * 4 + 3];
      if (alpha > 5) {
        hasContent = true;
        minX = Math.min(minX, px);
        maxX = Math.max(maxX, px);
        minY = Math.min(minY, py);
        maxY = Math.max(maxY, py);
      }
    }
  }

  if (!hasContent) {
    console.error(`❌ No content rendered for ${outputName}`);
    return;
  }

  // Padding
  const pad = Math.floor(fontSize * 0.04);
  minX = Math.max(0, minX - pad);
  minY = Math.max(0, minY - pad);
  maxX = Math.min(width - 1, maxX + pad);
  maxY = Math.min(height - 1, maxY + pad);

  const w = maxX - minX + 1;
  const h = maxY - minY + 1;

  // Canvas final cropé
  const finalCanvas = createCanvas(w, h);
  const finalCtx = finalCanvas.getContext('2d');
  finalCtx.putImageData(ctx.getImageData(minX, minY, w, h), 0, 0);

  // Sauvegarder
  const buffer = finalCanvas.toBuffer('image/png');
  const kb = (buffer.length / 1024).toFixed(1);
  writeFileSync(`${outputDir}/${outputName}.png`, buffer);
  console.log(`✅ ${outputName}.png → ${w}×${h}px (${kb} KB)`);
}

console.log('🎨 Creating high-resolution EasyCo logos...\n');
sizes.forEach(({ name, fontSize }) => createLogo(fontSize, name));
console.log('\n✨ Logos exported to exported-logos/');
