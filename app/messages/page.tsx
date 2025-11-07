'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/auth/supabase-client';

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
            router.replace('/dashboard/resident/messages');
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
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50/30 via-white to-yellow-50/30">
      <div className="text-center">
        <div className="relative">
          <div className="w-20 h-20 border-4 border-orange-200 rounded-full mx-auto mb-6"></div>
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-20 border-4 border-[#FFA040] border-t-transparent rounded-full animate-spin"></div>
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Redirection...</h3>
        <p className="text-gray-600">Chargement de vos messages</p>
      </div>
    </div>
  );
}
