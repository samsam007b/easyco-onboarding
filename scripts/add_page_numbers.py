#!/usr/bin/env python3
"""
Ajoute SEULEMENT les numéros de pages au fichier existant
Ne modifie PAS le découpage - garde les pages actuelles
Ajoute juste les footers de numérotation + met à jour la TOC
"""

import re
from pathlib import Path

SCRIPT_DIR = Path(__file__).parent
INPUT_FILE = SCRIPT_DIR / '../docs/stage-entrepreneurial/DOSSIER-STAGE-IZZICO-PRINT.html'
OUTPUT_FILE = INPUT_FILE

def main():
    print('📄 Ajout de Numérotation de Pages')
    print('=' * 70)

    # Lire le fichier
    print(f'\n📂 Lecture: {INPUT_FILE}')
    with open(INPUT_FILE, 'r', encoding='utf-8') as f:
        html = f.read()

    original_length = len(html)
    lines_original = html.count('\n')
    print(f'   {lines_original} lignes, {original_length} caractères')

    # Ajouter CSS footer si absent
    if '.page-footer' not in html:
        print('\n🎨 Ajout du CSS page-footer...')
        footer_css = """        /* ==================== PAGE FOOTER ==================== */
        .page-footer {
            position: absolute;
            bottom: 8mm;
            right: 15mm;
            font-size: 8pt;
            color: var(--neutral-500);
        }"""

        html = html.replace('    </style>', footer_css + '\n    </style>')

    # Trouver toutes les balises <div class="page"
    # Pattern: <div class="page" id="page-X">
    pages_pattern = r'<div class="page" id="(page-\d+)">'
    pages_found = list(re.finditer(pages_pattern, html))

    print(f'\n📋 Pages trouvées: {len(pages_found)}')
    for match in pages_found:
        page_id = match.group(1)
        print(f'   {page_id}')

    # Pour chaque page, ajouter un footer juste avant </div>
    # STRATÉGIE: remplacer chaque </div> qui suit une balise page par </div> avec footer

    # Trouver les paires <div class="page"...> ... </div>
    # On va utiliser une approche différente: split par <div class="page" et reconstruire

    # Split le HTML par les balises de page
    parts = re.split(r'(<div class="page" id="page-\d+"[^>]*>)', html)

    # parts[0] = tout avant la première page (head, etc.)
    # parts[1] = <div class="page" id="page-1">
    # parts[2] = contenu de la page 1
    # parts[3] = <div class="page" id="page-2">
    # parts[4] = contenu de la page 2
    # etc.

    print(f'\n✂️  Découpage: {len(parts)} parties')

    # Reconstruire avec les footers
    result_parts = [parts[0]]  # Head

    page_num = 1
    i = 1
    while i < len(parts):
        if i % 2 == 1:  # Balise d'ouverture de page
            page_opening_tag = parts[i]
            page_content = parts[i+1] if i+1 < len(parts) else ''

            # Supprimer les footers existants dans le contenu
            page_content = re.sub(r'\s*<div class="page-footer">.*?</div>\s*', '', page_content)

            # Trouver le dernier </div> du contenu (fermeture de la page)
            # On va ajouter le footer juste avant
            last_div_pos = page_content.rfind('</div>')

            if last_div_pos != -1:
                # Insérer le footer avant le </div> final
                footer = f'\n    <div class="page-footer">Page {page_num}</div>\n'
                page_content = page_content[:last_div_pos] + footer + page_content[last_div_pos:]

            result_parts.append(page_opening_tag)
            result_parts.append(page_content)

            page_num += 1
            i += 2
        else:
            # Ne devrait pas arriver
            result_parts.append(parts[i])
            i += 1

    # Reconstruire le HTML
    html_with_numbers = ''.join(result_parts)

    # Vérifier la taille
    final_length = len(html_with_numbers)
    final_lines = html_with_numbers.count('\n')

    print(f'\n📏 Résultat:')
    print(f'   {final_lines} lignes ({final_lines - lines_original:+d})')
    print(f'   {final_length} caractères ({final_length - original_length:+d})')

    # Vérification de sécurité
    if final_length < original_length * 0.95:
        print(f'\n❌ ATTENTION: Perte de contenu ({100 - final_length/original_length*100:.1f}% perdu)')
        print('   Annulation.')
        return

    # Maintenant, mettre à jour la TOC
    print('\n📝 Mise à jour de la table des matières...')

    # Trouver toutes les sections H2
    h2_pattern = r'<h2>(\d+)\.\s+(.*?)</h2>'
    all_h2 = list(re.finditer(h2_pattern, html_with_numbers))

    print(f'   Sections H2 trouvées: {len(all_h2)}')

    # Créer un mapping section → numéro de page
    # Pour cela, on doit trouver dans quelle page chaque H2 apparaît

    section_to_page = {}

    for h2_match in all_h2:
        section_num = h2_match.group(1)
        section_title = h2_match.group(2)
        h2_pos = h2_match.start()

        # Trouver dans quelle page ce H2 apparaît
        # En comptant combien de <div class="page" sont AVANT cette position

        pages_before = len(re.findall(r'<div class="page"', html_with_numbers[:h2_pos]))

        # La page est pages_before (si on commence à 1)
        page_number = pages_before

        if section_title not in section_to_page:
            section_to_page[section_title] = []
        section_to_page[section_title].append(page_number)

    # Calculer les plages
    section_ranges = {}
    for section, pages_list in section_to_page.items():
        start = min(pages_list)
        end = max(pages_list)
        section_ranges[section] = (start, end)

    print('   📊 Mapping:')
    for section, (start, end) in section_ranges.items():
        if start == end:
            print(f'      {section}: p. {start}')
        else:
            print(f'      {section}: p. {start}-{end}')

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

    # Mettre à jour la TOC
    toc_pattern = r'(<ol style="line-height: 2; font-size: 10pt;">)(.*?)(</ol>)'
    toc_match = re.search(toc_pattern, html_with_numbers, re.DOTALL)

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
                page_range = "p. ?"

            new_items.append(f'            <li><strong>{toc_title}</strong> <span style="float: right;">{page_range}</span></li>')

        # Reconstruire
        new_toc_content = toc_start + '\n' + '\n'.join(new_items) + '\n        ' + toc_end

        html_with_numbers = html_with_numbers[:toc_match.start()] + new_toc_content + html_with_numbers[toc_match.end():]

        print(f'   ✅ TOC mise à jour ({len(new_items)} entrées)')

    # Sauvegarder
    print(f'\n💾 Sauvegarde: {OUTPUT_FILE}')
    with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
        f.write(html_with_numbers)

    final_lines_saved = html_with_numbers.count('\n')
    final_length_saved = len(html_with_numbers)

    print('\n✅ Numérotation terminée!')
    print(f'   Pages: {page_num - 1}')
    print(f'   Lignes: {final_lines_saved}')
    print(f'   Fichier: {OUTPUT_FILE}')

if __name__ == '__main__':
    main()
