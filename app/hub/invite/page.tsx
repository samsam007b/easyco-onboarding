'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/auth/supabase-client';
import { motion } from 'framer-motion';
import LoadingHouse from '@/components/ui/LoadingHouse';
import {
  Copy,
  Check,
  Users,
  Mail,
  MessageCircle,
  Home,
  Building2,
  Sparkles,
  Link as LinkIcon,
  RefreshCw
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import {
  createInvitation,
  shareViaWhatsApp,
  shareViaEmail,
  copyInviteUrl
} from '@/lib/services/invitation-service';
import type { InvitedRole } from '@/types/invitation.types';
import { useLanguage } from '@/lib/i18n/use-language';

export default function InvitePage() {
  const { getSection, language } = useLanguage();
  const t = getSection('hub')?.invite;
  const router = useRouter();
  const supabase = createClient();
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [propertyId, setPropertyId] = useState<string | null>(null);
  const [propertyName, setPropertyName] = useState<string>('');
  const [members, setMembers] = useState<any[]>([]);
  const [copiedType, setCopiedType] = useState<string | null>(null);
  const [selectedRole, setSelectedRole] = useState<InvitedRole>('resident');
  const [inviteToken, setInviteToken] = useState<string | null>(null);
  const [inviteUrl, setInviteUrl] = useState<string | null>(null);
  const [inviterName, setInviterName] = useState<string>('');

  useEffect(() => {
    loadPropertyInfo();
  }, []);

  const loadPropertyInfo = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }

      // Get user's property
      const { data: membership } = await supabase
        .from('property_members')
        .select('property_id')
        .eq('user_id', user.id)
        .eq('status', 'active')
        .single();

      if (!membership?.property_id) {
        router.push('/onboarding/resident/property-setup');
        return;
      }

      setPropertyId(membership.property_id);

      // Get current user's profile for inviter name
      const { data: userProfile } = await supabase
        .from('user_profiles')
        .select('first_name, last_name')
        .eq('id', user.id)
        .single();

      setInviterName(
        userProfile?.first_name
          ? `${userProfile.first_name}${userProfile.last_name ? ' ' + userProfile.last_name : ''}`
          : (t?.aRoommate?.[language] || 'Un colocataire')
      );

      // Get property details
      const { data: property } = await supabase
        .from('properties')
        .select('title')
        .eq('id', membership.property_id)
        .single();

      setPropertyName(property?.title || (t?.yourColocation?.[language] || 'Votre colocation'));

      // Get all members
      const { data: membersData } = await supabase
        .from('property_members')
        .select(`
          user_id,
          role,
          status,
          created_at,
          user_profiles(first_name, last_name, profile_photo_url)
        `)
        .eq('property_id', membership.property_id);

      setMembers(membersData || []);
      setIsLoading(false);
    } catch (error) {
      console.error('Error loading property info:', error);
      setIsLoading(false);
    }
  };

  const generateInviteLink = async () => {
    if (!propertyId) return;

    setIsGenerating(true);
    try {
      const response = await createInvitation(
        propertyId,
        selectedRole
      );

      if (response.success && response.token) {
        setInviteToken(response.token);
        const url = `${window.location.origin}/invite/${response.token}`;
        setInviteUrl(url);
        toast.success(t?.toast?.linkGenerated?.[language] || 'Lien d\'invitation genere !');
      } else {
        toast.error(response.message || (t?.toast?.generationError?.[language] || 'Erreur lors de la generation'));
      }
    } catch (error) {
      toast.error(t?.toast?.generationError?.[language] || 'Erreur lors de la generation du lien');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyLink = async () => {
    if (inviteUrl) {
      const success = await copyInviteUrl(inviteUrl);
      if (success) {
        setCopiedType('link');
        toast.success(t?.toast?.linkCopied?.[language] || 'Lien copie !');
        setTimeout(() => setCopiedType(null), 2000);
      }
    }
  };

  const handleShareWhatsApp = () => {
    if (inviteUrl) {
      shareViaWhatsApp(inviteUrl, propertyName, selectedRole);
    }
  };

  const handleShareEmail = () => {
    if (inviteUrl) {
      shareViaEmail(inviteUrl, propertyName, inviterName, selectedRole);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <LoadingHouse size={80} />
          <p className="text-gray-600 font-medium mt-4">{t?.loading?.[language] || 'Chargement...'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50/30 via-white to-orange-50/30">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Button
            onClick={() => router.back()}
            variant="ghost"
            className="mb-6 rounded-full hover:bg-orange-50 transition-colors"
          >
            {t?.back?.[language] || 'Retour'}
          </Button>

          <div className="flex items-center gap-3 mb-2">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center"
                 style={{
                   background: 'linear-gradient(135deg, #D97B6F 0%, #E8865D 50%, #FF8C4B 100%)'
                 }}>
              <Users className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                {t?.title?.[language] || 'Inviter des colocataires'}
              </h1>
              <p className="text-gray-600">
                {propertyName}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Rewards Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="p-4 mb-6 bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-5 h-5 text-green-600" />
              <span className="font-semibold text-green-800">{t?.rewards?.title?.[language] || 'Recompenses automatiques'}</span>
            </div>
            <p className="text-sm text-green-700 mb-3">
              {t?.rewards?.description?.[language] || 'Quand quelqu\'un rejoint avec votre lien, vous gagnez tous les deux des mois gratuits !'}
            </p>
            <div className="flex gap-3">
              <div className="flex-1 p-2 bg-white rounded-lg text-center border border-green-100">
                <div className="flex items-center justify-center gap-1">
                  <Home className="w-3.5 h-3.5 text-orange-600" />
                  <span className="text-xs text-gray-600">{t?.rewards?.resident?.[language] || 'Resident'}</span>
                </div>
                <p className="font-bold text-orange-600">{t?.rewards?.residentMonths?.[language] || '+2 mois'}</p>
              </div>
              <div className="flex-1 p-2 bg-white rounded-lg text-center border border-green-100">
                <div className="flex items-center justify-center gap-1">
                  <Building2 className="w-3.5 h-3.5 text-purple-600" />
                  <span className="text-xs text-gray-600">{t?.rewards?.owner?.[language] || 'Proprio'}</span>
                </div>
                <p className="font-bold text-purple-600">{t?.rewards?.ownerMonths?.[language] || '+3 mois'}</p>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Trackable Invite Link Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="p-6 mb-6 bg-white">
            <div className="flex items-center gap-2 mb-4">
              <LinkIcon className="w-5 h-5 text-orange-600" />
              <h2 className="text-xl font-bold text-gray-900">
                {t?.createLink?.title?.[language] || 'Creer un lien d\'invitation'}
              </h2>
            </div>

            <p className="text-gray-600 mb-4">
              {t?.createLink?.description?.[language] || 'Generez un lien unique et trackable pour inviter quelqu\'un a rejoindre votre colocation.'}
            </p>

            {/* Role Selection */}
            <div className="mb-4">
              <p className="text-sm font-medium text-gray-700 mb-2">{t?.createLink?.inviteAs?.[language] || 'Inviter en tant que :'}</p>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setSelectedRole('resident');
                    setInviteUrl(null);
                    setInviteToken(null);
                  }}
                  className={`flex-1 p-3 rounded-xl border-2 transition-all ${
                    selectedRole === 'resident'
                      ? 'border-orange-400 bg-orange-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-center gap-2">
                    <Home className={`w-5 h-5 ${selectedRole === 'resident' ? 'text-orange-600' : 'text-gray-500'}`} />
                    <span className={`font-medium ${selectedRole === 'resident' ? 'text-orange-700' : 'text-gray-600'}`}>
                      {t?.createLink?.resident?.[language] || 'Resident'}
                    </span>
                  </div>
                </button>
                <button
                  onClick={() => {
                    setSelectedRole('owner');
                    setInviteUrl(null);
                    setInviteToken(null);
                  }}
                  className={`flex-1 p-3 rounded-xl border-2 transition-all ${
                    selectedRole === 'owner'
                      ? 'border-purple-400 bg-purple-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-center gap-2">
                    <Building2 className={`w-5 h-5 ${selectedRole === 'owner' ? 'text-purple-600' : 'text-gray-500'}`} />
                    <span className={`font-medium ${selectedRole === 'owner' ? 'text-purple-700' : 'text-gray-600'}`}>
                      {t?.createLink?.owner?.[language] || 'Proprietaire'}
                    </span>
                  </div>
                </button>
              </div>
            </div>

            {/* Generate Button or Link Display */}
            {!inviteUrl ? (
              <Button
                onClick={generateInviteLink}
                disabled={isGenerating}
                className={`w-full rounded-xl py-6 text-white ${
                  selectedRole === 'owner'
                    ? 'bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700'
                    : 'bg-gradient-to-r from-[#D97B6F] via-[#E8865D] to-[#FF8C4B]'
                }`}
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                    Generation...
                  </>
                ) : (
                  <>
                    <LinkIcon className="w-5 h-5 mr-2" />
                    Generer le lien d'invitation
                  </>
                )}
              </Button>
            ) : (
              <>
                {/* Link Display */}
                <div className={`p-4 rounded-xl border-2 mb-4 ${
                  selectedRole === 'owner'
                    ? 'bg-gradient-to-r from-purple-50 to-indigo-50 border-purple-200'
                    : 'bg-gradient-to-r from-orange-50 to-yellow-50 border-orange-200'
                }`}>
                  <p className="text-sm text-gray-600 mb-1">Lien d'invitation ({selectedRole === 'owner' ? 'Proprietaire' : 'Resident'})</p>
                  <p className={`text-sm font-mono break-all ${
                    selectedRole === 'owner' ? 'text-purple-700' : 'text-orange-700'
                  }`}>
                    {inviteUrl}
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 mb-4">
                  <Button
                    onClick={handleCopyLink}
                    className={`flex-1 rounded-xl ${
                      selectedRole === 'owner'
                        ? 'bg-gradient-to-r from-purple-500 to-indigo-600'
                        : 'bg-gradient-to-r from-[#D97B6F] via-[#E8865D] to-[#FF8C4B]'
                    }`}
                  >
                    {copiedType === 'link' ? (
                      <>
                        <Check className="w-5 h-5 mr-2" />
                        Copie !
                      </>
                    ) : (
                      <>
                        <Copy className="w-5 h-5 mr-2" />
                        Copier le lien
                      </>
                    )}
                  </Button>
                  <Button
                    onClick={() => {
                      setInviteUrl(null);
                      setInviteToken(null);
                    }}
                    variant="outline"
                    className="rounded-xl"
                  >
                    <RefreshCw className="w-5 h-5" />
                  </Button>
                </div>

                {/* Share Buttons */}
                <div className="flex gap-3">
                  <Button
                    onClick={handleShareWhatsApp}
                    variant="outline"
                    className="flex-1 rounded-xl border-green-200 text-green-600 hover:bg-green-50"
                  >
                    <MessageCircle className="w-5 h-5 mr-2" />
                    WhatsApp
                  </Button>
                  <Button
                    onClick={handleShareEmail}
                    variant="outline"
                    className="flex-1 rounded-xl border-blue-200 text-blue-600 hover:bg-blue-50"
                  >
                    <Mail className="w-5 h-5 mr-2" />
                    Email
                  </Button>
                </div>
              </>
            )}
          </Card>
        </motion.div>

        {/* Current Members */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="p-6 bg-white">
            <div className="flex items-center gap-2 mb-4">
              <Users className="w-5 h-5 text-orange-600" />
              <h2 className="text-xl font-bold text-gray-900">
                Membres actuels ({members.length})
              </h2>
            </div>

            <div className="space-y-3">
              {members.map((member, index) => (
                <motion.div
                  key={member.user_id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + index * 0.05 }}
                  className="flex items-center gap-3 p-4 bg-gradient-to-r from-gray-50 to-orange-50/30 rounded-2xl"
                >
                  {member.user_profiles?.profile_photo_url ? (
                    <img
                      src={member.user_profiles.profile_photo_url}
                      alt=""
                      className="w-12 h-12 rounded-xl object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-pink-600 flex items-center justify-center text-white font-bold text-lg">
                      {member.user_profiles?.first_name?.charAt(0) || '?'}
                    </div>
                  )}

                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">
                      {member.user_profiles?.first_name} {member.user_profiles?.last_name}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge className="bg-orange-100 text-orange-700 border-orange-200 text-xs">
                        {member.role === 'resident' ? 'Resident' : member.role}
                      </Badge>
                      <Badge className={
                        member.status === 'active'
                          ? 'bg-green-100 text-green-700 border-green-200 text-xs'
                          : 'bg-gray-100 text-gray-700 border-gray-200 text-xs'
                      }>
                        {member.status === 'active' ? 'Actif' : member.status}
                      </Badge>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
