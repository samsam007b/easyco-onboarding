'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/auth/supabase-client';
import { motion } from 'framer-motion';
import LoadingHouse from '@/components/ui/LoadingHouse';
import {
  Lock,
  Key,
  Users,
  UserCheck,
  Copy,
  Check,
  AlertCircle,
  ArrowLeft,
  Shield
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';

interface PropertyCodes {
  property_id: string;
  property_title: string;
  invitation_code: string;
  owner_code: string | null;
  is_creator: boolean;
}

export default function PrivateCodesPage() {
  const router = useRouter();
  const supabase = createClient();
  const [isLoading, setIsLoading] = useState(true);
  const [codes, setCodes] = useState<PropertyCodes | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  useEffect(() => {
    loadCodes();
  }, []);

  const loadCodes = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }

      // Get user's property membership
      const { data: membership, error: memberError } = await supabase
        .from('property_members')
        .select('property_id, is_creator')
        .eq('user_id', user.id)
        .eq('status', 'active')
        .maybeSingle();

      if (memberError || !membership) {
        console.error('No property membership found');
        setIsLoading(false);
        return;
      }

      // Get property with codes
      const { data: property, error: propertyError } = await supabase
        .from('properties')
        .select('id, title, invitation_code, owner_code')
        .eq('id', membership.property_id)
        .single();

      if (propertyError || !property) {
        console.error('Property not found');
        setIsLoading(false);
        return;
      }

      setCodes({
        property_id: property.id,
        property_title: property.title,
        invitation_code: property.invitation_code,
        owner_code: property.owner_code,
        is_creator: membership.is_creator,
      });

      setIsLoading(false);
    } catch (error) {
      console.error('Error loading codes:', error);
      setIsLoading(false);
    }
  };

  const copyToClipboard = async (code: string, label: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(code);
      toast.success(`${label} copié !`);
      setTimeout(() => setCopiedCode(null), 2000);
    } catch (error) {
      toast.error('Erreur lors de la copie');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-white to-orange-50/30">
        <div className="text-center">
          <LoadingHouse size={64} />
          <p className="text-gray-600 font-medium mt-4">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!codes) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50/30 flex items-center justify-center p-4">
        <Card className="p-8 max-w-md text-center">
          <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-gray-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Aucune résidence trouvée
          </h2>
          <p className="text-gray-600 mb-6">
            Vous devez d'abord créer ou rejoindre une résidence pour accéder aux codes.
          </p>
          <Button
            onClick={() => router.push('/onboarding/resident/property-setup')}
            className="rounded-xl bg-gradient-to-r from-[#D97B6F] via-[#E8865D] to-[#FF8C4B]"
          >
            Configurer ma résidence
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50/30">
      {/* Header */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Button
          variant="ghost"
          onClick={() => router.push('/settings')}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour aux paramètres
        </Button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="w-20 h-20 rounded-3xl mx-auto mb-4 flex items-center justify-center bg-gradient-to-br from-purple-500 to-indigo-600 shadow-xl">
            <Lock className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Codes Privés</h1>
          <p className="text-gray-600 text-lg">
            Codes d'invitation pour {codes.property_title}
          </p>
          {codes.is_creator && (
            <div className="inline-flex items-center gap-2 mt-4 px-4 py-2 rounded-full bg-gradient-to-r from-purple-100 to-indigo-100 text-purple-700 font-medium">
              <Shield className="w-4 h-4" />
              Vous êtes le créateur de cette résidence
            </div>
          )}
        </motion.div>

        {/* Codes Cards */}
        <div className="space-y-6">
          {/* Invitation Code for Residents */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="p-6 bg-white/80 backdrop-blur-sm border-2 border-orange-200 hover:border-orange-300 transition-all">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-400 to-yellow-500 flex items-center justify-center flex-shrink-0 shadow-lg">
                  <Users className="w-7 h-7 text-white" />
                </div>

                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    Code Invitation Résidents
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">
                    Partagez ce code avec vos colocataires pour qu'ils puissent rejoindre la résidence.
                  </p>

                  <div className="flex items-center gap-3">
                    <div className="flex-1 px-6 py-4 bg-gradient-to-r from-orange-50 to-yellow-50 rounded-xl border-2 border-orange-200">
                      <p className="text-3xl font-bold text-gray-900 tracking-wider text-center font-mono">
                        {codes.invitation_code}
                      </p>
                    </div>

                    <Button
                      onClick={() => copyToClipboard(codes.invitation_code, 'Code résidents')}
                      variant="outline"
                      className="rounded-xl border-2 border-orange-300 hover:bg-orange-50 h-14 px-6"
                    >
                      {copiedCode === codes.invitation_code ? (
                        <>
                          <Check className="w-5 h-5 text-green-600" />
                        </>
                      ) : (
                        <>
                          <Copy className="w-5 h-5" />
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Owner Code (Only for creators) */}
          {codes.is_creator && codes.owner_code && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="p-6 bg-white/80 backdrop-blur-sm border-2 border-purple-200 hover:border-purple-300 transition-all">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center flex-shrink-0 shadow-lg">
                    <UserCheck className="w-7 h-7 text-white" />
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-xl font-bold text-gray-900">
                        Code Propriétaire
                      </h3>
                      <span className="px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-xs font-bold">
                        CONFIDENTIEL
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm mb-4">
                      Donnez ce code UNIQUEMENT au propriétaire légal pour qu'il puisse claim la résidence et accéder aux fonctionnalités propriétaire.
                    </p>

                    <div className="flex items-center gap-3">
                      <div className="flex-1 px-6 py-4 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl border-2 border-purple-200">
                        <p className="text-2xl font-bold text-gray-900 tracking-wider text-center font-mono">
                          {codes.owner_code}
                        </p>
                      </div>

                      <Button
                        onClick={() => copyToClipboard(codes.owner_code!, 'Code propriétaire')}
                        variant="outline"
                        className="rounded-xl border-2 border-purple-300 hover:bg-purple-50 h-14 px-6"
                      >
                        {copiedCode === codes.owner_code ? (
                          <>
                            <Check className="w-5 h-5 text-green-600" />
                          </>
                        ) : (
                          <>
                            <Copy className="w-5 h-5" />
                          </>
                        )}
                      </Button>
                    </div>

                    <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl">
                      <div className="flex gap-3">
                        <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="font-semibold text-red-900 text-sm mb-1">
                            ⚠️ Important - Sécurité
                          </p>
                          <p className="text-red-700 text-xs leading-relaxed">
                            Ne partagez ce code qu'avec le propriétaire LÉGAL de la résidence.
                            Ce code lui donnera accès à des fonctionnalités sensibles (documents, finances, etc.).
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
          {!codes.is_creator && (
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
                      Vous n'êtes pas le créateur
                    </h4>
                    <p className="text-blue-700 text-sm">
                      Seul le créateur de la résidence a accès au code propriétaire.
                      Si vous avez besoin de ce code, demandez-le au créateur de votre résidence.
                    </p>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
