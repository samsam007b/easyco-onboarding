'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/auth/supabase-client';
import LoadingView from '@/components/ui/LoadingView';

export default function MessagesRedirectPage() {
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const redirectToRoleMessages = async () => {
      try {
        // Get current user
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
          // Not logged in, redirect to login
          router.push('/login');
          return;
        }

        // Get user role
        const { data: userData } = await supabase
          .from('users')
          .select('user_type')
          .eq('id', user.id)
          .single();

        // Redirect based on role
        switch (userData?.user_type) {
          case 'searcher':
            router.replace('/dashboard/searcher/messages');
            break;
          case 'owner':
            router.replace('/dashboard/owner/messages');
            break;
          case 'resident':
            // Residents use the hub messaging system
            router.replace('/hub/messages');
            break;
          default:
            // Fallback to searcher
            router.replace('/dashboard/searcher/messages');
        }
      } catch (error) {
        console.error('Error redirecting to messages:', error);
        // Fallback to searcher messages on error
        router.replace('/dashboard/searcher/messages');
      }
    };

    redirectToRoleMessages();
  }, [router, supabase]);

  // Show loading state
  return <LoadingView message="Chargement de vos messages" fullScreen />;
}
