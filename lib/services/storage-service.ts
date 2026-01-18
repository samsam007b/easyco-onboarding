import { createClient } from '@/lib/auth/supabase-client';

export class StorageService {
  private supabase = createClient();

  // NOTE: Image compression with Sharp moved to API routes (server-side only)
  // See: app/api/storage/upload-image/route.ts
  // Reason: Sharp requires Node.js APIs not available in browser

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
   * Upload property image
   * TODO: Add server-side compression via API route
   */
  async uploadPropertyImage(
    file: File,
    propertyId: string
  ): Promise<{ success: boolean; url?: string; error?: string }> {
    return this.uploadFile(file, 'property-images', propertyId);
  }

  /**
   * Upload profile photo
   * TODO: Add server-side compression via API route
   */
  async uploadProfilePhoto(
    file: File,
    userId: string
  ): Promise<{ success: boolean; url?: string; error?: string }> {
    return this.uploadFile(file, 'profile-photos', userId);
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
