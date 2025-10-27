import "./globals.css"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "EasyCo — Test Minimal",
  description: "Test",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className="min-h-screen">
        {children}
      </body>
    </html>
  )
}
