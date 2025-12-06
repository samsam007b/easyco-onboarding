import * as JSZipModule from 'jszip';
import type { LucideIcon } from 'lucide-react';
import { createElement } from 'react';
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
      // Créer l'élément React - utiliser createElement pour gérer les deux cas
      const iconElement = createElement(Icon as any, {
        size: iconSize,
        color: iconColor,
        strokeWidth: 2,
      });

      root.render(iconElement);

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

          // Cloner le SVG et s'assurer qu'il a les bons attributs
          const clonedSvg = svgElement.cloneNode(true) as SVGElement;
          clonedSvg.setAttribute('width', String(iconSize));
          clonedSvg.setAttribute('height', String(iconSize));
          clonedSvg.setAttribute('viewBox', '0 0 24 24');

          // Convertir le SVG en image
          const svgData = new XMLSerializer().serializeToString(clonedSvg);
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
      }, 100); // Augmenté à 100ms pour plus de fiabilité
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
  const successful: string[] = [];

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
        await new Promise(resolve => setTimeout(resolve, 30));

        // Version sur fond noir (icône blanc)
        const darkBlob = await generateIconPNG(
          icon,
          name,
          '#000000',
          '#FFFFFF',
          options
        );
        darkCategoryFolder.file(`${name}.png`, darkBlob);

        successful.push(name);

        // Petit délai pour éviter de surcharger le navigateur
        await new Promise(resolve => setTimeout(resolve, 30));
      } catch (error) {
        console.error(`Failed to generate icon ${name}:`, error);
        errors.push(`${name}: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }
  }

  // Ajouter un fichier README
  const readme = `# EasyCo Icons Export

Generated on: ${new Date().toLocaleString('fr-FR', {
  dateStyle: 'full',
  timeStyle: 'short'
})}

Total icons: ${totalIcons}
Successfully generated: ${successful.length} (${Math.round((successful.length / totalIcons) * 100)}%)
Failed: ${errors.length}
Size: ${options.size || 512}px × ${options.size || 512}px

## Structure

- icons-light-background/ - Icônes noirs sur fond blanc (#FFFFFF)
- icons-dark-background/ - Icônes blancs sur fond noir (#000000)

Chaque dossier contient des sous-dossiers par catégorie.

## Successfully Generated Icons

${successful.length > 0 ? successful.map(name => `- ${name}`).join('\n') : 'None'}

## Usage

Ces icônes sont prêts à être utilisés dans vos présentations, brand kits,
et autres documents marketing.

Tous les icônes sont en PNG haute qualité avec le fond spécifié.

${errors.length > 0 ? `\n## Errors Encountered\n\n${errors.map(err => `- ${err}`).join('\n')}` : ''}

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
