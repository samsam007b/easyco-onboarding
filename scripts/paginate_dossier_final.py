#!/usr/bin/env python3
"""
Pagination stricte A4 pour DOSSIER-STAGE-IZZICO-PRINT.html - VERSION FINALE

Découpage intelligent en vraies pages A4:
- Page 1: Couverture + TOC
- Pages 2+: Contenu avec découpage intelligent
- Numérotation automatique
- TOC mise à jour avec numéros de pages réels
"""

import re
import os
from pathlib import Path
from collections import defaultdict

# Configuration
SCRIPT_DIR = Path(__file__).parent
INPUT_FILE = SCRIPT_DIR / '../docs/stage-entrepreneurial/DOSSIER-STAGE-IZZICO-PRINT.html'
OUTPUT_FILE = INPUT_FILE

def read_file(filepath):
    """Lit le fichier HTML"""
    with open(filepath, 'r', encoding='utf-8') as f:
        return f.read()

def extract_head_and_content(html):
    """Extrait head et body content"""
    head_match = re.search(r'<head>(.*?)</head>', html, re.DOTALL)
    head = head_match.group(1) if head_match else ''

    body_match = re.search(r'<body>(.*?)</body>', html, re.DOTALL)
    body_raw = body_match.group(1) if body_match else ''

    # Extraire contenu des pages existantes
    page_pattern = r'<!-- ={20} PAGE \d+ ={20} -->\s*<div class="page"[^>]*>(.*?)</div>'
    pages_content = re.findall(page_pattern, body_raw, re.DOTALL)

    # Si pas de pages avec commentaires, essayer sans commentaires
    if not pages_content:
        page_pattern = r'<div class="page"[^>]*>(.*?)</div>\s*(?=<div class="page"|</body>|$)'
        pages_content = re.findall(page_pattern, body_raw, re.DOTALL)

    # Joindre tout le contenu
    content = '\n\n'.join(pages_content)

    # Supprimer les footers de page existants
    content = re.sub(r'\s*<div class="page-footer">.*?</div>', '', content)

    return head, content

def ensure_footer_css(head):
    """Ajoute ou vérifie le CSS footer"""
    if '.page-footer' not in head:
        footer_css = """
        /* ==================== PAGE FOOTER ==================== */
        .page-footer {
            position: absolute;
            bottom: 8mm;
            right: 15mm;
            font-size: 8pt;
            color: var(--neutral-500);
        }"""
        head = head.replace('</style>', footer_css + '\n    </style>')
    return head

def find_h2_sections(content):
    """Trouve toutes les sections H2 avec leurs positions"""
    h2_pattern = r'<h2>(\d+)\.\s+(.*?)</h2>'
    matches = list(re.finditer(h2_pattern, content))

    sections = []
    for match in matches:
        sections.append({
            'number': match.group(1),
            'title': match.group(2),
            'start_pos': match.start(),
            'full_title': match.group(0)
        })

    return sections

def intelligent_split(content):
    """
    Découpe intelligent du contenu en pages A4

    Règles:
    1. Page 1 = tout jusqu'à la fin de la TOC
    2. Chaque section H2 commence idéalement sur une nouvelle page
    3. Si une section est trop longue, la découper intelligemment
    4. Ne jamais couper tables, cards, phase-cards
    """

    pages = []

    # === PAGE 1: Couverture + TOC ===
    # Trouver la fin de la TOC
    toc_end_pattern = r'</ol>\s*</div>\s*(?=<!-- ====|<h2)'
    toc_end_match = re.search(toc_end_pattern, content)

    if toc_end_match:
        page1_content = content[:toc_end_match.end()].strip()
        remaining_content = content[toc_end_match.end():].strip()
    else:
        # Fallback: découper avant le premier H2
        first_h2 = re.search(r'<h2>', content)
        if first_h2:
            page1_content = content[:first_h2.start()].strip()
            remaining_content = content[first_h2.start():].strip()
        else:
            page1_content = content
            remaining_content = ''

    pages.append({
        'number': 1,
        'content': page1_content,
        'sections': []
    })

    if not remaining_content:
        return pages

    # === PAGES 2+: Découper par sections H2 ===
    sections = find_h2_sections(remaining_content)

    print(f"\n📋 Sections H2 trouvées: {len(sections)}")
    for section in sections:
        print(f"   {section['number']}. {section['title']}")

    # Découper le contenu section par section
    current_page_num = 2
    section_to_page = {}  # {section_title: [start_page, end_page]}

    for i, section in enumerate(sections):
        section_start = section['start_pos']

        # Trouver la fin de cette section (début de la section suivante ou fin du contenu)
        if i < len(sections) - 1:
            section_end = sections[i + 1]['start_pos']
        else:
            section_end = len(remaining_content)

        section_content = remaining_content[section_start:section_end].strip()
        section_title = section['title']

        # Découper cette section si elle est très longue
        section_pages = split_large_section(section_content)

        # Enregistrer les pages de cette section
        start_page = current_page_num
        for page_content in section_pages:
            pages.append({
                'number': current_page_num,
                'content': page_content,
                'sections': [section_title] if current_page_num == start_page else []
            })
            current_page_num += 1

        end_page = current_page_num - 1
        section_to_page[section_title] = [start_page, end_page]

    return pages, section_to_page

def split_large_section(section_content):
    """
    Découpe une grande section en plusieurs morceaux intelligemment

    Stratégie:
    - Chercher les points de découpe naturels (entre les cards, tables, etc.)
    - Éviter de couper au milieu d'éléments non cassables
    """

    # Estimation approximative: ~120 lignes par page (basé sur observation visuelle)
    lines = section_content.split('\n')
    LINES_PER_PAGE = 120

    if len(lines) <= LINES_PER_PAGE:
        return [section_content]

    # Trouver les blocs non cassables (tables, cards, phase-cards)
    non_breakable_patterns = [
        (r'<table[\s\S]*?</table>', 'table'),
        (r'<div class="[^"]*card[^"]*"[\s\S]*?</div>', 'card'),
        (r'<div class="[^"]*phase-card[^"]*"[\s\S]*?</div>', 'phase-card'),
    ]

    # Marquer les zones non cassables
    non_breakable_zones = []
    for pattern, name in non_breakable_patterns:
        for match in re.finditer(pattern, section_content):
            non_breakable_zones.append({
                'start': match.start(),
                'end': match.end(),
                'type': name
            })

    # Trier par position
    non_breakable_zones.sort(key=lambda x: x['start'])

    # Découper intelligemment
    pages = []
    current_page_content = []
    current_line_count = 0

    i = 0
    while i < len(lines):
        line = lines[i]
        current_pos = '\n'.join(lines[:i+1])

        # Vérifier si on est dans une zone non cassable
        in_non_breakable = any(
            zone['start'] <= len(current_pos) <= zone['end']
            for zone in non_breakable_zones
        )

        # Si on dépasse la limite et qu'on peut casser
        if current_line_count >= LINES_PER_PAGE and not in_non_breakable:
            # Sauvegarder la page actuelle
            pages.append('\n'.join(current_page_content))
            current_page_content = []
            current_line_count = 0

        current_page_content.append(line)
        current_line_count += 1
        i += 1

    # Dernière page
    if current_page_content:
        pages.append('\n'.join(current_page_content))

    return pages

def update_toc(toc_html, section_to_page):
    """
    Met à jour la table des matières avec les vrais numéros de pages

    Mapping des titres H2 aux titres TOC (légèrement différents)
    """

    # Mapping manuel H2 -> TOC
    title_mapping = {
        'Résumé Exécutif': 'Résumé Exécutif',
        'Alignement Pédagogique Master RP': 'Alignement Pédagogique Master RP',
        'Travail de Communication & Design (Compétences IHECS)': 'Travail de Communication & Design',
        'Stratégie d\'Implémentation de Marché': 'Stratégie d\'Implémentation de Marché',
        'Planning Détaillé - 17 Semaines': 'Planning Détaillé (17 semaines)',
        'Double Track : B2C (Résidents) + B2B (Owners)': 'Double Track B2C + B2B',
        'Partenariats Institutionnels & Stratégiques': 'Partenariats Institutionnels',
        'Création & Officialisation de l\'Entreprise': 'Création & Officialisation SRL',
        'Volume Horaire & Charge de Travail': 'Volume Horaire & Charge de Travail',
        'Encadrement & Suivi': 'Encadrement & Suivi',
        'Résultats Attendus (30 mai 2025)': 'Résultats Attendus',
        'Conclusion': 'Conclusion',
    }

    # Créer le mapping inverse
    toc_to_h2 = {v: k for k, v in title_mapping.items()}

    # Générer les nouveaux items TOC
    new_toc_items = []

    # Parser l'ancien TOC pour extraire les titres
    old_toc_pattern = r'<li><strong>(.*?)</strong>.*?</li>'
    old_items = re.findall(old_toc_pattern, toc_html)

    for toc_title in old_items:
        h2_title = toc_to_h2.get(toc_title, toc_title)

        if h2_title in section_to_page:
            start_page, end_page = section_to_page[h2_title]
            if start_page == end_page:
                page_range = f"p. {start_page}"
            else:
                page_range = f"p. {start_page}-{end_page}"
        else:
            # Fallback
            page_range = "p. ?"

        new_toc_items.append(f'            <li><strong>{toc_title}</strong> <span style="float: right;">{page_range}</span></li>')

    # Remplacer dans le TOC
    new_toc = re.sub(
        r'(<ol[^>]*>)(.*?)(</ol>)',
        lambda m: m.group(1) + '\n' + '\n'.join(new_toc_items) + '\n        ' + m.group(3),
        toc_html,
        flags=re.DOTALL
    )

    return new_toc

def generate_page_html(page):
    """Génère le HTML d'une page avec footer"""
    return f"""<!-- ==================== PAGE {page['number']} ==================== -->
<div class="page" data-page-number="{page['number']}">
{page['content']}
    <div class="page-footer">Page {page['number']}</div>
</div>"""

def build_final_html(head, pages):
    """Construit le HTML final"""
    pages_html = '\n\n'.join([generate_page_html(page) for page in pages])

    return f"""<!DOCTYPE html>
<html lang="fr">
<head>
{head}
</head>
<body>

{pages_html}

</body>
</html>"""

def main():
    print('📄 Pagination Stricte A4 - Dossier de Stage Izzico')
    print('=' * 70)

    print(f'\n📂 Lecture: {INPUT_FILE}')
    html = read_file(INPUT_FILE)

    print('🔍 Extraction head + content...')
    head, content = extract_head_and_content(html)

    print('🎨 Vérification CSS footer...')
    head = ensure_footer_css(head)

    print('✂️  Découpage intelligent en pages A4...')
    pages, section_to_page = intelligent_split(content)

    print(f'\n✅ {len(pages)} pages créées:')
    for page in pages[:5]:  # Afficher les 5 premières
        sections_str = ', '.join(page['sections']) if page['sections'] else '(continuation)'
        print(f"   Page {page['number']}: {sections_str}")
    if len(pages) > 5:
        print(f"   ... et {len(pages) - 5} pages supplémentaires")

    print('\n📊 Mapping sections → pages:')
    for section, (start, end) in section_to_page.items():
        if start == end:
            print(f"   {section}: page {start}")
        else:
            print(f"   {section}: pages {start}-{end}")

    print('\n📝 Mise à jour de la table des matières...')
    # Mettre à jour la TOC dans la page 1
    if pages[0]['number'] == 1:
        pages[0]['content'] = update_toc(pages[0]['content'], section_to_page)

    print('🏗️  Construction HTML final...')
    final_html = build_final_html(head, pages)

    print(f'\n💾 Sauvegarde: {OUTPUT_FILE}')
    with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
        f.write(final_html)

    print('\n✅ Pagination terminée avec succès!')
    print(f'   Total: {len(pages)} pages')
    print(f'   Sections: {len(section_to_page)}')
    print(f'   Fichier: {OUTPUT_FILE}')

if __name__ == '__main__':
    main()
