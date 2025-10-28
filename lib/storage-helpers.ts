import { createClient } from './auth/supabase-client'

const BUCKET_NAME = 'property-images'

/**
 * Upload a property image to Supabase Storage
 *
 * @param file - The image file to upload
 * @param propertyId - The ID of the property
 * @returns Object with success status and URL or error
 */
export async function uploadPropertyImage(file: File, propertyId: string) {
  const supabase = createClient()

  try {
    // Validate file
    if (!file.type.startsWith('image/')) {
      return { success: false, error: 'File must be an image' }
    }

    // Max 5MB
    if (file.size > 5 * 1024 * 1024) {
      return { success: false, error: 'Image must be less than 5MB' }
    }

    // Generate unique filename
    const fileExt = file.name.split('.').pop()
    const fileName = `${propertyId}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      })

    if (error) throw error

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(fileName)

    return {
      success: true,
      url: publicUrl,
      path: data.path
    }
  } catch (error: any) {
    // FIXME: Use logger.error - 'Error uploading image:', error)
    return { success: false, error: error.message }
  }
}

/**
 * Upload multiple property images
 *
 * @param files - Array of image files to upload
 * @param propertyId - The ID of the property
 * @returns Object with success status and array of URLs or error
 */
export async function uploadPropertyImages(files: File[], propertyId: string) {
  try {
    const uploadPromises = files.map(file => uploadPropertyImage(file, propertyId))
    const results = await Promise.all(uploadPromises)

    const successfulUploads = results.filter(r => r.success)
    const failedUploads = results.filter(r => !r.success)

    if (failedUploads.length > 0) {
      // FIXME: Use logger.warn(`${failedUploads.length} images failed to upload`)
    }

    return {
      success: successfulUploads.length > 0,
      urls: successfulUploads.map(r => r.url!),
      paths: successfulUploads.map(r => r.path!),
      failedCount: failedUploads.length
    }
  } catch (error: any) {
    // FIXME: Use logger.error - 'Error uploading images:', error)
    return { success: false, error: error.message, urls: [], paths: [], failedCount: files.length }
  }
}

/**
 * Delete a property image from Supabase Storage
 *
 * @param imagePath - The storage path of the image
 * @returns Object with success status
 */
export async function deletePropertyImage(imagePath: string) {
  const supabase = createClient()

  try {
    const { error } = await supabase.storage
      .from(BUCKET_NAME)
      .remove([imagePath])

    if (error) throw error

    return { success: true }
  } catch (error: any) {
    // FIXME: Use logger.error - 'Error deleting image:', error)
    return { success: false, error: error.message }
  }
}

/**
 * Delete all images for a property
 *
 * @param propertyId - The ID of the property
 * @returns Object with success status
 */
export async function deleteAllPropertyImages(propertyId: string) {
  const supabase = createClient()

  try {
    // List all files in the property folder
    const { data: files, error: listError } = await supabase.storage
      .from(BUCKET_NAME)
      .list(propertyId)

    if (listError) throw listError

    if (!files || files.length === 0) {
      return { success: true }
    }

    // Delete all files
    const filePaths = files.map(file => `${propertyId}/${file.name}`)
    const { error: deleteError } = await supabase.storage
      .from(BUCKET_NAME)
      .remove(filePaths)

    if (deleteError) throw deleteError

    return { success: true }
  } catch (error: any) {
    // FIXME: Use logger.error - 'Error deleting property images:', error)
    return { success: false, error: error.message }
  }
}

/**
 * Get all images for a property
 *
 * @param propertyId - The ID of the property
 * @returns Object with success status and array of public URLs
 */
export async function getPropertyImages(propertyId: string) {
  const supabase = createClient()

  try {
    const { data: files, error } = await supabase.storage
      .from(BUCKET_NAME)
      .list(propertyId, {
        sortBy: { column: 'created_at', order: 'asc' }
      })

    if (error) throw error

    if (!files || files.length === 0) {
      return { success: true, urls: [] }
    }

    const urls = files.map(file => {
      const { data: { publicUrl } } = supabase.storage
        .from(BUCKET_NAME)
        .getPublicUrl(`${propertyId}/${file.name}`)
      return publicUrl
    })

    return { success: true, urls }
  } catch (error: any) {
    // FIXME: Use logger.error - 'Error getting property images:', error)
    return { success: false, error: error.message, urls: [] }
  }
}
