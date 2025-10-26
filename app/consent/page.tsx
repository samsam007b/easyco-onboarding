// app/consent/page.tsx
import ConsentActions from '@/components/ConsentActions';

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

export default function ConsentPage({
  searchParams,
}: {
  searchParams?: { source?: string; nextHref?: string };
}) {
  const source = searchParams?.source ?? 'unknown';
  const nextHref = searchParams?.nextHref;
  return <ConsentActions source={source} nextHref={nextHref} />;
}
