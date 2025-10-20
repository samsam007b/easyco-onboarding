'use client';

import { Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { safeLocalStorage } from '@/lib/browser';

// Empêche le prerender statique (réglé au build)
export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

function ConsentInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const source = searchParams.get('source') ?? 'direct';

  const accept = () => {
    try {
      safeLocalStorage.set('consent', { source, at: Date.now() });
    } catch {}
    router.push('/onboarding/searcher'); // démarrer le flow
  };

  const decline = () => {
    router.push('/');
  };

  return (
    <main className="max-w-3xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Consentement</h1>
      <p className="text-sm text-gray-600">
        Source d’arrivée : <strong>{source}</strong>
      </p>

      <section className="space-y-3">
        <p>
          En cliquant sur « J’accepte », vous autorisez l’usage du
          stockage local pour mémoriser vos réponses d’onboarding.
        </p>

        <div className="flex gap-3">
          <button
            onClick={accept}
            className="px-4 py-2 rounded bg-[color:var(--easy-purple)] text-white"
          >
            J’accepte & commencer
          </button>

          <button
            onClick={decline}
            className="px-4 py-2 rounded border"
          >
            Je refuse
          </button>
        </div>
      </section>
    </main>
  );
}

export default function ConsentPage() {
  // ⬇️ Répond à l’exigence “useSearchParams must be wrapped in Suspense”
  return (
    <Suspense fallback={<main className="p-6">Chargement…</main>}>
      <ConsentInner />
    </Suspense>
  );
}
