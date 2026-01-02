'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Wrench,
  Phone,
  Mail,
  Star,
  StarHalf,
  MapPin,
  Clock,
  CheckCircle,
  ChevronRight,
  Plus,
  Search,
  Filter,
  Zap,
  Droplets,
  Flame,
  Lightbulb,
  Key,
  Paintbrush,
  Bug,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { ownerGradient } from '@/lib/constants/owner-theme';
import type { TicketCategory } from './TicketKanbanBoard';

interface Vendor {
  id: string;
  name: string;
  specialty: TicketCategory;
  phone: string;
  email?: string;
  address?: string;
  rating: number; // 0-5
  totalJobs: number;
  avgResponseTime?: string; // e.g., "2h"
  isVerified: boolean;
  isFavorite: boolean;
  lastJobDate?: Date;
}

interface VendorDirectoryProps {
  vendors: Vendor[];
  className?: string;
  onContactVendor?: (vendor: Vendor, method: 'phone' | 'email') => void;
  onAddVendor?: () => void;
  onToggleFavorite?: (vendorId: string) => void;
}

const specialtyConfig: Record<TicketCategory, {
  icon: typeof Wrench;
  label: string;
  color: string;
  bgColor: string;
}> = {
  plumbing: { icon: Droplets, label: 'Plombier', color: '#0ea5e9', bgColor: '#e0f2fe' },
  electrical: { icon: Zap, label: 'Électricien', color: '#f59e0b', bgColor: '#fef3c7' },
  heating: { icon: Flame, label: 'Chauffagiste', color: '#ef4444', bgColor: '#fee2e2' },
  appliance: { icon: Lightbulb, label: 'Électroménager', color: '#8b5cf6', bgColor: '#ede9fe' },
  locksmith: { icon: Key, label: 'Serrurier', color: '#64748b', bgColor: '#f1f5f9' },
  painting: { icon: Paintbrush, label: 'Peintre', color: '#ec4899', bgColor: '#fce7f3' },
  pest: { icon: Bug, label: 'Désinsectiseur', color: '#84cc16', bgColor: '#ecfccb' },
  other: { icon: Wrench, label: 'Artisan', color: '#9c5698', bgColor: '#fdf4ff' },
};

function RatingStars({ rating }: { rating: number }) {
  const fullStars = Math.floor(rating);
  const hasHalf = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalf ? 1 : 0);

  return (
    <div className="flex items-center gap-0.5">
      {[...Array(fullStars)].map((_, i) => (
        <Star key={`full-${i}`} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
      ))}
      {hasHalf && <StarHalf className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />}
      {[...Array(emptyStars)].map((_, i) => (
        <Star key={`empty-${i}`} className="w-3.5 h-3.5 text-gray-300" />
      ))}
    </div>
  );
}

export function VendorDirectory({
  vendors,
  className,
  onContactVendor,
  onAddVendor,
  onToggleFavorite,
}: VendorDirectoryProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSpecialty, setFilterSpecialty] = useState<TicketCategory | 'all'>('all');

  // Filter vendors
  const filteredVendors = vendors.filter((vendor) => {
    const matchesSearch = vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          specialtyConfig[vendor.specialty].label.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterSpecialty === 'all' || vendor.specialty === filterSpecialty;
    return matchesSearch && matchesFilter;
  });

  // Sort: favorites first, then by rating
  const sortedVendors = [...filteredVendors].sort((a, b) => {
    if (a.isFavorite !== b.isFavorite) return a.isFavorite ? -1 : 1;
    return b.rating - a.rating;
  });

  // Get unique specialties from vendors
  const availableSpecialties = [...new Set(vendors.map((v) => v.specialty))];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200 shadow-sm overflow-hidden",
        className
      )}
    >
      {/* Header */}
      <div className="p-5 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center shadow-sm"
              style={{ background: ownerGradient }}
            >
              <Wrench className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Annuaire prestataires</h3>
              <p className="text-sm text-gray-500">{vendors.length} contact{vendors.length > 1 ? 's' : ''}</p>
            </div>
          </div>

          {onAddVendor && (
            <Button
              onClick={onAddVendor}
              size="sm"
              className="rounded-full text-white"
              style={{ background: ownerGradient }}
            >
              <Plus className="w-4 h-4 mr-1" />
              Ajouter
            </Button>
          )}
        </div>
      </div>

      {/* Search and Filter */}
      <div className="p-4 border-b border-gray-100 space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher un prestataire..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            variant={filterSpecialty === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilterSpecialty('all')}
            className={cn(
              "rounded-full text-xs",
              filterSpecialty === 'all' && 'text-white'
            )}
            style={filterSpecialty === 'all' ? { background: ownerGradient } : undefined}
          >
            Tous
          </Button>
          {availableSpecialties.map((specialty) => {
            const config = specialtyConfig[specialty];
            const Icon = config.icon;
            return (
              <Button
                key={specialty}
                variant={filterSpecialty === specialty ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterSpecialty(specialty)}
                className={cn(
                  "rounded-full text-xs",
                  filterSpecialty === specialty && 'text-white'
                )}
                style={filterSpecialty === specialty ? { background: config.color } : undefined}
              >
                <Icon className="w-3 h-3 mr-1" />
                {config.label}
              </Button>
            );
          })}
        </div>
      </div>

      {/* Vendor List */}
      <div className="p-4 max-h-[400px] overflow-y-auto">
        <AnimatePresence mode="popLayout">
          {sortedVendors.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-8 text-gray-400"
            >
              <Wrench className="w-10 h-10 mx-auto mb-2 opacity-50" />
              <p className="text-sm">Aucun prestataire trouvé</p>
            </motion.div>
          ) : (
            <div className="space-y-3">
              {sortedVendors.map((vendor, index) => {
                const config = specialtyConfig[vendor.specialty];
                const Icon = config.icon;

                return (
                  <motion.div
                    key={vendor.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: index * 0.03 }}
                    className={cn(
                      "p-4 rounded-xl border transition-all",
                      vendor.isFavorite
                        ? "bg-purple-50/50 border-purple-200"
                        : "bg-white border-gray-200 hover:border-purple-200"
                    )}
                  >
                    <div className="flex items-start gap-3">
                      {/* Specialty icon */}
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: config.bgColor }}
                      >
                        <Icon className="w-6 h-6" style={{ color: config.color }} />
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold text-gray-900">{vendor.name}</h4>
                          {vendor.isVerified && (
                            <CheckCircle className="w-4 h-4 text-emerald-500" />
                          )}
                          {vendor.isFavorite && (
                            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                          )}
                        </div>

                        <div className="flex items-center gap-3 mb-2 text-sm text-gray-500">
                          <Badge
                            className="text-xs px-2 py-0"
                            style={{
                              backgroundColor: config.bgColor,
                              color: config.color,
                              borderColor: config.color,
                            }}
                          >
                            {config.label}
                          </Badge>
                          <RatingStars rating={vendor.rating} />
                          <span className="text-xs">({vendor.totalJobs} jobs)</span>
                        </div>

                        <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500">
                          {vendor.avgResponseTime && (
                            <div className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              <span>Rép. ~{vendor.avgResponseTime}</span>
                            </div>
                          )}
                          {vendor.address && (
                            <div className="flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              <span className="truncate max-w-[120px]">{vendor.address}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-col gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onContactVendor?.(vendor, 'phone')}
                          className="rounded-full h-8 w-8 p-0 hover:bg-emerald-50 hover:border-emerald-300"
                        >
                          <Phone className="w-4 h-4 text-emerald-600" />
                        </Button>
                        {vendor.email && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => onContactVendor?.(vendor, 'email')}
                            className="rounded-full h-8 w-8 p-0 hover:bg-blue-50 hover:border-blue-300"
                          >
                            <Mail className="w-4 h-4 text-blue-600" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

export default VendorDirectory;
