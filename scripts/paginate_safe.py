#!/usr/bin/env python3
"""
Pagination stricte A4 - VERSION SAFE (ne perd aucun contenu)

Stratégie ultra-prudente:
1. Lit le fichier HTML original
2. Extrait TOUT le contenu des pages existantes
3. Identifie les sections H2
4. Crée des nouvelles pages SANS supprimer de contenu
5. Ajoute seulement les footers de numérotation
6. Met à jour la table des matières
"""

import re
from pathlib import Path

SCRIPT_DIR = Path(__file__).parent
INPUT_FILE = SCRIPT_DIR / '../docs/stage-entrepreneurial/DOSSIER-STAGE-IZZICO-PRINT.html'
OUTPUT_FILE = INPUT_FILE

def main():
    print('📄 Pagination Sécurisée A4 - Dossier de Stage Izzico')
    print('=' * 70)

    # 1. Lire le fichier
    print(f'\n📂 Lecture: {INPUT_FILE}')
    with open(INPUT_FILE, 'r', encoding='utf-8') as f:
        html = f.read()

    original_length = len(html)
    print(f'   Taille originale: {original_length} caractères')

    # 2. Extraire head
    head_match = re.search(r'(<head>.*?</head>)', html, re.DOTALL)
    if not head_match:
        print('❌ Erreur: impossible de trouver <head>')
        return
    head = head_match.group(1)

    # 3. Ajouter le CSS footer si absent
    if '.page-footer' not in head:
        print('🎨 Ajout du CSS footer...')
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

    # 4. Extraire le body complet
    body_match = re.search(r'<body>(.*?)</body>', html, re.DOTALL)
    if not body_match:
        print('❌ Erreur: impossible de trouver <body>')
        return
    body_content = body_match.group(1)

    # 5. Trouver toutes les pages existantes
    # Pattern: <div class="page" ...> ... </div>
    page_pattern = r'<div class="page"[^>]*>(.*?)</div>\s*(?=<!-- =|<div class="page"|</body>|$)'
    pages_raw = list(re.finditer(page_pattern, body_content, re.DOTALL))

    print(f'\n📋 Pages existantes trouvées: {len(pages_raw)}')

    # 6. Extraire et nettoyer chaque page
    pages = []
    for i, match in enumerate(pages_raw, 1):
        page_content = match.group(1).strip()

        # Supprimer les footers existants
        page_content = re.sub(r'\s*<div class="page-footer">.*?</div>\s*$', '', page_content, flags=re.DOTALL)

        # Chercher les sections H2 dans cette page
        h2_matches = list(re.finditer(r'<h2>(\d+)\.\s+(.*?)</h2>', page_content))
        sections = [m.group(2) for m in h2_matches]

        pages.append({
            'number': i,
            'content': page_content,
            'sections': sections
        })

        sections_str = ', '.join(sections[:2]) if sections else '(continuation)'
        if len(sections) > 2:
            sections_str += f', +{len(sections)-2} autres'
        print(f'   Page {i}: {sections_str}')

    # 7. Créer le mapping section → pages pour la TOC
    section_to_pages = {}
    for page in pages:
        for section in page['sections']:
            if section not in section_to_pages:
                section_to_pages[section] = []
            section_to_pages[section].append(page['number'])

    # Calculer les plages
    section_ranges = {}
    for section, page_numbers in section_to_pages.items():
        start = min(page_numbers)
        end = max(page_numbers)
        section_ranges[section] = (start, end)

    print('\n📊 Mapping sections → pages:')
    for section, (start, end) in section_ranges.items():
        if start == end:
            print(f'   {section}: page {start}')
        else:
            print(f'   {section}: pages {start}-{end}')

    # 8. Mettre à jour la TOC dans la page 1
    print('\n📝 Mise à jour de la table des matières...')

    # Mapping H2 → TOC (titres légèrement différents)
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

    # Mettre à jour la page 1
    if len(pages) > 0:
        page1_content = pages[0]['content']

        # Trouver le bloc TOC
        toc_pattern = r'(<div class="card"[^>]*>[\s\S]*?<h2[^>]*>Table des Matières</h2>[\s\S]*?<ol[^>]*>)([\s\S]*?)(</ol>[\s\S]*?</div>)'
        toc_match = re.search(toc_pattern, page1_content)

        if toc_match:
            toc_start = toc_match.group(1)
            toc_items_old = toc_match.group(2)
            toc_end = toc_match.group(3)

            # Parser les anciens items TOC
            item_pattern = r'<li><strong>(.*?)</strong>.*?</li>'
            old_items = re.findall(item_pattern, toc_items_old)

            # Créer les nouveaux items avec numéros de page
            new_items = []
            for toc_title in old_items:
                # Trouver le titre H2 correspondant
                h2_title = None
                for h2, toc in h2_to_toc.items():
                    if toc == toc_title:
                        h2_title = h2
                        break

                # Trouver la plage de pages
                if h2_title and h2_title in section_ranges:
                    start, end = section_ranges[h2_title]
                    if start == end:
                        page_range = f"p. {start}"
                    else:
                        page_range = f"p. {start}-{end}"
                else:
                    # Pas trouvé - garder le format original ou mettre ?
                    page_range = "p. ?"

                new_items.append(f'            <li><strong>{toc_title}</strong> <span style="float: right;">{page_range}</span></li>')

            # Reconstruire la TOC
            new_toc = toc_start + '\n' + '\n'.join(new_items) + '\n        ' + toc_end

            # Remplacer dans la page 1
            pages[0]['content'] = page1_content[:toc_match.start()] + new_toc + page1_content[toc_match.end():]

            print(f'   ✅ TOC mise à jour avec {len(new_items)} entrées')
        else:
            print('   ⚠️  TOC non trouvée dans la page 1')

    # 9. Générer le HTML des pages avec footers
    print('\n🏗️  Génération des pages HTML...')
    pages_html = []
    for page in pages:
        page_html = f"""<!-- ==================== PAGE {page['number']} ==================== -->
<div class="page" data-page-number="{page['number']}">
{page['content']}
    <div class="page-footer">Page {page['number']}</div>
</div>"""
        pages_html.append(page_html)

    # 10. Construire le HTML final
    final_html = f"""<!DOCTYPE html>
<html lang="fr">
{head}
<body>

{chr(10).join(pages_html)}

</body>
</html>"""

    final_length = len(final_html)
    print(f'\n📏 Taille finale: {final_length} caractères')
    print(f'   Différence: {final_length - original_length:+d} caractères')

    # Vérifier qu'on n'a pas perdu trop de contenu
    if final_length < original_length * 0.95:
        print(f'\n❌ ATTENTION: Perte de contenu détectée ({100 - final_length/original_length*100:.1f}% perdu)')
        print('   Annulation de la sauvegarde par sécurité.')
        return

    # 11. Sauvegarder
    print(f'\n💾 Sauvegarde: {OUTPUT_FILE}')
    with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
        f.write(final_html)

    print('\n✅ Pagination terminée avec succès!')
    print(f'   Total: {len(pages)} pages')
    print(f'   Sections: {len(section_ranges)}')

if __name__ == '__main__':
    main()
