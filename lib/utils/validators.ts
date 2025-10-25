/**
 * Validate French phone number
 *
 * @example
 * isValidPhoneNumber('0612345678') // => true
 * isValidPhoneNumber('+33612345678') // => true
 * isValidPhoneNumber('06 12 34 56 78') // => true
 * isValidPhoneNumber('123') // => false
 */
export function isValidPhoneNumber(phone: string): boolean {
  // Remove all non-digit characters except +
  const cleaned = phone.replace(/[^\d+]/g, '')

  // French mobile: 06/07 + 8 digits OR +336/+337 + 8 digits
  const frenchMobileRegex = /^(0[67]\d{8}|(\+33|0033)[67]\d{8})$/

  // French landline: 01/02/03/04/05/08/09 + 8 digits
  const frenchLandlineRegex = /^(0[1-589]\d{8}|(\+33|0033)[1-589]\d{8})$/

  return frenchMobileRegex.test(cleaned) || frenchLandlineRegex.test(cleaned)
}

/**
 * Validate French postal code (5 digits)
 *
 * @example
 * isValidPostalCode('75001') // => true
 * isValidPostalCode('1234') // => false
 */
export function isValidPostalCode(postalCode: string): boolean {
  return /^\d{5}$/.test(postalCode)
}

/**
 * Validate email address
 *
 * @example
 * isValidEmail('user@example.com') // => true
 * isValidEmail('invalid-email') // => false
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Validate URL
 *
 * @example
 * isValidUrl('https://example.com') // => true
 * isValidUrl('not-a-url') // => false
 */
export function isValidUrl(url: string): boolean {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

/**
 * Check if a string contains only letters (including accented characters)
 *
 * @example
 * isAlpha('Français') // => true
 * isAlpha('Test123') // => false
 */
export function isAlpha(str: string): boolean {
  return /^[a-zA-ZÀ-ÿ\s'-]+$/.test(str)
}

/**
 * Check if a string is alphanumeric
 *
 * @example
 * isAlphanumeric('Test123') // => true
 * isAlphanumeric('Test@123') // => false
 */
export function isAlphanumeric(str: string): boolean {
  return /^[a-zA-Z0-9À-ÿ\s]+$/.test(str)
}

/**
 * Validate password strength
 * Returns an object with validation results and a strength score (0-5)
 *
 * @example
 * validatePasswordStrength('weak') // => { isValid: false, score: 1, ... }
 * validatePasswordStrength('Strong123!') // => { isValid: true, score: 5, ... }
 */
export function validatePasswordStrength(password: string) {
  const checks = {
    minLength: password.length >= 8,
    hasUpperCase: /[A-Z]/.test(password),
    hasLowerCase: /[a-z]/.test(password),
    hasNumber: /[0-9]/.test(password),
    hasSpecialChar: /[^A-Za-z0-9]/.test(password),
  }

  const score = Object.values(checks).filter(Boolean).length

  return {
    isValid: checks.minLength && checks.hasUpperCase && checks.hasLowerCase && checks.hasNumber,
    score,
    strength: score <= 2 ? 'weak' : score <= 3 ? 'medium' : 'strong',
    checks,
  }
}

/**
 * Validate French SIRET number (14 digits)
 *
 * @example
 * isValidSiret('12345678901234') // => true
 * isValidSiret('123') // => false
 */
export function isValidSiret(siret: string): boolean {
  const cleaned = siret.replace(/\s/g, '')
  return /^\d{14}$/.test(cleaned)
}

/**
 * Validate IBAN (International Bank Account Number)
 *
 * @example
 * isValidIban('FR7612345678901234567890123') // => true
 * isValidIban('INVALID') // => false
 */
export function isValidIban(iban: string): boolean {
  const cleaned = iban.replace(/\s/g, '').toUpperCase()
  // Basic format check: 2 letters + 2 digits + up to 30 alphanumeric
  return /^[A-Z]{2}\d{2}[A-Z0-9]{1,30}$/.test(cleaned)
}

/**
 * Check if value is within range (inclusive)
 *
 * @example
 * isInRange(5, 1, 10) // => true
 * isInRange(15, 1, 10) // => false
 */
export function isInRange(value: number, min: number, max: number): boolean {
  return value >= min && value <= max
}

/**
 * Check if a date is in the past
 *
 * @example
 * isPastDate(new Date('2020-01-01')) // => true
 * isPastDate(new Date('2030-01-01')) // => false
 */
export function isPastDate(date: Date | string): boolean {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  return dateObj < new Date()
}

/**
 * Check if a date is in the future
 *
 * @example
 * isFutureDate(new Date('2030-01-01')) // => true
 * isFutureDate(new Date('2020-01-01')) // => false
 */
export function isFutureDate(date: Date | string): boolean {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  return dateObj > new Date()
}

/**
 * Check if user is of legal age (18+ by default)
 *
 * @example
 * isLegalAge(new Date('2000-01-01')) // => true
 * isLegalAge(new Date('2010-01-01')) // => false
 */
export function isLegalAge(birthDate: Date | string, minAge: number = 18): boolean {
  const birth = typeof birthDate === 'string' ? new Date(birthDate) : birthDate
  const today = new Date()
  const age = today.getFullYear() - birth.getFullYear()
  const monthDiff = today.getMonth() - birth.getMonth()

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    return age - 1 >= minAge
  }

  return age >= minAge
}
