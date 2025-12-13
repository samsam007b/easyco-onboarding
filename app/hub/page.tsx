'use client';

import { useEffect } from 'react';
import { useRole } from '@/lib/role/role-context';
import ModernResidentDashboard from '@/components/dashboard/ModernResidentDashboard';

/**
 * Hub home page - main resident dashboard
 */
export default function HubPage() {
  const { setActiveRole } = useRole();

  useEffect(() => {
    setActiveRole('resident');
  }, [setActiveRole]);

  return <ModernResidentDashboard />;
}
