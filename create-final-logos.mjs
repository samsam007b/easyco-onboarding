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

const logos = [
  { name: 'easyco-logo-small', fontSize: 80, scale: 1 },
  { name: 'easyco-logo-medium', fontSize: 160, scale: 1 },
  { name: 'easyco-logo-large', fontSize: 320, scale: 1 },
];

logos.forEach(({ name, fontSize, scale }) => {
  const scaledFontSize = fontSize * scale;

  // Créer un canvas assez grand
  const canvas = createCanvas(scaledFontSize * 4, scaledFontSize * 1.5);
  const ctx = canvas.getContext('2d');

  // Transparent
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Police BOLD
  ctx.font = `${800 * scale} ${scaledFontSize}px -apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif`;
  ctx.textBaseline = 'middle';

  let x = scaledFontSize * 0.2;
  const y = canvas.height / 2;

  // Dessiner
  letters.forEach((letter) => {
    ctx.fillStyle = letter.color;
    ctx.shadowColor = 'rgba(0, 0, 0, 0.1)';
    ctx.shadowBlur = scaledFontSize * 0.01;
    ctx.shadowOffsetY = scaledFontSize * 0.005;

    ctx.fillText(letter.char, x, y);

    const metrics = ctx.measureText(letter.char);
    x += metrics.width;
  });

  // Sauvegarder tel quel (avec un peu d'espace autour)
  const buffer = canvas.toBuffer('image/png');
  writeFileSync(`${outputDir}/${name}.png`, buffer);

  const kb = (buffer.length / 1024).toFixed(1);
  console.log(`✅ ${name}.png → ${canvas.width}×${canvas.height}px (${kb} KB)`);
});

console.log('\n✨ Logos créés! Utilisables immédiatement.');
