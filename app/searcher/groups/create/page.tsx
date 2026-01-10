'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
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
  Settings,
  X,
  Copy,
  Share2,
} from 'lucide-react';
import { toast } from 'sonner';
import { useLanguage } from '@/lib/i18n/use-language';
import { getHookTranslation } from '@/lib/i18n/get-language';

// V3-FUN Searcher Palette
// V3 Color System - Using CSS Variables from globals.css

export default function SearcherCreateGroupPage() {
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
      toast.error(t?.messages?.nameRequired?.[language] || 'Veuillez entrer un nom de groupe');
      return;
    }

    if (maxMembers < 2 || maxMembers > 10) {
      toast.error(t?.messages?.sizeError?.[language] || 'Le groupe doit avoir entre 2 et 10 membres');
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
        toast.error(t?.messages?.alreadyInGroup?.[language] || 'Vous êtes déjà dans un groupe. Quittez votre groupe actuel avant d\'en créer un nouveau.');
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
      toast.success(t?.messages?.success?.[language] || 'Groupe créé avec succès !');

    } catch (error: any) {
      console.error('Error creating group:', error);
      toast.error(error.message || t?.messages?.error?.[language] || 'Erreur lors de la création du groupe');
    } finally {
      setIsCreating(false);
    }
  };

  const formatBudget = (min: string, max: string) => {
    if (!min && !max) return t?.budget?.flexible?.[language] || 'Budget flexible';
    if (!min) return `Jusqu'à €${max}`;
    if (!max) return `À partir de €${min}`;
    return `€${min} - €${max}`;
  };

  const copyInviteCode = () => {
    navigator.clipboard.writeText(inviteCode);
    toast.success(getHookTranslation('alerts', 'codeCopied'));
  };

  return (
    <>
      <div className="min-h-screen bg-searcher-50/30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center gap-4">
              <Link href="/searcher/groups">
                <Button variant="ghost" size="icon" className="superellipse-xl">
                  <ArrowLeft className="w-5 h-5" />
                </Button>
              </Link>

              <div>
                <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                  <div
                    className="w-12 h-12 superellipse-2xl flex items-center justify-center shadow-lg"
                    style={{ background: 'var(--gradient-searcher)' }}
                  >
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                  {t?.title?.[language] || 'Créer un groupe'}
                </h1>
                <p className="text-gray-600 mt-1">
                  {t?.subtitle?.[language] || 'Trouvez des colocataires et cherchez ensemble'}
                </p>
              </div>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* Form Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="lg:col-span-2 space-y-6"
            >
              {/* Basic Info */}
              <div className="bg-white superellipse-2xl p-6 shadow-lg border border-gray-100">
                <div className="flex items-center gap-3 mb-6">
                  <div
                    className="w-10 h-10 superellipse-xl flex items-center justify-center"
                    style={{ background: 'var(--gradient-searcher)' }}
                  >
                    <Users className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">
                    {t?.basicInfo?.title?.[language] || 'Informations de base'}
                  </h2>
                </div>

                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      {t?.basicInfo?.groupName?.[language] || 'Nom du groupe'} *
                    </label>
                    <Input
                      type="text"
                      value={groupName}
                      onChange={(e) => setGroupName(e.target.value)}
                      placeholder={t?.basicInfo?.groupNamePlaceholder?.[language] || 'ex: Les Aventuriers de Bruxelles'}
                      maxLength={50}
                      className="text-base superellipse-xl"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      {groupName.length}/50 {t?.basicInfo?.characters?.[language] || 'caractères'}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      {t?.basicInfo?.description?.[language] || 'Description'}
                    </label>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder={t?.basicInfo?.descriptionPlaceholder?.[language] || 'Parlez-nous de votre groupe, vos intérêts, votre style de vie...'}
                      rows={4}
                      maxLength={500}
                      className="w-full px-4 py-3 superellipse-xl border border-gray-200 focus:border-searcher-400 focus:ring-2 focus:ring-searcher-100 outline-none transition text-base"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      {description.length}/500 {t?.basicInfo?.characters?.[language] || 'caractères'}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      {t?.basicInfo?.maxMembers?.[language] || 'Nombre maximum de membres'}:
                      <span className="text-searcher-600 text-lg font-bold ml-2">{maxMembers}</span>
                    </label>
                    <input
                      type="range"
                      min="2"
                      max="10"
                      value={maxMembers}
                      onChange={(e) => setMaxMembers(parseInt(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                      style={{
                        background: `linear-gradient(to right, ${'var(--searcher-500)'} 0%, ${'var(--searcher-500)'} ${((maxMembers - 2) / 8) * 100}%, #E5E7EB ${((maxMembers - 2) / 8) * 100}%, #E5E7EB 100%)`
                      }}
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-2">
                      <span>2 {t?.basicInfo?.people?.[language] || 'personnes'}</span>
                      <span>10 {t?.basicInfo?.people?.[language] || 'personnes'}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Group Settings */}
              <div className="bg-white superellipse-2xl p-6 shadow-lg border border-gray-100">
                <div className="flex items-center gap-3 mb-6">
                  <div
                    className="w-10 h-10 superellipse-xl flex items-center justify-center"
                    style={{ background: 'var(--gradient-searcher)' }}
                  >
                    <Settings className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">
                    {t?.settings?.title?.[language] || 'Paramètres du groupe'}
                  </h2>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-searcher-50/50 superellipse-xl border border-searcher-100">
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900 flex items-center gap-2">
                        {t?.settings?.openToNew?.title?.[language] || 'Ouvert aux nouveaux membres'}
                      </div>
                      <div className="text-sm text-gray-600 mt-1">
                        {t?.settings?.openToNew?.description?.[language] || 'Permettre aux autres de trouver et rejoindre votre groupe'}
                      </div>
                    </div>
                    <button
                      onClick={() => setIsOpen(!isOpen)}
                      className={`relative w-14 h-8 rounded-full transition-all ${
                        isOpen ? '' : 'bg-gray-300'
                      }`}
                      style={isOpen ? { background: 'var(--gradient-searcher)' } : {}}
                    >
                      <div
                        className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow-md transition-all ${
                          isOpen ? 'right-1' : 'left-1'
                        }`}
                      />
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-searcher-50/50 superellipse-xl border border-searcher-100">
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900 flex items-center gap-2">
                        {t?.settings?.approval?.title?.[language] || 'Approbation requise'}
                      </div>
                      <div className="text-sm text-gray-600 mt-1">
                        {t?.settings?.approval?.description?.[language] || 'Examiner les demandes avant que les membres puissent rejoindre'}
                      </div>
                    </div>
                    <button
                      onClick={() => setRequiresApproval(!requiresApproval)}
                      className={`relative w-14 h-8 rounded-full transition-all ${
                        requiresApproval ? '' : 'bg-gray-300'
                      }`}
                      style={requiresApproval ? { background: 'var(--gradient-searcher)' } : {}}
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
              <div className="bg-white superellipse-2xl p-6 shadow-lg border border-gray-100">
                <h2 className="text-xl font-bold text-gray-900 mb-2">
                  {t?.preferences?.title?.[language] || 'Préférences de recherche'}
                </h2>
                <p className="text-sm text-gray-600 mb-6">
                  {t?.preferences?.subtitle?.[language] || 'Aidez à trouver des propriétés qui correspondent à vos critères'}
                </p>

                <div className="space-y-6">
                  {/* Budget */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                      <Euro className="w-4 h-4 text-searcher-600" />
                      {t?.preferences?.budgetLabel?.[language] || 'Budget par personne (€/mois)'}
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Input
                          type="number"
                          value={budgetMin}
                          onChange={(e) => setBudgetMin(e.target.value)}
                          placeholder={t?.preferences?.minimum?.[language] || 'Minimum'}
                          min="0"
                          className="text-base superellipse-xl"
                        />
                      </div>
                      <div>
                        <Input
                          type="number"
                          value={budgetMax}
                          onChange={(e) => setBudgetMax(e.target.value)}
                          placeholder={t?.preferences?.maximum?.[language] || 'Maximum'}
                          min="0"
                          className="text-base superellipse-xl"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Preferred Cities */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-searcher-600" />
                      {t?.preferences?.citiesLabel?.[language] || 'Villes préférées'}
                    </label>
                    <div className="flex gap-2 mb-3">
                      <Input
                        type="text"
                        value={preferredCity}
                        onChange={(e) => setPreferredCity(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCity())}
                        placeholder={t?.preferences?.addCityPlaceholder?.[language] || 'Ajouter une ville...'}
                        className="text-base superellipse-xl"
                      />
                      <Button
                        onClick={addCity}
                        className="text-white px-6 whitespace-nowrap superellipse-xl"
                        style={{ background: 'var(--gradient-searcher)' }}
                      >
                        {t?.preferences?.add?.[language] || 'Ajouter'}
                      </Button>
                    </div>
                    {preferredCities.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {preferredCities.map((city) => (
                          <span
                            key={city}
                            className="px-3 py-2 bg-searcher-50 text-searcher-700 rounded-full text-sm font-medium flex items-center gap-2 border border-searcher-200"
                          >
                            <MapPin className="w-3 h-3" />
                            {city}
                            <button
                              onClick={() => removeCity(city)}
                              className="hover:text-searcher-900 ml-1"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Move-in Date */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                      <CalendarDays className="w-4 h-4 text-searcher-600" />
                      {t?.preferences?.moveInDate?.[language] || 'Date d\'emménagement souhaitée'}
                    </label>
                    <Input
                      type="date"
                      value={moveInDate}
                      onChange={(e) => setMoveInDate(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      className="text-base superellipse-xl"
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4">
                <Button
                  onClick={() => router.push('/searcher/groups')}
                  variant="outline"
                  className="flex-1 py-6 text-base border-2 superellipse-xl"
                  disabled={isCreating}
                >
                  {t?.actions?.cancel?.[language] || 'Annuler'}
                </Button>
                <Button
                  onClick={handleCreateGroup}
                  disabled={isCreating || !groupName.trim()}
                  className="flex-1 py-6 text-base text-white superellipse-xl shadow-lg hover:shadow-xl transition-all font-semibold"
                  style={{ background: 'var(--gradient-searcher)' }}
                >
                  {isCreating ? (
                    <>
                      <LoadingHouse size={20} />
                      {t?.actions?.creating?.[language] || 'Création...'}
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5 mr-2" />
                      {t?.actions?.create?.[language] || 'Créer le groupe'}
                    </>
                  )}
                </Button>
              </div>
            </motion.div>

            {/* Preview Section */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="lg:col-span-1"
            >
              <div className="sticky top-6 space-y-6">

                {/* Group Preview */}
                <div className="bg-white superellipse-2xl p-6 shadow-lg border border-searcher-100">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-2 h-2 bg-searcher-500 rounded-full animate-pulse" />
                    <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                      {t?.preview?.title?.[language] || 'Aperçu du groupe'}
                    </h3>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-12 h-12 superellipse-2xl flex items-center justify-center shadow-md"
                        style={{ background: 'var(--gradient-searcher)' }}
                      >
                        <Users className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-gray-900 truncate">
                          {groupName || (t?.preview?.groupNamePlaceholder?.[language] || 'Nom du groupe')}
                        </h4>
                        <p className="text-sm text-gray-500">
                          1/{maxMembers} {t?.preview?.members?.[language] || 'membres'}
                        </p>
                      </div>
                    </div>

                    {description && (
                      <p className="text-sm text-gray-600 line-clamp-3 bg-searcher-50 p-3 superellipse-xl">
                        {description}
                      </p>
                    )}

                    <div className="space-y-2 pt-2">
                      {preferredCities.length > 0 && (
                        <div className="flex items-start gap-2 text-sm">
                          <MapPin className="h-4 w-4 text-searcher-600 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700 font-medium">
                            {preferredCities.join(', ')}
                          </span>
                        </div>
                      )}

                      {(budgetMin || budgetMax) && (
                        <div className="flex items-center gap-2 text-sm">
                          <Euro className="h-4 w-4 text-searcher-600 flex-shrink-0" />
                          <span className="text-gray-700 font-medium">
                            {formatBudget(budgetMin, budgetMax)}
                          </span>
                        </div>
                      )}

                      {moveInDate && (
                        <div className="flex items-center gap-2 text-sm">
                          <CalendarDays className="h-4 w-4 text-searcher-600 flex-shrink-0" />
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
                          {t?.preview?.badges?.open?.[language] || 'Ouvert'}
                        </span>
                      )}
                      {requiresApproval && (
                        <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium border border-blue-100">
                          {t?.preview?.badges?.approval?.[language] || 'Sur approbation'}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Benefits */}
                <div
                  className="superellipse-2xl p-6 border border-searcher-200"
                  style={{ background: 'var(--gradient-searcher-soft)' }}
                >
                  <div className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-searcher-600 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-gray-700">
                      <p className="font-semibold mb-2">{t?.benefits?.title?.[language] || 'Que se passe-t-il ensuite ?'}</p>
                      <ul className="space-y-2 text-gray-600">
                        <li className="flex items-start gap-2">
                          <ChevronRight className="w-4 h-4 text-searcher-600 flex-shrink-0 mt-0.5" />
                          <span>{t?.benefits?.step1?.[language] || 'Vous recevrez un code d\'invitation'}</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <ChevronRight className="w-4 h-4 text-searcher-600 flex-shrink-0 mt-0.5" />
                          <span>{t?.benefits?.step2?.[language] || 'Invitez des amis ou trouvez des membres'}</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <ChevronRight className="w-4 h-4 text-searcher-600 flex-shrink-0 mt-0.5" />
                          <span>{t?.benefits?.step3?.[language] || 'Cherchez ensemble'}</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <ChevronRight className="w-4 h-4 text-searcher-600 flex-shrink-0 mt-0.5" />
                          <span>{t?.benefits?.step4?.[language] || 'Postulez en groupe'}</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      <AnimatePresence>
        {showSuccessModal && createdGroup && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white superellipse-3xl max-w-2xl w-full p-8 shadow-2xl"
            >
              {/* Success Icon */}
              <div className="text-center mb-6">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: 'spring' }}
                  className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-full mb-4"
                >
                  <Check className="w-10 h-10 text-white" />
                </motion.div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  {t?.successModal?.title?.[language] || 'Groupe créé avec succès !'}
                </h2>
                <p className="text-gray-600">
                  Votre groupe "{createdGroup.name}" est maintenant prêt
                </p>
              </div>

              {/* Invite Code */}
              <div
                className="superellipse-2xl p-6 mb-6 border-2 border-searcher-200"
                style={{ background: 'var(--gradient-searcher-soft)' }}
              >
                <div className="text-center">
                  <p className="text-sm font-semibold text-gray-700 mb-2">
                    {t?.successModal?.inviteCode?.label?.[language] || 'Code d\'invitation'}
                  </p>
                  <div className="flex items-center justify-center gap-3 mb-3">
                    <code className="text-3xl font-bold text-searcher-600 tracking-wider bg-white px-6 py-3 superellipse-xl border-2 border-searcher-300">
                      {inviteCode}
                    </code>
                    <Button
                      onClick={copyInviteCode}
                      variant="outline"
                      size="icon"
                      className="superellipse-xl"
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                  <p className="text-xs text-gray-600">
                    {t?.successModal?.inviteCode?.hint?.[language] || 'Partagez ce code avec vos amis pour les inviter'}
                  </p>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="space-y-3 mb-6">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">
                  {t?.successModal?.nextSteps?.[language] || 'Prochaines étapes :'}
                </h3>

                <Button
                  onClick={() => router.push(`/groups/${createdGroup.id}`)}
                  className="w-full text-white superellipse-2xl py-6 text-base font-semibold shadow-lg gap-2 group"
                  style={{ background: 'var(--gradient-searcher)' }}
                >
                  <Users className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  {t?.successModal?.buttons?.viewGroup?.[language] || 'Voir mon groupe'}
                  <ChevronRight className="w-5 h-5 ml-auto group-hover:translate-x-1 transition-transform" />
                </Button>

                <div className="grid grid-cols-2 gap-3">
                  <Button
                    onClick={() => router.push('/searcher/explore')}
                    variant="outline"
                    className="border-2 superellipse-2xl py-4 gap-2"
                  >
                    <Search className="w-4 h-4" />
                    {t?.successModal?.buttons?.search?.[language] || 'Chercher'}
                  </Button>

                  <Button
                    onClick={() => router.push('/searcher/groups')}
                    variant="outline"
                    className="border-2 superellipse-2xl py-4 gap-2"
                  >
                    <Home className="w-4 h-4" />
                    {t?.successModal?.buttons?.myGroups?.[language] || 'Mes groupes'}
                  </Button>
                </div>
              </div>

              {/* Tips */}
              <div className="bg-blue-50 superellipse-xl p-4 border border-blue-100">
                <div className="flex gap-3">
                  <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-gray-700">
                    <p className="font-semibold text-blue-900 mb-1">{t?.successModal?.tip?.title?.[language] || 'Conseil'}</p>
                    <p className="text-gray-600">
                      {t?.successModal?.tip?.content?.[language] || 'Invitez au moins 2-3 personnes pour commencer. Plus votre groupe est complet, meilleures sont vos chances de trouver rapidement !'}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
