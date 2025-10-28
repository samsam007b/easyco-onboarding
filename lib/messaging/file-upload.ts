import { createClient } from '@/lib/auth/supabase-client'

/**
 * File Upload Utilities for Messaging
 * Handles file uploads to Supabase Storage
 */

export const ALLOWED_FILE_TYPES = {
  images: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'],
  documents: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
  all: [] as string[],
}

ALLOWED_FILE_TYPES.all = [...ALLOWED_FILE_TYPES.images, ...ALLOWED_FILE_TYPES.documents]

export const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
export const STORAGE_BUCKET = 'message-attachments'

export interface UploadResult {
  success: boolean
  url?: string
  error?: string
  fileName?: string
  fileSize?: number
  fileType?: string
}

/**
 * Validate file before upload
 */
export function validateFile(file: File): { valid: boolean; error?: string } {
  // Check file size
  if (file.size > MAX_FILE_SIZE) {
    return {
      valid: false,
      error: `File size must be less than ${MAX_FILE_SIZE / 1024 / 1024}MB`,
    }
  }

  // Check file type
  if (!ALLOWED_FILE_TYPES.all.includes(file.type)) {
    return {
      valid: false,
      error: 'File type not allowed. Supported: Images (JPG, PNG, WebP, GIF) and Documents (PDF, DOC, DOCX)',
    }
  }

  return { valid: true }
}

/**
 * Upload file to Supabase Storage
 */
export async function uploadMessageAttachment(
  file: File,
  conversationId: string,
  userId: string
): Promise<UploadResult> {
  const supabase = createClient()

  try {
    // Validate file
    const validation = validateFile(file)
    if (!validation.valid) {
      return {
        success: false,
        error: validation.error,
      }
    }

    // Generate unique filename
    const timestamp = Date.now()
    const randomString = Math.random().toString(36).substring(7)
    const fileExt = file.name.split('.').pop()
    const fileName = `${conversationId}/${userId}/${timestamp}-${randomString}.${fileExt}`

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from(STORAGE_BUCKET)
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false,
      })

    if (error) {
      // FIXME: Use logger.error - 'Upload error:', error)
      return {
        success: false,
        error: error.message,
      }
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from(STORAGE_BUCKET)
      .getPublicUrl(data.path)

    return {
      success: true,
      url: urlData.publicUrl,
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type,
    }
  } catch (error: any) {
    // FIXME: Use logger.error - 'Upload exception:', error)
    return {
      success: false,
      error: error.message || 'Failed to upload file',
    }
  }
}

/**
 * Delete file from Supabase Storage
 */
export async function deleteMessageAttachment(fileUrl: string): Promise<boolean> {
  const supabase = createClient()

  try {
    // Extract file path from URL
    const url = new URL(fileUrl)
    const pathParts = url.pathname.split('/')
    const bucketIndex = pathParts.indexOf(STORAGE_BUCKET)

    if (bucketIndex === -1) {
      // FIXME: Use logger.error - 'Invalid file URL')
      return false
    }

    const filePath = pathParts.slice(bucketIndex + 1).join('/')

    // Delete from storage
    const { error } = await supabase.storage
      .from(STORAGE_BUCKET)
      .remove([filePath])

    if (error) {
      // FIXME: Use logger.error - 'Delete error:', error)
      return false
    }

    return true
  } catch (error) {
    // FIXME: Use logger.error - 'Delete exception:', error)
    return false
  }
}

/**
 * Get file type category (image, document, etc.)
 */
export function getFileCategory(mimeType: string): 'image' | 'document' | 'unknown' {
  if (ALLOWED_FILE_TYPES.images.includes(mimeType)) {
    return 'image'
  }
  if (ALLOWED_FILE_TYPES.documents.includes(mimeType)) {
    return 'document'
  }
  return 'unknown'
}

/**
 * Format file size for display
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'

  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
}

/**
 * Check if file is an image
 */
export function isImageFile(mimeType: string): boolean {
  return ALLOWED_FILE_TYPES.images.includes(mimeType)
}

/**
 * Check if file is a document
 */
export function isDocumentFile(mimeType: string): boolean {
  return ALLOWED_FILE_TYPES.documents.includes(mimeType)
}
