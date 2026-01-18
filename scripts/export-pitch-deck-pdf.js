#!/usr/bin/env node

/**
 * Export Izzico Pitch Deck HTML to PDF
 * Garantit que tous les éléments (fonts, couleurs, positions, images) sont préservés
 */

const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

async function exportToPDF() {
  console.log('🚀 Starting PDF export...');

  const htmlPath = path.join(__dirname, '..', 'izzico-pitch-deck-scrollable.html');
  const outputPath = path.join(__dirname, '..', 'izzico-pitch-deck-export.pdf');

  if (!fs.existsSync(htmlPath)) {
    console.error('❌ HTML file not found:', htmlPath);
    process.exit(1);
  }

  console.log('📄 HTML file:', htmlPath);
  console.log('📦 Output PDF:', outputPath);

  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();

  // Set viewport to slide dimensions
  await page.setViewport({ width: 1920, height: 1080 });

  // Load HTML file
  await page.goto(`file://${htmlPath}`, {
    waitUntil: ['load', 'domcontentloaded', 'networkidle0'],
    timeout: 60000
  });

  // Wait for fonts to load
  await page.evaluateHandle('document.fonts.ready');

  // Wait for Lucide icons to render
  await page.waitForFunction(() => {
    return typeof lucide !== 'undefined';
  }, { timeout: 10000 });

  // Wait a bit more for all images to load
  await page.waitForTimeout(2000);

  console.log('✅ Page loaded, fonts ready, icons rendered');

  // Export to PDF
  await page.pdf({
    path: outputPath,
    width: '1920px',
    height: '1080px',
    printBackground: true,
    preferCSSPageSize: true,
    margin: {
      top: 0,
      right: 0,
      bottom: 0,
      left: 0
    }
  });

  await browser.close();

  const stats = fs.statSync(outputPath);
  const sizeMB = (stats.size / (1024 * 1024)).toFixed(2);

  console.log(`✅ PDF exported successfully!`);
  console.log(`   File: ${outputPath}`);
  console.log(`   Size: ${sizeMB} MB`);
  console.log('');
  console.log('📋 Next steps:');
  console.log('   1. Open the PDF and verify all slides');
  console.log('   2. Check fonts (Inter, Nunito, Fredoka)');
  console.log('   3. Check colors and gradients');
  console.log('   4. Check images and SVG logos');
  console.log('   5. Check positioning of all elements');
}

exportToPDF().catch(err => {
  console.error('❌ Export failed:', err);
  process.exit(1);
});
