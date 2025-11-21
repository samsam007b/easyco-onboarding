'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/auth/supabase-client';
import { motion } from 'framer-motion';
import LoadingHouse from '@/components/ui/LoadingHouse';
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
  ChevronDown,
  Trophy,
  Target,
  FileText,
  Plus,
  Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

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
  const [currentProperty, setCurrentProperty] = useState<any>(null);
  const [roommates, setRoommates] = useState<any[]>([]);
  const [profileCompletion, setProfileCompletion] = useState(0);
  const [showCompletionDetails, setShowCompletionDetails] = useState(false);
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

      // Load profile completion
      const { data: userData } = await supabase
        .from('users')
        .select('full_name, avatar_url')
        .eq('id', user.id)
        .single();

      const { data: userProfile } = await supabase
        .from('user_profiles')
        .select('financial_info, community_preferences, extended_personality, advanced_preferences, verification_status')
        .eq('user_id', user.id)
        .single();

      // Calculate profile completion
      let completed = 0;
      const total = 6;

      if (userData?.full_name && userData?.avatar_url) completed++;
      if (userProfile?.financial_info) completed++;
      if (userProfile?.community_preferences) completed++;
      if (userProfile?.extended_personality) completed++;
      if (userProfile?.advanced_preferences) completed++;
      if (userProfile?.verification_status === 'verified') completed++;

      setProfileCompletion(Math.round((completed / total) * 100));

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
            monthly_rent
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
      gradient: 'from-[#D97B6F] via-[#E8865D] to-[#FF8C4B]',
      bg: 'from-resident-50 to-resident-100',
      progress: rentPercentage,
      importance: 'critical' // Loyer = très important
    },
    {
      title: 'Dépenses Partagées',
      value: `€${stats.sharedExpenses}`,
      subtitle: 'À répartir',
      icon: DollarSign,
      gradient: 'from-[#E8865D] to-[#FF8C4B]',
      bg: 'from-resident-50 to-resident-100',
      action: () => router.push('/hub/finances'),
      importance: 'high' // Important mais pas critique
    },
    {
      title: 'Ton Solde',
      value: stats.yourBalance > 0 ? `+€${stats.yourBalance}` : `-€${Math.abs(stats.yourBalance)}`,
      subtitle: stats.yourBalance > 0 ? 'On te doit' : 'Tu dois',
      icon: TrendingUp,
      gradient: stats.yourBalance > 0 ? 'from-emerald-500 to-emerald-700' : 'from-red-500 to-red-700',
      bg: stats.yourBalance > 0 ? 'from-emerald-50 to-emerald-100/50' : 'from-red-50 to-red-100/50',
      action: () => router.push('/hub/finances'),
      importance: 'medium' // Informatif
    },
    {
      title: 'Colocataires',
      value: stats.roommatesCount,
      subtitle: 'Membres actifs',
      icon: Users,
      gradient: 'from-[#D97B6F] to-[#E8865D]',
      bg: 'from-resident-50 to-resident-100',
      action: () => router.push('/hub/members'),
      importance: 'medium' // Informatif
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
    <>
      {/* Profile Completion Widget - Outside container to match residence width */}
      {profileCompletion < 100 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="max-w-7xl mx-auto bg-gradient-to-br from-resident-50 to-resident-100 backdrop-blur-sm rounded-b-2xl rounded-t-none p-4 border-l border-r border-b border-resident-200 hover:shadow-md transition-all mb-6 mx-2 sm:mx-6 lg:mx-8"
        >
          <button
            onClick={() => setShowCompletionDetails(!showCompletionDetails)}
            className="w-full flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              {/* Small Progress Circle */}
              <div className="relative w-12 h-12">
                <svg className="w-12 h-12 transform -rotate-90">
                  <defs>
                    <linearGradient id="residentCompletionGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#D97B6F" />
                      <stop offset="50%" stopColor="#E8865D" />
                      <stop offset="100%" stopColor="#FF8C4B" />
                    </linearGradient>
                  </defs>
                  <circle cx="24" cy="24" r="20" fill="none" stroke="#e5e7eb" strokeWidth="3" />
                  <circle
                    cx="24" cy="24" r="20"
                    fill="none"
                    stroke="url(#residentCompletionGradient)"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 20}`}
                    strokeDashoffset={`${2 * Math.PI * 20 * (1 - profileCompletion / 100)}`}
                    className="transition-all duration-500"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xs font-bold bg-gradient-to-r from-[#D97B6F] via-[#E8865D] to-[#FF8C4B] bg-clip-text text-transparent">
                    {profileCompletion}%
                  </span>
                </div>
              </div>

              <div className="text-left">
                <h3 className="text-sm font-semibold text-gray-900">Complétion du profil</h3>
                <p className="text-xs text-gray-600">
                  {profileCompletion === 100 ? "Profil complet" : `${6 - Math.round((profileCompletion / 100) * 6)} section${6 - Math.round((profileCompletion / 100) * 6) > 1 ? 's' : ''} à compléter`}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {profileCompletion === 100 && <Trophy className="w-5 h-5 text-yellow-600" />}
              <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${showCompletionDetails ? 'rotate-180' : ''}`} />
            </div>
          </button>

          {/* Dropdown Details */}
          {showCompletionDetails && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mt-4 pt-4 border-t border-orange-200/30 space-y-3"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-600">Informations de base</span>
                  <span className="font-semibold text-gray-900">✓</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                  <div className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-emerald-600" style={{ width: '100%' }} />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-600">Infos financières</span>
                  <Target className="w-3.5 h-3.5 text-gray-400" />
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                  <div className="h-full rounded-full bg-gradient-to-r from-blue-500 to-blue-600" style={{ width: '33%' }} />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-600">Préférences communauté</span>
                  <Target className="w-3.5 h-3.5 text-gray-400" />
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                  <div className="h-full rounded-full bg-gradient-to-r from-purple-500 to-purple-600" style={{ width: '50%' }} />
                </div>
              </div>

              <Button
                onClick={() => router.push('/profile')}
                className="cta-resident w-full mt-2 rounded-full"
                size="sm"
              >
                Compléter mon profil
              </Button>
            </motion.div>
          )}
        </motion.div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {kpiCards.map((card, index) => {
          const Icon = card.icon;

          return (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={card.action}
              className={cn(
                "relative overflow-hidden rounded-3xl p-6 cursor-pointer transition-all hover:scale-105",
                "bg-white shadow-lg hover:shadow-xl",
                card.action && "hover:ring-2 hover:ring-orange-500"
              )}
            >
              {/* Gradient Background */}
              <div className={cn(
                "absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-20",
                `bg-gradient-to-br ${card.bg}`
              )} />

              <div className="relative z-10">
                {/* Icon with grain texture based on importance */}
                <div className={cn(
                  "relative w-12 h-12 rounded-2xl flex items-center justify-center mb-4 overflow-hidden shadow-lg",
                  `bg-gradient-to-br ${card.gradient}`,
                  card.importance === 'critical' && "grain-medium",
                  card.importance === 'high' && "grain-subtle"
                )}>
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
                        className={cn(
                          "h-full rounded-full transition-all",
                          `bg-gradient-to-r ${card.gradient}`
                        )}
                        style={{ width: `${card.progress}%` }}
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

      {/* Current Property Section */}
      {currentProperty && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-3xl shadow-lg p-6 mb-8"
        >
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Home className="w-5 h-5 text-orange-600" />
            Ta Résidence
          </h3>

          <div className="flex flex-col md:flex-row gap-6">
            {/* Property Image */}
            <div className="relative h-48 md:h-auto md:w-64 bg-gradient-to-br from-orange-100 to-orange-200 rounded-2xl overflow-hidden flex-shrink-0">
              {currentProperty.main_image ? (
                <img
                  src={currentProperty.main_image}
                  alt={currentProperty.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Home className="w-16 h-16 text-orange-400" />
                </div>
              )}
            </div>

            {/* Property Details */}
            <div className="flex-1">
              <h4 className="text-xl font-bold text-gray-900 mb-2">
                {currentProperty.title}
              </h4>
              <p className="text-gray-600 mb-4">
                {currentProperty.address}, {currentProperty.city}
              </p>

              {/* Roommates */}
              {roommates.length > 0 && (
                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">Tes colocataires :</p>
                  <div className="flex flex-wrap gap-3">
                    {roommates.map((member: any, index: number) => (
                      <div key={index} className="flex items-center gap-2 px-3 py-2 bg-orange-50 rounded-full">
                        {member.users?.avatar_url ? (
                          <img
                            src={member.users.avatar_url}
                            alt={member.users?.full_name || 'User'}
                            className="w-6 h-6 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-6 h-6 rounded-full bg-orange-600 flex items-center justify-center text-xs text-white font-bold">
                            {member.users?.full_name?.charAt(0) || '?'}
                          </div>
                        )}
                        <span className="text-sm font-medium text-gray-900">
                          {member.users?.full_name || 'Utilisateur'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-3">
                <Button
                  onClick={() => router.push('/hub/members')}
                  className="cta-resident rounded-full"
                >
                  <Users className="w-4 h-4 mr-2" />
                  Voir les membres
                </Button>
                <Button
                  onClick={() => router.push('/messages')}
                  variant="outline"
                  className="rounded-full border-resident-300 hover:bg-resident-50 text-resident-700"
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Chat de groupe
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Upcoming Tasks */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-3xl shadow-lg p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <Clock className="w-5 h-5 text-orange-600" />
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
                className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-orange-50 transition-colors cursor-pointer"
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
            <Sparkles className="w-5 h-5 text-orange-600" />
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
        className="bg-gradient-to-r from-[#D97B6F] via-[#E8865D] to-[#FF8C4B] rounded-3xl shadow-lg p-6 text-white"
      >
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold mb-1 flex items-center gap-2">
              <Heart className="w-5 h-5" />
              Bonheur de la Coloc
            </h3>
            <p className="text-orange-200 text-sm">Basé sur l'activité et les interactions</p>
          </div>
          <div className="text-right">
            <p className="text-5xl font-bold">{stats.communityHappiness}%</p>
            <p className="text-orange-200 text-sm mt-1">Excellent!</p>
          </div>
        </div>
      </motion.div>
      </div>
    </>
  );
}
