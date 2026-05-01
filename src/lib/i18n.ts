import { type Locale } from './utils'

export interface BilingualString {
  _ka: string
  _en: string
}

export interface BilingualBlock {
  _ka: unknown[]
  _en: unknown[]
}

export function pick(field: BilingualString | undefined, locale: Locale): string {
  if (!field) return ''
  const primary = locale === 'ka' ? field._ka : field._en
  const fallback = locale === 'ka' ? field._en : field._ka
  return primary?.trim() || fallback?.trim() || ''
}

export function pickBlock(field: BilingualBlock | undefined, locale: Locale): unknown[] {
  if (!field) return []
  const primary = locale === 'ka' ? field._ka : field._en
  const fallback = locale === 'ka' ? field._en : field._ka
  return primary?.length ? primary : fallback ?? []
}
