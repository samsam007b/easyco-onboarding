// app/consent/page.tsx
import ConsentActions from '../components/ConsentActions'; // <-- relatif

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

export default function ConsentPage({
  searchParams,
}: {
  searchParams?: { source?: string };
}) {
  const source = searchParams?.source ?? 'unknown';
  return <ConsentActions source={source} />;
}
