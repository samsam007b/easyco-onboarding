/**
 * Maintenance System - Modern Issue Tracking
 * Features: Create tickets, upload photos, track status, cost management
 */

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/auth/supabase-client';
import { motion, AnimatePresence } from 'framer-motion';
import LoadingHouse from '@/components/ui/LoadingHouse';
import {
  Wrench,
  Plus,
  AlertCircle,
  Clock,
  CheckCircle,
  XCircle,
  Image as ImageIcon,
  Upload,
  DollarSign,
  MapPin,
  User,
  Camera,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { maintenanceService } from '@/lib/services/maintenance-service';
import type {
  MaintenanceRequestWithCreator,
  CreateMaintenanceForm,
  MaintenanceStats,
  MaintenanceCategory,
  MaintenancePriority,
  MaintenanceStatus,
} from '@/types/maintenance.types';
import {
  MAINTENANCE_CATEGORIES,
  MAINTENANCE_PRIORITIES,
  MAINTENANCE_STATUSES,
} from '@/types/maintenance.types';

export default function MaintenancePage() {
  const router = useRouter();
  const supabase = createClient();

  const [isLoading, setIsLoading] = useState(true);
  const [propertyId, setPropertyId] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  const [requests, setRequests] = useState<MaintenanceRequestWithCreator[]>([]);
  const [stats, setStats] = useState<MaintenanceStats | null>(null);
  const [filter, setFilter] = useState<MaintenanceStatus | 'all'>('all');

  // Create modal state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [createForm, setCreateForm] = useState<CreateMaintenanceForm>({
    title: '',
    description: '',
    category: 'other',
    priority: 'medium',
  });
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  useEffect(() => {
    loadData();
  }, [filter]);

  const loadData = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }

      setUserId(user.id);

      // Get user's property_id
      const { data: profile } = await supabase
        .from('profiles')
        .select('property_id')
        .eq('id', user.id)
        .single();

      if (!profile?.property_id) {
        setIsLoading(false);
        return;
      }

      setPropertyId(profile.property_id);

      // Fetch requests
      const statusFilter =
        filter === 'all' ? undefined : { status: [filter] as MaintenanceStatus[] };
      const requestsData = await maintenanceService.getRequests(
        profile.property_id,
        statusFilter
      );
      setRequests(requestsData);

      // Fetch stats
      const statsData = await maintenanceService.getStats(profile.property_id);
      setStats(statsData);

      setIsLoading(false);
    } catch (error) {
      console.error('[Maintenance] Error loading data:', error);
      setIsLoading(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setSelectedFiles((prev) => [...prev, ...files].slice(0, 5)); // Max 5 images
  };

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleCreateRequest = async () => {
    if (!propertyId || !userId) return;

    if (!createForm.title || !createForm.description) {
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }

    setIsCreating(true);

    try {
      const result = await maintenanceService.createRequest(propertyId, userId, {
        ...createForm,
        images: selectedFiles.length > 0 ? selectedFiles : undefined,
      });

      if (result.success) {
        console.log('[Maintenance] ✅ Request created successfully');
        setShowCreateModal(false);
        resetForm();
        await loadData();
      } else {
        alert(result.error || 'Erreur lors de la création');
      }
    } catch (error) {
      console.error('[Maintenance] Create error:', error);
      alert('Une erreur est survenue');
    } finally {
      setIsCreating(false);
    }
  };

  const handleUpdateStatus = async (requestId: string, newStatus: MaintenanceStatus) => {
    try {
      const result = await maintenanceService.updateStatus(requestId, newStatus);

      if (result.success) {
        console.log('[Maintenance] ✅ Status updated');
        await loadData();
      } else {
        alert(result.error || 'Erreur lors de la mise à jour');
      }
    } catch (error) {
      console.error('[Maintenance] Update error:', error);
      alert('Une erreur est survenue');
    }
  };

  const resetForm = () => {
    setCreateForm({
      title: '',
      description: '',
      category: 'other',
      priority: 'medium',
    });
    setSelectedFiles([]);
  };

  const getCategoryInfo = (category: MaintenanceCategory) => {
    return MAINTENANCE_CATEGORIES.find((c) => c.value === category) || MAINTENANCE_CATEGORIES[7];
  };

  const getPriorityInfo = (priority: MaintenancePriority) => {
    return MAINTENANCE_PRIORITIES.find((p) => p.value === priority) || MAINTENANCE_PRIORITIES[1];
  };

  const getStatusInfo = (status: MaintenanceStatus) => {
    return MAINTENANCE_STATUSES.find((s) => s.value === status) || MAINTENANCE_STATUSES[0];
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <LoadingHouse size={80} />
          <p className="text-gray-600 font-medium mt-4">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50/30 via-white to-orange-50/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Button
            onClick={() => router.back()}
            variant="ghost"
            className="mb-4 rounded-full"
          >
            ← Retour au hub
          </Button>

          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                🔧 Maintenance
              </h1>
              <p className="text-gray-600">Signalez et suivez les problèmes techniques</p>
            </div>

            <Button
              onClick={() => setShowCreateModal(true)}
              className="rounded-full bg-gradient-to-r from-[#D97B6F] via-[#E8865D] to-[#FF8C4B] hover:opacity-90"
            >
              <Plus className="w-4 h-4 mr-2" />
              Nouveau ticket
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <motion.button
              onClick={() => setFilter('all')}
              className={cn(
                'bg-white rounded-2xl p-4 shadow-lg hover:shadow-xl transition-all text-left',
                filter === 'all' && 'ring-2 ring-resident-500'
              )}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">
                    {stats?.total_requests || 0}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-resident-100 to-resident-200 flex items-center justify-center">
                  <Wrench className="w-6 h-6 text-resident-700" />
                </div>
              </div>
            </motion.button>

            <motion.button
              onClick={() => setFilter('open')}
              className={cn(
                'bg-white rounded-2xl p-4 shadow-lg hover:shadow-xl transition-all text-left',
                filter === 'open' && 'ring-2 ring-yellow-500'
              )}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Ouverts</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">
                    {stats?.open_count || 0}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-yellow-100 flex items-center justify-center">
                  <AlertCircle className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
            </motion.button>

            <motion.button
              onClick={() => setFilter('in_progress')}
              className={cn(
                'bg-white rounded-2xl p-4 shadow-lg hover:shadow-xl transition-all text-left',
                filter === 'in_progress' && 'ring-2 ring-blue-500'
              )}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">En cours</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">
                    {stats?.in_progress_count || 0}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                  <Clock className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </motion.button>

            <motion.button
              onClick={() => setFilter('resolved')}
              className={cn(
                'bg-white rounded-2xl p-4 shadow-lg hover:shadow-xl transition-all text-left',
                filter === 'resolved' && 'ring-2 ring-green-500'
              )}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Résolus</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">
                    {stats?.resolved_count || 0}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </motion.button>
          </div>
        </motion.div>

        {/* Requests List */}
        <div className="space-y-4">
          {requests.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-3xl shadow-lg p-12 text-center"
            >
              <Wrench className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {filter === 'all' ? 'Aucune demande' : `Aucune demande ${filter}`}
              </h3>
              <p className="text-gray-600 mb-6">
                Créez votre première demande de maintenance
              </p>
              <Button
                onClick={() => setShowCreateModal(true)}
                className="rounded-full bg-gradient-to-r from-[#D97B6F] via-[#E8865D] to-[#FF8C4B]"
              >
                <Plus className="w-4 h-4 mr-2" />
                Nouvelle demande
              </Button>
            </motion.div>
          ) : (
            <AnimatePresence>
              {requests.map((request, index) => {
                const categoryInfo = getCategoryInfo(request.category);
                const priorityInfo = getPriorityInfo(request.priority);
                const statusInfo = getStatusInfo(request.status);

                return (
                  <motion.div
                    key={request.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all"
                  >
                    <div className="flex items-start gap-4">
                      {/* Category Icon */}
                      <div className="text-4xl flex-shrink-0">{categoryInfo.emoji}</div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4 mb-3">
                          <div className="flex-1">
                            <h3 className="text-lg font-bold text-gray-900 mb-1">
                              {request.title}
                            </h3>
                            <p className="text-sm text-gray-600">{request.description}</p>
                          </div>

                          <div className="flex flex-col gap-2 items-end flex-shrink-0">
                            <Badge className={priorityInfo.color}>
                              {priorityInfo.label}
                            </Badge>
                            <Badge className={categoryInfo.color}>
                              {categoryInfo.label}
                            </Badge>
                          </div>
                        </div>

                        {/* Meta info */}
                        <div className="flex flex-wrap items-center gap-4 text-xs text-gray-600 mb-3">
                          <div className="flex items-center gap-1">
                            <User className="w-3 h-3" />
                            {request.creator_name}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {new Date(request.created_at).toLocaleDateString('fr-FR', {
                              day: 'numeric',
                              month: 'short',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </div>
                          {request.location && (
                            <div className="flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              {request.location}
                            </div>
                          )}
                          {request.estimated_cost && (
                            <div className="flex items-center gap-1">
                              <DollarSign className="w-3 h-3" />
                              €{request.estimated_cost.toFixed(2)} (estimé)
                            </div>
                          )}
                          {request.actual_cost && (
                            <div className="flex items-center gap-1 font-bold text-green-700">
                              <DollarSign className="w-3 h-3" />
                              €{request.actual_cost.toFixed(2)} (réel)
                            </div>
                          )}
                        </div>

                        {/* Status Badge */}
                        <div className="flex items-center gap-2">
                          <Badge className={statusInfo.color}>
                            {statusInfo.icon} {statusInfo.label}
                          </Badge>

                          {/* Quick status actions */}
                          {request.status === 'open' && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="rounded-full text-xs"
                              onClick={() => handleUpdateStatus(request.id, 'in_progress')}
                            >
                              Commencer
                            </Button>
                          )}
                          {request.status === 'in_progress' && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="rounded-full text-xs"
                              onClick={() => handleUpdateStatus(request.id, 'resolved')}
                            >
                              Marquer résolu
                            </Button>
                          )}
                        </div>

                        {/* Images */}
                        {request.images && request.images.length > 0 && (
                          <div className="mt-3 flex gap-2 overflow-x-auto">
                            {request.images.map((url, idx) => (
                              <img
                                key={idx}
                                src={url}
                                alt={`Photo ${idx + 1}`}
                                className="w-24 h-24 rounded-lg object-cover border-2 border-gray-200"
                              />
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          )}
        </div>
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Nouvelle demande</h2>
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  resetForm();
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Title */}
              <div>
                <Label>Titre *</Label>
                <Input
                  value={createForm.title}
                  onChange={(e) => setCreateForm({ ...createForm, title: e.target.value })}
                  placeholder="Ex: Fuite d'eau dans la salle de bain"
                  className="rounded-xl"
                />
              </div>

              {/* Description */}
              <div>
                <Label>Description *</Label>
                <Textarea
                  value={createForm.description}
                  onChange={(e) =>
                    setCreateForm({ ...createForm, description: e.target.value })
                  }
                  placeholder="Décrivez le problème en détail..."
                  className="rounded-xl min-h-[100px]"
                />
              </div>

              {/* Category */}
              <div>
                <Label>Catégorie *</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
                  {MAINTENANCE_CATEGORIES.map((cat) => (
                    <button
                      key={cat.value}
                      onClick={() => setCreateForm({ ...createForm, category: cat.value })}
                      className={cn(
                        'p-3 rounded-xl border-2 text-center transition-all',
                        createForm.category === cat.value
                          ? 'border-resident-500 bg-resident-50'
                          : 'border-gray-200 hover:border-gray-300'
                      )}
                    >
                      <div className="text-2xl mb-1">{cat.emoji}</div>
                      <div className="text-xs font-medium text-gray-700">{cat.label}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Priority */}
              <div>
                <Label>Priorité *</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
                  {MAINTENANCE_PRIORITIES.map((pri) => (
                    <button
                      key={pri.value}
                      onClick={() => setCreateForm({ ...createForm, priority: pri.value })}
                      className={cn(
                        'p-3 rounded-xl border-2 text-center transition-all',
                        createForm.priority === pri.value
                          ? pri.borderColor + ' ' + pri.color
                          : 'border-gray-200 hover:border-gray-300'
                      )}
                    >
                      <div className="text-sm font-bold">{pri.label}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Location */}
              <div>
                <Label>Localisation (optionnel)</Label>
                <Input
                  value={createForm.location || ''}
                  onChange={(e) => setCreateForm({ ...createForm, location: e.target.value })}
                  placeholder="Ex: Cuisine, Salle de bain"
                  className="rounded-xl"
                />
              </div>

              {/* Estimated Cost */}
              <div>
                <Label>Coût estimé (optionnel)</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    type="number"
                    step="0.01"
                    value={createForm.estimated_cost || ''}
                    onChange={(e) =>
                      setCreateForm({ ...createForm, estimated_cost: e.target.value })
                    }
                    placeholder="0.00"
                    className="rounded-xl pl-10"
                  />
                </div>
              </div>

              {/* Photos */}
              <div>
                <Label>Photos (max 5)</Label>
                <div className="mt-2">
                  <label className="flex items-center justify-center gap-2 p-4 border-2 border-dashed border-gray-300 rounded-xl hover:border-resident-500 cursor-pointer transition-colors">
                    <Camera className="w-5 h-5 text-gray-400" />
                    <span className="text-sm text-gray-600">
                      Cliquez pour ajouter des photos
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                  </label>

                  {/* Preview */}
                  {selectedFiles.length > 0 && (
                    <div className="flex gap-2 mt-3 overflow-x-auto">
                      {selectedFiles.map((file, idx) => (
                        <div key={idx} className="relative flex-shrink-0">
                          <img
                            src={URL.createObjectURL(file)}
                            alt={`Preview ${idx + 1}`}
                            className="w-20 h-20 rounded-lg object-cover border-2 border-gray-200"
                          />
                          <button
                            onClick={() => removeFile(idx)}
                            className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 mt-6">
              <Button
                variant="outline"
                onClick={() => {
                  setShowCreateModal(false);
                  resetForm();
                }}
                className="flex-1 rounded-full"
                disabled={isCreating}
              >
                Annuler
              </Button>
              <Button
                onClick={handleCreateRequest}
                disabled={isCreating || !createForm.title || !createForm.description}
                className="flex-1 rounded-full cta-resident"
              >
                {isCreating ? (
                  <>
                    <LoadingHouse size={20} className="mr-2" />
                    Création...
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4 mr-2" />
                    Créer la demande
                  </>
                )}
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
