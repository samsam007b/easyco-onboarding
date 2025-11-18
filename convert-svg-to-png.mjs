import { readFileSync, writeFileSync } from 'fs';
import { createCanvas, loadImage } from 'canvas';

const sizes = [
  { name: 'logo-1024', size: 1024 },
  { name: 'logo-512', size: 512 },
  { name: 'logo-256', size: 256 },
  { name: 'app-icon-180', size: 180 }, // iOS
  { name: 'app-icon-192', size: 192 }, // Android
];

const svgPath = '/Users/samuelbaudon/easyco-onboarding/public/icons/icon.svg';
const outputDir = '/Users/samuelbaudon/easyco-onboarding/exported-logos';

async function convertSvgToPng() {
  try {
    const svgContent = readFileSync(svgPath, 'utf8');

    for (const { name, size } of sizes) {
      const canvas = createCanvas(size, size);
      const ctx = canvas.getContext('2d');

      // Create a data URL from the SVG
      const svgDataUrl = 'data:image/svg+xml;base64,' + Buffer.from(svgContent).toString('base64');

      const img = await loadImage(svgDataUrl);
      ctx.drawImage(img, 0, 0, size, size);

      const buffer = canvas.toBuffer('image/png');
      writeFileSync(`${outputDir}/${name}.png`, buffer);
      console.log(`✅ Created ${name}.png (${size}x${size})`);
    }

    console.log('\n🎉 All PNG logos have been exported to: exported-logos/');
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

convertSvgToPng();
