'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { createClient } from '@/lib/auth/supabase-client';
import {
  Users,
  FileText,
  Wrench,
  Activity,
  TrendingUp,
  RefreshCw,
  Clock,
  DollarSign,
  AlertTriangle,
  CheckCircle,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

import {
  OwnerPageHeader,
  OwnerKPICard,
  OwnerKPIGrid,
  OwnerNavigationCard,
  OwnerNavigationGrid,
} from '@/components/owner';
import { ownerGradient, ownerGradientLight, ownerPageBackground, healthColors, semanticColors } from '@/lib/constants/owner-theme';
import { gestionService, type GestionOverview, type UrgentAction, type ActivityItem } from '@/lib/services/gestion-service';
import LoadingHouse from '@/components/ui/LoadingHouse';

export default function GestionHubPage() {
  const router = useRouter();
  const supabase = createClient();

  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [overview, setOverview] = useState<GestionOverview | null>(null);
  const [urgentActions, setUrgentActions] = useState<UrgentAction[]>([]);
  const [recentActivity, setRecentActivity] = useState<ActivityItem[]>([]);

  const loadData = useCallback(async (refresh = false) => {
    if (refresh) setIsRefreshing(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }
      setUserId(user.id);

      // Fetch all data in parallel
      const [overviewData, actionsData, activityData] = await Promise.all([
        gestionService.getGestionOverview(user.id),
        gestionService.getUrgentActions(user.id),
        gestionService.getRecentActivity(user.id),
      ]);

      setOverview(overviewData);
      setUrgentActions(actionsData);
      setRecentActivity(activityData);
    } catch (error) {
      console.error('Failed to load gestion data:', error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [supabase, router]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Health score color
  const getHealthColor = (score: number) => {
    if (score >= 80) return healthColors.excellent;
    if (score >= 50) return healthColors.attention;
    return healthColors.critical;
  };

  if (isLoading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: ownerGradientLight }}
      >
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <LoadingHouse size={80} />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Chargement...
          </h3>
          <p className="text-gray-600">Préparation de votre tableau de bord</p>
        </div>
      </div>
    );
  }

  const healthStyle = overview ? getHealthColor(overview.healthScore) : healthColors.excellent;

  return (
    <div className="min-h-screen" style={{ background: ownerPageBackground }}>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-8">
        {/* Header */}
        <OwnerPageHeader
          icon={Activity}
          title="Gestion Opérationnelle"
          subtitle="Pilotez votre portefeuille au quotidien"
          breadcrumb={{ label: 'Command Center', href: '/dashboard/owner' }}
          currentPage="Gestion"
          actions={
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
          }
        />

        {/* KPIs Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mt-6"
        >
          <OwnerKPIGrid columns={4}>
            <OwnerKPICard
              title="Locataires"
              value={overview?.tenants.active || 0}
              icon={Users}
              variant="primary"
              subtext={overview?.tenants.newThisMonth ? `+${overview.tenants.newThisMonth} ce mois` : undefined}
              onClick={() => router.push('/dashboard/owner/tenants')}
            />
            <OwnerKPICard
              title="Baux actifs"
              value={overview?.leases.active || 0}
              icon={FileText}
              variant={overview?.leases.expiringSoon ? 'warning' : 'success'}
              badge={
                overview?.leases.expiringSoon
                  ? { label: `${overview.leases.expiringSoon} à renouveler`, variant: 'warning' }
                  : undefined
              }
              onClick={() => router.push('/dashboard/owner/leases')}
            />
            <OwnerKPICard
              title="Tickets ouverts"
              value={(overview?.maintenance.open || 0) + (overview?.maintenance.inProgress || 0)}
              icon={Wrench}
              variant={overview?.maintenance.urgent ? 'danger' : 'info'}
              badge={
                overview?.maintenance.urgent
                  ? { label: `${overview.maintenance.urgent} urgent${overview.maintenance.urgent > 1 ? 's' : ''}`, variant: 'danger' }
                  : undefined
              }
              onClick={() => router.push('/dashboard/owner/maintenance')}
            />
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="relative overflow-hidden rounded-2xl p-5 border-2 cursor-pointer"
              style={{
                background: healthStyle.bg,
                borderColor: healthStyle.border,
              }}
            >
              <div className="relative flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-2">Santé globale</p>
                  <p className="text-3xl font-bold" style={{ color: healthStyle.text }}>
                    {overview?.healthScore || 100}%
                  </p>
                  <p className="text-sm mt-2" style={{ color: healthStyle.text }}>
                    {overview?.healthScore && overview.healthScore >= 80
                      ? 'Excellent'
                      : overview?.healthScore && overview.healthScore >= 50
                      ? 'Attention requise'
                      : 'Action urgente'}
                  </p>
                </div>
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{ background: healthStyle.gradient }}
                >
                  {overview?.healthScore && overview.healthScore >= 80 ? (
                    <CheckCircle className="w-6 h-6 text-white" />
                  ) : (
                    <AlertTriangle className="w-6 h-6 text-white" />
                  )}
                </div>
              </div>
            </motion.div>
          </OwnerKPIGrid>
        </motion.div>

        {/* Urgent Actions & Navigation */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Urgent Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2"
          >
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200 shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5" style={{ color: '#c2566b' }} />
                  Actions urgentes
                </h2>
                {urgentActions.length > 3 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-sm"
                    style={{ color: '#9c5698' }}
                  >
                    Voir tout ({urgentActions.length})
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                )}
              </div>

              {urgentActions.length === 0 ? (
                <div className="text-center py-8">
                  <div
                    className="w-16 h-16 mx-auto rounded-2xl flex items-center justify-center mb-4"
                    style={{ background: semanticColors.success.gradient }}
                  >
                    <CheckCircle className="w-8 h-8 text-white" />
                  </div>
                  <p className="text-gray-600">Aucune action urgente</p>
                  <p className="text-sm text-gray-500 mt-1">Tout est sous contrôle !</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {urgentActions.slice(0, 4).map((action, index) => (
                    <motion.div
                      key={action.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      onClick={() => router.push(action.href)}
                      className={cn(
                        'flex items-center gap-4 p-4 rounded-xl cursor-pointer transition-all',
                        'hover:shadow-md',
                        action.severity === 'critical'
                          ? 'bg-red-50 border border-red-200 hover:border-red-300'
                          : action.severity === 'warning'
                          ? 'bg-amber-50 border border-amber-200 hover:border-amber-300'
                          : 'bg-blue-50 border border-blue-200 hover:border-blue-300'
                      )}
                    >
                      <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{
                          background:
                            action.severity === 'critical'
                              ? semanticColors.danger.gradient
                              : action.severity === 'warning'
                              ? semanticColors.warning.gradient
                              : semanticColors.info.gradient,
                        }}
                      >
                        {action.type === 'payment_overdue' && <DollarSign className="w-5 h-5 text-white" />}
                        {action.type === 'lease_expiring' && <FileText className="w-5 h-5 text-white" />}
                        {action.type === 'maintenance_urgent' && <Wrench className="w-5 h-5 text-white" />}
                        {action.type === 'tenant_leaving' && <Users className="w-5 h-5 text-white" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p
                          className={cn(
                            'font-semibold truncate',
                            action.severity === 'critical'
                              ? 'text-red-800'
                              : action.severity === 'warning'
                              ? 'text-amber-800'
                              : 'text-blue-800'
                          )}
                        >
                          {action.title}
                        </p>
                        <p
                          className={cn(
                            'text-sm truncate',
                            action.severity === 'critical'
                              ? 'text-red-600'
                              : action.severity === 'warning'
                              ? 'text-amber-600'
                              : 'text-blue-600'
                          )}
                        >
                          {action.description}
                          {action.propertyName && ` • ${action.propertyName}`}
                        </p>
                      </div>
                      <ArrowRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>

          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200 shadow-sm p-6 h-full">
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-4">
                <Clock className="w-5 h-5" style={{ color: '#9c5698' }} />
                Activité récente
              </h2>

              {recentActivity.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500 text-sm">Aucune activité récente</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentActivity.slice(0, 5).map((activity, index) => (
                    <motion.div
                      key={activity.id}
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex items-start gap-3"
                    >
                      <div
                        className={cn(
                          'w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0',
                          activity.type === 'payment' && 'bg-emerald-100',
                          activity.type === 'maintenance' && 'bg-blue-100',
                          activity.type === 'lease' && 'bg-purple-100',
                          activity.type === 'tenant' && 'bg-pink-100'
                        )}
                      >
                        {activity.type === 'payment' && <DollarSign className="w-4 h-4 text-emerald-600" />}
                        {activity.type === 'maintenance' && <Wrench className="w-4 h-4 text-blue-600" />}
                        {activity.type === 'lease' && <FileText className="w-4 h-4 text-purple-600" />}
                        {activity.type === 'tenant' && <Users className="w-4 h-4 text-pink-600" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                        <p className="text-xs text-gray-500 truncate">
                          {activity.description}
                          {activity.propertyName && ` • ${activity.propertyName}`}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true, locale: fr })}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Navigation Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8"
        >
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Sparkles className="w-5 h-5" style={{ color: '#9c5698' }} />
            Accès rapide
          </h2>

          <OwnerNavigationGrid>
            <OwnerNavigationCard
              title="Locataires"
              description="Gérez les relations avec vos locataires"
              icon={Users}
              href="/dashboard/owner/tenants"
              stats={[
                { label: 'actifs', value: overview?.tenants.active || 0 },
                ...(overview?.tenants.withIssues
                  ? [{ label: 'à suivre', value: overview.tenants.withIssues, variant: 'warning' as const }]
                  : []),
              ]}
              badge={
                overview?.tenants.leavingSoon
                  ? { count: overview.tenants.leavingSoon, variant: 'warning' }
                  : undefined
              }
            />
            <OwnerNavigationCard
              title="Baux"
              description="Suivez vos contrats de location"
              icon={FileText}
              href="/dashboard/owner/leases"
              stats={[
                { label: 'actifs', value: overview?.leases.active || 0 },
                ...(overview?.leases.expiringSoon
                  ? [{ label: 'expirent bientôt', value: overview.leases.expiringSoon, variant: 'warning' as const }]
                  : []),
              ]}
              badge={
                overview?.leases.expired
                  ? { count: overview.leases.expired, variant: 'danger' }
                  : undefined
              }
            />
            <OwnerNavigationCard
              title="Maintenance"
              description="Traitez les demandes d'intervention"
              icon={Wrench}
              href="/dashboard/owner/maintenance"
              stats={[
                { label: 'ouverts', value: overview?.maintenance.open || 0 },
                { label: 'en cours', value: overview?.maintenance.inProgress || 0 },
              ]}
              badge={
                overview?.maintenance.urgent
                  ? { count: overview.maintenance.urgent, variant: 'danger' }
                  : undefined
              }
            />
          </OwnerNavigationGrid>
        </motion.div>

        {/* Quick Stats Footer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-8 mb-4"
        >
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl border border-gray-200 p-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold" style={{ color: '#059669' }}>
                  {overview?.leases.totalMonthlyRent
                    ? `${overview.leases.totalMonthlyRent.toLocaleString()}€`
                    : '0€'}
                </p>
                <p className="text-xs text-gray-500">Loyers mensuels</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {overview?.maintenance.avgResolutionHours || 0}h
                </p>
                <p className="text-xs text-gray-500">Temps de résolution moyen</p>
              </div>
              <div>
                <p className="text-2xl font-bold" style={{ color: '#9c5698' }}>
                  {overview?.maintenance.resolved || 0}
                </p>
                <p className="text-xs text-gray-500">Tickets résolus</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {overview?.maintenance.totalCost
                    ? `${overview.maintenance.totalCost.toLocaleString()}€`
                    : '0€'}
                </p>
                <p className="text-xs text-gray-500">Coûts maintenance</p>
              </div>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
