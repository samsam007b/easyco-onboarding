import "./globals.css"
import type { Metadata } from "next"
import { Toaster } from 'sonner'
import { DevTools } from '@/components/DevTools'

export const metadata: Metadata = {
  title: "EasyCo — Onboarding Test",
  description: "Functional user testing app"
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen">
        {children}
        <Toaster position="top-right" />
        <DevTools />
      </body>
    </html>
  )
}