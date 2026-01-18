#!/usr/bin/env node
/**
 * Pagination stricte A4 du dossier de stage
 * Approche manuelle et précise basée sur analyse visuelle
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const INPUT_FILE = path.join(__dirname, '../docs/stage-entrepreneurial/DOSSIER-STAGE-IZZICO-PRINT.html');

console.log('📄 Lecture du fichier HTML...');
const html = fs.readFileSync(INPUT_FILE, 'utf-8');

// Extraire head et styles
const headMatch = html.match(/<head>([\s\S]*?)<\/head>/);
const head = headMatch ? headMatch[1] : '';

// Extraire body content (sans les balises .page existantes)
const bodyMatch = html.match(/<body>([\s\S]*?)<\/body>/);
let bodyContent = bodyMatch ? bodyMatch[1] : '';

// Supprimer les anciennes pages et extraire le contenu brut
const oldPages = [...bodyContent.matchAll(/<div class="page"[^>]*>([\s\S]*?)<\/div>\s*(?=<div class="page"|<\/body>|$)/g)];
const rawContent = oldPages.map(match => match[1]).join('\n');

console.log('✂️  Découpage manuel en pages A4...');

// Définir manuellement les pages basé sur l'analyse du contenu
// Chaque page = objet { content: string, number: number }

const pages = [];

// === PAGE 1: Couverture + Table des matières ===
pages.push({
  number: 1,
  title: "Page de couverture",
  sections: [],
  content: `<!-- ==================== HEADER ==================== -->
    <div class="header">
        <img src="../../brand-identity/logo final izzico/dérnière versions lock- LOGO FINAL/gradient signature/izzico-lockup-optionD-squircle-epais-gradient.svg"
             alt="Izzico Logo"
             class="logo">
        <h1>Dossier de Stage Entrepreneurial</h1>
        <p class="subtitle">Plateforme de Co-living par Compatibilité Humaine</p>
    </div>

    <!-- ==================== META INFO ==================== -->
    <div class="meta-info">
        <div class="meta-item">
            <strong>Étudiant</strong>
            Samuel BAUDON<br>
            Master 1 RP & Affaires Publiques (IHECS)
        </div>
        <div class="meta-item">
            <strong>Tuteur</strong>
            Alain WIRTZ<br>
            Ancien CEO Zetes, Investisseur
        </div>
        <div class="meta-item">
            <strong>Période</strong>
            3 février - 30 mai 2025<br>
            17 semaines (4 mois)
        </div>
        <div class="meta-item">
            <strong>Volume horaire</strong>
            646 heures totales<br>
            <small>Recommandé IHECS : 420h</small>
        </div>
    </div>

    <!-- ==================== CONFIDENTIALITÉ ==================== -->
    <div class="confidential-notice">
        <h3>Document Confidentiel</h3>
        <p><strong>Ce dossier contient des informations stratégiques et commerciales confidentielles.</strong></p>
        <p>Il est destiné exclusivement à l'usage de la Directrice de Section de l'IHECS dans le cadre de l'évaluation de la demande de stage entrepreneurial.</p>
        <p>La marque <strong>Izzico</strong> n'est pas encore publiquement lancée. La stratégie d'implémentation de marché, les analyses concurrentielles, et les détails opérationnels contenus dans ce document sont <strong>confidentiels et propriétaires</strong>.</p>
        <p style="margin-top: 10px; font-weight: 600;">Merci de traiter ce document avec la discrétion appropriée et de ne pas le diffuser sans autorisation préalable.</p>
    </div>

    <!-- ==================== TABLE DES MATIÈRES ==================== -->
    <div class="card" style="background: var(--neutral-50); margin-bottom: 25px;">
        <h2 style="margin-top: 0; border-bottom: none; font-size: 16pt;">Table des Matières</h2>
        <ol style="line-height: 2; font-size: 10pt;">
            <li><strong>Résumé Exécutif</strong> <span style="float: right;">p. 2-3</span></li>
            <li><strong>Alignement Pédagogique Master RP</strong> <span style="float: right;">p. 4</span></li>
            <li><strong>Travail de Communication & Design</strong> <span style="float: right;">p. 5-10</span></li>
            <li><strong>Stratégie d'Implémentation de Marché</strong> <span style="float: right;">p. 11-13</span></li>
            <li><strong>Planning Détaillé (17 semaines)</strong> <span style="float: right;">p. 14-16</span></li>
            <li><strong>Double Track B2C + B2B</strong> <span style="float: right;">p. 17</span></li>
            <li><strong>Partenariats Institutionnels</strong> <span style="float: right;">p. 18</span></li>
            <li><strong>Création & Officialisation SRL</strong> <span style="float: right;">p. 19</span></li>
            <li><strong>Volume Horaire & Charge de Travail</strong> <span style="float: right;">p. 20</span></li>
            <li><strong>Encadrement & Suivi</strong> <span style="float: right;">p. 21</span></li>
            <li><strong>Résultats Attendus</strong> <span style="float: right;">p. 22</span></li>
            <li><strong>Conclusion</strong> <span style="float: right;">p. 23</span></li>
        </ol>
    </div>`
});

// J'ai besoin de lire plus de contenu pour faire le découpage précis
// Créer une version temporaire qui lit le fichier ligne par ligne
console.log('⚠️  Script incomplet - passage à une approche Python...');

// Cette approche JavaScript est trop complexe pour un fichier de 2500 lignes
// Je vais créer un script Python qui utilise BeautifulSoup pour parser le HTML proprement

console.log(' Annulation - création d un script Python plus robuste');
process.exit(1);
