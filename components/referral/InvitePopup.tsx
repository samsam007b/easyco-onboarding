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
import { useLanguage } from '@/lib/i18n/use-language';

type Language = 'fr' | 'en' | 'nl' | 'de';

const translations = {
  invite: {
    fr: 'Inviter',
    en: 'Invite',
    nl: 'Uitnodigen',
    de: 'Einladen',
  },
  earnFreeMonths: {
    fr: 'Gagnez des mois gratuits',
    en: 'Earn free months',
    nl: 'Verdien gratis maanden',
    de: 'Verdienen Sie Freimonate',
  },
  loading: {
    fr: 'Chargement...',
    en: 'Loading...',
    nl: 'Laden...',
    de: 'Laden...',
  },
  automaticRewards: {
    fr: 'Récompenses automatiques',
    en: 'Automatic rewards',
    nl: 'Automatische beloningen',
    de: 'Automatische Belohnungen',
  },
  rewardsDescription: {
    fr: "Quand quelqu'un rejoint avec votre code, vous gagnez tous les deux des mois gratuits !",
    en: 'When someone joins with your code, you both earn free months!',
    nl: 'Wanneer iemand met uw code lid wordt, verdienen jullie beiden gratis maanden!',
    de: 'Wenn jemand mit Ihrem Code beitritt, verdienen Sie beide Freimonate!',
  },
  resident: {
    fr: 'Résident',
    en: 'Resident',
    nl: 'Bewoner',
    de: 'Bewohner',
  },
  owner: {
    fr: 'Proprio',
    en: 'Owner',
    nl: 'Eigenaar',
    de: 'Eigentümer',
  },
  months: {
    fr: 'mois',
    en: 'months',
    nl: 'maanden',
    de: 'Monate',
  },
  roommateCode: {
    fr: 'Code Colocataire',
    en: 'Roommate Code',
    nl: 'Huisgenotencode',
    de: 'Mitbewohner-Code',
  },
  inviteToResidence: {
    fr: 'Inviter dans votre résidence',
    en: 'Invite to your residence',
    nl: 'Uitnodigen naar uw woning',
    de: 'In Ihre Wohnung einladen',
  },
  ownerCode: {
    fr: 'Code Propriétaire',
    en: 'Owner Code',
    nl: 'Eigenarencode',
    de: 'Eigentümer-Code',
  },
  transferManagement: {
    fr: 'Pour transférer la gestion',
    en: 'To transfer management',
    nl: 'Om beheer over te dragen',
    de: 'Zur Verwaltungsübertragung',
  },
  noCodesAvailable: {
    fr: 'Aucun code disponible',
    en: 'No codes available',
    nl: 'Geen codes beschikbaar',
    de: 'Keine Codes verfügbar',
  },
  toasts: {
    copied: {
      fr: 'Copié !',
      en: 'Copied!',
      nl: 'Gekopieerd!',
      de: 'Kopiert!',
    },
    copyError: {
      fr: 'Erreur lors de la copie',
      en: 'Error copying',
      nl: 'Fout bij kopiëren',
      de: 'Fehler beim Kopieren',
    },
  },
  share: {
    joinMessage: {
      fr: (propertyName: string, code: string) =>
        `Rejoins ${propertyName} sur Izzico ! Utilise ce code pour nous rejoindre : ${code}\n\nInscris-toi ici : https://izzico.be/onboarding/resident/property-setup`,
      en: (propertyName: string, code: string) =>
        `Join ${propertyName} on Izzico! Use this code to join us: ${code}\n\nSign up here: https://izzico.be/onboarding/resident/property-setup`,
      nl: (propertyName: string, code: string) =>
        `Word lid van ${propertyName} op Izzico! Gebruik deze code om bij ons te komen: ${code}\n\nMeld je hier aan: https://izzico.be/onboarding/resident/property-setup`,
      de: (propertyName: string, code: string) =>
        `Tritt ${propertyName} auf Izzico bei! Verwende diesen Code um beizutreten: ${code}\n\nMelde dich hier an: https://izzico.be/onboarding/resident/property-setup`,
    },
    emailSubject: {
      fr: (propertyName: string) => `Rejoins-nous sur ${propertyName}`,
      en: (propertyName: string) => `Join us at ${propertyName}`,
      nl: (propertyName: string) => `Sluit je bij ons aan op ${propertyName}`,
      de: (propertyName: string) => `Schließe dich uns bei ${propertyName} an`,
    },
    emailBody: {
      fr: (propertyName: string, code: string) =>
        `Salut !\n\nJe t'invite à rejoindre ${propertyName} sur Izzico.\n\nUtilise ce code d'invitation : ${code}\n\n1. Va sur https://izzico.be/onboarding/resident/property-setup\n2. Clique sur "Rejoindre une colocation"\n3. Entre le code d'invitation\n\nOn gagne tous les deux des mois gratuits quand tu t'inscris !\n\nÀ bientôt !`,
      en: (propertyName: string, code: string) =>
        `Hi!\n\nI'm inviting you to join ${propertyName} on Izzico.\n\nUse this invitation code: ${code}\n\n1. Go to https://izzico.be/onboarding/resident/property-setup\n2. Click on "Join a coliving"\n3. Enter the invitation code\n\nWe both earn free months when you sign up!\n\nSee you soon!`,
      nl: (propertyName: string, code: string) =>
        `Hallo!\n\nIk nodig je uit om lid te worden van ${propertyName} op Izzico.\n\nGebruik deze uitnodigingscode: ${code}\n\n1. Ga naar https://izzico.be/onboarding/resident/property-setup\n2. Klik op "Word lid van een coliving"\n3. Voer de uitnodigingscode in\n\nWe verdienen allebei gratis maanden als je je aanmeldt!\n\nTot snel!`,
      de: (propertyName: string, code: string) =>
        `Hallo!\n\nIch lade dich ein, ${propertyName} auf Izzico beizutreten.\n\nVerwende diesen Einladungscode: ${code}\n\n1. Gehe zu https://izzico.be/onboarding/resident/property-setup\n2. Klicke auf "Einer WG beitreten"\n3. Gib den Einladungscode ein\n\nWir verdienen beide Freimonate, wenn du dich anmeldest!\n\nBis bald!`,
    },
    ourColiving: {
      fr: 'notre colocation',
      en: 'our coliving',
      nl: 'onze coliving',
      de: 'unsere WG',
    },
  },
};

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
  const { language } = useLanguage();
  const lang = language as Language;
  const t = translations;

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
      toast.success(t.toasts.copied[lang]);
      setTimeout(() => setCopiedCode(null), 2000);
    } catch {
      toast.error(t.toasts.copyError[lang]);
    }
  };

  const shareResidenceViaWhatsApp = () => {
    if (!residenceData?.invitationCode) return;
    const propertyName = residenceData.propertyName || t.share.ourColiving[lang];
    const text = t.share.joinMessage[lang](propertyName, residenceData.invitationCode);
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  const shareResidenceViaEmail = () => {
    if (!residenceData?.invitationCode) return;
    const propertyName = residenceData.propertyName || t.share.ourColiving[lang];
    const subject = t.share.emailSubject[lang](propertyName);
    const body = t.share.emailBody[lang](propertyName, residenceData.invitationCode);
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
          className="bg-white superellipse-3xl max-w-md w-full shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="p-6 text-white bg-resident-500">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 superellipse-xl bg-white/20 backdrop-blur flex items-center justify-center">
                  <Users className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">{t.invite[lang]}</h2>
                  <p className="text-white/80 text-sm">{t.earnFreeMonths[lang]}</p>
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
              <div className="w-8 h-8 border-2 border-resident-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
              <p className="text-gray-500 text-sm">{t.loading[lang]}</p>
            </div>
          ) : (
            <div className="p-6 space-y-6">
              {/* Rewards Banner */}
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 superellipse-xl p-4 border border-green-200">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-5 h-5 text-green-600" />
                  <span className="font-semibold text-green-800">{t.automaticRewards[lang]}</span>
                </div>
                <p className="text-sm text-green-700">
                  {t.rewardsDescription[lang]}
                </p>
                <div className="mt-3 flex gap-2">
                  <div className="flex-1 p-2 bg-white rounded-lg text-center border border-green-100">
                    <div className="flex items-center justify-center gap-1">
                      <Home className="w-3.5 h-3.5 text-resident-600" />
                      <span className="text-xs text-gray-600">{t.resident[lang]}</span>
                    </div>
                    <p className="font-bold text-resident-600">+2 {t.months[lang]}</p>
                  </div>
                  <div className="flex-1 p-2 bg-white rounded-lg text-center border border-green-100">
                    <div className="flex items-center justify-center gap-1">
                      <Building2 className="w-3.5 h-3.5 text-owner-600" />
                      <span className="text-xs text-gray-600">{t.owner[lang]}</span>
                    </div>
                    <p className="font-bold text-owner-600">+3 {t.months[lang]}</p>
                  </div>
                </div>
              </div>

              {/* Residence Invitation Code */}
              {showResidenceCodes && residenceData?.invitationCode && (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 superellipse-lg bg-resident-100 flex items-center justify-center">
                      <Home className="w-4 h-4 text-resident-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{t.roommateCode[lang]}</h3>
                      <p className="text-xs text-gray-500">{t.inviteToResidence[lang]}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex-1 bg-resident-50 superellipse-xl px-4 py-3 border-2 border-resident-200">
                      <p className="font-mono text-lg font-bold text-resident-700 break-all text-center">
                        {residenceData.invitationCode}
                      </p>
                    </div>
                    <button
                      onClick={() => copyToClipboard(residenceData.invitationCode!, 'residence')}
                      className="p-3 superellipse-xl bg-resident-500 hover:bg-resident-600 text-white hover:shadow-lg transition-all"
                    >
                      {copiedCode === 'residence' ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                    </button>
                  </div>

                  {/* Share buttons */}
                  <div className="flex gap-2">
                    <button
                      onClick={shareResidenceViaWhatsApp}
                      className="flex-1 flex items-center justify-center gap-2 py-2.5 superellipse-xl border-2 border-green-200 text-green-600 hover:bg-green-50 transition-colors text-sm font-medium"
                    >
                      <MessageCircle className="w-4 h-4" />
                      WhatsApp
                    </button>
                    <button
                      onClick={shareResidenceViaEmail}
                      className="flex-1 flex items-center justify-center gap-2 py-2.5 superellipse-xl border-2 border-blue-200 text-blue-600 hover:bg-blue-50 transition-colors text-sm font-medium"
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
                    <div className="w-8 h-8 superellipse-lg bg-owner-100 flex items-center justify-center">
                      <Building2 className="w-4 h-4 text-owner-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{t.ownerCode[lang]}</h3>
                      <p className="text-xs text-gray-500">{t.transferManagement[lang]}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-owner-50 superellipse-xl px-4 py-3 border-2 border-owner-200">
                      <p className="font-mono text-lg font-bold text-owner-700 break-all text-center">
                        {residenceData.ownerCode}
                      </p>
                    </div>
                    <button
                      onClick={() => copyToClipboard(residenceData.ownerCode!, 'owner')}
                      className="p-3 superellipse-xl bg-owner-500 hover:bg-owner-600 text-white hover:shadow-lg transition-all"
                    >
                      {copiedCode === 'owner' ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
              )}

              {/* No codes available */}
              {!residenceData?.invitationCode && !residenceData?.ownerCode && (
                <div className="text-center py-4">
                  <p className="text-gray-500">{t.noCodesAvailable[lang]}</p>
                </div>
              )}
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
