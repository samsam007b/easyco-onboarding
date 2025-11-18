'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { PageContainer } from '@/components/layout/PageContainer';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useApplications } from '@/lib/hooks/use-applications';
import { createClient } from '@/lib/auth/supabase-client';
import { useRole } from '@/lib/role/role-context';
import type { Application, GroupApplication } from '@/lib/hooks/use-applications';
import LoadingHouse from '@/components/ui/LoadingHouse';
import {
  CheckCircle,
  XCircle,
  Clock,
  Home,
  Mail,
  Phone,
  Briefcase,
  DollarSign,
  Calendar,
  MessageSquare,
  Eye,
  ThumbsUp,
  ThumbsDown,
  Users,
  Building2,
  Filter,
  CheckSquare,
  Send,
} from 'lucide-react';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { PromptDialog } from '@/components/ui/prompt-dialog';
import { Spinner } from '@/components/ui/spinner';

type ApplicationType = 'individual' | 'group';
type CombinedStatus = Application['status'] | GroupApplication['status'];

export default function OwnerApplicationsPage() {
  const router = useRouter();
  const { setActiveRole } = useRole();
  const [userId, setUserId] = useState<string | null>(null);
  const [profile, setProfile] = useState<any>(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const [groupApps, setGroupApps] = useState<GroupApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<'all' | CombinedStatus>('all');
  const [filterType, setFilterType] = useState<'all' | ApplicationType>('all');
  const [filterProperty, setFilterProperty] = useState<'all' | string>('all');
  const [filterDate, setFilterDate] = useState<'all' | '7days' | '30days' | '90days'>('all');
  const [selectedApplications, setSelectedApplications] = useState<Set<string>>(new Set());
  const [properties, setProperties] = useState<any[]>([]);

  // Dialog states
  const [approveDialogOpen, setApproveDialogOpen] = useState(false);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [selectedApplicationId, setSelectedApplicationId] = useState<string | null>(null);
  const [selectedApplicationType, setSelectedApplicationType] = useState<'individual' | 'group'>('individual');
  const [processingAction, setProcessingAction] = useState<string | null>(null);

  const {
    applications: hookApplications,
    groupApplications: hookGroupApplications,
    loadApplications,
    updateApplicationStatus,
    updateGroupApplicationStatus,
    isLoading: hookLoading
  } = useApplications(userId || undefined);

  useEffect(() => {
    const init = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        setUserId(user.id);
        setActiveRole('owner');

        // Load profile
        const { data: userData } = await supabase
          .from('users')
          .select('*')
          .eq('id', user.id)
          .single();

        const { data: profileData } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('user_id', user.id)
          .single();

        setProfile({
          full_name: userData?.full_name || user.email?.split('@')[0] || 'User',
          email: userData?.email || user.email || '',
          profile_data: profileData || {}
        });

        // Load owner properties
        const { data: propertiesData } = await supabase
          .from('properties')
          .select('id, title')
          .eq('owner_id', user.id)
          .order('created_at', { ascending: false });

        if (propertiesData) {
          setProperties(propertiesData);
        }

        await loadApplications(true); // true = as owner
      }

      setLoading(false);
    };

    init();
  }, []);

  useEffect(() => {
    if (hookApplications) {
      setApplications(hookApplications);
    }
    if (hookGroupApplications) {
      setGroupApps(hookGroupApplications);
    }
  }, [hookApplications, hookGroupApplications]);

  const loadApplicationsData = async () => {
    await loadApplications(true); // true = as owner
  };

  // Individual application handlers
  const handleApprove = async (applicationId: string) => {
    setSelectedApplicationId(applicationId);
    setSelectedApplicationType('individual');
    setApproveDialogOpen(true);
  };

  const confirmApprove = async () => {
    if (!selectedApplicationId) return;

    setProcessingAction(`approve-${selectedApplicationId}`);
    const success = await updateApplicationStatus(selectedApplicationId, 'approved');
    if (success) {
      toast.success('Application approved!');
      await loadApplicationsData();
    }
    setProcessingAction(null);
    setApproveDialogOpen(false);
    setSelectedApplicationId(null);
  };

  const handleReject = async (applicationId: string) => {
    setSelectedApplicationId(applicationId);
    setSelectedApplicationType('individual');
    setRejectDialogOpen(true);
  };

  const confirmReject = async (reason: string) => {
    if (!selectedApplicationId) return;

    setProcessingAction(`reject-${selectedApplicationId}`);
    const success = await updateApplicationStatus(
      selectedApplicationId,
      'rejected',
      reason || undefined
    );

    if (success) {
      toast.success('Application rejected');
      await loadApplicationsData();
    }
    setProcessingAction(null);
    setSelectedApplicationId(null);
  };

  const handleMarkReviewing = async (applicationId: string) => {
    const success = await updateApplicationStatus(applicationId, 'reviewing');
    if (success) {
      await loadApplicationsData();
    }
  };

  // Group application handlers
  const handleGroupApprove = async (groupApplicationId: string) => {
    setSelectedApplicationId(groupApplicationId);
    setSelectedApplicationType('group');
    setApproveDialogOpen(true);
  };

  const confirmGroupApprove = async () => {
    if (!selectedApplicationId) return;

    setProcessingAction(`approve-group-${selectedApplicationId}`);
    const success = await updateGroupApplicationStatus(selectedApplicationId, 'approved');
    if (success) {
      toast.success('Group application approved!');
      await loadApplicationsData();
    }
    setProcessingAction(null);
    setApproveDialogOpen(false);
    setSelectedApplicationId(null);
  };

  const handleGroupReject = async (groupApplicationId: string) => {
    setSelectedApplicationId(groupApplicationId);
    setSelectedApplicationType('group');
    setRejectDialogOpen(true);
  };

  const confirmGroupReject = async (reason: string) => {
    if (!selectedApplicationId) return;

    setProcessingAction(`reject-group-${selectedApplicationId}`);
    const success = await updateGroupApplicationStatus(
      selectedApplicationId,
      'rejected',
      reason || undefined
    );

    if (success) {
      toast.success('Group application rejected');
      await loadApplicationsData();
    }
    setProcessingAction(null);
    setSelectedApplicationId(null);
  };

  const handleGroupMarkReviewing = async (groupApplicationId: string) => {
    const success = await updateGroupApplicationStatus(groupApplicationId, 'reviewing');
    if (success) {
      await loadApplicationsData();
    }
  };

  const getStatusBadge = (status: CombinedStatus) => {
    const config = {
      pending: { variant: 'warning' as const, icon: Clock, label: 'Pending' },
      reviewing: { variant: 'default' as const, icon: Eye, label: 'Reviewing' },
      approved: { variant: 'success' as const, icon: CheckCircle, label: 'Approved' },
      rejected: { variant: 'default' as const, icon: XCircle, label: 'Rejected' },
      withdrawn: { variant: 'default' as const, icon: XCircle, label: 'Withdrawn' },
      expired: { variant: 'default' as const, icon: Clock, label: 'Expired' },
    };

    const { variant, icon: Icon, label } = config[status];
    return (
      <Badge variant={variant}>
        <Icon className="w-3 h-3 mr-1" />
        {label}
      </Badge>
    );
  };

  // Helper function for date filtering
  const isWithinDateRange = (dateStr: string | undefined) => {
    if (!dateStr || filterDate === 'all') return true;

    const appDate = new Date(dateStr);
    const now = new Date();
    const daysDiff = Math.floor((now.getTime() - appDate.getTime()) / (1000 * 60 * 60 * 24));

    if (filterDate === '7days') return daysDiff <= 7;
    if (filterDate === '30days') return daysDiff <= 30;
    if (filterDate === '90days') return daysDiff <= 90;
    return true;
  };

  // Filter applications with memoization for performance
  const filteredIndividualApps = useMemo(() => {
    return applications.filter((app) => {
      const statusMatch = filterStatus === 'all' || app.status === filterStatus;
      const typeMatch = filterType === 'all' || filterType === 'individual';
      const propertyMatch = filterProperty === 'all' || app.property_id === filterProperty;
      const dateMatch = isWithinDateRange(app.created_at);
      return statusMatch && typeMatch && propertyMatch && dateMatch;
    });
  }, [applications, filterStatus, filterType, filterProperty, filterDate]);

  const filteredGroupApps = useMemo(() => {
    return groupApps.filter((app) => {
      const statusMatch = filterStatus === 'all' || app.status === filterStatus;
      const typeMatch = filterType === 'all' || filterType === 'group';
      const propertyMatch = filterProperty === 'all' || app.property_id === filterProperty;
      const dateMatch = isWithinDateRange(app.created_at);
      return statusMatch && typeMatch && propertyMatch && dateMatch;
    });
  }, [groupApps, filterStatus, filterType, filterProperty, filterDate]);

  // Calculate stats
  const stats = {
    total: applications.length + groupApps.length,
    individual: applications.length,
    groups: groupApps.length,
    pending: applications.filter((a) => a.status === 'pending').length +
             groupApps.filter((a) => a.status === 'pending').length,
    reviewing: applications.filter((a) => a.status === 'reviewing').length +
               groupApps.filter((a) => a.status === 'reviewing').length,
    approved: applications.filter((a) => a.status === 'approved').length +
              groupApps.filter((a) => a.status === 'approved').length,
    rejected: applications.filter((a) => a.status === 'rejected').length +
              groupApps.filter((a) => a.status === 'rejected').length,
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50/30 via-white to-transparent">
        <div className="text-center">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-purple-200 rounded-full mx-auto mb-6"></div>
            <LoadingHouse size={80} />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Chargement des candidatures...</h3>
          <p className="text-gray-600">Préparation de vos données</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-900 to-purple-700 bg-clip-text text-transparent mb-2">
            Property Applications
          </h1>
          <p className="text-gray-600 text-lg">
            Manage individual and group applications for your properties
          </p>
        </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-7 gap-4 mb-6">
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow">
          <p className="text-sm text-gray-600 mb-1">Total</p>
          <p className="text-2xl font-bold text-purple-900">{stats.total}</p>
        </div>
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow">
          <p className="text-sm text-gray-600 mb-1">Individual</p>
          <p className="text-2xl font-bold text-blue-700">{stats.individual}</p>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow">
          <p className="text-sm text-gray-600 mb-1">Groups</p>
          <p className="text-2xl font-bold text-purple-700">{stats.groups}</p>
        </div>
        <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow">
          <p className="text-sm text-gray-600 mb-1">Pending</p>
          <p className="text-2xl font-bold text-orange-700">{stats.pending}</p>
        </div>
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow">
          <p className="text-sm text-gray-600 mb-1">Reviewing</p>
          <p className="text-2xl font-bold text-blue-700">{stats.reviewing}</p>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow">
          <p className="text-sm text-gray-600 mb-1">Approved</p>
          <p className="text-2xl font-bold text-green-700">{stats.approved}</p>
        </div>
        <div className="bg-gradient-to-br from-red-50 to-red-100 p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow">
          <p className="text-sm text-gray-600 mb-1">Rejected</p>
          <p className="text-2xl font-bold text-red-700">{stats.rejected}</p>
        </div>
      </div>

      {/* Type Filters */}
      <div className="flex gap-2 mb-4">
        <Button
          variant={filterType === 'all' ? 'default' : 'outline'}
          onClick={() => setFilterType('all')}
          size="sm"
          className={filterType === 'all' ? 'bg-purple-600 hover:bg-purple-700' : ''}
        >
          All Types ({stats.total})
        </Button>
        <Button
          variant={filterType === 'individual' ? 'default' : 'outline'}
          onClick={() => setFilterType('individual')}
          size="sm"
          className={filterType === 'individual' ? 'bg-purple-600 hover:bg-purple-700' : ''}
        >
          Individual ({stats.individual})
        </Button>
        <Button
          variant={filterType === 'group' ? 'default' : 'outline'}
          onClick={() => setFilterType('group')}
          size="sm"
          className={filterType === 'group' ? 'bg-purple-600 hover:bg-purple-700' : ''}
        >
          <Users className="w-4 h-4 mr-1" />
          Groups ({stats.groups})
        </Button>
      </div>

      {/* Status Filters */}
      <div className="flex gap-2 mb-4 overflow-x-auto">
        <Button
          variant={filterStatus === 'all' ? 'default' : 'outline'}
          onClick={() => setFilterStatus('all')}
          size="sm"
          className={filterStatus === 'all' ? 'bg-purple-600 hover:bg-purple-700' : ''}
        >
          All Status
        </Button>
        <Button
          variant={filterStatus === 'pending' ? 'default' : 'outline'}
          onClick={() => setFilterStatus('pending')}
          size="sm"
          className={filterStatus === 'pending' ? 'bg-purple-600 hover:bg-purple-700' : ''}
        >
          Pending ({stats.pending})
        </Button>
        <Button
          variant={filterStatus === 'reviewing' ? 'default' : 'outline'}
          onClick={() => setFilterStatus('reviewing')}
          size="sm"
          className={filterStatus === 'reviewing' ? 'bg-purple-600 hover:bg-purple-700' : ''}
        >
          Reviewing ({stats.reviewing})
        </Button>
        <Button
          variant={filterStatus === 'approved' ? 'default' : 'outline'}
          onClick={() => setFilterStatus('approved')}
          size="sm"
          className={filterStatus === 'approved' ? 'bg-purple-600 hover:bg-purple-700' : ''}
        >
          Approved ({stats.approved})
        </Button>
        <Button
          variant={filterStatus === 'rejected' ? 'default' : 'outline'}
          onClick={() => setFilterStatus('rejected')}
          size="sm"
          className={filterStatus === 'rejected' ? 'bg-purple-600 hover:bg-purple-700' : ''}
        >
          Rejected ({stats.rejected})
        </Button>
      </div>

      {/* Additional Filters Row */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        {/* Property Filter */}
        <div className="flex-1">
          <label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
            <Building2 className="w-4 h-4" />
            Filter by Property
          </label>
          <select
            value={filterProperty}
            onChange={(e) => setFilterProperty(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="all">All Properties</option>
            {properties.map((property) => (
              <option key={property.id} value={property.id}>
                {property.title}
              </option>
            ))}
          </select>
        </div>

        {/* Date Filter */}
        <div className="flex-1">
          <label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Filter by Date
          </label>
          <select
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value as any)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="all">All Time</option>
            <option value="7days">Last 7 Days</option>
            <option value="30days">Last 30 Days</option>
            <option value="90days">Last 90 Days</option>
          </select>
        </div>

        {/* Selection Count & Bulk Actions */}
        {selectedApplications.size > 0 && (
          <div className="flex-1 flex items-end gap-2">
            <Button
              variant="default"
              size="sm"
              onClick={() => {
                const selectedArray = Array.from(selectedApplications);
                // Bulk approve logic
                toast.promise(
                  Promise.all(selectedArray.map(id => {
                    const isGroup = id.startsWith('group-');
                    const actualId = isGroup ? id.replace('group-', '') : id;
                    return isGroup
                      ? updateGroupApplicationStatus(actualId, 'approved')
                      : updateApplicationStatus(actualId, 'approved');
                  })),
                  {
                    loading: `Approving ${selectedArray.length} applications...`,
                    success: () => {
                      setSelectedApplications(new Set());
                      loadApplicationsData();
                      return `${selectedArray.length} applications approved`;
                    },
                    error: 'Failed to approve applications',
                  }
                );
              }}
              className="flex items-center gap-2"
            >
              <CheckSquare className="w-4 h-4" />
              Approve ({selectedApplications.size})
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelectedApplications(new Set())}
            >
              Clear Selection
            </Button>
          </div>
        )}
      </div>

      {/* Applications List */}
      {filteredIndividualApps.length === 0 && filteredGroupApps.length === 0 ? (
        <div className="relative overflow-hidden bg-gradient-to-br from-purple-50 via-white to-purple-50/30 rounded-3xl p-12 text-center">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-purple-200/20 to-purple-400/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-br from-purple-300/10 to-purple-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

          <div className="relative z-10">
            <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-700 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl">
              <Home className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              Aucune candidature trouvée
            </h3>
            <p className="text-gray-600 mb-4 max-w-md mx-auto text-lg">
              Essayez de modifier vos filtres ou attendez de nouvelles candidatures
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Group Applications */}
          {filteredGroupApps.map((groupApp) => (
            <Card key={`group-${groupApp.id}`} className="hover:shadow-md transition-shadow border-l-4 border-l-purple-500">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  {/* Checkbox for bulk selection */}
                  <div className="flex items-start pt-1">
                    <input
                      type="checkbox"
                      checked={selectedApplications.has(`group-${groupApp.id}`)}
                      onChange={(e) => {
                        const newSet = new Set(selectedApplications);
                        if (e.target.checked) {
                          newSet.add(`group-${groupApp.id}`);
                        } else {
                          newSet.delete(`group-${groupApp.id}`);
                        }
                        setSelectedApplications(newSet);
                      }}
                      className="w-5 h-5 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                    />
                  </div>

                  {/* Left: Group Info */}
                  <div className="flex-1">
                    <div className="flex items-start gap-3 mb-3">
                      <Users className="w-6 h-6 text-purple-600 mt-1" />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {groupApp.group?.name || 'Group Application'}
                          </h3>
                          <Badge variant="default" className="bg-purple-50 text-purple-700 border-purple-200">
                            <Users className="w-3 h-3 mr-1" />
                            GROUP
                          </Badge>
                          {getStatusBadge(groupApp.status)}
                        </div>
                        <p className="text-sm text-gray-600 mb-2">
                          Applied for: <span className="font-medium">{groupApp.property?.title || 'Property'}</span>
                        </p>
                      </div>
                    </div>

                    {/* Group Members */}
                    {groupApp.group && (
                      <div className="mb-3 p-3 bg-purple-50 rounded-lg">
                        <p className="text-sm font-medium text-gray-700 mb-2">
                          Group Members ({groupApp.group.members?.length || 0}/{groupApp.group.max_members}):
                        </p>
                        <div className="space-y-1">
                          {groupApp.group.members?.map((member, idx) => (
                            <div key={idx} className="flex items-center gap-2 text-sm text-gray-600">
                              <div className="w-6 h-6 rounded-full bg-purple-200 flex items-center justify-center text-xs font-medium">
                                {member.user.full_name?.charAt(0).toUpperCase() || '?'}
                              </div>
                              <span>{member.user.full_name}</span>
                              <span className="text-gray-400">•</span>
                              <span className="text-gray-500">{member.user.email}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                      {groupApp.combined_income && (
                        <div className="flex items-center gap-2 text-gray-700">
                          <DollarSign className="w-4 h-4 text-gray-500" />
                          <span>Combined Income: €{groupApp.combined_income.toLocaleString()}/month</span>
                        </div>
                      )}
                    </div>

                    {groupApp.message && (
                      <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-2 mb-1">
                          <MessageSquare className="w-4 h-4 text-gray-500" />
                          <span className="text-sm font-medium text-gray-700">Message:</span>
                        </div>
                        <p className="text-sm text-gray-600">{groupApp.message}</p>
                      </div>
                    )}

                    <p className="text-xs text-gray-500 mt-3">
                      Applied {new Date(groupApp.created_at).toLocaleDateString()} at{' '}
                      {new Date(groupApp.created_at).toLocaleTimeString()}
                    </p>
                  </div>

                  {/* Right: Actions */}
                  <div className="flex md:flex-col gap-2">
                    {groupApp.status === 'pending' && (
                      <>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleGroupMarkReviewing(groupApp.id)}
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          Mark Reviewing
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleGroupApprove(groupApp.id)}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <ThumbsUp className="w-4 h-4 mr-1" />
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleGroupReject(groupApp.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <ThumbsDown className="w-4 h-4 mr-1" />
                          Reject
                        </Button>
                      </>
                    )}

                    {groupApp.status === 'reviewing' && (
                      <>
                        <Button
                          size="sm"
                          onClick={() => handleGroupApprove(groupApp.id)}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <ThumbsUp className="w-4 h-4 mr-1" />
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleGroupReject(groupApp.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <ThumbsDown className="w-4 h-4 mr-1" />
                          Reject
                        </Button>
                      </>
                    )}

                    {(groupApp.status === 'approved' || groupApp.status === 'rejected') && (
                      <div className="text-sm text-gray-600 text-center md:text-right">
                        {groupApp.status === 'approved' ? (
                          <div className="text-green-600 font-medium">
                            <CheckCircle className="w-5 h-5 mx-auto mb-1" />
                            Approved
                          </div>
                        ) : (
                          <div className="text-red-600 font-medium">
                            <XCircle className="w-5 h-5 mx-auto mb-1" />
                            Rejected
                          </div>
                        )}
                        {groupApp.reviewed_at && (
                          <p className="text-xs mt-1">
                            {new Date(groupApp.reviewed_at).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Individual Applications */}
          {filteredIndividualApps.map((application) => (
            <Card key={`individual-${application.id}`} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  {/* Checkbox for bulk selection */}
                  <div className="flex items-start pt-1">
                    <input
                      type="checkbox"
                      checked={selectedApplications.has(application.id)}
                      onChange={(e) => {
                        const newSet = new Set(selectedApplications);
                        if (e.target.checked) {
                          newSet.add(application.id);
                        } else {
                          newSet.delete(application.id);
                        }
                        setSelectedApplications(newSet);
                      }}
                      className="w-5 h-5 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                    />
                  </div>

                  {/* Left: Application Info */}
                  <div className="flex-1">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {application.applicant_name}
                          </h3>
                          {getStatusBadge(application.status)}
                        </div>
                        <p className="text-sm text-gray-600 mb-2">
                          Applied for: <span className="font-medium">{application.property?.title || 'Property'}</span>
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                      <div className="flex items-center gap-2 text-gray-700">
                        <Mail className="w-4 h-4 text-gray-500" />
                        <span>{application.applicant_email}</span>
                      </div>

                      {application.applicant_phone && (
                        <div className="flex items-center gap-2 text-gray-700">
                          <Phone className="w-4 h-4 text-gray-500" />
                          <span>{application.applicant_phone}</span>
                        </div>
                      )}

                      {application.occupation && (
                        <div className="flex items-center gap-2 text-gray-700">
                          <Briefcase className="w-4 h-4 text-gray-500" />
                          <span>{application.occupation}</span>
                        </div>
                      )}

                      {application.monthly_income && (
                        <div className="flex items-center gap-2 text-gray-700">
                          <DollarSign className="w-4 h-4 text-gray-500" />
                          <span>€{application.monthly_income.toLocaleString()}/month</span>
                        </div>
                      )}

                      {application.desired_move_in_date && (
                        <div className="flex items-center gap-2 text-gray-700">
                          <Calendar className="w-4 h-4 text-gray-500" />
                          <span>Move-in: {new Date(application.desired_move_in_date).toLocaleDateString()}</span>
                        </div>
                      )}

                      {application.lease_duration_months && (
                        <div className="flex items-center gap-2 text-gray-700">
                          <Clock className="w-4 h-4 text-gray-500" />
                          <span>{application.lease_duration_months} months lease</span>
                        </div>
                      )}
                    </div>

                    {application.message && (
                      <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-2 mb-1">
                          <MessageSquare className="w-4 h-4 text-gray-500" />
                          <span className="text-sm font-medium text-gray-700">Message:</span>
                        </div>
                        <p className="text-sm text-gray-600">{application.message}</p>
                      </div>
                    )}

                    <p className="text-xs text-gray-500 mt-3">
                      Applied {new Date(application.created_at).toLocaleDateString()} at{' '}
                      {new Date(application.created_at).toLocaleTimeString()}
                    </p>
                  </div>

                  {/* Right: Actions */}
                  <div className="flex md:flex-col gap-2">
                    {application.status === 'pending' && (
                      <>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleMarkReviewing(application.id)}
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          Mark Reviewing
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleApprove(application.id)}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <ThumbsUp className="w-4 h-4 mr-1" />
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleReject(application.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <ThumbsDown className="w-4 h-4 mr-1" />
                          Reject
                        </Button>
                      </>
                    )}

                    {application.status === 'reviewing' && (
                      <>
                        <Button
                          size="sm"
                          onClick={() => handleApprove(application.id)}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <ThumbsUp className="w-4 h-4 mr-1" />
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleReject(application.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <ThumbsDown className="w-4 h-4 mr-1" />
                          Reject
                        </Button>
                      </>
                    )}

                    {(application.status === 'approved' || application.status === 'rejected') && (
                      <div className="text-sm text-gray-600 text-center md:text-right">
                        {application.status === 'approved' ? (
                          <div className="text-green-600 font-medium">
                            <CheckCircle className="w-5 h-5 mx-auto mb-1" />
                            Approved
                          </div>
                        ) : (
                          <div className="text-red-600 font-medium">
                            <XCircle className="w-5 h-5 mx-auto mb-1" />
                            Rejected
                          </div>
                        )}
                        {application.reviewed_at && (
                          <p className="text-xs mt-1">
                            {new Date(application.reviewed_at).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Approve Confirmation Dialog */}
      <AlertDialog open={approveDialogOpen} onOpenChange={setApproveDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Approve Application</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to approve this {selectedApplicationType === 'group' ? 'group' : 'individual'} application?
              This action will notify the applicant(s) and mark the application as approved.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => setSelectedApplicationId(null)}
              disabled={processingAction !== null}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={selectedApplicationType === 'group' ? confirmGroupApprove : confirmApprove}
              className="bg-green-600 hover:bg-green-700"
              disabled={processingAction !== null}
            >
              {processingAction !== null ? (
                <>
                  <Spinner size="sm" className="mr-2" />
                  Approving...
                </>
              ) : (
                'Approve'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Reject Prompt Dialog */}
      <PromptDialog
        open={rejectDialogOpen}
        onOpenChange={setRejectDialogOpen}
        title="Reject Application"
        description={`Provide a reason for rejecting this ${selectedApplicationType === 'group' ? 'group' : 'individual'} application. This will be sent to the applicant(s).`}
        label="Rejection Reason"
        placeholder="Enter reason for rejection..."
        multiline
        required={false}
        onConfirm={selectedApplicationType === 'group' ? confirmGroupReject : confirmReject}
        onCancel={() => setSelectedApplicationId(null)}
        confirmText="Reject"
        cancelText="Cancel"
      />
      </div>
    </div>
  );
}
