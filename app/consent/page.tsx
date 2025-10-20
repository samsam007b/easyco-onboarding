'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

function ConsentInner() {
  const params = useSearchParams();
  const source = params.get('source') ?? 'unknown';
  return <div>Consent – source: {source}</div>;
}

export const dynamic = 'force-dynamic';

export default function ConsentPage() {
  return (
    <Suspense fallback={null}>
      <ConsentInner />
    </Suspense>
  );
}
