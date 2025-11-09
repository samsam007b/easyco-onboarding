'use client';

import React from 'react';
// import SinglePropertyMap from '@/components/SinglePropertyMap';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function TestMapPage() {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Google Maps Test Page</h1>

      {/* Diagnostic Information */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Configuration</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="font-semibold">API Key Configured:</span>
              <span className={apiKey ? 'text-green-600' : 'text-red-600'}>
                {apiKey ? '✓ Yes' : '✗ No'}
              </span>
            </div>
            {apiKey && (
              <div className="flex items-center gap-2">
                <span className="font-semibold">API Key Length:</span>
                <span>{apiKey.length} characters</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <span className="font-semibold">Test Coordinates:</span>
              <span>Brussels Center (50.8503, 4.3517)</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Test Map */}
      <Card>
        <CardHeader>
          <CardTitle>Test Map</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <SinglePropertyMap
            latitude={50.8503}
            longitude={4.3517}
            title="Test Location - Brussels Center"
            address="Grand Place, 1000 Bruxelles"
            className="w-full h-[500px] rounded-b-2xl overflow-hidden"
          />
        </CardContent>
      </Card>

      {/* Console Instructions */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Debugging Instructions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm text-gray-600">
            <p>1. Open your browser's Developer Console (F12 or Right-click → Inspect → Console)</p>
            <p>2. Look for messages starting with [SinglePropertyMap]</p>
            <p>3. Check for any errors in red</p>
            <p>4. If you see Google Maps API errors, check:</p>
            <ul className="list-disc list-inside ml-4 space-y-1">
              <li>API key is correctly set in Vercel environment variables</li>
              <li>API key has the correct restrictions (HTTP referrers)</li>
              <li>Maps JavaScript API is enabled in Google Cloud Console</li>
              <li>Billing is enabled for the Google Cloud project</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
