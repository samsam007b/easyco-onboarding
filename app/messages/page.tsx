'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/auth/supabase-client';
import LoadingView from '@/components/ui/LoadingView';

export default function MessagesRedirectPage() {
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const redirectToMessages = async () => {
      try {
        // Get current user
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
          // Not logged in, redirect to login
          router.push('/login');
          return;
        }

        // Redirect all users to the unified messaging page
        router.replace('/messages/unified');
      } catch (error) {
        console.error('Error redirecting to messages:', error);
        // Fallback to unified messages on error
        router.replace('/messages/unified');
      }
    };

    redirectToMessages();
  }, [router, supabase]);

  // Show loading state
  return <LoadingView message="Loading your messages" fullScreen />;
}
