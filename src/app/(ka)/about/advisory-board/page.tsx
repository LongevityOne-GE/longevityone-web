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
import { buildMetadata, SITE_URL } from '@/lib/seo/metadata'

export const revalidate = 3600

/** Sort order: chair (0) → vice-chair (1) → member (2), then by order, then alphabetical. */
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

  return buildMetadata({
    locale: 'ka',
    path: '/about/advisory-board',
    title: page?.seoTitle_ka || page?.heading_ka || 'სამეცნიერო საკონსულტაციო საბჭო',
    description: page?.seoDescription_ka,
  })
}

export default async function KaAdvisoryBoardPage() {
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

  // Determine section grouping:
  // Use two separate groups only if BOTH section heading fields are present.
  const georgianHeading = page.sectionGeorgianHeading_ka
  const internationalHeading = page.sectionInternationalHeading_ka
  const useGroups = Boolean(georgianHeading && internationalHeading)

  const georgianMembers = useGroups ? members.filter((m) => !m.isInternational) : []
  const internationalMembers = useGroups ? members.filter((m) => m.isInternational) : []

  return (
    <main id="main-content" className="flex flex-col bg-bone-white">
      <AdvisoryJsonLd
        locale="ka"
        page={page}
        members={members}
        baseUrl={SITE_URL}
      />

      <AdvisoryHero locale="ka" page={page} />

      <div className="section-container py-16 md:py-24">
        {members.length === 0 ? null : useGroups ? (
          <>
            {internationalMembers.length > 0 && (
              <AdvisoryGrid
                locale="ka"
                members={internationalMembers}
                heading={internationalHeading}
              />
            )}
            {georgianMembers.length > 0 && (
              <AdvisoryGrid
                locale="ka"
                members={georgianMembers}
                heading={georgianHeading}
              />
            )}
          </>
        ) : (
          <AdvisoryGrid locale="ka" members={members} heading={null} />
        )}
      </div>
    </main>
  )
}
