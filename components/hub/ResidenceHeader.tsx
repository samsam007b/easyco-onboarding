'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/auth/supabase-client';
import { logger } from '@/lib/utils/logger';
import { Home, Users, MapPin, Sparkles, Plus, UserPlus, Copy, X, Check, FileText, Vote } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

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
  const [propertyInfo, setPropertyInfo] = useState<PropertyInfo | null>(null);
  const [completion, setCompletion] = useState<CompletionData>({ percentage: 0, nextSteps: [] });
  const [isLoading, setIsLoading] = useState(true);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

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
      nextSteps.push('Inviter des colocataires');
    }

    // Check if photo added (15%)
    if (hasPhoto) {
      percentage += 15;
    } else {
      nextSteps.push('Ajouter une photo de la résidence');
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
        nextSteps.push(`Ajouter ${3 - expenseCount} dépenses de plus`);
      }
    } else {
      nextSteps.push('Créer votre première dépense');
    }

    // Check tasks (15%)
    const { count: taskCount } = await supabase
      .from('tasks')
      .select('*', { count: 'exact', head: true })
      .eq('property_id', propertyId);

    if (taskCount && taskCount >= 1) {
      percentage += 15;
    } else {
      nextSteps.push('Configurer des tâches');
    }

    setCompletion({ percentage, nextSteps });
  };

  const copyToClipboard = (code: string, type: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(type);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  if (isLoading || !propertyInfo) {
    return (
      <div className="bg-gradient-to-r from-[#D97B6F] via-[#E8865D] to-[#FF8C4B] p-4 rounded-2xl mb-6 mx-2 sm:mx-6 lg:mx-8 animate-pulse">
        <div className="h-16 bg-white/20 rounded-xl"></div>
      </div>
    );
  }

  const isComplete = completion.percentage >= 100;

  return (
    <>
    <Card className="p-6 rounded-2xl mx-2 sm:mx-6 lg:mx-8 border-none shadow-lg mb-6" style={{ background: 'linear-gradient(135deg, #d9574f 0%, #ff5b21 50%, #ff8017 100%)' }}>
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        {/* Left: Property Info */}
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center flex-shrink-0">
            <Home className="w-6 h-6 text-white" />
          </div>

          <div className="flex-1 min-w-0">
            <h2 className="text-xl font-bold text-white mb-1 truncate">
              {propertyInfo.title}
            </h2>

            <div className="flex flex-wrap items-center gap-3 text-white text-sm">
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4 text-white" />
                <span className="text-white">{propertyInfo.city}</span>
              </div>

              <div className="flex items-center gap-1">
                <Users className="w-4 h-4 text-white" />
                <span className="text-white">{propertyInfo.memberCount} {propertyInfo.memberCount > 1 ? 'colocataires' : 'colocataire'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Quick Actions */}
        <div className="flex items-center gap-2 flex-shrink-0 flex-wrap">
          <Button
            onClick={() => router.push('/hub/finances')}
            size="sm"
            className="bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur"
            variant="outline"
          >
            <Plus className="w-4 h-4 mr-1" />
            Dépense
          </Button>

          <Button
            onClick={() => router.push('/hub/documents')}
            size="sm"
            className="bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur"
            variant="outline"
          >
            <FileText className="w-4 h-4 mr-1" />
            Documents
          </Button>

          <Button
            onClick={() => router.push('/hub/rules')}
            size="sm"
            className="bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur"
            variant="outline"
          >
            <Vote className="w-4 h-4 mr-1" />
            Règles
          </Button>

          <Button
            onClick={() => setShowInviteModal(true)}
            size="sm"
            className="bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur"
            variant="outline"
          >
            <UserPlus className="w-4 h-4 mr-1" />
            Inviter
          </Button>
        </div>
      </div>

      {/* Progress Section */}
      {!isComplete && completion.nextSteps.length > 0 && (
        <div className="mt-4 pt-4 border-t border-white/20">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-white" />
              <span className="text-white font-medium text-sm">
                Complétez votre résidence
              </span>
            </div>
            <span className="text-white font-bold text-sm">
              {completion.percentage}%
            </span>
          </div>

          <div className="relative h-2 w-full overflow-hidden rounded-full bg-white/20 mb-3">
            <div
              className="h-full transition-all"
              style={{
                width: `${completion.percentage}%`,
                background: 'linear-gradient(90deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.7) 100%)'
              }}
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {completion.nextSteps.slice(0, 3).map((step, index) => {
              const handleStepClick = (stepText: string) => {
                if (stepText.includes('Inviter')) {
                  setShowInviteModal(true);
                } else if (stepText.includes('photo')) {
                  router.push('/settings/residence-profile');
                } else if (stepText.includes('dépense')) {
                  router.push('/hub/finances');
                }
              };

              const isClickable = step.includes('Inviter') || step.includes('photo') || step.includes('dépense');

              return isClickable ? (
                <button
                  key={index}
                  onClick={() => handleStepClick(step)}
                  className="text-xs bg-white/20 backdrop-blur text-white px-3 py-1.5 rounded-full hover:bg-white/30 transition-colors cursor-pointer"
                >
                  {step}
                </button>
              ) : (
                <span
                  key={index}
                  className="text-xs bg-white/20 backdrop-blur text-white px-3 py-1 rounded-full"
                >
                  {step}
                </span>
              );
            })}
          </div>
        </div>
      )}

      {/* Celebration for completion */}
      {isComplete && (
        <div className="mt-4 pt-4 border-t border-white/20">
          <div className="flex items-center gap-2 text-white">
            <Sparkles className="w-5 h-5 animate-pulse" />
            <span className="font-medium">
              🎉 Félicitations ! Votre résidence est complète !
            </span>
          </div>
        </div>
      )}
    </Card>

    {/* Invite Modal */}
    {showInviteModal && (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowInviteModal(false)}>
        <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl" onClick={(e) => e.stopPropagation()}>
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-gray-900">Codes d'invitation</h3>
            <button onClick={() => setShowInviteModal(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Invitation Code for Residents */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Code pour les colocataires
            </label>
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-gray-100 rounded-lg px-4 py-3 font-mono text-lg font-bold text-gray-900">
                {propertyInfo.invitationCode || 'N/A'}
              </div>
              <button
                onClick={() => propertyInfo.invitationCode && copyToClipboard(propertyInfo.invitationCode, 'invitation')}
                className="p-3 rounded-lg text-white transition-all hover:scale-105"
                style={{ background: 'linear-gradient(135deg, #d9574f 0%, #ff5b21 50%, #ff8017 100%)' }}
              >
                {copiedCode === 'invitation' ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Partagez ce code avec vos futurs colocataires
            </p>
          </div>

          {/* Owner Code (only for creators) */}
          {propertyInfo.isCreator && propertyInfo.ownerCode && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Code propriétaire
              </label>
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-purple-100 rounded-lg px-4 py-3 font-mono text-sm font-bold text-purple-900">
                  {propertyInfo.ownerCode}
                </div>
                <button
                  onClick={() => copyToClipboard(propertyInfo.ownerCode!, 'owner')}
                  className="p-3 rounded-lg bg-purple-500 hover:bg-purple-600 text-white transition-colors"
                >
                  {copiedCode === 'owner' ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Code réservé au propriétaire légal pour revendiquer la résidence
              </p>
            </div>
          )}

          <button
            onClick={() => setShowInviteModal(false)}
            className="w-full mt-4 py-3 text-white font-medium rounded-lg hover:shadow-lg transition-all hover:scale-105"
            style={{ background: 'linear-gradient(135deg, #d9574f 0%, #ff5b21 50%, #ff8017 100%)' }}
          >
            Fermer
          </button>
        </div>
      </div>
    )}
    </>
  );
}
