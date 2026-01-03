/**
 * Document Vault Service
 * Handles: Document upload, download, sharing, search, expiration tracking
 */

import { createClient } from '@/lib/auth/supabase-client';

// ============================================================================
// i18n TRANSLATIONS
// ============================================================================
type Language = 'fr' | 'en' | 'nl' | 'de';

let currentLang: Language = 'fr';

export function setDocumentServiceLanguage(lang: Language) {
  currentLang = lang;
}

const translations = {
  unknownUser: {
    fr: 'Utilisateur inconnu',
    en: 'Unknown user',
    nl: 'Onbekende gebruiker',
    de: 'Unbekannter Benutzer',
  },
  errors: {
    uploadFile: {
      fr: "Erreur lors de l'upload du fichier",
      en: 'Error uploading the file',
      nl: 'Fout bij het uploaden van het bestand',
      de: 'Fehler beim Hochladen der Datei',
    },
    uploadDocument: {
      fr: "Erreur lors de l'upload du document",
      en: 'Error uploading the document',
      nl: 'Fout bij het uploaden van het document',
      de: 'Fehler beim Hochladen des Dokuments',
    },
    deleteDocument: {
      fr: 'Erreur lors de la suppression',
      en: 'Error deleting the document',
      nl: 'Fout bij het verwijderen',
      de: 'Fehler beim Löschen',
    },
    shareDocument: {
      fr: 'Erreur lors du partage',
      en: 'Error sharing the document',
      nl: 'Fout bij het delen',
      de: 'Fehler beim Teilen',
    },
    removeShare: {
      fr: 'Erreur lors de la suppression du partage',
      en: 'Error removing the share',
      nl: 'Fout bij het verwijderen van de deling',
      de: 'Fehler beim Entfernen der Freigabe',
    },
  },
};
import type {
  PropertyDocument,
  PropertyDocumentWithUploader,
  DocumentShare,
  DocumentShareWithUser,
  UploadDocumentForm,
  ShareDocumentForm,
  DocumentStats,
  DocumentCategory,
} from '@/types/documents.types';
import { isDocumentExpired, isDocumentExpiringSoon } from '@/types/documents.types';

class DocumentService {
  private supabase = createClient();

  /**
   * Get all documents for a property
   */
  async getDocuments(
    propertyId: string,
    filters?: {
      category?: DocumentCategory;
      showExpired?: boolean;
    }
  ): Promise<PropertyDocumentWithUploader[]> {
    try {
      let query = this.supabase
        .from('property_documents')
        .select(
          `
          *,
          profiles!uploaded_by (
            full_name,
            avatar_url
          )
        `
        )
        .eq('property_id', propertyId)
        .order('created_at', { ascending: false });

      // Apply filters
      if (filters?.category) {
        query = query.eq('category', filters.category);
      }

      if (!filters?.showExpired) {
        // Exclude expired documents by default
        query = query.or(`expires_at.is.null,expires_at.gte.${new Date().toISOString().split('T')[0]}`);
      }

      const { data, error } = await query;

      if (error) throw error;

      const enriched: PropertyDocumentWithUploader[] =
        data?.map((doc) => ({
          ...doc,
          uploader_name: (doc.profiles as any)?.full_name || translations.unknownUser[currentLang],
          uploader_avatar: (doc.profiles as any)?.avatar_url,
          is_expired: isDocumentExpired(doc.expires_at),
          is_expiring_soon: isDocumentExpiringSoon(doc.expires_at),
        })) || [];

      console.log(`[Documents] ✅ Fetched ${enriched.length} documents`);
      return enriched;
    } catch (error) {
      console.error('[Documents] ❌ Failed to fetch documents:', error);
      return [];
    }
  }

  /**
   * Get a single document by ID
   */
  async getDocument(documentId: string): Promise<PropertyDocumentWithUploader | null> {
    try {
      const { data, error } = await this.supabase
        .from('property_documents')
        .select(
          `
          *,
          profiles!uploaded_by (
            full_name,
            avatar_url
          )
        `
        )
        .eq('id', documentId)
        .single();

      if (error) throw error;

      const enriched: PropertyDocumentWithUploader = {
        ...data,
        uploader_name: (data.profiles as any)?.full_name || translations.unknownUser[currentLang],
        uploader_avatar: (data.profiles as any)?.avatar_url,
        is_expired: isDocumentExpired(data.expires_at),
        is_expiring_soon: isDocumentExpiringSoon(data.expires_at),
      };

      return enriched;
    } catch (error) {
      console.error('[Documents] ❌ Failed to fetch document:', error);
      return null;
    }
  }

  /**
   * Upload a new document
   */
  async uploadDocument(
    propertyId: string,
    userId: string,
    form: UploadDocumentForm
  ): Promise<{ success: boolean; document?: PropertyDocument; error?: string }> {
    try {
      // Upload file to storage
      const fileResult = await this.uploadFile(propertyId, userId, form.file);

      if (!fileResult.success || !fileResult.url) {
        return {
          success: false,
          error: fileResult.error || translations.errors.uploadFile[currentLang],
        };
      }

      // Create document record
      const { data: document, error } = await this.supabase
        .from('property_documents')
        .insert({
          property_id: propertyId,
          uploaded_by: userId,
          title: form.title,
          description: form.description || null,
          category: form.category,
          file_url: fileResult.url,
          file_name: form.file.name,
          file_size: form.file.size,
          file_type: form.file.type,
          is_private: form.is_private || false,
          expires_at: form.expires_at || null,
          tags: form.tags || [],
        })
        .select()
        .single();

      if (error) throw error;

      console.log('[Documents] ✅ Document uploaded:', document.id);

      return { success: true, document };
    } catch (error: any) {
      console.error('[Documents] ❌ Failed to upload document:', error);
      return {
        success: false,
        error: error.message || translations.errors.uploadDocument[currentLang],
      };
    }
  }

  /**
   * Upload file to Supabase Storage
   */
  private async uploadFile(
    propertyId: string,
    userId: string,
    file: File
  ): Promise<{ success: boolean; url?: string; error?: string }> {
    try {
      const fileName = `documents/${propertyId}/${userId}/${Date.now()}_${file.name}`;

      const { data, error } = await this.supabase.storage
        .from('property-documents')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (error) throw error;

      // Get public URL
      const {
        data: { publicUrl },
      } = this.supabase.storage.from('property-documents').getPublicUrl(data.path);

      return { success: true, url: publicUrl };
    } catch (error: any) {
      console.error('[Documents] ❌ Failed to upload file:', error);
      return {
        success: false,
        error: error.message || translations.errors.uploadFile[currentLang],
      };
    }
  }

  /**
   * Delete a document
   */
  async deleteDocument(documentId: string): Promise<{ success: boolean; error?: string }> {
    try {
      // Get document to delete file from storage
      const { data: doc } = await this.supabase
        .from('property_documents')
        .select('file_url')
        .eq('id', documentId)
        .single();

      if (doc?.file_url) {
        // Extract path from URL and delete from storage
        const path = doc.file_url.split('/property-documents/')[1];
        if (path) {
          await this.supabase.storage.from('property-documents').remove([path]);
        }
      }

      // Delete document record
      const { error } = await this.supabase
        .from('property_documents')
        .delete()
        .eq('id', documentId);

      if (error) throw error;

      console.log('[Documents] ✅ Document deleted:', documentId);

      return { success: true };
    } catch (error: any) {
      console.error('[Documents] ❌ Failed to delete document:', error);
      return {
        success: false,
        error: error.message || translations.errors.deleteDocument[currentLang],
      };
    }
  }

  /**
   * Share a document with a user
   */
  async shareDocument(
    documentId: string,
    userId: string,
    form: ShareDocumentForm
  ): Promise<{ success: boolean; share?: DocumentShare; error?: string }> {
    try {
      const { data: share, error } = await this.supabase
        .from('document_shares')
        .insert({
          document_id: documentId,
          shared_with: form.user_id,
          can_download: form.can_download,
          can_delete: form.can_delete,
          shared_by: userId,
        })
        .select()
        .single();

      if (error) throw error;

      console.log('[Documents] ✅ Document shared:', share.id);

      return { success: true, share };
    } catch (error: any) {
      console.error('[Documents] ❌ Failed to share document:', error);
      return {
        success: false,
        error: error.message || translations.errors.shareDocument[currentLang],
      };
    }
  }

  /**
   * Get shares for a document
   */
  async getShares(documentId: string): Promise<DocumentShareWithUser[]> {
    try {
      const { data, error } = await this.supabase
        .from('document_shares')
        .select(
          `
          *,
          profiles!shared_with (
            full_name,
            avatar_url
          )
        `
        )
        .eq('document_id', documentId);

      if (error) throw error;

      const enriched: DocumentShareWithUser[] =
        data?.map((share) => ({
          ...share,
          user_name: (share.profiles as any)?.full_name || translations.unknownUser[currentLang],
          user_avatar: (share.profiles as any)?.avatar_url,
        })) || [];

      return enriched;
    } catch (error) {
      console.error('[Documents] ❌ Failed to fetch shares:', error);
      return [];
    }
  }

  /**
   * Remove a share
   */
  async removeShare(shareId: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await this.supabase.from('document_shares').delete().eq('id', shareId);

      if (error) throw error;

      console.log('[Documents] ✅ Share removed:', shareId);

      return { success: true };
    } catch (error: any) {
      console.error('[Documents] ❌ Failed to remove share:', error);
      return {
        success: false,
        error: error.message || translations.errors.removeShare[currentLang],
      };
    }
  }

  /**
   * Search documents
   */
  async searchDocuments(propertyId: string, query: string): Promise<PropertyDocument[]> {
    try {
      const { data, error } = await this.supabase.rpc('search_documents', {
        p_property_id: propertyId,
        p_query: query,
      });

      if (error) throw error;

      console.log(`[Documents] ✅ Search found ${data?.length || 0} results`);

      return data || [];
    } catch (error) {
      console.error('[Documents] ❌ Search failed:', error);
      return [];
    }
  }

  /**
   * Get document statistics
   */
  async getStats(propertyId: string): Promise<DocumentStats> {
    try {
      const { data, error } = await this.supabase.rpc('get_document_stats', {
        p_property_id: propertyId,
      });

      if (error) throw error;

      if (!data || data.length === 0) {
        return {
          total_documents: 0,
          total_size_bytes: 0,
          by_category: {} as any,
          expiring_soon: 0,
          expired: 0,
        };
      }

      const stats = data[0];

      return {
        total_documents: stats.total_documents || 0,
        total_size_bytes: stats.total_size_bytes || 0,
        by_category: stats.by_category || {},
        expiring_soon: stats.expiring_soon || 0,
        expired: stats.expired || 0,
      };
    } catch (error) {
      console.error('[Documents] ❌ Failed to get stats:', error);
      return {
        total_documents: 0,
        total_size_bytes: 0,
        by_category: {} as any,
        expiring_soon: 0,
        expired: 0,
      };
    }
  }

  /**
   * Get expiring documents (within 30 days)
   */
  async getExpiringDocuments(propertyId: string): Promise<PropertyDocumentWithUploader[]> {
    try {
      const today = new Date().toISOString().split('T')[0];
      const thirtyDaysFromNow = new Date();
      thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
      const futureDate = thirtyDaysFromNow.toISOString().split('T')[0];

      const { data, error } = await this.supabase
        .from('property_documents')
        .select(
          `
          *,
          profiles!uploaded_by (
            full_name,
            avatar_url
          )
        `
        )
        .eq('property_id', propertyId)
        .gte('expires_at', today)
        .lte('expires_at', futureDate)
        .order('expires_at', { ascending: true });

      if (error) throw error;

      const enriched: PropertyDocumentWithUploader[] =
        data?.map((doc) => ({
          ...doc,
          uploader_name: (doc.profiles as any)?.full_name || translations.unknownUser[currentLang],
          uploader_avatar: (doc.profiles as any)?.avatar_url,
          is_expired: false,
          is_expiring_soon: true,
        })) || [];

      return enriched;
    } catch (error) {
      console.error('[Documents] ❌ Failed to fetch expiring documents:', error);
      return [];
    }
  }
}

export const documentService = new DocumentService();
