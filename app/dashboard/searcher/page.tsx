'use client'

import { useEffect } from 'react'
import { useRole } from '@/lib/role/role-context'
import ModernSearcherDashboard from '@/components/dashboard/ModernSearcherDashboard'

export default function SearcherDashboardPage() {
  const { setActiveRole } = useRole()
  useEffect(() => { setActiveRole('searcher') }, [setActiveRole])
  return <ModernSearcherDashboard />
}
