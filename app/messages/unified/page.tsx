'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/auth/supabase-client';
import { useLanguage } from '@/lib/i18n/use-language';
import LoadingHouse from '@/components/ui/LoadingHouse';

const t = {
  redirectError: {
    fr: 'Erreur de redirection. Veuillez réessayer.',
    en: 'Redirect error. Please try again.',
    nl: 'Omleidingsfout. Probeer opnieuw.',
    de: 'Weiterleitungsfehler. Bitte versuchen Sie es erneut.',
  },
  backToLogin: {
    fr: 'Retour à la connexion',
    en: 'Back to login',
    nl: 'Terug naar inloggen',
    de: 'Zurück zur Anmeldung',
  },
  redirecting: {
    fr: 'Redirection vers vos messages...',
    en: 'Redirecting to your messages...',
    nl: 'Doorsturen naar uw berichten...',
    de: 'Weiterleitung zu Ihren Nachrichten...',
  },
};

type Language = 'fr' | 'en' | 'nl' | 'de';

/**
 * Unified Messages Redirect Page
 *
 * Redirects users to the appropriate role-based messaging page
 * to ensure they get the proper header/navigation.
 */
export default function UnifiedMessagesRedirectPage() {
  const router = useRouter();
  const { language } = useLanguage();
  const lang = language as Language;
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const redirectToRoleBasedPage = async () => {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
          router.push('/login');
          return;
        }

        // Get user type
        const { data: userData } = await supabase
          .from('users')
          .select('user_type')
          .eq('id', user.id)
          .single();

        const userType = userData?.user_type;

        // All roles use the unified hub/messages page which is role-agnostic
        // The hub/messages page uses getUserRole() to determine the user's role dynamically
        router.replace('/hub/messages');
      } catch (err) {
        console.error('Error redirecting:', err);
        setHasError(true);
      }
    };

    redirectToRoleBasedPage();
  }, [router]);

  if (hasError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50/30 via-white to-orange-50/30">
        <div className="text-center">
          <p className="text-red-600 mb-4">{t.redirectError[lang]}</p>
          <button
            onClick={() => router.push('/login')}
            className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
          >
            {t.backToLogin[lang]}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50/30 via-white to-orange-50/30">
      <div className="text-center">
        <div className="flex justify-center mb-6">
          <LoadingHouse size={80} />
        </div>
        <p className="text-gray-600 font-medium">{t.redirecting[lang]}</p>
      </div>
    </div>
  );
}
