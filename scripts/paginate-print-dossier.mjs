#!/usr/bin/env node

import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const inputPath = join(__dirname, '../docs/stage-entrepreneurial/DOSSIER-STAGE-IZZICO-PRINT-BACKUP.html');
const outputPath = join(__dirname, '../docs/stage-entrepreneurial/DOSSIER-STAGE-IZZICO-PRINT.html');

console.log('Reading original file...');
const originalHtml = readFileSync(inputPath, 'utf-8');

console.log('Processing HTML...');

// Extract head section
const headMatch = originalHtml.match(/<head>([\s\S]*?)<\/head>/);
if (!headMatch) {
  console.error('Could not find <head> section');
  process.exit(1);
}

let headContent = headMatch[1];

// Extract body content (everything between <body> and </body>)
const bodyMatch = originalHtml.match(/<body>([\s\S]*?)<\/body>/);
if (!bodyMatch) {
  console.error('Could not find <body> section');
  process.exit(1);
}

const bodyContent = bodyMatch[1];

// Update CSS in head to optimize for print-ready A4 pages
const updatedHead = headContent
  // Reduce body font size from 11pt to 9pt
  .replace(/font-size:\s*11pt;/g, 'font-size: 9pt;')
  // Reduce h1 from 24pt to 20pt
  .replace(/(h1\s*{[^}]*?font-size:\s*)24pt/g, '$120pt')
  .replace(/(h1\s*{[^}]*?font-size:\s*)28pt/g, '$122pt')
  // Reduce h2 from 18pt to 15pt
  .replace(/(h2\s*{[^}]*?font-size:\s*)18pt/g, '$115pt')
  .replace(/(h2\s*{[^}]*?font-size:\s*)16pt/g, '$114pt')
  // Reduce h3 from 14pt to 12pt
  .replace(/(h3\s*{[^}]*?font-size:\s*)14pt/g, '$112pt')
  .replace(/(h3\s*{[^}]*?font-size:\s*)12pt/g, '$110pt')
  // Reduce h4 from 12pt to 10pt
  .replace(/(h4\s*{[^}]*?font-size:\s*)12pt/g, '$110pt')
  // Reduce tables from 10pt to 8.5pt
  .replace(/(table\s*{[^}]*?font-size:\s*)10pt/g, '$18.5pt')
  .replace(/(thead th\s*{[^}]*?font-size:\s*)10pt/g, '$18.5pt')
  // Reduce line-height from 1.6 to 1.5
  .replace(/line-height:\s*1\.6;/g, 'line-height: 1.5;')
  // Reduce margins
  .replace(/margin:\s*20px\s+0;/g, 'margin: 12px 0;')
  .replace(/margin:\s*15px\s+0;/g, 'margin: 10px 0;')
  .replace(/padding:\s*15px;/g, 'padding: 10px;')
  .replace(/padding:\s*20px;/g, 'padding: 12px;')
  // Reduce logo size
  .replace(/(\.logo\s*{[^}]*?width:\s*)180px/g, '$1140px')
  .replace(/(\.logo\s*{[^}]*?margin-bottom:\s*)15px/g, '$110px')
  // Reduce stat-value font
  .replace(/(\.stat-value\s*{[^}]*?font-size:\s*)24pt/g, '$118pt')
  // Update body styles for page system
  .replace(
    /body\s*{([^}]*?)}/,
    `body {
            font-family: var(--font-body);
            font-size: 9pt;
            line-height: 1.5;
            color: var(--neutral-900);
            background: #f0f0f0;
        }`
  );

// Add page system CSS
const pageSystemCSS = `
        /* ==================== PAGE SYSTEM ==================== */
        .page {
            width: 210mm;
            min-height: 297mm;
            padding: 12mm 15mm;
            margin: 10mm auto;
            background: white;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            position: relative;
            page-break-after: always;
        }

        @media print {
            body {
                background: white;
            }
            .page {
                margin: 0;
                box-shadow: none;
                page-break-after: always;
            }
        }

`;

// Insert page system CSS after base styles
const baseStylesEnd = updatedHead.indexOf('/* ==================== TYPOGRAPHY ==================== */');
const finalHead = updatedHead.slice(0, baseStylesEnd) + pageSystemCSS + updatedHead.slice(baseStylesEnd);

// Split body content into logical page breaks
// Strategy: Look for <div class="page-break"></div> and major section headers
const sections = [];
let currentSection = '';
const lines = bodyContent.split('\n');

for (const line of lines) {
  if (line.includes('class="page-break"') || line.includes('<!-- ==================== PAGE BREAK ==================== -->')) {
    if (currentSection.trim()) {
      sections.push(currentSection);
      currentSection = '';
    }
  } else {
    currentSection += line + '\n';
  }
}

// Add remaining content
if (currentSection.trim()) {
  sections.push(currentSection);
}

// Wrap each section in a .page div
const paginatedBody = sections.map((section, index) => {
  return `
<!-- ==================== PAGE ${index + 1} ==================== -->
<div class="page" id="page-${index + 1}">
${section.trim()}
</div>
`;
}).join('\n');

// Build final HTML
const finalHtml = `<!DOCTYPE html>
<html lang="fr">
<head>
${finalHead}
</head>
<body>
${paginatedBody}
</body>
</html>
`;

console.log(`Writing paginated HTML with ${sections.length} pages...`);
writeFileSync(outputPath, finalHtml, 'utf-8');

console.log(`✅ Done! Created ${sections.length} pages.`);
console.log(`📄 Output: ${outputPath}`);
