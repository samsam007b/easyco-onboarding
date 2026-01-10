'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import LoadingHouse from '@/components/ui/LoadingHouse';
import {
  Mail,
  ArrowLeft,
  Inbox,
  CheckCircle,
  XCircle,
  Clock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { InvitationCard } from '@/components/invitation';
import { getMyInvitations } from '@/lib/services/invitation-service';
import type { ReceivedInvitation } from '@/types/invitation.types';
import { useLanguage } from '@/lib/i18n/use-language';

export default function InvitationsPage() {
  const router = useRouter();
  const { language, getSection } = useLanguage();
  const t = getSection('settings')?.invitations;
  const [isLoading, setIsLoading] = useState(true);
  const [invitations, setInvitations] = useState<ReceivedInvitation[]>([]);
  const [pendingCount, setPendingCount] = useState(0);
  const [filter, setFilter] = useState<'all' | 'pending' | 'accepted' | 'refused'>('all');

  useEffect(() => {
    loadInvitations();
  }, []);

  const loadInvitations = async () => {
    try {
      const response = await getMyInvitations();
      if (response.invitations) {
        setInvitations(response.invitations);
        setPendingCount(response.pending_count || 0);
      }
    } catch (error) {
      console.error('Error loading invitations:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredInvitations = invitations.filter(inv => {
    if (filter === 'all') return true;
    return inv.status === filter;
  });

  const getStatusCounts = () => {
    const pending = invitations.filter(i => i.status === 'pending').length;
    const accepted = invitations.filter(i => i.status === 'accepted').length;
    const refused = invitations.filter(i => i.status === 'refused').length;
    return { pending, accepted, refused, all: invitations.length };
  };

  const counts = getStatusCounts();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-resident-50/30">
        <div className="text-center">
          <LoadingHouse size={80} />
          <p className="text-gray-600 font-medium mt-4">{t?.loading?.[language] || 'Loading...'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-resident-50/30">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Button
            onClick={() => router.push('/settings')}
            variant="ghost"
            className="mb-4 rounded-full"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t?.back?.[language] || 'Back to settings'}
          </Button>

          <div className="flex items-center gap-4 mb-2">
            <div className="w-16 h-16 superellipse-2xl flex items-center justify-center shadow-sm"
                 style={{
                   background: 'linear-gradient(135deg, #e05747 0%, #e05747 50%, #e05747 100%)'
                 }}>
              <Mail className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                {t?.title?.[language] || 'My invitations'}
              </h1>
              <p className="text-gray-600">
                {t?.subtitle?.[language] || 'Manage your invitations to join shared housing'}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-4 gap-3 mb-6"
        >
          <button
            onClick={() => setFilter('all')}
            className={`p-4 superellipse-xl border-2 transition-all ${
              filter === 'all'
                ? 'border-gray-400 bg-gray-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center justify-center gap-2 mb-1">
              <Inbox className="w-5 h-5 text-gray-600" />
            </div>
            <p className="font-bold text-2xl text-gray-900">{counts.all}</p>
            <p className="text-xs text-gray-600">{t?.filters?.all?.[language] || 'All'}</p>
          </button>

          <button
            onClick={() => setFilter('pending')}
            className={`p-4 superellipse-xl border-2 transition-all ${
              filter === 'pending'
                ? 'border-searcher-400 bg-searcher-50'
                : 'border-gray-200 hover:border-searcher-200'
            }`}
          >
            <div className="flex items-center justify-center gap-2 mb-1">
              <Clock className="w-5 h-5 text-searcher-600" />
            </div>
            <p className="font-bold text-2xl text-searcher-700">{counts.pending}</p>
            <p className="text-xs text-gray-600">{t?.filters?.pending?.[language] || 'Pending'}</p>
          </button>

          <button
            onClick={() => setFilter('accepted')}
            className={`p-4 superellipse-xl border-2 transition-all ${
              filter === 'accepted'
                ? 'border-green-400 bg-green-50'
                : 'border-gray-200 hover:border-green-200'
            }`}
          >
            <div className="flex items-center justify-center gap-2 mb-1">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <p className="font-bold text-2xl text-green-700">{counts.accepted}</p>
            <p className="text-xs text-gray-600">{t?.filters?.accepted?.[language] || 'Accepted'}</p>
          </button>

          <button
            onClick={() => setFilter('refused')}
            className={`p-4 superellipse-xl border-2 transition-all ${
              filter === 'refused'
                ? 'border-red-400 bg-red-50'
                : 'border-gray-200 hover:border-red-200'
            }`}
          >
            <div className="flex items-center justify-center gap-2 mb-1">
              <XCircle className="w-5 h-5 text-red-600" />
            </div>
            <p className="font-bold text-2xl text-red-700">{counts.refused}</p>
            <p className="text-xs text-gray-600">{t?.filters?.refused?.[language] || 'Declined'}</p>
          </button>
        </motion.div>

        {/* Pending invitations alert */}
        {pendingCount > 0 && filter === 'all' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="mb-6 p-4 bg-searcher-50 border-2 border-searcher-200 superellipse-xl"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-searcher-100 flex items-center justify-center">
                <Clock className="w-5 h-5 text-searcher-600" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-searcher-800">
                  {pendingCount} {t?.alert?.invitation?.[language] || 'invitation'}{pendingCount > 1 ? 's' : ''} {t?.alert?.pending?.[language] || 'pending'}
                </p>
                <p className="text-sm text-searcher-700">
                  {t?.alert?.respond?.[language] || 'Respond to join a shared housing'}
                </p>
              </div>
              <Button
                onClick={() => setFilter('pending')}
                variant="outline"
                className="border-searcher-300 text-searcher-700 hover:bg-searcher-100"
              >
                {t?.alert?.view?.[language] || 'View'}
              </Button>
            </div>
          </motion.div>
        )}

        {/* Invitations list */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {filteredInvitations.length === 0 ? (
            <div className="text-center py-16 bg-white superellipse-2xl border border-gray-200">
              <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                <Inbox className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                {filter === 'all'
                  ? (t?.empty?.all?.[language] || 'No invitations')
                  : filter === 'pending'
                  ? (t?.empty?.pending?.[language] || 'No pending invitations')
                  : filter === 'accepted'
                  ? (t?.empty?.accepted?.[language] || 'No accepted invitations')
                  : (t?.empty?.refused?.[language] || 'No declined invitations')}
              </h3>
              <p className="text-gray-500">
                {filter === 'all'
                  ? (t?.empty?.noInvitations?.[language] || 'You haven\'t received any invitations yet')
                  : (t?.empty?.noCategory?.[language] || 'No invitations in this category')}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredInvitations.map((invitation, index) => (
                <motion.div
                  key={invitation.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25 + index * 0.05 }}
                >
                  <InvitationCard
                    id={invitation.id}
                    inviterName={invitation.inviter.name}
                    inviterAvatar={invitation.inviter.avatar_url || undefined}
                    invitedRole={invitation.invited_role}
                    propertyTitle={invitation.property.title}
                    propertyAddress={invitation.property.address}
                    propertyCity={invitation.property.city}
                    status={invitation.status}
                    createdAt={invitation.created_at}
                    expiresAt={invitation.expires_at}
                    onStatusChange={loadInvitations}
                  />
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
