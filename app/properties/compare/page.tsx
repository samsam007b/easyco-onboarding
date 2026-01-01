'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/auth/supabase-client';
import { ComparisonService } from '@/lib/services/comparison-service';
import { Property } from '@/types/property.types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import LoadingHouse from '@/components/ui/LoadingHouse';
import {
  ArrowLeft,
  Check,
  X,
  Download,
  Share2,
  Save,
  MapPin,
  Euro,
  Home,
  Users,
  Maximize,
  Calendar,
  Star,
  Wifi,
  Car,
  TreePine,
} from 'lucide-react';
import { toast } from 'sonner';
import Image from 'next/image';
import Link from 'next/link';
import { useLanguage } from '@/lib/i18n/use-language';

export default function PropertyComparePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t } = useLanguage();
  const supabase = createClient();
  const comparisonService = new ComparisonService(supabase);

  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadProperties();
  }, [searchParams]);

  const loadProperties = async () => {
    try {
      setIsLoading(true);
      const ids = searchParams.get('ids')?.split(',') || [];

      if (ids.length < 2 || ids.length > 3) {
        toast.error(t('properties.compare.errors.selectCount'));
        router.push('/properties/browse');
        return;
      }

      const data = await comparisonService.getPropertiesForComparison(ids);
      setProperties(data);
    } catch (error) {
      console.error('Error loading properties:', error);
      toast.error(t('properties.compare.errors.loadError'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveComparison = async () => {
    try {
      const propertyIds = properties.map((p) => p.id);
      await comparisonService.createComparison({ property_ids: propertyIds });
      toast.success(t('properties.compare.saved'));
    } catch (error) {
      console.error('Error saving comparison:', error);
      toast.error(t('properties.compare.errors.saveError'));
    }
  };

  const getBestValue = (field: keyof Property, compareType: 'lowest' | 'highest' = 'lowest') => {
    if (properties.length === 0) return null;

    const values = properties
      .map((p) => p[field])
      .filter((v): v is number => typeof v === 'number');

    if (values.length === 0) return null;

    return compareType === 'lowest' ? Math.min(...values) : Math.max(...values);
  };

  const isFieldBest = (
    property: Property,
    field: keyof Property,
    compareType: 'lowest' | 'highest' = 'lowest'
  ) => {
    const value = property[field];
    const bestValue = getBestValue(field, compareType);
    return value === bestValue && value !== null && value !== undefined;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <LoadingHouse size={80} />
          <p className="text-gray-600">{t('properties.compare.loading')}</p>
        </div>
      </div>
    );
  }

  if (properties.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <p className="text-gray-600 mb-4">{t('properties.compare.noProperties')}</p>
            <Button onClick={() => router.push('/properties/browse')}>
              {t('properties.compare.backToSearch')}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" onClick={() => router.back()}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                {t('common.back')}
              </Button>
              <h1 className="text-2xl font-bold text-gray-900">
                {t('properties.compare.title').replace('{count}', String(properties.length))}
              </h1>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={handleSaveComparison}>
                <Save className="w-4 h-4 mr-2" />
                {t('properties.compare.save')}
              </Button>
              <Button variant="outline">
                <Share2 className="w-4 h-4 mr-2" />
                {t('properties.compare.share')}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Comparison Table */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="overflow-x-auto">
          <table className="w-full bg-white rounded-lg shadow">
            <thead>
              <tr className="border-b">
                <th className="p-4 text-left font-semibold text-gray-700 bg-gray-50 w-48">
                  {t('properties.compare.feature')}
                </th>
                {properties.map((property) => (
                  <th key={property.id} className="p-4 text-center w-80">
                    <Link href={`/properties/${property.id}`}>
                      <div className="space-y-3 hover:opacity-80 transition">
                        {/* Image */}
                        <div className="relative w-full h-48 rounded-lg overflow-hidden">
                          <Image
                            src={property.main_image || '/placeholder-property.jpg'}
                            alt={property.title}
                            fill
                            className="object-cover"
                          />
                        </div>

                        {/* Title */}
                        <h3 className="font-bold text-lg text-gray-900 line-clamp-2">
                          {property.title}
                        </h3>

                        {/* Location */}
                        <div className="flex items-center justify-center text-sm text-gray-600">
                          <MapPin className="w-4 h-4 mr-1" />
                          {property.city}
                        </div>
                      </div>
                    </Link>
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {/* Prix */}
              <tr className="border-b hover:bg-gray-50">
                <td className="p-4 font-medium text-gray-700 bg-gray-50">
                  <div className="flex items-center gap-2">
                    <Euro className="w-4 h-4" />
                    {t('properties.compare.fields.monthlyPrice')}
                  </div>
                </td>
                {properties.map((property) => (
                  <td
                    key={property.id}
                    className={`p-4 text-center ${
                      isFieldBest(property, 'monthly_rent', 'lowest')
                        ? 'bg-green-50 border-2 border-green-500'
                        : ''
                    }`}
                  >
                    <div className="text-2xl font-bold text-gray-900">
                      {property.monthly_rent}€
                    </div>
                    <div className="text-xs text-gray-500">{t('properties.compare.perMonth')}</div>
                    {isFieldBest(property, 'monthly_rent', 'lowest') && (
                      <Badge variant="success" className="mt-2">
                        {t('properties.compare.bestPrice')}
                      </Badge>
                    )}
                  </td>
                ))}
              </tr>

              {/* Chambres */}
              <tr className="border-b hover:bg-gray-50">
                <td className="p-4 font-medium text-gray-700 bg-gray-50">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    {t('properties.compare.fields.bedrooms')}
                  </div>
                </td>
                {properties.map((property) => (
                  <td key={property.id} className="p-4 text-center">
                    <div className="text-xl font-semibold text-gray-900">
                      {property.bedrooms || 'N/A'}
                    </div>
                  </td>
                ))}
              </tr>

              {/* Surface */}
              <tr className="border-b hover:bg-gray-50">
                <td className="p-4 font-medium text-gray-700 bg-gray-50">
                  <div className="flex items-center gap-2">
                    <Maximize className="w-4 h-4" />
                    {t('properties.compare.fields.surface')}
                  </div>
                </td>
                {properties.map((property) => (
                  <td
                    key={property.id}
                    className={`p-4 text-center ${
                      isFieldBest(property, 'surface_area', 'highest')
                        ? 'bg-green-50 border-2 border-green-500'
                        : ''
                    }`}
                  >
                    <div className="text-xl font-semibold text-gray-900">
                      {property.surface_area ? `${property.surface_area}m²` : 'N/A'}
                    </div>
                    {isFieldBest(property, 'surface_area', 'highest') && (
                      <Badge variant="success" className="mt-2">
                        {t('properties.compare.largest')}
                      </Badge>
                    )}
                  </td>
                ))}
              </tr>

              {/* Type */}
              <tr className="border-b hover:bg-gray-50">
                <td className="p-4 font-medium text-gray-700 bg-gray-50">
                  <div className="flex items-center gap-2">
                    <Home className="w-4 h-4" />
                    {t('properties.compare.fields.propertyType')}
                  </div>
                </td>
                {properties.map((property) => (
                  <td key={property.id} className="p-4 text-center">
                    <Badge variant="default">{property.property_type}</Badge>
                  </td>
                ))}
              </tr>

              {/* Disponibilité */}
              <tr className="border-b hover:bg-gray-50">
                <td className="p-4 font-medium text-gray-700 bg-gray-50">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    {t('properties.compare.fields.availableFrom')}
                  </div>
                </td>
                {properties.map((property) => (
                  <td key={property.id} className="p-4 text-center text-gray-700">
                    {property.available_from
                      ? new Date(property.available_from).toLocaleDateString('fr-FR')
                      : t('properties.compare.immediately')}
                  </td>
                ))}
              </tr>

              {/* Meublé */}
              <tr className="border-b hover:bg-gray-50">
                <td className="p-4 font-medium text-gray-700 bg-gray-50">{t('properties.compare.fields.furnished')}</td>
                {properties.map((property) => (
                  <td key={property.id} className="p-4 text-center">
                    {property.furnished ? (
                      <Check className="w-6 h-6 text-green-600 mx-auto" />
                    ) : (
                      <X className="w-6 h-6 text-red-600 mx-auto" />
                    )}
                  </td>
                ))}
              </tr>

              {/* Parking */}
              <tr className="border-b hover:bg-gray-50">
                <td className="p-4 font-medium text-gray-700 bg-gray-50">
                  <div className="flex items-center gap-2">
                    <Car className="w-4 h-4" />
                    {t('properties.compare.fields.parking')}
                  </div>
                </td>
                {properties.map((property) => (
                  <td key={property.id} className="p-4 text-center">
                    {property.amenities?.includes('parking') ? (
                      <Check className="w-6 h-6 text-green-600 mx-auto" />
                    ) : (
                      <X className="w-6 h-6 text-red-600 mx-auto" />
                    )}
                  </td>
                ))}
              </tr>

              {/* Balcon */}
              <tr className="border-b hover:bg-gray-50">
                <td className="p-4 font-medium text-gray-700 bg-gray-50">
                  <div className="flex items-center gap-2">
                    <TreePine className="w-4 h-4" />
                    {t('properties.compare.fields.balcony')}
                  </div>
                </td>
                {properties.map((property) => (
                  <td key={property.id} className="p-4 text-center">
                    {property.amenities?.includes('balcony') ? (
                      <Check className="w-6 h-6 text-green-600 mx-auto" />
                    ) : (
                      <X className="w-6 h-6 text-red-600 mx-auto" />
                    )}
                  </td>
                ))}
              </tr>

              {/* Actions */}
              <tr>
                <td className="p-4 font-medium text-gray-700 bg-gray-50">{t('properties.compare.fields.actions')}</td>
                {properties.map((property) => (
                  <td key={property.id} className="p-4 text-center">
                    <Link href={`/properties/${property.id}`}>
                      <Button className="w-full bg-gradient-to-r from-yellow-600 to-orange-600">
                        {t('properties.compare.viewDetails')}
                      </Button>
                    </Link>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>

        {/* Legend */}
        <Card className="mt-6">
          <CardContent className="pt-6">
            <div className="flex items-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-50 border-2 border-green-500 rounded" />
                <span className="text-gray-700">{t('properties.compare.legend.bestValue')}</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-600" />
                <span className="text-gray-700">{t('properties.compare.legend.available')}</span>
              </div>
              <div className="flex items-center gap-2">
                <X className="w-4 h-4 text-red-600" />
                <span className="text-gray-700">{t('properties.compare.legend.notAvailable')}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
