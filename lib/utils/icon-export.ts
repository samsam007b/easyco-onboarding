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
  isGradient?: boolean;
  gradientId?: string;
}

const ICON_VARIANTS: IconVariant[] = [
  { name: 'black', color: '#000000' },
  { name: 'white', color: '#FFFFFF' },
  { name: 'purple', color: '#9c5698' },
  { name: 'orange', color: '#FF5722' },
  { name: 'yellow', color: '#FFB10B' },
  { name: 'gradient', color: 'url(#easyco-gradient)', isGradient: true, gradientId: 'easyco-gradient' },
];

/**
 * Génère un PNG d'un icône sur fond transparent
 */
async function generateIconPNG(
  Icon: LucideIcon,
  iconName: string,
  iconColor: string,
  isGradient: boolean = false,
  gradientId?: string,
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
        color: isGradient ? iconColor : iconColor,
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

          // Cloner le SVG et s'assurer qu'il a les bons attributs
          const clonedSvg = svgElement.cloneNode(true) as SVGElement;
          clonedSvg.setAttribute('width', String(size));
          clonedSvg.setAttribute('height', String(size));
          clonedSvg.setAttribute('viewBox', `0 0 ${size} ${size}`);
          clonedSvg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');

          // Si c'est un gradient, ajouter la définition du gradient
          if (isGradient && gradientId) {
            const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
            const linearGradient = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
            linearGradient.setAttribute('id', gradientId);
            linearGradient.setAttribute('x1', '0%');
            linearGradient.setAttribute('y1', '0%');
            linearGradient.setAttribute('x2', '100%');
            linearGradient.setAttribute('y2', '100%');

            const stop1 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
            stop1.setAttribute('offset', '0%');
            stop1.setAttribute('style', 'stop-color:#9c5698;stop-opacity:1');

            const stop2 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
            stop2.setAttribute('offset', '100%');
            stop2.setAttribute('style', 'stop-color:#FF5722;stop-opacity:1');

            linearGradient.appendChild(stop1);
            linearGradient.appendChild(stop2);
            defs.appendChild(linearGradient);
            clonedSvg.insertBefore(defs, clonedSvg.firstChild);
          }

          // Créer un groupe pour centrer l'icône avec le padding
          const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
          g.setAttribute('transform', `translate(${padding}, ${padding})`);

          // Déplacer tous les enfants du SVG dans le groupe
          while (clonedSvg.firstChild) {
            if (clonedSvg.firstChild.nodeName !== 'defs') {
              g.appendChild(clonedSvg.firstChild);
            } else {
              const defsNode = clonedSvg.firstChild;
              clonedSvg.removeChild(defsNode);
              clonedSvg.appendChild(defsNode);
            }
          }

          // Ajouter le groupe au SVG
          clonedSvg.appendChild(g);

          // Mettre à jour les attributs de taille dans le groupe
          const innerSvg = g.querySelector('svg');
          if (innerSvg) {
            innerSvg.setAttribute('width', String(iconSize));
            innerSvg.setAttribute('height', String(iconSize));
          }

          // Appliquer la couleur ou le gradient à tous les éléments stroke
          const strokeElements = g.querySelectorAll('[stroke]');
          strokeElements.forEach(el => {
            el.setAttribute('stroke', iconColor);
          });

          // Créer un canvas
          const canvas = document.createElement('canvas');
          canvas.width = size;
          canvas.height = size;
          const ctx = canvas.getContext('2d');

          if (!ctx) {
            throw new Error('Failed to get canvas context');
          }

          // NE PAS dessiner de fond - laisser transparent
          // ctx.fillStyle est ignoré pour garder la transparence

          // Convertir le SVG en image
          const svgData = new XMLSerializer().serializeToString(clonedSvg);
          const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
          const url = URL.createObjectURL(svgBlob);

          const img = new Image();

          img.onload = () => {
            // Dessiner l'icône (le canvas reste transparent)
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
 * Exporte tous les icônes dans un fichier ZIP
 */
export async function exportAllIcons(
  iconGroups: Record<string, Array<{ icon: LucideIcon; name: string }>>,
  options: IconExportOptions = {},
  onProgress?: (current: number, total: number, iconName: string) => void
): Promise<Blob> {
  const zip = new JSZip();

  // Créer les dossiers pour chaque variante
  const folders = ICON_VARIANTS.map(variant => ({
    variant,
    folder: zip.folder(`icons-${variant.name}`),
  }));

  // Vérifier que tous les dossiers ont été créés
  for (const { folder } of folders) {
    if (!folder) {
      throw new Error('Failed to create folders');
    }
  }

  // Compter le total d'icônes (nombre d'icônes × nombre de variantes)
  const iconCount = Object.values(iconGroups).reduce(
    (sum, icons) => sum + icons.length,
    0
  );
  const totalIcons = iconCount * ICON_VARIANTS.length;

  let currentIcon = 0;
  const errors: string[] = [];
  const successful: string[] = [];

  // Générer tous les icônes pour chaque variante
  for (const [category, icons] of Object.entries(iconGroups)) {
    for (const { icon, name } of icons) {
      // Générer chaque variante de couleur
      for (const { variant, folder } of folders) {
        if (!folder) continue;

        currentIcon++;

        const variantName = `${name} (${variant.name})`;

        if (onProgress) {
          onProgress(currentIcon, totalIcons, variantName);
        }

        try {
          const categoryFolder = folder.folder(category);
          if (!categoryFolder) continue;

          const blob = await generateIconPNG(
            icon,
            name,
            variant.color,
            variant.isGradient || false,
            variant.gradientId,
            options
          );

          categoryFolder.file(`${name}.png`, blob);
          successful.push(variantName);

          // Petit délai pour éviter de surcharger le navigateur
          await new Promise(resolve => setTimeout(resolve, 20));
        } catch (error) {
          console.error(`Failed to generate icon ${variantName}:`, error);
          errors.push(`${variantName}: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      }
    }
  }

  // Ajouter un fichier README
  const readme = `# EasyCo Icons Export

Generated on: ${new Date().toLocaleString('fr-FR', {
  dateStyle: 'full',
  timeStyle: 'short'
})}

Total icons: ${iconCount}
Total variants: ${ICON_VARIANTS.length}
Total files: ${totalIcons} (${iconCount} icons × ${ICON_VARIANTS.length} variants)
Successfully generated: ${successful.length} (${Math.round((successful.length / totalIcons) * 100)}%)
Failed: ${errors.length}
Size: ${options.size || 512}px × ${options.size || 512}px

## Structure

Chaque icône est disponible en 6 variantes de couleur, toutes sur fond TRANSPARENT :

1. **icons-black/** - Icônes noirs (#000000)
2. **icons-white/** - Icônes blancs (#FFFFFF)
3. **icons-purple/** - Icônes violets (#9c5698)
4. **icons-orange/** - Icônes oranges (#FF5722)
5. **icons-yellow/** - Icônes jaunes (#FFB10B)
6. **icons-gradient/** - Icônes avec dégradé signature EasyCo (violet → orange)

Chaque dossier contient des sous-dossiers par catégorie.

## Couleurs EasyCo

- **Violet** : #9c5698 (couleur signature)
- **Orange** : #FF5722 (accent énergique)
- **Jaune** : #FFB10B (chaleur et optimisme)
- **Dégradé** : De violet (#9c5698) à orange (#FF5722)

## Usage

Ces icônes sont prêts à être utilisés dans :
- Présentations (PowerPoint, Keynote, Google Slides)
- Brand kits (Figma, Sketch, Adobe XD)
- Documents marketing
- Sites web et applications
- Supports imprimés

Tous les icônes sont en PNG haute qualité avec fond transparent.

## Exemples d'utilisation

**Présentation sur fond blanc** : Utilisez icons-black/ ou icons-purple/
**Présentation sur fond sombre** : Utilisez icons-white/ ou icons-yellow/
**Design moderne** : Utilisez icons-gradient/ pour l'effet signature
**Print couleur** : Utilisez icons-orange/ ou icons-purple/ selon votre charte

${errors.length > 0 ? `\n## Errors Encountered\n\n${errors.slice(0, 20).map(err => `- ${err}`).join('\n')}${errors.length > 20 ? `\n... et ${errors.length - 20} autres erreurs` : ''}` : ''}

---
EasyCo Design System
${new Date().getFullYear()}

Nombre total d'icônes générés avec succès : ${successful.length}
Catégories : ${Object.keys(iconGroups).length}
`;

  zip.file('README.txt', readme);

  // Ajouter un fichier de référence des couleurs
  const colorReference = `# EasyCo Color Reference

## Palette de couleurs

### Couleurs principales
- Noir : #000000
- Blanc : #FFFFFF

### Couleurs de marque
- Violet EasyCo : #9c5698
- Orange EasyCo : #FF5722
- Jaune EasyCo : #FFB10B

### Dégradé signature
- Début : #9c5698 (Violet)
- Fin : #FF5722 (Orange)
- Direction : Diagonale (top-left to bottom-right)

## Utilisation recommandée

**Violet (#9c5698)**
- Professionnel et élégant
- Idéal pour : Titres, éléments importants, boutons principaux

**Orange (#FF5722)**
- Énergique et dynamique
- Idéal pour : Appels à l'action, éléments interactifs, accents

**Jaune (#FFB10B)**
- Chaleureux et optimiste
- Idéal pour : Highlights, badges, notifications positives

**Dégradé**
- Premium et moderne
- Idéal pour : Logos, headers, éléments de marque forts

**Noir (#000000)**
- Classique et universel
- Idéal pour : Documents professionnels, présentations formelles

**Blanc (#FFFFFF)**
- Propre et minimaliste
- Idéal pour : Fonds sombres, designs modernes
`;

  zip.file('COLOR_REFERENCE.txt', colorReference);

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
