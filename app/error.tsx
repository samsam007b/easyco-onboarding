'use client';

import { useEffect } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-yellow-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 text-center">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertTriangle className="w-8 h-8 text-red-600" />
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Oops! Something went wrong
        </h1>

        <p className="text-gray-600 mb-6">
          We're sorry, but something unexpected happened. Don't worry, your data is safe.
        </p>

        {process.env.NODE_ENV === 'development' && error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 text-left overflow-auto max-h-40">
            <p className="text-sm font-mono text-red-800 break-all">
              {error.message}
            </p>
            {error.digest && (
              <p className="text-xs text-red-600 mt-2">
                Error ID: {error.digest}
              </p>
            )}
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            onClick={reset}
            className="flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Try Again
          </Button>

          <Button
            variant="outline"
            onClick={() => window.location.href = '/'}
            className="flex items-center gap-2"
          >
            <Home className="w-4 h-4" />
            Go Home
          </Button>
        </div>
      </div>
    </div>
  );
}
