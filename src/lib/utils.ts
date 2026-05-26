import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}

export type Locale = 'ka' | 'en'
export type Lang = Locale

export function isLocale(value: string): value is Locale {
  return value === 'ka' || value === 'en'
}

export function formatGEL(amount: number, locale: Locale = 'ka'): string {
  return new Intl.NumberFormat(locale === 'ka' ? 'ka-GE' : 'en-US', {
    style: 'currency',
    currency: 'GEL',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

/**
 * Picks the locale-appropriate display name for a technology. Falls back to
 * the language-neutral `name` field if the locale variant is missing.
 */
export function localizedTechName(
  tech: {
    name?: string | null
    name_ka?: string | null
    name_en?: string | null
  },
  locale: Locale,
): string {
  const localized = locale === 'ka' ? tech.name_ka : tech.name_en
  return localized ?? tech.name ?? ''
}
