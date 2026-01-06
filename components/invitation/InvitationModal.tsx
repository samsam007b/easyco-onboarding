'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Home,
  Building2,
  MapPin,
  Check,
  XCircle,
  Loader2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { acceptInvitation, refuseInvitation } from '@/lib/services/invitation-service';
import { clearPendingInvitation, type InvitedRole } from '@/types/invitation.types';
import { toast } from 'sonner';
import { getHookTranslation } from '@/lib/i18n/get-language';

interface InvitationModalProps {
  isOpen: boolean;
  onClose: () => void;
  invitationId: string;
  inviterName: string;
  inviterAvatar?: string | null;
  invitedRole: InvitedRole;
  propertyTitle: string;
  propertyAddress?: string;
  propertyCity?: string;
  propertyImage?: string | null;
  onAccepted?: (propertyId: string) => void;
  onRefused?: () => void;
}

export function InvitationModal({
  isOpen,
  onClose,
  invitationId,
  inviterName,
  inviterAvatar,
  invitedRole,
  propertyTitle,
  propertyAddress,
  propertyCity,
  propertyImage,
  onAccepted,
  onRefused,
}: InvitationModalProps) {
  const [isAccepting, setIsAccepting] = useState(false);
  const [isRefusing, setIsRefusing] = useState(false);

  const roleText = invitedRole === 'owner' ? 'propriétaire' : 'colocataire';
  const RoleIcon = invitedRole === 'owner' ? Building2 : Home;

  const gradientStyle = invitedRole === 'owner'
    ? 'linear-gradient(135deg, #7c3aed 0%, #a855f7 50%, #c084fc 100%)'
    : 'linear-gradient(135deg, #e05747 0%, #e05747 50%, #e05747 100%)';

  const handleAccept = async () => {
    setIsAccepting(true);
    try {
      const result = await acceptInvitation(invitationId);

      if (result.success) {
        clearPendingInvitation();
        toast.success(result.already_member
          ? getHookTranslation('invitation', 'alreadyMember')
          : getHookTranslation('invitation', 'welcomeToResidence'));
        onAccepted?.(result.property_id!);
        onClose();
      } else {
        toast.error(result.message || getHookTranslation('invitation', 'acceptError'));
      }
    } catch (error) {
      toast.error(getHookTranslation('invitation', 'errorOccurred'));
    } finally {
      setIsAccepting(false);
    }
  };

  const handleRefuse = async () => {
    setIsRefusing(true);
    try {
      const result = await refuseInvitation(invitationId);

      if (result.success) {
        clearPendingInvitation();
        toast.success(getHookTranslation('invitation', 'refused'));
        onRefused?.();
        onClose();
      } else {
        toast.error(result.message || getHookTranslation('invitation', 'refuseError'));
      }
    } catch (error) {
      toast.error(getHookTranslation('invitation', 'errorOccurred'));
    } finally {
      setIsRefusing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-white superellipse-3xl max-w-md w-full shadow-2xl overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header with gradient */}
          <div className="p-6 text-white" style={{ background: gradientStyle }}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                {inviterAvatar ? (
                  <img
                    src={inviterAvatar}
                    alt={inviterName}
                    className="w-12 h-12 rounded-full border-2 border-white/30 object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full border-2 border-white/30 bg-white/20 flex items-center justify-center text-lg font-bold">
                    {inviterName.charAt(0)}
                  </div>
                )}
                <div>
                  <p className="text-white/80 text-sm">Invitation de</p>
                  <h3 className="font-bold">{inviterName}</h3>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/20 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-white/20 backdrop-blur superellipse-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <RoleIcon className="w-5 h-5" />
                <span className="font-medium">Devenir {roleText}</span>
              </div>
              <h2 className="text-xl font-bold mb-1">{propertyTitle}</h2>
              {(propertyAddress || propertyCity) && (
                <div className="flex items-center gap-1 text-white/80 text-sm">
                  <MapPin className="w-4 h-4" />
                  <span>
                    {propertyAddress ? `${propertyAddress}, ` : ''}{propertyCity}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {propertyImage && (
              <div className="mb-4 superellipse-xl overflow-hidden">
                <img
                  src={propertyImage}
                  alt={propertyTitle}
                  className="w-full h-32 object-cover"
                />
              </div>
            )}

            <p className="text-gray-600 text-center mb-6">
              Voulez-vous rejoindre cette résidence en tant que{' '}
              <span className="font-semibold">{roleText}</span> ?
            </p>

            <div className="flex gap-3">
              <Button
                onClick={handleRefuse}
                variant="outline"
                disabled={isAccepting || isRefusing}
                className="flex-1 superellipse-xl h-12 border-gray-300"
              >
                {isRefusing ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <XCircle className="w-5 h-5 mr-2" />
                    Refuser
                  </>
                )}
              </Button>

              <Button
                onClick={handleAccept}
                disabled={isAccepting || isRefusing}
                className="flex-1 superellipse-xl h-12 text-white font-medium"
                style={{ background: gradientStyle }}
              >
                {isAccepting ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <Check className="w-5 h-5 mr-2" />
                    Accepter
                  </>
                )}
              </Button>
            </div>

            <p className="text-center text-xs text-gray-500 mt-4">
              Vous pouvez retrouver cette invitation dans vos paramètres si vous la refusez.
            </p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default InvitationModal;
