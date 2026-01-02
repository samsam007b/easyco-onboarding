'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/auth/supabase-client';
import LoadingView from '@/components/ui/LoadingView';
import { useLanguage } from '@/lib/i18n/use-language';

export default function MessagesRedirectPage() {
  const router = useRouter();
  const supabase = createClient();
  const { language, getSection } = useLanguage();
  const t = getSection('components')?.loadingView;

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
  const loadingMessage = t?.loadingMessages?.[language] || 'Loading your messages';
  return <LoadingView message={loadingMessage} fullScreen />;
}
