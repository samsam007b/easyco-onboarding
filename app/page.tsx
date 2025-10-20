'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default function Home() {
  // On récupère un éventuel ?source=... si tu appelles la landing avec une source custom
  const sp = useSearchParams();
  const source = (sp.get('source') ?? 'landing').toLowerCase();

  return (
    <main className="max-w-3xl mx-auto p-6 space-y-6">
      <h1 className="text-xl font-semibold">EasyCo — Prototype</h1>
      <p className="text-sm text-gray-600">
        Démarrer le test utilisateur (source: <strong>{source}</strong>)
      </p>

      <Link
        href={`/consent?source=${encodeURIComponent(source)}`}
        className="inline-block px-4 py-2 rounded bg-[color:var(--easy-purple)] text-white"
      >
        Start user test
      </Link>
    </main>
  );
}
