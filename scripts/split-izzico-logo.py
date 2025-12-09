#!/usr/bin/env python3
"""
Script pour découper le logo IzzIco en lettres individuelles
Permet d'animer chaque lettre séparément
"""

from PIL import Image
import numpy as np
import os

def find_letter_bounds(img_array, threshold=250):
    """
    Trouve les limites de chaque lettre en détectant les colonnes vides
    """
    # Convertir en niveaux de gris si nécessaire
    if len(img_array.shape) == 3:
        # Prendre le canal alpha si disponible, sinon moyenne RGB
        if img_array.shape[2] == 4:
            gray = img_array[:, :, 3]  # Canal alpha
        else:
            gray = np.mean(img_array[:, :, :3], axis=2)
    else:
        gray = img_array

    # Détecter les colonnes qui contiennent du contenu (non blanc/transparent)
    col_has_content = np.any(gray < threshold, axis=0)

    # Trouver les groupes de colonnes consécutives avec du contenu
    letters = []
    in_letter = False
    start_col = 0

    for i, has_content in enumerate(col_has_content):
        if has_content and not in_letter:
            # Début d'une nouvelle lettre
            start_col = i
            in_letter = True
        elif not has_content and in_letter:
            # Fin de la lettre
            letters.append((start_col, i))
            in_letter = False

    # Si la dernière lettre va jusqu'au bord
    if in_letter:
        letters.append((start_col, len(col_has_content)))

    return letters

def split_logo_into_letters(input_path, output_dir, letter_names=['I', 'z', 'z', 'I', 'c', 'o']):
    """
    Découpe le logo en lettres individuelles
    """
    # Créer le dossier de sortie
    os.makedirs(output_dir, exist_ok=True)

    # Charger l'image
    img = Image.open(input_path)
    img_array = np.array(img)

    print(f"📸 Image chargée: {img.size[0]}x{img.size[1]} pixels")
    print(f"   Mode: {img.mode}")

    # Trouver les limites des lettres
    letter_bounds = find_letter_bounds(img_array)

    print(f"✂️  {len(letter_bounds)} lettres détectées")

    # Découper et sauvegarder chaque lettre
    for idx, (start, end) in enumerate(letter_bounds):
        if idx >= len(letter_names):
            letter_name = f"letter_{idx}"
        else:
            letter_name = letter_names[idx]

        # Découper la lettre avec un peu de marge
        margin = 5
        crop_start = max(0, start - margin)
        crop_end = min(img.size[0], end + margin)

        # Cropper l'image
        letter_img = img.crop((crop_start, 0, crop_end, img.size[1]))

        # Sauvegarder
        output_path = os.path.join(output_dir, f"izzico-{letter_name}.png")
        letter_img.save(output_path)

        width = crop_end - crop_start
        print(f"   ✅ {letter_name}: {width}px large → {output_path}")

    print(f"\n🎉 Terminé ! {len(letter_bounds)} lettres sauvegardées dans {output_dir}")
    return len(letter_bounds)

if __name__ == "__main__":
    # Chemins
    logo_dir = "/Users/samuelbaudon/Desktop/Easy Co/graphisme/izzico logo"

    # Versions à découper
    versions = [
        ("izzico-1G-1200px.png", "1200px"),
        ("izzico-1G-2400px.png", "2400px"),
    ]

    for logo_file, size in versions:
        input_path = os.path.join(logo_dir, logo_file)
        output_dir = os.path.join(logo_dir, f"letters-{size}")

        print(f"\n{'='*60}")
        print(f"🔤 Découpage du logo {size}")
        print(f"{'='*60}")

        if os.path.exists(input_path):
            split_logo_into_letters(input_path, output_dir)
        else:
            print(f"❌ Fichier introuvable: {input_path}")
