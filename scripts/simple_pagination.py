#!/usr/bin/env python3
"""
Pagination simple et efficace:
1. Page 1 = tout avant le premier H2
2. Chaque section H2 = une ou plusieurs pages (si trop longue)
3. Numérotation + TOC mise à jour
"""

import re
from pathlib import Path

SCRIPT_DIR = Path(__file__).parent
INPUT_FILE = SCRIPT_DIR / '../docs/stage-entrepreneurial/DOSSIER-STAGE-IZZICO-PRINT-BACKUP.html'
OUTPUT_FILE = SCRIPT_DIR / '../docs/stage-entrepreneurial/DOSSIER-STAGE-IZZICO-PRINT.html'

# Seuil approximatif pour découper les sections longues (en caractères)
MAX_PAGE_CONTENT_LENGTH = 8000  # ~120 lignes de texte

def main():
    print('📄 Pagination Simple et Efficace')
    print('=' * 70)

    # Lire le fichier
    print(f'\n📂 Lecture: {INPUT_FILE}')
    with open(INPUT_FILE, 'r', encoding='utf-8') as f:
        html = f.read()

    print(f'   {len(html)} caractères')

    # Extraire head
    head_match = re.search(r'(<head>.*?</head>)', html, re.DOTALL)
    head = head_match.group(1) if head_match else ''

    # Ajouter CSS footer
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

    # Extraire body
    body_match = re.search(r'<body>(.*?)</body>', html, re.DOTALL)
    body = body_match.group(1) if body_match else ''

    # Trouver toutes les sections H2
    h2_pattern = r'<h2>(\d+)\.\s+(.*?)</h2>'
    h2_matches = list(re.finditer(h2_pattern, body))

    print(f'\n📋 Sections H2 trouvées: {len(h2_matches)}')
    for match in h2_matches:
        print(f'   {match.group(1)}. {match.group(2)}')

    # Créer les pages
    pages = []
    page_num = 1

    # Page 1: Tout avant le premier H2 (couverture + TOC)
    if h2_matches:
        first_h2_pos = h2_matches[0].start()
        page1_content = body[:first_h2_pos].strip()

        pages.append({
            'number': page_num,
            'content': page1_content,
            'sections': []
        })
        page_num += 1

    # Pages suivantes: une section H2 par page (ou plus si section longue)
    for i, h2_match in enumerate(h2_matches):
        section_start = h2_match.start()
        section_title = h2_match.group(2)

        # Trouver la fin de cette section
        if i < len(h2_matches) - 1:
            section_end = h2_matches[i + 1].start()
        else:
            section_end = len(body)

        section_content = body[section_start:section_end].strip()

        # Si la section est trop longue, la découper
        if len(section_content) > MAX_PAGE_CONTENT_LENGTH:
            sub_pages = split_long_section(section_content, section_title)
            for sub_page_content in sub_pages:
                pages.append({
                    'number': page_num,
                    'content': sub_page_content,
                    'sections': [section_title] if page_num == pages[-1]['number'] + 1 else []
                })
                page_num += 1
        else:
            pages.append({
                'number': page_num,
                'content': section_content,
                'sections': [section_title]
            })
            page_num += 1

    print(f'\n✅ {len(pages)} pages créées')

    # Créer le mapping section → pages
    section_to_pages = {}
    for page in pages:
        for section in page['sections']:
            if section not in section_to_pages:
                section_to_pages[section] = []
            section_to_pages[section].append(page['number'])

    # Calculer les plages
    section_ranges = {}
    for section, page_list in section_to_pages.items():
        start = min(page_list)
        end = max(page_list)
        section_ranges[section] = (start, end)

    print('\n📊 Mapping sections → pages:')
    for section, (start, end) in section_ranges.items():
        if start == end:
            print(f'   {section}: p. {start}')
        else:
            print(f'   {section}: p. {start}-{end}')

    # Mettre à jour la TOC
    print('\n📝 Mise à jour de la TOC...')

    h2_to_toc = {
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

    # Mettre à jour la TOC dans la page 1
    if pages:
        page1 = pages[0]
        toc_pattern = r'(<ol style="line-height: 2; font-size: 10pt;">)(.*?)(</ol>)'
        toc_match = re.search(toc_pattern, page1['content'], re.DOTALL)

        if toc_match:
            toc_start = toc_match.group(1)
            toc_items_old = toc_match.group(2)
            toc_end = toc_match.group(3)

            # Parser les items
            item_pattern = r'<li><strong>(.*?)</strong>.*?</li>'
            old_items = re.findall(item_pattern, toc_items_old)

            # Créer nouveaux items
            new_items = []
            for toc_title in old_items:
                # Trouver le H2 correspondant
                h2_title = None
                for h2, toc in h2_to_toc.items():
                    if toc == toc_title:
                        h2_title = h2
                        break

                # Trouver la plage
                if h2_title and h2_title in section_ranges:
                    start, end = section_ranges[h2_title]
                    if start == end:
                        page_range = f"p. {start}"
                    else:
                        page_range = f"p. {start}-{end}"
                else:
                    page_range = ""

                new_items.append(f'            <li><strong>{toc_title}</strong> <span style="float: right;">{page_range}</span></li>')

            # Reconstruire
            new_toc = toc_start + '\n' + '\n'.join(new_items) + '\n        ' + toc_end

            pages[0]['content'] = page1['content'][:toc_match.start()] + new_toc + page1['content'][toc_match.end():]

            print(f'   ✅ TOC mise à jour ({len(new_items)} entrées)')

    # Générer le HTML final
    print('\n🏗️  Construction HTML final...')

    pages_html = []
    for page in pages:
        page_html = f"""<!-- ==================== PAGE {page['number']} ==================== -->
<div class="page" data-page-number="{page['number']}">
{page['content']}
    <div class="page-footer">Page {page['number']}</div>
</div>"""
        pages_html.append(page_html)

    final_html = f"""<!DOCTYPE html>
<html lang="fr">
{head}
<body>

{chr(10).join(pages_html)}

</body>
</html>"""

    # Sauvegarder
    print(f'\n💾 Sauvegarde: {OUTPUT_FILE}')
    with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
        f.write(final_html)

    print('\n✅ Pagination terminée avec succès!')
    print(f'   Total: {len(pages)} pages')
    print(f'   Sections: {len(section_ranges)}')
    print(f'   Fichier: {OUTPUT_FILE}')

def split_long_section(section_content, section_title):
    """Découpe une section longue en plusieurs pages"""
    # Stratégie simple: découper par blocs (cards, tables, etc.)
    # Si pas de blocs évidents, découper toutes les MAX_PAGE_CONTENT_LENGTH caractères

    # Trouver les blocs naturels
    blocks = []

    # Pattern pour tables
    for match in re.finditer(r'<table[\s\S]*?</table>', section_content):
        blocks.append((match.start(), match.end(), 'table'))

    # Pattern pour cards
    for match in re.finditer(r'<div class="[^"]*card[^"]*"[\s\S]*?</div>', section_content):
        blocks.append((match.start(), match.end(), 'card'))

    # Pattern pour H3 (sous-sections)
    for match in re.finditer(r'<h3>.*?</h3>', section_content):
        blocks.append((match.start(), match.end(), 'h3'))

    # Trier par position
    blocks.sort(key=lambda x: x[0])

    # Découper en pages
    sub_pages = []
    current_page_content = []
    current_length = 0

    i = 0
    pos = 0

    while pos < len(section_content):
        # Trouver le prochain bloc après pos
        next_block = None
        for block in blocks:
            if block[0] >= pos:
                next_block = block
                break

        if next_block:
            start, end, block_type = next_block

            # Ajouter le texte avant le bloc
            text_before = section_content[pos:start]
            block_content = section_content[start:end]

            # Vérifier si on peut ajouter à la page actuelle
            if current_length + len(text_before) + len(block_content) > MAX_PAGE_CONTENT_LENGTH and current_page_content:
                # Sauvegarder la page actuelle
                sub_pages.append('\n'.join(current_page_content))
                current_page_content = []
                current_length = 0

            # Ajouter le texte et le bloc
            if text_before.strip():
                current_page_content.append(text_before)
                current_length += len(text_before)

            current_page_content.append(block_content)
            current_length += len(block_content)

            pos = end
        else:
            # Plus de blocs, prendre le reste
            remaining = section_content[pos:]
            if remaining.strip():
                current_page_content.append(remaining)
            break

    # Dernière page
    if current_page_content:
        sub_pages.append('\n'.join(current_page_content))

    # Si aucun découpage n'a été fait, forcer un découpage tous les MAX_PAGE_CONTENT_LENGTH
    if len(sub_pages) <= 1 and len(section_content) > MAX_PAGE_CONTENT_LENGTH:
        sub_pages = []
        for i in range(0, len(section_content), MAX_PAGE_CONTENT_LENGTH):
            sub_pages.append(section_content[i:i+MAX_PAGE_CONTENT_LENGTH])

    return sub_pages if sub_pages else [section_content]

if __name__ == '__main__':
    main()
