import Link from "next/link";
export default function SearcherIndex(){
  return (<main className="max-w-3xl mx-auto p-6 space-y-6">
    <h1 className="text-2xl font-bold">Searcher Onboarding</h1>
    <div className="card space-y-3">
      <p>Follow the steps to set your preferences.</p>
      <Link href="/onboarding/searcher/basic-info" className="btn btn-primary inline-block">Start</Link>
    </div>
  </main>);
}