/**
 * House Rules + Voting System
 * Features: Create rules, vote democratically, view active/voting/rejected rules
 */

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/auth/supabase-client';
import { motion, AnimatePresence } from 'framer-motion';
import LoadingHouse from '@/components/ui/LoadingHouse';
import {
  Vote,
  Plus,
  ThumbsUp,
  ThumbsDown,
  Users,
  CheckCircle,
  XCircle,
  Clock,
  MessageSquare,
  Archive,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { rulesService } from '@/lib/services/rules-service';
import type {
  HouseRuleWithProposer,
  CreateRuleForm,
  RulesStats,
  RuleStatus,
  RuleCategory,
  VoteType,
} from '@/types/rules.types';
import {
  RULE_CATEGORIES,
  getCategoryInfo,
  getStatusInfo,
  getVoteTypeInfo,
  VOTE_TYPES,
  calculateVotingProgress,
} from '@/types/rules.types';

export default function RulesPage() {
  const router = useRouter();
  const supabase = createClient();

  const [isLoading, setIsLoading] = useState(true);
  const [propertyId, setPropertyId] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  const [rules, setRules] = useState<HouseRuleWithProposer[]>([]);
  const [stats, setStats] = useState<RulesStats | null>(null);
  const [filter, setFilter] = useState<RuleStatus | 'all'>('all');

  // Create modal state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [createForm, setCreateForm] = useState<CreateRuleForm>({
    title: '',
    description: '',
    category: 'other',
    voting_duration_days: 7,
  });

  // Vote modal state
  const [showVoteModal, setShowVoteModal] = useState(false);
  const [selectedRule, setSelectedRule] = useState<HouseRuleWithProposer | null>(null);
  const [selectedVote, setSelectedVote] = useState<VoteType | null>(null);
  const [voteComment, setVoteComment] = useState('');
  const [isVoting, setIsVoting] = useState(false);

  useEffect(() => {
    loadData();
  }, [filter]);

  const loadData = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }

      setUserId(user.id);

      // Get user's property_id
      const { data: profile } = await supabase
        .from('profiles')
        .select('property_id')
        .eq('id', user.id)
        .single();

      if (!profile?.property_id) {
        setIsLoading(false);
        return;
      }

      setPropertyId(profile.property_id);

      // Fetch rules
      const statusFilter = filter === 'all' ? undefined : { status: filter };
      const rulesData = await rulesService.getRules(profile.property_id, user.id, statusFilter);
      setRules(rulesData);

      // Fetch stats
      const statsData = await rulesService.getStats(profile.property_id);
      setStats(statsData);

      setIsLoading(false);
    } catch (error) {
      console.error('[Rules] Error loading data:', error);
      setIsLoading(false);
    }
  };

  const handleCreateRule = async () => {
    if (!propertyId || !userId) return;

    if (!createForm.title || !createForm.description) {
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }

    setIsCreating(true);

    try {
      const result = await rulesService.createRule(propertyId, userId, createForm);

      if (result.success) {
        console.log('[Rules] ✅ Rule created successfully');
        setShowCreateModal(false);
        resetCreateForm();
        await loadData();
      } else {
        alert(result.error || 'Erreur lors de la création');
      }
    } catch (error) {
      console.error('[Rules] Create error:', error);
      alert('Une erreur est survenue');
    } finally {
      setIsCreating(false);
    }
  };

  const handleVote = async () => {
    if (!selectedRule || !selectedVote || !userId) return;

    setIsVoting(true);

    try {
      const result = await rulesService.castVote(selectedRule.id, userId, {
        vote: selectedVote,
        comment: voteComment || undefined,
      });

      if (result.success) {
        console.log('[Rules] ✅ Vote cast successfully');
        setShowVoteModal(false);
        resetVoteModal();
        await loadData();
      } else {
        alert(result.error || 'Erreur lors du vote');
      }
    } catch (error) {
      console.error('[Rules] Vote error:', error);
      alert('Une erreur est survenue');
    } finally {
      setIsVoting(false);
    }
  };

  const handleFinalizeVoting = async (ruleId: string) => {
    if (!confirm('Voulez-vous finaliser ce vote ?')) return;

    try {
      const result = await rulesService.finalizeVoting(ruleId);

      if (result.success) {
        console.log('[Rules] ✅ Voting finalized');
        await loadData();
      } else {
        alert(result.error || 'Erreur lors de la finalisation');
      }
    } catch (error) {
      console.error('[Rules] Finalize error:', error);
      alert('Une erreur est survenue');
    }
  };

  const resetCreateForm = () => {
    setCreateForm({
      title: '',
      description: '',
      category: 'other',
      voting_duration_days: 7,
    });
  };

  const resetVoteModal = () => {
    setSelectedRule(null);
    setSelectedVote(null);
    setVoteComment('');
  };

  const openVoteModal = (rule: HouseRuleWithProposer) => {
    setSelectedRule(rule);
    setSelectedVote(rule.user_vote || null);
    setShowVoteModal(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <LoadingHouse size={80} />
          <p className="text-gray-600 font-medium mt-4">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50/30 via-white to-orange-50/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <Button
            variant="outline"
            onClick={() => router.push('/hub')}
            className="mb-4 rounded-full"
          >
            ← Retour au hub
          </Button>

          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                📜 Règles de la maison
              </h1>
              <p className="text-gray-600">Créez et votez sur les règles de vie en commun</p>
            </div>

            <Button
              onClick={() => setShowCreateModal(true)}
              className="rounded-full bg-gradient-to-r from-[#D97B6F] via-[#E8865D] to-[#FF8C4B] hover:opacity-90"
            >
              <Plus className="w-4 h-4 mr-2" />
              Proposer une règle
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <motion.button
              onClick={() => setFilter('all')}
              className={cn(
                'bg-white rounded-2xl p-4 shadow-lg hover:shadow-xl transition-all text-left',
                filter === 'all' && 'ring-2 ring-resident-500'
              )}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Toutes</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">
                    {(stats?.total_active || 0) +
                      (stats?.total_voting || 0) +
                      (stats?.total_rejected || 0)}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-resident-100 to-resident-200 flex items-center justify-center">
                  <Vote className="w-6 h-6 text-resident-700" />
                </div>
              </div>
            </motion.button>

            <motion.button
              onClick={() => setFilter('voting')}
              className={cn(
                'bg-white rounded-2xl p-4 shadow-lg hover:shadow-xl transition-all text-left',
                filter === 'voting' && 'ring-2 ring-blue-500'
              )}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">En vote</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">
                    {stats?.total_voting || 0}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                  <Clock className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </motion.button>

            <motion.button
              onClick={() => setFilter('active')}
              className={cn(
                'bg-white rounded-2xl p-4 shadow-lg hover:shadow-xl transition-all text-left',
                filter === 'active' && 'ring-2 ring-green-500'
              )}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Actives</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">
                    {stats?.total_active || 0}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </motion.button>

            <motion.button
              onClick={() => setFilter('rejected')}
              className={cn(
                'bg-white rounded-2xl p-4 shadow-lg hover:shadow-xl transition-all text-left',
                filter === 'rejected' && 'ring-2 ring-red-500'
              )}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Rejetées</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">
                    {stats?.total_rejected || 0}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-red-100 flex items-center justify-center">
                  <XCircle className="w-6 h-6 text-red-600" />
                </div>
              </div>
            </motion.button>
          </div>
        </motion.div>

        {/* Rules List */}
        <div className="mt-8 space-y-4">
          {rules.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-3xl shadow-lg p-12 text-center"
            >
              <Vote className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {filter === 'all' ? 'Aucune règle' : `Aucune règle ${filter}`}
              </h3>
              <p className="text-gray-600 mb-6">Proposez la première règle de la maison</p>
              <Button
                onClick={() => setShowCreateModal(true)}
                className="rounded-full bg-gradient-to-r from-[#D97B6F] via-[#E8865D] to-[#FF8C4B]"
              >
                <Plus className="w-4 h-4 mr-2" />
                Proposer une règle
              </Button>
            </motion.div>
          ) : (
            <AnimatePresence>
              {rules.map((rule, index) => {
                const categoryInfo = getCategoryInfo(rule.category);
                const statusInfo = getStatusInfo(rule.status);
                const progress = calculateVotingProgress(rule);

                return (
                  <motion.div
                    key={rule.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all"
                  >
                    <div className="flex items-start gap-4">
                      {/* Category Icon */}
                      <div className="text-4xl flex-shrink-0">{categoryInfo.emoji}</div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4 mb-3">
                          <div className="flex-1">
                            <h3 className="text-lg font-bold text-gray-900 mb-1">
                              {rule.title}
                            </h3>
                            <p className="text-sm text-gray-600">{rule.description}</p>
                          </div>

                          <div className="flex flex-col gap-2 items-end flex-shrink-0">
                            <Badge className={statusInfo.color}>
                              {statusInfo.icon} {statusInfo.label}
                            </Badge>
                            <Badge className={categoryInfo.color}>{categoryInfo.label}</Badge>
                          </div>
                        </div>

                        {/* Meta info */}
                        <div className="flex flex-wrap items-center gap-4 text-xs text-gray-600 mb-3">
                          <div className="flex items-center gap-1">
                            <Users className="w-3 h-3" />
                            Proposé par {rule.proposer_name}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {new Date(rule.created_at).toLocaleDateString('fr-FR', {
                              day: 'numeric',
                              month: 'short',
                            })}
                          </div>
                          {rule.time_remaining && rule.status === 'voting' && (
                            <div className="flex items-center gap-1 text-blue-600 font-medium">
                              <Clock className="w-3 h-3" />
                              {rule.time_remaining}
                            </div>
                          )}
                        </div>

                        {/* Voting Progress (for voting rules) */}
                        {rule.status === 'voting' && (
                          <div className="mb-4">
                            <div className="flex items-center justify-between text-xs text-gray-600 mb-2">
                              <span>
                                {progress.votes_received} / {progress.votes_required} votes
                              </span>
                              <span>{Math.round(progress.percentage)}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                              <div
                                className={cn(
                                  'h-2 rounded-full transition-all',
                                  progress.is_passing
                                    ? 'bg-gradient-to-r from-green-400 to-green-600'
                                    : 'bg-gradient-to-r from-red-400 to-red-600'
                                )}
                                style={{ width: `${progress.percentage}%` }}
                              />
                            </div>
                            <div className="flex items-center gap-4 text-xs">
                              <div className="flex items-center gap-1 text-green-700">
                                <ThumbsUp className="w-3 h-3" />
                                {rule.votes_for} Pour
                              </div>
                              <div className="flex items-center gap-1 text-red-700">
                                <ThumbsDown className="w-3 h-3" />
                                {rule.votes_against} Contre
                              </div>
                              <div className="flex items-center gap-1 text-gray-600">
                                <Users className="w-3 h-3" />
                                {rule.votes_abstain} Abstentions
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Actions */}
                        <div className="flex items-center gap-2">
                          {rule.status === 'voting' && (
                            <>
                              <Button
                                size="sm"
                                variant={rule.has_voted ? 'outline' : 'default'}
                                className={cn(
                                  'rounded-full text-xs',
                                  !rule.has_voted &&
                                    'bg-gradient-to-r from-[#D97B6F] via-[#E8865D] to-[#FF8C4B]'
                                )}
                                onClick={() => openVoteModal(rule)}
                              >
                                <Vote className="w-3 h-3 mr-1" />
                                {rule.has_voted ? 'Changer mon vote' : 'Voter'}
                              </Button>

                              {progress.can_finalize && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="rounded-full text-xs"
                                  onClick={() => handleFinalizeVoting(rule.id)}
                                >
                                  Finaliser le vote
                                </Button>
                              )}
                            </>
                          )}

                          {rule.user_vote && (
                            <Badge className={getVoteTypeInfo(rule.user_vote).bgColor}>
                              {getVoteTypeInfo(rule.user_vote).emoji} Vous avez voté{' '}
                              {getVoteTypeInfo(rule.user_vote).label.toLowerCase()}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          )}
        </div>
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Proposer une règle</h2>
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  resetCreateForm();
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Title */}
              <div>
                <Label>Titre *</Label>
                <Input
                  value={createForm.title}
                  onChange={(e) => setCreateForm({ ...createForm, title: e.target.value })}
                  placeholder="Ex: Pas de bruit après 22h"
                  className="rounded-xl"
                />
              </div>

              {/* Description */}
              <div>
                <Label>Description *</Label>
                <Textarea
                  value={createForm.description}
                  onChange={(e) => setCreateForm({ ...createForm, description: e.target.value })}
                  placeholder="Expliquez la règle en détail..."
                  className="rounded-xl min-h-[100px]"
                />
              </div>

              {/* Category */}
              <div>
                <Label>Catégorie *</Label>
                <div className="grid grid-cols-3 md:grid-cols-5 gap-2 mt-2">
                  {RULE_CATEGORIES.map((cat) => (
                    <button
                      key={cat.value}
                      onClick={() => setCreateForm({ ...createForm, category: cat.value })}
                      className={cn(
                        'p-3 rounded-xl border-2 text-center transition-all',
                        createForm.category === cat.value
                          ? 'border-resident-500 bg-resident-50'
                          : 'border-gray-200 hover:border-gray-300'
                      )}
                    >
                      <div className="text-2xl mb-1">{cat.emoji}</div>
                      <div className="text-xs font-medium text-gray-700">{cat.label}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Voting Duration */}
              <div>
                <Label>Durée du vote (jours)</Label>
                <Input
                  type="number"
                  min="1"
                  max="30"
                  value={createForm.voting_duration_days}
                  onChange={(e) =>
                    setCreateForm({ ...createForm, voting_duration_days: parseInt(e.target.value) })
                  }
                  className="rounded-xl"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Le vote se terminera dans {createForm.voting_duration_days || 7} jours
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 mt-6">
              <Button
                variant="outline"
                onClick={() => {
                  setShowCreateModal(false);
                  resetCreateForm();
                }}
                className="flex-1 rounded-full"
                disabled={isCreating}
              >
                Annuler
              </Button>
              <Button
                onClick={handleCreateRule}
                disabled={isCreating || !createForm.title || !createForm.description}
                className="flex-1 rounded-full cta-resident"
              >
                {isCreating ? (
                  <>
                    <LoadingHouse size={20} className="mr-2" />
                    Création...
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4 mr-2" />
                    Proposer la règle
                  </>
                )}
              </Button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Vote Modal */}
      {showVoteModal && selectedRule && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Voter</h2>
              <button
                onClick={() => {
                  setShowVoteModal(false);
                  resetVoteModal();
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="mb-6">
              <h3 className="font-bold text-gray-900 mb-2">{selectedRule.title}</h3>
              <p className="text-sm text-gray-600">{selectedRule.description}</p>
            </div>

            <div className="space-y-4">
              {/* Vote Options */}
              <div>
                <Label>Votre vote *</Label>
                <div className="grid grid-cols-3 gap-2 mt-2">
                  {VOTE_TYPES.map((voteType) => (
                    <button
                      key={voteType.value}
                      onClick={() => setSelectedVote(voteType.value)}
                      className={cn(
                        'p-4 rounded-xl border-2 text-center transition-all',
                        selectedVote === voteType.value
                          ? voteType.borderColor + ' ' + voteType.bgColor
                          : 'border-gray-200 hover:border-gray-300'
                      )}
                    >
                      <div className="text-3xl mb-2">{voteType.emoji}</div>
                      <div className={cn('text-sm font-bold', voteType.color)}>
                        {voteType.label}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Comment */}
              <div>
                <Label>Commentaire (optionnel)</Label>
                <Textarea
                  value={voteComment}
                  onChange={(e) => setVoteComment(e.target.value)}
                  placeholder="Expliquez votre vote..."
                  className="rounded-xl min-h-[80px]"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 mt-6">
              <Button
                variant="outline"
                onClick={() => {
                  setShowVoteModal(false);
                  resetVoteModal();
                }}
                className="flex-1 rounded-full"
                disabled={isVoting}
              >
                Annuler
              </Button>
              <Button
                onClick={handleVote}
                disabled={isVoting || !selectedVote}
                className="flex-1 rounded-full cta-resident"
              >
                {isVoting ? (
                  <>
                    <LoadingHouse size={20} className="mr-2" />
                    Vote en cours...
                  </>
                ) : (
                  <>
                    <Vote className="w-4 h-4 mr-2" />
                    Confirmer mon vote
                  </>
                )}
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
