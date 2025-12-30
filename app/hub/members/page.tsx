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
            name: m.users?.full_name || 'Utilisateur',
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
          <p className="text-gray-600 font-medium">Chargement...</p>
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
            className="mb-4 rounded-full hover:bg-gradient-to-r hover:from-[#d9574f]/10 hover:to-[#ff8017]/10 font-semibold"
          >
            ← Retour au hub
          </Button>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                className="relative w-14 h-14 rounded-2xl overflow-hidden flex items-center justify-center shadow-lg"
                style={{
                  background: 'linear-gradient(135deg, #d9574f 0%, #ff5b21 50%, #ff8017 100%)',
                  boxShadow: '0 8px 24px rgba(238, 87, 54, 0.35)',
                }}
              >
                <Users className="w-7 h-7 text-white relative z-10" />
                <motion.div
                  className="absolute inset-0 bg-white/20"
                  animate={{ opacity: [0, 0.3, 0] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                />
              </motion.div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                  Membres de la Coloc
                </h1>
                <p className="text-gray-600 flex items-center gap-2">
                  <Home className="w-4 h-4 text-orange-500" />
                  {currentProperty?.title || 'Votre résidence'}
                  <Badge
                    className="text-xs border-none text-white font-bold ml-1"
                    style={{ background: 'linear-gradient(135deg, #d9574f 0%, #ff5b21 100%)' }}
                  >
                    {members.length}
                  </Badge>
                  colocataire{members.length !== 1 ? 's' : ''}
                </p>
              </div>
            </div>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={() => setShowInvitePopup(true)}
                className="rounded-full text-white font-semibold hover:shadow-xl transition-all border-none"
                style={{
                  background: 'linear-gradient(135deg, #d9574f 0%, #ff5b21 50%, #ff8017 100%)',
                  boxShadow: '0 4px 16px rgba(238, 87, 54, 0.4)',
                }}
              >
                <UserPlus className="w-4 h-4 mr-2" />
                Inviter
              </Button>
            </motion.div>
          </div>
        </motion.div>

        {/* Stats Cards - V2 Fun */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
        >
          {[
            { label: 'Total', value: members.length, gradient: 'linear-gradient(135deg, #d9574f 0%, #ff5b21 100%)', shadow: 'rgba(217, 87, 79, 0.35)', icon: Users },
            { label: 'Résidents', value: residentsCount, gradient: 'linear-gradient(135deg, #ff5b21 0%, #ff8017 100%)', shadow: 'rgba(255, 91, 33, 0.35)', icon: Home },
            { label: 'Propriétaires', value: ownersCount, gradient: 'linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)', shadow: 'rgba(124, 58, 237, 0.35)', icon: Crown },
          ].map((stat) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                variants={itemVariants}
                whileHover={{ scale: 1.03, y: -4 }}
                className="bg-white rounded-2xl shadow-lg p-5 cursor-pointer border-2 border-transparent hover:border-orange-100"
                style={{ boxShadow: '0 4px 16px rgba(0,0,0,0.08)' }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-gray-600">
                      {stat.label}
                    </p>
                    <p
                      className="text-3xl font-bold mt-1"
                      style={{
                        background: stat.gradient,
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                      }}
                    >
                      {stat.value}
                    </p>
                  </div>
                  <motion.div
                    whileHover={{ rotate: 10 }}
                    className="w-11 h-11 rounded-xl flex items-center justify-center shadow-md"
                    style={{
                      background: stat.gradient,
                      boxShadow: `0 4px 12px ${stat.shadow}`,
                    }}
                  >
                    <Icon className="w-5 h-5 text-white" />
                  </motion.div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Members Grid - V2 Fun */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {members.map((member) => (
            <motion.div
              key={member.id}
              variants={itemVariants}
              whileHover={{ scale: 1.02, y: -4 }}
              whileTap={{ scale: 0.98 }}
              className="bg-white rounded-3xl shadow-lg overflow-hidden border-2 border-transparent hover:border-orange-100 cursor-pointer"
              style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.08)' }}
            >
              {/* Member Header */}
              <div
                className="p-6 text-white relative overflow-hidden"
                style={{
                  background: 'linear-gradient(135deg, #d9574f 0%, #ff5b21 50%, #ff8017 100%)',
                }}
              >
                {/* Shine effect */}
                <motion.div
                  className="absolute inset-0 bg-white/10"
                  animate={{ opacity: [0, 0.2, 0] }}
                  transition={{ repeat: Infinity, duration: 3 }}
                />
                <div className="flex items-center gap-4 mb-4 relative z-10">
                  {member.avatar ? (
                    <motion.img
                      whileHover={{ scale: 1.1 }}
                      src={member.avatar}
                      alt={member.name}
                      className="w-16 h-16 rounded-full border-4 border-white/30 object-cover shadow-lg"
                    />
                  ) : (
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      className="w-16 h-16 rounded-full border-4 border-white/30 bg-white/20 flex items-center justify-center text-2xl font-bold shadow-lg"
                    >
                      {member.name.charAt(0)}
                    </motion.div>
                  )}
                  <div className="flex-1">
                    <h3 className="text-xl font-bold">{member.name}</h3>
                    <Badge
                      className="mt-1 border-none font-semibold flex items-center gap-1"
                      style={{
                        background: member.role === 'owner'
                          ? 'linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)'
                          : 'rgba(255,255,255,0.25)',
                        color: 'white',
                      }}
                    >
                      {member.role === 'owner' ? (
                        <><Crown className="w-3 h-3" /> Propriétaire</>
                      ) : (
                        <><Home className="w-3 h-3" /> Résident</>
                      )}
                    </Badge>
                  </div>
                </div>

                {member.bio && (
                  <p
                    className="text-sm line-clamp-2 relative z-10"
                    style={{ color: 'rgba(255, 255, 255, 0.9)' }}
                  >
                    {member.bio}
                  </p>
                )}
              </div>

              {/* Member Details */}
              <div className="p-6">
                {/* Contact Info */}
                <div className="space-y-3 mb-4">
                  <div className="flex items-center gap-3 text-sm">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center"
                      style={{ background: 'rgba(238, 87, 54, 0.1)' }}
                    >
                      <Mail className="w-4 h-4" style={{ color: '#ee5736' }} />
                    </div>
                    <span className="text-gray-700 font-medium">{member.email}</span>
                  </div>

                  {member.phone && (
                    <div className="flex items-center gap-3 text-sm">
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center"
                        style={{ background: 'rgba(238, 87, 54, 0.1)' }}
                      >
                        <Phone className="w-4 h-4" style={{ color: '#ee5736' }} />
                      </div>
                      <span className="text-gray-700 font-medium">{member.phone}</span>
                    </div>
                  )}

                  {member.occupation && (
                    <div className="flex items-center gap-3 text-sm">
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center"
                        style={{ background: 'rgba(238, 87, 54, 0.1)' }}
                      >
                        <Briefcase className="w-4 h-4" style={{ color: '#ee5736' }} />
                      </div>
                      <span className="text-gray-700 font-medium">{member.occupation}</span>
                    </div>
                  )}

                  <div className="flex items-center gap-3 text-sm">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center"
                      style={{ background: 'rgba(238, 87, 54, 0.1)' }}
                    >
                      <Calendar className="w-4 h-4" style={{ color: '#ee5736' }} />
                    </div>
                    <span className="text-gray-700 font-medium">
                      Depuis{' '}
                      {new Date(member.moveInDate).toLocaleDateString('fr-FR', {
                        month: 'long',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                </div>

                {/* Interests */}
                {member.interests && member.interests.length > 0 && (
                  <div className="mb-4">
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1">
                      <Sparkles className="w-3 h-3" /> Centres d'intérêt
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {member.interests.map((interest, idx) => (
                        <Badge
                          key={idx}
                          className="border-none bg-orange-100 text-orange-700 text-xs font-semibold"
                        >
                          {interest}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-2 pt-4 border-t border-gray-100">
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="flex-1">
                    <Button
                      onClick={() => router.push('/messages')}
                      className="w-full rounded-full text-white font-semibold hover:shadow-lg transition-all border-none"
                      size="sm"
                      style={{
                        background: 'linear-gradient(135deg, #d9574f 0%, #ff5b21 50%, #ff8017 100%)',
                        boxShadow: '0 4px 12px rgba(238, 87, 54, 0.35)',
                      }}
                    >
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Message
                    </Button>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                    <Button
                      variant="outline"
                      size="sm"
                      className="rounded-full border-2 border-pink-200 text-pink-500 hover:bg-pink-50 hover:border-pink-300"
                    >
                      <Heart className="w-4 h-4" />
                    </Button>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Empty State - V2 Fun */}
        {members.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl shadow-lg p-12 text-center border-2 border-transparent"
            style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.08)' }}
          >
            <motion.div
              whileHover={{ scale: 1.05, rotate: 5 }}
              className="relative w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4"
              style={{
                background: 'linear-gradient(135deg, #d9574f 0%, #ff5b21 50%, #ff8017 100%)',
                boxShadow: '0 8px 24px rgba(238, 87, 54, 0.35)',
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
              Aucun colocataire pour le moment
            </h3>
            <p className="text-gray-500 mb-6">
              Invitez des personnes à rejoindre votre colocation !
            </p>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={() => setShowInvitePopup(true)}
                className="rounded-full text-white font-semibold hover:shadow-xl transition-all border-none"
                style={{
                  background: 'linear-gradient(135deg, #d9574f 0%, #ff5b21 50%, #ff8017 100%)',
                  boxShadow: '0 4px 16px rgba(238, 87, 54, 0.4)',
                }}
              >
                <UserPlus className="w-4 h-4 mr-2" />
                Inviter des membres
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
