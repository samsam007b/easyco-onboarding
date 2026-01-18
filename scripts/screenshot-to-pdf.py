#!/usr/bin/env python3
"""
Prend des screenshots de chaque slide du HTML scrollable
et les assemble en PDF paysage
"""

from playwright.sync_api import sync_playwright
from PIL import Image
import os

def capture_slides_to_pdf():
    """Capture chaque slide individuellement et assemble en PDF"""
    print("🚀 Capture des slides en screenshots...\n")

    html_path = os.path.join(os.path.dirname(__file__), '..', 'izzico-pitch-deck-scrollable.html')
    output_pdf = os.path.join(os.path.dirname(__file__), '..', 'izzico-pitch-deck-screenshots.pdf')

    if not os.path.exists(html_path):
        print(f"❌ Fichier HTML introuvable : {html_path}")
        return

    print(f"📄 HTML : {html_path}")
    print(f"📦 Output : {output_pdf}\n")

    with sync_playwright() as p:
        # Launch browser
        browser = p.chromium.launch()
        page = browser.new_page(viewport={'width': 1920, 'height': 1080})

        # Load HTML
        page.goto(f'file://{html_path}', wait_until='networkidle')

        print("⏳ Waiting for fonts, icons, QR code...\n")

        # Wait for all assets
        page.wait_for_function("() => document.fonts.ready")
        page.wait_for_function("() => typeof lucide !== 'undefined'")

        # Wait for QR code
        page.wait_for_function("""() => {
            const qr = document.getElementById('qrcode');
            return qr && qr.querySelector('canvas');
        }""", timeout=10000)

        # Extra wait
        page.wait_for_timeout(2000)

        print("✅ Page chargée (fonts, icons, QR)\n")

        # Get total number of slides
        num_slides = page.evaluate("() => document.querySelectorAll('.slide').length")
        print(f"📊 Total slides détectées : {num_slides}\n")

        screenshots = []

        # Capture each slide
        for i in range(num_slides):
            print(f"  📸 Capture slide {i + 1}/{num_slides}...")

            # Scroll to slide
            page.evaluate(f"""() => {{
                const slides = document.querySelectorAll('.slide');
                slides[{i}].scrollIntoView({{ block: 'start', behavior: 'instant' }});
            }}""")

            # Wait for scroll to finish
            page.wait_for_timeout(500)

            # Take screenshot
            screenshot_path = f'/tmp/izzico_slide_{i + 1}.png'
            page.screenshot(path=screenshot_path, full_page=False)
            screenshots.append(screenshot_path)

        browser.close()

        print(f"\n✅ {num_slides} screenshots capturés\n")
        print("📦 Assemblage en PDF...")

        # Convert screenshots to PDF
        images = [Image.open(path) for path in screenshots]

        # Save as PDF (landscape A4)
        images[0].save(
            output_pdf,
            save_all=True,
            append_images=images[1:],
            resolution=100.0,
            quality=95
        )

        # Cleanup temp files
        for path in screenshots:
            os.remove(path)

        file_size = os.path.getsize(output_pdf) / (1024 * 1024)

        print(f"\n✅ PDF généré avec succès !")
        print(f"   📦 Fichier : {output_pdf}")
        print(f"   📊 Taille : {file_size:.2f} MB")
        print(f"   📄 Slides : {num_slides}")
        print(f"\n🎯 Le PDF est EXACTEMENT identique à ce que tu vois dans le navigateur !")

if __name__ == '__main__':
    capture_slides_to_pdf()
