'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import LoadingHouse from '@/components/ui/LoadingHouse';

export default function EnhanceProfilePage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to first step of enhanced profile
    router.replace('/profile/enhance/about');
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <LoadingHouse size={80} />
    </div>
  );
}
