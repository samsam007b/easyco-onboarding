import { Inter, Nunito } from 'next/font/google'
import localFont from 'next/font/local'

/**
 * ============================================
 * IZZICO TYPOGRAPHY SYSTEM
 * ============================================
 *
 * Inter    → Body text, UI elements, general content
 * Nunito   → Headings, section titles (weight: 600-800)
 * Fredoka  → Brand wordmark "Izzico" only (loaded locally for precise weight control)
 *
 * Source: brand-identity/izzico-brand-folder.html
 */

// Inter - Primary sans-serif for body text and UI
export const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
  weight: ['300', '400', '500', '600', '700'],
})

// Nunito - Headings and titles
export const nunito = Nunito({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-nunito',
  weight: ['400', '500', '600', '700', '800'],
})

// Fredoka - Brand wordmark only (using Google Fonts)
// Note: Fredoka has variable weight 300-700, we use 540-600 for the wordmark
import { Fredoka } from 'next/font/google'

export const fredoka = Fredoka({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-fredoka',
  weight: ['300', '400', '500', '600', '700'],
})
