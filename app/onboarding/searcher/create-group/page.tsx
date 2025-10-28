'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Users, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { createClient } from '@/lib/auth/supabase-client';
import { showErrorToast, showSuccessToast } from '@/lib/toast-helpers';
import LanguageSwitcher from '@/components/LanguageSwitcher';

export default function CreateGroupPage() {
  const router = useRouter();
  const supabase = createClient();

  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    maxMembers: 4,
    requiresApproval: true,
  });

  const handleCreateGroup = async () => {
    if (!formData.name.trim()) {
      showErrorToast('Please enter a group name');
      return;
    }

    setIsLoading(true);

    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        showErrorToast('You must be logged in to create a group');
        router.push('/login');
        return;
      }

      // Create the group
      const { data: group, error: groupError } = await supabase
        .from('groups')
        .insert({
          name: formData.name.trim(),
          description: formData.description.trim() || null,
          max_members: formData.maxMembers,
          requires_approval: formData.requiresApproval,
          created_by: user.id,
        })
        .select()
        .single();

      if (groupError) throw groupError;

      // Add creator as first member with 'creator' role
      const { error: memberError } = await supabase
        .from('group_members')
        .insert({
          group_id: group.id,
          user_id: user.id,
          role: 'creator',
          status: 'active',
        });

      if (memberError) throw memberError;

      // Store group ID in localStorage
      localStorage.setItem('current_group_id', group.id);

      showSuccessToast('Group created successfully!', 'You can invite members after completing your profile');

      // Continue to onboarding
      router.push('/onboarding/searcher/basic-info');

    } catch (error: any) {
      // FIXME: Use logger.error('Error creating group:', error);
      showErrorToast('Failed to create group', error.message);
    } finally {
      setIsLoading(false);
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
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-yellow-500 to-yellow-600 flex items-center justify-center">
            <Users className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Create Your Group
          </h1>
          <p className="text-lg text-gray-600">
            Set up your group and invite friends to search for coliving together
          </p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-3xl shadow-xl p-8 space-y-6">
          {/* Group Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Group Name *</Label>
            <Input
              id="name"
              placeholder="e.g., Tech Friends Looking for Place"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              maxLength={100}
            />
            <p className="text-sm text-gray-500">
              Choose a name that describes your group
            </p>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              placeholder="Tell potential members about your group..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              maxLength={500}
              rows={4}
            />
            <p className="text-sm text-gray-500">
              {formData.description.length}/500 characters
            </p>
          </div>

          {/* Max Members */}
          <div className="space-y-2">
            <Label htmlFor="maxMembers">Maximum Members</Label>
            <select
              id="maxMembers"
              value={formData.maxMembers}
              onChange={(e) => setFormData({ ...formData, maxMembers: parseInt(e.target.value) })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              {[2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                <option key={num} value={num}>{num} members</option>
              ))}
            </select>
            <p className="text-sm text-gray-500">
              How many people can join your group (including you)
            </p>
          </div>

          {/* Requires Approval */}
          <div className="space-y-2">
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                id="requiresApproval"
                checked={formData.requiresApproval}
                onChange={(e) => setFormData({ ...formData, requiresApproval: e.target.checked })}
                className="mt-1 w-5 h-5 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
              />
              <div className="flex-1">
                <Label htmlFor="requiresApproval" className="cursor-pointer font-medium">
                  Require approval for new members
                </Label>
                <p className="text-sm text-gray-500 mt-1">
                  If enabled, you'll need to approve anyone who wants to join your group
                </p>
              </div>
            </div>
          </div>

          {/* Info Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <div className="flex gap-3">
              <Check className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-900">
                <p className="font-medium mb-1">What happens next?</p>
                <ul className="space-y-1 text-blue-800">
                  <li>Complete your personal profile</li>
                  <li>Invite friends to join your group</li>
                  <li>Search and apply for properties together</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-4">
            <Button
              variant="outline"
              onClick={() => router.back()}
              className="flex-1"
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateGroup}
              disabled={!formData.name.trim() || isLoading}
              className="flex-1"
            >
              {isLoading ? 'Creating...' : 'Create Group & Continue'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
