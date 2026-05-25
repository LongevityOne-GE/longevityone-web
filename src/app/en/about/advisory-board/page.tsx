import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import {
  sanityClient,
  ADVISORY_BOARD_PAGE_QUERY,
  ADVISORY_BOARD_MEMBERS_QUERY,
} from '@/lib/sanity'
import type { AdvisoryBoardPage, AdvisoryBoardMember, BoardRole } from '@/lib/sanity/types'
import { AdvisoryHero } from '@/components/sections/advisory/AdvisoryHero'
import { AdvisoryGrid } from '@/components/sections/advisory/AdvisoryGrid'
import { AdvisoryJsonLd } from '@/components/sections/advisory/AdvisoryJsonLd'

export const revalidate = 3600

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.longevityone.ge'

const ROLE_RANK: Record<BoardRole, number> = { chair: 0, 'vice-chair': 1, member: 2 }

function sortMembers(members: AdvisoryBoardMember[]): AdvisoryBoardMember[] {
  return [...members].sort((a, b) => {
    const rankA = ROLE_RANK[a.boardRole] ?? 9
    const rankB = ROLE_RANK[b.boardRole] ?? 9
    if (rankA !== rankB) return rankA - rankB
    const orderA = a.order ?? 999
    const orderB = b.order ?? 999
    if (orderA !== orderB) return orderA - orderB
    return a.name_en.localeCompare(b.name_en)
  })
}

export async function generateMetadata(): Promise<Metadata> {
  const page = await sanityClient.fetch<AdvisoryBoardPage | null>(
    ADVISORY_BOARD_PAGE_QUERY,
    {},
    { next: { tags: ['advisoryBoardPage'] } },
  )

  const title = page?.seoTitle_en || page?.heading_en || 'Scientific Advisory Board'
  const description = page?.seoDescription_en || undefined

  return {
    title,
    description,
    alternates: {
      canonical: `${SITE_URL}/en/about/advisory-board`,
      languages: {
        ka: `${SITE_URL}/about/advisory-board`,
        en: `${SITE_URL}/en/about/advisory-board`,
      },
    },
    openGraph: {
      title: title ?? undefined,
      description,
      locale: 'en_GB',
      type: 'website',
      url: `${SITE_URL}/en/about/advisory-board`,
    },
  }
}

export default async function EnAdvisoryBoardPage() {
  const [page, rawMembers] = await Promise.all([
    sanityClient.fetch<AdvisoryBoardPage | null>(
      ADVISORY_BOARD_PAGE_QUERY,
      {},
      { next: { tags: ['advisoryBoardPage'] } },
    ),
    sanityClient.fetch<AdvisoryBoardMember[]>(
      ADVISORY_BOARD_MEMBERS_QUERY,
      {},
      { next: { tags: ['advisoryBoardMember'] } },
    ),
  ])

  if (!page) notFound()

  const members = sortMembers(rawMembers ?? [])

  const georgianHeading = page.sectionGeorgianHeading_en
  const internationalHeading = page.sectionInternationalHeading_en
  const useGroups = Boolean(georgianHeading && internationalHeading)

  const georgianMembers = useGroups ? members.filter((m) => !m.isInternational) : []
  const internationalMembers = useGroups ? members.filter((m) => m.isInternational) : []

  return (
    <main id="main-content" className="flex flex-col bg-bone-white">
      <AdvisoryJsonLd
        locale="en"
        page={page}
        members={members}
        baseUrl={SITE_URL}
      />

      <AdvisoryHero locale="en" page={page} />

      <div className="section-container py-16 md:py-24">
        {members.length === 0 ? null : useGroups ? (
          <>
            {georgianMembers.length > 0 && (
              <AdvisoryGrid
                locale="en"
                members={georgianMembers}
                heading={georgianHeading}
              />
            )}
            {internationalMembers.length > 0 && (
              <AdvisoryGrid
                locale="en"
                members={internationalMembers}
                heading={internationalHeading}
              />
            )}
          </>
        ) : (
          <AdvisoryGrid locale="en" members={members} heading={null} />
        )}
      </div>
    </main>
  )
}
