import { createCanvas } from 'canvas';
import { writeFileSync } from 'fs';
import sharp from 'sharp';

const letters = [
  { char: 'E', color: '#7B5FB8' },
  { char: 'a', color: '#A67BB8' },
  { char: 's', color: '#C98B9E' },
  { char: 'y', color: '#E8865D' },
  { char: 'C', color: '#FF8C4B' },
  { char: 'o', color: '#FFD080' },
];

const outputDir = '/Users/samuelbaudon/easyco-onboarding/exported-logos';

//  Step 1: Créer un logo master à très haute résolution
async function createMasterLogo() {
  const fontSize = 200; // Taille de base
  const canvasWidth = fontSize * 5;
  const canvasHeight = fontSize * 2;

  const canvas = createCanvas(canvasWidth, canvasHeight);
  const ctx = canvas.getContext('2d');

  ctx.clearRect(0, 0, canvasWidth, canvasHeight);

  // Police
  ctx.font = `800 ${fontSize}px -apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif`;
  ctx.textBaseline = 'middle';
  ctx.textAlign = 'left';

  let x = fontSize * 0.3;
  const y = canvasHeight / 2;

  // Dessiner
  letters.forEach((letter) => {
    ctx.fillStyle = letter.color;
    ctx.shadowColor = 'rgba(0, 0, 0, 0.1)';
    ctx.shadowBlur = fontSize * 0.015;
    ctx.shadowOffsetY = fontSize * 0.008;

    ctx.fillText(letter.char, x, y);

    const metrics = ctx.measureText(letter.char);
    x += metrics.width;
  });

  // Crop
  const imageData = ctx.getImageData(0, 0, canvasWidth, canvasHeight);
  const { data, width, height } = imageData;

  let minX = width, minY = height, maxX = 0, maxY = 0;

  for (let py = 0; py < height; py++) {
    for (let px = 0; px < width; px++) {
      const alpha = data[(py * width + px) * 4 + 3];
      if (alpha > 5) {
        minX = Math.min(minX, px);
        maxX = Math.max(maxX, px);
        minY = Math.min(minY, py);
        maxY = Math.max(maxY, py);
      }
    }
  }

  const pad = Math.floor(fontSize * 0.04);
  minX = Math.max(0, minX - pad);
  minY = Math.max(0, minY - pad);
  maxX = Math.min(width - 1, maxX + pad);
  maxY = Math.min(height - 1, maxY + pad);

  const w = maxX - minX + 1;
  const h = maxY - minY + 1;

  const finalCanvas = createCanvas(w, h);
  const finalCtx = finalCanvas.getContext('2d');
  finalCtx.putImageData(ctx.getImageData(minX, minY, w, h), 0, 0);

  return finalCanvas.toBuffer('image/png');
}

// Step 2: Redimensionner le logo master
async function resizeAndSave(masterBuffer, targetHeights) {
  console.log('🎨 Creating EasyCo logos at multiple resolutions...\n');

  for (const { name, height } of targetHeights) {
    const resized = await sharp(masterBuffer)
      .resize({ height, fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png({ quality: 100, compressionLevel: 9 })
      .toBuffer();

    const metadata = await sharp(resized).metadata();
    writeFileSync(`${outputDir}/${name}.png`, resized);

    const kb = (resized.length / 1024).toFixed(1);
    console.log(`✅ ${name}.png → ${metadata.width}×${metadata.height}px (${kb} KB)`);
  }
}

// Tailles finales
const targetSizes = [
  { name: 'easyco-logo-small', height: 300 },
  { name: 'easyco-logo-medium', height: 600 },
  { name: 'easyco-logo-large', height: 1200 },
  { name: 'easyco-logo-xlarge', height: 2400 },
];

// Exécution
const masterLogo = await createMasterLogo();
await resizeAndSave(masterLogo, targetSizes);

console.log('\n✨ Perfect! High-resolution logos ready in exported-logos/');
