'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { createClient } from '@/lib/auth/supabase-client';
import { logger } from '@/lib/utils/logger';
import {
  Home,
  Users,
  MapPin,
  Plus,
  UserPlus,
  FileText,
  Vote,
  Sparkles,
  ChevronRight,
  Calendar,
  Settings,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { InvitePopup } from '@/components/referral';
import { useLanguage } from '@/lib/i18n/use-language';

// V3 Option C - Official Resident Palette
const RESIDENT_GRADIENT = 'linear-gradient(135deg, #e05747 0%, #e05747 50%, #e05747 100%)';
const RESIDENT_GRADIENT_SOFT = 'linear-gradient(135deg, #e0574720 0%, #e0574715 50%, #e0574710 100%)';
const RESIDENT_PRIMARY = '#e05747';
const CARD_BG_GRADIENT = 'linear-gradient(135deg, #FFF5F0 0%, #FFEDE5 100%)';
const ACCENT_SHADOW = 'rgba(255, 101, 30, 0.15)';

interface PropertyInfo {
  id: string;
  title: string;
  city: string;
  address: string;
  memberCount: number;
  hasPhoto: boolean;
  mainImage?: string;
  invitationCode?: string;
  ownerCode?: string;
  isCreator?: boolean;
}

interface CompletionData {
  percentage: number;
  nextSteps: string[];
}

interface SplitAsymmetricHeaderProps {
  userName?: string;
}

export default function SplitAsymmetricHeader({ userName }: SplitAsymmetricHeaderProps) {
  const router = useRouter();
  const supabase = createClient();
  const { getSection, language } = useLanguage();
  const hub = getSection('dashboard')?.hub?.residenceHeader;
  const resident = getSection('dashboard')?.resident;

  const [propertyInfo, setPropertyInfo] = useState<PropertyInfo | null>(null);
  const [completion, setCompletion] = useState<CompletionData>({ percentage: 0, nextSteps: [] });
  const [isLoading, setIsLoading] = useState(true);
  const [showInviteModal, setShowInviteModal] = useState(false);

  // Get locale for date formatting
  const localeMap: { [key: string]: string } = { fr: 'fr-FR', en: 'en-US', nl: 'nl-NL', de: 'de-DE' };
  const locale = localeMap[language] || 'fr-FR';

  // Get current date formatted
  const currentDate = new Date().toLocaleDateString(locale, {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });

  useEffect(() => {
    loadPropertyInfo();
  }, []);

  const loadPropertyInfo = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Try to get from sessionStorage first
      const cachedProperty = sessionStorage.getItem('currentProperty');
      let propertyId: string | null = null;
      let propertyData: any = null;

      if (cachedProperty) {
        try {
          propertyData = JSON.parse(cachedProperty);
          propertyId = propertyData.id;
        } catch (e) {
          logger.error('Error parsing cached property', e);
        }
      }

      // If not in cache, query from database
      if (!propertyId) {
        const { data: membershipData, error: memberError } = await supabase
          .rpc('get_user_property_membership', { p_user_id: user.id });

        if (memberError || !membershipData?.property_id) {
          const justCreated = sessionStorage.getItem('justCreatedProperty');
          if (justCreated) {
            const timeSinceCreation = Date.now() - parseInt(justCreated);
            if (timeSinceCreation < 10000) return;
          }
          router.push('/onboarding/resident/property-setup');
          return;
        }

        propertyId = membershipData.property_id;
      }

      // Fetch full property details
      const { data: property } = await supabase
        .from('properties')
        .select('id, title, city, address, images, main_image, invitation_code, owner_code')
        .eq('id', propertyId)
        .single();

      if (!property) return;
      propertyData = property;

      // Count members
      const { data: memberCount } = await supabase
        .rpc('count_property_members', { p_property_id: propertyId });

      // Get user's membership info
      const { data: userMembership } = await supabase
        .rpc('get_user_property_membership', { p_user_id: user.id });

      const hasPhoto = propertyData.images && propertyData.images.length > 0;

      setPropertyInfo({
        id: propertyData.id,
        title: propertyData.title,
        city: propertyData.city,
        address: propertyData.address,
        memberCount: memberCount || 1,
        hasPhoto,
        mainImage: propertyData.main_image || (propertyData.images && propertyData.images[0]),
        invitationCode: propertyData.invitation_code,
        ownerCode: propertyData.owner_code,
        isCreator: userMembership?.is_creator || false,
      });

      await calculateCompletion(propertyData.id, memberCount || 1, hasPhoto);
      setIsLoading(false);
    } catch (error) {
      logger.error('Error loading property info', error);
      setIsLoading(false);
    }
  };

  const calculateCompletion = async (propertyId: string, memberCount: number, hasPhoto: boolean) => {
    let percentage = 20;
    const nextSteps: string[] = [];

    if (memberCount >= 2) {
      percentage += 20;
    } else {
      nextSteps.push(hub?.stepInviteRoommates || 'Inviter des colocataires');
    }

    if (hasPhoto) {
      percentage += 15;
    } else {
      nextSteps.push(hub?.stepAddPhoto || 'Ajouter une photo');
    }

    const { count: expenseCount } = await supabase
      .from('expenses')
      .select('*', { count: 'exact', head: true })
      .eq('property_id', propertyId);

    if (expenseCount && expenseCount >= 1) {
      percentage += 15;
      if (expenseCount >= 3) {
        percentage += 15;
      }
    } else {
      nextSteps.push(hub?.stepCreateFirstExpense || 'Créer une dépense');
    }

    const { count: taskCount } = await supabase
      .from('tasks')
      .select('*', { count: 'exact', head: true })
      .eq('property_id', propertyId);

    if (taskCount && taskCount >= 1) {
      percentage += 15;
    }

    setCompletion({ percentage, nextSteps });
  };

  // Quick actions config
  const quickActions = [
    { icon: Plus, label: hub?.actionExpense || 'Dépense', onClick: () => router.push('/hub/finances'), primary: true },
    { icon: FileText, label: hub?.actionDocuments || 'Docs', onClick: () => router.push('/hub/documents') },
    { icon: Vote, label: hub?.actionRules || 'Règles', onClick: () => router.push('/hub/rules') },
    { icon: UserPlus, label: hub?.actionInvite || 'Inviter', onClick: () => setShowInviteModal(true) },
  ];

  if (isLoading) {
    return (
      <div className="flex gap-6 mx-2 sm:mx-6 lg:mx-8 mb-6">
        {/* Loading skeleton - Property card */}
        <div className="w-72 flex-shrink-0">
          <div className="h-64 bg-gray-100 superellipse-3xl animate-pulse" />
        </div>
        {/* Loading skeleton - Main content */}
        <div className="flex-1">
          <div className="h-24 bg-gray-100 superellipse-3xl animate-pulse mb-4" />
          <div className="h-16 bg-gray-100 superellipse-3xl animate-pulse" />
        </div>
      </div>
    );
  }

  if (!propertyInfo) return null;

  const isComplete = completion.percentage >= 100;

  // Circular progress component
  const CircularProgress = ({ percentage }: { percentage: number }) => {
    const radius = 28;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
      <div className="relative w-16 h-16">
        <svg className="w-full h-full transform -rotate-90">
          <circle
            cx="32"
            cy="32"
            r={radius}
            stroke="rgba(255, 255, 255, 0.3)"
            strokeWidth="4"
            fill="none"
          />
          <motion.circle
            cx="32"
            cy="32"
            r={radius}
            stroke="white"
            strokeWidth="4"
            fill="none"
            strokeLinecap="round"
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1, ease: 'easeOut' }}
            style={{ strokeDasharray: circumference }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-white font-black text-sm">{percentage}%</span>
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="flex flex-col lg:flex-row gap-4 lg:gap-6 mx-2 sm:mx-6 lg:mx-8 mb-6">
        {/* LEFT: Compact Property Card */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full lg:w-72 flex-shrink-0"
        >
          <div
            className="relative overflow-hidden p-5 h-full min-h-[200px] superellipse-3xl"
            style={{
              background: RESIDENT_GRADIENT,
              boxShadow: `0 20px 60px ${ACCENT_SHADOW}`,
            }}
          >
            {/* Decorative elements */}
            <div className="absolute -right-10 -top-10 w-32 h-32 rounded-full bg-white/10" />
            <div className="absolute -left-6 -bottom-6 w-20 h-20 rounded-full bg-white/10" />

            <div className="relative z-10 flex flex-col h-full justify-between">
              {/* Property icon and title */}
              <div>
                <motion.div
                  whileHover={{ rotate: 5, scale: 1.05 }}
                  className="w-12 h-12 bg-white/20 backdrop-blur superellipse-xl flex items-center justify-center mb-4"
                >
                  <Home className="w-6 h-6 text-white" />
                </motion.div>

                <h3 className="text-xl font-black text-white mb-2 leading-tight">
                  {propertyInfo.title}
                </h3>

                <div className="flex items-center gap-1.5 text-white/80 text-sm mb-3">
                  <MapPin className="w-3.5 h-3.5" />
                  <span className="font-medium">{propertyInfo.city}</span>
                </div>

                {/* Member pills */}
                <div className="flex items-center gap-2 bg-white/15 backdrop-blur px-3 py-2 w-fit rounded-full">
                  <Users className="w-4 h-4 text-white" />
                  <span className="text-white font-semibold text-sm">
                    {propertyInfo.memberCount} {propertyInfo.memberCount > 1 ? 'colocs' : 'coloc'}
                  </span>
                </div>
              </div>

              {/* Bottom: Progress or Invite button */}
              <div className="mt-4 flex items-center justify-between">
                {!isComplete ? (
                  <CircularProgress percentage={completion.percentage} />
                ) : (
                  <div className="flex items-center gap-2 bg-white/20 backdrop-blur px-3 py-2 rounded-full">
                    <motion.div
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="flex items-center gap-2"
                    >
                      <Sparkles className="w-4 h-4 text-white" />
                      <span className="text-white font-bold text-sm">Complet!</span>
                    </motion.div>
                  </div>
                )}

                <button
                  onClick={() => setShowInviteModal(true)}
                  className="flex items-center gap-1.5 bg-white text-gray-900 px-4 py-2 font-bold text-sm shadow-lg superellipse-xl hover:scale-105 active:scale-95 transition-transform"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Inviter</span>
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* RIGHT: Welcome + Quick Actions */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="flex-1 flex flex-col gap-4"
        >
          {/* Welcome Section */}
          <div
            className="relative overflow-hidden p-6 bg-white superellipse-2xl"
            style={{ boxShadow: `0 12px 32px ${ACCENT_SHADOW}` }}
          >
            {/* Decorative gradient blob */}
            <div
              className="absolute -right-16 -top-16 w-40 h-40 rounded-full opacity-30"
              style={{ background: RESIDENT_GRADIENT }}
            />

            <div className="relative z-10">
              {/* Date pill */}
              <div className="inline-flex items-center gap-2 bg-gray-100 px-3 py-1.5 mb-3 rounded-full">
                <Calendar className="w-3.5 h-3.5 text-gray-500" />
                <span className="text-sm text-gray-600 font-medium capitalize">{currentDate}</span>
              </div>

              {/* Welcome message */}
              <h2 className="text-2xl lg:text-3xl font-black text-gray-900 mb-1">
                {resident?.welcomeBack || 'Bienvenue'}{userName ? `, ${userName}` : ''} !
              </h2>
              <p className="text-gray-500 font-medium">
                {resident?.welcomeSubtitle || 'Voici un aperçu de ta coloc'}
              </p>
            </div>
          </div>

          {/* Quick Actions Row */}
          <div
            className="relative overflow-hidden p-4 bg-white superellipse-2xl"
            style={{ boxShadow: `0 8px 24px ${ACCENT_SHADOW}` }}
          >
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
              {quickActions.map((action, index) => {
                const Icon = action.icon;
                return (
                  <button
                    key={index}
                    onClick={action.onClick}
                    className={`
                      flex items-center gap-2 px-4 py-2.5 font-semibold text-sm superellipse-xl
                      transition-all whitespace-nowrap flex-shrink-0
                      hover:scale-103 hover:-translate-y-0.5 active:scale-97
                      ${action.primary
                        ? 'text-white shadow-lg'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }
                    `}
                    style={action.primary ? { background: RESIDENT_GRADIENT } : undefined}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{action.label}</span>
                  </button>
                );
              })}

              {/* Settings shortcut */}
              <button
                onClick={() => router.push('/settings/residence-profile')}
                className="flex items-center gap-2 px-4 py-2.5 font-semibold text-sm bg-gray-100 text-gray-700 hover:bg-gray-200 superellipse-xl transition-all whitespace-nowrap flex-shrink-0 hover:scale-103 hover:-translate-y-0.5 active:scale-97"
              >
                <Settings className="w-4 h-4" />
                <span>{hub?.actionSettings || 'Paramètres'}</span>
              </button>
            </div>
          </div>

          {/* Next steps hint (if not complete) */}
          {!isComplete && completion.nextSteps.length > 0 && (
            <div
              className="flex items-center gap-3 px-4 py-3 superellipse-xl"
              style={{ background: RESIDENT_GRADIENT_SOFT }}
            >
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="flex items-center gap-3 w-full"
              >
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                >
                  <Sparkles className="w-5 h-5" style={{ color: RESIDENT_PRIMARY }} />
                </motion.div>
                <span className="text-sm font-medium text-gray-700">
                  {hub?.nextStep || 'Prochaine étape'}: <span className="font-bold">{completion.nextSteps[0]}</span>
                </span>
                <ChevronRight className="w-4 h-4 text-gray-400 ml-auto" />
              </motion.div>
            </div>
          )}
        </motion.div>
      </div>

      {/* Invite Popup */}
      <InvitePopup
        isOpen={showInviteModal}
        onClose={() => setShowInviteModal(false)}
        showResidenceCodes={true}
        propertyInfo={{
          invitationCode: propertyInfo?.invitationCode,
          ownerCode: propertyInfo?.ownerCode,
          isCreator: propertyInfo?.isCreator,
        }}
      />
    </>
  );
}
