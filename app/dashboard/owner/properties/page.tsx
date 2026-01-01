'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/auth/supabase-client';
import { getMyProperties } from '@/lib/property-helpers';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Building2,
  Plus,
  Edit,
  Trash2,
  Eye,
  MapPin,
  Bed,
  Bath,
  DollarSign,
  Calendar,
  Users,
  TrendingUp,
  Home,
  Sparkles
} from 'lucide-react';
import { toast } from 'sonner';
import type { Property } from '@/types/property.types';
import { useRole } from '@/lib/role/role-context';
import LoadingHouse from '@/components/ui/LoadingHouse';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/lib/i18n/use-language';

// V3 Owner gradient palette
const ownerGradient = 'linear-gradient(135deg, #9c5698 0%, #a5568d 25%, #af5682 50%, #b85676 75%, #c2566b 100%)';
const ownerGradientLight = 'linear-gradient(135deg, #F8F0F7 0%, #FDF5F9 100%)';

interface UserProfile {
  full_name: string;
  email: string;
  profile_data: any;
  avatar_url?: string;
}

export default function PropertiesManagement() {
  const router = useRouter();
  const supabase = createClient();
  const { setActiveRole } = useRole();
  const { getSection, language } = useLanguage();
  const t = getSection('dashboard')?.owner?.propertiesPage;
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<'all' | 'published' | 'draft' | 'archived'>('all');
  const [deleteModal, setDeleteModal] = useState<{ open: boolean; propertyId: string | null; propertyTitle: string }>({
    open: false,
    propertyId: null,
    propertyTitle: ''
  });

  useEffect(() => {
    loadData();
    setActiveRole('owner');
  }, []);

  const loadData = async () => {
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();

      if (userError || !user) {
        router.push('/login');
        return;
      }

      // Load profile
      const { data: userData } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();

      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      setProfile({
        full_name: profileData?.first_name && profileData?.last_name
          ? `${profileData.first_name} ${profileData.last_name}`
          : userData?.full_name || user.email?.split('@')[0] || 'User',
        email: userData?.email || user.email || '',
        profile_data: profileData || {},
        avatar_url: profileData?.avatar_url
      });

      // Load properties
      const result = await getMyProperties();
      if (result.success && result.data) {
        setProperties(result.data);
      }
    } catch (error: any) {
      toast.error(t?.toast?.loadError?.[language] || 'Erreur lors du chargement');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteProperty = async () => {
    if (!deleteModal.propertyId) return;

    try {
      const { error } = await supabase
        .from('properties')
        .delete()
        .eq('id', deleteModal.propertyId);

      if (error) throw error;

      toast.success(t?.toast?.deleteSuccess?.[language] || 'Propriété supprimée');
      setDeleteModal({ open: false, propertyId: null, propertyTitle: '' });

      // Reload data to ensure consistency
      await loadData();
    } catch (error: any) {
      toast.error(t?.toast?.deleteError?.[language] || 'Erreur lors de la suppression');
    }
  };

  const handleToggleStatus = async (propertyId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'published' ? 'draft' : 'published';

    try {
      const { error } = await supabase
        .from('properties')
        .update({ status: newStatus })
        .eq('id', propertyId);

      if (error) throw error;

      const successMsg = newStatus === 'published'
        ? (t?.toast?.publishSuccess?.[language] || 'Propriété publiée')
        : (t?.toast?.unpublishSuccess?.[language] || 'Propriété dépubliée');
      toast.success(successMsg);
      setProperties(properties.map(p =>
        p.id === propertyId ? { ...p, status: newStatus } : p
      ));
    } catch (error: any) {
      toast.error(t?.toast?.updateError?.[language] || 'Erreur lors de la mise à jour');
    }
  };

  const getStatusBadge = (status: string) => {
    const config: Record<string, { variant: "default" | "secondary" | "destructive" | "outline", label: string, className: string }> = {
      published: {
        variant: 'secondary',
        label: t?.status?.published?.[language] || 'Publié',
        className: 'bg-green-100 text-green-800 border-green-200'
      },
      draft: {
        variant: 'secondary',
        label: t?.status?.draft?.[language] || 'Brouillon',
        className: 'bg-yellow-100 text-yellow-800 border-yellow-200'
      },
      archived: {
        variant: 'secondary',
        label: t?.status?.archived?.[language] || 'Archivé',
        className: 'bg-gray-100 text-gray-800 border-gray-200'
      }
    };
    return config[status] || config.draft;
  };

  const filteredProperties = properties.filter(property => {
    if (filterStatus === 'all') return true;
    return property.status === filterStatus;
  });

  if (isLoading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: 'linear-gradient(135deg, #F8F0F7 0%, #FFFFFF 50%, #FDF5F9 100%)' }}
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

  if (!profile) return null;

  return (
    <div
      className="min-h-screen"
      style={{ background: 'linear-gradient(135deg, #F8F0F7 0%, #FFFFFF 50%, #FDF5F9 100%)' }}
    >
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden bg-white/80 backdrop-blur-sm rounded-3xl shadow-sm border border-gray-200 p-6 sm:p-8 mb-6"
        >
          {/* Decorative circles */}
          <div
            className="absolute -top-20 -right-20 w-40 h-40 rounded-full opacity-10"
            style={{ background: ownerGradient }}
          />
          <div
            className="absolute -bottom-10 -left-10 w-24 h-24 rounded-full opacity-10"
            style={{ background: ownerGradient }}
          />

          <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-4">
              {/* V3 Animated Icon with Glow */}
              <motion.div
                whileHover={{ scale: 1.05, rotate: 3 }}
                className="relative w-14 h-14"
              >
                {/* Glow effect */}
                <motion.div
                  className="absolute inset-0 rounded-2xl opacity-30"
                  style={{ background: ownerGradient, filter: 'blur(12px)' }}
                  animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.4, 0.3] }}
                  transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
                />
                {/* Main icon */}
                <div
                  className="relative w-full h-full rounded-2xl flex items-center justify-center"
                  style={{ background: ownerGradient, boxShadow: '0 8px 24px rgba(156, 86, 152, 0.3)' }}
                >
                  <Building2 className="w-7 h-7 text-white" />
                </div>
                {/* Floating sparkle */}
                <motion.div
                  className="absolute -top-1 -right-1"
                  animate={{ y: [-2, 2, -2], rotate: [0, 10, 0] }}
                  transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
                >
                  <Sparkles className="w-5 h-5" style={{ color: '#c2566b' }} />
                </motion.div>
              </motion.div>

              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">
                  {t?.header?.title?.[language] || 'Mes Propriétés'}
                </h1>
                <p className="text-gray-600">
                  {t?.header?.subtitle?.[language] || 'Gérer et suivre toutes vos annonces immobilières'}
                </p>
              </div>
            </div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
              <Button
                onClick={() => router.push('/properties/add')}
                className="rounded-full text-white shadow-md hover:shadow-lg transition-all"
                style={{ background: ownerGradient }}
                size="lg"
              >
                <Plus className="w-5 h-5 mr-2" />
                {t?.header?.addButton?.[language] || 'Ajouter'}
              </Button>
            </motion.div>
          </div>

          {/* Stats */}
          <div className="relative grid grid-cols-2 sm:grid-cols-4 gap-4">
            {/* Total - Owner Primary */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.03, y: -2 }}
              transition={{ delay: 0.1 }}
              className="relative overflow-hidden p-4 rounded-xl border border-purple-200/50"
              style={{ background: ownerGradientLight }}
            >
              <div
                className="absolute -top-6 -right-6 w-16 h-16 rounded-full opacity-20"
                style={{ background: ownerGradient }}
              />
              <div className="relative flex items-center gap-2 mb-2">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ background: ownerGradient }}
                >
                  <Home className="w-4 h-4 text-white" />
                </div>
                <p className="text-sm text-gray-600 font-medium">{t?.stats?.total?.[language] || 'Total'}</p>
              </div>
              <p className="text-2xl font-bold" style={{ color: '#9c5698' }}>{properties.length}</p>
            </motion.div>

            {/* Published - Green Semantic */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.03, y: -2 }}
              transition={{ delay: 0.15 }}
              className="relative overflow-hidden bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-xl border border-green-200/50"
            >
              <div className="absolute -top-6 -right-6 w-16 h-16 rounded-full bg-green-400 opacity-20" />
              <div className="relative flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 text-white" />
                </div>
                <p className="text-sm text-gray-600 font-medium">{t?.stats?.published?.[language] || 'Publiées'}</p>
              </div>
              <p className="text-2xl font-bold text-green-700">
                {properties.filter(p => p.status === 'published').length}
              </p>
            </motion.div>

            {/* Drafts - Amber Semantic */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.03, y: -2 }}
              transition={{ delay: 0.2 }}
              className="relative overflow-hidden bg-gradient-to-br from-amber-50 to-yellow-50 p-4 rounded-xl border border-amber-200/50"
            >
              <div className="absolute -top-6 -right-6 w-16 h-16 rounded-full bg-amber-400 opacity-20" />
              <div className="relative flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-yellow-500 flex items-center justify-center">
                  <Edit className="w-4 h-4 text-white" />
                </div>
                <p className="text-sm text-gray-600 font-medium">{t?.stats?.drafts?.[language] || 'Brouillons'}</p>
              </div>
              <p className="text-2xl font-bold text-amber-700">
                {properties.filter(p => p.status === 'draft').length}
              </p>
            </motion.div>

            {/* Archived - Gray */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.03, y: -2 }}
              transition={{ delay: 0.25 }}
              className="relative overflow-hidden bg-gradient-to-br from-gray-50 to-slate-50 p-4 rounded-xl border border-gray-200/50"
            >
              <div className="absolute -top-6 -right-6 w-16 h-16 rounded-full bg-gray-400 opacity-20" />
              <div className="relative flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-gray-500 to-slate-500 flex items-center justify-center">
                  <Building2 className="w-4 h-4 text-white" />
                </div>
                <p className="text-sm text-gray-600 font-medium">{t?.stats?.archived?.[language] || 'Archivées'}</p>
              </div>
              <p className="text-2xl font-bold text-gray-700">
                {properties.filter(p => p.status === 'archived').length}
              </p>
            </motion.div>
          </div>

          {/* Filters */}
          <div className="relative flex flex-wrap gap-2 mt-6">
            {[
              { value: 'all', label: t?.filters?.all?.[language] || 'Toutes' },
              { value: 'published', label: t?.filters?.published?.[language] || 'Publiées' },
              { value: 'draft', label: t?.filters?.drafts?.[language] || 'Brouillons' },
              { value: 'archived', label: t?.filters?.archived?.[language] || 'Archivées' }
            ].map((filter) => (
              <motion.div key={filter.value} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
                <Button
                  variant={filterStatus === filter.value ? 'default' : 'outline'}
                  onClick={() => setFilterStatus(filter.value as typeof filterStatus)}
                  size="sm"
                  className={cn(
                    "rounded-full transition-all",
                    filterStatus === filter.value
                      ? 'text-white border-transparent shadow-md'
                      : 'hover:border-purple-300 hover:bg-purple-50/50'
                  )}
                  style={filterStatus === filter.value ? { background: ownerGradient } : undefined}
                >
                  {filter.label} ({
                    filter.value === 'all'
                      ? properties.length
                      : properties.filter(p => p.status === filter.value).length
                  })
                </Button>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Properties List */}
        {filteredProperties.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="relative overflow-hidden rounded-3xl p-12 text-center border border-purple-200/50"
            style={{ background: 'linear-gradient(135deg, #F8F0F7 0%, #FFFFFF 50%, #FDF5F9 100%)' }}
          >
            {/* Decorative circles */}
            <div
              className="absolute top-10 right-10 w-32 h-32 rounded-full opacity-10"
              style={{ background: ownerGradient }}
            />
            <div
              className="absolute bottom-10 left-10 w-24 h-24 rounded-full opacity-10"
              style={{ background: ownerGradient }}
            />

            {/* V3 Animated Icon */}
            <motion.div
              whileHover={{ scale: 1.1, rotate: 5 }}
              className="relative w-20 h-20 mx-auto mb-6"
            >
              {/* Glow effect */}
              <motion.div
                className="absolute inset-0 rounded-2xl opacity-30"
                style={{ background: ownerGradient, filter: 'blur(16px)' }}
                animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
                transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
              />
              {/* Main icon */}
              <div
                className="relative w-full h-full rounded-2xl flex items-center justify-center"
                style={{ background: ownerGradient, boxShadow: '0 12px 32px rgba(156, 86, 152, 0.35)' }}
              >
                <Building2 className="w-10 h-10 text-white" />
              </div>
              {/* Floating sparkle */}
              <motion.div
                className="absolute -top-2 -right-2"
                animate={{ y: [-3, 3, -3], rotate: [0, 15, 0] }}
                transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
              >
                <Sparkles className="w-6 h-6" style={{ color: '#c2566b' }} />
              </motion.div>
            </motion.div>

            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              {filterStatus === 'all'
                ? (t?.empty?.noProperties?.[language] || 'Aucune propriété')
                : filterStatus === 'published'
                  ? (t?.empty?.noPublished?.[language] || 'Aucune propriété publiée')
                  : filterStatus === 'draft'
                    ? (t?.empty?.noDrafts?.[language] || 'Aucune propriété en brouillon')
                    : (t?.empty?.noArchived?.[language] || 'Aucune propriété archivée')
              }
            </h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              {filterStatus === 'all'
                ? (t?.empty?.addFirst?.[language] || 'Ajoutez votre première propriété pour commencer à gérer votre portefeuille')
                : (t?.empty?.changeFilters?.[language] || 'Modifier vos filtres pour voir plus de propriétés')
              }
            </p>
            {filterStatus === 'all' && (
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
                <Button
                  onClick={() => router.push('/properties/add')}
                  className="rounded-full text-white px-8 py-6 text-lg shadow-lg hover:shadow-xl transition-all"
                  style={{ background: ownerGradient }}
                >
                  <Plus className="w-5 h-5 mr-2" />
                  {t?.empty?.addFirstButton?.[language] || 'Ajouter ma première propriété'}
                </Button>
              </motion.div>
            )}
          </motion.div>
        ) : (
          <div className="space-y-4">
            {filteredProperties.map((property, index) => {
              const statusConfig = getStatusBadge(property.status);

              return (
                <motion.div
                  key={property.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ scale: 1.01, y: -2 }}
                  transition={{ delay: 0.3 + index * 0.05 }}
                  className="relative overflow-hidden bg-white/90 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-300 p-6"
                  style={{ boxShadow: '0 4px 20px rgba(156, 86, 152, 0.08)' }}
                >
                  {/* Decorative accent */}
                  <div
                    className="absolute top-0 left-0 w-1 h-full"
                    style={{ background: ownerGradient }}
                  />

                  <div className="flex flex-col lg:flex-row gap-6 pl-3">
                    {/* Property Info */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-gray-900 mb-2">
                            {property.title}
                          </h3>
                          <div className="flex items-center gap-2 text-gray-600 mb-3">
                            <MapPin className="w-4 h-4" style={{ color: '#9c5698' }} />
                            <span>{property.city}, {property.postal_code}</span>
                          </div>
                        </div>
                        <Badge className={statusConfig.className}>
                          {statusConfig.label}
                        </Badge>
                      </div>

                      <div className="flex flex-wrap gap-3 text-sm text-gray-600 mb-4">
                        <div
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border"
                          style={{ background: ownerGradientLight, borderColor: 'rgba(156, 86, 152, 0.2)' }}
                        >
                          <Bed className="w-4 h-4" style={{ color: '#9c5698' }} />
                          <span className="font-medium">
                            {property.bedrooms} {property.bedrooms > 1
                              ? (t?.card?.bedrooms?.[language] || 'chambres')
                              : (t?.card?.bedroom?.[language] || 'chambre')}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-200/50">
                          <Bath className="w-4 h-4 text-blue-600" />
                          <span className="font-medium">{property.bathrooms} {t?.card?.bathroom?.[language] || 'SDB'}</span>
                        </div>
                        <div className="flex items-center gap-1.5 bg-green-50 px-3 py-1.5 rounded-lg border border-green-200/50">
                          <DollarSign className="w-4 h-4 text-green-600" />
                          <span className="font-medium">{property.monthly_rent}€{t?.card?.perMonth?.[language] || '/mois'}</span>
                        </div>
                        {property.created_at && (
                          <div className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-200/50">
                            <Calendar className="w-4 h-4 text-gray-500" />
                            <span className="font-medium">{new Date(property.created_at).toLocaleDateString('fr-FR')}</span>
                          </div>
                        )}
                      </div>

                      <p className="text-gray-600 line-clamp-2">
                        {property.description}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex lg:flex-col gap-2 lg:w-48">
                      <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }} className="flex-1">
                        <Button
                          variant="outline"
                          className="w-full rounded-xl hover:border-purple-300"
                          style={{ background: 'transparent' }}
                          onClick={() => router.push(`/properties/${property.id}`)}
                        >
                          <Eye className="w-4 h-4 mr-2" style={{ color: '#9c5698' }} />
                          {t?.actions?.view?.[language] || 'Voir'}
                        </Button>
                      </motion.div>
                      <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }} className="flex-1">
                        <Button
                          variant="outline"
                          className="w-full rounded-xl hover:bg-blue-50 hover:border-blue-300"
                          onClick={() => router.push(`/properties/edit/${property.id}`)}
                        >
                          <Edit className="w-4 h-4 mr-2 text-blue-600" />
                          {t?.actions?.edit?.[language] || 'Modifier'}
                        </Button>
                      </motion.div>
                      <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }} className="flex-1">
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full rounded-xl",
                            property.status === 'published'
                              ? 'hover:bg-amber-50 hover:border-amber-300'
                              : 'hover:bg-green-50 hover:border-green-300'
                          )}
                          onClick={() => handleToggleStatus(property.id, property.status)}
                        >
                          {property.status === 'published'
                            ? (t?.actions?.unpublish?.[language] || 'Dépublier')
                            : (t?.actions?.publish?.[language] || 'Publier')}
                        </Button>
                      </motion.div>
                      <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }} className="flex-1">
                        <Button
                          variant="outline"
                          className="w-full rounded-xl text-red-600 hover:text-red-700 hover:bg-red-50 hover:border-red-300"
                          onClick={() => setDeleteModal({ open: true, propertyId: property.id, propertyTitle: property.title })}
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          {t?.actions?.delete?.[language] || 'Supprimer'}
                        </Button>
                      </motion.div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </main>

      {/* Delete Confirmation Modal */}
      {deleteModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setDeleteModal({ open: false, propertyId: null, propertyTitle: '' })}
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
                {t?.deleteModal?.confirm?.[language] || 'Êtes-vous sûr de vouloir supprimer'}
              </p>
              <p className="font-semibold text-gray-900 mb-4">
                "{deleteModal.propertyTitle}" ?
              </p>
              <p className="text-sm text-red-600 mb-8">
                {t?.deleteModal?.irreversible?.[language] || 'Cette action est irréversible.'}
              </p>

              {/* Actions */}
              <div className="flex gap-3">
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="flex-1">
                  <Button
                    variant="outline"
                    className="w-full rounded-xl hover:border-gray-400"
                    onClick={() => setDeleteModal({ open: false, propertyId: null, propertyTitle: '' })}
                  >
                    {t?.deleteModal?.cancel?.[language] || 'Annuler'}
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="flex-1">
                  <Button
                    className="w-full rounded-xl bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-md"
                    onClick={handleDeleteProperty}
                  >
                    {t?.deleteModal?.deleteButton?.[language] || 'Supprimer'}
                  </Button>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
