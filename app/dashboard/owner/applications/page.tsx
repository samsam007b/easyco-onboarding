'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { PageContainer } from '@/components/layout/PageContainer';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useApplications } from '@/lib/hooks/use-applications';
import { createClient } from '@/lib/auth/supabase-client';
import type { Application } from '@/lib/hooks/use-applications';
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
} from 'lucide-react';
import { toast } from 'sonner';

export default function OwnerApplicationsPage() {
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [filterStatus, setFilterStatus] = useState<'all' | Application['status']>('all');

  const { applications: hookApplications, loadApplications, updateApplicationStatus, isLoading: hookLoading } = useApplications(userId || undefined);

  useEffect(() => {
    const init = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        setUserId(user.id);
        await loadApplications(true); // true = as owner
      }

      setLoading(false);
    };

    init();
  }, []);

  useEffect(() => {
    // Update local applications state when hook applications change
    if (hookApplications) {
      setApplications(hookApplications);
    }
  }, [hookApplications]);

  const loadApplicationsData = async () => {
    await loadApplications(true); // true = as owner
  };

  const handleApprove = async (applicationId: string) => {
    if (!confirm('Are you sure you want to approve this application?')) {
      return;
    }

    const success = await updateApplicationStatus(applicationId, 'approved');
    if (success) {
      toast.success('Application approved!');
      await loadApplicationsData();
      setSelectedApplication(null);
    }
  };

  const handleReject = async (applicationId: string) => {
    const reason = prompt('Please provide a reason for rejection (optional):');

    const success = await updateApplicationStatus(
      applicationId,
      'rejected',
      reason || undefined
    );

    if (success) {
      toast.success('Application rejected');
      await loadApplicationsData();
      setSelectedApplication(null);
    }
  };

  const handleMarkReviewing = async (applicationId: string) => {
    const success = await updateApplicationStatus(applicationId, 'reviewing');
    if (success && userId) {
      await loadApplicationsData(userId);
    }
  };

  const getStatusBadge = (status: Application['status']) => {
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

  const filteredApplications = applications.filter((app) =>
    filterStatus === 'all' ? true : app.status === filterStatus
  );

  const stats = {
    total: applications.length,
    pending: applications.filter((a) => a.status === 'pending').length,
    reviewing: applications.filter((a) => a.status === 'reviewing').length,
    approved: applications.filter((a) => a.status === 'approved').length,
    rejected: applications.filter((a) => a.status === 'rejected').length,
  };

  if (loading) {
    return (
      <PageContainer>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#4A148C]"></div>
            <p className="mt-4 text-gray-600">Loading applications...</p>
          </div>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <PageHeader
        title="Property Applications"
        description="Manage applications for your properties"
      />

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-gray-600">Total</p>
            <p className="text-2xl font-bold text-[#4A148C]">{stats.total}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-gray-600">Pending</p>
            <p className="text-2xl font-bold text-orange-600">{stats.pending}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-gray-600">Reviewing</p>
            <p className="text-2xl font-bold text-blue-600">{stats.reviewing}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-gray-600">Approved</p>
            <p className="text-2xl font-bold text-green-600">{stats.approved}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-gray-600">Rejected</p>
            <p className="text-2xl font-bold text-red-600">{stats.rejected}</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-6 overflow-x-auto">
        <Button
          variant={filterStatus === 'all' ? 'default' : 'outline'}
          onClick={() => setFilterStatus('all')}
          size="sm"
        >
          All ({stats.total})
        </Button>
        <Button
          variant={filterStatus === 'pending' ? 'default' : 'outline'}
          onClick={() => setFilterStatus('pending')}
          size="sm"
        >
          Pending ({stats.pending})
        </Button>
        <Button
          variant={filterStatus === 'reviewing' ? 'default' : 'outline'}
          onClick={() => setFilterStatus('reviewing')}
          size="sm"
        >
          Reviewing ({stats.reviewing})
        </Button>
        <Button
          variant={filterStatus === 'approved' ? 'default' : 'outline'}
          onClick={() => setFilterStatus('approved')}
          size="sm"
        >
          Approved ({stats.approved})
        </Button>
        <Button
          variant={filterStatus === 'rejected' ? 'default' : 'outline'}
          onClick={() => setFilterStatus('rejected')}
          size="sm"
        >
          Rejected ({stats.rejected})
        </Button>
      </div>

      {/* Applications List */}
      {filteredApplications.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Home className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {filterStatus === 'all' ? 'No applications yet' : `No ${filterStatus} applications`}
            </h3>
            <p className="text-gray-600">
              {filterStatus === 'all'
                ? 'Applications for your properties will appear here'
                : 'Try selecting a different filter'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredApplications.map((application) => (
            <Card key={application.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
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
    </PageContainer>
  );
}
