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
  Home
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function InvitePage() {
  const router = useRouter();
  const supabase = createClient();
  const [isLoading, setIsLoading] = useState(true);
  const [propertyId, setPropertyId] = useState<string | null>(null);
  const [propertyName, setPropertyName] = useState<string>('');
  const [members, setMembers] = useState<any[]>([]);
  const [copied, setCopied] = useState(false);

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
    setTimeout(() => setCopied(false), 2000);
  };

  const shareViaEmail = () => {
    const subject = `Rejoins-nous sur ${propertyName}`;
    const body = `Salut !\n\nJe t'invite à rejoindre notre colocation "${propertyName}" sur EasyCo.\n\nUtilise ce code d'invitation : ${propertyId}\n\n1. Va sur https://easyco-onboarding.vercel.app/onboarding/resident/property-setup\n2. Clique sur "Rejoindre une colocation"\n3. Entre le code d'invitation\n\nÀ bientôt !`;
    window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
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

        {/* Invite Code Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="p-6 mb-6 bg-white">
            <div className="flex items-center gap-2 mb-4">
              <Share2 className="w-5 h-5 text-orange-600" />
              <h2 className="text-xl font-bold text-gray-900">
                Code d'invitation
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
                {copied ? (
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
          transition={{ delay: 0.2 }}
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
