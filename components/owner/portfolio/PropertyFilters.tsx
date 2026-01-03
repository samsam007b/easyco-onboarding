'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Filter,
  X,
  ChevronDown,
  Building2,
  MapPin,
  Euro,
  CheckCircle,
  AlertTriangle,
  Clock,
  LayoutGrid,
  List,
  SortAsc,
  SortDesc,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { ownerGradient } from '@/lib/constants/owner-theme';
import { useLanguage } from '@/lib/i18n/use-language';

export type PropertyStatus = 'all' | 'published' | 'draft' | 'archived' | 'rented' | 'vacant';
export type PropertyHealth = 'all' | 'excellent' | 'attention' | 'critical';
export type SortField = 'created' | 'rent' | 'views' | 'inquiries' | 'name' | 'city';
export type SortOrder = 'asc' | 'desc';
export type ViewMode = 'grid' | 'list';

export interface PropertyFiltersState {
  search: string;
  status: PropertyStatus;
  health: PropertyHealth;
  city: string;
  minRent: number | null;
  maxRent: number | null;
  sortField: SortField;
  sortOrder: SortOrder;
}

interface PropertyFiltersProps {
  filters: PropertyFiltersState;
  onFiltersChange: (filters: PropertyFiltersState) => void;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  cities: string[];
  totalCount: number;
  filteredCount: number;
  className?: string;
}

// Status, health, and sort options with translation keys
const statusOptionsConfig = [
  { value: 'all' as const, labelKey: 'allStatuses', icon: Building2 },
  { value: 'published' as const, labelKey: 'published', icon: CheckCircle },
  { value: 'rented' as const, labelKey: 'rented', icon: CheckCircle },
  { value: 'vacant' as const, labelKey: 'vacant', icon: AlertTriangle },
  { value: 'draft' as const, labelKey: 'drafts', icon: Clock },
  { value: 'archived' as const, labelKey: 'archived', icon: Clock },
];

const healthOptionsConfig = [
  { value: 'all' as const, labelKey: 'allHealth', color: '#6B7280' },
  { value: 'excellent' as const, labelKey: 'excellent', color: '#059669' },
  { value: 'attention' as const, labelKey: 'attention', color: '#D97706' },
  { value: 'critical' as const, labelKey: 'critical', color: '#DC2626' },
];

const sortOptionsConfig: { value: SortField; labelKey: string }[] = [
  { value: 'created', labelKey: 'sortCreated' },
  { value: 'rent', labelKey: 'sortRent' },
  { value: 'views', labelKey: 'sortViews' },
  { value: 'inquiries', labelKey: 'sortInquiries' },
  { value: 'name', labelKey: 'sortName' },
  { value: 'city', labelKey: 'sortCity' },
];

export function PropertyFilters({
  filters,
  onFiltersChange,
  viewMode,
  onViewModeChange,
  cities,
  totalCount,
  filteredCount,
  className,
}: PropertyFiltersProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const { language, getSection } = useLanguage();
  const t = getSection('ownerPortfolio')?.filters;

  // Check if any filters are active
  const hasActiveFilters = useMemo(() => {
    return (
      filters.search !== '' ||
      filters.status !== 'all' ||
      filters.health !== 'all' ||
      filters.city !== '' ||
      filters.minRent !== null ||
      filters.maxRent !== null
    );
  }, [filters]);

  // Count active filters
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.search) count++;
    if (filters.status !== 'all') count++;
    if (filters.health !== 'all') count++;
    if (filters.city) count++;
    if (filters.minRent !== null || filters.maxRent !== null) count++;
    return count;
  }, [filters]);

  // Reset all filters
  const resetFilters = () => {
    onFiltersChange({
      search: '',
      status: 'all',
      health: 'all',
      city: '',
      minRent: null,
      maxRent: null,
      sortField: 'created',
      sortOrder: 'desc',
    });
  };

  // Update single filter
  const updateFilter = <K extends keyof PropertyFiltersState>(
    key: K,
    value: PropertyFiltersState[K]
  ) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const currentStatus = statusOptionsConfig.find(s => s.value === filters.status);
  const currentHealth = healthOptionsConfig.find(h => h.value === filters.health);
  const currentSort = sortOptionsConfig.find(s => s.value === filters.sortField);

  // Helper to get label from translation key
  const getLabel = (key: string) => t?.[key]?.[language] || key;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        'bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200 shadow-sm',
        className
      )}
    >
      {/* Main Filter Row */}
      <div className="p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              type="text"
              placeholder={t?.searchProperty?.[language] || 'Rechercher un bien...'}
              value={filters.search}
              onChange={(e) => updateFilter('search', e.target.value)}
              className="pl-10 rounded-xl border-gray-200"
            />
            {filters.search && (
              <button
                onClick={() => updateFilter('search', '')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Status Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  'rounded-xl justify-between min-w-[160px]',
                  filters.status !== 'all' && 'border-purple-300 bg-purple-50'
                )}
              >
                <span className="flex items-center gap-2">
                  {currentStatus && <currentStatus.icon className="w-4 h-4" />}
                  {currentStatus ? getLabel(currentStatus.labelKey) : ''}
                </span>
                <ChevronDown className="w-4 h-4 ml-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              {statusOptionsConfig.map((option) => (
                <DropdownMenuItem
                  key={option.value}
                  onClick={() => updateFilter('status', option.value)}
                  className={cn(filters.status === option.value && 'bg-purple-50')}
                >
                  <option.icon className="w-4 h-4 mr-2" />
                  {getLabel(option.labelKey)}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Health Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  'rounded-xl justify-between min-w-[140px]',
                  filters.health !== 'all' && 'border-purple-300 bg-purple-50'
                )}
              >
                <span className="flex items-center gap-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: currentHealth?.color }}
                  />
                  {currentHealth ? getLabel(currentHealth.labelKey) : ''}
                </span>
                <ChevronDown className="w-4 h-4 ml-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              {healthOptionsConfig.map((option) => (
                <DropdownMenuItem
                  key={option.value}
                  onClick={() => updateFilter('health', option.value)}
                  className={cn(filters.health === option.value && 'bg-purple-50')}
                >
                  <span
                    className="w-2.5 h-2.5 rounded-full mr-2"
                    style={{ backgroundColor: option.color }}
                  />
                  {getLabel(option.labelKey)}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* City Dropdown */}
          {cities.length > 0 && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    'rounded-xl justify-between min-w-[140px]',
                    filters.city && 'border-purple-300 bg-purple-50'
                  )}
                >
                  <span className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    {filters.city || getLabel('allCities')}
                  </span>
                  <ChevronDown className="w-4 h-4 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 max-h-60 overflow-auto">
                <DropdownMenuItem
                  onClick={() => updateFilter('city', '')}
                  className={cn(!filters.city && 'bg-purple-50')}
                >
                  {getLabel('allCitiesLong')}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                {cities.map((city) => (
                  <DropdownMenuItem
                    key={city}
                    onClick={() => updateFilter('city', city)}
                    className={cn(filters.city === city && 'bg-purple-50')}
                  >
                    {city}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {/* Advanced Filters Toggle */}
          <Button
            variant="outline"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className={cn(
              'rounded-xl',
              showAdvanced && 'border-purple-300 bg-purple-50'
            )}
          >
            <Filter className="w-4 h-4 mr-2" />
            {getLabel('filters')}
            {activeFilterCount > 0 && (
              <span
                className="ml-2 px-1.5 py-0.5 text-xs font-bold rounded-full text-white"
                style={{ background: ownerGradient }}
              >
                {activeFilterCount}
              </span>
            )}
          </Button>

          {/* View Mode Toggle */}
          <div className="flex items-center gap-1 border border-gray-200 rounded-xl p-1">
            <button
              onClick={() => onViewModeChange('grid')}
              className={cn(
                'p-2 rounded-lg transition-colors',
                viewMode === 'grid'
                  ? 'bg-purple-100 text-purple-600'
                  : 'text-gray-400 hover:text-gray-600'
              )}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => onViewModeChange('list')}
              className={cn(
                'p-2 rounded-lg transition-colors',
                viewMode === 'list'
                  ? 'bg-purple-100 text-purple-600'
                  : 'text-gray-400 hover:text-gray-600'
              )}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Advanced Filters Panel */}
        <AnimatePresence>
          {showAdvanced && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="pt-4 mt-4 border-t border-gray-100">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Price Range */}
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      {getLabel('rentRange')}
                    </label>
                    <div className="flex items-center gap-2">
                      <div className="relative flex-1">
                        <Euro className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input
                          type="number"
                          placeholder={getLabel('min')}
                          value={filters.minRent || ''}
                          onChange={(e) =>
                            updateFilter('minRent', e.target.value ? Number(e.target.value) : null)
                          }
                          className="pl-9 rounded-lg"
                        />
                      </div>
                      <span className="text-gray-400">-</span>
                      <div className="relative flex-1">
                        <Euro className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input
                          type="number"
                          placeholder={getLabel('max')}
                          value={filters.maxRent || ''}
                          onChange={(e) =>
                            updateFilter('maxRent', e.target.value ? Number(e.target.value) : null)
                          }
                          className="pl-9 rounded-lg"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Sort */}
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      {getLabel('sortBy')}
                    </label>
                    <div className="flex items-center gap-2">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" className="flex-1 justify-between rounded-lg">
                            {currentSort ? getLabel(currentSort.labelKey) : ''}
                            <ChevronDown className="w-4 h-4 ml-2" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start" className="w-48">
                          {sortOptionsConfig.map((option) => (
                            <DropdownMenuItem
                              key={option.value}
                              onClick={() => updateFilter('sortField', option.value)}
                              className={cn(filters.sortField === option.value && 'bg-purple-50')}
                            >
                              {getLabel(option.labelKey)}
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() =>
                          updateFilter('sortOrder', filters.sortOrder === 'asc' ? 'desc' : 'asc')
                        }
                        className="rounded-lg"
                      >
                        {filters.sortOrder === 'asc' ? (
                          <SortAsc className="w-4 h-4" />
                        ) : (
                          <SortDesc className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                  </div>

                  {/* Reset */}
                  <div className="flex items-end">
                    {hasActiveFilters && (
                      <Button
                        variant="ghost"
                        onClick={resetFilters}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <X className="w-4 h-4 mr-2" />
                        {getLabel('reset')}
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Results Count Bar */}
      <div className="px-4 py-2 bg-gray-50 border-t border-gray-100 rounded-b-2xl flex items-center justify-between text-sm">
        <span className="text-gray-600">
          {filteredCount === totalCount ? (
            <>{totalCount} {totalCount > 1 ? getLabel('propertiesPlural') : getLabel('property')}</>
          ) : (
            <>
              {filteredCount} {getLabel('of')} {totalCount} {totalCount > 1 ? getLabel('propertiesPlural') : getLabel('property')}
            </>
          )}
        </span>
        {hasActiveFilters && (
          <button
            onClick={resetFilters}
            className="text-purple-600 hover:text-purple-700 font-medium"
          >
            {getLabel('clearFilters')}
          </button>
        )}
      </div>
    </motion.div>
  );
}

export default PropertyFilters;
