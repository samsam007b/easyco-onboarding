'use client';

import { useEffect, useState, memo } from 'react';
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

// V2 Fun Design Colors
const RESIDENT_GRADIENT = 'linear-gradient(135deg, #d9574f 0%, #ff5b21 50%, #ff8017 100%)';
const RESIDENT_PRIMARY = '#ee5736';
const CARD_BG_GRADIENT = 'linear-gradient(135deg, #fff5f3 0%, #ffe8e0 100%)';
const ACCENT_SHADOW = 'rgba(238, 87, 54, 0.15)';

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
  iconColor: string;
  title: string;
  subtitle: string;
  time: string;
}

const ModernResidentDashboard = memo(function ModernResidentDashboard() {
  const router = useRouter();
  const supabase = createClient();
  const [isLoading, setIsLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [currentProperty, setCurrentProperty] = useState<any>(null);
  const [roommates, setRoommates] = useState<any[]>([]);
  const [memberCount, setMemberCount] = useState(1);
  const [stats, setStats] = useState<DashboardStats>({
    rentStatus: {
      paid: 1062,
      total: 1250,
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
      iconBgColor: 'rgba(16, 185, 129, 0.1)',
      iconColor: '#10b981',
      title: 'Sarah a payé les courses',
      subtitle: '€45.50',
      time: 'Il y a 2h'
    },
    {
      id: '2',
      icon: MessageCircle,
      iconBgColor: 'rgba(59, 130, 246, 0.1)',
      iconColor: '#3b82f6',
      title: 'Nouveau message de Marc',
      subtitle: 'Groupe "Ma Coloc"',
      time: 'Il y a 4h'
    },
    {
      id: '3',
      icon: Check,
      iconBgColor: 'rgba(16, 185, 129, 0.1)',
      iconColor: '#10b981',
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

  // V2 Fun KPI Cards Configuration
  const kpiCards = [
    {
      title: 'Loyer du Mois',
      value: `€${stats.rentStatus.paid}/${stats.rentStatus.total}`,
      subtitle: `Échéance: ${new Date(stats.rentStatus.dueDate).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}`,
      icon: Home,
      iconGradient: RESIDENT_GRADIENT,
      bgGradient: CARD_BG_GRADIENT,
      shadowColor: ACCENT_SHADOW,
      progress: rentPercentage,
      onboardingId: undefined,
    },
    {
      title: 'Dépenses Partagées',
      value: `€${stats.sharedExpenses}`,
      subtitle: 'À répartir',
      icon: DollarSign,
      iconGradient: RESIDENT_GRADIENT,
      bgGradient: CARD_BG_GRADIENT,
      shadowColor: ACCENT_SHADOW,
      action: () => router.push('/hub/finances'),
      onboardingId: 'finances-card',
    },
    {
      title: 'Ton Solde',
      value: stats.yourBalance > 0 ? `+€${stats.yourBalance}` : `-€${Math.abs(stats.yourBalance)}`,
      subtitle: stats.yourBalance > 0 ? 'On te doit' : 'Tu dois',
      icon: TrendingUp,
      iconGradient: stats.yourBalance > 0 ? 'linear-gradient(135deg, #10b981 0%, #14b8a6 100%)' : RESIDENT_GRADIENT,
      bgGradient: stats.yourBalance > 0 ? 'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)' : CARD_BG_GRADIENT,
      shadowColor: stats.yourBalance > 0 ? 'rgba(16, 185, 129, 0.15)' : ACCENT_SHADOW,
      action: () => router.push('/hub/finances'),
      onboardingId: undefined,
    },
    {
      title: 'Colocataires',
      value: stats.roommatesCount,
      subtitle: 'Membres actifs',
      icon: Users,
      iconGradient: 'linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%)',
      bgGradient: 'linear-gradient(135deg, #f5f3ff 0%, #ede9fe 100%)',
      shadowColor: 'rgba(139, 92, 246, 0.15)',
      action: () => router.push('/hub/members'),
      onboardingId: 'members-card',
    },
  ];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

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
        <div className="absolute inset-0 bg-gradient-to-br from-[#d9574f]/10 via-[#ff5b21]/8 to-[#ff8017]/5" />

        {/* Animated gradient blobs */}
        <div className="absolute top-0 -left-4 w-96 h-96 bg-[#d9574f]/20 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-blob" />
        <div className="absolute top-0 -right-4 w-96 h-96 bg-[#ff5b21]/20 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-blob animation-delay-2000" />
        <div className="absolute -bottom-8 left-20 w-96 h-96 bg-[#ff8017]/20 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-blob animation-delay-4000" />

        {/* Glass effect overlay */}
        <div className="absolute inset-0 backdrop-blur-3xl bg-white/50" />
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
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8 mt-6"
      >
        {/* Getting Started Checklist - Only show if not dismissed and loaded */}
        {gettingStarted.isLoaded && !gettingStarted.isDismissed && !gettingStarted.isAllComplete && (
          <motion.div variants={itemVariants} className="mb-6">
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

        {/* KPI Cards Grid - V2 Fun Style */}
        <motion.div
          data-onboarding="kpi-cards"
          variants={containerVariants}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          {kpiCards.map((card, index) => {
            const Icon = card.icon;

            return (
              <motion.div
                key={card.title}
                variants={itemVariants}
                whileHover={{ scale: 1.03, y: -6 }}
                whileTap={{ scale: 0.98 }}
                onClick={card.action}
                data-onboarding={card.onboardingId}
                className={cn(
                  "relative overflow-hidden rounded-2xl p-5 cursor-pointer transition-all",
                  "bg-white"
                )}
                style={{
                  boxShadow: `0 12px 32px ${card.shadowColor}`,
                }}
              >
                {/* Decorative circle */}
                <div
                  className="absolute -right-8 -top-8 w-28 h-28 rounded-full opacity-30"
                  style={{ background: card.iconGradient }}
                />

                <div className="relative z-10">
                  {/* Icon */}
                  <motion.div
                    whileHover={{ rotate: 5 }}
                    className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                    style={{ background: card.iconGradient }}
                  >
                    <Icon className="w-6 h-6 text-white" />
                  </motion.div>

                  {/* Title */}
                  <h3 className="text-sm font-medium text-gray-500 mb-1">
                    {card.title}
                  </h3>

                  {/* Value */}
                  <p className="text-2xl font-black text-gray-900 mb-2">
                    {card.value}
                  </p>

                  {/* Subtitle or Progress */}
                  {card.progress !== undefined ? (
                    <>
                      <div className="w-full bg-gray-100 rounded-full h-2 mb-2 overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${card.progress}%` }}
                          transition={{ duration: 1, ease: 'easeOut' }}
                          className="h-full rounded-full"
                          style={{ background: RESIDENT_GRADIENT }}
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
        </motion.div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Upcoming Tasks - V2 Fun Style */}
          <motion.div
            variants={itemVariants}
            data-onboarding="tasks-section"
            className="relative overflow-hidden bg-white rounded-2xl p-6"
            style={{ boxShadow: `0 12px 32px ${ACCENT_SHADOW}` }}
          >
            {/* Decorative circle */}
            <div
              className="absolute -right-12 -top-12 w-36 h-36 rounded-full opacity-20"
              style={{ background: RESIDENT_GRADIENT }}
            />

            <div className="relative z-10">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-3">
                  <motion.div
                    whileHover={{ rotate: 5 }}
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ background: RESIDENT_GRADIENT }}
                  >
                    <Clock className="w-5 h-5 text-white" />
                  </motion.div>
                  Tâches à Venir
                </h3>
                <Button
                  onClick={() => router.push('/hub/tasks')}
                  variant="ghost"
                  size="sm"
                  className="rounded-full font-medium"
                  style={{ color: RESIDENT_PRIMARY }}
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
                    transition={{ delay: index * 0.08 }}
                    whileHover={{ x: 4, backgroundColor: 'rgba(238, 87, 54, 0.04)' }}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-xl transition-all cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "w-10 h-10 rounded-xl flex items-center justify-center",
                        task.priority === 'high' && "bg-red-50",
                        task.priority === 'medium' && "bg-amber-50",
                        task.priority === 'low' && "bg-emerald-50"
                      )}>
                        <Clock className={cn(
                          "w-5 h-5",
                          task.priority === 'high' && "text-red-500",
                          task.priority === 'medium' && "text-amber-500",
                          task.priority === 'low' && "text-emerald-500"
                        )} />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{task.title}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(task.dueDate).toLocaleDateString('fr-FR', {
                            day: 'numeric',
                            month: 'short'
                          })}
                        </p>
                      </div>
                    </div>
                    <Badge
                      className="border-none font-medium"
                      style={{
                        background: task.priority === 'high' ? 'rgba(239, 68, 68, 0.1)' : task.priority === 'medium' ? 'rgba(245, 158, 11, 0.1)' : 'rgba(16, 185, 129, 0.1)',
                        color: task.priority === 'high' ? '#ef4444' : task.priority === 'medium' ? '#f59e0b' : '#10b981',
                      }}
                    >
                      {task.priority === 'high' ? 'Urgent' : task.priority === 'medium' ? 'Moyen' : 'Bas'}
                    </Badge>
                  </motion.div>
                ))}
              </div>

              <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                <Button
                  onClick={() => router.push('/hub/tasks')}
                  variant="outline"
                  className="w-full mt-4 rounded-xl border-2 py-5 font-semibold"
                  style={{
                    borderColor: `${RESIDENT_PRIMARY}30`,
                    color: RESIDENT_PRIMARY,
                  }}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Ajouter une tâche
                </Button>
              </motion.div>
            </div>
          </motion.div>

          {/* Recent Activity - V2 Fun Style */}
          <motion.div
            variants={itemVariants}
            className="relative overflow-hidden bg-white rounded-2xl p-6"
            style={{ boxShadow: `0 12px 32px ${ACCENT_SHADOW}` }}
          >
            {/* Decorative circle */}
            <div
              className="absolute -left-12 -bottom-12 w-36 h-36 rounded-full opacity-20"
              style={{ background: 'linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%)' }}
            />

            <div className="relative z-10">
              <h3 className="text-lg font-bold text-gray-900 mb-5 flex items-center gap-3">
                <motion.div
                  whileHover={{ rotate: 5 }}
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background: RESIDENT_GRADIENT }}
                >
                  <Sparkles className="w-5 h-5 text-white" />
                </motion.div>
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
                      transition={{ delay: index * 0.08 }}
                      whileHover={{ x: 4 }}
                      className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-all cursor-pointer"
                    >
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center"
                        style={{ background: activity.iconBgColor }}
                      >
                        <Icon className="w-5 h-5" style={{ color: activity.iconColor }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 text-sm truncate">{activity.title}</p>
                        <p className="text-xs text-gray-500">{activity.subtitle}</p>
                      </div>
                      <span className="text-xs text-gray-400 whitespace-nowrap">{activity.time}</span>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Community Happiness - V2 Fun Style */}
        <motion.div
          variants={itemVariants}
          whileHover={{ scale: 1.01 }}
          className="relative overflow-hidden bg-white rounded-2xl p-6"
          style={{ boxShadow: `0 12px 32px ${ACCENT_SHADOW}` }}
        >
          {/* Decorative gradient background */}
          <div
            className="absolute inset-0 opacity-30"
            style={{ background: CARD_BG_GRADIENT }}
          />

          {/* Decorative circles */}
          <div
            className="absolute -right-16 -top-16 w-48 h-48 rounded-full opacity-20"
            style={{ background: RESIDENT_GRADIENT }}
          />
          <div
            className="absolute -left-8 -bottom-8 w-24 h-24 rounded-full opacity-15"
            style={{ background: 'linear-gradient(135deg, #ff8017 0%, #ff5b21 100%)' }}
          />

          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <motion.div
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-12 h-12 rounded-xl flex items-center justify-center"
                style={{ background: RESIDENT_GRADIENT }}
              >
                <Heart className="w-6 h-6 text-white" />
              </motion.div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">
                  Bonheur de la Coloc
                </h3>
                <p className="text-gray-500 text-sm">Basé sur l'activité et les interactions</p>
              </div>
            </div>
            <div className="text-right">
              <motion.p
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 200 }}
                className="text-5xl font-black"
                style={{ color: RESIDENT_PRIMARY }}
              >
                {stats.communityHappiness}%
              </motion.p>
              <p className="text-gray-500 text-sm mt-1 font-medium">Excellent!</p>
            </div>
          </div>
        </motion.div>
      </motion.div>

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
});

export default ModernResidentDashboard;
