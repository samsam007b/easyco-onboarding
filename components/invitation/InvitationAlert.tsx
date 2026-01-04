'use client';

import { motion } from 'framer-motion';
import { Home, Building2, MapPin, User, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { InvitedRole } from '@/types/invitation.types';

interface InvitationAlertProps {
  inviterName: string;
  inviterAvatar?: string | null;
  invitedRole: InvitedRole;
  propertyTitle: string;
  propertyAddress?: string;
  propertyCity?: string;
  onDismiss?: () => void;
  className?: string;
}

export function InvitationAlert({
  inviterName,
  inviterAvatar,
  invitedRole,
  propertyTitle,
  propertyAddress,
  propertyCity,
  onDismiss,
  className = '',
}: InvitationAlertProps) {
  const roleText = invitedRole === 'owner' ? 'propriétaire' : 'colocataire';
  const RoleIcon = invitedRole === 'owner' ? Building2 : Home;
  const roleColor = invitedRole === 'owner' ? 'purple' : 'orange';

  const gradientStyle = invitedRole === 'owner'
    ? 'linear-gradient(135deg, #7c3aed 0%, #a855f7 50%, #c084fc 100%)'
    : 'linear-gradient(135deg, #e05747 0%, #ff651e 50%, #ff9014 100%)';

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={`relative superellipse-2xl p-4 text-white shadow-lg ${className}`}
      style={{ background: gradientStyle }}
    >
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="absolute top-3 right-3 p-1 hover:bg-white/20 rounded-full transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      )}

      <div className="flex items-start gap-3">
        {/* Inviter Avatar */}
        {inviterAvatar ? (
          <img
            src={inviterAvatar}
            alt={inviterName}
            className="w-12 h-12 rounded-full border-2 border-white/30 object-cover flex-shrink-0"
          />
        ) : (
          <div className="w-12 h-12 rounded-full border-2 border-white/30 bg-white/20 flex items-center justify-center text-lg font-bold flex-shrink-0">
            {inviterName.charAt(0)}
          </div>
        )}

        <div className="flex-1 min-w-0">
          <p className="text-sm text-white/80 mb-0.5">
            <span className="font-semibold text-white">{inviterName}</span> vous invite
          </p>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 bg-white/20 backdrop-blur rounded-full px-2.5 py-1">
              <RoleIcon className="w-3.5 h-3.5" />
              <span className="text-xs font-medium capitalize">{roleText}</span>
            </div>
          </div>

          <div className="mt-2">
            <p className="font-semibold text-white truncate">{propertyTitle}</p>
            {(propertyAddress || propertyCity) && (
              <div className="flex items-center gap-1 text-white/80 text-xs mt-0.5">
                <MapPin className="w-3 h-3 flex-shrink-0" />
                <span className="truncate">
                  {propertyAddress ? `${propertyAddress}, ` : ''}{propertyCity}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      <p className="text-xs text-white/70 mt-3">
        Choisissez votre rôle ci-dessous pour continuer. Vous pourrez accepter ou refuser l'invitation après avoir rempli vos informations.
      </p>
    </motion.div>
  );
}

export default InvitationAlert;
