'use client';

import { useState } from 'react';
import {
  Lock,
  Users,
  UserCheck,
  Copy,
  Check,
  AlertCircle,
  Shield
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';
import { useLanguage } from '@/lib/i18n/use-language';
import { motion } from 'framer-motion';

interface PropertyCodesCardProps {
  invitationCode: string;
  ownerCode: string | null;
  isCreator: boolean;
  propertyTitle?: string;
  variant?: 'default' | 'compact';
  showHeader?: boolean;
  showCreatorBadge?: boolean;
}

export default function PropertyCodesCard({
  invitationCode,
  ownerCode,
  isCreator,
  propertyTitle,
  variant = 'default',
  showHeader = true,
  showCreatorBadge = false,
}: PropertyCodesCardProps) {
  const { language, getSection } = useLanguage();
  const t = getSection('settings')?.privateCodes;
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const copyToClipboard = async (code: string, label: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(code);
      toast.success(t?.messages?.copied?.[language]?.replace('{label}', label) || `${label} copié !`);
      setTimeout(() => setCopiedCode(null), 2000);
    } catch (error) {
      toast.error(t?.messages?.copyError?.[language] || 'Erreur lors de la copie');
    }
  };

  if (variant === 'compact') {
    return (
      <Card className="p-6">
        {showHeader && (
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Lock className="w-5 h-5 text-owner-600" />
            {t?.title?.[language] || 'Codes d\'invitation'}
          </h2>
        )}

        {/* Invitation Code for Residents */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t?.residentCode?.title?.[language] || 'Code pour les colocataires'}
          </label>
          <div className="flex items-center gap-2">
            <div className="flex-1 bg-gray-100 superellipse-lg px-4 py-3 font-mono text-lg font-bold text-gray-900">
              {invitationCode || 'N/A'}
            </div>
            <button
              onClick={() => invitationCode && copyToClipboard(invitationCode, 'Code résidents')}
              className="p-3 superellipse-lg bg-resident-500 hover:bg-resident-600 text-white transition-colors"
            >
              {copiedCode === invitationCode ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            {t?.residentCode?.description?.[language] || 'Partagez ce code avec vos futurs colocataires'}
          </p>
        </div>

        {/* Owner Code (only for creators) */}
        {isCreator && ownerCode && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t?.ownerCode?.title?.[language] || 'Code propriétaire'}
            </label>
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-owner-100 superellipse-lg px-4 py-3 font-mono text-sm font-bold text-owner-900">
                {ownerCode}
              </div>
              <button
                onClick={() => copyToClipboard(ownerCode, 'Code propriétaire')}
                className="p-3 superellipse-lg bg-owner-500 hover:bg-owner-600 text-white transition-colors"
              >
                {copiedCode === ownerCode ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {t?.ownerCode?.description?.[language] || 'Code réservé au propriétaire légal pour revendiquer la résidence'}
            </p>
          </div>
        )}
      </Card>
    );
  }

  // Default (full) variant
  return (
    <div className="space-y-6">
      {/* Header with creator badge */}
      {showCreatorBadge && isCreator && (
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-owner-100 to-owner-200 text-owner-700 font-medium">
          <Shield className="w-4 h-4" />
          {t?.creatorBadge?.[language] || 'Vous êtes le créateur de cette résidence'}
        </div>
      )}

      {/* Invitation Code for Residents */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="p-6 bg-white/80 backdrop-blur-sm border-2 border-resident-200 hover:border-resident-300 transition-all">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 superellipse-2xl bg-gradient-to-br from-resident-400 to-resident-500 flex items-center justify-center flex-shrink-0 shadow-lg">
              <Users className="w-7 h-7 text-white" />
            </div>

            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {t?.residentCode?.title?.[language] || 'Code Invitation Résidents'}
              </h3>
              <p className="text-gray-600 text-sm mb-4">
                {t?.residentCode?.description?.[language] || 'Partagez ce code avec vos colocataires pour qu\'ils puissent rejoindre la résidence.'}
              </p>

              <div className="flex items-center gap-3">
                <div className="flex-1 px-6 py-4 bg-gradient-to-r from-resident-50 to-resident-100 superellipse-xl border-2 border-resident-200">
                  <p className="text-3xl font-bold text-gray-900 tracking-wider text-center font-mono">
                    {invitationCode}
                  </p>
                </div>

                <Button
                  onClick={() => copyToClipboard(invitationCode, 'Code résidents')}
                  variant="outline"
                  className="superellipse-xl border-2 border-resident-300 hover:bg-resident-50 h-14 px-6"
                >
                  {copiedCode === invitationCode ? (
                    <Check className="w-5 h-5 text-green-600" />
                  ) : (
                    <Copy className="w-5 h-5" />
                  )}
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Owner Code (Only for creators) */}
      {isCreator && ownerCode && (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="p-6 bg-white/80 backdrop-blur-sm border-2 border-owner-200 hover:border-owner-300 transition-all">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 superellipse-2xl bg-gradient-to-br from-owner-500 to-owner-600 flex items-center justify-center flex-shrink-0 shadow-lg">
                <UserCheck className="w-7 h-7 text-white" />
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-xl font-bold text-gray-900">
                    {t?.ownerCode?.title?.[language] || 'Code Propriétaire'}
                  </h3>
                  <span className="px-3 py-1 rounded-full bg-owner-100 text-owner-700 text-xs font-bold">
                    {t?.ownerCode?.confidential?.[language] || 'CONFIDENTIEL'}
                  </span>
                </div>
                <p className="text-gray-600 text-sm mb-4">
                  {t?.ownerCode?.description?.[language] || 'Donnez ce code UNIQUEMENT au propriétaire légal pour qu\'il puisse claim la résidence et accéder aux fonctionnalités propriétaire.'}
                </p>

                <div className="flex items-center gap-3">
                  <div className="flex-1 px-6 py-4 bg-gradient-to-r from-owner-50 to-owner-100 superellipse-xl border-2 border-owner-200">
                    <p className="text-2xl font-bold text-gray-900 tracking-wider text-center font-mono">
                      {ownerCode}
                    </p>
                  </div>

                  <Button
                    onClick={() => copyToClipboard(ownerCode, 'Code propriétaire')}
                    variant="outline"
                    className="superellipse-xl border-2 border-owner-300 hover:bg-owner-50 h-14 px-6"
                  >
                    {copiedCode === ownerCode ? (
                      <Check className="w-5 h-5 text-green-600" />
                    ) : (
                      <Copy className="w-5 h-5" />
                    )}
                  </Button>
                </div>

                <div className="mt-4 p-4 bg-red-50 border border-red-200 superellipse-xl">
                  <div className="flex gap-3">
                    <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-red-900 text-sm mb-1">
                        {t?.ownerCode?.warning?.title?.[language] || '⚠️ Important - Sécurité'}
                      </p>
                      <p className="text-red-700 text-xs leading-relaxed">
                        {t?.ownerCode?.warning?.text?.[language] || 'Ne partagez ce code qu\'avec le propriétaire LÉGAL de la résidence. Ce code lui donnera accès à des fonctionnalités sensibles (documents, finances, etc.).'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      )}

      {/* Info for non-creators */}
      {!isCreator && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="p-6 bg-blue-50/50 border-2 border-blue-200">
            <div className="flex gap-3">
              <AlertCircle className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-blue-900 mb-1">
                  {t?.notCreator?.title?.[language] || 'Vous n\'êtes pas le créateur'}
                </h4>
                <p className="text-blue-700 text-sm">
                  {t?.notCreator?.description?.[language] || 'Seul le créateur de la résidence a accès au code propriétaire. Si vous avez besoin de ce code, demandez-le au créateur de votre résidence.'}
                </p>
              </div>
            </div>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
