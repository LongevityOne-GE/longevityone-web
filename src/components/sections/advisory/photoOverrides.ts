import type { AdvisoryBoardMember } from '@/lib/sanity/types'
import type { Locale } from '@/lib/utils'

interface PhotoOverrideRule {
  slug?: string
  name_en?: string
  assetSubstring?: string
  src: string
}

const PHOTO_OVERRIDE_RULES: PhotoOverrideRule[] = [
  {
    slug: 'nino-nadiradze',
    name_en: 'Nino Nadiradze',
    assetSubstring: '8d9bbbbc6d1585647cd37bd292df997a81b52324',
    src: '/images/about/ნინო ნადირაძე copy.JPG',
  },
]

function normalize(input?: string | null): string | undefined {
  if (!input) return undefined
  return input.trim().toLowerCase()
}

export function getAdvisoryPhotoOverride(member: AdvisoryBoardMember): string | undefined {
  const slug = normalize(member.slug)
  const nameEn = normalize(member.name_en)
  const assetUrl = member.photo?.asset?.url

  const rule = PHOTO_OVERRIDE_RULES.find((entry) => {
    if (entry.slug && slug === normalize(entry.slug)) return true
    if (entry.name_en && nameEn === normalize(entry.name_en)) return true
    if (entry.assetSubstring && assetUrl?.includes(entry.assetSubstring)) return true
    return false
  })

  return rule?.src
}

export function overrideAdvisoryTitle(locale: Locale, title?: string | null): string | undefined {
  if (!title) return title ?? undefined

  if (locale === 'ka') {
    return title.replace('საკონსულტაციო საბჭოს თავმჯდომარე', 'საკონსულტაციო საბჭოს წევრი')
  }

  if (locale === 'en') {
    return title.replace('Chair of the Scientific Advisory Board', 'Member of the Scientific Advisory Board')
  }

  return title
}
