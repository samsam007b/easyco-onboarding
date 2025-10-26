'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default function BudgetStep() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to basic-info page
    // TODO: Implement budget selection page in future
    router.replace('/onboarding/searcher/basic-info');
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-[color:var(--easy-purple)] border-t-transparent rounded-full animate-spin" />
    </div>
  );
}
