'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { PageContainer } from '@/components/layout/PageContainer';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useApplications } from '@/lib/hooks/use-applications';
import { createClient } from '@/lib/auth/supabase-client';
import type { Application } from '@/lib/hooks/use-applications';
import {
  CheckCircle,
  XCircle,
  Clock,
  Home,
  MapPin,
  Euro,
  Calendar,
  MessageSquare,
  Eye,
  Trash2,
} from 'lucide-react';
import { toast } from 'sonner';

export default function MyApplicationsPage() {
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<'all' | Application['status']>('all');

  const { applications: hookApplications, loadApplications, withdrawApplication, deleteApplication, isLoading: hookLoading } = useApplications(userId || undefined);

  useEffect(() => {
    const init = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        setUserId(user.id);
        await loadApplications(false); // false = as applicant
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
    await loadApplications(false); // false = as applicant
  };

  const handleWithdraw = async (applicationId: string) => {
    if (!confirm('Are you sure you want to withdraw this application?')) {
      return;
    }

    const success = await withdrawApplication(applicationId);
    if (success) {
      toast.success('Application withdrawn');
      await loadApplicationsData();
    }
  };

  const handleDelete = async (applicationId: string) => {
    if (!confirm('Are you sure you want to delete this application from your history?')) {
      return;
    }

    const success = await deleteApplication(applicationId);
    if (success) {
      toast.success('Application deleted');
      await loadApplicationsData();
    }
  };

  const getStatusBadge = (status: Application['status']) => {
    const config = {
      pending: { variant: 'warning' as const, icon: Clock, label: 'Pending Review' },
      reviewing: { variant: 'default' as const, icon: Eye, label: 'Under Review' },
      approved: { variant: 'success' as const, icon: CheckCircle, label: 'Approved' },
      rejected: { variant: 'default' as const, icon: XCircle, label: 'Not Accepted' },
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
    pending: applications.filter((a) => a.status === 'pending' || a.status === 'reviewing').length,
    approved: applications.filter((a) => a.status === 'approved').length,
    rejected: applications.filter((a) => a.status === 'rejected').length,
  };

  if (loading) {
    return (
      <PageContainer>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#4A148C]"></div>
            <p className="mt-4 text-gray-600">Loading your applications...</p>
          </div>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <PageHeader
        title="My Applications"
        description="Track your property applications"
      />

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
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
          variant={filterStatus === 'pending' || filterStatus === 'reviewing' ? 'default' : 'outline'}
          onClick={() => setFilterStatus('pending')}
          size="sm"
        >
          Pending ({stats.pending})
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
            <p className="text-gray-600 mb-4">
              {filterStatus === 'all'
                ? 'Start browsing properties and apply to the ones you like'
                : 'Try selecting a different filter'}
            </p>
            {filterStatus === 'all' && (
              <Button onClick={() => router.push('/properties/browse')}>
                Browse Properties
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredApplications.map((application) => (
            <Card key={application.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  {/* Left: Property Info */}
                  <div className="flex-1">
                    <div className="flex items-start gap-3 mb-3">
                      {/* Property Image Placeholder */}
                      <div
                        className="w-24 h-24 bg-gray-200 rounded-lg flex-shrink-0 cursor-pointer hover:opacity-80 transition-opacity"
                        onClick={() =>
                          application.property?.id && router.push(`/properties/${application.property.id}`)
                        }
                      >
                        {application.property?.main_image ? (
                          <img
                            src={application.property.main_image}
                            alt={application.property.title || 'Property'}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Home className="w-8 h-8 text-gray-400" />
                          </div>
                        )}
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3
                            className="text-lg font-semibold text-gray-900 hover:text-[#4A148C] cursor-pointer"
                            onClick={() =>
                              application.property?.id && router.push(`/properties/${application.property.id}`)
                            }
                          >
                            {application.property?.title || 'Property'}
                          </h3>
                          {getStatusBadge(application.status)}
                        </div>

                        {application.property && (
                          <div className="space-y-1 text-sm">
                            <div className="flex items-center gap-2 text-gray-600">
                              <MapPin className="w-4 h-4" />
                              <span>
                                {application.property.city}, {application.property.postal_code}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-700">
                              <Euro className="w-4 h-4" />
                              <span className="font-semibold">
                                €{application.property.monthly_rent.toLocaleString()}/month
                              </span>
                            </div>
                          </div>
                        )}

                        {application.desired_move_in_date && (
                          <div className="flex items-center gap-2 text-sm text-gray-600 mt-2">
                            <Calendar className="w-4 h-4" />
                            <span>
                              Move-in: {new Date(application.desired_move_in_date).toLocaleDateString()}
                            </span>
                          </div>
                        )}

                        {application.message && (
                          <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center gap-2 mb-1">
                              <MessageSquare className="w-4 h-4 text-gray-500" />
                              <span className="text-sm font-medium text-gray-700">Your message:</span>
                            </div>
                            <p className="text-sm text-gray-600 line-clamp-2">{application.message}</p>
                          </div>
                        )}

                        <p className="text-xs text-gray-500 mt-3">
                          Applied on {new Date(application.created_at).toLocaleDateString()}
                        </p>

                        {/* Approval/Rejection Message */}
                        {application.status === 'approved' && (
                          <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                            <div className="flex items-center gap-2">
                              <CheckCircle className="w-5 h-5 text-green-600" />
                              <p className="text-sm font-medium text-green-800">
                                Congratulations! Your application has been approved.
                              </p>
                            </div>
                            {application.reviewed_at && (
                              <p className="text-xs text-green-700 mt-1">
                                Approved on {new Date(application.reviewed_at).toLocaleDateString()}
                              </p>
                            )}
                          </div>
                        )}

                        {application.status === 'rejected' && (
                          <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                            <div className="flex items-center gap-2">
                              <XCircle className="w-5 h-5 text-red-600" />
                              <p className="text-sm font-medium text-red-800">
                                Your application was not accepted.
                              </p>
                            </div>
                            {application.rejection_reason && (
                              <p className="text-sm text-red-700 mt-2">
                                Reason: {application.rejection_reason}
                              </p>
                            )}
                            {application.reviewed_at && (
                              <p className="text-xs text-red-700 mt-1">
                                Reviewed on {new Date(application.reviewed_at).toLocaleDateString()}
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right: Actions */}
                  <div className="flex md:flex-col gap-2">
                    {application.property?.id && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => router.push(`/properties/${application.property.id}`)}
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        View Property
                      </Button>
                    )}

                    {(application.status === 'pending' || application.status === 'reviewing') && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleWithdraw(application.id)}
                        className="text-orange-600 hover:text-orange-700"
                      >
                        <XCircle className="w-4 h-4 mr-1" />
                        Withdraw
                      </Button>
                    )}

                    {(application.status === 'rejected' || application.status === 'withdrawn') && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(application.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4 mr-1" />
                        Delete
                      </Button>
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
