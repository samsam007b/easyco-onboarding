import "./globals.css"
import type { Metadata } from "next"
import { Toaster } from 'sonner'
import { inter, nunito, fredoka } from './fonts'
import { ClientProviders } from '@/components/ClientProviders'
import dynamic from 'next/dynamic'
import SkipLink from '@/components/accessibility/SkipLink'
import { OrganizationStructuredData, WebsiteStructuredData } from '@/components/seo/StructuredData'
import { ErrorBoundary } from '@/components/ErrorBoundary'

// Lazy load des composants non-critiques pour améliorer les performances
const Analytics = dynamic(() => import('@/components/Analytics'), {
  ssr: false, // Ne pas render côté serveur (client-only)
})

const CookieConsentBanner = dynamic(() => import('@/components/CookieConsentBanner'), {
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

const ApiErrorTrackingProvider = dynamic(() => import('@/components/providers/api-error-tracking-provider').then(mod => ({ default: mod.ApiErrorTrackingProvider })), {
  ssr: false,
})

const AssistantButton = dynamic(() => import('@/components/assistant/AssistantButton'), {
  ssr: false,
})

const AssistantActionProvider = dynamic(
  () => import('@/lib/assistant').then(mod => ({ default: mod.AssistantActionProvider })),
  { ssr: false }
)

// IMPORTANT: Ne pas mettre force-dynamic ici sauf si absolument nécessaire
// Cela désactive le cache Next.js et ralentit toutes les pages
// export const dynamic = 'force-dynamic' // ❌ SUPPRIMÉ pour meilleures performances

export const metadata: Metadata = {
  title: "Izzico — Colocation fiable et compatible en Belgique",
  description: "Trouve ta coloc idéale à Bruxelles, Liège, Gand. Vérification d'identité, matching intelligent, groupes pré-formés. Évite les arnaques.",
  keywords: ['colocation Bruxelles', 'coliving Belgique', 'coloc Liège', 'coloc Gand', 'appartement partagé', 'kot étudiant', 'roommate Brussels', 'shared apartment Belgium'],

  // Open Graph (Facebook, LinkedIn, WhatsApp)
  openGraph: {
    title: 'Izzico — Trouve ta coloc fiable et compatible',
    description: 'Évite les arnaques. Matching intelligent basé sur ton lifestyle. Rejoins des groupes pré-formés.',
    url: 'https://izzico.be',
    siteName: 'Izzico',
    images: [{
      url: 'https://izzico.be/og-image.jpg',
      width: 1200,
      height: 630,
      alt: 'Izzico - Plateforme de colocation fiable en Belgique',
    }],
    locale: 'fr_BE',
    type: 'website',
    alternateLocale: ['en_US', 'nl_BE', 'de_DE'],
  },

  // Twitter Cards
  twitter: {
    card: 'summary_large_image',
    title: 'Izzico — Colocation fiable en Belgique',
    description: 'Vérification ID, matching intelligent, zéro arnaque. Trouve ta coloc compatible en 3 étapes.',
    images: ['https://izzico.be/twitter-card.jpg'],
    creator: '@IzzicoBE',
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
    canonical: 'https://izzico.be',
    languages: {
      'fr-BE': 'https://izzico.be',
      'en': 'https://izzico.be/en',
      'nl-BE': 'https://izzico.be/nl',
      'de': 'https://izzico.be/de',
    },
  },

  // App metadata
  applicationName: 'Izzico',
  authors: [{ name: 'Izzico Team' }],
  generator: 'Next.js',
  category: 'Real Estate',

  // PWA Configuration
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Izzico',
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
        <meta name="theme-color" content="#FFFFFF" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Izzico" />

        {/* Apple Touch Icons */}
        <link rel="apple-touch-icon" href="/icons/icon-152x152.png" />
        <link rel="apple-touch-icon" sizes="152x152" href="/icons/icon-152x152.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/icons/icon-192x192.png" />

        {/* Favicon */}
        <link rel="icon" type="image/svg+xml" href="/icons/icon.svg" />
        <link rel="icon" type="image/png" sizes="32x32" href="/icons/icon-192x192.png" />

        {/* Structured Data (JSON-LD) for SEO */}
        <OrganizationStructuredData />
        <WebsiteStructuredData />
      </head>
      <body className={`${inter.variable} ${nunito.variable} ${fredoka.variable} min-h-screen font-sans`}>
        <SkipLink />
        <Analytics />
        <WebVitalsReporter />
        <ApiErrorTrackingProvider>
          <ClientProviders>
            <ErrorBoundary>
              {children}
            </ErrorBoundary>
            <Toaster position="top-right" />
            <CookieConsentBanner />
            <PWAInstallPrompt />
            <AssistantActionProvider>
              <AssistantButton />
            </AssistantActionProvider>
            <DevTools />
          </ClientProviders>
        </ApiErrorTrackingProvider>
      </body>
    </html>
  )
}
