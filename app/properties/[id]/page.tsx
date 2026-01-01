'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import { ArrowLeft, MapPin, Bed, Bath, Maximize, Calendar, CheckCircle, Edit, Trash2, Users, Home, X, ChevronLeft, ChevronRight, Expand } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
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
import PropertyCTASidebar from '@/components/PropertyCTASidebar';
import LoadingHouse from '@/components/ui/LoadingHouse';
import { useLanguage } from '@/lib/i18n/use-language';

// Lazy load heavy components
const SafeSinglePropertyMap = dynamic(() => import('@/components/SafeSinglePropertyMap'), {
  ssr: false,
  loading: () => <div className="h-64 w-full bg-gray-100 animate-pulse rounded-lg" />
});

const VirtualTourViewer = dynamic(() => import('@/components/VirtualTourViewer'), {
  ssr: false,
  loading: () => <div className="h-96 w-full bg-gray-100 animate-pulse rounded-lg" />
});

const LifestyleCompatibilitySliders = dynamic(() => import('@/components/LifestyleCompatibilitySliders'), {
  ssr: false
});

const ResidentProfileCard = dynamic(() => import('@/components/ResidentProfileCard'), {
  ssr: false
});

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
  const { t } = useLanguage();

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
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const supabase = createClient();
  const virtualToursService = new VirtualToursService(supabase);

  useEffect(() => {
    loadProperty();
  }, [propertyId]);

  // Keyboard navigation for lightbox
  useEffect(() => {
    if (!isLightboxOpen || !property?.images) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsLightboxOpen(false);
      } else if (e.key === 'ArrowLeft') {
        setLightboxIndex((prev) => (prev === 0 ? property.images!.length - 1 : prev - 1));
      } else if (e.key === 'ArrowRight') {
        setLightboxIndex((prev) => (prev === property.images!.length - 1 ? 0 : prev + 1));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isLightboxOpen, property?.images]);

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
      console.log('Loading owner profile for owner_id:', result.data.owner_id);
      const { data: owner, error: ownerError } = await supabase
        .from('user_profiles')
        .select('first_name, last_name, profile_photo_url, phone_number')
        .eq('user_id', result.data.owner_id)
        .single();

      console.log('Owner data:', owner);
      console.log('Owner error:', ownerError);

      if (owner) {
        const ownerData = {
          id: result.data.owner_id,
          first_name: owner.first_name,
          last_name: owner.last_name,
          email: user?.email,
          phone: owner.phone_number,
          profile_photo_url: owner.profile_photo_url
        };
        console.log('Setting owner profile:', ownerData);
        setOwnerProfile(ownerData);
      } else {
        console.log('No owner data found or error occurred');
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
      toast.error(t('properties.toast.propertyNotFound'));
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
    if (!confirm(t('properties.confirmations.deleteTitle'))) {
      return;
    }

    setActionLoading(true);
    const result = await deleteProperty(propertyId);

    if (result.success) {
      toast.success(t('properties.toast.deleteSuccess'));
      router.push('/dashboard/owner');
    } else {
      toast.error(t('properties.toast.deleteFailed'));
      setActionLoading(false);
    }
  };

  const handlePublish = async () => {
    setActionLoading(true);
    const result = await publishProperty(propertyId);

    if (result.success) {
      toast.success(t('properties.toast.publishSuccess'));
      loadProperty();
    } else {
      toast.error(t('properties.toast.publishFailed'));
    }
    setActionLoading(false);
  };

  const handleArchive = async () => {
    setActionLoading(true);
    const result = await archiveProperty(propertyId);

    if (result.success) {
      toast.success(t('properties.toast.archiveSuccess'));
      loadProperty();
    } else {
      toast.error(t('properties.toast.archiveFailed'));
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
            <LoadingHouse size={80} />
            <p className="mt-4 text-gray-600">{t('properties.details.loading')}</p>
          </div>
        </div>
      </PageContainer>
    );
  }

  if (!property) {
    return (
      <PageContainer>
        <div className="text-center py-12">
          <p className="text-gray-600">{t('properties.details.notFound')}</p>
          <Button onClick={() => router.push('/dashboard/searcher')} className="mt-4">
            {t('properties.details.backToDashboard')}
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
                src={getImageUrl(property.images[selectedImageIndex]) || property.main_image || getImageUrl(property.images[0])}
                alt={property.title}
                className="w-full h-full object-cover transition-opacity duration-300"
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
              {t('properties.details.back')}
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
                {t('properties.details.edit')}
              </Button>
              {property.status === 'draft' && (
                <Button
                  onClick={handlePublish}
                  disabled={actionLoading}
                  className="bg-orange-600 hover:bg-orange-700"
                >
                  {t('properties.details.publish')}
                </Button>
              )}
              {property.status === 'published' && (
                <Button
                  variant="outline"
                  onClick={handleArchive}
                  disabled={actionLoading}
                  className="bg-white/90 backdrop-blur-sm border-white/20 hover:bg-white"
                >
                  {t('properties.details.archive')}
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
                      <Users className="w-6 h-6" />
                      <div className="flex -space-x-4">
                        {residents.slice(0, 5).map((resident, idx) => (
                          <div
                            key={idx}
                            className="w-14 h-14 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 border-3 border-white shadow-lg flex items-center justify-center"
                          >
                            {resident.profile_photo_url ? (
                              <img
                                src={resident.profile_photo_url}
                                alt={`${resident.first_name} ${resident.last_name}`}
                                className="w-full h-full rounded-full object-cover"
                              />
                            ) : (
                              <span className="text-white text-sm font-bold">
                                {resident.first_name.charAt(0)}{resident.last_name.charAt(0)}
                              </span>
                            )}
                          </div>
                        ))}
                        {residents.length > 5 && (
                          <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm border-3 border-white shadow-lg flex items-center justify-center">
                            <span className="text-white text-sm font-bold">+{residents.length - 5}</span>
                          </div>
                        )}
                      </div>
                      <span className="text-base font-medium text-white/90">{residents.length} {residents.length > 1 ? t('properties.details.roommates') : t('properties.details.roommate')}</span>
                    </div>
                  )}
                </div>

                {/* Price Highlight */}
                {cheapestRoom && (
                  <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 text-center min-w-[200px]">
                    <p className="text-sm text-white/80 mb-1">{t('properties.details.startingFrom')}</p>
                    <p className="text-5xl font-bold text-white">€{cheapestRoom.price}</p>
                    <p className="text-sm text-white/70 mt-1">{t('properties.details.perMonth')}</p>
                    {rooms.length > 1 && (
                      <Badge className="mt-3 bg-orange-500 text-white border-0">
                        {rooms.filter(r => r.is_available).length} {rooms.filter(r => r.is_available).length > 1 ? t('properties.details.roomsAvailable') : t('properties.details.roomAvailable')}
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
              <div className="flex items-center gap-3">
                {/* Thumbnails */}
                <div className="flex gap-3 overflow-x-auto flex-1">
                  {property.images.slice(0, 8).map((image, index) => (
                    <img
                      key={index}
                      src={getImageUrl(image)}
                      alt={`${property.title} - ${index + 1}`}
                      onClick={() => setSelectedImageIndex(index)}
                      className={`h-20 w-32 object-cover rounded-lg border-2 transition-all cursor-pointer flex-shrink-0 hover:border-orange-500 hover:scale-105 ${
                        selectedImageIndex === index
                          ? 'border-orange-500 ring-2 ring-orange-300'
                          : 'border-gray-200'
                      }`}
                    />
                  ))}
                  {property.images.length > 8 && (
                    <div
                      className="h-20 w-32 bg-gray-100 rounded-lg border-2 border-gray-200 flex items-center justify-center flex-shrink-0 cursor-pointer hover:bg-gray-200 transition-colors"
                      onClick={() => setSelectedImageIndex(8)}
                    >
                      <span className="text-gray-600 font-semibold">+{property.images.length - 8}</span>
                    </div>
                  )}
                </div>

                {/* Expand Button */}
                <button
                  onClick={() => {
                    setLightboxIndex(selectedImageIndex);
                    setIsLightboxOpen(true);
                  }}
                  className="flex-shrink-0 h-20 px-6 bg-gradient-searcher hover:opacity-90 text-white rounded-xl flex items-center gap-2 transition-all hover:scale-105 shadow-md"
                >
                  <Expand className="w-5 h-5" />
                  <span className="font-medium hidden sm:inline">{t('properties.details.viewAll')}</span>
                </button>
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
                    {t('properties.overview.title')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-orange-100 rounded-full">
                        <Bed className="w-5 h-5 text-orange-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">{t('properties.overview.bedrooms')}</p>
                        <p className="font-semibold">{property.bedrooms}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-orange-100 rounded-full">
                        <Bath className="w-5 h-5 text-orange-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">{t('properties.overview.bathrooms')}</p>
                        <p className="font-semibold">{property.bathrooms}</p>
                      </div>
                    </div>

                    {property.surface_area && (
                      <div className="flex items-center gap-3">
                        <div className="p-3 bg-orange-100 rounded-full">
                          <Maximize className="w-5 h-5 text-orange-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">{t('properties.overview.surface')}</p>
                          <p className="font-semibold">{property.surface_area} m²</p>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-orange-100 rounded-full">
                        <Calendar className="w-5 h-5 text-orange-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">{t('properties.overview.furnished')}</p>
                        <p className="font-semibold">{property.furnished ? t('properties.overview.yes') : t('properties.overview.no')}</p>
                      </div>
                    </div>
                  </div>

                  {property.description && (
                    <div>
                      <h4 className="font-semibold mb-2 text-gray-900">{t('properties.overview.description')}</h4>
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
                      {t('properties.residents.title')} ({residents.length})
                    </CardTitle>
                    <p className="text-sm text-gray-600 mt-1">
                      {t('properties.residents.subtitle')}
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
                    <CardTitle>{t('properties.amenities.title')}</CardTitle>
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
                      {t('properties.location.title')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <SafeSinglePropertyMap
                      latitude={property.latitude}
                      longitude={property.longitude}
                      title={property.title}
                      address={`${property.address}, {property.city} ${property.postal_code}`}
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
                  hasVirtualTour={virtualTourInfo?.has_virtual_tour || false}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox / Gallery Modal */}
      <AnimatePresence>
        {isLightboxOpen && property.images && property.images.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center"
            onClick={() => setIsLightboxOpen(false)}
          >
            {/* Close Button */}
            <button
              onClick={() => setIsLightboxOpen(false)}
              className="absolute top-6 right-6 z-10 p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
            >
              <X className="w-6 h-6 text-white" />
            </button>

            {/* Image Counter */}
            <div className="absolute top-6 left-6 z-10 px-4 py-2 bg-white/10 rounded-full">
              <span className="text-white font-medium">
                {lightboxIndex + 1} / {property.images.length}
              </span>
            </div>

            {/* Previous Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setLightboxIndex((prev) => (prev === 0 ? property.images!.length - 1 : prev - 1));
              }}
              className="absolute left-4 md:left-8 z-10 p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
            >
              <ChevronLeft className="w-8 h-8 text-white" />
            </button>

            {/* Main Image */}
            <motion.div
              key={lightboxIndex}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="max-w-[90vw] max-h-[85vh] relative"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={getImageUrl(property.images[lightboxIndex])}
                alt={`${property.title} - ${lightboxIndex + 1}`}
                className="max-w-full max-h-[85vh] object-contain rounded-lg"
              />
            </motion.div>

            {/* Next Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setLightboxIndex((prev) => (prev === property.images!.length - 1 ? 0 : prev + 1));
              }}
              className="absolute right-4 md:right-8 z-10 p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
            >
              <ChevronRight className="w-8 h-8 text-white" />
            </button>

            {/* Thumbnail Strip at Bottom */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10">
              <div className="flex gap-2 p-2 bg-black/50 rounded-xl max-w-[90vw] overflow-x-auto">
                {property.images.map((image, index) => (
                  <img
                    key={index}
                    src={getImageUrl(image)}
                    alt={`${t('properties.lightbox.thumbnail')} ${index + 1}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      setLightboxIndex(index);
                    }}
                    className={`h-16 w-24 object-cover rounded-lg cursor-pointer transition-all flex-shrink-0 ${
                      lightboxIndex === index
                        ? 'ring-2 ring-orange-500 opacity-100'
                        : 'opacity-50 hover:opacity-80'
                    }`}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </PageContainer>
  );
}
