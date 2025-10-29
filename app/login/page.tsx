'use client';

import { Suspense, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

function LoginRedirectContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const redirect = searchParams?.get('redirect');
    const url = redirect ? `/auth?redirect=${redirect}` : '/auth';
    router.replace(url);
  }, [router, searchParams]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-yellow-50 flex items-center justify-center">
      <div className="w-16 h-16 border-4 border-[#4A148C] border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

export default function LoginRedirect() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-yellow-50 flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-[#4A148C] border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <LoginRedirectContent />
    </Suspense>
  );
}
