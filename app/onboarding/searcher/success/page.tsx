'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import LoadingView from '@/components/ui/LoadingView';
import { useLanguage } from '@/lib/i18n/use-language';

/**
 * Legacy success page - redirects to unified completion page
 * This ensures consistent post-onboarding experience for all roles
 */
export default function SearcherSuccessPage() {
  const router = useRouter();
  const { t } = useLanguage();

  useEffect(() => {
    // Redirect to unified completion page with user_type parameter
    router.replace('/onboarding/completion?user_type=searcher');
  }, [router]);

  // Show loading state during redirect
  return <LoadingView message={t('common.redirecting') || 'Redirecting...'} fullScreen />;
}
