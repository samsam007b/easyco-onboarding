'use client'

import { useEffect } from 'react'
import { useRole } from '@/lib/role/role-context'
import OwnerCommandCenter from '@/components/dashboard/OwnerCommandCenter'

export default function OwnerDashboardPage() {
  const { setActiveRole } = useRole()

  useEffect(() => {
    // Set active role when dashboard loads
    setActiveRole('owner')
  }, [setActiveRole])

  return <OwnerCommandCenter />
}
