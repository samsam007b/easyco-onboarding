/**
 * Format a number as currency (Euro by default)
 *
 * @example
 * formatCurrency(1250) // => "1 250 €"
 * formatCurrency(1250.50) // => "1 250,50 €"
 * formatCurrency(1250, 'USD') // => "$1,250.00"
 */
export function formatCurrency(
  amount: number,
  currency: string = 'EUR',
  locale: string = 'fr-FR'
): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).format(amount)
}

/**
 * Format a date in a human-readable format
 *
 * @example
 * formatDate(new Date()) // => "25 oct. 2024"
 * formatDate(new Date(), 'long') // => "25 octobre 2024"
 * formatDate(new Date(), 'full') // => "vendredi 25 octobre 2024"
 */
export function formatDate(
  date: Date | string,
  style: 'short' | 'medium' | 'long' | 'full' = 'medium',
  locale: string = 'fr-FR'
): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date

  const options: Intl.DateTimeFormatOptions = {
    short: { day: 'numeric', month: 'short', year: 'numeric' },
    medium: { day: 'numeric', month: 'long', year: 'numeric' },
    long: { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' },
    full: { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' },
  }[style]

  return new Intl.DateTimeFormat(locale, options).format(dateObj)
}

/**
 * Format a date in relative time (e.g., "il y a 2 jours")
 *
 * @example
 * formatRelativeTime(new Date(Date.now() - 86400000)) // => "il y a 1 jour"
 * formatRelativeTime(new Date(Date.now() + 3600000)) // => "dans 1 heure"
 */
export function formatRelativeTime(
  date: Date | string,
  locale: string = 'fr-FR'
): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  const now = new Date()
  const diff = dateObj.getTime() - now.getTime()

  const seconds = Math.floor(Math.abs(diff) / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)
  const months = Math.floor(days / 30)
  const years = Math.floor(days / 365)

  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' })

  if (years > 0) return rtf.format(diff > 0 ? years : -years, 'year')
  if (months > 0) return rtf.format(diff > 0 ? months : -months, 'month')
  if (days > 0) return rtf.format(diff > 0 ? days : -days, 'day')
  if (hours > 0) return rtf.format(diff > 0 ? hours : -hours, 'hour')
  if (minutes > 0) return rtf.format(diff > 0 ? minutes : -minutes, 'minute')
  return rtf.format(diff > 0 ? seconds : -seconds, 'second')
}

/**
 * Format a phone number (French format)
 *
 * @example
 * formatPhoneNumber('0612345678') // => "06 12 34 56 78"
 * formatPhoneNumber('+33612345678') // => "+33 6 12 34 56 78"
 */
export function formatPhoneNumber(phone: string): string {
  // Remove all non-digit characters except +
  const cleaned = phone.replace(/[^\d+]/g, '')

  // French mobile format (0612345678 or +33612345678)
  if (cleaned.startsWith('+33')) {
    return cleaned.replace(/(\+33)(\d)(\d{2})(\d{2})(\d{2})(\d{2})/, '$1 $2 $3 $4 $5 $6')
  }

  if (cleaned.length === 10) {
    return cleaned.replace(/(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/, '$1 $2 $3 $4 $5')
  }

  return phone // Return original if doesn't match expected format
}

/**
 * Format a file size in human-readable format
 *
 * @example
 * formatFileSize(1024) // => "1 KB"
 * formatFileSize(1536) // => "1.5 KB"
 * formatFileSize(1048576) // => "1 MB"
 */
export function formatFileSize(bytes: number, decimals: number = 1): string {
  if (bytes === 0) return '0 Bytes'

  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(decimals))} ${sizes[i]}`
}

/**
 * Truncate a string with ellipsis
 *
 * @example
 * truncate('Hello World', 8) // => "Hello..."
 * truncate('Hello', 10) // => "Hello"
 */
export function truncate(str: string, maxLength: number, suffix: string = '...'): string {
  if (str.length <= maxLength) return str
  return str.slice(0, maxLength - suffix.length) + suffix
}

/**
 * Capitalize first letter of a string
 *
 * @example
 * capitalize('hello world') // => "Hello world"
 */
export function capitalize(str: string): string {
  if (!str) return str
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}

/**
 * Format a number with thousands separator
 *
 * @example
 * formatNumber(1234567) // => "1 234 567"
 * formatNumber(1234.56, 2) // => "1 234,56"
 */
export function formatNumber(
  num: number,
  decimals?: number,
  locale: string = 'fr-FR'
): string {
  return new Intl.NumberFormat(locale, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(num)
}
