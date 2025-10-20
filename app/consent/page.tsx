'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { safeLocalStorage } from '@/lib/browser';
import Link from 'next/link';

export default function ConsentPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const source = searchParams.get('source') ?? 'direct';

  const accept = () => {
    try {
      safeLocalStorage.set('consent', { source, at: Date.now() });
    } catch {}
    router.push('/onboarding/searcher'); // on démarre l’onboarding
  };

  const decline = () => {
    // libre à toi de rediriger ailleurs
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
          En cliquant sur « J’accepte », vous autorisez le stockage
          local (localStorage) pour mémoriser vos réponses pendant le test
          d’onboarding (budget, localisation, lifestyle, etc.).
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

          {/* lien alternatif si jamais (debug) */}
          <Link href="/onboarding/searcher" className="px-4 py-2 underline">
            Continuer sans consentement (debug)
          </Link>
        </div>
      </section>
    </main>
  );
}
