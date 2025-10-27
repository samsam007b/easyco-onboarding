// next.config.mjs
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

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
    ],
  },

  // ============================================================================
  // HEADERS DE SÉCURITÉ ET CACHE
  // ============================================================================

  async headers() {
    return [
      {
        // Headers de sécurité sur toutes les routes
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
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
              "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: https: blob:",
              "font-src 'self' data:",
              "connect-src 'self' https://fgthoyilfupywmpmiuwd.supabase.co https://www.google-analytics.com",
              "frame-ancestors 'none'",
              "base-uri 'self'",
              "form-action 'self'",
            ].join('; '),
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
      // Rediriger les anciennes URLs si nécessaire
      // {
      //   source: '/old-path',
      //   destination: '/new-path',
      //   permanent: true,
      // },
    ]
  },

  // ============================================================================
  // CONFIGURATION WEBPACK
  // ============================================================================

  webpack: (config, { dev, isServer }) => {
    // Alias pour imports simplifiés
    config.resolve.alias['@'] = path.resolve(__dirname)

    // Optimisations de production
    if (!dev) {
      // Tree shaking agressif
      config.optimization = {
        ...config.optimization,
        usedExports: true,
        sideEffects: false,
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

export default nextConfig
