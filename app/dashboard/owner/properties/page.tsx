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
  Home
} from 'lucide-react';
import { toast } from 'sonner';
import type { Property } from '@/types/property.types';
import { useRole } from '@/lib/role/role-context';
import LoadingHouse from '@/components/ui/LoadingHouse';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

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
      toast.error('Erreur lors du chargement');
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

      toast.success('Propriété supprimée');
      setDeleteModal({ open: false, propertyId: null, propertyTitle: '' });

      // Reload data to ensure consistency
      await loadData();
    } catch (error: any) {
      toast.error('Erreur lors de la suppression');
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

      toast.success(`Propriété ${newStatus === 'published' ? 'publiée' : 'dépubliée'}`);
      setProperties(properties.map(p =>
        p.id === propertyId ? { ...p, status: newStatus } : p
      ));
    } catch (error: any) {
      toast.error('Erreur lors de la mise à jour');
    }
  };

  const getStatusBadge = (status: string) => {
    const config: Record<string, { variant: "default" | "secondary" | "destructive" | "outline", label: string, className: string }> = {
      published: {
        variant: 'secondary',
        label: 'Publié',
        className: 'bg-green-100 text-green-800 border-green-200'
      },
      draft: {
        variant: 'secondary',
        label: 'Brouillon',
        className: 'bg-yellow-100 text-yellow-800 border-yellow-200'
      },
      archived: {
        variant: 'secondary',
        label: 'Archivé',
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50/30 via-white to-indigo-50/30">
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <LoadingHouse size={80} />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Chargement des propriétés...</h3>
          <p className="text-gray-600">Préparation de vos annonces</p>
        </div>
      </div>
    );
  }

  if (!profile) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50/30 via-white to-indigo-50/30">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-sm border border-gray-200 p-6 sm:p-8 mb-6"
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-3 mb-2">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-200/70 to-indigo-200/70 flex items-center justify-center shadow-sm">
                  <Building2 className="w-6 h-6 text-gray-700" />
                </div>
                Mes Propriétés
              </h1>
              <p className="text-gray-600">
                Gérer et suivre toutes vos annonces immobilières
              </p>
            </div>
            <Button
              onClick={() => router.push('/properties/add')}
              className="rounded-full bg-gradient-to-r from-purple-200/70 to-indigo-200/70 text-gray-900 hover:from-purple-300/70 hover:to-indigo-300/70 shadow-sm hover:shadow-md hover:scale-105 transition-all"
              size="lg"
            >
              <Plus className="w-5 h-5 mr-2" />
              Ajouter
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="bg-gradient-to-br from-purple-50/50 to-indigo-50/50 p-4 rounded-xl border border-purple-200/50"
            >
              <div className="flex items-center gap-2 mb-2">
                <Home className="w-4 h-4 text-purple-600" />
                <p className="text-sm text-gray-600 font-medium">Total</p>
              </div>
              <p className="text-2xl font-bold text-purple-900">{properties.length}</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.15 }}
              className="bg-gradient-to-br from-green-50/50 to-emerald-50/50 p-4 rounded-xl border border-green-200/50"
            >
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4 text-green-600" />
                <p className="text-sm text-gray-600 font-medium">Publiées</p>
              </div>
              <p className="text-2xl font-bold text-green-700">
                {properties.filter(p => p.status === 'published').length}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="bg-gradient-to-br from-yellow-50/50 to-amber-50/50 p-4 rounded-xl border border-yellow-200/50"
            >
              <div className="flex items-center gap-2 mb-2">
                <Edit className="w-4 h-4 text-yellow-600" />
                <p className="text-sm text-gray-600 font-medium">Brouillons</p>
              </div>
              <p className="text-2xl font-bold text-yellow-700">
                {properties.filter(p => p.status === 'draft').length}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.25 }}
              className="bg-gradient-to-br from-gray-50/50 to-slate-50/50 p-4 rounded-xl border border-gray-200/50"
            >
              <div className="flex items-center gap-2 mb-2">
                <Building2 className="w-4 h-4 text-gray-600" />
                <p className="text-sm text-gray-600 font-medium">Archivées</p>
              </div>
              <p className="text-2xl font-bold text-gray-700">
                {properties.filter(p => p.status === 'archived').length}
              </p>
            </motion.div>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-2 mt-6">
            {[
              { value: 'all', label: 'Toutes' },
              { value: 'published', label: 'Publiées' },
              { value: 'draft', label: 'Brouillons' },
              { value: 'archived', label: 'Archivées' }
            ].map((filter) => (
              <Button
                key={filter.value}
                variant={filterStatus === filter.value ? 'default' : 'outline'}
                onClick={() => setFilterStatus(filter.value as typeof filterStatus)}
                size="sm"
                className={cn(
                  "rounded-full transition-all",
                  filterStatus === filter.value
                    ? 'bg-gradient-to-r from-purple-200/70 to-indigo-200/70 text-gray-900 border-purple-300 hover:from-purple-300/70 hover:to-indigo-300/70'
                    : 'hover:border-purple-300'
                )}
              >
                {filter.label} ({
                  filter.value === 'all'
                    ? properties.length
                    : properties.filter(p => p.status === filter.value).length
                })
              </Button>
            ))}
          </div>
        </motion.div>

        {/* Properties List */}
        {filteredProperties.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="relative overflow-hidden bg-gradient-to-br from-purple-50/50 via-white to-indigo-50/50 rounded-3xl p-12 text-center border border-purple-200/50"
          >
            <div className="w-20 h-20 bg-gradient-to-br from-purple-200/70 to-indigo-200/70 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm">
              <Building2 className="w-10 h-10 text-gray-700" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              {filterStatus === 'all'
                ? 'Aucune propriété'
                : `Aucune propriété ${
                    filterStatus === 'published' ? 'publiée' :
                    filterStatus === 'draft' ? 'en brouillon' : 'archivée'
                  }`
              }
            </h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              {filterStatus === 'all'
                ? 'Ajoutez votre première propriété pour commencer à gérer votre portefeuille'
                : 'Modifier vos filtres pour voir plus de propriétés'
              }
            </p>
            {filterStatus === 'all' && (
              <Button
                onClick={() => router.push('/properties/add')}
                className="rounded-full bg-gradient-to-r from-purple-200/70 to-indigo-200/70 text-gray-900 hover:from-purple-300/70 hover:to-indigo-300/70 px-8 py-6 text-lg shadow-sm hover:shadow-md transition-all hover:scale-105"
              >
                <Plus className="w-5 h-5 mr-2" />
                Ajouter ma première propriété
              </Button>
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
                  transition={{ delay: 0.3 + index * 0.05 }}
                  className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300 hover:scale-[1.01] p-6"
                >
                  <div className="flex flex-col lg:flex-row gap-6">
                    {/* Property Info */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-gray-900 mb-2">
                            {property.title}
                          </h3>
                          <div className="flex items-center gap-2 text-gray-600 mb-3">
                            <MapPin className="w-4 h-4" />
                            <span>{property.city}, {property.postal_code}</span>
                          </div>
                        </div>
                        <Badge className={statusConfig.className}>
                          {statusConfig.label}
                        </Badge>
                      </div>

                      <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
                        <div className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-lg">
                          <Bed className="w-4 h-4 text-purple-600" />
                          <span className="font-medium">{property.bedrooms} chambre{property.bedrooms > 1 ? 's' : ''}</span>
                        </div>
                        <div className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-lg">
                          <Bath className="w-4 h-4 text-blue-600" />
                          <span className="font-medium">{property.bathrooms} SDB</span>
                        </div>
                        <div className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-lg">
                          <DollarSign className="w-4 h-4 text-green-600" />
                          <span className="font-medium">{property.monthly_rent}€/mois</span>
                        </div>
                        {property.created_at && (
                          <div className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-lg">
                            <Calendar className="w-4 h-4 text-gray-600" />
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
                      <Button
                        variant="outline"
                        className="flex-1 rounded-xl hover:bg-purple-50 hover:border-purple-300"
                        onClick={() => router.push(`/properties/${property.id}`)}
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        Voir
                      </Button>
                      <Button
                        variant="outline"
                        className="flex-1 rounded-xl hover:bg-blue-50 hover:border-blue-300"
                        onClick={() => router.push(`/properties/edit/${property.id}`)}
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        Modifier
                      </Button>
                      <Button
                        variant="outline"
                        className={cn(
                          "flex-1 rounded-xl",
                          property.status === 'published'
                            ? 'hover:bg-yellow-50 hover:border-yellow-300'
                            : 'hover:bg-green-50 hover:border-green-300'
                        )}
                        onClick={() => handleToggleStatus(property.id, property.status)}
                      >
                        {property.status === 'published' ? 'Dépublier' : 'Publier'}
                      </Button>
                      <Button
                        variant="outline"
                        className="flex-1 rounded-xl text-red-600 hover:text-red-700 hover:bg-red-50 hover:border-red-300"
                        onClick={() => setDeleteModal({ open: true, propertyId: property.id, propertyTitle: property.title })}
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Supprimer
                      </Button>
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
            className="relative bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full border border-gray-200"
          >
            <div className="text-center">
              {/* Icon */}
              <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-8 h-8 text-red-600" />
              </div>

              {/* Title */}
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Supprimer la propriété ?
              </h3>

              {/* Description */}
              <p className="text-gray-600 mb-2">
                Êtes-vous sûr de vouloir supprimer
              </p>
              <p className="font-semibold text-gray-900 mb-4">
                "{deleteModal.propertyTitle}" ?
              </p>
              <p className="text-sm text-red-600 mb-8">
                Cette action est irréversible.
              </p>

              {/* Actions */}
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1 rounded-xl"
                  onClick={() => setDeleteModal({ open: false, propertyId: null, propertyTitle: '' })}
                >
                  Annuler
                </Button>
                <Button
                  className="flex-1 rounded-xl bg-red-600 hover:bg-red-700 text-white"
                  onClick={handleDeleteProperty}
                >
                  Supprimer
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
