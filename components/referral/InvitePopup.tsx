'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Copy,
  Check,
  Gift,
  Home,
  Building2,
  Share2,
  MessageCircle,
  Mail,
  Users,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { createClient } from '@/lib/auth/supabase-client';
import { getReferralStats } from '@/lib/services/referral-service';
import { toast } from 'sonner';

interface InvitePopupProps {
  isOpen: boolean;
  onClose: () => void;
  /** If true, shows residence codes (requires property membership) */
  showResidenceCodes?: boolean;
  /** Property info if already loaded */
  propertyInfo?: {
    invitationCode?: string;
    ownerCode?: string;
    isCreator?: boolean;
  };
}

interface ReferralData {
  code: string;
  shareUrl: string;
  creditsAvailable: number;
  successfulReferrals: number;
}

export function InvitePopup({
  isOpen,
  onClose,
  showResidenceCodes = true,
  propertyInfo
}: InvitePopupProps) {
  const supabase = createClient();
  const [referralData, setReferralData] = useState<ReferralData | null>(null);
  const [residenceData, setResidenceData] = useState<{
    invitationCode?: string;
    ownerCode?: string;
    isCreator?: boolean;
  } | null>(propertyInfo || null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      loadData();
    }
  }, [isOpen]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      // Load referral stats
      const result = await getReferralStats();
      if (result.success && result.data) {
        setReferralData({
          code: result.data.code,
          shareUrl: result.data.share_url,
          creditsAvailable: result.data.credits_available,
          successfulReferrals: result.data.successful_referrals,
        });
      }

      // Load residence codes if needed and not provided
      if (showResidenceCodes && !propertyInfo) {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          // Get user's property membership
          const { data: membershipData } = await supabase
            .rpc('get_user_property_membership', { p_user_id: user.id });

          if (membershipData?.property_id) {
            // Fetch property codes
            const { data: property } = await supabase
              .from('properties')
              .select('invitation_code, owner_code')
              .eq('id', membershipData.property_id)
              .single();

            if (property) {
              setResidenceData({
                invitationCode: property.invitation_code,
                ownerCode: property.owner_code,
                isCreator: membershipData.is_creator || false,
              });
            }
          }
        }
      }
    } catch (error) {
      console.error('Error loading invite data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedCode(type);
      toast.success('Copie!');
      setTimeout(() => setCopiedCode(null), 2000);
    } catch {
      toast.error('Erreur lors de la copie');
    }
  };

  const shareViaWhatsApp = () => {
    if (!referralData) return;
    const text = `Rejoins EasyCo et simplifie ta vie en colocation ! Utilise mon code ${referralData.code} pour t'inscrire et reois 1 mois gratuit : ${referralData.shareUrl}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  const shareViaEmail = () => {
    if (!referralData) return;
    const subject = "Rejoins-moi sur EasyCo !";
    const body = `Salut !\n\nJe te recommande EasyCo pour grer ta colocation. C'est une super app qui simplifie tout : dpenses, tches, documents...\n\nUtilise mon code de parrainage : ${referralData.code}\nOu clique directement ici : ${referralData.shareUrl}\n\nTu recevras 1 mois gratuit et moi aussi !\n\n bientt !`;
    window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
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
          className="bg-white rounded-3xl max-w-md w-full shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-6 text-white">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center">
                  <Users className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">Inviter</h2>
                  <p className="text-white/80 text-sm">Partagez vos codes</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/20 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {isLoading ? (
            <div className="p-8 text-center">
              <div className="w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
              <p className="text-gray-500 text-sm">Chargement...</p>
            </div>
          ) : (
            <div className="p-6 space-y-6">
              {/* Referral Code Section */}
              {referralData && (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center">
                      <Gift className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Code Parrainage</h3>
                      <p className="text-xs text-gray-500">Gagnez des mois gratuits</p>
                    </div>
                    {referralData.creditsAvailable > 0 && (
                      <span className="ml-auto px-2 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                        {referralData.creditsAvailable} mois dispo
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex-1 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl px-4 py-3 border-2 border-dashed border-green-200">
                      <p className="text-2xl font-bold text-green-700 font-mono tracking-wider text-center">
                        {referralData.code}
                      </p>
                    </div>
                    <button
                      onClick={() => copyToClipboard(referralData.code, 'referral')}
                      className="p-3 rounded-xl bg-green-600 text-white hover:bg-green-700 transition-colors"
                    >
                      {copiedCode === 'referral' ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                    </button>
                  </div>

                  {/* Share buttons */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => copyToClipboard(referralData.shareUrl, 'link')}
                      className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border-2 border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors text-sm font-medium"
                    >
                      {copiedCode === 'link' ? <Check className="w-4 h-4 text-green-600" /> : <Share2 className="w-4 h-4" />}
                      Copier le lien
                    </button>
                    <button
                      onClick={shareViaWhatsApp}
                      className="p-2.5 rounded-xl border-2 border-green-200 text-green-600 hover:bg-green-50 transition-colors"
                    >
                      <MessageCircle className="w-5 h-5" />
                    </button>
                    <button
                      onClick={shareViaEmail}
                      className="p-2.5 rounded-xl border-2 border-blue-200 text-blue-600 hover:bg-blue-50 transition-colors"
                    >
                      <Mail className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Rewards info */}
                  <div className="mt-3 flex gap-2">
                    <div className="flex-1 p-2 bg-orange-50 rounded-lg text-center">
                      <div className="flex items-center justify-center gap-1">
                        <Home className="w-3.5 h-3.5 text-orange-600" />
                        <span className="text-xs text-gray-600">Rsident</span>
                      </div>
                      <p className="font-bold text-orange-600">+2 mois</p>
                    </div>
                    <div className="flex-1 p-2 bg-purple-50 rounded-lg text-center">
                      <div className="flex items-center justify-center gap-1">
                        <Building2 className="w-3.5 h-3.5 text-purple-600" />
                        <span className="text-xs text-gray-600">Proprio</span>
                      </div>
                      <p className="font-bold text-purple-600">+3 mois</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Divider */}
              {referralData && showResidenceCodes && residenceData?.invitationCode && (
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200" />
                  </div>
                  <div className="relative flex justify-center">
                    <span className="px-3 bg-white text-xs text-gray-500 font-medium">
                      CODES RSIDENCE
                    </span>
                  </div>
                </div>
              )}

              {/* Residence Invitation Code */}
              {showResidenceCodes && residenceData?.invitationCode && (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center">
                      <Home className="w-4 h-4 text-orange-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Code Colocataire</h3>
                      <p className="text-xs text-gray-500">Inviter dans votre rsidence</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-gradient-to-r from-orange-50 to-yellow-50 rounded-xl px-4 py-3 border-2 border-orange-200">
                      <p className="font-mono text-sm font-bold text-orange-700 break-all text-center">
                        {residenceData.invitationCode}
                      </p>
                    </div>
                    <button
                      onClick={() => copyToClipboard(residenceData.invitationCode!, 'residence')}
                      className="p-3 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:shadow-lg transition-all"
                    >
                      {copiedCode === 'residence' ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
              )}

              {/* Owner Code */}
              {showResidenceCodes && residenceData?.isCreator && residenceData?.ownerCode && (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center">
                      <Building2 className="w-4 h-4 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Code Propritaire</h3>
                      <p className="text-xs text-gray-500">Pour revendiquer la rsidence</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl px-4 py-3 border-2 border-purple-200">
                      <p className="font-mono text-sm font-bold text-purple-700 break-all text-center">
                        {residenceData.ownerCode}
                      </p>
                    </div>
                    <button
                      onClick={() => copyToClipboard(residenceData.ownerCode!, 'owner')}
                      className="p-3 rounded-xl bg-gradient-to-r from-purple-500 to-purple-600 text-white hover:shadow-lg transition-all"
                    >
                      {copiedCode === 'owner' ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
              )}

              {/* Link to full referral page */}
              <a
                href="/settings/referrals"
                className="flex items-center justify-center gap-2 py-3 text-green-600 hover:text-green-700 text-sm font-medium transition-colors"
              >
                <Sparkles className="w-4 h-4" />
                Voir tous mes parrainages
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
