/**
 * Demo page showcasing the Aesthetic Room Search system
 * Navigate to /aesthetic-demo to see it in action
 */

'use client';

import { AestheticRoomSearch } from '@/components/listings/AestheticRoomSearch';

// Force dynamic rendering to prevent SSG timeout
export const dynamic = 'force-dynamic';

export default function AestheticDemoPage() {
  return (
    <div>
      <AestheticRoomSearch
        onRoomClick={(roomId) => {
          // In production, navigate to room detail page
          console.log('Clicked room:', roomId);
          alert(`Room ${roomId} clicked! In production, this would navigate to the detail page.`);
        }}
      />
    </div>
  );
}
