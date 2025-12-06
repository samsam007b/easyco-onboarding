import * as JSZipModule from 'jszip';
import type { LucideIcon } from 'lucide-react';

const JSZip = (JSZipModule as any).default || JSZipModule;

export interface IconExportOptions {
  size?: number;
  padding?: number;
  quality?: number;
}

/**
 * Génère un PNG d'un icône sur un fond spécifique en utilisant le DOM
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

  // Créer un conteneur temporaire hors écran
  const container = document.createElement('div');
  container.style.position = 'fixed';
  container.style.left = '-10000px';
  container.style.top = '-10000px';
  container.style.width = `${iconSize}px`;
  container.style.height = `${iconSize}px`;
  document.body.appendChild(container);

  // Rendre l'icône dans le conteneur
  const iconWrapper = document.createElement('div');
  iconWrapper.style.width = '100%';
  iconWrapper.style.height = '100%';
  iconWrapper.style.display = 'flex';
  iconWrapper.style.alignItems = 'center';
  iconWrapper.style.justifyContent = 'center';
  container.appendChild(iconWrapper);

  // Créer un SVG temporaire pour extraire le path
  const tempSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  tempSvg.setAttribute('width', String(iconSize));
  tempSvg.setAttribute('height', String(iconSize));
  tempSvg.setAttribute('viewBox', '0 0 24 24');
  tempSvg.setAttribute('fill', 'none');
  tempSvg.setAttribute('stroke', iconColor);
  tempSvg.setAttribute('stroke-width', '2');
  tempSvg.setAttribute('stroke-linecap', 'round');
  tempSvg.setAttribute('stroke-linejoin', 'round');

  iconWrapper.appendChild(tempSvg);

  // Créer un wrapper React pour extraire le SVG
  const iconInstance = Icon({
    size: 24,
    color: iconColor,
    strokeWidth: 2,
  });

  // Extraire le SVG inner content depuis l'instance
  let svgContent = '';
  if (iconInstance && typeof iconInstance === 'object' && 'props' in iconInstance) {
    const props = iconInstance.props as any;
    if (props.children) {
      // Parcourir les children pour extraire les éléments SVG
      const children = Array.isArray(props.children) ? props.children : [props.children];
      children.forEach((child: any) => {
        if (child && typeof child === 'object' && 'type' in child && 'props' in child) {
          const elementType = child.type;
          const elementProps = child.props || {};

          // Créer l'élément SVG correspondant
          const element = document.createElementNS('http://www.w3.org/2000/svg', elementType);
          Object.entries(elementProps).forEach(([key, value]) => {
            if (key !== 'children' && typeof value === 'string' || typeof value === 'number') {
              element.setAttribute(key, String(value));
            }
          });
          tempSvg.appendChild(element);
        }
      });
    }
  }

  // Si l'extraction a échoué, utiliser une approche alternative
  if (tempSvg.children.length === 0) {
    console.warn(`Could not extract SVG content for ${iconName}, using fallback`);
    // Créer un cercle comme fallback
    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute('cx', '12');
    circle.setAttribute('cy', '12');
    circle.setAttribute('r', '10');
    tempSvg.appendChild(circle);
  }

  // Créer le canvas final
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    document.body.removeChild(container);
    throw new Error('Failed to get canvas context');
  }

  // Dessiner le fond
  ctx.fillStyle = backgroundColor;
  ctx.fillRect(0, 0, size, size);

  // Convertir le SVG en image
  const svgString = new XMLSerializer().serializeToString(tempSvg);
  const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(svgBlob);

  return new Promise((resolve, reject) => {
    const img = new Image();

    img.onload = () => {
      // Dessiner l'icône centrée
      ctx.drawImage(img, padding, padding, iconSize, iconSize);

      // Nettoyer
      URL.revokeObjectURL(url);
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
      document.body.removeChild(container);
      reject(new Error(`Failed to load SVG image for ${iconName}`));
    };

    img.src = url;
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
        await new Promise(resolve => setTimeout(resolve, 10));

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
        await new Promise(resolve => setTimeout(resolve, 10));
      } catch (error) {
        console.error(`Failed to generate icon ${name}:`, error);
      }
    }
  }

  // Ajouter un fichier README
  const readme = `# EasyCo Icons Export

Generated on: ${new Date().toLocaleString()}
Total icons: ${totalIcons}
Size: ${options.size || 512}px × ${options.size || 512}px

## Structure

- icons-light-background/ - Icônes noirs sur fond blanc (#FFFFFF)
- icons-dark-background/ - Icônes blancs sur fond noir (#000000)

Chaque dossier contient des sous-dossiers par catégorie.

## Usage

Ces icônes sont prêts à être utilisés dans vos présentations, brand kits,
et autres documents marketing.

Tous les icônes sont en PNG transparent avec le fond spécifié.

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
