// next.config.mjs
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // Configuration Webpack pour les alias
  webpack: (config) => {
    // permet d’utiliser '@/...' pour référencer la racine du projet
    config.resolve.alias['@'] = path.resolve(__dirname)
    return config
  },
}

export default nextConfig
