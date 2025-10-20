// app/consent/page.tsx (Server Component)
import { headers } from 'next/headers';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

type SearchParams = { [key: string]: string | string[] | undefined };

export default function ConsentPage({
  searchParams,
}: {
  searchParams?: SearchParams;
}) {
  // 1) on récupère le paramètre s'il est présent
  const sourceParam = typeof searchParams?.source === 'string' ? searchParams!.source : undefined;

  // 2) fallback propre si absent (ex: arrivée directe)
  const hdrs = headers();
  const referer = hdrs.get('referer') || '';
  const source =
    sourceParam ??
    (referer ? 'referer' : 'direct'); // choisis 'landing' si tu préfères

  return (
    <main className="max-w-3xl mx-auto p-6 space-y-6">
      <h1 className="text-xl font-semibold">Consent — source: {source}</h1>

      {/* Exemple: bouton pour entrer dans le flow */}
      <Link
        href="/onboarding/searcher"
        className="inline-block px-4 py-2 rounded bg-[color:var(--easy-purple)] text-white"
      >
        Continuer
      </Link>
    </main>
  );
}
