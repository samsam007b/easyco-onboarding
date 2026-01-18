import { createClient } from '@/lib/auth/supabase-client';
import sharp from 'sharp';

export class StorageService {
  private supabase = createClient();

  /**
   * Optimise une image avant upload
   * - Conversion WebP (meilleur ratio compression)
   * - Redimensionnement adaptatif
   * - Qualité 85 (imperceptible vs 100, -50% taille)
   *
   * @param file Image file à optimiser
   * @param options Type et dimensions max
   * @returns File optimisé + statistiques de compression
   */
  private async optimizeImage(
    file: File,
    options: {
      type: 'avatar' | 'property' | 'document';
      maxWidth?: number;
      maxHeight?: number;
      quality?: number;
    }
  ): Promise<{ file: File; originalSize: number; optimizedSize: number; reduction: number }> {
    const originalSize = file.size;

    // Skip si pas une image
    if (!file.type.startsWith('image/')) {
      return {
        file,
        originalSize,
        optimizedSize: originalSize,
        reduction: 0,
      };
    }

    try {
      const buffer = Buffer.from(await file.arrayBuffer());
      let optimized: Buffer;

      switch (options.type) {
        case 'avatar':
          // Avatar : carré 512×512, WebP qualité 85
          optimized = await sharp(buffer)
            .resize(512, 512, {
              fit: 'cover',
              position: 'center',
            })
            .webp({ quality: options.quality || 85 })
            .toBuffer();
          break;

        case 'property':
          // Propriété : max 2048px largeur, conserve ratio, WebP 85
          optimized = await sharp(buffer)
            .resize(options.maxWidth || 2048, options.maxHeight || null, {
              fit: 'inside',
              withoutEnlargement: true,
            })
            .webp({ quality: options.quality || 85 })
            .toBuffer();
          break;

        case 'document':
          // Documents : pas de compression (PDF, etc.)
          return {
            file,
            originalSize,
            optimizedSize: originalSize,
            reduction: 0,
          };

        default:
          return {
            file,
            originalSize,
            optimizedSize: originalSize,
            reduction: 0,
          };
      }

      const optimizedSize = optimized.length;
      const reduction = ((originalSize - optimizedSize) / originalSize) * 100;

      // Créer nouveau File avec buffer optimisé
      const blob = new Blob([optimized], { type: 'image/webp' });
      const optimizedFile = new File([blob], file.name.replace(/\.\w+$/, '.webp'), {
        type: 'image/webp',
      });

      console.log(
        `[Storage] Image optimized: ${(originalSize / 1024).toFixed(0)} KB → ${(
          optimizedSize / 1024
        ).toFixed(0)} KB (-${reduction.toFixed(1)}%)`
      );

      return {
        file: optimizedFile,
        originalSize,
        optimizedSize,
        reduction,
      };
    } catch (error) {
      console.error('[Storage] Error optimizing image:', error);
      // En cas d'erreur, retourner le fichier original
      return {
        file,
        originalSize,
        optimizedSize: originalSize,
        reduction: 0,
      };
    }
  }

  /**
   * Upload a file to Supabase Storage
   * @param file File to upload
   * @param bucket Storage bucket name
   * @param folder Optional folder path within bucket
   * @returns Public URL of uploaded file
   */
  async uploadFile(
    file: File,
    bucket: string,
    folder?: string
  ): Promise<{ success: boolean; url?: string; error?: string }> {
    try {
      // Validate file
      if (!file) {
        return { success: false, error: 'No file provided' };
      }

      // Generate unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = folder ? `${folder}/${fileName}` : fileName;

      // Upload file
      const { data, error } = await this.supabase.storage
        .from(bucket)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (error) {
        console.error('Upload error:', error);
        return { success: false, error: error.message };
      }

      // Get public URL
      const { data: { publicUrl } } = this.supabase.storage
        .from(bucket)
        .getPublicUrl(data.path);

      return { success: true, url: publicUrl };
    } catch (error: any) {
      console.error('Upload error:', error);
      return { success: false, error: error.message || 'Upload failed' };
    }
  }

  /**
   * Upload multiple files
   */
  async uploadMultipleFiles(
    files: File[],
    bucket: string,
    folder?: string
  ): Promise<{ success: boolean; urls?: string[]; errors?: string[] }> {
    const urls: string[] = [];
    const errors: string[] = [];

    for (const file of files) {
      const result = await this.uploadFile(file, bucket, folder);
      if (result.success && result.url) {
        urls.push(result.url);
      } else {
        errors.push(result.error || 'Upload failed');
      }
    }

    return {
      success: errors.length === 0,
      urls: urls.length > 0 ? urls : undefined,
      errors: errors.length > 0 ? errors : undefined,
    };
  }

  /**
   * Delete a file from storage
   */
  async deleteFile(bucket: string, filePath: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await this.supabase.storage.from(bucket).remove([filePath]);

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message || 'Delete failed' };
    }
  }

  /**
   * Upload application document
   */
  async uploadApplicationDocument(
    file: File,
    userId: string,
    documentType: 'id' | 'income' | 'reference'
  ): Promise<{ success: boolean; url?: string; error?: string }> {
    return this.uploadFile(file, 'application-documents', `${userId}/${documentType}`);
  }

  /**
   * Upload property image (avec compression automatique)
   * Optimise automatiquement : max 2048px, WebP quality 85
   * Réduction attendue : 5 MB → 500 KB (90%)
   */
  async uploadPropertyImage(
    file: File,
    propertyId: string
  ): Promise<{ success: boolean; url?: string; error?: string; stats?: any }> {
    // Optimiser l'image avant upload
    const { file: optimizedFile, originalSize, optimizedSize, reduction } =
      await this.optimizeImage(file, {
        type: 'property',
        maxWidth: 2048,
        quality: 85,
      });

    const result = await this.uploadFile(optimizedFile, 'property-images', propertyId);

    return {
      ...result,
      stats: {
        originalSize,
        optimizedSize,
        reduction,
      },
    };
  }

  /**
   * Upload profile photo (avec compression automatique)
   * Optimise automatiquement : 512×512px carré, WebP quality 85
   * Réduction attendue : 2 MB → 100 KB (95%)
   */
  async uploadProfilePhoto(
    file: File,
    userId: string
  ): Promise<{ success: boolean; url?: string; error?: string; stats?: any }> {
    // Optimiser l'image avant upload
    const { file: optimizedFile, originalSize, optimizedSize, reduction } =
      await this.optimizeImage(file, {
        type: 'avatar',
        quality: 85,
      });

    const result = await this.uploadFile(optimizedFile, 'profile-photos', userId);

    return {
      ...result,
      stats: {
        originalSize,
        optimizedSize,
        reduction,
      },
    };
  }

  /**
   * Validate file before upload
   */
  validateFile(
    file: File,
    options: {
      maxSizeMB?: number;
      allowedTypes?: string[];
    } = {}
  ): { valid: boolean; error?: string } {
    const { maxSizeMB = 10, allowedTypes = ['image/*', 'application/pdf'] } = options;

    // Check file size
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      return { valid: false, error: `File size must be less than ${maxSizeMB}MB` };
    }

    // Check file type
    const isAllowed = allowedTypes.some((type) => {
      if (type.endsWith('/*')) {
        const prefix = type.slice(0, -2);
        return file.type.startsWith(prefix);
      }
      return file.type === type;
    });

    if (!isAllowed) {
      return { valid: false, error: 'File type not allowed' };
    }

    return { valid: true };
  }

  /**
   * Get file path from public URL
   */
  getFilePathFromUrl(url: string, bucket: string): string | null {
    try {
      const urlObj = new URL(url);
      const pathParts = urlObj.pathname.split(`/${bucket}/`);
      return pathParts.length > 1 ? pathParts[1] : null;
    } catch {
      return null;
    }
  }
}

// Export singleton instance
export const storageService = new StorageService();
