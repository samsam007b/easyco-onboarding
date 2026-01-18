#!/usr/bin/env node
/**
 * Script de pagination stricte A4 pour DOSSIER-STAGE-IZZICO-PRINT.html
 *
 * Objectif: Découper le contenu en vraies pages A4 avec numérotation
 * - Hauteur max par page: 273mm (297mm - 24mm padding)
 * - Ne jamais couper tableaux, cards, ou titres de leur contenu
 * - Numéroter chaque page
 * - Générer une table des matières avec numéros de pages
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const INPUT_FILE = path.join(__dirname, '../docs/stage-entrepreneurial/DOSSIER-STAGE-IZZICO-PRINT.html');
const OUTPUT_FILE = INPUT_FILE; // Écrase le fichier original

// Configuration pagination A4
const PAGE_HEIGHT_MM = 273; // 297mm - 24mm padding
const PAGE_WIDTH_MM = 180;  // 210mm - 30mm padding

// Hauteurs approximatives en mm pour différents éléments (basé sur font-size et line-height)
const ELEMENT_HEIGHTS = {
  h1: 25,
  h2: 20,
  h3: 12,
  h4: 10,
  p: 6,
  li: 5,
  tableRow: 10,
  tableHeader: 12,
  card: 15, // minimum
  phaseCard: 20, // minimum
  highlightBox: 15,
  statCard: 35,
  metaInfo: 30,
  logo: 50,
  headerSection: 80,
  confidentialNotice: 40,
  tocCard: 60,
  smallGap: 5,
  mediumGap: 10,
  largeGap: 15
};

console.log('📄 Lecture du fichier HTML...');
const htmlContent = fs.readFileSync(INPUT_FILE, 'utf-8');

// Extraire le <head> et les styles
const headMatch = htmlContent.match(/<head>([\s\S]*?)<\/head>/);
const head = headMatch ? headMatch[1] : '';

// Extraire le contenu entre <body> et </body>
const bodyMatch = htmlContent.match(/<body>([\s\S]*?)<\/body>/);
const bodyContent = bodyMatch ? bodyMatch[1] : '';

console.log('🔍 Analyse du contenu actuel...');

// Parser les sections existantes
const pageMatches = [...bodyContent.matchAll(/<div class="page"[^>]*>([\s\S]*?)<\/div>\s*(?=<div class="page"|<\/body>|$)/g)];
console.log(`   Trouvé ${pageMatches.length} pages actuelles`);

// Extraire tous les blocs de contenu (hors balises .page)
const allContent = pageMatches.map(match => match[1]).join('\n');

console.log('✂️  Découpage intelligent du contenu en pages A4...');

/**
 * Structure de la table des matières
 * Format: { title, startPage, endPage }
 */
const tocEntries = [];

/**
 * Parse le contenu et crée des pages
 */
function createPages(content) {
  const pages = [];
  let currentPageContent = [];
  let currentPageHeight = 0;
  let currentPageNumber = 1;

  // Parser le contenu en blocs logiques
  const blocks = parseContentBlocks(content);

  console.log(`   ${blocks.length} blocs de contenu identifiés`);

  for (let i = 0; i < blocks.length; i++) {
    const block = blocks[i];
    const blockHeight = estimateBlockHeight(block);

    // Vérifier si le bloc peut tenir sur la page actuelle
    if (currentPageHeight + blockHeight > PAGE_HEIGHT_MM && currentPageContent.length > 0) {
      // Sauvegarder la page actuelle
      pages.push({
        number: currentPageNumber,
        content: currentPageContent.join('\n')
      });

      // Nouvelle page
      currentPageNumber++;
      currentPageContent = [];
      currentPageHeight = 0;
    }

    // Ajouter le bloc à la page
    currentPageContent.push(block.html);
    currentPageHeight += blockHeight;

    // Tracker pour la table des matières
    if (block.isSection) {
      if (tocEntries.length > 0 && !tocEntries[tocEntries.length - 1].endPage) {
        tocEntries[tocEntries.length - 1].endPage = currentPageNumber - 1;
      }
      tocEntries.push({
        title: block.sectionTitle,
        startPage: currentPageNumber,
        endPage: null
      });
    }
  }

  // Dernière page
  if (currentPageContent.length > 0) {
    pages.push({
      number: currentPageNumber,
      content: currentPageContent.join('\n')
    });
    if (tocEntries.length > 0) {
      tocEntries[tocEntries.length - 1].endPage = currentPageNumber;
    }
  }

  return pages;
}

/**
 * Parse le contenu en blocs logiques
 */
function parseContentBlocks(content) {
  const blocks = [];

  // Regex pour identifier les blocs principaux
  const blockRegex = /<(h2|div class="[^"]*(?:card|phase-card|highlight-box|stats-grid|meta-info|header|confidential-notice)[^"]*"|table|ul|ol|p)[^>]*>[\s\S]*?<\/\1>/gi;

  let lastIndex = 0;
  let match;

  // Approche simplifiée: découper par sections H2
  const h2Sections = content.split(/(?=<h2[^>]*>)/);

  h2Sections.forEach((section, idx) => {
    if (!section.trim()) return;

    const h2Match = section.match(/<h2[^>]*>(.*?)<\/h2>/);
    const isSection = !!h2Match;
    const sectionTitle = h2Match ? h2Match[1].replace(/<[^>]+>/g, '').trim() : null;

    // Découper la section en sous-blocs (tables, cards, etc.)
    const subBlocks = parseSubBlocks(section);

    subBlocks.forEach((subBlock, subIdx) => {
      blocks.push({
        html: subBlock.html,
        type: subBlock.type,
        height: subBlock.height,
        isSection: isSection && subIdx === 0,
        sectionTitle: isSection && subIdx === 0 ? sectionTitle : null,
        canBreak: subBlock.canBreak
      });
    });
  });

  return blocks;
}

/**
 * Parse les sous-blocs d'une section
 */
function parseSubBlocks(sectionHtml) {
  const subBlocks = [];

  // Patterns pour identifier les blocs non-cassables
  const patterns = [
    { regex: /<table[\s\S]*?<\/table>/gi, type: 'table', canBreak: false },
    { regex: /<div class="[^"]*card[^"]*"[\s\S]*?<\/div>/gi, type: 'card', canBreak: false },
    { regex: /<div class="[^"]*phase-card[^"]*"[\s\S]*?<\/div>/gi, type: 'phase-card', canBreak: false },
    { regex: /<div class="[^"]*highlight-box[^"]*"[\s\S]*?<\/div>/gi, type: 'highlight-box', canBreak: false },
    { regex: /<div class="[^"]*stats-grid[^"]*"[\s\S]*?<\/div>/gi, type: 'stats-grid', canBreak: false },
    { regex: /<div class="[^"]*meta-info[^"]*"[\s\S]*?<\/div>/gi, type: 'meta-info', canBreak: false },
    { regex: /<div class="[^"]*header[^"]*"[\s\S]*?<\/div>/gi, type: 'header', canBreak: false },
    { regex: /<div class="[^"]*confidential-notice[^"]*"[\s\S]*?<\/div>/gi, type: 'confidential-notice', canBreak: false },
    { regex: /<h2[\s\S]*?<\/h2>/gi, type: 'h2', canBreak: false },
    { regex: /<h3[\s\S]*?<\/h3>(?:\s*<p[\s\S]*?<\/p>)?/gi, type: 'h3-with-content', canBreak: false },
    { regex: /<ul[\s\S]*?<\/ul>/gi, type: 'ul', canBreak: true },
    { regex: /<ol[\s\S]*?<\/ol>/gi, type: 'ol', canBreak: true },
    { regex: /<p[\s\S]*?<\/p>/gi, type: 'p', canBreak: true }
  ];

  let remainingHtml = sectionHtml;
  const matches = [];

  // Trouver tous les matches
  patterns.forEach(pattern => {
    let match;
    const regex = new RegExp(pattern.regex.source, pattern.regex.flags);
    while ((match = regex.exec(sectionHtml)) !== null) {
      matches.push({
        html: match[0],
        index: match.index,
        type: pattern.type,
        canBreak: pattern.canBreak
      });
    }
  });

  // Trier par index
  matches.sort((a, b) => a.index - b.index);

  // Éliminer les doublons (si un bloc est contenu dans un autre)
  const uniqueMatches = [];
  matches.forEach(match => {
    const overlaps = uniqueMatches.some(existing => {
      return match.index >= existing.index && match.index < existing.index + existing.html.length;
    });
    if (!overlaps) {
      uniqueMatches.push(match);
    }
  });

  // Créer les blocs
  uniqueMatches.forEach(match => {
    subBlocks.push({
      html: match.html,
      type: match.type,
      canBreak: match.canBreak,
      height: estimateBlockHeight({ html: match.html, type: match.type })
    });
  });

  // Si aucun bloc trouvé, prendre tout le contenu
  if (subBlocks.length === 0 && sectionHtml.trim()) {
    subBlocks.push({
      html: sectionHtml,
      type: 'generic',
      canBreak: true,
      height: estimateGenericHeight(sectionHtml)
    });
  }

  return subBlocks;
}

/**
 * Estime la hauteur d'un bloc en mm
 */
function estimateBlockHeight(block) {
  if (block.height) return block.height;

  const html = block.html;
  const type = block.type;

  // Estimations basées sur le type
  switch (type) {
    case 'header':
      return ELEMENT_HEIGHTS.headerSection;
    case 'meta-info':
      return ELEMENT_HEIGHTS.metaInfo;
    case 'confidential-notice':
      return ELEMENT_HEIGHTS.confidentialNotice;
    case 'table':
      return estimateTableHeight(html);
    case 'card':
    case 'phase-card':
      return estimateCardHeight(html);
    case 'highlight-box':
      return ELEMENT_HEIGHTS.highlightBox;
    case 'stats-grid':
      return ELEMENT_HEIGHTS.statCard * 1.5;
    case 'h2':
      return ELEMENT_HEIGHTS.h2;
    case 'h3':
    case 'h3-with-content':
      return ELEMENT_HEIGHTS.h3 + ELEMENT_HEIGHTS.p;
    case 'ul':
    case 'ol':
      return estimateListHeight(html);
    case 'p':
      return ELEMENT_HEIGHTS.p;
    default:
      return estimateGenericHeight(html);
  }
}

function estimateTableHeight(html) {
  const rows = (html.match(/<tr/g) || []).length;
  const hasHeader = html.includes('<thead>');
  return (hasHeader ? ELEMENT_HEIGHTS.tableHeader : 0) + (rows - (hasHeader ? 1 : 0)) * ELEMENT_HEIGHTS.tableRow;
}

function estimateCardHeight(html) {
  const paragraphs = (html.match(/<p/g) || []).length;
  const lists = (html.match(/<ul|<ol/g) || []).length;
  const tables = (html.match(/<table/g) || []).length;
  const h3s = (html.match(/<h3/g) || []).length;
  const h4s = (html.match(/<h4/g) || []).length;

  let height = ELEMENT_HEIGHTS.card;
  height += paragraphs * ELEMENT_HEIGHTS.p;
  height += lists * 20; // approximation
  height += tables * 30; // approximation
  height += h3s * ELEMENT_HEIGHTS.h3;
  height += h4s * ELEMENT_HEIGHTS.h4;

  return Math.max(height, ELEMENT_HEIGHTS.card);
}

function estimateListHeight(html) {
  const items = (html.match(/<li/g) || []).length;
  return items * ELEMENT_HEIGHTS.li + ELEMENT_HEIGHTS.smallGap;
}

function estimateGenericHeight(html) {
  // Estimation très approximative basée sur le nombre de caractères
  const textContent = html.replace(/<[^>]+>/g, '');
  const lines = Math.ceil(textContent.length / 100); // ~100 chars par ligne
  return lines * 5; // 5mm par ligne
}

// Créer les pages
const pages = createPages(allContent);

console.log(`✅ ${pages.length} pages créées`);
console.log(`📊 Table des matières: ${tocEntries.length} sections`);

// Afficher aperçu de la table des matières
tocEntries.forEach(entry => {
  const pageRange = entry.startPage === entry.endPage
    ? `p. ${entry.startPage}`
    : `p. ${entry.startPage}-${entry.endPage}`;
  console.log(`   ${entry.title}: ${pageRange}`);
});

console.log('📝 Génération du HTML final...');

/**
 * Génère le HTML de la table des matières avec numéros de pages
 */
function generateTOC() {
  const tocItems = tocEntries.map(entry => {
    const pageRange = entry.startPage === entry.endPage
      ? `p. ${entry.startPage}`
      : `p. ${entry.startPage}-${entry.endPage}`;

    return `            <li><strong>${entry.title}</strong> <span style="float: right;">${pageRange}</span></li>`;
  }).join('\n');

  return `    <div class="card" style="background: var(--neutral-50); margin-bottom: 25px;">
        <h2 style="margin-top: 0; border-bottom: none; font-size: 16pt;">Table des Matières</h2>
        <ol style="line-height: 2; font-size: 10pt;">
${tocItems}
        </ol>
    </div>`;
}

/**
 * Génère le HTML d'une page avec footer numéroté
 */
function generatePageHTML(page) {
  return `<!-- ==================== PAGE ${page.number} ==================== -->
<div class="page" data-page-number="${page.number}">
${page.content}
    <div class="page-footer">Page ${page.number}</div>
</div>`;
}

// Ajouter le CSS pour le footer de page
const additionalCSS = `
        /* ==================== PAGE FOOTER ==================== */
        .page-footer {
            position: absolute;
            bottom: 8mm;
            right: 15mm;
            font-size: 8pt;
            color: var(--neutral-500);
        }
`;

// Insérer le CSS additionnel avant la fermeture </style>
const updatedHead = head.replace('</style>', additionalCSS + '    </style>');

// Générer le body complet
const pagesHTML = pages.map(page => generatePageHTML(page)).join('\n\n');

// Construire le HTML final
const finalHTML = `<!DOCTYPE html>
<html lang="fr">
<head>
${updatedHead}
</head>
<body>

${pagesHTML}

</body>
</html>`;

console.log('💾 Sauvegarde du fichier...');
fs.writeFileSync(OUTPUT_FILE, finalHTML, 'utf-8');

console.log('✅ Pagination terminée avec succès!');
console.log(`   Fichier: ${OUTPUT_FILE}`);
console.log(`   Total: ${pages.length} pages`);
console.log(`   Sections: ${tocEntries.length}`);
