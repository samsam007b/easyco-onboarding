'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/auth/supabase-client';
import Link from 'next/link';
import {
  Activity,
  Users,
  TrendingUp,
  CheckCircle,
  Clock,
  Database,
  Zap,
  BarChart3,
  Shield,
  Eye,
  RefreshCw,
  ArrowLeft,
} from 'lucide-react';

interface SystemMetrics {
  analytics: {
    activeUsers: number;
    pageViews: number;
    conversions: number;
    bounceRate: number;
  };
  database: {
    totalUsers: number;
    totalProperties: number;
    totalApplications: number;
    activeMatches: number;
  };
  system: {
    uptime: string;
    responseTime: number;
    errorRate: number;
    queueSize: number;
  };
  performance: {
    fcp: number;
    lcp: number;
    cls: number;
    fid: number;
  };
}

export default function DashboardClient() {
  const supabase = createClient();
  const [metrics, setMetrics] = useState<SystemMetrics | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  // Auto-refresh every 30 seconds
  useEffect(() => {
    loadMetrics();
    const interval = setInterval(() => {
      loadMetrics();
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadMetrics = async () => {
    try {
      // Load database metrics
      const [usersCount, propertiesCount, applicationsCount, matchesCount] = await Promise.all([
        supabase.from('user_profiles').select('*', { count: 'exact', head: true }),
        supabase.from('properties').select('*', { count: 'exact', head: true }),
        supabase.from('applications').select('*', { count: 'exact', head: true }),
        supabase.from('matches').select('*', { count: 'exact', head: true }),
      ]);

      // Simulate analytics metrics (replace with real analytics data)
      const mockMetrics: SystemMetrics = {
        analytics: {
          activeUsers: Math.floor(Math.random() * 1000) + 500,
          pageViews: Math.floor(Math.random() * 10000) + 5000,
          conversions: Math.floor(Math.random() * 100) + 50,
          bounceRate: Math.random() * 40 + 30,
        },
        database: {
          totalUsers: usersCount.count || 0,
          totalProperties: propertiesCount.count || 0,
          totalApplications: applicationsCount.count || 0,
          activeMatches: matchesCount.count || 0,
        },
        system: {
          uptime: '99.9%',
          responseTime: Math.floor(Math.random() * 200) + 100,
          errorRate: Math.random() * 0.5,
          queueSize: Math.floor(Math.random() * 10),
        },
        performance: {
          fcp: Math.random() * 1.8,
          lcp: Math.random() * 2.5,
          cls: Math.random() * 0.1,
          fid: Math.random() * 100,
        },
      };

      setMetrics(mockMetrics);
      setLastUpdate(new Date());
    } catch (error) {
      console.error('Failed to load metrics:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="mb-4">
            <Link
              href="/admin"
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors text-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              Retour aux données
            </Link>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <Shield className="w-8 h-8 text-orange-600" />
                Admin Dashboard
              </h1>
              <p className="text-gray-500 mt-1">
                Vue d'ensemble de la plateforme EasyCo
              </p>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={loadMetrics}
                className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition"
              >
                <RefreshCw className="w-4 h-4" />
                Actualiser
              </button>
              <div className="text-sm text-gray-500">
                Dernière mise à jour: {lastUpdate.toLocaleTimeString('fr-FR')}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Utilisateurs Actifs"
            value={metrics?.analytics.activeUsers || 0}
            change="+12.5%"
            icon={<Users className="w-6 h-6" />}
            color="blue"
          />
          <StatCard
            title="Vues de Pages"
            value={metrics?.analytics.pageViews || 0}
            change="+8.2%"
            icon={<Eye className="w-6 h-6" />}
            color="green"
          />
          <StatCard
            title="Conversions"
            value={metrics?.analytics.conversions || 0}
            change="+15.3%"
            icon={<TrendingUp className="w-6 h-6" />}
            color="purple"
          />
          <StatCard
            title="Temps de Réponse"
            value={`${metrics?.system.responseTime || 0}ms`}
            change="-5.1%"
            icon={<Zap className="w-6 h-6" />}
            color="orange"
            isGoodWhenDown
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Database Metrics */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <Database className="w-5 h-5 text-blue-600" />
                Base de Données
              </h2>
            </div>
            <div className="space-y-4">
              <MetricRow
                label="Total Utilisateurs"
                value={metrics?.database.totalUsers || 0}
                icon="👥"
              />
              <MetricRow
                label="Propriétés"
                value={metrics?.database.totalProperties || 0}
                icon="🏠"
              />
              <MetricRow
                label="Candidatures"
                value={metrics?.database.totalApplications || 0}
                icon="📝"
              />
              <MetricRow
                label="Matchs Actifs"
                value={metrics?.database.activeMatches || 0}
                icon="❤️"
              />
            </div>
          </div>

          {/* System Health */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <Activity className="w-5 h-5 text-green-600" />
                Santé du Système
              </h2>
              <span className="flex items-center gap-2 text-green-600 text-sm font-medium">
                <CheckCircle className="w-4 h-4" />
                Opérationnel
              </span>
            </div>
            <div className="space-y-4">
              <HealthMetric
                label="Uptime"
                value={metrics?.system.uptime || '0%'}
                status="excellent"
              />
              <HealthMetric
                label="Temps de Réponse Moyen"
                value={`${metrics?.system.responseTime || 0}ms`}
                status={
                  (metrics?.system.responseTime || 0) < 200 ? 'excellent' : 'good'
                }
              />
              <HealthMetric
                label="Taux d'Erreur"
                value={`${metrics?.system.errorRate.toFixed(2) || 0}%`}
                status={
                  (metrics?.system.errorRate || 0) < 0.5 ? 'excellent' : 'warning'
                }
              />
              <HealthMetric
                label="Files d'Attente"
                value={`${metrics?.system.queueSize || 0} événements`}
                status="good"
              />
            </div>
          </div>

          {/* Performance Metrics */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-purple-600" />
                Core Web Vitals
              </h2>
            </div>
            <div className="space-y-4">
              <VitalMetric
                label="First Contentful Paint"
                value={`${metrics?.performance.fcp.toFixed(2) || 0}s`}
                threshold={1.8}
                current={metrics?.performance.fcp || 0}
              />
              <VitalMetric
                label="Largest Contentful Paint"
                value={`${metrics?.performance.lcp.toFixed(2) || 0}s`}
                threshold={2.5}
                current={metrics?.performance.lcp || 0}
              />
              <VitalMetric
                label="Cumulative Layout Shift"
                value={metrics?.performance.cls.toFixed(3) || '0'}
                threshold={0.1}
                current={metrics?.performance.cls || 0}
              />
              <VitalMetric
                label="First Input Delay"
                value={`${metrics?.performance.fid.toFixed(0) || 0}ms`}
                threshold={100}
                current={metrics?.performance.fid || 0}
              />
            </div>
          </div>

          {/* Analytics Overview */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-orange-600" />
                Analytics Temps Réel
              </h2>
            </div>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Taux de Rebond</span>
                  <span className="text-sm font-medium text-gray-900">
                    {metrics?.analytics.bounceRate.toFixed(1) || 0}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-orange-600 h-2 rounded-full transition-all"
                    style={{ width: `${100 - (metrics?.analytics.bounceRate || 0)}%` }}
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-2xl font-bold text-gray-900">
                      {metrics?.analytics.activeUsers || 0}
                    </div>
                    <div className="text-sm text-gray-500">Utilisateurs en ligne</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">
                      {metrics?.analytics.conversions || 0}
                    </div>
                    <div className="text-sm text-gray-500">Conversions aujourd'hui</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-gray-600" />
            Activité Récente
          </h2>
          <div className="text-gray-500 text-center py-8">
            Connectez Google Analytics pour voir l'activité en temps réel
          </div>
        </div>
      </div>
    </div>
  );
}

// Utility Components
function StatCard({
  title,
  value,
  change,
  icon,
  color,
  isGoodWhenDown = false,
}: {
  title: string;
  value: number | string;
  change: string;
  icon: React.ReactNode;
  color: 'blue' | 'green' | 'purple' | 'orange';
  isGoodWhenDown?: boolean;
}) {
  const colors = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    purple: 'bg-purple-100 text-purple-600',
    orange: 'bg-orange-100 text-orange-600',
  };

  const isPositive = change.startsWith('+');
  const isGood = isGoodWhenDown ? !isPositive : isPositive;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 rounded-lg ${colors[color]} flex items-center justify-center`}>
          {icon}
        </div>
        <span
          className={`text-sm font-medium ${
            isGood ? 'text-green-600' : 'text-red-600'
          }`}
        >
          {change}
        </span>
      </div>
      <div className="text-2xl font-bold text-gray-900">{value.toLocaleString()}</div>
      <div className="text-sm text-gray-500 mt-1">{title}</div>
    </div>
  );
}

function MetricRow({ label, value, icon }: { label: string; value: number; icon: string }) {
  return (
    <div className="flex items-center justify-between py-2">
      <span className="text-gray-600 flex items-center gap-2">
        <span>{icon}</span>
        {label}
      </span>
      <span className="text-lg font-semibold text-gray-900">{value.toLocaleString()}</span>
    </div>
  );
}

function HealthMetric({
  label,
  value,
  status,
}: {
  label: string;
  value: string;
  status: 'excellent' | 'good' | 'warning' | 'critical';
}) {
  const statusColors = {
    excellent: 'bg-green-100 text-green-700',
    good: 'bg-blue-100 text-blue-700',
    warning: 'bg-yellow-100 text-yellow-700',
    critical: 'bg-red-100 text-red-700',
  };

  return (
    <div className="flex items-center justify-between py-2">
      <span className="text-gray-600">{label}</span>
      <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[status]}`}>
        {value}
      </span>
    </div>
  );
}

function VitalMetric({
  label,
  value,
  threshold,
  current,
}: {
  label: string;
  value: string;
  threshold: number;
  current: number;
}) {
  const isGood = current <= threshold;

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-gray-600">{label}</span>
        <span className={`text-sm font-medium ${isGood ? 'text-green-600' : 'text-red-600'}`}>
          {value}
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className={`h-2 rounded-full transition-all ${
            isGood ? 'bg-green-600' : 'bg-red-600'
          }`}
          style={{ width: `${Math.min((current / threshold) * 100, 100)}%` }}
        />
      </div>
      <div className="text-xs text-gray-500 mt-1">Seuil: {threshold}</div>
    </div>
  );
}
