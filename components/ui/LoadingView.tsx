'use client'

import LoadingHouse from './LoadingHouse'

interface LoadingViewProps {
  message?: string
  size?: 'sm' | 'md' | 'lg'
  fullScreen?: boolean
}

export default function LoadingView({
  message = 'Chargement...',
  size = 'lg',
  fullScreen = false
}: LoadingViewProps) {
  const sizes = {
    sm: 40,
    md: 60,
    lg: 80
  }

  const containerClass = fullScreen
    ? 'min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50/30 via-white to-transparent'
    : 'flex flex-col items-center justify-center p-8'

  return (
    <div className={containerClass}>
      <div className="text-center">
        <LoadingHouse size={sizes[size]} className="mx-auto mb-6" />
        {message && (
          <p className="text-lg text-gray-600 animate-pulse">{message}</p>
        )}
      </div>
    </div>
  )
}
