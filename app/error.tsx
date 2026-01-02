'use client';

import { useEffect } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/lib/i18n/use-language';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const { language, getSection } = useLanguage();
  const t = getSection('errorPages')?.error;

  useEffect(() => {
    // Log the error to the security dashboard
    const logError = async () => {
      try {
        await fetch('/api/log/error', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'runtime',
            message: error.message,
            route: window.location.pathname,
            stack: error.stack,
            metadata: {
              digest: error.digest,
              name: error.name,
              url: window.location.href,
            },
          }),
        });
      } catch (logError) {
        console.error('[Error] Failed to log error:', logError);
      }
    };

    logError();
  }, [error]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-yellow-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 text-center">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertTriangle className="w-8 h-8 text-red-600" />
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          {t?.title?.[language] || 'Oops! Something went wrong'}
        </h1>

        <p className="text-gray-600 mb-6">
          {t?.description?.[language] || 'We\'re sorry, but something unexpected happened. Don\'t worry, your data is safe.'}
        </p>

        {process.env.NODE_ENV === 'development' && error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 text-left overflow-auto max-h-40">
            <p className="text-sm font-mono text-red-800 break-all">
              {error.message}
            </p>
            {error.digest && (
              <p className="text-xs text-red-600 mt-2">
                {t?.errorId?.[language] || 'Error ID'}: {error.digest}
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
            {t?.tryAgain?.[language] || 'Try Again'}
          </Button>

          <Button
            variant="outline"
            onClick={() => window.location.href = '/'}
            className="flex items-center gap-2"
          >
            <Home className="w-4 h-4" />
            {t?.goHome?.[language] || 'Go Home'}
          </Button>
        </div>
      </div>
    </div>
  );
}
