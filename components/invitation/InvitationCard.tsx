'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Home,
  Building2,
  MapPin,
  Calendar,
  Check,
  X,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { acceptInvitation, refuseInvitation } from '@/lib/services/invitation-service';
import { toast } from 'sonner';
import type { InvitationStatus, InvitedRole } from '@/types/invitation.types';

interface InvitationCardProps {
  id: string;
  inviterName: string;
  inviterAvatar?: string;
  invitedRole: InvitedRole;
  propertyTitle: string;
  propertyAddress: string;
  propertyCity: string;
  status: InvitationStatus;
  createdAt: string;
  expiresAt: string;
  onStatusChange?: () => void;
}

export function InvitationCard({
  id,
  inviterName,
  inviterAvatar,
  invitedRole,
  propertyTitle,
  propertyAddress,
  propertyCity,
  status,
  createdAt,
  expiresAt,
  onStatusChange
}: InvitationCardProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [currentStatus, setCurrentStatus] = useState<InvitationStatus>(status);

  const isExpired = new Date(expiresAt) < new Date();
  const effectiveStatus = isExpired && status === 'pending' ? 'expired' : currentStatus;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const handleAccept = async () => {
    setIsLoading(true);
    try {
      const response = await acceptInvitation(id);
      if (response.success) {
        setCurrentStatus('accepted');
        toast.success('Invitation acceptee ! Bienvenue dans la colocation.');
        onStatusChange?.();
      } else {
        toast.error(response.message || 'Erreur lors de l\'acceptation');
      }
    } catch (error) {
      toast.error('Erreur lors de l\'acceptation de l\'invitation');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefuse = async () => {
    setIsLoading(true);
    try {
      const response = await refuseInvitation(id);
      if (response.success) {
        setCurrentStatus('refused');
        toast.info('Invitation refusee.');
        onStatusChange?.();
      } else {
        toast.error(response.message || 'Erreur lors du refus');
      }
    } catch (error) {
      toast.error('Erreur lors du refus de l\'invitation');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusConfig = () => {
    switch (effectiveStatus) {
      case 'pending':
        return {
          icon: Clock,
          label: 'En attente',
          bgColor: 'bg-yellow-100',
          textColor: 'text-yellow-700',
          borderColor: 'border-yellow-200'
        };
      case 'accepted':
        return {
          icon: CheckCircle,
          label: 'Acceptee',
          bgColor: 'bg-green-100',
          textColor: 'text-green-700',
          borderColor: 'border-green-200'
        };
      case 'refused':
        return {
          icon: XCircle,
          label: 'Refusee',
          bgColor: 'bg-red-100',
          textColor: 'text-red-700',
          borderColor: 'border-red-200'
        };
      case 'expired':
        return {
          icon: AlertCircle,
          label: 'Expiree',
          bgColor: 'bg-gray-100',
          textColor: 'text-gray-600',
          borderColor: 'border-gray-200'
        };
      default:
        return {
          icon: Clock,
          label: 'Inconnu',
          bgColor: 'bg-gray-100',
          textColor: 'text-gray-600',
          borderColor: 'border-gray-200'
        };
    }
  };

  const statusConfig = getStatusConfig();
  const StatusIcon = statusConfig.icon;
  const isOwner = invitedRole === 'owner';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white rounded-2xl p-5 border-2 ${statusConfig.borderColor} shadow-sm`}
    >
      {/* Header with inviter info */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          {inviterAvatar ? (
            <img
              src={inviterAvatar}
              alt={inviterName}
              className="w-12 h-12 rounded-full object-cover border-2 border-white shadow"
            />
          ) : (
            <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg ${
              isOwner
                ? 'bg-gradient-to-br from-purple-500 to-indigo-600'
                : 'bg-gradient-to-br from-orange-500 to-pink-600'
            }`}>
              {inviterName.charAt(0).toUpperCase()}
            </div>
          )}
          <div>
            <p className="font-semibold text-gray-900">{inviterName}</p>
            <p className="text-sm text-gray-500">vous a invite</p>
          </div>
        </div>

        {/* Status Badge */}
        <Badge className={`${statusConfig.bgColor} ${statusConfig.textColor} border-0 px-3 py-1`}>
          <StatusIcon className="w-3.5 h-3.5 mr-1" />
          {statusConfig.label}
        </Badge>
      </div>

      {/* Property info */}
      <div className={`p-4 rounded-xl mb-4 ${
        isOwner ? 'bg-purple-50' : 'bg-orange-50'
      }`}>
        <div className="flex items-center gap-2 mb-2">
          {isOwner ? (
            <Building2 className="w-5 h-5 text-purple-600" />
          ) : (
            <Home className="w-5 h-5 text-orange-600" />
          )}
          <span className={`text-sm font-medium ${isOwner ? 'text-purple-700' : 'text-orange-700'}`}>
            En tant que {isOwner ? 'proprietaire' : 'resident'}
          </span>
        </div>

        <h3 className="font-bold text-gray-900 text-lg mb-1">{propertyTitle}</h3>

        <div className="flex items-center gap-1 text-gray-600 text-sm">
          <MapPin className="w-4 h-4" />
          <span>{propertyAddress}, {propertyCity}</span>
        </div>
      </div>

      {/* Dates */}
      <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
        <div className="flex items-center gap-1">
          <Calendar className="w-4 h-4" />
          <span>Recu le {formatDate(createdAt)}</span>
        </div>
        {effectiveStatus === 'pending' && (
          <span className="text-yellow-600">
            Expire le {formatDate(expiresAt)}
          </span>
        )}
      </div>

      {/* Action buttons for pending invitations */}
      {effectiveStatus === 'pending' && (
        <div className="flex gap-3">
          <Button
            onClick={handleRefuse}
            disabled={isLoading}
            variant="outline"
            className="flex-1 rounded-xl border-red-200 text-red-600 hover:bg-red-50"
          >
            <X className="w-4 h-4 mr-2" />
            Refuser
          </Button>
          <Button
            onClick={handleAccept}
            disabled={isLoading}
            className={`flex-1 rounded-xl text-white ${
              isOwner
                ? 'bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700'
                : 'bg-gradient-to-r from-[#D97B6F] via-[#E8865D] to-[#FF8C4B] hover:opacity-90'
            }`}
          >
            <Check className="w-4 h-4 mr-2" />
            Accepter
          </Button>
        </div>
      )}
    </motion.div>
  );
}
