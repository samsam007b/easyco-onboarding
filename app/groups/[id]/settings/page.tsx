'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { createClient } from '@/lib/auth/supabase-client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Settings as SettingsIcon, Users, Trash2, LogOut, Copy, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import { useLanguage } from '@/lib/i18n/use-language';
import LoadingHouse from '@/components/ui/LoadingHouse';

interface Group {
  id: string;
  name: string;
  description: string | null;
  max_members: number;
  is_open: boolean;
  requires_approval: boolean;
  created_by: string;
}

interface GroupMember {
  id: string;
  user_id: string;
  role: 'creator' | 'admin' | 'member';
  status: string;
  users: {
    full_name: string;
    email: string;
  };
}

export default function GroupSettingsPage() {
  const router = useRouter();
  const params = useParams();
  const groupId = params?.id as string;
  const supabase = createClient();
  const { t } = useLanguage();

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [group, setGroup] = useState<Group | null>(null);
  const [members, setMembers] = useState<GroupMember[]>([]);
  const [userRole, setUserRole] = useState<string>('');
  const [inviteCode, setInviteCode] = useState<string>('');

  // Form state
  const [groupName, setGroupName] = useState('');
  const [description, setDescription] = useState('');
  const [maxMembers, setMaxMembers] = useState(4);
  const [isOpen, setIsOpen] = useState(true);
  const [requiresApproval, setRequiresApproval] = useState(true);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    if (groupId) {
      loadGroupData();
    }
  }, [groupId]);

  const loadGroupData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }

      // Get group details
      const { data: groupData, error: groupError } = await supabase
        .from('groups')
        .select('*')
        .eq('id', groupId)
        .single();

      if (groupError || !groupData) {
        toast.error(t('groupSettings.errors.groupNotFound'));
        router.push('/dashboard/searcher');
        return;
      }

      // Check user's membership
      const { data: membership, error: memberError } = await supabase
        .from('group_members')
        .select('role')
        .eq('group_id', groupId)
        .eq('user_id', user.id)
        .eq('status', 'active')
        .single();

      if (memberError || !membership) {
        toast.error(t('groupSettings.errors.notMember'));
        router.push('/dashboard/searcher');
        return;
      }

      // Only creator/admin can access settings
      if (membership.role !== 'creator' && membership.role !== 'admin') {
        toast.error(t('groupSettings.errors.noAccess'));
        router.push('/dashboard/searcher');
        return;
      }

      setUserRole(membership.role);
      setGroup(groupData);
      setGroupName(groupData.name);
      setDescription(groupData.description || '');
      setMaxMembers(groupData.max_members);
      setIsOpen(groupData.is_open);
      setRequiresApproval(groupData.requires_approval);

      // Load members
      const { data: membersData } = await supabase
        .from('group_members')
        .select(`
          id,
          user_id,
          role,
          status,
          users:user_id (
            full_name,
            email
          )
        `)
        .eq('group_id', groupId)
        .eq('status', 'active');

      if (membersData) {
        setMembers(membersData as any);
      }

      // Get invite code
      const { data: invitation } = await supabase
        .from('group_invitations')
        .select('invite_code')
        .eq('group_id', groupId)
        .not('invite_code', 'is', null)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (invitation?.invite_code) {
        setInviteCode(invitation.invite_code);
      }

    } catch (error: any) {
      // FIXME: Use logger.error('Error loading group:', error);
      toast.error(t('groupSettings.errors.loadFailed'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveSettings = async () => {
    if (!groupName.trim()) {
      toast.error(t('groupSettings.errors.nameRequired'));
      return;
    }

    setIsSaving(true);

    try {
      const { error } = await supabase
        .from('groups')
        .update({
          name: groupName,
          description: description || null,
          max_members: maxMembers,
          is_open: isOpen,
          requires_approval: requiresApproval,
        })
        .eq('id', groupId);

      if (error) throw error;

      toast.success(t('groupSettings.toast.settingsSaved'));
      setGroup({ ...group!, name: groupName, description, max_members: maxMembers, is_open: isOpen, requires_approval: requiresApproval });

    } catch (error: any) {
      // FIXME: Use logger.error('Error saving settings:', error);
      toast.error(error.message || t('groupSettings.errors.saveFailed'));
    } finally {
      setIsSaving(false);
    }
  };

  const handleRemoveMember = async (memberId: string, memberUserId: string) => {
    if (!confirm(t('groupSettings.members.removeConfirm'))) return;

    try {
      const { error } = await supabase
        .from('group_members')
        .update({ status: 'removed', left_at: new Date().toISOString() })
        .eq('id', memberId);

      if (error) throw error;

      toast.success(t('groupSettings.members.removed'));
      setMembers(members.filter(m => m.id !== memberId));

    } catch (error: any) {
      // FIXME: Use logger.error('Error removing member:', error);
      toast.error(t('groupSettings.members.removeFailed'));
    }
  };

  const handleLeaveGroup = async () => {
    if (!confirm(t('groupSettings.dangerZone.leaveGroup.confirm'))) return;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('group_members')
        .update({ status: 'left', left_at: new Date().toISOString() })
        .eq('group_id', groupId)
        .eq('user_id', user.id);

      if (error) throw error;

      toast.success(t('groupSettings.dangerZone.leaveGroup.success'));
      setTimeout(() => router.push('/dashboard/searcher'), 1000);

    } catch (error: any) {
      // FIXME: Use logger.error('Error leaving group:', error);
      toast.error(t('groupSettings.dangerZone.leaveGroup.failed'));
    }
  };

  const handleDeleteGroup = async () => {
    setIsDeleting(true);

    try {
      // Delete group (cascade will handle members, invitations, applications)
      const { error } = await supabase
        .from('groups')
        .delete()
        .eq('id', groupId);

      if (error) throw error;

      toast.success(t('groupSettings.dangerZone.deleteGroup.success'));
      setTimeout(() => router.push('/dashboard/searcher'), 1000);

    } catch (error: any) {
      // FIXME: Use logger.error('Error deleting group:', error);
      toast.error(t('groupSettings.dangerZone.deleteGroup.failed'));
      setIsDeleting(false);
    }
  };

  const copyInviteCode = () => {
    if (inviteCode) {
      navigator.clipboard.writeText(inviteCode);
      toast.success(t('groupSettings.inviteCode.copied'));
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-yellow-50 flex items-center justify-center">
        <LoadingHouse size={80} />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-50 to-yellow-50 p-6">
      <div className="max-w-2xl mx-auto">
        {/* Back button */}
        <button
          onClick={() => router.push('/dashboard/searcher')}
          className="mb-6 text-[#4A148C] hover:opacity-70 transition flex items-center gap-2"
        >
          <ArrowLeft className="w-5 h-5" />
          {t('groupSettings.backToDashboard')}
        </button>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
              <SettingsIcon className="w-6 h-6 text-purple-600" />
            </div>
            <h1 className="text-3xl font-bold text-[#4A148C]">
              {t('groupSettings.title')}
            </h1>
          </div>
          <p className="text-gray-600">{t('groupSettings.subtitle')}</p>
        </div>

        <div className="space-y-6">
          {/* Basic Settings */}
          <div className="bg-white superellipse-3xl p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">{t('groupSettings.basicInfo.title')}</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{t('groupSettings.basicInfo.groupName')}</label>
                <Input
                  type="text"
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  placeholder={t('groupSettings.basicInfo.groupNamePlaceholder')}
                  maxLength={50}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{t('groupSettings.basicInfo.description')}</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder={t('groupSettings.basicInfo.descriptionPlaceholder')}
                  rows={3}
                  maxLength={500}
                  className="w-full px-4 py-3 superellipse-xl border border-gray-200 focus:border-[#4A148C] focus:ring-2 focus:ring-[#4A148C]/20 outline-none transition"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('groupSettings.basicInfo.maxMembers')}: {maxMembers}
                </label>
                <input
                  type="range"
                  min="2"
                  max="10"
                  value={maxMembers}
                  onChange={(e) => setMaxMembers(parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#4A148C]"
                />
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between p-4 bg-gray-50 superellipse-xl">
                  <div>
                    <div className="font-medium text-gray-900">{t('groupSettings.basicInfo.openToNewMembers.title')}</div>
                    <div className="text-sm text-gray-500">{t('groupSettings.basicInfo.openToNewMembers.description')}</div>
                  </div>
                  <button
                    onClick={() => setIsOpen(!isOpen)}
                    className={`relative w-14 h-8 rounded-full transition ${
                      isOpen ? 'bg-[#4A148C]' : 'bg-gray-300'
                    }`}
                  >
                    <div
                      className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow transition ${
                        isOpen ? 'right-1' : 'left-1'
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 superellipse-xl">
                  <div>
                    <div className="font-medium text-gray-900">{t('groupSettings.basicInfo.requireApproval.title')}</div>
                    <div className="text-sm text-gray-500">{t('groupSettings.basicInfo.requireApproval.description')}</div>
                  </div>
                  <button
                    onClick={() => setRequiresApproval(!requiresApproval)}
                    className={`relative w-14 h-8 rounded-full transition ${
                      requiresApproval ? 'bg-[#4A148C]' : 'bg-gray-300'
                    }`}
                  >
                    <div
                      className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow transition ${
                        requiresApproval ? 'right-1' : 'left-1'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <Button
                onClick={handleSaveSettings}
                disabled={isSaving}
                className="w-full bg-[#4A148C] hover:bg-[#4A148C]/90"
              >
                {isSaving ? t('groupSettings.basicInfo.saving') : t('groupSettings.basicInfo.saveButton')}
              </Button>
            </div>
          </div>

          {/* Invite Code */}
          {inviteCode && (
            <div className="bg-white superellipse-3xl p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">{t('groupSettings.inviteCode.title')}</h2>
              <div className="flex gap-2">
                <Input
                  type="text"
                  value={inviteCode}
                  readOnly
                  className="flex-1 font-mono text-lg"
                />
                <Button onClick={copyInviteCode} className="bg-[#4A148C] hover:bg-[#4A148C]/90">
                  <Copy className="w-5 h-5" />
                </Button>
              </div>
              <p className="text-sm text-gray-500 mt-2">
                {t('groupSettings.inviteCode.shareHint')}
              </p>
            </div>
          )}

          {/* Members */}
          <div className="bg-white superellipse-3xl p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Users className="w-5 h-5" />
              {t('groupSettings.members.title')} ({members.length}/{maxMembers})
            </h2>

            <div className="space-y-3">
              {members.map((member) => (
                <div key={member.id} className="flex items-center justify-between p-4 bg-gray-50 superellipse-xl">
                  <div>
                    <div className="font-medium text-gray-900">{member.users.full_name}</div>
                    <div className="text-sm text-gray-500">{member.users.email}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium capitalize">
                      {member.role}
                    </span>
                    {member.role !== 'creator' && userRole === 'creator' && (
                      <Button
                        onClick={() => handleRemoveMember(member.id, member.user_id)}
                        variant="outline"
                        size="sm"
                        className="text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Danger Zone */}
          <div className="bg-white superellipse-3xl p-6 shadow-sm border-2 border-red-200">
            <h2 className="text-xl font-semibold text-red-600 mb-4">{t('groupSettings.dangerZone.title')}</h2>

            <div className="space-y-3">
              {userRole !== 'creator' && (
                <div>
                  <p className="text-sm text-gray-600 mb-2">{t('groupSettings.dangerZone.leaveGroup.description')}</p>
                  <Button
                    onClick={handleLeaveGroup}
                    variant="outline"
                    className="border-red-300 text-red-600 hover:bg-red-50"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    {t('groupSettings.dangerZone.leaveGroup.button')}
                  </Button>
                </div>
              )}

              {userRole === 'creator' && (
                <div>
                  <p className="text-sm text-gray-600 mb-2">
                    {t('groupSettings.dangerZone.deleteGroup.description')}
                  </p>
                  {!showDeleteConfirm ? (
                    <Button
                      onClick={() => setShowDeleteConfirm(true)}
                      variant="outline"
                      className="border-red-300 text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      {t('groupSettings.dangerZone.deleteGroup.button')}
                    </Button>
                  ) : (
                    <div className="p-4 bg-red-50 superellipse-xl border-2 border-red-200">
                      <div className="flex items-start gap-2 mb-3">
                        <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                        <div className="text-sm text-red-900">
                          <p className="font-medium">{t('groupSettings.dangerZone.deleteGroup.confirmTitle')}</p>
                          <p className="mt-1">{t('groupSettings.dangerZone.deleteGroup.confirmDescription')}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          onClick={handleDeleteGroup}
                          disabled={isDeleting}
                          className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                        >
                          {isDeleting ? t('groupSettings.dangerZone.deleteGroup.deleting') : t('groupSettings.dangerZone.deleteGroup.confirmButton')}
                        </Button>
                        <Button
                          onClick={() => setShowDeleteConfirm(false)}
                          variant="outline"
                          disabled={isDeleting}
                        >
                          {t('groupSettings.dangerZone.cancel')}
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
