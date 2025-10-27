'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/auth/supabase-client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Users, UserPlus, Search, CheckCircle, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { useLanguage } from '@/lib/i18n/use-language';

interface Group {
  id: string;
  name: string;
  description: string | null;
  max_members: number;
  is_open: boolean;
  requires_approval: boolean;
  created_at: string;
  member_count?: number;
}

function JoinGroupContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();
  const { getSection } = useLanguage();
  const common = getSection('common');

  const [inviteCode, setInviteCode] = useState(searchParams?.get('code') || '');
  const [isSearching, setIsSearching] = useState(false);
  const [isJoining, setIsJoining] = useState(false);
  const [foundGroup, setFoundGroup] = useState<Group | null>(null);
  const [openGroups, setOpenGroups] = useState<Group[]>([]);
  const [isLoadingOpenGroups, setIsLoadingOpenGroups] = useState(false);

  useEffect(() => {
    // If code in URL, auto-search
    if (searchParams.get('code')) {
      handleSearchByCode();
    }
  }, []);

  const handleSearchByCode = async () => {
    if (!inviteCode.trim()) {
      toast.error('Please enter an invite code');
      return;
    }

    setIsSearching(true);
    setFoundGroup(null);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }

      // Check if user already in a group
      const { data: existingMembership } = await supabase
        .from('group_members')
        .select('group_id')
        .eq('user_id', user.id)
        .eq('status', 'active')
        .single();

      if (existingMembership) {
        toast.error('You are already in a group');
        setIsSearching(false);
        return;
      }

      // Find invitation by code
      const { data: invitation, error: inviteError } = await supabase
        .from('group_invitations')
        .select('group_id, status, expires_at')
        .eq('invite_code', inviteCode.toUpperCase())
        .single();

      if (inviteError || !invitation) {
        toast.error('Invalid invite code');
        setIsSearching(false);
        return;
      }

      // Check if expired
      if (invitation.expires_at && new Date(invitation.expires_at) < new Date()) {
        toast.error('This invite code has expired');
        setIsSearching(false);
        return;
      }

      // Get group details
      const { data: group, error: groupError } = await supabase
        .from('groups')
        .select('*')
        .eq('id', invitation.group_id)
        .single();

      if (groupError || !group) {
        toast.error('Group not found');
        setIsSearching(false);
        return;
      }

      // Count current members
      const { count } = await supabase
        .from('group_members')
        .select('*', { count: 'exact', head: true })
        .eq('group_id', group.id)
        .eq('status', 'active');

      setFoundGroup({ ...group, member_count: count || 0 });

    } catch (error: any) {
      console.error('Error searching group:', error);
      toast.error(error.message || 'Failed to find group');
    } finally {
      setIsSearching(false);
    }
  };

  const loadOpenGroups = async () => {
    setIsLoadingOpenGroups(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Get open groups
      const { data: groups, error } = await supabase
        .from('groups')
        .select('*')
        .eq('is_open', true)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;

      // Get member counts for each group
      const groupsWithCounts = await Promise.all(
        (groups || []).map(async (group) => {
          const { count } = await supabase
            .from('group_members')
            .select('*', { count: 'exact', head: true })
            .eq('group_id', group.id)
            .eq('status', 'active');

          return { ...group, member_count: count || 0 };
        })
      );

      setOpenGroups(groupsWithCounts);

    } catch (error: any) {
      console.error('Error loading open groups:', error);
    } finally {
      setIsLoadingOpenGroups(false);
    }
  };

  const handleJoinGroup = async (groupId: string) => {
    setIsJoining(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }

      // Get group details
      const { data: group } = await supabase
        .from('groups')
        .select('requires_approval')
        .eq('id', groupId)
        .single();

      // Add member
      const { error: memberError } = await supabase
        .from('group_members')
        .insert({
          group_id: groupId,
          user_id: user.id,
          role: 'member',
          status: group?.requires_approval ? 'pending' : 'active',
        });

      if (memberError) throw memberError;

      if (group?.requires_approval) {
        toast.success('Join request sent! Waiting for approval.');
      } else {
        toast.success('Successfully joined the group!');
      }

      setTimeout(() => {
        router.push('/dashboard/searcher');
      }, 1500);

    } catch (error: any) {
      console.error('Error joining group:', error);
      toast.error(error.message || 'Failed to join group');
    } finally {
      setIsJoining(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-50 to-yellow-50 p-6">
      <div className="max-w-2xl mx-auto">
        {/* Back button */}
        <button
          onClick={() => router.push('/dashboard/searcher')}
          className="mb-6 text-[#4A148C] hover:opacity-70 transition flex items-center gap-2"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Dashboard
        </button>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
              <UserPlus className="w-6 h-6 text-purple-600" />
            </div>
            <h1 className="text-3xl font-bold text-[#4A148C]">
              Join a Group
            </h1>
          </div>
          <p className="text-gray-600">
            Enter an invite code or browse open groups
          </p>
        </div>

        <div className="space-y-6">
          {/* Join with Code */}
          <div className="bg-white rounded-3xl p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Join with Invite Code</h2>

            <div className="flex gap-2 mb-4">
              <Input
                type="text"
                value={inviteCode}
                onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
                placeholder="Enter invite code"
                maxLength={8}
                className="flex-1 uppercase"
              />
              <Button
                onClick={handleSearchByCode}
                disabled={isSearching || !inviteCode.trim()}
                className="bg-[#4A148C] hover:bg-[#4A148C]/90"
              >
                {isSearching ? 'Searching...' : <Search className="w-5 h-5" />}
              </Button>
            </div>

            {foundGroup && (
              <div className="p-4 bg-purple-50 rounded-xl border-2 border-purple-200">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                      {foundGroup.name}
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">{foundGroup.description || 'No description'}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                  <span className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    {foundGroup.member_count} / {foundGroup.max_members} members
                  </span>
                  {foundGroup.requires_approval && (
                    <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs">
                      Requires approval
                    </span>
                  )}
                </div>

                <Button
                  onClick={() => handleJoinGroup(foundGroup.id)}
                  disabled={isJoining || (foundGroup.member_count || 0) >= foundGroup.max_members}
                  className="w-full bg-[#FFD600] text-black hover:bg-[#FFD600]/90"
                >
                  {isJoining ? 'Joining...' : (foundGroup.member_count || 0) >= foundGroup.max_members ? 'Group Full' : 'Join Group'}
                </Button>
              </div>
            )}
          </div>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="px-4 bg-gradient-to-br from-purple-50 to-yellow-50 text-sm text-gray-500">
                or browse open groups
              </span>
            </div>
          </div>

          {/* Open Groups */}
          <div className="bg-white rounded-3xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Open Groups</h2>
              <Button
                onClick={loadOpenGroups}
                variant="outline"
                size="sm"
                disabled={isLoadingOpenGroups}
              >
                {isLoadingOpenGroups ? 'Loading...' : 'Refresh'}
              </Button>
            </div>

            {openGroups.length === 0 && !isLoadingOpenGroups && (
              <div className="text-center py-8 text-gray-500">
                <Users className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p>No open groups available</p>
                <p className="text-sm mt-1">Click refresh to check for new groups</p>
              </div>
            )}

            {isLoadingOpenGroups && (
              <div className="text-center py-8">
                <div className="w-12 h-12 border-4 border-[#4A148C] border-t-transparent rounded-full animate-spin mx-auto" />
              </div>
            )}

            <div className="space-y-3">
              {openGroups.map((group) => (
                <div key={group.id} className="p-4 border-2 border-gray-200 rounded-xl hover:border-[#4A148C] transition">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{group.name}</h3>
                      <p className="text-sm text-gray-600 mt-1">{group.description || 'No description'}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      {group.member_count} / {group.max_members} members
                    </span>
                    <Button
                      onClick={() => handleJoinGroup(group.id)}
                      disabled={isJoining || (group.member_count || 0) >= group.max_members}
                      size="sm"
                      className="bg-[#4A148C] hover:bg-[#4A148C]/90"
                    >
                      {(group.member_count || 0) >= group.max_members ? 'Full' : 'Join'}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Info */}
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-4 border border-blue-200">
            <div className="flex gap-3">
              <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-gray-700">
                <p className="font-medium mb-1">About joining groups</p>
                <ul className="space-y-1 text-gray-600">
                  <li>• You can only be in one group at a time</li>
                  <li>• Some groups require approval from the creator</li>
                  <li>• Group search together and apply as one</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default function JoinGroupPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-yellow-50 flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-[#4A148C] border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <JoinGroupContent />
    </Suspense>
  );
}
