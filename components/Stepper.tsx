// components/Stepper.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

type Item = { href: string; label: string };

const items: Item[] = [
  { href: '/onboarding/searcher/budget',      label: 'Budget' },
  { href: '/onboarding/searcher/location',    label: 'Location' },
  { href: '/onboarding/searcher/lifestyle',   label: 'Lifestyle' },
  { href: '/onboarding/searcher/review',      label: 'Review' },
  { href: '/onboarding/searcher/group-brief', label: 'Group Brief' },
];

export default function Stepper() {
  const pathname = usePathname();

  return (
    <nav className="flex gap-2 flex-wrap">
      {items.map((it, i) => {
        const active = pathname?.startsWith(it.href);
        return (
          <Link
            key={it.href}
            href={it.href}
            className={[
              'px-3 py-2 rounded-2xl border',
              active ? 'bg-[color:var(--easy-purple)] text-white border-transparent'
                     : 'border-gray-300'
            ].join(' ')}
          >
            {i + 1}. {it.label}
          </Link>
        );
      })}
    </nav>
  );
}
