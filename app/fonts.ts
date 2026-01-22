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
// PERF: Reduced from 5 weights to 3 (saves ~40KB of font requests)
export const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
  weight: ['400', '500', '600'], // Removed 300 (rarely used) and 700 (use 600 instead)
})

// Nunito - Headings and titles
// PERF: Reduced from 5 weights to 2 (headings only need bold weights)
export const nunito = Nunito({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-nunito',
  weight: ['600', '700'], // Removed 400, 500, 800 (unused in headings)
})

// Fredoka - Brand wordmark only (using Google Fonts)
// Note: Fredoka has variable weight 300-700, we use 540-600 for the wordmark
// PERF: Reduced to single weight needed for brand
import { Fredoka } from 'next/font/google'

export const fredoka = Fredoka({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-fredoka',
  weight: ['600'], // Only weight used for "Izzico" wordmark
})
