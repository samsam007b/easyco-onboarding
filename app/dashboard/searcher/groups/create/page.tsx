'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/auth/supabase-client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import LoadingHouse from '@/components/ui/LoadingHouse';
import {
  ArrowLeft,
  Users,
  CalendarDays,
  Euro,
  MapPin,
  Check,
  Sparkles,
  UserPlus,
  Search,
  Home,
  ChevronRight,
  Info,
  Settings
} from 'lucide-react';
import { toast } from 'sonner';
import { useLanguage } from '@/lib/i18n/use-language';

export default function CreateGroupPage() {
  const router = useRouter();
  const supabase = createClient();
  const { language, getSection } = useLanguage();
  const t = getSection('dashboard')?.searcher?.groupCreate;

  const [isCreating, setIsCreating] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [createdGroup, setCreatedGroup] = useState<any>(null);
  const [inviteCode, setInviteCode] = useState('');

  // Form state
  const [groupName, setGroupName] = useState('');
  const [description, setDescription] = useState('');
  const [maxMembers, setMaxMembers] = useState(4);
  const [isOpen, setIsOpen] = useState(true);
  const [requiresApproval, setRequiresApproval] = useState(true);
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
      toast.error(t?.messages?.nameRequired?.[language] || 'Please enter a group name');
      return;
    }

    if (maxMembers < 2 || maxMembers > 10) {
      toast.error(t?.messages?.sizeError?.[language] || 'Group size must be between 2 and 10 members');
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
        toast.error(t?.messages?.alreadyInGroup?.[language] || 'You are already in a group. Leave your current group before creating a new one.');
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
      const generatedInviteCode = Math.random().toString(36).substring(2, 10).toUpperCase();
      const { error: inviteError } = await supabase
        .from('group_invitations')
        .insert({
          group_id: newGroup.id,
          invite_code: generatedInviteCode,
          invited_by: user.id,
          expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days
        });

      if (inviteError) console.error('Error creating invite code:', inviteError);

      setCreatedGroup(newGroup);
      setInviteCode(generatedInviteCode);
      setShowSuccessModal(true);
      toast.success(t?.messages?.success?.[language] || 'Group created successfully!');

    } catch (error: any) {
      console.error('Error creating group:', error);
      toast.error(error.message || t?.messages?.error?.[language] || 'Failed to create group');
    } finally {
      setIsCreating(false);
    }
  };

  const formatBudget = (min: string, max: string) => {
    if (!min && !max) return t?.budget?.flexible?.[language] || 'Flexible budget';
    if (!min) return `${t?.budget?.upTo?.[language] || 'Up to'} €${max}`;
    if (!max) return `${t?.budget?.from?.[language] || 'From'} €${min}`;
    return `€${min}-${max}`;
  };

  return (
    <>
      <main className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-5xl mx-auto">

          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                onClick={() => router.push('/dashboard/searcher/groups')}
                className="gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                {t?.back?.[language] || 'Back'}
              </Button>

              <div>
                <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#FFA040] to-[#FFB85C] rounded-2xl flex items-center justify-center shadow-lg">
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                  {t?.title?.[language] || 'Create a Group'}
                </h1>
                <p className="text-gray-600 mt-1">
                  {t?.subtitle?.[language] || 'Find roommates and search together'}
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* Form Section */}
            <div className="lg:col-span-2 space-y-6">

              {/* Basic Info */}
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-br from-[#FFA040] to-[#FFB85C] rounded-xl flex items-center justify-center">
                    <Users className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">{t?.basicInfo?.title?.[language] || 'Basic information'}</h2>
                </div>

                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      {t?.basicInfo?.groupName?.[language] || 'Group name'} *
                    </label>
                    <Input
                      type="text"
                      value={groupName}
                      onChange={(e) => setGroupName(e.target.value)}
                      placeholder={t?.basicInfo?.groupNamePlaceholder?.[language] || 'e.g. The Brussels Adventurers'}
                      maxLength={50}
                      className="text-base"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      {groupName.length}/50 {t?.basicInfo?.characters?.[language] || 'characters'}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      {t?.basicInfo?.description?.[language] || 'Description'}
                    </label>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder={t?.basicInfo?.descriptionPlaceholder?.[language] || 'Tell us about your group, your interests, your lifestyle...'}
                      rows={4}
                      maxLength={500}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#FFA040] focus:ring-2 focus:ring-orange-100 outline-none transition text-base"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      {description.length}/500 {t?.basicInfo?.characters?.[language] || 'characters'}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      {t?.basicInfo?.maxMembers?.[language] || 'Maximum number of members'}: <span className="text-[#FFA040] text-lg font-bold">{maxMembers}</span>
                    </label>
                    <input
                      type="range"
                      min="2"
                      max="10"
                      value={maxMembers}
                      onChange={(e) => setMaxMembers(parseInt(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                      style={{
                        background: `linear-gradient(to right, #FFA040 0%, #FFA040 ${((maxMembers - 2) / 8) * 100}%, #E5E7EB ${((maxMembers - 2) / 8) * 100}%, #E5E7EB 100%)`
                      }}
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-2">
                      <span>2 {t?.basicInfo?.people?.[language] || 'people'}</span>
                      <span>10 {t?.basicInfo?.people?.[language] || 'people'}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Group Settings */}
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-br from-[#FFA040] to-[#FFB85C] rounded-xl flex items-center justify-center">
                    <Settings className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">{t?.settings?.title?.[language] || 'Group settings'}</h2>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900 flex items-center gap-2">
                        {t?.settings?.openToNew?.title?.[language] || 'Open to new members'}
                      </div>
                      <div className="text-sm text-gray-600 mt-1">
                        {t?.settings?.openToNew?.description?.[language] || 'Allow others to find and join your group'}
                      </div>
                    </div>
                    <button
                      onClick={() => setIsOpen(!isOpen)}
                      className={`relative w-14 h-8 rounded-full transition-all ${
                        isOpen ? 'bg-gradient-to-r from-[#FFA040] to-[#FFB85C]' : 'bg-gray-300'
                      }`}
                    >
                      <div
                        className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow-md transition-all ${
                          isOpen ? 'right-1' : 'left-1'
                        }`}
                      />
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900 flex items-center gap-2">
                        {t?.settings?.approval?.title?.[language] || 'Requires approval'}
                      </div>
                      <div className="text-sm text-gray-600 mt-1">
                        {t?.settings?.approval?.description?.[language] || 'Review requests before members can join'}
                      </div>
                    </div>
                    <button
                      onClick={() => setRequiresApproval(!requiresApproval)}
                      className={`relative w-14 h-8 rounded-full transition-all ${
                        requiresApproval ? 'bg-gradient-to-r from-[#FFA040] to-[#FFB85C]' : 'bg-gray-300'
                      }`}
                    >
                      <div
                        className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow-md transition-all ${
                          requiresApproval ? 'right-1' : 'left-1'
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>

              {/* Group Preferences */}
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <h2 className="text-xl font-bold text-gray-900 mb-2">{t?.preferences?.title?.[language] || 'Search preferences'}</h2>
                <p className="text-sm text-gray-600 mb-6">
                  {t?.preferences?.subtitle?.[language] || 'Help find properties that match your criteria'}
                </p>

                <div className="space-y-6">
                  {/* Budget */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                      <Euro className="w-4 h-4 text-[#FFA040]" />
                      {t?.preferences?.budgetLabel?.[language] || 'Budget per person (€/month)'}
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Input
                          type="number"
                          value={budgetMin}
                          onChange={(e) => setBudgetMin(e.target.value)}
                          placeholder={t?.preferences?.minimum?.[language] || 'Minimum'}
                          min="0"
                          className="text-base"
                        />
                      </div>
                      <div>
                        <Input
                          type="number"
                          value={budgetMax}
                          onChange={(e) => setBudgetMax(e.target.value)}
                          placeholder={t?.preferences?.maximum?.[language] || 'Maximum'}
                          min="0"
                          className="text-base"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Preferred Cities */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-[#FFA040]" />
                      {t?.preferences?.citiesLabel?.[language] || 'Preferred cities'}
                    </label>
                    <div className="flex gap-2 mb-3">
                      <Input
                        type="text"
                        value={preferredCity}
                        onChange={(e) => setPreferredCity(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCity())}
                        placeholder={t?.preferences?.addCityPlaceholder?.[language] || 'Add a city...'}
                        className="text-base"
                      />
                      <Button
                        onClick={addCity}
                        className="bg-gradient-to-r from-[#FFA040] to-[#FFB85C] hover:from-[#FF8C30] hover:to-[#FFA548] text-white px-6 whitespace-nowrap"
                      >
                        {t?.preferences?.add?.[language] || 'Add'}
                      </Button>
                    </div>
                    {preferredCities.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {preferredCities.map((city) => (
                          <span
                            key={city}
                            className="px-3 py-2 bg-orange-50 text-[#FFA040] rounded-full text-sm font-medium flex items-center gap-2 border border-orange-100"
                          >
                            <MapPin className="w-3 h-3" />
                            {city}
                            <button
                              onClick={() => removeCity(city)}
                              className="hover:text-orange-700 ml-1 font-bold text-base"
                            >
                              ×
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Move-in Date */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                      <CalendarDays className="w-4 h-4 text-[#FFA040]" />
                      {t?.preferences?.moveInDate?.[language] || 'Desired move-in date'}
                    </label>
                    <Input
                      type="date"
                      value={moveInDate}
                      onChange={(e) => setMoveInDate(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      className="text-base"
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4">
                <Button
                  onClick={() => router.push('/dashboard/searcher/groups')}
                  variant="outline"
                  className="flex-1 py-6 text-base border-2 rounded-xl"
                  disabled={isCreating}
                >
                  {t?.actions?.cancel?.[language] || 'Cancel'}
                </Button>
                <Button
                  onClick={handleCreateGroup}
                  disabled={isCreating || !groupName.trim()}
                  className="flex-1 py-6 text-base bg-gradient-to-r from-[#FFA040] to-[#FFB85C] hover:from-[#FF8C30] hover:to-[#FFA548] text-white rounded-xl shadow-lg hover:shadow-xl transition-all font-semibold"
                >
                  {isCreating ? (
                    <>
                      <LoadingHouse size={20} />
                      {t?.actions?.creating?.[language] || 'Creating...'}
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5 mr-2" />
                      {t?.actions?.create?.[language] || 'Create group'}
                    </>
                  )}
                </Button>
              </div>
            </div>

            {/* Preview Section */}
            <div className="lg:col-span-1">
              <div className="sticky top-6 space-y-6">

                {/* Group Preview */}
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-orange-100">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-2 h-2 bg-[#FFA040] rounded-full animate-pulse" />
                    <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                      {t?.preview?.title?.[language] || 'Group preview'}
                    </h3>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-[#FFA040] to-[#FFB85C] rounded-2xl flex items-center justify-center shadow-md">
                        <Users className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-gray-900 truncate">
                          {groupName || (t?.preview?.groupNamePlaceholder?.[language] || 'Group name')}
                        </h4>
                        <p className="text-sm text-gray-500">
                          1/{maxMembers} {t?.preview?.members?.[language] || 'members'}
                        </p>
                      </div>
                    </div>

                    {description && (
                      <p className="text-sm text-gray-600 line-clamp-3 bg-orange-50 p-3 rounded-xl">
                        {description}
                      </p>
                    )}

                    <div className="space-y-2 pt-2">
                      {preferredCities.length > 0 && (
                        <div className="flex items-start gap-2 text-sm">
                          <MapPin className="h-4 w-4 text-[#FFA040] mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700 font-medium">
                            {preferredCities.join(', ')}
                          </span>
                        </div>
                      )}

                      {(budgetMin || budgetMax) && (
                        <div className="flex items-center gap-2 text-sm">
                          <Euro className="h-4 w-4 text-[#FFA040] flex-shrink-0" />
                          <span className="text-gray-700 font-medium">
                            {formatBudget(budgetMin, budgetMax)}
                          </span>
                        </div>
                      )}

                      {moveInDate && (
                        <div className="flex items-center gap-2 text-sm">
                          <CalendarDays className="h-4 w-4 text-[#FFA040] flex-shrink-0" />
                          <span className="text-gray-700 font-medium">
                            {new Date(moveInDate).toLocaleDateString(
                              language === 'fr' ? 'fr-FR' : language === 'de' ? 'de-DE' : language === 'nl' ? 'nl-NL' : 'en-GB',
                              { month: 'long', year: 'numeric' }
                            )}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="flex gap-2 pt-2">
                      {isOpen && (
                        <span className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-xs font-medium border border-green-100">
                          {t?.preview?.badges?.open?.[language] || 'Open'}
                        </span>
                      )}
                      {requiresApproval && (
                        <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium border border-blue-100">
                          {t?.preview?.badges?.approval?.[language] || 'By approval'}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Benefits */}
                <div className="bg-gradient-to-br from-orange-50 to-yellow-50 rounded-2xl p-6 border border-orange-100">
                  <div className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-[#FFA040] flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-gray-700">
                      <p className="font-semibold mb-2">{t?.benefits?.title?.[language] || 'What happens next?'}</p>
                      <ul className="space-y-2 text-gray-600">
                        <li className="flex items-start gap-2">
                          <ChevronRight className="w-4 h-4 text-[#FFA040] flex-shrink-0 mt-0.5" />
                          <span>{t?.benefits?.step1?.[language] || 'You will receive an invite code'}</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <ChevronRight className="w-4 h-4 text-[#FFA040] flex-shrink-0 mt-0.5" />
                          <span>{t?.benefits?.step2?.[language] || 'Invite friends or find members'}</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <ChevronRight className="w-4 h-4 text-[#FFA040] flex-shrink-0 mt-0.5" />
                          <span>{t?.benefits?.step3?.[language] || 'Search together'}</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <ChevronRight className="w-4 h-4 text-[#FFA040] flex-shrink-0 mt-0.5" />
                          <span>{t?.benefits?.step4?.[language] || 'Apply as a group'}</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Success Modal */}
      {showSuccessModal && createdGroup && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-8 shadow-2xl animate-scaleIn">
            {/* Success Icon */}
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-full mb-4">
                <Check className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                {t?.successModal?.title?.[language] || 'Group created successfully!'}
              </h2>
              <p className="text-gray-600">
                {t?.successModal?.subtitle?.[language]?.replace('{name}', createdGroup.name) || `Your group "${createdGroup.name}" is now ready`}
              </p>
            </div>

            {/* Invite Code */}
            <div className="bg-gradient-to-br from-orange-50 to-yellow-50 rounded-2xl p-6 mb-6 border-2 border-orange-200">
              <div className="text-center">
                <p className="text-sm font-semibold text-gray-700 mb-2">
                  {t?.successModal?.inviteCode?.label?.[language] || 'Invite code'}
                </p>
                <div className="flex items-center justify-center gap-3 mb-3">
                  <code className="text-3xl font-bold text-[#FFA040] tracking-wider bg-white px-6 py-3 rounded-xl border-2 border-orange-300">
                    {inviteCode}
                  </code>
                </div>
                <p className="text-xs text-gray-600">
                  {t?.successModal?.inviteCode?.hint?.[language] || 'Share this code with your friends to invite them'}
                </p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="space-y-3 mb-6">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">
                {t?.successModal?.nextSteps?.[language] || 'Next steps:'}
              </h3>

              <Button
                onClick={() => router.push(`/groups/${createdGroup.id}`)}
                className="w-full bg-gradient-to-r from-[#FFA040] to-[#FFB85C] hover:from-[#FF8C30] hover:to-[#FFA548] text-white rounded-2xl py-6 text-base font-semibold shadow-lg gap-2 group"
              >
                <Users className="w-5 h-5 group-hover:scale-110 transition-transform" />
                {t?.successModal?.buttons?.viewGroup?.[language] || 'View my group'}
                <ChevronRight className="w-5 h-5 ml-auto group-hover:translate-x-1 transition-transform" />
              </Button>

              <div className="grid grid-cols-2 gap-3">
                <Button
                  onClick={() => router.push('/dashboard/searcher')}
                  variant="outline"
                  className="border-2 rounded-2xl py-4 gap-2"
                >
                  <Search className="w-4 h-4" />
                  {t?.successModal?.buttons?.search?.[language] || 'Search'}
                </Button>

                <Button
                  onClick={() => router.push('/dashboard/searcher/groups')}
                  variant="outline"
                  className="border-2 rounded-2xl py-4 gap-2"
                >
                  <Home className="w-4 h-4" />
                  {t?.successModal?.buttons?.myGroups?.[language] || 'My groups'}
                </Button>
              </div>
            </div>

            {/* Tips */}
            <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
              <div className="flex gap-3">
                <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-gray-700">
                  <p className="font-semibold text-blue-900 mb-1">{t?.successModal?.tip?.title?.[language] || 'Tip'}</p>
                  <p className="text-gray-600">
                    {t?.successModal?.tip?.content?.[language] || 'Invite at least 2-3 people to start. The more complete your group, the better your chances of finding a place quickly!'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
