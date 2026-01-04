'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Building2,
  CheckCircle,
  AlertTriangle,
  Clock,
  TrendingUp,
  Euro,
  Users,
  Home,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { ownerGradient, semanticColors } from '@/lib/constants/owner-theme';
import { PropertyCard, type PropertyCardData } from './PropertyCard';
import { useLanguage } from '@/lib/i18n/use-language';
import { PropertyFilters, type PropertyFiltersState, type ViewMode } from './PropertyFilters';

interface PropertyHealthGridProps {
  properties: PropertyCardData[];
  filters: PropertyFiltersState;
  onFiltersChange: (filters: PropertyFiltersState) => void;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  onPropertyClick?: (property: PropertyCardData) => void;
  onPropertyEdit?: (property: PropertyCardData) => void;
  onPropertyArchive?: (property: PropertyCardData) => void;
  onPropertyDelete?: (property: PropertyCardData) => void;
  onPropertyHistory?: (property: PropertyCardData) => void;
  selectedProperties?: Set<string>;
  onSelectionChange?: (selected: Set<string>) => void;
  className?: string;
}

// Calculate health for a property
function calculateHealth(property: PropertyCardData): 'excellent' | 'attention' | 'critical' {
  if (property.health) return property.health;
  if (property.isRented) return 'excellent';
  if (property.status === 'draft') return 'attention';
  if (property.status === 'archived') return 'attention';
  if (property.daysVacant && property.daysVacant > 30) return 'critical';
  if (property.daysVacant && property.daysVacant > 14) return 'attention';
  return 'excellent';
}

export function PropertyHealthGrid({
  properties,
  filters,
  onFiltersChange,
  viewMode,
  onViewModeChange,
  onPropertyClick,
  onPropertyEdit,
  onPropertyArchive,
  onPropertyDelete,
  onPropertyHistory,
  selectedProperties = new Set(),
  onSelectionChange,
  className,
}: PropertyHealthGridProps) {
  const { language, getSection } = useLanguage();
  const t = getSection('ownerPortfolio');

  // Get unique cities for filter dropdown
  const cities = useMemo(() => {
    const citySet = new Set(properties.map((p) => p.city));
    return Array.from(citySet).sort();
  }, [properties]);

  // Apply filters
  const filteredProperties = useMemo(() => {
    let result = [...properties];

    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(searchLower) ||
          p.city.toLowerCase().includes(searchLower) ||
          (p.address && p.address.toLowerCase().includes(searchLower))
      );
    }

    // Status filter
    if (filters.status !== 'all') {
      if (filters.status === 'rented') {
        result = result.filter((p) => p.isRented);
      } else if (filters.status === 'vacant') {
        result = result.filter((p) => !p.isRented && p.status === 'published');
      } else {
        result = result.filter((p) => p.status === filters.status);
      }
    }

    // Health filter
    if (filters.health !== 'all') {
      result = result.filter((p) => calculateHealth(p) === filters.health);
    }

    // City filter
    if (filters.city) {
      result = result.filter((p) => p.city === filters.city);
    }

    // Rent range filter
    if (filters.minRent !== null) {
      result = result.filter((p) => p.monthlyRent >= filters.minRent!);
    }
    if (filters.maxRent !== null) {
      result = result.filter((p) => p.monthlyRent <= filters.maxRent!);
    }

    // Sort
    result.sort((a, b) => {
      let comparison = 0;

      switch (filters.sortField) {
        case 'rent':
          comparison = a.monthlyRent - b.monthlyRent;
          break;
        case 'views':
          comparison = a.views - b.views;
          break;
        case 'inquiries':
          comparison = a.inquiries - b.inquiries;
          break;
        case 'name':
          comparison = a.title.localeCompare(b.title);
          break;
        case 'city':
          comparison = a.city.localeCompare(b.city);
          break;
        case 'created':
        default:
          comparison = (a.createdAt?.getTime() || 0) - (b.createdAt?.getTime() || 0);
          break;
      }

      return filters.sortOrder === 'asc' ? comparison : -comparison;
    });

    return result;
  }, [properties, filters]);

  // Calculate health summary
  const healthSummary = useMemo(() => {
    const summary = { excellent: 0, attention: 0, critical: 0 };
    properties.forEach((p) => {
      const health = calculateHealth(p);
      summary[health]++;
    });
    return summary;
  }, [properties]);

  // Handle selection toggle
  const toggleSelection = (propertyId: string, selected: boolean) => {
    if (!onSelectionChange) return;

    const newSelection = new Set(selectedProperties);
    if (selected) {
      newSelection.add(propertyId);
    } else {
      newSelection.delete(propertyId);
    }
    onSelectionChange(newSelection);
  };

  return (
    <div className={className}>
      {/* Health Summary Bar */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/80 backdrop-blur-sm superellipse-2xl border border-gray-200 shadow-sm p-4 mb-6"
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          {/* Health Overview */}
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 superellipse-xl flex items-center justify-center shadow-sm"
                style={{ background: ownerGradient }}
              >
                <Building2 className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-lg font-bold text-gray-900">{properties.length} {t?.biens?.[language] || 'properties'}</p>
                <p className="text-sm text-gray-500">{t?.propertiesInPortfolio?.[language] || 'in your portfolio'}</p>
              </div>
            </div>

            <div className="h-10 w-px bg-gray-200 hidden md:block" />

            {/* Health Indicators */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 superellipse-lg bg-emerald-100 flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                </div>
                <div>
                  <p className="text-lg font-bold text-emerald-600">{healthSummary.excellent}</p>
                  <p className="text-xs text-gray-500">{t?.excellent?.[language] || 'Excellent'}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="w-8 h-8 superellipse-lg bg-amber-100 flex items-center justify-center">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                </div>
                <div>
                  <p className="text-lg font-bold text-amber-600">{healthSummary.attention}</p>
                  <p className="text-xs text-gray-500">{t?.attention?.[language] || 'Attention'}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="w-8 h-8 superellipse-lg bg-red-100 flex items-center justify-center">
                  <Clock className="w-4 h-4 text-red-600" />
                </div>
                <div>
                  <p className="text-lg font-bold text-red-600">{healthSummary.critical}</p>
                  <p className="text-xs text-gray-500">{t?.critical?.[language] || 'Critical'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="flex items-center gap-6">
            <div className="text-center">
              <p className="text-lg font-bold" style={{ color: '#9c5698' }}>
                {properties.filter((p) => p.isRented).length}
              </p>
              <p className="text-xs text-gray-500">{t?.rented?.[language] || 'Rented'}</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-amber-600">
                {properties.filter((p) => !p.isRented && p.status === 'published').length}
              </p>
              <p className="text-xs text-gray-500">{t?.vacants?.[language] || 'Vacant'}</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-gray-600">
                {properties.filter((p) => p.status === 'draft').length}
              </p>
              <p className="text-xs text-gray-500">{t?.drafts?.[language] || 'Drafts'}</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Filters */}
      <PropertyFilters
        filters={filters}
        onFiltersChange={onFiltersChange}
        viewMode={viewMode}
        onViewModeChange={onViewModeChange}
        cities={cities}
        totalCount={properties.length}
        filteredCount={filteredProperties.length}
        className="mb-6"
      />

      {/* Properties Grid/List */}
      {filteredProperties.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/80 backdrop-blur-sm superellipse-2xl border border-gray-200 shadow-sm p-12 text-center"
        >
          <div
            className="w-20 h-20 mx-auto superellipse-2xl flex items-center justify-center mb-4 opacity-50"
            style={{ background: ownerGradient }}
          >
            <Home className="w-10 h-10 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{t?.noPropertiesFound?.[language] || 'No properties found'}</h3>
          <p className="text-gray-500 max-w-md mx-auto">
            {filters.search || filters.status !== 'all' || filters.health !== 'all'
              ? (t?.noPropertiesFilterHint?.[language] || 'Try adjusting your filters to see more results.')
              : (t?.noPropertiesYetHint?.[language] || 'You don\'t have any properties in your portfolio yet.')}
          </p>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={cn(
            viewMode === 'grid'
              ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6'
              : 'space-y-3'
          )}
        >
          {filteredProperties.map((property, index) => (
            <motion.div
              key={property.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.02 }}
            >
              <PropertyCard
                property={property}
                variant={viewMode === 'list' ? 'list' : 'default'}
                onClick={() => onPropertyClick?.(property)}
                onEdit={() => onPropertyEdit?.(property)}
                onArchive={() => onPropertyArchive?.(property)}
                onDelete={() => onPropertyDelete?.(property)}
                onHistory={() => onPropertyHistory?.(property)}
                onViewDetails={() => onPropertyClick?.(property)}
                selected={selectedProperties.has(property.id)}
                onSelect={
                  onSelectionChange
                    ? (selected) => toggleSelection(property.id, selected)
                    : undefined
                }
              />
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}

export default PropertyHealthGrid;
