'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { generateInvitationLink } from '@/lib/services/unified-messaging-service';
import {
  Key,
  UserPlus,
  Copy,
  Check,
  Send,
  Sparkles,
  Share2,
  MessageSquare,
  Users,
  ArrowRight,
} from 'lucide-react';
import { toast } from 'sonner';
import { getHookTranslation } from '@/lib/i18n/get-language';

interface InvitationCTAProps {
  type: 'owner' | 'resident';
  propertyId: string;
  inviterName: string;
  onClose?: () => void;
  variant?: 'inline' | 'dialog' | 'empty-state';
}

export function InvitationCTA({
  type,
  propertyId,
  inviterName,
  onClose,
  variant = 'inline',
}: InvitationCTAProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [inviteLink, setInviteLink] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [customMessage, setCustomMessage] = useState(
    type === 'owner'
      ? `Bonjour,\n\nJe vous invite à rejoindre Izzico pour faciliter nos échanges concernant la résidence.\n\nCordialement,\n${inviterName}`
      : `Salut !\n\nJe t'invite à rejoindre notre résidence sur Izzico pour qu'on puisse discuter plus facilement entre colocataires.\n\nÀ bientôt,\n${inviterName}`
  );

  const handleGenerateLink = async () => {
    setIsLoading(true);
    const result = await generateInvitationLink(propertyId, type, inviterName);
    setIsLoading(false);

    if (result.success && result.data) {
      setInviteLink(result.data.link);
    } else {
      toast.error(getHookTranslation('invitation', 'linkGenerationFailed'));
    }
  };

  const handleCopyLink = () => {
    if (inviteLink) {
      navigator.clipboard.writeText(inviteLink);
      setCopied(true);
      toast.success(getHookTranslation('invitation', 'linkCopied'));
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleCopyWithMessage = () => {
    const fullMessage = `${customMessage}\n\n${inviteLink}`;
    navigator.clipboard.writeText(fullMessage);
    toast.success(getHookTranslation('invitation', 'messageAndLinkCopied'));
  };

  const handleShare = async () => {
    if (inviteLink && navigator.share) {
      try {
        await navigator.share({
          title: type === 'owner' ? 'Invitation propriétaire Izzico' : 'Invitation colocataire Izzico',
          text: customMessage,
          url: inviteLink,
        });
      } catch (error) {
        // User cancelled or share failed
      }
    }
  };

  // Empty state variant (shown in chat window)
  if (variant === 'empty-state') {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center max-w-md"
        >
          {/* Icon */}
          <div
            className={cn(
              'w-24 h-24 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg',
              type === 'owner'
                ? 'bg-gradient-to-br from-purple-500 to-indigo-500'
                : 'bg-gradient-to-br from-[#7CB89B] to-[#9ECDB5]'
            )}
          >
            {type === 'owner' ? (
              <Key className="w-12 h-12 text-white" />
            ) : (
              <Users className="w-12 h-12 text-white" />
            )}
          </div>

          {/* Title */}
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            {type === 'owner'
              ? 'Invitez votre propriétaire'
              : 'Invitez vos colocataires'}
          </h3>

          {/* Description */}
          <p className="text-gray-500 mb-6">
            {type === 'owner'
              ? 'Votre propriétaire n\'est pas encore sur Izzico. Envoyez-lui une invitation pour pouvoir communiquer directement ici.'
              : 'Vous êtes le premier résident sur Izzico ! Invitez vos colocataires pour créer votre communauté.'}
          </p>

          {/* Action */}
          {!inviteLink ? (
            <Button
              onClick={handleGenerateLink}
              disabled={isLoading}
              className={cn(
                'rounded-full px-6 font-semibold shadow-md hover:shadow-lg transition-all',
                type === 'owner'
                  ? 'bg-gradient-to-r from-purple-500 to-indigo-500 hover:opacity-90'
                  : 'bg-gradient-to-r from-[#7CB89B] to-[#9ECDB5] hover:opacity-90'
              )}
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="animate-spin">⏳</span>
                  Génération...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  Créer une invitation
                </span>
              )}
            </Button>
          ) : (
            <div className="space-y-4">
              {/* Custom message */}
              <Textarea
                value={customMessage}
                onChange={(e) => setCustomMessage(e.target.value)}
                placeholder="Votre message personnalisé..."
                className="min-h-[120px] rounded-xl"
              />

              {/* Link display */}
              <div className="flex gap-2">
                <Input
                  value={inviteLink}
                  readOnly
                  className="rounded-xl bg-gray-50 text-sm"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleCopyLink}
                  className="rounded-xl flex-shrink-0"
                >
                  {copied ? (
                    <Check className="w-4 h-4 text-[#7CB89B]" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </Button>
              </div>

              {/* Actions */}
              <div className="flex gap-2 justify-center">
                <Button
                  variant="outline"
                  onClick={handleCopyWithMessage}
                  className="rounded-full"
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copier tout
                </Button>
                {typeof navigator !== 'undefined' && typeof navigator.share === 'function' && (
                  <Button
                    onClick={handleShare}
                    className={cn(
                      'rounded-full',
                      type === 'owner'
                        ? 'bg-gradient-to-r from-purple-500 to-indigo-500'
                        : 'bg-gradient-to-r from-[#7CB89B] to-[#9ECDB5]'
                    )}
                  >
                    <Share2 className="w-4 h-4 mr-2" />
                    Partager
                  </Button>
                )}
              </div>
            </div>
          )}
        </motion.div>
      </div>
    );
  }

  // Inline variant (for banner or card)
  if (variant === 'inline') {
    return (
      <div
        className={cn(
          'p-4 rounded-xl border',
          type === 'owner'
            ? 'bg-purple-50 border-purple-200'
            : 'bg-[#F0F7F4] border-[#7CB89B]/30'
        )}
      >
        <div className="flex items-start gap-3">
          <div
            className={cn(
              'w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0',
              type === 'owner' ? 'bg-purple-100' : 'bg-[#E8F5EE]'
            )}
          >
            {type === 'owner' ? (
              <Key className="w-5 h-5 text-purple-600" />
            ) : (
              <UserPlus className="w-5 h-5 text-[#7CB89B]" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h4
              className={cn(
                'font-semibold text-sm',
                type === 'owner' ? 'text-purple-900' : 'text-[#5A9A7C]'
              )}
            >
              {type === 'owner'
                ? 'Invitez votre propriétaire'
                : 'Invitez vos colocataires'}
            </h4>
            <p
              className={cn(
                'text-xs mt-0.5',
                type === 'owner' ? 'text-purple-700' : 'text-[#7CB89B]'
              )}
            >
              {type === 'owner'
                ? 'Communiquez directement avec votre propriétaire'
                : 'Créez votre communauté de résidence'}
            </p>
            <Button
              size="sm"
              onClick={handleGenerateLink}
              disabled={isLoading}
              className={cn(
                'mt-3 rounded-full text-xs h-8',
                type === 'owner'
                  ? 'bg-purple-600 hover:bg-purple-700'
                  : 'bg-[#7CB89B] hover:bg-[#5A9A7C]'
              )}
            >
              <ArrowRight className="w-3 h-3 mr-1" />
              Créer une invitation
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Dialog variant
  return null; // Dialog would be controlled by parent
}

// Dialog wrapper component
interface InvitationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'owner' | 'resident';
  propertyId: string;
  inviterName: string;
}

export function InvitationDialog({
  isOpen,
  onClose,
  type,
  propertyId,
  inviterName,
}: InvitationDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {type === 'owner' ? (
              <>
                <Key className="w-5 h-5 text-purple-600" />
                Inviter votre propriétaire
              </>
            ) : (
              <>
                <UserPlus className="w-5 h-5 text-[#7CB89B]" />
                Inviter des colocataires
              </>
            )}
          </DialogTitle>
          <DialogDescription>
            {type === 'owner'
              ? 'Envoyez une invitation à votre propriétaire pour qu\'il puisse vous contacter via Izzico.'
              : 'Partagez ce lien avec vos colocataires pour les inviter à rejoindre votre résidence sur Izzico.'}
          </DialogDescription>
        </DialogHeader>

        <InvitationCTA
          type={type}
          propertyId={propertyId}
          inviterName={inviterName}
          variant="empty-state"
          onClose={onClose}
        />
      </DialogContent>
    </Dialog>
  );
}

export default InvitationCTA;
