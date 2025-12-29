'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/auth/supabase-client';
import { motion } from 'framer-motion';
import LoadingHouse from '@/components/ui/LoadingHouse';
import ResidenceHeader from '@/components/hub/ResidenceHeader';
import {
  Users,
  MessageCircle,
  DollarSign,
  Calendar,
  Wrench,
  Home,
  TrendingUp,
  TrendingDown,
  Check,
  Clock,
  ArrowRight,
  Heart,
  FileText,
  Plus,
  Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import SubscriptionBanner from '@/components/subscriptions/SubscriptionBanner';
import UpgradeNotification from '@/components/subscriptions/UpgradeNotification';
import {
  OnboardingTour,
  useOnboarding,
  OnboardingStep,
  GettingStartedChecklist,
  useGettingStarted,
  RESIDENT_CHECKLIST_ITEMS,
  celebrateToast,
} from '@/components/onboarding';

interface DashboardStats {
  rentStatus: {
    paid: number;
    total: number;
    dueDate: string;
  };
  sharedExpenses: number;
  yourBalance: number; // Positive = owed to you, Negative = you owe
  roommatesCount: number;
  pendingTasks: number;
  unreadMessages: number;
  communityHappiness: number;
}

interface Task {
  id: string;
  title: string;
  dueDate: string;
  priority: 'low' | 'medium' | 'high';
  assignedTo?: string;
}

interface Activity {
  id: string;
  icon: any;
  iconBgColor: string;
  title: string;
  subtitle: string;
  time: string;
}

export default function ModernResidentDashboard() {
  const router = useRouter();
  const supabase = createClient();
  const [isLoading, setIsLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [currentProperty, setCurrentProperty] = useState<any>(null);
  const [roommates, setRoommates] = useState<any[]>([]);
  const [memberCount, setMemberCount] = useState(1);
  const [stats, setStats] = useState<DashboardStats>({
    rentStatus: {
      paid: 850,
      total: 1000,
      dueDate: '2024-11-05'
    },
    sharedExpenses: 125,
    yourBalance: -45, // You owe 45€
    roommatesCount: 4,
    pendingTasks: 3,
    unreadMessages: 2,
    communityHappiness: 94
  });
  const [upcomingTasks, setUpcomingTasks] = useState<Task[]>([
    {
      id: '1',
      title: 'Payer le loyer',
      dueDate: '2024-11-05',
      priority: 'high'
    },
    {
      id: '2',
      title: 'Réunion de maison',
      dueDate: '2024-11-08',
      priority: 'medium'
    },
    {
      id: '3',
      title: 'Nettoyage cuisine',
      dueDate: '2024-11-09',
      priority: 'low'
    }
  ]);
  const [recentActivities, setRecentActivities] = useState<Activity[]>([
    {
      id: '1',
      icon: DollarSign,
      iconBgColor: 'bg-green-100',
      title: 'Sarah a payé les courses',
      subtitle: '€45.50',
      time: 'Il y a 2h'
    },
    {
      id: '2',
      icon: MessageCircle,
      iconBgColor: 'bg-blue-100',
      title: 'Nouveau message de Marc',
      subtitle: 'Groupe "Ma Coloc"',
      time: 'Il y a 4h'
    },
    {
      id: '3',
      icon: Check,
      iconBgColor: 'bg-orange-100',
      title: 'Tâche complétée',
      subtitle: 'Nettoyage salle de bain',
      time: 'Hier'
    }
  ]);

  // Onboarding steps for resident dashboard
  const residentOnboardingSteps: OnboardingStep[] = [
    {
      id: 'welcome',
      target: '[data-onboarding="kpi-cards"]',
      title: 'Bienvenue dans ton Hub ! 🏠',
      description: 'Ici tu retrouves un aperçu de ta coloc : loyer, dépenses partagées et solde avec tes colocs.',
      position: 'bottom',
    },
    {
      id: 'finances',
      target: '[data-onboarding="finances-card"]',
      title: 'Gère tes finances',
      description: 'Clique ici pour voir le détail des dépenses partagées et équilibrer les comptes avec tes colocs.',
      position: 'bottom',
    },
    {
      id: 'members',
      target: '[data-onboarding="members-card"]',
      title: 'Tes colocataires',
      description: 'Retrouve tous les membres de ta coloc, invite de nouveaux colocs ou anticipe les départs.',
      position: 'bottom',
    },
    {
      id: 'tasks',
      target: '[data-onboarding="tasks-section"]',
      title: 'Organise la vie commune',
      description: 'Planifie les tâches ménagères, les réunions et les échéances importantes de la coloc.',
      position: 'right',
    },
  ];

  const onboarding = useOnboarding({
    tourId: 'resident-dashboard-tour',
    steps: residentOnboardingSteps,
  });

  // Getting Started checklist
  const gettingStarted = useGettingStarted({
    checklistId: 'resident-checklist',
    items: RESIDENT_CHECKLIST_ITEMS,
    onAllComplete: () => {
      celebrateToast.checklistComplete();
    },
  });

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }

      setUserId(user.id);

      // Load property membership
      const { data: propertyMember } = await supabase
        .from('property_members')
        .select(`
          *,
          properties (
            id,
            title,
            address,
            city,
            main_image,
            monthly_rent,
            images,
            invitation_code,
            owner_code
          )
        `)
        .eq('user_id', user.id)
        .eq('status', 'active')
        .single();

      if (propertyMember && propertyMember.properties) {
        setCurrentProperty(propertyMember.properties);

        // Update rent stats with real data
        const rentTotal = propertyMember.properties.monthly_rent || 1000;
        setStats(prev => ({
          ...prev,
          rentStatus: {
            ...prev.rentStatus,
            total: rentTotal,
            paid: Math.floor(rentTotal * 0.85) // Mock 85% paid
          }
        }));

        // Count members using SECURITY DEFINER function
        const { data: memberCountData } = await supabase
          .rpc('count_property_members', { p_property_id: propertyMember.properties.id });

        const totalMembers = memberCountData || 1;
        setMemberCount(totalMembers);

        // Load roommates (other members of same property)
        const { data: members } = await supabase
          .from('property_members')
          .select(`
            user_id,
            role,
            users (
              full_name,
              avatar_url
            )
          `)
          .eq('property_id', propertyMember.properties.id)
          .eq('status', 'active')
          .neq('user_id', user.id);

        if (members) {
          setRoommates(members);
          setStats(prev => ({
            ...prev,
            roommatesCount: members.length
          }));
        }
      }

    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const rentPercentage = (stats.rentStatus.paid / stats.rentStatus.total) * 100;

  const kpiCards = [
    {
      title: 'Loyer du Mois',
      value: `€${stats.rentStatus.paid}/${stats.rentStatus.total}`,
      subtitle: `Échéance: ${new Date(stats.rentStatus.dueDate).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}`,
      icon: Home,
      gradientStyle: { background: 'linear-gradient(135deg, #d9574f 0%, #ff5b21 50%, #ff8017 100%)' },
      bgStyle: { background: 'linear-gradient(135deg, #d9574f 0%, #ff5b21 50%, #ff8017 100%)', opacity: 0.1 },
      progress: rentPercentage,
      importance: 'critical', // Loyer = très important
      onboardingId: undefined,
    },
    {
      title: 'Dépenses Partagées',
      value: `€${stats.sharedExpenses}`,
      subtitle: 'À répartir',
      icon: DollarSign,
      gradientStyle: { background: 'linear-gradient(135deg, #d9574f 0%, #ff5b21 50%, #ff8017 100%)' },
      bgStyle: { background: 'linear-gradient(135deg, #d9574f 0%, #ff5b21 50%, #ff8017 100%)', opacity: 0.1 },
      action: () => router.push('/hub/finances'),
      importance: 'high', // Important mais pas critique
      onboardingId: 'finances-card',
    },
    {
      title: 'Ton Solde',
      value: stats.yourBalance > 0 ? `+€${stats.yourBalance}` : `-€${Math.abs(stats.yourBalance)}`,
      subtitle: stats.yourBalance > 0 ? 'On te doit' : 'Tu dois',
      icon: TrendingUp,
      gradientStyle: stats.yourBalance > 0 ? { background: 'linear-gradient(to bottom right, #10b981, #14b8a680)' } : { background: 'linear-gradient(135deg, #d9574f 0%, #ff5b21 50%, #ff8017 100%)' },
      bgStyle: stats.yourBalance > 0 ? { background: 'linear-gradient(to bottom right, #10b98120, #14b8a610)' } : { background: 'linear-gradient(135deg, #d9574f 0%, #ff5b21 50%, #ff8017 100%)', opacity: 0.1 },
      action: () => router.push('/hub/finances'),
      importance: 'medium', // Informatif
      onboardingId: undefined,
    },
    {
      title: 'Colocataires',
      value: stats.roommatesCount,
      subtitle: 'Membres actifs',
      icon: Users,
      gradientStyle: { background: 'linear-gradient(135deg, #d9574f 0%, #ff5b21 50%, #ff8017 100%)' },
      bgStyle: { background: 'linear-gradient(135deg, #d9574f 0%, #ff5b21 50%, #ff8017 100%)', opacity: 0.1 },
      action: () => router.push('/hub/members'),
      importance: 'medium', // Informatif
      onboardingId: 'members-card',
    },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <LoadingHouse size={64} />
          <p className="text-gray-600 font-medium">Chargement du hub...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Stripe Upgrade Notification */}
      <UpgradeNotification />

      {/* Glassmorphism background with resident orange gradient */}
      <div className="fixed inset-0 -z-10">
        {/* Base gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#d9574f]/20 via-[#ff5b21]/15 to-[#ff8017]/10" />

        {/* Animated gradient blobs */}
        <div className="absolute top-0 -left-4 w-96 h-96 bg-[#d9574f]/30 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob" />
        <div className="absolute top-0 -right-4 w-96 h-96 bg-[#ff5b21]/30 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000" />
        <div className="absolute -bottom-8 left-20 w-96 h-96 bg-[#ff8017]/30 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000" />

        {/* Glass effect overlay */}
        <div className="absolute inset-0 backdrop-blur-3xl bg-white/40" />
      </div>

      {/* Residence Header at the top */}
      <ResidenceHeader />

      {/* Subscription Banner */}
      {userId && (
        <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 mt-4">
          <SubscriptionBanner userId={userId} />
        </div>
      )}

      {/* Content */}
      <>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8 mt-6">
        {/* Getting Started Checklist - Only show if not dismissed and loaded */}
        {gettingStarted.isLoaded && !gettingStarted.isDismissed && !gettingStarted.isAllComplete && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <GettingStartedChecklist
              items={gettingStarted.items}
              completedCount={gettingStarted.completedCount}
              totalCount={gettingStarted.totalCount}
              progress={gettingStarted.progress}
              isAllComplete={gettingStarted.isAllComplete}
              onDismiss={gettingStarted.dismissChecklist}
              onCompleteItem={gettingStarted.completeItem}
              variant="resident"
            />
          </motion.div>
        )}

      {/* KPI Cards Grid */}
      <div data-onboarding="kpi-cards" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {kpiCards.map((card, index) => {
          const Icon = card.icon;

          return (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={card.action}
              data-onboarding={card.onboardingId}
              className={cn(
                "relative overflow-hidden rounded-3xl p-6 cursor-pointer transition-all hover:scale-105",
                "bg-white shadow-lg hover:shadow-xl",
                card.action && "hover:ring-2"
              )}
              style={card.action ? { '--tw-ring-color': '#ee5736' } as React.CSSProperties : undefined}
            >
              {/* Gradient Background */}
              <div
                className="absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-20"
                style={card.bgStyle}
              />

              <div className="relative z-10">
                {/* Icon with grain texture based on importance */}
                <div
                  className={cn(
                    "relative w-12 h-12 rounded-2xl flex items-center justify-center mb-4 overflow-hidden shadow-sm border border-gray-200",
                    card.importance === 'critical' && "grain-medium",
                    card.importance === 'high' && "grain-subtle"
                  )}
                  style={card.gradientStyle}
                >
                  <Icon className="w-6 h-6 text-white relative z-10" />
                </div>

                {/* Title */}
                <h3 className="text-sm font-medium text-gray-600 mb-2">
                  {card.title}
                </h3>

                {/* Value */}
                <p className="text-2xl font-bold text-gray-900 mb-2">
                  {card.value}
                </p>

                {/* Subtitle or Progress */}
                {card.progress !== undefined ? (
                  <>
                    <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{
                          width: `${card.progress}%`,
                          background: 'linear-gradient(135deg, #d9574f 0%, #ff5b21 50%, #ff8017 100%)'
                        }}
                      />
                    </div>
                    <p className="text-xs text-gray-500">{card.subtitle}</p>
                  </>
                ) : (
                  <p className="text-sm text-gray-500">{card.subtitle}</p>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Upcoming Tasks */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          data-onboarding="tasks-section"
          className="bg-white rounded-3xl shadow-lg p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #d9574f 0%, #ff5b21 50%, #ff8017 100%)' }}>
                <Clock className="w-5 h-5 text-white" />
              </div>
              Tâches à Venir
            </h3>
            <Button
              onClick={() => router.push('/hub/tasks')}
              variant="ghost"
              size="sm"
              className="rounded-full"
            >
              Tout voir
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </div>

          <div className="space-y-3">
            {upcomingTasks.map((task, index) => (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + index * 0.05 }}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-xl transition-colors cursor-pointer"
                onMouseEnter={(e) => e.currentTarget.style.background = 'linear-gradient(135deg, rgba(217, 87, 79, 0.06) 0%, rgba(255, 128, 23, 0.06) 100%)'}
                onMouseLeave={(e) => e.currentTarget.style.background = '#f9fafb'}
              >
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center",
                    task.priority === 'high' && "bg-red-100",
                    task.priority === 'medium' && "bg-yellow-100",
                    task.priority === 'low' && "bg-green-100"
                  )}>
                    <Clock className={cn(
                      "w-5 h-5",
                      task.priority === 'high' && "text-red-600",
                      task.priority === 'medium' && "text-yellow-600",
                      task.priority === 'low' && "text-green-600"
                    )} />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{task.title}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(task.dueDate).toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'short'
                      })}
                    </p>
                  </div>
                </div>
                <Badge variant={task.priority === 'high' ? 'error' : 'default'}>
                  {task.priority === 'high' ? 'Urgent' : task.priority === 'medium' ? 'Moyen' : 'Bas'}
                </Badge>
              </motion.div>
            ))}
          </div>

          <Button
            onClick={() => router.push('/hub/tasks')}
            variant="outline"
            className="w-full mt-4 rounded-full"
          >
            <Plus className="w-4 h-4 mr-2" />
            Ajouter une tâche
          </Button>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-3xl shadow-lg p-6"
        >
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #d9574f 0%, #ff5b21 50%, #ff8017 100%)' }}>
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            Activité Récente
          </h3>

          <div className="space-y-3">
            {recentActivities.map((activity, index) => {
              const Icon = activity.icon;
              return (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 + index * 0.05 }}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  <div className={cn("w-10 h-10 rounded-full flex items-center justify-center", activity.iconBgColor)}>
                    <Icon className="w-5 h-5 text-gray-700" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 text-sm">{activity.title}</p>
                    <p className="text-xs text-gray-500">{activity.subtitle}</p>
                  </div>
                  <span className="text-xs text-gray-400">{activity.time}</span>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>

      {/* Community Happiness */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-sm border border-gray-200 p-6 relative overflow-hidden"
      >
        <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(217, 87, 79, 0.12) 0%, transparent 50%, rgba(255, 128, 23, 0.06) 100%)' }} />
        <div className="relative flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold mb-1 flex items-center gap-2 text-gray-900">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center border border-gray-200"
                style={{ background: 'linear-gradient(135deg, #d9574f 0%, #ff5b21 50%, #ff8017 100%)' }}
              >
                <Heart className="w-5 h-5 text-white" />
              </div>
              Bonheur de la Coloc
            </h3>
            <p className="text-gray-600 text-sm ml-12">Basé sur l'activité et les interactions</p>
          </div>
          <div className="text-right">
            <p className="text-5xl font-bold text-gray-900">{stats.communityHappiness}%</p>
            <p className="text-gray-600 text-sm mt-1">Excellent!</p>
          </div>
        </div>
      </motion.div>
      </div>
      </>

      {/* Onboarding Tour */}
      <OnboardingTour
        isActive={onboarding.isActive}
        currentStep={onboarding.currentStep}
        currentStepData={onboarding.currentStepData}
        totalSteps={onboarding.totalSteps}
        onNext={onboarding.nextStep}
        onPrev={onboarding.prevStep}
        onSkip={onboarding.skipTour}
        onComplete={onboarding.endTour}
        variant="resident"
      />
    </div>
  );
}
