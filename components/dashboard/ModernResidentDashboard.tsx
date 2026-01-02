'use client';

import { useEffect, useState, memo } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/auth/supabase-client';
import { motion } from 'framer-motion';
import LoadingHouse from '@/components/ui/LoadingHouse';
import SplitAsymmetricHeader from '@/components/dashboard/SplitAsymmetricHeader';
import {
  Users,
  MessageCircle,
  DollarSign,
  Home,
  TrendingUp,
  TrendingDown,
  Check,
  Clock,
  ArrowRight,
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
} from '@/components/onboarding';
import { useLanguage } from '@/lib/i18n/use-language';

// V3 Option C - Official Resident Palette
const RESIDENT_GRADIENT = 'linear-gradient(135deg, #e05747 0%, #ff651e 50%, #ff9014 100%)';
const RESIDENT_PRIMARY = '#ff651e';
const CARD_BG_GRADIENT = 'linear-gradient(135deg, #FFF5F0 0%, #FFEDE5 100%)';
const ACCENT_SHADOW = 'rgba(255, 101, 30, 0.15)';
// Semantic Pastel Colors (Option C)
const SEMANTIC_SUCCESS = '#7CB89B';
const SEMANTIC_SUCCESS_BG = 'linear-gradient(135deg, #F0F7F4 0%, #E8F5EE 100%)';
const SEMANTIC_ERROR = '#D08080';
const SEMANTIC_ERROR_BG = 'linear-gradient(135deg, #FDF5F5 0%, #FAE8E8 100%)';

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
  const { language, getSection } = useLanguage();
  const resident = getSection('dashboard')?.resident;
  const [isLoading, setIsLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | undefined>(undefined);
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
      iconBgColor: 'rgba(124, 184, 155, 0.15)', // Pastel green semantic
      iconColor: SEMANTIC_SUCCESS,
      title: 'Sarah a payé les courses',
      subtitle: '€45.50',
      time: 'Il y a 2h'
    },
    {
      id: '2',
      icon: MessageCircle,
      iconBgColor: 'rgba(255, 101, 30, 0.1)', // Orange brand
      iconColor: RESIDENT_PRIMARY,
      title: 'Nouveau message de Marc',
      subtitle: 'Groupe "Ma Coloc"',
      time: 'Il y a 4h'
    },
    {
      id: '3',
      icon: Check,
      iconBgColor: 'rgba(124, 184, 155, 0.15)', // Pastel green semantic
      iconColor: SEMANTIC_SUCCESS,
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
      title: resident?.onboarding?.welcome?.title || 'Bienvenue dans ton Hub ! 🏠',
      description: resident?.onboarding?.welcome?.description || 'Ici tu retrouves un aperçu de ta coloc : loyer, dépenses partagées et solde avec tes colocs.',
      position: 'bottom',
    },
    {
      id: 'finances',
      target: '[data-onboarding="finances-card"]',
      title: resident?.onboarding?.finances?.title || 'Gère tes finances',
      description: resident?.onboarding?.finances?.description || 'Clique ici pour voir le détail des dépenses partagées et équilibrer les comptes avec tes colocs.',
      position: 'bottom',
    },
    {
      id: 'members',
      target: '[data-onboarding="members-card"]',
      title: resident?.onboarding?.members?.title || 'Tes colocataires',
      description: resident?.onboarding?.members?.description || 'Retrouve tous les membres de ta coloc, invite de nouveaux colocs ou anticipe les départs.',
      position: 'bottom',
    },
    {
      id: 'tasks',
      target: '[data-onboarding="tasks-section"]',
      title: resident?.onboarding?.tasks?.title || 'Organise la vie commune',
      description: resident?.onboarding?.tasks?.description || 'Planifie les tâches ménagères, les réunions et les échéances importantes de la coloc.',
      position: 'right',
    },
  ];

  const onboarding = useOnboarding({
    tourId: 'resident-dashboard-tour',
    steps: residentOnboardingSteps,
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

      // Load user name
      const { data: userData } = await supabase
        .from('users')
        .select('full_name')
        .eq('id', user.id)
        .single();

      if (userData?.full_name) {
        // Get first name only
        const firstName = userData.full_name.split(' ')[0];
        setUserName(firstName);
      }

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

  // Get locale code for date formatting
  const localeMap: { [key: string]: string } = {
    fr: 'fr-FR',
    en: 'en-US',
    nl: 'nl-NL',
    de: 'de-DE',
  };
  const locale = localeMap[language] || 'fr-FR';

  // V2 Fun KPI Cards Configuration
  const kpiCards = [
    {
      title: resident?.monthlyRent || 'Loyer du Mois',
      value: `€${stats.rentStatus.paid}/${stats.rentStatus.total}`,
      subtitle: `${resident?.dueDate || 'Échéance'}: ${new Date(stats.rentStatus.dueDate).toLocaleDateString(locale, { day: 'numeric', month: 'short' })}`,
      icon: Home,
      iconGradient: RESIDENT_GRADIENT,
      bgGradient: CARD_BG_GRADIENT,
      shadowColor: ACCENT_SHADOW,
      progress: rentPercentage,
      onboardingId: undefined,
    },
    {
      title: resident?.sharedExpenses || 'Dépenses Partagées',
      value: `€${stats.sharedExpenses}`,
      subtitle: resident?.toSplit || 'À répartir',
      icon: DollarSign,
      iconGradient: RESIDENT_GRADIENT,
      bgGradient: CARD_BG_GRADIENT,
      shadowColor: ACCENT_SHADOW,
      action: () => router.push('/hub/finances'),
      onboardingId: 'finances-card',
    },
    {
      title: resident?.yourBalance || 'Ton Solde',
      value: stats.yourBalance > 0 ? `+€${stats.yourBalance}` : `-€${Math.abs(stats.yourBalance)}`,
      subtitle: stats.yourBalance > 0 ? (resident?.owedToYou || 'On te doit') : (resident?.youOwe || 'Tu dois'),
      icon: stats.yourBalance > 0 ? TrendingUp : TrendingDown,
      iconGradient: stats.yourBalance > 0
        ? `linear-gradient(135deg, ${SEMANTIC_SUCCESS} 0%, #9ECDB5 100%)`  // Pastel green
        : `linear-gradient(135deg, ${SEMANTIC_ERROR} 0%, #E0A0A0 100%)`,   // Pastel red
      bgGradient: stats.yourBalance > 0 ? SEMANTIC_SUCCESS_BG : SEMANTIC_ERROR_BG,
      shadowColor: stats.yourBalance > 0 ? 'rgba(124, 184, 155, 0.15)' : 'rgba(208, 128, 128, 0.15)',
      action: () => router.push('/hub/finances'),
      onboardingId: undefined,
    },
    {
      title: resident?.roommates || 'Colocataires',
      value: stats.roommatesCount,
      subtitle: resident?.activeMembers || 'Membres actifs',
      icon: Users,
      iconGradient: RESIDENT_GRADIENT,  // Orange brand, not purple
      bgGradient: CARD_BG_GRADIENT,
      shadowColor: ACCENT_SHADOW,
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
          <p className="text-gray-600 font-medium">{resident?.loadingHub || 'Loading hub...'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Stripe Upgrade Notification */}
      <UpgradeNotification />

      {/* Glassmorphism background with resident orange gradient - V3 Official Palette */}
      <div className="fixed inset-0 -z-10">
        {/* Base gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#e05747]/10 via-[#ff651e]/8 to-[#ff9014]/5" />

        {/* Animated gradient blobs */}
        <div className="absolute top-0 -left-4 w-96 h-96 bg-[#e05747]/20 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-blob" />
        <div className="absolute top-0 -right-4 w-96 h-96 bg-[#ff651e]/20 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-blob animation-delay-2000" />
        <div className="absolute -bottom-8 left-20 w-96 h-96 bg-[#ff9014]/20 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-blob animation-delay-4000" />

        {/* Glass effect overlay */}
        <div className="absolute inset-0 backdrop-blur-3xl bg-white/50" />
      </div>

      {/* Split Asymmetric Header - V3 Fun Layout */}
      <div className="max-w-7xl mx-auto pt-6">
        <SplitAsymmetricHeader userName={userName} />
      </div>

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
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8 mt-4"
      >
        {/* KPI Cards Grid - Compact Style */}
        <motion.div
          data-onboarding="kpi-cards"
          variants={containerVariants}
          className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6"
        >
          {kpiCards.map((card, index) => {
            const Icon = card.icon;

            return (
              <motion.div
                key={card.title}
                variants={itemVariants}
                whileHover={{ scale: 1.02, y: -3 }}
                whileTap={{ scale: 0.98 }}
                onClick={card.action}
                data-onboarding={card.onboardingId}
                className={cn(
                  "relative overflow-hidden rounded-2xl p-4 cursor-pointer transition-all",
                  "bg-white"
                )}
                style={{
                  boxShadow: `0 8px 24px ${card.shadowColor}`,
                }}
              >
                {/* Decorative circle */}
                <div
                  className="absolute -right-6 -top-6 w-20 h-20 rounded-full opacity-25"
                  style={{ background: card.iconGradient }}
                />

                <div className="relative z-10">
                  {/* Icon */}
                  <motion.div
                    whileHover={{ rotate: 5 }}
                    className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
                    style={{ background: card.iconGradient }}
                  >
                    <Icon className="w-5 h-5 text-white" />
                  </motion.div>

                  {/* Title */}
                  <h3 className="text-xs font-medium text-gray-500 mb-0.5">
                    {card.title}
                  </h3>

                  {/* Value */}
                  <p className="text-xl font-black text-gray-900 mb-1">
                    {card.value}
                  </p>

                  {/* Subtitle or Progress */}
                  {card.progress !== undefined ? (
                    <>
                      <div className="w-full bg-gray-100 rounded-full h-1.5 mb-1 overflow-hidden">
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
                    <p className="text-xs text-gray-500">{card.subtitle}</p>
                  )}
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Two Column Layout - Compact */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Upcoming Tasks - Compact Style */}
          <motion.div
            variants={itemVariants}
            data-onboarding="tasks-section"
            className="relative overflow-hidden bg-white rounded-2xl p-5"
            style={{ boxShadow: `0 8px 24px ${ACCENT_SHADOW}` }}
          >
            {/* Decorative circle */}
            <div
              className="absolute -right-10 -top-10 w-28 h-28 rounded-full opacity-20"
              style={{ background: RESIDENT_GRADIENT }}
            />

            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                  <motion.div
                    whileHover={{ rotate: 5 }}
                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ background: RESIDENT_GRADIENT }}
                  >
                    <Clock className="w-4 h-4 text-white" />
                  </motion.div>
                  {resident?.upcomingTasks || 'Tâches à Venir'}
                </h3>
                <Button
                  onClick={() => router.push('/hub/tasks')}
                  variant="ghost"
                  size="sm"
                  className="rounded-full font-medium text-xs h-8 px-3"
                  style={{ color: RESIDENT_PRIMARY }}
                >
                  {resident?.viewAll || 'Tout voir'}
                  <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </Button>
              </div>

              <div className="space-y-2">
                {upcomingTasks.map((task, index) => (
                  <motion.div
                    key={task.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.06 }}
                    whileHover={{ x: 3, backgroundColor: 'rgba(255, 101, 30, 0.04)' }}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-xl transition-all cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className={cn(
                        "w-8 h-8 rounded-lg flex items-center justify-center",
                        task.priority === 'high' && "bg-[#FDF5F5]",
                        task.priority === 'medium' && "bg-[#FFF5F0]",
                        task.priority === 'low' && "bg-gray-100"
                      )}>
                        <Clock className={cn(
                          "w-4 h-4",
                          task.priority === 'high' && "text-[#D08080]",
                          task.priority === 'medium' && "text-[#ff7b19]",
                          task.priority === 'low' && "text-gray-500"
                        )} />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 text-sm">{task.title}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(task.dueDate).toLocaleDateString(locale, {
                            day: 'numeric',
                            month: 'short'
                          })}
                        </p>
                      </div>
                    </div>
                    <Badge
                      className="border-none font-medium text-xs px-2 py-0.5"
                      style={{
                        background: task.priority === 'high' ? 'rgba(208, 128, 128, 0.15)' : task.priority === 'medium' ? 'rgba(255, 123, 25, 0.1)' : 'rgba(156, 163, 175, 0.15)',
                        color: task.priority === 'high' ? '#D08080' : task.priority === 'medium' ? '#ff7b19' : '#6B7280',
                      }}
                    >
                      {task.priority === 'high' ? (resident?.priorityUrgent || 'Urgent') : task.priority === 'medium' ? (resident?.priorityMedium || 'Moyen') : (resident?.priorityLow || 'Bas')}
                    </Badge>
                  </motion.div>
                ))}
              </div>

              <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                <Button
                  onClick={() => router.push('/hub/tasks')}
                  variant="outline"
                  size="sm"
                  className="w-full mt-3 rounded-xl border-2 py-4 font-semibold"
                  style={{
                    borderColor: `${RESIDENT_PRIMARY}30`,
                    color: RESIDENT_PRIMARY,
                  }}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  {resident?.addTask || 'Ajouter une tâche'}
                </Button>
              </motion.div>
            </div>
          </motion.div>

          {/* Recent Activity - Compact Style */}
          <motion.div
            variants={itemVariants}
            className="relative overflow-hidden bg-white rounded-2xl p-5"
            style={{ boxShadow: `0 8px 24px ${ACCENT_SHADOW}` }}
          >
            {/* Decorative circle - V3 Orange */}
            <div
              className="absolute -left-10 -bottom-10 w-28 h-28 rounded-full opacity-20"
              style={{ background: RESIDENT_GRADIENT }}
            />

            <div className="relative z-10">
              <h3 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
                <motion.div
                  whileHover={{ rotate: 5 }}
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ background: RESIDENT_GRADIENT }}
                >
                  <Sparkles className="w-4 h-4 text-white" />
                </motion.div>
                {resident?.recentActivity || 'Activité Récente'}
              </h3>

              <div className="space-y-2">
                {recentActivities.map((activity, index) => {
                  const Icon = activity.icon;
                  return (
                    <motion.div
                      key={activity.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.06 }}
                      whileHover={{ x: 3 }}
                      className="flex items-center gap-2.5 p-2.5 rounded-xl hover:bg-gray-50 transition-all cursor-pointer"
                    >
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{ background: activity.iconBgColor }}
                      >
                        <Icon className="w-4 h-4" style={{ color: activity.iconColor }} />
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
