'use client';

import Link from 'next/link';
import { Home as HomeIcon, Users, Heart } from 'lucide-react';

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-white p-6">
      <div className="max-w-md w-full text-center space-y-8">

        {/* Logo */}
        <div className="flex items-center justify-center gap-3">
          <div className="w-14 h-14 rounded-2xl bg-[color:var(--easy-purple)] flex items-center justify-center">
            <HomeIcon className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-[color:var(--easy-purple)]">EasyCo</h1>
        </div>

        {/* Icon trio */}
        <div className="flex items-center justify-center gap-4 py-4">
          <div className="w-16 h-16 rounded-full bg-[color:var(--easy-yellow)] flex items-center justify-center">
            <Users className="w-8 h-8 text-[color:var(--easy-purple)]" />
          </div>
          <div className="w-16 h-16 rounded-full bg-[color:var(--easy-purple)] flex items-center justify-center">
            <Heart className="w-8 h-8 text-white" />
          </div>
          <div className="w-16 h-16 rounded-full bg-[color:var(--easy-yellow)] flex items-center justify-center">
            <HomeIcon className="w-8 h-8 text-[color:var(--easy-purple)]" />
          </div>
        </div>

        {/* Title and subtitle */}
        <div className="space-y-3">
          <h2 className="text-2xl font-bold text-[color:var(--easy-purple)]">
            Welcome to EasyCo!
          </h2>
          <p className="text-gray-600">
            Find your perfect coliving match or list your property.
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="space-y-3 pt-4">
          <div className="text-sm font-semibold text-gray-700 mb-2">I'm looking for a place</div>
          <Link
            href="/consent?source=landing"
            className="block w-full py-4 rounded-full bg-[color:var(--easy-yellow)] text-black font-semibold text-lg hover:opacity-90 transition shadow-md hover:shadow-lg"
          >
            Start as Searcher
          </Link>

          <div className="text-sm font-semibold text-gray-700 mt-6 mb-2">I'm a homeowner</div>
          <Link
            href="/onboarding/owner/basic-info"
            className="block w-full py-4 rounded-full bg-[color:var(--easy-purple)] text-white font-semibold text-lg hover:opacity-90 transition shadow-md hover:shadow-lg"
          >
            List Your Property
          </Link>

          <Link
            href="/login"
            className="block w-full py-4 rounded-full border-2 border-gray-300 text-gray-700 font-semibold hover:border-[color:var(--easy-purple)] hover:text-[color:var(--easy-purple)] transition mt-4"
          >
            Log in
          </Link>
        </div>

        {/* Tagline */}
        <p className="text-sm text-gray-400 pt-4">
          Join thousands of happy co-livers finding their ideal home
        </p>
      </div>
    </main>
  );
}
