import * as JSZipModule from 'jszip';
import type { LucideIcon } from 'lucide-react';
import { createRoot } from 'react-dom/client';

const JSZip = (JSZipModule as any).default || JSZipModule;

export interface IconExportOptions {
  size?: number;
  padding?: number;
  quality?: number;
}

/**
 * Génère un PNG d'un icône sur un fond spécifique
 */
async function generateIconPNG(
  Icon: LucideIcon,
  iconName: string,
  backgroundColor: string,
  iconColor: string,
  options: IconExportOptions = {}
): Promise<Blob> {
  const { size = 512, padding = 64 } = options;
  const iconSize = size - padding * 2;

  // Créer un conteneur temporaire
  const container = document.createElement('div');
  container.style.position = 'fixed';
  container.style.left = '-10000px';
  container.style.top = '-10000px';
  container.style.width = `${size}px`;
  container.style.height = `${size}px`;
  container.style.backgroundColor = backgroundColor;
  container.style.display = 'flex';
  container.style.alignItems = 'center';
  container.style.justifyContent = 'center';
  document.body.appendChild(container);

  // Créer un wrapper pour l'icône
  const iconContainer = document.createElement('div');
  iconContainer.style.width = `${iconSize}px`;
  iconContainer.style.height = `${iconSize}px`;
  iconContainer.style.display = 'flex';
  iconContainer.style.alignItems = 'center';
  iconContainer.style.justifyContent = 'center';
  container.appendChild(iconContainer);

  // Rendre l'icône React dans le DOM
  const root = createRoot(iconContainer);

  return new Promise((resolve, reject) => {
    try {
      // Rendre l'icône
      root.render(
        Icon({
          size: iconSize,
          color: iconColor,
          strokeWidth: 2,
        }) as any
      );

      // Attendre que le rendu soit terminé
      setTimeout(async () => {
        try {
          // Récupérer le SVG rendu
          const svgElement = iconContainer.querySelector('svg');

          if (!svgElement) {
            throw new Error(`No SVG found for ${iconName}`);
          }

          // Créer un canvas
          const canvas = document.createElement('canvas');
          canvas.width = size;
          canvas.height = size;
          const ctx = canvas.getContext('2d');

          if (!ctx) {
            throw new Error('Failed to get canvas context');
          }

          // Dessiner le fond
          ctx.fillStyle = backgroundColor;
          ctx.fillRect(0, 0, size, size);

          // Convertir le SVG en image
          const svgData = new XMLSerializer().serializeToString(svgElement);
          const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
          const url = URL.createObjectURL(svgBlob);

          const img = new Image();

          img.onload = () => {
            // Dessiner l'icône centrée
            ctx.drawImage(img, padding, padding, iconSize, iconSize);

            // Nettoyer
            URL.revokeObjectURL(url);
            root.unmount();
            document.body.removeChild(container);

            // Convertir en blob PNG
            canvas.toBlob(
              (pngBlob) => {
                if (pngBlob) {
                  resolve(pngBlob);
                } else {
                  reject(new Error('Failed to generate PNG blob'));
                }
              },
              'image/png',
              1.0
            );
          };

          img.onerror = () => {
            URL.revokeObjectURL(url);
            root.unmount();
            document.body.removeChild(container);
            reject(new Error(`Failed to load SVG image for ${iconName}`));
          };

          img.src = url;
        } catch (error) {
          root.unmount();
          document.body.removeChild(container);
          reject(error);
        }
      }, 50); // Petit délai pour s'assurer que React a fini de rendre
    } catch (error) {
      root.unmount();
      document.body.removeChild(container);
      reject(error);
    }
  });
}

/**
 * Exporte tous les icônes dans un fichier ZIP
 */
export async function exportAllIcons(
  iconGroups: Record<string, Array<{ icon: LucideIcon; name: string }>>,
  options: IconExportOptions = {},
  onProgress?: (current: number, total: number, iconName: string) => void
): Promise<Blob> {
  const zip = new JSZip();

  // Créer les dossiers
  const lightFolder = zip.folder('icons-light-background');
  const darkFolder = zip.folder('icons-dark-background');

  if (!lightFolder || !darkFolder) {
    throw new Error('Failed to create folders');
  }

  // Compter le total d'icônes
  const totalIcons = Object.values(iconGroups).reduce(
    (sum, icons) => sum + icons.length,
    0
  );

  let currentIcon = 0;
  const errors: string[] = [];

  // Générer tous les icônes
  for (const [category, icons] of Object.entries(iconGroups)) {
    const lightCategoryFolder = lightFolder.folder(category);
    const darkCategoryFolder = darkFolder.folder(category);

    if (!lightCategoryFolder || !darkCategoryFolder) {
      continue;
    }

    for (const { icon, name } of icons) {
      currentIcon++;

      if (onProgress) {
        onProgress(currentIcon, totalIcons, name);
      }

      try {
        // Version sur fond clair (icône noir)
        const lightBlob = await generateIconPNG(
          icon,
          name,
          '#FFFFFF',
          '#000000',
          options
        );
        lightCategoryFolder.file(`${name}.png`, lightBlob);

        // Petit délai pour éviter de surcharger le navigateur
        await new Promise(resolve => setTimeout(resolve, 20));

        // Version sur fond noir (icône blanc)
        const darkBlob = await generateIconPNG(
          icon,
          name,
          '#000000',
          '#FFFFFF',
          options
        );
        darkCategoryFolder.file(`${name}.png`, darkBlob);

        // Petit délai pour éviter de surcharger le navigateur
        await new Promise(resolve => setTimeout(resolve, 20));
      } catch (error) {
        console.error(`Failed to generate icon ${name}:`, error);
        errors.push(`${name}: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }
  }

  // Ajouter un fichier README
  const readme = `# EasyCo Icons Export

Generated on: ${new Date().toLocaleString()}
Total icons: ${totalIcons}
Successfully generated: ${totalIcons - errors.length}
Errors: ${errors.length}
Size: ${options.size || 512}px × ${options.size || 512}px

## Structure

- icons-light-background/ - Icônes noirs sur fond blanc (#FFFFFF)
- icons-dark-background/ - Icônes blancs sur fond noir (#000000)

Chaque dossier contient des sous-dossiers par catégorie.

## Usage

Ces icônes sont prêts à être utilisés dans vos présentations, brand kits,
et autres documents marketing.

Tous les icônes sont en PNG avec le fond spécifié.

${errors.length > 0 ? `\n## Errors encountered:\n\n${errors.join('\n')}` : ''}

---
EasyCo Design System
${new Date().getFullYear()}
`;

  zip.file('README.txt', readme);

  // Générer le ZIP
  return await zip.generateAsync({
    type: 'blob',
    compression: 'DEFLATE',
    compressionOptions: { level: 9 },
  });
}

/**
 * Déclenche le téléchargement d'un blob
 */
export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
