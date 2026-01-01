'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import LoadingHouse from '@/components/ui/LoadingHouse';
import { useLanguage } from '@/lib/i18n/use-language';

/**
 * Redirect page - /dashboard/my-profile now redirects to /profile
 * The new unified profile page at /profile contains all profile management features
 */
export default function MyProfileRedirect() {
  const router = useRouter();
  const { t } = useLanguage();

  useEffect(() => {
    // Redirect to the new unified profile page
    router.replace('/profile');
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-yellow-50 flex items-center justify-center">
      <div className="text-center">
        <LoadingHouse size={80} />
        <p className="text-gray-600 mt-4">{t('dashboard.myProfile.redirecting')}</p>
      </div>
    </div>
  );
}
