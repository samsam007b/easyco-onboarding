import { chromium } from 'playwright';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs/promises';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function exportDossierStageToPDF() {
  console.log('Export Dossier de Stage Izzico vers PDF...\n');

  const htmlPath = path.join(__dirname, '..', 'docs', 'stage-entrepreneurial', 'DOSSIER-STAGE-IZZICO-PRINT.html');
  const outputPath = path.join(__dirname, '..', 'docs', 'stage-entrepreneurial', 'DOSSIER-STAGE-IZZICO.pdf');

  console.log('HTML source:', htmlPath);
  console.log('PDF output:', outputPath);
  console.log('');

  const browser = await chromium.launch();
  const page = await browser.newPage();

  await page.goto(`file://${htmlPath}`, {
    waitUntil: 'networkidle'
  });

  console.log('Attente chargement fonts (Inter, Nunito, Fredoka)...\n');

  // Wait for Google Fonts
  await page.waitForFunction(() => document.fonts.ready);
  await page.waitForTimeout(2000); // Extra time for logo SVG

  console.log('Page chargée\n');
  console.log('Génération PDF A4 Portrait...\n');

  // Generate PDF A4 Portrait
  await page.pdf({
    path: outputPath,
    format: 'A4',
    landscape: false,
    printBackground: true, // CRUCIAL pour gradients et backgrounds
    preferCSSPageSize: true, // Utiliser les dimensions CSS @page
    margin: {
      top: 0,
      right: 0,
      bottom: 0,
      left: 0 // Marges gérées par le CSS (12mm top/bottom, 15mm left/right)
    }
  });

  await browser.close();

  const stats = await fs.stat(outputPath);
  const sizeMB = (stats.size / (1024 * 1024)).toFixed(2);

  console.log('PDF généré avec succès!');
  console.log(`   Fichier: ${outputPath}`);
  console.log(`   Taille: ${sizeMB} MB`);
  console.log(`   Format: A4 Portrait`);
  console.log('\nDossier de stage prêt à imprimer!');
}

exportDossierStageToPDF().catch(console.error);
