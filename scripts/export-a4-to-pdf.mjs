import { chromium } from 'playwright';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs/promises';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function exportA4ToPDF() {
  console.log('🚀 Export A4 Landscape HTML to PDF...\n');

  const htmlPath = path.join(__dirname, '..', 'izzico-pitch-deck-a4-landscape.html');
  const outputPath = path.join(__dirname, '..', 'izzico-pitch-deck-a4-final.pdf');

  console.log('📄 HTML:', htmlPath);
  console.log('📦 Output:', outputPath);
  console.log('');

  const browser = await chromium.launch();
  const page = await browser.newPage();

  await page.goto(`file://${htmlPath}`, {
    waitUntil: 'networkidle'
  });

  console.log('⏳ Waiting for fonts and icons...\n');

  // Wait for fonts
  await page.waitForFunction(() => document.fonts.ready);

  // Wait for Lucide icons
  try {
    await page.waitForFunction(() => typeof lucide !== 'undefined', { timeout: 5000 });
  } catch {
    console.log('  ℹ️  No Lucide icons detected (skipping)');
  }

  // Wait for QR code
  try {
    await page.waitForFunction(() => {
      const qrcode = document.getElementById('qrcode');
      return qrcode && qrcode.querySelector('canvas');
    }, { timeout: 3000 });
    console.log('  ✓ QR code detected');
  } catch {
    console.log('  ℹ️  No QR code detected (skipping)');
  }

  await page.waitForTimeout(1500);

  console.log('✅ Page loaded\n');
  console.log('📦 Generating PDF...\n');

  // Generate PDF directly from HTML (A4 landscape pages)
  await page.pdf({
    path: outputPath,
    format: 'A4',
    landscape: true,
    printBackground: true,
    preferCSSPageSize: false, // Use our A4 landscape format
    margin: {
      top: 0,
      right: 0,
      bottom: 0,
      left: 0
    }
  });

  await browser.close();

  const stats = await fs.stat(outputPath);
  const sizeMB = (stats.size / (1024 * 1024)).toFixed(2);

  console.log('✅ PDF generated successfully!');
  console.log(`   📦 File: ${outputPath}`);
  console.log(`   📊 Size: ${sizeMB} MB`);
  console.log(`   📄 Format: A4 Landscape`);
  console.log('\n🎯 PDF is ready!');
}

exportA4ToPDF().catch(console.error);
