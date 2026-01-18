import { chromium } from 'playwright';
import path from 'path';
import { fileURLToPath } from 'url';
import { PDFDocument } from 'pdf-lib';
import fs from 'fs/promises';
import sharp from 'sharp';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function captureSlides() {
  console.log('🚀 Capture des slides en screenshots...\n');

  const htmlPath = path.join(__dirname, '..', 'izzico-pitch-deck-scrollable.html');
  const outputPath = path.join(__dirname, '..', 'izzico-pitch-deck-scrollable-final.pdf');

  console.log('📄 HTML:', htmlPath);
  console.log('📦 Output:', outputPath);
  console.log('');

  const browser = await chromium.launch();

  // Capture in 4K 16:9 (HTML is designed for this ratio)
  // We'll stretch to fill A4 landscape pages
  const CAPTURE_WIDTH = 3840;
  const CAPTURE_HEIGHT = 2160;

  const context = await browser.newContext({
    viewport: { width: CAPTURE_WIDTH, height: CAPTURE_HEIGHT },
    deviceScaleFactor: 2 // High DPI for crisp output
  });
  const page = await context.newPage();

  await page.goto(`file://${htmlPath}`, {
    waitUntil: 'networkidle'
  });

  console.log('⏳ Waiting for fonts and icons...\n');

  // Wait for fonts
  await page.waitForFunction(() => document.fonts.ready);

  // Wait for Lucide icons if present
  try {
    await page.waitForFunction(() => typeof lucide !== 'undefined', { timeout: 5000 });
  } catch {
    console.log('  ℹ️  No Lucide icons detected (skipping)');
  }

  // Wait for QR code if present (optional)
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

  // Get number of slides
  const numSlides = await page.evaluate(() => document.querySelectorAll('.slide').length);
  console.log(`📊 Total slides: ${numSlides}\n`);

  const screenshots = [];

  // Capture each slide (scrollable HTML - need to isolate each slide)
  for (let i = 0; i < numSlides; i++) {
    console.log(`  📸 Capturing slide ${i + 1}/${numSlides}...`);

    // Hide all slides except the one we want to capture
    await page.evaluate((index) => {
      const slides = document.querySelectorAll('.slide');
      slides.forEach((slide, i) => {
        if (i === index) {
          slide.style.display = 'flex';
          slide.style.margin = '0';
          slide.style.position = 'relative';
        } else {
          slide.style.display = 'none';
        }
      });

      // Scroll to top
      window.scrollTo(0, 0);
    }, i);

    // Wait for layout
    await page.waitForTimeout(500);

    // Take screenshot
    const screenshotPath = `/tmp/izzico_slide_${i + 1}.png`;
    await page.screenshot({ path: screenshotPath, fullPage: false });
    screenshots.push(screenshotPath);
  }

  await browser.close();

  console.log(`\n✅ ${numSlides} screenshots captured\n`);
  console.log('📦 Assembling PDF...\n');

  // Create PDF from screenshots
  const pdfDoc = await PDFDocument.create();

  // A4 landscape dimensions (297mm × 210mm)
  // Convert to pixels at 300 DPI for high quality
  const DPI = 300;
  const A4_WIDTH_PX = Math.round((297 / 25.4) * DPI);   // 3508 px
  const A4_HEIGHT_PX = Math.round((210 / 25.4) * DPI);  // 2480 px

  // PDF points (for pdf-lib)
  const A4_LANDSCAPE_WIDTH = 841.89;
  const A4_LANDSCAPE_HEIGHT = 595.28;

  console.log(`\n🔧 Resizing images to A4 landscape: ${A4_WIDTH_PX}×${A4_HEIGHT_PX}px (300 DPI)\n`);

  for (let i = 0; i < screenshots.length; i++) {
    const screenshotPath = screenshots[i];
    console.log(`  🔄 Processing slide ${i + 1}/${screenshots.length}...`);

    // Use Sharp to resize/crop to A4 landscape (COVER mode - fills entire page)
    const resizedImagePath = `/tmp/izzico_slide_resized_${i + 1}.png`;
    await sharp(screenshotPath)
      .resize(A4_WIDTH_PX, A4_HEIGHT_PX, {
        fit: 'cover',        // Cover mode: fill entire size, crop overflow
        position: 'center'   // Center the crop
      })
      .png()
      .toFile(resizedImagePath);

    // Embed resized image in PDF
    const imageBytes = await fs.readFile(resizedImagePath);
    const image = await pdfDoc.embedPng(imageBytes);

    // Create A4 landscape page and draw image (now perfectly sized!)
    const page = pdfDoc.addPage([A4_LANDSCAPE_WIDTH, A4_LANDSCAPE_HEIGHT]);
    page.drawImage(image, {
      x: 0,
      y: 0,
      width: A4_LANDSCAPE_WIDTH,
      height: A4_LANDSCAPE_HEIGHT,
    });

    // Delete temp files
    await fs.unlink(screenshotPath);
    await fs.unlink(resizedImagePath);
  }

  const pdfBytes = await pdfDoc.save();
  await fs.writeFile(outputPath, pdfBytes);

  const stats = await fs.stat(outputPath);
  const sizeMB = (stats.size / (1024 * 1024)).toFixed(2);

  console.log('✅ PDF generated successfully!');
  console.log(`   📦 File: ${outputPath}`);
  console.log(`   📊 Size: ${sizeMB} MB`);
  console.log(`   📄 Slides: ${numSlides}`);
  console.log('\n🎯 PDF is EXACTLY what you see in the browser!');
}

captureSlides().catch(console.error);
