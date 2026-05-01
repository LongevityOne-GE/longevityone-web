import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}

export type Locale = 'ka' | 'en'

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
