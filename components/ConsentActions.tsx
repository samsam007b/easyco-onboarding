// components/ConsentActions.tsx
'use client';

import { useRouter } from 'next/navigation';
import { safeLocalStorage } from '@/lib/browser';

interface ConsentActionsProps {
  source?: string;
  nextHref?: string;
}

export default function ConsentActions({ source = 'unknown', nextHref = '/onboarding/searcher' }: ConsentActionsProps) {
  const router = useRouter();

  const accept = () => {
    safeLocalStorage.set('consent', 'accepted');
    safeLocalStorage.set('source', source);
    router.push(nextHref);
  };

  const decline = () => {
    safeLocalStorage.set('consent', 'declined');
    router.push('/');
  };

  return (
    <main className="max-w-2xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Consentement</h1>
      <p className="text-sm text-gray-500">Source: {source}</p>

      <p>
        Nous avons besoin de votre accord pour lancer le test utilisateur.
        En continuant, vous consentez au traitement anonyme de vos réponses.
      </p>

      <div className="flex items-center gap-3">
        <button onClick={accept} className="px-4 py-2 rounded-xl bg-[color:var(--easy-purple)] text-white hover:opacity-90 transition">
          Démarrer le test
        </button>
        <button onClick={decline} className="px-4 py-2 rounded-xl border hover:bg-gray-50 transition">
          Annuler
        </button>
      </div>
    </main>
  );
}
