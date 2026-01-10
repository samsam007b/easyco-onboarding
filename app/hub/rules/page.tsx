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
  Sparkles,
  VolumeX,
  Home,
  UtensilsCrossed,
  Droplets,
  PawPrint,
  Ban,
  FileText,
  Minus,
  type LucideIcon,
} from 'lucide-react';

// Icon mappings for categories
const CATEGORY_ICONS: Record<string, LucideIcon> = {
  Sparkles,
  VolumeX,
  Users,
  Home,
  UtensilsCrossed,
  Droplets,
  PawPrint,
  Ban,
  FileText,
};

// Icon mappings for statuses
const STATUS_ICONS: Record<string, LucideIcon> = {
  Vote,
  CheckCircle,
  XCircle,
  Archive,
};

// Icon mappings for vote types
const VOTE_ICONS: Record<string, LucideIcon> = {
  ThumbsUp,
  ThumbsDown,
  Minus,
};
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
import { useLanguage } from '@/lib/i18n/use-language';

export default function RulesPage() {
  const { getSection, language } = useLanguage();
  const t = getSection('hub')?.rules;
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
      alert(t?.errors?.fillRequired?.[language] || 'Please fill in all required fields');
      return;
    }

    setIsCreating(true);

    try {
      const result = await rulesService.createRule(propertyId, userId, createForm);

      if (result.success) {
        console.log('[Rules] Rule created successfully');
        setShowCreateModal(false);
        resetCreateForm();
        await loadData();
      } else {
        alert(result.error || (t?.errors?.creationError?.[language] || 'Error during creation'));
      }
    } catch (error) {
      console.error('[Rules] Create error:', error);
      alert(t?.errors?.genericError?.[language] || 'An error occurred');
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
        console.log('[Rules] Vote cast successfully');
        setShowVoteModal(false);
        resetVoteModal();
        await loadData();
      } else {
        alert(result.error || (t?.errors?.voteError?.[language] || 'Error during vote'));
      }
    } catch (error) {
      console.error('[Rules] Vote error:', error);
      alert(t?.errors?.genericError?.[language] || 'An error occurred');
    } finally {
      setIsVoting(false);
    }
  };

  const handleFinalizeVoting = async (ruleId: string) => {
    if (!confirm(t?.voting?.finalizeConfirm?.[language] || 'Do you want to finalize this vote?')) return;

    try {
      const result = await rulesService.finalizeVoting(ruleId);

      if (result.success) {
        console.log('[Rules] Voting finalized');
        await loadData();
      } else {
        alert(result.error || (t?.errors?.finalizeError?.[language] || 'Error during finalization'));
      }
    } catch (error) {
      console.error('[Rules] Finalize error:', error);
      alert(t?.errors?.genericError?.[language] || 'An error occurred');
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
          <p className="text-gray-600 font-medium mt-4">{t?.loading?.[language] || 'Loading...'}</p>
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
            className="mb-4 rounded-full border-gray-200 hover:border-transparent"
            style={{ color: '#e05747' }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'linear-gradient(135deg, rgba(217, 87, 79, 0.08) 0%, rgba(255, 128, 23, 0.08) 100%)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
          >
            ← {t?.backToHub?.[language] || 'Back to hub'}
          </Button>

          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 superellipse-2xl flex items-center justify-center flex-shrink-0" style={{ background: 'linear-gradient(135deg, #e05747 0%, #e05747 50%, #e05747 100%)' }}>
                <Vote className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                  {t?.title?.[language] || 'House rules'}
                </h1>
                <p className="text-gray-600">{t?.subtitle?.[language] || 'Create and vote on shared living rules'}</p>
              </div>
            </div>

            <Button
              onClick={() => setShowCreateModal(true)}
              className="rounded-full text-white border-none shadow-lg hover:shadow-xl transition-all"
              style={{ background: 'var(--resident-primary)' }}
            >
              <Plus className="w-4 h-4 mr-2" />
              {t?.proposeRule?.[language] || 'Propose a rule'}
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <motion.button
              onClick={() => setFilter('all')}
              className="bg-white superellipse-2xl p-4 shadow-lg hover:shadow-xl transition-all text-left"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{t?.stats?.all?.[language] || 'All'}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">
                    {(stats?.total_active || 0) +
                      (stats?.total_voting || 0) +
                      (stats?.total_rejected || 0)}
                  </p>
                </div>
                <div className="w-12 h-12 superellipse-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #e05747 0%, #e05747 100%)' }}>
                  <Vote className="w-6 h-6 text-white" />
                </div>
              </div>
            </motion.button>

            <motion.button
              onClick={() => setFilter('voting')}
              className="bg-white superellipse-2xl p-4 shadow-lg hover:shadow-xl transition-all text-left"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{t?.stats?.voting?.[language] || 'Voting'}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">
                    {stats?.total_voting || 0}
                  </p>
                </div>
                <div className="w-12 h-12 superellipse-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #e05747 0%, #e05747 100%)' }}>
                  <Clock className="w-6 h-6 text-white" />
                </div>
              </div>
            </motion.button>

            {/* Active - V3 Green Pastel */}
            <motion.button
              onClick={() => setFilter('active')}
              className="relative overflow-hidden superellipse-2xl p-4 shadow-lg hover:shadow-xl transition-all text-left"
              style={{
                background: 'linear-gradient(135deg, #F0FDF4 0%, #DCFCE7 100%)',
                boxShadow: filter === 'active' ? '0 8px 24px rgba(124, 184, 155, 0.25)' : '0 4px 12px rgba(0, 0, 0, 0.08)',
              }}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="absolute -right-4 -top-4 w-16 h-16 rounded-full opacity-20"
                style={{ background: 'linear-gradient(135deg, #7CB89B, #9FCFB5)' }}
              />
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-[#5A9A7A]">{t?.stats?.active?.[language] || 'Active'}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">
                    {stats?.total_active || 0}
                  </p>
                </div>
                <div
                  className="w-12 h-12 superellipse-xl flex items-center justify-center shadow-md"
                  style={{ background: 'linear-gradient(135deg, #7CB89B 0%, #9FCFB5 100%)' }}
                >
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
              </div>
            </motion.button>

            {/* Rejected - V3 Red Pastel */}
            <motion.button
              onClick={() => setFilter('rejected')}
              className="relative overflow-hidden superellipse-2xl p-4 shadow-lg hover:shadow-xl transition-all text-left"
              style={{
                background: 'linear-gradient(135deg, #FDF5F5 0%, #FAE8E8 100%)',
                boxShadow: filter === 'rejected' ? '0 8px 24px rgba(208, 128, 128, 0.25)' : '0 4px 12px rgba(0, 0, 0, 0.08)',
              }}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="absolute -right-4 -top-4 w-16 h-16 rounded-full opacity-20"
                style={{ background: 'linear-gradient(135deg, #D08080, #E0A0A0)' }}
              />
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-[#B06060]">{t?.stats?.rejected?.[language] || 'Rejected'}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">
                    {stats?.total_rejected || 0}
                  </p>
                </div>
                <div
                  className="w-12 h-12 superellipse-xl flex items-center justify-center shadow-md"
                  style={{ background: 'linear-gradient(135deg, #D08080 0%, #E0A0A0 100%)' }}
                >
                  <XCircle className="w-6 h-6 text-white" />
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
              className="bg-white superellipse-3xl shadow-lg p-12 text-center"
              style={{ boxShadow: '0 12px 32px rgba(0, 0, 0, 0.08)' }}
            >
              {/* V3 Fun Icon with Glow */}
              <motion.div
                whileHover={{ scale: 1.05, rotate: 3 }}
                className="relative w-24 h-24 mx-auto mb-6"
              >
                {/* Glow effect */}
                <motion.div
                  className="absolute inset-0 superellipse-2xl opacity-30"
                  style={{
                    background: 'linear-gradient(135deg, #e05747 0%, #e05747 50%, #e05747 100%)',
                    filter: 'blur(20px)',
                  }}
                  animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
                  transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
                />
                {/* Main icon container */}
                <div
                  className="relative w-24 h-24 superellipse-2xl flex items-center justify-center shadow-lg"
                  style={{
                    background: 'linear-gradient(135deg, #e05747 0%, #e05747 50%, #e05747 100%)',
                    boxShadow: '0 8px 24px rgba(255, 101, 30, 0.35)',
                  }}
                >
                  <Vote className="w-12 h-12 text-white" />
                  {/* Shine effect */}
                  <motion.div
                    className="absolute inset-0 superellipse-2xl bg-white/20"
                    animate={{ opacity: [0, 0.3, 0] }}
                    transition={{ repeat: Infinity, duration: 2.5 }}
                  />
                </div>
                {/* Floating sparkle */}
                <motion.div
                  className="absolute -top-2 -right-2"
                  animate={{ y: [-2, 2, -2], rotate: [0, 10, 0] }}
                  transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
                >
                  <Sparkles className="w-6 h-6 text-amber-400" />
                </motion.div>
              </motion.div>

              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {filter === 'all'
                  ? (t?.emptyState?.noRules?.[language] || 'No rules')
                  : (t?.emptyState?.noRulesFiltered?.[language]?.replace('{filter}', filter) || `No ${filter} rules`)}
              </h3>
              <p className="text-gray-500 mb-6 max-w-sm mx-auto">{t?.emptyState?.proposeFirst?.[language] || 'Propose the first house rule'}</p>

              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  onClick={() => setShowCreateModal(true)}
                  className="rounded-full text-white border-none shadow-lg hover:shadow-xl transition-all"
                  style={{
                    background: 'var(--resident-primary)',
                    boxShadow: '0 4px 14px var(--resident-shadow)',
                  }}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  {t?.proposeRule?.[language] || 'Propose a rule'}
                </Button>
              </motion.div>
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
                    className="bg-white superellipse-2xl shadow-lg p-6 hover:shadow-xl transition-all"
                  >
                    <div className="flex items-start gap-4">
                      {/* Category Icon */}
                      <div className="w-12 h-12 superellipse-xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(224, 87, 71, 0.1)' }}>
                        {(() => {
                          const IconComponent = CATEGORY_ICONS[categoryInfo.iconName];
                          return IconComponent ? <IconComponent className="w-6 h-6 text-gray-700" /> : null;
                        })()}
                      </div>

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
                            <Badge className={cn(statusInfo.color, 'flex items-center gap-1')}>
                              {(() => {
                                const IconComponent = STATUS_ICONS[statusInfo.iconName];
                                return IconComponent ? <IconComponent className="w-3 h-3" /> : null;
                              })()}
                              {statusInfo.label}
                            </Badge>
                            <Badge className={categoryInfo.color}>{categoryInfo.label}</Badge>
                          </div>
                        </div>

                        {/* Meta info */}
                        <div className="flex flex-wrap items-center gap-4 text-xs text-gray-600 mb-3">
                          <div className="flex items-center gap-1">
                            <Users className="w-3 h-3" />
                            {t?.ruleCard?.proposedBy?.[language] || 'Proposed by'} {rule.proposer_name}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {new Date(rule.created_at).toLocaleDateString(
                              language === 'fr' ? 'fr-FR' : language === 'en' ? 'en-US' : language === 'nl' ? 'nl-NL' : 'de-DE',
                              { day: 'numeric', month: 'short' }
                            )}
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
                                {rule.votes_for} {t?.voting?.for?.[language] || 'For'}
                              </div>
                              <div className="flex items-center gap-1 text-red-700">
                                <ThumbsDown className="w-3 h-3" />
                                {rule.votes_against} {t?.voting?.against?.[language] || 'Against'}
                              </div>
                              <div className="flex items-center gap-1 text-gray-600">
                                <Users className="w-3 h-3" />
                                {rule.votes_abstain} {t?.voting?.abstentions?.[language] || 'Abstentions'}
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
                                  !rule.has_voted && 'text-white border-none'
                                )}
                                style={!rule.has_voted ? { background: 'var(--resident-primary)' } : undefined}
                                onClick={() => openVoteModal(rule)}
                              >
                                <Vote className="w-3 h-3 mr-1" />
                                {rule.has_voted
                                  ? (t?.voting?.changeVote?.[language] || 'Change my vote')
                                  : (t?.voting?.vote?.[language] || 'Vote')}
                              </Button>

                              {progress.can_finalize && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="rounded-full text-xs"
                                  onClick={() => handleFinalizeVoting(rule.id)}
                                >
                                  {t?.voting?.finalize?.[language] || 'Finalize vote'}
                                </Button>
                              )}
                            </>
                          )}

                          {rule.user_vote && (
                            <Badge className={cn(getVoteTypeInfo(rule.user_vote).bgColor, 'flex items-center gap-1')}>
                              {(() => {
                                const voteInfo = getVoteTypeInfo(rule.user_vote);
                                const IconComponent = VOTE_ICONS[voteInfo.iconName];
                                return IconComponent ? <IconComponent className="w-3 h-3" /> : null;
                              })()}
                              {t?.voting?.youVoted?.[language] || 'You voted'}{' '}
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

      {/* Create Modal - V3 Fun Design */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white superellipse-3xl max-w-2xl w-full max-h-[90vh] overflow-hidden relative border-2 border-orange-100"
            style={{ boxShadow: '0 25px 80px rgba(255, 101, 30, 0.2)' }}
          >
            {/* Decorative gradient circles */}
            <div
              className="absolute right-0 top-0 w-32 h-32 rounded-full opacity-10 pointer-events-none"
              style={{ background: 'linear-gradient(135deg, #e05747 0%, #e05747 50%, #e05747 100%)', transform: 'translate(30%, -30%)' }}
            />
            <div
              className="absolute left-0 bottom-0 w-24 h-24 rounded-full opacity-8 pointer-events-none"
              style={{ background: 'linear-gradient(135deg, #e05747 0%, #e05747 100%)', transform: 'translate(-30%, 30%)' }}
            />

            {/* Scrollable content */}
            <div className="max-h-[90vh] overflow-y-auto">
              {/* Header - V3 Fun gradient */}
              <div
                className="sticky top-0 border-b-2 border-orange-100 px-6 py-5 flex items-center justify-between z-30"
                style={{ background: '#FFF5F0' }}
              >
                <div className="flex items-center gap-4">
                  <motion.div
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="w-12 h-12 superellipse-xl flex items-center justify-center"
                    style={{ background: 'linear-gradient(135deg, #e05747 0%, #e05747 50%, #e05747 100%)', boxShadow: '0 8px 24px rgba(255, 101, 30, 0.35)' }}
                  >
                    <Vote className="w-6 h-6 text-white" />
                  </motion.div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">
                      {t?.createModal?.title?.[language] || 'Propose a rule'}
                    </h2>
                    <p className="text-sm text-gray-500 flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5" style={{ color: '#e05747' }} />
                      {t?.createModal?.subtitle?.[language] || 'Create a rule for your coliving'}
                    </p>
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setShowCreateModal(false);
                    resetCreateForm();
                  }}
                  className="p-2.5 superellipse-xl transition-colors"
                  style={{ background: 'rgba(255, 101, 30, 0.1)' }}
                >
                  <X className="w-5 h-5" style={{ color: '#e05747' }} />
                </motion.button>
              </div>

              {/* Form content */}
              <div className="p-6 space-y-5 relative z-10">
                {/* Title */}
                <div>
                  <Label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    <div
                      className="w-6 h-6 superellipse-lg flex items-center justify-center"
                      style={{ background: 'rgba(255, 101, 30, 0.15)' }}
                    >
                      <MessageSquare className="w-3.5 h-3.5" style={{ color: '#e05747' }} />
                    </div>
                    {t?.createModal?.ruleTitle?.[language] || 'Title'} *
                  </Label>
                  <Input
                    value={createForm.title}
                    onChange={(e) => setCreateForm({ ...createForm, title: e.target.value })}
                    placeholder={t?.createModal?.titlePlaceholder?.[language] || 'E.g.: No noise after 10pm'}
                    className="w-full px-4 py-3.5 superellipse-2xl border-2 border-gray-200 hover:border-orange-200 focus:outline-none focus:border-orange-400 focus:bg-orange-50/30 transition-all"
                  />
                </div>

                {/* Description */}
                <div>
                  <Label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    <div
                      className="w-6 h-6 superellipse-lg flex items-center justify-center"
                      style={{ background: 'rgba(59, 130, 246, 0.15)' }}
                    >
                      <Archive className="w-3.5 h-3.5" style={{ color: '#3b82f6' }} />
                    </div>
                    {t?.createModal?.description?.[language] || 'Description'} *
                  </Label>
                  <Textarea
                    value={createForm.description}
                    onChange={(e) => setCreateForm({ ...createForm, description: e.target.value })}
                    placeholder={t?.createModal?.descriptionPlaceholder?.[language] || 'Explain the rule in detail...'}
                    className="w-full px-4 py-3.5 superellipse-2xl border-2 border-gray-200 hover:border-orange-200 focus:outline-none focus:border-orange-400 focus:bg-orange-50/30 resize-none transition-all min-h-[100px]"
                  />
                </div>

                {/* Category */}
                <div>
                  <Label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    <div
                      className="w-6 h-6 superellipse-lg flex items-center justify-center"
                      style={{ background: 'rgba(16, 185, 129, 0.15)' }}
                    >
                      <Users className="w-3.5 h-3.5" style={{ color: '#10b981' }} />
                    </div>
                    {t?.createModal?.category?.[language] || 'Category'} *
                  </Label>
                  <div className="grid grid-cols-3 md:grid-cols-5 gap-2 mt-2">
                    {RULE_CATEGORIES.map((cat) => {
                      const CatIcon = CATEGORY_ICONS[cat.iconName];
                      return (
                        <button
                          key={cat.value}
                          onClick={() => setCreateForm({ ...createForm, category: cat.value })}
                          className={cn(
                            'p-3 superellipse-xl border-2 text-center transition-all',
                            createForm.category === cat.value
                              ? 'bg-orange-50'
                              : 'border-gray-200 hover:border-gray-300'
                          )}
                          style={createForm.category === cat.value ? { borderColor: '#e05747' } : undefined}
                        >
                          <div className="flex justify-center mb-1">
                            {CatIcon && <CatIcon className="w-6 h-6 text-gray-700" />}
                          </div>
                          <div className="text-xs font-medium text-gray-700">{cat.label}</div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Voting Duration */}
                <div>
                  <Label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    <div
                      className="w-6 h-6 superellipse-lg flex items-center justify-center"
                      style={{ background: 'rgba(168, 85, 247, 0.15)' }}
                    >
                      <Clock className="w-3.5 h-3.5" style={{ color: '#a855f7' }} />
                    </div>
                    {t?.createModal?.votingDuration?.[language] || 'Voting duration (days)'}
                  </Label>
                  <Input
                    type="number"
                    min="1"
                    max="30"
                    value={createForm.voting_duration_days}
                    onChange={(e) =>
                      setCreateForm({ ...createForm, voting_duration_days: parseInt(e.target.value) })
                    }
                    className="w-full px-4 py-3.5 superellipse-2xl border-2 border-gray-200 hover:border-orange-200 focus:outline-none focus:border-orange-400 focus:bg-orange-50/30 transition-all"
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    {t?.createModal?.votingEndsIn?.[language]?.replace('{days}', String(createForm.voting_duration_days || 7)) || `Voting will end in ${createForm.voting_duration_days || 7} days`}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-2">
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="flex-1">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setShowCreateModal(false);
                        resetCreateForm();
                      }}
                      className="w-full superellipse-2xl py-6 font-semibold border-2 transition-all"
                      style={{ borderColor: 'rgba(255, 101, 30, 0.3)', color: '#e05747' }}
                      disabled={isCreating}
                    >
                      {t?.createModal?.cancel?.[language] || 'Cancel'}
                    </Button>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="flex-1">
                    <Button
                      onClick={handleCreateRule}
                      disabled={isCreating || !createForm.title || !createForm.description}
                      className="w-full superellipse-2xl py-6 font-bold text-white border-none"
                      style={{
                        background: 'var(--resident-primary)',
                        boxShadow: '0 12px 32px var(--resident-shadow)',
                      }}
                    >
                      {isCreating ? (
                        <>
                          <LoadingHouse size={20} className="mr-2" />
                          {t?.createModal?.creating?.[language] || 'Creating...'}
                        </>
                      ) : (
                        <>
                          <Plus className="w-4 h-4 mr-2" />
                          {t?.createModal?.submit?.[language] || 'Propose rule'}
                        </>
                      )}
                    </Button>
                  </motion.div>
                </div>
              </div>{/* End form content */}
            </div>{/* End scrollable content */}
          </motion.div>
        </div>
      )}

      {/* Vote Modal */}
      {showVoteModal && selectedRule && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white superellipse-3xl shadow-2xl max-w-lg w-full p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">{t?.voteModal?.title?.[language] || 'Vote'}</h2>
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
                <Label>{t?.voteModal?.yourVote?.[language] || 'Your vote'} *</Label>
                <div className="grid grid-cols-3 gap-2 mt-2">
                  {VOTE_TYPES.map((voteType) => {
                    const VoteIcon = VOTE_ICONS[voteType.iconName];
                    return (
                      <button
                        key={voteType.value}
                        onClick={() => setSelectedVote(voteType.value)}
                        className={cn(
                          'p-4 superellipse-xl border-2 text-center transition-all',
                          selectedVote === voteType.value
                            ? voteType.borderColor + ' ' + voteType.bgColor
                            : 'border-gray-200 hover:border-gray-300'
                        )}
                      >
                        <div className="flex justify-center mb-2">
                          {VoteIcon && <VoteIcon className={cn('w-8 h-8', voteType.color)} />}
                        </div>
                        <div className={cn('text-sm font-bold', voteType.color)}>
                          {voteType.label}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Comment */}
              <div>
                <Label>{t?.voteModal?.comment?.[language] || 'Comment (optional)'}</Label>
                <Textarea
                  value={voteComment}
                  onChange={(e) => setVoteComment(e.target.value)}
                  placeholder={t?.voteModal?.commentPlaceholder?.[language] || 'Explain your vote...'}
                  className="superellipse-xl min-h-[80px]"
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
                className="flex-1 rounded-full border-gray-200 hover:border-transparent"
                style={{ color: '#e05747' }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'linear-gradient(135deg, rgba(217, 87, 79, 0.08) 0%, rgba(255, 128, 23, 0.08) 100%)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                disabled={isVoting}
              >
                {t?.voteModal?.cancel?.[language] || 'Cancel'}
              </Button>
              <Button
                onClick={handleVote}
                disabled={isVoting || !selectedVote}
                className="flex-1 rounded-full text-white border-none shadow-lg hover:shadow-xl transition-all"
                style={{ background: 'var(--resident-primary)' }}
              >
                {isVoting ? (
                  <>
                    <LoadingHouse size={20} className="mr-2" />
                    {t?.voteModal?.voting?.[language] || 'Voting...'}
                  </>
                ) : (
                  <>
                    <Vote className="w-4 h-4 mr-2" />
                    {t?.voteModal?.confirm?.[language] || 'Confirm my vote'}
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
