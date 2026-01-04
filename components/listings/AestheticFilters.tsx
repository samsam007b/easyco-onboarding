'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sun,
  Thermometer,
  Palette,
  Bed,
  Eye,
  ChevronDown,
  ChevronUp,
  Sparkles,
  X,
} from 'lucide-react';
import {
  DesignStyle,
  HeatingType,
  FurnitureStyle,
  RoomAtmosphere,
  AestheticSearchFilters,
  DESIGN_STYLE_LABELS,
  HEATING_TYPE_LABELS,
  FURNITURE_STYLE_LABELS,
  ROOM_ATMOSPHERE_LABELS,
  getDesignStyleIcon,
} from '@/types/room-aesthetics.types';
import { useLanguage } from '@/lib/i18n/use-language';

interface AestheticFiltersProps {
  filters: AestheticSearchFilters;
  onChange: (filters: AestheticSearchFilters) => void;
  onApply: () => void;
  onReset: () => void;
}

export function AestheticFilters({ filters, onChange, onApply, onReset }: AestheticFiltersProps) {
  const { language, getSection } = useLanguage();
  const t = getSection('aestheticFilters');
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(['design', 'light', 'heating'])
  );

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      if (next.has(section)) {
        next.delete(section);
      } else {
        next.add(section);
      }
      return next;
    });
  };

  const handleDesignStyleToggle = (style: DesignStyle) => {
    const currentStyles = filters.design_styles || [];
    const newStyles = currentStyles.includes(style)
      ? currentStyles.filter((s) => s !== style)
      : [...currentStyles, style];

    onChange({ ...filters, design_styles: newStyles.length > 0 ? newStyles : undefined });
  };

  const handleHeatingTypeToggle = (type: HeatingType) => {
    const currentTypes = filters.heating_types || [];
    const newTypes = currentTypes.includes(type)
      ? currentTypes.filter((t) => t !== type)
      : [...currentTypes, type];

    onChange({ ...filters, heating_types: newTypes.length > 0 ? newTypes : undefined });
  };

  const handleFurnitureStyleToggle = (style: FurnitureStyle) => {
    const currentStyles = filters.furniture_styles || [];
    const newStyles = currentStyles.includes(style)
      ? currentStyles.filter((s) => s !== style)
      : [...currentStyles, style];

    onChange({ ...filters, furniture_styles: newStyles.length > 0 ? newStyles : undefined });
  };

  const handleAtmosphereToggle = (atmosphere: RoomAtmosphere) => {
    const currentAtmospheres = filters.room_atmospheres || [];
    const newAtmospheres = currentAtmospheres.includes(atmosphere)
      ? currentAtmospheres.filter((a) => a !== atmosphere)
      : [...currentAtmospheres, atmosphere];

    onChange({
      ...filters,
      room_atmospheres: newAtmospheres.length > 0 ? newAtmospheres : undefined,
    });
  };

  const activeFilterCount = [
    filters.design_styles?.length,
    filters.min_natural_light,
    filters.heating_types?.length,
    filters.min_design_quality,
    filters.furniture_styles?.length,
    filters.room_atmospheres?.length,
  ].filter(Boolean).length;

  return (
    <div className="bg-white superellipse-xl shadow-sm border overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b bg-gradient-to-r from-purple-50 to-pink-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-600" />
            <h3 className="font-semibold text-lg">{t.title}</h3>
            {activeFilterCount > 0 && (
              <span className="px-2 py-1 bg-purple-600 text-white text-xs rounded-full">
                {activeFilterCount}
              </span>
            )}
          </div>
          {activeFilterCount > 0 && (
            <button
              onClick={onReset}
              className="text-sm text-purple-600 hover:text-purple-700 font-medium flex items-center gap-1"
            >
              <X className="w-4 h-4" />
              {t.clearAll}
            </button>
          )}
        </div>
      </div>

      {/* Filter Sections */}
      <div className="divide-y">
        {/* Design Style */}
        <FilterSection
          title={t.designStyle}
          icon={Palette}
          isExpanded={expandedSections.has('design')}
          onToggle={() => toggleSection('design')}
          activeCount={filters.design_styles?.length}
        >
          <div className="grid grid-cols-2 gap-2">
            {(Object.keys(DESIGN_STYLE_LABELS) as DesignStyle[]).map((style) => (
              <button
                key={style}
                onClick={() => handleDesignStyleToggle(style)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  filters.design_styles?.includes(style)
                    ? 'bg-purple-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <span className="mr-1">{getDesignStyleIcon(style)}</span>
                {DESIGN_STYLE_LABELS[style]}
              </button>
            ))}
          </div>

          {/* Design Quality Slider */}
          <div className="mt-4 pt-4 border-t">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t.minDesignQuality} {filters.min_design_quality || t.any}
            </label>
            <input
              type="range"
              min="1"
              max="10"
              value={filters.min_design_quality || 1}
              onChange={(e) =>
                onChange({
                  ...filters,
                  min_design_quality: parseInt(e.target.value),
                })
              }
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>{t.basic}</span>
              <span>{t.exceptional}</span>
            </div>
          </div>
        </FilterSection>

        {/* Natural Light */}
        <FilterSection
          title={t.naturalLight}
          icon={Sun}
          isExpanded={expandedSections.has('light')}
          onToggle={() => toggleSection('light')}
          activeCount={filters.min_natural_light ? 1 : 0}
        >
          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t.minNaturalLight} {filters.min_natural_light || t.any}
            </label>
            <input
              type="range"
              min="1"
              max="10"
              value={filters.min_natural_light || 1}
              onChange={(e) =>
                onChange({
                  ...filters,
                  min_natural_light: parseInt(e.target.value),
                })
              }
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-yellow-500"
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>{t.dark1}</span>
              <span>{t.veryBright10}</span>
            </div>

            {/* Visual indicators */}
            <div className="grid grid-cols-5 gap-2 mt-4">
              {[
                { range: [1, 2], labelKey: 'dark' as const, emoji: '🌑' },
                { range: [3, 4], labelKey: 'dim' as const, emoji: '🌘' },
                { range: [5, 6], labelKey: 'moderate' as const, emoji: '🌗' },
                { range: [7, 8], labelKey: 'bright' as const, emoji: '🌕' },
                { range: [9, 10], labelKey: 'veryBright' as const, emoji: '☀️' },
              ].map(({ range, labelKey, emoji }) => (
                <button
                  key={labelKey}
                  onClick={() =>
                    onChange({
                      ...filters,
                      min_natural_light: range[0],
                    })
                  }
                  className={`p-2 rounded-lg text-xs text-center transition-all ${
                    filters.min_natural_light &&
                    filters.min_natural_light >= range[0] &&
                    filters.min_natural_light <= range[1]
                      ? 'bg-yellow-100 border-2 border-yellow-500'
                      : 'bg-gray-50 hover:bg-gray-100'
                  }`}
                >
                  <div className="text-lg mb-1">{emoji}</div>
                  <div className="font-medium">{t[labelKey]}</div>
                </button>
              ))}
            </div>
          </div>
        </FilterSection>

        {/* Heating Type */}
        <FilterSection
          title={t.heatingCooling}
          icon={Thermometer}
          isExpanded={expandedSections.has('heating')}
          onToggle={() => toggleSection('heating')}
          activeCount={filters.heating_types?.length}
        >
          <div className="grid grid-cols-2 gap-2">
            {(
              [
                'central_heating',
                'radiator',
                'floor_heating',
                'air_conditioning',
                'heat_pump',
              ] as HeatingType[]
            ).map((type) => (
              <button
                key={type}
                onClick={() => handleHeatingTypeToggle(type)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  filters.heating_types?.includes(type)
                    ? 'bg-red-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {HEATING_TYPE_LABELS[type]}
              </button>
            ))}
          </div>
        </FilterSection>

        {/* Furniture Style */}
        <FilterSection
          title={t.furnitureStyle}
          icon={Bed}
          isExpanded={expandedSections.has('furniture')}
          onToggle={() => toggleSection('furniture')}
          activeCount={filters.furniture_styles?.length}
        >
          <div className="grid grid-cols-2 gap-2">
            {(Object.keys(FURNITURE_STYLE_LABELS) as FurnitureStyle[]).map((style) => (
              <button
                key={style}
                onClick={() => handleFurnitureStyleToggle(style)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  filters.furniture_styles?.includes(style)
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {FURNITURE_STYLE_LABELS[style]}
              </button>
            ))}
          </div>
        </FilterSection>

        {/* Room Atmosphere */}
        <FilterSection
          title={t.roomAtmosphere}
          icon={Eye}
          isExpanded={expandedSections.has('atmosphere')}
          onToggle={() => toggleSection('atmosphere')}
          activeCount={filters.room_atmospheres?.length}
        >
          <div className="grid grid-cols-2 gap-2">
            {(Object.keys(ROOM_ATMOSPHERE_LABELS) as RoomAtmosphere[]).map((atmosphere) => (
              <button
                key={atmosphere}
                onClick={() => handleAtmosphereToggle(atmosphere)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  filters.room_atmospheres?.includes(atmosphere)
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {ROOM_ATMOSPHERE_LABELS[atmosphere]}
              </button>
            ))}
          </div>
        </FilterSection>
      </div>

      {/* Action Buttons */}
      <div className="px-6 py-4 bg-gray-50 flex gap-3">
        <button
          onClick={onApply}
          className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all shadow-md"
        >
          {t.applyFilters}
        </button>
        <button
          onClick={onReset}
          className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
        >
          {t.reset}
        </button>
      </div>
    </div>
  );
}

// Filter Section Component
interface FilterSectionProps {
  title: string;
  icon: React.ElementType;
  isExpanded: boolean;
  onToggle: () => void;
  activeCount?: number;
  children: React.ReactNode;
}

function FilterSection({
  title,
  icon: Icon,
  isExpanded,
  onToggle,
  activeCount,
  children,
}: FilterSectionProps) {
  return (
    <div>
      <button
        onClick={onToggle}
        className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <Icon className="w-5 h-5 text-gray-600" />
          <span className="font-medium">{title}</span>
          {activeCount !== undefined && activeCount > 0 && (
            <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs rounded-full font-medium">
              {activeCount}
            </span>
          )}
        </div>
        {isExpanded ? (
          <ChevronUp className="w-5 h-5 text-gray-400" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-400" />
        )}
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-4">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
