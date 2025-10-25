import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Merge Tailwind CSS classes intelligently
 *
 * This utility combines clsx (for conditional classes) with tailwind-merge
 * (to properly handle Tailwind class conflicts)
 *
 * @example
 * cn('px-2 py-1', 'px-4') // => 'py-1 px-4' (px-4 overrides px-2)
 * cn('text-red-500', condition && 'text-blue-500') // conditional classes
 *
 * @param inputs - Class values to merge
 * @returns Merged class string
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
