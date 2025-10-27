'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/auth/supabase-client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Users, CalendarDays, DollarSign, MapPin, Check } from 'lucide-react';
import { toast } from 'sonner';
import { useLanguage } from '@/lib/i18n/use-language';

export default function CreateGroupPage() {
  const router = useRouter();
  const supabase = createClient();
  const { getSection } = useLanguage();
  const common = getSection('common');

  const [isCreating, setIsCreating] = useState(false);
  const [groupName, setGroupName] = useState('');
  const [description, setDescription] = useState('');
  const [maxMembers, setMaxMembers] = useState(4);
  const [isOpen, setIsOpen] = useState(true);
  const [requiresApproval, setRequiresApproval] = useState(true);

  // Group preferences
  const [budgetMin, setBudgetMin] = useState('');
  const [budgetMax, setBudgetMax] = useState('');
  const [preferredCity, setPreferredCity] = useState('');
  const [preferredCities, setPreferredCities] = useState<string[]>([]);
  const [moveInDate, setMoveInDate] = useState('');

  const addCity = () => {
    if (preferredCity.trim() && !preferredCities.includes(preferredCity.trim())) {
      setPreferredCities([...preferredCities, preferredCity.trim()]);
      setPreferredCity('');
    }
  };

  const removeCity = (city: string) => {
    setPreferredCities(preferredCities.filter(c => c !== city));
  };

  const handleCreateGroup = async () => {
    if (!groupName.trim()) {
      toast.error('Please enter a group name');
      return;
    }

    if (maxMembers < 2 || maxMembers > 10) {
      toast.error('Group size must be between 2 and 10 members');
      return;
    }

    setIsCreating(true);

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
        toast.error('You are already in a group. Leave your current group before creating a new one.');
        setIsCreating(false);
        return;
      }

      // Create group
      const { data: newGroup, error: groupError } = await supabase
        .from('groups')
        .insert({
          name: groupName,
          description: description || null,
          max_members: maxMembers,
          is_open: isOpen,
          requires_approval: requiresApproval,
          budget_min: budgetMin ? parseFloat(budgetMin) : null,
          budget_max: budgetMax ? parseFloat(budgetMax) : null,
          preferred_cities: preferredCities.length > 0 ? preferredCities : null,
          move_in_date: moveInDate || null,
          created_by: user.id,
        })
        .select()
        .single();

      if (groupError) throw groupError;

      // Add creator as first member
      const { error: memberError } = await supabase
        .from('group_members')
        .insert({
          group_id: newGroup.id,
          user_id: user.id,
          role: 'creator',
          status: 'active',
        });

      if (memberError) throw memberError;

      // Generate an invite code for the group
      const inviteCode = Math.random().toString(36).substring(2, 10).toUpperCase();
      const { error: inviteError } = await supabase
        .from('group_invitations')
        .insert({
          group_id: newGroup.id,
          invite_code: inviteCode,
          invited_by: user.id,
          expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days
        });

      if (inviteError) console.error('Error creating invite code:', inviteError);

      toast.success('Group created successfully!');

      // Redirect to searcher dashboard
      setTimeout(() => {
        router.push('/dashboard/searcher');
      }, 1000);

    } catch (error: any) {
      console.error('Error creating group:', error);
      toast.error(error.message || 'Failed to create group');
    } finally {
      setIsCreating(false);
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
              <Users className="w-6 h-6 text-purple-600" />
            </div>
            <h1 className="text-3xl font-bold text-[#4A148C]">
              Create a Group
            </h1>
          </div>
          <p className="text-gray-600">
            Find coliving spaces together with friends or meet new roommates
          </p>
        </div>

        <div className="space-y-6">
          {/* Basic Info */}
          <div className="bg-white rounded-3xl p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Basic Information</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Group Name *
                </label>
                <Input
                  type="text"
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  placeholder="e.g., Brussels Adventurers"
                  maxLength={50}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Tell others about your group..."
                  rows={3}
                  maxLength={500}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#4A148C] focus:ring-2 focus:ring-[#4A148C]/20 outline-none transition"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Maximum Members: {maxMembers}
                </label>
                <input
                  type="range"
                  min="2"
                  max="10"
                  value={maxMembers}
                  onChange={(e) => setMaxMembers(parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#4A148C]"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>2</span>
                  <span>10</span>
                </div>
              </div>
            </div>
          </div>

          {/* Group Settings */}
          <div className="bg-white rounded-3xl p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Group Settings</h2>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div>
                  <div className="font-medium text-gray-900">Open to new members</div>
                  <div className="text-sm text-gray-500">Allow people to find and join your group</div>
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

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div>
                  <div className="font-medium text-gray-900">Require approval</div>
                  <div className="text-sm text-gray-500">Review requests before members join</div>
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

          {/* Group Preferences */}
          <div className="bg-white rounded-3xl p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Group Preferences</h2>
            <p className="text-sm text-gray-500 mb-4">Help match with suitable properties</p>

            <div className="space-y-4">
              {/* Budget */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <DollarSign className="w-4 h-4" />
                  Budget per person (€/month)
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <Input
                    type="number"
                    value={budgetMin}
                    onChange={(e) => setBudgetMin(e.target.value)}
                    placeholder="Min"
                    min="0"
                  />
                  <Input
                    type="number"
                    value={budgetMax}
                    onChange={(e) => setBudgetMax(e.target.value)}
                    placeholder="Max"
                    min="0"
                  />
                </div>
              </div>

              {/* Preferred Cities */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Preferred Cities
                </label>
                <div className="flex gap-2 mb-2">
                  <Input
                    type="text"
                    value={preferredCity}
                    onChange={(e) => setPreferredCity(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addCity()}
                    placeholder="Add a city..."
                  />
                  <Button onClick={addCity} className="bg-[#4A148C] hover:bg-[#4A148C]/90">
                    Add
                  </Button>
                </div>
                {preferredCities.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {preferredCities.map((city) => (
                      <span
                        key={city}
                        className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm flex items-center gap-2"
                      >
                        {city}
                        <button onClick={() => removeCity(city)} className="hover:text-purple-900">
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Move-in Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <CalendarDays className="w-4 h-4" />
                  Desired Move-in Date
                </label>
                <Input
                  type="date"
                  value={moveInDate}
                  onChange={(e) => setMoveInDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
            </div>
          </div>

          {/* Info Callout */}
          <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl p-4 border border-purple-200">
            <div className="flex gap-3">
              <Check className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-gray-700">
                <p className="font-medium mb-1">What happens next?</p>
                <ul className="space-y-1 text-gray-600">
                  <li>• You'll get a shareable invite code</li>
                  <li>• Invite friends or find members</li>
                  <li>• Search for properties together</li>
                  <li>• Apply as a group with combined profiles</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              onClick={() => router.push('/dashboard/searcher')}
              variant="outline"
              className="flex-1"
              disabled={isCreating}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateGroup}
              disabled={isCreating || !groupName.trim()}
              className="flex-1 bg-[#FFD600] text-black hover:bg-[#FFD600]/90"
            >
              {isCreating ? 'Creating...' : 'Create Group'}
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}
