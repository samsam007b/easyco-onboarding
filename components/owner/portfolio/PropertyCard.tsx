'use client';

import { motion } from 'framer-motion';
import {
  Home,
  Eye,
  MessageSquare,
  Euro,
  Bed,
  MapPin,
  MoreHorizontal,
  ExternalLink,
  Edit,
  Archive,
  Trash2,
  Calendar,
  Users,
  TrendingUp,
  TrendingDown,
  CheckCircle,
  AlertTriangle,
  Clock,
  History,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { ownerGradient, semanticColors } from '@/lib/constants/owner-theme';
import { useLanguage } from '@/lib/i18n/use-language';

export type PropertyStatus = 'published' | 'draft' | 'archived';
export type PropertyHealth = 'excellent' | 'attention' | 'critical';

export interface PropertyCardData {
  id: string;
  title: string;
  city: string;
  address?: string;
  status: PropertyStatus;
  monthlyRent: number;
  bedrooms: number;
  bathrooms?: number;
  surface?: number;
  mainImage?: string;
  images?: string[];
  views: number;
  inquiries: number;
  applications?: number;
  daysVacant?: number;
  isRented: boolean;
  tenantName?: string;
  leaseEndDate?: Date;
  createdAt?: Date;
  health?: PropertyHealth;
}

interface PropertyCardProps {
  property: PropertyCardData;
  variant?: 'default' | 'compact' | 'list';
  onClick?: () => void;
  onEdit?: () => void;
  onArchive?: () => void;
  onDelete?: () => void;
  onViewDetails?: () => void;
  onHistory?: () => void;
  selected?: boolean;
  onSelect?: (selected: boolean) => void;
  className?: string;
}

// Calculate health based on property state
function calculateHealth(property: PropertyCardData): PropertyHealth {
  if (property.health) return property.health;

  if (property.isRented) return 'excellent';
  if (property.status === 'draft') return 'attention';
  if (property.status === 'archived') return 'attention';
  if (property.daysVacant && property.daysVacant > 30) return 'critical';
  if (property.daysVacant && property.daysVacant > 14) return 'attention';
  return 'excellent';
}

const healthConfig = {
  excellent: {
    color: '#059669',
    bgColor: 'bg-emerald-100',
    borderColor: 'border-emerald-300',
    labelKey: 'excellent',
    icon: CheckCircle,
  },
  attention: {
    color: '#D97706',
    bgColor: 'bg-amber-100',
    borderColor: 'border-amber-300',
    labelKey: 'attention',
    icon: AlertTriangle,
  },
  critical: {
    color: '#DC2626',
    bgColor: 'bg-red-100',
    borderColor: 'border-red-300',
    labelKey: 'critical',
    icon: Clock,
  },
};

const statusConfig = {
  published: {
    labelKey: 'publishedStatus',
    bgColor: 'bg-emerald-100',
    textColor: 'text-emerald-700',
  },
  draft: {
    labelKey: 'draft',
    bgColor: 'bg-gray-100',
    textColor: 'text-gray-600',
  },
  archived: {
    labelKey: 'archived',
    bgColor: 'bg-slate-100',
    textColor: 'text-slate-600',
  },
};

export function PropertyCard({
  property,
  variant = 'default',
  onClick,
  onEdit,
  onArchive,
  onDelete,
  onViewDetails,
  onHistory,
  selected,
  onSelect,
  className,
}: PropertyCardProps) {
  const { language, getSection } = useLanguage();
  const t = getSection('ownerPortfolio');

  const health = calculateHealth(property);
  const healthStyle = healthConfig[health];
  const statusStyle = statusConfig[property.status];
  const HealthIcon = healthStyle.icon;

  // Get translated labels
  const healthLabel = t?.[healthStyle.labelKey]?.[language] || healthStyle.labelKey;
  const statusLabel = property.isRented
    ? (t?.rented?.[language] || 'Rented')
    : (t?.[statusStyle.labelKey]?.[language] || statusStyle.labelKey);

  // Compact list variant
  if (variant === 'list') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ x: 4 }}
        onClick={onClick}
        className={cn(
          'flex items-center gap-4 p-4 bg-white superellipse-xl border border-gray-200',
          'hover:shadow-md hover:border-gray-300 transition-all cursor-pointer',
          selected && 'ring-2 ring-purple-400 border-purple-300',
          className
        )}
      >
        {/* Selection Checkbox */}
        {onSelect && (
          <input
            type="checkbox"
            checked={selected}
            onChange={(e) => {
              e.stopPropagation();
              onSelect(e.target.checked);
            }}
            className="w-4 h-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
          />
        )}

        {/* Health Indicator */}
        <div
          className={cn(
            'w-3 h-3 rounded-full flex-shrink-0',
            healthStyle.bgColor
          )}
          style={{ backgroundColor: healthStyle.color }}
        />

        {/* Image */}
        <div className="w-16 h-12 superellipse-lg overflow-hidden flex-shrink-0 bg-gray-100">
          {property.mainImage ? (
            <img
              src={property.mainImage}
              alt={property.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div
              className="w-full h-full flex items-center justify-center"
              style={{ background: ownerGradient }}
            >
              <Home className="w-5 h-5 text-white" />
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="font-semibold text-gray-900 truncate">{property.title}</p>
            <span className={cn('px-2 py-0.5 text-xs font-medium rounded-full', statusStyle.bgColor, statusStyle.textColor)}>
              {statusLabel}
            </span>
          </div>
          <p className="text-sm text-gray-500 flex items-center gap-1">
            <MapPin className="w-3 h-3" />
            {property.city}
            <span className="mx-1">·</span>
            <Bed className="w-3 h-3" />
            {property.bedrooms}
            <span className="mx-1">·</span>
            <Euro className="w-3 h-3" />
            {property.monthlyRent.toLocaleString()}€
          </p>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-4 text-sm text-gray-500">
          <span className="flex items-center gap-1">
            <Eye className="w-4 h-4" />
            {property.views}
          </span>
          <span className="flex items-center gap-1">
            <MessageSquare className="w-4 h-4" />
            {property.inquiries}
          </span>
          {property.applications !== undefined && (
            <span className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              {property.applications}
            </span>
          )}
        </div>

        {/* Actions */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => e.stopPropagation()}>
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {onViewDetails && (
              <DropdownMenuItem onClick={onViewDetails}>
                <ExternalLink className="w-4 h-4 mr-2" />
                {t?.viewDetails?.[language] || 'View details'}
              </DropdownMenuItem>
            )}
            {onEdit && (
              <DropdownMenuItem onClick={onEdit}>
                <Edit className="w-4 h-4 mr-2" />
                {t?.edit?.[language] || 'Edit'}
              </DropdownMenuItem>
            )}
            {onHistory && (
              <DropdownMenuItem onClick={onHistory}>
                <History className="w-4 h-4 mr-2" />
                {t?.history?.[language] || 'History'}
              </DropdownMenuItem>
            )}
            {onArchive && (
              <DropdownMenuItem onClick={onArchive}>
                <Archive className="w-4 h-4 mr-2" />
                {t?.archive?.[language] || 'Archive'}
              </DropdownMenuItem>
            )}
            {onDelete && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={onDelete} className="text-red-600">
                  <Trash2 className="w-4 h-4 mr-2" />
                  {t?.delete?.[language] || 'Delete'}
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </motion.div>
    );
  }

  // Compact card variant
  if (variant === 'compact') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ y: -4, scale: 1.02 }}
        onClick={onClick}
        className={cn(
          'bg-white superellipse-xl border border-gray-200 overflow-hidden',
          'hover:shadow-lg hover:border-gray-300 transition-all cursor-pointer',
          selected && 'ring-2 ring-purple-400',
          className
        )}
      >
        {/* Image */}
        <div className="relative h-32 bg-gray-100">
          {property.mainImage ? (
            <img
              src={property.mainImage}
              alt={property.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div
              className="w-full h-full flex items-center justify-center"
              style={{ background: ownerGradient }}
            >
              <Home className="w-10 h-10 text-white opacity-50" />
            </div>
          )}

          {/* Health Badge */}
          <div
            className={cn(
              'absolute top-2 left-2 px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1',
              healthStyle.bgColor
            )}
            style={{ color: healthStyle.color }}
          >
            <HealthIcon className="w-3 h-3" />
            {healthLabel}
          </div>

          {/* Status Badge */}
          <div className={cn(
            'absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-medium',
            statusStyle.bgColor,
            statusStyle.textColor
          )}>
            {statusLabel}
          </div>
        </div>

        {/* Content */}
        <div className="p-3">
          <h4 className="font-semibold text-gray-900 truncate text-sm">{property.title}</h4>
          <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
            <MapPin className="w-3 h-3" />
            {property.city}
          </p>
          <div className="flex items-center justify-between mt-2">
            <span className="text-sm font-bold" style={{ color: '#9c5698' }}>
              {property.monthlyRent.toLocaleString()}€
            </span>
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <span className="flex items-center gap-0.5">
                <Eye className="w-3 h-3" />
                {property.views}
              </span>
              <span className="flex items-center gap-0.5">
                <MessageSquare className="w-3 h-3" />
                {property.inquiries}
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  // Default card variant
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      onClick={onClick}
      className={cn(
        'bg-white superellipse-2xl border border-gray-200 overflow-hidden',
        'hover:shadow-xl hover:border-gray-300 transition-all cursor-pointer',
        selected && 'ring-2 ring-purple-400',
        className
      )}
    >
      {/* Image Section */}
      <div className="relative h-48 bg-gray-100">
        {property.mainImage ? (
          <img
            src={property.mainImage}
            alt={property.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center"
            style={{ background: ownerGradient }}
          >
            <Home className="w-16 h-16 text-white opacity-50" />
          </div>
        )}

        {/* Health Indicator */}
        <div
          className={cn(
            'absolute top-3 left-3 px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5',
            healthStyle.bgColor
          )}
          style={{ color: healthStyle.color }}
        >
          <HealthIcon className="w-3.5 h-3.5" />
          {healthLabel}
        </div>

        {/* Status Badge */}
        <div className={cn(
          'absolute top-3 right-3 px-3 py-1.5 rounded-full text-xs font-semibold',
          statusStyle.bgColor,
          statusStyle.textColor
        )}>
          {statusLabel}
        </div>

        {/* Selection Checkbox */}
        {onSelect && (
          <div className="absolute bottom-3 left-3">
            <input
              type="checkbox"
              checked={selected}
              onChange={(e) => {
                e.stopPropagation();
                onSelect(e.target.checked);
              }}
              className="w-5 h-5 rounded border-white/50 bg-white/20 text-purple-600 focus:ring-purple-500"
            />
          </div>
        )}

        {/* Vacant Days Warning */}
        {property.daysVacant && property.daysVacant > 0 && !property.isRented && (
          <div className="absolute bottom-3 right-3 px-2 py-1 bg-black/60 backdrop-blur-sm superellipse-lg text-xs text-white flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {property.daysVacant}{t?.daysVacant?.[language] || 'd vacant'}
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-4">
        {/* Title and Location */}
        <div className="mb-3">
          <h3 className="font-bold text-gray-900 text-lg line-clamp-1">{property.title}</h3>
          <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
            <MapPin className="w-4 h-4" />
            {property.address || property.city}
          </p>
        </div>

        {/* Property Details */}
        <div className="flex items-center gap-4 mb-4 text-sm text-gray-600">
          <span className="flex items-center gap-1">
            <Bed className="w-4 h-4" />
            {property.bedrooms} {t?.bedrooms?.[language] || 'bd'}
          </span>
          {property.bathrooms !== undefined && (
            <span className="flex items-center gap-1">
              {property.bathrooms} {t?.bathrooms?.[language] || 'ba'}
            </span>
          )}
          {property.surface !== undefined && (
            <span className="flex items-center gap-1">
              {property.surface} {t?.sqm?.[language] || 'm²'}
            </span>
          )}
        </div>

        {/* Price and Stats */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div>
            <p className="text-2xl font-bold" style={{ color: '#9c5698' }}>
              {property.monthlyRent.toLocaleString()}€
            </p>
            <p className="text-xs text-gray-500">{t?.perMonth?.[language] || '/month'}</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-center">
              <div className="flex items-center gap-1 text-gray-600">
                <Eye className="w-4 h-4" />
                <span className="font-semibold">{property.views}</span>
              </div>
              <p className="text-[10px] text-gray-400">{t?.views?.[language] || 'views'}</p>
            </div>
            <div className="text-center">
              <div className="flex items-center gap-1 text-gray-600">
                <MessageSquare className="w-4 h-4" />
                <span className="font-semibold">{property.inquiries}</span>
              </div>
              <p className="text-[10px] text-gray-400">{t?.inquiries?.[language] || 'inquiries'}</p>
            </div>
            {property.applications !== undefined && (
              <div className="text-center">
                <div className="flex items-center gap-1 text-gray-600">
                  <Users className="w-4 h-4" />
                  <span className="font-semibold">{property.applications}</span>
                </div>
                <p className="text-[10px] text-gray-400">{t?.candidatures?.[language] || 'applications'}</p>
              </div>
            )}
          </div>
        </div>

        {/* Tenant Info (if rented) */}
        {property.isRented && property.tenantName && (
          <div className="mt-3 pt-3 border-t border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center">
                  <Users className="w-4 h-4 text-emerald-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{property.tenantName}</p>
                  {property.leaseEndDate && (
                    <p className="text-xs text-gray-500 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {t?.leaseUntil?.[language] || 'Lease until'} {new Date(property.leaseEndDate).toLocaleDateString(language === 'fr' ? 'fr-FR' : language === 'nl' ? 'nl-NL' : language === 'de' ? 'de-DE' : 'en-US')}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Actions Footer */}
      {(onEdit || onArchive || onDelete || onViewDetails) && (
        <div className="px-4 py-3 bg-gray-50 border-t border-gray-100 flex items-center justify-end gap-2">
          {onViewDetails && (
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onViewDetails();
              }}
            >
              <ExternalLink className="w-4 h-4 mr-1" />
              {t?.details?.[language] || 'Details'}
            </Button>
          )}
          {onEdit && (
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onEdit();
              }}
            >
              <Edit className="w-4 h-4 mr-1" />
              {t?.edit?.[language] || 'Edit'}
            </Button>
          )}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => e.stopPropagation()}>
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {onHistory && (
                <DropdownMenuItem onClick={onHistory}>
                  <History className="w-4 h-4 mr-2" />
                  {t?.history?.[language] || 'History'}
                </DropdownMenuItem>
              )}
              {onArchive && (
                <DropdownMenuItem onClick={onArchive}>
                  <Archive className="w-4 h-4 mr-2" />
                  {t?.archive?.[language] || 'Archive'}
                </DropdownMenuItem>
              )}
              {onDelete && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={onDelete} className="text-red-600">
                    <Trash2 className="w-4 h-4 mr-2" />
                    {t?.delete?.[language] || 'Delete'}
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}
    </motion.div>
  );
}

export default PropertyCard;
