'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import LoadingView from '@/components/ui/LoadingView';

/**
 * Legacy success page - redirects to unified completion page
 * This ensures consistent post-onboarding experience for all roles
 */
export default function OwnerSuccessPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to unified completion page with user_type parameter
    router.replace('/onboarding/completion?user_type=owner');
  }, [router]);

  // Show loading state during redirect
  return <LoadingView message="Redirection..." fullScreen />;
}
