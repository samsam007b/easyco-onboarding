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

// Différentes tailles à exporter (basées sur la hauteur du texte)
const sizes = [
  { name: 'izzico-logo-256', fontSize: 256 },    // Petite
  { name: 'izzico-logo-512', fontSize: 512 },    // Moyenne
  { name: 'izzico-logo-1024', fontSize: 1024 },  // Grande
  { name: 'izzico-logo-2048', fontSize: 2048 },  // Très grande pour impression
];

const outputDir = '/Users/samuelbaudon/easyco-onboarding/exported-logos';

function createLogo(fontSize, outputName) {
  // Créer un canvas temporaire pour mesurer le texte
  const tempCanvas = createCanvas(100, 100);
  const tempCtx = tempCanvas.getContext('2d');
  tempCtx.font = `800 ${fontSize}px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`;

  // Calculer la largeur totale du texte
  let totalWidth = 0;
  letters.forEach((letter) => {
    const metrics = tempCtx.measureText(letter.char);
    totalWidth += metrics.width + (fontSize * 0.02); // Espacement entre lettres
  });
  totalWidth -= (fontSize * 0.02); // Enlever le dernier espacement

  // Ajouter une petite marge pour l'ombre
  const shadowMargin = fontSize * 0.1;
  const padding = fontSize * 0.15;

  // Dimensions finales du canvas (ajustées au texte)
  const canvasWidth = Math.ceil(totalWidth + (padding * 2));
  const canvasHeight = Math.ceil(fontSize * 1.3); // Hauteur adaptée à la taille de police

  // Créer le canvas final avec les bonnes dimensions
  const canvas = createCanvas(canvasWidth, canvasHeight);
  const ctx = canvas.getContext('2d');

  // Fond transparent
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);

  // Configuration du texte
  ctx.font = `800 ${fontSize}px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`;
  ctx.textBaseline = 'middle';
  ctx.textAlign = 'left';

  // Position de départ
  let x = padding;
  const y = canvasHeight / 2;

  // Dessiner chaque lettre avec sa couleur
  letters.forEach((letter) => {
    ctx.fillStyle = letter.color;

    // Ajouter une ombre subtile pour plus de profondeur
    ctx.shadowColor = 'rgba(0, 0, 0, 0.15)';
    ctx.shadowBlur = fontSize * 0.04;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = fontSize * 0.015;

    ctx.fillText(letter.char, x, y);

    // Calculer la largeur de la lettre pour positionner la suivante
    const metrics = ctx.measureText(letter.char);
    x += metrics.width + (fontSize * 0.02); // Petit espacement entre les lettres
  });

  // Exporter en PNG avec transparence
  const buffer = canvas.toBuffer('image/png');
  writeFileSync(`${outputDir}/${outputName}.png`, buffer);
  console.log(`✅ Created ${outputName}.png (${canvasWidth}×${canvasHeight}, ${fontSize}px text)`);
}

// Générer toutes les tailles
console.log('🎨 Generating high-resolution Izzico logos with tight crop...\n');

sizes.forEach(({ name, fontSize }) => {
  createLogo(fontSize, name);
});

console.log('\n🎉 All Izzico logos have been exported to: exported-logos/');
console.log('   ✓ Transparent backgrounds');
console.log('   ✓ Tight crop (no wasted space)');
console.log('   ✓ High resolution for print and web');
