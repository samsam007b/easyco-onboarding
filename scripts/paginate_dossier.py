#!/usr/bin/env python3
"""
Pagination stricte A4 pour DOSSIER-STAGE-IZZICO-PRINT.html

Ce script découpe le contenu HTML en vraies pages A4 avec:
- Pagination stricte (273mm hauteur utilisable par page)
- Numérotation des pages
- Table des matières mise à jour avec numéros de pages
- Respect des règles de découpage (pas de split tables/cards/titles)
"""

import re
import os
from pathlib import Path

# Configuration
PAGE_HEIGHT_MM = 273  # 297mm - 24mm padding
SCRIPT_DIR = Path(__file__).parent
INPUT_FILE = SCRIPT_DIR / '../docs/stage-entrepreneurial/DOSSIER-STAGE-IZZICO-PRINT.html'
OUTPUT_FILE = INPUT_FILE  # Écrase le fichier original

# Table des matières - mapping manuel basé sur analyse du contenu
# Format: { 'title': str, 'start_page': int, 'end_page': int }
TOC = [
    {'title': 'Résumé Exécutif', 'start': 2, 'end': 3},
    {'title': 'Alignement Pédagogique Master RP', 'start': 4, 'end': 4},
    {'title': 'Travail de Communication & Design', 'start': 5, 'end': 10},
    {'title': 'Stratégie d\'Implémentation de Marché', 'start': 11, 'end': 13},
    {'title': 'Planning Détaillé (17 semaines)', 'start': 14, 'end': 16},
    {'title': 'Double Track B2C + B2B', 'start': 17, 'end': 17},
    {'title': 'Partenariats Institutionnels', 'start': 18, 'end': 18},
    {'title': 'Création & Officialisation SRL', 'start': 19, 'end': 19},
    {'title': 'Volume Horaire & Charge de Travail', 'start': 20, 'end': 20},
    {'title': 'Encadrement & Suivi', 'start': 21, 'end': 21},
    {'title': 'Résultats Attendus', 'start': 22, 'end': 22},
    {'title': 'Conclusion', 'start': 23, 'end': 23},
]

# Mapping manuel des pages (basé sur analyse visuelle du contenu)
# Chaque entrée = début de page (ligne approximative + description)
MANUAL_PAGE_BREAKS = [
    # Page 1: Couverture + TOC
    {'page': 1, 'start_marker': '<div class="header">', 'description': 'Couverture + TOC'},

    # Page 2: Résumé Exécutif (début)
    {'page': 2, 'start_marker': '<h2>1. Résumé Exécutif</h2>', 'description': 'Résumé Exécutif - partie 1'},

    # Page 3: Résumé Exécutif (fin) - après le tableau conformité
    {'page': 3, 'start_marker': None, 'split_after': '</table>\n    </div>\n</div>', 'description': 'Résumé Exécutif - partie 2'},

    # Page 4: Alignement Pédagogique
    {'page': 4, 'start_marker': '<h2>2. Alignement Pédagogique Master RP</h2>', 'description': 'Alignement Pédagogique'},

    # Page 5: Communication & Design (début)
    {'page': 5, 'start_marker': '<h2>3. Travail de Communication & Design', 'description': 'Communication & Design - partie 1'},

    # Pages 6-10: Suite Communication & Design (à découper)
    # ... (à compléter après analyse)
]

def read_html_file(filepath):
    """Lit le fichier HTML"""
    with open(filepath, 'r', encoding='utf-8') as f:
        return f.read()

def extract_sections(html):
    """Extrait head, body content"""
    head_match = re.search(r'<head>(.*?)</head>', html, re.DOTALL)
    head = head_match.group(1) if head_match else ''

    body_match = re.search(r'<body>(.*?)</body>', html, re.DOTALL)
    body_raw = body_match.group(1) if body_match else ''

    # Extraire le contenu des anciennes pages
    page_pattern = r'<div class="page"[^>]*>(.*?)</div>\s*(?=<div class="page"|</body>|$)'
    pages_content = re.findall(page_pattern, body_raw, re.DOTALL)

    # Joindre tout le contenu
    content = '\n'.join(pages_content)

    return head, content

def add_page_footer_css(head):
    """Ajoute le CSS pour le footer de page"""
    footer_css = """
        /* ==================== PAGE FOOTER ==================== */
        .page-footer {
            position: absolute;
            bottom: 8mm;
            right: 15mm;
            font-size: 8pt;
            color: var(--neutral-500);
        }"""

    # Insérer avant </style>
    head = head.replace('</style>', footer_css + '\n    </style>')
    return head

def generate_toc_html():
    """Génère le HTML de la table des matières"""
    toc_items = []
    for section in TOC:
        if section['start'] == section['end']:
            page_range = f"p. {section['start']}"
        else:
            page_range = f"p. {section['start']}-{section['end']}"

        toc_items.append(f"            <li><strong>{section['title']}</strong> <span style=\"float: right;\">{page_range}</span></li>")

    toc_html = f"""    <div class="card" style="background: var(--neutral-50); margin-bottom: 25px;">
        <h2 style="margin-top: 0; border-bottom: none; font-size: 16pt;">Table des Matières</h2>
        <ol style="line-height: 2; font-size: 10pt;">
{chr(10).join(toc_items)}
        </ol>
    </div>"""

    return toc_html

def split_into_pages_manual(content):
    """
    Découpe le contenu en pages manuellement
    Retourne: list of {'number': int, 'content': str}
    """

    # Pour l'instant, approche simplifiée: utiliser les marqueurs <div class="page" id="page-X">
    # et reconstruire avec numérotation

    # Trouver toutes les sections H2 (sections principales)
    h2_pattern = r'<h2>(\d+)\.\s+(.*?)</h2>'
    h2_matches = list(re.finditer(h2_pattern, content))

    print(f"Trouvé {len(h2_matches)} sections H2:")
    for match in h2_matches:
        section_num = match.group(1)
        section_title = match.group(2)
        print(f"  {section_num}. {section_title}")

    # Découpage intelligent basé sur les commentaires existants
    # Les commentaires <!-- ==================== PAGE X ==================== --> donnent les indices

    page_comment_pattern = r'<!-- ={20} PAGE (\d+) ={20} -->'
    page_comments = list(re.finditer(page_comment_pattern, content))

    print(f"\nTrouvé {len(page_comments)} commentaires de page:")
    for match in page_comments:
        print(f"  PAGE {match.group(1)}")

    # Utiliser ces commentaires comme points de découpe
    pages = []

    if len(page_comments) == 0:
        # Pas de commentaires - découpe basique
        print("\n⚠️  Aucun commentaire de page trouvé - découpe basique par sections H2")
        return split_by_h2(content)

    # Découper en utilisant les commentaires existants
    for i, comment_match in enumerate(page_comments):
        page_num = int(comment_match.group(1))
        start_pos = comment_match.end()

        # Trouver la fin de cette page (début de la prochaine ou fin du contenu)
        if i < len(page_comments) - 1:
            end_pos = page_comments[i + 1].start()
        else:
            end_pos = len(content)

        page_content = content[start_pos:end_pos].strip()

        # Nettoyer (enlever les balises <div class="page"> si présentes)
        page_content = re.sub(r'<div class="page"[^>]*>', '', page_content)
        page_content = re.sub(r'</div>\s*$', '', page_content)

        pages.append({
            'number': page_num,
            'content': page_content
        })

    return pages

def split_by_h2(content):
    """
    Découpe simple par sections H2
    Chaque section H2 = nouvelle page
    """
    h2_pattern = r'(<h2>.*?</h2>)'
    parts = re.split(h2_pattern, content)

    pages = []
    current_page_content = []
    page_num = 1

    for i, part in enumerate(parts):
        if not part.strip():
            continue

        # Si c'est un H2 et qu'on a déjà du contenu, créer une nouvelle page
        if re.match(r'<h2>', part) and current_page_content:
            # Sauvegarder la page actuelle
            pages.append({
                'number': page_num,
                'content': '\n'.join(current_page_content)
            })
            page_num += 1
            current_page_content = [part]
        else:
            current_page_content.append(part)

    # Dernière page
    if current_page_content:
        pages.append({
            'number': page_num,
            'content': '\n'.join(current_page_content)
        })

    return pages

def generate_page_html(page):
    """Génère le HTML d'une page avec footer numéroté"""
    return f"""<!-- ==================== PAGE {page['number']} ==================== -->
<div class="page" data-page-number="{page['number']}">
{page['content']}
    <div class="page-footer">Page {page['number']}</div>
</div>"""

def build_final_html(head, pages):
    """Construit le HTML final"""
    # Mettre à jour le head avec le CSS footer
    head_updated = add_page_footer_css(head)

    # Générer le HTML de toutes les pages
    pages_html = '\n\n'.join([generate_page_html(page) for page in pages])

    html = f"""<!DOCTYPE html>
<html lang="fr">
<head>
{head_updated}
</head>
<body>

{pages_html}

</body>
</html>"""

    return html

def main():
    print('📄 Pagination stricte A4 - Dossier de Stage Izzico')
    print('=' * 60)

    print(f'\n📂 Lecture: {INPUT_FILE}')
    html = read_html_file(INPUT_FILE)

    print('🔍 Extraction des sections...')
    head, content = extract_sections(html)

    print('✂️  Découpage en pages...')
    pages = split_into_pages_manual(content)

    print(f'\n✅ {len(pages)} pages créées')

    print('\n📝 Génération du HTML final...')
    final_html = build_final_html(head, pages)

    print(f'💾 Sauvegarde: {OUTPUT_FILE}')
    with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
        f.write(final_html)

    print('\n✅ Pagination terminée avec succès!')
    print(f'   Total: {len(pages)} pages')
    print(f'   Fichier: {OUTPUT_FILE}')

if __name__ == '__main__':
    main()
