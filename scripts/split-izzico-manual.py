#!/usr/bin/env python3
"""
Script pour découper manuellement le logo IzzIco en 6 lettres
Basé sur une division approximative de la largeur
"""

from PIL import Image
import os

def split_logo_manual(input_path, output_dir):
    """
    Découpe le logo en 6 parties égales (une par lettre: I-z-z-I-c-o)
    """
    os.makedirs(output_dir, exist_ok=True)

    # Charger l'image
    img = Image.open(input_path)
    width, height = img.size

    print(f"📸 Image: {width}x{height}px")

    # IzzIco = 6 lettres
    # Approximation: diviser en 6 parties égales
    # Ajuster selon la largeur réelle de chaque lettre
    letter_names = ['I', 'z1', 'z2', 'I2', 'c', 'o']

    # Positions approximatives (à ajuster après visualisation)
    # Format: (start_ratio, end_ratio)
    positions = [
        (0.00, 0.15),   # I (étroit)
        (0.15, 0.30),   # z
        (0.30, 0.45),   # z
        (0.45, 0.60),   # I (étroit)
        (0.60, 0.78),   # c
        (0.78, 1.00),   # o
    ]

    for idx, (start_ratio, end_ratio) in enumerate(positions):
        letter_name = letter_names[idx]

        start_px = int(width * start_ratio)
        end_px = int(width * end_ratio)

        # Cropper
        letter_img = img.crop((start_px, 0, end_px, height))

        # Sauvegarder
        output_path = os.path.join(output_dir, f"izzico-{letter_name}.png")
        letter_img.save(output_path)

        letter_width = end_px - start_px
        print(f"   ✅ {letter_name}: {letter_width}px ({start_px}-{end_px}px) → {output_path}")

    print(f"\n🎉 6 lettres sauvegardées dans {output_dir}")

if __name__ == "__main__":
    logo_dir = "/Users/samuelbaudon/Desktop/Easy Co/graphisme/izzico logo"

    versions = [
        ("izzico-1G-1200px.png", "letters-manual-1200px"),
        ("izzico-1G-2400px.png", "letters-manual-2400px"),
    ]

    for logo_file, output_subdir in versions:
        input_path = os.path.join(logo_dir, logo_file)
        output_dir = os.path.join(logo_dir, output_subdir)

        print(f"\n{'='*60}")
        print(f"🔤 Découpage manuel: {logo_file}")
        print(f"{'='*60}")

        if os.path.exists(input_path):
            split_logo_manual(input_path, output_dir)
        else:
            print(f"❌ Fichier introuvable: {input_path}")
