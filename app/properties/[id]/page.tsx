'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, MapPin, Euro, Bed, Bath, Maximize, Calendar, CheckCircle, XCircle, Edit, Trash2, Send, User, Mail, Phone, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PageContainer } from '@/components/layout/PageContainer';
import { PageHeader } from '@/components/layout/PageHeader';
import { getPropertyById, deleteProperty, publishProperty, archiveProperty } from '@/lib/property-helpers';
import { createClient } from '@/lib/auth/supabase-client';
import { useApplications } from '@/lib/hooks/use-applications';
import ApplicationModal from '@/components/ApplicationModal';
import type { Property } from '@/types/property.types';
import type { PropertyAmenity } from '@/lib/types/property';
import { toast } from 'sonner';

export default function PropertyDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const propertyId = params.id as string;

  const [property, setProperty] = useState<Property | null>(null);
  const [isOwner, setIsOwner] = useState(false);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [userProfile, setUserProfile] = useState<{ full_name: string; email: string; phone_number?: string } | null>(null);
  const [ownerProfile, setOwnerProfile] = useState<{ first_name: string; last_name: string; profile_photo_url?: string; user_type?: string; phone_number?: string } | null>(null);
  const [residents, setResidents] = useState<Array<{ first_name: string; last_name: string; profile_photo_url?: string; date_of_birth?: string; occupation_status?: string; nationality?: string }>>([]);
  const [isApplicationModalOpen, setIsApplicationModalOpen] = useState(false);
  const [alreadyApplied, setAlreadyApplied] = useState(false);

  const { hasApplied } = useApplications(userId || undefined);

  useEffect(() => {
    loadProperty();
  }, [propertyId]);

  const loadProperty = async () => {
    setLoading(true);

    // Get current user
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      setUserId(user.id);

      // Load user profile
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('full_name, phone_number')
        .eq('user_id', user.id)
        .single();

      if (profile) {
        setUserProfile({
          full_name: profile.full_name || '',
          email: user.email || '',
          phone_number: profile.phone_number,
        });
      } else {
        setUserProfile({
          full_name: '',
          email: user.email || '',
        });
      }
    }

    // Load property
    const result = await getPropertyById(propertyId);

    if (result.success && result.data) {
      setProperty(result.data);
      setIsOwner(user?.id === result.data.owner_id);

      // Load owner profile
      const { data: owner } = await supabase
        .from('user_profiles')
        .select('first_name, last_name, profile_photo_url, user_type, phone_number')
        .eq('user_id', result.data.owner_id)
        .single();

      if (owner) {
        setOwnerProfile(owner);
      }

      // Load residents (from property_members table)
      const { data: propertyMembers } = await supabase
        .from('property_members')
        .select('user_id, role')
        .eq('property_id', propertyId)
        .eq('status', 'active');

      if (propertyMembers && propertyMembers.length > 0) {
        const residentIds = propertyMembers.map(m => m.user_id);
        const { data: residentProfiles } = await supabase
          .from('user_profiles')
          .select('first_name, last_name, profile_photo_url, date_of_birth, occupation_status, nationality')
          .in('user_id', residentIds);

        if (residentProfiles) {
          setResidents(residentProfiles);
        }
      }

      // Check if user has already applied (only if not the owner)
      if (user && user.id !== result.data.owner_id) {
        const applied = await hasApplied(propertyId);
        setAlreadyApplied(applied);
      }
    } else {
      toast.error('Property not found');
      router.push('/dashboard/owner');
    }

    setLoading(false);
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this property? This action cannot be undone.')) {
      return;
    }

    setActionLoading(true);
    const result = await deleteProperty(propertyId);

    if (result.success) {
      toast.success('Property deleted successfully');
      router.push('/dashboard/owner');
    } else {
      toast.error('Failed to delete property');
      setActionLoading(false);
    }
  };

  const handlePublish = async () => {
    setActionLoading(true);
    const result = await publishProperty(propertyId);

    if (result.success) {
      toast.success('Property published successfully');
      loadProperty();
    } else {
      toast.error('Failed to publish property');
    }
    setActionLoading(false);
  };

  const handleArchive = async () => {
    setActionLoading(true);
    const result = await archiveProperty(propertyId);

    if (result.success) {
      toast.success('Property archived successfully');
      loadProperty();
    } else {
      toast.error('Failed to archive property');
    }
    setActionLoading(false);
  };

  const getStatusBadgeVariant = (status: string) => {
    const variants: Record<string, "default" | "success" | "warning"> = {
      published: 'success',
      draft: 'warning',
      archived: 'default',
    };
    return variants[status] || 'default';
  };

  const getAmenityIcon = (amenity: PropertyAmenity) => {
    // Simple check icon for now
    return <CheckCircle className="w-4 h-4 text-green-600" />;
  };

  const calculateAge = (dateOfBirth?: string): number | null => {
    if (!dateOfBirth) return null;
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const getImageUrl = (image: any): string => {
    if (typeof image === 'string') return image;
    if (image && typeof image === 'object' && 'url' in image) return image.url;
    return '';
  };

  if (loading) {
    return (
      <PageContainer>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#4A148C]"></div>
            <p className="mt-4 text-gray-600">Loading property...</p>
          </div>
        </div>
      </PageContainer>
    );
  }

  if (!property) {
    return (
      <PageContainer>
        <div className="text-center py-12">
          <p className="text-gray-600">Property not found</p>
          <Button onClick={() => router.push('/dashboard/owner')} className="mt-4">
            Back to Dashboard
          </Button>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer maxWidth="2xl">
      {/* Header */}
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold text-gray-900">{property.title}</h1>
              <Badge variant={getStatusBadgeVariant(property.status)}>
                {property.status}
              </Badge>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <MapPin className="w-4 h-4" />
              <span>{property.address}, {property.city} {property.postal_code}</span>
            </div>
          </div>

          {isOwner && (
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => router.push(`/properties/edit/${property.id}`)}
                disabled={actionLoading}
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </Button>
              {property.status === 'draft' && (
                <Button
                  onClick={handlePublish}
                  disabled={actionLoading}
                >
                  Publish
                </Button>
              )}
              {property.status === 'published' && (
                <Button
                  variant="outline"
                  onClick={handleArchive}
                  disabled={actionLoading}
                >
                  Archive
                </Button>
              )}
              <Button
                variant="outline"
                onClick={handleDelete}
                disabled={actionLoading}
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Image Gallery */}
      <Card className="mb-6">
        <CardContent className="p-0">
          {property.images && property.images.length > 0 ? (
            <div className="relative h-96 rounded-t-2xl overflow-hidden">
              <img
                src={property.main_image || getImageUrl(property.images[0])}
                alt={property.title}
                className="w-full h-full object-cover"
              />
              {property.images.length > 1 && (
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="flex gap-2 overflow-x-auto pb-2">
                    {property.images.slice(1, 5).map((image, index) => (
                      <img
                        key={index}
                        src={getImageUrl(image)}
                        alt={`${property.title} - ${index + 2}`}
                        className="w-20 h-20 object-cover rounded-lg border-2 border-white shadow-lg flex-shrink-0 hover:scale-105 transition-transform cursor-pointer"
                      />
                    ))}
                    {property.images.length > 5 && (
                      <div className="w-20 h-20 bg-black/50 rounded-lg border-2 border-white shadow-lg flex items-center justify-center flex-shrink-0">
                        <span className="text-white font-semibold">+{property.images.length - 5}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-gray-200 h-96 flex items-center justify-center rounded-t-2xl">
              <div className="text-center text-gray-500">
                <p className="text-lg font-medium">No images yet</p>
                <p className="text-sm">Upload images to showcase your property</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Overview */}
          <Card>
            <CardHeader>
              <CardTitle>Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-purple-100 rounded-full">
                    <Bed className="w-5 h-5 text-[#4A148C]" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Bedrooms</p>
                    <p className="font-semibold">{property.bedrooms}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-3 bg-purple-100 rounded-full">
                    <Bath className="w-5 h-5 text-[#4A148C]" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Bathrooms</p>
                    <p className="font-semibold">{property.bathrooms}</p>
                  </div>
                </div>

                {property.surface_area && (
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-purple-100 rounded-full">
                      <Maximize className="w-5 h-5 text-[#4A148C]" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Surface</p>
                      <p className="font-semibold">{property.surface_area} m²</p>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-3">
                  <div className="p-3 bg-purple-100 rounded-full">
                    <Calendar className="w-5 h-5 text-[#4A148C]" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Furnished</p>
                    <p className="font-semibold">{property.furnished ? 'Yes' : 'No'}</p>
                  </div>
                </div>
              </div>

              {property.description && (
                <div>
                  <h4 className="font-semibold mb-2">Description</h4>
                  <p className="text-gray-700 whitespace-pre-line">{property.description}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Amenities */}
          {property.amenities && property.amenities.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Amenities</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {property.amenities.map((amenity) => (
                    <div key={amenity} className="flex items-center gap-2">
                      {getAmenityIcon(amenity)}
                      <span className="capitalize">{amenity.replace('_', ' ')}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* House Rules */}
          <Card>
            <CardHeader>
              <CardTitle>House Rules</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Smoking allowed</span>
                  {property.smoking_allowed ? (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-600" />
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Pets allowed</span>
                  {property.pets_allowed ? (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-600" />
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Couples allowed</span>
                  {property.couples_allowed ? (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-600" />
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Pricing */}
          <Card>
            <CardHeader>
              <CardTitle>Pricing</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Monthly Rent</span>
                  <span className="text-2xl font-bold text-[#4A148C]">
                    €{property.monthly_rent.toLocaleString()}
                  </span>
                </div>

                {property.charges !== undefined && property.charges > 0 && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Charges</span>
                    <span className="font-semibold">€{property.charges.toLocaleString()}</span>
                  </div>
                )}

                {property.deposit !== undefined && property.deposit !== null && property.deposit > 0 && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Deposit</span>
                    <span className="font-semibold">€{property.deposit.toLocaleString()}</span>
                  </div>
                )}

                <div className="pt-4 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">Total Monthly</span>
                    <span className="text-xl font-bold">
                      €{((property.monthly_rent || 0) + (property.charges || 0)).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Availability */}
          <Card>
            <CardHeader>
              <CardTitle>Availability</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">Status</p>
                  <p className="font-semibold">
                    {property.is_available ? 'Available' : 'Not Available'}
                  </p>
                </div>

                {property.available_from && (
                  <div>
                    <p className="text-sm text-gray-600">Available from</p>
                    <p className="font-semibold">
                      {new Date(property.available_from).toLocaleDateString()}
                    </p>
                  </div>
                )}

                <div>
                  <p className="text-sm text-gray-600">Minimum stay</p>
                  <p className="font-semibold">
                    {property.minimum_stay_months} {property.minimum_stay_months === 1 ? 'month' : 'months'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Owner Card */}
          {ownerProfile && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Owner
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-start gap-4">
                  {ownerProfile.profile_photo_url ? (
                    <img
                      src={ownerProfile.profile_photo_url}
                      alt={`${ownerProfile.first_name} ${ownerProfile.last_name}`}
                      className="w-16 h-16 rounded-full object-cover border-2 border-purple-200"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center">
                      <User className="w-8 h-8 text-[#4A148C]" />
                    </div>
                  )}
                  <div className="flex-1">
                    <p className="font-semibold text-lg">{ownerProfile.first_name} {ownerProfile.last_name}</p>
                    {ownerProfile.user_type && (
                      <Badge variant="default" className="mt-1">
                        {ownerProfile.user_type}
                      </Badge>
                    )}
                    {ownerProfile.phone_number && !isOwner && (
                      <div className="flex items-center gap-2 mt-2 text-sm text-gray-600">
                        <Phone className="w-4 h-4" />
                        <span>{ownerProfile.phone_number}</span>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Residents Card */}
          {residents.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Current Residents ({residents.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {residents.map((resident, index) => (
                    <div key={index} className="flex items-start gap-3 pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                      {resident.profile_photo_url ? (
                        <img
                          src={resident.profile_photo_url}
                          alt={`${resident.first_name} ${resident.last_name}`}
                          className="w-12 h-12 rounded-full object-cover border-2 border-purple-100"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-purple-50 flex items-center justify-center flex-shrink-0">
                          <User className="w-6 h-6 text-[#4A148C]" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold">{resident.first_name} {resident.last_name}</p>
                        {calculateAge(resident.date_of_birth) && (
                          <p className="text-sm text-gray-600">{calculateAge(resident.date_of_birth)} years old</p>
                        )}
                        {resident.occupation_status && (
                          <p className="text-sm text-gray-600 capitalize">{resident.occupation_status.replace('_', ' ')}</p>
                        )}
                        {resident.nationality && (
                          <Badge variant="default" size="sm" className="mt-1">
                            {resident.nationality}
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Property Info */}
          <Card>
            <CardHeader>
              <CardTitle>Property Info</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-gray-600">Property Type</p>
                  <p className="font-semibold capitalize">{property.property_type.replace('_', ' ')}</p>
                </div>
                <div>
                  <p className="text-gray-600">Created</p>
                  <p className="font-semibold">
                    {new Date(property.created_at).toLocaleDateString()}
                  </p>
                </div>
                {property.published_at && (
                  <div>
                    <p className="text-gray-600">Published</p>
                    <p className="font-semibold">
                      {new Date(property.published_at).toLocaleDateString()}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Apply Button (for non-owners) */}
          {!isOwner && property.status === 'published' && userId && userProfile && (
            <>
              {alreadyApplied ? (
                <Button className="w-full" size="lg" disabled variant="outline">
                  <CheckCircle className="w-5 h-5 mr-2" />
                  Application Submitted
                </Button>
              ) : (
                <Button
                  className="w-full"
                  size="lg"
                  onClick={() => setIsApplicationModalOpen(true)}
                >
                  <Send className="w-5 h-5 mr-2" />
                  Apply Now
                </Button>
              )}

              {/* Application Modal */}
              <ApplicationModal
                isOpen={isApplicationModalOpen}
                onClose={() => {
                  setIsApplicationModalOpen(false);
                  // Reload to update application status
                  loadProperty();
                }}
                propertyId={propertyId}
                propertyTitle={property.title}
                userId={userId}
                userProfile={userProfile}
              />
            </>
          )}
        </div>
      </div>
    </PageContainer>
  );
}
