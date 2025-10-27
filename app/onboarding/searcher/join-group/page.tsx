'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, UserPlus, Users, Calendar, MapPin, DollarSign, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { createClient } from '@/lib/auth/supabase-client';
import { showErrorToast, showSuccessToast, showInfoToast } from '@/lib/toast-helpers';
import LanguageSwitcher from '@/components/LanguageSwitcher';

interface GroupInvitation {
  id: string;
  group_id: string;
  invited_by: string;
  status: string;
  created_at: string;
  groups: {
    id: string;
    name: string;
    description: string | null;
    max_members: number;
    created_at: string;
    budget_min: number | null;
    budget_max: number | null;
    preferred_cities: string[] | null;
    move_in_date: string | null;
  };
  inviter: {
    full_name: string;
  };
  member_count: number;
}

export default function JoinGroupPage() {
  const router = useRouter();
  const supabase = createClient();

  const [inviteCode, setInviteCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [pendingInvitations, setPendingInvitations] = useState<GroupInvitation[]>([]);
  const [loadingInvitations, setLoadingInvitations] = useState(true);

  useEffect(() => {
    fetchPendingInvitations();
  }, []);

  const fetchPendingInvitations = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Fetch direct invitations for this user
      const { data, error } = await supabase
        .from('group_invitations')
        .select(`
          id,
          group_id,
          invited_by,
          status,
          created_at,
          groups (
            id,
            name,
            description,
            max_members,
            created_at,
            budget_min,
            budget_max,
            preferred_cities,
            move_in_date
          )
        `)
        .eq('invited_user_id', user.id)
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Get member count for each group and inviter name
      const invitationsWithDetails = await Promise.all(
        (data || []).map(async (inv: any) => {
          // Get member count
          const { count } = await supabase
            .from('group_members')
            .select('*', { count: 'exact', head: true })
            .eq('group_id', inv.group_id)
            .eq('status', 'active');

          // Get inviter name
          const { data: inviterData } = await supabase
            .from('users')
            .select('full_name')
            .eq('id', inv.invited_by)
            .single();

          return {
            ...inv,
            member_count: count || 0,
            inviter: inviterData || { full_name: 'Someone' },
          };
        })
      );

      setPendingInvitations(invitationsWithDetails);
    } catch (error: any) {
      console.error('Error fetching invitations:', error);
    } finally {
      setLoadingInvitations(false);
    }
  };

  const handleJoinWithCode = async () => {
    if (!inviteCode.trim()) {
      showErrorToast('Please enter an invite code');
      return;
    }

    setIsLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        showErrorToast('You must be logged in');
        router.push('/login');
        return;
      }

      // Find invitation by code
      const { data: invitation, error: invError } = await supabase
        .from('group_invitations')
        .select('*, groups(*)')
        .eq('invite_code', inviteCode.trim().toUpperCase())
        .eq('status', 'pending')
        .single();

      if (invError || !invitation) {
        showErrorToast('Invalid or expired invite code');
        return;
      }

      // Check if group is full
      const { count: memberCount } = await supabase
        .from('group_members')
        .select('*', { count: 'exact', head: true })
        .eq('group_id', invitation.group_id)
        .eq('status', 'active');

      if (memberCount && memberCount >= invitation.groups.max_members) {
        showErrorToast('This group is full');
        return;
      }

      // Check if user is already in the group
      const { data: existingMember } = await supabase
        .from('group_members')
        .select('*')
        .eq('group_id', invitation.group_id)
        .eq('user_id', user.id)
        .single();

      if (existingMember) {
        showInfoToast('You are already a member of this group');
        return;
      }

      // Add user to group
      const { error: memberError } = await supabase
        .from('group_members')
        .insert({
          group_id: invitation.group_id,
          user_id: user.id,
          role: 'member',
          status: invitation.groups.requires_approval ? 'pending' : 'active',
        });

      if (memberError) throw memberError;

      // Update invitation status
      await supabase
        .from('group_invitations')
        .update({ status: 'accepted', responded_at: new Date().toISOString() })
        .eq('id', invitation.id);

      // Store group ID
      localStorage.setItem('current_group_id', invitation.group_id);

      if (invitation.groups.requires_approval) {
        showSuccessToast('Join request sent!', 'The group admin will review your request');
      } else {
        showSuccessToast('Joined group successfully!', `Welcome to ${invitation.groups.name}`);
      }

      // Continue to onboarding
      router.push('/onboarding/searcher/basic-info');

    } catch (error: any) {
      console.error('Error joining group:', error);
      showErrorToast('Failed to join group', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAcceptInvitation = async (invitation: GroupInvitation) => {
    setIsLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Check if group is full
      if (invitation.member_count >= invitation.groups.max_members) {
        showErrorToast('This group is full');
        return;
      }

      // Add user to group
      const { error: memberError } = await supabase
        .from('group_members')
        .insert({
          group_id: invitation.group_id,
          user_id: user.id,
          role: 'member',
          status: 'active',
        });

      if (memberError) throw memberError;

      // Update invitation status
      await supabase
        .from('group_invitations')
        .update({ status: 'accepted', responded_at: new Date().toISOString() })
        .eq('id', invitation.id);

      // Store group ID
      localStorage.setItem('current_group_id', invitation.group_id);

      showSuccessToast('Joined group successfully!', `Welcome to ${invitation.groups.name}`);

      // Continue to onboarding
      router.push('/onboarding/searcher/basic-info');

    } catch (error: any) {
      console.error('Error accepting invitation:', error);
      showErrorToast('Failed to join group', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeclineInvitation = async (invitationId: string) => {
    try {
      await supabase
        .from('group_invitations')
        .update({ status: 'declined', responded_at: new Date().toISOString() })
        .eq('id', invitationId);

      setPendingInvitations(prev => prev.filter(inv => inv.id !== invitationId));
      showInfoToast('Invitation declined');
    } catch (error) {
      console.error('Error declining invitation:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-yellow-50 py-8 px-4">
      {/* Language Switcher */}
      <div className="absolute top-6 right-6 z-50">
        <LanguageSwitcher />
      </div>

      <div className="max-w-2xl mx-auto">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-6 flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
            <UserPlus className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Join a Group
          </h1>
          <p className="text-lg text-gray-600">
            Enter an invite code or accept a pending invitation
          </p>
        </div>

        {/* Pending Invitations */}
        {!loadingInvitations && pendingInvitations.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Pending Invitations</h2>
            <div className="space-y-4">
              {pendingInvitations.map((invitation) => (
                <div key={invitation.id} className="bg-white rounded-2xl shadow-lg p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">{invitation.groups.name}</h3>
                      <p className="text-sm text-gray-600">
                        Invited by {invitation.inviter.full_name}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Users className="w-4 h-4" />
                      {invitation.member_count}/{invitation.groups.max_members}
                    </div>
                  </div>

                  {invitation.groups.description && (
                    <p className="text-gray-700 mb-4">{invitation.groups.description}</p>
                  )}

                  {/* Group Details */}
                  <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                    {invitation.groups.budget_min && invitation.groups.budget_max && (
                      <div className="flex items-center gap-2 text-gray-600">
                        <DollarSign className="w-4 h-4" />
                        ${invitation.groups.budget_min} - ${invitation.groups.budget_max}
                      </div>
                    )}
                    {invitation.groups.preferred_cities && invitation.groups.preferred_cities.length > 0 && (
                      <div className="flex items-center gap-2 text-gray-600">
                        <MapPin className="w-4 h-4" />
                        {invitation.groups.preferred_cities[0]}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3">
                    {invitation.member_count >= invitation.groups.max_members ? (
                      <div className="flex-1 bg-gray-100 border border-gray-300 rounded-lg p-3 text-center">
                        <p className="text-sm text-gray-600 font-medium">Group is Full</p>
                        <p className="text-xs text-gray-500 mt-1">This group has reached its maximum capacity</p>
                      </div>
                    ) : (
                      <Button
                        onClick={() => handleAcceptInvitation(invitation)}
                        disabled={isLoading}
                        className="flex-1 flex items-center justify-center gap-2"
                      >
                        <Check className="w-4 h-4" />
                        Accept
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      onClick={() => handleDeclineInvitation(invitation.id)}
                      disabled={isLoading}
                      className="flex items-center justify-center gap-2"
                    >
                      <X className="w-4 h-4" />
                      Decline
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Invite Code Form */}
        <div className="bg-white rounded-3xl shadow-xl p-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            {pendingInvitations.length > 0 ? 'Or join with invite code' : 'Join with invite code'}
          </h2>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="inviteCode">Invite Code</Label>
              <Input
                id="inviteCode"
                placeholder="Enter 8-character code"
                value={inviteCode}
                onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
                maxLength={8}
                className="text-center text-lg tracking-wider font-mono"
              />
              <p className="text-sm text-gray-500">
                Ask the group creator for an invite code
              </p>
            </div>

            <Button
              onClick={handleJoinWithCode}
              disabled={!inviteCode.trim() || isLoading}
              className="w-full"
            >
              {isLoading ? 'Joining...' : 'Join Group'}
            </Button>
          </div>

          {/* Skip Option */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <Button
              variant="ghost"
              onClick={() => {
                localStorage.setItem('searcher_mode', 'alone');
                router.push('/onboarding/searcher/basic-info');
              }}
              className="w-full"
            >
              Skip and search alone for now
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
