import "./globals.css"
import type { Metadata } from "next"
import { Toaster } from 'sonner'
import { ClientProviders } from '@/components/ClientProviders'
import dynamic from 'next/dynamic'

// Lazy load des composants non-critiques pour améliorer les performances
const Analytics = dynamic(() => import('@/components/Analytics'), {
  ssr: false, // Ne pas render côté serveur (client-only)
})

const CookieBanner = dynamic(() => import('@/components/CookieBanner'), {
  ssr: false,
})

const DevTools = dynamic(() => import('@/components/DevTools').then(mod => ({ default: mod.DevTools })), {
  ssr: false,
})

const WebVitalsReporter = dynamic(() => import('@/components/WebVitalsReporter').then(mod => ({ default: mod.WebVitalsReporter })), {
  ssr: false,
})

const PWAInstallPrompt = dynamic(() => import('@/components/PWAInstallPrompt').then(mod => ({ default: mod.PWAInstallPrompt })), {
  ssr: false,
})

// IMPORTANT: Ne pas mettre force-dynamic ici sauf si absolument nécessaire
// Cela désactive le cache Next.js et ralentit toutes les pages
// export const dynamic = 'force-dynamic' // ❌ SUPPRIMÉ pour meilleures performances

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

  // PWA Configuration
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'EasyCo',
  },
  formatDetection: {
    telephone: false,
  },

  // Verification (à ajouter quand disponibles)
  // verification: {
  //   google: 'your-google-verification-code',
  //   yandex: 'your-yandex-verification-code',
  // },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <head>
        {/* PWA Meta Tags */}
        <meta name="theme-color" content="#FFD249" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="EasyCo" />

        {/* Apple Touch Icons */}
        <link rel="apple-touch-icon" href="/icons/icon-152x152.png" />
        <link rel="apple-touch-icon" sizes="152x152" href="/icons/icon-152x152.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/icons/icon-192x192.png" />

        {/* Favicon */}
        <link rel="icon" type="image/svg+xml" href="/icons/icon.svg" />
        <link rel="icon" type="image/png" sizes="32x32" href="/icons/icon-192x192.png" />
      </head>
      <body className="min-h-screen">
        <Analytics />
        <WebVitalsReporter />
        <ClientProviders>
          {children}
          <Toaster position="top-right" />
          <CookieBanner />
          <PWAInstallPrompt />
          <DevTools />
        </ClientProviders>
      </body>
    </html>
  )
}
