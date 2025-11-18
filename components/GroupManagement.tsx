'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Users, UserPlus, Settings, ExternalLink, Copy, Mail, UserX, Crown, Shield, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { createClient } from '@/lib/auth/supabase-client';
import { showErrorToast, showSuccessToast, showInfoToast, toasts } from '@/lib/toast-helpers';
import LoadingHouse from '@/components/ui/LoadingHouse';

interface Group {
  id: string;
  name: string;
  description: string | null;
  max_members: number;
  is_open: boolean;
  requires_approval: boolean;
  created_by: string;
  created_at: string;
}

interface GroupMember {
  id: string;
  user_id: string;
  role: 'creator' | 'admin' | 'member';
  status: 'pending' | 'active' | 'left' | 'removed';
  joined_at: string;
  users: {
    full_name: string;
    email: string;
  };
}

interface GroupInvitation {
  id: string;
  invite_code: string | null;
  invited_user_id: string | null;
  status: string;
  created_at: string;
}

export default function GroupManagement({ userId }: { userId: string }) {
  const router = useRouter();
  const supabase = createClient();

  const [currentGroup, setCurrentGroup] = useState<Group | null>(null);
  const [members, setMembers] = useState<GroupMember[]>([]);
  const [invitations, setInvitations] = useState<GroupInvitation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showInviteForm, setShowInviteForm] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [generatedInviteCode, setGeneratedInviteCode] = useState<string | null>(null);

  useEffect(() => {
    checkOnboardingAndLoadData();
  }, [userId]);

  const checkOnboardingAndLoadData = async () => {
    try {
      // First, check if onboarding is completed
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('onboarding_completed')
        .eq('id', userId)
        .single();

      if (userError) throw userError;

      // If onboarding not completed, redirect
      if (!userData?.onboarding_completed) {
        router.push('/onboarding/searcher/basic-info');
        return;
      }

      // Onboarding complete, load group data
      await loadGroupData();
    } catch (error) {
      // FIXME: Use logger.error('Error checking onboarding:', error);
      setIsLoading(false);
    }
  };

  const loadGroupData = async () => {
    try {
      // Find user's group membership
      const { data: membership, error: memberError } = await supabase
        .from('group_members')
        .select('group_id, role, status')
        .eq('user_id', userId)
        .eq('status', 'active')
        .single();

      if (memberError || !membership) {
        setIsLoading(false);
        return;
      }

      // Load group details
      const { data: group, error: groupError } = await supabase
        .from('groups')
        .select('*')
        .eq('id', membership.group_id)
        .single();

      if (groupError) throw groupError;
      setCurrentGroup(group);

      // Load all members
      const { data: membersData, error: membersError } = await supabase
        .from('group_members')
        .select(`
          id,
          user_id,
          role,
          status,
          joined_at,
          users (
            full_name,
            email
          )
        `)
        .eq('group_id', membership.group_id)
        .in('status', ['active', 'pending'])
        .order('joined_at', { ascending: true });

      if (membersError) throw membersError;
      setMembers(membersData as any);

      // Load invitations (if admin/creator)
      if (membership.role === 'creator' || membership.role === 'admin') {
        const { data: invitesData } = await supabase
          .from('group_invitations')
          .select('*')
          .eq('group_id', membership.group_id)
          .eq('status', 'pending');

        setInvitations(invitesData || []);
      }

    } catch (error) {
      // FIXME: Use logger.error('Error loading group data:', error);
      showErrorToast('Failed to load group data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateInviteCode = async () => {
    if (!currentGroup) return;

    try {
      // Generate invite code using the database function
      const { data: codeResult, error: codeError } = await supabase.rpc('generate_invite_code');

      if (codeError) throw codeError;

      const code = codeResult;

      // Create invitation with code
      const { error: inviteError } = await supabase
        .from('group_invitations')
        .insert({
          group_id: currentGroup.id,
          invited_by: userId,
          invite_code: code,
          expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days
        });

      if (inviteError) throw inviteError;

      setGeneratedInviteCode(code);
      showSuccessToast('Invite code generated!', 'Share this code with people you want to invite');
      loadGroupData();
    } catch (error: any) {
      // FIXME: Use logger.error('Error generating invite code:', error);
      showErrorToast('Failed to generate invite code', error.message);
    }
  };

  const handleCopyInviteCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toasts.copied();
  };

  const handleInviteByEmail = async () => {
    if (!currentGroup || !inviteEmail.trim()) return;

    try {
      // Find user by email
      const { data: invitee, error: userError } = await supabase
        .from('users')
        .select('id, email, full_name')
        .eq('email', inviteEmail.trim().toLowerCase())
        .single();

      if (userError || !invitee) {
        showErrorToast('User not found', 'No user found with this email address');
        return;
      }

      // Check if user is already in the group
      const { data: existingMember } = await supabase
        .from('group_members')
        .select('id')
        .eq('group_id', currentGroup.id)
        .eq('user_id', invitee.id)
        .single();

      if (existingMember) {
        showInfoToast('Already a member', 'This user is already in your group');
        return;
      }

      // Create invitation
      const { error: inviteError } = await supabase
        .from('group_invitations')
        .insert({
          group_id: currentGroup.id,
          invited_by: userId,
          invited_user_id: invitee.id,
        });

      if (inviteError) throw inviteError;

      showSuccessToast('Invitation sent!', `Invitation sent to ${invitee.full_name}`);
      setInviteEmail('');
      setShowInviteForm(false);
      loadGroupData();
    } catch (error: any) {
      // FIXME: Use logger.error('Error sending invitation:', error);
      showErrorToast('Failed to send invitation', error.message);
    }
  };

  const handleRemoveMember = async (memberId: string, memberName: string) => {
    if (!confirm(`Are you sure you want to remove ${memberName} from the group?`)) return;

    try {
      const { error } = await supabase
        .from('group_members')
        .update({ status: 'removed' })
        .eq('id', memberId);

      if (error) throw error;

      showSuccessToast('Member removed', `${memberName} has been removed from the group`);
      loadGroupData();
    } catch (error: any) {
      // FIXME: Use logger.error('Error removing member:', error);
      showErrorToast('Failed to remove member', error.message);
    }
  };

  const handleLeaveGroup = async () => {
    if (!currentGroup) return;
    if (!confirm('Are you sure you want to leave this group?')) return;

    try {
      const { error } = await supabase
        .from('group_members')
        .update({ status: 'left' })
        .eq('group_id', currentGroup.id)
        .eq('user_id', userId);

      if (error) throw error;

      showInfoToast('Left group', 'You have left the group');
      setCurrentGroup(null);
      setMembers([]);
    } catch (error: any) {
      // FIXME: Use logger.error('Error leaving group:', error);
      showErrorToast('Failed to leave group', error.message);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-3xl shadow-lg p-8 text-center">
        <LoadingHouse size={48} />
        <p className="text-gray-600">Loading group...</p>
      </div>
    );
  }

  // No Group - Show Create/Join Options
  if (!currentGroup) {
    return (
      <div className="bg-white rounded-3xl shadow-lg p-8">
        <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Users className="w-6 h-6 text-purple-600" />
          Search with a Group
        </h3>
        <p className="text-gray-600 mb-6">
          Create a group to search for properties with friends, or join an existing group.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Button
            onClick={() => router.push('/groups/create')}
            className="h-auto py-6 flex-col gap-2"
          >
            <Users className="w-8 h-8" />
            <span className="font-semibold">Create a Group</span>
            <span className="text-xs opacity-80">Start your own group</span>
          </Button>

          <Button
            variant="outline"
            onClick={() => router.push('/groups/join')}
            className="h-auto py-6 flex-col gap-2"
          >
            <UserPlus className="w-8 h-8" />
            <span className="font-semibold">Join a Group</span>
            <span className="text-xs opacity-80">Enter an invite code</span>
          </Button>
        </div>
      </div>
    );
  }

  // Has Group - Show Group Management
  const userMember = members.find(m => m.user_id === userId);
  const isCreatorOrAdmin = userMember?.role === 'creator' || userMember?.role === 'admin';
  const activeMembers = members.filter(m => m.status === 'active');
  const pendingMembers = members.filter(m => m.status === 'pending');

  return (
    <div className="bg-white rounded-3xl shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-br from-purple-600 to-purple-700 p-6 text-white">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-2xl font-bold mb-2">{currentGroup.name}</h3>
            {currentGroup.description && (
              <p className="text-purple-100 text-sm">{currentGroup.description}</p>
            )}
          </div>
          <div className="bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full text-sm font-medium">
            {activeMembers.length}/{currentGroup.max_members} members
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Members List */}
        <div className="mb-6">
          <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <Users className="w-5 h-5 text-purple-600" />
            Members
          </h4>
          <div className="space-y-2">
            {activeMembers.map((member) => (
              <div key={member.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                    {member.users.full_name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 flex items-center gap-2">
                      {member.users.full_name}
                      {member.role === 'creator' && (
                        <span className="flex items-center gap-1" aria-label="Creator">
                          <Crown className="w-4 h-4 text-yellow-500" />
                        </span>
                      )}
                      {member.role === 'admin' && (
                        <span className="flex items-center gap-1" aria-label="Admin">
                          <Shield className="w-4 h-4 text-blue-500" />
                        </span>
                      )}
                    </p>
                    <p className="text-sm text-gray-600">{member.users.email}</p>
                  </div>
                </div>
                {isCreatorOrAdmin && member.user_id !== userId && member.role !== 'creator' && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveMember(member.id, member.users.full_name)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <UserX className="w-4 h-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Pending Members */}
        {isCreatorOrAdmin && pendingMembers.length > 0 && (
          <div className="mb-6">
            <h4 className="font-semibold text-gray-900 mb-3">Pending Approval</h4>
            <div className="space-y-2">
              {pendingMembers.map((member) => (
                <div key={member.id} className="flex items-center justify-between p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{member.users.full_name}</p>
                    <p className="text-sm text-gray-600">{member.users.email}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="text-green-600 hover:bg-green-50">
                      <Check className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="outline" className="text-red-600 hover:bg-red-50">
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Invite Section - Only for creator/admin */}
        {isCreatorOrAdmin && activeMembers.length < currentGroup.max_members && (
          <div className="mb-6">
            <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-purple-600" />
              Invite Members
            </h4>

            {!showInviteForm ? (
              <div className="space-y-3">
                <Button
                  onClick={handleGenerateInviteCode}
                  variant="outline"
                  className="w-full"
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Generate Invite Code
                </Button>
                <Button
                  onClick={() => setShowInviteForm(true)}
                  variant="outline"
                  className="w-full"
                >
                  <Mail className="w-4 h-4 mr-2" />
                  Invite by Email
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                <Input
                  type="email"
                  placeholder="Enter email address"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                />
                <div className="flex gap-2">
                  <Button onClick={handleInviteByEmail} className="flex-1">
                    Send Invitation
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowInviteForm(false);
                      setInviteEmail('');
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}

            {generatedInviteCode && (
              <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm text-green-800 mb-2 font-medium">Share this code:</p>
                <div className="flex items-center gap-2">
                  <code className="flex-1 bg-white px-3 py-2 rounded border border-green-300 font-mono text-lg font-bold text-green-900 tracking-wider">
                    {generatedInviteCode}
                  </code>
                  <Button
                    size="sm"
                    onClick={() => handleCopyInviteCode(generatedInviteCode)}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
                <p className="text-xs text-green-700 mt-2">Code expires in 7 days</p>
              </div>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3 pt-4 border-t border-gray-200">
          {isCreatorOrAdmin && (
            <Button
              variant="outline"
              onClick={() => router.push(`/groups/${currentGroup.id}/settings`)}
              className="flex-1"
            >
              <Settings className="w-4 h-4 mr-2" />
              Group Settings
            </Button>
          )}
          {userMember?.role !== 'creator' && (
            <Button
              variant="outline"
              onClick={handleLeaveGroup}
              className="flex-1 text-red-600 hover:bg-red-50 hover:text-red-700"
            >
              <UserX className="w-4 h-4 mr-2" />
              Leave Group
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
