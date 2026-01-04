/**
 * Members Page - V2 Fun Design
 * View and manage colocation members with style
 */
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/auth/supabase-client';
import { motion, AnimatePresence } from 'framer-motion';
import LoadingHouse from '@/components/ui/LoadingHouse';
import { useLanguage } from '@/lib/i18n/use-language';
import {
  Users,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Briefcase,
  Heart,
  MessageCircle,
  UserPlus,
  Sparkles,
  Home,
  Crown,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import MatchingPreviewSection from '@/components/hub/matching/MatchingPreviewSection';
import { InvitePopup } from '@/components/referral';
import { shouldShowDemoData } from '@/lib/utils/admin-demo';

// V2 Fun Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: 'spring' as const,
      stiffness: 400,
      damping: 25,
    },
  },
};

interface Member {
  id: string;
  name: string;
  role: 'resident' | 'owner';
  avatar?: string;
  email: string;
  phone?: string;
  occupation?: string;
  moveInDate: string;
  interests: string[];
  bio?: string;
}

// Mock members for admin demo accounts only
const MOCK_MEMBERS: Member[] = [
  {
    id: 'demo-1',
    name: 'Sarah Martin',
    role: 'resident',
    email: 'sarah.martin@email.com',
    phone: '+33 6 12 34 56 78',
    occupation: 'Designer UX/UI',
    moveInDate: '2024-06-15',
    interests: ['Yoga', 'Cuisine', 'Cinéma'],
    bio: 'Passionnée de design et de bien-être, j\'adore partager des moments conviviaux autour d\'un bon repas.'
  },
  {
    id: 'demo-2',
    name: 'Marc Dubois',
    role: 'resident',
    email: 'marc.dubois@email.com',
    phone: '+33 6 98 76 54 32',
    occupation: 'Développeur Full-Stack',
    moveInDate: '2024-05-01',
    interests: ['Gaming', 'Musique', 'Sport'],
    bio: 'Développeur le jour, gamer la nuit. Toujours partant pour une session de basket le weekend!'
  },
  {
    id: 'demo-3',
    name: 'Julie Leroy',
    role: 'resident',
    email: 'julie.leroy@email.com',
    occupation: 'Étudiante en Médecine',
    moveInDate: '2024-09-01',
    interests: ['Lecture', 'Course à pied', 'Voyages'],
    bio: 'Étudiante en médecine, je cherche un environnement calme pour étudier mais j\'adore les soirées jeux de société!'
  }
];

export default function HubMembersPage() {
  const router = useRouter();
  const supabase = createClient();
  const [isLoading, setIsLoading] = useState(true);
  const [currentProperty, setCurrentProperty] = useState<any>(null);
  const [showInvitePopup, setShowInvitePopup] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const { language, getSection } = useLanguage();
  const hub = getSection('dashboard')?.hub;

  useEffect(() => {
    loadMembers();
  }, []);

  const loadMembers = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }

      setUserEmail(user.email || null);
      const isAdminDemo = shouldShowDemoData(user.email);

      // Load real members from database
      const { data: propertyMember } = await supabase
        .from('property_members')
        .select(`
          property_id,
          properties (
            id,
            title,
            address,
            city
          )
        `)
        .eq('user_id', user.id)
        .eq('status', 'active')
        .single();

      if (propertyMember && propertyMember.properties) {
        setCurrentProperty(propertyMember.properties);

        // Load other members
        const { data: membersData } = await supabase
          .from('property_members')
          .select(`
            user_id,
            role,
            created_at,
            users (
              full_name,
              email,
              avatar_url
            )
          `)
          .eq('property_id', propertyMember.property_id)
          .eq('status', 'active')
          .neq('user_id', user.id);

        if (membersData && membersData.length > 0) {
          // Map real data to members
          const realMembers: Member[] = membersData.map((m: any) => ({
            id: m.user_id,
            name: m.users?.full_name || 'User',
            role: m.role as 'resident' | 'owner',
            email: m.users?.email || '',
            avatar: m.users?.avatar_url,
            moveInDate: m.created_at,
            interests: [],
            occupation: undefined,
            bio: undefined
          }));
          setMembers(realMembers);
        } else if (isAdminDemo) {
          // Show mock data for admin demo accounts when no real members
          setMembers(MOCK_MEMBERS);
        } else {
          // Regular users see empty state
          setMembers([]);
        }
      } else if (isAdminDemo) {
        // Admin demo with no property - show mock data
        setMembers(MOCK_MEMBERS);
      } else {
        // Regular user with no property - empty state
        setMembers([]);
      }

      setIsLoading(false);
    } catch (error) {
      console.error('Error loading members:', error);
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <LoadingHouse size={80} />
          <p className="text-gray-600 font-medium">{hub.members?.loading || 'Loading...'}</p>
        </div>
      </div>
    );
  }

  // Stats calculations
  const residentsCount = members.filter((m) => m.role === 'resident').length;
  const ownersCount = members.filter((m) => m.role === 'owner').length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50/50 via-white to-orange-50/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header - V2 Fun Design */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring' as const, stiffness: 300, damping: 25 }}
          className="mb-8"
        >
          <Button
            onClick={() => router.back()}
            variant="ghost"
            className="mb-4 rounded-full hover:bg-gradient-to-r hover:from-[#e05747]/10 hover:to-[#ff9014]/10 font-semibold"
          >
            ← {hub.members?.backToHub || 'Back to hub'}
          </Button>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
                className="w-12 h-12 superellipse-2xl flex items-center justify-center shadow-lg"
                style={{
                  background: 'linear-gradient(135deg, #e05747 0%, #ff651e 50%, #ff9014 100%)',
                  boxShadow: '0 8px 24px rgba(255, 101, 30, 0.35)',
                }}
              >
                <Users className="w-6 h-6 text-white" />
              </motion.div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {hub.members?.title || 'Members'}
                </h1>
                <p className="text-sm text-gray-500">
                  {currentProperty?.title || hub.members?.yourResidence || 'Your residence'} • {members.length} {members.length !== 1 ? (hub.members?.membersPlural || 'members') : (hub.members?.memberSingular || 'member')}
                </p>
              </div>
            </div>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={() => setShowInvitePopup(true)}
                className="rounded-full text-white font-semibold hover:shadow-xl transition-all border-none"
                style={{
                  background: 'linear-gradient(135deg, #e05747 0%, #ff651e 50%, #ff9014 100%)',
                  boxShadow: '0 4px 16px rgba(255, 101, 30, 0.4)',
                }}
              >
                <UserPlus className="w-4 h-4 mr-2" />
                {hub.members?.invite || 'Invite'}
              </Button>
            </motion.div>
          </div>
        </motion.div>

        {/* Stats Cards - V2 Fun Colorful */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-3 gap-4 mb-8"
        >
          {/* Total Card - V3 Orange Official Palette */}
          <motion.div
            variants={itemVariants}
            whileHover={{ scale: 1.03, y: -4 }}
            className="relative overflow-hidden superellipse-2xl p-4 shadow-lg"
            style={{
              background: 'linear-gradient(135deg, #FFF5F0 0%, #FFEDE5 100%)',
              boxShadow: '0 8px 24px rgba(255, 101, 30, 0.15)',
            }}
          >
            <div className="absolute -right-4 -top-4 w-20 h-20 rounded-full opacity-20"
              style={{ background: 'linear-gradient(135deg, #e05747, #ff9014)' }}
            />
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-[#e05747]">{hub.members?.stats?.total || 'Total'}</span>
              <div
                className="w-8 h-8 superellipse-xl flex items-center justify-center shadow-md"
                style={{ background: 'linear-gradient(135deg, #e05747, #ff9014)' }}
              >
                <Users className="w-4 h-4 text-white" />
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900">{members.length}</p>
            <p className="text-xs text-[#ff651e] font-medium mt-1">
              {members.length !== 1 ? (hub.members?.stats?.activeMembersPlural || 'active members') : (hub.members?.stats?.activeMemberSingular || 'active member')}
            </p>
          </motion.div>

          {/* Residents Card - V3 Orange (Resident brand, not purple) */}
          <motion.div
            variants={itemVariants}
            whileHover={{ scale: 1.03, y: -4 }}
            className="relative overflow-hidden superellipse-2xl p-4 shadow-lg"
            style={{
              background: 'linear-gradient(135deg, #FFF5F0 0%, #FFEDE5 100%)',
              boxShadow: '0 8px 24px rgba(255, 101, 30, 0.15)',
            }}
          >
            <div className="absolute -right-4 -top-4 w-20 h-20 rounded-full opacity-20"
              style={{ background: 'linear-gradient(135deg, #f8572b, #ff7b19)' }}
            />
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-[#f8572b]">{hub.members?.stats?.residents || 'Residents'}</span>
              <div
                className="w-8 h-8 superellipse-xl flex items-center justify-center shadow-md"
                style={{ background: 'linear-gradient(135deg, #f8572b, #ff7b19)' }}
              >
                <Home className="w-4 h-4 text-white" />
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900">{residentsCount}</p>
            <div className="flex items-center gap-2 mt-1">
              <div className="flex-1 h-1.5 bg-orange-100 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${members.length > 0 ? (residentsCount / members.length) * 100 : 0}%` }}
                  transition={{ delay: 0.5, duration: 0.8, ease: 'easeOut' }}
                  className="h-full rounded-full"
                  style={{ background: 'linear-gradient(90deg, #f8572b, #ff7b19)' }}
                />
              </div>
              <span className="text-xs text-[#ff651e] font-bold">
                {members.length > 0 ? Math.round((residentsCount / members.length) * 100) : 0}%
              </span>
            </div>
          </motion.div>

          {/* Owners Card - Amber Gradient */}
          <motion.div
            variants={itemVariants}
            whileHover={{ scale: 1.03, y: -4 }}
            className="relative overflow-hidden superellipse-2xl p-4 shadow-lg"
            style={{
              background: 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)',
              boxShadow: '0 8px 24px rgba(245, 158, 11, 0.15)',
            }}
          >
            <div className="absolute -right-4 -top-4 w-20 h-20 rounded-full opacity-20"
              style={{ background: 'linear-gradient(135deg, #f59e0b, #fbbf24)' }}
            />
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-amber-700">{hub.members?.stats?.owners || 'Owners'}</span>
              <div
                className="w-8 h-8 superellipse-xl flex items-center justify-center shadow-md"
                style={{ background: 'linear-gradient(135deg, #f59e0b, #fbbf24)' }}
              >
                <Crown className="w-4 h-4 text-white" />
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900">{ownersCount}</p>
            <p className="text-xs text-amber-600 font-medium mt-1">
              {ownersCount > 0 ? (hub.members?.stats?.activeManagement || 'active management') : (hub.members?.stats?.noOwner || 'no owner')}
            </p>
          </motion.div>
        </motion.div>

        {/* Members Grid - V2 Fun Redesigned */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {members.map((member) => {
            const isOwner = member.role === 'owner';
            // V3 Option C: Orange for residents, amber for owners (semantic role distinction)
            const cardGradient = isOwner
              ? { bg: '#fffbeb', bgEnd: '#fef3c7', accent: '#f59e0b', accentEnd: '#fbbf24', shadow: 'rgba(245, 158, 11, 0.2)' }
              : { bg: '#FFF5F0', bgEnd: '#FFEDE5', accent: '#ff651e', accentEnd: '#ff9014', shadow: 'rgba(255, 101, 30, 0.2)' };

            return (
              <motion.div
                key={member.id}
                variants={itemVariants}
                whileHover={{ scale: 1.02, y: -6 }}
                whileTap={{ scale: 0.98 }}
                className="relative overflow-hidden superellipse-2xl cursor-pointer"
                style={{
                  background: `linear-gradient(135deg, ${cardGradient.bg} 0%, ${cardGradient.bgEnd} 100%)`,
                  boxShadow: `0 12px 32px ${cardGradient.shadow}`,
                }}
              >
                {/* Decorative circle */}
                <div
                  className="absolute -right-8 -top-8 w-32 h-32 rounded-full opacity-20"
                  style={{ background: `linear-gradient(135deg, ${cardGradient.accent}, ${cardGradient.accentEnd})` }}
                />

                {/* Card Content */}
                <div className="relative z-10 p-5">
                  {/* Header with Avatar */}
                  <div className="flex items-start gap-4 mb-4">
                    {/* Avatar */}
                    <motion.div whileHover={{ scale: 1.05 }} className="relative">
                      {member.avatar ? (
                        <img
                          src={member.avatar}
                          alt={member.name}
                          className="w-14 h-14 superellipse-xl object-cover shadow-lg"
                          style={{ boxShadow: `0 4px 12px ${cardGradient.shadow}` }}
                        />
                      ) : (
                        <div
                          className="w-14 h-14 superellipse-xl flex items-center justify-center text-xl font-bold text-white shadow-lg"
                          style={{
                            background: `linear-gradient(135deg, ${cardGradient.accent}, ${cardGradient.accentEnd})`,
                            boxShadow: `0 4px 12px ${cardGradient.shadow}`,
                          }}
                        >
                          {member.name.charAt(0)}
                        </div>
                      )}
                      {/* Online indicator */}
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-400 rounded-full border-2 border-white" />
                    </motion.div>

                    {/* Name & Role */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-bold text-gray-900 truncate">{member.name}</h3>
                      <Badge
                        className="mt-1 text-xs font-semibold border-none w-fit"
                        icon={isOwner ? <Crown className="w-3 h-3" /> : <Home className="w-3 h-3" />}
                        style={{
                          background: `linear-gradient(135deg, ${cardGradient.accent}, ${cardGradient.accentEnd})`,
                          color: 'white',
                        }}
                      >
                        {isOwner ? (hub.members?.roles?.owner || 'Owner') : (hub.members?.roles?.resident || 'Resident')}
                      </Badge>
                    </div>
                  </div>

                  {/* Bio */}
                  {member.bio && (
                    <p className="text-sm text-gray-600 line-clamp-2 mb-4 leading-relaxed">
                      {member.bio}
                    </p>
                  )}

                  {/* Contact Info - Compact Grid */}
                  <div className="space-y-2.5 mb-4">
                    <div className="flex items-center gap-2.5 text-sm">
                      <div
                        className="w-7 h-7 superellipse-lg flex items-center justify-center"
                        style={{ background: `${cardGradient.accent}15` }}
                      >
                        <Mail className="w-3.5 h-3.5" style={{ color: cardGradient.accent }} />
                      </div>
                      <span className="text-gray-700 font-medium truncate text-sm">{member.email}</span>
                    </div>

                    {member.phone && (
                      <div className="flex items-center gap-2.5 text-sm">
                        <div
                          className="w-7 h-7 superellipse-lg flex items-center justify-center"
                          style={{ background: 'rgba(34, 197, 94, 0.1)' }}
                        >
                          <Phone className="w-3.5 h-3.5 text-emerald-500" />
                        </div>
                        <span className="text-gray-700 font-medium text-sm">{member.phone}</span>
                      </div>
                    )}

                    {member.occupation && (
                      <div className="flex items-center gap-2.5 text-sm">
                        <div
                          className="w-7 h-7 superellipse-lg flex items-center justify-center"
                          style={{ background: 'rgba(255, 101, 30, 0.1)' }}
                        >
                          <Briefcase className="w-3.5 h-3.5 text-[#ff651e]" />
                        </div>
                        <span className="text-gray-700 font-medium text-sm">{member.occupation}</span>
                      </div>
                    )}

                    <div className="flex items-center gap-2.5 text-sm">
                      <div
                        className="w-7 h-7 superellipse-lg flex items-center justify-center"
                        style={{ background: 'rgba(255, 123, 25, 0.1)' }}
                      >
                        <Calendar className="w-3.5 h-3.5 text-[#ff7b19]" />
                      </div>
                      <span className="text-gray-700 font-medium text-sm">
                        {hub.members?.since || 'Since'}{' '}
                        {new Date(member.moveInDate).toLocaleDateString(language === 'fr' ? 'fr-FR' : language === 'nl' ? 'nl-NL' : language === 'de' ? 'de-DE' : 'en-GB', {
                          month: 'short',
                          year: 'numeric',
                        })}
                      </span>
                    </div>
                  </div>

                  {/* Interests */}
                  {member.interests && member.interests.length > 0 && (
                    <div className="mb-4">
                      <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1">
                        <Sparkles className="w-3 h-3" style={{ color: cardGradient.accent }} /> {hub.members?.interests || 'Interests'}
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {member.interests.map((interest, idx) => (
                          <Badge
                            key={idx}
                            className="text-xs font-medium border-none px-2 py-0.5"
                            style={{
                              background: `${cardGradient.accent}15`,
                              color: cardGradient.accent,
                            }}
                          >
                            {interest}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2 pt-3 border-t border-gray-200/50">
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="flex-1">
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push('/messages');
                        }}
                        className="w-full h-9 superellipse-xl text-white font-semibold text-sm shadow-md"
                        style={{
                          background: `linear-gradient(135deg, ${cardGradient.accent}, ${cardGradient.accentEnd})`,
                          boxShadow: `0 4px 12px ${cardGradient.shadow}`,
                        }}
                      >
                        <MessageCircle className="w-4 h-4 mr-1.5" />
                        {hub.members?.message || 'Message'}
                      </Button>
                    </motion.div>
                    <motion.div whileHover={{ scale: 1.1, rotate: 5 }} whileTap={{ scale: 0.9 }}>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => e.stopPropagation()}
                        className="h-9 w-9 superellipse-xl bg-white/80 hover:bg-white text-pink-500 hover:text-pink-600 shadow-sm"
                      >
                        <Heart className="w-4 h-4" />
                      </Button>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Empty State - V2 Fun */}
        {members.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white superellipse-3xl shadow-lg p-12 text-center border-2 border-transparent"
            style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.08)' }}
          >
            <motion.div
              whileHover={{ scale: 1.05, rotate: 5 }}
              className="relative w-20 h-20 superellipse-2xl flex items-center justify-center mx-auto mb-4"
              style={{
                background: 'linear-gradient(135deg, #e05747 0%, #ff651e 50%, #ff9014 100%)',
                boxShadow: '0 8px 24px rgba(255, 101, 30, 0.35)',
              }}
            >
              <Users className="w-10 h-10 text-white" />
              <motion.div
                className="absolute -top-1 -right-1"
                animate={{ y: [-2, 2, -2], rotate: [0, 15, 0] }}
                transition={{ repeat: Infinity, duration: 2 }}
              >
                <Sparkles className="w-5 h-5 text-amber-400" />
              </motion.div>
            </motion.div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              {hub.members?.emptyState?.title || 'No roommates yet'}
            </h3>
            <p className="text-gray-500 mb-6">
              {hub.members?.emptyState?.description || 'Invite people to join your coliving!'}
            </p>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={() => setShowInvitePopup(true)}
                className="rounded-full text-white font-semibold hover:shadow-xl transition-all border-none"
                style={{
                  background: 'linear-gradient(135deg, #e05747 0%, #ff651e 50%, #ff9014 100%)',
                  boxShadow: '0 4px 16px rgba(255, 101, 30, 0.4)',
                }}
              >
                <UserPlus className="w-4 h-4 mr-2" />
                {hub.members?.emptyState?.inviteButton || 'Invite members'}
              </Button>
            </motion.div>
          </motion.div>
        )}

        {/* Matching Preview Section - Anticiper les départs */}
        <div className="mt-16">
          <MatchingPreviewSection
            matchCount={23}
            candidateCount={147}
            hasInvitations={true}
            invitationCount={3}
            userEmail={userEmail}
          />
        </div>
      </div>

      {/* Invite Popup */}
      <InvitePopup
        isOpen={showInvitePopup}
        onClose={() => setShowInvitePopup(false)}
        showResidenceCodes={true}
      />
    </div>
  );
}
