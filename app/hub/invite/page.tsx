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
  Share2,
  Mail,
  MessageCircle,
  Home,
  Gift,
  Building2,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getReferralStats } from '@/lib/services/referral-service';

export default function InvitePage() {
  const router = useRouter();
  const supabase = createClient();
  const [isLoading, setIsLoading] = useState(true);
  const [propertyId, setPropertyId] = useState<string | null>(null);
  const [propertyName, setPropertyName] = useState<string>('');
  const [members, setMembers] = useState<any[]>([]);
  const [copied, setCopied] = useState(false);
  const [copiedType, setCopiedType] = useState<string | null>(null);
  const [referralData, setReferralData] = useState<{
    code: string;
    shareUrl: string;
    creditsAvailable: number;
  } | null>(null);

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

      // Get property details
      const { data: property } = await supabase
        .from('properties')
        .select('title')
        .eq('id', membership.property_id)
        .single();

      setPropertyName(property?.title || 'Votre colocation');

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

      // Load referral data
      const result = await getReferralStats();
      if (result.success && result.data) {
        setReferralData({
          code: result.data.code,
          shareUrl: result.data.share_url,
          creditsAvailable: result.data.credits_available,
        });
      }

      setIsLoading(false);
    } catch (error) {
      console.error('Error loading property info:', error);
      setIsLoading(false);
    }
  };

  const copyInviteCode = () => {
    if (!propertyId) return;
    navigator.clipboard.writeText(propertyId);
    setCopied(true);
    setCopiedType('residence');
    setTimeout(() => {
      setCopied(false);
      setCopiedType(null);
    }, 2000);
  };

  const copyReferralCode = () => {
    if (!referralData) return;
    navigator.clipboard.writeText(referralData.code);
    setCopied(true);
    setCopiedType('referral');
    setTimeout(() => {
      setCopied(false);
      setCopiedType(null);
    }, 2000);
  };

  const copyReferralLink = () => {
    if (!referralData) return;
    navigator.clipboard.writeText(referralData.shareUrl);
    setCopied(true);
    setCopiedType('link');
    setTimeout(() => {
      setCopied(false);
      setCopiedType(null);
    }, 2000);
  };

  const shareViaEmail = () => {
    const subject = `Rejoins-nous sur ${propertyName}`;
    const body = `Salut !\n\nJe t'invite à rejoindre notre colocation "${propertyName}" sur EasyCo.\n\nUtilise ce code d'invitation : ${propertyId}\n\n1. Va sur https://easyco-onboarding.vercel.app/onboarding/resident/property-setup\n2. Clique sur "Rejoindre une colocation"\n3. Entre le code d'invitation\n\nÀ bientôt !`;
    window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  const shareReferralViaEmail = () => {
    if (!referralData) return;
    const subject = "Rejoins-moi sur EasyCo !";
    const body = `Salut !\n\nJe te recommande EasyCo pour gérer ta colocation. C'est une super app qui simplifie tout : dépenses, tâches, documents...\n\nUtilise mon code de parrainage : ${referralData.code}\nOu clique directement ici : ${referralData.shareUrl}\n\nTu recevras 1 mois gratuit et moi aussi !\n\nÀ bientôt !`;
    window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  const shareReferralViaWhatsApp = () => {
    if (!referralData) return;
    const text = `Rejoins EasyCo et simplifie ta vie en colocation ! Utilise mon code ${referralData.code} pour t'inscrire et reçois 1 mois gratuit : ${referralData.shareUrl}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <LoadingHouse size={80} />
          <p className="text-gray-600 font-medium mt-4">Chargement...</p>
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
            ← Retour
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
                Inviter des colocataires
              </h1>
              <p className="text-gray-600">
                {propertyName}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Referral Code Card */}
        {referralData && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="p-6 mb-6 bg-white">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Gift className="w-5 h-5 text-green-600" />
                  <h2 className="text-xl font-bold text-gray-900">
                    Code Parrainage
                  </h2>
                </div>
                {referralData.creditsAvailable > 0 && (
                  <span className="px-3 py-1 bg-green-100 text-green-700 text-sm font-semibold rounded-full">
                    {referralData.creditsAvailable} mois dispo
                  </span>
                )}
              </div>

              <p className="text-gray-600 mb-4">
                Partagez ce code avec vos amis pour gagner des mois gratuits !
              </p>

              <div className="flex items-center gap-3 mb-4">
                <div className="flex-1 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border-2 border-dashed border-green-200">
                  <p className="text-sm text-gray-600 mb-1">Votre code</p>
                  <p className="text-2xl font-mono font-bold text-green-700 tracking-wider">
                    {referralData.code}
                  </p>
                </div>

                <Button
                  onClick={copyReferralCode}
                  className="rounded-xl bg-green-600 hover:bg-green-700"
                >
                  {copiedType === 'referral' ? (
                    <>
                      <Check className="w-5 h-5 mr-2" />
                      Copié
                    </>
                  ) : (
                    <>
                      <Copy className="w-5 h-5 mr-2" />
                      Copier
                    </>
                  )}
                </Button>
              </div>

              {/* Rewards info */}
              <div className="flex gap-3 mb-4">
                <div className="flex-1 p-3 bg-orange-50 rounded-xl text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Home className="w-4 h-4 text-orange-600" />
                    <span className="text-sm text-gray-600">Résident</span>
                  </div>
                  <p className="font-bold text-orange-600">+2 mois</p>
                </div>
                <div className="flex-1 p-3 bg-purple-50 rounded-xl text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Building2 className="w-4 h-4 text-purple-600" />
                    <span className="text-sm text-gray-600">Proprio</span>
                  </div>
                  <p className="font-bold text-purple-600">+3 mois</p>
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={copyReferralLink}
                  variant="outline"
                  className="flex-1 rounded-xl"
                >
                  {copiedType === 'link' ? (
                    <Check className="w-4 h-4 mr-2 text-green-600" />
                  ) : (
                    <Share2 className="w-4 h-4 mr-2" />
                  )}
                  Copier le lien
                </Button>
                <Button
                  onClick={shareReferralViaWhatsApp}
                  variant="outline"
                  className="rounded-xl border-green-200 text-green-600 hover:bg-green-50"
                >
                  <MessageCircle className="w-5 h-5" />
                </Button>
                <Button
                  onClick={shareReferralViaEmail}
                  variant="outline"
                  className="rounded-xl border-blue-200 text-blue-600 hover:bg-blue-50"
                >
                  <Mail className="w-5 h-5" />
                </Button>
              </div>

              <a
                href="/settings/referrals"
                className="flex items-center justify-center gap-2 mt-4 py-2 text-green-600 hover:text-green-700 text-sm font-medium transition-colors"
              >
                <Sparkles className="w-4 h-4" />
                Voir tous mes parrainages
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </Card>
          </motion.div>
        )}

        {/* Residence Invite Code Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: referralData ? 0.2 : 0.1 }}
        >
          <Card className="p-6 mb-6 bg-white">
            <div className="flex items-center gap-2 mb-4">
              <Home className="w-5 h-5 text-orange-600" />
              <h2 className="text-xl font-bold text-gray-900">
                Code Résidence
              </h2>
            </div>

            <p className="text-gray-600 mb-4">
              Partagez ce code avec vos futurs colocataires pour qu'ils puissent rejoindre la colocation.
            </p>

            <div className="flex items-center gap-3">
              <div className="flex-1 bg-gradient-to-r from-orange-50 to-yellow-50 rounded-xl p-4 border-2 border-orange-200">
                <p className="text-sm text-gray-600 mb-1">Code d'invitation</p>
                <p className="text-2xl font-mono font-bold text-orange-700 break-all">
                  {propertyId}
                </p>
              </div>

              <Button
                onClick={copyInviteCode}
                className="rounded-xl bg-gradient-to-r from-[#D97B6F] via-[#E8865D] to-[#FF8C4B]"
              >
                {copiedType === 'residence' ? (
                  <>
                    <Check className="w-5 h-5 mr-2" />
                    Copié
                  </>
                ) : (
                  <>
                    <Copy className="w-5 h-5 mr-2" />
                    Copier
                  </>
                )}
              </Button>
            </div>

            <div className="mt-6 flex gap-3">
              <Button
                onClick={shareViaEmail}
                variant="outline"
                className="flex-1 rounded-xl"
              >
                <Mail className="w-5 h-5 mr-2" />
                Inviter par email
              </Button>
            </div>
          </Card>
        </motion.div>

        {/* Current Members */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: referralData ? 0.3 : 0.2 }}
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
                  transition={{ delay: 0.3 + index * 0.05 }}
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
                        {member.role === 'resident' ? 'Résident' : member.role}
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
