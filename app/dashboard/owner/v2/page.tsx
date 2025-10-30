'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/auth/supabase-client';
import { useQuery } from '@tanstack/react-query';
import OwnerHeader from '@/components/layout/OwnerHeader';
import { KPICard } from '@/components/ui/kpi-card';
import { Button } from '@/components/ui/button';
import {
  DollarSign,
  Home,
  TrendingUp,
  Users,
  PlusCircle,
  Eye,
  MessageCircle,
  AlertCircle,
  Calendar,
  CheckCircle2,
  Clock,
  ArrowRight,
} from 'lucide-react';

export default function OwnerDashboardV2() {
  const router = useRouter();
  const supabase = createClient();
  const [userId, setUserId] = useState<string | null>(null);

  // Check authentication
  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        router.push('/auth');
      } else {
        setUserId(user.id);
      }
    };
    checkAuth();
  }, [router, supabase]);

  // Fetch user profile
  const { data: profile } = useQuery({
    queryKey: ['owner-profile', userId],
    queryFn: async () => {
      if (!userId) return null;

      const { data: userData } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      const { data: profileData } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      return {
        id: userId,
        first_name: userData?.first_name || 'Owner',
        last_name: userData?.last_name || '',
        full_name: userData?.full_name || 'Owner',
        email: userData?.email || '',
        avatar_url: profileData?.avatar_url,
      };
    },
    enabled: !!userId,
  });

  // Fetch properties and stats
  const { data: propertiesData } = useQuery({
    queryKey: ['owner-properties', userId],
    queryFn: async () => {
      if (!userId) return null;

      const { data: properties, error } = await supabase
        .from('properties')
        .select('*')
        .eq('owner_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return properties || [];
    },
    enabled: !!userId,
  });

  // Fetch applications
  const { data: applicationsData } = useQuery({
    queryKey: ['owner-applications', userId],
    queryFn: async () => {
      if (!userId) return null;

      // Get all property IDs owned by this user
      const { data: properties } = await supabase
        .from('properties')
        .select('id')
        .eq('owner_id', userId);

      if (!properties || properties.length === 0) return [];

      const propertyIds = properties.map((p) => p.id);

      const { data: applications, error } = await supabase
        .from('applications')
        .select('*, property:properties(title), applicant:user_profiles(first_name, last_name)')
        .in('property_id', propertyIds)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return applications || [];
    },
    enabled: !!userId,
  });

  // Calculate KPIs
  const totalProperties = propertiesData?.length || 0;
  const publishedProperties =
    propertiesData?.filter((p) => p.status === 'published').length || 0;

  const monthlyRevenue = propertiesData?.reduce((sum, p) => {
    if (p.status === 'published') {
      return sum + (p.monthly_rent || 0);
    }
    return sum;
  }, 0) || 0;

  const totalViews = propertiesData?.reduce((sum, p) => sum + (p.views_count || 0), 0) || 0;

  const pendingApplications =
    applicationsData?.filter((a) => a.status === 'pending').length || 0;

  // Mock ROI and Occupation (à calculer avec vraies données)
  const avgROI = 8.2;
  const avgOccupation = totalProperties > 0 ? (publishedProperties / totalProperties) * 100 : 0;

  // Recent applications
  const recentApplications = applicationsData?.slice(0, 5) || [];

  if (!userId || !profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with Owner theme */}
      <OwnerHeader
        profile={profile}
        pendingApplications={pendingApplications}
        monthlyRevenue={monthlyRevenue}
      />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Bienvenue, {profile.first_name}! 👋
          </h1>
          <p className="text-gray-600">
            Voici un aperçu de vos propriétés et performances
          </p>
        </div>

        {/* KPIs Grid - FINTECH Focus */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <KPICard
            title="Revenu Mensuel Potentiel"
            value={`€${monthlyRevenue.toLocaleString()}`}
            trend="+12%"
            trendDirection="up"
            icon={DollarSign}
          />
          <KPICard
            title="Taux de Publication"
            value={`${Math.round(avgOccupation)}%`}
            trend={publishedProperties > 0 ? '+3%' : 'N/A'}
            trendDirection={publishedProperties > 0 ? 'up' : 'neutral'}
            icon={Home}
          />
          <KPICard
            title="ROI Moyen"
            value={`${avgROI}%`}
            trend="+0.5%"
            trendDirection="up"
            icon={TrendingUp}
          />
          <KPICard
            title="Candidatures"
            value={pendingApplications}
            badge={pendingApplications > 0 ? 'Urgent' : 'À jour'}
            badgeVariant={pendingApplications > 0 ? 'warning' : 'success'}
            icon={Users}
            onClick={() => router.push('/applications')}
          />
        </div>

        {/* Quick Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Eye className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Vues Totales</p>
                <p className="text-2xl font-bold text-gray-900">{totalViews}</p>
              </div>
            </div>
            <p className="text-sm text-gray-500">
              Moyenne: {totalProperties > 0 ? Math.round(totalViews / totalProperties) : 0} par
              annonce
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <MessageCircle className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Messages Reçus</p>
                <p className="text-2xl font-bold text-gray-900">0</p>
              </div>
            </div>
            <p className="text-sm text-gray-500">Dernières 24h</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Home className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Propriétés Actives</p>
                <p className="text-2xl font-bold text-gray-900">{publishedProperties}</p>
              </div>
            </div>
            <p className="text-sm text-gray-500">Sur {totalProperties} total</p>
          </div>
        </div>

        {/* Recent Applications */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Candidatures Récentes</h2>
            <Link href="/applications">
              <Button variant="outline">Voir tout</Button>
            </Link>
          </div>

          {recentApplications.length > 0 ? (
            <div className="space-y-4">
              {recentApplications.map((app: any) => (
                <div
                  key={app.id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                      <Users className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">
                        {app.applicant?.first_name} {app.applicant?.last_name}
                      </p>
                      <p className="text-sm text-gray-600">{app.property?.title}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-sm text-gray-600">
                        {new Date(app.created_at).toLocaleDateString('fr-FR')}
                      </p>
                      <div className="flex items-center gap-1 mt-1">
                        {app.status === 'pending' && (
                          <>
                            <Clock className="w-4 h-4 text-yellow-600" />
                            <span className="text-sm font-medium text-yellow-600">En attente</span>
                          </>
                        )}
                        {app.status === 'accepted' && (
                          <>
                            <CheckCircle2 className="w-4 h-4 text-green-600" />
                            <span className="text-sm font-medium text-green-600">Accepté</span>
                          </>
                        )}
                        {app.status === 'rejected' && (
                          <>
                            <AlertCircle className="w-4 h-4 text-red-600" />
                            <span className="text-sm font-medium text-red-600">Refusé</span>
                          </>
                        )}
                      </div>
                    </div>
                    <Link href={`/applications/${app.id}`}>
                      <Button variant="outline" size="sm">
                        Voir
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-600 mb-2">Aucune candidature pour le moment</p>
              <p className="text-sm text-gray-500">
                Les candidatures apparaîtront ici dès qu'elles seront reçues
              </p>
            </div>
          )}
        </div>

        {/* Properties Overview */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Mes Propriétés</h2>
            <Link href="/properties/new">
              <Button className="flex items-center gap-2 bg-[var(--owner-primary)] hover:bg-[var(--owner-hover)]">
                <PlusCircle className="w-5 h-5" />
                Nouvelle Annonce
              </Button>
            </Link>
          </div>

          {propertiesData && propertiesData.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                      Propriété
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                      Statut
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                      Loyer/mois
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                      Vues
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {propertiesData.slice(0, 5).map((property) => (
                    <tr key={property.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-4 px-4">
                        <div>
                          <p className="font-semibold text-gray-900">{property.title}</p>
                          <p className="text-sm text-gray-600">{property.city}</p>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            property.status === 'published'
                              ? 'bg-green-100 text-green-800'
                              : property.status === 'draft'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {property.status === 'published'
                            ? 'Publié'
                            : property.status === 'draft'
                            ? 'Brouillon'
                            : property.status}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="font-semibold text-gray-900">
                          €{property.monthly_rent}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-1 text-gray-600">
                          <Eye className="w-4 h-4" />
                          <span>{property.views_count || 0}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <Link href={`/properties/${property.id}/edit`}>
                          <Button variant="outline" size="sm">
                            Modifier
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {propertiesData.length > 5 && (
                <div className="mt-6 text-center">
                  <Link href="/properties">
                    <Button variant="outline" className="flex items-center gap-2 mx-auto">
                      Voir toutes mes propriétés
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Home className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Aucune propriété pour le moment
              </h3>
              <p className="text-gray-600 mb-6">
                Commence par créer ta première annonce pour trouver des colocataires
              </p>
              <Link href="/properties/new">
                <Button className="flex items-center gap-2 bg-[var(--owner-primary)] hover:bg-[var(--owner-hover)]">
                  <PlusCircle className="w-5 h-5" />
                  Créer ma première annonce
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* AI Insights Section */}
        <div className="bg-gradient-to-r from-purple-600 to-purple-700 rounded-xl shadow-lg p-8 text-white">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-bold mb-3">💡 Insights IA</h3>
              {totalProperties > 0 ? (
                <div className="space-y-3">
                  <p className="text-purple-100 leading-relaxed">
                    • Vos annonces reçoivent {totalViews > 0 ? 'un bon nombre' : 'peu'} de vues.{' '}
                    {totalViews < 50 &&
                      'Pensez à améliorer vos photos et descriptions pour attirer plus de candidats.'}
                  </p>
                  <p className="text-purple-100 leading-relaxed">
                    • Le prix moyen du marché dans votre zone est de €
                    {Math.round(monthlyRevenue / (totalProperties || 1))} par mois.
                  </p>
                  {pendingApplications > 3 && (
                    <p className="text-purple-100 leading-relaxed">
                      ⚠️ Vous avez {pendingApplications} candidatures en attente - répondez
                      rapidement pour ne pas perdre de bons candidats!
                    </p>
                  )}
                  {monthlyRevenue > 2000 && (
                    <p className="text-purple-100 leading-relaxed">
                      💰 Avec €{monthlyRevenue.toLocaleString()}/mois de revenu potentiel, vous
                      pourriez générer €{(monthlyRevenue * 12).toLocaleString()} par an!
                    </p>
                  )}
                </div>
              ) : (
                <p className="text-purple-100 leading-relaxed">
                  Créez votre première annonce pour recevoir des insights personnalisés basés sur
                  l'IA et optimiser vos revenus locatifs.
                </p>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
