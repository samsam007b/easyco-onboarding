'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Copy,
  Check,
  Home,
  Building2,
  Mail,
  MessageCircle,
  Users,
  Sparkles
} from 'lucide-react';
import { createClient } from '@/lib/auth/supabase-client';
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
    propertyName?: string;
  };
}

export function InvitePopup({
  isOpen,
  onClose,
  showResidenceCodes = true,
  propertyInfo
}: InvitePopupProps) {
  const supabase = createClient();
  const [residenceData, setResidenceData] = useState<{
    invitationCode?: string;
    ownerCode?: string;
    isCreator?: boolean;
    propertyName?: string;
  } | null>(propertyInfo || null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      loadData();
    }
  }, [isOpen]);

  useEffect(() => {
    if (propertyInfo) {
      setResidenceData(propertyInfo);
    }
  }, [propertyInfo]);

  const loadData = async () => {
    setIsLoading(true);
    try {
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
              .select('invitation_code, owner_code, title')
              .eq('id', membershipData.property_id)
              .single();

            if (property) {
              setResidenceData({
                invitationCode: property.invitation_code,
                ownerCode: property.owner_code,
                isCreator: membershipData.is_creator || false,
                propertyName: property.title,
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
      toast.success('Copié !');
      setTimeout(() => setCopiedCode(null), 2000);
    } catch {
      toast.error('Erreur lors de la copie');
    }
  };

  const shareResidenceViaWhatsApp = () => {
    if (!residenceData?.invitationCode) return;
    const propertyName = residenceData.propertyName || 'notre colocation';
    const text = `Rejoins ${propertyName} sur Izzico ! Utilise ce code pour nous rejoindre : ${residenceData.invitationCode}\n\nInscris-toi ici : https://izzico.be/onboarding/resident/property-setup`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  const shareResidenceViaEmail = () => {
    if (!residenceData?.invitationCode) return;
    const propertyName = residenceData.propertyName || 'notre colocation';
    const subject = `Rejoins-nous sur ${propertyName}`;
    const body = `Salut !\n\nJe t'invite à rejoindre ${propertyName} sur Izzico.\n\nUtilise ce code d'invitation : ${residenceData.invitationCode}\n\n1. Va sur https://izzico.be/onboarding/resident/property-setup\n2. Clique sur "Rejoindre une colocation"\n3. Entre le code d'invitation\n\nOn gagne tous les deux des mois gratuits quand tu t'inscris !\n\nÀ bientôt !`;
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
          <div className="p-6 text-white" style={{ background: 'linear-gradient(135deg, #d9574f 0%, #ff5b21 50%, #ff8017 100%)' }}>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center">
                  <Users className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">Inviter</h2>
                  <p className="text-white/80 text-sm">Gagnez des mois gratuits</p>
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
              <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
              <p className="text-gray-500 text-sm">Chargement...</p>
            </div>
          ) : (
            <div className="p-6 space-y-6">
              {/* Rewards Banner */}
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-5 h-5 text-green-600" />
                  <span className="font-semibold text-green-800">Récompenses automatiques</span>
                </div>
                <p className="text-sm text-green-700">
                  Quand quelqu'un rejoint avec votre code, vous gagnez tous les deux des mois gratuits !
                </p>
                <div className="mt-3 flex gap-2">
                  <div className="flex-1 p-2 bg-white rounded-lg text-center border border-green-100">
                    <div className="flex items-center justify-center gap-1">
                      <Home className="w-3.5 h-3.5 text-orange-600" />
                      <span className="text-xs text-gray-600">Résident</span>
                    </div>
                    <p className="font-bold text-orange-600">+2 mois</p>
                  </div>
                  <div className="flex-1 p-2 bg-white rounded-lg text-center border border-green-100">
                    <div className="flex items-center justify-center gap-1">
                      <Building2 className="w-3.5 h-3.5 text-purple-600" />
                      <span className="text-xs text-gray-600">Proprio</span>
                    </div>
                    <p className="font-bold text-purple-600">+3 mois</p>
                  </div>
                </div>
              </div>

              {/* Residence Invitation Code */}
              {showResidenceCodes && residenceData?.invitationCode && (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center">
                      <Home className="w-4 h-4 text-orange-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Code Colocataire</h3>
                      <p className="text-xs text-gray-500">Inviter dans votre résidence</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex-1 bg-gradient-to-r from-orange-50 to-yellow-50 rounded-xl px-4 py-3 border-2 border-orange-200">
                      <p className="font-mono text-lg font-bold text-orange-700 break-all text-center">
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

                  {/* Share buttons */}
                  <div className="flex gap-2">
                    <button
                      onClick={shareResidenceViaWhatsApp}
                      className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border-2 border-green-200 text-green-600 hover:bg-green-50 transition-colors text-sm font-medium"
                    >
                      <MessageCircle className="w-4 h-4" />
                      WhatsApp
                    </button>
                    <button
                      onClick={shareResidenceViaEmail}
                      className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border-2 border-blue-200 text-blue-600 hover:bg-blue-50 transition-colors text-sm font-medium"
                    >
                      <Mail className="w-4 h-4" />
                      Email
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
                      <h3 className="font-semibold text-gray-900">Code Propriétaire</h3>
                      <p className="text-xs text-gray-500">Pour transférer la gestion</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl px-4 py-3 border-2 border-purple-200">
                      <p className="font-mono text-lg font-bold text-purple-700 break-all text-center">
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

              {/* No codes available */}
              {!residenceData?.invitationCode && !residenceData?.ownerCode && (
                <div className="text-center py-4">
                  <p className="text-gray-500">Aucun code disponible</p>
                </div>
              )}
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
