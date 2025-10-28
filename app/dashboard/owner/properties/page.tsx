'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/auth/supabase-client'
import { getMyProperties } from '@/lib/property-helpers'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Building2, Plus, Edit, Trash2, Eye, MapPin, Bed, Bath, DollarSign, Calendar } from 'lucide-react'
import { toast } from 'sonner'
import type { Property } from '@/types/property.types'
import DashboardHeader from '@/components/DashboardHeader'
import { useRole } from '@/lib/role/role-context'

interface UserProfile {
  full_name: string
  email: string
  profile_data: any
}

export default function PropertiesManagement() {
  const router = useRouter()
  const supabase = createClient()
  const { setActiveRole } = useRole()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [properties, setProperties] = useState<Property[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState<'all' | 'published' | 'draft' | 'archived'>('all')

  useEffect(() => {
    loadData()
    setActiveRole('owner')
  }, [])

  const loadData = async () => {
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser()

      if (userError || !user) {
        router.push('/login')
        return
      }

      // Load profile
      const { data: userData } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single()

      const { data: profileData } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single()

      setProfile({
        full_name: userData?.full_name || user.email?.split('@')[0] || 'User',
        email: userData?.email || user.email || '',
        profile_data: profileData || {}
      })

      // Load properties
      const result = await getMyProperties()
      if (result.success && result.data) {
        setProperties(result.data)
      }
    } catch (error: any) {
      toast.error('Failed to load data')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteProperty = async (propertyId: string) => {
    if (!confirm('Are you sure you want to delete this property? This action cannot be undone.')) {
      return
    }

    try {
      const { error } = await supabase
        .from('properties')
        .delete()
        .eq('id', propertyId)

      if (error) throw error

      toast.success('Property deleted successfully')
      setProperties(properties.filter(p => p.id !== propertyId))
    } catch (error: any) {
      toast.error('Failed to delete property')
    }
  }

  const handleToggleStatus = async (propertyId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'published' ? 'draft' : 'published'

    try {
      const { error } = await supabase
        .from('properties')
        .update({ status: newStatus })
        .eq('id', propertyId)

      if (error) throw error

      toast.success(`Property ${newStatus === 'published' ? 'published' : 'unpublished'} successfully`)
      setProperties(properties.map(p =>
        p.id === propertyId ? { ...p, status: newStatus } : p
      ))
    } catch (error: any) {
      toast.error('Failed to update property status')
    }
  }

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "success" | "warning"> = {
      published: 'success',
      draft: 'warning',
      archived: 'default'
    }
    return variants[status] || 'default'
  }

  const filteredProperties = properties.filter(property => {
    if (filterStatus === 'all') return true
    return property.status === filterStatus
  })

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-yellow-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#4A148C] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading properties...</p>
        </div>
      </div>
    )
  }

  if (!profile) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-yellow-50">
      <DashboardHeader
        profile={profile}
        avatarColor="#4A148C"
        role="owner"
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-8">
        {/* Header */}
        <div className="bg-white rounded-3xl shadow-lg p-6 sm:p-8 mb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-[#4A148C] flex items-center gap-3 mb-2">
                <Building2 className="w-8 h-8" />
                Manage Properties
              </h1>
              <p className="text-gray-600">
                View, edit, and manage all your property listings
              </p>
            </div>
            <Button onClick={() => router.push('/properties/add')} size="lg">
              <Plus className="w-5 h-5 mr-2" />
              Add Property
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-xl">
              <p className="text-sm text-gray-600 mb-1">Total</p>
              <p className="text-2xl font-bold text-[#4A148C]">{properties.length}</p>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-xl">
              <p className="text-sm text-gray-600 mb-1">Published</p>
              <p className="text-2xl font-bold text-green-700">
                {properties.filter(p => p.status === 'published').length}
              </p>
            </div>
            <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-4 rounded-xl">
              <p className="text-sm text-gray-600 mb-1">Draft</p>
              <p className="text-2xl font-bold text-yellow-700">
                {properties.filter(p => p.status === 'draft').length}
              </p>
            </div>
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-4 rounded-xl">
              <p className="text-sm text-gray-600 mb-1">Archived</p>
              <p className="text-2xl font-bold text-gray-700">
                {properties.filter(p => p.status === 'archived').length}
              </p>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-2 mt-6">
            <Button
              variant={filterStatus === 'all' ? 'default' : 'outline'}
              onClick={() => setFilterStatus('all')}
              size="sm"
            >
              All ({properties.length})
            </Button>
            <Button
              variant={filterStatus === 'published' ? 'default' : 'outline'}
              onClick={() => setFilterStatus('published')}
              size="sm"
            >
              Published ({properties.filter(p => p.status === 'published').length})
            </Button>
            <Button
              variant={filterStatus === 'draft' ? 'default' : 'outline'}
              onClick={() => setFilterStatus('draft')}
              size="sm"
            >
              Draft ({properties.filter(p => p.status === 'draft').length})
            </Button>
            <Button
              variant={filterStatus === 'archived' ? 'default' : 'outline'}
              onClick={() => setFilterStatus('archived')}
              size="sm"
            >
              Archived ({properties.filter(p => p.status === 'archived').length})
            </Button>
          </div>
        </div>

        {/* Properties List */}
        {filteredProperties.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-lg p-12 text-center">
            <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              {filterStatus === 'all' ? 'No properties yet' : `No ${filterStatus} properties`}
            </h3>
            <p className="text-gray-500 mb-6">
              {filterStatus === 'all'
                ? 'Get started by adding your first property listing'
                : 'Try adjusting your filters to see more properties'
              }
            </p>
            {filterStatus === 'all' && (
              <Button onClick={() => router.push('/properties/add')}>
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Property
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredProperties.map((property) => (
              <div
                key={property.id}
                className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow p-6"
              >
                <div className="flex flex-col lg:flex-row gap-6">
                  {/* Property Info */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                          {property.title}
                        </h3>
                        <div className="flex items-center gap-2 text-gray-600 mb-2">
                          <MapPin className="w-4 h-4" />
                          <span>{property.city}, {property.postal_code}</span>
                        </div>
                      </div>
                      <Badge variant={getStatusBadge(property.status)}>
                        {property.status}
                      </Badge>
                    </div>

                    <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
                      <div className="flex items-center gap-1">
                        <Bed className="w-4 h-4" />
                        {property.bedrooms} bed{property.bedrooms > 1 ? 's' : ''}
                      </div>
                      <div className="flex items-center gap-1">
                        <Bath className="w-4 h-4" />
                        {property.bathrooms} bath{property.bathrooms > 1 ? 's' : ''}
                      </div>
                      <div className="flex items-center gap-1">
                        <DollarSign className="w-4 h-4" />
                        €{property.monthly_rent}/month
                      </div>
                      {property.created_at && (
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          Listed {new Date(property.created_at).toLocaleDateString()}
                        </div>
                      )}
                    </div>

                    <p className="text-gray-600 line-clamp-2">
                      {property.description}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex lg:flex-col gap-2 lg:w-48">
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => router.push(`/properties/${property.id}`)}
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      View
                    </Button>
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => router.push(`/properties/edit/${property.id}`)}
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                    <Button
                      variant={property.status === 'published' ? 'outline' : 'default'}
                      className="flex-1"
                      onClick={() => handleToggleStatus(property.id, property.status)}
                    >
                      {property.status === 'published' ? 'Unpublish' : 'Publish'}
                    </Button>
                    <Button
                      variant="outline"
                      className="flex-1 text-red-600 hover:text-red-700 hover:bg-red-50"
                      onClick={() => handleDeleteProperty(property.id)}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
