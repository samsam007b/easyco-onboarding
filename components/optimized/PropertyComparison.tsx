'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, Minus, MapPin, Euro, Home, Users, Calendar, Sparkles, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { useLanguage } from '@/lib/i18n/use-language';

interface Property {
  id: string;
  title: string;
  city: string;
  neighborhood?: string;
  monthly_rent: number;
  bedrooms?: number;
  bathrooms?: number;
  property_type?: string;
  main_image?: string;
  images?: string[];
  available_from?: string;
  furnished?: boolean;
  balcony?: boolean;
  parking?: boolean;
  smoking_allowed?: boolean;
  pets_allowed?: boolean;
  total_area?: number;
  rating?: number;
  views_count?: number;
  compatibilityScore?: number;
}

interface PropertyComparisonProps {
  properties: Property[];
  onClose: () => void;
  onRemoveProperty: (propertyId: string) => void;
}

export default function PropertyComparison({
  properties,
  onClose,
  onRemoveProperty,
}: PropertyComparisonProps) {
  const [selectedProperty, setSelectedProperty] = useState<string | null>(null);
  const { language, getSection } = useLanguage();
  const ariaLabels = getSection('ariaLabels');

  const comparisonRows = [
    {
      label: 'Prix',
      icon: <Euro className="w-4 h-4" />,
      getValue: (p: Property) => `€${p.monthly_rent}/mois`,
      compare: (a: Property, b: Property) => a.monthly_rent - b.monthly_rent,
      type: 'number' as const,
    },
    {
      label: 'Localisation',
      icon: <MapPin className="w-4 h-4" />,
      getValue: (p: Property) => `${p.neighborhood || ''} ${p.city}`.trim(),
      type: 'text' as const,
    },
    {
      label: 'Chambres',
      icon: <Home className="w-4 h-4" />,
      getValue: (p: Property) => p.bedrooms ? `${p.bedrooms}` : '-',
      compare: (a: Property, b: Property) => (a.bedrooms || 0) - (b.bedrooms || 0),
      type: 'number' as const,
    },
    {
      label: 'Salles de bain',
      icon: <Home className="w-4 h-4" />,
      getValue: (p: Property) => p.bathrooms ? `${p.bathrooms}` : '-',
      compare: (a: Property, b: Property) => (a.bathrooms || 0) - (b.bathrooms || 0),
      type: 'number' as const,
    },
    {
      label: 'Surface',
      icon: <Home className="w-4 h-4" />,
      getValue: (p: Property) => p.total_area ? `${p.total_area}m²` : '-',
      compare: (a: Property, b: Property) => (a.total_area || 0) - (b.total_area || 0),
      type: 'number' as const,
    },
    {
      label: 'Disponibilité',
      icon: <Calendar className="w-4 h-4" />,
      getValue: (p: Property) =>
        p.available_from
          ? new Date(p.available_from).toLocaleDateString('fr-FR', { month: 'short', day: 'numeric', year: 'numeric' })
          : 'Immédiat',
      type: 'text' as const,
    },
    {
      label: 'Meublé',
      icon: <Home className="w-4 h-4" />,
      getValue: (p: Property) => p.furnished,
      type: 'boolean' as const,
    },
    {
      label: 'Balcon',
      icon: <Home className="w-4 h-4" />,
      getValue: (p: Property) => p.balcony,
      type: 'boolean' as const,
    },
    {
      label: 'Parking',
      icon: <Home className="w-4 h-4" />,
      getValue: (p: Property) => p.parking,
      type: 'boolean' as const,
    },
    {
      label: 'Animaux',
      icon: <Users className="w-4 h-4" />,
      getValue: (p: Property) => p.pets_allowed,
      type: 'boolean' as const,
    },
    {
      label: 'Fumeur',
      icon: <Users className="w-4 h-4" />,
      getValue: (p: Property) => p.smoking_allowed,
      type: 'boolean' as const,
    },
  ];

  const getBestValue = (row: typeof comparisonRows[0]) => {
    if (!row.compare || properties.length === 0) return null;
    const sorted = [...properties].sort(row.compare);
    return sorted[0].id;
  };

  const renderValue = (row: typeof comparisonRows[0], property: Property) => {
    const value = row.getValue(property);
    const isBest = row.compare && getBestValue(row) === property.id;

    if (row.type === 'boolean') {
      return (
        <div className="flex items-center justify-center">
          {value ? (
            <div className={`w-6 h-6 rounded-full ${isBest ? 'bg-green-100' : 'bg-green-50'} flex items-center justify-center`}>
              <Check className={`w-4 h-4 ${isBest ? 'text-green-600' : 'text-green-500'}`} />
            </div>
          ) : (
            <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center">
              <Minus className="w-4 h-4 text-gray-400" />
            </div>
          )}
        </div>
      );
    }

    return (
      <span
        className={`text-sm font-medium ${
          isBest ? 'text-green-600 font-bold' : 'text-gray-900'
        }`}
      >
        {value}
      </span>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white superellipse-3xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-searcher-500 to-searcher-600 text-white p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Comparaison de propriétés</h2>
                <p className="text-orange-100 text-sm">Compare jusqu'à 4 propriétés côte à côte</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-full transition"
              aria-label={ariaLabels?.close?.[language] || 'Fermer'}
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="overflow-x-auto overflow-y-auto max-h-[calc(90vh-120px)]">
          <table className="w-full">
            <thead className="sticky top-0 bg-white z-10 shadow-sm">
              <tr>
                <th className="p-4 text-left font-semibold text-gray-900 border-b-2 border-gray-200 w-48">
                  Caractéristiques
                </th>
                {properties.map((property) => (
                  <th key={property.id} className="p-4 border-b-2 border-gray-200 min-w-[250px]">
                    <div className="relative">
                      {/* Remove button */}
                      <button
                        onClick={() => onRemoveProperty(property.id)}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition z-10"
                        aria-label={ariaLabels?.removeFromComparison?.[language] || 'Retirer de la comparaison'}
                      >
                        <X className="w-4 h-4" />
                      </button>

                      {/* Property image */}
                      <div className="relative h-32 superellipse-xl overflow-hidden mb-3 bg-gray-200">
                        <img
                          src={property.main_image || property.images?.[0] || '/placeholder.jpg'}
                          alt={property.title}
                          className="w-full h-full object-cover"
                        />
                        {property.compatibilityScore && (
                          <div className="absolute top-2 left-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                            {property.compatibilityScore}% Match
                          </div>
                        )}
                      </div>

                      {/* Property info */}
                      <h3 className="font-bold text-gray-900 text-sm mb-1 line-clamp-2">
                        {property.title}
                      </h3>
                      <p className="text-xs text-gray-600 mb-2 flex items-center justify-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {property.city}
                      </p>

                      {/* View button */}
                      <Link href={`/properties/${property.id}`}>
                        <Button
                          size="sm"
                          className="w-full bg-gradient-to-r from-searcher-500 to-searcher-600 hover:from-searcher-600 hover:to-searcher-700 text-white"
                        >
                          Voir détails
                          <ArrowRight className="w-4 h-4 ml-1" />
                        </Button>
                      </Link>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {comparisonRows.map((row, rowIndex) => (
                <tr
                  key={rowIndex}
                  className={`${rowIndex % 2 === 0 ? 'bg-gray-50' : 'bg-white'} hover:bg-searcher-50/30 transition`}
                >
                  <td className="p-4 border-b border-gray-200">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 superellipse-lg bg-searcher-100 flex items-center justify-center text-searcher-600">
                        {row.icon}
                      </div>
                      <span className="font-medium text-gray-900 text-sm">{row.label}</span>
                    </div>
                  </td>
                  {properties.map((property) => (
                    <td
                      key={property.id}
                      className="p-4 border-b border-gray-200 text-center"
                    >
                      {renderValue(row, property)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 border-t border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Sparkles className="w-4 h-4 text-searcher-600" />
              <span>Les meilleures valeurs sont en <span className="text-green-600 font-semibold">vert</span></span>
            </div>
            <Button variant="outline" onClick={onClose}>
              Fermer
            </Button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
