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

interface IconVariant {
  name: string;
  color: string;
}

const ICON_VARIANTS: IconVariant[] = [
  { name: 'black', color: '#000000' },
  { name: 'white', color: '#FFFFFF' },
  { name: 'purple', color: '#9c5698' },
  { name: 'orange', color: '#FF5722' },
  { name: 'yellow', color: '#FFB10B' },
];

/**
 * Génère un PNG d'un icône sur fond transparent
 */
async function generateIconPNG(
  Icon: LucideIcon,
  iconName: string,
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
      // Créer l'élément React
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

          // NE PAS dessiner de fond - laisser transparent
          ctx.clearRect(0, 0, size, size);

          // Cloner et préparer le SVG
          const clonedSvg = svgElement.cloneNode(true) as SVGElement;
          clonedSvg.setAttribute('width', String(size));
          clonedSvg.setAttribute('height', String(size));
          clonedSvg.setAttribute('viewBox', `${-padding} ${-padding} ${size} ${size}`);
          clonedSvg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');

          // Convertir le SVG en image
          const svgData = new XMLSerializer().serializeToString(clonedSvg);
          const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
          const url = URL.createObjectURL(svgBlob);

          const img = new Image();

          img.onload = () => {
            // Dessiner l'icône
            ctx.drawImage(img, 0, 0, size, size);

            // Nettoyer
            URL.revokeObjectURL(url);
            root.unmount();
            document.body.removeChild(container);

            // Convertir en blob PNG avec transparence
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
      }, 100);
    } catch (error) {
      root.unmount();
      document.body.removeChild(container);
      reject(error);
    }
  });
}

/**
 * Génère un PNG avec gradient (version spéciale)
 */
async function generateGradientIconPNG(
  Icon: LucideIcon,
  iconName: string,
  options: IconExportOptions = {}
): Promise<Blob> {
  const { size = 512, padding = 64 } = options;
  const iconSize = size - padding * 2;

  // Créer un canvas directement
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    throw new Error('Failed to get canvas context');
  }

  // Créer le SVG avec gradient programmatiquement
  const svgNS = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(svgNS, 'svg');
  svg.setAttribute('width', String(size));
  svg.setAttribute('height', String(size));
  svg.setAttribute('viewBox', `0 0 ${size} ${size}`);
  svg.setAttribute('xmlns', svgNS);

  // Ajouter la définition du gradient
  const defs = document.createElementNS(svgNS, 'defs');
  const gradient = document.createElementNS(svgNS, 'linearGradient');
  gradient.setAttribute('id', 'izzico-grad');
  gradient.setAttribute('x1', '0%');
  gradient.setAttribute('y1', '0%');
  gradient.setAttribute('x2', '100%');
  gradient.setAttribute('y2', '100%');

  const stop1 = document.createElementNS(svgNS, 'stop');
  stop1.setAttribute('offset', '0%');
  stop1.setAttribute('stop-color', '#9c5698');

  const stop2 = document.createElementNS(svgNS, 'stop');
  stop2.setAttribute('offset', '100%');
  stop2.setAttribute('stop-color', '#FF5722');

  gradient.appendChild(stop1);
  gradient.appendChild(stop2);
  defs.appendChild(gradient);
  svg.appendChild(defs);

  // Créer un conteneur temporaire pour rendre l'icône
  const tempContainer = document.createElement('div');
  tempContainer.style.position = 'fixed';
  tempContainer.style.left = '-10000px';
  tempContainer.style.top = '-10000px';
  document.body.appendChild(tempContainer);

  const root = createRoot(tempContainer);

  return new Promise((resolve, reject) => {
    try {
      // Rendre l'icône avec une couleur temporaire
      const iconElement = createElement(Icon as any, {
        size: iconSize,
        color: '#000000',
        strokeWidth: 2,
      });

      root.render(iconElement);

      setTimeout(async () => {
        try {
          const renderedSvg = tempContainer.querySelector('svg');
          if (!renderedSvg) {
            throw new Error('No SVG rendered');
          }

          // Copier les paths dans notre SVG avec gradient
          const g = document.createElementNS(svgNS, 'g');
          g.setAttribute('transform', `translate(${padding}, ${padding})`);
          g.setAttribute('stroke', 'url(#izzico-grad)');
          g.setAttribute('fill', 'none');
          g.setAttribute('stroke-width', '2');
          g.setAttribute('stroke-linecap', 'round');
          g.setAttribute('stroke-linejoin', 'round');

          // Copier tous les éléments path, circle, etc.
          const elements = renderedSvg.querySelectorAll('path, circle, line, rect, polyline, polygon, ellipse');
          elements.forEach(el => {
            const cloned = el.cloneNode(true) as SVGElement;
            cloned.removeAttribute('stroke');
            cloned.removeAttribute('color');
            g.appendChild(cloned);
          });

          svg.appendChild(g);

          // Nettoyer le conteneur temporaire
          root.unmount();
          document.body.removeChild(tempContainer);

          // Convertir en image
          const svgData = new XMLSerializer().serializeToString(svg);
          const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
          const url = URL.createObjectURL(svgBlob);

          const img = new Image();

          img.onload = () => {
            ctx.clearRect(0, 0, size, size);
            ctx.drawImage(img, 0, 0, size, size);
            URL.revokeObjectURL(url);

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
            reject(new Error('Failed to load gradient SVG'));
          };

          img.src = url;
        } catch (error) {
          root.unmount();
          document.body.removeChild(tempContainer);
          reject(error);
        }
      }, 100);
    } catch (error) {
      if (tempContainer.parentNode) {
        root.unmount();
        document.body.removeChild(tempContainer);
      }
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

  // Créer les dossiers pour chaque variante (avec catégories ET dossier "all")
  const folders = [
    ...ICON_VARIANTS.map(variant => ({
      variant,
      folderWithCategories: zip.folder(`icons-${variant.name}`),
      folderAll: zip.folder(`all-icons-${variant.name}`),
    })),
    {
      variant: { name: 'gradient', color: 'gradient' },
      folderWithCategories: zip.folder('icons-gradient'),
      folderAll: zip.folder('all-icons-gradient'),
    },
  ];

  // Vérifier que tous les dossiers ont été créés
  for (const { folderWithCategories, folderAll } of folders) {
    if (!folderWithCategories || !folderAll) {
      throw new Error('Failed to create folders');
    }
  }

  // Compter le total d'icônes
  const iconCount = Object.values(iconGroups).reduce(
    (sum, icons) => sum + icons.length,
    0
  );
  const totalIcons = iconCount * 6; // 5 couleurs + 1 gradient

  let currentIcon = 0;
  const errors: string[] = [];
  const successful: string[] = [];

  // Générer tous les icônes
  for (const [category, icons] of Object.entries(iconGroups)) {
    for (const { icon, name } of icons) {
      // Générer les 5 variantes de couleur standard
      for (const { variant, folderWithCategories, folderAll } of folders.slice(0, 5)) {
        if (!folderWithCategories || !folderAll) continue;

        currentIcon++;
        const variantName = `${name} (${variant.name})`;

        if (onProgress) {
          onProgress(currentIcon, totalIcons, variantName);
        }

        try {
          const blob = await generateIconPNG(
            icon,
            name,
            variant.color,
            options
          );

          // Ajouter dans le dossier avec catégories
          const categoryFolder = folderWithCategories.folder(category);
          if (categoryFolder) {
            categoryFolder.file(`${name}.png`, blob);
          }

          // Ajouter aussi dans le dossier "all" (sans catégories)
          folderAll.file(`${name}.png`, blob);

          successful.push(variantName);

          await new Promise(resolve => setTimeout(resolve, 15));
        } catch (error) {
          console.error(`Failed to generate icon ${variantName}:`, error);
          errors.push(`${variantName}: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      }

      // Générer la variante gradient
      const { folderWithCategories: gradientFolderCat, folderAll: gradientFolderAll } = folders[5];
      if (gradientFolderCat && gradientFolderAll) {
        currentIcon++;
        const variantName = `${name} (gradient)`;

        if (onProgress) {
          onProgress(currentIcon, totalIcons, variantName);
        }

        try {
          const blob = await generateGradientIconPNG(icon, name, options);

          // Ajouter dans le dossier avec catégories
          const categoryFolder = gradientFolderCat.folder(category);
          if (categoryFolder) {
            categoryFolder.file(`${name}.png`, blob);
          }

          // Ajouter aussi dans le dossier "all" (sans catégories)
          gradientFolderAll.file(`${name}.png`, blob);

          successful.push(variantName);
          await new Promise(resolve => setTimeout(resolve, 15));
        } catch (error) {
          console.error(`Failed to generate gradient icon ${variantName}:`, error);
          errors.push(`${variantName}: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      }
    }
  }

  // README
  const readme = `# Izzico Icons Export

Generated on: ${new Date().toLocaleString('fr-FR', {
  dateStyle: 'full',
  timeStyle: 'short'
})}

Total icons: ${iconCount}
Total variants: 6
Total files: ${totalIcons} (${iconCount} icons × 6 variants)
Successfully generated: ${successful.length} (${Math.round((successful.length / totalIcons) * 100)}%)
Failed: ${errors.length}
Size: ${options.size || 512}px × ${options.size || 512}px

## Structure

Chaque icône est disponible en 6 variantes, toutes sur fond TRANSPARENT :

1. **icons-black/** - Icônes noirs (#000000) organisés par catégorie
2. **icons-white/** - Icônes blancs (#FFFFFF) organisés par catégorie
3. **icons-purple/** - Icônes violets (#9c5698) organisés par catégorie
4. **icons-orange/** - Icônes oranges (#FF5722) organisés par catégorie
5. **icons-yellow/** - Icônes jaunes (#FFB10B) organisés par catégorie
6. **icons-gradient/** - Icônes avec dégradé Izzico (violet → orange) organisés par catégorie

ET aussi :

7. **all-icons-black/** - Tous les icônes noirs dans un seul dossier (pour Canva)
8. **all-icons-white/** - Tous les icônes blancs dans un seul dossier (pour Canva)
9. **all-icons-purple/** - Tous les icônes violets dans un seul dossier (pour Canva)
10. **all-icons-orange/** - Tous les icônes oranges dans un seul dossier (pour Canva)
11. **all-icons-yellow/** - Tous les icônes jaunes dans un seul dossier (pour Canva)
12. **all-icons-gradient/** - Tous les icônes dégradés dans un seul dossier (pour Canva)

## Organisation

**Dossiers avec catégories** (icons-{color}/) :
- Organisés par catégorie (Navigation, Utilisateurs, Communication, etc.)
- Parfait pour les brand kits et l'organisation
- Structure : icons-black/Navigation/Home.png

**Dossiers sans catégories** (all-icons-{color}/) :
- Tous les icônes au même niveau
- Compatible avec Canva et outils qui n'acceptent pas les sous-dossiers
- Structure : all-icons-black/Home.png

## Couleurs Izzico

- Violet : #9c5698
- Orange : #FF5722
- Jaune : #FFB10B
- Dégradé : #9c5698 → #FF5722

## Usage

Tous les PNG ont un fond transparent et peuvent être utilisés sur n'importe quel fond.

${errors.length > 0 ? `\n## Errors (${errors.length})\n\n${errors.slice(0, 10).map(err => `- ${err}`).join('\n')}${errors.length > 10 ? `\n... et ${errors.length - 10} autres` : ''}` : ''}

---
Izzico Design System ${new Date().getFullYear()}
`;

  zip.file('README.txt', readme);

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
