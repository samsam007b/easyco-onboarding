'use client'

import { useEffect } from 'react'
import { useRole } from '@/lib/role/role-context'
import ModernResidentDashboard from '@/components/dashboard/ModernResidentDashboard'

export default function ResidentDashboardPage() {
  const { setActiveRole } = useRole()

  useEffect(() => {
    // Set active role when dashboard loads
    setActiveRole('resident')
  }, [setActiveRole])

  return <ModernResidentDashboard />
}
