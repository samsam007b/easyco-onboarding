import { chromium } from 'playwright';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function exportPDF() {
  console.log('🚀 Starting PDF export with Playwright...');

  const htmlPath = path.join(__dirname, '..', 'izzico-pitch-deck-scrollable.html');
  const outputPath = path.join(__dirname, '..', 'izzico-pitch-deck-export.pdf');

  console.log('📄 HTML:', htmlPath);
  console.log('📦 Output:', outputPath);

  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 }
  });
  const page = await context.newPage();

  await page.goto(`file://${htmlPath}`, {
    waitUntil: 'networkidle'
  });

  console.log('⏳ Waiting for fonts, icons, and QR code...');

  // Wait for fonts to load
  await page.waitForFunction(() => document.fonts.ready);

  // Wait for Lucide icons to load
  await page.waitForFunction(() => typeof lucide !== 'undefined');

  // Wait for QR code to be generated
  await page.waitForFunction(() => {
    const qrcode = document.getElementById('qrcode');
    return qrcode && qrcode.querySelector('canvas');
  }, { timeout: 10000 });

  // Extra wait to ensure all rendering is complete
  await page.waitForTimeout(2000);

  console.log('✅ All assets loaded (fonts, icons, QR code)');

  await page.pdf({
    path: outputPath,
    format: 'A4',
    landscape: true, // ✨ Format paysage
    width: '1920px',
    height: '1080px',
    printBackground: true,
    margin: { top: 0, right: 0, bottom: 0, left: 0 },
    preferCSSPageSize: true
  });

  await browser.close();

  console.log('✅ PDF exported:', outputPath);
}

exportPDF().catch(console.error);
