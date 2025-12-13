'use client'

import { useEffect } from 'react'
import { useRole } from '@/lib/role/role-context'
import ResidenceHeader from '@/components/hub/ResidenceHeader'

export default function ResidentDashboardPage() {
  const { setActiveRole } = useRole()

  useEffect(() => {
    // Set active role when dashboard loads
    setActiveRole('resident')
  }, [setActiveRole])

  return <ResidenceHeader />
}
