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
  Download,
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
  type PropertyCardData,
  type PropertyFiltersState,
  type ViewMode,
} from '@/components/owner/portfolio';
import { ownerGradientLight, ownerPageBackground, ownerGradient } from '@/lib/constants/owner-theme';

export default function PropertiesManagement() {
  const router = useRouter();
  const supabase = createClient();
  const { setActiveRole } = useRole();
  const { getSection, language } = useLanguage();
  const t = getSection('dashboard')?.owner?.propertiesPage;

  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [properties, setProperties] = useState<Property[]>([]);
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
    return properties.map((p) => ({
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
      inquiries: p.inquiries_count || 0,
      applications: 0, // Would need to fetch from applications table
      daysVacant: p.status === 'published' && p.created_at
        ? Math.floor((Date.now() - new Date(p.created_at).getTime()) / (1000 * 60 * 60 * 24))
        : undefined,
      isRented: false, // Would need to check property_residents
      createdAt: p.created_at ? new Date(p.created_at) : undefined,
    }));
  }, [properties]);

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

      toast.success(`${selectedProperties.size} propriété(s) publiée(s)`);
      setSelectedProperties(new Set());
      await loadData();
    } catch (error: unknown) {
      toast.error('Erreur lors de la publication');
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

      toast.success(`${selectedProperties.size} propriété(s) archivée(s)`);
      setSelectedProperties(new Set());
      await loadData();
    } catch (error: unknown) {
      toast.error('Erreur lors de l\'archivage');
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
            {t?.loading?.title?.[language] || 'Chargement des propriétés...'}
          </h3>
          <p className="text-gray-600">
            {t?.loading?.subtitle?.[language] || 'Préparation de vos annonces'}
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
          currentPage="Propriétés"
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
                Actualiser
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

        {/* Bulk Actions Bar */}
        <AnimatePresence>
          {selectedProperties.size > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mt-4 bg-purple-50 border border-purple-200 rounded-2xl p-4 flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background: ownerGradient }}
                >
                  <CheckSquare className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">
                    {selectedProperties.size} propriété{selectedProperties.size > 1 ? 's' : ''} sélectionnée{selectedProperties.size > 1 ? 's' : ''}
                  </p>
                  <p className="text-sm text-gray-600">Actions groupées disponibles</p>
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
                  Publier
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleBulkArchive}
                  className="rounded-full"
                >
                  <Archive className="w-4 h-4 mr-2" />
                  Archiver
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedProperties(new Set())}
                  className="rounded-full text-gray-500"
                >
                  Annuler
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
              className="relative overflow-hidden bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full border border-gray-200"
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
                      className="w-full rounded-xl hover:border-gray-400"
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
                      className="w-full rounded-xl bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-md"
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
    </div>
  );
}
