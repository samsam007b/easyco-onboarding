import "./globals.css"
import type { Metadata } from "next"
import { Toaster } from 'sonner'
import { DevTools } from '@/components/DevTools'
import { ClientProviders } from '@/components/ClientProviders'
import CookieBanner from '@/components/CookieBanner'
import Analytics from '@/components/Analytics'

export const metadata: Metadata = {
  title: "EasyCo — Colocation fiable et compatible en Belgique",
  description: "Trouve ta coloc idéale à Bruxelles, Liège, Gand. Vérification d'identité, matching intelligent, groupes pré-formés. Évite les arnaques.",
  keywords: ['colocation Bruxelles', 'coliving Belgique', 'coloc Liège', 'coloc Gand', 'appartement partagé', 'kot étudiant', 'roommate Brussels', 'shared apartment Belgium'],

  // Open Graph (Facebook, LinkedIn, WhatsApp)
  openGraph: {
    title: 'EasyCo — Trouve ta coloc fiable et compatible',
    description: 'Évite les arnaques. Matching intelligent basé sur ton lifestyle. Rejoins des groupes pré-formés.',
    url: 'https://easyco.be',
    siteName: 'EasyCo',
    images: [{
      url: 'https://easyco.be/og-image.jpg',
      width: 1200,
      height: 630,
      alt: 'EasyCo - Plateforme de colocation fiable en Belgique',
    }],
    locale: 'fr_BE',
    type: 'website',
    alternateLocale: ['en_US', 'nl_BE', 'de_DE'],
  },

  // Twitter Cards
  twitter: {
    card: 'summary_large_image',
    title: 'EasyCo — Colocation fiable en Belgique',
    description: 'Vérification ID, matching intelligent, zéro arnaque. Trouve ta coloc compatible en 3 étapes.',
    images: ['https://easyco.be/twitter-card.jpg'],
    creator: '@EasyCoBE',
  },

  // Additional SEO
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },

  // Canonical URL
  alternates: {
    canonical: 'https://easyco.be',
    languages: {
      'fr-BE': 'https://easyco.be',
      'en': 'https://easyco.be/en',
      'nl-BE': 'https://easyco.be/nl',
      'de': 'https://easyco.be/de',
    },
  },

  // App metadata
  applicationName: 'EasyCo',
  authors: [{ name: 'EasyCo Team' }],
  generator: 'Next.js',
  category: 'Real Estate',

  // Verification (à ajouter quand disponibles)
  // verification: {
  //   google: 'your-google-verification-code',
  //   yandex: 'your-yandex-verification-code',
  // },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className="min-h-screen">
        <Analytics />
        <ClientProviders>
          {children}
        </ClientProviders>
        <Toaster position="top-right" />
        <CookieBanner />
        <DevTools />
      </body>
    </html>
  )
}
