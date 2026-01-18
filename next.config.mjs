// next.config.mjs
import { withSentryConfig } from '@sentry/nextjs'
import bundleAnalyzer from '@next/bundle-analyzer'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Bundle analyzer configuration
const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
})

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // ============================================================================
  // OPTIMISATIONS DE PERFORMANCE
  // ============================================================================

  // Compression automatique (Gzip/Brotli)
  compress: true,

  // Minification optimisée avec SWC
  swcMinify: true,

  // Optimisation des images
  images: {
    domains: [
      'fgthoyilfupywmpmiuwd.supabase.co', // Supabase Storage
      'lh3.googleusercontent.com', // Google OAuth avatars
      'images.unsplash.com', // Unsplash property images
    ],
    formats: ['image/avif', 'image/webp'], // Formats modernes
    deviceSizes: [640, 750, 828, 1080, 1200, 1920], // Breakpoints responsive
    imageSizes: [16, 32, 48, 64, 96, 128, 256], // Tailles d'icônes
    minimumCacheTTL: 31536000, // Cache 1 an
  },

  // Optimisation expérimentale des packages
  experimental: {
    optimizePackageImports: [
      'lucide-react',
      'sonner',
      'react-hook-form',
      'zod',
      '@radix-ui/react-dropdown-menu',
      '@radix-ui/react-dialog',
      '@radix-ui/react-avatar',
      '@radix-ui/react-alert-dialog',
      '@radix-ui/react-scroll-area',
      '@radix-ui/react-switch',
      '@radix-ui/react-progress',
      '@radix-ui/react-accordion',
      '@radix-ui/react-slider',
      'recharts',
      'date-fns',
    ],
  },

  // ============================================================================
  // HEADERS DE SÉCURITÉ ET CACHE
  // ============================================================================

  async headers() {
    // Déterminer si on est en production
    const isProduction = process.env.NODE_ENV === 'production'

    return [
      {
        // Headers de sécurité sur toutes les routes
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          // ⚠️ HSTS désactivé en développement (cause erreurs SSL localhost)
          // Activé uniquement en production pour forcer HTTPS
          ...(isProduction ? [{
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          }] : []),
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
          },
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              // Note: unsafe-inline/unsafe-eval needed for Next.js + Tailwind CSS
              // TODO: Move to nonce-based CSP when migrating to strict mode
              "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com https://maps.googleapis.com https://cdn.jsdelivr.net https://js.stripe.com",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "img-src 'self' data: https: blob:",
              "font-src 'self' data: https://fonts.gstatic.com",
              "connect-src 'self' blob: data: https://fgthoyilfupywmpmiuwd.supabase.co wss://fgthoyilfupywmpmiuwd.supabase.co https://www.google-analytics.com https://region1.google-analytics.com https://*.ingest.de.sentry.io https://*.ingest.sentry.io https://maps.googleapis.com https://cdn.jsdelivr.net https://unpkg.com https://tessdata.projectnaptha.com https://api.stripe.com https://*.stripe.com",
              "worker-src 'self' blob: data:",
              "frame-src 'self' https://js.stripe.com https://*.stripe.com",
              "frame-ancestors 'none'",
              "base-uri 'self'",
              "form-action 'self'",
              "object-src 'none'",
              // ⚠️ upgrade-insecure-requests désactivé en dev (force HTTPS sur localhost)
              // Activé uniquement en production
              ...(isProduction ? ["upgrade-insecure-requests"] : []),
            ].filter(Boolean).join('; '),
          },
          // Modern isolation headers (2026 best practice)
          {
            key: 'Cross-Origin-Opener-Policy',
            value: 'same-origin',
          },
          {
            key: 'Cross-Origin-Embedder-Policy',
            value: 'credentialless', // Less strict than require-corp, compatible with third-party
          },
          {
            key: 'Cross-Origin-Resource-Policy',
            value: 'same-site',
          },
          {
            key: 'X-Permitted-Cross-Domain-Policies',
            value: 'none',
          },
        ],
      },
      {
        // Cache agressif pour les assets statiques
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        // Cache pour les images
        source: '/:all*(svg|jpg|jpeg|png|gif|webp|ico)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ]
  },

  // ============================================================================
  // REDIRECTIONS ET REWRITES
  // ============================================================================

  async redirects() {
    return [
      // ============================================================================
      // REDIRECTIONS SEARCHER: /dashboard/searcher -> /searcher
      // ============================================================================
      {
        source: '/dashboard/searcher',
        destination: '/searcher',
        permanent: true,
      },
      {
        source: '/dashboard/searcher/my-applications',
        destination: '/searcher/applications',
        permanent: true,
      },
      {
        source: '/dashboard/searcher/calendar',
        destination: '/searcher/calendar',
        permanent: true,
      },
      {
        source: '/dashboard/searcher/favorites',
        destination: '/searcher/favorites',
        permanent: true,
      },
      {
        source: '/dashboard/searcher/groups',
        destination: '/searcher/groups',
        permanent: true,
      },
      {
        source: '/dashboard/searcher/groups/create',
        destination: '/searcher/groups/create',
        permanent: true,
      },
      {
        source: '/dashboard/searcher/my-visits',
        destination: '/searcher/visits',
        permanent: true,
      },
      {
        source: '/dashboard/searcher/saved-searches',
        destination: '/searcher/saved-searches',
        permanent: true,
      },
      {
        source: '/dashboard/searcher/alerts',
        destination: '/searcher/alerts',
        permanent: true,
      },
      {
        source: '/dashboard/searcher/notifications',
        destination: '/searcher/notifications',
        permanent: true,
      },
      // Redirect /properties/browse to new explore page
      {
        source: '/properties/browse',
        destination: '/searcher/explore',
        permanent: true,
      },
      // ============================================================================
      // REDIRECTIONS SEARCHER: Profile and Settings to global pages
      // ============================================================================
      {
        source: '/searcher/profile',
        destination: '/profile',
        permanent: false, // Not permanent - may create dedicated pages later
      },
      {
        source: '/searcher/settings',
        destination: '/settings',
        permanent: false,
      },
      // ============================================================================
      // REDIRECTIONS MESSAGES: Only for legacy paths without dedicated pages
      // ============================================================================
      // Note: /searcher/messages has its own page, no redirect needed
      {
        source: '/resident/messages',
        destination: '/hub/messages',
        permanent: true,
      },
    ]
  },

  // ============================================================================
  // CONFIGURATION WEBPACK
  // ============================================================================

  webpack: (config, { dev, isServer, webpack }) => {
    // Alias pour imports simplifiés
    config.resolve.alias['@'] = path.resolve(__dirname)

    // Fix for Google Maps API and browser-only libraries in SSR build
    if (isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      }

      // Add banner to inject 'self' polyfill at the top of server bundle
      config.plugins.push(
        new webpack.BannerPlugin({
          banner: 'if (typeof self === "undefined") { globalThis.self = globalThis; }',
          raw: true,
          entryOnly: false
        })
      )
    }

    // Optimisations de production
    if (!dev && !isServer) {
      // Tree shaking agressif (client-side uniquement)
      config.optimization = {
        ...config.optimization,
        usedExports: true,
        // Meilleure compression des modules
        moduleIds: 'deterministic',
      }
    }

    return config
  },

  // ============================================================================
  // AUTRES CONFIGURATIONS
  // ============================================================================

  // Production source maps (désactivé pour réduire la taille)
  productionBrowserSourceMaps: false,

  // Powered by header (désactivé pour sécurité)
  poweredByHeader: false,

  // Taille maximale des pages générées
  onDemandEntries: {
    maxInactiveAge: 25 * 1000,
    pagesBufferLength: 2,
  },
}

// Sentry configuration options
const sentryWebpackPluginOptions = {
  // Suppresses source map uploading logs during build
  silent: true,
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,
  // Upload source maps to Sentry
  widenClientFileUpload: true,
  // Hide source maps from generated client bundles
  hideSourceMaps: true,
  // Disable Sentry during development
  disableLogger: true,
}

// Export config wrapped with Bundle Analyzer and Sentry
export default withBundleAnalyzer(withSentryConfig(nextConfig, sentryWebpackPluginOptions))
