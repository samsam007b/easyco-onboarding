'use client';
import Link from "next/link"; import { usePathname } from "next/navigation";
const items=[
  {href:"/onboarding/searcher/budget",label:"Budget"},
  {href:"/onboarding/searcher/location",label:"Location"},
  {href:"/onboarding/searcher/lifestyle",label:"Lifestyle"},
  {href:"/onboarding/searcher/review",label:"Review"},
  {href:"/onboarding/searcher/group-brief",label:"Group Brief"},
];
export default function Stepper(){ const path=usePathname();
  return (<nav className="flex gap-2 flex-wrap">
    {items.map((it,i)=>{ const active=path===it.href;
      return (<Link key={it.href} href={it.href}
        className={`px-3 py-2 rounded-2xl border ${active?'bg-[color:var(--easy-purple)] text-white':'bg-white text-gray-700'}`}>
        {i+1}. {it.label}</Link>);})}
  </nav>);
}