'use client';

import Link from 'next/link';
import { Home, Search, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="fixed inset-0 w-screen h-screen bg-gradient-to-br from-purple-50 to-yellow-50 flex items-center justify-center overflow-y-auto p-4">
      <div className="max-w-2xl w-full mx-auto my-auto text-center">
        {/* 404 Illustration */}
        <div className="mb-8">
          <div className="text-[120px] sm:text-[160px] font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-yellow-500 leading-none">
            404
          </div>
          <div className="mt-4 text-xl sm:text-2xl font-semibold text-gray-800">
            Page Not Found
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-xl p-6 sm:p-8 md:p-10 mx-auto">
          <p className="text-gray-600 mb-6 text-base sm:text-lg">
            Sorry, we couldn't find the page you're looking for. It might have been moved or deleted.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
            <Link href="/" className="w-full sm:w-auto">
              <Button className="flex items-center justify-center gap-2 w-full">
                <Home className="w-4 h-4" />
                Go Home
              </Button>
            </Link>

            <Link href="/properties/browse" className="w-full sm:w-auto">
              <Button variant="outline" className="flex items-center justify-center gap-2 w-full">
                <Search className="w-4 h-4" />
                Browse Properties
              </Button>
            </Link>
          </div>

          <div className="mt-6">
            <Button
              variant="ghost"
              onClick={() => window.history.back()}
              className="flex items-center gap-2 mx-auto"
            >
              <ArrowLeft className="w-4 h-4" />
              Go Back
            </Button>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="mt-8 flex justify-center gap-2">
          <div className="w-2 h-2 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="w-2 h-2 rounded-full bg-yellow-400 animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="w-2 h-2 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </div>
      </div>
    </div>
  );
}
