'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { createClient } from '@/lib/auth/supabase-client';
import { motion } from 'framer-motion';
import { validateInvitationToken } from '@/lib/services/invitation-service';
import {
  setPendingInvitation,
  type ValidateInvitationResponse,
  type PendingInvitationContext,
} from '@/types/invitation.types';
import LoadingHouse from '@/components/ui/LoadingHouse';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Home,
  Building2,
  MapPin,
  User,
  AlertCircle,
  Clock,
  ArrowRight,
} from 'lucide-react';

export default function InvitePage() {
  const router = useRouter();
  const params = useParams();
  const token = params.token as string;
  const supabase = createClient();

  const [isLoading, setIsLoading] = useState(true);
  const [isCheckingAuth, setIsCheckingAuth] = useState(false);
  const [validationResult, setValidationResult] = useState<ValidateInvitationResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (token) {
      validateToken();
    }
  }, [token]);

  const validateToken = async () => {
    setIsLoading(true);
    setError(null);

    const result = await validateInvitationToken(token);
    setValidationResult(result);

    if (result.valid) {
      // Store invitation data in sessionStorage
      const context: PendingInvitationContext = {
        token,
        invitationId: result.invitation_id!,
        invitedRole: result.invited_role!,
        inviter: result.inviter!,
        property: result.property!,
        expiresAt: result.expires_at!,
        validatedAt: new Date().toISOString(),
      };
      setPendingInvitation(context);

      // Check if user is authenticated
      checkAuthAndRedirect();
    } else {
      setIsLoading(false);
    }
  };

  const checkAuthAndRedirect = async () => {
    setIsCheckingAuth(true);

    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      // User is authenticated - redirect to welcome page to show invitation
      router.push('/welcome');
    } else {
      // User not authenticated - show invitation preview with CTA to sign up
      setIsLoading(false);
      setIsCheckingAuth(false);
    }
  };

  const handleContinue = () => {
    // Redirect to auth page to sign up/login
    router.push('/auth');
  };

  if (isLoading || isCheckingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-white to-orange-50/50">
        <div className="text-center">
          <LoadingHouse size={80} />
          <p className="text-gray-600 font-medium mt-4">
            {isCheckingAuth ? 'Redirection...' : 'Vérification de l\'invitation...'}
          </p>
        </div>
      </div>
    );
  }

  // Invalid or expired invitation
  if (!validationResult?.valid) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-white to-orange-50/50 p-4">
        <Card className="max-w-md w-full p-8 text-center">
          <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Invitation invalide
          </h1>
          <p className="text-gray-600 mb-6">
            {validationResult?.message || 'Cette invitation n\'existe pas ou a expiré.'}
          </p>
          <Button
            onClick={() => router.push('/auth')}
            className="w-full rounded-xl text-white font-medium"
            style={{ background: 'linear-gradient(135deg, #d9574f 0%, #ff5b21 50%, #ff8017 100%)' }}
          >
            Créer un compte
          </Button>
        </Card>
      </div>
    );
  }

  // Valid invitation - show preview for non-authenticated users
  const { inviter, property, invited_role, expires_at } = validationResult;
  const roleText = invited_role === 'owner' ? 'propriétaire' : 'colocataire';
  const RoleIcon = invited_role === 'owner' ? Building2 : Home;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50/50 p-4 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full"
      >
        <Card className="overflow-hidden">
          {/* Header with gradient */}
          <div
            className="p-6 text-white"
            style={{ background: 'linear-gradient(135deg, #d9574f 0%, #ff5b21 50%, #ff8017 100%)' }}
          >
            <div className="flex items-center gap-4 mb-4">
              {inviter?.avatar_url ? (
                <img
                  src={inviter.avatar_url}
                  alt={inviter.name}
                  className="w-16 h-16 rounded-full border-4 border-white/30 object-cover"
                />
              ) : (
                <div className="w-16 h-16 rounded-full border-4 border-white/30 bg-white/20 flex items-center justify-center text-2xl font-bold">
                  {inviter?.name?.charAt(0) || '?'}
                </div>
              )}
              <div>
                <p className="text-white/80 text-sm">Invitation de</p>
                <h2 className="text-xl font-bold">{inviter?.name || 'Quelqu\'un'}</h2>
              </div>
            </div>

            <div className="bg-white/20 backdrop-blur rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <RoleIcon className="w-5 h-5" />
                <span className="font-medium">
                  Devenir {roleText}
                </span>
              </div>
              <h3 className="text-xl font-bold mb-1">
                {property?.title || 'Une résidence'}
              </h3>
              <div className="flex items-center gap-1 text-white/80 text-sm">
                <MapPin className="w-4 h-4" />
                <span>
                  {property?.address ? `${property.address}, ` : ''}{property?.city || ''}
                </span>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {property?.image && (
              <div className="mb-4 rounded-xl overflow-hidden">
                <img
                  src={property.image}
                  alt={property.title}
                  className="w-full h-40 object-cover"
                />
              </div>
            )}

            <div className="space-y-4 mb-6">
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <Clock className="w-4 h-4 text-orange-500" />
                <span>
                  Cette invitation expire le{' '}
                  {new Date(expires_at!).toLocaleDateString('fr-FR', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </span>
              </div>

              <p className="text-gray-600">
                Pour accepter cette invitation, créez votre compte EasyCo ou connectez-vous.
              </p>
            </div>

            <Button
              onClick={handleContinue}
              className="w-full rounded-xl text-white font-medium h-12 text-lg"
              style={{ background: 'linear-gradient(135deg, #d9574f 0%, #ff5b21 50%, #ff8017 100%)' }}
            >
              Continuer
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>

            <p className="text-center text-xs text-gray-500 mt-4">
              En continuant, vous acceptez les conditions d'utilisation d'EasyCo
            </p>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
