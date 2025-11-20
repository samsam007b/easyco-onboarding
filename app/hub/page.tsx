'use client';

import ResidenceHeader from '@/components/hub/ResidenceHeader';
import ModernResidentDashboard from '@/components/dashboard/ModernResidentDashboard';

/**
 * Hub home page - main dashboard
 */
export default function HubPage() {
  return (
    <>
      <ResidenceHeader />
      <ModernResidentDashboard />
    </>
  );
}
