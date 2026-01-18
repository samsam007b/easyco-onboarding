#!/usr/bin/env python3
"""
Créer une pagination stricte A4 à partir du fichier HTML continu

Prend le fichier BACKUP (HTML continu sans pages) et crée des vraies pages A4
"""

import re
from pathlib import Path

SCRIPT_DIR = Path(__file__).parent
INPUT_FILE = SCRIPT_DIR / '../docs/stage-entrepreneurial/DOSSIER-STAGE-IZZICO-PRINT-BACKUP.html'
OUTPUT_FILE = SCRIPT_DIR / '../docs/stage-entrepreneurial/DOSSIER-STAGE-IZZICO-PRINT.html'

# Découpage manuel basé sur l'analyse du contenu
# Format: (numéro_page, section_title_ou_description, marker_regex)
PAGE_SPLITS = [
    # Page 1: Couverture + TOC
    (1, "Couverture + TOC", r'<body>', r'<!-- ==+ RÉSUMÉ EXÉCUTIF ==+ -->'),

    # Page 2: Résumé Exécutif (début)
    (2, "Résumé Exécutif", r'<!-- ==+ RÉSUMÉ EXÉCUTIF ==+ -->', r'</div>\s*\n\s*\n\s*<!-- ==+ ALIGNEMENT PÉD'),

    # Page 3: Alignement Pédagogique
    (3, "Alignement Pédagogique", r'<!-- ==+ ALIGNEMENT PÉD', r'<!-- ==+ TRAVAIL'),

    # Page 4-10: Travail Communication & Design (très long - à découper)
    (4, "Communication & Design - partie 1", r'<!-- ==+ TRAVAIL', r'<h3>3\.2'),
    (5, "Communication & Design - partie 2", r'<h3>3\.2', r'<h3>3\.4'),
    (6, "Communication & Design - partie 3", r'<h3>3\.4', r'<h3>3\.6'),
    (7, "Communication & Design - partie 4", r'<h3>3\.6', r'<h3>3\.8'),
    (8, "Communication & Design - partie 5", r'<h3>3\.8', r'<!-- ==+ STRATÉGIE'),

    # Page 9-11: Stratégie d'Implémentation
    (9, "Stratégie d'Implémentation - partie 1", r'<!-- ==+ STRATÉGIE', r'<h3>Vague 2'),
    (10, "Stratégie d'Implémentation - partie 2", r'<h3>Vague 2', r'<h3>Synthèse de la Stratégie'),
    (11, "Stratégie d'Implémentation - partie 3", r'<h3>Synthèse de la Stratégie', r'<!-- ==+ PLANNING'),

    # Page 12-14: Planning
    (12, "Planning - Phase 1-2", r'<!-- ==+ PLANNING', r'<div class="phase-card phase-3">'),
    (13, "Planning - Phase 3-4", r'<div class="phase-card phase-3">', r'<!-- ==+ DOUBLE TRACK'),

    # Page 14-17: Double Track + Partenariats
    (14, "Double Track", r'<!-- ==+ DOUBLE TRACK', r'<!-- ==+ PARTENARIATS'),
    (15, "Partenariats", r'<!-- ==+ PARTENARIATS', r'<!-- ==+ CRÉATION'),

    # Page 16-18: SRL + Volume Horaire
    (16, "Création SRL", r'<!-- ==+ CRÉATION', r'<!-- ==+ VOLUME'),
    (17, "Volume Horaire", r'<!-- ==+ VOLUME', r'<!-- ==+ ENCADREMENT'),

    # Page 19-20: Encadrement + Résultats
    (18, "Encadrement", r'<!-- ==+ ENCADREMENT', r'<!-- ==+ RÉSULTATS'),
    (19, "Résultats Attendus", r'<!-- ==+ RÉSULTATS', r'<!-- ==+ CONCLUSION'),

    # Page 20: Conclusion
    (20, "Conclusion", r'<!-- ==+ CONCLUSION', r'</body>'),
]

def main():
    print('📄 Création de Pagination Stricte A4')
    print('=' * 70)

    # Lire le fichier backup
    print(f'\n📂 Lecture: {INPUT_FILE}')
    with open(INPUT_FILE, 'r', encoding='utf-8') as f:
        html = f.read()

    print(f'   {len(html)} caractères, {html.count(chr(10))} lignes')

    # Extraire head
    head_match = re.search(r'(<head>.*?</head>)', html, re.DOTALL)
    if not head_match:
        print('❌ Erreur: <head> non trouvé')
        return
    head = head_match.group(1)

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
    if not body_match:
        print('❌ Erreur: <body> non trouvé')
        return
    body = body_match.group(1)

    print(f'\n✂️  Découpage en {len(PAGE_SPLITS)} pages...')

    pages = []
    errors = []

    for i, split_info in enumerate(PAGE_SPLITS):
        page_num, description, start_marker, end_marker = split_info

        # Trouver le début
        start_match = re.search(start_marker, body if i == 0 else remaining_body, re.IGNORECASE)
        if not start_match:
            errors.append(f"Page {page_num}: Marqueur de début non trouvé: {start_marker}")
            continue

        # Trouver la fin
        search_from = start_match.end()
        end_match = re.search(end_marker, body[search_from:] if i == 0 else remaining_body[search_from:], re.IGNORECASE)

        if not end_match:
            errors.append(f"Page {page_num}: Marqueur de fin non trouvé: {end_marker}")
            # Prendre tout ce qui reste
            page_content = (body[start_match.start():] if i == 0 else remaining_body[start_match.start():]).strip()
        else:
            page_content = (body[start_match.start():search_from + end_match.start()] if i == 0
                          else remaining_body[start_match.start():search_from + end_match.start()]).strip()

        pages.append({
            'number': page_num,
            'description': description,
            'content': page_content
        })

        # Mettre à jour remaining_body pour la prochaine itération
        if end_match:
            if i == 0:
                remaining_body = body[search_from + end_match.start():]
            else:
                remaining_body = remaining_body[search_from + end_match.start():]

        print(f'   Page {page_num}: {description} ({len(page_content)} caractères)')

    if errors:
        print('\n⚠️  Erreurs de découpage:')
        for error in errors:
            print(f'   {error}')

    # Simple fallback: si le découpage a échoué, faire un découpage basique par sections H2
    if len(pages) < 5:
        print('\n⚠️  Découpage manuel échoué - utilisation de fallback par sections H2')
        pages = fallback_split_by_h2(body)

    # Trouver les sections H2 dans chaque page
    print('\n📊 Analyse des sections par page...')
    section_to_pages = {}

    for page in pages:
        h2_matches = list(re.finditer(r'<h2>(\d+)\.\s+(.*?)</h2>', page['content']))

        for h2_match in h2_matches:
            section_title = h2_match.group(2)
            if section_title not in section_to_pages:
                section_to_pages[section_title] = []
            section_to_pages[section_title].append(page['number'])

    # Calculer les plages
    section_ranges = {}
    for section, page_list in section_to_pages.items():
        start = min(page_list)
        end = max(page_list)
        section_ranges[section] = (start, end)

    for section, (start, end) in section_ranges.items():
        if start == end:
            print(f'   {section}: p. {start}')
        else:
            print(f'   {section}: p. {start}-{end}')

    # Mettre à jour la TOC dans la première page
    print('\n📝 Mise à jour de la TOC...')

    # Mapping H2 → TOC
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

    # Trouver la TOC dans la page 1
    if len(pages) > 0:
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

            # Créer nouveaux items avec numéros de pages
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
                    page_range = ""  # Section pas encore dans une page

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

    print('\n✅ Pagination créée avec succès!')
    print(f'   Total: {len(pages)} pages')
    print(f'   Sections: {len(section_ranges)}')
    print(f'   Fichier: {OUTPUT_FILE}')

def fallback_split_by_h2(body):
    """Fallback: découper par sections H2"""
    print('   (Fallback: découpage par sections H2)')

    h2_pattern = r'<h2>(\d+)\.\s+(.*?)</h2>'
    h2_matches = list(re.finditer(h2_pattern, body))

    # Première page = tout avant le premier H2
    pages = []

    if len(h2_matches) > 0:
        first_h2_pos = h2_matches[0].start()
        page1_content = body[:first_h2_pos].strip()
        pages.append({
            'number': 1,
            'description': 'Couverture + TOC',
            'content': page1_content
        })

        # Autres pages = une section H2 par page
        for i, h2_match in enumerate(h2_matches):
            section_start = h2_match.start()

            # Trouver la fin (début du prochain H2 ou fin du body)
            if i < len(h2_matches) - 1:
                section_end = h2_matches[i + 1].start()
            else:
                section_end = len(body)

            section_content = body[section_start:section_end].strip()
            section_title = h2_match.group(2)

            pages.append({
                'number': i + 2,
                'description': section_title,
                'content': section_content
            })

    return pages

if __name__ == '__main__':
    main()
