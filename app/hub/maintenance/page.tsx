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
  Sparkles,
  Droplets,
  Zap,
  Flame,
  Plug,
  Building2,
  Bug,
  CirclePlus,
  Settings,
  Lock,
  type LucideIcon,
} from 'lucide-react';

// Icon mapping for maintenance categories
const CATEGORY_ICONS: Record<string, LucideIcon> = {
  Droplets,
  Zap,
  Flame,
  Plug,
  Building2,
  Sparkles,
  Bug,
  Wrench,
};

// Icon mapping for maintenance statuses
const STATUS_ICONS: Record<string, LucideIcon> = {
  CirclePlus,
  Settings,
  CheckCircle,
  Lock,
  XCircle,
};
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
import { useLanguage } from '@/lib/i18n/use-language';

export default function MaintenancePage() {
  const { getSection, language } = useLanguage();
  const t = getSection('hub')?.maintenance;
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
      alert(t?.errors?.fillRequired?.[language] || 'Please fill in all required fields');
      return;
    }

    setIsCreating(true);

    try {
      const result = await maintenanceService.createRequest(propertyId, userId, {
        ...createForm,
        images: selectedFiles.length > 0 ? selectedFiles : undefined,
      });

      if (result.success) {
        console.log('[Maintenance] Request created successfully');
        setShowCreateModal(false);
        resetForm();
        await loadData();
      } else {
        alert(result.error || (t?.errors?.creationError?.[language] || 'Error creating request'));
      }
    } catch (error) {
      console.error('[Maintenance] Create error:', error);
      alert(t?.errors?.genericError?.[language] || 'An error occurred');
    } finally {
      setIsCreating(false);
    }
  };

  const handleUpdateStatus = async (requestId: string, newStatus: MaintenanceStatus) => {
    try {
      const result = await maintenanceService.updateStatus(requestId, newStatus);

      if (result.success) {
        console.log('[Maintenance] Status updated');
        await loadData();
      } else {
        alert(result.error || (t?.errors?.updateError?.[language] || 'Error updating status'));
      }
    } catch (error) {
      console.error('[Maintenance] Update error:', error);
      alert(t?.errors?.genericError?.[language] || 'An error occurred');
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
          <p className="text-gray-600 font-medium mt-4">{t?.loading?.[language] || 'Loading...'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50/30 via-white to-orange-50/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header - V3 Fun Design */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          className="mb-8"
        >
          <Button
            onClick={() => router.back()}
            variant="ghost"
            className="mb-4 rounded-full font-semibold"
            style={{
              '--hover-bg': 'rgba(224, 87, 71, 0.1)',
            } as React.CSSProperties}
            onMouseEnter={(e) => e.currentTarget.style.background = 'var(--hover-bg)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
          >
            ← {t?.backToHub?.[language] || 'Back to hub'}
          </Button>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
                className="w-12 h-12 superellipse-2xl flex items-center justify-center shadow-lg"
                style={{
                  background: 'var(--resident-primary)',
                  boxShadow: '0 8px 24px var(--resident-shadow)',
                }}
              >
                <Wrench className="w-6 h-6 text-white" />
              </motion.div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {t?.title?.[language] || 'Maintenance'}
                </h1>
                <p className="text-sm text-gray-500">{t?.subtitle?.[language] || 'Report and track technical issues'}</p>
              </div>
            </div>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={() => setShowCreateModal(true)}
                className="rounded-full text-white font-semibold hover:shadow-xl transition-all border-none"
                style={{
                  background: 'var(--resident-primary)',
                  boxShadow: '0 4px 16px var(--resident-shadow)',
                }}
              >
                <Plus className="w-4 h-4 mr-2" />
                {t?.newTicket?.[language] || 'New ticket'}
              </Button>
            </motion.div>
          </div>

          {/* Stats Cards - V3 Fun Design */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
            {/* Total - Resident Orange */}
            <motion.button
              onClick={() => setFilter('all')}
              className="relative overflow-hidden superellipse-2xl p-4 shadow-lg hover:shadow-xl transition-all text-left"
              style={{
                background: filter === 'all' ? 'var(--gradient-resident-subtle)' : 'white',
                boxShadow: filter === 'all' ? '0 8px 24px var(--resident-shadow)' : '0 4px 12px rgba(0, 0, 0, 0.08)',
              }}
              whileHover={{ scale: 1.03, y: -4 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="absolute -right-4 -top-4 w-20 h-20 rounded-full opacity-20"
                style={{ background: 'var(--resident-primary)' }}
              />
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium" style={{ color: 'var(--resident-primary)' }}>{t?.stats?.total?.[language] || 'Total'}</span>
                <div
                  className="w-8 h-8 superellipse-xl flex items-center justify-center shadow-md"
                  style={{ background: 'var(--resident-primary)' }}
                >
                  <Wrench className="w-4 h-4 text-white" />
                </div>
              </div>
              <p className="text-2xl font-bold text-gray-900">{stats?.total_requests || 0}</p>
              <p className="text-xs font-medium mt-1" style={{ color: 'var(--resident-primary)' }}>{t?.stats?.tickets?.[language] || 'tickets'}</p>
            </motion.button>

            {/* Open - Amber Pastel (Semantic Warning) */}
            <motion.button
              onClick={() => setFilter('open')}
              className="relative overflow-hidden superellipse-2xl p-4 shadow-lg hover:shadow-xl transition-all text-left"
              style={{
                background: 'linear-gradient(135deg, #FFFBEB 0%, #FEF3C7 100%)',
                boxShadow: filter === 'open' ? '0 8px 24px rgba(217, 119, 6, 0.25)' : '0 4px 12px rgba(0, 0, 0, 0.08)',
              }}
              whileHover={{ scale: 1.03, y: -4 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="absolute -right-4 -top-4 w-20 h-20 rounded-full opacity-20"
                style={{ background: 'linear-gradient(135deg, #D97706, #F59E0B)' }}
              />
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-amber-700">{t?.stats?.open?.[language] || 'Open'}</span>
                <div
                  className="w-8 h-8 superellipse-xl flex items-center justify-center shadow-md"
                  style={{ background: 'linear-gradient(135deg, #D97706 0%, #F59E0B 100%)' }}
                >
                  <AlertCircle className="w-4 h-4 text-white" />
                </div>
              </div>
              <p className="text-2xl font-bold text-gray-900">{stats?.open_count || 0}</p>
              <p className="text-xs font-medium text-amber-600 mt-1">{t?.stats?.awaitingAction?.[language] || 'awaiting action'}</p>
            </motion.button>

            {/* In Progress - Resident Orange */}
            <motion.button
              onClick={() => setFilter('in_progress')}
              className="relative overflow-hidden superellipse-2xl p-4 shadow-lg hover:shadow-xl transition-all text-left"
              style={{
                background: filter === 'in_progress' ? 'var(--gradient-resident-subtle)' : 'white',
                boxShadow: filter === 'in_progress' ? '0 8px 24px var(--resident-shadow)' : '0 4px 12px rgba(0, 0, 0, 0.08)',
              }}
              whileHover={{ scale: 1.03, y: -4 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="absolute -right-4 -top-4 w-20 h-20 rounded-full opacity-20"
                style={{ background: 'var(--gradient-resident-medium)' }}
              />
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium" style={{ color: 'var(--resident-primary)' }}>{t?.stats?.inProgress?.[language] || 'In progress'}</span>
                <div
                  className="w-8 h-8 superellipse-xl flex items-center justify-center shadow-md"
                  style={{ background: 'var(--gradient-resident-medium)' }}
                >
                  <Clock className="w-4 h-4 text-white" />
                </div>
              </div>
              <p className="text-2xl font-bold text-gray-900">{stats?.in_progress_count || 0}</p>
              <p className="text-xs font-medium mt-1" style={{ color: 'var(--resident-primary)' }}>{t?.stats?.beingFixed?.[language] || 'being fixed'}</p>
            </motion.button>

            {/* Resolved - Green Pastel (Semantic Success) */}
            <motion.button
              onClick={() => setFilter('resolved')}
              className="relative overflow-hidden superellipse-2xl p-4 shadow-lg hover:shadow-xl transition-all text-left"
              style={{
                background: 'linear-gradient(135deg, #F0F7F4 0%, #E8F5EE 100%)',
                boxShadow: filter === 'resolved' ? '0 8px 24px rgba(124, 184, 155, 0.25)' : '0 4px 12px rgba(0, 0, 0, 0.08)',
              }}
              whileHover={{ scale: 1.03, y: -4 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="absolute -right-4 -top-4 w-20 h-20 rounded-full opacity-20"
                style={{ background: 'linear-gradient(135deg, #7CB89B, #9ECDB5)' }}
              />
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-[#5A9A7C]">{t?.stats?.resolved?.[language] || 'Resolved'}</span>
                <div
                  className="w-8 h-8 superellipse-xl flex items-center justify-center shadow-md"
                  style={{ background: 'linear-gradient(135deg, #7CB89B 0%, #9ECDB5 100%)' }}
                >
                  <CheckCircle className="w-4 h-4 text-white" />
                </div>
              </div>
              <p className="text-2xl font-bold text-gray-900">{stats?.resolved_count || 0}</p>
              <p className="text-xs font-medium text-[#5A9A7C] mt-1">{t?.stats?.completed?.[language] || 'completed'}</p>
            </motion.button>
          </div>
        </motion.div>

        {/* Requests List */}
        <div className="space-y-4">
          {requests.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white superellipse-3xl shadow-lg p-12 text-center"
              style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.08)' }}
            >
              {/* V3 Fun Icon */}
              <motion.div
                whileHover={{ scale: 1.05, rotate: 5 }}
                className="relative w-20 h-20 superellipse-2xl flex items-center justify-center mx-auto mb-4"
                style={{
                  background: 'var(--resident-primary)',
                  boxShadow: '0 8px 24px var(--resident-shadow)',
                }}
              >
                <Wrench className="w-10 h-10 text-white" />
                <motion.div
                  className="absolute -top-1 -right-1"
                  animate={{ y: [-2, 2, -2], rotate: [0, 15, 0] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                >
                  <Sparkles className="w-5 h-5" style={{ color: 'var(--searcher-primary)' }} />
                </motion.div>
              </motion.div>

              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {filter === 'all'
                  ? (t?.empty?.noRequests?.[language] || 'No requests')
                  : (t?.empty?.noRequestsFiltered?.[language] || `No ${filter} requests`)}
              </h3>
              <p className="text-gray-500 mb-6 max-w-sm mx-auto">
                {t?.empty?.createFirst?.[language] || 'Create your first maintenance request'}
              </p>

              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  onClick={() => setShowCreateModal(true)}
                  className="rounded-full text-white font-semibold hover:shadow-xl transition-all border-none"
                  style={{
                    background: 'var(--resident-primary)',
                    boxShadow: '0 4px 16px var(--resident-shadow)',
                  }}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  {t?.empty?.newRequest?.[language] || 'New request'}
                </Button>
              </motion.div>
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
                    className="bg-white superellipse-2xl shadow-lg p-6 hover:shadow-xl transition-all"
                  >
                    <div className="flex items-start gap-4">
                      {/* Category Icon */}
                      <div className="w-12 h-12 flex-shrink-0 flex items-center justify-center superellipse-xl bg-gray-100">
                        {(() => {
                          const IconComponent = CATEGORY_ICONS[categoryInfo.iconName];
                          return IconComponent ? <IconComponent className="w-6 h-6 text-gray-700" /> : null;
                        })()}
                      </div>

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
                            {new Date(request.created_at).toLocaleDateString(
                              language === 'fr' ? 'fr-FR' : language === 'en' ? 'en-US' : language === 'nl' ? 'nl-NL' : 'de-DE',
                              {
                                day: 'numeric',
                                month: 'short',
                                hour: '2-digit',
                                minute: '2-digit',
                              }
                            )}
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
                              €{request.estimated_cost.toFixed(2)} ({t?.cost?.estimated?.[language] || 'estimated'})
                            </div>
                          )}
                          {request.actual_cost && (
                            <div className="flex items-center gap-1 font-bold text-green-700">
                              <DollarSign className="w-3 h-3" />
                              €{request.actual_cost.toFixed(2)} ({t?.cost?.actual?.[language] || 'actual'})
                            </div>
                          )}
                        </div>

                        {/* Status Badge */}
                        <div className="flex items-center gap-2">
                          <Badge className={statusInfo.color}>
                            {(() => {
                              const StatusIcon = STATUS_ICONS[statusInfo.iconName];
                              return StatusIcon ? <StatusIcon className="w-3.5 h-3.5 mr-1" /> : null;
                            })()}
                            {statusInfo.label}
                          </Badge>

                          {/* Quick status actions */}
                          {request.status === 'open' && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="rounded-full text-xs"
                              onClick={() => handleUpdateStatus(request.id, 'in_progress')}
                            >
                              {t?.actions?.start?.[language] || 'Start'}
                            </Button>
                          )}
                          {request.status === 'in_progress' && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="rounded-full text-xs"
                              onClick={() => handleUpdateStatus(request.id, 'resolved')}
                            >
                              {t?.actions?.markResolved?.[language] || 'Mark as resolved'}
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
                                className="w-24 h-24 superellipse-lg object-cover border-2 border-gray-200"
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

      {/* Create Modal - V3 Fun Design */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white superellipse-3xl max-w-2xl w-full max-h-[90vh] overflow-hidden relative"
            style={{ boxShadow: '0 25px 80px var(--resident-shadow)' }}
          >
            {/* Decorative gradient circles */}
            <div className="absolute right-0 top-0 w-32 h-32 rounded-full opacity-10 pointer-events-none"
              style={{ background: 'var(--gradient-resident-medium)', transform: 'translate(30%, -30%)' }} />

            {/* Scrollable content */}
            <div className="max-h-[90vh] overflow-y-auto p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className="w-12 h-12 superellipse-2xl flex items-center justify-center shadow-lg"
                    style={{ background: 'var(--resident-primary)', boxShadow: '0 8px 24px var(--resident-shadow)' }}
                  >
                    <Plus className="w-6 h-6 text-white" />
                  </motion.div>
                  <h2 className="text-xl font-bold text-gray-900">{t?.modal?.title?.[language] || 'New request'}</h2>
                </div>
                <button
                  onClick={() => {
                    setShowCreateModal(false);
                    resetForm();
                  }}
                  className="w-10 h-10 superellipse-xl flex items-center justify-center transition-colors"
                  style={{ '--hover-bg': 'var(--resident-100)' } as React.CSSProperties}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'var(--hover-bg)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

            <div className="space-y-4">
              {/* Title */}
              <div>
                <Label>{t?.modal?.requestTitle?.[language] || 'Title'} *</Label>
                <Input
                  value={createForm.title}
                  onChange={(e) => setCreateForm({ ...createForm, title: e.target.value })}
                  placeholder={t?.modal?.titlePlaceholder?.[language] || "e.g., Water leak in the bathroom"}
                  className="superellipse-xl"
                />
              </div>

              {/* Description */}
              <div>
                <Label>{t?.modal?.description?.[language] || 'Description'} *</Label>
                <Textarea
                  value={createForm.description}
                  onChange={(e) =>
                    setCreateForm({ ...createForm, description: e.target.value })
                  }
                  placeholder={t?.modal?.descriptionPlaceholder?.[language] || 'Describe the issue in detail...'}
                  className="superellipse-xl min-h-[100px]"
                />
              </div>

              {/* Category */}
              <div>
                <Label>{t?.modal?.category?.[language] || 'Category'} *</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
                  {MAINTENANCE_CATEGORIES.map((cat) => {
                    const CatIcon = CATEGORY_ICONS[cat.iconName];
                    return (
                      <button
                        key={cat.value}
                        onClick={() => setCreateForm({ ...createForm, category: cat.value })}
                        className={cn(
                          'p-3 superellipse-xl border-2 text-center transition-all',
                          createForm.category === cat.value
                            ? 'bg-[var(--resident-50)] border-[var(--resident-400)]'
                            : 'border-gray-200 hover:border-[var(--resident-200)]'
                        )}
                      >
                        <div className="flex justify-center mb-1">
                          {CatIcon && <CatIcon className={cn("w-6 h-6", createForm.category === cat.value ? "text-[var(--resident-primary)]" : "text-gray-700")} />}
                        </div>
                        <div className="text-xs font-medium text-gray-700">{cat.label}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Priority */}
              <div>
                <Label>{t?.modal?.priority?.[language] || 'Priority'} *</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
                  {MAINTENANCE_PRIORITIES.map((pri) => (
                    <button
                      key={pri.value}
                      onClick={() => setCreateForm({ ...createForm, priority: pri.value })}
                      className={cn(
                        'p-3 superellipse-xl border-2 text-center transition-all',
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
                <Label>{t?.modal?.location?.[language] || 'Location'} ({t?.modal?.optional?.[language] || 'optional'})</Label>
                <Input
                  value={createForm.location || ''}
                  onChange={(e) => setCreateForm({ ...createForm, location: e.target.value })}
                  placeholder={t?.modal?.locationPlaceholder?.[language] || 'e.g., Kitchen, Bathroom'}
                  className="superellipse-xl"
                />
              </div>

              {/* Estimated Cost */}
              <div>
                <Label>{t?.modal?.estimatedCost?.[language] || 'Estimated cost'} ({t?.modal?.optional?.[language] || 'optional'})</Label>
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
                    className="superellipse-xl pl-10"
                  />
                </div>
              </div>

              {/* Photos */}
              <div>
                <Label>{t?.modal?.photos?.[language] || 'Photos'} (max 5)</Label>
                <div className="mt-2">
                  <label className="flex items-center justify-center gap-2 p-4 border-2 border-dashed border-gray-300 superellipse-xl hover:border-[var(--resident-400)] cursor-pointer transition-colors">
                    <Camera className="w-5 h-5 text-gray-400" />
                    <span className="text-sm text-gray-600">
                      {t?.modal?.addPhotos?.[language] || 'Click to add photos'}
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
                            className="w-20 h-20 superellipse-lg object-cover border-2 border-gray-200"
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
            <div className="flex gap-3 mt-6 pt-4 border-t border-gray-100">
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="flex-1">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowCreateModal(false);
                    resetForm();
                  }}
                  className="w-full superellipse-xl font-semibold border-2 border-gray-200 hover:border-[var(--resident-200)]"
                  disabled={isCreating}
                >
                  {t?.modal?.cancel?.[language] || 'Cancel'}
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="flex-1">
                <Button
                  onClick={handleCreateRequest}
                  disabled={isCreating || !createForm.title || !createForm.description}
                  className="w-full superellipse-xl font-semibold text-white border-none shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
                  style={{ background: 'var(--resident-primary)' }}
                >
                  {isCreating ? (
                    <>
                      <LoadingHouse size={20} className="mr-2" />
                      {t?.modal?.creating?.[language] || 'Creating...'}
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4 mr-2" />
                      {t?.modal?.submit?.[language] || 'Create request'}
                    </>
                  )}
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
