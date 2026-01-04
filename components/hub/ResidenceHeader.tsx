'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { createClient } from '@/lib/auth/supabase-client';
import { logger } from '@/lib/utils/logger';
import { Home, Users, MapPin, Sparkles, Plus, UserPlus, FileText, Vote, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { InvitePopup } from '@/components/referral';
import { useLanguage } from '@/lib/i18n/use-language';

// Premium Soft Coral/Terracotta palette - warm but not aggressive
const RESIDENT_GRADIENT = 'linear-gradient(135deg, #b87d6a 0%, #c9907d 50%, #daa390 100%)';
const CARD_BG_GRADIENT = 'linear-gradient(135deg, #fdf8f6 0%, #f8efe9 100%)';
const ACCENT_SHADOW = 'rgba(184, 125, 106, 0.20)';
const RESIDENT_PRIMARY = '#c9907d';

interface PropertyInfo {
  id: string;
  title: string;
  city: string;
  address: string;
  memberCount: number;
  hasPhoto: boolean;
  invitationCode?: string;
  ownerCode?: string;
  isCreator?: boolean;
}

interface CompletionData {
  percentage: number;
  nextSteps: string[];
}

export default function ResidenceHeader() {
  const router = useRouter();
  const supabase = createClient();
  const { getSection } = useLanguage();
  const hub = getSection('dashboard')?.hub?.residenceHeader;

  const [propertyInfo, setPropertyInfo] = useState<PropertyInfo | null>(null);
  const [completion, setCompletion] = useState<CompletionData>({ percentage: 0, nextSteps: [] });
  const [isLoading, setIsLoading] = useState(true);
  const [showInviteModal, setShowInviteModal] = useState(false);

  useEffect(() => {
    loadPropertyInfo();
  }, []);

  const loadPropertyInfo = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Try to get from sessionStorage first (faster, avoids RLS issues)
      const cachedProperty = sessionStorage.getItem('currentProperty');
      let propertyId: string | null = null;
      let propertyData: any = null;

      if (cachedProperty) {
        try {
          propertyData = JSON.parse(cachedProperty);
          propertyId = propertyData.id;
          logger.debug('Using cached property from sessionStorage');
        } catch (e) {
          logger.error('Error parsing cached property', e);
        }
      }

      // If not in cache, query from database using SECURITY DEFINER function
      if (!propertyId) {
        const { data: membershipData, error: memberError } = await supabase
          .rpc('get_user_property_membership', { p_user_id: user.id });

        if (memberError || !membershipData?.property_id) {
          // Check if we just created a property (to avoid redirect loop)
          const justCreated = sessionStorage.getItem('justCreatedProperty');
          if (justCreated) {
            const timeSinceCreation = Date.now() - parseInt(justCreated);
            if (timeSinceCreation < 10000) { // Less than 10 seconds ago
              logger.debug('Property just created, waiting for data to sync');
              return; // Don't redirect, stay on hub
            }
          }

          logger.debug('No property membership found, redirecting to onboarding');
          router.push('/onboarding/resident/property-setup');
          return;
        }

        propertyId = membershipData.property_id;

        // Fetch property details including invitation codes
        const { data: property } = await supabase
          .from('properties')
          .select('id, title, city, address, images, invitation_code, owner_code')
          .eq('id', propertyId)
          .single();

        if (!property) return;
        propertyData = property;

        // Cache it for next time
        sessionStorage.setItem('currentProperty', JSON.stringify({
          id: property.id,
          title: property.title,
          city: property.city,
          address: property.address
        }));
      }

      // If we only have cached data, fetch full property details
      if (!propertyData.images) {
        const { data: property } = await supabase
          .from('properties')
          .select('id, title, city, address, images')
          .eq('id', propertyId)
          .single();

        if (property) {
          propertyData = property;
        }
      }

      // Count members using SECURITY DEFINER function
      const { data: memberCount, error: countError } = await supabase
        .rpc('count_property_members', { p_property_id: propertyId });

      if (countError) {
        logger.error('Error counting members', countError);
      }

      // Get user's membership info to check if creator
      const { data: userMembership } = await supabase
        .rpc('get_user_property_membership', { p_user_id: user.id });

      // Check if property has photo
      const hasPhoto = propertyData.images && propertyData.images.length > 0;

      setPropertyInfo({
        id: propertyData.id,
        title: propertyData.title,
        city: propertyData.city,
        address: propertyData.address,
        memberCount: memberCount || 1,
        hasPhoto,
        invitationCode: propertyData.invitation_code,
        ownerCode: propertyData.owner_code,
        isCreator: userMembership?.is_creator || false,
      });

      // Calculate completion
      await calculateCompletion(propertyData.id, memberCount || 1, hasPhoto);

      setIsLoading(false);
    } catch (error) {
      logger.error('Error loading property info', error);
      setIsLoading(false);
    }
  };

  const calculateCompletion = async (propertyId: string, memberCount: number, hasPhoto: boolean) => {
    let percentage = 20; // Base: residence created
    const nextSteps: string[] = [];

    // Check member count (20%)
    if (memberCount >= 2) {
      percentage += 20;
    } else {
      nextSteps.push(hub?.stepInviteRoommates || 'Inviter des colocataires');
    }

    // Check if photo added (15%)
    if (hasPhoto) {
      percentage += 15;
    } else {
      nextSteps.push(hub?.stepAddPhoto || 'Ajouter une photo de la résidence');
    }

    // Check expenses (30% total)
    const { count: expenseCount } = await supabase
      .from('expenses')
      .select('*', { count: 'exact', head: true })
      .eq('property_id', propertyId);

    if (expenseCount && expenseCount >= 1) {
      percentage += 15; // First expense
      if (expenseCount >= 3) {
        percentage += 15; // 3+ expenses
      } else {
        const remaining = 3 - expenseCount;
        const addMoreText = hub?.stepAddMoreExpenses || 'Ajouter {count} dépenses de plus';
        nextSteps.push(addMoreText.replace('{count}', remaining.toString()));
      }
    } else {
      nextSteps.push(hub?.stepCreateFirstExpense || 'Créer votre première dépense');
    }

    // Check tasks (15%)
    const { count: taskCount } = await supabase
      .from('tasks')
      .select('*', { count: 'exact', head: true })
      .eq('property_id', propertyId);

    if (taskCount && taskCount >= 1) {
      percentage += 15;
    } else {
      nextSteps.push(hub?.stepSetupTasks || 'Configurer des tâches');
    }

    setCompletion({ percentage, nextSteps });
  };

  if (isLoading || !propertyInfo) {
    return (
      <div
        className="relative overflow-hidden p-6 superellipse-3xl mb-6 mx-2 sm:mx-6 lg:mx-8 animate-pulse"
        style={{
          background: RESIDENT_GRADIENT,
          boxShadow: `0 20px 60px ${ACCENT_SHADOW}`,
        }}
      >
        <div className="h-20 bg-white/20 superellipse-2xl" />
      </div>
    );
  }

  const isComplete = completion.percentage >= 100;

  // Quick action buttons config
  const quickActions = [
    { icon: Plus, label: hub?.actionExpense || 'Dépense', onClick: () => router.push('/hub/finances') },
    { icon: FileText, label: hub?.actionDocuments || 'Documents', onClick: () => router.push('/hub/documents') },
    { icon: Vote, label: hub?.actionRules || 'Règles', onClick: () => router.push('/hub/rules') },
    { icon: UserPlus, label: hub?.actionInvite || 'Inviter', onClick: () => setShowInviteModal(true) },
  ];

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden p-6 superellipse-3xl mx-2 sm:mx-6 lg:mx-8 mb-6"
        style={{
          background: RESIDENT_GRADIENT,
          boxShadow: `0 20px 60px ${ACCENT_SHADOW}`,
        }}
      >
        {/* Decorative circles */}
        <div className="absolute -right-16 -top-16 w-48 h-48 rounded-full bg-white/10" />
        <div className="absolute -left-10 -bottom-10 w-32 h-32 rounded-full bg-white/10" />
        <div className="absolute right-1/4 -bottom-8 w-24 h-24 rounded-full bg-white/5" />

        <div className="relative z-10">
          {/* Main content row */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
            {/* Left: Property Info */}
            <div className="flex items-start gap-4">
              <motion.div
                whileHover={{ rotate: 5 }}
                className="w-14 h-14 superellipse-2xl bg-white/20 backdrop-blur flex items-center justify-center flex-shrink-0"
              >
                <Home className="w-7 h-7 text-white" />
              </motion.div>

              <div className="flex-1 min-w-0">
                <h2 className="text-2xl font-black text-white mb-1.5 truncate">
                  {propertyInfo.title}
                </h2>

                <div className="flex flex-wrap items-center gap-4">
                  <div className="flex items-center gap-1.5 bg-white/15 backdrop-blur px-3 py-1.5 rounded-full">
                    <MapPin className="w-4 h-4 text-white" />
                    <span className="text-white font-medium text-sm">{propertyInfo.city}</span>
                  </div>

                  <div className="flex items-center gap-1.5 bg-white/15 backdrop-blur px-3 py-1.5 rounded-full">
                    <Users className="w-4 h-4 text-white" />
                    <span className="text-white font-medium text-sm">
                      {propertyInfo.memberCount} {propertyInfo.memberCount > 1 ? (hub?.roommates || 'colocataires') : (hub?.roommate || 'colocataire')}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Quick Actions */}
            <div className="flex items-center gap-2 flex-shrink-0 flex-wrap">
              {quickActions.map((action, index) => {
                const Icon = action.icon;
                return (
                  <motion.div key={index} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      onClick={action.onClick}
                      size="sm"
                      className="bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur superellipse-xl font-semibold"
                      variant="outline"
                    >
                      <Icon className="w-4 h-4 mr-1.5" />
                      {action.label}
                    </Button>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Progress Section */}
          {!isComplete && completion.nextSteps.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-5 pt-5 border-t border-white/20"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                  >
                    <Sparkles className="w-5 h-5 text-white" />
                  </motion.div>
                  <span className="font-bold text-white">
                    {hub?.completeResidence || 'Complétez votre résidence'}
                  </span>
                </div>
                <span className="font-black text-xl text-white">
                  {completion.percentage}%
                </span>
              </div>

              {/* Progress bar */}
              <div className="relative h-3 w-full overflow-hidden rounded-full bg-white/20 mb-4">
                <motion.div
                  className="h-full rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${completion.percentage}%` }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                  style={{
                    background: 'linear-gradient(90deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.75) 100%)'
                  }}
                />
              </div>

              {/* Next steps */}
              <div className="flex flex-wrap gap-2">
                {completion.nextSteps.slice(0, 3).map((step, index) => {
                  const handleStepClick = (stepText: string) => {
                    if (stepText.includes('Inviter')) {
                      setShowInviteModal(true);
                    } else if (stepText.includes('photo')) {
                      router.push('/settings/residence-profile');
                    } else if (stepText.includes('dépense')) {
                      router.push('/hub/finances');
                    } else if (stepText.includes('tâches')) {
                      router.push('/hub/tasks');
                    }
                  };

                  const isClickable = step.includes('Inviter') || step.includes('photo') || step.includes('dépense') || step.includes('tâches');

                  return isClickable ? (
                    <motion.button
                      key={index}
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleStepClick(step)}
                      className="bg-white/20 backdrop-blur px-4 py-2 superellipse-xl hover:bg-white/30 transition-colors cursor-pointer flex items-center gap-2 text-white"
                    >
                      <span className="font-semibold text-sm">{step}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </motion.button>
                  ) : (
                    <span
                      key={index}
                      className="bg-white/20 backdrop-blur px-4 py-2 superellipse-xl font-semibold text-sm text-white"
                    >
                      {step}
                    </span>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* Celebration for completion */}
          {isComplete && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-5 pt-5 border-t border-white/20"
            >
              <div className="flex items-center gap-3 bg-white/20 backdrop-blur superellipse-2xl p-4">
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-10 h-10 superellipse-xl bg-white/20 flex items-center justify-center"
                >
                  <Sparkles className="w-5 h-5 text-white" />
                </motion.div>
                <span className="text-white font-bold text-lg">
                  🎉 {hub?.congratulations || 'Félicitations ! Votre résidence est complète !'}
                </span>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* Invite Popup */}
      <InvitePopup
        isOpen={showInviteModal}
        onClose={() => setShowInviteModal(false)}
        showResidenceCodes={true}
        propertyInfo={{
          invitationCode: propertyInfo.invitationCode,
          ownerCode: propertyInfo.ownerCode,
          isCreator: propertyInfo.isCreator,
        }}
      />
    </>
  );
}
