import "./globals.css"
import type { Metadata } from "next"
import { Toaster } from 'sonner'
import { DevTools } from '@/components/DevTools'
import { ClientProviders } from '@/components/ClientProviders'

export const metadata: Metadata = {
  title: "EasyCo — Colocation fiable et compatible en Belgique",
  description: "Trouve ta coloc idéale à Bruxelles, Liège, Gand. Vérification d'identité, matching intelligent, groupes pré-formés. Évite les arnaques.",
  keywords: ['colocation Bruxelles', 'coliving Belgique', 'coloc Liège', 'coloc Gand', 'appartement partagé', 'kot étudiant'],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className="min-h-screen">
        <ClientProviders>
          {children}
        </ClientProviders>
        <Toaster position="top-right" />
        <DevTools />
      </body>
    </html>
  )
}
