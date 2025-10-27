'use client';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center p-8">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl font-bold mb-4 text-purple-600">EasyCo - Test Minimal</h1>
        <p className="text-xl text-gray-600 mb-4">Si vous voyez cette page, le site charge correctement!</p>
        <p className="text-sm text-gray-500">Layout ultra minimal activé pour diagnostic</p>
      </div>
    </main>
  );
}
