// components/ConsentActions.tsx
'use client';

import Link from 'next/link';

export default function ConsentActions({ source = 'landing' }: { source?: string }) {
  return (
    <main className="max-w-2xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Consent</h1>
      <p className="text-sm text-gray-500">source: {source}</p>

      <p>
        Nous avons besoin de votre accord pour lancer le test utilisateur.
        En continuant, vous consentez au traitement anonyme de vos réponses.
      </p>

      <div className="flex items-center gap-3">
        <Link
          href="/onboarding/searcher/budget"
          className="px-4 py-2 rounded-xl bg-[color:var(--easy-purple)] text-white"
        >
          Démarrer le test
        </Link>
        <Link href="/" className="px-4 py-2 rounded-xl border">
          Annuler
        </Link>
      </div>
    </main>
  );
}
