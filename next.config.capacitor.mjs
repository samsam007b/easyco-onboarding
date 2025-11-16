// next.config.capacitor.mjs - Configuration pour build Capacitor
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // IMPORTANT: Export statique pour Capacitor
  output: 'export',

  // Désactiver les optimisations d'images pour l'export statique
  images: {
    unoptimized: true,
  },

  // Pas de trailing slash
  trailingSlash: false,

  // Compression
  compress: true,

  // Minification optimisée avec SWC
  swcMinify: true,

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

  // Configuration webpack
  webpack: (config, { isServer }) => {
    // Alias pour imports simplifiés
    config.resolve.alias['@'] = path.resolve(__dirname)

    // Fix for browser-only libraries in SSR build
    if (isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      }
    }

    return config
  },

  // Powered by header désactivé
  poweredByHeader: false,
}

export default nextConfig
