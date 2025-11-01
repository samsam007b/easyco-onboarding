'use client'

import { useEffect } from 'react'
import { useRole } from '@/lib/role/role-context'
import ModernOwnerDashboard from '@/components/dashboard/ModernOwnerDashboard'

export default function OwnerDashboardPage() {
  const { setActiveRole } = useRole()

  useEffect(() => {
    // Set active role when dashboard loads
    setActiveRole('owner')
  }, [setActiveRole])

  return <ModernOwnerDashboard />
}
