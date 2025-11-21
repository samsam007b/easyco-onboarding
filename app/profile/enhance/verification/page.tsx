'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import LoadingHouse from '@/components/ui/LoadingHouse';

export default function VerificationPage() {
  const router = useRouter();

  useEffect(() => {
    // For now, redirect directly to review
    // TODO: Implement full verification page in future
    router.replace('/profile/enhance/review');
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <LoadingHouse size={80} />
    </div>
  );
}
