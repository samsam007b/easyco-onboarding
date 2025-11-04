'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, MapPin, Bed, Bath, Maximize, Calendar, CheckCircle, Edit, Trash2, Users, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PageContainer } from '@/components/layout/PageContainer';
import { getPropertyById, deleteProperty, publishProperty, archiveProperty } from '@/lib/property-helpers';
import { createClient } from '@/lib/auth/supabase-client';
import { useApplications } from '@/lib/hooks/use-applications';
import { getPropertyDetailsData } from '@/lib/services/rooms.service';
import type { Property } from '@/types/property.types';
import type { PropertyAmenity } from '@/lib/types/property';
import type { RoomWithTotal, PropertyCosts, PropertyLifestyleMetrics, ResidentProfile } from '@/types/room.types';
import { toast } from 'sonner';
import { VirtualToursService } from '@/lib/services/virtual-tours-service';
import { VirtualTourInfo } from '@/types/virtual-tours.types';
import SinglePropertyMap from '@/components/SinglePropertyMap';
import VirtualTourViewer from '@/components/VirtualTourViewer';
import LifestyleCompatibilitySliders from '@/components/LifestyleCompatibilitySliders';
import ResidentProfileCard from '@/components/ResidentProfileCard';
import PropertyCTASidebar from '@/components/PropertyCTASidebar';

interface PropertyOwner {
  id: string;
  first_name: string;
  last_name: string;
  email?: string;
  phone?: string;
  profile_photo_url?: string;
  company_name?: string;
}

export default function PropertyDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const propertyId = params.id as string;

  const [property, setProperty] = useState<Property | null>(null);
  const [rooms, setRooms] = useState<RoomWithTotal[]>([]);
  const [costs, setCosts] = useState<PropertyCosts | null>(null);
  const [lifestyleMetrics, setLifestyleMetrics] = useState<PropertyLifestyleMetrics | null>(null);
  const [residents, setResidents] = useState<ResidentProfile[]>([]);
  const [cheapestRoom, setCheapestRoom] = useState<RoomWithTotal | null>(null);
  const [isOwner, setIsOwner] = useState(false);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [ownerProfile, setOwnerProfile] = useState<PropertyOwner | null>(null);
  const [virtualTourInfo, setVirtualTourInfo] = useState<VirtualTourInfo | null>(null);

  const supabase = createClient();
  const virtualToursService = new VirtualToursService(supabase);

  useEffect(() => {
    loadProperty();
  }, [propertyId]);

  const loadProperty = async () => {
    setLoading(true);

    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      setUserId(user.id);
    }

    // Load property
    const result = await getPropertyById(propertyId);

    if (result.success && result.data) {
      setProperty(result.data);
      setIsOwner(user?.id === result.data.owner_id);

      // Load multi-room data
      try {
        const roomData = await getPropertyDetailsData(propertyId);
        setRooms(roomData.rooms);
        setCosts(roomData.costs);
        setLifestyleMetrics(roomData.lifestyleMetrics);
        setResidents(roomData.residents);
        setCheapestRoom(roomData.cheapestRoom);
      } catch (error) {
        console.error('Error loading room data:', error);
      }

      // Load owner profile
      const { data: owner } = await supabase
        .from('user_profiles')
        .select('first_name, last_name, profile_photo_url, phone_number')
        .eq('user_id', result.data.owner_id)
        .single();

      if (owner) {
        setOwnerProfile({
          id: result.data.owner_id,
          first_name: owner.first_name,
          last_name: owner.last_name,
          email: user?.email,
          phone: owner.phone_number,
          profile_photo_url: owner.profile_photo_url
        });
      }

      // Load virtual tour info
      try {
        const tourInfo = await virtualToursService.getPropertyVirtualTourInfo(propertyId);
        setVirtualTourInfo(tourInfo);
      } catch (error) {
        console.error('Error loading virtual tour info:', error);
        setVirtualTourInfo({
          has_virtual_tour: false,
          property_id: propertyId,
        });
      }
    } else {
      toast.error('Property not found');
      router.push('/dashboard/searcher');
    }

    setLoading(false);
  };

  const handleVirtualTourView = (duration: number) => {
    if (userId && virtualTourInfo?.has_virtual_tour) {
      virtualToursService.trackVirtualTourView(propertyId, duration).catch((error) => {
        console.error('Error tracking virtual tour view:', error);
      });
    }
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
    return <CheckCircle className="w-4 h-4 text-green-600" />;
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
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
            <p className="mt-4 text-gray-600">Chargement de la propriété...</p>
          </div>
        </div>
      </PageContainer>
    );
  }

  if (!property) {
    return (
      <PageContainer>
        <div className="text-center py-12">
          <p className="text-gray-600">Propriété introuvable</p>
          <Button onClick={() => router.push('/dashboard/searcher')} className="mt-4">
            Retour au tableau de bord
          </Button>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer maxWidth="full" padding="none">
      {/* Header with Hero Image */}
      <div className="relative">
        {/* Hero Image */}
        <div className="relative h-[500px] w-full overflow-hidden">
          {property.images && property.images.length > 0 ? (
            <>
              <img
                src={property.main_image || getImageUrl(property.images[0])}
                alt={property.title}
                className="w-full h-full object-cover"
              />
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
            </>
          ) : (
            <div className="bg-gradient-to-br from-orange-100 to-orange-200 h-full flex items-center justify-center">
              <Home className="w-32 h-32 text-orange-300" />
            </div>
          )}

          {/* Back Button */}
          <div className="absolute top-6 left-6">
            <Button
              variant="outline"
              onClick={() => router.back()}
              className="bg-white/90 backdrop-blur-sm border-white/20 hover:bg-white"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour
            </Button>
          </div>

          {/* Owner Actions */}
          {isOwner && (
            <div className="absolute top-6 right-6 flex gap-2">
              <Button
                variant="outline"
                onClick={() => router.push(`/properties/edit/${property.id}`)}
                disabled={actionLoading}
                className="bg-white/90 backdrop-blur-sm border-white/20 hover:bg-white"
              >
                <Edit className="w-4 h-4 mr-2" />
                Modifier
              </Button>
              {property.status === 'draft' && (
                <Button
                  onClick={handlePublish}
                  disabled={actionLoading}
                  className="bg-orange-600 hover:bg-orange-700"
                >
                  Publier
                </Button>
              )}
              {property.status === 'published' && (
                <Button
                  variant="outline"
                  onClick={handleArchive}
                  disabled={actionLoading}
                  className="bg-white/90 backdrop-blur-sm border-white/20 hover:bg-white"
                >
                  Archiver
                </Button>
              )}
              <Button
                variant="outline"
                onClick={handleDelete}
                disabled={actionLoading}
                className="bg-white/90 backdrop-blur-sm border-white/20 hover:bg-white text-red-600 hover:text-red-700"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          )}

          {/* Property Title & Info - Overlaid on Image */}
          <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
            <div className="max-w-7xl mx-auto">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <h1 className="text-4xl font-bold">{property.title}</h1>
                    <Badge variant={getStatusBadgeVariant(property.status)} className="text-sm">
                      {property.status}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 text-white/90 mb-4">
                    <MapPin className="w-5 h-5" />
                    <span className="text-lg">{property.address}, {property.city} {property.postal_code}</span>
                  </div>

                  {/* Residents Preview (Compact) */}
                  {residents.length > 0 && (
                    <div className="flex items-center gap-3">
                      <Users className="w-5 h-5" />
                      <div className="flex -space-x-3">
                        {residents.slice(0, 5).map((resident, idx) => (
                          <div
                            key={idx}
                            className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 border-2 border-white flex items-center justify-center"
                          >
                            {resident.profile_photo_url ? (
                              <img
                                src={resident.profile_photo_url}
                                alt={`${resident.first_name} ${resident.last_name}`}
                                className="w-full h-full rounded-full object-cover"
                              />
                            ) : (
                              <span className="text-white text-xs font-bold">
                                {resident.first_name.charAt(0)}{resident.last_name.charAt(0)}
                              </span>
                            )}
                          </div>
                        ))}
                        {residents.length > 5 && (
                          <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm border-2 border-white flex items-center justify-center">
                            <span className="text-white text-xs font-bold">+{residents.length - 5}</span>
                          </div>
                        )}
                      </div>
                      <span className="text-sm text-white/80">{residents.length} colocataire{residents.length > 1 ? 's' : ''}</span>
                    </div>
                  )}
                </div>

                {/* Price Highlight */}
                {cheapestRoom && (
                  <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 text-center min-w-[200px]">
                    <p className="text-sm text-white/80 mb-1">À partir de</p>
                    <p className="text-5xl font-bold text-white">€{cheapestRoom.price}</p>
                    <p className="text-sm text-white/70 mt-1">/mois</p>
                    {rooms.length > 1 && (
                      <Badge className="mt-3 bg-orange-500 text-white border-0">
                        {rooms.filter(r => r.is_available).length} chambre{rooms.filter(r => r.is_available).length > 1 ? 's' : ''} disponible{rooms.filter(r => r.is_available).length > 1 ? 's' : ''}
                      </Badge>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Thumbnail Gallery */}
        {property.images && property.images.length > 1 && (
          <div className="bg-white border-b">
            <div className="max-w-7xl mx-auto px-8 py-4">
              <div className="flex gap-3 overflow-x-auto">
                {property.images.slice(0, 8).map((image, index) => (
                  <img
                    key={index}
                    src={getImageUrl(image)}
                    alt={`${property.title} - ${index + 1}`}
                    className="h-20 w-32 object-cover rounded-lg border-2 border-gray-200 hover:border-orange-500 transition-colors cursor-pointer flex-shrink-0"
                  />
                ))}
                {property.images.length > 8 && (
                  <div className="h-20 w-32 bg-gray-100 rounded-lg border-2 border-gray-200 flex items-center justify-center flex-shrink-0">
                    <span className="text-gray-600 font-semibold">+{property.images.length - 8}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Overview */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Home className="w-5 h-5 text-orange-600" />
                    Aperçu de la propriété
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-orange-100 rounded-full">
                        <Bed className="w-5 h-5 text-orange-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Chambres</p>
                        <p className="font-semibold">{property.bedrooms}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-orange-100 rounded-full">
                        <Bath className="w-5 h-5 text-orange-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Salles de bain</p>
                        <p className="font-semibold">{property.bathrooms}</p>
                      </div>
                    </div>

                    {property.surface_area && (
                      <div className="flex items-center gap-3">
                        <div className="p-3 bg-orange-100 rounded-full">
                          <Maximize className="w-5 h-5 text-orange-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Surface</p>
                          <p className="font-semibold">{property.surface_area} m²</p>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-orange-100 rounded-full">
                        <Calendar className="w-5 h-5 text-orange-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Meublé</p>
                        <p className="font-semibold">{property.furnished ? 'Oui' : 'Non'}</p>
                      </div>
                    </div>
                  </div>

                  {property.description && (
                    <div>
                      <h4 className="font-semibold mb-2 text-gray-900">Description</h4>
                      <p className="text-gray-700 whitespace-pre-line leading-relaxed">{property.description}</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Lifestyle Compatibility Sliders */}
              {lifestyleMetrics && (
                <LifestyleCompatibilitySliders metrics={lifestyleMetrics} />
              )}

              {/* Residents Section */}
              {residents.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="w-5 h-5 text-orange-600" />
                      Vos futurs colocataires ({residents.length})
                    </CardTitle>
                    <p className="text-sm text-gray-600 mt-1">
                      Découvrez les personnes avec qui vous pourriez partager cette colocation
                    </p>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                      {residents.map((resident, idx) => (
                        <ResidentProfileCard
                          key={idx}
                          resident={resident}
                          compact={true}
                        />
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Amenities */}
              {property.amenities && property.amenities.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Équipements</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {property.amenities.map((amenity) => (
                        <div key={amenity} className="flex items-center gap-2 p-2 bg-orange-50 rounded-lg border border-orange-100">
                          {getAmenityIcon(amenity)}
                          <span className="capitalize text-sm">{amenity.replace('_', ' ')}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Virtual Tour */}
              {virtualTourInfo && (
                <VirtualTourViewer
                  tourInfo={virtualTourInfo}
                  propertyId={propertyId}
                  onViewEnd={handleVirtualTourView}
                />
              )}

              {/* Location Map */}
              {property.latitude && property.longitude && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-orange-600" />
                      Localisation
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <SinglePropertyMap
                      latitude={property.latitude}
                      longitude={property.longitude}
                      title={property.title}
                      address={`${property.address}, ${property.city} ${property.postal_code}`}
                      className="w-full h-[400px] rounded-b-2xl overflow-hidden"
                    />
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Right Column - CTA Sidebar */}
            <div className="lg:col-span-1">
              {rooms.length > 0 && costs && (
                <PropertyCTASidebar
                  rooms={rooms}
                  costs={costs}
                  propertyId={propertyId}
                  propertyTitle={property.title}
                  propertyAddress={`${property.address}, ${property.city} ${property.postal_code}`}
                  owner={ownerProfile || undefined}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
