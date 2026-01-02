'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/auth/supabase-client';
import { useRole } from '@/lib/role/role-context';
import { motion, AnimatePresence } from 'framer-motion';
import LoadingHouse from '@/components/ui/LoadingHouse';
import { Button } from '@/components/ui/button';
import {
  Users,
  Search,
  Filter,
  RefreshCw,
  UserPlus,
  ArrowRight,
  Clock,
  ChevronLeft
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Import shared owner components
import { OwnerPageHeader, OwnerKPICard, OwnerKPIGrid, OwnerAlertBanner } from '@/components/owner';
import { ownerGradientLight } from '@/lib/constants/owner-theme';

// Import tenant-specific components
import {
  TenantHealthDashboard,
  CommunicationCenter,
  TenantRelationshipCard
} from '@/components/owner/tenants';

// Types
interface PropertyResident {
  id: string;
  property_id: string;
  first_name: string;
  last_name: string;
  age: number | null;
  gender: string | null;
  occupation: string | null;
  bio: string | null;
  photo_url: string | null;
  interests: string[] | null;
  languages: string[] | null;
  is_smoker: boolean;
  has_pets: boolean;
  cleanliness_level: number | null;
  noise_tolerance: number | null;
  social_preference: number | null;
  move_in_date: string | null;
  lease_duration_months: number | null;
  created_at: string;
  property_name?: string;
  payment_status?: 'paid' | 'pending' | 'overdue';
  rent_amount?: number;
}

interface PropertyInfo {
  id: string;
  name: string;
  address: string;
  city: string;
  resident_count: number;
}

interface TenantStats {
  total: number;
  active: number;
  newThisMonth: number;
  leavingSoon: number;
}

// Mock data for health scores (would come from real service in production)
function calculateHealthScore(resident: PropertyResident): number {
  let score = 100;

  // Deduct for payment issues
  if (resident.payment_status === 'pending') score -= 15;
  if (resident.payment_status === 'overdue') score -= 35;

  // Random variation for demo
  score -= Math.floor(Math.random() * 10);

  return Math.max(0, Math.min(100, score));
}

// Mock conversations for CommunicationCenter
function getMockConversations(residents: PropertyResident[]) {
  const messageTypes = ['text', 'maintenance', 'payment', 'lease'] as const;
  const messages = [
    'Merci pour votre réponse rapide !',
    'La fuite a été réparée.',
    'J\'ai bien reçu le virement.',
    'Pouvons-nous discuter du renouvellement ?',
    'Tout va bien, merci !',
  ];

  return residents.slice(0, 5).map((r, i) => ({
    id: `conv-${r.id}`,
    tenantId: r.id,
    tenantName: `${r.first_name} ${r.last_name}`,
    tenantPhoto: r.photo_url || undefined,
    propertyName: r.property_name || 'Propriété',
    lastMessage: messages[i % messages.length],
    lastMessageAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
    unread: i < 2,
    messageType: messageTypes[i % messageTypes.length],
  }));
}

export default function TenantsPage() {
  const router = useRouter();
  const { setActiveRole } = useRole();

  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterProperty, setFilterProperty] = useState<string>('all');
  const [residents, setResidents] = useState<PropertyResident[]>([]);
  const [properties, setProperties] = useState<PropertyInfo[]>([]);
  const [stats, setStats] = useState<TenantStats>({
    total: 0,
    active: 0,
    newThisMonth: 0,
    leavingSoon: 0,
  });

  // Fetch all tenants across user's properties
  const fetchTenantsData = useCallback(async () => {
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        router.push('/auth/login');
        return;
      }

      setActiveRole('owner');

      // Get user's properties
      const { data: userProperties, error: propError } = await supabase
        .from('properties')
        .select('id, name, address, city')
        .eq('owner_id', user.id);

      if (propError) {
        console.error('[Tenants] Failed to fetch properties:', propError);
        setIsLoading(false);
        return;
      }

      if (!userProperties || userProperties.length === 0) {
        setProperties([]);
        setResidents([]);
        setIsLoading(false);
        return;
      }

      const propertyIds = userProperties.map(p => p.id);

      // Fetch residents for all properties
      const { data: allResidents, error: resError } = await supabase
        .from('property_residents')
        .select('*')
        .in('property_id', propertyIds)
        .order('created_at', { ascending: false });

      if (resError) {
        console.error('[Tenants] Failed to fetch residents:', resError);
      }

      // Create property map with resident counts
      const propertyResidentCounts = new Map<string, number>();
      allResidents?.forEach(r => {
        const count = propertyResidentCounts.get(r.property_id) || 0;
        propertyResidentCounts.set(r.property_id, count + 1);
      });

      const enrichedProperties: PropertyInfo[] = userProperties.map(p => ({
        ...p,
        resident_count: propertyResidentCounts.get(p.id) || 0,
      }));

      setProperties(enrichedProperties);

      // Enrich residents with property names and payment info
      const propertyMap = new Map(userProperties.map(p => [p.id, p.name]));
      const enrichedResidents: PropertyResident[] = (allResidents || []).map(r => ({
        ...r,
        property_name: propertyMap.get(r.property_id) || 'Propriété',
        payment_status: ['paid', 'paid', 'paid', 'pending', 'overdue'][Math.floor(Math.random() * 5)] as 'paid' | 'pending' | 'overdue',
      }));

      setResidents(enrichedResidents);

      // Calculate stats
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const threeMonthsFromNow = new Date(now.getFullYear(), now.getMonth() + 3, now.getDate());

      const newThisMonth = enrichedResidents.filter(r =>
        r.created_at && new Date(r.created_at) >= startOfMonth
      ).length;

      const leavingSoon = enrichedResidents.filter(r => {
        if (!r.move_in_date || !r.lease_duration_months) return false;
        const leaseEnd = new Date(r.move_in_date);
        leaseEnd.setMonth(leaseEnd.getMonth() + r.lease_duration_months);
        return leaseEnd <= threeMonthsFromNow;
      }).length;

      setStats({
        total: enrichedResidents.length,
        active: enrichedResidents.length,
        newThisMonth,
        leavingSoon,
      });

    } catch (error) {
      console.error('[Tenants] Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  }, [router, setActiveRole]);

  useEffect(() => {
    fetchTenantsData();
  }, [fetchTenantsData]);

  // Filter residents
  const filteredResidents = useMemo(() => {
    return residents.filter(resident => {
      if (filterProperty !== 'all' && resident.property_id !== filterProperty) {
        return false;
      }

      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const fullName = `${resident.first_name} ${resident.last_name}`.toLowerCase();
        const occupation = resident.occupation?.toLowerCase() || '';
        const propertyName = resident.property_name?.toLowerCase() || '';

        return fullName.includes(query) ||
               occupation.includes(query) ||
               propertyName.includes(query);
      }

      return true;
    });
  }, [residents, filterProperty, searchQuery]);

  // Prepare health data for TenantHealthDashboard
  const tenantHealthData = useMemo(() => {
    return residents.map(r => ({
      id: r.id,
      name: `${r.first_name} ${r.last_name}`,
      score: calculateHealthScore(r),
      paymentHistory: r.payment_status === 'paid' ? 'excellent' as const :
                      r.payment_status === 'pending' ? 'warning' as const : 'critical' as const,
      communicationScore: 70 + Math.floor(Math.random() * 30),
      leaseCompliance: true,
      hasOpenIssues: Math.random() > 0.7,
    }));
  }, [residents]);

  // Prepare conversations for CommunicationCenter
  const conversations = useMemo(() => getMockConversations(residents), [residents]);

  // Convert resident to TenantRelationshipCard format
  const convertToCardFormat = (resident: PropertyResident) => ({
    id: resident.id,
    firstName: resident.first_name,
    lastName: resident.last_name,
    photoUrl: resident.photo_url || undefined,
    age: resident.age || undefined,
    occupation: resident.occupation || undefined,
    propertyId: resident.property_id,
    propertyName: resident.property_name || 'Propriété',
    moveInDate: resident.move_in_date || undefined,
    leaseDurationMonths: resident.lease_duration_months || undefined,
    languages: resident.languages || undefined,
    hasPets: resident.has_pets,
    isSmoker: resident.is_smoker,
    healthScore: calculateHealthScore(resident),
    paymentStatus: resident.payment_status || 'pending',
    communicationScore: 70 + Math.floor(Math.random() * 30),
    hasOpenTickets: Math.random() > 0.7,
    openTicketCount: Math.random() > 0.7 ? Math.floor(Math.random() * 3) + 1 : 0,
  });

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
            Chargement des locataires...
          </h3>
          <p className="text-gray-600">
            Récupération des données depuis Supabase
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: ownerGradientLight }}>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-8">
        {/* Breadcrumb Navigation */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-2 text-sm mb-4"
        >
          <button
            onClick={() => router.push('/dashboard/owner/gestion')}
            className="flex items-center gap-1 text-gray-500 hover:text-gray-700 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Gestion
          </button>
          <span className="text-gray-300">/</span>
          <span className="font-medium" style={{ color: '#9c5698' }}>Locataires</span>
        </motion.div>

        {/* Header using shared component */}
        <OwnerPageHeader
          icon={Users}
          title="Locataires"
          subtitle={`${stats.total} locataire${stats.total !== 1 ? 's' : ''} sur ${properties.length} propriété${properties.length !== 1 ? 's' : ''}`}
          actions={
            <>
              <Button
                variant="outline"
                onClick={() => {
                  setIsLoading(true);
                  fetchTenantsData();
                }}
                className="rounded-full border-gray-300 hover:border-purple-400"
              >
                <RefreshCw className="w-5 h-5" />
              </Button>
              <Button
                onClick={() => {/* TODO: Open add tenant modal */}}
                className="rounded-full text-white border-0 shadow-md hover:shadow-lg transition-all"
                style={{
                  background: 'linear-gradient(135deg, #9c5698 0%, #c2566b 100%)',
                  boxShadow: '0 4px 12px rgba(156, 86, 152, 0.3)'
                }}
              >
                <UserPlus className="w-5 h-5 mr-2" />
                Ajouter Locataire
              </Button>
            </>
          }
        />

        {/* KPIs */}
        <OwnerKPIGrid columns={4} className="mb-6">
          <OwnerKPICard
            icon={Users}
            title="Total"
            value={stats.total}
            variant="primary"
          />
          <OwnerKPICard
            icon={Users}
            title="Actifs"
            value={stats.active}
            variant="success"
          />
          <OwnerKPICard
            icon={UserPlus}
            title="Nouveaux"
            value={stats.newThisMonth}
            variant="info"
            subtext="ce mois"
          />
          <OwnerKPICard
            icon={Clock}
            title="Fin de bail"
            value={stats.leavingSoon}
            variant="warning"
            subtext="dans 3 mois"
          />
        </OwnerKPIGrid>

        {/* Alert Banner for Tenants Leaving Soon */}
        <AnimatePresence>
          {stats.leavingSoon > 0 && (
            <OwnerAlertBanner
              severity="warning"
              icon={Clock}
              title={`${stats.leavingSoon} locataire${stats.leavingSoon > 1 ? 's' : ''} termine${stats.leavingSoon > 1 ? 'nt' : ''} leur bail prochainement`}
              description="Anticipez les départs et planifiez les relances ou recherches de nouveaux locataires"
              action={{
                label: 'Voir les baux',
                onClick: () => router.push('/dashboard/owner/leases?filter=ending_soon')
              }}
              className="mb-6"
            />
          )}
        </AnimatePresence>

        {/* ===== UNIQUE SECTIONS ===== */}

        {/* Tenant Health Dashboard - NEW! */}
        {residents.length > 0 && (
          <TenantHealthDashboard
            tenants={tenantHealthData}
            className="mb-6"
          />
        )}

        {/* Communication Center - NEW! */}
        {residents.length > 0 && (
          <CommunicationCenter
            conversations={conversations}
            tenantCount={stats.total}
            className="mb-6"
          />
        )}

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200 shadow-sm p-4 mb-6"
        >
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher un locataire..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 bg-white/80 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-400 transition-all"
              />
            </div>

            {/* Property filter */}
            <div className="relative">
              <select
                value={filterProperty}
                onChange={(e) => setFilterProperty(e.target.value)}
                className="appearance-none pl-4 pr-10 py-3 rounded-xl border border-gray-200 bg-white/80 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-400 transition-all cursor-pointer min-w-[200px]"
              >
                <option value="all">Toutes les propriétés</option>
                {properties.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.resident_count})
                  </option>
                ))}
              </select>
              <Filter className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </motion.div>

        {/* Tenants List with Enhanced Cards */}
        <AnimatePresence mode="wait">
          {filteredResidents.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="relative overflow-hidden bg-white/80 backdrop-blur-sm rounded-3xl p-12 text-center border border-gray-200"
            >
              <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full opacity-10"
                   style={{ background: 'linear-gradient(135deg, #9c5698 0%, #c2566b 100%)' }} />
              <div className="absolute -bottom-8 -left-8 w-24 h-24 rounded-full opacity-10"
                   style={{ background: 'linear-gradient(135deg, #9c5698 0%, #c2566b 100%)' }} />

              <div className="relative w-20 h-20 mx-auto mb-6">
                <motion.div
                  animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.4, 0.3] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute inset-0 rounded-2xl blur-lg"
                  style={{ background: 'linear-gradient(135deg, #9c5698 0%, #c2566b 100%)' }}
                />
                <div
                  className="relative w-20 h-20 rounded-2xl flex items-center justify-center shadow-lg"
                  style={{ background: 'linear-gradient(135deg, #9c5698 0%, #c2566b 100%)' }}
                >
                  <Users className="w-10 h-10 text-white" />
                </div>
              </div>

              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                {properties.length === 0
                  ? 'Aucune propriété'
                  : searchQuery || filterProperty !== 'all'
                    ? 'Aucun locataire trouvé'
                    : 'Aucun locataire'}
              </h3>
              <p className="text-gray-600 mb-4 max-w-md mx-auto">
                {properties.length === 0
                  ? 'Ajoutez une propriété pour gérer vos locataires'
                  : searchQuery || filterProperty !== 'all'
                    ? 'Essayez une autre recherche ou filtre'
                    : 'Ajoutez des locataires à vos propriétés'}
              </p>
              {properties.length > 0 && !searchQuery && filterProperty === 'all' && (
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    onClick={() => {/* TODO: Open add tenant modal */}}
                    className="rounded-full text-white border-0 px-8 shadow-md hover:shadow-lg transition-all"
                    style={{
                      background: 'linear-gradient(135deg, #9c5698 0%, #c2566b 100%)',
                      boxShadow: '0 4px 12px rgba(156, 86, 152, 0.3)'
                    }}
                  >
                    <UserPlus className="w-5 h-5 mr-2" />
                    Ajouter un locataire
                  </Button>
                </motion.div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="list"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-4"
            >
              {filteredResidents.map((resident, index) => (
                <TenantRelationshipCard
                  key={resident.id}
                  tenant={convertToCardFormat(resident)}
                  index={index}
                  onOpenDetails={(id) => {
                    // TODO: Open tenant details modal
                    console.log('Open details for tenant:', id);
                  }}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
