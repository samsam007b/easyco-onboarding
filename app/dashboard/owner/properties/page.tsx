'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/auth/supabase-client';
import { getMyProperties } from '@/lib/property-helpers';
import { Button } from '@/components/ui/button';
import {
  Building2,
  Plus,
  RefreshCw,
  Trash2,
  CheckSquare,
  Archive,
  Upload,
  Home,
  Eye,
  Users,
  TrendingUp,
  CheckCircle,
} from 'lucide-react';
import { toast } from 'sonner';
import type { Property } from '@/types/property.types';
import { useRole } from '@/lib/role/role-context';
import LoadingHouse from '@/components/ui/LoadingHouse';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/lib/i18n/use-language';
import { AddPropertyModal } from '@/components/dashboard/AddPropertyModal';

import { OwnerPageHeader } from '@/components/owner';
import {
  PropertyHealthGrid,
  PropertyTimelineModal,
  type PropertyCardData,
  type PropertyFiltersState,
  type ViewMode,
} from '@/components/owner/portfolio';
import { ownerGradientLight, ownerPageBackground, ownerGradient, ownerPalette, semanticColors } from '@/lib/constants/owner-theme';

export default function PropertiesManagement() {
  const router = useRouter();
  const supabase = createClient();
  const { setActiveRole } = useRole();
  const { getSection, language } = useLanguage();
  const t = getSection('dashboard')?.owner?.propertiesPage;

  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [properties, setProperties] = useState<Property[]>([]);
  const [rentedPropertyIds, setRentedPropertyIds] = useState<Set<string>>(new Set());
  const [applicationCounts, setApplicationCounts] = useState<Map<string, number>>(new Map());
  const [showAddPropertyModal, setShowAddPropertyModal] = useState(false);
  const [selectedProperties, setSelectedProperties] = useState<Set<string>>(new Set());
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [filters, setFilters] = useState<PropertyFiltersState>({
    search: '',
    status: 'all',
    health: 'all',
    city: '',
    minRent: null,
    maxRent: null,
    sortField: 'created',
    sortOrder: 'desc',
  });

  const [deleteModal, setDeleteModal] = useState<{
    open: boolean;
    propertyId: string | null;
    propertyTitle: string;
  }>({
    open: false,
    propertyId: null,
    propertyTitle: '',
  });

  const [timelineModal, setTimelineModal] = useState<{
    open: boolean;
    property: { id: string; title: string; address?: string } | null;
  }>({
    open: false,
    property: null,
  });

  const loadData = useCallback(async (refresh = false) => {
    if (refresh) setIsRefreshing(true);

    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        router.push('/login');
        return;
      }

      // Load properties
      const result = await getMyProperties();
      if (result.success && result.data) {
        setProperties(result.data);

        const propertyIds = result.data.map(p => p.id);

        // Fetch rented status from property_residents
        // Note: no is_active column, all residents are considered active
        const { data: residents } = await supabase
          .from('property_residents')
          .select('property_id')
          .in('property_id', propertyIds);

        const rentedIds = new Set(residents?.map(r => r.property_id) || []);
        setRentedPropertyIds(rentedIds);

        // Fetch applications count per property
        const [{ data: individualApps }, { data: groupApps }] = await Promise.all([
          supabase
            .from('applications')
            .select('property_id')
            .in('property_id', propertyIds),
          supabase
            .from('group_applications')
            .select('property_id')
            .in('property_id', propertyIds),
        ]);

        const appCounts = new Map<string, number>();
        [...(individualApps || []), ...(groupApps || [])].forEach(app => {
          const current = appCounts.get(app.property_id) || 0;
          appCounts.set(app.property_id, current + 1);
        });
        setApplicationCounts(appCounts);
      }
    } catch (error: unknown) {
      toast.error(t?.toast?.loadError?.[language] || 'Erreur lors du chargement');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [supabase, router, t, language]);

  useEffect(() => {
    loadData();
    setActiveRole('owner');
  }, [loadData, setActiveRole]);

  // Transform properties to PropertyCardData format
  const propertyCards: PropertyCardData[] = useMemo(() => {
    return properties.map((p) => {
      const isRented = rentedPropertyIds.has(p.id);
      return {
        id: p.id,
        title: p.title,
        city: p.city,
        address: p.address,
        status: p.status as 'published' | 'draft' | 'archived',
        monthlyRent: p.monthly_rent || 0,
        bedrooms: p.bedrooms || 0,
        bathrooms: p.bathrooms,
        surface: p.surface_area,
        mainImage: typeof p.images?.[0] === 'string' ? p.images[0] : p.images?.[0]?.url,
        images: p.images?.map(img => typeof img === 'string' ? img : img.url),
        views: p.views_count || 0,
        inquiries: 0, // inquiries_count doesn't exist in DB
        applications: applicationCounts.get(p.id) || 0,
        daysVacant: p.status === 'published' && !isRented && p.created_at
          ? Math.floor((Date.now() - new Date(p.created_at).getTime()) / (1000 * 60 * 60 * 24))
          : undefined,
        isRented,
        createdAt: p.created_at ? new Date(p.created_at) : undefined,
      };
    });
  }, [properties, rentedPropertyIds, applicationCounts]);

  // Calculate stats for KPI cards
  const stats = useMemo(() => {
    const total = propertyCards.length;
    const rented = propertyCards.filter(p => p.isRented).length;
    const vacant = propertyCards.filter(p => !p.isRented && p.status === 'published').length;
    const drafts = propertyCards.filter(p => p.status === 'draft').length;
    const totalViews = propertyCards.reduce((sum, p) => sum + (p.views || 0), 0);
    const totalApplications = propertyCards.reduce((sum, p) => sum + (p.applications || 0), 0);
    const totalMonthlyRent = propertyCards
      .filter(p => p.isRented)
      .reduce((sum, p) => sum + (p.monthlyRent || 0), 0);

    return { total, rented, vacant, drafts, totalViews, totalApplications, totalMonthlyRent };
  }, [propertyCards]);

  // Handle property actions
  const handlePropertyClick = (property: PropertyCardData) => {
    router.push(`/properties/${property.id}`);
  };

  const handlePropertyEdit = (property: PropertyCardData) => {
    router.push(`/properties/edit/${property.id}`);
  };

  const handlePropertyArchive = async (property: PropertyCardData) => {
    try {
      const { error } = await supabase
        .from('properties')
        .update({ status: 'archived' })
        .eq('id', property.id);

      if (error) throw error;

      toast.success(t?.toast?.archiveSuccess?.[language] || 'Propriété archivée');
      await loadData();
    } catch (error: unknown) {
      toast.error(t?.toast?.archiveError?.[language] || 'Erreur lors de l\'archivage');
    }
  };

  const handlePropertyDelete = (property: PropertyCardData) => {
    setDeleteModal({
      open: true,
      propertyId: property.id,
      propertyTitle: property.title,
    });
  };

  const handlePropertyHistory = (property: PropertyCardData) => {
    setTimelineModal({
      open: true,
      property: {
        id: property.id,
        title: property.title,
        address: property.address,
      },
    });
  };

  const confirmDelete = async () => {
    if (!deleteModal.propertyId) return;

    try {
      const { error } = await supabase
        .from('properties')
        .delete()
        .eq('id', deleteModal.propertyId);

      if (error) throw error;

      toast.success(t?.toast?.deleteSuccess?.[language] || 'Propriété supprimée');
      setDeleteModal({ open: false, propertyId: null, propertyTitle: '' });
      await loadData();
    } catch (error: unknown) {
      toast.error(t?.toast?.deleteError?.[language] || 'Erreur lors de la suppression');
    }
  };

  // Bulk actions
  const handleBulkPublish = async () => {
    if (selectedProperties.size === 0) return;

    try {
      const { error } = await supabase
        .from('properties')
        .update({ status: 'published' })
        .in('id', Array.from(selectedProperties));

      if (error) throw error;

      toast.success(
        t?.toast?.bulkPublishSuccess?.[language]?.replace('{count}', String(selectedProperties.size)) ||
        `${selectedProperties.size} property(ies) published`
      );
      setSelectedProperties(new Set());
      await loadData();
    } catch (error: unknown) {
      toast.error(t?.toast?.bulkPublishError?.[language] || 'Error publishing properties');
    }
  };

  const handleBulkArchive = async () => {
    if (selectedProperties.size === 0) return;

    try {
      const { error } = await supabase
        .from('properties')
        .update({ status: 'archived' })
        .in('id', Array.from(selectedProperties));

      if (error) throw error;

      toast.success(
        t?.toast?.bulkArchiveSuccess?.[language]?.replace('{count}', String(selectedProperties.size)) ||
        `${selectedProperties.size} property(ies) archived`
      );
      setSelectedProperties(new Set());
      await loadData();
    } catch (error: unknown) {
      toast.error(t?.toast?.bulkArchiveError?.[language] || 'Error archiving properties');
    }
  };

  if (isLoading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: ownerGradientLight }}
      >
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex justify-center mb-6">
            <LoadingHouse size={80} />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {t?.loading?.title?.[language] || 'Loading properties...'}
          </h3>
          <p className="text-gray-600">
            {t?.loading?.subtitle?.[language] || 'Preparing your listings'}
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: ownerPageBackground }}>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-8">
        {/* Header */}
        <OwnerPageHeader
          icon={Building2}
          title={t?.header?.title?.[language] || 'Mes Propriétés'}
          subtitle={t?.header?.subtitle?.[language] || 'Gérer et suivre toutes vos annonces immobilières'}
          breadcrumb={{ label: 'Portfolio', href: '/dashboard/owner/portfolio' }}
          currentPage={t?.header?.currentPage?.[language] || 'Properties'}
          actions={
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => loadData(true)}
                disabled={isRefreshing}
                className="rounded-full"
              >
                <RefreshCw className={cn('w-4 h-4 mr-2', isRefreshing && 'animate-spin')} />
                {t?.header?.refresh?.[language] || 'Refresh'}
              </Button>
              <Button
                onClick={() => setShowAddPropertyModal(true)}
                className="rounded-full text-white shadow-md"
                style={{ background: ownerGradient }}
              >
                <Plus className="w-4 h-4 mr-2" />
                {t?.header?.addButton?.[language] || 'Ajouter'}
              </Button>
            </div>
          }
        />

        {/* Bold KPI Cards Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mt-6"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Card 1: Total Properties - PRIMARY solid color */}
            <motion.div
              whileHover={{ scale: 1.02, y: -4 }}
              whileTap={{ scale: 0.98 }}
              className="relative overflow-hidden superellipse-2xl p-5 cursor-pointer"
              style={{
                background: ownerPalette.primary.main,
                boxShadow: `0 8px 32px ${ownerPalette.primary.shadow}`,
              }}
            >
              <div
                className="absolute -top-10 -right-10 w-28 h-28 rounded-full opacity-15"
                style={{ background: 'white' }}
              />
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-3">
                  <div
                    className="w-11 h-11 superellipse-xl flex items-center justify-center"
                    style={{ background: 'rgba(255,255,255,0.2)' }}
                  >
                    <Building2 className="w-6 h-6 text-white" />
                  </div>
                  {stats.drafts > 0 && (
                    <span className="px-2.5 py-1 bg-white/25 rounded-full text-xs font-semibold text-white">
                      {stats.drafts} brouillon{stats.drafts > 1 ? 's' : ''}
                    </span>
                  )}
                </div>
                <p className="text-3xl font-bold text-white mb-1">{stats.total}</p>
                <p className="text-white/90 text-sm font-medium">
                  {t?.kpi?.totalProperties?.[language] || 'Total biens'}
                </p>
                <div className="mt-3 flex items-center gap-2 text-white/70 text-xs">
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>{stats.rented + stats.vacant} publiés</span>
                </div>
              </div>
            </motion.div>

            {/* Card 2: Rented - TERTIARY solid color */}
            <motion.div
              whileHover={{ scale: 1.02, y: -4 }}
              whileTap={{ scale: 0.98 }}
              className="relative overflow-hidden superellipse-2xl p-5 cursor-pointer"
              style={{
                background: ownerPalette.tertiary.main,
                boxShadow: `0 8px 32px ${ownerPalette.tertiary.shadow}`,
              }}
            >
              <div
                className="absolute -top-10 -right-10 w-28 h-28 rounded-full opacity-15"
                style={{ background: 'white' }}
              />
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-3">
                  <div
                    className="w-11 h-11 superellipse-xl flex items-center justify-center"
                    style={{ background: 'rgba(255,255,255,0.2)' }}
                  >
                    <Home className="w-6 h-6 text-white" />
                  </div>
                  {stats.vacant > 0 && (
                    <span
                      className="px-2.5 py-1 rounded-full text-xs font-semibold text-white"
                      style={{ background: semanticColors.warning.gradient }}
                    >
                      {stats.vacant} vacant{stats.vacant > 1 ? 's' : ''}
                    </span>
                  )}
                </div>
                <p className="text-3xl font-bold text-white mb-1">{stats.rented}</p>
                <p className="text-white/90 text-sm font-medium">
                  {t?.kpi?.rented?.[language] || 'Loués'}
                </p>
                <div className="mt-3 flex items-center gap-2 text-white/70 text-xs">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>{stats.total > 0 ? Math.round((stats.rented / stats.total) * 100) : 0}% occupation</span>
                </div>
              </div>
            </motion.div>

            {/* Card 3: Views & Applications - White card with QUATERNARY icon */}
            <motion.div
              whileHover={{ scale: 1.02, y: -4 }}
              whileTap={{ scale: 0.98 }}
              className="relative overflow-hidden superellipse-2xl p-5 cursor-pointer bg-white"
              style={{
                border: `1px solid ${ownerPalette.quaternary.border}`,
                boxShadow: `0 4px 16px rgba(0,0,0,0.06)`,
              }}
            >
              <div className="flex items-center justify-between mb-3">
                <div
                  className="w-11 h-11 superellipse-xl flex items-center justify-center"
                  style={{ background: ownerPalette.quaternary.main }}
                >
                  <Eye className="w-6 h-6 text-white" />
                </div>
                <span
                  className="px-2.5 py-1 rounded-full text-xs font-medium"
                  style={{ background: ownerPalette.quaternary.light, color: ownerPalette.quaternary.text }}
                >
                  {stats.totalApplications} candidat{stats.totalApplications > 1 ? 's' : ''}
                </span>
              </div>
              <p
                className="text-3xl font-bold mb-1"
                style={{ color: ownerPalette.quaternary.text }}
              >
                {stats.totalViews}
              </p>
              <p className="text-gray-600 text-sm font-medium">
                {t?.kpi?.totalViews?.[language] || 'Vues totales'}
              </p>
              <div className="mt-3 flex items-center gap-2 text-gray-500 text-xs">
                <Users className="w-3.5 h-3.5" />
                <span>{stats.totalApplications} candidatures</span>
              </div>
            </motion.div>

            {/* Card 4: Monthly Revenue - White card with green accent */}
            <motion.div
              whileHover={{ scale: 1.02, y: -4 }}
              whileTap={{ scale: 0.98 }}
              className="relative overflow-hidden superellipse-2xl p-5 cursor-pointer bg-white"
              style={{
                border: `1px solid ${semanticColors.success.border}`,
                boxShadow: `0 4px 16px rgba(0,0,0,0.06)`,
              }}
            >
              <div className="flex items-center justify-between mb-3">
                <div
                  className="w-11 h-11 superellipse-xl flex items-center justify-center"
                  style={{ background: semanticColors.success.gradient }}
                >
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <span
                  className="px-2.5 py-1 rounded-full text-xs font-medium"
                  style={{ background: semanticColors.success.bg, color: semanticColors.success.text }}
                >
                  /mois
                </span>
              </div>
              <p
                className="text-3xl font-bold mb-1"
                style={{ color: semanticColors.success.text }}
              >
                {stats.totalMonthlyRent.toLocaleString()}€
              </p>
              <p className="text-gray-600 text-sm font-medium">
                {t?.kpi?.monthlyRevenue?.[language] || 'Revenus mensuels'}
              </p>
              <div className="mt-3 text-xs text-gray-500">
                ~{stats.rented > 0 ? Math.round(stats.totalMonthlyRent / stats.rented).toLocaleString() : 0}€ / bien loué
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Bulk Actions Bar */}
        <AnimatePresence>
          {selectedProperties.size > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mt-4 superellipse-2xl p-4 flex items-center justify-between"
              style={{
                backgroundColor: ownerPalette.secondary.light,
                borderWidth: 1,
                borderColor: ownerPalette.secondary.border,
              }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 superellipse-xl flex items-center justify-center"
                  style={{ backgroundColor: ownerPalette.secondary.main }}
                >
                  <CheckSquare className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">
                    {t?.bulkActions?.selected?.[language]?.replace('{count}', String(selectedProperties.size)) ||
                     `${selectedProperties.size} property(ies) selected`}
                  </p>
                  <p className="text-sm text-gray-600">{t?.bulkActions?.available?.[language] || 'Bulk actions available'}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleBulkPublish}
                  className="rounded-full"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  {t?.bulkActions?.publish?.[language] || 'Publish'}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleBulkArchive}
                  className="rounded-full"
                >
                  <Archive className="w-4 h-4 mr-2" />
                  {t?.bulkActions?.archive?.[language] || 'Archive'}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedProperties(new Set())}
                  className="rounded-full text-gray-500"
                >
                  {t?.bulkActions?.cancel?.[language] || 'Cancel'}
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Properties Grid with Filters */}
        <div className="mt-6">
          <PropertyHealthGrid
            properties={propertyCards}
            filters={filters}
            onFiltersChange={setFilters}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            onPropertyClick={handlePropertyClick}
            onPropertyEdit={handlePropertyEdit}
            onPropertyArchive={handlePropertyArchive}
            onPropertyDelete={handlePropertyDelete}
            onPropertyHistory={handlePropertyHistory}
            selectedProperties={selectedProperties}
            onSelectionChange={setSelectedProperties}
          />
        </div>
      </main>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteModal.open && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() =>
                setDeleteModal({ open: false, propertyId: null, propertyTitle: '' })
              }
            />

            {/* Modal Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative overflow-hidden bg-white superellipse-3xl shadow-2xl p-8 max-w-md w-full border border-gray-200"
            >
              {/* Decorative top accent */}
              <div
                className="absolute top-0 left-0 right-0 h-1"
                style={{ background: 'linear-gradient(90deg, #ef4444 0%, #dc2626 100%)' }}
              />

              <div className="text-center">
                {/* Animated Icon */}
                <motion.div
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  className="relative w-16 h-16 mx-auto mb-4"
                >
                  <motion.div
                    className="absolute inset-0 rounded-full bg-red-400 opacity-30"
                    style={{ filter: 'blur(12px)' }}
                    animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.4, 0.3] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                  />
                  <div className="relative w-full h-full rounded-full bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center shadow-lg">
                    <Trash2 className="w-8 h-8 text-white" />
                  </div>
                </motion.div>

                {/* Title */}
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {t?.deleteModal?.title?.[language] || 'Supprimer la propriété ?'}
                </h3>

                {/* Description */}
                <p className="text-gray-600 mb-2">
                  {t?.deleteModal?.confirm?.[language] ||
                    'Êtes-vous sûr de vouloir supprimer'}
                </p>
                <p className="font-semibold text-gray-900 mb-4">
                  "{deleteModal.propertyTitle}" ?
                </p>
                <p className="text-sm text-red-600 mb-8">
                  {t?.deleteModal?.irreversible?.[language] ||
                    'Cette action est irréversible.'}
                </p>

                {/* Actions */}
                <div className="flex gap-3">
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1"
                  >
                    <Button
                      variant="outline"
                      className="w-full superellipse-xl hover:border-gray-400"
                      onClick={() =>
                        setDeleteModal({ open: false, propertyId: null, propertyTitle: '' })
                      }
                    >
                      {t?.deleteModal?.cancel?.[language] || 'Annuler'}
                    </Button>
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1"
                  >
                    <Button
                      className="w-full superellipse-xl bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-md"
                      onClick={confirmDelete}
                    >
                      {t?.deleteModal?.deleteButton?.[language] || 'Supprimer'}
                    </Button>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Add Property Modal */}
      <AddPropertyModal
        open={showAddPropertyModal}
        onOpenChange={setShowAddPropertyModal}
        onSuccess={() => loadData()}
      />

      {/* Property Timeline Modal */}
      <PropertyTimelineModal
        open={timelineModal.open}
        onClose={() => setTimelineModal({ open: false, property: null })}
        property={timelineModal.property}
      />
    </div>
  );
}
