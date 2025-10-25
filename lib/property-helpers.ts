import { createClient } from './auth/supabase-client'
import type {
  Property,
  CreatePropertyInput,
  UpdatePropertyInput,
  PropertyFilters,
  PropertyListResponse
} from '@/types/property.types'

/**
 * Create a new property
 */
export async function createProperty(data: CreatePropertyInput) {
  const supabase = createClient()

  try {
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return { success: false, error: 'User not authenticated' }
    }

    const { data: property, error } = await supabase
      .from('properties')
      .insert({
        owner_id: user.id,
        ...data,
        status: 'draft',
        is_available: true
      })
      .select()
      .single()

    if (error) throw error

    return { success: true, data: property as Property }
  } catch (error: any) {
    console.error('Error creating property:', error)
    return { success: false, error: error.message }
  }
}

/**
 * Get all properties for the current user (Owner)
 */
export async function getMyProperties() {
  const supabase = createClient()

  try {
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return { success: false, error: 'User not authenticated' }
    }

    const { data: properties, error } = await supabase
      .from('properties')
      .select('*')
      .eq('owner_id', user.id)
      .order('created_at', { ascending: false })

    if (error) throw error

    return { success: true, data: properties as Property[] }
  } catch (error: any) {
    console.error('Error fetching properties:', error)
    return { success: false, error: error.message }
  }
}

/**
 * Get a single property by ID
 */
export async function getPropertyById(propertyId: string) {
  const supabase = createClient()

  try {
    const { data: property, error } = await supabase
      .from('properties')
      .select('*')
      .eq('id', propertyId)
      .single()

    if (error) throw error

    return { success: true, data: property as Property }
  } catch (error: any) {
    console.error('Error fetching property:', error)
    return { success: false, error: error.message }
  }
}

/**
 * Update an existing property
 */
export async function updateProperty(propertyId: string, data: Partial<CreatePropertyInput>) {
  const supabase = createClient()

  try {
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return { success: false, error: 'User not authenticated' }
    }

    const { data: property, error } = await supabase
      .from('properties')
      .update(data)
      .eq('id', propertyId)
      .eq('owner_id', user.id) // Ensure user owns the property
      .select()
      .single()

    if (error) throw error

    return { success: true, data: property as Property }
  } catch (error: any) {
    console.error('Error updating property:', error)
    return { success: false, error: error.message }
  }
}

/**
 * Delete a property
 */
export async function deleteProperty(propertyId: string) {
  const supabase = createClient()

  try {
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return { success: false, error: 'User not authenticated' }
    }

    const { error } = await supabase
      .from('properties')
      .delete()
      .eq('id', propertyId)
      .eq('owner_id', user.id) // Ensure user owns the property

    if (error) throw error

    return { success: true }
  } catch (error: any) {
    console.error('Error deleting property:', error)
    return { success: false, error: error.message }
  }
}

/**
 * Publish a property (make it visible to searchers)
 */
export async function publishProperty(propertyId: string) {
  const supabase = createClient()

  try {
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return { success: false, error: 'User not authenticated' }
    }

    const { data: property, error } = await supabase
      .from('properties')
      .update({
        status: 'published',
        published_at: new Date().toISOString()
      })
      .eq('id', propertyId)
      .eq('owner_id', user.id)
      .select()
      .single()

    if (error) throw error

    return { success: true, data: property as Property }
  } catch (error: any) {
    console.error('Error publishing property:', error)
    return { success: false, error: error.message }
  }
}

/**
 * Archive a property (hide from searchers)
 */
export async function archiveProperty(propertyId: string) {
  const supabase = createClient()

  try {
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return { success: false, error: 'User not authenticated' }
    }

    const { data: property, error } = await supabase
      .from('properties')
      .update({
        status: 'archived',
        is_available: false
      })
      .eq('id', propertyId)
      .eq('owner_id', user.id)
      .select()
      .single()

    if (error) throw error

    return { success: true, data: property as Property }
  } catch (error: any) {
    console.error('Error archiving property:', error)
    return { success: false, error: error.message }
  }
}

/**
 * Search published properties with filters
 */
export async function searchProperties(filters: PropertyFilters, page: number = 1, perPage: number = 20) {
  const supabase = createClient()

  try {
    let query = supabase
      .from('properties')
      .select('*', { count: 'exact' })
      .eq('status', 'published')
      .eq('is_available', true)

    // Apply filters
    if (filters.city) {
      query = query.ilike('city', `%${filters.city}%`)
    }

    if (filters.min_rent !== undefined) {
      query = query.gte('monthly_rent', filters.min_rent)
    }

    if (filters.max_rent !== undefined) {
      query = query.lte('monthly_rent', filters.max_rent)
    }

    if (filters.bedrooms !== undefined) {
      query = query.gte('bedrooms', filters.bedrooms)
    }

    if (filters.property_type) {
      query = query.eq('property_type', filters.property_type)
    }

    if (filters.furnished !== undefined) {
      query = query.eq('furnished', filters.furnished)
    }

    // Pagination
    const from = (page - 1) * perPage
    const to = from + perPage - 1
    query = query.range(from, to)

    // Order by relevance/date
    query = query.order('created_at', { ascending: false })

    const { data: properties, error, count } = await query

    if (error) throw error

    return {
      success: true,
      data: {
        properties: properties as Property[],
        total: count || 0,
        page,
        per_page: perPage
      } as PropertyListResponse
    }
  } catch (error: any) {
    console.error('Error searching properties:', error)
    return { success: false, error: error.message }
  }
}

/**
 * Increment view count for a property
 */
export async function incrementPropertyViews(propertyId: string) {
  const supabase = createClient()

  try {
    const { error } = await supabase.rpc('increment_property_views', {
      property_id: propertyId
    })

    if (error) throw error

    return { success: true }
  } catch (error: any) {
    console.error('Error incrementing views:', error)
    return { success: false, error: error.message }
  }
}
