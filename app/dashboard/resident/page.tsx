'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function ResidentDashboardPage() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to /hub instead
    router.replace('/hub')
  }, [router])

  return null
}
