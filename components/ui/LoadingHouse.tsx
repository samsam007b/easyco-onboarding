'use client'

import { useEffect, useState } from 'react'

interface LoadingHouseProps {
  size?: number
  strokeWidth?: number
  className?: string
}

export default function LoadingHouse({
  size = 60,
  strokeWidth = 3,
  className = ''
}: LoadingHouseProps) {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return <div className={`mx-auto ${className}`} style={{ width: size, height: size }} />
  }

  return (
    <div className={`mx-auto ${className}`} style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Gradient EasyCo signature */}
          <linearGradient id="easycoGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style={{ stopColor: '#7B5FB8', stopOpacity: 1 }} />
            <stop offset="25%" style={{ stopColor: '#B576A8', stopOpacity: 1 }} />
            <stop offset="50%" style={{ stopColor: '#E87461', stopOpacity: 1 }} />
            <stop offset="75%" style={{ stopColor: '#FF9B5A', stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: '#FFC456', stopOpacity: 1 }} />
          </linearGradient>
        </defs>

        {/* Ligne continue qui forme la maison avec porte */}
        <path
          d="M 20,50 L 50,20 L 80,50 L 80,85 L 65,85 L 65,65 L 35,65 L 35,85 L 20,85 Z"
          stroke="url(#easycoGradient)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          style={{
            strokeDasharray: '280',
            strokeDashoffset: '280',
            animation: 'drawHouse 2s ease-in-out infinite'
          }}
        />

        <style jsx>{`
          @keyframes drawHouse {
            0% {
              stroke-dashoffset: 280;
            }
            50% {
              stroke-dashoffset: 0;
            }
            100% {
              stroke-dashoffset: -280;
            }
          }
        `}</style>
      </svg>
    </div>
  )
}
