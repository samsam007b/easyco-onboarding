'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function VerificationPage() {
  const router = useRouter();

  useEffect(() => {
    // For now, redirect directly to review
    // TODO: Implement full verification page in future
    router.replace('/profile/enhance/review');
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-[color:var(--easy-purple)] border-t-transparent rounded-full animate-spin" />
    </div>
  );
}
