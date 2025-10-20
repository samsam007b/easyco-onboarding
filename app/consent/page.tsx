// app/consent/page.tsx
import ConsentActions from '@/components/ConsentActions';

export const dynamic = 'force-dynamic';

export default function ConsentPage({
  searchParams,
}: {
  searchParams?: { source?: string };
}) {
  const source = searchParams?.source ?? 'unknown';
  return <ConsentActions source={source} />;
}
