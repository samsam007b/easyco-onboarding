'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/auth/supabase-client';
import LoadingHouse from '@/components/ui/LoadingHouse';

/**
 * Unified Messages Redirect Page
 *
 * Redirects users to the appropriate role-based messaging page
 * to ensure they get the proper header/navigation.
 */
export default function UnifiedMessagesRedirectPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

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

        // Redirect based on user type
        switch (userType) {
          case 'resident':
            router.replace('/hub/messages');
            break;
          case 'owner':
            router.replace('/dashboard/owner/messages');
            break;
          case 'searcher':
            router.replace('/dashboard/searcher/messages');
            break;
          default:
            // Fallback to hub messages for unknown types
            router.replace('/hub/messages');
        }
      } catch (err) {
        console.error('Error redirecting:', err);
        setError('Erreur de redirection. Veuillez réessayer.');
      }
    };

    redirectToRoleBasedPage();
  }, [router]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50/30 via-white to-orange-50/30">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => router.push('/login')}
            className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
          >
            Retour à la connexion
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
        <p className="text-gray-600 font-medium">Redirection vers vos messages...</p>
      </div>
    </div>
  );
}
